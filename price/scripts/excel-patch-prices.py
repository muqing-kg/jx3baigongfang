#!/usr/bin/env python3
"""把最新物价写进 Excel 工作簿的「物价」表（保留图表、宏、格式）。

WPS / LibreOffice 不支持 Power Query，也没有 Excel 的「全部刷新」；
这里直接改写工作簿里「物价」表的数值（D:AL 行情/突破价 + 数据时间），
其它工作表、图表、条件格式、VBA 原样保留，并打开「打开时强制重算」，
WPS / Excel 下次打开就会按新价格重算所有公式。

用法：
    python3 scripts/excel-patch-prices.py --workbook 剑网3技艺收益与突破.xlsx \
        --csv prices.csv [--in-place] [--out 输出.xlsx]

    # 也可以直接给 URL
    python3 scripts/excel-patch-prices.py --workbook 剑网3技艺收益与突破.xlsx \
        --csv https://cherishxie.github.io/JX3-AH-Calculator/prices.csv
"""

from __future__ import annotations

import argparse
import csv
import html
import io
import re
import shutil
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

SHEET_NAME = "物价"
TIME_HEADER = "数据时间"
TEXT_HEADERS = {"物品键", "物品名称", "类别"}

CELL_RE = re.compile(r'<c\b([^>]*?)(?:/>|>(.*?)</c>)', re.S)
ROW_RE = re.compile(r'(<row\b[^>]*>)(.*?)</row>', re.S)


def col_to_index(col: str) -> int:
    n = 0
    for ch in col:
        n = n * 26 + (ord(ch) - 64)
    return n


def index_to_col(n: int) -> str:
    out = ""
    while n:
        n, rem = divmod(n - 1, 26)
        out = chr(65 + rem) + out
    return out


def read_csv(source: str) -> tuple[list[str], list[dict[str, str]]]:
    if re.match(r"^https?://", source):
        with urllib.request.urlopen(source, timeout=60) as resp:
            raw = resp.read()
    else:
        raw = Path(source).read_bytes()
    reader = csv.DictReader(io.StringIO(raw.decode("utf-8-sig")))
    headers = [h.strip() for h in (reader.fieldnames or [])]
    rows = [
        {k.strip(): (v or "").strip() for k, v in row.items() if k}
        for row in reader
    ]
    return headers, rows


def sheet_path(zf: zipfile.ZipFile, name: str) -> str:
    workbook = zf.read("xl/workbook.xml").decode("utf-8")
    rels = zf.read("xl/_rels/workbook.xml.rels").decode("utf-8")
    rid_target: dict[str, str] = {}
    for m in re.finditer(r"<Relationship\b[^>]*>", rels):
        tag = m.group(0)
        rid = re.search(r'Id="([^"]+)"', tag)
        target = re.search(r'Target="([^"]+)"', tag)
        if rid and target:
            rid_target[rid.group(1)] = target.group(1)
    for m in re.finditer(r"<sheet\b[^>]*>", workbook):
        tag = m.group(0)
        if f'name="{name}"' not in tag:
            continue
        rid = re.search(r'r:id="([^"]+)"', tag)
        if not rid:
            break
        target = rid_target.get(rid.group(1), "").lstrip("/")
        if not target.startswith("xl/"):
            target = "xl/" + target
        return target
    raise SystemExit(f"找不到工作表：{name}")


def shared_strings(zf: zipfile.ZipFile) -> list[str]:
    try:
        xml = zf.read("xl/sharedStrings.xml").decode("utf-8")
    except KeyError:
        return []
    return [re.sub(r"<[^>]+>", "", si) for si in re.findall(r"<si>(.*?)</si>", xml, re.S)]


def cell_attr(attrs: str, key: str) -> str | None:
    m = re.search(rf'\b{key}="([^"]*)"', attrs)
    return m.group(1) if m else None


def cell_ref_col(cell_xml: str) -> int:
    m = re.search(r'<c\b[^>]*\br="([A-Z]+)\d+"', cell_xml)
    return col_to_index(m.group(1)) if m else 0


def cell_text(cell_xml: str, sst: list[str]) -> str | None:
    """取单元格文本：兼容共享字符串（openpyxl）与内联字符串（LibreOffice / WPS）。"""
    if 't="inlineStr"' in cell_xml:
        m = re.search(r"<is>(.*?)</is>", cell_xml, re.S)
        return html.unescape(re.sub(r"<[^>]+>", "", m.group(1))) if m else None
    if 't="s"' in cell_xml:
        m = re.search(r"<v>(\d+)</v>", cell_xml)
        try:
            return sst[int(m.group(1))] if m else None
        except (IndexError, ValueError):
            return None
    m = re.search(r"<v>(.*?)</v>", cell_xml, re.S)
    return html.unescape(m.group(1)) if m else None


def cell_style(cell_xml: str) -> str | None:
    m = re.search(r'<c\b[^>]*\bs="([^"]*)"', cell_xml)
    return m.group(1) if m else None


def build_cell(col: int, rnum: int, style: str | None, inner: str, type_attr: str = "") -> str:
    s = f' s="{style}"' if style is not None else ""
    return f'<c r="{index_to_col(col)}{rnum}"{s}{type_attr}>{inner}</c>'


def main() -> int:
    ap = argparse.ArgumentParser(description="把最新物价写入工作簿「物价」表")
    ap.add_argument("--workbook", required=True)
    ap.add_argument("--csv", required=True, help="prices.csv 路径或 URL")
    ap.add_argument("--in-place", action="store_true", help="直接改原文件（自动备份 .bak）")
    ap.add_argument("--out", help="输出路径（默认在原文件名后加 -最新）")
    args = ap.parse_args()

    wb_path = Path(args.workbook).expanduser()
    if not wb_path.exists():
        raise SystemExit(f"找不到工作簿：{wb_path}")

    headers, rows = read_csv(args.csv)
    for need in ("物品键", TIME_HEADER):
        if need not in headers:
            raise SystemExit(f"CSV 缺少必要列：{need}")

    header_col = {h: i for i, h in enumerate(headers, start=1)}
    records = {r["物品键"]: r for r in rows if r.get("物品键")}
    if not records:
        raise SystemExit("CSV 没有数据行")
    data_time = next((r.get(TIME_HEADER, "") for r in rows if r.get(TIME_HEADER)), "")

    zf = zipfile.ZipFile(wb_path)
    target = sheet_path(zf, SHEET_NAME)
    xml = zf.read(target).decode("utf-8")
    sst = shared_strings(zf)

    # 每列标准样式：取前面数据行里出现过的样式，供原本为空的单元格使用
    col_style: dict[int, str] = {}
    start = xml.index("<sheetData>")
    for m in ROW_RE.finditer(xml[start:]):
        rnum = int(cell_attr(m.group(1), "r") or 0)
        if rnum < 2:
            continue
        for cm in CELL_RE.finditer(m.group(2)):
            ref = cell_attr(cm.group(1), "r")
            style = cell_attr(cm.group(1), "s")
            if ref and style is not None:
                col_style.setdefault(col_to_index(re.match(r"[A-Z]+", ref).group(0)), style)
        if rnum > 60:
            break

    stats = {"rows": 0, "cells": 0, "unknown": 0}

    def patch_row(match: re.Match) -> str:
        row_open, body = match.group(1), match.group(2)
        rnum = int(cell_attr(row_open, "r") or 0)
        if rnum < 2:
            return match.group(0)

        cells: dict[int, str] = {}
        for cm in CELL_RE.finditer(body):
            cell_xml = cm.group(0)
            col = cell_ref_col(cell_xml)
            if col:
                cells[col] = cell_xml
        key = cell_text(cells[1], sst) if 1 in cells else None
        if not key:
            return match.group(0)
        record = records.get(key)
        if record is None:
            stats["unknown"] += 1
            return match.group(0)

        for header in headers:
            if header in TEXT_HEADERS:
                continue
            col = header_col[header]
            value = record.get(header, "")
            if header == TIME_HEADER:
                if not value:
                    continue
                cells[col] = build_cell(
                    col,
                    rnum,
                    cell_style(cells[col]) if col in cells else col_style.get(col),
                    f"<is><t>{html.escape(value)}</t></is>",
                    ' t="inlineStr"',
                )
                stats["cells"] += 1
                continue
            if value == "":
                if col in cells:
                    del cells[col]
                    stats["cells"] += 1
                continue
            try:
                float(value)
            except ValueError:
                continue
            cells[col] = build_cell(
                col,
                rnum,
                cell_style(cells[col]) if col in cells else col_style.get(col),
                f"<v>{value}</v>",
            )
            stats["cells"] += 1

        stats["rows"] += 1
        return row_open + "".join(cells[c] for c in sorted(cells)) + "</row>"

    new_xml = ROW_RE.sub(patch_row, xml)

    # 打开时强制重算，WPS / Excel 打开后按新价格重算所有公式
    workbook_xml = zf.read("xl/workbook.xml").decode("utf-8")

    def force_calc(m: re.Match) -> str:
        tag = m.group(0)
        if "fullCalcOnLoad" in tag:
            return tag
        return tag[:-2].rstrip() + ' fullCalcOnLoad="1"/>'

    if re.search(r"<calcPr\b[^>]*/>", workbook_xml):
        workbook_xml = re.sub(r"<calcPr\b[^>]*/>", force_calc, workbook_xml, count=1)
    else:
        workbook_xml = workbook_xml.replace(
            "</workbook>", '<calcPr calcId="0" fullCalcOnLoad="1"/></workbook>'
        )

    if args.in_place:
        out_path = wb_path
        shutil.copy2(wb_path, wb_path.with_suffix(wb_path.suffix + ".bak"))
    else:
        out_path = Path(args.out) if args.out else wb_path.with_name(
            wb_path.stem + "-最新" + wb_path.suffix
        )

    tmp_dir = out_path.parent
    fd, tmp_name = tempfile.mkstemp(suffix=out_path.suffix, dir=str(tmp_dir))
    Path(tmp_name).unlink(missing_ok=True)
    with zipfile.ZipFile(tmp_name, "w", zipfile.ZIP_DEFLATED) as zout:
        for info in zf.infolist():
            if info.filename == target:
                data = new_xml.encode("utf-8")
            elif info.filename == "xl/workbook.xml":
                data = workbook_xml.encode("utf-8")
            else:
                data = zf.read(info.filename)
            zi = zipfile.ZipInfo(info.filename, date_time=info.date_time)
            zi.compress_type = info.compress_type
            zi.external_attr = info.external_attr
            zout.writestr(zi, data)
    zf.close()
    shutil.move(tmp_name, out_path)

    print(f"物价表已更新：{out_path}")
    print(f"  数据时间：{data_time or '(CSV 未提供)'}")
    print(f"  更新行数：{stats['rows']}；写入单元格：{stats['cells']}；CSV 中未出现的行：{stats['unknown']}")
    if args.in_place:
        print(f"  原文件备份：{out_path.with_suffix(out_path.suffix + '.bak')}")
    print("  已设置「打开时强制重算」：用 WPS / Excel 打开后会自动按新价格重算公式")
    if stats["rows"] == 0:
        print("warning: 没有匹配到任何数据行，工作簿结构可能不符合预期", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())

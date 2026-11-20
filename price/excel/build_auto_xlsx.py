#!/usr/bin/env python3
"""Build a macro-free xlsx whose 「物价」 table is a Power Query refreshed on open.

Trade-off: the workbook no longer carries a static snapshot; the first open must
reach GitHub Pages, and Excel must be allowed to refresh the query.
"""
from __future__ import annotations

import json
import posixpath
import re
import sys
import zipfile
from xml.sax.saxutils import escape
from pathlib import Path

import openpyxl
from pyopenvba import PowerQueryWorkbook

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "excel" / "剑网3技艺收益与突破.xlsx"
DST = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "excel" / "剑网3技艺收益与突破-auto.xlsx"
TMP = ROOT / "build" / "auto_steps"
TMP.mkdir(parents=True, exist_ok=True)

HEADERS = list(json.loads((ROOT / "_site" / "prices.json").read_text(encoding="utf-8"))[0].keys())
assert len(HEADERS) == 39, f"unexpected price feed columns: {len(HEADERS)}"
QUERY = '''let
    源 = Json.Document(Web.Contents("https://cherishxie.github.io/JX3-AH-Calculator/prices.json")),
    表 = Table.FromRecords(源)
in
    表'''


def _inline_shared(sheet: str, shared_xml: bytes) -> str:
    """Turn t="s" cells into inline strings so we can splice a sheet from another workbook."""
    import xml.etree.ElementTree as ET
    root = ET.fromstring(shared_xml)
    ns = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
    texts = ["".join(t.text or "" for t in si.iter(ns + "t")) for si in root.findall(ns + "si")]

    pattern = re.compile(r'<c\b([^>]*?)\bt="s"([^>]*)>(.*?)</c>', re.S)

    def repl(m):
        attrs = (m.group(1) + m.group(2)).strip().replace('t="s"', "").strip()
        vm = re.search(r"<v>(\d+)</v>", m.group(3))
        if not vm:
            return m.group(0)
        text = texts[int(vm.group(1))]
        prefix = (" " + attrs) if attrs else ""
        return f'<c{prefix} t="inlineStr"><is><t xml:space="preserve">{escape(text)}</t></is></c>'

    return pattern.sub(repl, sheet)


def _sheet_path(items: dict[str, bytes], name: str) -> str:
    wb = items["xl/workbook.xml"].decode("utf-8")
    rels = items["xl/_rels/workbook.xml.rels"].decode("utf-8")
    m = re.search(r'<sheet[^>]*name="' + re.escape(name) + r'"[^>]*r:id="([^"]+)"', wb)
    if not m:
        raise SystemExit(f"sheet not found: {name}")
    rid = m.group(1)
    for rel in re.findall(r"<Relationship[^>]*/>", rels):
        if f'Id="{rid}"' in rel:
            target = re.search(r'Target="([^"]+)"', rel).group(1)
            return target.lstrip("/") if target.startswith("/") else "xl/" + target
    raise SystemExit(f"sheet rel not found: {rid}")


def seed_snapshot(snapshot: Path, target: Path) -> None:
    """Copy the static 物价 sheet (values + formats) into the query-table file.

    The table range is expanded to 1368 rows so Excel treats the snapshot as the
    query's cached data; an on-open refresh replaces it, a failed refresh leaves
    the snapshot visible.
    """
    with zipfile.ZipFile(snapshot) as z:
        src = {n: z.read(n) for n in z.namelist()}
    with zipfile.ZipFile(target) as z:
        dst = {n: z.read(n) for n in z.namelist()}

    src_sheet = _sheet_path(src, "物价")
    dst_sheet = _sheet_path(dst, "物价")
    sheet = src[src_sheet].decode("utf-8")
    if "xl/sharedStrings.xml" in src:
        sheet = _inline_shared(sheet, src["xl/sharedStrings.xml"])
    root_start = sheet.index("<worksheet")
    root_end = sheet.index(">", root_start)
    if "xmlns:r=" not in sheet[root_start:root_end]:
        sheet = sheet[:root_start] + sheet[root_start:].replace("<worksheet ", '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ', 1)

    rel_path = dst_sheet.rsplit("/", 1)[0] + "/_rels/" + dst_sheet.rsplit("/", 1)[1] + ".rels"
    rels = dst[rel_path].decode("utf-8")
    table_rid = None
    table_target = None
    for rel in re.findall(r"<Relationship[^>]*/>", rels):
        if "relationships/table" in rel:
            table_rid = re.search(r'Id="([^"]+)"', rel).group(1)
            table_target = re.search(r'Target="([^"]+)"', rel).group(1)
    if not table_rid:
        raise SystemExit("query table relationship not found")
    if "<tableParts" not in sheet:
        sheet = sheet.replace("</worksheet>", f'<tableParts count="1"><tablePart r:id="{table_rid}"/></tableParts></worksheet>')
    dst[dst_sheet] = sheet.encode("utf-8")

    table_path = table_target.lstrip("/") if table_target.startswith("/") else posixpath.normpath(posixpath.join(posixpath.dirname(dst_sheet), table_target))
    table = dst[table_path].decode("utf-8")
    table = re.sub(r'(<table[^>]*\bref=")A1:AM\d+(")', r'\g<1>A1:AM1368\2', table)
    table = re.sub(r'(<autoFilter[^>]*\bref=")A1:AM\d+(")', r'\g<1>A1:AM1368\2', table)
    dst[table_path] = table.encode("utf-8")

    with zipfile.ZipFile(target, "w", zipfile.ZIP_DEFLATED) as zout:
        for name, data in dst.items():
            zout.writestr(name, data)


def main() -> None:
    wb = openpyxl.load_workbook(SRC, data_only=False)
    del wb["物价"]
    ws = wb.create_sheet("物价", 7)
    ws.sheet_properties.tabColor = "0E7490"
    from openpyxl.utils import get_column_letter
    ws.column_dimensions["A"].width = 16
    ws.column_dimensions["B"].width = 18
    ws.column_dimensions["C"].width = 10
    for i in range(17):
        ws.column_dimensions[get_column_letter(4 + i)].width = 11
        ws.column_dimensions[get_column_letter(21 + i)].width = 11
    ws.column_dimensions[get_column_letter(38)].width = 12
    ws.column_dimensions[get_column_letter(39)].width = 18
    ws.freeze_panes = "D2"
    base = TMP / "base.xlsx"
    wb.save(base)

    with PowerQueryWorkbook(base) as book:
        if "物价自动" in book.query_names():
            book.remove_query("物价自动")
        book.add_query("物价自动", QUERY)
        book.load_to_sheet("物价自动", HEADERS, sheet="物价", cell="A1")
        q = book.query("物价自动")
        q.refresh.on_open = True
        q.refresh.background = False
        q.refresh.in_refresh_all = True
        q.refresh.keep_data = True
        book.save(DST)

    seed_snapshot(SRC, DST)

    check = openpyxl.load_workbook(DST, data_only=False)
    assert len(check["总览"]._charts) == 2
    assert check["物价"].max_row >= 1368, "snapshot rows missing"
    assert check["物价"]["A2"].value, "snapshot A2 missing"
    with PowerQueryWorkbook(DST) as book:
        assert "物价自动" in book.query_names()
    print(f"OK {DST} · 无宏 · 预填快照 + 打开时刷新 · 物价 = Power Query 目标")


if __name__ == "__main__":
    main()

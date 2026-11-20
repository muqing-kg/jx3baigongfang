#!/usr/bin/env python3
"""Build the macro-enabled workbook with a native Excel Web Query button.

The macro imports prices.html (39-column HTML table) via QueryTables; it does
not use Power Query. Requires pyOpenVBA for writing the VBA project and button.
"""
from __future__ import annotations

import re
import sys
import zipfile
from pathlib import Path

import openpyxl
from pyopenvba import ExcelFile
from pyopenvba.apps.excel import ExcelApplication

ROOT = Path(__file__).resolve().parent.parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "excel" / "剑网3技艺收益与突破.xlsx"
DST = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / "excel" / "剑网3技艺收益与突破.xlsm"
TMP = ROOT / "build" / "xlsm_steps"
TMP.mkdir(parents=True, exist_ok=True)

VBA = (ROOT / "excel" / "price_refresh.vba").read_text(encoding="ascii")


def add_vba(src: Path) -> Path:
    out = TMP / "02_vba.xlsm"
    app = ExcelApplication.open(src)
    app.add_module(VBA, name="PriceRefresh")
    app.save(out)
    return out


def add_open_event(src: Path) -> Path:
    out = TMP / "03_open.xlsm"
    source = "Option Explicit\r\n\r\nPrivate Sub Workbook_Open()\r\n    On Error Resume Next\r\n    RefreshPrices True\r\nEnd Sub\r\n"
    with ExcelFile(src) as wb:
        wb.set_module("ThisWorkbook", source)
        wb.save(out)
    return out


def _vml(text: str, macro: str) -> str:
    return f'''<xml xmlns:v="urn:schemas-microsoft-com:vml"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel">
 <o:shapelayout v:ext="edit">
  <o:idmap v:ext="edit" data="1"/>
 </o:shapelayout><v:shapetype id="_x0000_t201" coordsize="21600,21600" o:spt="201"
  path="m,l,21600r21600,l21600,xe">
  <v:stroke joinstyle="miter"/>
  <v:path shadowok="f" o:extrusionok="f" strokeok="f" fillok="f" o:connecttype="rect"/>
  <o:lock v:ext="edit" shapetype="t"/>
 </v:shapetype><v:shape id="_x0000_s1025" o:spid="_x0000_s1025" type="#_x0000_t201" style='position:absolute;margin-left:8pt;margin-top:2pt;width:230pt;height:34pt;z-index:1;mso-wrap-style:tight' o:button="t" fillcolor="buttonFace [67]" o:insetmode="auto"><v:fill color2="buttonFace [67]" o:detectmouseclick="t"/><o:lock v:ext="edit" rotation="t"/><v:textbox style='mso-direction-alt:auto' o:singleclick='f'><div style='text-align:center'>{text}</div></v:textbox><x:ClientData ObjectType="Button"><x:Anchor>0, 8, 2, 4, 2, 230, 2, 38</x:Anchor><x:PrintObject>False</x:PrintObject><x:AutoFill>False</x:AutoFill><x:FmlaMacro>[0]!{macro}</x:FmlaMacro><x:TextHAlign>Center</x:TextHAlign><x:TextVAlign>Center</x:TextVAlign></x:ClientData></v:shape></xml>'''


def inject_button(src: Path, sheet_name: str = "总览", macro: str = "CheckPriceUpdate", text: str = "检查物价更新") -> Path:
    out = TMP / "04_button.xlsm"
    with zipfile.ZipFile(src) as zin:
        items = {n: zin.read(n) for n in zin.namelist()}

    wb_xml = items["xl/workbook.xml"].decode("utf-8")
    wb_rels = items["xl/_rels/workbook.xml.rels"].decode("utf-8")
    m = re.search(r'<sheet[^>]*name="' + re.escape(sheet_name) + r'"[^>]*r:id="([^"]+)"', wb_xml)
    if not m:
        raise SystemExit(f"sheet not found: {sheet_name}")
    rid = m.group(1)
    target = None
    for rel in re.findall(r"<Relationship[^>]*/>", wb_rels):
        if f'Id="{rid}"' in rel:
            tm = re.search(r'Target="([^"]+)"', rel)
            if tm:
                target = tm.group(1)
                break
    if not target:
        raise SystemExit(f"sheet rel not found: {rid}")
    sheet_path = target.lstrip("/") if target.startswith("/") else "xl/" + target
    sheet = items[sheet_path].decode("utf-8")
    root_start = sheet.index("<worksheet")
    root_end = sheet.index(">", root_start)
    if "xmlns:r=" not in sheet[root_start:root_end]:
        sheet = sheet[:root_start] + sheet[root_start:].replace("<worksheet ", '<worksheet xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ', 1)

    rel_path = sheet_path.rsplit("/", 1)[0] + "/_rels/" + sheet_path.rsplit("/", 1)[1] + ".rels"
    if rel_path in items:
        rels = items[rel_path].decode("utf-8")
    else:
        rels = '<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>'

    used = set(re.findall(r'Id="([^"]+)"', rels))
    vml_rid = "rIdVmlButton"
    while vml_rid in used:
        vml_rid += "X"
    ctrl_rid = "rIdCtrlProp"
    while ctrl_rid in used or ctrl_rid == vml_rid:
        ctrl_rid += "X"
    vml_index = 1
    vml_name = "vmlDrawing1.vml"
    while f"xl/drawings/{vml_name}" in items:
        vml_index += 1
        vml_name = f"vmlDrawing{vml_index}.vml"

    rels = rels.replace(
        "</Relationships>",
        f'<Relationship Id="{vml_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" Target="../drawings/{vml_name}"/>'
        f'<Relationship Id="{ctrl_rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/ctrlProp" Target="../ctrlProps/ctrlProp1.xml"/></Relationships>',
    )
    items[rel_path] = rels.encode("utf-8")
    if "<legacyDrawing" not in sheet:
        sheet = sheet.replace("</worksheet>", f'<legacyDrawing r:id="{vml_rid}"/></worksheet>')
    items[sheet_path] = sheet.encode("utf-8")
    items[f"xl/drawings/{vml_name}"] = _vml(text, macro).encode("utf-8")
    items["xl/ctrlProps/ctrlProp1.xml"] = b'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><formControlPr xmlns="http://schemas.microsoft.com/office/spreadsheetml/2009/9/main" objectType="Button" lockText="1" fmlaLink="" fmlaRange=""/>'

    ct = items["[Content_Types].xml"].decode("utf-8")
    if 'Extension="vml"' not in ct:
        ct = ct.replace("</Types>", '<Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing"/></Types>')
    if "ctrlProps/ctrlProp1.xml" not in ct:
        ct = ct.replace("</Types>", '<Override PartName="/xl/ctrlProps/ctrlProp1.xml" ContentType="application/vnd.ms-excel.controlproperties+xml"/></Types>')
    items["[Content_Types].xml"] = ct.encode("utf-8")

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zout:
        for name, data in items.items():
            zout.writestr(name, data)
    return out


def verify(path: Path) -> None:
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        assert "xl/vbaProject.bin" in names, "vbaProject missing"
        assert any(n.endswith(".vml") for n in names), "VML button missing"
        assert any("ctrlProp" in n for n in names), "ctrlProp missing"
    wb = openpyxl.load_workbook(path, data_only=False, keep_vba=True)
    assert "总览" in wb.sheetnames and "五行石" in wb.sheetnames
    assert len(wb["总览"]._charts) == 2
    with ExcelFile(path) as book:
        assert "Workbook_Open" in book.get_module("ThisWorkbook")
        source = book.get_module("PriceRefresh")
        assert "QueryTables.Add" in source and "prices.html" in source
    print(f"OK {path} · {len(wb.sheetnames)} sheets · VBA + Web Query + button")


def main() -> None:
    v = add_vba(SRC)
    v = add_open_event(v)
    b = inject_button(v)
    b.replace(DST)
    verify(DST)


if __name__ == "__main__":
    main()

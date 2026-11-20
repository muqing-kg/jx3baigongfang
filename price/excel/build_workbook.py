#!/usr/bin/env python3
"""Build the standalone Excel workbook for JX3 crafting profit and breakthrough routes."""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference
from openpyxl.formatting.rule import CellIsRule, ColorScaleRule, FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.workbook.defined_name import DefinedName
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.worksheet.formula import ArrayFormula

ROOT = Path(__file__).resolve().parent.parent
MODEL = json.loads((ROOT / "build" / "excel_model.json").read_text(encoding="utf-8"))
OUT = ROOT / "excel" / "剑网3技艺收益与突破.xlsx"

NAVY = "12324A"
NAVY_2 = "1E4A66"
INK = "1F2937"
MUTED = "64748B"
LINE = "DCE4EC"
BG = "F8FAFC"
WHITE = "FFFFFF"
AMBER = "B45309"
AMBER_BG = "FFF7E6"
GREEN = "047857"
GREEN_BG = "E8F5EE"
RED = "B91C1C"
RED_BG = "FDE8E8"
BLUE = "1D4ED8"
BLUE_BG = "EAF1FD"

THIN = Side(style="thin", color=LINE)
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

FONT_CN = "Microsoft YaHei"
FONT_NUM = "DIN Alternate"

TITLE_FILL = PatternFill("solid", fgColor=NAVY)
HEADER_FILL = PatternFill("solid", fgColor=NAVY_2)
BAND_FILL = PatternFill("solid", fgColor="F4F7FA")
INPUT_FILL = PatternFill("solid", fgColor=AMBER_BG)
CARD_FILL = PatternFill("solid", fgColor="F1F5F9")
NOTE_FILL = PatternFill("solid", fgColor=BLUE_BG)
WARN_FILL = PatternFill("solid", fgColor=RED_BG)

TITLE_FONT = Font(name=FONT_CN, size=20, bold=True, color=WHITE)
SUBTITLE_FONT = Font(name=FONT_CN, size=10, color="C9D8E4")
HEADER_FONT = Font(name=FONT_CN, size=10, bold=True, color=WHITE)
BODY_FONT = Font(name=FONT_CN, size=10, color=INK)
SMALL_FONT = Font(name=FONT_CN, size=9, color=MUTED)
BOLD_FONT = Font(name=FONT_CN, size=10, bold=True, color=INK)
SECTION_FONT = Font(name=FONT_CN, size=12, bold=True, color=WHITE)
LINK_FONT = Font(name=FONT_CN, size=10, color=BLUE, underline="single")

NUM_2 = '#,##0.00;[Red]-#,##0.00'
NUM_0 = '#,##0;[Red]-#,##0'
NUM_RAW = '0.00'
PCT = '0.0%'

servers = MODEL["servers"]
server_names = [s["name"] for s in servers]
server_ids = [s["id"] for s in servers]
skills = MODEL["skills"]
skill_names = [s["name"] for s in skills]
skill_by_id = {s["id"]: s for s in skills}
skill_order = {s["id"]: i for i, s in enumerate(skills)}

master_items = MODEL["masterItems"]
catalog_recipes = sorted(
    MODEL["catalogRecipes"],
    key=lambda r: (skill_order.get(r["skillId"], 99), r["kind"] != "craft", r["level"], r["name"]),
)
craft_recipes = [r for r in catalog_recipes if r["kind"] == "craft"]
gather_recipes = [r for r in catalog_recipes if r["kind"] == "gather"]
bt_recipes = sorted(
    MODEL["btRecipes"],
    key=lambda r: (skill_order.get(r["skillId"], 99), r["level"], r["name"]),
)
gates = sorted(MODEL["gates"], key=lambda g: (skill_order.get(g["skillId"], 99), g["level"]))

META = MODEL["meta"]
STONES = sorted(MODEL.get("stones") or [], key=lambda x: x["level"])
STONE_RECIPES = MODEL.get("stoneRecipes") or []
STONE_PRICES = MODEL.get("stonePrices") or {}
STONE_BY_LEVEL = {s["level"]: s for s in STONES}
EXP_TABLE = META["expTable"]
EXP_TOTAL = int(META["expTotal"])
EXP_OBS = META["expObservations"]
GATHER_EXP = int(META["gatherExp"])
SNAPSHOT = META.get("priceUpdatedAt") or META.get("btPriceUpdatedAt") or ""

N_PRICE = 1 + len(master_items)          # header + rows
LAST_PRICE = N_PRICE                     # last row of 物价
N_CAT = 1 + len(catalog_recipes)
LAST_CAT = N_CAT
N_ITEM = 1 + 267
LAST_ITEM = N_ITEM
N_BT = 1 + len(bt_recipes) + len(gather_recipes)
LAST_BT = N_BT
N_ROUTE = 8 * 49
LAST_ROUTE = 1 + N_ROUTE
N_GATE = 1 + sum(len(g["materials"]) for g in gates)
LAST_GATE = N_GATE
N_ALLOC = 1 + len(catalog_recipes)
LAST_ALLOC = N_ALLOC

# Frequently used range strings.
R_PROFIT = f"'配方收益'!$2:$176"  # unused marker
R_PROFIT_M = f"'配方收益'!$M$2:$M${LAST_CAT}"
R_PROFIT_L = f"'配方收益'!$L$2:$L${LAST_CAT}"
R_PROFIT_Q = f"'配方收益'!$Q$2:$Q${LAST_CAT}"
R_PROFIT_D = f"'配方收益'!$D$2:$D${LAST_CAT}"
R_PROFIT_B = f"'配方收益'!$B$2:$B${LAST_CAT}"
R_PROFIT_C = f"'配方收益'!$C$2:$C${LAST_CAT}"
R_PROFIT_P = f"'配方收益'!$P$2:$P${LAST_CAT}"
R_PROFIT_E = f"'配方收益'!$P$2:$P${LAST_CAT}"

R_BT = f"'突破配方'!$2:$1058"
R_BT_B = f"'突破配方'!$B$2:$B${LAST_BT}"
R_BT_C = f"'突破配方'!$C$2:$C${LAST_BT}"
R_BT_E = f"'突破配方'!$E$2:$E${LAST_BT}"
R_BT_F = f"'突破配方'!$F$2:$F${LAST_BT}"
R_BT_G = f"'突破配方'!$G$2:$G${LAST_BT}"
R_BT_H = f"'突破配方'!$H$2:$H${LAST_BT}"
R_BT_I = f"'突破配方'!$I$2:$I${LAST_BT}"
R_BT_J = f"'突破配方'!$J$2:$J${LAST_BT}"
R_BT_K = f"'突破配方'!$K$2:$K${LAST_BT}"
R_BT_L = f"'突破配方'!$L$2:$L${LAST_BT}"
R_BT_M = f"'突破配方'!$M$2:$M${LAST_BT}"
R_BT_N = f"'突破配方'!$N$2:$N${LAST_BT}"

R_ITEM_H = f"'物品'!$H$2:$H${LAST_ITEM}"
R_ITEM_F = f"'物品'!$F$2:$F${LAST_ITEM}"
R_ITEM_ID = f"'物品'!$A$2:$A${LAST_ITEM}"

R_ROUTE = f"'路线明细'!$2:$393"
R_ROUTE_A = f"'路线明细'!$A$2:$A${LAST_ROUTE}"
R_ROUTE_B = f"'路线明细'!$B$2:$B${LAST_ROUTE}"
R_ROUTE_C = f"'路线明细'!$C$2:$C${LAST_ROUTE}"
R_ROUTE_F = f"'路线明细'!$F$2:$F${LAST_ROUTE}"
R_ROUTE_I = f"'路线明细'!$I$2:$I${LAST_ROUTE}"
R_ROUTE_J = f"'路线明细'!$J$2:$J${LAST_ROUTE}"
R_ROUTE_K = f"'路线明细'!$K$2:$K${LAST_ROUTE}"
R_ROUTE_L = f"'路线明细'!$L$2:$L${LAST_ROUTE}"
R_ROUTE_M = f"'路线明细'!$M$2:$M${LAST_ROUTE}"
R_ROUTE_N = f"'路线明细'!$N$2:$N${LAST_ROUTE}"
R_ROUTE_O = f"'路线明细'!$O$2:$O${LAST_ROUTE}"
R_ROUTE_P = f"'路线明细'!$P$2:$P${LAST_ROUTE}"
R_ROUTE_Q = f"'路线明细'!$Q$2:$Q${LAST_ROUTE}"

R_GATE_A = f"'突破晋秩'!$A$2:$A${LAST_GATE}"
R_GATE_B = f"'突破晋秩'!$B$2:$B${LAST_GATE}"
R_GATE_C = f"'突破晋秩'!$C$2:$C${LAST_GATE}"
R_GATE_D = f"'突破晋秩'!$D$2:$D${LAST_GATE}"
R_GATE_F = f"'突破晋秩'!$F$2:$F${LAST_GATE}"
R_GATE_G = f"'突破晋秩'!$G$2:$G${LAST_GATE}"
R_GATE_I = f"'突破晋秩'!$I$2:$I${LAST_GATE}"
R_GATE_J = f"'突破晋秩'!$J$2:$J${LAST_GATE}"
R_GATE_K = f"'突破晋秩'!$K$2:$K${LAST_GATE}"


def fx(formula: str) -> str:
    """Use the stored OOXML names for functions introduced after Excel 2007."""
    return (
        formula.replace("MAXIFS(", "_xlfn.MAXIFS(")
        .replace("MINIFS(", "_xlfn.MINIFS(")
        .replace("TEXTJOIN(", "_xlfn.TEXTJOIN(")
        .replace("AGGREGATE(", "_xlfn.AGGREGATE(")
    )


def set_cell(ws, row, col, value=None, fmt=None, font=None, fill=None, align=None, border=True):
    cell = ws.cell(row=row, column=col)
    if value is not None:
        cell.value = value
    if fmt:
        cell.number_format = fmt
    cell.font = font or BODY_FONT
    if fill:
        cell.fill = fill
    if border:
        cell.border = BORDER
    cell.alignment = align or Alignment(vertical="center", wrap_text=False)
    return cell


def set_formula(ws, row, col, formula, fmt=None, array_ref=None, font=None, fill=None, align=None):
    cell = ws.cell(row=row, column=col)
    if array_ref:
        cell.value = ArrayFormula(array_ref, fx(formula))
    else:
        cell.value = fx(formula)
    if fmt:
        cell.number_format = fmt
    cell.font = font or BODY_FONT
    if fill:
        cell.fill = fill
    cell.border = BORDER
    cell.alignment = align or Alignment(vertical="center")
    return cell


def title_band(ws, title, subtitle, last_col):
    ws.merge_cells(start_row=1, start_column=1, end_row=2, end_column=last_col)
    for r in (1, 2):
        for c in range(1, last_col + 1):
            ws.cell(r, c).fill = TITLE_FILL
    cell = ws.cell(1, 1, title)
    cell.font = TITLE_FONT
    cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[1].height = 30
    ws.row_dimensions[2].height = 22
    sub = ws.cell(3, 1, subtitle)
    ws.merge_cells(start_row=3, start_column=1, end_row=3, end_column=last_col)
    sub.font = Font(name=FONT_CN, size=9, color=MUTED)
    sub.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
    ws.row_dimensions[3].height = 24


def section(ws, row, text, last_col, fill=HEADER_FILL):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=last_col)
    for c in range(1, last_col + 1):
        ws.cell(row, c).fill = fill
    cell = ws.cell(row, 1, text)
    cell.font = SECTION_FONT
    cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    ws.row_dimensions[row].height = 24


def header_row(ws, row, headers, height=30):
    for col, value in enumerate(headers, 1):
        cell = ws.cell(row=row, column=col, value=value)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        cell.border = BORDER
    ws.row_dimensions[row].height = height


def widths(ws, mapping):
    for col, width in mapping.items():
        ws.column_dimensions[col].width = width


def band(ws, first_row, last_row, last_col):
    ws.conditional_formatting.add(
        f"A{first_row}:{get_column_letter(last_col)}{last_row}",
        FormulaRule(formula=[f"MOD(ROW(),2)=0"], fill=BAND_FILL, stopIfTrue=False),
    )


def get_column_letter(col):
    from openpyxl.utils import get_column_letter as gcl
    return gcl(col)


def note(ws, row, text, last_col, fill=NOTE_FILL, height=None):
    ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=last_col)
    for c in range(1, last_col + 1):
        ws.cell(row, c).fill = fill
    cell = ws.cell(row, 1, text)
    cell.font = SMALL_FONT
    cell.alignment = Alignment(horizontal="left", vertical="center", wrap_text=True, indent=1)
    if height:
        ws.row_dimensions[row].height = height


def kpi_card(ws, row, col, label, value, fmt=None, span=2):
    ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + span - 1)
    ws.merge_cells(start_row=row + 1, start_column=col, end_row=row + 1, end_column=col + span - 1)
    lab = ws.cell(row, col, label)
    lab.font = Font(name=FONT_CN, size=9, color=MUTED)
    lab.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    if isinstance(value, str) and value.startswith("="):
        value = fx(value)
    val = ws.cell(row + 1, col, value)
    val.font = Font(name=FONT_CN, size=15, bold=True, color=NAVY)
    val.alignment = Alignment(horizontal="left", vertical="center", indent=1)
    if fmt:
        val.number_format = fmt
    for r in (row, row + 1):
        for c in range(col, col + span):
            ws.cell(r, c).fill = CARD_FILL
            ws.cell(r, c).border = BORDER


wb = Workbook()
wb.remove(wb.active)

# ---------------------------------------------------------------------------
# 说明
# ---------------------------------------------------------------------------
ws = wb.create_sheet("说明")
ws.sheet_properties.tabColor = NAVY
widths(ws, {"A": 3, "B": 30, "C": 72, "D": 3})
ws.sheet_view.showGridLines = False
title_band(
    ws,
    "剑网3 · 生活技艺 Excel 工作台",
    "苍生铸世 50 级 · 总览 / 技艺收益 / 五行石 / 八技艺突破路线 · 物价与配方同源，经验表按用户观测点重算",
    3,
)
ws.row_dimensions[5].height = 8

section(ws, 6, "快速开始", 3)
steps = [
    ("1", "选服务器与口径", "在「设置」选择服务器、税率、成本口径（市场价 / 取最低）、产量口径（低 / 中 / 高）和突破策略（金最优 / 精力最优 / 省心）。"),
    ("2", "看技艺收益", "「技艺收益」给出全配方排行、按技艺汇总、满精力贪心分配；「配方收益」保留 175 条原始明细，可筛选、排序、改价。"),
    ("3", "看突破路线", "「突破路线」按所选技艺列出 1→50 的逐级最优配方、精力、成本、利润，并单列 30/35/40/45 晋秩材料与八技艺横评。"),
]
r = 7
for num, head, body in steps:
    c = ws.cell(r, 2, num)
    c.font = Font(name=FONT_CN, size=16, bold=True, color=AMBER)
    c.alignment = Alignment(horizontal="center", vertical="top")
    h = ws.cell(r, 3, head)
    h.font = BOLD_FONT
    b = ws.cell(r + 1, 3, body)
    b.font = BODY_FONT
    b.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 20
    ws.row_dimensions[r + 1].height = 34
    r += 2

section(ws, 15, "刷新物价（GitHub Action 定时更新 Pages 上的 prices.json）", 3)
refresh_lines = [
    ("数据链路", "GitHub Action 每天 08:53–22:53 每两小时从 JX3BOX 拉取全服拍卖 → 写入 assets/data.js → Pages 构建时生成 prices.json / prices.csv / prices.html。"),
    ("推荐：宏版 .xlsm", "打开时自动用 Excel Web Query 导入 prices.html（39 列 HTML 表），也可点「总览」左上角『检查物价更新』手动刷新。Web Query 不依赖 Power Query，失败时保留内置快照。无宏自动版 .xlsx 则用 Power Query 打开刷新。"),
    ("Mac / 传统 Web 查询", "下载「物价刷新.iqy」；Excel 菜单「数据 → 获取外部数据 → 运行 Web 查询」，选择该文件，输出到「物价」A1。之后同样可全部刷新 / 打开时刷新。"),
    ("WPS / 其他", "下载 prices.csv（UTF-8 BOM），全选复制，粘贴到「物价」A1，保留表头即可。"),
    ("离线", "工作簿已内置生成时的物价快照；不刷新也能完整计算，只是价格停在快照时间。"),
]
r = 16
for label, text in refresh_lines:
    lab = ws.cell(r, 2, label)
    lab.font = BOLD_FONT
    lab.alignment = Alignment(vertical="top")
    cell = ws.cell(r, 3, text)
    cell.font = BODY_FONT
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 42 if len(text) > 55 else 26
    r += 1

section(ws, 22, "Sheet 地图", 3)
header_row(ws, 23, ["", "Sheet", "用途"])
sheets_map = [
    ("总览", "KPI、TOP 10、按技艺汇总、八技艺突破净收益、采集 vs 制造。"),
    ("设置", "服务器、税率、成本/产量口径、突破策略、精力预算、经验模型。"),
    ("技艺收益", "KPI、TOP 20、按技艺汇总、采集 vs 制造、满精力分配。"),
    ("五行石", "1-8 行情、快速合成、配方对比、3-6 推荐、7/8 爆率盈亏线。"),
    ("突破路线", "所选技艺 1→50 路线、晋秩材料、八技艺横评与净收益图。"),
    ("物价", "1367 个物品 × 17 个服务器 × 行情/突破双价（39 列）的价格快照；Web 查询的落点。"),
    ("物品 / 配方收益", "267 个目录物品与 175 条配方；成本、税后产值、利润、精力收益。"),
    ("材料明细 / 产物明细", "配方与材料/产物的长表，供 SUMIFS 汇总。"),
    ("突破配方等 5 表", "1057 条突破候选配方（含 21 条采集）及其经济性；物品/材料/产物/采集产物为底表。"),
    ("突破晋秩 / 路线明细", "32 条晋秩任务与 8 技艺 × 49 级的路线计算底表。"),
    ("分配 / 服务器", "满精力贪心分配的 175 行底表；服务器与技艺下拉源。"),
]
r = 24
for name, use in sheets_map:
    set_cell(ws, r, 2, name, font=BOLD_FONT)
    set_cell(ws, r, 3, use, font=BODY_FONT, align=Alignment(wrap_text=True, vertical="top"))
    ws.row_dimensions[r].height = 30 if len(use) > 35 else 20
    r += 1

section(ws, 36, "口径与边界", 3)
notes = [
    "成本 = Σ 材料数量 × 材料采用成本 + 手续费；税后产值 = Σ 产物数量 × 概率 × 市场价 × (1 − 税率)；利润 = 税后产值 − 成本；精力收益 = 利润 ÷ 单次精力。",
    "「取最低」逐层比较市场价与自制成本；本工作簿的 175 条配方依赖图无环，已按 DAG 展开为公式，改价后会自动重算。突破路线按市场价计算，与网页版默认口径一致。",
    "突破经验门槛按用户观测点重算：1→2 250、3→4 510、8→9 1150、11→12 1370、14→15 1410、30→31 1650；点间线性插值，31 级起按 14→30 段 +15/级外推，四舍五入到 10，1→50 合计 72,580；采集每次 80 经验。逐级经验仍属估算，以游戏内实测为准。",
    "缺价不会按 0 计算：产物或晋秩材料缺价时标记「缺价」，该等级/任务不计入完整合计。价格优先取本服 JX3BOX 行情，其次基准价。",
    "金最优 = 利润/经验最高；省心 = 制作次数最少；精力最优需逐级 ceil，Excel 端不提供，请在网页版查看。",
]
r = 37
for text in notes:
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=3)
    cell = ws.cell(r, 2, "· " + text)
    cell.font = BODY_FONT
    cell.alignment = Alignment(wrap_text=True, vertical="top")
    ws.row_dimensions[r].height = 56 if len(text) > 60 else 32
    r += 1

section(ws, 44, "数据来源与链接", 3)
links = [
    ("在线版", "https://cherishxie.github.io/JX3-AH-Calculator/", "https://cherishxie.github.io/JX3-AH-Calculator/"),
    ("物价 JSON（Excel 直读）", "https://cherishxie.github.io/JX3-AH-Calculator/prices.json", "https://cherishxie.github.io/JX3-AH-Calculator/prices.json"),
    ("物价 CSV（WPS/手动）", "https://cherishxie.github.io/JX3-AH-Calculator/prices.csv", "https://cherishxie.github.io/JX3-AH-Calculator/prices.csv"),
    ("Web 查询文件", "https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-price-refresh.iqy", "https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-price-refresh.iqy"),
    ("GitHub 仓库", "https://github.com/cherishXie/JX3-AH-Calculator", "https://github.com/cherishXie/JX3-AH-Calculator"),
    ("JX3BOX 技艺助手", "https://www.jx3box.com/pvg/manufacture", "https://www.jx3box.com/pvg/manufacture"),
]
r = 45
for label, text, url in links:
    set_cell(ws, r, 2, label, font=BOLD_FONT)
    cell = ws.cell(r, 3, text)
    cell.hyperlink = url
    cell.font = LINK_FONT
    cell.alignment = Alignment(vertical="center")
    r += 1

note(
    ws,
    52,
    "数据版本 "
    + str(META.get("version"))
    + " · 快照 "
    + str(SNAPSHOT)
    + " · 本工作簿是可校准的生产决策模型，不是官方拍卖行实时数据。配方/等级/精力来自 JX3BOX 当前版本；价格会随 Action 更新。",
    3,
    fill=WARN_FILL,
    height=40,
)
note(ws, 54, "宏版 .xlsm：Workbook_Open / 按钮调用 QueryTables 导入 prices.html（39 列），不依赖 Power Query；失败保留内置快照。无宏自动版 .xlsx 用 Power Query；无宏静态版用快照 / IQY / CSV。", 3, fill=NOTE_FILL, height=44)

# ---------------------------------------------------------------------------
# 总览
# ---------------------------------------------------------------------------
ws = wb.create_sheet("总览")
ws.sheet_properties.tabColor = NAVY
ws.sheet_view.showGridLines = False
widths(ws, {"A": 7, "B": 26, "C": 9, "D": 8, "E": 13, "F": 13, "G": 10, "H": 12, "I": 6, "J": 6, "K": 3, "L": 9, "M": 7, "N": 13, "O": 13, "P": 28, "Q": 11, "R": 12, "S": 7})
# 自定义标题区：A3:C3 留给「检查物价更新」按钮，D3:J3 放说明文字。
ws.merge_cells("A1:J2")
for r in (1, 2):
    for c in range(1, 11):
        ws.cell(r, c).fill = TITLE_FILL
title_cell = ws.cell(1, 1, "总览")
title_cell.font = TITLE_FONT
title_cell.alignment = Alignment(horizontal="left", vertical="center", indent=1)
ws.row_dimensions[1].height = 30
ws.row_dimensions[2].height = 22
ws.merge_cells("D3:J3")
ws["D3"] = "左侧按钮：检查物价更新（Web Query 拉取 prices.html） · 失败时保留当前快照"
ws["D3"].font = Font(name=FONT_CN, size=9, color=MUTED)
ws["D3"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
for c in range(1, 4):
    ws.cell(3, c).fill = CARD_FILL
    ws.cell(3, c).border = BORDER
ws.row_dimensions[3].height = 38

kpi_card(ws, 4, 1, "最佳精力收益（金/点）", "=IFERROR(MAXIFS('配方收益'!$M:$M,'配方收益'!$P:$P,\"有效\"),\"\")", NUM_2, 2)
kpi_card(ws, 4, 3, "最佳制品", "=IFERROR(INDEX('配方收益'!$D:$D,MATCH(MAXIFS('配方收益'!$Q:$Q,'配方收益'!$P:$P,\"有效\"),'配方收益'!$Q:$Q,0)),\"—\")", None, 4)
kpi_card(ws, 4, 7, "有效 / 盈利配方", "=COUNTIF('配方收益'!$P:$P,\"有效\")&\" / \"&COUNTIFS('配方收益'!$P:$P,\"有效\",'配方收益'!$L:$L,\">0\")", None, 4)
kpi_card(ws, 7, 1, "服务器", "=SrvName", None, 2)
kpi_card(ws, 7, 3, "数据快照", "=IFERROR(LEFT(SUBSTITUTE('物价'!$AM$2,\"T\",\" \"),16),\"—\")", None, 3)
kpi_card(ws, 7, 6, "物价物品数", "=COUNTA('物价'!$A$2:$A$1368)", "0", 2)
kpi_card(ws, 7, 8, "突破净收益冠军", "=IFERROR(INDEX('突破路线'!$A$74:$A$81,MATCH(MAX('突破路线'!$F$74:$F$81),'突破路线'!$F$74:$F$81,0))&\" · \"&TEXT(MAX('突破路线'!$F$74:$F$81),\"#,##0\"),\"—\")", None, 3)

section(ws, 10, "TOP 10 · 精力收益", 8, fill=HEADER_FILL)
header_row(ws, 11, ["#", "配方", "技艺", "精力", "利润", "精力收益", "分配次数", "分配精力"], height=26)
for k in range(1, 11):
    row = 11 + k
    set_cell(ws, row, 1, k, fmt="0", font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, row, 2, f"=IFERROR(INDEX(分配!$C$2:$C$176,MATCH($A{row},分配!$A$2:$A$176,0)),\"—\")", font=BOLD_FONT)
    set_formula(ws, row, 3, f"=IFERROR(INDEX(分配!$D$2:$D$176,MATCH($A{row},分配!$A$2:$A$176,0)),\"\")", font=SMALL_FONT)
    set_formula(ws, row, 4, f"=IFERROR(INDEX(分配!$E$2:$E$176,MATCH($A{row},分配!$A$2:$A$176,0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 5, f"=IFERROR(INDEX(分配!$F$2:$F$176,MATCH($A{row},分配!$A$2:$A$176,0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 6, f"=IFERROR(INDEX(分配!$G$2:$G$176,MATCH($A{row},分配!$A$2:$A$176,0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, row, 7, f"=IFERROR(INDEX(分配!$I$2:$I$176,MATCH($A{row},分配!$A$2:$A$176,0)),0)", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 8, f"=IFERROR(INDEX(分配!$J$2:$J$176,MATCH($A{row},分配!$A$2:$A$176,0)),0)", fmt="0", font=Font(name=FONT_NUM, size=9))
band(ws, 12, 21, 8)
ws.conditional_formatting.add("F12:F21", ColorScaleRule(start_type="min", start_color="FEE2E2", mid_type="percentile", mid_value=50, mid_color="FEF3C7", end_type="max", end_color="BBF7D0"))

for c in range(12, 20):
    ws.cell(10, c).fill = HEADER_FILL
ws.merge_cells("L10:S10")
ws["L10"] = "按技艺汇总"
ws["L10"].font = SECTION_FONT
ws["L10"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
for j, h in enumerate(["技艺", "有效", "最佳精力收益", "最佳制品", "平均", "总利润", "亏损"], 12):
    cell = ws.cell(11, j, h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = BORDER
for i, skill in enumerate(skills, 12):
    set_cell(ws, i, 12, skill["name"], font=BOLD_FONT)
    set_formula(ws, i, 13, f"=COUNTIFS('配方收益'!$B:$B,$L{i},'配方收益'!$P:$P,\"有效\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 14, f"=IFERROR(MAXIFS('配方收益'!$M:$M,'配方收益'!$B:$B,$L{i},'配方收益'!$P:$P,\"有效\"),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, i, 15, f"=IFERROR(INDEX('配方收益'!$D:$D,MATCH(MAXIFS('配方收益'!$Q:$Q,'配方收益'!$B:$B,$L{i}),'配方收益'!$Q:$Q,0)),\"—\")", font=SMALL_FONT)
    set_formula(ws, i, 16, f"=IFERROR(AVERAGEIFS('配方收益'!$M:$M,'配方收益'!$B:$B,$L{i},'配方收益'!$P:$P,\"有效\"),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 17, f"=SUMIFS('配方收益'!$L:$L,'配方收益'!$B:$B,$L{i})", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 18, f"=COUNTIFS('配方收益'!$B:$B,$L{i},'配方收益'!$L:$L,\"<0\")", fmt="0", font=Font(name=FONT_NUM, size=9))

for c in range(12, 20):
    ws.cell(21, c).fill = HEADER_FILL
ws.merge_cells("L21:O21")
ws["L21"] = "突破净收益"
ws["L21"].font = SECTION_FONT
ws["L21"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
for j, h in enumerate(["技艺", "净收益", "晋秩成本", "状态"], 12):
    cell = ws.cell(22, j, h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = BORDER
for i, skill in enumerate(skills, 23):
    set_cell(ws, i, 12, skill["name"], font=BOLD_FONT)
    set_formula(ws, i, 13, f"=IFERROR(INDEX('突破路线'!$F$74:$F$81,MATCH($L{i},'突破路线'!$A$74:$A$81,0)),\"\")", fmt=NUM_0, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, i, 14, f"=IFERROR(INDEX('突破路线'!$E$74:$E$81,MATCH($L{i},'突破路线'!$A$74:$A$81,0)),\"\")", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 15, f"=IFERROR(INDEX('突破路线'!$G$74:$G$81,MATCH($L{i},'突破路线'!$A$74:$A$81,0)),\"\")", font=SMALL_FONT, align=Alignment(horizontal="center"))

section(ws, 23, "采集 vs 制造", 3, fill=HEADER_FILL)
for j, h in enumerate(["类型", "平均精力收益", "总利润"], 1):
    cell = ws.cell(24, j, h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center")
    cell.border = BORDER
for i, kind in enumerate(["制造", "采集"], 25):
    set_cell(ws, i, 1, kind, font=BOLD_FONT)
    set_formula(ws, i, 2, f"=IFERROR(AVERAGEIFS('配方收益'!$M:$M,'配方收益'!$C:$C,$A{i},'配方收益'!$P:$P,\"有效\"),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 3, f"=SUMIFS('配方收益'!$L:$L,'配方收益'!$C:$C,$A{i})", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))

note(ws, 28, "总览只读取「配方收益」「分配」「突破路线」的结果；要改服务器/税率/策略，请到「设置」。点上方『检查物价更新』用 Excel Web Query 导入 prices.html（需启用宏）。", 10, height=40)

chart = BarChart()
chart.type = "bar"
chart.style = 10
chart.title = "TOP 10 精力收益（金/点）"
chart.y_axis.title = "金/点"
data = Reference(ws, min_col=6, min_row=11, max_row=21)
cats = Reference(ws, min_col=2, min_row=12, max_row=21)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
chart.height = 8
chart.width = 16
chart.legend = None
ws.add_chart(chart, "A31")

chart2 = BarChart()
chart2.type = "bar"
chart2.style = 10
chart2.title = "八技艺突破净收益（金）"
chart2.y_axis.title = "金"
data2 = Reference(ws, min_col=13, min_row=22, max_row=30)
cats2 = Reference(ws, min_col=12, min_row=23, max_row=30)
chart2.add_data(data2, titles_from_data=True)
chart2.set_categories(cats2)
chart2.height = 8
chart2.width = 16
chart2.legend = None
ws.add_chart(chart2, "L31")

# ---------------------------------------------------------------------------
# 五行石价格（隐藏，8 × 17 服）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("五行石价格")
ws.sheet_properties.tabColor = "94A3B8"
widths(ws, {"A": 7, "B": 16})
for i in range(len(server_names)):
    ws.column_dimensions[get_column_letter(3 + i)].width = 11
ws.column_dimensions[get_column_letter(3 + len(server_names))].width = 11
header_row(ws, 1, ["等级", "名称"] + server_names + ["基准价"], height=30)
for i, stone in enumerate(STONES, 2):
    set_cell(ws, i, 1, stone["level"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 2, stone["name"], font=SMALL_FONT)
    for j, sid in enumerate(server_ids):
        price = (STONE_PRICES.get(sid) or {}).get(str(stone["level"]))
        if not price:
            price = stone.get("base")
        set_cell(ws, i, 3 + j, price, fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 3 + len(server_ids), stone.get("base"), fmt=NUM_2, font=Font(name=FONT_NUM, size=9, color=MUTED))
ws.sheet_state = "hidden"

# ---------------------------------------------------------------------------
# 五行石
# ---------------------------------------------------------------------------
ws = wb.create_sheet("五行石")
ws.sheet_properties.tabColor = "0E7490"
ws.sheet_view.showGridLines = False
widths(ws, {"A": 32, "B": 38, "C": 28, "D": 13, "E": 10, "F": 10, "G": 13, "H": 13, "I": 11, "J": 11, "K": 11, "L": 8, "M": 20})
title_band(ws, "五行石", "1-8 级行情 · 快速合成 · 配方对比 · 7/8 爆率盈亏线；所有公式按当前服务器与税率", 10)

section(ws, 4, "1-8 级行情", 4)
header_row(ws, 5, ["等级", "名称", "本服行情（金）", "税后净售价"], height=26)
for i, stone in enumerate(STONES, 6):
    set_cell(ws, i, 1, stone["level"], fmt="0", font=Font(name=FONT_NUM, size=10, bold=True))
    set_cell(ws, i, 2, stone["name"], font=BODY_FONT)
    set_formula(ws, i, 3, f"=INDEX('五行石价格'!$C$2:$S$9,MATCH($A{i},'五行石价格'!$A$2:$A$9,0),SrvCol)", fmt=NUM_2, font=Font(name=FONT_NUM, size=10, bold=True))
    set_formula(ws, i, 4, f"=$C{i}*(1-TaxRate)", fmt=NUM_2, font=Font(name=FONT_NUM, size=10))
band(ws, 6, 13, 4)
note(ws, 14, "价格优先取本服 JX3BOX 五行石拍卖，其次基准价；7/8 级样本少，务必按本服交易行校准。", 4, height=28)

section(ws, 16, "快速合成（直接消耗 1 级）", 10)
header_row(ws, 17, ["目标", "方案", "输入", "材料成本", "加工费", "精力", "总成本", "税后产值", "利润", "精力收益"], height=30)
fast = [r for r in STONE_RECIPES if r["id"] in ("fast_2", "fast_3", "fast_4", "fast_5", "fast_6")]
fast_row = 18
for r in fast:
    qty = r["inputs"][0]["qty"] if r["inputs"] else 0
    set_cell(ws, fast_row, 1, r["target"], fmt="0", font=Font(name=FONT_NUM, size=9, bold=True))
    set_cell(ws, fast_row, 2, r["name"], font=SMALL_FONT)
    set_cell(ws, fast_row, 3, f"1级 × {qty}", font=SMALL_FONT)
    set_formula(ws, fast_row, 4, f"=$C$6*{qty}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_cell(ws, fast_row, 5, r["fee"], fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_cell(ws, fast_row, 6, r["energy"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, fast_row, 7, f"=$D{fast_row}+$E{fast_row}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, fast_row, 8, f"=INDEX($D$6:$D$13,$A{fast_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, fast_row, 9, f"=$H{fast_row}-$G{fast_row}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, fast_row, 10, f"=IF($F{fast_row}>0,$I{fast_row}/$F{fast_row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    fast_row += 1
band(ws, 18, fast_row - 1, 10)

# 配方对比（按直接购买材料）
section(ws, 24, "配方对比（材料按直接购买价）", 13)
header_row(ws, 25, ["目标", "方案", "输入", "材料成本", "目标概率", "副产品净值", "单目标成本", "单目标精力", "税后产值", "单目标利润", "精力收益", "状态", "评分键"], height=34)
opt = [r for r in STONE_RECIPES if r["target"] in (3, 4, 5, 6)]
opt_row = 26
for r in opt:
    set_cell(ws, opt_row, 1, r["target"], fmt="0", font=Font(name=FONT_NUM, size=9, bold=True))
    set_cell(ws, opt_row, 2, r["name"], font=SMALL_FONT)
    parts = [f"{x['level']}级×{x['qty']}" for x in r["inputs"]]
    set_cell(ws, opt_row, 3, " + ".join(parts), font=SMALL_FONT)
    terms = [f"INDEX($C$6:$C$13,{x['level']})*{x['qty']}" for x in r["inputs"]]
    set_formula(ws, opt_row, 4, "=" + "+".join(terms) + f"+{r['fee']}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    target_chance = sum(o["chance"] for o in r["outcomes"] if o["level"] == r["target"])
    set_cell(ws, opt_row, 5, target_chance, fmt="0.00%", font=Font(name=FONT_NUM, size=9))
    by_terms = [f"{o['chance']}*INDEX($D$6:$D$13,{o['level']})" for o in r["outcomes"] if o["level"] != r["target"]]
    set_formula(ws, opt_row, 6, "=" + ("+".join(by_terms) if by_terms else "0"), fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, opt_row, 7, f"=IF($E{opt_row}>0,($D{opt_row}-$F{opt_row})/$E{opt_row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, opt_row, 8, f"=IF($E{opt_row}>0,{r['energy']}/$E{opt_row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, opt_row, 9, f"=INDEX($D$6:$D$13,$A{opt_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, opt_row, 10, f"=IF($G{opt_row}=\"\",\"\",$I{opt_row}-$G{opt_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, opt_row, 11, f"=IF(AND($J{opt_row}<>\"\",$H{opt_row}>0),$J{opt_row}/$H{opt_row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, opt_row, 12, f"=IF(AND($E{opt_row}>0,$G{opt_row}<>\"\"),\"有效\",\"—\")", font=SMALL_FONT, align=Alignment(horizontal="center"))
    set_formula(ws, opt_row, 13, f"=$A{opt_row}&\"|\"&TEXT($K{opt_row},\"0.000000\")", font=SMALL_FONT)
    opt_row += 1
band(ws, 26, opt_row - 1, 13)

# 3-6 推荐
section(ws, 46, "3-6 级推荐（按精力收益）", 6)
header_row(ws, 47, ["等级", "最佳方案", "单目标成本", "单目标精力", "单目标利润", "精力收益"], height=26)
for i, level in enumerate([3, 4, 5, 6], 48):
    set_cell(ws, i, 1, level, fmt="0", font=Font(name=FONT_NUM, size=10, bold=True))
    match = f"MATCH($A{i}&\"|\"&TEXT(MAXIFS($K$26:$K${opt_row-1},$A$26:$A${opt_row-1},$A{i},$L$26:$L${opt_row-1},\"有效\"),\"0.000000\"),$M$26:$M${opt_row-1},0)"
    set_formula(ws, i, 2, f"=IFERROR(INDEX($B$26:$B${opt_row-1},{match}),\"—\")", font=SMALL_FONT)
    set_formula(ws, i, 3, f"=IFERROR(INDEX($G$26:$G${opt_row-1},{match}),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 4, f"=IFERROR(INDEX($H$26:$H${opt_row-1},{match}),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 5, f"=IFERROR(INDEX($J$26:$J${opt_row-1},{match}),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 6, f"=IFERROR(INDEX($K$26:$K${opt_row-1},{match}),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))

# 7/8 盈亏线
section(ws, 52, "7/8 级爆率盈亏线（按本服行情）", 8)
header_row(ws, 53, ["方案", "成本", "目标净售价", "主产物净售价", "其他概率", "其他净值", "盈亏线", "当前爆率"], height=34)
jack = [r for r in STONE_RECIPES if r["id"] in ("jack_7", "jack_8", "jack_8_alt", "jack_8_from4")]
for i, r in enumerate(jack, 54):
    set_cell(ws, i, 1, r["name"], font=SMALL_FONT)
    terms = [f"INDEX($C$6:$C$13,{x['level']})*{x['qty']}" for x in r["inputs"]]
    set_formula(ws, i, 2, "=" + "+".join(terms) + f"+{r['fee']}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 3, f"=INDEX($D$6:$D$13,{r['target']})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 4, f"=INDEX($D$6:$D$13,{r['primary']})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    other = [o for o in r["outcomes"] if o["level"] not in (r["target"], r["primary"])]
    other_chance = sum(o["chance"] for o in other)
    other_terms = [f"{o['chance']}*INDEX($D$6:$D$13,{o['level']})" for o in other]
    set_cell(ws, i, 5, other_chance, fmt="0.00%", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 6, "=" + ("+".join(other_terms) if other_terms else "0"), fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 7, f"=IF($C{i}>$D{i},($B{i}-(1-$E{i})*$D{i}-$F{i})/($C{i}-$D{i}),\"—\")", fmt="0.00%", font=Font(name=FONT_NUM, size=9, bold=True))
    target_chance = sum(o["chance"] for o in r["outcomes"] if o["level"] == r["target"])
    set_cell(ws, i, 8, target_chance, fmt="0.00%", font=Font(name=FONT_NUM, size=9))

# KPI
section(ws, 60, "五行石速览", 6)
kpis = [
    ("5 级最佳精力收益", "=IFERROR(MAXIFS($F$48:$F$51,$A$48:$A$51,5),\"\")", NUM_2),
    ("6 级最佳精力收益", "=IFERROR(MAXIFS($F$48:$F$51,$A$48:$A$51,6),\"\")", NUM_2),
    ("快速 5 级利润", "=INDEX($I$18:$I$22,MATCH(5,$A$18:$A$22,0))", NUM_2),
    ("快速 6 级利润", "=INDEX($I$18:$I$22,MATCH(6,$A$18:$A$22,0))", NUM_2),
]
for i, (label, formula, fmt) in enumerate(kpis):
    col = 1 + (i % 2) * 3
    row = 61 + (i // 2) * 2
    ws.merge_cells(start_row=row, start_column=col, end_row=row, end_column=col + 2)
    c = ws.cell(row, col, label)
    c.font = Font(name=FONT_CN, size=9, color=MUTED)
    ws.merge_cells(start_row=row + 1, start_column=col, end_row=row + 1, end_column=col + 2)
    set_formula(ws, row + 1, col, formula, fmt=fmt, font=Font(name=FONT_CN, size=14, bold=True, color=NAVY))
    for rr in (row, row + 1):
        for cc in range(col, col + 3):
            ws.cell(rr, cc).fill = CARD_FILL
            ws.cell(rr, cc).border = BORDER

note(ws, 65, "配方对比按「材料直接购买价」计算，用于快速比较；逐层自制的最优金币/精力/收益三套方案（含 3-6 级递归计划）请在网页版「五行石」页查看。7/8 级爆率为示例，盈亏线才是本表结论。", 10, fill=NOTE_FILL, height=48)

# ---------------------------------------------------------------------------
# 设置
# ---------------------------------------------------------------------------
ws = wb.create_sheet("设置")
ws.sheet_properties.tabColor = AMBER
widths(ws, {"A": 18, "B": 28, "C": 16, "D": 60, "E": 2})
ws.sheet_view.showGridLines = False
title_band(ws, "设置", "所有 Sheet 共用这里的服务器与口径；改完立即重算。", 4)

section(ws, 5, "全局参数", 4)
settings = [
    (6, "服务器", server_names[0], "17 个当前服务器；来自 JX3BOX 全服拍卖。"),
    (7, "税率", 0.05, "交易行净售价扣除比例，默认 5%。"),
    (8, "成本口径", "市场价", "市场价：材料按行情；取最低：逐层比较市场价与自制成本。"),
    (9, "产量口径", "中间产量", "仅影响突破配方：最低 / 中间 / 最高产量分别独立核算。"),
    (10, "突破策略", "金最优", "金最优 / 省心；精力最优需逐级 ceil，Excel 端不提供，请在网页版查看。"),
    (11, "精力预算", 3000, "「技艺收益」满精力贪心分配使用的预算。"),
    (12, "服务器列", None, "自动定位「物价」中当前服务器的价格列。"),
    (13, "数据快照", None, "来自「物价」第一行的数据时间。"),
    (14, "经验合计", None, "49 级逐级经验之和；明细见「经验门槛」。"),
    (15, "经验模型", None, "1/3/8/11/14/30 级观测；点间插值，31 级起外推。"),
    (16, "采集经验", GATHER_EXP, "每次采集获得的经验。"),
]
for row, label, value, help_text in settings:
    set_cell(ws, row, 1, label, font=BOLD_FONT, fill=CARD_FILL)
    if value is not None:
        cell = set_cell(ws, row, 2, value, fill=INPUT_FILL, font=Font(name=FONT_CN, size=11, bold=True, color=INK))
        if label == "税率":
            cell.number_format = "0.0%"
        elif label in ("精力预算", "经验基数", "每级递增", "采集经验"):
            cell.number_format = "0"
    ws.merge_cells(start_row=row, start_column=3, end_row=row, end_column=4)
    h = ws.cell(row, 3, help_text)
    h.font = SMALL_FONT
    h.alignment = Alignment(wrap_text=True, vertical="center", indent=1)
    ws.row_dimensions[row].height = 26

set_formula(ws, 12, 2, "=IFERROR(MATCH(SrvName,'物价'!$D$1:$T$1,0),1)", fmt="0", fill=INPUT_FILL)
set_formula(ws, 13, 2, "=IFERROR(LEFT(SUBSTITUTE('物价'!$AM$2,\"T\",\" \"),16),\"—\")", fill=INPUT_FILL)
set_formula(ws, 14, 2, "=SUM('经验门槛'!$B$15:$B$63)", fmt="#,##0", fill=INPUT_FILL)
set_cell(ws, 15, 2, "观测点分段插值", fill=INPUT_FILL, font=Font(name=FONT_CN, size=10, bold=True, color=INK))
ws.cell(14, 2).font = Font(name=FONT_CN, size=11, bold=True, color=INK)
ws.cell(14, 2).alignment = Alignment(horizontal="left", vertical="center", indent=1)
ws.cell(15, 2).alignment = Alignment(horizontal="left", vertical="center", indent=1)
for row in (12, 13):
    ws.cell(row, 2).font = Font(name=FONT_CN, size=10, color=INK)
    ws.cell(row, 2).alignment = Alignment(horizontal="left", vertical="center", indent=1)

section(ws, 18, "口径速查", 4)
quick = [
    ("成本", "Σ 材料数量 × 采用成本 + 手续费"),
    ("税后产值", "Σ 产物数量 × 概率 × 市场价 × (1 − 税率)"),
    ("利润", "税后产值 − 成本"),
    ("精力收益", "利润 ÷ 单次精力"),
    ("晋秩成本", "30/35/40/45 级突破任务材料 × 本服价格"),
    ("净收益", "1→50 制作利润 − 晋秩成本"),
]
r = 19
for k, v in quick:
    set_cell(ws, r, 1, k, font=BOLD_FONT, fill=CARD_FILL)
    ws.merge_cells(start_row=r, start_column=2, end_row=r, end_column=4)
    set_cell(ws, r, 2, v, font=BODY_FONT)
    r += 1

note(
    ws,
    26,
    "修改 B6:B11 即可切换全部结果。B12:B15 为自动单元格，请勿手改。服务器下拉来自隐藏的「服务器」Sheet。",
    4,
    fill=NOTE_FILL,
    height=34,
)

# Defined names. The 设置 B6..B11 values are copied into named cells for short formulas.
ws["B6"] = server_names[0]
ws["B7"] = 0.05
ws["B8"] = "市场价"
ws["B9"] = "中间产量"
ws["B10"] = "金最优"
ws["B11"] = 3000
ws["B7"].number_format = "0.0%"

for name, ref in {
    "SrvName": "设置!$B$6",
    "TaxRate": "设置!$B$7",
    "Basis": "设置!$B$8",
    "YieldMode": "设置!$B$9",
    "Strategy": "设置!$B$10",
    "EnergyBudget": "设置!$B$11",
    "SrvCol": "设置!$B$12",
    "ExpTotal": "设置!$B$14",
    "GatherExp": "设置!$B$16",
}.items():
    wb.defined_names.add(DefinedName(name, attr_text=ref))

dv = DataValidation(type="list", formula1="服务器!$B$2:$B$18", allow_blank=False)
ws.add_data_validation(dv)
dv.add("B6")
for cell, formula in {
    "B8": '"市场价,取最低"',
    "B9": '"最低产量,中间产量,最高产量"',
    "B10": '"金最优,省心"',
}.items():
    d = DataValidation(type="list", formula1=formula, allow_blank=False)
    ws.add_data_validation(d)
    d.add(cell)

# ---------------------------------------------------------------------------
# 服务器（隐藏）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("服务器")
ws.sheet_properties.tabColor = "94A3B8"
widths(ws, {"A": 20, "B": 14, "C": 16, "D": 14, "E": 20})
header_row(ws, 1, ["服务器ID", "服务器", "大区", "技艺", "技艺ID"])
for i, s in enumerate(servers, 2):
    ws.cell(i, 1, s["id"]).font = BODY_FONT
    ws.cell(i, 2, s["name"]).font = BODY_FONT
    ws.cell(i, 3, s["region"]).font = BODY_FONT
for i, s in enumerate(skills, 2):
    ws.cell(i, 4, s["name"]).font = BODY_FONT
    ws.cell(i, 5, s["id"]).font = BODY_FONT
ws.sheet_state = "hidden"

# ---------------------------------------------------------------------------
# 经验门槛（用户观测点）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("经验门槛")
ws.sheet_properties.tabColor = "D97706"
ws.sheet_view.showGridLines = False
widths(ws, {"A": 8, "B": 14, "C": 12, "D": 14})
title_band(ws, "突破经验门槛", "按用户观测点重算；点间线性插值，31 级起按 14→30 段外推，四舍五入到 10。", 4)

section(ws, 4, "观测点", 4)
header_row(ws, 5, ["等级", "观测经验", "说明"])
obs_notes = {1: "1→2 级", 3: "3→4 级", 8: "8→9 级", 11: "11→12 级", 14: "14→15 级", 30: "30→31 级"}
for i, obs in enumerate(EXP_OBS, 6):
    set_cell(ws, i, 1, obs["level"], fmt="0", font=Font(name=FONT_NUM, size=10, bold=True))
    set_cell(ws, i, 2, obs["exp"], fmt="#,##0", font=Font(name=FONT_NUM, size=10, bold=True, color=AMBER))
    set_cell(ws, i, 3, obs_notes.get(obs["level"], ""), font=BODY_FONT)

section(ws, 13, "逐级经验表（1→2 … 49→50）", 4)
header_row(ws, 14, ["等级", "需要经验", "来源", "累计经验"])
for i, row in enumerate(EXP_TABLE, 15):
    set_cell(ws, i, 1, row["level"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 2, row["need"], fmt="#,##0", font=Font(name=FONT_NUM, size=9, bold=True))
    set_cell(ws, i, 3, row["source"], font=SMALL_FONT, align=Alignment(horizontal="center"))
    set_formula(ws, i, 4, f"=SUM($B$15:B{i})", fmt="#,##0", font=Font(name=FONT_NUM, size=9, color=MUTED))
band(ws, 15, 63, 4)
set_cell(ws, 64, 1, "合计", font=BOLD_FONT, fill=CARD_FILL)
set_cell(ws, 64, 2, "=SUM($B$15:$B$63)", fmt="#,##0", font=Font(name=FONT_NUM, size=10, bold=True, color=AMBER), fill=CARD_FILL)
set_cell(ws, 64, 3, "", font=SMALL_FONT, fill=CARD_FILL)
set_cell(ws, 64, 4, "", font=SMALL_FONT, fill=CARD_FILL)
note(ws, 66, "观测：1→2 250、3→4 510、8→9 1150、11→12 1370、14→15 1410、30→31 1650。31 级起按 14→30 段 (+15/级) 外推，合计 " + f"{EXP_TOTAL:,}" + " 经验。直接修改 B 列即可按自己的游戏内数据重算路线。", 4, height=44)

# ---------------------------------------------------------------------------
# 物价
# ---------------------------------------------------------------------------
ws = wb.create_sheet("物价")
ws.sheet_properties.tabColor = "0E7490"
from openpyxl.utils import get_column_letter
widths(ws, {"A": 16, "B": 18, "C": 10})
for i in range(len(server_names)):
    ws.column_dimensions[get_column_letter(4 + i)].width = 11
    ws.column_dimensions[get_column_letter(21 + i)].width = 11
ws.column_dimensions[get_column_letter(38)].width = 12
ws.column_dimensions[get_column_letter(39)].width = 18
header_row(ws, 1, ["物品键", "物品名称", "类别"] + server_names + ["突破·" + n for n in server_names] + ["基准价", "数据时间"], height=44)
for i, item in enumerate(master_items, 2):
    set_cell(ws, i, 1, item["key"], font=SMALL_FONT)
    set_cell(ws, i, 2, item["name"], font=BODY_FONT)
    set_cell(ws, i, 3, item["category"], font=SMALL_FONT)
    for j, sid in enumerate(server_ids):
        market = item.get("marketPrices", item.get("prices", {})).get(sid)
        cell = set_cell(ws, i, 4 + j, market, fmt=NUM_2, font=Font(name=FONT_NUM, size=9, color=INK))
        cell.alignment = Alignment(horizontal="right")
        bt = item.get("btPrices", {}).get(sid)
        cell = set_cell(ws, i, 21 + j, bt, fmt=NUM_2, font=Font(name=FONT_NUM, size=9, color=INK))
        cell.alignment = Alignment(horizontal="right")
    set_cell(ws, i, 38, item.get("base"), fmt=NUM_2, font=Font(name=FONT_NUM, size=9, color=MUTED))
    set_cell(ws, i, 39, SNAPSHOT, font=SMALL_FONT)
ws.freeze_panes = "D2"
band(ws, 2, LAST_PRICE, 39)
note(ws, LAST_PRICE + 2, "↑ 这是内置快照：D:T 为「行情价」（技艺收益用，缺报价时回退基准价），U:AL 为「突破价」（突破用，缺失即缺价，不回退基准价）。刷新时请把查询结果放在 A1，并保留同样的表头。", 39, height=40)

# ---------------------------------------------------------------------------
# 物品（目录 267 项）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("物品")
ws.sheet_properties.tabColor = "64748B"
widths(ws, {"A": 20, "B": 18, "C": 10, "D": 7, "E": 15, "F": 13, "G": 13, "H": 13, "I": 10, "J": 12, "K": 42})
header_row(ws, 1, ["物品ID", "物品名称", "类型", "品阶", "JX3BOX键", "市场价", "自制成本", "采用成本", "价格状态", "基准价", "备注"])
for i, item in enumerate(MODEL["catalogItems"], 2):
    set_cell(ws, i, 1, item["id"], font=SMALL_FONT)
    set_cell(ws, i, 2, item["name"], font=BODY_FONT)
    kind = {"material": "材料", "product": "产物"}.get(item.get("kind"), "其他")
    set_cell(ws, i, 3, kind, font=SMALL_FONT)
    set_cell(ws, i, 4, item.get("tier"), fmt="0", font=SMALL_FONT)
    key = item.get("key") or ""
    set_cell(ws, i, 5, key, font=SMALL_FONT)
    set_formula(
        ws,
        i,
        6,
        f"=IFERROR(IF(INDEX('物价'!$D$2:$T$2000,MATCH($E{i},'物价'!$A$2:$A$2000,0),SrvCol)=0,\"\",INDEX('物价'!$D$2:$T$2000,MATCH($E{i},'物价'!$A$2:$A$2000,0),SrvCol)),\"\")",
        fmt=NUM_2,
        font=Font(name=FONT_NUM, size=9, color=INK),
        align=Alignment(horizontal="right"),
    )
    set_formula(
        ws,
        i,
        7,
        f"=IF(Basis=\"市场价\",\"\",IF(COUNTIFS('配方产出'!$C:$C,$A{i},'配方产出'!$K:$K,\"可用\")=0,\"\",MINIFS('配方产出'!$I:$I,'配方产出'!$C:$C,$A{i},'配方产出'!$K:$K,\"可用\")))",
        fmt=NUM_2,
        font=Font(name=FONT_NUM, size=9, color=INK),
        align=Alignment(horizontal="right"),
    )
    set_formula(
        ws,
        i,
        8,
        f"=IF($F{i}=\"\",IF($J{i}>0,$J{i},0),IF(Basis=\"市场价\",$F{i},IF($G{i}=\"\",$F{i},MIN($F{i},$G{i}))))",
        fmt=NUM_2,
        font=Font(name=FONT_NUM, size=9, bold=True, color=INK),
        align=Alignment(horizontal="right"),
    )
    set_formula(
        ws,
        i,
        9,
        f"=IF($H{i}>0,IF(OR($F{i}=\"\",LEFT($E{i},8)=\"catalog:\"),\"基准价\",\"行情\"),\"缺价\")",
        font=SMALL_FONT,
        align=Alignment(horizontal="center"),
    )
    set_cell(ws, i, 10, item.get("base") or 0, fmt=NUM_2, font=Font(name=FONT_NUM, size=9, color=MUTED))
    set_cell(ws, i, 11, item.get("note", ""), font=SMALL_FONT)
ws.freeze_panes = "C2"
ws.auto_filter.ref = f"A1:K{LAST_ITEM}"
band(ws, 2, LAST_ITEM, 11)

# ---------------------------------------------------------------------------
# 配方产出（每配方 × 每产物；取最低的单位成本来源）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("配方产出")
ws.sheet_properties.tabColor = "64748B"
widths(ws, {"A": 20, "B": 22, "C": 20, "D": 18, "E": 9, "F": 13, "G": 10, "H": 13, "I": 13, "J": 12, "K": 10, "L": 10})
header_row(ws, 1, ["配方ID", "配方名称", "产出物品ID", "产出物品", "产出数量", "材料成本", "手续费", "总成本", "单位成本", "技艺", "类型", "可用性"])
out_row = 2
for recipe in catalog_recipes:
    for out in recipe["outputs"]:
        set_cell(ws, out_row, 1, recipe["id"], font=SMALL_FONT)
        set_cell(ws, out_row, 2, recipe["name"], font=BODY_FONT)
        set_cell(ws, out_row, 3, out["itemId"], font=SMALL_FONT)
        set_cell(ws, out_row, 4, out["name"], font=BODY_FONT)
        set_cell(ws, out_row, 5, out["qty"], fmt="0.00", font=Font(name=FONT_NUM, size=9))
        set_formula(ws, out_row, 6, f"=SUMIFS('材料明细'!$G:$G,'材料明细'!$A:$A,$A{out_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_cell(ws, out_row, 7, recipe["fee"], fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, out_row, 8, f"=$F{out_row}+$G{out_row}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        if recipe["kind"] == "craft":
            set_formula(ws, out_row, 9, f"=IF($E{out_row}>0,$H{out_row}/$E{out_row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        else:
            set_cell(ws, out_row, 9, "", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_cell(ws, out_row, 10, skill_by_id.get(recipe["skillId"], {}).get("name", recipe["skillId"]), font=SMALL_FONT)
        set_cell(ws, out_row, 11, "采集" if recipe["kind"] == "gather" else "制造", font=SMALL_FONT)
        set_cell(ws, out_row, 12, "采集" if recipe["kind"] == "gather" else "可用", font=SMALL_FONT)
        out_row += 1
LAST_OUTPUT = out_row - 1
band(ws, 2, LAST_OUTPUT, 12)

# ---------------------------------------------------------------------------
# 材料明细（长表）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("材料明细")
ws.sheet_properties.tabColor = "64748B"
widths(ws, {"A": 20, "B": 22, "C": 20, "D": 18, "E": 9, "F": 13, "G": 13})
header_row(ws, 1, ["配方ID", "配方名称", "材料ID", "材料名称", "数量", "材料单价", "小计"])
mat_row = 2
for recipe in craft_recipes:
    for mat in recipe["materials"]:
        set_cell(ws, mat_row, 1, recipe["id"], font=SMALL_FONT)
        set_cell(ws, mat_row, 2, recipe["name"], font=BODY_FONT)
        set_cell(ws, mat_row, 3, mat["itemId"], font=SMALL_FONT)
        set_cell(ws, mat_row, 4, mat["name"], font=BODY_FONT)
        set_cell(ws, mat_row, 5, mat["qty"], fmt="0.00", font=Font(name=FONT_NUM, size=9))
        set_formula(
            ws,
            mat_row,
            6,
            f"=IFERROR(IF(INDEX('物品'!$H$2:$H${LAST_ITEM},MATCH($C{mat_row},'物品'!$A$2:$A${LAST_ITEM},0))=0,\"\",INDEX('物品'!$H$2:$H${LAST_ITEM},MATCH($C{mat_row},'物品'!$A$2:$A${LAST_ITEM},0))),\"\")",
            fmt=NUM_2,
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, mat_row, 7, f"=IF($F{mat_row}=\"\",\"\",$E{mat_row}*$F{mat_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        mat_row += 1
LAST_MAT = mat_row - 1
band(ws, 2, LAST_MAT, 7)

# ---------------------------------------------------------------------------
# 产物明细（长表）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("产物明细")
ws.sheet_properties.tabColor = "64748B"
widths(ws, {"A": 20, "B": 22, "C": 10, "D": 20, "E": 18, "F": 9, "G": 9, "H": 13, "I": 13, "J": 13, "K": 7})
header_row(ws, 1, ["配方ID", "配方名称", "技艺", "产物ID", "产物", "数量", "概率", "市场价", "毛值", "税后净值", "缺价"])
out_row = 2
for recipe in catalog_recipes:
    for out in recipe["outputs"]:
        set_cell(ws, out_row, 1, recipe["id"], font=SMALL_FONT)
        set_cell(ws, out_row, 2, recipe["name"], font=BODY_FONT)
        set_cell(ws, out_row, 3, skill_by_id.get(recipe["skillId"], {}).get("name", recipe["skillId"]), font=SMALL_FONT)
        set_cell(ws, out_row, 4, out["itemId"], font=SMALL_FONT)
        set_cell(ws, out_row, 5, out["name"], font=BODY_FONT)
        set_cell(ws, out_row, 6, out["qty"], fmt="0.000", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, out_row, 7, out["chance"], fmt="0.0%", font=Font(name=FONT_NUM, size=9))
        set_formula(
            ws,
            out_row,
            8,
            f"=IFERROR(IF(INDEX('物品'!$F$2:$F${LAST_ITEM},MATCH($D{out_row},'物品'!$A$2:$A${LAST_ITEM},0))=0,\"\",INDEX('物品'!$F$2:$F${LAST_ITEM},MATCH($D{out_row},'物品'!$A$2:$A${LAST_ITEM},0))),\"\")",
            fmt=NUM_2,
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, out_row, 9, f"=IF($H{out_row}=\"\",\"\",$F{out_row}*$G{out_row}*$H{out_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, out_row, 10, f"=IF($I{out_row}=\"\",\"\",$I{out_row}*(1-TaxRate))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, out_row, 11, f"=IF(OR($H{out_row}=\"\",$H{out_row}<=0),1,0)", fmt="0", font=Font(name=FONT_NUM, size=9))
        out_row += 1
LAST_PROD = out_row - 1
band(ws, 2, LAST_PROD, 11)

# ---------------------------------------------------------------------------
# 配方收益（175 条）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("配方收益")
ws.sheet_properties.tabColor = "2563EB"
widths(ws, {"A": 20, "B": 10, "C": 8, "D": 24, "E": 7, "F": 6, "G": 9, "H": 9, "I": 13, "J": 13, "K": 13, "L": 13, "M": 11, "N": 9, "O": 7, "P": 8, "Q": 13, "R": 46})
header_row(ws, 1, ["配方ID", "技艺", "类型", "配方名称", "等级", "品阶", "单次精力", "手续费", "材料成本", "产物毛值", "税后产值", "利润", "精力收益", "利润率", "排名", "状态", "评分", "备注"])
for i, recipe in enumerate(catalog_recipes, 2):
    set_cell(ws, i, 1, recipe["id"], font=SMALL_FONT)
    set_cell(ws, i, 2, skill_by_id.get(recipe["skillId"], {}).get("name", recipe["skillId"]), font=BODY_FONT)
    set_cell(ws, i, 3, "采集" if recipe["kind"] == "gather" else "制造", font=SMALL_FONT)
    set_cell(ws, i, 4, recipe["name"], font=BOLD_FONT)
    set_cell(ws, i, 5, recipe["level"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 6, recipe["tier"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 7, recipe["energy"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 8, recipe["fee"], fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 9, f"=SUMIFS('材料明细'!$G:$G,'材料明细'!$A:$A,$A{i})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 10, f"=SUMIFS('产物明细'!$I:$I,'产物明细'!$A:$A,$A{i})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 11, f"=$J{i}*(1-TaxRate)", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 12, f"=$K{i}-$I{i}-$H{i}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, color=INK))
    set_formula(ws, i, 13, f"=IF($G{i}>0,$L{i}/$G{i},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True, color=INK))
    set_formula(ws, i, 14, f"=IF($K{i}>0,$L{i}/$K{i},\"\")", fmt=PCT, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 15, f"=IF($Q{i}=\"\",\"\",RANK($Q{i},$Q$2:$Q${LAST_CAT},0))", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(
        ws,
        i,
        16,
        f"=IF(OR($G{i}<=0,SUMIFS('产物明细'!$K:$K,'产物明细'!$A:$A,$A{i})>0,COUNTIFS('材料明细'!$A:$A,$A{i},'材料明细'!$F:$F,\"\")>0),\"缺价\",\"有效\")",
        font=SMALL_FONT,
        align=Alignment(horizontal="center"),
    )
    set_formula(ws, i, 17, f"=IF(AND($P{i}=\"有效\",ISNUMBER($M{i})),$M{i}+ROW()/10000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 18, recipe.get("note", ""), font=SMALL_FONT)
ws.freeze_panes = "D2"
ws.auto_filter.ref = f"A1:R{LAST_CAT}"
band(ws, 2, LAST_CAT, 18)
ws.conditional_formatting.add(f"L2:L{LAST_CAT}", CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor=RED_BG), font=Font(name=FONT_CN, size=10, color=RED)))
ws.conditional_formatting.add(f"M2:M{LAST_CAT}", ColorScaleRule(start_type="min", start_color="FEE2E2", mid_type="percentile", mid_value=50, mid_color="FEF3C7", end_type="max", end_color="BBF7D0"))

# ---------------------------------------------------------------------------
# 分配（满精力贪心底表）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("分配")
ws.sheet_properties.tabColor = "94A3B8"
widths(ws, {"A": 6, "B": 8, "C": 24, "D": 10, "E": 9, "F": 13, "G": 11, "H": 7, "I": 9, "J": 10, "K": 13, "L": 10})
header_row(ws, 1, ["排名", "配方行", "配方", "技艺", "精力", "利润", "精力收益", "符合", "分配次数", "分配精力", "分配利润", "累计精力"])
for i in range(2, LAST_ALLOC + 1):
    set_cell(ws, i, 1, i - 1, fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 2, f"=IFERROR(MATCH(LARGE('配方收益'!$Q$2:$Q${LAST_CAT},$A{i}),'配方收益'!$Q$2:$Q${LAST_CAT},0),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 3, f"=IF($B{i}=\"\",\"—\",INDEX('配方收益'!$D$2:$D${LAST_CAT},$B{i}))", font=BODY_FONT)
    set_formula(ws, i, 4, f"=IF($B{i}=\"\",\"\",INDEX('配方收益'!$B$2:$B${LAST_CAT},$B{i}))", font=SMALL_FONT)
    set_formula(ws, i, 5, f"=IF($B{i}=\"\",\"\",INDEX('配方收益'!$G$2:$G${LAST_CAT},$B{i}))", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 6, f"=IF($B{i}=\"\",\"\",INDEX('配方收益'!$L$2:$L${LAST_CAT},$B{i}))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 7, f"=IF($B{i}=\"\",\"\",INDEX('配方收益'!$M$2:$M${LAST_CAT},$B{i}))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(
        ws,
        i,
        8,
        f"=IF($B{i}=\"\",0,IF(AND(INDEX('配方收益'!$P$2:$P${LAST_CAT},$B{i})=\"有效\",$F{i}>0,$E{i}>0),1,0))",
        fmt="0",
        font=Font(name=FONT_NUM, size=9),
    )
    set_formula(
        ws,
        i,
        9,
        f"=IF($H{i}=0,0,IF((IF(ROW()=2,0,$L{i-1}))+$E{i}>EnergyBudget,0,INT((EnergyBudget-(IF(ROW()=2,0,$L{i-1})))/$E{i})))",
        fmt="0",
        font=Font(name=FONT_NUM, size=9),
    )
    set_formula(ws, i, 10, f"=$I{i}*$E{i}", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 11, f"=$I{i}*$F{i}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 12, f"=IF(ROW()=2,0,$L{i-1})+$J{i}", fmt="0", font=Font(name=FONT_NUM, size=9))
band(ws, 2, LAST_ALLOC, 12)

# ---------------------------------------------------------------------------
# 技艺收益
# ---------------------------------------------------------------------------
ws = wb.create_sheet("技艺收益")
ws.sheet_properties.tabColor = GREEN
ws.sheet_view.showGridLines = False
widths(ws, {"A": 8, "B": 26, "C": 10, "D": 10, "E": 14, "F": 14, "G": 11, "H": 10, "I": 13, "J": 12, "K": 3, "L": 8, "M": 8, "N": 7, "O": 13, "P": 30, "Q": 11, "R": 13, "S": 7})
title_band(ws, "技艺收益", "全配方排行 · 按技艺汇总 · 采集 vs 制造 · 满精力贪心分配", 10)

kpi_card(ws, 4, 1, "最佳精力收益（金/点）", "=IFERROR(MAXIFS('配方收益'!$M$2:$M$" + str(LAST_CAT) + ",'配方收益'!$P$2:$P$" + str(LAST_CAT) + ",\"有效\"),\"\")", NUM_2, 2)
kpi_card(ws, 4, 3, "最佳制品", "=IFERROR(INDEX('配方收益'!$D$2:$D$" + str(LAST_CAT) + ",MATCH(MAXIFS('配方收益'!$Q$2:$Q$" + str(LAST_CAT) + ",'配方收益'!$P$2:$P$" + str(LAST_CAT) + ",\"有效\"),'配方收益'!$Q$2:$Q$" + str(LAST_CAT) + ",0)),\"—\")", None, 4)
kpi_card(ws, 4, 7, "有效配方 / 盈利", "=COUNTIF('配方收益'!$P$2:$P$" + str(LAST_CAT) + ",\"有效\")&\" / \"&COUNTIFS('配方收益'!$P$2:$P$" + str(LAST_CAT) + ",\"有效\",'配方收益'!$L$2:$L$" + str(LAST_CAT) + ",\">0\")", None, 3)
kpi_card(ws, 7, 1, "精力预算", "=EnergyBudget", "0", 2)
kpi_card(ws, 7, 3, "已用 / 剩余", "=SUM(分配!$J$2:$J$" + str(LAST_ALLOC) + ")&\" / \"&(EnergyBudget-SUM(分配!$J$2:$J$" + str(LAST_ALLOC) + "))", None, 2)
kpi_card(ws, 7, 5, "分配利润（金）", "=SUM(分配!$K$2:$K$" + str(LAST_ALLOC) + ")", NUM_0, 2)
kpi_card(ws, 7, 8, "入选配方", "=COUNTIF(分配!$I$2:$I$" + str(LAST_ALLOC) + ",\">0\")", "0", 3)

# TOP 20 -------------------------------------------------------------------
section(ws, 10, "TOP 20 · 按精力收益排序", 10, fill=HEADER_FILL)
header_row(ws, 11, ["#", "配方", "技艺", "精力", "利润", "精力收益", "分配次数", "分配精力", "分配利润", "状态"], height=26)
for k in range(1, 21):
    row = 11 + k
    set_cell(ws, row, 1, k, fmt="0", font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, row, 2, f"=IFERROR(INDEX(分配!$C$2:$C${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),\"—\")", font=BOLD_FONT)
    set_formula(ws, row, 3, f"=IFERROR(INDEX(分配!$D$2:$D${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),\"\")", font=SMALL_FONT)
    set_formula(ws, row, 4, f"=IFERROR(INDEX(分配!$E$2:$E${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 5, f"=IFERROR(INDEX(分配!$F$2:$F${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 6, f"=IFERROR(INDEX(分配!$G$2:$G${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, row, 7, f"=IFERROR(INDEX(分配!$I$2:$I${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),0)", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 8, f"=IFERROR(INDEX(分配!$J$2:$J${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),0)", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 9, f"=IFERROR(INDEX(分配!$K$2:$K${LAST_ALLOC},MATCH($A{row},分配!$A$2:$A${LAST_ALLOC},0)),0)", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 10, f"=IF($G{row}>0,\"入选\",\"未入选\")", font=SMALL_FONT, align=Alignment(horizontal="center"))
band(ws, 12, 31, 10)
ws.conditional_formatting.add("F12:F31", ColorScaleRule(start_type="min", start_color="FEE2E2", mid_type="percentile", mid_value=50, mid_color="FEF3C7", end_type="max", end_color="BBF7D0"))

# 按技艺汇总 ---------------------------------------------------------------
ws.merge_cells("L10:S10")
for c in range(12, 20):
    ws.cell(10, c).fill = HEADER_FILL
ws["L10"] = "按技艺汇总"
ws["L10"].font = SECTION_FONT
ws["L10"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
summary_headers = ["技艺", "配方数", "有效", "最佳精力收益", "最佳制品", "平均", "总利润", "亏损"]
for j, h in enumerate(summary_headers, 12):
    cell = ws.cell(11, j, h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = BORDER
for idx, skill in enumerate(skills, 12):
    row = idx
    set_cell(ws, row, 12, skill["name"], font=BOLD_FONT)
    set_formula(ws, row, 13, f"=COUNTIF('配方收益'!$B$2:$B${LAST_CAT},$L{row})", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 14, f"=COUNTIFS('配方收益'!$B$2:$B${LAST_CAT},$L{row},'配方收益'!$P$2:$P${LAST_CAT},\"有效\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 15, f"=IFERROR(MAXIFS('配方收益'!$M$2:$M${LAST_CAT},'配方收益'!$B$2:$B${LAST_CAT},$L{row},'配方收益'!$P$2:$P${LAST_CAT},\"有效\"),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, row, 16, f"=IFERROR(INDEX('配方收益'!$D$2:$D${LAST_CAT},MATCH(MAXIFS('配方收益'!$Q$2:$Q${LAST_CAT},'配方收益'!$B$2:$B${LAST_CAT},$L{row},'配方收益'!$P$2:$P${LAST_CAT},\"有效\"),'配方收益'!$Q$2:$Q${LAST_CAT},0)),\"—\")", font=SMALL_FONT)
    set_formula(ws, row, 17, f"=IFERROR(AVERAGEIFS('配方收益'!$M$2:$M${LAST_CAT},'配方收益'!$B$2:$B${LAST_CAT},$L{row},'配方收益'!$P$2:$P${LAST_CAT},\"有效\"),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 18, f"=SUMIFS('配方收益'!$L$2:$L${LAST_CAT},'配方收益'!$B$2:$B${LAST_CAT},$L{row})", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 19, f"=COUNTIFS('配方收益'!$B$2:$B${LAST_CAT},$L{row},'配方收益'!$L$2:$L${LAST_CAT},\"<0\")", fmt="0", font=Font(name=FONT_NUM, size=9))

# 采集 vs 制造 -------------------------------------------------------------
ws.merge_cells("L21:P21")
for c in range(12, 17):
    ws.cell(21, c).fill = HEADER_FILL
ws["L21"] = "采集 vs 制造"
ws["L21"].font = SECTION_FONT
ws["L21"].alignment = Alignment(horizontal="left", vertical="center", indent=1)
for j, h in enumerate(["类型", "配方数", "平均精力收益", "总利润", "最佳制品"], 12):
    cell = ws.cell(22, j, h)
    cell.fill = HEADER_FILL
    cell.font = HEADER_FONT
    cell.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
    cell.border = BORDER
for idx, kind in enumerate(["制造", "采集"], 23):
    row = idx
    set_cell(ws, row, 12, kind, font=BOLD_FONT)
    set_formula(ws, row, 13, f"=COUNTIF('配方收益'!$C$2:$C${LAST_CAT},$L{row})", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 14, f"=IFERROR(AVERAGEIFS('配方收益'!$M$2:$M${LAST_CAT},'配方收益'!$C$2:$C${LAST_CAT},$L{row},'配方收益'!$P$2:$P${LAST_CAT},\"有效\"),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 15, f"=SUMIFS('配方收益'!$L$2:$L${LAST_CAT},'配方收益'!$C$2:$C${LAST_CAT},$L{row})", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 16, f"=IFERROR(INDEX('配方收益'!$D$2:$D${LAST_CAT},MATCH(MAXIFS('配方收益'!$Q$2:$Q${LAST_CAT},'配方收益'!$C$2:$C${LAST_CAT},$L{row}),'配方收益'!$Q$2:$Q${LAST_CAT},0)),\"—\")", font=SMALL_FONT)

note(
    ws,
    33,
    "「分配次数」按精力收益从高到低贪心装入预算：能装满则装满，装不下则跳过。精力收益为负或状态为「缺价」的配方不参与分配。",
    10,
    height=34,
)

chart = BarChart()
chart.type = "bar"
chart.style = 10
chart.title = "各技艺最佳精力收益（金/点）"
chart.y_axis.title = "金/点"
chart.x_axis.title = None
data = Reference(ws, min_col=15, min_row=11, max_row=19)
cats = Reference(ws, min_col=12, min_row=12, max_row=19)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
chart.height = 7.5
chart.width = 15
chart.legend = None
ws.add_chart(chart, "A34")

# ---------------------------------------------------------------------------
# 突破物品
# ---------------------------------------------------------------------------
bt_items = [None] * 1355
for item in master_items:
    idx = item.get("btIndex")
    if idx is not None:
        bt_items[idx] = item
if any(x is None for x in bt_items):
    raise SystemExit("breakthrough item index is incomplete")

ws = wb.create_sheet("突破物品")
ws.sheet_properties.tabColor = "7C3AED"
widths(ws, {"A": 7, "B": 15, "C": 24, "D": 7, "E": 13, "F": 8})
header_row(ws, 1, ["索引", "物品键", "物品名称", "品质", "市场价", "状态"])
for i, item in enumerate(bt_items, 2):
    set_cell(ws, i, 1, i - 1, fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, i, 2, item["key"], font=SMALL_FONT)
    set_cell(ws, i, 3, item["name"], font=BODY_FONT)
    set_cell(ws, i, 4, item.get("quality"), fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(
        ws,
        i,
        5,
        f"=IFERROR(IF(INDEX('物价'!$U$2:$AL$2000,MATCH($B{i},'物价'!$A$2:$A$2000,0),SrvCol)=0,\"\",INDEX('物价'!$U$2:$AL$2000,MATCH($B{i},'物价'!$A$2:$A$2000,0),SrvCol)),\"\")",
        fmt=NUM_2,
        font=Font(name=FONT_NUM, size=9),
        align=Alignment(horizontal="right"),
    )
    set_formula(ws, i, 6, f"=IF($E{i}=\"\",\"缺价\",\"行情\")", font=SMALL_FONT, align=Alignment(horizontal="center"))
LAST_BT_ITEM = 1356
ws.freeze_panes = "C2"
band(ws, 2, LAST_BT_ITEM, 6)

# ---------------------------------------------------------------------------
# 突破材料
# ---------------------------------------------------------------------------
ws = wb.create_sheet("突破材料")
ws.sheet_properties.tabColor = "7C3AED"
widths(ws, {"A": 11, "B": 22, "C": 8, "D": 22, "E": 9, "F": 12, "G": 12})
header_row(ws, 1, ["配方ID", "配方名称", "材料索引", "材料名称", "数量", "材料单价", "小计"])
bt_mat_row = 2
for seq, recipe in enumerate(bt_recipes, 1):
    for mat in recipe["materials"]:
        set_cell(ws, bt_mat_row, 1, seq, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, bt_mat_row, 2, recipe["name"], font=SMALL_FONT)
        set_cell(ws, bt_mat_row, 3, mat["btIndex"] + 1, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, bt_mat_row, 4, mat["name"], font=SMALL_FONT)
        set_cell(ws, bt_mat_row, 5, mat["qty"], fmt="0.00", font=Font(name=FONT_NUM, size=9))
        set_formula(
            ws,
            bt_mat_row,
            6,
            f"=IFERROR(INDEX('突破物品'!$E$2:$E${LAST_BT_ITEM},MATCH($C{bt_mat_row},'突破物品'!$A$2:$A${LAST_BT_ITEM},0)),\"\")",
            fmt=NUM_2,
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, bt_mat_row, 7, f"=IF($F{bt_mat_row}=\"\",\"\",$E{bt_mat_row}*$F{bt_mat_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        bt_mat_row += 1
LAST_BT_MAT = bt_mat_row - 1
band(ws, 2, LAST_BT_MAT, 7)

# ---------------------------------------------------------------------------
# 突破产物
# ---------------------------------------------------------------------------
ws = wb.create_sheet("突破产物")
ws.sheet_properties.tabColor = "7C3AED"
widths(ws, {"A": 11, "B": 22, "C": 8, "D": 22, "E": 8, "F": 8, "G": 7, "H": 10, "I": 12, "J": 12, "K": 12, "L": 7})
header_row(ws, 1, ["配方ID", "配方名称", "产物索引", "产物名称", "最小产量", "最大产量", "概率", "期望产量", "单价", "毛值", "税后净值", "缺价"])
bt_out_row = 2
for seq, recipe in enumerate(bt_recipes, 1):
    for out in recipe["outputs"]:
        set_cell(ws, bt_out_row, 1, seq, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, bt_out_row, 2, recipe["name"], font=SMALL_FONT)
        set_cell(ws, bt_out_row, 3, out["btIndex"] + 1, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, bt_out_row, 4, out["name"], font=SMALL_FONT)
        set_cell(ws, bt_out_row, 5, out["qtyMin"], fmt="0.00", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, bt_out_row, 6, out["qtyMax"], fmt="0.00", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, bt_out_row, 7, out["chance"], fmt="0.0%", font=Font(name=FONT_NUM, size=9))
        set_formula(
            ws,
            bt_out_row,
            8,
            f"=IF(YieldMode=\"最低产量\",$E{bt_out_row},IF(YieldMode=\"最高产量\",$F{bt_out_row},($E{bt_out_row}+$F{bt_out_row})/2))*$G{bt_out_row}",
            fmt="0.000",
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(
            ws,
            bt_out_row,
            9,
            f"=IFERROR(INDEX('突破物品'!$E$2:$E${LAST_BT_ITEM},MATCH($C{bt_out_row},'突破物品'!$A$2:$A${LAST_BT_ITEM},0)),\"\")",
            fmt=NUM_2,
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, bt_out_row, 10, f"=IF($I{bt_out_row}=\"\",\"\",$H{bt_out_row}*$I{bt_out_row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, bt_out_row, 11, f"=IF($J{bt_out_row}=\"\",\"\",$J{bt_out_row}*(1-TaxRate))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, bt_out_row, 12, f"=IF(OR($I{bt_out_row}=\"\",$I{bt_out_row}<=0),1,0)", fmt="0", font=Font(name=FONT_NUM, size=9))
        bt_out_row += 1
LAST_BT_OUT = bt_out_row - 1
band(ws, 2, LAST_BT_OUT, 12)

# ---------------------------------------------------------------------------
# 采集产物（突破口径：BT 价，不回退基准价）
# ---------------------------------------------------------------------------
catalog_key_by_id = {item["id"]: item["key"] for item in MODEL["catalogItems"]}
ws = wb.create_sheet("采集产物")
ws.sheet_properties.tabColor = "7C3AED"
widths(ws, {"A": 24, "B": 20, "C": 15, "D": 16, "E": 8, "F": 7, "G": 11, "H": 12, "I": 7})
header_row(ws, 1, ["配方ID", "配方名称", "产物键", "产物", "数量", "概率", "单价", "税后净值", "缺价"])
row = 2
for recipe in gather_recipes:
    for out in recipe["outputs"]:
        key = catalog_key_by_id.get(out["itemId"], "catalog:" + out["itemId"])
        set_cell(ws, row, 1, recipe["id"], font=SMALL_FONT)
        set_cell(ws, row, 2, recipe["name"], font=SMALL_FONT)
        set_cell(ws, row, 3, key, font=SMALL_FONT)
        set_cell(ws, row, 4, out["name"], font=BODY_FONT)
        set_cell(ws, row, 5, out["qty"], fmt="0.00", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, row, 6, out["chance"], fmt="0.0%", font=Font(name=FONT_NUM, size=9))
        set_formula(
            ws,
            row,
            7,
            f"=IF(LEFT($C{row},8)=\"catalog:\",\"\",IFERROR(IF(INDEX('突破物品'!$E$2:$E${LAST_BT_ITEM},MATCH($C{row},'突破物品'!$B$2:$B${LAST_BT_ITEM},0))=0,\"\",INDEX('突破物品'!$E$2:$E${LAST_BT_ITEM},MATCH($C{row},'突破物品'!$B$2:$B${LAST_BT_ITEM},0))),\"\"))",
            fmt=NUM_2,
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, row, 8, f"=IF($G{row}=\"\",\"\",$E{row}*$F{row}*$G{row}*(1-TaxRate))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, row, 9, f"=IF($G{row}=\"\",1,0)", fmt="0", font=Font(name=FONT_NUM, size=9))
        row += 1
LAST_GATHER_OUT = row - 1
band(ws, 2, LAST_GATHER_OUT, 9)

# ---------------------------------------------------------------------------
# 突破配方（1036 制造 + 21 采集）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("突破配方")
ws.sheet_properties.tabColor = "7C3AED"
widths(ws, {"A": 8, "B": 10, "C": 10, "D": 8, "E": 26, "F": 7, "G": 9, "H": 9, "I": 13, "J": 13, "K": 13, "L": 11, "M": 8, "N": 13, "O": 13, "P": 10, "Q": 11, "R": 11})
header_row(ws, 1, ["序号", "技艺ID", "技艺", "类型", "配方名称", "等级", "每次经验", "单次精力", "材料成本", "产物净值", "利润", "利润/经验", "状态", "金评分", "省心评分", "来源", "原配方ID", "精力/经验"])
row = 2
for seq, recipe in enumerate(bt_recipes, 1):
    set_cell(ws, row, 1, seq, fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 2, recipe["skillId"], font=SMALL_FONT)
    set_cell(ws, row, 3, skill_by_id.get(recipe["skillId"], {}).get("name", recipe["skillId"]), font=SMALL_FONT)
    set_cell(ws, row, 4, "制造", font=SMALL_FONT)
    set_cell(ws, row, 5, recipe["name"], font=BODY_FONT)
    set_cell(ws, row, 6, recipe["level"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 7, recipe["exp"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 8, recipe["energy"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 9, f"=SUMIFS('突破材料'!$G:$G,'突破材料'!$A:$A,$A{row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 10, f"=SUMIFS('突破产物'!$K:$K,'突破产物'!$A:$A,$A{row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 11, f"=$J{row}-$I{row}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 12, f"=IF($G{row}>0,$K{row}/$G{row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(
        ws,
        row,
        13,
        f"=IF(OR($G{row}<=0,COUNTIFS('突破材料'!$A:$A,$A{row},'突破材料'!$F:$F,\"\")>0,SUMIFS('突破产物'!$L:$L,'突破产物'!$A:$A,$A{row})>0,SUMIFS('采集产物'!$I:$I,'采集产物'!$A:$A,$Q{row})>0),\"缺价\",\"有效\")",
        font=SMALL_FONT,
        align=Alignment(horizontal="center"),
    )
    set_formula(ws, row, 14, f"=IF($M{row}=\"有效\",$L{row}+ROW()/10000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 15, f"=IF($M{row}=\"有效\",$G{row}+$L{row}/1000000000-ROW()/1000000000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 16, "JX3BOX", font=SMALL_FONT)
    set_cell(ws, row, 17, recipe["id"], fmt="0", font=SMALL_FONT)
    set_formula(ws, row, 18, f"=IF(AND($M{row}=\"有效\",$H{row}>0),$H{row}/$G{row}+ROW()/1000000000000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    row += 1

for recipe in gather_recipes:
    set_cell(ws, row, 1, row - 1, fmt="0", font=SMALL_FONT)
    set_cell(ws, row, 2, recipe["skillId"], font=SMALL_FONT)
    set_cell(ws, row, 3, skill_by_id.get(recipe["skillId"], {}).get("name", recipe["skillId"]), font=SMALL_FONT)
    set_cell(ws, row, 4, "采集", font=SMALL_FONT)
    set_cell(ws, row, 5, recipe["name"], font=BODY_FONT)
    set_cell(ws, row, 6, recipe["level"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 7, GATHER_EXP, fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 8, recipe["energy"], fmt="0", font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 9, 0, fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 10, f"=SUMIFS('采集产物'!$H:$H,'采集产物'!$A:$A,$Q{row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 11, f"=$J{row}-$I{row}", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 12, f"=IF($G{row}>0,$K{row}/$G{row},\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(
        ws,
        row,
        13,
        f"=IF(OR($G{row}<=0,COUNTIFS('突破材料'!$A:$A,$A{row},'突破材料'!$F:$F,\"\")>0,SUMIFS('突破产物'!$L:$L,'突破产物'!$A:$A,$A{row})>0,SUMIFS('采集产物'!$I:$I,'采集产物'!$A:$A,$Q{row})>0),\"缺价\",\"有效\")",
        font=SMALL_FONT,
        align=Alignment(horizontal="center"),
    )
    set_formula(ws, row, 14, f"=IF($M{row}=\"有效\",$L{row}+ROW()/10000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 15, f"=IF($M{row}=\"有效\",$G{row}+$L{row}/1000000000-ROW()/1000000000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_cell(ws, row, 16, "采集", font=SMALL_FONT)
    set_cell(ws, row, 17, recipe["id"], font=SMALL_FONT)
    set_formula(ws, row, 18, f"=IF(AND($M{row}=\"有效\",$H{row}>0),$H{row}/$G{row}+ROW()/1000000000000000,\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    row += 1
LAST_BT = row - 1
if LAST_BT != 1058:
    raise SystemExit(f"unexpected breakthrough recipe rows: {LAST_BT}")
ws.freeze_panes = "E2"
ws.auto_filter.ref = f"A1:R{LAST_BT}"
band(ws, 2, LAST_BT, 18)
ws.conditional_formatting.add(f"K2:K{LAST_BT}", CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor=RED_BG), font=Font(name=FONT_CN, size=9, color=RED)))

# ---------------------------------------------------------------------------
# 突破晋秩
# ---------------------------------------------------------------------------
ws = wb.create_sheet("突破晋秩")
ws.sheet_properties.tabColor = "7C3AED"
widths(ws, {"A": 10, "B": 10, "C": 7, "D": 14, "E": 8, "F": 22, "G": 7, "H": 12, "I": 12, "J": 7, "K": 12})
header_row(ws, 1, ["技艺ID", "技艺", "等级", "任务", "材料索引", "材料", "数量", "单价", "小计", "缺价", "键"])
row = 2
for gate in gates:
    for mat in gate["materials"]:
        set_cell(ws, row, 1, gate["skillId"], font=SMALL_FONT)
        set_cell(ws, row, 2, skill_by_id.get(gate["skillId"], {}).get("name", gate["skillId"]), font=SMALL_FONT)
        set_cell(ws, row, 3, gate["level"], fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, row, 4, gate["name"], font=BODY_FONT)
        set_cell(ws, row, 5, mat["btIndex"] + 1, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, row, 6, mat["name"], font=BODY_FONT)
        set_cell(ws, row, 7, mat["qty"], fmt="0", font=Font(name=FONT_NUM, size=9))
        set_formula(
            ws,
            row,
            8,
            f"=IFERROR(INDEX('突破物品'!$E$2:$E${LAST_BT_ITEM},MATCH($E{row},'突破物品'!$A$2:$A${LAST_BT_ITEM},0)),\"\")",
            fmt=NUM_2,
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, row, 9, f"=IF($H{row}=\"\",\"\",$G{row}*$H{row})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, row, 10, f"=IF($H{row}=\"\",\"缺价\",\"\")", font=SMALL_FONT, align=Alignment(horizontal="center"))
        set_formula(ws, row, 11, f"=$A{row}&\"|\"&$C{row}", font=SMALL_FONT)
        row += 1
LAST_GATE = row - 1
band(ws, 2, LAST_GATE, 11)

# ---------------------------------------------------------------------------
# 路线明细（8 技艺 × 49 级）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("路线明细")
ws.sheet_properties.tabColor = "94A3B8"
widths(ws, {"A": 13, "B": 10, "C": 10, "D": 8, "E": 8, "F": 9, "G": 8, "H": 8, "I": 24, "J": 7, "K": 9, "L": 7, "M": 9, "N": 13, "O": 13, "P": 13, "Q": 8})
header_row(ws, 1, ["键", "技艺ID", "技艺", "当前等级", "目标等级", "需要经验", "配方行", "配方ID", "最优配方", "配方等级", "每次经验", "次数", "总精力", "材料成本", "产值", "利润", "状态"])
route_row = 2
for skill in skills:
    sid = skill["id"]
    sname = skill["name"]
    for level in range(1, 50):
        key = f"{sname}|{level}"
        set_cell(ws, route_row, 1, key, font=SMALL_FONT)
        set_cell(ws, route_row, 2, sid, font=SMALL_FONT)
        set_cell(ws, route_row, 3, sname, font=SMALL_FONT)
        set_cell(ws, route_row, 4, level, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_cell(ws, route_row, 5, level + 1, fmt="0", font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 6, f"=INDEX('经验门槛'!$B$15:$B$63,$D{route_row})", fmt="0", font=Font(name=FONT_NUM, size=9))

        count_valid = f"COUNTIFS('突破配方'!$B$2:$B${LAST_BT},$B{route_row},'突破配方'!$F$2:$F${LAST_BT},\"<=\"&$D{route_row},'突破配方'!$M$2:$M${LAST_BT},\"有效\")"
        rows_rel = f"ROW('突破配方'!$G$2:$G${LAST_BT})-1"
        cond = f"('突破配方'!$B$2:$B${LAST_BT}=$B{route_row})*('突破配方'!$F$2:$F${LAST_BT}<=$D{route_row})*('突破配方'!$M$2:$M${LAST_BT}=\"有效\")*('突破配方'!$G$2:$G${LAST_BT}>0)"
        gold_best = f"MAXIFS('突破配方'!$N$2:$N${LAST_BT},'突破配方'!$B$2:$B${LAST_BT},$B{route_row},'突破配方'!$F$2:$F${LAST_BT},\"<=\"&$D{route_row},'突破配方'!$M$2:$M${LAST_BT},\"有效\")"
        effort_best = f"MAXIFS('突破配方'!$O$2:$O${LAST_BT},'突破配方'!$B$2:$B${LAST_BT},$B{route_row},'突破配方'!$F$2:$F${LAST_BT},\"<=\"&$D{route_row},'突破配方'!$M$2:$M${LAST_BT},\"有效\")"
        set_formula(
            ws,
            route_row,
            7,
            f"=IF(Strategy=\"省心\",IF({count_valid}=0,\"\",IFERROR(SUMPRODUCT({cond}*('突破配方'!$O$2:$O${LAST_BT}={effort_best})*({rows_rel})),\"\")),IF({count_valid}=0,\"\",IFERROR(SUMPRODUCT({cond}*('突破配方'!$N$2:$N${LAST_BT}={gold_best})*({rows_rel})),\"\")))",
            fmt="0",
            font=Font(name=FONT_NUM, size=9),
        )
        set_formula(ws, route_row, 8, f"=IF($G{route_row}=\"\",\"\",INDEX('突破配方'!$Q$2:$Q${LAST_BT},$G{route_row}))", font=SMALL_FONT)
        set_formula(ws, route_row, 9, f"=IF($G{route_row}=\"\",\"\",INDEX('突破配方'!$E$2:$E${LAST_BT},$G{route_row}))", font=BOLD_FONT)
        set_formula(ws, route_row, 10, f"=IF($G{route_row}=\"\",\"\",INDEX('突破配方'!$F$2:$F${LAST_BT},$G{route_row}))", fmt="0", font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 11, f"=IF($G{route_row}=\"\",\"\",INDEX('突破配方'!$G$2:$G${LAST_BT},$G{route_row}))", fmt="0", font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 12, f"=IF($G{route_row}=\"\",\"\",ROUNDUP($F{route_row}/$K{route_row},0))", fmt="0", font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 13, f"=IF($G{route_row}=\"\",\"\",$L{route_row}*INDEX('突破配方'!$H$2:$H${LAST_BT},$G{route_row}))", fmt="0", font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 14, f"=IF($G{route_row}=\"\",\"\",$L{route_row}*INDEX('突破配方'!$I$2:$I${LAST_BT},$G{route_row}))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 15, f"=IF($G{route_row}=\"\",\"\",$L{route_row}*INDEX('突破配方'!$J$2:$J${LAST_BT},$G{route_row}))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 16, f"=IF($G{route_row}=\"\",\"\",$L{route_row}*INDEX('突破配方'!$K$2:$K${LAST_BT},$G{route_row}))", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
        set_formula(ws, route_row, 17, f"=IF($G{route_row}=\"\",\"缺路线\",\"有效\")", font=SMALL_FONT, align=Alignment(horizontal="center"))
        route_row += 1
LAST_ROUTE = route_row - 1
if LAST_ROUTE != 393:
    raise SystemExit(f"unexpected route rows: {LAST_ROUTE}")
ws.freeze_panes = "D2"
band(ws, 2, LAST_ROUTE, 17)

# ---------------------------------------------------------------------------
# 突破路线（可视化）
# ---------------------------------------------------------------------------
ws = wb.create_sheet("突破路线")
ws.sheet_properties.tabColor = "7C3AED"
ws.sheet_view.showGridLines = False
widths(ws, {"A": 9, "B": 12, "C": 40, "D": 12, "E": 10, "F": 7, "G": 9, "H": 13, "I": 13, "J": 13, "K": 13, "L": 10, "M": 3, "N": 10})
title_band(ws, "突破路线", "1→50 逐级最优配方 · 用户观测经验表 · 30/35/40/45 晋秩材料 · 八技艺横评", 12)

set_cell(ws, 4, 1, "技艺", font=BOLD_FONT, fill=CARD_FILL)
skill_input = set_cell(ws, 4, 2, "锻造", fill=INPUT_FILL, font=Font(name=FONT_CN, size=12, bold=True, color=NAVY))
ws.merge_cells("B4:C4")
set_cell(ws, 4, 4, "策略", font=BOLD_FONT, fill=CARD_FILL)
set_formula(ws, 4, 5, "=Strategy", font=BOLD_FONT)
ws.merge_cells("E4:F4")
set_cell(ws, 4, 7, "产量", font=BOLD_FONT, fill=CARD_FILL)
set_formula(ws, 4, 8, "=YieldMode", font=BOLD_FONT)
ws.merge_cells("H4:I4")
set_cell(ws, 4, 10, "服务器", font=BOLD_FONT, fill=CARD_FILL)
set_formula(ws, 4, 11, "=SrvName", font=BOLD_FONT)
ws.merge_cells("K4:L4")

set_cell(ws, 5, 1, "技艺ID", font=SMALL_FONT)
set_formula(ws, 5, 2, "=IFERROR(INDEX(服务器!$E$2:$E$9,MATCH($B$4,服务器!$D$2:$D$9,0)),\"\")", font=SMALL_FONT)
ws.merge_cells("B5:C5")
set_cell(ws, 5, 4, "数据时间", font=SMALL_FONT)
set_formula(ws, 5, 5, "=IFERROR('物价'!$AM$2,\"—\")", font=SMALL_FONT)
ws.merge_cells("E5:F5")
set_cell(ws, 5, 10, "经验模型", font=SMALL_FONT)
set_formula(ws, 5, 11, "=\"分段插值 · \"&TEXT(SUM('经验门槛'!$B$15:$B$63),\"#,##0\")", font=SMALL_FONT)
ws.merge_cells("K5:L5")

dv = DataValidation(type="list", formula1="服务器!$D$2:$D$9", allow_blank=False)
ws.add_data_validation(dv)
dv.add("B4")

kpi_card(ws, 7, 1, "总经验", "=SUMIFS('路线明细'!$F$2:$F$393,'路线明细'!$B$2:$B$393,$B$5)", "0", 2)
kpi_card(ws, 7, 3, "制作次数", "=SUMIFS('路线明细'!$L$2:$L$393,'路线明细'!$B$2:$B$393,$B$5)", "0", 2)
kpi_card(ws, 7, 5, "总精力", "=SUMIFS('路线明细'!$M$2:$M$393,'路线明细'!$B$2:$B$393,$B$5)", "0", 2)
kpi_card(ws, 7, 7, "制作利润（金）", "=SUMIFS('路线明细'!$P$2:$P$393,'路线明细'!$B$2:$B$393,$B$5)", NUM_0, 2)
kpi_card(ws, 7, 9, "晋秩成本（金）", "=SUMIFS('突破晋秩'!$I$2:$I$127,'突破晋秩'!$A$2:$A$127,$B$5)", NUM_0, 2)
kpi_card(ws, 7, 11, "净收益（金）", "=G8-I8", NUM_0, 2)

set_cell(ws, 10, 1, "状态", font=BOLD_FONT, fill=CARD_FILL)
set_formula(
    ws,
    10,
    2,
    "=IF(COUNTIFS('路线明细'!$B$2:$B$393,$B$5,'路线明细'!$Q$2:$Q$393,\"缺路线\")>0,\"有等级缺路线\",IF(COUNTIFS('突破晋秩'!$A$2:$A$127,$B$5,'突破晋秩'!$J$2:$J$127,\"缺价\")>0,\"有晋秩材料缺价\",\"完整\"))",
    font=BOLD_FONT,
)
ws.merge_cells("B10:C10")
note(ws, 11, "缺路线等级不计入完整合计；采集技艺 1–19 级无可用采集点时会标记缺路线，这不是公式错误。", 12, height=28)

section(ws, 13, "逐级路线", 12, fill=HEADER_FILL)
header_row(ws, 14, ["等级段", "需要经验", "最优配方", "配方等级", "每次经验", "次数", "精力", "材料成本", "产值", "利润", "累计利润", "标记"], height=28)
for level in range(1, 50):
    row = 14 + level
    key = f'$B$4&"|"&(ROW()-14)'
    set_cell(ws, row, 1, f"={level}&\"→\"&{level + 1}", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 2, f"=IFERROR(INDEX('路线明细'!$F$2:$F$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 3, f"=IFERROR(INDEX('路线明细'!$I$2:$I$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"—\")", font=BOLD_FONT)
    set_formula(ws, row, 4, f"=IFERROR(INDEX('路线明细'!$J$2:$J$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 5, f"=IFERROR(INDEX('路线明细'!$K$2:$K$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 6, f"=IFERROR(INDEX('路线明细'!$L$2:$L$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 7, f"=IFERROR(INDEX('路线明细'!$M$2:$M$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 8, f"=IFERROR(INDEX('路线明细'!$N$2:$N$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 9, f"=IFERROR(INDEX('路线明细'!$O$2:$O$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 10, f"=IFERROR(INDEX('路线明细'!$P$2:$P$393,MATCH({key},'路线明细'!$A$2:$A$393,0)),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, row, 11, f"=IF(ISNUMBER($J{row}),SUM($J$15:$J{row}),\"\")", fmt=NUM_2, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, row, 12, f"=IF(OR(ROW()-14=30,ROW()-14=35,ROW()-14=40,ROW()-14=45),\"★ 晋秩\",\"\")", font=Font(name=FONT_CN, size=9, bold=True, color=AMBER), align=Alignment(horizontal="center"))
ws.freeze_panes = "A15"
band(ws, 15, 63, 12)
ws.conditional_formatting.add("J15:J63", CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor=RED_BG), font=Font(name=FONT_CN, size=9, color=RED)))
ws.conditional_formatting.add("A15:L63", FormulaRule(formula=['$L15<>""'], fill=PatternFill("solid", fgColor=AMBER_BG)))

section(ws, 65, "晋秩任务（30 / 35 / 40 / 45）", 12, fill=HEADER_FILL)
header_row(ws, 66, ["等级", "任务", "材料（数量）", "成本（金）", "状态"], height=26)
for idx, level in enumerate([30, 35, 40, 45], 67):
    set_cell(ws, idx, 1, level, fmt="0", font=Font(name=FONT_NUM, size=11, bold=True))
    set_formula(ws, idx, 2, f"=IFERROR(INDEX('突破晋秩'!$D$2:$D$127,MATCH($B$5&\"|\"&$A{idx},'突破晋秩'!$K$2:$K$127,0)),\"—\")", font=BOLD_FONT, align=Alignment(wrap_text=True, vertical="center"))
    set_formula(
        ws,
        idx,
        3,
        f"=IFERROR(TEXTJOIN(\"、\",TRUE,IF(('突破晋秩'!$A$2:$A$127=$B$5)*('突破晋秩'!$C$2:$C$127=$A{idx}),'突破晋秩'!$F$2:$F$127&\"×\"&'突破晋秩'!$G$2:$G$127,\"\")),\"\")",
        array_ref=f"C{idx}",
        font=SMALL_FONT,
        align=Alignment(wrap_text=True, vertical="center"),
    )
    set_formula(ws, idx, 4, f"=SUMIFS('突破晋秩'!$I$2:$I$127,'突破晋秩'!$A$2:$A$127,$B$5,'突破晋秩'!$C$2:$C$127,$A{idx})", fmt=NUM_2, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(ws, idx, 5, f"=IF(COUNTIFS('突破晋秩'!$A$2:$A$127,$B$5,'突破晋秩'!$C$2:$C$127,$A{idx},'突破晋秩'!$J$2:$J$127,\"缺价\")>0,\"缺价\",\"\")", font=SMALL_FONT, align=Alignment(horizontal="center"))
    ws.row_dimensions[idx].height = 46

section(ws, 72, "八技艺横评", 7, fill=HEADER_FILL)
header_row(ws, 73, ["技艺", "总精力", "制作次数", "总利润", "晋秩成本", "净收益", "状态"], height=26)
for i, skill in enumerate(skills, 74):
    set_cell(ws, i, 1, skill["name"], font=BOLD_FONT)
    set_formula(ws, i, 2, f"=SUMIFS('路线明细'!$M$2:$M$393,'路线明细'!$C$2:$C$393,$A{i})", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 3, f"=SUMIFS('路线明细'!$L$2:$L$393,'路线明细'!$C$2:$C$393,$A{i})", fmt="0", font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 4, f"=SUMIFS('路线明细'!$P$2:$P$393,'路线明细'!$C$2:$C$393,$A{i})", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 5, f"=SUMIFS('突破晋秩'!$I$2:$I$127,'突破晋秩'!$B$2:$B$127,$A{i})", fmt=NUM_0, font=Font(name=FONT_NUM, size=9))
    set_formula(ws, i, 6, f"=$D{i}-$E{i}", fmt=NUM_0, font=Font(name=FONT_NUM, size=9, bold=True))
    set_formula(
        ws,
        i,
        7,
        f"=IF(COUNTIFS('路线明细'!$C$2:$C$393,$A{i},'路线明细'!$Q$2:$Q$393,\"缺路线\")>0,\"缺路线\",IF(COUNTIFS('突破晋秩'!$B$2:$B$127,$A{i},'突破晋秩'!$J$2:$J$127,\"缺价\")>0,\"缺价\",\"完整\"))",
        font=SMALL_FONT,
        align=Alignment(horizontal="center"),
    )
band(ws, 74, 81, 7)
ws.conditional_formatting.add("F74:F81", CellIsRule(operator="lessThan", formula=["0"], fill=PatternFill("solid", fgColor=RED_BG), font=Font(name=FONT_CN, size=10, color=RED)))

chart = BarChart()
chart.type = "bar"
chart.style = 10
chart.title = "八技艺净收益（金）"
chart.y_axis.title = "金"
chart.x_axis.title = None
data = Reference(ws, min_col=6, min_row=73, max_row=81)
cats = Reference(ws, min_col=1, min_row=74, max_row=81)
chart.add_data(data, titles_from_data=True)
chart.set_categories(cats)
chart.height = 8
chart.width = 17
chart.legend = None
ws.add_chart(chart, "I72")

note(
    ws,
    90,
    "路线按当前「设置」中的服务器、产量口径与策略计算。金最优 = 利润/经验最高；省心 = 制作次数最少。精力最优需要逐级 ceil，单次重算量过大，请在网页版查看。突破按市场价；「取最低」仅用于技艺收益。",
    7,
    fill=NOTE_FILL,
    height=54,
)

print("built", OUT)
wb.save(OUT)

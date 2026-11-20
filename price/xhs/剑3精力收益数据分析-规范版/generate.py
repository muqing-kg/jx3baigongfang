# -*- coding: utf-8 -*-
"""按 docs/design 数据看板规范重做小红书 3:4 配图（1080×1440）。"""
import html
import json
import math
from pathlib import Path

import numpy as np
from playwright.sync_api import sync_playwright

BASE = Path(__file__).resolve().parent
S = json.loads((BASE / "summary.json").read_text(encoding="utf-8"))
CARDS = BASE / "cards"

PAGES = [
    ("01-封面", "cover"),
    ("02-结论", "conclusion"),
    ("03-可成交榜TOP10", "top10"),
    ("04-数据陷阱", "trap"),
    ("05-暴击边际", "crit"),
    ("06-五技艺分布", "skills"),
    ("07-怎么选", "choose"),
]
SKILL_COLOR = {
    "锻造": "#E88A2E",
    "缝纫": "#1D6FE0",
    "制药": "#2E9E78",
    "烹饪": "#E04A7A",
    "梓匠": "#A75BE0",
}
SKILL_ORDER = ["锻造", "缝纫", "制药", "烹饪", "梓匠"]
C = {
    "text": "#0F172A", "muted": "#64748B", "muted2": "#94A3B8",
    "border": "#E2E8F0", "grid": "#E2E8F0", "peak": "#B36BFF", "peak_text": "#7C3AED",
    "positive": "#2E9E78", "positive_text": "#15803D", "danger": "#E11D48",
    "chart1": "#1D6FE0", "chart2": "#2E9E78", "chart3": "#E88A2E",
    "chart4": "#A75BE0", "chart5": "#E04A7A",
}


def e(s):
    return html.escape(str(s), quote=True)


def f1(v):
    return f"{v:.1f}"


def f0(v):
    return f"{v:,.0f}"


def t(x, y, s, size=10, fill=C["muted"], weight=500, anchor="start", extra=""):
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="PingFang SC, sans-serif" '
        f'font-size="{size}" font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{e(s)}</text>'
    )


def rect(x, y, w, h, fill, rx=0, extra=""):
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" {extra}/>'


def line(x1, y1, x2, y2, stroke, width=1, dash=None, extra=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    return (
        f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
        f'stroke="{stroke}" stroke-width="{width}"{d} {extra}/>'
    )


def svg(w, h, body, label=""):
    return (
        f'<svg viewBox="0 0 {w} {h}" width="100%" role="img" aria-label="{e(label)}" '
        f'xmlns="http://www.w3.org/2000/svg">{body}</svg>'
    )


def download_icon():
    return (
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/>'
        '<line x1="12" y1="15" x2="12" y2="3"/></svg>'
    )


def shell(body, page_no, foot_left, gid=""):
    return f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><title>{e(page_no)}</title>
<link rel="stylesheet" href="style.css"></head>
<body><div class="page">
<header class="topbar">
  <div class="brand"><div class="brand-mark">价</div><div><div class="brand-name">剑网三物价助手</div><div class="brand-sub">JX3 PRICE LEDGER</div></div></div>
  <div class="crumb">总览 <i>/</i> 精力收益分析 <i>/</i> <b>双梦</b></div>
  <div class="top-right"><span class="status"><span class="dot"></span>拍卖快照 2026-11-19 14:22</span><span class="badge badge-neutral">非官方</span></div>
</header>
<main class="content" id="{e(gid)}">
{body}
<footer class="foot"><span>{foot_left}</span><span class="pg">{page_no} / 07</span></footer>
</main>
</div></body></html>"""


def page_head(eye, title, sub, actions=""):
    return f"""<div class="page-head">
  <div><div class="eye">{eye}</div><h1 class="page-title">{title}</h1><div class="page-sub">{sub}</div></div>
  <div class="page-actions">{actions}</div>
</div>"""


def kpi(label, value, unit="", meta="", cls="", value_cls=""):
    unit_html = f'<span class="unit">{unit}</span>' if unit else ""
    return f"""<div class="kpi {cls}"><div class="label">{label}</div>
<div class="value {value_cls}">{value}{unit_html}</div><div class="meta">{meta}</div></div>"""


def chart_crit_bars():
    W, H = 500, 300
    left, right, top, bottom = 36, 478, 22, 258
    centers = [82, 170, 258, 346, 434]
    b = []
    for g in [0, 50, 100, 150]:
        yy = bottom - g / 154 * (bottom - top)
        b.append(line(left, yy, right, yy, C["grid"], 1))
        b.append(t(left - 8, yy + 3, str(g), 9.5, C["muted2"], 500, "end"))
    b.append(t(left, 14, "条", 9.5, C["muted2"], 500))
    for i, c in enumerate(S["curve"]):
        cx = centers[i]
        h = c["profitable"] / 154 * (bottom - top)
        fill = C["chart1"]
        op = "1" if c["crit"] == 0.5 else "0.62"
        b.append(rect(cx - 24, bottom - h, 48, h, fill, 3, f'fill-opacity="{op}"'))
        b.append(t(cx, bottom - h - 7, str(c["profitable"]), 11, C["peak_text"] if c["crit"] == 0.5 else C["chart1"], 700, "middle"))
        b.append(t(cx, bottom + 17, f"{int(c['crit']*100)}%", 10, C["muted"], 500, "middle"))
        if c["crit"] == 0.5:
            b.append(line(cx - 28, top - 4, cx - 28, bottom, C["peak"], 1, "3 3", 'stroke-opacity="0.55"'))
            b.append(t(cx, bottom + 29, "基准", 8.5, C["peak_text"], 600, "middle"))
    return svg(W, H, "".join(b), "不同暴击率下的盈利配方数")


def chart_crit_line():
    W, H = 500, 300
    left, right, top, bottom = 40, 478, 22, 258
    centers = [82, 170, 258, 346, 434]
    b = []
    for g in [0, 3, 6, 9, 12]:
        yy = bottom - g / 12 * (bottom - top)
        b.append(line(left, yy, right, yy, C["grid"], 1))
        b.append(t(left - 8, yy + 3, str(g), 9.5, C["muted2"], 500, "end"))
    b.append(t(left, 14, "金 / 精力", 9.5, C["muted2"], 500))
    b.append(line(centers[2], top - 4, centers[2], bottom, C["peak"], 1, "3 3", 'stroke-opacity="0.55"'))
    pts = []
    for i, c in enumerate(S["curve"]):
        cx = centers[i]
        cy = bottom - c["medianPe"] / 12 * (bottom - top)
        pts.append((cx, cy, c))
    path = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y, _ in pts)
    area = path + f" L {pts[-1][0]:.1f} {bottom:.1f} L {pts[0][0]:.1f} {bottom:.1f} Z"
    b.append(f'<path d="{area}" fill="{C["chart1"]}" fill-opacity="0.07"/>')
    b.append(f'<path d="{path}" fill="none" stroke="{C["chart1"]}" stroke-width="2"/>')
    for cx, cy, c in pts:
        b.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="3.4" fill="#fff" stroke="{C["chart1"]}" stroke-width="2"/>')
        b.append(t(cx, cy - 9, f"{c['medianPe']:.2f}", 10, C["chart1"], 700, "middle"))
        b.append(t(cx, bottom + 17, f"{int(c['crit']*100)}%", 10, C["muted"], 500, "middle"))
    return svg(W, H, "".join(b), "不同暴击率下的中位精力收益")


def chart_boxplot():
    groups = S["skill_stats"]
    W, H = 1000, 430
    left, right, top, bottom = 52, 970, 26, 360
    ymin, ymax = -15, 60
    centers = [140, 310, 480, 650, 820]
    boxw = 56

    def Y(v):
        return top + (ymax - v) / (ymax - ymin) * (bottom - top)

    b = []
    for gv in [-10, 0, 10, 20, 30, 40, 50, 60]:
        yy = Y(gv)
        b.append(line(left, yy, right, yy, C["grid"], 1))
        b.append(t(left - 10, yy + 3, str(gv), 9.5, C["muted2"], 500, "end"))
    b.append(line(left, Y(0), right, Y(0), "#CBD5E1", 1.2))
    b.append(t(left - 10, 16, "金 / 精力", 9.5, C["muted2"], 500, "end"))
    for idx, g in enumerate(groups):
        cx = centers[idx]
        color = SKILL_COLOR[g["name"]]
        vals = np.array(g["values"], dtype=float)
        q1, med, q3 = np.percentile(vals, [25, 50, 75])
        iqr = q3 - q1
        lo = vals[vals >= q1 - 1.5 * iqr].min()
        hi = vals[vals <= q3 + 1.5 * iqr].max()
        b.append(line(cx, Y(hi), cx, Y(q3), color, 1.4))
        b.append(line(cx, Y(q1), cx, Y(lo), color, 1.4))
        b.append(line(cx - 13, Y(hi), cx + 13, Y(hi), color, 1.4))
        b.append(line(cx - 13, Y(lo), cx + 13, Y(lo), color, 1.4))
        b.append(rect(cx - boxw / 2, Y(q3), boxw, max(2, Y(q1) - Y(q3)), color, 4, 'fill-opacity="0.14"'))
        b.append(f'<rect x="{cx-boxw/2:.1f}" y="{Y(q3):.1f}" width="{boxw}" height="{max(2,Y(q1)-Y(q3)):.1f}" rx="4" fill="none" stroke="{color}" stroke-width="1.5"/>')
        b.append(line(cx - boxw / 2, Y(med), cx + boxw / 2, Y(med), color, 2.4))
        for j, v in enumerate(vals):
            jitter = math.sin(j * 2.17 + idx * 1.3) * 9
            b.append(f'<circle cx="{cx+jitter:.1f}" cy="{Y(v):.1f}" r="2.1" fill="{color}" fill-opacity="0.42"/>')
        b.append(t(cx, 388, g["name"], 11.5, C["text"], 600, "middle"))
        b.append(t(cx, 405, f"n={g['n']} · 中位 {f1(g['median'])}", 9.5, C["muted2"], 500, "middle"))
    # 95.3 callout
    b.append(t(650 + 8, 18, "膘然心动 95.3 ↑", 9.5, SKILL_COLOR["烹饪"], 600))
    return svg(W, H, "".join(b), "五类制造技艺精力收益分布")


def chart_scatter():
    pts = S["scatter"]
    W, H = 620, 400
    left, right, top, bottom = 50, 596, 24, 330

    def X(cost):
        c = max(1, min(10000, cost))
        return left + (math.log10(c) / 4.0) * (right - left)

    def Y(v):
        v = max(-15, min(100, v))
        return top + (100 - v) / 115 * (bottom - top)

    b = []
    for g in [1, 10, 100, 1000, 10000]:
        xx = X(g)
        b.append(line(xx, top, xx, bottom, C["grid"], 1))
        lab = {1: "1", 10: "10", 100: "100", 1000: "1千", 10000: "1万"}[g]
        b.append(t(xx, bottom + 17, lab, 9.5, C["muted2"], 500, "middle"))
    for gv in [-10, 0, 20, 40, 60, 80, 100]:
        yy = Y(gv)
        b.append(line(left, yy, right, yy, C["grid"], 1))
        b.append(t(left - 8, yy + 3, str(gv), 9.5, C["muted2"], 500, "end"))
    b.append(line(left, Y(0), right, Y(0), "#CBD5E1", 1.2))

    med_cost = float(np.median([p["cost"] for p in pts]))
    med_pe = float(np.median([p["pe"] for p in pts]))
    b.append(line(X(med_cost), top, X(med_cost), bottom, C["peak"], 1, "3 4", 'stroke-opacity="0.45"'))
    b.append(line(left, Y(med_pe), right, Y(med_pe), C["peak"], 1, "3 4", 'stroke-opacity="0.45"'))

    for p in pts:
        r = 3.6 + min(3.8, p["energy"] / 60)
        b.append(f'<circle cx="{X(p["cost"]):.1f}" cy="{Y(p["pe"]):.1f}" r="{r:.1f}" fill="{SKILL_COLOR[p["skill"]]}" fill-opacity="0.72" stroke="#fff" stroke-width="0.8"/>')

    labels = [
        ("膘然心动", 8, -9, "start"),
        ("苍生·絮泊磨石（疗伤）", 8, -7, "start"),
        ("拼布72色全包", -8, -10, "end"),
        ("蜀锦绣·腕（力道）", 8, 18, "start"),
    ]
    byname = {p["name"]: p for p in pts}
    for name, dx, dy, anchor in labels:
        p = byname.get(name)
        if not p:
            continue
        b.append(t(X(p["cost"]) + dx, Y(p["pe"]) + dy, name, 9.5, C["text"], 600, anchor,
                   extra='stroke="#fff" stroke-width="3" paint-order="stroke"'))
    b.append(t(left, 14, "精力收益（金 / 精力）", 9.5, C["muted2"], 500))
    b.append(t((left + right) / 2, 380, "单次材料成本（金 · 对数轴）", 9.5, C["muted2"], 500, "middle"))
    return svg(W, H, "".join(b), "成本与精力收益散点图")


def legend_skills(extra=""):
    items = "".join(
        f'<span class="lg"><i style="background:{SKILL_COLOR[s]}"></i>{s}</span>' for s in SKILL_ORDER
    )
    return f'<div class="legend">{items}{extra}</div>'


def stack_row(label, ok, no, total=154, base=False):
    okp = ok / total * 100
    nop = no / total * 100
    cls = " base" if base else ""
    lab = f'{label}<small>基准</small>' if base else label
    return f"""<div class="stack-row{cls}"><div class="sl">{lab}</div>
<div class="stack-track"><i class="ok" style="width:{okp:.2f}%">{ok}</i><i class="no" style="width:{nop:.2f}%">{no}</i></div>
<div class="sv">{ok} <span style="font-size:10px;color:#94A3B8;font-weight:400">/154</span></div></div>"""


def kpi_row_4(items, cls=""):
    return '<div class="kpis %s">%s</div>' % (cls, "".join(items))


def card(title, sub="", body="", foot="", actions="", cls=""):
    sub_html = f'<div class="card-sub">{sub}</div>' if sub else ""
    foot_html = f'<div class="card-foot">{foot}</div>' if foot else ""
    return f"""<section class="card {cls}">
<div class="card-head"><div><h2 class="card-title">{title}</h2>{sub_html}</div><div class="card-actions">{actions}</div></div>
<div class="card-body">{body}</div>{foot_html}</section>"""


def card_cover():
    body = f"""
<div class="page-head cover-head">
  <div><div class="eye">双梦 · 苍生铸世 50级</div><h1 class="page-title cover-title">剑3精力收益数据分析</h1>
  <div class="page-sub">154 条制造配方 · 市场价 · 5% 交易税 · <b>暴击率 50%</b> · 数据快照 2026-11-19 14:22</div></div>
  <div class="page-actions"><div class="seg"><span class="active">可成交 85</span><span>全部 154</span></div><span class="badge badge-neutral">单位 金/精力</span></div>
</div>
<div class="kpis cover-kpis">
  {kpi("盈利配方 · 50% 暴击", "124", "/154", '<span class="up">↑ +32</span> 较 0% 暴击', value_cls="lg")}
  {kpi("TOP1 精力收益", "95.3", "金/精力", '<span class="peak">膘然心动</span> · 烹饪', value_cls="lg")}
  {kpi("中位精力收益", "5.64", "金/精力", '0% 时 0.61 · <span class="up">9.2×</span>', value_cls="lg")}
  {kpi("100% 暴击仍亏", "20", "条", '低阶过渡品为主 · 占 13%', value_cls="lg")}
</div>
<div class="grid" style="margin-top:16px">
  <div class="c8">{card("暴击前后：盈利配方数", "154 条制造配方 · 扣 5% 税 · 暴击按额外一份产出计",
      '<div class="stack-legend"><span><i style="background:#2E9E78"></i>盈利</span><span><i style="background:#E11D48"></i>亏损</span><span style="margin-left:auto">154 条</span></div>'
      + stack_row("0%", 92, 62)
      + stack_row("50%", 124, 30, base=True)
      + stack_row("100%", 134, 20),
      '<span><b>124 / 154 = 80.5%</b> 的制造配方在 50% 暴击下能赚钱</span><span>数据：JX3BOX 拍卖</span>',
      '<span class="badge">全部 154</span><span class="icon-btn">' + download_icon() + '</span>',
      "cover-main center")}</div>
  <div class="c4">{card("四条判断", "先记住这四句",
      '<div class="rows">'
      '<div class="row"><div class="rk">01</div><div class="rt"><b>暴击只乘产值，不乘成本</b><span>毛利率越高，利润放大越明显</span></div></div>'
      '<div class="row"><div class="rk">02</div><div class="rt"><b>扭亏靠 50 级装备与半成品</b><span>32 条里有 6 条是 50 级装备</span></div></div>'
      '<div class="row"><div class="rk">03</div><div class="rt"><b>账面第一可能是示例价</b><span>前 12 名 0 条全链路有实时报价</span></div></div>'
      '<div class="row"><div class="rk">04</div><div class="rt"><b>低阶过渡品救不回来</b><span>20 条即使 100% 暴击仍亏</span></div></div>'
      '</div>',
      '<span>详见 P2 / P4 / P5</span><span>口径：市场价</span>', "", "cover-side")}</div>
</div>
<div class="grid" style="margin-top:16px">
  <div class="c4">{card("账面第一 ≠ 真能赚", "归营旌 · 4 个半成品无报价",
      '<div class="insight"><div class="k">精力收益</div><div class="v">299.1 <small>→</small> 72.7</div><div class="t">账面按示例价买半成品；自己补做 <b>600 精力</b>，收益降到约 <b>1/4</b>。</div></div>',
      '<span>详见 P4</span><span class="badge badge-warning">示例价</span>', "", "cover-bottom")}</div>
  <div class="c4">{card("高单价 ≠ 高精力收益", "单次利润 vs 精力收益",
      '<div class="mini-bars">'
      '<div class="mini-bar"><span class="n">拼布全包</span><span class="t"><i style="width:50.1%;background:#A75BE0"></i></span><span class="v">47.7</span></div>'
      '<div class="mini-bar"><span class="n">磨石（疗伤）</span><span class="t"><i style="width:54.8%;background:#E88A2E"></i></span><span class="v">52.3</span></div>'
      '<div class="mini-bar"><span class="n">膘然心动</span><span class="t"><i style="width:100%;background:#E04A7A"></i></span><span class="v">95.3</span></div>'
      '</div><div class="t" style="font-size:10.5px;line-height:16px;color:#64748B;margin-top:8px">拼布单次利润 4,773，但花 100 精力；磨石只赚 1,569，精力收益反而更高。</div>',
      '<span>详见 P3</span><span>单位：金/精力</span>', "", "cover-bottom")}</div>
  <div class="c4">{card("五技艺中位", "可成交样本 · 金/精力",
      '<div class="skill-mini">'
      + "".join(f'<div class="sm"><span><i style="background:{SKILL_COLOR[g["name"]]}"></i>{g["name"]}</span><b>{f1(g["median"])}</b></div>' for g in S["skill_stats"])
      + '</div>',
      '<span>详见 P6</span><span>n=85</span>', "", "cover-bottom")}</div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">可成交榜 TOP 3</h2><div class="card-sub">85 条全链路有报价 · 已扣 5% 税 · 暴击 50%</div></div><div class="card-actions"><span class="badge badge-positive">可成交</span><span class="icon-btn">{download_icon()}</span></div></div>
  <div class="card-body"><div class="top3">
    <div class="t3"><div class="rk">01</div><div class="tb"><b>膘然心动</b><span>烹饪 · 50 精力 · 毛利 83.7%</span><div class="bl"><i style="width:100%;background:#E04A7A"></i></div></div><div class="tv">95.3</div></div>
    <div class="t3"><div class="rk">02</div><div class="tb"><b>苍生·絮泊磨石（疗伤）</b><span>锻造 · 30 精力 · 毛利 89.9%</span><div class="bl"><i style="width:54.8%;background:#E88A2E"></i></div></div><div class="tv">52.3</div></div>
    <div class="t3"><div class="rk">03</div><div class="tb"><b>拼布72色全包</b><span>梓匠 · 100 精力 · 毛利 38.9%</span><div class="bl"><i style="width:50.1%;background:#A75BE0"></i></div></div><div class="tv">47.7</div></div>
  </div></div>
  <div class="card-foot"><span>单位：金/精力 · 完整 10 条见 P3</span><span>数据：JX3BOX 2026-11-19 14:22</span></div>
</div>
<div class="formula" style="margin-top:16px"><b>口径</b><span class="op">·</span>双梦（梦江南）<span class="op">·</span>154 条制造配方<span class="op">·</span>市场价<span class="op">·</span>5% 交易税<span class="op">·</span>暴击 50% 期望产出 ×1.5<div class="note">不含采集 · 示例价可校准<br>仅游戏内数值 · 非官方玩家分析</div></div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">本笔记 7 页</h2><div class="card-sub">从结论到行动 · 数据快照 2026-11-19 14:22</div></div><div class="card-actions"><span class="badge badge-neutral">目录</span></div></div>
  <div class="card-body"><div class="index-strip">
    <div class="index-item"><div class="ii">01</div><div class="it">结论</div></div>
    <div class="index-item"><div class="ii">02</div><div class="it">可成交榜</div></div>
    <div class="index-item"><div class="ii">03</div><div class="it">数据陷阱</div></div>
    <div class="index-item"><div class="ii">04</div><div class="it">暴击边际</div></div>
    <div class="index-item"><div class="ii">05</div><div class="it">五技艺</div></div>
    <div class="index-item"><div class="ii">06</div><div class="it">怎么选</div></div>
  </div></div>
  <div class="card-foot"><span>首图已在 1080×1080 安全区保留标题与核心数字</span><span>非官方玩家分析</span></div>
</div>
"""
    return shell(body, "01", "数据：剑网三物价助手 · 双梦（梦江南） · 2026-11-19 14:22 · 仅游戏内数值", "cover")


def card_conclusion():
    body = f"""
{page_head("01 / 结论", "暴击 50%，赚钱配方从 92 条拉到 124 条",
           "154 条制造配方 · 市场价 · 5% 税 · 暴击按额外一份产出计 · 不含采集",
           '<div class="seg"><span class="active">0% / 50% / 100%</span></div><span class="badge badge-neutral">全量 154</span>')}
<div class="kpis">
  {kpi("0% 暴击 · 盈利", "92", "/154", '中位 0.61 金/精力')}
  {kpi("50% 暴击 · 盈利", "124", "/154", '<span class="up">↑ +32</span> 较 0% 暴击')}
  {kpi("100% 暴击 · 盈利", "134", "/154", '<span class="up">↑ +10</span> 较 50% 暴击')}
  {kpi("中位精力收益", "5.64", "金/精力", '<span class="up">+5.03</span> 较 0% 暴击')}
</div>
<div class="grid" style="margin-top:16px">
  <div class="c8">{card("暴击前后：盈利 / 亏损", "154 条制造配方 · 颜色即编码 · 数字右对齐",
      '<div class="stack-legend"><span><i style="background:#2E9E78"></i>盈利</span><span><i style="background:#E11D48"></i>亏损</span><span style="margin-left:auto">共 154 条</span></div>'
      + stack_row("0%", 92, 62)
      + stack_row("50%", 124, 30, base=True)
      + stack_row("100%", 134, 20),
      '<span>50% 暴击下 <b>80.5%</b> 的配方能赚钱</span><span>扣 5% 交易税</span>',
      '<span class="badge">全部 154</span><span class="icon-btn">' + download_icon() + '</span>',
      "h460 center")}</div>
  <div class="c4">{card("四条判断", "从 154 条里读出的四件事",
      '<div class="rows">'
      '<div class="row"><div class="rk">01</div><div class="rt"><b>暴击只乘产值，不乘成本</b><span>材料还是那份材料，毛利率越高，利润放大越明显。</span></div></div>'
      '<div class="row"><div class="rk">02</div><div class="rt"><b>扭亏集中在 50 级装备与半成品</b><span>玄元星平衫、烽火裤、药引、五色石。</span></div></div>'
      '<div class="row"><div class="rk">03</div><div class="rt"><b>85 / 154 条才全链路有报价</b><span>其余含示例价，直接抄榜可能抄到“假收益”。</span></div></div>'
      '<div class="row"><div class="rk">04</div><div class="rt"><b>低阶过渡品是陷阱</b><span>腰刀、铜偶、灯笼、低阶锭：100% 暴击仍亏。</span></div></div>'
      '</div>',
      '<span>数据：JX3BOX 拍卖</span><span>2026-11-19 14:22</span>', "", "h460")}</div>
</div>
<div class="grid" style="margin-top:16px">
  <div class="c4">{card("暴击只乘产值", "对毛利率的影响",
      '<div class="insight"><div class="k">50% 暴击</div><div class="v">+50% <small>产值</small></div><div class="t">材料与精力不变；毛利率 80% 的配方，利润接近翻倍。</div></div>',
      '<span>口径：期望产出 ×1.5</span>', "", "h150")}</div>
  <div class="c4">{card("32 条扭亏", "0% → 50% 暴击",
      '<div class="insight"><div class="k">其中 50 级装备</div><div class="v">6 <small>条</small></div><div class="t">玄元星平衫 −828 → <b>+13,807</b>；烽火裤 −1,858 → <b>+13,046</b>。</div></div>',
      '<span>成品价为示例价，需校准</span>', "", "h150")}</div>
  <div class="c4">{card("20 条仍亏", "即使 100% 暴击",
      '<div class="insight"><div class="k">占比</div><div class="v">13<small>%</small></div><div class="t">低阶腰刀、铜偶、灯笼、低阶锭；直接买/卖店更省精力。</div></div>',
      '<span>154 条中 20 条</span>', "", "h150")}</div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">暴击率敏感度</h2><div class="card-sub">全量 154 条 · 盈利条数与中位精力收益</div></div><div class="card-actions"><span class="badge badge-neutral">0% → 100%</span></div></div>
  <div class="card-body"><table class="table">
    <colgroup><col style="width:24%"><col style="width:22%"><col style="width:22%"><col></colgroup>
    <thead><tr><th>暴击率</th><th class="num">盈利 / 154</th><th class="num">亏损</th><th class="num">中位精力收益</th></tr></thead>
    <tbody>
      <tr><td>0%</td><td class="num">92</td><td class="num neg">62</td><td class="num">0.61</td></tr>
      <tr><td>25%</td><td class="num">113</td><td class="num neg">41</td><td class="num">3.30</td></tr>
      <tr class="hl"><td>50% <span class="badge badge-peak">基准</span></td><td class="num">124</td><td class="num neg">30</td><td class="num val-peak">5.64</td></tr>
      <tr><td>75%</td><td class="num">130</td><td class="num neg">24</td><td class="num">8.81</td></tr>
      <tr><td>100%</td><td class="num">134</td><td class="num neg">20</td><td class="num">11.61</td></tr>
    </tbody>
  </table></div>
  <div class="card-foot"><span>50% 后条数增长放缓，但中位收益仍在上升</span><span>单位：金/精力</span></div>
</div>
<div class="formula" style="margin-top:16px"><b>利润</b><span class="op">=</span><b>产值 × 1.5</b><span class="op">× 0.95</span><span class="op">−</span><b>成本</b><div class="note">暴击 50% 的期望口径 · 0.95 = 扣 5% 交易税<br>不是官方保底，按你的实际暴击倍率调整</div></div>
"""
    return shell(body, "02", "口径：市场价 · 5% 税 · 暴击 50% · P2/P5 用全量 154 条", "conclusion")


def card_top10():
    items = S["top_clean"][:10]
    maxpe = items[0]["pe"]
    rows = []
    for i, it in enumerate(items, 1):
        color = C["peak"] if i == 1 else SKILL_COLOR[it["skill"]]
        w = it["pe"] / maxpe * 100
        hl = " hl" if i == 1 else ""
        vclass = "val-peak" if i == 1 else ""
        rows.append(f"""<tr class="{hl.strip()}"><td class="rank">{i:02d}</td>
<td><div class="name">{it['name']}</div><div class="sub">{it['skill']} · Lv{it['level']} · 毛利 {it['margin']*100:.1f}%</div></td>
<td class="num">{it['energy']}</td><td class="num">{f0(it['cost'])}</td><td class="num pos">{f0(it['profit'])}</td>
<td class="num {vclass}">{f1(it['pe'])}</td>
<td><div class="barline"><i style="width:{w:.1f}%;background:{color}"></i></div></td></tr>""")
    body = f"""
{page_head("02 / 可成交榜", "制作技艺精力收益 TOP 10",
           "只统计 <b>85 条</b>「产物 + 全部材料都有拍卖报价」的配方 · 已扣 5% 税 · 暴击 50%",
           '<div class="seg"><span class="active">可成交 85</span><span>全部 154</span></div><span class="badge badge-neutral">单位 金/精力</span>')}
<div class="kpis three">
  {kpi("TOP1 精力收益", "95.3", "金/精力", '<span class="peak">膘然心动</span> · 烹饪 · 50 精力')}
  {kpi("单次利润最高", "5,415", "金", '<span class="peak">锦缝春山囊</span> · 150 精力')}
  {kpi("可成交样本", "85", "/154", '<span class="up">55.2%</span> 的配方全链路有报价')}
</div>
<div class="card flush" style="margin-top:16px">
  <div style="padding:14px 16px 0"><div class="card-head" style="margin-bottom:6px">
    <div><h2 class="card-title">精力收益排行</h2><div class="card-sub">按精力收益降序 · 第一名永远在最上方 · 条形长度 = 相对强度</div></div>
    <div class="card-actions"><span class="badge badge-positive">全链路报价</span><span class="icon-btn">{download_icon()}</span></div>
  </div></div>
  <div style="padding:0 16px 10px">
  <table class="table">
    <colgroup><col style="width:36px"><col><col style="width:58px"><col style="width:82px"><col style="width:92px"><col style="width:92px"><col style="width:170px"></colgroup>
    <thead><tr><th>#</th><th>配方</th><th class="num">精力</th><th class="num">成本</th><th class="num">单次利润</th><th class="num">精力收益</th><th>相对强度</th></tr></thead>
    <tbody>{''.join(rows)}</tbody>
  </table>
  </div>
  <div class="card-foot" style="margin:0 16px;padding:9px 0 12px"><span>单位：金/精力 · 成本 = 材料 + 手续费 · 已扣 5% 交易税</span><span>暴击 50% · 2026-11-19 14:22</span></div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">按精力余量选</h2><div class="card-sub">同一条榜单，换个用法 · 数值为精力收益（金/精力）</div></div><div class="card-actions"><span class="badge badge-neutral">可成交 85</span></div></div>
  <div class="card-body"><div class="range-grid">
    <div class="range-item"><div class="rl">20–30 精力</div><div class="rr"><span>磨石（疗伤）</span><b>52.3</b></div><div class="rr"><span>药引 / 五色石</span><b>10.5 / 6.9</b></div><div class="rr"><span>密银锭 / 酱料</span><b>4.8 / 4.8</b></div></div>
    <div class="range-item"><div class="rl">50–60 精力</div><div class="rr"><span>膘然心动</span><b>95.3</b></div><div class="rr"><span>瀑沙熔锭（武伤）</span><b>35.8</b></div><div class="rr"><span>山水刺绣手绢</span><b>21.9</b></div></div>
    <div class="range-item"><div class="rl">80–120 精力</div><div class="rr"><span>拼布72色全包</span><b>47.7</b></div><div class="rr"><span>蜀锦绣·腕</span><b>41.4</b></div><div class="rr"><span>河洛纹·衣</span><b>31.3</b></div></div>
    <div class="range-item"><div class="rl">150–200 精力</div><div class="rr"><span>锦缝春山囊</span><b>36.1</b></div><div class="rr"><span>玄元装备</span><b>示例价</b></div><div class="rr"><span>建议先校准成品价</span><b>—</b></div></div>
  </div></div>
  <div class="card-foot"><span>读法：高单价 ≠ 高精力收益；拼布单次利润 4,773，但花 100 精力。</span><span>仅 85 条可成交样本</span></div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">TOP10 之外：3 条低精力半成品</h2><div class="card-sub">适合清小号精力 / 凑材料，不适合当主产</div></div><div class="card-actions"><span class="badge badge-warning">低精力</span></div></div>
  <div class="card-body"><div class="top3">
    <div class="t3"><div class="rk" style="color:#2E9E78">●</div><div class="tb"><b>药引</b><span>制药 · 20 精力 · 由亏转赚</span><div class="bl"><i style="width:22%;background:#2E9E78"></i></div></div><div class="tv">10.5</div></div>
    <div class="t3"><div class="rk" style="color:#1D6FE0">●</div><div class="tb"><b>五色石</b><span>缝纫 · 20 精力 · 由亏转赚</span><div class="bl"><i style="width:14%;background:#1D6FE0"></i></div></div><div class="tv">6.9</div></div>
    <div class="t3"><div class="rk" style="color:#E88A2E">●</div><div class="tb"><b>密银锭</b><span>锻造 · 20 精力 · 由亏转赚</span><div class="bl"><i style="width:10%;background:#E88A2E"></i></div></div><div class="tv">4.8</div></div>
  </div></div>
  <div class="card-foot"><span>单位：金/精力 · 暴击 50% · 已扣 5% 税</span><span>药引/五色石/密银锭</span></div>
</div>
"""
    return shell(body, "03", "单位：金/精力 · 已扣 5% 税 · 暴击 50% · P3/P6/P7 用 85 条可成交样本", "top10")


def card_trap():
    tr = S["trap"]
    inter = tr["intermediates"]
    nodes = []
    for n in inter:
        nodes.append(f'<div class="node"><b>{n}</b><span>120 精力</span></div>')
    chain = ('<div class="note" style="margin:2px 0 4px">归营旌本体 120 精力 + 4 个半成品：</div>'
             '<div class="chain">' + '<div class="arrow">+</div>'.join(nodes) + '<div class="arrow">=</div><div class="node total"><b>600 精力</b><span>5 次制造</span></div></div>')
    inter_rows = "".join(
        f'<div class="kv"><span class="kn"><i class="dot" style="background:#94A3B8"></i>{n}</span><span class="kv2">120 <small>精力</small> <span class="badge badge-warning" style="margin-left:4px">示例价</span></span></div>'
        for n in inter
    )
    body = f"""
{page_head("03 / 数据陷阱", "账面 299.1，全链路可能只有 72.7",
           "归营旌：成品有报价，但 4 个半成品都没有拍卖样本 · 前 12 名账面榜 0 条全链路有实时报价",
           '<span class="badge badge-warning">示例价</span><span class="badge badge-neutral">归营旌</span>')}
<div class="kpis">
  {kpi("账面价", "299.1", "金/精力", "120 精力 · 半成品按示例价买")}
  {kpi("全链路", "72.7", "金/精力", '<span class="down">−75.7%</span> 较账面价')}
  {kpi("总精力", "600", "精力", '<span class="down">+480</span> 用于补做半成品')}
  {kpi("前 12 名全链路报价", "0", "条", '100% 含示例价 · 只能当上限')}
</div>
<div class="grid" style="margin-top:16px">
  <div class="c8">{card("成本拆解：同一件归营旌，两种口径", "半成品按示例价买 vs 自己补做 · 暴击 50% · 扣 5% 税",
      chain +
      '<table class="table" style="margin-top:6px"><colgroup><col><col style="width:70px"><col style="width:90px"><col style="width:90px"><col style="width:88px"></colgroup>'
      '<thead><tr><th>口径</th><th class="num">总精力</th><th class="num">材料成本</th><th class="num">单次利润</th><th class="num">精力收益</th></tr></thead><tbody>'
      '<tr><td><div class="name">半成品按示例价买</div><div class="sub">4 个半成品按工具内示例价</div></td><td class="num">120</td><td class="num">13,983</td><td class="num pos">35,892</td><td class="num">299.1</td></tr>'
      '<tr class="hl"><td><div class="name">自己补做半成品</div><div class="sub">材料按报价买，半成品自己造</div></td><td class="num">600</td><td class="num">6,284</td><td class="num pos">43,591</td><td class="num val-peak">72.7</td></tr>'
      '</tbody></table>',
      '<span>材料成本 = 可交易材料 + 半成品原料；未计半成品暴击额外产出，偏保守</span>',
      '<span class="badge badge-danger">账面差额</span><span class="icon-btn">' + download_icon() + '</span>', "h430")}</div>
  <div class="c4">{card("4 个半成品均无报价", "成品有报价 35,000；半成品是示例价",
      '<div class="rows">' + inter_rows + '</div>'
      '<div class="callout" style="margin-top:10px"><div class="ico">!</div><div>半成品不是“买不到”，而是<strong>没有拍卖样本</strong>；按示例价买入只是理论最优。</div></div>',
      '<span>数据：JX3BOX 拍卖</span><span>2026-11-19</span>', '<span class="badge badge-warning">缺口 4</span>', "h430")}</div>
</div>
<div class="grid" style="margin-top:16px">
  <div class="c6">{card("为什么账面会高 4 倍", "精力被藏在了半成品里",
      '<div class="insight"><div class="k">账面 120 精力</div><div class="v">299.1 <small>金/精力</small></div><div class="t">只算了归营旌本体 120 精力，没算 4 个半成品各 120 精力。</div></div>'
      '<div class="divider"></div><div class="insight"><div class="k">全链路 600 精力</div><div class="v">72.7 <small>金/精力</small></div><div class="t">仍然赚钱，但只有账面的 <b>1/4</b>；更适合当低频副产物，不适合当日常答案。</div></div>',
      '<span>前 12 名账面榜：0 条全链路实时报价</span>', "", "h210 center")}</div>
  <div class="c6">{card("三类配方，三种可信度", "先看报价，再抄作业",
      '<div class="trust">'
      '<div class="th">类型</div><div class="th">例子</div><div class="th" style="text-align:right">怎么用</div>'
      '<div class="td"><b style="color:#15803D">全链路有报价</b></div><div class="td">膘然心动、磨石、拼布</div><div class="td">可成交榜</div>'
      '<div class="td"><b style="color:#BE123C">成品无报价</b></div><div class="td">玄元松绿衫、璧·苍生</div><div class="td">只当上限</div>'
      '<div class="td"><b style="color:#B45309">半成品无报价</b></div><div class="td">归营旌、定魂丹砂</div><div class="td">补做再算</div>'
      '</div>',
      '<span>看到「示例价」，先按本服交易行校准</span>', "", "h210 center")}</div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">校准 3 步</h2><div class="card-sub">把示例价换成你所在服务器的真实成交价</div></div><div class="card-actions"><span class="badge badge-neutral">可校准</span></div></div>
  <div class="card-body"><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:12px">
    <div class="range-item"><div class="rl">01 / 搜同名</div><div class="rr"><span>交易行输入产物或材料名</span></div><div class="rr"><span>优先看近 24h 成交</span></div></div>
    <div class="range-item"><div class="rl">02 / 填成交价</div><div class="rr"><span>在价格库填入本服单价</span></div><div class="rr"><span>产物与材料都要填</span></div></div>
    <div class="range-item"><div class="rl">03 / 重算</div><div class="rr"><span>回到精力收益分析</span></div><div class="rr"><span>看“可成交 / 示例价”标记</span></div></div>
  </div></div>
  <div class="card-foot"><span>工具：剑网三物价助手 · 价格库 · 本服独立价格空间</span><span>示例价不是成交承诺</span></div>
</div>
"""
    return shell(body, "04", "示例价可校准 · 请以本服交易行为准 · 归营旌为低频需求", "trap")


def card_crit():
    flips = S["flips"][:4]
    flip_rows = "".join(
        f'<div class="kv"><span class="kn">{x["name"]}</span><span class="kv2"><span class="neg">−{abs(x["p0"]):,.0f}</span> → <span class="pos">+{x["p50"]:,.0f}</span></span></div>'
        for x in flips
    )
    lose = ["玄武腰刀 / 麒麟腰刀", "铜偶 / 元宝灯 / 灯笼", "丹青染布画 / 彩缕花绫包", "低阶锭 / 饺子皮"]
    lose_rows = "".join(
        f'<div class="kv"><span class="kn">{x}</span><span class="kv2"><span class="badge badge-danger">仍亏</span></span></div>'
        for x in lose
    )
    body = f"""
{page_head("04 / 暴击边际", "0 → 100%：盈利 92 → 134，20 条仍亏",
           "154 条制造配方 · 暴击 50% 是基准 · 中位精力收益 0.61 → 11.61 金/精力",
           '<span class="badge badge-neutral">全量 154</span><span class="badge badge-peak">50% 基准</span>')}
<div class="kpis">
  {kpi("0% 暴击", "92", "/154", "中位 0.61 金/精力")}
  {kpi("50% 暴击", "124", "/154", '<span class="up">+32</span> 较 0%')}
  {kpi("100% 暴击", "134", "/154", '<span class="up">+10</span> 较 50%')}
  {kpi("100% 仍亏", "20", "条", '低阶过渡品 · 占 13%')}
</div>
<div class="grid" style="margin-top:16px">
  <div class="c6">{card("盈利配方数", "0% / 25% / 50% / 75% / 100% · 单位：条", '<div class="chart">' + chart_crit_bars() + '</div>',
      '<span>50% 是拐点：0→50% 多 32 条</span><span>154 条全量</span>', '<span class="icon-btn">' + download_icon() + '</span>', "h360")}</div>
  <div class="c6">{card("中位精力收益", "0% / 25% / 50% / 75% / 100% · 单位：金/精力", '<div class="chart">' + chart_crit_line() + '</div>',
      '<span>50→100% 只多 10 条，但中位收益仍在涨</span><span>扣 5% 税</span>', '<span class="icon-btn">' + download_icon() + '</span>', "h360")}</div>
</div>
<div class="grid" style="margin-top:16px">
  <div class="c12">{card("谁在扭亏，谁仍亏", "0% → 50% 的边际变化 · 单次利润（金）",
      '<div class="two-col">'
      '<div><div class="card-sub" style="margin:0 0 4px;color:#15803D;font-weight:600">+32 条由亏转赚</div>' + flip_rows + '</div>'
      '<div><div class="card-sub" style="margin:0 0 4px;color:#BE123C;font-weight:600">20 条即使 100% 暴击仍亏</div>' + lose_rows + '</div>'
      '</div>',
      '<span>玄元系列成品价为示例价，扭亏数值只作上限参考</span><span>暴击解决毛利，不解决需求</span>', "", "h260")}</div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">同一配方，暴击 0 / 50 / 100</h2><div class="card-sub">单次利润（金）· 已扣 5% 税 · 半成品按报价买</div></div><div class="card-actions"><span class="badge badge-neutral">4 条样本</span></div></div>
  <div class="card-body"><table class="table">
    <colgroup><col><col style="width:20%"><col style="width:20%"><col style="width:20%"></colgroup>
    <thead><tr><th>配方</th><th class="num">0%</th><th class="num">50%</th><th class="num">100%</th></tr></thead>
    <tbody>
      <tr><td>膘然心动</td><td class="num">2,868</td><td class="num val-peak">4,767</td><td class="num">6,667</td></tr>
      <tr><td>苍生·絮泊磨石（疗伤）</td><td class="num">988</td><td class="num val-peak">1,569</td><td class="num">2,151</td></tr>
      <tr><td>拼布72色全包</td><td class="num">688</td><td class="num val-peak">4,773</td><td class="num">8,859</td></tr>
      <tr><td>蜀锦绣·腕（力道）</td><td class="num">1,696</td><td class="num val-peak">4,973</td><td class="num">8,251</td></tr>
    </tbody>
  </table></div>
  <div class="card-foot"><span>拼布的绝对增益最大：+4,086 → +8,171</span><span>单位：金</span></div>
</div>
<div class="formula" style="margin-top:16px"><b>50% 是拐点</b><span class="op">·</span>0→50% 多 32 条<span class="op">·</span>50→100% 只多 10 条<div class="note">但中位收益从 0.61 涨到 11.61 金/精力<br>暴击的边际收益仍在，只是条数增长放缓</div></div>
"""
    return shell(body, "05", "154 条制造配方 · 价格含示例价 · 暴击 50% 为假设口径", "crit")


def card_skills():
    stats = {g["name"]: g for g in S["skill_stats"]}
    kpis = []
    for s in SKILL_ORDER:
        g = stats[s]
        kpis.append(kpi(f"{s} · 中位", f1(g["median"]), "金/精力", f"最高 {f1(g['max'])} · n={g['n']}"))
    rows = []
    conclusions = {
        "缝纫": "中位最高，但 7/18 仍亏；优先腕、囊、衣。",
        "锻造": "上限高、分化大；磨石/熔锭稳。",
        "烹饪": "靠膘然一个爆款，别按均值规划。",
        "制药": "最薄；适合顺手做或自用。",
        "梓匠": "拼布一个爆款，其他长尾。",
    }
    for s in SKILL_ORDER:
        g = stats[s]
        rows.append(f'<tr><td><div class="skill-name"><i style="background:{SKILL_COLOR[s]}"></i>{s}</div></td>'
                    f'<td class="num">{g["n"]}</td><td class="num">{f1(g["median"])}</td><td class="num">{f1(g["max"])}</td>'
                    f'<td class="num neg">{g["negative"]}</td><td style="font-size:11px;color:#64748B">{conclusions[s]}</td></tr>')
    body = f"""
{page_head("05 / 五技艺", "缝纫中位最高，制药最薄",
           "仅统计 <b>85 条</b>全链路有拍卖报价的配方 · 箱线为四分位 · 点为单条配方 · 单位 金/精力",
           '<div class="seg"><span class="active">可成交 85</span><span>全部 154</span></div><span class="badge badge-neutral">暴击 50%</span>')}
<div class="kpis five">{''.join(kpis)}</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">五技艺精力收益分布</h2><div class="card-sub">箱体 = 四分位区间 · 横线 = 中位 · 点 = 单条配方 · 烹饪的 95.3 超出坐标，用顶部标注</div></div>
  <div class="card-actions"><span class="badge badge-neutral">n=85</span><span class="icon-btn">{download_icon()}</span></div></div>
  <div class="card-body"><div class="chart">{chart_boxplot()}</div></div>
  <div class="card-foot"><span>参考线：0 金/精力；箱体越扁，配方之间越接近</span><span>仅 85 条可成交样本</span></div>
</div>
<div class="card flush" style="margin-top:16px">
  <div style="padding:14px 16px 0"><div class="card-head" style="margin-bottom:6px"><div><h2 class="card-title">分技艺明细</h2><div class="card-sub">中位、最高与亏损条数 · 结论按可成交样本</div></div><div class="card-actions"><span class="badge badge-neutral">85 条</span></div></div></div>
  <div style="padding:0 16px 8px">
  <table class="table skill-table">
    <colgroup><col style="width:100px"><col style="width:60px"><col style="width:76px"><col style="width:76px"><col style="width:66px"><col></colgroup>
    <thead><tr><th>技艺</th><th class="num">n</th><th class="num">中位</th><th class="num">最高</th><th class="num">亏损</th><th>一句话结论</th></tr></thead>
    <tbody>{''.join(rows)}</tbody>
  </table>
  </div>
  <div class="card-foot" style="margin:0 16px;padding:9px 0 12px"><span>单位：金/精力 · 已扣 5% 交易税 · 暴击 50%</span><span>数据：JX3BOX 2026-11-19 14:22</span></div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">怎么读这张图</h2><div class="card-sub">箱线图 + 单点 · 不用背统计术语</div></div><div class="card-actions"><span class="badge badge-neutral">图注</span></div></div>
  <div class="card-body"><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:12px">
    <div class="range-item"><div class="rl">箱体 = 中间 50%</div><div class="rr"><span>箱子越扁，配方之间越接近</span></div></div>
    <div class="range-item"><div class="rl">点 = 单条配方</div><div class="rr"><span>离群点就是异常高/低收益</span></div></div>
    <div class="range-item"><div class="rl">0 线 = 盈亏平衡</div><div class="rr"><span>在 0 以下就是做一次亏一次</span></div></div>
  </div></div>
</div>
"""
    return shell(body, "06", "仅 85 条全链路有拍卖报价的配方 · 价格含示例价", "skills")


def card_choose():
    costs = sorted(p["cost"] for p in S["scatter"])
    pes = sorted(p["pe"] for p in S["scatter"])
    med_cost = costs[len(costs) // 2]
    med_pe = pes[len(pes) // 2]
    body = f"""
{page_head("06 / 怎么选", "别只看单次利润：精力收益 = 利润 ÷ 精力",
           "气泡 = 精力（越大越高）· 颜色 = 技艺 · 虚线 = 可成交样本中位 · 仅 85 条全链路有报价",
           '<div class="seg"><span class="active">可成交 85</span><span>全部 154</span></div><span class="badge badge-neutral">暴击 50%</span>')}
<div class="kpis three">
  {kpi("可成交样本", "85", "/154", "产物 + 全部材料有拍卖报价")}
  {kpi("成本中位", f0(med_cost), "金", "单次材料成本 · 对数轴")}
  {kpi("收益中位", f"{med_pe:.2f}", "金/精力", "85 条可成交样本")}
</div>
<div class="grid" style="margin-top:16px">
  <div class="c8">{card("成本 × 精力收益", "横轴单次材料成本（对数）· 纵轴精力收益 · 气泡大小为单次精力", '<div class="chart">' + chart_scatter() + '</div>' + legend_skills(),
      '<span>左上：低成本高回报 · 右上：高投入高回报 · 下方：低回报</span><span>已扣 5% 税</span>',
      '<span class="badge badge-neutral">n=85</span><span class="icon-btn">' + download_icon() + '</span>', "h540")}</div>
  <div class="c4">{card("决策清单", "按你的精力与风险偏好选",
      '<div class="decision">'
      '<div class="d"><span class="dd" style="background:#E88A2E"></span><div class="dc"><b>求稳 · 锻造</b><span>苍生·絮泊磨石（疗伤）<br><em>30 精力 · 52.3</em>，单次只赚 1,569，周转快</span></div></div>'
      '<div class="d"><span class="dd" style="background:#E04A7A"></span><div class="dc"><b>求爆 · 烹饪</b><span>膘然心动 <em>50 精力 · 95.3</em><br>先看交易行成交量，别一口气做 60 份</span></div></div>'
      '<div class="d"><span class="dd" style="background:#1D6FE0"></span><div class="dc"><b>做装备 · 缝纫 / 锻造</b><span>50% 暴击后再做玄元星平 / 烽火<br>0% 时部分单件亏 800–3,700</span></div></div>'
      '<div class="d"><span class="dd" style="background:#94A3B8"></span><div class="dc"><b>别碰 · 低阶过渡</b><span>腰刀 / 铜偶 / 灯笼 / 低阶锭<br><strong>100% 暴击仍亏</strong>，直接买更省精力</span></div></div>'
      '</div>',
      '<span>仅 85 条可成交样本</span><span>未建模销量</span>', "", "h540")}</div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">三个不要</h2><div class="card-sub">在按榜单抄作业之前</div></div><div class="card-actions"><span class="badge badge-danger">边界</span></div></div>
  <div class="card-body"><div class="donts">
    <div class="dont"><div class="dt">不要</div><div class="db">按账面榜直接囤货</div><div class="ds">前 12 名 0 条全链路有实时报价</div></div>
    <div class="dont"><div class="dt">不要</div><div class="db">忽略交易行成交量</div><div class="ds">单位精力收益 ≠ 保证卖出</div></div>
    <div class="dont"><div class="dt">不要</div><div class="db">0% 暴击做高端装备</div><div class="ds">部分单件亏 800–3,700</div></div>
  </div></div>
  <div class="card-foot"><span>边界：未建模销量、市场深度、署名溢价与跨服交易；价格随时变，抄作业前先看本服交易行。</span><span>仅游戏内数值 · 非官方</span></div>
</div>
<div class="card" style="margin-top:16px">
  <div class="card-head"><div><h2 class="card-title">没建模的三件事</h2><div class="card-sub">精力收益是决策起点，不是成交承诺</div></div><div class="card-actions"><span class="badge badge-warning">边界</span></div></div>
  <div class="card-body"><div class="grid" style="grid-template-columns:repeat(3,1fr);gap:12px">
    <div class="range-item"><div class="rl">销量</div><div class="rr"><span>交易行能不能吃下这么多份</span></div></div>
    <div class="range-item"><div class="rl">市场深度</div><div class="rr"><span>大单挂上去会不会压价</span></div></div>
    <div class="range-item"><div class="rl">署名溢价</div><div class="rr"><span>紫色以上产物的署名未计价</span></div></div>
  </div></div>
</div>
<div class="formula" style="margin-top:16px"><b>先筛报价</b><span class="op">→</span><b>再算精力</b><span class="op">→</span><b>最后看销量</b><div class="note">别用账面收益替市场做决定<br>价格快照 2026-11-19 14:22</div></div>
"""
    return shell(body, "07", "仅 85 条可成交样本 · 未建模销量/市场深度/署名溢价", "choose")


def render():
    funcs = [
        ("cover", card_cover),
        ("conclusion", card_conclusion),
        ("top10", card_top10),
        ("trap", card_trap),
        ("crit", card_crit),
        ("skills", card_skills),
        ("choose", card_choose),
    ]
    for name, fn in funcs:
        (CARDS / f"{name}.html").write_text(fn(), encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(viewport={"width": 1080, "height": 1440}, device_scale_factor=1)
        for i, (label, name) in enumerate(PAGES, 1):
            pg.goto((CARDS / f"{name}.html").as_uri())
            pg.wait_for_timeout(300)
            pg.screenshot(path=str(BASE / f"{label}.png"), clip={"x": 0, "y": 0, "width": 1080, "height": 1440})
        b.close()


if __name__ == "__main__":
    render()
    print("rendered", len(PAGES))

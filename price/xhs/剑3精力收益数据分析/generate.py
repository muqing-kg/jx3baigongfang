# -*- coding: utf-8 -*-
"""生成小红书 3:4 数据卡片（1080×1440）与文案。"""
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
    "锻造": "#B4472F",
    "缝纫": "#3E5C76",
    "制药": "#4F7A5B",
    "烹饪": "#C08A2E",
    "梓匠": "#6E5A8E",
}
SKILL_ORDER = ["锻造", "缝纫", "制药", "烹饪", "梓匠"]


def e(s):
    return html.escape(str(s), quote=True)


def f1(v):
    return f"{v:.1f}"


def f0(v):
    return f"{v:,.0f}"


def signed(v):
    return ("+" if v > 0 else "−" if v < 0 else "") + f"{abs(v):,.0f}"


def t(x, y, s, size=14, fill="#14110D", weight=400, anchor="start", family="PingFang SC", extra=""):
    return (
        f'<text x="{x:.1f}" y="{y:.1f}" font-family="{family}" font-size="{size}" '
        f'font-weight="{weight}" fill="{fill}" text-anchor="{anchor}" {extra}>{e(s)}</text>'
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


def chart_top10():
    items = S["top_clean"][:10]
    W, H = 936, 664
    x0, x1 = 392, 822
    maxv = 100.0
    y0, row = 40, 61
    b = []
    # grid
    for g in [0, 25, 50, 75, 100]:
        x = x0 + (x1 - x0) * g / maxv
        b.append(line(x, 30, x, 654, "#DCCFBB", 1))
        b.append(t(x, 18, str(g), 11, "#8B7A62", 500, "middle"))
    b.append(t(930, 18, "金 / 精力", 11, "#8B7A62", 500, "end"))
    for i, it in enumerate(items):
        y = y0 + i * row
        color = SKILL_COLOR[it["skill"]]
        b.append(t(0, y + 20, f"{i+1:02d}", 17, "#A08E76", 700, family="Helvetica Neue"))
        b.append(f'<circle cx="31" cy="{y+16:.1f}" r="5" fill="{color}"/>')
        b.append(t(46, y + 23, it["name"], 25, "#14110D", 700))
        b.append(t(46, y + 45, f"{it['skill']} · {it['energy']} 精力 · 利润 {f0(it['profit'])}", 13.5, "#7A6A55", 500))
        b.append(rect(x0, y + 14, x1 - x0, 14, "#EDE3D3", 7))
        w = max(4, (x1 - x0) * it["pe"] / maxv)
        b.append(rect(x0, y + 14, w, 14, "#C8102E" if i == 0 else color, 7))
        b.append(t(930, y + 29, f1(it["pe"]), 30, "#C8102E" if i == 0 else "#14110D", 800, "end", "Helvetica Neue"))
    return svg(W, H, "".join(b), "制作技艺精力收益 TOP 10")


def chart_boxplot():
    groups = S["skill_stats"]
    W, H = 936, 604
    left, right, top, bottom = 100, 900, 40, 528
    ymin, ymax = -15, 60
    centers = [165, 320, 475, 630, 785]
    boxw = 66

    def Y(v):
        return top + (ymax - v) / (ymax - ymin) * (bottom - top)

    b = []
    for gv in [-10, 0, 10, 20, 30, 40, 50, 60]:
        yy = Y(gv)
        b.append(line(left, yy, right, yy, "#DCCFBB", 1))
        b.append(t(left - 12, yy + 4, str(gv), 11, "#8B7A62", 500, "end", "Helvetica Neue"))
    b.append(line(left, Y(0), right, Y(0), "#B8A78E", 1.4))
    b.append(t(30, (top + bottom) / 2, "金 / 精力", 12, "#8B7A62", 600, "middle", extra=f'transform="rotate(-90 30 {(top+bottom)/2})"'))

    for idx, g in enumerate(groups):
        cx = centers[idx]
        color = SKILL_COLOR[g["name"]]
        vals = np.array(g["values"], dtype=float)
        q1, med, q3 = np.percentile(vals, [25, 50, 75])
        iqr = q3 - q1
        lo = vals[vals >= q1 - 1.5 * iqr].min()
        hi = vals[vals <= q3 + 1.5 * iqr].max()
        # whiskers
        b.append(line(cx, Y(hi), cx, Y(q3), color, 1.8))
        b.append(line(cx, Y(q1), cx, Y(lo), color, 1.8))
        b.append(line(cx - 16, Y(hi), cx + 16, Y(hi), color, 1.8))
        b.append(line(cx - 16, Y(lo), cx + 16, Y(lo), color, 1.8))
        # box
        b.append(rect(cx - boxw / 2, Y(q3), boxw, max(2, Y(q1) - Y(q3)), color, 8, 'fill-opacity="0.18"'))
        b.append(f'<rect x="{cx-boxw/2:.1f}" y="{Y(q3):.1f}" width="{boxw}" height="{max(2,Y(q1)-Y(q3)):.1f}" rx="8" fill="none" stroke="{color}" stroke-width="2"/>')
        b.append(line(cx - boxw / 2, Y(med), cx + boxw / 2, Y(med), color, 3.2))
        # dots
        for j, v in enumerate(vals):
            jitter = math.sin(j * 2.17 + idx * 1.3) * 11
            b.append(f'<circle cx="{cx+jitter:.1f}" cy="{Y(v):.1f}" r="2.6" fill="{color}" fill-opacity="0.45"/>')
        # 95.3 超出坐标，用顶部标注
        if g["name"] == "烹饪":
            b.append(t(cx + 8, top + 16, "膘然心动 95.3 ↑", 11, color, 700))
        # labels
        b.append(t(cx, 566, g["name"], 18, "#14110D", 700, "middle"))
        b.append(t(cx, 586, f"n={g['n']} · 最高 {f1(g['max'])}", 11, "#8B7A62", 500, "middle"))
    return svg(W, H, "".join(b), "五类制造技艺精力收益分布")


def chart_scatter():
    pts = S["scatter"]
    W, H = 936, 524
    left, right, top, bottom = 100, 900, 34, 430

    def X(cost):
        c = max(1, min(10000, cost))
        return left + (math.log10(c) / 4.0) * (right - left)

    def Y(v):
        v = max(-15, min(100, v))
        return top + (100 - v) / 115 * (bottom - top)

    b = []
    for g in [1, 10, 100, 1000, 10000]:
        xx = X(g)
        b.append(line(xx, top, xx, bottom, "#DCCFBB", 1))
        lab = {1: "1", 10: "10", 100: "100", 1000: "1千", 10000: "1万"}[g]
        b.append(t(xx, bottom + 20, lab, 11, "#8B7A62", 500, "middle"))
    for gv in [-10, 0, 10, 20, 30, 40, 50, 60]:
        yy = Y(gv)
        b.append(line(left, yy, right, yy, "#DCCFBB", 1))
        b.append(t(left - 12, yy + 4, str(gv), 11, "#8B7A62", 500, "end", "Helvetica Neue"))
    b.append(line(left, Y(0), right, Y(0), "#B8A78E", 1.3))

    # medians
    med_cost = float(np.median([p["cost"] for p in pts]))
    med_pe = float(np.median([p["pe"] for p in pts]))
    b.append(line(X(med_cost), top, X(med_cost), bottom, "#C8102E", 1.2, "4 5", 'stroke-opacity="0.35"'))
    b.append(line(left, Y(med_pe), right, Y(med_pe), "#C8102E", 1.2, "4 5", 'stroke-opacity="0.35"'))

    for p in pts:
        r = 4.6 + min(4.5, p["energy"] / 55)
        b.append(f'<circle cx="{X(p["cost"]):.1f}" cy="{Y(p["pe"]):.1f}" r="{r:.1f}" fill="{SKILL_COLOR[p["skill"]]}" fill-opacity="0.72" stroke="#FFFDF8" stroke-width="0.8"/>')

    labels = [
        ("膘然心动", 12, -12, "start"),
        ("苍生·絮泊磨石（疗伤）", 12, -8, "start"),
        ("拼布72色全包", -12, -14, "end"),
        ("蜀锦绣·腕（力道）", 10, 24, "start"),
    ]
    byname = {p["name"]: p for p in pts}
    for name, dx, dy, anchor in labels:
        p = byname.get(name)
        if not p:
            continue
        b.append(t(X(p["cost"]) + dx, Y(p["pe"]) + dy, name, 11, "#14110D", 700, anchor, extra='stroke="#FFFDF8" stroke-width="3.5" paint-order="stroke"'))
    b.append(t(left + 16, top + 22, "低成本 · 高回报", 12, "#8B7A62", 600, extra='opacity="0.75"'))
    b.append(t(right - 12, top + 22, "高投入 · 高回报", 12, "#8B7A62", 600, "end", extra='opacity="0.75"'))
    b.append(t(30, (top + bottom) / 2, "精力收益（金 / 精力）", 11, "#8B7A62", 600, "middle", extra=f'transform="rotate(-90 30 {(top+bottom)/2})"'))
    b.append(t((left + right) / 2, bottom + 44, "单次材料成本（金 · 对数轴）", 11, "#8B7A62", 500, "middle"))

    # legend
    lx = left
    for s in SKILL_ORDER:
        b.append(f'<circle cx="{lx}" cy="496" r="5" fill="{SKILL_COLOR[s]}"/>')
        b.append(t(lx + 10, 500, s, 11.5, "#6E5E4A", 600))
        lx += 104
    return svg(W, H, "".join(b), "成本与精力收益散点图")


def chart_crit():
    curve = S["curve"]
    W, H = 936, 566
    left, right = 84, 900
    centers = [140, 300, 460, 620, 780]
    top1, bot1 = 38, 292
    top2, bot2 = 356, 512
    b = []

    # top panel bars
    for g in [0, 50, 100, 150]:
        yy = bot1 - g / 154 * (bot1 - top1)
        b.append(line(left, yy, right, yy, "#DCCFBB", 1))
        b.append(t(left - 12, yy + 4, str(g), 11, "#8B7A62", 500, "end", "Helvetica Neue"))
    for i, c in enumerate(curve):
        cx = centers[i]
        h = (c["profitable"] / 154) * (bot1 - top1)
        b.append(rect(cx - 40, bot1 - h, 80, h, "#C8102E" if c["crit"] == 0.5 else "#3E5C76", 7))
        b.append(t(cx, bot1 - h - 10, str(c["profitable"]), 19, "#C8102E" if c["crit"] == 0.5 else "#3E5C76", 800, "middle", "Helvetica Neue"))
        b.append(t(cx, bot1 + 22, f"{int(c['crit']*100)}%", 13, "#6E5E4A", 700, "middle"))
    b.append(t(left - 12, top1 - 12, "盈利条数 / 154", 11, "#8B7A62", 600))
    b.append(t(right, top1 - 12, "红 = 50% 基准", 11, "#C8102E", 600, "end"))

    # bottom panel line
    for g in [0, 3, 6, 9, 12]:
        yy = bot2 - g / 12 * (bot2 - top2)
        b.append(line(left, yy, right, yy, "#DCCFBB", 1))
        b.append(t(left - 12, yy + 4, str(g), 11, "#8B7A62", 500, "end", "Helvetica Neue"))
    pts = []
    for i, c in enumerate(curve):
        cx = centers[i]
        cy = bot2 - c["medianPe"] / 12 * (bot2 - top2)
        pts.append((cx, cy, c))
    path = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y, _ in pts)
    b.append(f'<path d="{path}" fill="none" stroke="#C8102E" stroke-width="3"/>')
    for cx, cy, c in pts:
        b.append(f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="5.5" fill="#FFFDF8" stroke="#C8102E" stroke-width="3"/>')
        b.append(t(cx, cy - 13, f"{c['medianPe']:.2f}", 13, "#C8102E", 800, "middle", "Helvetica Neue"))
        b.append(t(cx, bot2 + 22, f"{int(c['crit']*100)}%", 13, "#6E5E4A", 700, "middle"))
    b.append(t(left - 12, top2 - 12, "中位精力收益", 11, "#8B7A62", 600))
    b.append(t(right, top2 - 12, "单位：金 / 精力", 11, "#8B7A62", 500, "end"))
    b.append(line(centers[2], 24, centers[2], bot2 + 28, "#C8102E", 1, "5 6", 'stroke-opacity="0.35"'))
    return svg(W, H, "".join(b), "暴击率与盈利条数、中位精力收益")


def shell(body, page_no, foot_left, cls=""):
    return f"""<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>{e(page_no)}</title><link rel="stylesheet" href="style.css"></head>
<body><div class="page {cls}"><div class="side l"></div><div class="side r"></div><div class="inner">
<div class="topbar">
  <div class="brand"><div class="seal">价</div><div><b>剑网三物价助手</b><small>JX3 PRICE LEDGER · 玩家自制</small></div></div>
  <div class="topright">数据笔记 · 2026-11-19</div>
</div>
{body}
<div class="footer"><span>{foot_left}</span><span class="pg">{page_no} / 07</span></div>
</div></div></body></html>"""


def card_cover():
    meta = S["meta"]
    body = f"""
<div class="cover-label">剑网3 · 苍生铸世 50级 · 双梦物价</div>
<h1>剑3精力收益<br>数据分析</h1>
<div class="cover-sub">154 条制作技艺 · 暴击率 50% · 扣 5% 交易税</div>
<div class="cover-card dark">
  <div class="cover-kicker">50% 暴击后</div>
  <div class="bigline"><span class="big">124</span><span class="big2">/ 154</span><span class="biglabel">条配方能赚钱<small>0% 暴击时只有 92 条</small></span></div>
  <div class="pbars">
    <div class="prow"><span class="pl">0%</span><div class="track"><i class="ok" style="width:59.74%"></i><i class="no" style="width:40.26%"></i></div><span class="pv">92</span></div>
    <div class="prow"><span class="pl">50%</span><div class="track"><i class="ok" style="width:80.52%"></i><i class="no" style="width:19.48%"></i></div><span class="pv">124</span></div>
  </div>
  <div class="cover-stats">
    <div><div class="k">95.3<em>金/精力</em></div><div class="t">可成交榜 TOP1 · 膘然心动</div></div>
    <div><div class="k">+32<em>条</em></div><div class="t">配方由亏转赚</div></div>
    <div><div class="k">5.64<em>金/精力</em></div><div class="t">154 条中位精力收益</div></div>
  </div>
</div>
<div class="cover-quote">“暴击不是锦上添花，<br>是很多配方的生死线。”</div>
<div class="cover-peek">
  <div class="cp-head">本笔记你会看到<span>4 个看点</span></div>
  <div class="cp-row"><b>01</b><div><strong>账面第一 ≠ 真能赚</strong><small>归营旌：299 → 73 金/精力</small></div><em>P4</em></div>
  <div class="cp-row"><b>02</b><div><strong>高单价 ≠ 高精力收益</strong><small>拼布 47.7 &lt; 磨石 52.3</small></div><em>P3</em></div>
  <div class="cp-row"><b>03</b><div><strong>暴击不是万能</strong><small>20 条即使 100% 暴击仍亏</small></div><em>P5</em></div>
  <div class="cp-row"><b>04</b><div><strong>数据口径先看清</strong><small>双梦 · 154 条 · 5% 税 · 暴击 ×1.5</small></div><em>P2</em></div>
</div>
<div class="cover-foot"><span>数据：剑网三物价助手 · 双梦（梦江南）<br>快照：2026-11-19 14:22 · JX3BOX 拍卖</span><span style="text-align:right">非官方玩家工具<br>价格为拍卖样本，可随行情变化</span></div>
"""
    return shell(body, "01", "完整榜单与分析见后 6 页", "cover-page")


def card_conclusion():
    body = """
<div class="eyebrow">01 / 先说结论</div>
<h2>暴击 50%，<br>赚钱配方从 92 条<br>拉到 124 条</h2>
<div class="compare">
  <div class="compare-head"><span>154 条制造配方</span><span>盈利 / 亏损</span></div>
  <div class="crow"><span class="cl">0%</span><div class="ctrack"><i class="ok" style="width:59.74%">92 盈利</i><i class="no" style="width:40.26%">62 亏损</i></div><span class="cv">92<small> /154</small></span></div>
  <div class="crow"><span class="cl">50%</span><div class="ctrack"><i class="ok" style="width:80.52%">124 盈利</i><i class="no" style="width:19.48%">30 亏损</i></div><span class="cv">124<small> /154</small></span></div>
</div>
<div class="insights">
  <div class="insight"><div class="k">+32<small>条</small></div><div class="t">由亏转赚；其中 6 条是 50 级装备</div></div>
  <div class="insight"><div class="k">0.61 → 5.64</div><div class="t">中位精力收益（金/精力），接近 9 倍</div></div>
  <div class="insight"><div class="k">20<small>条</small></div><div class="t">即使 100% 暴击仍然亏，多是低阶过渡品</div></div>
</div>
<div class="method"><b>口径：</b>双梦（梦江南） · 154 条制造配方 · 市场价 · 5% 交易税 · 暴击 50% 按「额外一份产出」计，期望产出 ×1.5 · 不含采集。<br><b>数据：</b>JX3BOX 拍卖快照 2026-11-19 14:22；无报价物品回退工具示例价。</div>
<div class="small" style="margin-top:10px">“全链路有报价”= 产物和全部材料都有拍卖样本；154 条里只有 85 条满足。P3/P6/P7 用这 85 条；P2/P5 用全部 154 条看暴击敏感性。</div>
<div class="section">
  <div class="sec-head">四条反直觉<span>先记住这四句</span></div>
  <div class="findings">
    <div class="finding"><b>01</b><div><strong>暴击只乘产值，不乘成本</strong><span>材料还是那份材料，毛利率越高，利润放大越明显。</span></div></div>
    <div class="finding"><b>02</b><div><strong>扭亏集中在 50 级装备与半成品</strong><span>玄元星平衫、烽火裤、药引、五色石；低阶过渡品救不回来。</span></div></div>
    <div class="finding"><b>03</b><div><strong>85 / 154 条才全链路有报价</strong><span>其余含示例价；直接抄榜，可能抄到“假收益”。</span></div></div>
    <div class="finding"><b>04</b><div><strong>低阶过渡品是陷阱</strong><span>腰刀、铜偶、灯笼、低阶锭：100% 暴击仍亏，直接买/卖店更省精力。</span></div></div>
  </div>
</div>
<div class="formula"><b>利润</b><span class="op">=</span><b>产值 × 1.5</b><span class="op">× 0.95</span><span class="op">−</span><b>成本</b><div class="note">暴击 50% 的期望口径<br>0.95 = 扣 5% 交易税</div></div>
<div class="big-quote">暴击 50% 是入场券，<br><em>不是印钞机。</em></div>
"""
    return shell(body, "02", "口径：市场价 · 5% 税 · 暴击 50%")


def card_top10():
    body = f"""
<div class="eyebrow">02 / 可成交榜</div>
<h2>双梦 · 制作技艺<br>精力收益 TOP 10</h2>
<div class="sub">只选 <b>85 条</b>「产物 + 全部材料都有拍卖报价」的配方，避开示例价</div>
<div class="chart">{chart_top10()}</div>
<div class="method" style="margin-top:8px"><b>读法：</b>磨石 30 精力赚 1,569，精力收益 52.3；拼布单次赚 4,773，但花 100 精力，精力收益 47.7。<b>高单价 ≠ 高精力收益。</b></div>
<div class="section">
  <div class="sec-head">按精力余量选<span>同一条榜单，换个用法</span></div>
  <div class="energy-table">
    <div class="erow"><b>20–30 精力</b><span><em>磨石</em> 52.3 · <em>药引</em> 10.5 · <em>五色石</em> 6.9 · <em>密银锭</em> 4.8</span></div>
    <div class="erow"><b>50–60 精力</b><span><em>膘然心动</em> 95.3 · <em>瀑沙熔锭</em> 35.8</span></div>
    <div class="erow"><b>80–120 精力</b><span><em>拼布</em> 47.7 · <em>蜀锦绣腕</em> 41.4 · <em>河洛纹衣</em> 31.3</span></div>
    <div class="erow"><b>150–200 精力</b><span><em>锦缝春山囊</em> 36.1 · 玄元装备（示例价，别直接抄）</span></div>
  </div>
</div>
"""
    return shell(body, "03", "单位：金/精力 · 已扣 5% 税 · 暴击 50%")


def card_trap():
    tr = S["trap"]
    body = f"""
<div class="eyebrow">03 / 数据陷阱</div>
<h2>账面 299，<br>实际可能只有 73</h2>
<div class="sub">归营旌：账面第一，但 <b>4 个半成品都没有拍卖报价</b></div>
<div class="trap-top">
  <div class="trap-box book"><div class="lab">账面价 · 半成品按示例价买</div><div class="val">299.1<span class="unit">金/精力</span></div><div class="meta">120 精力 · 单次利润 35,892</div></div>
  <div class="trap-arrow">→</div>
  <div class="trap-box real"><div class="lab">全链路 · 自己补做半成品</div><div class="val">72.7<span class="unit">金/精力</span></div><div class="meta">600 精力 · 单次利润 43,591</div></div>
</div>
<div class="chain"><span class="chip">归营旌 <b>120</b></span><span class="chip">定营铁桩 <b>120</b></span><span class="chip">同袍营幡 <b>120</b></span><span class="chip">安营炊鼎 <b>120</b></span><span class="chip">定魂丹砂 <b>120</b></span><span class="chip total">合计 600 精力</span></div>
<div class="cost-table">
  <div class="cost-row head"><span>口径</span><span>材料成本</span><span>单次利润</span></div>
  <div class="cost-row"><span>半成品按示例价买</span><b>13,983</b><b class="pos">35,892</b></div>
  <div class="cost-row"><span>自己补做半成品</span><b>6,284</b><b class="pos">43,591</b></div>
</div>
<div class="trap-note"><b>前 12 名账面榜，0 条全链路有实时报价。</b>玄元系列成品也没有拍卖样本。看到「示例价」，先按本服交易行校准；归营旌还是低频需求，别按 25 个去规划。</div>
<div class="section">
  <div class="sec-head">账面榜前 6<span>全部含示例价，只能当上限参考</span></div>
  <div class="high-grid">
    <div class="high-item"><span class="hn">玄元松绿衫</span><span class="hv"><b>135.5</b> /精力</span></div>
    <div class="high-item"><span class="hn">璧·苍生</span><span class="hv"><b>131.1</b> /精力</span></div>
    <div class="high-item"><span class="hn">玄元松绿帽</span><span class="hv"><b>127.6</b> /精力</span></div>
    <div class="high-item"><span class="hn">玄元星平护腕</span><span class="hv"><b>125.5</b> /精力</span></div>
    <div class="high-item"><span class="hn">玄元星平护腰</span><span class="hv"><b>114.5</b> /精力</span></div>
    <div class="high-item"><span class="hn">玄元赤地鞋</span><span class="hv"><b>113.8</b> /精力</span></div>
  </div>
  <div class="calib"><b>校准 3 步</b><span>交易行搜同名</span><i>→</i><span>填成交价</span><i>→</i><span>重算精力收益</span></div>
</div>
<div class="section">
  <div class="sec-head">三类配方，三种可信度<span>先看报价，再抄作业</span></div>
  <div class="trust-table">
    <div class="trow head"><span>类型</span><span>例子</span><span>怎么用</span></div>
    <div class="trow"><b style="color:#3F7A5A">全链路有报价</b><span>膘然心动、磨石、拼布</span><em>可成交榜</em></div>
    <div class="trow"><b style="color:#B4472F">成品无报价</b><span>玄元松绿衫、璧·苍生</span><em>只当上限</em></div>
    <div class="trow"><b style="color:#8B5A2B">半成品无报价</b><span>归营旌、定魂丹砂</span><em>补做再算</em></div>
  </div>
</div>
<div class="big-quote" style="font-size:36px;margin-top:16px">报价缺失不是 bug，<br><em>是市场不够深的提醒。</em></div>
"""
    return shell(body, "04", "示例价可校准 · 请以本服交易行为准")


def card_crit():
    body = f"""
<div class="eyebrow">04 / 暴击边际</div>
<h2>0 → 100%，盈利 92 → 134<br>但 20 条怎么加都亏</h2>
<div class="crit-card">{chart_crit()}</div>
<div class="crit-bottom">
  <div class="crit-col"><h4>+32 条由亏转赚（0% → 50%）</h4>
    <div class="flip"><span class="n">玄元星平衫</span><span class="v"><s>−828</s> → <b>+13,807</b></span></div>
    <div class="flip"><span class="n">玄元烽火裤</span><span class="v"><s>−1,858</s> → <b>+13,046</b></span></div>
    <div class="flip"><span class="n">药引</span><span class="v"><s>−26</s> → <b>+210</b></span></div>
    <div class="flip"><span class="n">五色石</span><span class="v"><s>−26</s> → <b>+138</b></span></div>
  </div>
  <div class="crit-col"><h4>20 条即使 100% 暴击仍亏</h4>
    <div class="flip"><span class="n">玄武腰刀 / 麒麟腰刀</span><span class="v">低阶武器</span></div>
    <div class="flip"><span class="n">铜偶 / 元宝灯 / 灯笼</span><span class="v">玩具摆件</span></div>
    <div class="flip"><span class="n">丹青染布画 / 彩缕花绫包</span><span class="v">冷门成品</span></div>
    <div class="flip"><span class="n">低阶锭 / 饺子皮</span><span class="v">过渡材料</span></div>
  </div>
</div>
<div class="small" style="margin-top:10px"><b style="color:#C8102E">暴击解决毛利，不解决需求。</b>越贵的成品，暴击的绝对增益越大；但低阶过渡品定价太低，加到 100% 也救不回来。</div>
<div class="takeaway"><b>50% 是拐点：</b>0→50% 多 32 条，50→100% 只多 10 条；0% 的 0.61 → 100% 的 11.61，暴击的边际收益仍在。</div>
<div class="section">
  <div class="sec-head">同一配方，暴击 0 / 50 / 100<span>单次利润（金）</span></div>
  <div class="crit-compare">
    <div class="cc-row head"><span>配方</span><span>0%</span><span>50%</span><span>100%</span></div>
    <div class="cc-row"><span>膘然心动</span><b>2,868</b><b>4,767</b><b>6,667</b></div>
    <div class="cc-row"><span>苍生·絮泊磨石</span><b>988</b><b>1,569</b><b>2,151</b></div>
    <div class="cc-row"><span>拼布72色全包</span><b>688</b><b>4,773</b><b>8,859</b></div>
    <div class="cc-row"><span>蜀锦绣·腕（力道）</span><b>1,696</b><b>4,973</b><b>8,251</b></div>
  </div>
</div>
"""
    return shell(body, "05", "154 条制造配方 · 价格含示例价")


def card_skills():
    stats = {g["name"]: g for g in S["skill_stats"]}
    cells = []
    for name in SKILL_ORDER:
        g = stats[name]
        cells.append(f'<div class="skill-cell"><div class="n">{name}</div><div class="m" style="color:{SKILL_COLOR[name]}">{f1(g["median"])}</div><div class="d">n={g["n"]} · 最高 {f1(g["max"])}</div></div>')
    body = f"""
<div class="eyebrow">05 / 五技艺</div>
<h2>缝纫中位数最高，<br>烹饪靠爆款，制药最薄</h2>
<div class="chart">{chart_boxplot()}</div>
<div class="skill-table">{''.join(cells)}</div>
<div class="small" style="margin-top:8px"><b style="color:#C8102E">读法：</b>缝纫中位 7.4 但 7/18 仍亏；锻造上限高、分化大；制药最高只有 21.8；梓匠靠拼布一个爆款。仅统计 85 条全链路有拍卖报价的配方，点为单条配方。</div>
<div class="section">
  <div class="sec-head">一句话结论<span>按你的目标选</span></div>
  <div class="skill-notes">
    <div class="snote"><b style="color:#3E5C76">缝纫</b><span><em>中位最高</em>，但 7/18 亏；优先腕、囊、衣，别做包。</span></div>
    <div class="snote"><b style="color:#B4472F">锻造</b><span><em>上限高、分化大</em>；磨石/熔锭稳，装备要先校准成品价。</span></div>
    <div class="snote"><b style="color:#C08A2E">烹饪</b><span><em>靠爆款</em>；膘然一个拉高均值，别按均值规划产量。</span></div>
    <div class="snote"><b style="color:#4F7A5B">制药</b><span><em>最薄</em>；中位 3.0、最高 21.8，适合顺手做或自用。</span></div>
    <div class="snote"><b style="color:#6E5A8E">梓匠</b><span><em>拼布一个爆款</em>；其他长尾，别为它专门转技艺。</span></div>
  </div>
</div>
"""
    return shell(body, "06", "仅 85 条全链路有拍卖报价的配方")


def card_choose():
    body = f"""
<div class="eyebrow">06 / 怎么选</div>
<h2>别只看单次利润：<br>精力收益 = 利润 / 精力</h2>
<div class="chart">{chart_scatter()}</div>
<div class="rec-grid">
  <div class="rec"><span class="dot" style="background:#B4472F"></span><div><div class="rt">求稳 · 锻造</div><div class="rb">苍生·絮泊磨石（疗伤）<br><em>30 精力 · 52.3</em> · 单次只赚 1,569，周转快</div></div></div>
  <div class="rec"><span class="dot" style="background:#C08A2E"></span><div><div class="rt">求爆 · 烹饪</div><div class="rb">膘然心动 <em>50 精力 · 95.3</em><br>先看交易行成交量，别一口气做 60 份</div></div></div>
  <div class="rec"><span class="dot" style="background:#3E5C76"></span><div><div class="rt">做装备 · 缝纫/锻造</div><div class="rb">50% 暴击后再做玄元星平 / 烽火<br>0% 时部分单件亏 800–3,700</div></div></div>
  <div class="rec"><span class="dot" style="background:#8B7A62"></span><div><div class="rt">别碰 · 低阶过渡</div><div class="rb">腰刀 / 铜偶 / 灯笼 / 低阶锭<br>100% 暴击仍亏，直接买更省精力</div></div></div>
</div>
<div class="flow"><span>1 先筛报价</span><i>→</i><span>2 再算精力</span><i>→</i><span>3 最后看销量</span></div>
<div class="donts">
  <div class="dont"><b>不要</b><span>按账面榜直接囤货</span></div>
  <div class="dont"><b>不要</b><span>忽略交易行成交量</span></div>
  <div class="dont"><b>不要</b><span>0% 暴击做高端装备</span></div>
</div>
<div class="big-quote" style="font-size:36px;margin-top:14px">别用账面收益，<br><em>替市场做决定。</em></div>
<div class="small" style="margin-top:8px"><b style="color:#C8102E">边界：</b>仅 85 条可成交样本；未建模销量、市场深度、署名溢价与跨服交易；价格随时变，抄作业前先看本服交易行。</div>
"""
    return shell(body, "07", "未建模销量 / 市场深度 / 署名溢价")


def render():
    pages_html = {
        "cover": card_cover(),
        "conclusion": card_conclusion(),
        "top10": card_top10(),
        "trap": card_trap(),
        "crit": card_crit(),
        "skills": card_skills(),
        "choose": card_choose(),
    }
    for name, fn in [("cover", card_cover), ("conclusion", card_conclusion), ("top10", card_top10),
                     ("trap", card_trap), ("crit", card_crit), ("skills", card_skills), ("choose", card_choose)]:
        (CARDS / f"{name}.html").write_text(fn(), encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_page(viewport={"width": 1080, "height": 1440}, device_scale_factor=1)
        for i, (label, name) in enumerate(PAGES, 1):
            pg.goto((CARDS / f"{name}.html").as_uri())
            pg.wait_for_timeout(350)
            pg.screenshot(path=str(BASE / f"{label}.png"), clip={"x": 0, "y": 0, "width": 1080, "height": 1440})
        b.close()


if __name__ == "__main__":
    render()
    print("rendered", len(PAGES))

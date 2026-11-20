# -*- coding: utf-8 -*-
"""剑3精力收益数据分析 · 计算模块
输入：data/snapshot.json（JX3BOX 双梦/梦江南 拍卖快照）
输出：summary.json / 数据明细.csv
口径：市场价、5% 交易税、暴击 50% = 期望产出 ×1.5；仅 5 类制造技艺。
"""
import csv
import json
import math
import statistics
from collections import Counter
from pathlib import Path

BASE = Path(__file__).resolve().parent
SNAP = BASE / "data" / "snapshot.json"
TAX = 0.05
CRIT = 0.50
SKILL_ORDER = ["duanzao", "fengren", "zhiyao", "pengren", "zijiang"]


def load():
    d = json.loads(SNAP.read_text(encoding="utf-8"))
    items = {i["id"]: i for i in d["items"]}
    server_id = "s_mengjiangnan"
    quotes = d["serverPrices"][server_id]
    skills = {s["id"]: s for s in d["skills"]}
    recipes = [r for r in d["recipes"] if r.get("kind") != "gather"]
    return d, items, quotes, skills, recipes


def make_helpers(items, quotes):
    def price(item_id):
        q = quotes.get(item_id)
        if q and float(q) > 0:
            return float(q)
        return float(items[item_id].get("base") or 0)

    def has_quote(item_id):
        q = quotes.get(item_id)
        return bool(q and float(q) > 0)

    return price, has_quote


def calc_recipe(r, price, crit=CRIT, tax=TAX):
    cost = sum(price(m["item"]) * m["qty"] for m in r.get("materials", []))
    cost += float(r.get("fee") or 0)
    gross = sum(
        price(o["item"]) * o["qty"] * (o.get("chance") or 1)
        for o in r.get("outputs", [])
    ) * (1 + crit)
    net = gross * (1 - tax)
    profit = net - cost
    energy = float(r.get("energy") or 0)
    return {
        "cost": cost,
        "gross": gross,
        "net": net,
        "profit": profit,
        "energy": energy,
        "pe": profit / energy if energy else None,
        "margin": profit / net if net else None,
    }


def full_chain(item_id, qty, items, quotes, price, has_quote, stack=()):
    """只把「没有拍卖报价、但可制造」的半成品展开成材料+精力。
    有报价的材料按市场价买入。返回 (材料成本, 总精力, 制造次数)。"""
    if has_quote(item_id):
        return price(item_id) * qty, 0.0, 0
    producers = [r for r in ALL_RECIPES if any(o["item"] == item_id for o in r["outputs"])]
    if not producers or item_id in stack:
        return price(item_id) * qty, 0.0, 0
    r = producers[0]
    out = next(o for o in r["outputs"] if o["item"] == item_id)
    per = float(out.get("qty") or 1)
    n = max(1, math.ceil(qty / per - 1e-9))
    cost = 0.0
    energy = float(r.get("energy") or 0) * n
    crafts = n
    for m in r.get("materials", []):
        c, e, k = full_chain(m["item"], m["qty"] * n, items, quotes, price, has_quote, stack + (item_id,))
        cost += c
        energy += e
        crafts += k
    return cost, energy, crafts


def main():
    d, items, quotes, skills, recipes = load()
    price, has_quote = make_helpers(items, quotes)
    global ALL_RECIPES
    ALL_RECIPES = recipes

    rows = []
    for r in recipes:
        out_q = all(has_quote(o["item"]) for o in r["outputs"])
        mat_q = all(has_quote(m["item"]) for m in r["materials"])
        c0 = calc_recipe(r, price, crit=0)
        c5 = calc_recipe(r, price, crit=CRIT)
        c10 = calc_recipe(r, price, crit=1.0)
        rows.append({
            "recipe": r,
            "name": r["name"],
            "skillId": r["skillId"],
            "skill": skills[r["skillId"]]["name"],
            "level": r.get("level"),
            "energy": r["energy"],
            "clean": out_q and mat_q,
            "outputQuoted": out_q,
            "materialQuoted": mat_q,
            "c0": c0,
            "c50": c5,
            "c100": c10,
        })

    rows_all = sorted(rows, key=lambda x: -(x["c50"]["pe"] or -1e9))
    clean = [x for x in rows_all if x["clean"]]

    # 账面榜前 12 的报价状态
    top12 = rows_all[:12]
    # 归营旌全链路
    gy = next(x for x in rows_all if x["name"] == "归营旌")
    # 归营旌成品有报价，但 4 个半成品没有；这里按「自己补做半成品」展开。
    gy_cost = 0.0
    gy_mats_energy = 0.0
    gy_crafts = 1
    for m in gy["recipe"]["materials"]:
        c, e, k = full_chain(m["item"], m["qty"], items, quotes, price, has_quote)
        gy_cost += c
        gy_mats_energy += e
        gy_crafts += k
    gy_energy = float(gy["energy"]) + gy_mats_energy
    gy_net = gy["c50"]["net"]
    gy_full_profit = gy_net - gy_cost
    gy_full_pe = gy_full_profit / gy_energy if gy_energy else 0

    # 各技艺（可成交样本）
    skill_stats = []
    for sid in SKILL_ORDER:
        vals = [x["c50"]["pe"] for x in clean if x["skillId"] == sid]
        vals_sorted = sorted(vals)
        if not vals:
            continue
        n = len(vals)
        q1 = vals_sorted[max(0, math.ceil(n * 0.25) - 1)]
        med = (vals_sorted[(n - 1) // 2] + vals_sorted[n // 2]) / 2
        q3 = vals_sorted[min(n - 1, math.ceil(n * 0.75) - 1)]
        skill_stats.append({
            "skillId": sid,
            "name": skills[sid]["name"],
            "n": n,
            "min": min(vals),
            "q1": q1,
            "median": med,
            "q3": q3,
            "max": max(vals),
            "mean": sum(vals) / n,
            "negative": sum(1 for v in vals if v < 0),
            "values": vals_sorted,
        })

    # 暴击曲线（全部 154 条）
    curve = []
    for crit in [0, 0.25, 0.5, 0.75, 1.0]:
        profits, pes = [], []
        for x in rows:
            c = calc_recipe(x["recipe"], price, crit=crit)
            profits.append(c["profit"])
            pes.append(c["pe"] or 0)
        curve.append({
            "crit": crit,
            "profitable": sum(1 for p in profits if p > 0),
            "losing": sum(1 for p in profits if p <= 0),
            "medianPe": statistics.median(pes),
        })

    flips = [x for x in rows_all if x["c0"]["profit"] <= 0 < x["c50"]["profit"]]
    still_lose_100 = [x for x in rows_all if x["c100"]["profit"] <= 0]

    summary = {
        "meta": {
            "server": "s_mengjiangnan",
            "serverLabel": "双梦（梦江南）",
            "priceUpdatedAt": d["meta"].get("priceUpdatedAt"),
            "catalogVersion": d["meta"].get("catalogVersion"),
            "tax": TAX,
            "crit": CRIT,
            "recipes": len(rows),
            "clean": len(clean),
            "skills": skills,
        },
        "curve": curve,
        "flips": [
            {
                "name": x["name"], "skill": x["skill"], "energy": x["energy"],
                "p0": x["c0"]["profit"], "p50": x["c50"]["profit"],
                "pe50": x["c50"]["pe"], "clean": x["clean"],
                "level": x["level"],
            }
            for x in flips
        ],
        "still_lose_100": [
            {"name": x["name"], "skill": x["skill"], "pe100": x["c100"]["pe"]}
            for x in still_lose_100
        ],
        "top12": [
            {"name": x["name"], "skill": x["skill"], "pe": x["c50"]["pe"], "clean": x["clean"]}
            for x in top12
        ],
        "top_clean": [
            {
                "name": x["name"], "skill": x["skill"], "energy": x["energy"],
                "level": x["level"], "pe": x["c50"]["pe"], "cost": x["c50"]["cost"],
                "profit": x["c50"]["profit"], "margin": x["c50"]["margin"],
            }
            for x in clean[:15]
        ],
        "top_all": [
            {
                "name": x["name"], "skill": x["skill"], "energy": x["energy"],
                "level": x["level"], "pe": x["c50"]["pe"], "cost": x["c50"]["cost"],
                "profit": x["c50"]["profit"], "clean": x["clean"],
            }
            for x in rows_all[:20]
        ],
        "skill_stats": skill_stats,
        "scatter": [
            {
                "name": x["name"], "skill": x["skill"], "skillId": x["skillId"],
                "cost": x["c50"]["cost"], "pe": x["c50"]["pe"],
                "energy": x["energy"],
            }
            for x in clean
        ],
        "trap": {
            "name": "归营旌",
            "bookPe": gy["c50"]["pe"],
            "bookProfit": gy["c50"]["profit"],
            "bookCost": gy["c50"]["cost"],
            "bookEnergy": gy["energy"],
            "fullEnergy": gy_energy,
            "fullCost": gy_cost,
            "fullProfit": gy_full_profit,
            "fullPe": gy_full_pe,
            "crafts": gy_crafts,
            "intermediates": ["定营铁桩", "同袍营幡", "安营炊鼎", "定魂丹砂"],
        },
        "basket": {
            "energy": sum(x["energy"] for x in rows),
            "cost": sum(x["c50"]["cost"] for x in rows),
            "profit0": sum(x["c0"]["profit"] for x in rows),
            "profit50": sum(x["c50"]["profit"] for x in rows),
        },
    }

    (BASE / "summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # CSV
    with (BASE / "数据明细.csv").open("w", newline="", encoding="utf-8-sig") as f:
        w = csv.writer(f)
        w.writerow([
            "排名_50暴击", "配方", "技艺", "等级", "单次精力",
            "材料成本", "税后产值_0暴击", "利润_0暴击", "精力收益_0暴击",
            "税后产值_50暴击", "利润_50暴击", "精力收益_50暴击", "毛利率_50暴击",
            "产物有拍卖报价", "材料全有拍卖报价", "全链路有报价",
        ])
        for i, x in enumerate(rows_all, 1):
            w.writerow([
                i, x["name"], x["skill"], x["level"], x["energy"],
                round(x["c50"]["cost"], 2),
                round(x["c0"]["net"], 2), round(x["c0"]["profit"], 2), round(x["c0"]["pe"], 2),
                round(x["c50"]["net"], 2), round(x["c50"]["profit"], 2), round(x["c50"]["pe"], 2),
                f"{x['c50']['margin']*100:.1f}%" if x["c50"]["margin"] is not None else "",
                "是" if x["outputQuoted"] else "否",
                "是" if x["materialQuoted"] else "否",
                "是" if x["clean"] else "否",
            ])

    print(json.dumps({
        "recipes": len(rows),
        "clean": len(clean),
        "curve": [(c["crit"], c["profitable"]) for c in curve],
        "flips": len(flips),
        "trap": summary["trap"],
        "basket": summary["basket"],
        "top_clean": summary["top_clean"][:5],
    }, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Extract the Web app catalog and breakthrough data into one JSON model for Excel."""
from __future__ import annotations

import json
import math
import re
import sys
from collections import defaultdict, deque
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "build" / "excel_model.json"


def load_js_global(path: Path, global_name: str) -> dict:
    text = path.read_text(encoding="utf-8")
    match = re.search(re.escape(global_name) + r"\s*=\s*(\{.*\});", text, re.S)
    if not match:
        raise SystemExit(f"cannot find {global_name} in {path}")
    return json.loads(match.group(1))


def main() -> None:
    data = load_js_global(ROOT / "assets" / "data.js", "window.JX3Data")
    bt = load_js_global(ROOT / "assets" / "breakthrough-data.js", "window.JX3Breakthrough")
    mapping = json.loads((ROOT / "scripts" / "jx3-item-map.json").read_text(encoding="utf-8"))

    servers = data["servers"]
    items = data["items"]
    recipes = data["recipes"]
    item_by_id = {i["id"]: i for i in items}

    # ---- catalog item keys -------------------------------------------------
    catalog_key = {}
    for item in items:
        key = mapping.get(item["name"])
        catalog_key[item["id"]] = key or f"catalog:{item['id']}"

    # ---- per-server catalog prices (JX3BOX quote, then base seed) ----------
    catalog_prices = {}
    catalog_quotes = {}
    for server in servers:
        sid = server["id"]
        bucket = (data.get("serverPrices") or {}).get(sid) or {}
        catalog_prices[sid] = {}
        catalog_quotes[sid] = {}
        for item in items:
            quote = bucket.get(item["id"])
            if isinstance(quote, (int, float)) and quote > 0:
                catalog_quotes[sid][item["id"]] = round(float(quote), 2)
            else:
                catalog_quotes[sid][item["id"]] = None
            price = quote if isinstance(quote, (int, float)) and quote > 0 else item.get("base") or 0
            catalog_prices[sid][item["id"]] = round(float(price), 2) if price else None

    # ---- breakthrough item master -----------------------------------------
    bt_items = bt["items"]
    bt_index_by_key = {}
    for idx, item in enumerate(bt_items):
        bt_index_by_key[item["k"]] = idx

    master = {}
    for idx, item in enumerate(bt_items):
        master[item["k"]] = {
            "key": item["k"],
            "name": item["n"],
            "quality": item.get("q"),
            "category": "突破",
            "btIndex": idx,
            "catalogId": None,
            "base": None,
        }

    for item in items:
        key = catalog_key[item["id"]]
        row = master.setdefault(
            key,
            {
                "key": key,
                "name": item["name"],
                "quality": item.get("tier"),
                "category": "基础",
                "btIndex": bt_index_by_key.get(key),
                "catalogId": item["id"],
                "base": item.get("base"),
            },
        )
        row["catalogId"] = item["id"]
        row["name"] = item["name"]
        row["base"] = item.get("base")
        row["category"] = "基础"
        if row.get("btIndex") is None:
            row["btIndex"] = bt_index_by_key.get(key)

    # stone items
    for stone in data.get("stones") or []:
        key = stone.get("itemId")
        if not key:
            continue
        row = master.setdefault(
            key,
            {
                "key": key,
                "name": stone.get("name") or key,
                "quality": stone.get("quality"),
                "category": "五行石",
                "btIndex": bt_index_by_key.get(key),
                "catalogId": None,
                "base": stone.get("base"),
            },
        )
        row["category"] = "五行石"
        row["base"] = stone.get("base")

    # ---- per-server master prices -----------------------------------------
    bt_prices = bt.get("prices") or {}
    stone_prices = data.get("stonePrices") or {}
    master_rows = []
    for row in master.values():
        market_prices = {}
        bt_prices_row = {}
        for server in servers:
            sid = server["id"]
            quote = None
            if row["catalogId"]:
                quote = catalog_quotes[sid].get(row["catalogId"])
            snap = None
            if row["btIndex"] is not None:
                values = bt_prices.get(sid) or []
                if row["btIndex"] < len(values):
                    snap = values[row["btIndex"]]
            stone = None
            if row["category"] == "五行石":
                stone = (stone_prices.get(sid) or {}).get(row["key"])
            base = row.get("base")

            # 技艺收益口径：JX3BOX 本服报价 > 目录基准价（与网页版 seedPrice 一致）。
            market = quote if quote else (stone if stone else None)
            if not market:
                market = base if base else (snap if snap else None)
            # 突破口径：本服报价 > 突破快照；绝不回退到目录基准价。
            breakthrough = quote if quote else (stone if stone else None)
            if not breakthrough:
                breakthrough = snap

            market_prices[sid] = round(float(market), 2) if market else None
            bt_prices_row[sid] = round(float(breakthrough), 2) if breakthrough else None
        row["prices"] = market_prices
        row["marketPrices"] = market_prices
        row["btPrices"] = bt_prices_row
        master_rows.append(row)

    master_rows.sort(key=lambda r: (r["category"] != "基础", r["name"], r["key"]))
    item_index = {row["key"]: i + 1 for i, row in enumerate(master_rows)}

    # ---- catalog recipes with item keys -----------------------------------
    catalog_recipes = []
    for recipe in recipes:
        materials = []
        for mat in recipe.get("materials") or []:
            item = item_by_id.get(mat["item"])
            if not item:
                raise SystemExit(f"missing material {mat['item']} in {recipe['id']}")
            materials.append(
                {
                    "itemId": mat["item"],
                    "name": item["name"],
                    "key": catalog_key[mat["item"]],
                    "qty": float(mat["qty"]),
                }
            )
        outputs = []
        for out in recipe.get("outputs") or []:
            item = item_by_id.get(out["item"])
            if not item:
                raise SystemExit(f"missing output {out['item']} in {recipe['id']}")
            outputs.append(
                {
                    "itemId": out["item"],
                    "name": item["name"],
                    "key": catalog_key[out["item"]],
                    "qty": float(out.get("qty") or 1),
                    "qtyMin": out.get("qtyMin"),
                    "qtyMax": out.get("qtyMax"),
                    "chance": 1.0 if out.get("chance") is None else float(out["chance"]),
                }
            )
        catalog_recipes.append(
            {
                "id": recipe["id"],
                "skillId": recipe["skillId"],
                "name": recipe["name"],
                "kind": recipe.get("kind", "craft"),
                "level": int(recipe.get("level") or 1),
                "tier": int(recipe.get("tier") or 1),
                "energy": float(recipe.get("energy") or 1),
                "fee": float(recipe.get("fee") or 0),
                "materials": materials,
                "outputs": outputs,
                "note": recipe.get("note", ""),
            }
        )

    # ---- cycle analysis for "取最低" -------------------------------------
    # Directed graph: output item -> each material item. Cycle if they share an SCC.
    graph = defaultdict(set)
    producers_by_item = defaultdict(list)
    for recipe in catalog_recipes:
        if recipe["kind"] != "craft":
            continue
        for out in recipe["outputs"]:
            for mat in recipe["materials"]:
                graph[out["itemId"]].add(mat["itemId"])
        for out in recipe["outputs"]:
            producers_by_item[out["itemId"]].append(recipe["id"])

    # Tarjan SCC
    index_counter = [0]
    stack, on_stack = [], set()
    indices, lowlink, scc_id = {}, {}, {}
    scc_count = [0]

    def strongconnect(v):
        indices[v] = lowlink[v] = index_counter[0]
        index_counter[0] += 1
        stack.append(v)
        on_stack.add(v)
        for w in graph.get(v, ()):
            if w not in indices:
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif w in on_stack:
                lowlink[v] = min(lowlink[v], indices[w])
        if lowlink[v] == indices[v]:
            while True:
                w = stack.pop()
                on_stack.discard(w)
                scc_id[w] = scc_count[0]
                if w == v:
                    break
            scc_count[0] += 1

    for item_id in [i["id"] for i in items]:
        if item_id not in indices:
            strongconnect(item_id)

    # A producer is safe when no output shares an SCC with any material.
    recipe_cycle = {}
    for recipe in catalog_recipes:
        if recipe["kind"] != "craft":
            continue
        cyclic = False
        for out in recipe["outputs"]:
            for mat in recipe["materials"]:
                if scc_id.get(out["itemId"]) == scc_id.get(mat["itemId"]):
                    cyclic = True
                    break
        recipe_cycle[recipe["id"]] = cyclic

    # Depth for acyclic edges (longest path), used only for reporting.
    indeg = defaultdict(int)
    for out, mats in graph.items():
        for mat in mats:
            indeg[out] += 0  # placeholder
    depth = {i["id"]: 0 for i in items}
    # topological order ignoring cyclic edges
    safe_edges = defaultdict(set)
    for recipe in catalog_recipes:
        if recipe["kind"] != "craft" or recipe_cycle.get(recipe["id"]):
            continue
        for out in recipe["outputs"]:
            for mat in recipe["materials"]:
                if mat["itemId"] != out["itemId"]:
                    safe_edges[out["itemId"]].add(mat["itemId"])
    order = []
    pending = {i["id"]: len(safe_edges[i["id"]]) for i in items}
    q = deque([i for i, n in pending.items() if n == 0])
    while q:
        v = q.popleft()
        order.append(v)
        for out, mats in safe_edges.items():
            if v in mats:
                pending[out] -= 1
                if pending[out] == 0:
                    q.append(out)
    for v in order:
        for out, mats in safe_edges.items():
            if v in mats:
                depth[out] = max(depth[out], depth[v] + 1)

    # ---- breakthrough recipes --------------------------------------------
    bt_recipes = []
    for recipe in bt["recipes"]:
        mats = []
        for mat_idx, qty in recipe["m"]:
            if not (0 <= mat_idx < len(bt_items)):
                raise SystemExit(f"bad material index {mat_idx} in {recipe['n']}")
            mats.append(
                {
                    "btIndex": mat_idx,
                    "key": bt_items[mat_idx]["k"],
                    "name": bt_items[mat_idx]["n"],
                    "qty": float(qty),
                }
            )
        outs = []
        for out in recipe["o"]:
            out_idx, qty_min, qty_max, chance = out
            if not (0 <= out_idx < len(bt_items)):
                raise SystemExit(f"bad output index {out_idx} in {recipe['n']}")
            outs.append(
                {
                    "btIndex": out_idx,
                    "key": bt_items[out_idx]["k"],
                    "name": bt_items[out_idx]["n"],
                    "qtyMin": float(qty_min),
                    "qtyMax": float(qty_max),
                    "chance": 1.0 if chance is None else float(chance),
                }
            )
        bt_recipes.append(
            {
                "id": recipe["i"],
                "skillId": recipe["s"],
                "name": recipe["n"],
                "level": int(recipe["l"]),
                "exp": float(recipe["x"]),
                "energy": float(recipe["e"]),
                "materials": mats,
                "outputs": outs,
            }
        )

    gates = []
    for skill_id, rows in (bt.get("gates") or {}).items():
        for gate in rows:
            mats = []
            for mat_idx, qty in gate["r"]:
                mats.append(
                    {
                        "btIndex": mat_idx,
                        "key": bt_items[mat_idx]["k"],
                        "name": bt_items[mat_idx]["n"],
                        "qty": float(qty),
                    }
                )
            gates.append(
                {
                    "skillId": skill_id,
                    "level": int(gate["l"]),
                    "name": gate["n"],
                    "materials": mats,
                }
            )

    skills = [{"id": s["id"], "name": s["name"], "type": s["type"]} for s in data["skills"]]

    # 用户提供的逐级经验观测点：1→2、3→4、8→9、11→12、14→15、30→31。
    # 点间线性插值；31 级起按 14→30 段斜率外推；四舍五入到 10。
    observations = [(1, 250), (3, 510), (8, 1150), (11, 1370), (14, 1410), (30, 1650)]

    def raw_need(level: int) -> float:
        if level <= observations[0][0]:
            return float(observations[0][1])
        for i in range(len(observations) - 1):
            a, b = observations[i], observations[i + 1]
            if a[0] <= level <= b[0]:
                return a[1] + (b[1] - a[1]) * (level - a[0]) / (b[0] - a[0])
        a, b = observations[-2], observations[-1]
        return b[1] + (b[1] - a[1]) * (level - b[0]) / (b[0] - a[0])

    def need(level: int) -> int:
        return max(1, int(math.floor(raw_need(level) / 10 + 0.5) * 10))

    exp_table = [
        {
            "level": level,
            "need": need(level),
            "source": "观测" if any(level == o[0] for o in observations) else ("外推" if level > 30 else "插值"),
        }
        for level in range(1, 50)
    ]

    model = {
        "meta": {
            "version": data["meta"].get("catalogVersion"),
            "priceUpdatedAt": data["meta"].get("priceUpdatedAt"),
            "btPriceUpdatedAt": bt["meta"].get("priceUpdatedAt"),
            "verifiedAt": data["meta"].get("verifiedAt"),
            "expModel": {"method": "piecewise-linear", "observations": observations, "roundTo": 10},
            "expTable": exp_table,
            "expTotal": sum(row["need"] for row in exp_table),
            "expObservations": [{"level": l, "exp": e} for l, e in observations],
            "gatherExp": bt["meta"].get("gatherExp") or 80,
        },
        "servers": [{"id": s["id"], "name": s["name"], "region": s.get("region", "")} for s in servers],
        "skills": skills,
        "masterItems": master_rows,
        "catalogItems": [
            {
                "id": item["id"],
                "name": item["name"],
                "skillId": item.get("skillId"),
                "kind": item.get("kind"),
                "tier": item.get("tier"),
                "base": item.get("base"),
                "key": catalog_key[item["id"]],
                "note": item.get("origin", ""),
            }
            for item in items
        ],
        "itemIndex": item_index,
        "catalogRecipes": catalog_recipes,
        "recipeCycle": recipe_cycle,
        "btRecipes": bt_recipes,
        "gates": gates,
        "stoneRecipes": data.get("stoneRecipes") or [],
        "stones": data.get("stones") or [],
        "stonePrices": data.get("stonePrices") or {},
        "stoneMeta": data.get("stoneMeta") or {},
        "stats": {
            "catalogItems": len(items),
            "masterItems": len(master_rows),
            "catalogRecipes": len(catalog_recipes),
            "craftRecipes": sum(1 for r in catalog_recipes if r["kind"] == "craft"),
            "gatherRecipes": sum(1 for r in catalog_recipes if r["kind"] == "gather"),
            "btRecipes": len(bt_recipes),
            "btItems": len(bt_items),
            "gates": len(gates),
            "cyclicRecipes": sorted(k for k, v in recipe_cycle.items() if v),
            "maxMaterials": max(len(r["materials"]) for r in catalog_recipes),
            "maxOutputs": max(len(r["outputs"]) for r in catalog_recipes),
            "btMaxMaterials": max(len(r["materials"]) for r in bt_recipes),
            "btMaxOutputs": max(len(r["outputs"]) for r in bt_recipes),
        },
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(model, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(model["stats"], ensure_ascii=False, indent=2))
    print(f"wrote {OUT} ({OUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()

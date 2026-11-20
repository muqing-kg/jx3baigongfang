/* =========================================================================
   物价助手 · 苍生铸世 50 级生活技艺数据
   数据版本：v3.6（2026-11-19）
   价格修订：2026-11-20T19:07:15+08:00 · JX3BOX 全服拍卖
   制造：JX3BOX 技艺助手 API · 154 条代表配方
   采集：21 条按材料拆分；产值按掉率折算
   五行石：1-8 级拍卖价 + 快速/最优合成 + 7/8 爆率盈亏线
   ========================================================================= */
window.JX3Data = {
  "meta": {
    "game": "剑网3",
    "expansion": "苍生铸世",
    "levelCap": 50,
    "version": "苍生铸世 · 50 级",
    "catalogVersion": "v3.6",
    "seedVersion": "cs50-v3.6",
    "updatedAt": "2026-11-19",
    "verifiedAt": "2026-11-19",
    "disclaimer": "制造配方与采集产出名称来自 JX3BOX 当前版本数据；采集按目标材料 + 稀有副产物掉率折算期望产值，稀有掉率为示例。各服务器价格由 scripts/update-jx3-prices.mjs 从 JX3BOX 拍卖自动更新；样本不足、无报价或异常高值回退梦江南示例价，请以本服交易行为准。",
    "sources": [
      {
        "label": "JX3BOX 技艺助手",
        "url": "https://www.jx3box.com/pvg/manufacture",
        "note": "2026-11-18 核验：制造技艺为锻造/缝纫/制药/烹饪/梓匠；玄元星平衫 50 级、200 精力、材料与梦江南昨日均价"
      },
      {
        "label": "官网 9-24 生活技艺焕新",
        "url": "https://news.17173.com/content/09242026/113440485.shtml",
        "note": "技艺等级重返 50 级、等级突破、产物暴击、紫色以上署名、新配方与新地图材料"
      },
      {
        "label": "咸鱼有话说 305 期（11-14）",
        "url": "https://news.17173.com/content/11142026/213539983.shtml",
        "note": "家园采集/梓匠配方等级下调；芦苇、珊瑚、竹子、木料、马草、拼布、木板、器物令、路菜、挂件包"
      },
      {
        "label": "咸鱼有话说306期（11-14）",
        "url": "https://weibo.com/ttarticle/p/show?id=2309405365124419945202",
        "note": "11-19 更新：家园原料/马草采集、拼布/木板/器物令、路菜/挂件包·背部/腰部制造等级降至1级；并非所有生活技艺取消等级限制。"
      },
      {
        "label": "剑网3 苍生铸世公测公告（10-29）",
        "url": "https://ol.3dmgame.com/news/202610/43603.html",
        "note": "50 级数值重构，生活技艺全面重塑，新服「九天」"
      },
      {
        "label": "JX3BOX 物品百科 · 苍生·巨灵磨石（仇恨）",
        "url": "https://www.jx3box.com/item/view/5_89594",
        "note": "核验名目、配方类型与获取途径（铸世行游商店）"
      },
      {
        "label": "JX3BOX 技艺助手 API · 配方详情",
        "url": "https://node.jx3box.com/manufacture/tailoring/1480?client=std",
        "note": "2026-11-18 抓取：等级、精力、材料数量、CreateItemMin/Max 产出范围"
      },
      {
        "label": "JX3BOX 技艺助手 · 当前配方名录",
        "url": "https://www.jx3box.com/pvg/manufacture",
        "note": "缝纫 / 烹饪 / 制药 / 锻造 / 梓匠 五个制造技艺的当前配方"
      },
      {
        "label": "JX3BOX 物品百科 · 云芝",
        "url": "https://www.jx3box.com/item/view/5_30845",
        "note": "神农采集有几率获得，神农专精提高掉落概率"
      },
      {
        "label": "JX3BOX 物品百科 · 鸡血石",
        "url": "https://www.jx3box.com/item/view/5_30856",
        "note": "各类采集额外掉落、采集精英怪产出"
      },
      {
        "label": "JX3BOX 物品百科 · 辉石",
        "url": "https://www.jx3box.com/item/view/5_30850",
        "note": "采金采集有几率获得，采金专精提高掉落概率"
      },
      {
        "label": "JX3BOX 物品百科 · 羊肉/羊杂/羊皮",
        "url": "https://www.jx3box.com/item/view/5_30874",
        "note": "黑山羊掉落：羊肉、羊杂、羊皮"
      },
      {
        "label": "面向萌新的五行石精炼方法与成本（2026-07-29 更新）",
        "url": "https://www.jx3box.com/community/6363",
        "note": "三级 12×一级；四级 3×三级+7×一级；五级 3×四级+2×三级；六级 3×五级+2×四级；含成功率、加工费与精力。"
      },
      {
        "label": "【苍生铸世】版本测试服全身精六汇算（2026-10-08 更新）",
        "url": "https://www.jx3box.com/community/6496",
        "note": "当前赛季测试服精六成本；6 级五行石约 518 金/块（2026-09-10 样本）。"
      },
      {
        "label": "《剑网3》新赛季门派动作与精炼规则持续优化中（2026-09-15）",
        "url": "https://news.17173.com/content/09152026/160051947.shtml",
        "note": "官方说明：这次精炼公式本身没有调整；衣服/下装精六为 16 颗 6 级五行石 100% 成功。"
      },
      {
        "label": "【苍生铸世】开荒必看！新赛季剥七&剥八一图示（2026-11-08 更新）",
        "url": "https://www.jx3box.com/community/6597",
        "note": "当前赛季 7/8 级剥离成本；6 级五行石按 520 金/块样本计算。"
      },
      {
        "label": "五行石精炼方式的成本及毛利计算（2025-03-16 更新）",
        "url": "https://www.jx3box.com/community/2815",
        "note": "快速合成 1-6 级成本/精力表；4 精 6 出 8 的 252 次实验与累积概率表。"
      },
      {
        "label": "JX3BOX 拍卖 · 五行石 1-8 级（2026-11-19）",
        "url": "https://next2.jx3box.com/api/auction/",
        "note": "17 个服务器 1-8 级五行石拍卖样本，用于本模块默认价。"
      },
      {
        "label": "JX3BOX 物品百科 · 马草/百脉根等",
        "url": "https://www.jx3box.com/item/name/百脉根",
        "note": "百脉根/紫花苜蓿/甜象草/皇竹草为神农采集马草；当前缺少可对应的拍卖样本，价格按示例价处理。"
      }
    ],
    "scope": "收录 154 条当前版本制造配方 + 21 条按材料拆分的当前版本采集点（神农/采金/庖丁）",
    "priceUpdatedAt": "2026-11-20T19:07:15+08:00",
    "priceCoverage": {
      "updated": 199,
      "total": 267,
      "source": "JX3BOX 拍卖 · 17 个服务器",
      "filtered": 15,
      "noQuote": 68
    },
    "serverCoverage": {
      "s_mengjiangnan": {
        "updated": 199,
        "total": 267,
        "filtered": 15,
        "noQuote": 68
      },
      "s_pozhenzi": {
        "updated": 147,
        "total": 267,
        "filtered": 32,
        "noQuote": 120
      },
      "s_dielianhua": {
        "updated": 152,
        "total": 267,
        "filtered": 21,
        "noQuote": 115
      },
      "s_jiandan": {
        "updated": 151,
        "total": 267,
        "filtered": 31,
        "noQuote": 116
      },
      "s_youyuelun": {
        "updated": 165,
        "total": 267,
        "filtered": 27,
        "noQuote": 102
      },
      "s_longzheng": {
        "updated": 176,
        "total": 267,
        "filtered": 21,
        "noQuote": 91
      },
      "s_changancheng": {
        "updated": 147,
        "total": 267,
        "filtered": 24,
        "noQuote": 120
      },
      "s_douzhuang": {
        "updated": 150,
        "total": 267,
        "filtered": 34,
        "noQuote": 117
      },
      "s_qiankun": {
        "updated": 166,
        "total": 267,
        "filtered": 31,
        "noQuote": 101
      },
      "s_weiwo": {
        "updated": 189,
        "total": 267,
        "filtered": 22,
        "noQuote": 78
      },
      "s_juedai": {
        "updated": 171,
        "total": 267,
        "filtered": 26,
        "noQuote": 96
      },
      "s_tianeping": {
        "updated": 170,
        "total": 267,
        "filtered": 27,
        "noQuote": 97
      },
      "s_feilong": {
        "updated": 138,
        "total": 267,
        "filtered": 38,
        "noQuote": 129
      },
      "s_jiutian": {
        "updated": 119,
        "total": 267,
        "filtered": 34,
        "noQuote": 148
      },
      "s_meijianxue": {
        "updated": 135,
        "total": 267,
        "filtered": 21,
        "noQuote": 132
      },
      "s_shanhai": {
        "updated": 117,
        "total": 267,
        "filtered": 19,
        "noQuote": 150
      },
      "s_aoxue": {
        "updated": 74,
        "total": 267,
        "filtered": 18,
        "noQuote": 193
      }
    },
    "stonePriceUpdatedAt": "2026-11-20T19:07:15+08:00",
    "stoneVerifiedAt": "2026-11-19"
  },
  "tiers": [
    {
      "id": 1,
      "name": "凡品",
      "color": "#94A3B8",
      "text": "白"
    },
    {
      "id": 2,
      "name": "良品",
      "color": "#4ADE80",
      "text": "绿"
    },
    {
      "id": 3,
      "name": "上品",
      "color": "#60A5FA",
      "text": "蓝"
    },
    {
      "id": 4,
      "name": "精品",
      "color": "#C084FC",
      "text": "紫"
    },
    {
      "id": 5,
      "name": "极品",
      "color": "#FBBF24",
      "text": "橙"
    }
  ],
  "skills": [
    {
      "id": "shennong",
      "name": "神农",
      "type": "gather",
      "verb": "采集",
      "icon": "leaf",
      "color": "#2E9E78",
      "desc": "采集紫苏、黄花菜、鱼腥草、虫草、甘草、芍药、珊瑚与马草（百脉根、紫花苜蓿、甜象草、皇竹草）等草药，并有几率获得云芝、鸡血石；掉率与专精影响期望产值。"
    },
    {
      "id": "caijin",
      "name": "采金",
      "type": "gather",
      "verb": "采集",
      "icon": "pickaxe",
      "color": "#D99A2B",
      "desc": "开采铁矿、铜矿、锡矿、铅锌矿、金沙、青石与辉石，并有几率获得鸡血石；掉率影响期望产值。"
    },
    {
      "id": "paoding",
      "name": "庖丁",
      "type": "gather",
      "verb": "庖丁",
      "icon": "knife",
      "color": "#D45A8A",
      "desc": "庖丁黑山羊、山野野兽与河鲜，获得羊肉、羊杂、羊皮、精肉、骨头、血、杂碎与鱼肉。"
    },
    {
      "id": "duanzao",
      "name": "锻造",
      "type": "craft",
      "verb": "锻造",
      "icon": "hammer",
      "color": "#1D6FE0",
      "desc": "打造武器、防具、磨石与熔锭。当前版本制造技艺为锻造（旧称铸造）。"
    },
    {
      "id": "fengren",
      "name": "缝纫",
      "type": "craft",
      "verb": "缝纫",
      "icon": "thread",
      "color": "#A75BE0",
      "desc": "制作玄元/风语装备、附魔绣、背包、挂件包与隔音帐。"
    },
    {
      "id": "zhiyao",
      "name": "制药",
      "type": "craft",
      "verb": "制药",
      "icon": "flask",
      "color": "#2AA5B8",
      "desc": "制作万灵丹、固阵丹、截元丹等药品与药引材料。"
    },
    {
      "id": "pengren",
      "name": "烹饪",
      "type": "craft",
      "verb": "烹饪",
      "icon": "pot",
      "color": "#E06A2E",
      "desc": "制作宴席、路菜、汤品与烹饪材料。"
    },
    {
      "id": "zijiang",
      "name": "梓匠",
      "type": "craft",
      "verb": "梓匠",
      "icon": "home",
      "color": "#7A9E2E",
      "desc": "苍生铸世家园制造：木板、卯榫、鱼胶、器物令与家具景观。"
    }
  ],
  "items": [
    {
      "id": "xuan_yuan_shan",
      "name": "玄元星平衫",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 30811.87,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "dimai",
      "name": "地脉玄元",
      "skillId": "fengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 24000,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "fengwangjiang",
      "name": "蜂王浆",
      "skillId": "fengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 179.3,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010327
    },
    {
      "id": "shoupijiao",
      "name": "兽皮胶",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 50.1,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010278
    },
    {
      "id": "qicaixian",
      "name": "七彩线",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 134.08,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010280
    },
    {
      "id": "bairanxian",
      "name": "百染线",
      "skillId": "fengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.69,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795006664
    },
    {
      "id": "xuan_yuan_xie",
      "name": "玄元星平鞋",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 30811.87,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "xuan_yuan_wan",
      "name": "玄元星平护腕",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 38743.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "fengyu_yi",
      "name": "风语·衣·绣（气血）",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 2134.92,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794927575
    },
    {
      "id": "m_m_5_30852",
      "name": "猫眼石",
      "skillId": "fengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 15.24,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010379
    },
    {
      "id": "m_m_5_30853",
      "name": "珠贝母",
      "skillId": "fengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 99.95,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010341
    },
    {
      "id": "m_m_5_30828",
      "name": "宝石",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 6,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010050
    },
    {
      "id": "m_m_5_89165",
      "name": "绢带",
      "skillId": "fengren",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 10.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794990866
    },
    {
      "id": "m_m_5_32000",
      "name": "棉线",
      "skillId": "fengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.63,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795002219
    },
    {
      "id": "guajian_bei",
      "name": "挂件包·背部",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 54.3,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009827
    },
    {
      "id": "baihua_bu",
      "name": "百花布",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 72.4,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010253
    },
    {
      "id": "guajian_yao",
      "name": "挂件包·腰部",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 78.48,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009836
    },
    {
      "id": "shuran_bu",
      "name": "蜀染布",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 65.7,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009947
    },
    {
      "id": "m_m_5_32001",
      "name": "纺丝",
      "skillId": "fengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 8,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794992985
    },
    {
      "id": "shuran_bag",
      "name": "蜀染布包",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 18.32,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794993159
    },
    {
      "id": "m_m_5_10173",
      "name": "百股线",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 30.62,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795002227
    },
    {
      "id": "jinfeng_bag",
      "name": "锦缝春山囊",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 6500,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794876994
    },
    {
      "id": "wuseshi",
      "name": "五色石",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 80,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795000705
    },
    {
      "id": "m_m_5_30856",
      "name": "鸡血石",
      "skillId": "caijin",
      "kind": "material",
      "tier": 4,
      "source": "采集",
      "base": 20.33,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010398
    },
    {
      "id": "m_m_5_30855",
      "name": "沉香木",
      "skillId": "fengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 161.68,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010337
    },
    {
      "id": "geyin_zhang",
      "name": "隔音帐",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 152.85,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009564
    },
    {
      "id": "m_m_5_89298",
      "name": "青魄玉",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 31.59,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010392
    },
    {
      "id": "m_m_5_30679",
      "name": "硼砂",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 15.13,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010303
    },
    {
      "id": "m_m_5_32004",
      "name": "石灰",
      "skillId": "fengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.58,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794991076
    },
    {
      "id": "m_m_5_30847",
      "name": "银鳞",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 10.87,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010372
    },
    {
      "id": "m_m_5_30846",
      "name": "玛瑙",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 1.41,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010364
    },
    {
      "id": "yinsi_duan",
      "name": "银丝缎",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 129,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010131
    },
    {
      "id": "m_m_5_32003",
      "name": "百花线",
      "skillId": "fengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.65,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794928908
    },
    {
      "id": "m_m_5_30848",
      "name": "紫檀",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 19.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010254
    },
    {
      "id": "m_m_5_32002",
      "name": "金线",
      "skillId": "fengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794992989
    },
    {
      "id": "m_m_7_112589",
      "name": "玄元木声衫",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 34789.34,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_30850",
      "name": "辉石",
      "skillId": "caijin",
      "kind": "material",
      "tier": 3,
      "source": "采集",
      "base": 112.65,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010355
    },
    {
      "id": "m_m_7_112588",
      "name": "玄元松绿衫",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 42041.09,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_30845",
      "name": "云芝",
      "skillId": "shennong",
      "kind": "material",
      "tier": 3,
      "source": "采集",
      "base": 155.1,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010399
    },
    {
      "id": "m_m_5_31231",
      "name": "绝世上衣·【寒】",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 6739.79,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31397",
      "name": "蜃楼珠",
      "skillId": "fengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 1,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008398
    },
    {
      "id": "m_m_5_89433",
      "name": "蜀锦绣·腕（身法）",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 5987.25,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794928812
    },
    {
      "id": "m_m_5_89435",
      "name": "蜀锦绣·腕（力道）",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 5888,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010291
    },
    {
      "id": "m_m_5_31253",
      "name": "寻踪觅宝·护手",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 530.22,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795001071
    },
    {
      "id": "tongpao_fan",
      "name": "同袍营幡",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 867.08,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_30844",
      "name": "黄花菜",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.38,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010373
    },
    {
      "id": "m_m_5_89166",
      "name": "黄蜡",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 0.01,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89568",
      "name": "璧·苍生",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 37783.26,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112569",
      "name": "玄元烽火鞋",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 36377.81,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_90338",
      "name": "境华",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 0.1,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1795006138
    },
    {
      "id": "m_m_7_112568",
      "name": "玄元赤地鞋",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 37121.15,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31239",
      "name": "绝世鞋子·【寒】",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 4311.98,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112556",
      "name": "玄元赤地护腕",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 35999.4,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112557",
      "name": "玄元烽火护腕",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 38428.18,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31235",
      "name": "绝世护腕·【寒】",
      "skillId": "fengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 4681.69,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_90210",
      "name": "驾驾伪装",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 72,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_35718",
      "name": "麻絮",
      "skillId": "fengren",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 16.94,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794991184
    },
    {
      "id": "m_m_5_35719",
      "name": "滑石粉",
      "skillId": "fengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 32.18,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794991189
    },
    {
      "id": "m_m_5_30873",
      "name": "羊皮",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 33.45,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010327
    },
    {
      "id": "m_m_5_90205",
      "name": "哼唧伪装",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 40,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794998574
    },
    {
      "id": "m_m_8_614",
      "name": "灯笼",
      "skillId": "fengren",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 395.98,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794978879
    },
    {
      "id": "shanshui_juan",
      "name": "山水刺绣手绢",
      "skillId": "fengren",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 200,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794992074
    },
    {
      "id": "m_m_5_3819",
      "name": "刺绣手绢",
      "skillId": "fengren",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 200,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794996894
    },
    {
      "id": "m_m_5_3779",
      "name": "小香包",
      "skillId": "fengren",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 9.99,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794930555
    },
    {
      "id": "m_m_8_36148",
      "name": "彩缕花绫包",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 749,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010198
    },
    {
      "id": "m_m_8_19",
      "name": "棉布包",
      "skillId": "fengren",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 0.01,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794994263
    },
    {
      "id": "m_m_5_89475",
      "name": "河洛纹·鞋（跑速）",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 1335.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89474",
      "name": "河洛纹·衣（御劲）",
      "skillId": "fengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 1666,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007088
    },
    {
      "id": "m_m_5_3820",
      "name": "丹青染布画",
      "skillId": "fengren",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 5.3,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794916585
    },
    {
      "id": "shuizhuyu",
      "name": "百炼水煮鱼",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 3562.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_30827",
      "name": "鱼肉",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 1.29,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010386
    },
    {
      "id": "m_m_5_89970",
      "name": "酱料",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 177,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010261
    },
    {
      "id": "m_m_5_32014",
      "name": "今朝醉",
      "skillId": "pengren",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 232,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794893373
    },
    {
      "id": "m_m_5_31978",
      "name": "胡椒粉",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 8,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794962296
    },
    {
      "id": "m_m_5_31985",
      "name": "红辣椒",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795006788
    },
    {
      "id": "lucai",
      "name": "路菜",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 17.99,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010396
    },
    {
      "id": "m_m_5_1831",
      "name": "西市腔",
      "skillId": "pengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 14.57,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009469
    },
    {
      "id": "m_m_5_31973",
      "name": "精制面粉",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.65,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009297
    },
    {
      "id": "m_m_5_30849",
      "name": "人参",
      "skillId": "pengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 6,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010399
    },
    {
      "id": "m_m_5_71293",
      "name": "风语·老火骨汤",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 40,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007613
    },
    {
      "id": "m_m_5_30826",
      "name": "骨头",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.59,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009904
    },
    {
      "id": "m_m_5_30825",
      "name": "血",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.03,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010366
    },
    {
      "id": "m_m_5_89171",
      "name": "藤椒",
      "skillId": "pengren",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 10.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794941188
    },
    {
      "id": "m_m_5_31974",
      "name": "料酒",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.59,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008321
    },
    {
      "id": "m_m_5_31968",
      "name": "菌菇",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.55,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794752373
    },
    {
      "id": "m_m_5_71292",
      "name": "风语·三鲜汤",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 43.92,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795003150
    },
    {
      "id": "m_m_5_30824",
      "name": "精肉",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.5,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010246
    },
    {
      "id": "m_m_5_31967",
      "name": "新鲜冬瓜",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 30.29,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794843040
    },
    {
      "id": "m_m_5_71281",
      "name": "风语·鲜肉包子",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 22.4,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007591
    },
    {
      "id": "m_m_5_30823",
      "name": "碎肉",
      "skillId": "pengren",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 0.8,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009941
    },
    {
      "id": "m_m_5_31969",
      "name": "老姜",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.65,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794919677
    },
    {
      "id": "m_m_5_71277",
      "name": "风语·水煮肉片",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 56.5,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794973471
    },
    {
      "id": "m_m_5_89315",
      "name": "云中珍馐宴（通用）",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 1375.21,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010165
    },
    {
      "id": "m_m_5_1829",
      "name": "竹叶青",
      "skillId": "pengren",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 0.22,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794939525
    },
    {
      "id": "m_m_5_89969",
      "name": "馅料",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 119,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010197
    },
    {
      "id": "m_m_5_31976",
      "name": "调料",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008253
    },
    {
      "id": "m_m_5_89303",
      "name": "巴渝珍馐宴（通用）",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 3379.83,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795006911
    },
    {
      "id": "m_m_5_89971",
      "name": "卤料",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 179.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009602
    },
    {
      "id": "lushui",
      "name": "露水",
      "skillId": "shennong",
      "kind": "material",
      "tier": 3,
      "source": "采集",
      "base": 12.13,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009938
    },
    {
      "id": "m_m_5_30875",
      "name": "羊杂",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 1.37,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010322
    },
    {
      "id": "m_m_5_30829",
      "name": "蛋",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.61,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794941224
    },
    {
      "id": "m_m_5_30843",
      "name": "鱼腥草",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.72,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010388
    },
    {
      "id": "m_m_5_30874",
      "name": "羊肉",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 34,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010392
    },
    {
      "id": "m_m_5_30842",
      "name": "紫苏",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 1.05,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010395
    },
    {
      "id": "m_m_5_5270",
      "name": "饺子馅",
      "skillId": "pengren",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 0.99,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010139
    },
    {
      "id": "m_m_5_31970",
      "name": "大葱",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.65,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795000652
    },
    {
      "id": "m_m_5_5269",
      "name": "饺子皮",
      "skillId": "pengren",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 0.09,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009216
    },
    {
      "id": "m_m_5_31977",
      "name": "生粉",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794931002
    },
    {
      "id": "m_m_5_31013",
      "name": "转神餐",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 158.33,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010220
    },
    {
      "id": "gancao",
      "name": "甘草",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 1.98,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010071
    },
    {
      "id": "m_m_5_31012",
      "name": "佛跳墙",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 310,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010087
    },
    {
      "id": "m_m_5_90034",
      "name": "安营炊鼎",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 2213.84,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89172",
      "name": "酥油",
      "skillId": "pengren",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 22.39,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794917851
    },
    {
      "id": "m_m_5_89304",
      "name": "巴山夜雨宴（外攻）",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 3799.72,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010288
    },
    {
      "id": "m_m_5_24212",
      "name": "炼狱水煮鱼",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 879.3,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_26057",
      "name": "膘然心动",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1799,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795002356
    },
    {
      "id": "m_m_5_26231",
      "name": "如意饺",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 2.91,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794993063
    },
    {
      "id": "m_m_5_89352",
      "name": "云州刀削面",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 627.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010165
    },
    {
      "id": "m_m_5_89350",
      "name": "山城毛血旺",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 500,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009691
    },
    {
      "id": "m_m_5_71269",
      "name": "风语·红烧排骨",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 112,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009712
    },
    {
      "id": "m_m_5_89346",
      "name": "云芝竹沥羹",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 673.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010261
    },
    {
      "id": "m_m_5_89167",
      "name": "竹沥",
      "skillId": "pengren",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 10.63,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795006909
    },
    {
      "id": "m_m_5_31984",
      "name": "老豆腐",
      "skillId": "pengren",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.01,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794962976
    },
    {
      "id": "m_m_5_89348",
      "name": "开锅豆腐",
      "skillId": "pengren",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 169.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010162
    },
    {
      "id": "m_m_5_71285",
      "name": "风语·杂锦鱼球粥",
      "skillId": "pengren",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 80.04,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010381
    },
    {
      "id": "jieyuan_dan",
      "name": "截元丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 40.18,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008464
    },
    {
      "id": "m_m_5_30836",
      "name": "虫草",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.63,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010398
    },
    {
      "id": "m_m_5_30832",
      "name": "千里香",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 0.99,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010309
    },
    {
      "id": "m_m_5_30833",
      "name": "枸杞",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 1.28,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010330
    },
    {
      "id": "m_m_5_31997",
      "name": "葫芦",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.55,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009842
    },
    {
      "id": "m_m_5_89324",
      "name": "竹沥凝心饮",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 94.87,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010233
    },
    {
      "id": "m_m_5_30831",
      "name": "大黄",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 0.82,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010262
    },
    {
      "id": "m_m_5_89973",
      "name": "药丸",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 149,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009958
    },
    {
      "id": "m_m_5_31996",
      "name": "药囊",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.67,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010161
    },
    {
      "id": "m_m_5_71241",
      "name": "风语·中品万灵丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 15.09,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794740009
    },
    {
      "id": "m_m_5_71240",
      "name": "风语·上品万灵丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 55.27,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010194
    },
    {
      "id": "m_m_5_31995",
      "name": "药罐",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010188
    },
    {
      "id": "m_m_5_71266",
      "name": "风语·中品大力丸",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 66.01,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795003166
    },
    {
      "id": "m_m_5_30838",
      "name": "彼岸花",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 2.21,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008734
    },
    {
      "id": "shanhu",
      "name": "珊瑚",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 3,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010296
    },
    {
      "id": "m_m_5_6646",
      "name": "药料",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.56,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794990998
    },
    {
      "id": "m_m_5_89333",
      "name": "云州固阵丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 597.96,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction"
    },
    {
      "id": "m_m_5_30835",
      "name": "五味子",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 1.86,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010369
    },
    {
      "id": "m_m_5_89974",
      "name": "药膏",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 87,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794997034
    },
    {
      "id": "m_m_5_6648",
      "name": "药用黄丹",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 2.99,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010386
    },
    {
      "id": "m_m_5_71267",
      "name": "风语·中品静心丸",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 68.43,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008563
    },
    {
      "id": "m_m_5_90029",
      "name": "回神丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 416.31,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89168",
      "name": "药曲",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 22.39,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794927368
    },
    {
      "id": "yaoyin",
      "name": "药引",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 144.85,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010315
    },
    {
      "id": "m_m_5_31100",
      "name": "金针·影",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 9.73,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1795005591
    },
    {
      "id": "m_m_5_89322",
      "name": "竹沥清心露",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 660,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007496
    },
    {
      "id": "shaoyao",
      "name": "芍药",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 1.63,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010229
    },
    {
      "id": "m_m_5_90206",
      "name": "踏波露",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 33.59,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007570
    },
    {
      "id": "m_m_5_31102",
      "name": "飞鱼丸",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 0.04,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007742
    },
    {
      "id": "m_m_5_30834",
      "name": "川贝",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 1.78,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010273
    },
    {
      "id": "m_m_5_31998",
      "name": "金针",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.97,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794903393
    },
    {
      "id": "m_m_5_90035",
      "name": "定魂丹砂",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 8888,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010272
    },
    {
      "id": "m_m_5_89328",
      "name": "巴山凝神丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 790.87,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008257
    },
    {
      "id": "m_m_5_89332",
      "name": "河洛生息丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 823.61,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795002008
    },
    {
      "id": "m_m_5_89340",
      "name": "巴山凝神散",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 119.03,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010228
    },
    {
      "id": "m_m_5_89325",
      "name": "五气归元丹",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 726.85,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010334
    },
    {
      "id": "m_m_5_71258",
      "name": "风语·上品健体丸",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 74.71,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010331
    },
    {
      "id": "m_m_5_31999",
      "name": "银针",
      "skillId": "zhiyao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.58,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794987490
    },
    {
      "id": "m_m_5_89327",
      "name": "五气培元丸",
      "skillId": "zhiyao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 83.83,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010166
    },
    {
      "id": "juling_chou",
      "name": "苍生·巨灵磨石（仇恨）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 135.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89966",
      "name": "镔铁锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 105.08,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795005670
    },
    {
      "id": "m_m_5_10176",
      "name": "炼火石",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 2.4,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794929644
    },
    {
      "id": "m_m_5_31991",
      "name": "火墨",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.8,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794934155
    },
    {
      "id": "m_m_5_89377",
      "name": "苍生·絮泊磨石（疗伤）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 490,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007041
    },
    {
      "id": "m_m_5_89968",
      "name": "铅锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 70.2,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008858
    },
    {
      "id": "m_m_5_31993",
      "name": "煤炭",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794941608
    },
    {
      "id": "m_m_5_89376",
      "name": "苍生·坠宵磨石（攻击）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 149.37,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008362
    },
    {
      "id": "m_m_5_89965",
      "name": "锡锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 108.26,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010396
    },
    {
      "id": "m_m_5_31992",
      "name": "木炭",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.83,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794993574
    },
    {
      "id": "m_m_5_89375",
      "name": "苍生·瀑沙磨石（武伤）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 222.97,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795004468
    },
    {
      "id": "m_m_5_89963",
      "name": "黄铜锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 70.26,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008513
    },
    {
      "id": "m_m_5_89370",
      "name": "苍生·巨灵熔锭（仇恨）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 612.75,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_71192",
      "name": "风语·巨灵磨石（仇恨）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 13.14,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89169",
      "name": "松脂",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 10.63,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794979874
    },
    {
      "id": "m_m_5_71188",
      "name": "风语·兵·甲（仇恨）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 741.82,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794830387
    },
    {
      "id": "m_m_5_31994",
      "name": "菜籽油",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.66,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794935740
    },
    {
      "id": "m_m_7_112584",
      "name": "玄元星平帽",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 29202.03,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89962",
      "name": "密银锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 106,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008938
    },
    {
      "id": "m_m_7_112566",
      "name": "玄元星平护腰",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 36576.28,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112578",
      "name": "玄元星平裤",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 33036.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31139",
      "name": "龙血磨石",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 3189.98,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009997
    },
    {
      "id": "m_m_5_89964",
      "name": "青铜锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 55,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009262
    },
    {
      "id": "m_m_5_10027",
      "name": "素银钥匙",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 54.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795002501
    },
    {
      "id": "m_m_5_89961",
      "name": "熟铁锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 99.97,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010275
    },
    {
      "id": "m_m_5_10029",
      "name": "素银钥匙模",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.03,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794882612
    },
    {
      "id": "tiekuang",
      "name": "铁矿",
      "skillId": "caijin",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 3,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009930
    },
    {
      "id": "m_m_5_30676",
      "name": "铅锌矿",
      "skillId": "caijin",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 2.65,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010258
    },
    {
      "id": "m_m_5_30678",
      "name": "银矿",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 1.59,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795006870
    },
    {
      "id": "m_m_5_30674",
      "name": "铜矿",
      "skillId": "caijin",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 2.48,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009999
    },
    {
      "id": "m_m_5_30675",
      "name": "锡矿",
      "skillId": "caijin",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 3.47,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009734
    },
    {
      "id": "m_m_5_89967",
      "name": "生铁锭",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 65.84,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795001626
    },
    {
      "id": "m_m_5_89367",
      "name": "苍生·瀑沙熔锭（武伤）",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 950.59,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795007070
    },
    {
      "id": "m_m_5_6246",
      "name": "青铜钥匙",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 0.5,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009751
    },
    {
      "id": "m_m_5_6249",
      "name": "青铜钥匙模",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.26,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794928656
    },
    {
      "id": "m_m_7_112575",
      "name": "玄元烽火裤",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 31377,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112573",
      "name": "玄元风鹤裤",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 26792.24,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31209",
      "name": "绝世下装·【兹】",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 4698.26,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_32787",
      "name": "切玉骨",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 99.86,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794930400
    },
    {
      "id": "m_m_7_112564",
      "name": "玄元松绿护腰",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 34631.78,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112561",
      "name": "玄元风鹤护腰",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 33199.08,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31211",
      "name": "绝世腰带·【兹】",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 3417.94,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_8_25762",
      "name": "寄青荷",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 5.2,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795005989
    },
    {
      "id": "m_m_5_30841",
      "name": "荷叶",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 5.55,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010368
    },
    {
      "id": "m_m_5_10172",
      "name": "旦火油",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 8,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794858087
    },
    {
      "id": "m_m_5_35708",
      "name": "皮革",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 6.48,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794999418
    },
    {
      "id": "m_m_8_17541",
      "name": "银龙笼套",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 1537.02,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_8_17538",
      "name": "铁纹鞍具",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 313.36,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794420741
    },
    {
      "id": "m_m_7_112582",
      "name": "玄元松绿帽",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 39887.1,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_7_112583",
      "name": "玄元木声帽",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 34510.09,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_31210",
      "name": "绝世头饰·【兹】",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 2820.47,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_90032",
      "name": "定营铁桩",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1901.21,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89170",
      "name": "熟矾",
      "skillId": "duanzao",
      "kind": "material",
      "tier": 3,
      "source": "交易行",
      "base": 0.01,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_89567",
      "name": "珠·苍生",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 26321.23,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_8_632",
      "name": "玄武腰刀",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 270.78,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794937799
    },
    {
      "id": "m_m_8_634",
      "name": "青龙腰刀",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 305.19,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794837554
    },
    {
      "id": "m_m_8_636",
      "name": "麒麟腰刀",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 324,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794910021
    },
    {
      "id": "m_m_5_90353",
      "name": "同门饕餮鼎",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 525.04,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_90257",
      "name": "飞高高",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 72,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_2578",
      "name": "铜偶",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 8,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794751102
    },
    {
      "id": "m_m_5_6072",
      "name": "鞭炮",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 32,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794970538
    },
    {
      "id": "m_m_5_6068",
      "name": "龙凤呈祥",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 8.97,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794970526
    },
    {
      "id": "m_m_5_6066",
      "name": "元宝灯",
      "skillId": "duanzao",
      "kind": "product",
      "tier": 2,
      "source": "制造",
      "base": 0.01,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794965005
    },
    {
      "id": "muban",
      "name": "木板",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 22.88,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010248
    },
    {
      "id": "muliao",
      "name": "木料",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 3.2,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010283
    },
    {
      "id": "m_m_5_35707",
      "name": "清漆",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 11.97,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008984
    },
    {
      "id": "m_m_5_35703",
      "name": "绳索",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.57,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008979
    },
    {
      "id": "qiwuling",
      "name": "器物令",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 32.99,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010390
    },
    {
      "id": "m_m_5_35716",
      "name": "鱼胶",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 16.93,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009057
    },
    {
      "id": "m_m_5_35702",
      "name": "黏土",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.68,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794843051
    },
    {
      "id": "m_m_5_35715",
      "name": "篾条",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 14.55,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008878
    },
    {
      "id": "zhuzi",
      "name": "竹子",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 2.04,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010270
    },
    {
      "id": "m_m_5_35567",
      "name": "芦苇杆",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 2,
      "source": "交易行",
      "base": 2,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010369
    },
    {
      "id": "m_m_5_35704",
      "name": "油布",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 0.64,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794999655
    },
    {
      "id": "m_m_5_35714",
      "name": "雕花",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 18.75,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794997916
    },
    {
      "id": "m_m_5_35701",
      "name": "石材",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.56,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008270
    },
    {
      "id": "m_m_5_35713",
      "name": "卯榫",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 28.21,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010206
    },
    {
      "id": "m_m_5_35705",
      "name": "楔子",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 1,
      "source": "交易行",
      "base": 3.55,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794998817
    },
    {
      "id": "m_m_10_1778",
      "name": "清漆药柜",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 1267.83,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794663425
    },
    {
      "id": "m_m_10_948",
      "name": "简素椅",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 310.17,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795002116
    },
    {
      "id": "m_m_5_89260",
      "name": "归营旌",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 34850,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794847820
    },
    {
      "id": "m_m_10_1779",
      "name": "锻炉",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 600.82,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794663430
    },
    {
      "id": "m_m_10_1880",
      "name": "残烛柜架",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1568.07,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794607481
    },
    {
      "id": "m_m_10_2034",
      "name": "矩形回纹格",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1430.11,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794607436
    },
    {
      "id": "m_m_10_93",
      "name": "葵草席",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 63,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794948186
    },
    {
      "id": "m_m_10_1882",
      "name": "禅心悬旗",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1459,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794607513
    },
    {
      "id": "m_m_5_35717",
      "name": "阎家样",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 2.79,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010380
    },
    {
      "id": "m_m_10_2037",
      "name": "铜雕踩球对狮·右",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1460.83,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794607450
    },
    {
      "id": "m_m_10_164",
      "name": "素髹桑木灯檠",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 1,
      "source": "制造",
      "base": 130,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1794756888
    },
    {
      "id": "m_m_5_52337",
      "name": "地下室·8米木质标准包",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1587.77,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009015
    },
    {
      "id": "m_m_5_40232",
      "name": "竹篾篱·套件",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 2797,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009638
    },
    {
      "id": "m_m_5_35772",
      "name": "兖石地墁·套件",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 1911,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009762
    },
    {
      "id": "m_m_5_90211",
      "name": "飞毛腿伪装",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 3,
      "source": "制造",
      "base": 21.71,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "seed",
      "priceAt": 1794853525
    },
    {
      "id": "m_m_5_87917",
      "name": "拼布自选包",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 270,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795009082
    },
    {
      "id": "m_m_5_45721",
      "name": "铃兰·混彩",
      "skillId": "zijiang",
      "kind": "material",
      "tier": 4,
      "source": "交易行",
      "base": 128,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本材料",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "m_m_5_87881",
      "name": "拼布72色全包",
      "skillId": "zijiang",
      "kind": "product",
      "tier": 4,
      "source": "制造",
      "base": 8599,
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 当前版本配方",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795008033
    },
    {
      "id": "zasui",
      "name": "杂碎",
      "skillId": "paoding",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.51,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010384
    },
    {
      "id": "g_5_30681",
      "name": "金沙",
      "skillId": "caijin",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 1.28,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010393
    },
    {
      "id": "g_5_30680",
      "name": "青石",
      "skillId": "caijin",
      "kind": "material",
      "tier": 2,
      "source": "采集",
      "base": 0.99,
      "verified": true,
      "origin": "JX3BOX 物品百科 · 当前版本采集产出",
      "custom": false,
      "priceSource": "auction",
      "priceAt": 1795010362
    },
    {
      "id": "g_ma_baimaigen",
      "name": "百脉根",
      "skillId": "shennong",
      "kind": "material",
      "tier": 1,
      "source": "神农采集 · 马草",
      "base": 1.5,
      "verified": true,
      "origin": "神农采集 · 马草",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "g_ma_zihuamuxu",
      "name": "紫花苜蓿",
      "skillId": "shennong",
      "kind": "material",
      "tier": 2,
      "source": "神农采集 · 马草",
      "base": 3,
      "verified": true,
      "origin": "神农采集 · 马草",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "g_ma_tianxiangcao",
      "name": "甜象草",
      "skillId": "shennong",
      "kind": "material",
      "tier": 3,
      "source": "神农采集 · 马草",
      "base": 6,
      "verified": true,
      "origin": "神农采集 · 马草",
      "custom": false,
      "priceSource": "seed"
    },
    {
      "id": "g_ma_huangzhucao",
      "name": "皇竹草",
      "skillId": "shennong",
      "kind": "material",
      "tier": 4,
      "source": "神农采集 · 马草",
      "base": 12,
      "verified": true,
      "origin": "神农采集 · 马草",
      "custom": false,
      "priceSource": "seed"
    }
  ],
  "recipes": [
    {
      "id": "m_tailoring_1480",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元星平衫",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "xuan_yuan_shan",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "qicaixian",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "上衣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1486",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元星平鞋",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "xuan_yuan_xie",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "qicaixian",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "鞋 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1492",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元星平护腕",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "xuan_yuan_wan",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "qicaixian",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "护手 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1384",
      "kind": "craft",
      "skillId": "fengren",
      "name": "风语·衣·绣（气血）",
      "level": 30,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "fengyu_yi",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30852",
          "qty": 5
        },
        {
          "item": "m_m_5_30853",
          "qty": 5
        },
        {
          "item": "m_m_5_30828",
          "qty": 10
        },
        {
          "item": "m_m_5_89165",
          "qty": 10
        },
        {
          "item": "m_m_5_32000",
          "qty": 20
        }
      ],
      "note": "刺绣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_519",
      "kind": "craft",
      "skillId": "fengren",
      "name": "挂件包·背部",
      "level": 1,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "guajian_bei",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "baihua_bu",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 2
        },
        {
          "item": "m_m_5_32000",
          "qty": 5
        }
      ],
      "note": "背包 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_520",
      "kind": "craft",
      "skillId": "fengren",
      "name": "挂件包·腰部",
      "level": 1,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "guajian_yao",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "shuran_bu",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 2
        },
        {
          "item": "m_m_5_32001",
          "qty": 5
        }
      ],
      "note": "背包 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_694",
      "kind": "craft",
      "skillId": "fengren",
      "name": "蜀染布包",
      "level": 14,
      "tier": 3,
      "energy": 80,
      "fee": 0,
      "outputs": [
        {
          "item": "shuran_bag",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "shuran_bu",
          "qty": 1
        },
        {
          "item": "m_m_5_10173",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 3
        }
      ],
      "note": "背包 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1497",
      "kind": "craft",
      "skillId": "fengren",
      "name": "锦缝春山囊",
      "level": 50,
      "tier": 4,
      "energy": 150,
      "fee": 0,
      "outputs": [
        {
          "item": "jinfeng_bag",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "shuran_bu",
          "qty": 10
        },
        {
          "item": "wuseshi",
          "qty": 10
        },
        {
          "item": "m_m_5_30856",
          "qty": 6
        },
        {
          "item": "m_m_5_30855",
          "qty": 6
        }
      ],
      "note": "背包 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1432",
      "kind": "craft",
      "skillId": "fengren",
      "name": "隔音帐",
      "level": 10,
      "tier": 4,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "geyin_zhang",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_10173",
          "qty": 4
        },
        {
          "item": "m_m_5_30852",
          "qty": 2
        },
        {
          "item": "bairanxian",
          "qty": 10
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1289",
      "kind": "craft",
      "skillId": "fengren",
      "name": "七彩线",
      "level": 9,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "qicaixian",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "m_m_5_10173",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32004",
          "qty": 10
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1286",
      "kind": "craft",
      "skillId": "fengren",
      "name": "蜀染布",
      "level": 6,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "shuran_bu",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30847",
          "qty": 2
        },
        {
          "item": "m_m_5_10173",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32001",
          "qty": 10
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1285",
      "kind": "craft",
      "skillId": "fengren",
      "name": "百花布",
      "level": 1,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "baihua_bu",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30846",
          "qty": 2
        },
        {
          "item": "m_m_5_10173",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32000",
          "qty": 10
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1288",
      "kind": "craft",
      "skillId": "fengren",
      "name": "银丝缎",
      "level": 8,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "yinsi_duan",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30828",
          "qty": 2
        },
        {
          "item": "m_m_5_10173",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32003",
          "qty": 10
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1287",
      "kind": "craft",
      "skillId": "fengren",
      "name": "五色石",
      "level": 7,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "wuseshi",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30848",
          "qty": 2
        },
        {
          "item": "m_m_5_10173",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32002",
          "qty": 10
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1478",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元木声衫",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112589",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 10
        },
        {
          "item": "m_m_5_30850",
          "qty": 20
        },
        {
          "item": "wuseshi",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "上衣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1479",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元松绿衫",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112588",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 20
        },
        {
          "item": "yinsi_duan",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "上衣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1222",
      "kind": "craft",
      "skillId": "fengren",
      "name": "绝世上衣·【寒】",
      "level": 9,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31231",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_31397",
          "qty": 1
        },
        {
          "item": "m_m_5_30855",
          "qty": 10
        },
        {
          "item": "m_m_5_30847",
          "qty": 20
        },
        {
          "item": "wuseshi",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "上衣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1446",
      "kind": "craft",
      "skillId": "fengren",
      "name": "蜀锦绣·腕（身法）",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89433",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30855",
          "qty": 6
        },
        {
          "item": "m_m_5_30853",
          "qty": 5
        },
        {
          "item": "m_m_5_30850",
          "qty": 10
        },
        {
          "item": "yinsi_duan",
          "qty": 10
        },
        {
          "item": "m_m_5_32003",
          "qty": 20
        }
      ],
      "note": "刺绣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1448",
      "kind": "craft",
      "skillId": "fengren",
      "name": "蜀锦绣·腕（力道）",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89435",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30856",
          "qty": 6
        },
        {
          "item": "m_m_5_30855",
          "qty": 5
        },
        {
          "item": "m_m_5_30845",
          "qty": 10
        },
        {
          "item": "qicaixian",
          "qty": 10
        },
        {
          "item": "m_m_5_32004",
          "qty": 20
        }
      ],
      "note": "刺绣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1236",
      "kind": "craft",
      "skillId": "fengren",
      "name": "寻踪觅宝·护腕",
      "level": 15,
      "tier": 3,
      "energy": 80,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31253",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30848",
          "qty": 1
        },
        {
          "item": "yinsi_duan",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32001",
          "qty": 20
        }
      ],
      "note": "刺绣 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1493",
      "kind": "craft",
      "skillId": "fengren",
      "name": "同袍营幡",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "tongpao_fan",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "baihua_bu",
          "qty": 6
        },
        {
          "item": "shoupijiao",
          "qty": 4
        },
        {
          "item": "m_m_5_30844",
          "qty": 10
        },
        {
          "item": "m_m_5_89165",
          "qty": 6
        },
        {
          "item": "m_m_5_89166",
          "qty": 2
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1498",
      "kind": "craft",
      "skillId": "fengren",
      "name": "璧·苍生",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89568",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 10
        },
        {
          "item": "m_m_5_30828",
          "qty": 20
        },
        {
          "item": "qicaixian",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1482",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元烽火鞋",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112569",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 20
        },
        {
          "item": "yinsi_duan",
          "qty": 20
        },
        {
          "item": "m_m_5_90338",
          "qty": 20
        }
      ],
      "note": "鞋 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1481",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元赤地鞋",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112568",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 10
        },
        {
          "item": "m_m_5_30850",
          "qty": 20
        },
        {
          "item": "wuseshi",
          "qty": 20
        },
        {
          "item": "m_m_5_90338",
          "qty": 20
        }
      ],
      "note": "鞋 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1230",
      "kind": "craft",
      "skillId": "fengren",
      "name": "绝世鞋子·【寒】",
      "level": 9,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31239",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_31397",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30828",
          "qty": 20
        },
        {
          "item": "qicaixian",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "鞋 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1487",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元赤地护腕",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112556",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 10
        },
        {
          "item": "m_m_5_30850",
          "qty": 20
        },
        {
          "item": "wuseshi",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "护手 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1488",
      "kind": "craft",
      "skillId": "fengren",
      "name": "玄元烽火护腕",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112557",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 20
        },
        {
          "item": "yinsi_duan",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "护手 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1226",
      "kind": "craft",
      "skillId": "fengren",
      "name": "绝世护腕·【寒】",
      "level": 9,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31235",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_31397",
          "qty": 1
        },
        {
          "item": "m_m_5_30852",
          "qty": 10
        },
        {
          "item": "m_m_5_30848",
          "qty": 20
        },
        {
          "item": "yinsi_duan",
          "qty": 20
        },
        {
          "item": "bairanxian",
          "qty": 20
        }
      ],
      "note": "护手 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1495",
      "kind": "craft",
      "skillId": "fengren",
      "name": "驾驾伪装",
      "level": 45,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90210",
          "qty": 8,
          "qtyMin": 7,
          "qtyMax": 9
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35718",
          "qty": 2
        },
        {
          "item": "m_m_5_35719",
          "qty": 2
        },
        {
          "item": "m_m_5_30873",
          "qty": 4
        }
      ],
      "note": "其他 · JX3BOX 当前版本配方 · 产出 7~9",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1494",
      "kind": "craft",
      "skillId": "fengren",
      "name": "哼唧伪装",
      "level": 35,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90205",
          "qty": 8,
          "qtyMin": 7,
          "qtyMax": 9
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35718",
          "qty": 2
        },
        {
          "item": "m_m_5_35719",
          "qty": 2
        },
        {
          "item": "m_m_5_30873",
          "qty": 4
        }
      ],
      "note": "其他 · JX3BOX 当前版本配方 · 产出 7~9",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_13",
      "kind": "craft",
      "skillId": "fengren",
      "name": "灯笼",
      "level": 1,
      "tier": 1,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_614",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "baihua_bu",
          "qty": 5
        },
        {
          "item": "m_m_5_10173",
          "qty": 5
        },
        {
          "item": "m_m_5_32002",
          "qty": 10
        }
      ],
      "note": "其他 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_183",
      "kind": "craft",
      "skillId": "fengren",
      "name": "山水刺绣手绢",
      "level": 11,
      "tier": 2,
      "energy": 27,
      "fee": 0,
      "outputs": [
        {
          "item": "shanshui_juan",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "wuseshi",
          "qty": 2
        },
        {
          "item": "bairanxian",
          "qty": 8
        },
        {
          "item": "m_m_5_32004",
          "qty": 20
        }
      ],
      "note": "礼品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_143",
      "kind": "craft",
      "skillId": "fengren",
      "name": "刺绣手绢",
      "level": 10,
      "tier": 2,
      "energy": 21,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_3819",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "qicaixian",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 8
        },
        {
          "item": "m_m_5_32001",
          "qty": 20
        }
      ],
      "note": "礼品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_9",
      "kind": "craft",
      "skillId": "fengren",
      "name": "小香包",
      "level": 1,
      "tier": 1,
      "energy": 6,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_3779",
          "qty": 5,
          "qtyMin": 4,
          "qtyMax": 6
        }
      ],
      "materials": [
        {
          "item": "baihua_bu",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 2
        },
        {
          "item": "m_m_5_32000",
          "qty": 5
        }
      ],
      "note": "礼品 · JX3BOX 当前版本配方 · 产出 4~6",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1437",
      "kind": "craft",
      "skillId": "fengren",
      "name": "彩缕花绫包",
      "level": 30,
      "tier": 3,
      "energy": 150,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_36148",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "shuran_bu",
          "qty": 10
        },
        {
          "item": "baihua_bu",
          "qty": 10
        },
        {
          "item": "m_m_5_30852",
          "qty": 6
        },
        {
          "item": "m_m_5_30853",
          "qty": 6
        }
      ],
      "note": "背包 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_19",
      "kind": "craft",
      "skillId": "fengren",
      "name": "棉布包",
      "level": 2,
      "tier": 1,
      "energy": 15,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_19",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_32000",
          "qty": 5
        },
        {
          "item": "m_m_5_32003",
          "qty": 5
        }
      ],
      "note": "背包 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1474",
      "kind": "craft",
      "skillId": "fengren",
      "name": "河洛纹·鞋（跑速）",
      "level": 46,
      "tier": 3,
      "energy": 80,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89475",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "shoupijiao",
          "qty": 5
        },
        {
          "item": "wuseshi",
          "qty": 5
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32002",
          "qty": 20
        }
      ],
      "note": "印染 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_1473",
      "kind": "craft",
      "skillId": "fengren",
      "name": "河洛纹·衣（御劲）",
      "level": 44,
      "tier": 3,
      "energy": 80,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89474",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "shoupijiao",
          "qty": 5
        },
        {
          "item": "yinsi_duan",
          "qty": 5
        },
        {
          "item": "bairanxian",
          "qty": 10
        },
        {
          "item": "m_m_5_32003",
          "qty": 20
        }
      ],
      "note": "印染 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_tailoring_146",
      "kind": "craft",
      "skillId": "fengren",
      "name": "丹青染布画",
      "level": 10,
      "tier": 2,
      "energy": 21,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_3820",
          "qty": 5,
          "qtyMin": 4,
          "qtyMax": 6
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89165",
          "qty": 1
        },
        {
          "item": "bairanxian",
          "qty": 8
        },
        {
          "item": "m_m_5_32001",
          "qty": 20
        }
      ],
      "note": "印染 · JX3BOX 当前版本配方 · 产出 4~6",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_417",
      "kind": "craft",
      "skillId": "pengren",
      "name": "百炼水煮鱼",
      "level": 20,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "shuizhuyu",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30827",
          "qty": 20
        },
        {
          "item": "m_m_5_89970",
          "qty": 15
        },
        {
          "item": "m_m_5_32014",
          "qty": 1
        },
        {
          "item": "m_m_5_31978",
          "qty": 20
        },
        {
          "item": "m_m_5_31985",
          "qty": 20
        }
      ],
      "note": "宴席 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_418",
      "kind": "craft",
      "skillId": "pengren",
      "name": "路菜",
      "level": 1,
      "tier": 3,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "lucai",
          "qty": 11.5,
          "qtyMin": 10,
          "qtyMax": 13
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 2
        },
        {
          "item": "m_m_5_1831",
          "qty": 5
        },
        {
          "item": "m_m_5_31973",
          "qty": 20
        },
        {
          "item": "m_m_5_30849",
          "qty": 5
        },
        {
          "item": "m_m_5_30827",
          "qty": 10
        }
      ],
      "note": "特殊食品 · JX3BOX 当前版本配方 · 产出 10~13",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_409",
      "kind": "craft",
      "skillId": "pengren",
      "name": "风语·老火骨汤",
      "level": 30,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71293",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30826",
          "qty": 5
        },
        {
          "item": "m_m_5_30825",
          "qty": 5
        },
        {
          "item": "m_m_5_89171",
          "qty": 1
        },
        {
          "item": "m_m_5_31974",
          "qty": 5
        },
        {
          "item": "m_m_5_31968",
          "qty": 10
        }
      ],
      "note": "辅助类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_408",
      "kind": "craft",
      "skillId": "pengren",
      "name": "风语·三鲜汤",
      "level": 30,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71292",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30824",
          "qty": 5
        },
        {
          "item": "m_m_5_30826",
          "qty": 5
        },
        {
          "item": "m_m_5_89171",
          "qty": 1
        },
        {
          "item": "m_m_5_31968",
          "qty": 5
        },
        {
          "item": "m_m_5_31967",
          "qty": 10
        }
      ],
      "note": "辅助类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_397",
      "kind": "craft",
      "skillId": "pengren",
      "name": "风语·鲜肉包子",
      "level": 30,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71281",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30823",
          "qty": 5
        },
        {
          "item": "m_m_5_30825",
          "qty": 5
        },
        {
          "item": "m_m_5_89171",
          "qty": 1
        },
        {
          "item": "m_m_5_31973",
          "qty": 5
        },
        {
          "item": "m_m_5_31969",
          "qty": 10
        }
      ],
      "note": "增强类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_393",
      "kind": "craft",
      "skillId": "pengren",
      "name": "风语·水煮肉片",
      "level": 30,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71277",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30824",
          "qty": 5
        },
        {
          "item": "m_m_5_30827",
          "qty": 5
        },
        {
          "item": "m_m_5_89171",
          "qty": 1
        },
        {
          "item": "m_m_5_31974",
          "qty": 5
        },
        {
          "item": "m_m_5_31985",
          "qty": 10
        }
      ],
      "note": "增强类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_431",
      "kind": "craft",
      "skillId": "pengren",
      "name": "云中珍馐宴（通用）",
      "level": 18,
      "tier": 3,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89315",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_1829",
          "qty": 10
        },
        {
          "item": "m_m_5_89969",
          "qty": 7
        },
        {
          "item": "m_m_5_30827",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 1
        },
        {
          "item": "m_m_5_31976",
          "qty": 20
        }
      ],
      "note": "宴席 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_419",
      "kind": "craft",
      "skillId": "pengren",
      "name": "巴渝珍馐宴（通用）",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89303",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_32014",
          "qty": 2
        },
        {
          "item": "m_m_5_89971",
          "qty": 15
        },
        {
          "item": "m_m_5_30853",
          "qty": 2
        },
        {
          "item": "m_m_5_30827",
          "qty": 20
        },
        {
          "item": "m_m_5_31976",
          "qty": 20
        }
      ],
      "note": "宴席 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_363",
      "kind": "craft",
      "skillId": "pengren",
      "name": "馅料",
      "level": 5,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89969",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "lushui",
          "qty": 2
        },
        {
          "item": "m_m_5_89298",
          "qty": 6
        },
        {
          "item": "m_m_5_30844",
          "qty": 5
        },
        {
          "item": "m_m_5_30875",
          "qty": 5
        },
        {
          "item": "m_m_5_30829",
          "qty": 20
        }
      ],
      "note": "烹饪材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_362",
      "kind": "craft",
      "skillId": "pengren",
      "name": "酱料",
      "level": 3,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89970",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "lushui",
          "qty": 2
        },
        {
          "item": "m_m_5_89298",
          "qty": 6
        },
        {
          "item": "m_m_5_30843",
          "qty": 5
        },
        {
          "item": "m_m_5_30874",
          "qty": 5
        },
        {
          "item": "m_m_5_31985",
          "qty": 20
        }
      ],
      "note": "烹饪材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_361",
      "kind": "craft",
      "skillId": "pengren",
      "name": "卤料",
      "level": 4,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89971",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "lushui",
          "qty": 2
        },
        {
          "item": "m_m_5_89298",
          "qty": 6
        },
        {
          "item": "m_m_5_30842",
          "qty": 5
        },
        {
          "item": "m_m_5_30873",
          "qty": 5
        },
        {
          "item": "m_m_5_31976",
          "qty": 20
        }
      ],
      "note": "烹饪材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_121",
      "kind": "craft",
      "skillId": "pengren",
      "name": "饺子馅",
      "level": 2,
      "tier": 1,
      "energy": 7,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_5270",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30823",
          "qty": 1
        },
        {
          "item": "m_m_5_31970",
          "qty": 1
        },
        {
          "item": "m_m_5_31976",
          "qty": 1
        }
      ],
      "note": "烹饪材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_120",
      "kind": "craft",
      "skillId": "pengren",
      "name": "饺子皮",
      "level": 1,
      "tier": 1,
      "energy": 7,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_5269",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_31973",
          "qty": 1
        },
        {
          "item": "m_m_5_31977",
          "qty": 1
        }
      ],
      "note": "烹饪材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_329",
      "kind": "craft",
      "skillId": "pengren",
      "name": "转神餐",
      "level": 9,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31013",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89171",
          "qty": 2
        },
        {
          "item": "m_m_5_31976",
          "qty": 15
        },
        {
          "item": "m_m_5_30845",
          "qty": 2
        },
        {
          "item": "gancao",
          "qty": 3
        }
      ],
      "note": "回复类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_328",
      "kind": "craft",
      "skillId": "pengren",
      "name": "佛跳墙",
      "level": 9,
      "tier": 4,
      "energy": 75,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31012",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30853",
          "qty": 1
        },
        {
          "item": "m_m_5_30827",
          "qty": 15
        },
        {
          "item": "m_m_5_89971",
          "qty": 3
        },
        {
          "item": "m_m_5_31976",
          "qty": 10
        },
        {
          "item": "m_m_5_31974",
          "qty": 10
        }
      ],
      "note": "回复类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_451",
      "kind": "craft",
      "skillId": "pengren",
      "name": "安营炊鼎",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90034",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89971",
          "qty": 4
        },
        {
          "item": "m_m_5_30845",
          "qty": 4
        },
        {
          "item": "m_m_5_30843",
          "qty": 10
        },
        {
          "item": "m_m_5_30873",
          "qty": 8
        },
        {
          "item": "m_m_5_89172",
          "qty": 4
        },
        {
          "item": "m_m_5_89171",
          "qty": 4
        }
      ],
      "note": "烹饪材料 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_420",
      "kind": "craft",
      "skillId": "pengren",
      "name": "巴山夜雨宴（外攻）",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89304",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_32014",
          "qty": 2
        },
        {
          "item": "m_m_5_89971",
          "qty": 15
        },
        {
          "item": "m_m_5_30856",
          "qty": 2
        },
        {
          "item": "m_m_5_30874",
          "qty": 20
        },
        {
          "item": "m_m_5_89171",
          "qty": 1
        }
      ],
      "note": "宴席 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_302",
      "kind": "craft",
      "skillId": "pengren",
      "name": "炼狱水煮鱼",
      "level": 5,
      "tier": 4,
      "energy": 80,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_24212",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30827",
          "qty": 10
        },
        {
          "item": "m_m_5_89970",
          "qty": 5
        },
        {
          "item": "m_m_5_31976",
          "qty": 10
        },
        {
          "item": "m_m_5_31978",
          "qty": 10
        },
        {
          "item": "m_m_5_31985",
          "qty": 10
        }
      ],
      "note": "宴席 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_452",
      "kind": "craft",
      "skillId": "pengren",
      "name": "膘然心动",
      "level": 50,
      "tier": 4,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_26057",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89969",
          "qty": 3
        },
        {
          "item": "m_m_5_89172",
          "qty": 2
        },
        {
          "item": "m_m_5_89171",
          "qty": 2
        },
        {
          "item": "m_m_5_30874",
          "qty": 5
        },
        {
          "item": "m_m_5_30845",
          "qty": 1
        },
        {
          "item": "m_m_5_30843",
          "qty": 3
        }
      ],
      "note": "特殊食品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_358",
      "kind": "craft",
      "skillId": "pengren",
      "name": "如意饺",
      "level": 3,
      "tier": 3,
      "energy": 37,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_26231",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_5269",
          "qty": 2
        },
        {
          "item": "m_m_5_5270",
          "qty": 2
        },
        {
          "item": "m_m_5_31976",
          "qty": 2
        }
      ],
      "note": "特殊食品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_441",
      "kind": "craft",
      "skillId": "pengren",
      "name": "云州刀削面",
      "level": 50,
      "tier": 4,
      "energy": 75,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89352",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "fengwangjiang",
          "qty": 1
        },
        {
          "item": "m_m_5_30874",
          "qty": 15
        },
        {
          "item": "m_m_5_89969",
          "qty": 3
        },
        {
          "item": "m_m_5_31973",
          "qty": 10
        },
        {
          "item": "m_m_5_31976",
          "qty": 10
        }
      ],
      "note": "增强类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_439",
      "kind": "craft",
      "skillId": "pengren",
      "name": "山城毛血旺",
      "level": 50,
      "tier": 4,
      "energy": 75,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89350",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "fengwangjiang",
          "qty": 1
        },
        {
          "item": "m_m_5_30875",
          "qty": 15
        },
        {
          "item": "m_m_5_89971",
          "qty": 3
        },
        {
          "item": "m_m_5_31976",
          "qty": 10
        },
        {
          "item": "m_m_5_31974",
          "qty": 10
        }
      ],
      "note": "增强类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_385",
      "kind": "craft",
      "skillId": "pengren",
      "name": "风语·红烧排骨",
      "level": 30,
      "tier": 4,
      "energy": 75,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71269",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "fengwangjiang",
          "qty": 1
        },
        {
          "item": "m_m_5_30826",
          "qty": 15
        },
        {
          "item": "m_m_5_89171",
          "qty": 3
        },
        {
          "item": "m_m_5_31976",
          "qty": 10
        },
        {
          "item": "m_m_5_31970",
          "qty": 10
        }
      ],
      "note": "增强类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_437",
      "kind": "craft",
      "skillId": "pengren",
      "name": "云芝竹沥羹",
      "level": 50,
      "tier": 4,
      "energy": 75,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89346",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30853",
          "qty": 1
        },
        {
          "item": "m_m_5_30845",
          "qty": 3
        },
        {
          "item": "m_m_5_89970",
          "qty": 3
        },
        {
          "item": "m_m_5_89167",
          "qty": 1
        },
        {
          "item": "m_m_5_31984",
          "qty": 10
        }
      ],
      "note": "辅助类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_444",
      "kind": "craft",
      "skillId": "pengren",
      "name": "开锅豆腐",
      "level": 36,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89348",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30845",
          "qty": 2
        },
        {
          "item": "m_m_5_30842",
          "qty": 4
        },
        {
          "item": "m_m_5_89171",
          "qty": 1
        },
        {
          "item": "m_m_5_31984",
          "qty": 18
        }
      ],
      "note": "辅助类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_cooking_401",
      "kind": "craft",
      "skillId": "pengren",
      "name": "风语·杂锦鱼球粥",
      "level": 30,
      "tier": 4,
      "energy": 75,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71285",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30853",
          "qty": 1
        },
        {
          "item": "m_m_5_30827",
          "qty": 15
        },
        {
          "item": "m_m_5_89171",
          "qty": 3
        },
        {
          "item": "m_m_5_31978",
          "qty": 10
        },
        {
          "item": "m_m_5_31984",
          "qty": 10
        }
      ],
      "note": "辅助类食品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_353",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "截元丹",
      "level": 8,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "jieyuan_dan",
          "qty": 1.5,
          "qtyMin": 1,
          "qtyMax": 2
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30836",
          "qty": 5
        },
        {
          "item": "m_m_5_30832",
          "qty": 5
        },
        {
          "item": "m_m_5_30833",
          "qty": 10
        },
        {
          "item": "m_m_5_30847",
          "qty": 1
        },
        {
          "item": "m_m_5_31997",
          "qty": 10
        }
      ],
      "note": "特殊药品 · JX3BOX 当前版本配方 · 产出 1~2",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_401",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "竹沥凝心饮",
      "level": 18,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89324",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "gancao",
          "qty": 5
        },
        {
          "item": "m_m_5_30831",
          "qty": 5
        },
        {
          "item": "m_m_5_30832",
          "qty": 10
        },
        {
          "item": "m_m_5_89973",
          "qty": 1
        },
        {
          "item": "m_m_5_31996",
          "qty": 10
        }
      ],
      "note": "回复类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_366",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "风语·中品万灵丹",
      "level": 30,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71241",
          "qty": 3.5,
          "qtyMin": 3,
          "qtyMax": 4
        }
      ],
      "materials": [
        {
          "item": "gancao",
          "qty": 5
        },
        {
          "item": "m_m_5_30831",
          "qty": 5
        },
        {
          "item": "m_m_5_30832",
          "qty": 10
        },
        {
          "item": "m_m_5_89167",
          "qty": 1
        },
        {
          "item": "m_m_5_31996",
          "qty": 10
        }
      ],
      "note": "回复类药品 · JX3BOX 当前版本配方 · 产出 3~4",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_365",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "风语·上品万灵丹",
      "level": 30,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71240",
          "qty": 3.5,
          "qtyMin": 3,
          "qtyMax": 4
        }
      ],
      "materials": [
        {
          "item": "fengwangjiang",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_30831",
          "qty": 10
        },
        {
          "item": "m_m_5_89167",
          "qty": 4
        },
        {
          "item": "m_m_5_31995",
          "qty": 20
        }
      ],
      "note": "回复类药品 · JX3BOX 当前版本配方 · 产出 3~4",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_391",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "风语·中品大力丸",
      "level": 30,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71266",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30832",
          "qty": 5
        },
        {
          "item": "m_m_5_30838",
          "qty": 5
        },
        {
          "item": "shanhu",
          "qty": 10
        },
        {
          "item": "m_m_5_89167",
          "qty": 1
        },
        {
          "item": "m_m_5_6646",
          "qty": 10
        }
      ],
      "note": "辅助类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_400",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "云州固阵丹",
      "level": 50,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89333",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30855",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_30835",
          "qty": 4
        },
        {
          "item": "m_m_5_89974",
          "qty": 5
        },
        {
          "item": "m_m_5_6648",
          "qty": 20
        }
      ],
      "note": "增强类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_392",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "风语·中品静心丸",
      "level": 30,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71267",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30833",
          "qty": 5
        },
        {
          "item": "shanhu",
          "qty": 5
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_89167",
          "qty": 1
        },
        {
          "item": "m_m_5_6648",
          "qty": 10
        }
      ],
      "note": "辅助类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_410",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "回神丹",
      "level": 45,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90029",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89167",
          "qty": 2
        },
        {
          "item": "m_m_5_89168",
          "qty": 2
        },
        {
          "item": "m_m_5_30842",
          "qty": 6
        },
        {
          "item": "m_m_5_30844",
          "qty": 6
        },
        {
          "item": "yaoyin",
          "qty": 1
        }
      ],
      "note": "特殊药品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_352",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "金针·影",
      "level": 7,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31100",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30835",
          "qty": 5
        },
        {
          "item": "m_m_5_30831",
          "qty": 5
        },
        {
          "item": "m_m_5_30832",
          "qty": 10
        },
        {
          "item": "m_m_5_30849",
          "qty": 1
        },
        {
          "item": "m_m_5_31996",
          "qty": 10
        }
      ],
      "note": "特殊药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_362",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "药丸",
      "level": 3,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89973",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30848",
          "qty": 2
        },
        {
          "item": "m_m_5_30845",
          "qty": 1
        },
        {
          "item": "m_m_5_31996",
          "qty": 10
        },
        {
          "item": "m_m_5_31995",
          "qty": 10
        },
        {
          "item": "m_m_5_89298",
          "qty": 5
        }
      ],
      "note": "医术材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_363",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "药膏",
      "level": 4,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89974",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30849",
          "qty": 2
        },
        {
          "item": "m_m_5_30845",
          "qty": 1
        },
        {
          "item": "m_m_5_31996",
          "qty": 10
        },
        {
          "item": "m_m_5_31995",
          "qty": 10
        },
        {
          "item": "m_m_5_89298",
          "qty": 5
        }
      ],
      "note": "医术材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_361",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "药引",
      "level": 2,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "yaoyin",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30847",
          "qty": 2
        },
        {
          "item": "m_m_5_30845",
          "qty": 1
        },
        {
          "item": "m_m_5_31996",
          "qty": 10
        },
        {
          "item": "m_m_5_31995",
          "qty": 10
        },
        {
          "item": "m_m_5_89298",
          "qty": 5
        }
      ],
      "note": "医术材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_393",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "竹沥清心露",
      "level": 50,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89322",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "fengwangjiang",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "shaoyao",
          "qty": 3
        },
        {
          "item": "m_m_5_89973",
          "qty": 4
        },
        {
          "item": "m_m_5_31995",
          "qty": 20
        }
      ],
      "note": "回复类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_412",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "踏波露",
      "level": 48,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90206",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89167",
          "qty": 1
        },
        {
          "item": "m_m_5_89168",
          "qty": 1
        },
        {
          "item": "m_m_5_30842",
          "qty": 4
        }
      ],
      "note": "特殊药品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_354",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "飞鱼丸",
      "level": 1,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31102",
          "qty": 7.5,
          "qtyMin": 5,
          "qtyMax": 10
        }
      ],
      "materials": [
        {
          "item": "shaoyao",
          "qty": 5
        },
        {
          "item": "m_m_5_30833",
          "qty": 5
        },
        {
          "item": "m_m_5_30834",
          "qty": 10
        },
        {
          "item": "lushui",
          "qty": 1
        },
        {
          "item": "m_m_5_31998",
          "qty": 10
        }
      ],
      "note": "特殊药品 · JX3BOX 当前版本配方 · 产出 5~10",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_411",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "定魂丹砂",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90035",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "yaoyin",
          "qty": 4
        },
        {
          "item": "m_m_5_30842",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 4
        },
        {
          "item": "m_m_5_89167",
          "qty": 10
        },
        {
          "item": "m_m_5_89168",
          "qty": 10
        }
      ],
      "note": "医术材料 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_395",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "巴山凝神丹",
      "level": 50,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89328",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30853",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_30835",
          "qty": 4
        },
        {
          "item": "yaoyin",
          "qty": 5
        },
        {
          "item": "m_m_5_31995",
          "qty": 20
        }
      ],
      "note": "增强类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_399",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "河洛生息丹",
      "level": 50,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89332",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "fengwangjiang",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_30835",
          "qty": 4
        },
        {
          "item": "m_m_5_89973",
          "qty": 5
        },
        {
          "item": "m_m_5_6646",
          "qty": 20
        }
      ],
      "note": "增强类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_403",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "巴山凝神散",
      "level": 25,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89340",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "gancao",
          "qty": 5
        },
        {
          "item": "m_m_5_30835",
          "qty": 2
        },
        {
          "item": "shaoyao",
          "qty": 10
        },
        {
          "item": "yaoyin",
          "qty": 1
        },
        {
          "item": "m_m_5_31998",
          "qty": 10
        }
      ],
      "note": "增强类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_394",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "五气归元丹",
      "level": 50,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89325",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30853",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_30835",
          "qty": 4
        },
        {
          "item": "yaoyin",
          "qty": 5
        },
        {
          "item": "m_m_5_31995",
          "qty": 20
        }
      ],
      "note": "辅助类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_383",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "风语·上品健体丸",
      "level": 30,
      "tier": 4,
      "energy": 90,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71258",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30855",
          "qty": 1
        },
        {
          "item": "gancao",
          "qty": 10
        },
        {
          "item": "m_m_5_30831",
          "qty": 10
        },
        {
          "item": "m_m_5_89167",
          "qty": 4
        },
        {
          "item": "m_m_5_31999",
          "qty": 20
        }
      ],
      "note": "辅助类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_medicine_402",
      "kind": "craft",
      "skillId": "zhiyao",
      "name": "五气培元丸",
      "level": 22,
      "tier": 3,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89327",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "gancao",
          "qty": 5
        },
        {
          "item": "m_m_5_30835",
          "qty": 12
        },
        {
          "item": "yaoyin",
          "qty": 1
        },
        {
          "item": "m_m_5_6646",
          "qty": 10
        }
      ],
      "note": "辅助类药品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1282",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "苍生·巨灵磨石（仇恨）",
      "level": 50,
      "tier": 3,
      "energy": 30,
      "fee": 0,
      "outputs": [
        {
          "item": "juling_chou",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30850",
          "qty": 1
        },
        {
          "item": "m_m_5_89966",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1281",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "苍生·絮泊磨石（疗伤）",
      "level": 48,
      "tier": 3,
      "energy": 30,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89377",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "shoupijiao",
          "qty": 1
        },
        {
          "item": "m_m_5_89968",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        },
        {
          "item": "m_m_5_31993",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1280",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "苍生·坠宵磨石（攻击）",
      "level": 46,
      "tier": 3,
      "energy": 30,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89376",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30845",
          "qty": 1
        },
        {
          "item": "m_m_5_89965",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        },
        {
          "item": "m_m_5_31992",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1279",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "苍生·瀑沙磨石（武伤）",
      "level": 44,
      "tier": 3,
      "energy": 30,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89375",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30850",
          "qty": 1
        },
        {
          "item": "m_m_5_89963",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1278",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "苍生·巨灵熔锭（仇恨）",
      "level": 50,
      "tier": 4,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89370",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30856",
          "qty": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 5
        },
        {
          "item": "m_m_5_89966",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1245",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "风语·巨灵磨石（仇恨）",
      "level": 30,
      "tier": 3,
      "energy": 30,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71192",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30846",
          "qty": 1
        },
        {
          "item": "m_m_5_89169",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1241",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "风语·兵·甲（仇恨）",
      "level": 30,
      "tier": 3,
      "energy": 80,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_71188",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30846",
          "qty": 5
        },
        {
          "item": "m_m_5_89169",
          "qty": 5
        },
        {
          "item": "m_m_5_10176",
          "qty": 10
        },
        {
          "item": "m_m_5_31994",
          "qty": 20
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1324",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元星平帽",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112584",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "m_m_5_89962",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "帽子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1330",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元星平护腰",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112566",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "m_m_5_89962",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "腰带 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1336",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元星平裤",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112578",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "m_m_5_89962",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "裤子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1007",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "龙血磨石",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31139",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30856",
          "qty": 7
        },
        {
          "item": "fengwangjiang",
          "qty": 7
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "m_m_5_89964",
          "qty": 20
        },
        {
          "item": "m_m_5_31994",
          "qty": 20
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_458",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "素银钥匙",
      "level": 8,
      "tier": 2,
      "energy": 10,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_10027",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89961",
          "qty": 1
        },
        {
          "item": "m_m_5_10029",
          "qty": 1
        },
        {
          "item": "m_m_5_31992",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1157",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "镔铁锭",
      "level": 7,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89966",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "tiekuang",
          "qty": 5
        },
        {
          "item": "m_m_5_30676",
          "qty": 5
        },
        {
          "item": "m_m_5_31994",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1153",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "密银锭",
      "level": 8,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89962",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "m_m_5_30678",
          "qty": 10
        },
        {
          "item": "m_m_5_31993",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1152",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "熟铁锭",
      "level": 7,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89961",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "tiekuang",
          "qty": 5
        },
        {
          "item": "m_m_5_31992",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1155",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "青铜锭",
      "level": 2,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89964",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "m_m_5_30674",
          "qty": 5
        },
        {
          "item": "m_m_5_30675",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1156",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "锡锭",
      "level": 2,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89965",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "m_m_5_30675",
          "qty": 10
        },
        {
          "item": "m_m_5_31993",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1154",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "黄铜锭",
      "level": 4,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89963",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "m_m_5_30674",
          "qty": 5
        },
        {
          "item": "m_m_5_30676",
          "qty": 5
        },
        {
          "item": "m_m_5_31992",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1159",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "铅锭",
      "level": 4,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89968",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "m_m_5_30676",
          "qty": 10
        },
        {
          "item": "m_m_5_31994",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1158",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "生铁锭",
      "level": 6,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89967",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89298",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 2
        },
        {
          "item": "tiekuang",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1275",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "苍生·瀑沙熔锭（武伤）",
      "level": 50,
      "tier": 4,
      "energy": 60,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89367",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30856",
          "qty": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 5
        },
        {
          "item": "m_m_5_89963",
          "qty": 5
        },
        {
          "item": "m_m_5_31991",
          "qty": 10
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_268",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "青铜钥匙",
      "level": 1,
      "tier": 2,
      "energy": 4,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_6246",
          "qty": 4.5,
          "qtyMin": 4,
          "qtyMax": 5
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30674",
          "qty": 1
        },
        {
          "item": "m_m_5_6249",
          "qty": 1
        },
        {
          "item": "m_m_5_31992",
          "qty": 1
        }
      ],
      "note": "消耗品 · JX3BOX 当前版本配方 · 产出 4~5",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1332",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元烽火裤",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112575",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 20
        },
        {
          "item": "m_m_5_89965",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "裤子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1333",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元风鹤裤",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112573",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "m_m_5_89968",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "裤子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1076",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "绝世下装·【兹】",
      "level": 9,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31209",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_32787",
          "qty": 1
        },
        {
          "item": "m_m_5_30855",
          "qty": 10
        },
        {
          "item": "m_m_5_30847",
          "qty": 20
        },
        {
          "item": "m_m_5_89963",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "裤子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1329",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元松绿护腰",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112564",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 20
        },
        {
          "item": "m_m_5_89967",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "腰带 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1327",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元风鹤护腰",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112561",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "fengwangjiang",
          "qty": 10
        },
        {
          "item": "shoupijiao",
          "qty": 20
        },
        {
          "item": "m_m_5_89968",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "腰带 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1078",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "绝世腰带·【兹】",
      "level": 9,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31211",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_32787",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30828",
          "qty": 20
        },
        {
          "item": "m_m_5_89968",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "腰带 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1169",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "寄青荷",
      "level": 16,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_25762",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30841",
          "qty": 10
        },
        {
          "item": "m_m_5_10172",
          "qty": 2
        },
        {
          "item": "m_m_5_35708",
          "qty": 5
        },
        {
          "item": "m_m_5_30675",
          "qty": 10
        }
      ],
      "note": "马具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_164",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "银龙笼套",
      "level": 15,
      "tier": 2,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_17541",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89967",
          "qty": 5
        },
        {
          "item": "m_m_5_89962",
          "qty": 5
        },
        {
          "item": "m_m_5_10176",
          "qty": 10
        },
        {
          "item": "m_m_5_31993",
          "qty": 10
        }
      ],
      "note": "马具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_103",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "铁制鞍具",
      "level": 7,
      "tier": 2,
      "energy": 30,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_17538",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89967",
          "qty": 1
        },
        {
          "item": "m_m_5_89968",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 5
        },
        {
          "item": "m_m_5_31994",
          "qty": 10
        }
      ],
      "note": "马具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1323",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元松绿帽",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112582",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_30845",
          "qty": 20
        },
        {
          "item": "m_m_5_89967",
          "qty": 20
        },
        {
          "item": "m_m_5_90338",
          "qty": 20
        }
      ],
      "note": "帽子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1322",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄元木声帽",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_7_112583",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 10
        },
        {
          "item": "m_m_5_30850",
          "qty": 20
        },
        {
          "item": "m_m_5_89966",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "帽子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1077",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "绝世头饰·【兹】",
      "level": 9,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_31210",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_32787",
          "qty": 1
        },
        {
          "item": "m_m_5_30852",
          "qty": 10
        },
        {
          "item": "m_m_5_30848",
          "qty": 20
        },
        {
          "item": "m_m_5_89965",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "帽子 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1337",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "定营铁桩",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90032",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89961",
          "qty": 8
        },
        {
          "item": "m_m_5_30850",
          "qty": 4
        },
        {
          "item": "m_m_5_89169",
          "qty": 5
        },
        {
          "item": "m_m_5_89170",
          "qty": 3
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1343",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "珠·苍生",
      "level": 50,
      "tier": 4,
      "energy": 200,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89567",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "dimai",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 10
        },
        {
          "item": "m_m_5_30847",
          "qty": 20
        },
        {
          "item": "m_m_5_89966",
          "qty": 20
        },
        {
          "item": "m_m_5_10176",
          "qty": 20
        }
      ],
      "note": "制品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_120",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "玄武腰刀",
      "level": 9,
      "tier": 2,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_632",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89967",
          "qty": 5
        },
        {
          "item": "m_m_5_89962",
          "qty": 5
        },
        {
          "item": "m_m_5_10172",
          "qty": 2
        },
        {
          "item": "m_m_5_31993",
          "qty": 10
        }
      ],
      "note": "挂件 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_146",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "青龙腰刀",
      "level": 9,
      "tier": 2,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_634",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89962",
          "qty": 5
        },
        {
          "item": "m_m_5_89963",
          "qty": 5
        },
        {
          "item": "m_m_5_10172",
          "qty": 2
        },
        {
          "item": "m_m_5_31991",
          "qty": 10
        }
      ],
      "note": "挂件 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_163",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "麒麟腰刀",
      "level": 3,
      "tier": 2,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_8_636",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89964",
          "qty": 5
        },
        {
          "item": "m_m_5_89965",
          "qty": 5
        },
        {
          "item": "m_m_5_10172",
          "qty": 2
        },
        {
          "item": "m_m_5_31993",
          "qty": 10
        }
      ],
      "note": "挂件 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1340",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "同门饕餮鼎",
      "level": 50,
      "tier": 4,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90353",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30856",
          "qty": 5
        },
        {
          "item": "m_m_5_89166",
          "qty": 8
        },
        {
          "item": "m_m_5_89169",
          "qty": 8
        },
        {
          "item": "m_m_5_89963",
          "qty": 4
        }
      ],
      "note": "礼品 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_1339",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "飞高高",
      "level": 45,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90257",
          "qty": 8,
          "qtyMin": 7,
          "qtyMax": 9
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35718",
          "qty": 4
        },
        {
          "item": "m_m_5_35719",
          "qty": 2
        },
        {
          "item": "m_m_5_30850",
          "qty": 2
        }
      ],
      "note": "礼品 · JX3BOX 当前版本配方 · 产出 7~9",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_5",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "铜偶",
      "level": 7,
      "tier": 1,
      "energy": 6,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_2578",
          "qty": 5,
          "qtyMin": 4,
          "qtyMax": 6
        }
      ],
      "materials": [
        {
          "item": "m_m_5_89963",
          "qty": 1
        },
        {
          "item": "m_m_5_10176",
          "qty": 2
        },
        {
          "item": "m_m_5_31994",
          "qty": 5
        }
      ],
      "note": "礼品 · JX3BOX 当前版本配方 · 产出 4~6",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_263",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "鞭炮",
      "level": 9,
      "tier": 2,
      "energy": 2,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_6072",
          "qty": 1.5,
          "qtyMin": 1,
          "qtyMax": 2
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30678",
          "qty": 2
        },
        {
          "item": "m_m_5_32004",
          "qty": 2
        },
        {
          "item": "m_m_5_31992",
          "qty": 2
        }
      ],
      "note": "烟火 · JX3BOX 当前版本配方 · 产出 1~2",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_262",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "龙凤呈祥",
      "level": 7,
      "tier": 2,
      "energy": 2,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_6068",
          "qty": 1.5,
          "qtyMin": 1,
          "qtyMax": 2
        }
      ],
      "materials": [
        {
          "item": "tiekuang",
          "qty": 2
        },
        {
          "item": "m_m_5_32003",
          "qty": 2
        },
        {
          "item": "m_m_5_31992",
          "qty": 2
        }
      ],
      "note": "烟火 · JX3BOX 当前版本配方 · 产出 1~2",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_founding_259",
      "kind": "craft",
      "skillId": "duanzao",
      "name": "元宝灯",
      "level": 1,
      "tier": 2,
      "energy": 2,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_6066",
          "qty": 1.5,
          "qtyMin": 1,
          "qtyMax": 2
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30674",
          "qty": 2
        },
        {
          "item": "m_m_5_32000",
          "qty": 2
        },
        {
          "item": "m_m_5_31992",
          "qty": 2
        }
      ],
      "note": "烟火 · JX3BOX 当前版本配方 · 产出 1~2",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_58",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "木板",
      "level": 1,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "muban",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "muliao",
          "qty": 5
        },
        {
          "item": "m_m_5_35707",
          "qty": 5
        },
        {
          "item": "m_m_5_35703",
          "qty": 5
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_203",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "器物令",
      "level": 1,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "qiwuling",
          "qty": 3,
          "qtyMin": 3,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "tiekuang",
          "qty": 15
        },
        {
          "item": "shanhu",
          "qty": 15
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_62",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "鱼胶",
      "level": 5,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_35716",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30827",
          "qty": 5
        },
        {
          "item": "m_m_5_35708",
          "qty": 5
        },
        {
          "item": "m_m_5_35702",
          "qty": 5
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_61",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "篾条",
      "level": 5,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_35715",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "zhuzi",
          "qty": 5
        },
        {
          "item": "m_m_5_35567",
          "qty": 5
        },
        {
          "item": "m_m_5_35704",
          "qty": 5
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_60",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "雕花",
      "level": 5,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_35714",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "muliao",
          "qty": 5
        },
        {
          "item": "m_m_5_35707",
          "qty": 5
        },
        {
          "item": "m_m_5_35701",
          "qty": 5
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_59",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "卯榫",
      "level": 5,
      "tier": 3,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_35713",
          "qty": 2.5,
          "qtyMin": 2,
          "qtyMax": 3
        }
      ],
      "materials": [
        {
          "item": "muliao",
          "qty": 5
        },
        {
          "item": "zhuzi",
          "qty": 5
        },
        {
          "item": "m_m_5_35705",
          "qty": 5
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方 · 产出 2~3",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_301",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "清漆药柜",
      "level": 20,
      "tier": 3,
      "energy": 57,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_1778",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "muban",
          "qty": 20
        },
        {
          "item": "m_m_5_35713",
          "qty": 10
        },
        {
          "item": "m_m_5_30848",
          "qty": 5
        },
        {
          "item": "m_m_5_35707",
          "qty": 20
        }
      ],
      "note": "家具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_232",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "简素椅",
      "level": 16,
      "tier": 4,
      "energy": 20,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_948",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35716",
          "qty": 5
        },
        {
          "item": "muban",
          "qty": 5
        }
      ],
      "note": "家具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_425",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "归营旌",
      "level": 50,
      "tier": 4,
      "energy": 120,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_89260",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_90032",
          "qty": 1
        },
        {
          "item": "tongpao_fan",
          "qty": 1
        },
        {
          "item": "m_m_5_90034",
          "qty": 1
        },
        {
          "item": "m_m_5_90035",
          "qty": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 5
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_302",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "锻炉",
      "level": 20,
      "tier": 4,
      "energy": 69,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_1779",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30852",
          "qty": 20
        },
        {
          "item": "m_m_5_30679",
          "qty": 10
        }
      ],
      "note": "景观 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_305",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "残烛柜架",
      "level": 30,
      "tier": 4,
      "energy": 57,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_1880",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "muban",
          "qty": 20
        },
        {
          "item": "m_m_5_35714",
          "qty": 20
        },
        {
          "item": "m_m_5_30848",
          "qty": 5
        }
      ],
      "note": "家具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_319",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "矩形回纹格",
      "level": 27,
      "tier": 4,
      "energy": 57,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_2034",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "muban",
          "qty": 10
        },
        {
          "item": "m_m_5_35714",
          "qty": 10
        },
        {
          "item": "m_m_5_35713",
          "qty": 10
        },
        {
          "item": "m_m_5_30855",
          "qty": 2
        }
      ],
      "note": "家具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_63",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "葵草席",
      "level": 6,
      "tier": 1,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_93",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35715",
          "qty": 1
        },
        {
          "item": "m_m_5_35567",
          "qty": 1
        }
      ],
      "note": "家具 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_312",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "禅心悬旗",
      "level": 30,
      "tier": 4,
      "energy": 69,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_1882",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35717",
          "qty": 1
        },
        {
          "item": "m_m_5_30853",
          "qty": 10
        },
        {
          "item": "m_m_5_35713",
          "qty": 15
        },
        {
          "item": "m_m_5_10172",
          "qty": 10
        }
      ],
      "note": "景观 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_322",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "铜雕踩球对狮·右",
      "level": 29,
      "tier": 4,
      "energy": 69,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_2037",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35717",
          "qty": 10
        },
        {
          "item": "m_m_5_30852",
          "qty": 20
        },
        {
          "item": "m_m_5_35713",
          "qty": 20
        },
        {
          "item": "m_m_5_30674",
          "qty": 20
        },
        {
          "item": "m_m_5_30679",
          "qty": 10
        }
      ],
      "note": "景观 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_134",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "素髹桑木灯檠",
      "level": 6,
      "tier": 1,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_10_164",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35715",
          "qty": 1
        },
        {
          "item": "muban",
          "qty": 1
        },
        {
          "item": "m_m_5_35704",
          "qty": 5
        }
      ],
      "note": "景观 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_281",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "地下室·8米木质标准包",
      "level": 20,
      "tier": 4,
      "energy": 350,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_52337",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35717",
          "qty": 1
        },
        {
          "item": "m_m_5_35713",
          "qty": 6
        },
        {
          "item": "m_m_5_35715",
          "qty": 6
        },
        {
          "item": "muban",
          "qty": 10
        },
        {
          "item": "m_m_5_30679",
          "qty": 10
        }
      ],
      "note": "建筑 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_204",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "竹篾篱·套件",
      "level": 18,
      "tier": 4,
      "energy": 800,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_40232",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "muban",
          "qty": 20
        },
        {
          "item": "m_m_5_35716",
          "qty": 20
        },
        {
          "item": "m_m_5_30855",
          "qty": 5
        },
        {
          "item": "m_m_5_30679",
          "qty": 20
        },
        {
          "item": "m_m_5_35715",
          "qty": 20
        }
      ],
      "note": "建筑 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_54",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "兖石地墁·套件",
      "level": 11,
      "tier": 4,
      "energy": 800,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_35772",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "muliao",
          "qty": 20
        },
        {
          "item": "zhuzi",
          "qty": 20
        },
        {
          "item": "muban",
          "qty": 10
        },
        {
          "item": "m_m_5_35701",
          "qty": 20
        }
      ],
      "note": "建筑 · JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_426",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "飞毛腿伪装",
      "level": 45,
      "tier": 3,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_90211",
          "qty": 8,
          "qtyMin": 7,
          "qtyMax": 9
        }
      ],
      "materials": [
        {
          "item": "m_m_5_35718",
          "qty": 2
        },
        {
          "item": "m_m_5_35719",
          "qty": 2
        },
        {
          "item": "m_m_5_30873",
          "qty": 4
        }
      ],
      "note": "材料 · JX3BOX 当前版本配方 · 产出 7~9",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_423",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "拼布自选包",
      "level": 1,
      "tier": 4,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_87917",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_10173",
          "qty": 2
        },
        {
          "item": "m_m_5_35715",
          "qty": 3
        },
        {
          "item": "zhuzi",
          "qty": 10
        },
        {
          "item": "m_m_5_45721",
          "qty": 5
        }
      ],
      "note": "JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "m_furniture_424",
      "kind": "craft",
      "skillId": "zijiang",
      "name": "拼布72色全包",
      "level": 1,
      "tier": 4,
      "energy": 100,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_87881",
          "qty": 1,
          "qtyMin": 1,
          "qtyMax": 1
        }
      ],
      "materials": [
        {
          "item": "m_m_5_30855",
          "qty": 15
        },
        {
          "item": "m_m_5_30853",
          "qty": 15
        },
        {
          "item": "fengwangjiang",
          "qty": 15
        },
        {
          "item": "m_m_5_10173",
          "qty": 20
        },
        {
          "item": "zhuzi",
          "qty": 20
        }
      ],
      "note": "JX3BOX 当前版本配方",
      "verified": true,
      "origin": "JX3BOX 技艺助手 · 2026-11-18",
      "custom": false
    },
    {
      "id": "r_g_sn_zisu",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·紫苏",
      "level": 45,
      "tier": 4,
      "energy": 45,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30842",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30845",
          "qty": 1,
          "chance": 0.02
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_sn_huanghuacai",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·黄花菜",
      "level": 50,
      "tier": 4,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30844",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30845",
          "qty": 1,
          "chance": 0.02
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_sn_yuxingcao",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·鱼腥草",
      "level": 50,
      "tier": 4,
      "energy": 50,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30843",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30845",
          "qty": 1,
          "chance": 0.02
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_sn_chongcao",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·虫草",
      "level": 50,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30836",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30845",
          "qty": 1,
          "chance": 0.02
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_sn_gancao",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·甘草",
      "level": 10,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "gancao",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "lushui",
          "qty": 1,
          "chance": 0.2
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_sn_shaoyao",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·芍药",
      "level": 15,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "shaoyao",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "lushui",
          "qty": 1,
          "chance": 0.2
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_sn_shanhu",
      "kind": "gather",
      "skillId": "shennong",
      "name": "神农·珊瑚",
      "level": 1,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "shanhu",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "lushui",
          "qty": 1,
          "chance": 0.2
        },
        {
          "item": "m_m_5_30845",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_huishi",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·辉石",
      "level": 50,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_tiekuang",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·铁矿",
      "level": 20,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "tiekuang",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 0.01
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.005
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_tongkuang",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·铜矿",
      "level": 20,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30674",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 0.01
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.005
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_xikuang",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·锡矿",
      "level": 30,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30675",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 0.01
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.005
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_qianxinkuang",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·铅锌矿",
      "level": 35,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30676",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 0.01
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.005
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_jinsha",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·金沙",
      "level": 40,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "g_5_30681",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 0.01
        },
        {
          "item": "m_m_5_30856",
          "qty": 1,
          "chance": 0.005
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_cj_qingshi",
      "kind": "gather",
      "skillId": "caijin",
      "name": "采金·青石",
      "level": 25,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "g_5_30680",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30850",
          "qty": 1,
          "chance": 0.01
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_pd_heishanyang",
      "kind": "gather",
      "skillId": "paoding",
      "name": "庖丁·黑山羊",
      "level": 50,
      "tier": 2,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30874",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30875",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30873",
          "qty": 1,
          "chance": 1
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_pd_shanye",
      "kind": "gather",
      "skillId": "paoding",
      "name": "庖丁·山野野兽",
      "level": 30,
      "tier": 2,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30824",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30826",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "m_m_5_30825",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "zasui",
          "qty": 1,
          "chance": 1
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_g_pd_hexian",
      "kind": "gather",
      "skillId": "paoding",
      "name": "庖丁·河鲜",
      "level": 20,
      "tier": 2,
      "energy": 40,
      "fee": 0,
      "outputs": [
        {
          "item": "m_m_5_30827",
          "qty": 1,
          "chance": 1
        },
        {
          "item": "zasui",
          "qty": 1,
          "chance": 1
        }
      ],
      "materials": [],
      "note": "等级/精力按当前采集材料；稀有掉率为示例，产值按掉率折算",
      "verified": true,
      "origin": "JX3BOX 物品百科 · 采集产物 / 掉率为示例",
      "custom": false
    },
    {
      "id": "r_shennong_baimaigen",
      "name": "神农·百脉根",
      "skillId": "shennong",
      "kind": "gather",
      "level": 1,
      "tier": 1,
      "energy": 40,
      "fee": 0,
      "materials": [],
      "outputs": [
        {
          "item": "g_ma_baimaigen",
          "qty": 1,
          "chance": 1
        }
      ],
      "verified": true,
      "note": "马草"
    },
    {
      "id": "r_shennong_zihuamuxu",
      "name": "神农·紫花苜蓿",
      "skillId": "shennong",
      "kind": "gather",
      "level": 1,
      "tier": 2,
      "energy": 40,
      "fee": 0,
      "materials": [],
      "outputs": [
        {
          "item": "g_ma_zihuamuxu",
          "qty": 1,
          "chance": 1
        }
      ],
      "verified": true,
      "note": "马草"
    },
    {
      "id": "r_shennong_tianxiangcao",
      "name": "神农·甜象草",
      "skillId": "shennong",
      "kind": "gather",
      "level": 1,
      "tier": 3,
      "energy": 40,
      "fee": 0,
      "materials": [],
      "outputs": [
        {
          "item": "g_ma_tianxiangcao",
          "qty": 1,
          "chance": 1
        }
      ],
      "verified": true,
      "note": "马草"
    },
    {
      "id": "r_shennong_huangzhucao",
      "name": "神农·皇竹草",
      "skillId": "shennong",
      "kind": "gather",
      "level": 1,
      "tier": 4,
      "energy": 40,
      "fee": 0,
      "materials": [],
      "outputs": [
        {
          "item": "g_ma_huangzhucao",
          "qty": 1,
          "chance": 1
        }
      ],
      "verified": true,
      "note": "马草"
    }
  ],
  "servers": [
    {
      "id": "s_mengjiangnan",
      "name": "梦江南",
      "region": "电信一区"
    },
    {
      "id": "s_pozhenzi",
      "name": "破阵子",
      "region": "双线一区"
    },
    {
      "id": "s_dielianhua",
      "name": "蝶恋花",
      "region": "双线一区"
    },
    {
      "id": "s_jiandan",
      "name": "剑胆琴心",
      "region": "双线一区"
    },
    {
      "id": "s_youyuelun",
      "name": "幽月轮",
      "region": "双线一区"
    },
    {
      "id": "s_longzheng",
      "name": "龙争虎斗",
      "region": "双线二区"
    },
    {
      "id": "s_changancheng",
      "name": "长安城",
      "region": "双线二区"
    },
    {
      "id": "s_douzhuang",
      "name": "斗转星移",
      "region": "电信一区"
    },
    {
      "id": "s_qiankun",
      "name": "乾坤一掷",
      "region": "电信一区"
    },
    {
      "id": "s_weiwo",
      "name": "唯我独尊",
      "region": "电信一区"
    },
    {
      "id": "s_juedai",
      "name": "绝代天骄",
      "region": "电信五区"
    },
    {
      "id": "s_tianeping",
      "name": "天鹅坪",
      "region": "电信五区"
    },
    {
      "id": "s_feilong",
      "name": "飞龙在天",
      "region": "双线二区"
    },
    {
      "id": "s_jiutian",
      "name": "九天",
      "region": "电信新区"
    },
    {
      "id": "s_meijianxue",
      "name": "眉间雪",
      "region": "电信五区"
    },
    {
      "id": "s_shanhai",
      "name": "山海相逢",
      "region": "电信五区"
    },
    {
      "id": "s_aoxue",
      "name": "傲血戰意",
      "region": "双线三区"
    }
  ],
  "serverPrices": {
    "s_mengjiangnan": {
      "fengwangjiang": 179.3,
      "shoupijiao": 50.1,
      "qicaixian": 134.08,
      "bairanxian": 3.69,
      "fengyu_yi": 2134.92,
      "m_m_5_30852": 15.24,
      "m_m_5_30853": 99.95,
      "m_m_5_30828": 6,
      "m_m_5_89165": 10.64,
      "m_m_5_32000": 0.63,
      "guajian_bei": 54.3,
      "baihua_bu": 72.4,
      "guajian_yao": 78.48,
      "shuran_bu": 65.7,
      "shuran_bag": 18.32,
      "m_m_5_10173": 30.62,
      "wuseshi": 80,
      "m_m_5_30856": 20.33,
      "m_m_5_30855": 161.68,
      "geyin_zhang": 152.85,
      "m_m_5_89298": 31.59,
      "m_m_5_30679": 15.13,
      "m_m_5_32004": 3.58,
      "m_m_5_30847": 10.87,
      "m_m_5_30846": 1.41,
      "yinsi_duan": 129,
      "m_m_5_32003": 0.65,
      "m_m_5_30848": 19.88,
      "m_m_5_32002": 0.66,
      "m_m_5_30850": 112.65,
      "m_m_5_30845": 155.1,
      "m_m_5_31397": 1,
      "m_m_5_89433": 5987.25,
      "m_m_5_89435": 5888,
      "m_m_5_31253": 530.22,
      "m_m_5_30844": 0.38,
      "m_m_5_35718": 16.94,
      "m_m_5_35719": 32.18,
      "m_m_5_30873": 33.45,
      "m_m_5_90205": 40,
      "m_m_8_614": 395.98,
      "shanshui_juan": 200,
      "m_m_5_3819": 200,
      "m_m_5_3779": 9.99,
      "m_m_8_36148": 749,
      "m_m_8_19": 0.01,
      "m_m_5_89474": 1666,
      "m_m_5_3820": 5.3,
      "m_m_5_30827": 1.29,
      "m_m_5_89970": 177,
      "m_m_5_32014": 232,
      "m_m_5_31985": 0.66,
      "lucai": 17.99,
      "m_m_5_1831": 14.57,
      "m_m_5_31973": 0.65,
      "m_m_5_30849": 6,
      "m_m_5_71293": 40,
      "m_m_5_30826": 0.59,
      "m_m_5_30825": 0.03,
      "m_m_5_89171": 10.64,
      "m_m_5_31974": 0.59,
      "m_m_5_31968": 3.55,
      "m_m_5_71292": 43.92,
      "m_m_5_30824": 0.5,
      "m_m_5_71281": 22.4,
      "m_m_5_30823": 0.8,
      "m_m_5_31969": 0.65,
      "m_m_5_71277": 56.5,
      "m_m_5_89315": 1375.21,
      "m_m_5_89969": 119,
      "m_m_5_31976": 0.66,
      "m_m_5_89303": 3379.83,
      "m_m_5_89971": 179.88,
      "lushui": 12.13,
      "m_m_5_30875": 1.37,
      "m_m_5_30829": 3.61,
      "m_m_5_30843": 0.72,
      "m_m_5_30874": 34,
      "m_m_5_30842": 1.05,
      "m_m_5_5270": 0.99,
      "m_m_5_31970": 0.65,
      "m_m_5_5269": 0.09,
      "m_m_5_31977": 0.66,
      "m_m_5_31013": 158.33,
      "gancao": 1.98,
      "m_m_5_31012": 310,
      "m_m_5_89172": 22.39,
      "m_m_5_89304": 3799.72,
      "m_m_5_26057": 1799,
      "m_m_5_26231": 2.91,
      "m_m_5_89352": 627.88,
      "m_m_5_89350": 500,
      "m_m_5_71269": 112,
      "m_m_5_89346": 673.64,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 169.66,
      "m_m_5_71285": 80.04,
      "jieyuan_dan": 40.18,
      "m_m_5_30836": 0.63,
      "m_m_5_30832": 0.99,
      "m_m_5_30833": 1.28,
      "m_m_5_31997": 3.55,
      "m_m_5_89324": 94.87,
      "m_m_5_30831": 0.82,
      "m_m_5_89973": 149,
      "m_m_5_31996": 3.67,
      "m_m_5_71241": 15.09,
      "m_m_5_71240": 55.27,
      "m_m_5_31995": 0.66,
      "m_m_5_71266": 66.01,
      "m_m_5_30838": 2.21,
      "shanhu": 3,
      "m_m_5_6646": 3.56,
      "m_m_5_30835": 1.86,
      "m_m_5_89974": 87,
      "m_m_5_6648": 2.99,
      "m_m_5_71267": 68.43,
      "m_m_5_89168": 22.39,
      "yaoyin": 144.85,
      "m_m_5_89322": 660,
      "shaoyao": 1.63,
      "m_m_5_90206": 33.59,
      "m_m_5_31102": 0.04,
      "m_m_5_30834": 1.78,
      "m_m_5_31998": 3.97,
      "m_m_5_89328": 790.87,
      "m_m_5_89340": 119.03,
      "m_m_5_89325": 726.85,
      "m_m_5_71258": 74.71,
      "m_m_5_31999": 3.58,
      "m_m_5_89327": 83.83,
      "m_m_5_89966": 105.08,
      "m_m_5_10176": 2.4,
      "m_m_5_31991": 3.8,
      "m_m_5_89377": 490,
      "m_m_5_89968": 70.2,
      "m_m_5_31993": 0.88,
      "m_m_5_89376": 149.37,
      "m_m_5_89965": 108.26,
      "m_m_5_31992": 3.83,
      "m_m_5_89375": 222.97,
      "m_m_5_89963": 70.26,
      "m_m_5_89169": 10.63,
      "m_m_5_71188": 741.82,
      "m_m_5_31994": 0.66,
      "m_m_5_89962": 106,
      "m_m_5_31139": 3189.98,
      "m_m_5_89964": 55,
      "m_m_5_10027": 54.88,
      "m_m_5_89961": 99.97,
      "tiekuang": 3,
      "m_m_5_30676": 2.65,
      "m_m_5_30678": 1.59,
      "m_m_5_30674": 2.48,
      "m_m_5_30675": 3.47,
      "m_m_5_89967": 65.84,
      "m_m_5_89367": 950.59,
      "m_m_5_6246": 0.5,
      "m_m_5_6249": 3.26,
      "m_m_5_32787": 99.86,
      "m_m_8_25762": 5.2,
      "m_m_5_30841": 5.55,
      "m_m_5_35708": 6.48,
      "m_m_8_632": 270.78,
      "m_m_8_634": 305.19,
      "m_m_8_636": 324,
      "m_m_5_6066": 0.01,
      "muban": 22.88,
      "muliao": 3.2,
      "m_m_5_35703": 3.57,
      "qiwuling": 32.99,
      "m_m_5_35716": 16.93,
      "m_m_5_35702": 0.68,
      "m_m_5_35715": 14.55,
      "zhuzi": 2.04,
      "m_m_5_35567": 2,
      "m_m_5_35704": 0.64,
      "m_m_5_35701": 3.56,
      "m_m_5_35713": 28.21,
      "m_m_5_35705": 3.55,
      "m_m_10_1778": 1267.83,
      "m_m_10_948": 310.17,
      "m_m_5_89260": 34850,
      "m_m_10_1779": 600.82,
      "m_m_10_1880": 1568.07,
      "m_m_10_2034": 1430.11,
      "m_m_10_93": 63,
      "m_m_10_1882": 1459,
      "m_m_5_35717": 2.79,
      "m_m_10_2037": 1460.83,
      "m_m_10_164": 130,
      "m_m_5_52337": 1587.77,
      "m_m_5_40232": 2797,
      "m_m_5_35772": 1911,
      "m_m_5_87917": 270,
      "m_m_5_87881": 8599,
      "zasui": 0.51,
      "g_5_30681": 1.28,
      "g_5_30680": 0.99
    },
    "s_pozhenzi": {
      "fengwangjiang": 164.47,
      "shoupijiao": 37.63,
      "qicaixian": 180.97,
      "bairanxian": 2.85,
      "fengyu_yi": 1029.9,
      "m_m_5_30852": 16.37,
      "m_m_5_30853": 81.04,
      "m_m_5_30828": 6.7,
      "m_m_5_32000": 1.1,
      "guajian_bei": 57.64,
      "baihua_bu": 90.31,
      "guajian_yao": 94.45,
      "shuran_bu": 130,
      "shuran_bag": 88,
      "jinfeng_bag": 7000,
      "wuseshi": 180.51,
      "m_m_5_30856": 20.07,
      "m_m_5_30855": 167.41,
      "geyin_zhang": 100,
      "m_m_5_89298": 27.91,
      "m_m_5_30679": 15.13,
      "m_m_5_30847": 8.65,
      "m_m_5_30846": 1.49,
      "yinsi_duan": 176.88,
      "m_m_5_30848": 29.96,
      "m_m_5_30850": 127.69,
      "m_m_5_30845": 132.6,
      "m_m_5_89435": 9999.05,
      "m_m_5_31253": 55.55,
      "m_m_5_30844": 0.77,
      "m_m_5_30873": 25.79,
      "m_m_5_90205": 20,
      "m_m_8_614": 66.58,
      "shanshui_juan": 108,
      "m_m_5_3779": 3,
      "m_m_8_36148": 1078,
      "m_m_5_3820": 30.88,
      "m_m_5_30827": 1,
      "m_m_5_89970": 162.86,
      "m_m_5_32014": 300.84,
      "m_m_5_31985": 3.64,
      "lucai": 17.06,
      "m_m_5_1831": 12,
      "m_m_5_31973": 0.59,
      "m_m_5_30849": 6,
      "m_m_5_71293": 39.8,
      "m_m_5_30826": 1.4,
      "m_m_5_30825": 0.01,
      "m_m_5_31968": 5.56,
      "m_m_5_71292": 45.16,
      "m_m_5_30824": 0.21,
      "m_m_5_30823": 1.8,
      "m_m_5_71277": 30,
      "m_m_5_89315": 1480.1,
      "m_m_5_89969": 134.82,
      "m_m_5_89303": 2990.63,
      "m_m_5_89971": 155.08,
      "lushui": 13.38,
      "m_m_5_30875": 1.54,
      "m_m_5_30843": 0.91,
      "m_m_5_30874": 25.61,
      "m_m_5_30842": 0.87,
      "m_m_5_5270": 0.89,
      "m_m_5_5269": 0.04,
      "m_m_5_31013": 138.98,
      "gancao": 2.03,
      "m_m_5_31012": 249.99,
      "m_m_5_89304": 4583.34,
      "m_m_5_26231": 1,
      "m_m_5_89352": 733.76,
      "m_m_5_89350": 483.3,
      "m_m_5_71269": 137.68,
      "m_m_5_89346": 599.83,
      "m_m_5_89348": 195.49,
      "m_m_5_71285": 80.82,
      "jieyuan_dan": 190.92,
      "m_m_5_30836": 1.3,
      "m_m_5_30832": 2.29,
      "m_m_5_30833": 1.88,
      "m_m_5_89324": 120,
      "m_m_5_30831": 1.14,
      "m_m_5_89973": 149.12,
      "m_m_5_71241": 88.75,
      "m_m_5_71240": 97.92,
      "m_m_5_71266": 40.57,
      "m_m_5_30838": 1.6,
      "shanhu": 4.67,
      "m_m_5_6646": 7.33,
      "m_m_5_30835": 3.19,
      "m_m_5_89974": 118.88,
      "m_m_5_71267": 45.93,
      "m_m_5_89168": 20,
      "yaoyin": 132.98,
      "m_m_5_89322": 600,
      "shaoyao": 2.21,
      "m_m_5_30834": 2.34,
      "m_m_5_89332": 937.61,
      "m_m_5_89340": 82,
      "m_m_5_89325": 670.08,
      "m_m_5_71258": 110.08,
      "m_m_5_89327": 80.35,
      "m_m_5_89966": 149.88,
      "m_m_5_31991": 0.91,
      "m_m_5_89377": 166,
      "m_m_5_89968": 108,
      "m_m_5_89376": 250.86,
      "m_m_5_89965": 125.56,
      "m_m_5_89963": 64,
      "m_m_5_71192": 20.57,
      "m_m_5_89962": 147.46,
      "m_m_5_31139": 2999.99,
      "m_m_5_89964": 78.9,
      "m_m_5_10027": 69.49,
      "m_m_5_89961": 140.64,
      "tiekuang": 2.99,
      "m_m_5_30676": 2.07,
      "m_m_5_30678": 1.85,
      "m_m_5_30674": 1.99,
      "m_m_5_30675": 2.2,
      "m_m_5_89967": 120.99,
      "m_m_5_6246": 0.18,
      "m_m_5_32787": 42.9,
      "m_m_8_25762": 3.55,
      "m_m_5_30841": 3,
      "m_m_8_636": 1666,
      "m_m_5_6072": 0.66,
      "m_m_5_6068": 1.08,
      "muban": 24.01,
      "muliao": 2.69,
      "m_m_5_35707": 6.95,
      "qiwuling": 22.75,
      "m_m_5_35716": 19.65,
      "m_m_5_35715": 13.33,
      "zhuzi": 2.1,
      "m_m_5_35567": 1.93,
      "m_m_5_35714": 60.5,
      "m_m_5_35701": 2.09,
      "m_m_5_35713": 18.1,
      "m_m_5_35705": 1.64,
      "m_m_5_35717": 1.29,
      "m_m_5_52337": 1665.89,
      "m_m_5_35772": 1210.15,
      "m_m_5_87917": 245.96,
      "m_m_5_87881": 9995,
      "zasui": 0.58,
      "g_5_30681": 1.64,
      "g_5_30680": 0.98
    },
    "s_dielianhua": {
      "fengwangjiang": 166.73,
      "shoupijiao": 48.99,
      "qicaixian": 150.67,
      "fengyu_yi": 2171.14,
      "m_m_5_30852": 16.88,
      "m_m_5_30853": 78,
      "m_m_5_30828": 4.17,
      "m_m_5_89165": 10.64,
      "m_m_5_32000": 0.66,
      "guajian_bei": 54.38,
      "baihua_bu": 88.29,
      "guajian_yao": 89.16,
      "shuran_bu": 115,
      "shuran_bag": 50.14,
      "wuseshi": 158.69,
      "m_m_5_30856": 16.61,
      "m_m_5_30855": 300.82,
      "geyin_zhang": 168.35,
      "m_m_5_89298": 23.13,
      "m_m_5_30679": 15,
      "m_m_5_30847": 8.55,
      "m_m_5_30846": 1.56,
      "yinsi_duan": 142.38,
      "m_m_5_32003": 0.7,
      "m_m_5_30848": 22.72,
      "m_m_5_30850": 100.06,
      "m_m_5_30845": 132.73,
      "m_m_5_31253": 243.94,
      "m_m_5_30844": 0.49,
      "m_m_5_30873": 18.32,
      "m_m_5_90205": 5,
      "shanshui_juan": 200.06,
      "m_m_5_3779": 8.65,
      "m_m_8_36148": 790.02,
      "m_m_5_3820": 1,
      "m_m_5_30827": 1.09,
      "m_m_5_89970": 199.8,
      "m_m_5_31978": 2.67,
      "m_m_5_31985": 0.67,
      "lucai": 18.06,
      "m_m_5_1831": 12,
      "m_m_5_31973": 0.5,
      "m_m_5_30849": 5.93,
      "m_m_5_71293": 46.72,
      "m_m_5_30826": 0.96,
      "m_m_5_30825": 0.2,
      "m_m_5_89171": 10.63,
      "m_m_5_31968": 0.65,
      "m_m_5_71292": 25.07,
      "m_m_5_30824": 0.59,
      "m_m_5_71281": 12.99,
      "m_m_5_30823": 1.24,
      "m_m_5_31969": 0.67,
      "m_m_5_71277": 32.49,
      "m_m_5_89315": 1477.87,
      "m_m_5_89969": 141.14,
      "m_m_5_31976": 0.64,
      "m_m_5_89303": 4209.7,
      "m_m_5_89971": 178.38,
      "lushui": 13.13,
      "m_m_5_30875": 3.57,
      "m_m_5_30829": 0.66,
      "m_m_5_30843": 0.66,
      "m_m_5_30874": 27,
      "m_m_5_30842": 0.43,
      "m_m_5_5270": 1,
      "m_m_5_5269": 0.1,
      "m_m_5_31977": 0.66,
      "m_m_5_31013": 175.78,
      "gancao": 2.83,
      "m_m_5_31012": 275.99,
      "m_m_5_89172": 22.39,
      "m_m_5_26057": 3000,
      "m_m_5_89352": 695.7,
      "m_m_5_89350": 698.3,
      "m_m_5_71269": 129.84,
      "m_m_5_89346": 664.51,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 300,
      "m_m_5_71285": 125.07,
      "jieyuan_dan": 202.12,
      "m_m_5_30836": 2.64,
      "m_m_5_30832": 1.6,
      "m_m_5_30833": 1.1,
      "m_m_5_89324": 149.3,
      "m_m_5_30831": 0.8,
      "m_m_5_89973": 160.53,
      "m_m_5_31996": 0.67,
      "m_m_5_71240": 28.32,
      "m_m_5_31995": 0.68,
      "m_m_5_71266": 30.04,
      "m_m_5_30838": 1.17,
      "shanhu": 2.09,
      "m_m_5_30835": 1.49,
      "m_m_5_89974": 123.16,
      "m_m_5_71267": 27.14,
      "m_m_5_89168": 22.39,
      "yaoyin": 192.78,
      "m_m_5_31100": 59.22,
      "shaoyao": 1.5,
      "m_m_5_30834": 3,
      "m_m_5_89328": 800.15,
      "m_m_5_89340": 113,
      "m_m_5_89325": 719.09,
      "m_m_5_71258": 87.71,
      "m_m_5_89327": 99.45,
      "m_m_5_89966": 95.58,
      "m_m_5_31991": 0.67,
      "m_m_5_89968": 134.5,
      "m_m_5_31993": 0.7,
      "m_m_5_89376": 297.3,
      "m_m_5_89965": 141.8,
      "m_m_5_31992": 0.67,
      "m_m_5_89963": 134.5,
      "m_m_5_71192": 26.48,
      "m_m_5_71188": 1152.93,
      "m_m_5_89962": 168.54,
      "m_m_5_31139": 2999.99,
      "m_m_5_89964": 99.07,
      "m_m_5_10027": 54.28,
      "m_m_5_89961": 174.92,
      "tiekuang": 2.34,
      "m_m_5_30676": 1.73,
      "m_m_5_30678": 2.5,
      "m_m_5_30674": 1.99,
      "m_m_5_30675": 2.65,
      "m_m_5_89967": 213.5,
      "m_m_5_6246": 0.15,
      "m_m_5_6249": 0.48,
      "m_m_5_32787": 25,
      "m_m_5_30841": 6.93,
      "m_m_5_35708": 6.49,
      "muban": 30.28,
      "muliao": 3.8,
      "m_m_5_35707": 6.49,
      "qiwuling": 21.22,
      "m_m_5_35716": 10.18,
      "m_m_5_35715": 12.73,
      "zhuzi": 2.74,
      "m_m_5_35567": 1.6,
      "m_m_5_35714": 89.11,
      "m_m_5_35701": 0.66,
      "m_m_5_35713": 26.69,
      "m_m_10_93": 60,
      "m_m_5_35717": 2.2,
      "m_m_10_164": 299.99,
      "m_m_5_52337": 1099.11,
      "m_m_5_35772": 1098.82,
      "m_m_5_87917": 275.19,
      "zasui": 1.1,
      "g_5_30681": 1.18,
      "g_5_30680": 1.1
    },
    "s_jiandan": {
      "fengwangjiang": 172.51,
      "shoupijiao": 48.39,
      "qicaixian": 150.58,
      "bairanxian": 3.17,
      "fengyu_yi": 789.66,
      "m_m_5_30852": 13.02,
      "m_m_5_30853": 83,
      "m_m_5_30828": 8.97,
      "m_m_5_32000": 0.62,
      "guajian_bei": 54.37,
      "baihua_bu": 99.4,
      "guajian_yao": 99.58,
      "shuran_bu": 119.99,
      "shuran_bag": 69.97,
      "wuseshi": 156,
      "m_m_5_30856": 20.31,
      "m_m_5_30855": 150.25,
      "geyin_zhang": 237.55,
      "m_m_5_89298": 24.71,
      "m_m_5_30679": 15.63,
      "m_m_5_32004": 0.69,
      "m_m_5_30847": 6,
      "yinsi_duan": 160,
      "m_m_5_30848": 21.68,
      "m_m_5_32002": 0.68,
      "m_m_5_30850": 114.52,
      "m_m_5_30845": 139.85,
      "m_m_5_31397": 1,
      "m_m_5_30844": 0.37,
      "m_m_5_35719": 32.4,
      "m_m_5_30873": 31,
      "m_m_5_90205": 188.8,
      "shanshui_juan": 150,
      "m_m_5_3779": 5,
      "m_m_8_36148": 1490.88,
      "m_m_5_30827": 0.97,
      "m_m_5_89970": 294.83,
      "m_m_5_32014": 127.35,
      "m_m_5_31978": 0.66,
      "m_m_5_31985": 0.69,
      "lucai": 16.99,
      "m_m_5_1831": 17,
      "m_m_5_30849": 6,
      "m_m_5_71293": 45.52,
      "m_m_5_30826": 0.29,
      "m_m_5_30825": 0.01,
      "m_m_5_89171": 10.63,
      "m_m_5_31974": 0.64,
      "m_m_5_31968": 0.66,
      "m_m_5_30824": 0.97,
      "m_m_5_71281": 13.58,
      "m_m_5_30823": 3.25,
      "m_m_5_31969": 0.66,
      "m_m_5_71277": 55.13,
      "m_m_5_89315": 1459.13,
      "m_m_5_89969": 124.65,
      "m_m_5_31976": 0.69,
      "m_m_5_89971": 159.48,
      "lushui": 12.19,
      "m_m_5_30875": 1.37,
      "m_m_5_30843": 0.73,
      "m_m_5_30874": 45.63,
      "m_m_5_30842": 0.72,
      "m_m_5_5270": 2,
      "m_m_5_5269": 0.06,
      "m_m_5_31977": 0.68,
      "m_m_5_31013": 168.78,
      "gancao": 1.77,
      "m_m_5_31012": 264.8,
      "m_m_5_89304": 4847,
      "m_m_5_89352": 744.14,
      "m_m_5_89350": 878.67,
      "m_m_5_71269": 101.5,
      "m_m_5_89346": 800.01,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 180,
      "m_m_5_71285": 129.96,
      "jieyuan_dan": 153.01,
      "m_m_5_30836": 0.47,
      "m_m_5_30832": 1,
      "m_m_5_30833": 1.93,
      "m_m_5_89324": 160.1,
      "m_m_5_30831": 1.09,
      "m_m_5_89973": 210.28,
      "m_m_5_31996": 0.66,
      "m_m_5_71241": 25,
      "m_m_5_71240": 89.8,
      "m_m_5_71266": 22.11,
      "m_m_5_30838": 1.15,
      "shanhu": 2.37,
      "m_m_5_30835": 1.59,
      "m_m_5_89974": 90.18,
      "m_m_5_6648": 3.97,
      "m_m_5_71267": 35.7,
      "m_m_5_90029": 345.01,
      "m_m_5_89168": 21.89,
      "yaoyin": 160.97,
      "shaoyao": 1.5,
      "m_m_5_30834": 1.53,
      "m_m_5_89328": 1308.1,
      "m_m_5_89340": 129,
      "m_m_5_89325": 783.17,
      "m_m_5_71258": 68.79,
      "m_m_5_89327": 141.9,
      "m_m_5_89966": 127.8,
      "m_m_5_89968": 124.9,
      "m_m_5_89376": 100,
      "m_m_5_89965": 139,
      "m_m_5_89963": 92,
      "m_m_5_71192": 25.79,
      "m_m_5_89962": 111.97,
      "m_m_5_31139": 3487.99,
      "m_m_5_89964": 80,
      "m_m_5_10027": 53.9,
      "m_m_5_89961": 150.08,
      "tiekuang": 2.06,
      "m_m_5_30676": 1.68,
      "m_m_5_30678": 1.53,
      "m_m_5_30674": 2.29,
      "m_m_5_30675": 3.42,
      "m_m_5_89967": 115,
      "m_m_5_6246": 0.41,
      "m_m_5_6249": 0.43,
      "m_m_5_32787": 1,
      "m_m_5_30841": 3.16,
      "m_m_5_10172": 39.63,
      "m_m_5_35708": 6.48,
      "m_m_8_636": 251,
      "m_m_5_6072": 4.1,
      "m_m_5_6068": 0.35,
      "m_m_5_6066": 0.01,
      "muban": 26.34,
      "muliao": 2.56,
      "m_m_5_35707": 6.47,
      "qiwuling": 20.4,
      "m_m_5_35716": 10.31,
      "m_m_5_35715": 89.49,
      "zhuzi": 1.58,
      "m_m_5_35567": 1.12,
      "m_m_5_35714": 89.41,
      "m_m_5_35713": 89.49,
      "m_m_10_1779": 899.99,
      "m_m_5_35717": 1.73,
      "m_m_10_164": 110,
      "m_m_5_52337": 2811.95,
      "m_m_5_35772": 2497.87,
      "m_m_5_87917": 280.94,
      "m_m_5_87881": 7900,
      "zasui": 0.52,
      "g_5_30681": 0.99,
      "g_5_30680": 1
    },
    "s_youyuelun": {
      "fengwangjiang": 158.44,
      "shoupijiao": 34,
      "qicaixian": 144,
      "bairanxian": 2.89,
      "fengyu_yi": 831.41,
      "m_m_5_30852": 16.78,
      "m_m_5_30853": 83.82,
      "m_m_5_30828": 7.58,
      "m_m_5_89165": 10.64,
      "guajian_bei": 78.98,
      "baihua_bu": 89,
      "guajian_yao": 158.69,
      "shuran_bu": 118,
      "shuran_bag": 15.77,
      "jinfeng_bag": 10000,
      "wuseshi": 160,
      "m_m_5_30856": 18.32,
      "m_m_5_30855": 150.67,
      "geyin_zhang": 145,
      "m_m_5_89298": 29.15,
      "m_m_5_30679": 15.12,
      "m_m_5_30847": 8.57,
      "m_m_5_30846": 1.3,
      "yinsi_duan": 155.41,
      "m_m_5_30848": 24.3,
      "m_m_5_30850": 113.03,
      "m_m_5_30845": 126.85,
      "m_m_5_31397": 1.55,
      "m_m_5_89433": 12180.65,
      "m_m_5_31253": 200,
      "m_m_5_30844": 0.45,
      "m_m_5_30873": 19.88,
      "m_m_5_90205": 5.33,
      "m_m_8_614": 268.92,
      "m_m_5_3779": 3.57,
      "m_m_8_36148": 798.21,
      "m_m_5_30827": 1.2,
      "m_m_5_89970": 181.01,
      "m_m_5_31978": 0.66,
      "lucai": 17.12,
      "m_m_5_1831": 12.15,
      "m_m_5_31973": 0.58,
      "m_m_5_30849": 6,
      "m_m_5_30826": 0.2,
      "m_m_5_30825": 0.01,
      "m_m_5_89171": 10.64,
      "m_m_5_31974": 0.67,
      "m_m_5_71292": 70.65,
      "m_m_5_30824": 0.29,
      "m_m_5_30823": 1,
      "m_m_5_71277": 55.91,
      "m_m_5_89315": 1720.94,
      "m_m_5_89969": 128,
      "m_m_5_31976": 0.61,
      "m_m_5_89971": 164.9,
      "lushui": 10.49,
      "m_m_5_30875": 1.29,
      "m_m_5_30829": 1.25,
      "m_m_5_30843": 0.47,
      "m_m_5_30874": 38,
      "m_m_5_30842": 0.34,
      "m_m_5_5270": 1.16,
      "m_m_5_31970": 0.65,
      "m_m_5_5269": 0.03,
      "m_m_5_31013": 160.76,
      "gancao": 1.8,
      "m_m_5_31012": 282.68,
      "m_m_5_89172": 22.39,
      "m_m_5_89304": 3890.73,
      "m_m_5_26231": 1,
      "m_m_5_89352": 666.23,
      "m_m_5_89350": 666.16,
      "m_m_5_71269": 176.48,
      "m_m_5_89346": 705,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 237.95,
      "m_m_5_71285": 81.16,
      "jieyuan_dan": 41,
      "m_m_5_30836": 0.62,
      "m_m_5_30832": 1,
      "m_m_5_30833": 1.55,
      "m_m_5_89324": 135.51,
      "m_m_5_30831": 0.7,
      "m_m_5_89973": 170.37,
      "m_m_5_31996": 0.68,
      "m_m_5_71241": 88.64,
      "m_m_5_71240": 68.88,
      "m_m_5_31995": 0.68,
      "m_m_5_71266": 75,
      "m_m_5_30838": 1.18,
      "m_m_5_6646": 3,
      "m_m_5_30835": 1.65,
      "m_m_5_89974": 98.97,
      "m_m_5_6648": 3.9,
      "m_m_5_71267": 100.6,
      "m_m_5_89168": 21.79,
      "yaoyin": 141.96,
      "m_m_5_31100": 26.54,
      "shaoyao": 2,
      "m_m_5_31102": 0.1,
      "m_m_5_30834": 2.07,
      "m_m_5_31998": 0.68,
      "m_m_5_89328": 992.6,
      "m_m_5_89332": 1653.2,
      "m_m_5_89340": 123.78,
      "m_m_5_89325": 777.91,
      "m_m_5_71258": 103.23,
      "m_m_5_31999": 0.66,
      "m_m_5_89327": 100.11,
      "m_m_5_89966": 116.57,
      "m_m_5_89968": 128.3,
      "m_m_5_31993": 0.68,
      "m_m_5_89965": 135.8,
      "m_m_5_31992": 0.96,
      "m_m_5_89963": 95.54,
      "m_m_5_89370": 1000,
      "m_m_5_71192": 20.31,
      "m_m_5_89169": 11.69,
      "m_m_5_31994": 0.66,
      "m_m_5_89962": 119.98,
      "m_m_5_31139": 3500.5,
      "m_m_5_89964": 85,
      "m_m_5_10027": 51.34,
      "m_m_5_89961": 120.99,
      "tiekuang": 2.99,
      "m_m_5_30676": 2.26,
      "m_m_5_30678": 1.88,
      "m_m_5_30674": 2.93,
      "m_m_5_30675": 3.46,
      "m_m_5_89967": 128.11,
      "m_m_5_89367": 2991.98,
      "m_m_5_6246": 0.99,
      "m_m_5_6249": 0.48,
      "m_m_5_32787": 15,
      "m_m_5_30841": 4.72,
      "m_m_5_10172": 31.99,
      "m_m_5_35708": 6.49,
      "m_m_8_632": 2.29,
      "m_m_8_634": 499.06,
      "m_m_8_636": 888,
      "m_m_5_2578": 5.6,
      "m_m_5_6072": 0.99,
      "m_m_5_6068": 1,
      "m_m_5_6066": 0.01,
      "muban": 21.55,
      "muliao": 5,
      "m_m_5_35707": 6.42,
      "m_m_5_35703": 0.67,
      "qiwuling": 24.66,
      "m_m_5_35716": 8.16,
      "m_m_5_35715": 12,
      "zhuzi": 1.65,
      "m_m_5_35567": 2.25,
      "m_m_5_35714": 89.63,
      "m_m_5_35713": 15.54,
      "m_m_5_35705": 0.62,
      "m_m_10_1882": 1450,
      "m_m_5_35717": 9,
      "m_m_5_52337": 1750,
      "m_m_5_35772": 1798.25,
      "m_m_5_87917": 250.08,
      "m_m_5_87881": 7666.23,
      "zasui": 0.29,
      "g_5_30681": 1.08,
      "g_5_30680": 0.97
    },
    "s_longzheng": {
      "fengwangjiang": 153.3,
      "shoupijiao": 46.83,
      "qicaixian": 149,
      "bairanxian": 3.14,
      "fengyu_yi": 2139.86,
      "m_m_5_30852": 21.32,
      "m_m_5_30853": 82.47,
      "m_m_5_30828": 5.69,
      "guajian_bei": 65,
      "baihua_bu": 79.69,
      "guajian_yao": 102.93,
      "shuran_bu": 136.11,
      "shuran_bag": 31.42,
      "jinfeng_bag": 12000.82,
      "wuseshi": 151,
      "m_m_5_30856": 24.96,
      "m_m_5_30855": 150.12,
      "geyin_zhang": 209.48,
      "m_m_5_89298": 23.74,
      "m_m_5_30679": 15.03,
      "m_m_5_32004": 0.69,
      "m_m_5_30847": 8.85,
      "m_m_5_30846": 2,
      "yinsi_duan": 150.58,
      "m_m_5_32003": 0.7,
      "m_m_5_30848": 20.99,
      "m_m_5_32002": 0.66,
      "m_m_5_30850": 99.99,
      "m_m_5_30845": 138.26,
      "m_m_5_31397": 0.8,
      "m_m_5_89433": 5400.88,
      "m_m_5_89435": 5554,
      "m_m_5_31253": 400.32,
      "m_m_5_30844": 0.84,
      "m_m_5_30873": 32.2,
      "m_m_5_90205": 2,
      "shanshui_juan": 100,
      "m_m_8_36148": 1100.77,
      "m_m_5_89475": 3500,
      "m_m_5_89474": 2633,
      "m_m_5_30827": 1.19,
      "m_m_5_89970": 188.99,
      "m_m_5_32014": 229,
      "m_m_5_31978": 0.66,
      "m_m_5_31985": 0.66,
      "lucai": 17.29,
      "m_m_5_1831": 15.95,
      "m_m_5_31973": 0.68,
      "m_m_5_30849": 5.94,
      "m_m_5_71293": 40,
      "m_m_5_30826": 0.88,
      "m_m_5_89171": 10.63,
      "m_m_5_31974": 0.67,
      "m_m_5_31968": 0.5,
      "m_m_5_71292": 41.08,
      "m_m_5_30824": 0.58,
      "m_m_5_71281": 32.99,
      "m_m_5_30823": 0.58,
      "m_m_5_31969": 0.65,
      "m_m_5_71277": 50.17,
      "m_m_5_89315": 1449.6,
      "m_m_5_89969": 121.02,
      "m_m_5_31976": 0.67,
      "m_m_5_89971": 180.94,
      "lushui": 15.18,
      "m_m_5_30875": 1.6,
      "m_m_5_30829": 0.55,
      "m_m_5_30843": 1.52,
      "m_m_5_30874": 26.82,
      "m_m_5_30842": 1.77,
      "m_m_5_5270": 0.66,
      "m_m_5_31970": 0.67,
      "m_m_5_31977": 0.55,
      "m_m_5_31013": 163.97,
      "gancao": 2.4,
      "m_m_5_31012": 289.4,
      "m_m_5_90034": 7777,
      "m_m_5_89352": 606.25,
      "m_m_5_89350": 505.91,
      "m_m_5_71269": 146.9,
      "m_m_5_89346": 598.84,
      "m_m_5_89167": 10.64,
      "m_m_5_89348": 198.87,
      "m_m_5_71285": 125.1,
      "jieyuan_dan": 68,
      "m_m_5_30836": 1.45,
      "m_m_5_30832": 2.31,
      "m_m_5_30833": 1.99,
      "m_m_5_89324": 133.33,
      "m_m_5_30831": 3.99,
      "m_m_5_89973": 128.89,
      "m_m_5_31996": 0.66,
      "m_m_5_71240": 124.09,
      "m_m_5_31995": 0.67,
      "m_m_5_71266": 45.54,
      "m_m_5_30838": 2,
      "shanhu": 4.1,
      "m_m_5_6646": 1.5,
      "m_m_5_30835": 5.2,
      "m_m_5_89974": 65,
      "m_m_5_71267": 45.21,
      "m_m_5_90029": 688,
      "m_m_5_89168": 22.99,
      "yaoyin": 85,
      "m_m_5_31100": 16.22,
      "m_m_5_89322": 500,
      "shaoyao": 3.99,
      "m_m_5_90206": 266.91,
      "m_m_5_30834": 2.45,
      "m_m_5_31998": 0.68,
      "m_m_5_90035": 13000,
      "m_m_5_89328": 730.74,
      "m_m_5_89332": 2498.72,
      "m_m_5_89340": 139.99,
      "m_m_5_89325": 807.82,
      "m_m_5_71258": 97.24,
      "m_m_5_31999": 0.55,
      "m_m_5_89327": 87,
      "m_m_5_89966": 90.29,
      "m_m_5_10176": 3,
      "m_m_5_31991": 0.67,
      "m_m_5_89377": 190.12,
      "m_m_5_89968": 108.97,
      "m_m_5_89965": 108.78,
      "m_m_5_31992": 0.55,
      "m_m_5_89375": 999,
      "m_m_5_89963": 76.66,
      "m_m_5_89370": 1888,
      "m_m_5_89169": 10.67,
      "m_m_5_71188": 588.66,
      "m_m_5_31994": 0.68,
      "m_m_5_89962": 100.31,
      "m_m_5_31139": 3831.7,
      "m_m_5_89964": 137.46,
      "m_m_5_10027": 77.97,
      "m_m_5_89961": 60.5,
      "tiekuang": 2.5,
      "m_m_5_30676": 3.21,
      "m_m_5_30678": 2.24,
      "m_m_5_30674": 1.99,
      "m_m_5_30675": 2.95,
      "m_m_5_89967": 83.12,
      "m_m_5_89367": 1599.79,
      "m_m_5_6246": 0.49,
      "m_m_5_6249": 0.49,
      "m_m_5_32787": 17.33,
      "m_m_8_25762": 10.25,
      "m_m_5_30841": 3.75,
      "m_m_5_35708": 6.48,
      "m_m_8_636": 230,
      "m_m_5_90257": 175.67,
      "m_m_5_6072": 3,
      "muban": 27.64,
      "muliao": 3.75,
      "m_m_5_35707": 6.49,
      "m_m_5_35703": 0.65,
      "qiwuling": 45.96,
      "m_m_5_35716": 10.89,
      "m_m_5_35715": 19.99,
      "zhuzi": 2.42,
      "m_m_5_35567": 1.62,
      "m_m_5_35704": 0.68,
      "m_m_5_35714": 26.99,
      "m_m_5_35701": 0.59,
      "m_m_5_35713": 18.16,
      "m_m_5_35705": 0.66,
      "m_m_5_89260": 24800,
      "m_m_10_93": 48,
      "m_m_5_35717": 2.45,
      "m_m_10_2037": 1134,
      "m_m_5_52337": 1368,
      "m_m_5_35772": 4999.92,
      "m_m_5_87917": 349.26,
      "zasui": 0.81,
      "g_5_30681": 1.66,
      "g_5_30680": 1.27
    },
    "s_changancheng": {
      "fengwangjiang": 152.6,
      "shoupijiao": 43.77,
      "qicaixian": 148.99,
      "bairanxian": 3,
      "fengyu_yi": 2500.89,
      "m_m_5_30852": 27.7,
      "m_m_5_30853": 83.44,
      "m_m_5_30828": 12.72,
      "guajian_bei": 53.73,
      "baihua_bu": 80,
      "guajian_yao": 88.72,
      "shuran_bu": 146.85,
      "m_m_5_32001": 0.65,
      "shuran_bag": 23.16,
      "wuseshi": 160,
      "m_m_5_30856": 18.86,
      "m_m_5_30855": 280,
      "geyin_zhang": 100.08,
      "m_m_5_89298": 24.82,
      "m_m_5_30679": 15,
      "m_m_5_30847": 10.48,
      "m_m_5_30846": 9.52,
      "yinsi_duan": 154.98,
      "m_m_5_30848": 23.93,
      "m_m_5_30850": 110.81,
      "m_m_5_30845": 120.85,
      "m_m_5_31253": 200,
      "m_m_5_30844": 1.11,
      "m_m_5_30873": 19.04,
      "m_m_8_614": 449,
      "m_m_8_36148": 1207.2,
      "m_m_5_30827": 1.45,
      "m_m_5_89970": 207.9,
      "m_m_5_32014": 129.94,
      "m_m_5_31978": 0.64,
      "lucai": 18.1,
      "m_m_5_1831": 15.99,
      "m_m_5_31973": 0.65,
      "m_m_5_30849": 5.84,
      "m_m_5_71293": 26.54,
      "m_m_5_30826": 0.86,
      "m_m_5_30825": 0.01,
      "m_m_5_89171": 10.62,
      "m_m_5_31974": 0.67,
      "m_m_5_71292": 50,
      "m_m_5_30824": 0.54,
      "m_m_5_31967": 0.64,
      "m_m_5_71281": 20.36,
      "m_m_5_30823": 0.3,
      "m_m_5_89315": 1749.74,
      "m_m_5_89969": 145.74,
      "m_m_5_31976": 0.66,
      "m_m_5_89971": 170,
      "lushui": 10.52,
      "m_m_5_30875": 1,
      "m_m_5_30843": 1.21,
      "m_m_5_30874": 27.33,
      "m_m_5_30842": 0.89,
      "m_m_5_5270": 2.99,
      "m_m_5_31970": 0.65,
      "m_m_5_5269": 0.3,
      "m_m_5_31977": 0.64,
      "m_m_5_31013": 140.36,
      "gancao": 1.43,
      "m_m_5_31012": 450.83,
      "m_m_5_89304": 3497.5,
      "m_m_5_89352": 670.39,
      "m_m_5_71269": 137.7,
      "m_m_5_89346": 671.83,
      "m_m_5_89348": 279,
      "m_m_5_71285": 117.17,
      "jieyuan_dan": 18.2,
      "m_m_5_30836": 0.67,
      "m_m_5_30832": 2.03,
      "m_m_5_30833": 1.3,
      "m_m_5_89324": 77,
      "m_m_5_30831": 0.52,
      "m_m_5_89973": 191.79,
      "m_m_5_31996": 0.67,
      "m_m_5_71240": 62.98,
      "m_m_5_31995": 0.67,
      "m_m_5_71266": 35.72,
      "m_m_5_30838": 1.1,
      "m_m_5_6646": 0.67,
      "m_m_5_30835": 1.4,
      "m_m_5_89974": 135.72,
      "m_m_5_6648": 2.95,
      "m_m_5_71267": 30.25,
      "yaoyin": 164.79,
      "m_m_5_31100": 19.5,
      "shaoyao": 1.45,
      "m_m_5_30834": 1.61,
      "m_m_5_31998": 0.67,
      "m_m_5_89328": 636.46,
      "m_m_5_89340": 84.18,
      "m_m_5_89325": 935.9,
      "m_m_5_71258": 70,
      "m_m_5_89327": 78.98,
      "m_m_5_89966": 122,
      "m_m_5_31991": 0.65,
      "m_m_5_89968": 91.86,
      "m_m_5_31993": 0.67,
      "m_m_5_89376": 666.66,
      "m_m_5_89965": 98.84,
      "m_m_5_31992": 0.67,
      "m_m_5_89963": 55.15,
      "m_m_5_89169": 10.64,
      "m_m_5_89962": 119,
      "m_m_5_31139": 3499.66,
      "m_m_5_89964": 116.31,
      "m_m_5_10027": 66.02,
      "m_m_5_89961": 110.79,
      "tiekuang": 1.97,
      "m_m_5_30676": 2.29,
      "m_m_5_30678": 1.25,
      "m_m_5_30674": 1.99,
      "m_m_5_30675": 2.17,
      "m_m_5_89967": 95.55,
      "m_m_5_89367": 1999,
      "m_m_5_6246": 0.11,
      "m_m_5_6249": 0.67,
      "m_m_8_25762": 40.4,
      "m_m_5_30841": 3.67,
      "m_m_5_35708": 6.48,
      "m_m_8_636": 158,
      "muban": 27.49,
      "muliao": 3.7,
      "m_m_5_35707": 6.49,
      "m_m_5_35703": 0.66,
      "qiwuling": 21,
      "m_m_5_35716": 12.8,
      "m_m_5_35702": 0.64,
      "m_m_5_35715": 89.35,
      "zhuzi": 1.51,
      "m_m_5_35567": 1.19,
      "m_m_5_35704": 0.67,
      "m_m_5_35714": 16.2,
      "m_m_5_35701": 0.66,
      "m_m_5_35713": 12.96,
      "m_m_5_35717": 2.44,
      "m_m_5_52337": 1903.82,
      "m_m_5_35772": 1094.03,
      "m_m_5_87917": 337.61,
      "m_m_5_87881": 7500,
      "zasui": 0.45,
      "g_5_30681": 1.3,
      "g_5_30680": 1.11
    },
    "s_douzhuang": {
      "fengwangjiang": 159.2,
      "shoupijiao": 39.98,
      "qicaixian": 180,
      "bairanxian": 3.08,
      "m_m_5_30852": 16.81,
      "m_m_5_30853": 79.88,
      "m_m_5_30828": 6,
      "m_m_5_89165": 10.64,
      "m_m_5_32000": 0.61,
      "guajian_bei": 65.79,
      "baihua_bu": 80.99,
      "guajian_yao": 93,
      "shuran_bu": 99,
      "shuran_bag": 48.21,
      "wuseshi": 167.35,
      "m_m_5_30856": 16.9,
      "m_m_5_30855": 184.95,
      "geyin_zhang": 140.65,
      "m_m_5_89298": 31.92,
      "m_m_5_30679": 15,
      "m_m_5_30847": 24.32,
      "m_m_5_30846": 1.47,
      "yinsi_duan": 157.94,
      "m_m_5_32003": 0.62,
      "m_m_5_30848": 22,
      "m_m_5_30850": 101.34,
      "m_m_5_30845": 124.76,
      "m_m_5_31253": 357.43,
      "m_m_5_30873": 24.2,
      "m_m_5_90205": 30.15,
      "m_m_8_614": 300,
      "shanshui_juan": 89.03,
      "m_m_5_3779": 5.98,
      "m_m_8_36148": 971.04,
      "m_m_5_30827": 0.99,
      "m_m_5_89970": 200,
      "lucai": 16.6,
      "m_m_5_1831": 12.2,
      "m_m_5_31973": 0.66,
      "m_m_5_30849": 5.58,
      "m_m_5_71293": 39.25,
      "m_m_5_30826": 0.59,
      "m_m_5_89171": 10.63,
      "m_m_5_31974": 0.68,
      "m_m_5_31968": 0.68,
      "m_m_5_71292": 45.58,
      "m_m_5_30824": 0.32,
      "m_m_5_71281": 8.75,
      "m_m_5_30823": 0.3,
      "m_m_5_31969": 0.7,
      "m_m_5_71277": 39.71,
      "m_m_5_89315": 1649.82,
      "m_m_5_89969": 178.14,
      "m_m_5_89971": 182,
      "lushui": 10.07,
      "m_m_5_30875": 1.45,
      "m_m_5_30843": 0.79,
      "m_m_5_30874": 37.01,
      "m_m_5_30842": 0.75,
      "m_m_5_5270": 1.27,
      "m_m_5_5269": 0.02,
      "m_m_5_31013": 161.77,
      "gancao": 3.23,
      "m_m_5_31012": 282.07,
      "m_m_5_89172": 22.49,
      "m_m_5_89352": 648.76,
      "m_m_5_89350": 590.9,
      "m_m_5_71269": 93.61,
      "m_m_5_89346": 751.01,
      "m_m_5_89167": 10.64,
      "m_m_5_89348": 192,
      "m_m_5_71285": 82.46,
      "jieyuan_dan": 202.44,
      "m_m_5_30836": 1,
      "m_m_5_30832": 1,
      "m_m_5_30833": 1.15,
      "m_m_5_89324": 80.48,
      "m_m_5_30831": 0.95,
      "m_m_5_89973": 170.98,
      "m_m_5_31996": 0.68,
      "m_m_5_71241": 15,
      "m_m_5_71240": 77.41,
      "m_m_5_31995": 0.67,
      "m_m_5_71266": 48.17,
      "m_m_5_30838": 0.77,
      "shanhu": 3.6,
      "m_m_5_30835": 1.6,
      "m_m_5_89974": 94.66,
      "m_m_5_6648": 3.5,
      "m_m_5_71267": 92.16,
      "m_m_5_89168": 22.27,
      "yaoyin": 148.44,
      "m_m_5_31100": 30.24,
      "shaoyao": 1.19,
      "m_m_5_30834": 1.6,
      "m_m_5_31998": 2,
      "m_m_5_89328": 888.96,
      "m_m_5_89340": 134.89,
      "m_m_5_89325": 797.49,
      "m_m_5_71258": 90.35,
      "m_m_5_31999": 0.66,
      "m_m_5_89327": 76.82,
      "m_m_5_89966": 139.97,
      "m_m_5_31991": 0.68,
      "m_m_5_89968": 99.68,
      "m_m_5_89376": 282,
      "m_m_5_89965": 114.85,
      "m_m_5_31992": 0.67,
      "m_m_5_89963": 90.69,
      "m_m_5_89370": 800,
      "m_m_5_89169": 10.63,
      "m_m_5_31994": 0.69,
      "m_m_5_89962": 108,
      "m_m_5_31139": 3599.42,
      "m_m_5_89964": 96,
      "m_m_5_10027": 61.53,
      "m_m_5_89961": 129.4,
      "tiekuang": 2.77,
      "m_m_5_30676": 2.78,
      "m_m_5_30678": 1.62,
      "m_m_5_30674": 2.58,
      "m_m_5_89967": 109,
      "m_m_5_6246": 0.2,
      "m_m_5_6249": 0.54,
      "m_m_5_30841": 3.07,
      "m_m_8_636": 300.18,
      "m_m_5_2578": 5,
      "m_m_5_6072": 0.5,
      "m_m_5_6068": 1,
      "muban": 22.46,
      "muliao": 2.21,
      "qiwuling": 21.09,
      "m_m_5_35716": 16.85,
      "m_m_5_35715": 11.9,
      "zhuzi": 1.72,
      "m_m_5_35567": 1.65,
      "m_m_5_35704": 0.67,
      "m_m_5_35714": 26.43,
      "m_m_5_35701": 0.67,
      "m_m_5_35713": 26,
      "m_m_5_89260": 45000,
      "m_m_10_1779": 859.98,
      "m_m_5_35717": 2,
      "m_m_5_52337": 1396.01,
      "m_m_5_35772": 1693,
      "m_m_5_87917": 316.35,
      "m_m_5_87881": 7800.82,
      "zasui": 0.38,
      "g_5_30681": 1.97,
      "g_5_30680": 0.99
    },
    "s_qiankun": {
      "fengwangjiang": 162.93,
      "shoupijiao": 40.06,
      "qicaixian": 149.95,
      "bairanxian": 3.08,
      "fengyu_yi": 990.07,
      "m_m_5_30852": 18.83,
      "m_m_5_30853": 82.28,
      "m_m_5_30828": 5.59,
      "m_m_5_89165": 10.64,
      "guajian_bei": 54.04,
      "baihua_bu": 77.22,
      "guajian_yao": 78.54,
      "shuran_bu": 98.03,
      "m_m_5_32001": 0.67,
      "shuran_bag": 39,
      "m_m_5_10173": 31.77,
      "wuseshi": 169.9,
      "m_m_5_30856": 19.19,
      "m_m_5_30855": 151.45,
      "geyin_zhang": 145.61,
      "m_m_5_89298": 33.88,
      "m_m_5_30679": 15,
      "m_m_5_30847": 48.58,
      "m_m_5_30846": 1.75,
      "yinsi_duan": 144.95,
      "m_m_5_32003": 0.6,
      "m_m_5_30848": 22,
      "m_m_5_30850": 104.78,
      "m_m_5_30845": 155.09,
      "m_m_5_31397": 1,
      "m_m_5_89435": 7983.65,
      "m_m_5_30844": 0.45,
      "m_m_5_35718": 13.18,
      "m_m_5_35719": 32.48,
      "m_m_5_30873": 38.09,
      "m_m_8_614": 399.32,
      "shanshui_juan": 110.2,
      "m_m_5_3819": 100,
      "m_m_5_3779": 5.99,
      "m_m_8_36148": 1000.22,
      "m_m_5_3820": 1.89,
      "m_m_5_30827": 2.36,
      "m_m_5_89970": 169.99,
      "m_m_5_32014": 120,
      "m_m_5_31978": 0.67,
      "lucai": 16.95,
      "m_m_5_1831": 12.39,
      "m_m_5_31973": 0.6,
      "m_m_5_30849": 5.9,
      "m_m_5_71293": 45,
      "m_m_5_30826": 0.68,
      "m_m_5_30825": 0.02,
      "m_m_5_89171": 10.63,
      "m_m_5_31968": 0.52,
      "m_m_5_71292": 100,
      "m_m_5_30824": 0.4,
      "m_m_5_31967": 0.69,
      "m_m_5_71281": 31,
      "m_m_5_30823": 0.62,
      "m_m_5_71277": 35.39,
      "m_m_5_89315": 1388.27,
      "m_m_5_89969": 128.09,
      "m_m_5_31976": 0.61,
      "m_m_5_89971": 188.91,
      "lushui": 12.59,
      "m_m_5_30875": 2.64,
      "m_m_5_30843": 0.61,
      "m_m_5_30874": 26,
      "m_m_5_30842": 0.53,
      "m_m_5_5270": 0.99,
      "m_m_5_5269": 0.02,
      "m_m_5_31013": 170.2,
      "gancao": 2.48,
      "m_m_5_31012": 348.87,
      "m_m_5_89172": 19.09,
      "m_m_5_89304": 4199.52,
      "m_m_5_26231": 1.15,
      "m_m_5_89352": 689,
      "m_m_5_89350": 573.24,
      "m_m_5_71269": 135.59,
      "m_m_5_89346": 767.9,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 180,
      "m_m_5_71285": 99.62,
      "jieyuan_dan": 180.79,
      "m_m_5_30836": 1.34,
      "m_m_5_30832": 6.3,
      "m_m_5_30833": 1.77,
      "m_m_5_89324": 99.87,
      "m_m_5_30831": 1.27,
      "m_m_5_89973": 168,
      "m_m_5_71241": 70,
      "m_m_5_71240": 101.99,
      "m_m_5_31995": 0.64,
      "m_m_5_71266": 128,
      "m_m_5_30838": 0.91,
      "shanhu": 2.16,
      "m_m_5_6646": 1.33,
      "m_m_5_30835": 1.64,
      "m_m_5_89974": 103.7,
      "m_m_5_71267": 90,
      "m_m_5_89168": 22.38,
      "yaoyin": 161.4,
      "m_m_5_31100": 46.21,
      "m_m_5_89322": 800,
      "shaoyao": 2.31,
      "m_m_5_31102": 0.23,
      "m_m_5_30834": 2.6,
      "m_m_5_89328": 788.95,
      "m_m_5_89332": 887.56,
      "m_m_5_89340": 118,
      "m_m_5_89325": 726.39,
      "m_m_5_71258": 95.4,
      "m_m_5_89327": 88.88,
      "m_m_5_89966": 100,
      "m_m_5_31991": 0.66,
      "m_m_5_89377": 650,
      "m_m_5_89968": 121,
      "m_m_5_89376": 380,
      "m_m_5_89965": 110.64,
      "m_m_5_31992": 0.69,
      "m_m_5_89963": 90.05,
      "m_m_5_89169": 10.63,
      "m_m_5_71188": 235.8,
      "m_m_5_31994": 0.99,
      "m_m_5_89962": 90.62,
      "m_m_5_31139": 3497.45,
      "m_m_5_89964": 70,
      "m_m_5_10027": 79.96,
      "m_m_5_89961": 104.98,
      "tiekuang": 2.68,
      "m_m_5_30676": 2.27,
      "m_m_5_30678": 1.55,
      "m_m_5_30674": 2.4,
      "m_m_5_30675": 2.92,
      "m_m_5_89967": 94.84,
      "m_m_5_6246": 0.13,
      "m_m_5_30841": 3.62,
      "m_m_5_10172": 31.78,
      "m_m_5_35708": 6.49,
      "m_m_8_636": 349.14,
      "m_m_5_2578": 8.99,
      "m_m_5_6068": 1,
      "m_m_5_6066": 0.01,
      "muban": 25.8,
      "muliao": 4.84,
      "m_m_5_35703": 0.65,
      "qiwuling": 21.34,
      "m_m_5_35716": 15.03,
      "m_m_5_35715": 16.32,
      "zhuzi": 1.87,
      "m_m_5_35567": 1.77,
      "m_m_5_35714": 27,
      "m_m_5_35713": 17.43,
      "m_m_10_1778": 939.74,
      "m_m_10_93": 37.9,
      "m_m_5_35717": 2.27,
      "m_m_10_164": 90.99,
      "m_m_5_52337": 1799.6,
      "m_m_5_40232": 2422.97,
      "m_m_5_35772": 1998.99,
      "m_m_5_87917": 398.46,
      "m_m_5_87881": 9999.52,
      "zasui": 0.33,
      "g_5_30681": 1.27,
      "g_5_30680": 1.29
    },
    "s_weiwo": {
      "fengwangjiang": 166.38,
      "shoupijiao": 46.62,
      "qicaixian": 145.6,
      "bairanxian": 3,
      "fengyu_yi": 1547.06,
      "m_m_5_30852": 18,
      "m_m_5_30853": 89,
      "m_m_5_30828": 6,
      "m_m_5_89165": 10.62,
      "m_m_5_32000": 0.66,
      "guajian_bei": 59.45,
      "baihua_bu": 91.09,
      "guajian_yao": 91.45,
      "shuran_bu": 110.51,
      "shuran_bag": 19.31,
      "jinfeng_bag": 8000.01,
      "wuseshi": 150,
      "m_m_5_30856": 16.03,
      "m_m_5_30855": 157.9,
      "geyin_zhang": 190.58,
      "m_m_5_89298": 34.9,
      "m_m_5_30679": 17.39,
      "m_m_5_30847": 11,
      "m_m_5_30846": 1.38,
      "yinsi_duan": 139.88,
      "m_m_5_32003": 0.66,
      "m_m_5_30848": 21.48,
      "m_m_5_30850": 105.93,
      "m_m_5_30845": 143.61,
      "m_m_5_31397": 1.48,
      "m_m_5_89433": 5500,
      "m_m_5_89435": 4000,
      "m_m_5_31253": 300.85,
      "m_m_5_30844": 0.5,
      "m_m_5_35718": 15.99,
      "m_m_5_30873": 29.5,
      "m_m_5_90205": 23.07,
      "m_m_8_614": 1099.99,
      "shanshui_juan": 210.78,
      "m_m_5_3819": 80,
      "m_m_5_3779": 3.26,
      "m_m_8_36148": 1100.3,
      "m_m_5_3820": 30.14,
      "m_m_5_30827": 1.06,
      "m_m_5_89970": 176.91,
      "m_m_5_32014": 120.3,
      "m_m_5_31978": 0.6,
      "m_m_5_31985": 0.61,
      "lucai": 16.81,
      "m_m_5_1831": 15.97,
      "m_m_5_31973": 0.64,
      "m_m_5_30849": 5.91,
      "m_m_5_71293": 30.11,
      "m_m_5_30826": 0.68,
      "m_m_5_30825": 0.01,
      "m_m_5_89171": 10.63,
      "m_m_5_31974": 0.66,
      "m_m_5_31968": 0.4,
      "m_m_5_71292": 89.99,
      "m_m_5_30824": 0.16,
      "m_m_5_31967": 0.5,
      "m_m_5_71281": 22,
      "m_m_5_30823": 0.43,
      "m_m_5_31969": 0.64,
      "m_m_5_71277": 25,
      "m_m_5_89315": 1437.37,
      "m_m_5_89969": 133,
      "m_m_5_31976": 0.6,
      "m_m_5_89303": 3921.41,
      "m_m_5_89971": 183.36,
      "lushui": 11.01,
      "m_m_5_30875": 1.35,
      "m_m_5_30829": 0.66,
      "m_m_5_30843": 1.53,
      "m_m_5_30874": 32.06,
      "m_m_5_30842": 0.65,
      "m_m_5_5270": 1.47,
      "m_m_5_5269": 0.08,
      "m_m_5_31977": 0.64,
      "m_m_5_31013": 158.72,
      "gancao": 3.39,
      "m_m_5_31012": 304.42,
      "m_m_5_90034": 2888,
      "m_m_5_89304": 4598.24,
      "m_m_5_26057": 8000.5,
      "m_m_5_26231": 1.33,
      "m_m_5_89352": 518.88,
      "m_m_5_89350": 628.22,
      "m_m_5_71269": 114.98,
      "m_m_5_89346": 598.94,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 207.99,
      "m_m_5_71285": 80.11,
      "jieyuan_dan": 58.75,
      "m_m_5_30836": 3.02,
      "m_m_5_30832": 2.07,
      "m_m_5_30833": 2.03,
      "m_m_5_31997": 0.63,
      "m_m_5_89324": 90.9,
      "m_m_5_30831": 4.45,
      "m_m_5_89973": 149.99,
      "m_m_5_31996": 0.66,
      "m_m_5_71241": 99,
      "m_m_5_71240": 99.95,
      "m_m_5_71266": 96.99,
      "m_m_5_30838": 0.96,
      "shanhu": 3.5,
      "m_m_5_6646": 0.62,
      "m_m_5_30835": 2,
      "m_m_5_89974": 84.33,
      "m_m_5_6648": 2.98,
      "m_m_5_71267": 70.32,
      "m_m_5_90029": 980,
      "m_m_5_89168": 23.49,
      "yaoyin": 138.09,
      "m_m_5_31100": 59.05,
      "shaoyao": 4.7,
      "m_m_5_31102": 0.08,
      "m_m_5_30834": 1.95,
      "m_m_5_90035": 4780,
      "m_m_5_89328": 719.05,
      "m_m_5_89332": 1003.9,
      "m_m_5_89340": 98.53,
      "m_m_5_89325": 599.82,
      "m_m_5_71258": 80.21,
      "m_m_5_31999": 0.64,
      "m_m_5_89327": 85.46,
      "m_m_5_89966": 111.11,
      "m_m_5_10176": 3.4,
      "m_m_5_31991": 0.66,
      "m_m_5_89377": 488.01,
      "m_m_5_89968": 82.19,
      "m_m_5_31993": 0.89,
      "m_m_5_89376": 517,
      "m_m_5_89965": 90,
      "m_m_5_31992": 0.69,
      "m_m_5_89375": 450.12,
      "m_m_5_89963": 60,
      "m_m_5_89169": 10.62,
      "m_m_5_71188": 367.99,
      "m_m_5_31994": 0.66,
      "m_m_5_89962": 99,
      "m_m_5_31139": 3688.4,
      "m_m_5_89964": 76,
      "m_m_5_89961": 99.39,
      "tiekuang": 3.12,
      "m_m_5_30676": 2.18,
      "m_m_5_30678": 2.97,
      "m_m_5_30674": 2.99,
      "m_m_5_30675": 2.79,
      "m_m_5_89967": 66.66,
      "m_m_5_6246": 0.12,
      "m_m_5_6249": 0.21,
      "m_m_5_30841": 4.11,
      "m_m_5_10172": 29,
      "m_m_5_35708": 6.58,
      "m_m_8_632": 255.41,
      "m_m_8_634": 248.9,
      "m_m_8_636": 1599.99,
      "m_m_5_90353": 1200.16,
      "m_m_5_6072": 0.24,
      "m_m_5_6068": 0.21,
      "muban": 25.5,
      "muliao": 4.4,
      "m_m_5_35707": 6.05,
      "m_m_5_35703": 0.63,
      "qiwuling": 29.5,
      "m_m_5_35716": 7.27,
      "m_m_5_35715": 18.21,
      "zhuzi": 2.01,
      "m_m_5_35567": 2,
      "m_m_5_35704": 0.63,
      "m_m_5_35714": 45.26,
      "m_m_5_35701": 0.63,
      "m_m_5_35713": 39.03,
      "m_m_5_35705": 0.64,
      "m_m_10_948": 252.68,
      "m_m_5_89260": 23456,
      "m_m_10_93": 40,
      "m_m_10_1882": 1395.59,
      "m_m_5_35717": 2.05,
      "m_m_5_52337": 1399.7,
      "m_m_5_40232": 2778.05,
      "m_m_5_35772": 1768,
      "m_m_5_87917": 377.36,
      "m_m_5_87881": 9999.66,
      "zasui": 0.57,
      "g_5_30681": 1.32,
      "g_5_30680": 1.09
    },
    "s_juedai": {
      "fengwangjiang": 162.95,
      "shoupijiao": 42,
      "qicaixian": 154,
      "bairanxian": 3.2,
      "fengyu_yi": 2955.68,
      "m_m_5_30852": 16,
      "m_m_5_30853": 80.11,
      "m_m_5_30828": 7.01,
      "m_m_5_89165": 10.64,
      "guajian_bei": 77.93,
      "baihua_bu": 63.29,
      "guajian_yao": 90.9,
      "shuran_bu": 99.9,
      "shuran_bag": 24.14,
      "wuseshi": 144.78,
      "m_m_5_30856": 18.13,
      "m_m_5_30855": 175.7,
      "geyin_zhang": 395.37,
      "m_m_5_89298": 38.06,
      "m_m_5_30679": 18.08,
      "m_m_5_32004": 0.69,
      "m_m_5_30847": 8.2,
      "m_m_5_30846": 2.52,
      "yinsi_duan": 158.76,
      "m_m_5_30848": 20.88,
      "m_m_5_30850": 100,
      "m_m_5_30845": 144.51,
      "m_m_5_89433": 9506.77,
      "m_m_5_89435": 7990.81,
      "m_m_5_30844": 0.86,
      "m_m_5_30873": 25,
      "m_m_5_90205": 6.53,
      "m_m_8_614": 688.67,
      "m_m_5_3819": 100,
      "m_m_8_36148": 740,
      "m_m_5_89474": 3319.33,
      "m_m_5_3820": 10,
      "m_m_5_30827": 1.48,
      "m_m_5_89970": 167.43,
      "m_m_5_31978": 0.62,
      "m_m_5_31985": 0.6,
      "lucai": 16.5,
      "m_m_5_1831": 12.7,
      "m_m_5_30849": 6.69,
      "m_m_5_71293": 36.99,
      "m_m_5_30826": 0.33,
      "m_m_5_30825": 0.01,
      "m_m_5_89171": 10.63,
      "m_m_5_31974": 0.69,
      "m_m_5_31968": 0.48,
      "m_m_5_71292": 21.41,
      "m_m_5_30824": 0.31,
      "m_m_5_30823": 0.8,
      "m_m_5_31969": 0.67,
      "m_m_5_71277": 39.87,
      "m_m_5_89315": 1446.58,
      "m_m_5_89969": 146.69,
      "m_m_5_31976": 0.69,
      "m_m_5_89971": 168,
      "lushui": 12,
      "m_m_5_30875": 1.37,
      "m_m_5_30843": 0.78,
      "m_m_5_30874": 31.76,
      "m_m_5_30842": 0.94,
      "m_m_5_5270": 1,
      "m_m_5_31970": 0.59,
      "m_m_5_5269": 0.09,
      "m_m_5_31013": 157.59,
      "gancao": 2.53,
      "m_m_5_31012": 280.05,
      "m_m_5_89172": 22.4,
      "m_m_5_26057": 7777,
      "m_m_5_89352": 660.58,
      "m_m_5_89350": 538.9,
      "m_m_5_71269": 83.45,
      "m_m_5_89346": 610.79,
      "m_m_5_89167": 10.63,
      "m_m_5_89348": 211,
      "m_m_5_71285": 77.06,
      "jieyuan_dan": 64.49,
      "m_m_5_30836": 1.03,
      "m_m_5_30832": 0.99,
      "m_m_5_30833": 2.99,
      "m_m_5_89324": 99.66,
      "m_m_5_30831": 1.08,
      "m_m_5_89973": 168,
      "m_m_5_31996": 0.67,
      "m_m_5_71240": 43.83,
      "m_m_5_31995": 0.67,
      "m_m_5_71266": 44.13,
      "m_m_5_30838": 1,
      "shanhu": 2.4,
      "m_m_5_6646": 1.2,
      "m_m_5_30835": 1.5,
      "m_m_5_89974": 128.15,
      "m_m_5_6648": 3.88,
      "m_m_5_71267": 40.15,
      "m_m_5_89168": 22.39,
      "yaoyin": 156.87,
      "m_m_5_31100": 28.02,
      "shaoyao": 1.6,
      "m_m_5_90206": 100.9,
      "m_m_5_31102": 0.13,
      "m_m_5_30834": 1.72,
      "m_m_5_89340": 98.95,
      "m_m_5_89325": 867.24,
      "m_m_5_71258": 82.94,
      "m_m_5_31999": 0.65,
      "m_m_5_89327": 72.09,
      "m_m_5_89966": 110,
      "m_m_5_10176": 2.86,
      "m_m_5_31991": 0.65,
      "m_m_5_89968": 108.4,
      "m_m_5_31993": 0.69,
      "m_m_5_89376": 395,
      "m_m_5_89965": 115,
      "m_m_5_89963": 94.87,
      "m_m_5_71192": 13.5,
      "m_m_5_89169": 10.64,
      "m_m_5_71188": 754.07,
      "m_m_5_31994": 0.69,
      "m_m_5_89962": 114.9,
      "m_m_5_31139": 3887.39,
      "m_m_5_89964": 119.88,
      "m_m_5_10027": 58.15,
      "m_m_5_89961": 126.99,
      "tiekuang": 2.75,
      "m_m_5_30676": 2.02,
      "m_m_5_30678": 2.16,
      "m_m_5_30674": 2.78,
      "m_m_5_30675": 2.48,
      "m_m_5_89967": 100,
      "m_m_5_6246": 0.16,
      "m_m_5_6249": 0.43,
      "m_m_5_30841": 3.24,
      "m_m_5_10172": 32.99,
      "m_m_5_35708": 6,
      "m_m_8_636": 80,
      "m_m_5_90353": 3758,
      "m_m_5_90257": 450,
      "m_m_5_6072": 1.35,
      "m_m_5_6068": 5.35,
      "muban": 19.3,
      "muliao": 3.02,
      "m_m_5_35707": 6.49,
      "m_m_5_35703": 0.64,
      "qiwuling": 22,
      "m_m_5_35716": 10.1,
      "m_m_5_35715": 13,
      "zhuzi": 1.73,
      "m_m_5_35567": 1.54,
      "m_m_5_35714": 20.24,
      "m_m_5_35701": 0.69,
      "m_m_5_35713": 16,
      "m_m_10_1778": 919,
      "m_m_10_1779": 820,
      "m_m_10_1880": 1200,
      "m_m_10_2034": 1292,
      "m_m_10_93": 80.52,
      "m_m_10_1882": 1409,
      "m_m_5_35717": 1.55,
      "m_m_10_2037": 1284,
      "m_m_10_164": 80.86,
      "m_m_5_52337": 1589.86,
      "m_m_5_40232": 2000.93,
      "m_m_5_35772": 1999.78,
      "m_m_5_87917": 319.58,
      "m_m_5_87881": 9999,
      "zasui": 0.22,
      "g_5_30681": 0.96,
      "g_5_30680": 0.95
    },
    "s_tianeping": {
      "fengwangjiang": 159.31,
      "shoupijiao": 37.71,
      "qicaixian": 147.99,
      "bairanxian": 3.31,
      "fengyu_yi": 2555.5,
      "m_m_5_30852": 17.43,
      "m_m_5_30853": 82.24,
      "m_m_5_30828": 5.76,
      "m_m_5_32000": 0.85,
      "guajian_bei": 65.25,
      "baihua_bu": 89,
      "guajian_yao": 86.76,
      "shuran_bu": 117,
      "m_m_5_32001": 0.62,
      "wuseshi": 165,
      "m_m_5_30856": 15.33,
      "m_m_5_30855": 150,
      "geyin_zhang": 388.25,
      "m_m_5_89298": 40.21,
      "m_m_5_30679": 15.86,
      "m_m_5_30847": 8.59,
      "m_m_5_30846": 2.5,
      "yinsi_duan": 114.89,
      "m_m_5_32003": 0.97,
      "m_m_5_30848": 31.61,
      "m_m_5_32002": 0.96,
      "m_m_5_30850": 115.67,
      "m_m_5_30845": 138.61,
      "m_m_5_31253": 185.64,
      "m_m_5_30844": 0.96,
      "m_m_5_30873": 27.99,
      "m_m_5_90205": 30.98,
      "m_m_8_614": 200.42,
      "shanshui_juan": 99,
      "m_m_5_3819": 65.5,
      "m_m_5_3779": 1,
      "m_m_8_36148": 877.5,
      "m_m_8_19": 0.01,
      "m_m_5_3820": 9.77,
      "m_m_5_30827": 1.04,
      "m_m_5_89970": 177.12,
      "m_m_5_31978": 0.58,
      "m_m_5_31985": 0.7,
      "lucai": 17,
      "m_m_5_31973": 0.8,
      "m_m_5_30849": 5.7,
      "m_m_5_71293": 35,
      "m_m_5_30826": 0.38,
      "m_m_5_30825": 0.02,
      "m_m_5_89171": 17.99,
      "m_m_5_31974": 0.59,
      "m_m_5_31968": 0.6,
      "m_m_5_71292": 35.97,
      "m_m_5_30824": 0.54,
      "m_m_5_71281": 15,
      "m_m_5_30823": 1,
      "m_m_5_31969": 0.66,
      "m_m_5_89315": 999,
      "m_m_5_89969": 134.95,
      "m_m_5_31976": 0.7,
      "m_m_5_89303": 2991.4,
      "m_m_5_89971": 197.21,
      "lushui": 12.9,
      "m_m_5_30875": 1.18,
      "m_m_5_30829": 1.66,
      "m_m_5_30843": 0.92,
      "m_m_5_30874": 37.81,
      "m_m_5_30842": 1.05,
      "m_m_5_5270": 1.87,
      "m_m_5_31970": 0.71,
      "m_m_5_5269": 0.07,
      "m_m_5_31013": 150,
      "gancao": 2.39,
      "m_m_5_31012": 312.05,
      "m_m_5_89172": 59.97,
      "m_m_5_26057": 2500.58,
      "m_m_5_26231": 3,
      "m_m_5_89352": 703.95,
      "m_m_5_89350": 585.27,
      "m_m_5_71269": 115.16,
      "m_m_5_89346": 678.95,
      "m_m_5_89167": 28.15,
      "m_m_5_89348": 267.88,
      "m_m_5_71285": 80.01,
      "jieyuan_dan": 29.99,
      "m_m_5_30836": 1.18,
      "m_m_5_30832": 2.99,
      "m_m_5_30833": 3.86,
      "m_m_5_89324": 60,
      "m_m_5_30831": 1.15,
      "m_m_5_89973": 150.45,
      "m_m_5_71241": 88.52,
      "m_m_5_71240": 81.16,
      "m_m_5_30838": 1.5,
      "shanhu": 2.68,
      "m_m_5_6646": 4.22,
      "m_m_5_30835": 7.2,
      "m_m_5_89974": 103.99,
      "m_m_5_71267": 72.59,
      "m_m_5_89168": 45.02,
      "yaoyin": 154.65,
      "m_m_5_89322": 888,
      "shaoyao": 2.32,
      "m_m_5_30834": 2.14,
      "m_m_5_89328": 942.79,
      "m_m_5_89340": 123.38,
      "m_m_5_89325": 798.31,
      "m_m_5_71258": 74.1,
      "m_m_5_89327": 79.28,
      "m_m_5_89966": 80,
      "m_m_5_10176": 2.53,
      "m_m_5_31991": 0.83,
      "m_m_5_89377": 450.11,
      "m_m_5_89968": 118.42,
      "m_m_5_31993": 0.6,
      "m_m_5_89376": 489.06,
      "m_m_5_89965": 111.98,
      "m_m_5_31992": 1.65,
      "m_m_5_89963": 80.27,
      "m_m_5_71192": 9,
      "m_m_5_89169": 53,
      "m_m_5_71188": 555.12,
      "m_m_5_89962": 88,
      "m_m_5_31139": 2999.99,
      "m_m_5_89964": 90.32,
      "m_m_5_10027": 66.93,
      "m_m_5_89961": 96.02,
      "tiekuang": 2.31,
      "m_m_5_30676": 2.71,
      "m_m_5_30678": 1.6,
      "m_m_5_30674": 2.93,
      "m_m_5_30675": 2.64,
      "m_m_5_89967": 75.8,
      "m_m_5_6246": 0.12,
      "m_m_5_6249": 8.74,
      "m_m_5_32787": 200.47,
      "m_m_8_25762": 19.09,
      "m_m_5_30841": 4.19,
      "m_m_5_10172": 37.47,
      "m_m_5_90032": 9999,
      "m_m_8_634": 965.2,
      "m_m_8_636": 340.28,
      "m_m_5_6072": 1.99,
      "m_m_5_6068": 1.01,
      "muban": 25.77,
      "muliao": 2.89,
      "m_m_5_35707": 7.72,
      "qiwuling": 22.54,
      "m_m_5_35716": 19.99,
      "m_m_5_35715": 19.99,
      "zhuzi": 1.68,
      "m_m_5_35567": 1.55,
      "m_m_5_35704": 0.6,
      "m_m_5_35714": 30.86,
      "m_m_5_35701": 1.25,
      "m_m_5_35713": 15.17,
      "m_m_5_35705": 0.55,
      "m_m_10_948": 852.9,
      "m_m_10_2034": 1983,
      "m_m_10_93": 1.34,
      "m_m_5_35717": 2.01,
      "m_m_10_164": 200,
      "m_m_5_52337": 1800.79,
      "m_m_5_40232": 4321.69,
      "m_m_5_35772": 1680,
      "m_m_5_87917": 416.91,
      "m_m_5_87881": 7993,
      "zasui": 0.49,
      "g_5_30681": 1,
      "g_5_30680": 1.06
    },
    "s_feilong": {
      "fengwangjiang": 178.25,
      "shoupijiao": 44.07,
      "qicaixian": 190.09,
      "bairanxian": 5.88,
      "fengyu_yi": 1111,
      "m_m_5_30852": 16.21,
      "m_m_5_30853": 81.84,
      "m_m_5_30828": 6.8,
      "guajian_bei": 56,
      "baihua_bu": 87.5,
      "guajian_yao": 99.88,
      "shuran_bu": 117.8,
      "shuran_bag": 60.69,
      "jinfeng_bag": 10000,
      "wuseshi": 121.54,
      "m_m_5_30856": 19.2,
      "m_m_5_30855": 149.93,
      "geyin_zhang": 199,
      "m_m_5_89298": 26.76,
      "m_m_5_30679": 15,
      "m_m_5_30847": 15.1,
      "m_m_5_30846": 5,
      "yinsi_duan": 133.34,
      "m_m_5_30848": 27.99,
      "m_m_5_30850": 125.02,
      "m_m_5_30845": 120.19,
      "m_m_5_89435": 6999,
      "m_m_5_30844": 0.72,
      "m_m_5_30873": 13.5,
      "m_m_5_90205": 20,
      "m_m_8_614": 1666,
      "m_m_5_3779": 1,
      "m_m_8_36148": 1300.78,
      "m_m_5_30827": 1,
      "m_m_5_89970": 177,
      "m_m_5_32014": 222.02,
      "lucai": 15.88,
      "m_m_5_1831": 28.08,
      "m_m_5_31973": 3.45,
      "m_m_5_30849": 6,
      "m_m_5_71293": 41,
      "m_m_5_30826": 1,
      "m_m_5_30825": 0.14,
      "m_m_5_71292": 35,
      "m_m_5_30824": 0.25,
      "m_m_5_71281": 17.15,
      "m_m_5_30823": 0.98,
      "m_m_5_71277": 39,
      "m_m_5_89315": 1499,
      "m_m_5_89969": 158.38,
      "m_m_5_89303": 3688.05,
      "m_m_5_89971": 183,
      "lushui": 22.46,
      "m_m_5_30875": 2.29,
      "m_m_5_30843": 1.25,
      "m_m_5_30874": 30.17,
      "m_m_5_30842": 1.13,
      "m_m_5_5270": 1.55,
      "m_m_5_5269": 0.29,
      "m_m_5_31013": 180.35,
      "gancao": 4.4,
      "m_m_5_31012": 276.63,
      "m_m_5_26057": 5000,
      "m_m_5_26231": 3.23,
      "m_m_5_89352": 743,
      "m_m_5_71269": 143.14,
      "m_m_5_89346": 812.3,
      "m_m_5_89348": 200.68,
      "m_m_5_71285": 85.6,
      "jieyuan_dan": 180.79,
      "m_m_5_30836": 0.72,
      "m_m_5_30832": 3.4,
      "m_m_5_30833": 2.1,
      "m_m_5_89324": 133.24,
      "m_m_5_30831": 2.81,
      "m_m_5_89973": 168.63,
      "m_m_5_31996": 1,
      "m_m_5_71240": 25,
      "m_m_5_71266": 39,
      "m_m_5_30838": 1.2,
      "shanhu": 2.53,
      "m_m_5_30835": 2.01,
      "m_m_5_89974": 140.83,
      "m_m_5_71267": 30.55,
      "yaoyin": 187.68,
      "shaoyao": 2.34,
      "m_m_5_90206": 100,
      "m_m_5_30834": 2.87,
      "m_m_5_89328": 871,
      "m_m_5_89340": 103.9,
      "m_m_5_89325": 774.78,
      "m_m_5_71258": 114.49,
      "m_m_5_89327": 87.77,
      "m_m_5_89966": 139,
      "m_m_5_89968": 114,
      "m_m_5_89376": 200,
      "m_m_5_89965": 140.08,
      "m_m_5_31992": 14.95,
      "m_m_5_89963": 130,
      "m_m_5_89962": 126.71,
      "m_m_5_31139": 2999.96,
      "m_m_5_89964": 98.25,
      "m_m_5_10027": 111,
      "m_m_5_89961": 131.31,
      "tiekuang": 2.31,
      "m_m_5_30676": 1.55,
      "m_m_5_30678": 1.1,
      "m_m_5_30674": 2.24,
      "m_m_5_30675": 2.58,
      "m_m_5_89967": 94.32,
      "m_m_5_6246": 0.29,
      "m_m_5_30841": 3.07,
      "m_m_8_17538": 30,
      "m_m_8_632": 1660,
      "m_m_8_634": 100.3,
      "m_m_8_636": 1666,
      "m_m_5_6072": 5,
      "m_m_5_6066": 0.05,
      "muban": 30.32,
      "muliao": 4.7,
      "m_m_5_35707": 12.89,
      "qiwuling": 27,
      "m_m_5_35716": 88.98,
      "m_m_5_35715": 89.72,
      "zhuzi": 5.26,
      "m_m_5_35567": 3.11,
      "m_m_5_35714": 89,
      "m_m_5_35701": 12.44,
      "m_m_5_35713": 84.42,
      "m_m_5_35705": 3.75,
      "m_m_5_35717": 1.59,
      "m_m_5_52337": 1800,
      "m_m_5_35772": 1666.51,
      "m_m_5_87917": 495.23,
      "m_m_5_87881": 8888,
      "zasui": 0.41,
      "g_5_30681": 1.97,
      "g_5_30680": 2.9
    },
    "s_jiutian": {
      "fengwangjiang": 1298,
      "shoupijiao": 75.23,
      "qicaixian": 90.04,
      "m_m_5_30852": 29.69,
      "m_m_5_30853": 594.5,
      "m_m_5_30828": 8,
      "m_m_5_89165": 50,
      "guajian_bei": 65,
      "baihua_bu": 80.6,
      "guajian_yao": 100.83,
      "shuran_bu": 63.96,
      "m_m_5_32001": 3.91,
      "wuseshi": 75.15,
      "m_m_5_30856": 40,
      "m_m_5_30855": 199.64,
      "geyin_zhang": 200,
      "m_m_5_89298": 14.18,
      "m_m_5_30679": 29.5,
      "m_m_5_30847": 18,
      "m_m_5_30846": 5.55,
      "yinsi_duan": 93.86,
      "m_m_5_30848": 20.12,
      "m_m_5_32002": 3,
      "m_m_5_30850": 79.84,
      "m_m_5_30845": 214.2,
      "m_m_5_30844": 0.7,
      "m_m_5_30873": 35.28,
      "shanshui_juan": 55,
      "m_m_5_3819": 188.87,
      "m_m_5_3779": 0.77,
      "m_m_5_3820": 4.58,
      "m_m_5_30827": 2,
      "m_m_5_89970": 100.98,
      "lucai": 11.96,
      "m_m_5_31973": 1.68,
      "m_m_5_30849": 6.13,
      "m_m_5_30826": 0.19,
      "m_m_5_30825": 0.02,
      "m_m_5_89171": 15.97,
      "m_m_5_31974": 3,
      "m_m_5_30824": 0.4,
      "m_m_5_31967": 200,
      "m_m_5_30823": 0.98,
      "m_m_5_31969": 5.07,
      "m_m_5_89315": 1049.91,
      "m_m_5_89969": 75.9,
      "m_m_5_31976": 0.96,
      "m_m_5_89971": 110.95,
      "lushui": 13.8,
      "m_m_5_30829": 10,
      "m_m_5_30843": 2,
      "m_m_5_30874": 30.05,
      "m_m_5_30842": 2.01,
      "m_m_5_5270": 0.6,
      "m_m_5_31970": 3.77,
      "m_m_5_5269": 0.02,
      "m_m_5_31977": 0.85,
      "m_m_5_31013": 251.91,
      "gancao": 2.01,
      "m_m_5_31012": 399.58,
      "m_m_5_89172": 24.99,
      "m_m_5_89304": 6000.91,
      "m_m_5_26231": 1.4,
      "m_m_5_89352": 1100,
      "m_m_5_89350": 1439.69,
      "m_m_5_89346": 1880,
      "m_m_5_89348": 587,
      "jieyuan_dan": 33.41,
      "m_m_5_30836": 0.9,
      "m_m_5_30832": 1.3,
      "m_m_5_30833": 2,
      "m_m_5_89324": 150.3,
      "m_m_5_30831": 2.5,
      "m_m_5_89973": 153.8,
      "m_m_5_31996": 3.42,
      "m_m_5_31995": 3.96,
      "m_m_5_30838": 1.99,
      "shanhu": 1.89,
      "m_m_5_30835": 2.42,
      "yaoyin": 96.99,
      "shaoyao": 2.55,
      "m_m_5_30834": 2.58,
      "m_m_5_31998": 5.37,
      "m_m_5_89328": 1999,
      "m_m_5_89340": 237.89,
      "m_m_5_31999": 1.58,
      "m_m_5_89327": 192.73,
      "m_m_5_89966": 69.79,
      "m_m_5_89968": 36.66,
      "m_m_5_89376": 665.79,
      "m_m_5_89965": 43.21,
      "m_m_5_31992": 6,
      "m_m_5_89963": 50,
      "m_m_5_89962": 62.27,
      "m_m_5_89964": 36,
      "m_m_5_10027": 109.83,
      "m_m_5_89961": 68.29,
      "tiekuang": 4.9,
      "m_m_5_30676": 3.34,
      "m_m_5_30678": 3,
      "m_m_5_30674": 5,
      "m_m_5_30675": 4.67,
      "m_m_5_6246": 0.15,
      "m_m_5_6249": 6.41,
      "m_m_8_636": 40,
      "muban": 55.69,
      "muliao": 5.33,
      "qiwuling": 26.99,
      "m_m_5_35716": 66,
      "m_m_5_35715": 26.18,
      "zhuzi": 1.99,
      "m_m_5_35567": 2.56,
      "m_m_5_35714": 119.57,
      "m_m_5_35713": 50.03,
      "m_m_5_35717": 5.22,
      "m_m_5_52337": 3999,
      "zasui": 0.48,
      "g_5_30681": 2.3,
      "g_5_30680": 2.58
    },
    "s_meijianxue": {
      "fengwangjiang": 188.31,
      "shoupijiao": 43.99,
      "qicaixian": 165,
      "bairanxian": 4,
      "fengyu_yi": 1103.16,
      "m_m_5_30852": 14.12,
      "m_m_5_30853": 80.88,
      "m_m_5_30828": 5,
      "guajian_bei": 76,
      "baihua_bu": 114.99,
      "guajian_yao": 87,
      "shuran_bu": 119.99,
      "shuran_bag": 50,
      "wuseshi": 145,
      "m_m_5_30856": 16.1,
      "m_m_5_30855": 148.55,
      "m_m_5_89298": 35,
      "m_m_5_30679": 23.96,
      "m_m_5_30847": 7.89,
      "m_m_5_30846": 2.75,
      "yinsi_duan": 150.25,
      "m_m_5_30848": 21.46,
      "m_m_5_30850": 128.61,
      "m_m_5_30845": 184.97,
      "m_m_5_31397": 3.17,
      "m_m_5_30844": 0.28,
      "m_m_5_30873": 10.65,
      "m_m_5_90205": 5,
      "m_m_8_36148": 987,
      "m_m_5_30827": 1.07,
      "m_m_5_89970": 178.98,
      "m_m_5_32014": 302,
      "m_m_5_31985": 1.46,
      "lucai": 16.66,
      "m_m_5_1831": 15,
      "m_m_5_30849": 6,
      "m_m_5_71293": 24.55,
      "m_m_5_30826": 1.48,
      "m_m_5_30825": 0.15,
      "m_m_5_31974": 1,
      "m_m_5_31968": 20,
      "m_m_5_71292": 25.87,
      "m_m_5_30824": 1,
      "m_m_5_31967": 77.99,
      "m_m_5_71281": 8.76,
      "m_m_5_30823": 0.99,
      "m_m_5_71277": 31.41,
      "m_m_5_89315": 1298,
      "m_m_5_89969": 135.99,
      "m_m_5_31976": 0.65,
      "m_m_5_89303": 3790.4,
      "m_m_5_89971": 166.88,
      "lushui": 9.94,
      "m_m_5_30875": 1.41,
      "m_m_5_30843": 0.43,
      "m_m_5_30874": 45,
      "m_m_5_30842": 0.47,
      "m_m_5_5270": 0.77,
      "m_m_5_5269": 0.2,
      "m_m_5_31013": 159.54,
      "gancao": 1.32,
      "m_m_5_31012": 253,
      "m_m_5_89304": 4389.53,
      "m_m_5_89352": 866.9,
      "m_m_5_89350": 1399.67,
      "m_m_5_71269": 124.82,
      "m_m_5_89346": 948.45,
      "m_m_5_89348": 268.88,
      "m_m_5_71285": 90.4,
      "jieyuan_dan": 28.92,
      "m_m_5_30836": 0.87,
      "m_m_5_30832": 5.8,
      "m_m_5_30833": 1.14,
      "m_m_5_89324": 224.99,
      "m_m_5_30831": 0.63,
      "m_m_5_89973": 218.88,
      "m_m_5_31996": 9.89,
      "m_m_5_71241": 28,
      "m_m_5_71240": 49.48,
      "m_m_5_31995": 2.41,
      "m_m_5_71266": 33.28,
      "m_m_5_30838": 1.31,
      "shanhu": 2.85,
      "m_m_5_6646": 27,
      "m_m_5_30835": 1.59,
      "m_m_5_89974": 148,
      "m_m_5_71267": 39.58,
      "yaoyin": 189.6,
      "m_m_5_31100": 30.18,
      "shaoyao": 1.27,
      "m_m_5_89332": 700.35,
      "m_m_5_89340": 120.57,
      "m_m_5_89325": 655.06,
      "m_m_5_71258": 75.48,
      "m_m_5_89327": 140,
      "m_m_5_89966": 148.99,
      "m_m_5_31991": 30,
      "m_m_5_89968": 158.78,
      "m_m_5_89376": 1110.82,
      "m_m_5_89965": 250.42,
      "m_m_5_31992": 9,
      "m_m_5_89375": 1111,
      "m_m_5_89963": 104.98,
      "m_m_5_89962": 123.99,
      "m_m_5_31139": 4600.67,
      "m_m_5_89964": 100.27,
      "m_m_5_10027": 93.92,
      "m_m_5_89961": 110,
      "tiekuang": 3.6,
      "m_m_5_30676": 3.8,
      "m_m_5_30678": 2.24,
      "m_m_5_30674": 6.69,
      "m_m_5_30675": 5.97,
      "m_m_5_89967": 135.36,
      "m_m_5_6246": 0.1,
      "m_m_5_30841": 2.97,
      "m_m_8_634": 500,
      "m_m_8_636": 20.66,
      "muban": 36.65,
      "muliao": 4.36,
      "qiwuling": 48.71,
      "m_m_5_35716": 15,
      "m_m_5_35715": 40.2,
      "zhuzi": 2.49,
      "m_m_5_35567": 2.64,
      "m_m_5_35714": 24.65,
      "m_m_5_35713": 30.39,
      "m_m_5_35717": 2.5,
      "m_m_5_52337": 2879,
      "m_m_5_35772": 2899.99,
      "m_m_5_87917": 179.84,
      "m_m_5_87881": 7999,
      "zasui": 0.22,
      "g_5_30681": 1.85,
      "g_5_30680": 0.88
    },
    "s_shanhai": {
      "fengwangjiang": 188.31,
      "shoupijiao": 45.93,
      "qicaixian": 118,
      "bairanxian": 20.63,
      "fengyu_yi": 1888.68,
      "m_m_5_30852": 16.3,
      "m_m_5_30853": 85.3,
      "m_m_5_30828": 14.99,
      "guajian_bei": 64.87,
      "baihua_bu": 88.88,
      "guajian_yao": 88.5,
      "shuran_bu": 149,
      "shuran_bag": 15,
      "m_m_5_30856": 16.97,
      "m_m_5_30855": 152.46,
      "m_m_5_89298": 34.94,
      "m_m_5_30679": 14.73,
      "m_m_5_30847": 10.39,
      "m_m_5_30846": 2.88,
      "yinsi_duan": 159.2,
      "m_m_5_30848": 24,
      "m_m_5_30850": 118.91,
      "m_m_5_30845": 199.14,
      "m_m_5_30844": 0.68,
      "m_m_5_30873": 13.79,
      "m_m_5_90205": 150.89,
      "m_m_8_36148": 1450.99,
      "m_m_5_30827": 0.97,
      "m_m_5_89970": 168,
      "m_m_5_32014": 220.96,
      "lucai": 15.9,
      "m_m_5_30849": 6.12,
      "m_m_5_71293": 31.63,
      "m_m_5_30826": 0.29,
      "m_m_5_30825": 0.01,
      "m_m_5_89171": 50,
      "m_m_5_71292": 39,
      "m_m_5_30824": 1.12,
      "m_m_5_71281": 12.9,
      "m_m_5_30823": 0.31,
      "m_m_5_89315": 1888.88,
      "m_m_5_89969": 145.22,
      "m_m_5_89303": 3727.39,
      "m_m_5_89971": 165.98,
      "lushui": 10.82,
      "m_m_5_30875": 2.1,
      "m_m_5_30843": 0.59,
      "m_m_5_30874": 34.82,
      "m_m_5_30842": 0.88,
      "m_m_5_5270": 3.5,
      "m_m_5_5269": 0.4,
      "m_m_5_31013": 179.99,
      "gancao": 2.24,
      "m_m_5_31012": 305,
      "m_m_5_89304": 3986.42,
      "m_m_5_89352": 741.68,
      "m_m_5_89350": 666,
      "m_m_5_71269": 125.49,
      "m_m_5_89346": 874.71,
      "m_m_5_89348": 380,
      "m_m_5_71285": 150,
      "jieyuan_dan": 188.25,
      "m_m_5_30836": 0.7,
      "m_m_5_30832": 0.84,
      "m_m_5_30833": 2,
      "m_m_5_89324": 143,
      "m_m_5_30831": 1,
      "m_m_5_89973": 230.13,
      "m_m_5_71240": 100.06,
      "m_m_5_71266": 28.83,
      "m_m_5_30838": 0.99,
      "shanhu": 3.17,
      "m_m_5_30835": 1.69,
      "m_m_5_89974": 106,
      "m_m_5_71267": 40.91,
      "yaoyin": 209.69,
      "shaoyao": 1.05,
      "m_m_5_31102": 0.2,
      "m_m_5_30834": 2.04,
      "m_m_5_89340": 160,
      "m_m_5_89325": 999,
      "m_m_5_71258": 77.1,
      "m_m_5_89327": 146,
      "m_m_5_89966": 113.33,
      "m_m_5_89968": 110.19,
      "m_m_5_89376": 690,
      "m_m_5_89965": 115.55,
      "m_m_5_89963": 108.28,
      "m_m_5_89962": 155,
      "m_m_5_31139": 4900.31,
      "m_m_5_89964": 120.07,
      "m_m_5_10027": 99,
      "m_m_5_89961": 127,
      "tiekuang": 2.99,
      "m_m_5_30676": 3,
      "m_m_5_30678": 2.26,
      "m_m_5_30674": 2.96,
      "m_m_5_30675": 3.46,
      "m_m_5_89967": 140.97,
      "m_m_5_6246": 0.14,
      "m_m_5_30841": 4.8,
      "m_m_8_636": 39,
      "muban": 39.27,
      "muliao": 4.5,
      "qiwuling": 21.21,
      "m_m_5_35716": 89.09,
      "m_m_5_35715": 16.77,
      "zhuzi": 1.98,
      "m_m_5_35567": 2.28,
      "m_m_5_35714": 22.55,
      "m_m_5_35713": 89.26,
      "m_m_5_35717": 2,
      "m_m_5_35772": 1985.89,
      "m_m_5_87917": 352.44,
      "zasui": 0.23,
      "g_5_30681": 0.98,
      "g_5_30680": 0.87
    },
    "s_aoxue": {
      "fengwangjiang": 349,
      "m_m_5_30852": 46,
      "m_m_5_30853": 55,
      "m_m_5_30828": 10.94,
      "guajian_bei": 100,
      "guajian_yao": 100,
      "m_m_5_30856": 40,
      "m_m_5_30855": 159,
      "geyin_zhang": 300,
      "m_m_5_89298": 230,
      "m_m_5_30679": 19.93,
      "m_m_5_30847": 5,
      "m_m_5_30848": 99,
      "m_m_5_30850": 141.32,
      "m_m_5_30845": 220,
      "m_m_5_30844": 0.99,
      "m_m_5_30873": 120,
      "m_m_8_36148": 4999.99,
      "m_m_5_30827": 0.35,
      "lucai": 99.99,
      "m_m_5_31973": 0.9,
      "m_m_5_30826": 1.8,
      "m_m_5_30825": 0.02,
      "m_m_5_71292": 15.99,
      "m_m_5_30824": 1.24,
      "m_m_5_30823": 2.42,
      "lushui": 3.98,
      "m_m_5_30874": 80,
      "m_m_5_30842": 0.8,
      "m_m_5_31013": 259.99,
      "gancao": 1.09,
      "m_m_5_31012": 459.99,
      "m_m_5_89352": 2500,
      "m_m_5_71269": 310,
      "m_m_5_89346": 1500,
      "m_m_5_71285": 69.67,
      "m_m_5_30836": 2,
      "m_m_5_30833": 0.88,
      "m_m_5_30831": 0.66,
      "m_m_5_71241": 10,
      "m_m_5_71240": 40,
      "m_m_5_71266": 30,
      "m_m_5_30838": 1.04,
      "shanhu": 0.86,
      "m_m_5_30835": 0.55,
      "m_m_5_71267": 13,
      "yaoyin": 777,
      "shaoyao": 2.55,
      "m_m_5_30834": 2.15,
      "m_m_5_71258": 200,
      "m_m_5_71188": 20,
      "m_m_5_31139": 4400.06,
      "m_m_5_10027": 129.99,
      "tiekuang": 0.7,
      "m_m_5_30676": 0.66,
      "m_m_5_30674": 5,
      "m_m_5_6246": 0.2,
      "muban": 57,
      "muliao": 1.95,
      "qiwuling": 5,
      "m_m_5_35716": 17,
      "m_m_5_35715": 30.1,
      "zhuzi": 1.31,
      "m_m_5_35567": 0.95,
      "m_m_5_35714": 25.98,
      "m_m_5_35713": 39.69,
      "m_m_10_1880": 2170,
      "m_m_5_35717": 15,
      "m_m_5_52337": 2400,
      "m_m_5_35772": 2500,
      "m_m_5_87917": 1199,
      "zasui": 1.42,
      "g_5_30681": 5,
      "g_5_30680": 1
    }
  },
  "stoneMeta": {
    "version": "cs50-stone-2026-11-19",
    "season": "苍生铸世",
    "verifiedAt": "2026-11-19",
    "taxRate": 0.05,
    "scope": "1-8 级五行石；快速合成 / 最优合成 / 7-8 级爆率盈亏线",
    "note": "当前赛季官方未逐条公布五行石合成公式；3-6 级默认值来自 2026-07 精炼面板攻略，并用 2026-09 官方「精炼公式未调整」与测试服精六成本交叉核对。7-8 级无稳定保底公式，按可编辑爆率建模。所有公式均可在页面内修改。",
    "sources": [
      {
        "label": "面向萌新的五行石精炼方法与成本（2026-07-29 更新）",
        "url": "https://www.jx3box.com/community/6363",
        "note": "三级 12×一级；四级 3×三级+7×一级；五级 3×四级+2×三级；六级 3×五级+2×四级；含成功率、加工费与精力。"
      },
      {
        "label": "【苍生铸世】版本测试服全身精六汇算（2026-10-08 更新）",
        "url": "https://www.jx3box.com/community/6496",
        "note": "当前赛季测试服精六成本；6 级五行石约 518 金/块（2026-09-10 样本）。"
      },
      {
        "label": "《剑网3》新赛季门派动作与精炼规则持续优化中（2026-09-15）",
        "url": "https://news.17173.com/content/09152026/160051947.shtml",
        "note": "官方说明：这次精炼公式本身没有调整；衣服/下装精六为 16 颗 6 级五行石 100% 成功。"
      },
      {
        "label": "【苍生铸世】开荒必看！新赛季剥七&剥八一图示（2026-11-08 更新）",
        "url": "https://www.jx3box.com/community/6597",
        "note": "当前赛季 7/8 级剥离成本；6 级五行石按 520 金/块样本计算。"
      },
      {
        "label": "五行石精炼方式的成本及毛利计算（2025-03-16 更新）",
        "url": "https://www.jx3box.com/community/2815",
        "note": "快速合成 1-6 级成本/精力表；4 精 6 出 8 的 252 次实验与累积概率表。"
      },
      {
        "label": "JX3BOX 拍卖 · 五行石 1-8 级（2026-11-19）",
        "url": "https://next2.jx3box.com/api/auction/",
        "note": "17 个服务器 1-8 级五行石拍卖样本，用于本模块默认价。"
      }
    ]
  },
  "stones": [
    {
      "level": 1,
      "itemId": "5_24423",
      "name": "五行石（一级）",
      "quality": 2,
      "color": "#94A3B8",
      "base": 0.81
    },
    {
      "level": 2,
      "itemId": "5_24424",
      "name": "五行石（二级）",
      "quality": 2,
      "color": "#94A3B8",
      "base": 4.58
    },
    {
      "level": 3,
      "itemId": "5_24425",
      "name": "五行石（三级）",
      "quality": 3,
      "color": "#60A5FA",
      "base": 14.79
    },
    {
      "level": 4,
      "itemId": "5_24426",
      "name": "五行石（四级）",
      "quality": 3,
      "color": "#60A5FA",
      "base": 48.26
    },
    {
      "level": 5,
      "itemId": "5_24427",
      "name": "五行石（五级）",
      "quality": 4,
      "color": "#C084FC",
      "base": 164.08
    },
    {
      "level": 6,
      "itemId": "5_24428",
      "name": "五行石（六级）",
      "quality": 4,
      "color": "#C084FC",
      "base": 549.8
    },
    {
      "level": 7,
      "itemId": "5_24429",
      "name": "五行石（七级）",
      "quality": 5,
      "color": "#FBBF24",
      "base": 8720.66
    },
    {
      "level": 8,
      "itemId": "5_24430",
      "name": "五行石（八级）",
      "quality": 5,
      "color": "#FBBF24",
      "base": 27990.5
    }
  ],
  "stonePrices": {
    "s_mengjiangnan": {
      "1": 0.81,
      "2": 5.99,
      "3": 13.73,
      "4": 55.89,
      "5": 174.6,
      "6": 548.2,
      "7": 8700.9,
      "8": 27495
    },
    "s_pozhenzi": {
      "1": 0.8,
      "2": 5.72,
      "3": 11.97,
      "4": 48.65,
      "5": 149.48,
      "6": 512.3,
      "7": 10888.88,
      "8": 25800
    },
    "s_dielianhua": {
      "1": 0.8,
      "2": 5.18,
      "3": 14.85,
      "4": 54.98,
      "5": 166.38,
      "6": 512.8,
      "7": 10888.88,
      "8": 28000.48
    },
    "s_jiandan": {
      "1": 0.84,
      "2": 4.64,
      "3": 12.98,
      "4": 48.4,
      "5": 158.44,
      "6": 510.03,
      "7": 9100.87,
      "8": 28800.02
    },
    "s_youyuelun": {
      "1": 0.82,
      "2": 5.48,
      "3": 13.95,
      "4": 56.68,
      "5": 166.98,
      "6": 510.05,
      "7": 8998.17,
      "8": 26469.36
    },
    "s_longzheng": {
      "1": 0.8,
      "2": 6.55,
      "3": 15.23,
      "4": 58.8,
      "5": 166,
      "6": 510.77,
      "7": 8600.16,
      "8": 26372.91
    },
    "s_changancheng": {
      "1": 0.81,
      "2": 5.18,
      "3": 11.97,
      "4": 88.98,
      "5": 151.55,
      "6": 510.25,
      "7": 8199.95,
      "8": 28660.41
    },
    "s_douzhuang": {
      "1": 0.85,
      "2": 5.66,
      "3": 12.99,
      "4": 55.86,
      "5": 158.56,
      "6": 511.89,
      "7": 7998.69,
      "8": 25032.62
    },
    "s_qiankun": {
      "1": 0.81,
      "2": 3.91,
      "3": 12.9,
      "4": 46.26,
      "5": 158.82,
      "6": 529.71,
      "7": 10888.88,
      "8": 25000.25
    },
    "s_weiwo": {
      "1": 0.83,
      "2": 4.31,
      "3": 13.57,
      "4": 48.1,
      "5": 192.65,
      "6": 545.37,
      "7": 8887,
      "8": 27409.5
    },
    "s_juedai": {
      "1": 0.81,
      "2": 6.49,
      "3": 14.88,
      "4": 52.3,
      "5": 155.79,
      "6": 511,
      "7": 8200,
      "8": 24999.7
    },
    "s_tianeping": {
      "1": 0.82,
      "2": 8.23,
      "3": 13.4,
      "4": 49.84,
      "5": 157.76,
      "6": 525.04,
      "7": 9100.73,
      "8": 27000.89
    },
    "s_feilong": {
      "1": 0.81,
      "2": 4,
      "3": 15,
      "4": 49.94,
      "5": 146,
      "6": 510.01,
      "7": 9294.93,
      "8": 31335.57
    },
    "s_jiutian": {
      "1": 0.83,
      "2": 6.84,
      "3": 15.87,
      "4": 54.49,
      "5": 195.74,
      "6": 596.1,
      "7": 39800.55,
      "8": 52888.45
    },
    "s_meijianxue": {
      "1": 0.81,
      "2": 5.08,
      "3": 13.63,
      "4": 46.9,
      "5": 152.94,
      "6": 540,
      "7": 8054.26,
      "8": 27970
    },
    "s_shanhai": {
      "1": 0.81,
      "2": 4,
      "3": 12.17,
      "4": 48.3,
      "5": 147,
      "6": 527.2,
      "7": 8100.44,
      "8": 29000.88
    },
    "s_aoxue": {
      "1": 1,
      "3": 13.91,
      "4": 80.6,
      "5": 208,
      "6": 550,
      "7": 8800,
      "8": 29996
    }
  },
  "stoneRecipes": [
    {
      "id": "fast_2",
      "name": "快速合成 · 二级",
      "mode": "fast",
      "target": 2,
      "primary": 2,
      "inputs": [
        {
          "level": 1,
          "qty": 4
        }
      ],
      "fee": 0.12,
      "energy": 10,
      "outcomes": [
        {
          "level": 2,
          "chance": 1
        }
      ],
      "verified": true,
      "source": "游戏内快速精炼面板 · 2024-10 成本表（2026-09 官方确认公式未调整）",
      "note": "快速精炼自动填入 1 级五行石，无需中间产物。"
    },
    {
      "id": "fast_3",
      "name": "快速合成 · 三级",
      "mode": "fast",
      "target": 3,
      "primary": 3,
      "inputs": [
        {
          "level": 1,
          "qty": 13
        }
      ],
      "fee": 0.39,
      "energy": 10,
      "outcomes": [
        {
          "level": 3,
          "chance": 1
        }
      ],
      "verified": true,
      "source": "游戏内快速精炼面板 · 2024-10 成本表",
      "note": "13 颗一级加 0.39 金加工费，100% 出三级。"
    },
    {
      "id": "fast_4",
      "name": "快速合成 · 四级",
      "mode": "fast",
      "target": 4,
      "primary": 4,
      "inputs": [
        {
          "level": 1,
          "qty": 46
        }
      ],
      "fee": 2.76,
      "energy": 47,
      "outcomes": [
        {
          "level": 4,
          "chance": 1
        }
      ],
      "verified": true,
      "source": "游戏内快速精炼面板 · 2024-10 成本表",
      "note": "直接消耗 46 颗一级，精力 47 点。"
    },
    {
      "id": "fast_5",
      "name": "快速合成 · 五级",
      "mode": "fast",
      "target": 5,
      "primary": 5,
      "inputs": [
        {
          "level": 1,
          "qty": 170
        }
      ],
      "fee": 10.2,
      "energy": 147,
      "outcomes": [
        {
          "level": 5,
          "chance": 1
        }
      ],
      "verified": true,
      "source": "游戏内快速精炼面板 · 2024-10 成本表",
      "note": "直接消耗 170 颗一级，精力 147 点。"
    },
    {
      "id": "fast_6",
      "name": "快速合成 · 六级",
      "mode": "fast",
      "target": 6,
      "primary": 6,
      "inputs": [
        {
          "level": 1,
          "qty": 599
        }
      ],
      "fee": 53.91,
      "energy": 554,
      "outcomes": [
        {
          "level": 6,
          "chance": 1
        }
      ],
      "verified": true,
      "source": "游戏内快速精炼面板 · 2024-10 成本表",
      "note": "直接消耗 599 颗一级，精力 554 点；2026 赛季仍可在精炼面板快速填充。"
    },
    {
      "id": "opt_3",
      "name": "最优合成 · 三级（12×一级）",
      "mode": "optimal",
      "target": 3,
      "primary": 3,
      "inputs": [
        {
          "level": 1,
          "qty": 12
        }
      ],
      "fee": 0.36,
      "energy": 10,
      "outcomes": [
        {
          "level": 3,
          "chance": 0.9276
        },
        {
          "level": 2,
          "chance": 0.0724
        }
      ],
      "verified": true,
      "source": "2026-07 攻略 · 精炼面板成功率",
      "note": "比快速三级略省金币，但只有 92.76% 出三级，其余 7.24% 为二级。"
    },
    {
      "id": "opt_4",
      "name": "最优合成 · 四级（3×三级 + 7×一级）",
      "mode": "optimal",
      "target": 4,
      "primary": 4,
      "inputs": [
        {
          "level": 3,
          "qty": 3
        },
        {
          "level": 1,
          "qty": 7
        }
      ],
      "fee": 1.4421,
      "energy": 10,
      "outcomes": [
        {
          "level": 4,
          "chance": 0.9911
        },
        {
          "level": 5,
          "chance": 0.0072
        },
        {
          "level": 3,
          "chance": 0.0017
        }
      ],
      "verified": true,
      "source": "2026-07 攻略 · 精炼面板成功率",
      "note": "16 格配方；99.11% 出四级，0.72% 跳五级，0.17% 退回三级。"
    },
    {
      "id": "opt_4_alt",
      "name": "四级（4×三级）",
      "mode": "optimal",
      "target": 4,
      "primary": 4,
      "inputs": [
        {
          "level": 3,
          "qty": 4
        }
      ],
      "fee": 1.6428,
      "energy": 10,
      "outcomes": [
        {
          "level": 4,
          "chance": 0.9436
        },
        {
          "level": 5,
          "chance": 0.0564
        }
      ],
      "verified": true,
      "source": "2025-03 成本表 · 4 精 5 同源配方",
      "note": "94.36% 出四级，5.64% 跳五级；按当前价格有时比 3+7 更省金币，但更耗精力。"
    },
    {
      "id": "opt_5",
      "name": "最优合成 · 五级（3×四级 + 2×三级）",
      "mode": "optimal",
      "target": 5,
      "primary": 5,
      "inputs": [
        {
          "level": 4,
          "qty": 3
        },
        {
          "level": 3,
          "qty": 2
        }
      ],
      "fee": 5.3801,
      "energy": 10,
      "outcomes": [
        {
          "level": 5,
          "chance": 0.9915
        },
        {
          "level": 6,
          "chance": 0.0085
        }
      ],
      "verified": true,
      "source": "2026-07 攻略 · 精炼面板成功率",
      "note": "99.15% 出五级，0.85% 跳六级。"
    },
    {
      "id": "opt_5_alt",
      "name": "五级（4×四级）",
      "mode": "optimal",
      "target": 5,
      "primary": 5,
      "inputs": [
        {
          "level": 4,
          "qty": 4
        }
      ],
      "fee": 6.0783,
      "energy": 10,
      "outcomes": [
        {
          "level": 5,
          "chance": 0.9436
        },
        {
          "level": 6,
          "chance": 0.0564
        }
      ],
      "verified": true,
      "source": "2025-03 成本表 · 4 精 5",
      "note": "94.36% 出五级，5.64% 跳六级。"
    },
    {
      "id": "opt_6_a",
      "name": "最优合成 · 六级（12×四级）",
      "mode": "optimal",
      "target": 6,
      "primary": 6,
      "inputs": [
        {
          "level": 4,
          "qty": 12
        }
      ],
      "fee": 18.24,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 0.9276
        },
        {
          "level": 5,
          "chance": 0.0724
        }
      ],
      "verified": true,
      "source": "2025-03 成本表 · 4 精 6",
      "note": "92.76% 出六级，7.24% 出五级；通常是最省金币的六级路线。"
    },
    {
      "id": "opt_6_b",
      "name": "高成功率 · 六级（11×四级 + 6×三级）",
      "mode": "optimal",
      "target": 6,
      "primary": 6,
      "inputs": [
        {
          "level": 4,
          "qty": 11
        },
        {
          "level": 3,
          "qty": 6
        }
      ],
      "fee": 19.18,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 0.9885
        },
        {
          "level": 5,
          "chance": 0.0115
        }
      ],
      "verified": true,
      "source": "2025-03 成本表 · 4 精 6",
      "note": "98.85% 出六级，1.15% 出五级；金币成本略高，但成功更稳。"
    },
    {
      "id": "opt_6_c",
      "name": "稳妥 · 六级（3×五级 + 2×四级）",
      "mode": "optimal",
      "target": 6,
      "primary": 6,
      "inputs": [
        {
          "level": 5,
          "qty": 3
        },
        {
          "level": 4,
          "qty": 2
        }
      ],
      "fee": 19.9066,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 0.9955
        }
      ],
      "verified": true,
      "source": "2026-07 攻略 · 精炼面板成功率",
      "note": "99.55% 出六级，0.45% 失败；成功率最高但五级底料更贵。"
    },
    {
      "id": "opt_6_d",
      "name": "保底 · 六级（13×四级）",
      "mode": "optimal",
      "target": 6,
      "primary": 6,
      "inputs": [
        {
          "level": 4,
          "qty": 13
        }
      ],
      "fee": 19.75,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 1
        }
      ],
      "verified": false,
      "source": "社区常用 13×四级保底公式",
      "note": "社区常用保底路线，2026 赛季面板待复核；默认按 100% 出六级。"
    },
    {
      "id": "jack_7",
      "name": "赌跳 · 七级（4×六级）",
      "mode": "jackpot",
      "target": 7,
      "primary": 6,
      "inputs": [
        {
          "level": 6,
          "qty": 4
        }
      ],
      "fee": 40,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 1
        },
        {
          "level": 7,
          "chance": 0
        }
      ],
      "verified": false,
      "source": "7/8 级无稳定保底公式；模板用于爆率盈亏线",
      "note": "默认 0% 爆率，仅计算“要多少爆率才不亏”。请按游戏内面板或实测把七级概率改成实际值。"
    },
    {
      "id": "jack_8",
      "name": "赌跳 · 八级（15×六级）",
      "mode": "jackpot",
      "target": 8,
      "primary": 6,
      "inputs": [
        {
          "level": 6,
          "qty": 15
        }
      ],
      "fee": 100,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 1
        },
        {
          "level": 8,
          "chance": 0
        }
      ],
      "verified": false,
      "source": "7/8 级无稳定保底公式；模板用于爆率盈亏线",
      "note": "默认 0% 爆率；15 颗六级是常见的冲八模板，实际配方与爆率请按面板校准。"
    },
    {
      "id": "jack_8_alt",
      "name": "赌跳 · 八级（16×六级）",
      "mode": "jackpot",
      "target": 8,
      "primary": 6,
      "inputs": [
        {
          "level": 6,
          "qty": 16
        }
      ],
      "fee": 100,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 1
        },
        {
          "level": 8,
          "chance": 0
        }
      ],
      "verified": false,
      "source": "7/8 级无稳定保底公式；模板用于爆率盈亏线",
      "note": "填满 16 格的冲八模板；与 15 颗方案对比单次成本与盈亏线。"
    },
    {
      "id": "jack_8_from4",
      "name": "赌跳 · 4 精 6 冲八（12×四级）",
      "mode": "jackpot",
      "target": 8,
      "primary": 6,
      "inputs": [
        {
          "level": 4,
          "qty": 12
        }
      ],
      "fee": 18.24,
      "energy": 10,
      "outcomes": [
        {
          "level": 6,
          "chance": 0.9276
        },
        {
          "level": 5,
          "chance": 0.0724
        },
        {
          "level": 8,
          "chance": 0
        }
      ],
      "verified": false,
      "source": "2025-03 实验：252 次 4 精 6 未出 8",
      "note": "基础产出六级通常已盈利，八级是额外收益；252 次未出八，95% 置信上限约 1.2%。"
    }
  ]
};

#!/bin/bash
# 双击运行：把线上最新物价写进本地 Excel 工作簿，然后用 WPS 打开。
#
# WPS / LibreOffice 不支持 Power Query 和「全部刷新」，所以用这个脚本更新：
#   1. 从 Pages 下载最新 prices.csv（每 2 小时由网页/本地定时更新）
#   2. 只改工作簿「物价」表的数值，图表、格式、宏都保留
#   3. 打开时自动重算，WPS 里看到的收益就是新价格算出来的
#
# 用法：
#   - 直接双击（自动找 ~/Downloads、~/Desktop、~/Documents 里最新的「剑网3*.xlsx」）
#   - 或把工作簿拖到这个文件上
set -uo pipefail

BASE="$(cd "$(dirname "$0")/.." && pwd)"
PATCHER="$BASE/scripts/excel-patch-prices.py"
CSV_URL="https://cherishxie.github.io/JX3-AH-Calculator/prices.csv"

if [ ! -f "$PATCHER" ]; then
  echo "找不到 $PATCHER，请在项目目录内运行。"
  read -r -n 1 -s -p "按任意键关闭…"; echo
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "缺少 python3，请先安装（macOS 可用 xcode-select --install）。"
  read -r -n 1 -s -p "按任意键关闭…"; echo
  exit 1
fi

WB="${1:-}"
if [ -z "$WB" ]; then
  WB="$(find "$HOME/Downloads" "$HOME/Desktop" "$HOME/Documents" -maxdepth 3 \
        -type f -name '剑网3*.xls[xm]' ! -name '*-最新*' ! -name '*.bak' \
        -print0 2>/dev/null | xargs -0 stat -f '%m %N' 2>/dev/null \
        | sort -rn | head -n 1 | cut -d' ' -f2-)"
fi

if [ -z "$WB" ]; then
  WB="$(osascript -e 'POSIX path of (choose file with prompt "选择要刷新物价的工作簿" of type {"xlsx", "xlsm"})' 2>/dev/null || true)"
fi

if [ -z "$WB" ] || [ ! -f "$WB" ]; then
  echo "没有在 ~/Downloads、~/Desktop、~/Documents 找到工作簿。"
  echo "请把工作簿拖到这个文件上（也可以直接双击，在弹出对话框里选）。"
  if [ -f "$BASE/excel/剑网3技艺收益与突破.xlsx" ]; then
    echo "项目里有一份：$BASE/excel/剑网3技艺收益与突破.xlsx"
  fi
  read -r -n 1 -s -p "按任意键关闭…"; echo
  exit 1
fi

echo "工作簿：$WB"
echo "下载最新物价 …"
TMP_CSV="$(mktemp -t jx3-prices).csv"
if ! curl -fsSL --max-time 90 "$CSV_URL" -o "$TMP_CSV"; then
  rm -f "$TMP_CSV"
  echo "下载失败，请检查网络后重试（源：$CSV_URL）"
  read -r -n 1 -s -p "按任意键关闭…"; echo
  exit 1
fi

echo
python3 "$PATCHER" --workbook "$WB" --csv "$TMP_CSV" --in-place || {
  rm -f "$TMP_CSV"
  echo "写入失败：请先关闭 WPS 里打开的这个工作簿再试。"
  read -r -n 1 -s -p "按任意键关闭…"; echo
  exit 1
}
rm -f "$TMP_CSV"

echo
echo "提示：如果 WPS 已经打开这个文件，请先关闭再重新打开（或按 F9 重算）。"
if [ "${JX3_NO_OPEN:-0}" != "1" ]; then
  if [ -d /Applications/wpsoffice.app ]; then
    open -a /Applications/wpsoffice.app "$WB" 2>/dev/null || open "$WB"
  else
    open "$WB"
  fi
fi
read -r -n 1 -s -p "完成，按任意键关闭…"; echo

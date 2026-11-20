#!/usr/bin/env bash
# 安装 / 更新 macOS 本地物价兜底定时任务（launchd）。
#
# 背景：launchd 启动的进程读不到 ~/Documents（macOS TCC 隐私保护），
# 直接运行仓库里的脚本会以 exit 126 失败。因此这里把脚本与 deploy key
# 复制到 ~/.local/share/jx3-price-cron，plist 指向该副本，仓库文件只作源。
#
# 用法：
#   ./scripts/install-local-price-cron.sh          # 安装并注册
#   ./scripts/install-local-price-cron.sh --status # 只看状态
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${JX3_CRON_HOME:-$HOME/.local/share/jx3-price-cron}"
AGENT="com.cherish.jx3-price-cron"
PLIST="$HOME/Library/LaunchAgents/$AGENT.plist"
KEY_SRC="$REPO_DIR/.deploy-key/jx3_deploy"
UID_NUM="$(id -u)"

status() {
  launchctl print "gui/$UID_NUM/$AGENT" 2>/dev/null \
    | grep -E "state =|runs =|last exit code|path =" || echo "未安装"
}

if [ "${1:-}" = "--status" ]; then
  status
  exit 0
fi

if [ ! -f "$KEY_SRC" ]; then
  echo "缺少 deploy key：$KEY_SRC" >&2
  exit 1
fi

mkdir -p "$DEST" "$HOME/Library/LaunchAgents"
install -m 755 "$REPO_DIR/scripts/local-price-cron.sh" "$DEST/local-price-cron.sh"
install -m 600 "$KEY_SRC" "$DEST/jx3_deploy"

cat >"$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$AGENT</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>$DEST/local-price-cron.sh</string>
  </array>
  <key>WorkingDirectory</key>
  <string>$DEST</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>JX3_SSH_KEY</key>
    <string>$DEST/jx3_deploy</string>
    <key>JX3_REPO_URL</key>
    <string>ssh://git@github.com/cherishXie/JX3-AH-Calculator.git</string>
    <key>JX3_PRICE_CRON_DIR</key>
    <string>$HOME/.cache/jx3-price-cron</string>
    <key>JX3_PRICE_CRON_LOG</key>
    <string>/tmp/jx3-price-cron.log</string>
  </dict>
  <key>StartCalendarInterval</key>
  <array>
    <dict><key>Hour</key><integer>8</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>10</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>12</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>14</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>16</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>18</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>20</integer><key>Minute</key><integer>9</integer></dict>
    <dict><key>Hour</key><integer>22</integer><key>Minute</key><integer>9</integer></dict>
  </array>
  <key>StandardOutPath</key>
  <string>/tmp/jx3-price-cron.log</string>
  <key>StandardErrorPath</key>
  <string>/tmp/jx3-price-cron.err</string>
  <key>RunAtLoad</key>
  <false/>
  <key>ProcessType</key>
  <string>Background</string>
</dict>
</plist>
EOF

launchctl bootout "gui/$UID_NUM/$AGENT" 2>/dev/null || true
launchctl bootstrap "gui/$UID_NUM" "$PLIST"
echo "已注册 $AGENT（$PLIST）"
status
echo "触发时间：每天 08:09–22:09，每 2 小时一次；日志 /tmp/jx3-price-cron.log"

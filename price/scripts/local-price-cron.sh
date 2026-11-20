#!/usr/bin/env bash
# 本地兜底：在独立克隆里拉价、提交并通过 SSH deploy key 推送。
# 由 scripts/install-local-price-cron.sh 安装到 ~/.local/share/jx3-price-cron，
# launchd 每天 08:09–22:09 每 2 小时调用；不依赖 GitHub schedule。
# 不要用 launchd 直接执行本仓库路径：macOS TCC 会拦截，报 exit 126。
set -euo pipefail

SELF_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_URL="${JX3_REPO_URL:-ssh://git@github.com/cherishXie/JX3-AH-Calculator.git}"
SSH_KEY="${JX3_SSH_KEY:-$SELF_DIR/.deploy-key/jx3_deploy}"
CRON_DIR="${JX3_PRICE_CRON_DIR:-$HOME/.cache/jx3-price-cron}"
LOG="${JX3_PRICE_CRON_LOG:-/tmp/jx3-price-cron.log}"

export PATH="/usr/local/opt/node/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:${PATH:-}"
export GIT_SSH_COMMAND="ssh -i $SSH_KEY -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new"

log() { printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')" "$*" >> "$LOG"; }

if [ "${JX3_FORCE:-0}" != "1" ]; then
  hour=$(TZ=Asia/Shanghai date +%H)
  hour=$((10#$hour))
  if [ "$hour" -lt 8 ] || [ "$hour" -ge 23 ]; then
    log "outside 08:00-23:00 window, skip (set JX3_FORCE=1 to override)"
    exit 0
  fi
fi

if [ ! -f "$SSH_KEY" ]; then
  log "missing ssh key: $SSH_KEY"
  exit 1
fi

LOCK="${TMPDIR:-/tmp}/jx3-price-cron.lock"
if ! mkdir "$LOCK" 2>/dev/null; then
  log "another run is active, skip"
  exit 0
fi
trap 'rmdir "$LOCK" 2>/dev/null || true' EXIT

if [ ! -d "$CRON_DIR/.git" ]; then
  log "clone $REPO_URL -> $CRON_DIR"
  mkdir -p "$(dirname "$CRON_DIR")"
  git clone --depth=1 "$REPO_URL" "$CRON_DIR" >>"$LOG" 2>&1
fi

cd "$CRON_DIR"
git fetch --depth=1 origin main >>"$LOG" 2>&1
git reset --hard origin/main >>"$LOG" 2>&1

log "run price updater"
./scripts/update-prices.sh >>"$LOG" 2>&1

git add assets/data.js miniapp/src/shared/catalog.json minitool/assets/data.js scripts/jx3-item-map.json data/price-history "剑网三物价助手-minitool.zip"
if git diff --cached --quiet; then
  log "no price changes"
  exit 0
fi

git -c user.name="jx3-price-bot" -c user.email="jx3-price-bot@users.noreply.github.com" commit -m "chore: update JX3BOX prices (local cron)" >>"$LOG" 2>&1
git push origin main >>"$LOG" 2>&1
log "pushed price update"

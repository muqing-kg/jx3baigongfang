#!/usr/bin/env bash
# One-command release:
#   1. rebuild + audit the 小红书 minitool zip
#   2. build the GitHub Pages artifact (sanity check)
#   3. commit the tracked project files
#   4. push to origin/main -> deploy workflow publishes Pages + minitool artifact
#
# 小红书 still needs one manual submit after review; this script prints the
# exact commands (and the stable download URL) at the end.
set -euo pipefail
cd "$(dirname "$0")/.."

MSG="${1:-chore: sync web and minitool}"
if [ "$#" -gt 0 ]; then shift; fi
BRANCH="${BRANCH:-dev}"
REMOTE="${REMOTE:-origin}"

node scripts/test-changelog.mjs
node scripts/test-price-history.mjs
node scripts/test-trends.cjs
node miniapp/scripts/build-trends.mjs
node scripts/sync-breakthrough-model.mjs
node scripts/test-breakthrough.cjs
./scripts/build-minitool.sh
./scripts/build-site.sh

# Explicit paths: avoid committing the nested scaffold checkout and 8 MB
# delivery zip by accident.
if [ "$#" -gt 0 ]; then
  COMMIT_PATHS=("$@")
else
  COMMIT_PATHS=(
    index.html sw.js manifest.webmanifest icons assets minitool site content data miniapp brand docs screenshots scripts
    .github README.md MINITOOL.md DEPLOY.md LICENSE .gitignore .gitattributes
    AGENTS.md "剑网三物价助手-minitool.zip"
  )
  if [ -f CHANGELOG.md ]; then COMMIT_PATHS+=(CHANGELOG.md); fi
fi
git add -- "${COMMIT_PATHS[@]}"

if git diff --cached --quiet -- "${COMMIT_PATHS[@]}"; then
  echo "nothing to commit"
else
  # --only prevents unrelated already-staged files from entering this release.
  git commit --only -m "$MSG" -- "${COMMIT_PATHS[@]}"
fi

# Prefer an explicit GH_CONFIG_DIR, then the repo-local one used in sandboxes,
# then the user's normal ~/.config/gh.
GH_DIR="${GH_CONFIG_DIR:-}"
if [ -z "$GH_DIR" ] && [ -d "$PWD/.gh-config" ]; then GH_DIR="$PWD/.gh-config"; fi

if command -v gh >/dev/null 2>&1; then
  if [ -n "$GH_DIR" ]; then export GH_CONFIG_DIR="$GH_DIR"; fi
  if gh auth status >/dev/null 2>&1; then
    git -c credential.helper='!gh auth git-credential' push -u "$REMOTE" "$BRANCH"
  else
    echo "gh is not logged in; falling back to your git credential helper" >&2
    git push -u "$REMOTE" "$BRANCH"
  fi
else
  echo "gh not installed; falling back to your git credential helper" >&2
  git push -u "$REMOTE" "$BRANCH"
fi

cat <<EOF

已推送 ${BRANCH}，GitHub Actions 正在执行：
  Dev 在线版: https://cherishxie.github.io/JX3-AH-Calculator/dev/
  生产站:    https://cherishxie.github.io/JX3-AH-Calculator/
  小工具包:  https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-minitool.zip
  Actions:   https://github.com/cherishXie/JX3-AH-Calculator/actions

小红书小工具（需手动提交审核）：
  1. 手机打开上面的「小工具包」下载 zip，或从 Actions artifact 下载
  2. npm i -g redskillhub-upload && redapp login --agent
  3. redapp upload --file "剑网三物价助手-minitool.zip" --type pkg --agent --dry-run
  4. 按 redapp 回执完成 preview / submit（先扫码预览，再送审）
  审核通过后在创作服务平台点发布，再挂到笔记
EOF

#!/usr/bin/env bash
# Validate the offline minitool sources and rebuild the uploadable zip.
# Zip root must be index.html (小红书小工具 requirement).
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="剑网三物价助手-minitool.zip"
ZIP_LIMIT=$((10 * 1024 * 1024))

node scripts/sync-breakthrough-model.mjs
node scripts/check-minitool.mjs

rm -f "$OUT"
(
  cd minitool
  zip -rX "../$OUT" index.html assets -x '*.DS_Store' >/dev/null
)

if ! unzip -l "$OUT" | awk '{print $4}' | grep -qx 'index.html'; then
  echo "ERROR: zip root is missing index.html" >&2
  exit 1
fi
if unzip -l "$OUT" | grep -q '__MACOSX'; then
  echo "ERROR: zip contains __MACOSX metadata" >&2
  exit 1
fi

BYTES=$(wc -c < "$OUT" | tr -d ' ')
if [ "$BYTES" -gt "$ZIP_LIMIT" ]; then
  echo "ERROR: zip is $BYTES bytes (limit $ZIP_LIMIT)" >&2
  exit 1
fi

SHA=$(python3 - "$OUT" <<'PY'
import hashlib, sys
h = hashlib.sha256()
with open(sys.argv[1], 'rb') as f:
    for chunk in iter(lambda: f.read(1024 * 1024), b''):
        h.update(chunk)
print(h.hexdigest())
PY
)

printf 'built %s (%s KiB, sha256 %s)\n' "$OUT" "$((BYTES / 1024))" "${SHA:0:12}"

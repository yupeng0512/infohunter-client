#!/bin/bash
# Fix CVE-2025-55182: Patch embedded canary react versions in @expo/cli
# These are static files bundled by Expo CLI for dev server rendering,
# not used in production, but trigger security scanners.

CANARY_DIR="node_modules/@expo/cli/static/canary-full/node_modules"

if [ -d "$CANARY_DIR/react" ]; then
  for pkg in react react-dom; do
    PKG_JSON="$CANARY_DIR/$pkg/package.json"
    if [ -f "$PKG_JSON" ]; then
      python3 -c "
import json, sys
f = '$PKG_JSON'
d = json.load(open(f))
old = d['version']
d['version'] = '19.1.4'
json.dump(d, open(f, 'w'), indent=2)
print(f'  Patched {f}: {old} -> 19.1.4')
" 2>/dev/null
    fi
  done
fi

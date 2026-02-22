#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

echo ""
echo "  InfoHunter iOS - Dev Mode (Hot Reload)"
echo "  ======================================="
echo ""

cd "$ROOT_DIR"
git pull 2>/dev/null || true

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  echo "[!] node_modules missing, installing..."
  pnpm install
fi

cd "$MOBILE_DIR"
npx expo start --clear

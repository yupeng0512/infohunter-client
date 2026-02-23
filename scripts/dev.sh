#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

MODE="${1:---dev-client}"

echo ""
echo "  InfoHunter iOS - Dev Mode (Hot Reload)"
echo "  ======================================="
echo "  Mode: $MODE"
echo ""

cd "$ROOT_DIR"
git pull 2>/dev/null || true

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  echo "[!] node_modules missing, installing..."
  pnpm install
fi

cd "$MOBILE_DIR"

if [ ! -d "ios" ] && [ "$MODE" = "--dev-client" ]; then
  echo "[!] ios/ 目录不存在，Development Build 需要先执行:"
  echo "    pnpm ios:rebuild"
  echo ""
  echo "  或切换到 Expo Go 模式:"
  echo "    pnpm ios:dev -- --go"
  exit 1
fi

npx expo start --clear "$MODE"

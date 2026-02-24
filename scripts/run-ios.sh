#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

echo "▶ InfoHunter iOS 快速启动"
echo "========================="

cd "$ROOT_DIR"
git stash 2>/dev/null || true
git pull 2>/dev/null || true

if [ ! -d "$ROOT_DIR/node_modules" ]; then
  echo "[!] node_modules missing, installing..."
  pnpm install
fi

cd "$MOBILE_DIR"

if [ ! -d "ios" ]; then
  echo "[!] ios/ 目录不存在，执行 prebuild..."
  npx expo prebuild --platform ios --clean --no-install
  echo "[*] Installing CocoaPods..."
  cd ios && pod install && cd ..
fi

npx expo run:ios

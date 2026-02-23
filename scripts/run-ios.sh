#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

echo "▶ InfoHunter iOS 快速启动"
echo "========================="

cd "$ROOT_DIR"
git pull 2>/dev/null || true

cd "$MOBILE_DIR"

# 如果 ios/ 目录不存在，自动 prebuild
if [ ! -d "ios" ]; then
  echo "[!] ios/ 目录不存在，执行 prebuild..."
  npx expo prebuild --platform ios --no-install
  echo "[*] Installing CocoaPods..."
  cd ios && pod install --verbose && cd ..
fi

npx expo run:ios

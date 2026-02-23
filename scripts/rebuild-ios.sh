#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

echo ""
echo "  InfoHunter iOS - Full Rebuild"
echo "  ============================="
echo ""

echo "[1/6] Pull latest..."
cd "$ROOT_DIR"
git pull || { echo "[!] git pull failed, continuing with local code"; }

echo ""
echo "[2/6] Clean all build artifacts..."
rm -rf "$ROOT_DIR/node_modules"
rm -rf "$MOBILE_DIR/node_modules"
rm -rf "$MOBILE_DIR/ios"
rm -rf "$MOBILE_DIR/.expo"
rm -rf "$ROOT_DIR/packages/shared/node_modules"
rm -rf "$ROOT_DIR/apps/web/node_modules"

echo ""
echo "[3/6] Install dependencies..."
cd "$ROOT_DIR"
pnpm install

echo ""
echo "[4/6] Generate iOS native project..."
cd "$MOBILE_DIR"
npx expo prebuild --platform ios --no-install

echo ""
echo "[5/6] Install CocoaPods (verbose)..."
cd "$MOBILE_DIR/ios"
pod install --verbose

echo ""
echo "[6/6] Build & launch simulator..."
cd "$MOBILE_DIR"
npx expo run:ios

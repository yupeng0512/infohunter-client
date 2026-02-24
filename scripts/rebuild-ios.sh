#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

echo ""
echo "  InfoHunter iOS - Full Rebuild"
echo "  ============================="
echo "  Root:   $ROOT_DIR"
echo "  Mobile: $MOBILE_DIR"
echo ""

echo "[1/7] Pull latest..."
cd "$ROOT_DIR"
git stash 2>/dev/null || true
git pull || { echo "[!] git pull failed, continuing with local code"; }

echo ""
echo "[2/7] Clean all build artifacts..."
rm -rf "$MOBILE_DIR/ios"
rm -rf "$MOBILE_DIR/.expo"
rm -rf "$MOBILE_DIR/node_modules"
rm -rf "$ROOT_DIR/node_modules"
rm -rf "$ROOT_DIR/packages/shared/node_modules"
rm -rf "$ROOT_DIR/apps/web/node_modules"

echo ""
echo "[3/7] Install dependencies..."
cd "$ROOT_DIR"
pnpm install

echo ""
echo "[4/7] Generate iOS native project..."
cd "$MOBILE_DIR"
npx expo prebuild --platform ios --clean --no-install

echo ""
echo "[5/7] Verify prebuild..."
if [ ! -f "$MOBILE_DIR/ios/Podfile" ]; then
  echo "❌ prebuild failed: ios/Podfile not found"
  exit 1
fi
BUNDLE_ID=$(grep -o 'com\.[a-zA-Z.]*' "$MOBILE_DIR/ios/InfoHunter.xcodeproj/project.pbxproj" 2>/dev/null | head -1)
echo "  Bundle ID: ${BUNDLE_ID:-unknown}"
if [ "$BUNDLE_ID" = "com.anonymous" ] || [ -z "$BUNDLE_ID" ]; then
  echo "❌ prebuild generated wrong bundle ID. Check apps/mobile/app.json"
  exit 1
fi
echo "  ✅ prebuild OK"

echo ""
echo "[6/7] Install CocoaPods..."
cd "$MOBILE_DIR/ios"
pod install

echo ""
echo "[7/7] Build & launch simulator..."
cd "$MOBILE_DIR"
npx expo run:ios

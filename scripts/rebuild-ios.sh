#!/bin/bash
set -e

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MOBILE_DIR="$ROOT_DIR/apps/mobile"

echo "🔄 InfoHunter iOS 重构建"
echo "========================"

# Step 1: Pull latest
echo ""
echo "[1/5] 拉取最新代码..."
cd "$ROOT_DIR"
git pull

# Step 2: Clean
echo ""
echo "[2/5] 清理旧构建产物..."
rm -rf "$ROOT_DIR/node_modules"
rm -rf "$MOBILE_DIR/node_modules"
rm -rf "$MOBILE_DIR/ios"
rm -rf "$MOBILE_DIR/.expo"

# Step 3: Install
echo ""
echo "[3/5] 安装依赖..."
cd "$ROOT_DIR"
pnpm install

# Step 4: Prebuild
echo ""
echo "[4/5] 生成 iOS 原生项目..."
cd "$MOBILE_DIR"
npx expo prebuild --platform ios

# Step 5: Build & Run
echo ""
echo "[5/5] 编译并启动 iOS 模拟器..."
npx expo run:ios

echo ""
echo "✅ 完成"

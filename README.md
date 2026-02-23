# InfoHunter Client

InfoHunter AI 社交媒体智能监控系统 - 双端客户端（Monorepo 架构）

- **App 端 (iOS/Android)**: React Native + Expo — 近原生体验，信息流浏览、AI 分析、推送通知
- **Web 管理端**: React + Vite — 桌面端完整管理面板
- **共享层**: TypeScript 类型定义 + API Client + 业务 Hooks（两端复用）

## 项目结构

```
infohunter-client/
├── apps/
│   ├── mobile/                 # React Native (Expo) iOS/Android App
│   │   ├── app/                # Expo Router 文件路由
│   │   │   ├── (tabs)/         # 底部 Tab 导航
│   │   │   │   ├── index.tsx   #   首页仪表盘
│   │   │   │   ├── feed.tsx    #   信息流（FlashList 高性能列表）
│   │   │   │   ├── subscriptions.tsx  # 订阅管理（CRUD）
│   │   │   │   └── settings.tsx      # 设置
│   │   │   ├── content/[id].tsx      # 内容详情 + AI 分析
│   │   │   ├── subscription/create.tsx # 创建订阅（Modal）
│   │   │   └── analyze/index.tsx     # AI 即时分析（Modal）
│   │   └── components/         # App 专用 UI 组件
│   │
│   └── web/                    # Web 管理端 (Vite + React)
│       └── src/
│           ├── pages/          # 5 个页面（概览/内容/订阅/成本/设置）
│           ├── App.tsx         # 侧边栏导航 + 路由
│           └── main.tsx        # 入口
│
├── packages/
│   └── shared/                 # 共享层（两端复用）
│       └── src/
│           ├── types/          # TypeScript 类型定义（完整覆盖 20+ API）
│           ├── api/            # Axios API Client + 全部端点封装
│           ├── hooks/          # TanStack Query Hooks（5 个模块）
│           └── utils/          # 格式化工具
│
├── package.json                # Monorepo 根配置
└── pnpm-workspace.yaml         # pnpm workspace
```

## 安全补丁

本项目通过 `pnpm patch` 修补了 react-native 0.81.5 的 renderer 版本检查，使其兼容 react 19.1.4（CVE-2025-55182 安全修复版本）。`pnpm install` 时会自动应用 `patches/react-native@0.81.5.patch`。

**重要**：不要将 react 降级到 19.1.4 以下，不要删除 `patches/` 目录。

## 环境要求

| 工具 | 版本 | 用途 |
|------|------|------|
| Node.js | >= 18 | 运行时 |
| pnpm | >= 8 | 包管理器（Monorepo） |
| Xcode | >= 15 | iOS 本地构建（Mac 必需） |
| Expo CLI | 自动安装 | App 开发服务器 |
| InfoHunter 后端 | 运行中 | 提供 REST API |

## 在 Mac 上运行 iOS App（完整步骤）

### 第 1 步：安装 pnpm（如果没有）

```bash
npm install -g pnpm
```

### 第 2 步：克隆仓库并安装依赖

```bash
git clone https://github.com/yupeng0512/infohunter-client.git
cd infohunter-client
pnpm install
```

### 第 3 步：配置后端地址

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

编辑 `apps/mobile/.env`，将 API 地址改为你的 InfoHunter 后端地址：

```
EXPO_PUBLIC_API_URL=http://你的服务器IP:8000
```

### 第 4 步：生成 iOS 原生项目

```bash
cd apps/mobile
npx expo prebuild --platform ios
```

这会在 `apps/mobile/ios/` 下生成完整的 Xcode 项目。

### 第 5 步：用 Xcode 打开并运行

```bash
# 方式一：命令行打开 Xcode
open ios/InfoHunter.xcworkspace

# 方式二：直接在 Xcode 中 File → Open → 选择 ios/InfoHunter.xcworkspace
```

在 Xcode 中：
1. 选择顶部的目标设备（iPhone 模拟器 或 连接的真机）
2. 点击 ▶ 按钮运行

### 第 6 步（可选）：Expo 开发模式

如果想要热重载开发体验（改代码实时刷新），可以用 Expo 开发服务器：

```bash
# Development Build 模式（推荐，需先完成第 4-5 步）
cd apps/mobile
pnpm start

# 或 Expo Go 模式（无需编译原生代码）
pnpm start:go
```

也可以从项目根目录执行：

```bash
pnpm ios            # 一键启动（自动 prebuild + 编译 + Simulator）
pnpm ios:rebuild    # 完全重建（清理一切 → 重装 → 重新编译）
pnpm ios:dev        # 仅启动 Metro（App 已安装时使用）
```

## Expo 是什么？

**Expo 是 React Native 的增强工具链**，它不是一个独立的 App 框架，而是让 React Native 开发更高效的一套工具集：

| 功能 | 说明 |
|------|------|
| `expo prebuild` | 自动生成 Xcode/Android Studio 原生项目，免去手动配置 |
| `expo start` | 开发服务器，支持热重载（改代码实时刷新到手机/模拟器） |
| `expo-router` | 文件路由系统（类似 Next.js，创建文件 = 创建页面） |
| `expo-notifications` | 开箱即用的推送通知 API |
| `eas build` | 云端构建服务（可选，免费 30 次/月） |

**你不需要额外安装 Expo**，运行 `npx expo` 时会自动处理。Xcode 仍然是最终编译和运行 iOS App 的工具。

## Web 管理端

```bash
# 在项目根目录
pnpm dev:web
# 浏览器访问 http://localhost:3000
```

Vite 已配置 API 代理到 `http://localhost:8000`，确保后端运行中。

## 构建发布

### iOS 本地构建（推荐日常开发）

```bash
cd apps/mobile
npx expo prebuild --platform ios
npx expo run:ios
```

### iOS 云端构建（正式发布）

```bash
cd apps/mobile
npx eas build --platform ios
npx eas submit --platform ios
```

### Web 生产构建

```bash
pnpm build:web
# 产物在 apps/web/dist/
```

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| App 框架 | React Native + Expo SDK 54 | 近原生渲染，非 WebView |
| App 路由 | Expo Router v6 | 文件路由，类似 Next.js |
| App 列表 | FlashList | 高性能虚拟列表（替代 FlatList） |
| Web 构建 | Vite 7 | 极速 HMR + 生产构建 |
| Web UI | Tailwind CSS v4 | 原子化 CSS |
| 数据管理 | TanStack Query v5 | 服务端状态缓存 + 自动刷新 |
| 客户端状态 | Zustand | 轻量客户端状态管理 |
| 语言 | TypeScript | 全栈类型安全 |
| 包管理 | pnpm Workspace | Monorepo 依赖管理 |
| 后端 | FastAPI (Python) | 现有 20+ REST API 端点 |

## 后端配套改动

本项目在 InfoHunter 后端新增了以下内容：

- `src/notification/push_service.py` — 设备注册 + APNs 推送服务
- `src/api.py` 新增 3 个端点：
  - `POST /api/devices/register` — 注册设备推送 Token
  - `DELETE /api/devices/{device_id}` — 注销设备
  - `GET /api/devices` — 列出活跃设备

## 成本

| 项目 | 费用 |
|------|------|
| Apple Developer Program | 688 元/年 |
| Google Play（Phase 2） | ~180 元（一次性） |
| Expo EAS Build | 免费（30 次/月） |
| APNs / FCM 推送 | 免费 |
| **首年总计** | **~868 元** |

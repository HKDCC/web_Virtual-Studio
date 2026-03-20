# Virtual Studio 文档 / Virtual Studio Documentation

> A Notion-powered personal studio website / 一个基于 Notion 的个人工作室网站

---

## 目录 / Table of Contents

1. [项目概述 / Project Overview](#1-项目概述--project-overview)
2. [构建指南 / Build Guide](#2-构建指南--build-guide)
3. [功能详解 / Features](#3-功能详解--features)
4. [配置参考 / Configuration](#4-配置参考--configuration)

---

## 1. 项目概述 / Project Overview

### 1.1 项目简介 / Introduction

**Virtual Studio** 是一个基于 Notion 的个人知识管理与效率工具网站。它将 Notion 作为无头 CMS（Headless CMS），所有内容存储在 Notion 数据库中，通过 Next.js 进行动态渲染，最终部署在 Cloudflare Pages 上。

**Virtual Studio** is a Notion-powered personal knowledge management and productivity hub website. It uses Notion as a headless CMS, storing all content in Notion databases, rendering dynamically via Next.js, and deploying on Cloudflare Pages.

### 1.2 技术栈 / Tech Stack

| 类别 / Category | 技术 / Technology | 版本 / Version |
|-----------------|-------------------|----------------|
| 框架 / Framework | Next.js (App Router) | 15.5.2 |
| UI 库 / UI Library | React | 19.1.1 |
| 语言 / Language | TypeScript | 5.9.2 |
| 内容管理 / CMS | Notion API | @notionhq/client |
| 部署平台 / Deployment | Cloudflare Pages | - |
| Next.js 适配器 / Adapter | @opennextjs/cloudflare | - |
| 数据验证 / Validation | Zod | - |
| 样式方案 / Styling | Plain CSS + CSS Variables | - |

### 1.3 目录结构 / Directory Structure

```
virtual-studio/
├── src/
│   ├── app/                      # Next.js App Router 页面
│   │   ├── layout.tsx           # 根布局（字体、提供商、头部）
│   │   ├── page.tsx             # 首页（模块网格）
│   │   ├── globals.css          # 全局样式
│   │   ├── archive/             # 归档页（书籍和笔记）
│   │   ├── lab/                 # 实验室页（AI 实验）
│   │   ├── workflow/            # 工作流页（效率工具）
│   │   ├── pause/               # 暂停页（生活）
│   │   ├── changelog/           # 更新日志页
│   │   ├── p/[id]/              # 动态文章页
│   │   └── api/                 # API 路由
│   │       ├── search/          # 搜索功能
│   │       └── revalidate/     # 缓存重新验证
│   ├── components/              # React 组件
│   │   ├── SiteHeader.tsx       # 网站导航头部
│   │   ├── SiteFooter.tsx       # 网站底部
│   │   ├── ThemeProvider.tsx    # 主题上下文
│   │   ├── NotionBlocks.tsx     # Notion 内容渲染器
│   │   ├── NotionToggle.tsx     # 折叠组件
│   │   ├── TableOfContents.tsx  # 文章目录
│   │   └── archive/|lab/|workflow/  # 各页面专用组件
│   └── lib/                     # 工具库
│       ├── notion.ts            # Notion API 客户端
│       ├── notionHelpers.ts     # Notion 辅助函数
│       └── env.ts               # 环境变量验证
├── scripts/                     # 实用脚本
├── public/                      # 静态资源
├── package.json                 # 依赖管理
├── next.config.ts              # Next.js 配置
├── open-next.config.ts         # OpenNext 配置
├── wrangler.toml               # Cloudflare 配置
└── tsconfig.json               # TypeScript 配置
```

---

## 2. 构建指南 / Build Guide

### 2.1 环境要求 / Environment Requirements

- **Node.js**: >= 18.x
- **npm** / **pnpm** / **yarn**: 最新稳定版
- **Notion 集成**: 需要在 Notion 创建集成并获取 Token
- **Cloudflare 账号**: 用于部署（可选）

### 2.2 安装步骤 / Installation

```bash
# 1. 克隆项目 / Clone the project
git clone <repository-url>
cd virtual-studio

# 2. 安装依赖 / Install dependencies
npm install

# 3. 配置环境变量 / Configure environment variables
cp .env.local.example .env.local
# 编辑 .env.local 填写你的 Notion Token 和数据库 ID

# 4. 启动开发服务器 / Start development server
npm run dev
```

### 2.3 开发命令 / Development Commands

| 命令 / Command | 描述 / Description |
|---------------|-------------------|
| `npm run dev` | 启动开发服务器 / Start dev server |
| `npm run build` | 构建生产版本 / Build for production |
| `npm run start` | 启动生产服务器 / Start production server |
| `npm run preview` | 预览 Cloudflare 构建 / Preview Cloudflare build |
| `npm run deploy` | 部署到 Cloudflare / Deploy to Cloudflare |
| `npm run lint` | 运行 ESLint 检查 / Run ESLint |
| `npm run typecheck` | 运行 TypeScript 类型检查 / Run TypeScript check |

### 2.4 部署流程 / Deployment

本项目使用 **@opennextjs/cloudflare** 将 Next.js 应用适配到 Cloudflare Pages。

```bash
# 1. 配置 wrangler.toml 中的项目名称
# Configure project name in wrangler.toml

# 2. 构建并部署 / Build and deploy
npm run deploy

# 或分步操作 / Or step by step:
npx opennextjs-cloudflare build
npx opennextjs-cloudflare deploy
```

---

## 3. 功能详解 / Features

### 3.1 页面功能 / Pages

#### 首页 / Homepage (`/`)

首页展示网站概览，以模块网格的形式呈现各个主要版块：

- **Hero 区域**: 网站标语和简介
- **模块网格**: 6 个卡片链接到不同页面
  - 归档 / Archive
  - 实验室 / Lab
  - 工作流 / Workflow
  - 暂停 / Pause
  - 更新日志 / Changelog
  - 笔记 / Notes

---

#### 归档页 / Archive (`/archive`)

展示个人的书籍和笔记收藏，采用标签页切换：

| 标签 / Tab | 内容 / Content |
|-----------|----------------|
| 电子书架 / Library | 个人书籍收藏，展示封面、作者、标签 |
| 文档&笔记 / Notes | 笔记列表，展示分类、日期、摘要、标签 |

---

#### 实验室页 / Lab (`/lab`)

AI 实践和 Vibe Coding 项目展示：

| 标签 / Tab | 内容 / Content |
|-----------|----------------|
| AI 实践 / AI Practice | AI 相关项目和实验 |
| Vibe Coding | 编程和开发相关项目 |

每个项目卡片包含：图标、描述、GitHub 链接、演示链接

---

#### 工作流页 / Workflow (`/workflow`)

效率工具和资源集合，包含四个板块：

| 板块 / Section | 描述 / Description |
|---------------|-------------------|
| 效率工具 / Tools | 精选效率工具，带图标和描述 |
| 网站推荐 / Websites | 优质网站推荐，带星级评分 |
| 装备清单 / Setup | 装备/工具展示，支持轮播 |
| AI 提示词库 / Prompts | AI 提示词收藏，支持展开/收起 |

---

#### 暂停页 / Pause (`/pause`)

生活方式和照片展示：

- **瀑布流布局** / Masonry layout
- 每项包含：颜色主题、日期、地点、标题
- 照片画廊展示生活瞬间

---

#### 更新日志 / Changelog (`/changelog`)

网站更新历史时间线：

- 按年份分组 / Grouped by year
- 标签类型：修复 / fix、新功能 / feat、新增 / add
- 可链接到详细条目

---

#### 文章页 / Post (`/p/[id]`)

动态渲染 Notion 页面内容：

- 支持丰富的 Notion 块类型
- 自动生成文章目录 / Auto-generated TOC
- 书籍详情页特殊处理

### 3.2 Notion 内容支持 / Notion Block Support

`NotionBlocks.tsx` 组件支持以下块类型：

| 块类型 / Block Type | 渲染组件 / Component |
|-------------------|---------------------|
| 标题 / Headings | h1, h2, h3 |
| 段落 / Paragraphs | p |
| 代码块 / Code | pre + code |
| 引用 / Quotes | blockquote |
| 提示 / Callouts | div with icon |
| 列表 / Lists | ul, ol |
| 折叠 / Toggles | NotionToggle |
| 表格 / Tables | table |
| 图片 / Images | img |
| 分隔线 / Dividers | hr |

### 3.3 主题系统 / Theme System

支持明暗主题切换：

- **实现方式**: CSS 变量 + ThemeProvider Context
- **切换方式**: SiteHeader 中的主题切换按钮
- **持久化**: LocalStorage 存储用户偏好
- **配色方案** / Color Scheme:

**浅色主题 / Light Theme:**
```css
--bg: #fdfcf8;
--bg-2: #f5f3ee;
--bg-3: #ede9e0;
--ink: #1d1d1f;
--ink-2: #6e6e73;
--ink-3: #aeaeb2;
--accent: #8b7355;
--accent-soft: #c4a882;
--accent-pale: #f0e8da;
```

### 3.4 搜索功能 / Search

- **位置**: SiteHeader 中的搜索框
- **实现**: 客户端搜索组件，调用 `/api/search`
- **搜索范围**: 笔记和书籍
- **结果显示**: 标题和类型

### 3.5 API 路由 / API Routes

| 路由 | 方法 | 描述 |
|------|------|------|
| `/api/search` | GET | 搜索笔记和书籍 |
| `/api/revalidate` | POST | 重新验证缓存（需要 Token） |

---

## 4. 配置参考 / Configuration

### 4.1 环境变量 / Environment Variables

```env
# Notion 配置 / Notion Configuration
NOTION_TOKEN=secret_xxxxx           # Notion 集成 Token

# 数据库 ID / Database IDs
NOTION_NOTES_DB_ID=xxxxx            # 笔记数据库
NOTION_BOOKS_DB_ID=xxxxx           # 书籍数据库
NOTION_WORKFLOW_DB_ID=xxxxx        # 工作流数据库
NOTION_LAB_DB_ID=xxxxx             # 实验室数据库
NOTION_PAUSE_DB_ID=xxxxx           # 暂停/生活数据库
NOTION_CHANGELOG_DB_ID=xxxxx       # 更新日志数据库

# 验证 Token / Revalidation Token
REVALIDATE_TOKEN=xxxxx             # 缓存重新验证 Token
```

### 4.2 Notion 数据库配置 / Notion Database Schema

每个 Notion 数据库应包含以下属性：

**笔记数据库 (Notes)**
| 属性名 / Property | 类型 / Type | 描述 / Description |
|-------------------|-------------|-------------------|
| Name | Title | 笔记标题 |
| Category | Select | 分类 |
| Tags | Multi-select | 标签 |
| Date | Date | 日期 |
| Status | Select | 状态 |

**书籍数据库 (Books)**
| 属性名 / Property | 类型 / Type | 描述 / Description |
|-------------------|-------------|-------------------|
| Name | Title | 书名 |
| Author | Rich text | 作者 |
| Tags | Multi-select | 标签 |
| Rating | Number | 评分 |
| Status | Select | 阅读状态 |

### 4.3 Cloudflare 配置 / Cloudflare Configuration

`wrangler.toml` 关键配置：

```toml
name = "webvirtualstudio"
compatibility_date = "2025-09-27"
compatibility_flags = ["nodejs_compat"]
observability.enabled = true
```

### 4.4 字体配置 / Font Configuration

网站使用 Google Fonts：

| 字体 / Font | 用途 / Purpose |
|------------|---------------|
| DM Mono | 代码/等宽文本 |
| Noto Sans SC | 中文无衬线 |
| Noto Serif SC | 中文衬线 |

字体配置在 `src/app/layout.tsx` 中。

---

## 附录 / Appendix

### A. 组件列表 / Component List

| 组件 / Component | 文件 / File | 功能 / Function |
|-----------------|-------------|----------------|
| SiteHeader | components/SiteHeader.tsx | 导航头部 |
| SiteFooter | components/SiteFooter.tsx | 底部信息 |
| ThemeProvider | components/ThemeProvider.tsx | 主题上下文 |
| NotionBlocks | components/NotionBlocks.tsx | Notion 内容渲染 |
| NotionToggle | components/NotionToggle.tsx | 折叠组件 |
| TableOfContents | components/TableOfContents.tsx | 文章目录 |
| ArchiveTabs | components/archive/ArchiveTabs.tsx | 归档标签页 |
| LabTabs | components/lab/LabTabs.tsx | 实验室标签页 |
| WorkflowTabs | components/workflow/WorkflowTabs.tsx | 工作流标签页 |

### B. 工具函数 / Utility Functions

| 函数 / Function | 文件 / File | 描述 / Description |
|----------------|-------------|-------------------|
| queryDatabaseAll | lib/notion.ts | 分页查询 Notion 数据库 |
| listBlockChildrenAll | lib/notion.ts | 分页获取块内容 |
| getPageTitle | lib/notionHelpers.ts | 获取页面标题 |
| getRichText | lib/notionHelpers.ts | 获取富文本 |
| getSelect | lib/notionHelpers.ts | 获取单选属性 |
| getMultiSelect | lib/notionHelpers.ts | 获取多选属性 |
| getDate | lib/notionHelpers.ts | 获取日期属性 |

### C. 常用命令速查 / Quick Commands Reference

```bash
# 开发 / Development
npm run dev

# 构建 / Build
npm run build

# 部署 / Deploy
npm run deploy

# 类型检查 / Type Check
npm run typecheck

# 代码检查 / Lint
npm run lint
```

---

*文档版本 / Documentation Version: 1.0*
*最后更新 / Last Updated: 2026-03-19*

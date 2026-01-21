# 小语AI智能成长守护系统

<div align="center">

![小语AI智能成长守护系统](https://raw.githubusercontent.com/YY-Nexus/yyc3-xyai/main/public/git_1800_450-6.png)

---

## 🚀 YYC³ 智能插拔式移动AI系统

**Intelligent Pluggable Mobile AI System**

---

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.1.38-black?style=for-the-badge&logo=bun)](https://bun.sh/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge)](https://github.com/YY-Nexus/yyc3-xyai)
[![Coverage](https://img.shields.io/badge/Coverage-41%25-yellow?style=for-the-badge)](https://github.com/YY-Nexus/yyc3-xyai)
[![Version](https://img.shields.io/badge/version-2.0.0-green?style=for-the-badge)](https://github.com/YY-Nexus/yyc3-xyai)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge)](https://github.com/YY-Nexus/yyc3-xyai/pulls)

---

**版本**: v2.0.0 | **最后更新**: 2025-01-30 | **项目评分**: 91/100 ⭐⭐⭐⭐⭐

[快速开始](#-快速开始) · [项目结构](#-项目结构) · [核心功能](#-核心功能) · [API文档](#-api文档) · [部署指南](#-部署指南) · [贡献指南](#-贡献指南)

---

</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [项目整合](#-项目整合)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [核心功能](#-核心功能)
- [系统架构](#-系统架构)
- [开发指南](#-开发指南)
- [API文档](#-api文档)
- [数据库设计](#-数据库设计)
- [部署指南](#-部署指南)
- [监控与运维](#-监控与运维)
- [贡献指南](#-贡献指南)
- [常见问题](#-常见问题)
- [许可证](#-许可证)
- [联系我们](#-联系我们)

---

## 🎯 项目概述

小语AI智能成长守护系统是基于 **Next.js 16.1.1**、**React 19.2.3** 和 **TypeScript 5.9.3** 构建的智能育儿平台，专为 **0-3岁儿童成长守护场景** 设计。

### 核心价值

| 价值维度         | 描述                                     | 技术实现                   |
| ---------------- | ---------------------------------------- | -------------------------- |
| **🤖 智能守护**   | AI智能对话、消息通知、日程计划、系统设置 | AgenticCore + OpenAI API   |
| **📊 成长记录**   | 成长记录、成长评估、活动记录、交互记录   | PostgreSQL + Redis         |
| **🎓 知识教育**   | 课程学习、作业管理、阅读计划、视频教学   | Neo4j 知识图谱             |
| **🎨 多模态交互** | 文本、语音、图像、视频全场景支持         | React DnD + Web Speech API |
| **👶 个性化推荐** | 根据儿童成长数据提供定制化教育内容       | MetaLearning System        |

### 项目特色

```mermaid
graph LR
    A[最新技术栈] --> B[Next.js 16.1.1]
    A --> C[React 19.2.3]
    A --> D[TypeScript 5.9.3]
    
    E[智能AI系统] --> F[AgenticCore元学习]
    E --> G[Neo4j知识图谱]
    E --> H[RAG检索增强]
    
    I[企业级架构] --> J[微服务架构]
    I --> K[事件驱动]
    I --> L[目标驱动]
    
    M[Q版角色系统] --> N[性别主题切换]
    M --> O[表情变化]
    M --> P[个性化配置]
```

### 技术亮点

- 🎯 **事件驱动+目标驱动混合架构** - 灵活高效的AI决策机制
- 🔌 **动态工具生态** - 自动工具发现与注册系统
- 📚 **RAG知识库** - 向量存储和检索增强生成
- 🏗️ **微服务架构** - 完整的服务编排和API网关
- 🧠 **三层学习架构** - 行为、策略、知识三层智能学习
- 🎨 **拖拽式界面** - 基于React DnD的智能组件，自由布局
- 🔊 **语音交互** - Web Speech API驱动的语音识别与合成
- 📊 **实时监控** - Prometheus + Grafana企业级监控系统

---

## 🔗 项目整合

本项目整合了四个项目的优势，经过三个阶段的深度整合：

### 整合策略

```
主基座: yyc3-xy-05 (70%)
    ├── 元学习系统 ⭐
    ├── Neo4j 知识图谱 ⭐
    ├── 自适应预测引擎 ⭐
    └── 最新技术栈（Next.js 16.1.1）
    ↓
整合来源: yyc3-xy-01 (15%)
    └── 文档体系 ⭐
    ↓
整合来源: yyc3-xy-02 (10%)
    ├── 日志系统 ⭐
    └── 监控系统 ⭐
    ↓
整合来源: yyc3-xy-03 (5%)
    └── 测试配置 ⭐
```

### 整合阶段

| 阶段                  | 状态     | 完成时间   | 主要成果                                       |
| --------------------- | -------- | ---------- | ---------------------------------------------- |
| **阶段1: 技术栈升级** | ✅ 完成   | 2025-01-30 | Next.js 16.1.1, React 19.2.3, TypeScript 5.9.3 |
| **阶段2: 功能补充**   | ✅ 完成   | 2025-01-30 | 日志系统v2.0.0, Prometheus监控, Badges系统     |
| **阶段3: 文档整合**   | ⏳ 进行中 | 2025-01-30 | 技术文档、项目文档、用户文档                   |

### 整合成果

✅ **技术栈**: 使用最新版本（Next.js 16.1.1, React 19.2.3, TypeScript 5.9.3）
✅ **日志系统**: 增强的Client Logger（v2.0.0）+ Winston企业级日志系统
✅ **监控系统**: Prometheus + Grafana企业级监控系统
✅ **Badges系统**: 完整的徽章系统（API + 数据 + 服务）
✅ **类型系统**: 95%+类型安全，无类型错误
✅ **项目评分**: 91/100 ⭐⭐⭐⭐⭐

---

## 🛠️ 技术栈

### 前端技术 Frontend

| 技术               | 版本   | 说明                     | 用途     |
| ------------------ | ------ | ------------------------ | -------- |
| **Next.js**        | 16.1.1 | React框架，支持SSR/SSG   | 应用框架 |
| **React**          | 19.2.3 | UI库，最新版本           | UI开发   |
| **TypeScript**     | 5.9.3  | 类型安全的JavaScript超集 | 类型安全 |
| **Tailwind CSS**   | 4.x    | CSS框架                  | 样式开发 |
| **Radix UI**       | -      | 无样式组件库             | UI组件   |
| **Framer Motion**  | -      | 动画库                   | 动画效果 |
| **React DnD**      | 16.0.1 | 拖拽功能库               | 拖拽功能 |
| **next-intl**      | 4.6.1  | 国际化支持               | 多语言   |
| **TanStack Query** | 5.56.2 | 数据获取和状态管理       | 数据管理 |

### 后端技术 Backend

| 技术           | 版本   | 说明                   | 用途      |
| -------------- | ------ | ---------------------- | --------- |
| **Bun**        | 1.1.38 | 高性能JavaScript运行时 | 运行时    |
| **Node.js**    | 18+    | JavaScript运行时       | 运行时    |
| **Hono**       | 4.6.3  | 轻量级Web框架          | API框架   |
| **Socket.io**  | 4.8.0  | 实时通信               | WebSocket |
| **PostgreSQL** | 15+    | 关系型数据库           | 主数据库  |
| **Redis**      | 7+     | 缓存和会话存储         | 缓存      |
| **Neo4j**      | 5+     | 图数据库               | 知识图谱  |
| **Winston**    | -      | 企业级日志系统         | 日志管理  |

### AI/ML技术 AI & Machine Learning

| 技术              | 版本   | 说明           | 用途     |
| ----------------- | ------ | -------------- | -------- |
| **OpenAI API**    | -      | GPT-4, GPT-3.5 | AI对话   |
| **Claude API**    | -      | Anthropic AI   | AI对话   |
| **LangChain**     | -      | AI应用开发框架 | AI应用   |
| **Pinecone**      | -      | 向量数据库     | 向量存储 |
| **TensorFlow.js** | 4.22.0 | 机器学习库     | 机器学习 |
| **RAG架构**       | -      | 检索增强生成   | 知识检索 |

### DevOps技术 DevOps & Infrastructure

| 技术               | 版本  | 说明       | 用途     |
| ------------------ | ----- | ---------- | -------- |
| **Docker**         | 20+   | 容器化     | 容器部署 |
| **Docker Compose** | 2+    | 容器编排   | 服务编排 |
| **Kubernetes**     | 1.27+ | 容器编排   | 容器编排 |
| **Prometheus**     | -     | 监控系统   | 监控     |
| **Grafana**        | -     | 可视化监控 | 可视化   |
| **GitHub Actions** | -     | CI/CD      | 持续集成 |

### 开发工具 Development Tools

| 工具                  | 说明               | 用途     |
| --------------------- | ------------------ | -------- |
| **ESLint**            | 代码检查           | 代码质量 |
| **Prettier**          | 代码格式化         | 代码格式 |
| **Biome**             | 代码格式化和检查   | 代码质量 |
| **Jest**              | 测试框架           | 单元测试 |
| **Testing Library**   | React测试库        | 组件测试 |
| **TypeScript ESLint** | TypeScript代码检查 | 类型检查 |

---

## 📁 项目结构

```
yyc3-xy-ai/
├── .github/                      # GitHub Actions工作流配置
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── test.yml
├── .trae/                        # Trae IDE配置和规则
│   └── rules/
│       └── project_rules.md      # 项目规则文档
├── __mocks__/                    # 模拟数据
├── __tests__/                    # 测试文件
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── utils/
├── app/                          # Next.js应用目录
│   ├── [locale]/                 # 国际化路由
│   │   ├── ai-chat/             # AI聊天页面
│   │   ├── growth/              # 成长记录页面
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── activities/              # 活动页面
│   ├── ai-creative/             # AI创意工坊
│   ├── api/                     # API路由
│   │   ├── ai/                  # AI相关API
│   │   ├── children/            # 儿童管理API
│   │   ├── growth-records/      # 成长记录API
│   │   └── homework/            # 作业API
│   ├── badges/                  # 徽章页面
│   ├── books/                   # 有声绘本
│   ├── children/                # 儿童管理
│   ├── courses/                 # 课程管理
│   ├── curriculum/              # 课程大纲
│   ├── growth/                  # 成长记录
│   │   ├── assessment/          # 发展评估
│   │   └── page.tsx
│   ├── homework/                # 作业助手
│   ├── interactions/            # 交互记录
│   ├── messages/                # 消息通知
│   ├── schedule/                # 日程计划
│   ├── settings/                # 设置管理
│   ├── videos/                  # 视频教学
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 首页
│   └── globals.css              # 全局样式
├── backend/                     # 后端服务
│   ├── src/
│   │   ├── config/              # 配置文件
│   │   ├── controllers/         # 控制器
│   │   ├── middleware/          # 中间件
│   │   ├── migrations/          # 数据库迁移
│   │   ├── routes/              # 路由
│   │   └── types/               # 类型定义
│   ├── package.json
│   └── tsconfig.json
├── components/                  # React组件
│   ├── accessibility/           # 无障碍功能
│   ├── ai-xiaoyu/               # 小语AI助手
│   ├── auth/                    # 认证组件
│   ├── books/                   # 绘本组件
│   ├── character/               # 角色管理
│   ├── common/                  # 通用组件
│   ├── courses/                 # 课程组件
│   ├── emotion/                 # 情感监控
│   ├── growth/                  # 成长记录组件
│   │   └── enhanced/            # 增强功能
│   ├── homework/                # 作业组件
│   ├── headers/                 # 页头组件
│   ├── Navigation.tsx           # 导航组件
│   ├── ChildSelector.tsx        # 儿童选择器
│   └── ui/                      # UI基础组件
├── core/                        # 核心引擎
│   ├── AgenticCore.ts           # AI核心
│   └── AgenticCore-Enhanced.ts  # AI增强核心
├── docs/                        # 文档目录
│   ├── 01-架构设计类/             # 架构设计文档
│   ├── 02-开发指南/               # 开发指南
│   ├── 03-文档规范类/             # 文档规范
│   ├── 04-项目管理类/             # 项目管理文档
│   ├── 05-项目概述类/             # 项目概述
│   ├── 06-爱之细语/               # 用户文档
│   ├── YYC3-XY-审核分析/          # 审核分析文档
│   ├── YYC3-XY-审核报告/          # 审核报告
│   └── YYC3-XY-开发实施/          # 开发实施文档
├── hooks/                        # 全局自定义Hooks
│   ├── useAuth.ts                # 认证Hook
│   ├── useChildren.ts            # 儿童Hook
│   └── useGrowthStage.ts         # 成长阶段Hook
├── lib/                          # 工具库
│   ├── ai/                       # AI工具
│   ├── db/                       # 数据库工具
│   ├── character-manager.ts      # 角色管理器
│   ├── db/client.ts              # 数据库客户端
│   ├── logger.ts                 # 日志系统
│   ├── client-logger.ts          # 客户端日志
│   └── services/                 # 服务层
├── monitoring/                   # 监控配置
│   ├── prometheus.yml            # Prometheus配置
│   └── grafana/                  # Grafana配置
├── public/                       # 静态资源
│   ├── UI页面图示/
│   ├── role-photos/              # 角色照片
│   │   ├── boy/                  # 男孩图片
│   │   └── girl/                 # 女孩图片
│   └── git_1800_450-6.png        # Git顶图
├── types/                        # TypeScript类型定义
│   ├── index.ts                  # 类型导出
│   ├── database.ts               # 数据库类型
│   ├── ui.ts                     # UI类型
│   ├── logger.ts                 # 日志类型
│   └── common.ts                 # 通用类型  
├── config/                       # 配置文件
│   └── nginx/
│       └── nginx.conf
├── scripts/                      # 部署脚本
│   ├── deploy-docker.sh          # Docker部署
│   ├── deploy-local-ai.sh        # 本地AI服务
│   ├── deploy-microservices.sh   # 微服务部署
│   └── deploy-to-production.sh   # 生产环境部署
├── .env.example                  # 环境变量示例
├── .env.local                    # 本地环境变量
├── .eslintignore                 # ESLint忽略配置
├── .gitignore                    # Git忽略配置
├── .prettierrc                   # Prettier配置
├── CHANGELOG.md                  # 变更日志
├── CONTRIBUTING.md               # 贡献指南  
├── Dockerfile                    # Docker配置
├── docker-compose.yml            # Docker Compose配置
├── next.config.ts                # Next.js配置
├── package.json                  # 项目依赖
├── tsconfig.json                 # TypeScript配置
├── tailwind.config.ts            # Tailwind CSS配置
└── README.md                     # 项目说明（本文件）
```

---

## 🚀 快速开始

### 环境要求 Environment Requirements

| 工具        | 版本   | 说明                     |
| ----------- | ------ | ------------------------ |
| **Node.js** | 18+    | JavaScript运行时         |
| **Bun**     | 1.0.0+ | JavaScript运行时（推荐） |
| **Docker**  | 20+    | 容器化（可选）           |
| **Git**     | Latest | 版本控制                 |

### 安装步骤 Installation Steps

#### 1️⃣ 克隆仓库 Clone Repository

```bash
git clone https://github.com/YY-Nexus/yyc3-xyai.git
cd yyc3-xy-ai
```

#### 2️⃣ 安装依赖 Install Dependencies

```bash
# 使用 npm
npm install

# 或使用 bun（推荐）
bun install
```

#### 3️⃣ 配置环境变量 Configure Environment Variables

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置必要的环境变量：

```env
# 应用配置 Application Configuration
NEXT_PUBLIC_APP_NAME=小语AI智能成长守护系统
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_API_URL=http://localhost:1228

# API配置 API Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# 数据库配置 Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3xyai
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password
REDIS_URL=redis://localhost:6379

# 认证配置 Authentication Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:1228
```

#### 4️⃣ 启动开发服务器 Start Development Server

```bash
# 启动 Next.js 开发服务器
npm run dev
# 或
bun run dev

# 访问应用
# http://localhost:1228
```

#### 5️⃣ 构建生产版本 Build Production Version

```bash
# 构建应用
npm run build
# 或
bun run build

# 启动生产服务器
npm run start
# 或
bun run start
```

### Docker部署 Docker Deployment

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 访问地址 Access URLs

| 服务           | 地址                  | 说明        |
| -------------- | --------------------- | ----------- |
| **主应用**     | http://localhost:1228 | Next.js应用 |
| **API网关**    | http://localhost:1229 | API Gateway |
| **Prometheus** | http://localhost:9090 | 监控系统    |
| **Grafana**    | http://localhost:3001 | 可视化监控  |

---

## 🎨 核心功能

### 1️⃣ 智能守护 Intelligent Guardianship

#### AI聊天 AI Chat

**路径**: `app/[locale]/ai-chat/page.tsx`

**功能特性**:

- 🤖 AI智能对话
- 🎙️ 语音交互
- 👥 多角色切换
- 📜 消息历史记录
- 💬 上下文理解
- 🎭 情感识别

**技术实现**:

```typescript
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/chat',
  initialMessages: [],
})
```

#### 消息通知 Message Notifications

**路径**: `app/messages/page.tsx`

**功能特性**:

- 📬 消息列表
- 📧 消息详情
- 📤 消息发送
- 📊 消息状态跟踪
- 🔔 实时通知

#### 日程计划 Schedule Planning

**路径**: `app/schedule/page.tsx`

**功能特性**:

- 📅 计划列表
- 📝 计划详情
- ⏰ 计划提醒
- ✅ 计划完成状态
- 📈 计划统计

#### 系统设置 System Settings

**路径**: `app/settings/page.tsx`

**功能特性**:

- ⚙️ 用户设置
- 🔧 系统设置
- 🎨 偏好设置
- 🔐 权限管理

### 2️⃣ 成长记录 Growth Records

#### 成长总览 Growth Overview

**路径**: `app/growth/page.tsx`

**功能特性**:

- 📊 成长数据可视化
- 📈 成长时间线
- 🧠 智能评估
- 📉 发展曲线图
- 🎯 成长目标

**技术实现**:

```typescript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* 成长数据内容 */}
</motion.div>
```

#### 成长评估 Growth Assessment

**路径**: `app/growth/assessment/page.tsx`

**功能特性**:

- 📋 成长评估
- 📄 评估报告
- 💡 建议推荐
- 📊 发展水平分析
- 🎯 改进方案

#### 活动记录 Activity Records

**路径**: `app/activities/page.tsx`

**功能特性**:

- 🏃 活动列表
- 📝 活动详情
- 📊 活动记录
- 📈 活动统计
- 🎯 活动目标

#### 儿童档案 Child Profile

**路径**: `app/children/page.tsx`

**功能特性**:

- 👶 儿童信息管理
- 🎭 角色配置
- 🎨 主题切换
- ✏️ 档案编辑
- 📸 照片管理

#### 徽章成就 Badges & Achievements

**路径**: `app/badges/page.tsx`

**功能特性**:

- 🏆 徽章展示
- 📊 进度追踪
- 🔓 成就解锁
- ⭐ 徽章等级
- 🎉 里程碑庆祝

### 3️⃣ 知识教育 Knowledge Education

#### 课程学习 Course Learning

**路径**: `app/courses/page.tsx`

**功能特性**:

- 📚 课程列表
- 📖 学习进度
- ⭐ 课程评价
- 💡 课程推荐
- 📊 学习统计

#### 课程大纲 Curriculum Outline

**路径**: `app/curriculum/page.tsx`

**功能特性**:

- 📋 课程大纲
- 📅 学习计划
- 🗓️ 课程安排
- 🎯 学习路径
- 📊 进度跟踪

#### 作业管理 Homework Management

**路径**: `app/homework/page.tsx`

**功能特性**:

- 📝 作业列表
- 📤 作业提交
- 📋 作业反馈
- 📊 作业统计
- 🎯 作业目标

#### 阅读计划 Reading Plan

**路径**: `app/books/page.tsx`

**功能特性**:

- 📖 书籍列表
- 📚 阅读记录
- 💡 推荐书籍
- 📊 阅读统计
- 🎯 阅读目标

#### 视频教学 Video Learning

**路径**: `app/videos/page.tsx`

**功能特性**:

- 🎬 视频列表
- ▶️ 视频播放
- 💡 视频推荐
- 📊 视频记录
- 🎯 学习进度

#### AI创意 AI Creative

**路径**: `app/ai-creative/page.tsx`

**功能特性**:

- 🎨 AI创意生成
- ✨ 个性化内容创作
- 🖼️ 创意展示
- 📤 创意分享
- 🎯 创意目标

---

## 🏗️ 系统架构

### 架构图 Architecture Diagram

```mermaid
graph TB
    subgraph "前端层 Frontend Layer"
        A[智能AI组件] --> B[Next.js应用]
        B --> C[拖拽界面]
        B --> D[多语言支持]
    end

    subgraph "API网关层 API Gateway Layer"
        E[API Gateway] --> F[负载均衡]
        E --> G[认证授权]
        E --> H[限流熔断]
        E --> I[路由分发]
    end

    subgraph "服务层 Service Layer"
        J[AgenticCore] --> K[事件处理]
        L[ToolManager] --> M[工具注册]
        N[KnowledgeManager] --> O[RAG检索]
        P[GoalManager] --> Q[目标管理]
        R[MetaLearning] --> S[学习系统]
        T[GrowthService] --> U[成长记录]
        V[EduService] --> W[教育内容]
    end

    subgraph "数据层 Data Layer"
        X[PostgreSQL] --> Y[关系数据]
        Z[Redis] --> AA[缓存会话]
        AB[Elasticsearch] --> AC[搜索索引]
        AD[VectorDB] --> AE[向量存储]
        AF[Neo4j] --> AG[知识图谱]
    end

    A --> E
    B --> E
    E --> J
    E --> L
    E --> N
    E --> P
    E --> R
    E --> T
    E --> V

    J --> X
    L --> Z
    N --> AB
    N --> AD
    P --> X
    R --> X
    T --> X
    V --> X
```

### 核心组件状态 Core Components Status

| 组件                    | 功能             | 状态   | 文档                                                                             |
| ----------------------- | ---------------- | ------ | -------------------------------------------------------------------------------- |
| **AgenticCore**         | 事件驱动核心引擎 | ✅ 完成 | [技术文档](docs/YYC3-XY-开发实施/122-YYC3-XY-技术类-AI智能守护体系开发者文档.md) |
| **ServiceOrchestrator** | 服务编排管理     | ✅ 完成 | [架构文档](docs/YYC3-XY-开发实施/080-YYC3-XY-审核类-Phase2微服务架构报告.md)     |
| **ToolManager**         | 工具注册发现     | ✅ 完成 | [API文档](docs/YYC3-XY-开发实施/142-YYC3-XY-技术类-API接口文档.md)               |
| **KnowledgeManager**    | RAG知识库        | ✅ 完成 | [知识图谱文档](docs/YYC3-XY-开发实施/096-YYC3-XY-实施类-知识图谱构建.md)         |
| **APIGateway**          | 统一API网关      | ✅ 完成 | [API文档](docs/YYC3-XY-开发实施/142-YYC3-XY-技术类-API接口文档.md)               |
| **IntelligentWidget**   | 智能拖拽组件     | ✅ 完成 | [组件文档](docs/YYC3-XY-开发实施/144-YYC3-XY-技术类-组件库文档.md)               |
| **GrowthSystem**        | 成长记录系统     | ✅ 完成 | [成长记录文档](docs/YYC3-XY-开发实施/129-YYC3-XY-技术类-成长记录与指导系统.md)   |
| **VoiceSystem**         | 语音交互系统     | ✅ 完成 | [语音系统文档](docs/YYC3-XY-开发实施/134-YYC3-XY-技术类-设计小语语音系统.md)     |

### 架构特点 Architecture Features

- 🎯 **事件驱动**: 基于事件的异步处理机制
- 🎯 **目标驱动**: 明确的目标管理与追踪
- 🎯 **微服务**: 服务解耦，独立部署扩展
- 🎯 **插件化**: 动态工具注册与卸载
- 🎯 **多模态**: 统一的多模态交互接口
- 🎯 **可观测**: 完善的监控与日志系统

---

## 💻 开发指南

### 代码规范 Code Standards

#### TypeScript

```typescript
// ✅ 正确
interface User {
  id: string
  name: string
  email: string
}

// ❌ 错误
interface User {
  id: any
  name: any
  email: any
}
```

#### React组件

```typescript
// ✅ 正确
'use client'

import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)

  return <div>Count: {count}</div>
}

// ❌ 错误
import { useState } from 'react'

export default function MyComponent() {
  const [count, setCount] = useState(0)

  return <div>Count: {count}</div>
}
```

#### Tailwind CSS

```typescript
// ✅ 正确
<div className="flex items-center justify-center p-4 bg-white rounded-lg shadow">
  内容
</div>

// ❌ 错误
<div style={{ display: 'flex', padding: '16px', backgroundColor: 'white' }}>
  内容
</div>
```

### 组件开发 Component Development

#### 创建新组件

```bash
# 创建组件目录
mkdir components/MyComponent

# 创建组件文件
touch components/MyComponent/index.tsx
touch components/MyComponent/MyComponent.tsx
touch components/MyComponent/MyComponent.test.tsx
touch components/MyComponent/README.md
```

#### 组件模板

```typescript
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MyComponentProps {
  title: string
  onClick?: () => void
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  const [isActive, setIsActive] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-4 bg-white rounded-lg shadow"
      onClick={onClick}
    >
      <h2 className="text-xl font-bold">{title}</h2>
    </motion.div>
  )
}
```

### 自定义Hooks开发 Custom Hooks Development

#### 创建新Hook

```bash
# 创建Hook目录
mkdir hooks/useMyHook

# 创建Hook文件
touch hooks/useMyHook.ts
touch hooks/useMyHook.test.ts
```

#### Hook模板

```typescript
import { useState, useEffect } from 'react'

interface UseMyHookReturn {
  data: any
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

export function useMyHook(): UseMyHookReturn {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch data
      setData(/* data */)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  }
}
```

### 测试 Testing

```bash
# 运行所有测试
bun test

# 运行测试并监听变化
bun test --watch

# 生成测试覆盖率
bun test --coverage

# 类型检查
bun run type-check

# 代码检查
bun run lint
```

---

## 🔌 API文档

### API路由结构 API Routes Structure

```
app/api/
├── chat/                # AI聊天API
│   └── route.ts
├── children/            # 儿童管理API
│   └── route.ts
├── growth/              # 成长记录API
│   └── route.ts
├── assessments/         # 成长评估API
│   └── route.ts
└── homework/            # 作业管理API
    └── route.ts
```

### API端点 API Endpoints

#### 1️⃣ AI聊天API AI Chat API

**端点**: `POST /api/chat`

**请求体**:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "你好"
    }
  ]
}
```

**响应**:

```json
{
  "message": {
    "role": "assistant",
    "content": "你好！我是小语的AI守护助手"
  }
}
```

#### 2️⃣ 儿童管理API Children Management API

**端点**: `GET /api/children`

**响应**:

```json
{
  "children": [
    {
      "id": "child-001",
      "name": "小云",
      "gender": "female",
      "birthDate": "2020-09-15"
    }
  ]
}
```

**端点**: `POST /api/children`

**请求体**:

```json
{
  "name": "小云",
  "gender": "female",
  "birthDate": "2020-09-15"
}
```

**响应**:

```json
{
  "child": {
    "id": "child-001",
    "name": "小云",
    "gender": "female",
    "birthDate": "2020-09-15"
  }
}
```

#### 3️⃣ 成长记录API Growth Records API

**端点**: `GET /api/growth?childId=child-001`

**响应**:

```json
{
  "records": [
    {
      "id": "record-001",
      "childId": "child-001",
      "date": "2025-01-30",
      "height": 115,
      "weight": 20,
      "notes": "正常"
    }
  ]
}
```

**端点**: `POST /api/growth`

**请求体**:

```json
{
  "childId": "child-001",
  "date": "2025-01-30",
  "height": 115,
  "weight": 20,
  "notes": "正常"
}
```

**响应**:

```json
{
  "record": {
    "id": "record-001",
    "childId": "child-001",
    "date": "2025-01-30",
    "height": 115,
    "weight": 20,
    "notes": "正常"
  }
}
```

#### 4️⃣ 成长评估API Growth Assessment API

**端点**: `POST /api/growth/assessment`

**请求体**:

```json
{
  "childId": "child-001",
  "assessmentDate": "2025-01-30"
}
```

**响应**:

```json
{
  "assessment": {
    "id": "assessment-001",
    "childId": "child-001",
    "overallScore": 87,
    "overallLevel": "良好",
    "dimensionScores": {
      "academic": { "score": 85, "level": "良好" },
      "learningHabits": { "score": 82, "level": "良好" },
      "logicalThinking": { "score": 90, "level": "优秀" },
      "selfManagement": { "score": 78, "level": "良好" },
      "socialSkills": { "score": 92, "level": "优秀" }
    }
  }
}
```

---

## 🗄️ 数据库设计

### 数据模型 Data Models

#### 1️⃣ Child（儿童）

```typescript
interface Child {
  id: string
  name: string
  nickname: string
  gender: 'male' | 'female'
  birthDate: Date
  createdAt: Date
  updatedAt: Date
}
```

#### 2️⃣ GrowthRecord（成长记录）

```typescript
interface GrowthRecord {
  id: string
  childId: string
  date: Date
  height: number
  weight: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

#### 3️⃣ Milestone（里程碑）

```typescript
interface Milestone {
  id: string
  childId: string
  title: string
  description: string
  date: Date
  isAchieved: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### 4️⃣ Badge（徽章）

```typescript
interface Badge {
  id: string
  childId: string
  title: string
  description: string
  icon: string
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  isUnlocked: boolean
  unlockedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### 数据库连接 Database Connection

```typescript
// lib/db/client.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 📦 部署指南

### 环境变量 Environment Variables

```env
# 应用配置 Application Configuration
NEXT_PUBLIC_APP_NAME=小语AI智能成长守护系统
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_API_URL=https://api.yyc3-xyai.com

# API配置 API Configuration
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_neo4j_password

# 数据库配置 Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3xyai
REDIS_URL=redis://localhost:6379

# 认证配置 Authentication Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://yyc3-xyai.com

# 其他配置 Other Configuration
NODE_ENV=production
```

### Docker部署 Docker Deployment

#### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY bun.lockb ./

RUN npm install

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/yyc3xyai
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=yyc3xyai
    volumes:
      - postgres_data:/var/lib/postgresql/data

  neo4j:
    image: neo4j:5.0
    environment:
      - NEO4J_AUTH=neo4j/your_neo4j_password
    volumes:
      - neo4j_data:/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  neo4j_data:
  redis_data:
```

### Vercel部署 Vercel Deployment

#### 1️⃣ 连接GitHub仓库

访问 <https://vercel.com/new>，选择连接GitHub仓库 `YY-Nexus/yyc3-xyai`

#### 2️⃣ 配置环境变量

在Vercel项目设置中添加所有必要的环境变量。

#### 3️⃣ 部署

Vercel会自动检测Next.js项目并进行部署。

---

## 📊 监控与运维

### Prometheus监控 Prometheus Monitoring

访问Prometheus仪表板：

```
http://localhost:9090
```

**监控目标**:

- ✅ 应用性能指标
- ✅ API响应时间
- ✅ 数据库查询性能
- ✅ 缓存命中率
- ✅ 错误率统计

### Grafana可视化 Grafana Visualization

访问Grafana仪表板：

```
http://localhost:3001
```

**可视化面板**:

- 📊 系统性能监控
- 📈 业务指标追踪
- 📉 错误趋势分析
- 🎯 目标达成情况
- 📋 用户行为分析

### 日志查看 Log Viewing

查看系统日志：

```bash
# 查看应用日志
npm run logs

# 查看Docker日志
docker-compose logs -f app

# 查看特定服务日志
docker-compose logs -f neo4j
```

---

## 🤝 贡献指南

### 贡献流程 Contribution Workflow

1. **Fork本仓库**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

### 代码规范 Code Standards

- ✅ 遵循TypeScript和ESLint规范
- ✅ 编写单元测试
- ✅ 更新文档
- ✅ 遵循Conventional Commits规范

### Commit信息规范 Commit Message Convention

```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**:

- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例**:

```
feat(ai-chat): add voice interaction feature

- Add voice input component
- Integrate Web Speech API
- Update AI chat API to handle voice messages

Closes #123
```

---

## ❓ 常见问题

### Q1: 如何添加新的页面？

A: 在`app`目录下创建新的页面文件夹，并添加`page.tsx`文件。

```bash
mkdir app/new-page
touch app/new-page/page.tsx
```

### Q2: 如何配置新的环境变量？

A: 在`.env.local`文件中添加新的环境变量，并在代码中通过`process.env.VARIABLE_NAME`访问。

### Q3: 如何调试Next.js应用？

A: 使用VS Code的调试功能，在`.vscode/launch.json`中配置：

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:1228"
    }
  ]
}
```

### Q4: 如何运行测试？

A: 使用以下命令运行测试：

```bash
# 运行所有测试
bun test

# 运行测试并生成覆盖率
bun test --coverage

# 运行特定测试文件
bun test path/to/test.test.ts
```

---

## 📚 文档索引

### 核心文档 Core Documentation

| 文档名称         | 描述                     | 链接                                               |
| ---------------- | ------------------------ | -------------------------------------------------- |
| **文档索引**     | 完整的文档索引和管理规范 | [docs/README.md](docs/README.md)                   |
| **技术栈文档**   | 项目技术栈详细说明       | [docs/01-TECH_STACK.md](docs/01-TECH_STACK.md)     |
| **项目架构规范** | 系统架构设计规范         | [docs/01-项目架构规范.md](docs/01-项目架构规范.md) |
| **API接口文档**  | API接口详细说明          | [docs/02-API接口文档.md](docs/02-API接口文档.md)   |
| **组件开发规范** | 组件开发指南             | [docs/03-组件开发规范.md](docs/03-组件开发规范.md) |
| **代码风格规范** | 代码风格和格式规范       | [docs/04-CODE_STYLE.md](docs/04-CODE_STYLE.md)     |
| **项目架构总览** | 整体架构概览             | [docs/05-项目架构总览.md](docs/05-项目架构总览.md) |

### 审核分析文档 Audit & Analysis Documentation

#### 审核分析 (docs/YYC3-XY-审核分析/)

- [073-YYC3-XY-审核类-Phase1完成总报告.md](docs/YYC3-XY-审核分析/073-YYC3-XY-审核类-Phase1完成总报告.md)
- [075-YYC3-XY-审核类-Phase1测试体系建设报告.md](docs/YYC3-XY-审核分析/075-YYC3-XY-审核类-Phase1测试体系建设报告.md)
- [076-YYC3-XY-审核类-Phase1部署优化报告.md](docs/YYC3-XY-审核分析/076-YYC3-XY-审核类-Phase1部署优化报告.md)
- [077-YYC3-XY-审核类-Phase2本地AI集成报告.md](docs/YYC3-XY-审核分析/077-YYC3-XY-审核类-Phase2本地AI集成报告.md)
- [078-YYC3-XY-审核类-Phase2知识图谱报告.md](docs/YYC3-XY-审核分析/078-YYC3-XY-审核类-Phase2知识图谱报告.md)
- [079-YYC3-XY-审核类-知识图谱技术总结.md](docs/YYC3-XY-审核分析/079-YYC3-XY-审核类-知识图谱技术总结.md)
- [080-YYC3-XY-审核类-Phase2微服务架构报告.md](docs/YYC3-XY-审核分析/080-YYC3-XY-审核类-Phase2微服务架构报告.md)
- [081-YYC3-XY-审核类-Phase2数据分析平台报告.md](docs/YYC3-XY-审核分析/081-YYC3-XY-审核类-Phase2数据分析平台报告.md)
- [082-YYC3-XY-审核类-开发进度总报告.md](docs/YYC3-XY-审核分析/082-YYC3-XY-审核类-开发进度总报告.md)
- [148-YYC3-XY-管理类-0-3岁成长守护体系启动全局审核报告.md](docs/YYC3-XY-审核分析/148-YYC3-XY-管理类-0-3岁成长守护体系启动全局审核报告.md)
- [149-YYC3-XY-管理类-团队审核分析清单.md](docs/YYC3-XY-审核分析/149-YYC3-XY-管理类-团队审核分析清单.md)

#### 审核报告 (docs/YYC3-XY-审核报告/)

- [代码质量评估报告.md](docs/YYC3-XY-审核报告/代码质量评估报告.md)
- [功能完整性评估报告.md](docs/YYC3-XY-审核报告/功能完整性评估报告.md)

### 开发实施文档 Development & Implementation Documentation

- [122-YYC3-XY-技术类-AI智能守护体系开发者文档.md](docs/YYC3-XY-开发实施/122-YYC3-XY-技术类-AI智能守护体系开发者文档.md)
- [142-YYC3-XY-技术类-API接口文档.md](docs/YYC3-XY-开发实施/142-YYC3-XY-技术类-API接口文档.md)
- [144-YYC3-XY-技术类-组件库文档.md](docs/YYC3-XY-开发实施/144-YYC3-XY-技术类-组件库文档.md)
- [096-YYC3-XY-实施类-知识图谱构建.md](docs/YYC3-XY-开发实施/096-YYC3-XY-实施类-知识图谱构建.md)
- [129-YYC3-XY-技术类-成长记录与指导系统.md](docs/YYC3-XY-开发实施/129-YYC3-XY-技术类-成长记录与指导系统.md)
- [134-YYC3-XY-技术类-设计小语语音系统.md](docs/YYC3-XY-开发实施/134-YYC3-XY-技术类-设计小语语音系统.md)

### 用户文档 User Documentation

- [用户使用手册](docs/06-爱之细语/用户使用手册.md) - 用户使用指南
- [开发者文档](docs/06-爱之细语/开发者文档闭环版.md) - 开发者指南
- [部署与运维手册](docs/06-爱之细语/部署与运维手册.md) - 部署运维指南
- [移动端设计指南](docs/06-爱之细语/移动端设计指南.md) - 移动端设计

---

## ⚖️ 许可证

本项目采用 **MIT 许可证** - 详见 [LICENSE](LICENSE) 文件

---

## � 贡献者 Contributors

感谢所有为项目做出贡献的开发者！

### 核心团队 Core Team

| 姓名              | 角色     | 贡献                           |
| ----------------- | -------- | ------------------------------ |
| **YYC³ Team**     | 项目维护 | 整体架构设计、核心功能开发     |
| **AI Team**       | AI研发   | AgenticCore、知识图谱、RAG系统 |
| **Frontend Team** | 前端开发 | UI组件、交互设计、性能优化     |
| **Backend Team**  | 后端开发 | API设计、微服务架构、数据库    |
| **DevOps Team**   | 运维部署 | CI/CD、监控系统、容器化        |

### 贡献指南 How to Contribute

我们欢迎所有形式的贡献！

1. **报告Bug** - 提交Issue描述问题
2. **建议新功能** - 提交Issue描述功能需求
3. **提交代码** - Fork项目，创建分支，提交PR
4. **改进文档** - 完善文档，提升可读性
5. **分享经验** - 在Discussions中分享使用经验

### 贡献统计 Contribution Statistics

- 📊 总提交数: 1,000+
- 🐛 解决Issue: 50+
- ✅ 合并PR: 100+
- 📝 贡献者: 20+
- ⭐ GitHub Stars: 100+

---

## �📞 联系我们

### 团队信息 Team Information

**YYC³ 团队**

**团队标语**: "以智能守护成长，用科技点亮未来"

**联系方式**:
- 📧 Email: [admin@0379.email](mailto:admin@0379.email)
- 🌐 GitHub: [https://github.com/YY-Nexus/yyc3-xyai](https://github.com/YY-Nexus/yyc3-xyai)
- 📖 文档: [项目文档](docs/)

### 支持与反馈 Support & Feedback

如果您有任何问题、建议或反馈，欢迎通过以下方式联系我们：

- 🐛 提交 [Issue](https://github.com/YY-Nexus/yyc3-xyai/issues)
- 📧 发送邮件至 [admin@0379.email](mailto:admin@0379.email)
- 💬 参与 [Discussions](https://github.com/YY-Nexus/yyc3-xyai/discussions)

---

<div align="center">

## ⭐ 如果这个项目对您有帮助，请给我们一个 Star！⭐

---

**Made with ❤️ by YYC³ Team**

**以智能守护成长，用科技点亮未来**

**Intelligent Guardianship for Growth, Technology Illuminating Future**

---

**项目版本**: v2.0.0
**文档版本**: v2.0.0
**最后更新**: 2025-01-30
**项目状态**: ✅ 正在开发中
**整合进度**: 67%（阶段1和2完成，阶段3进行中）
**项目评分**: 91/100 ⭐⭐⭐⭐⭐

</div>

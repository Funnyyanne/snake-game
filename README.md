# Multiplayer Snake Game 多人贪吃蛇游戏

[English](#english) | [中文](#chinese)

## English

### Introduction
A modern multiplayer snake game built with HTML5 Canvas, WebSocket, and Tailwind CSS. Features real-time multiplayer gameplay, chat system, customizable skins, and power-ups.

### Features
- Real-time multiplayer gameplay
- In-game chat system
- Customizable snake skins
- Power-up items
- Responsive design
- Leaderboard system
- Virtual currency system

### Technical Implementation

#### Game Core
- HTML5 Canvas for game rendering
- RequestAnimationFrame for smooth animation
- Collision detection system
- Grid-based movement system

#### Multiplayer System
- WebSocket for real-time communication
- Room-based multiplayer system
- Player state synchronization
- Real-time chat functionality

#### Game Mechanics
1. Snake Movement
   - Grid-based movement system
   - Direction control using arrow keys
   - Collision detection with walls and other players

2. Power-ups
   - Speed boost
   - Shield protection
   - Score multiplier
   - Size reduction

3. Scoring System
   - Points for collecting food
   - Bonus points for power-ups
   - Virtual currency rewards

### Tech Stack
- Frontend: HTML5, CSS3, JavaScript
- Styling: Tailwind CSS
- Backend: Node.js
- Real-time: WebSocket
- Deployment: Docker & Github Action & Render（free instance will spin down with inactivity, which can delay requests by 50 seconds or more.）

---

## Chinese

### 简介
使用 HTML5 Canvas、WebSocket 和 Tailwind CSS 构建的现代多人贪吃蛇游戏。具有实时多人游戏、聊天系统、自定义皮肤和道具等功能。

### 功能特点
- 实时多人对战
- 游戏内聊天系统
- 自定义蛇皮肤
- 游戏道具系统
- 响应式设计
- 排行榜系统
- 虚拟货币系统

### 技术实现

#### 游戏核心
- 使用 HTML5 Canvas 进行游戏渲染
- 使用 RequestAnimationFrame 实现流畅动画
- 碰撞检测系统
- 网格化移动系统

#### 多人系统
- 使用 WebSocket 实现实时通信
- 基于房间的多人系统
- 玩家状态同步
- 实时聊天功能

#### 游戏机制
1. 蛇的移动
   - 基于网格的移动系统
   - 使用方向键控制
   - 与墙壁和其他玩家的碰撞检测

2. 道具系统
   - 速度提升
   - 护盾保护
   - 分数加倍
   - 体型缩小

3. 计分系统
   - 收集食物得分
   - 道具额外加分
   - 虚拟货币奖励

### 技术栈
- 前端：HTML5、CSS3、JavaScript
- 样式：Tailwind CSS
- 后端：Node.js
- 实时通信：WebSocket
- 部署：Docker & Github Action & Render（free instance will spin down with inactivity, which can delay requests by 50 seconds or more.）

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
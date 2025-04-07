# Multiplayer Snake Game 多人贪吃蛇游戏

[English](#english) | [中文](READMECN.md)

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

### Feature Preview
![Snake Game Preview](https://raw.githubusercontent.com/Funnyyanne/images/refs/heads/main/%E4%BC%98%E5%8C%96snake_game.gif)
---

### Installation

```bash
npm install

npm run dev

npm run build
```

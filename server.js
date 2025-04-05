const WebSocket = require('ws');
const express = require('express');
const path = require('path');


// 创建 Express 应用
const app = express();
// app.set('trust proxy', true);
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
// });
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/static', express.static('static'))

// 创建 HTTP 服务器
const server = app.listen(80, () => {
    console.log(`Amazing snake-game Method™ server on 80`);
});


// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ server });



let rooms = {}; // 存储多个房间的数据

wss.on('connection', (ws, req) => {
    // 从 URL 查询参数中获取房间 ID，默认加入 "default" 房间
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const roomId = urlParams.get('room') || 'default';
    ws.roomId = roomId; // 为 WebSocket 客户端添加 roomId 属性

    if (!rooms[roomId]) {
        rooms[roomId] = {
            players: {},
            foods: [],
            powerUps: []
        };
        spawnFood(roomId); // 立即生成食物
        spawnPowerUp(roomId); // 立即生成道具
    }

    const playerId = 'player-' + Math.random().toString(36).substr(2, 9);
    console.log(`New player ${playerId} connected to room ${roomId}`);

    // 发送玩家 ID 和初始房间数据
    ws.send(JSON.stringify({ type: 'init', playerId, roomId, data: rooms[roomId] }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'update') {
            rooms[roomId].players[playerId] = {
                snake: data.snake,
                score: data.score,
                name: data.name,
                color: data.color,
                lastUpdate: Date.now()
            };
            broadcast(roomId, { type: 'players', data: rooms[roomId].players });
        } else if (data.type === 'chat') {
            broadcast(roomId, { type: 'chat', sender: data.sender, message: data.message });
        } else if (data.type === 'foodEaten') {
            // 玩家吃到食物，服务器重新生成
            rooms[roomId].foods = rooms[roomId].foods.filter(f => !(f.x === data.x && f.y === data.y));
            spawnFood(roomId);
        } else if (data.type === 'powerUpEaten') {
            rooms[roomId].powerUps = rooms[roomId].powerUps.filter(p => !(p.x === data.x && p.y === data.y));
            spawnPowerUp(roomId);
        }
    });

    ws.on('close', () => {
        delete rooms[roomId].players[playerId];
        broadcast(roomId, { type: 'players', data: rooms[roomId].players });
        console.log(`Player ${playerId} disconnected from room ${roomId}`);
        if (Object.keys(rooms[roomId].players).length === 0) {
            delete rooms[roomId]; // 清理空房间
        }
    });
});

function broadcast(roomId, data) {
    console.log(`Broadcasting to room ${roomId}:`, data.type);
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
            client.send(JSON.stringify(data));
        }
    });
}

function spawnFood(roomId) {
    const tileCount = 40; // 与客户端一致
    const newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        hasAd: Math.random() < 0.5
    };
    rooms[roomId].foods.push(newFood);
    console.log(`Spawned food in room ${roomId}:`, newFood);
    broadcast(roomId, { type: 'foods', data: rooms[roomId].foods });
}

function spawnPowerUp(roomId) {
    if (Math.random() < 0.3) {
        const tileCount = 40;
        const newPowerUp = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            type: Math.random() < 0.5 ? 'speed' : 'shield'
        };
        rooms[roomId].powerUps.push(newPowerUp);
    } else {
        rooms[roomId].powerUps = [];
    }
    console.log(`Spawned powerUp in room ${roomId}:`, rooms[roomId].powerUps);
    broadcast(roomId, { type: 'powerUps', data: rooms[roomId].powerUps });
}

// 定期清理不活跃玩家和初始化食物/道具
setInterval(() => {
    for (let roomId in rooms) {
        const now = Date.now();
        for (let id in rooms[roomId].players) {
            if (now - rooms[roomId].players[id].lastUpdate > 15000) {
                delete rooms[roomId].players[id];
                broadcast(roomId, { type: 'players', data: rooms[roomId].players });
            }
        }
        if (rooms[roomId].foods.length === 0) spawnFood(roomId);
        if (rooms[roomId].powerUps.length === 0) spawnPowerUp(roomId);
    }
}, 5000);


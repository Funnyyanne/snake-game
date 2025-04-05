const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

let rooms = {};

io.on('connection', (socket) => {
    const roomId = socket.handshake.query.room || 'default';
    socket.join(roomId);

    if (!rooms[roomId]) {
        rooms[roomId] = {
            players: {},
            foods: [],
            powerUps: []
        };
        spawnFood(roomId);
        spawnPowerUp(roomId);
    }

    const playerId = 'player-' + Math.random().toString(36).substr(2, 9);
    console.log(`New player ${playerId} connected to room ${roomId}`);

    socket.emit('init', { playerId, roomId, data: rooms[roomId] });

    socket.on('update', (data) => {
        rooms[roomId].players[playerId] = {
            snake: data.snake,
            score: data.score,
            name: data.name,
            color: data.color,
            lastUpdate: Date.now()
        };

        if (rooms[roomId] && rooms[roomId].players[playerId]) {
            rooms[roomId].players[playerId] = data;
            io.to(roomId).emit('players', rooms[roomId].players);
        }
        });

    socket.on('chat', (data) => {
        io.to(roomId).emit('chat', { sender: data.sender, message: data.message });
    });

    // 处理客户端主动离开
    socket.on('leave', (data) => {
        if (rooms[data.roomId] && rooms[data.roomId].players[data.playerId]) {
            delete rooms[data.roomId].players[data.playerId];
            io.to(data.roomId).emit('players', rooms[data.roomId].players);
            console.log(`玩家 ${data.playerId} 已从房间 ${data.roomId} 离开`);
        }
    });

    // 处理客户端断开连接
    socket.on('disconnect', () => {
        if (rooms[roomId] && rooms[roomId].players[playerId]) {
            delete rooms[roomId].players[playerId];
            io.to(roomId).emit('players', rooms[roomId].players);
            console.log(`玩家 ${playerId} 已断开连接并从房间 ${roomId} 移除`);
        }
    });

    socket.on('foodEaten', (data) => {
        rooms[roomId].foods = rooms[roomId].foods.filter(f => !(f.x === data.x && f.y === data.y));
        spawnFood(roomId);
    });

    socket.on('powerUpEaten', (data) => {
        rooms[roomId].powerUps = rooms[roomId].powerUps.filter(p => !(p.x === data.x && p.y === data.y));
        spawnPowerUp(roomId);
    });

    socket.on('disconnect', () => {
        delete rooms[roomId].players[playerId];
        io.to(roomId).emit('players', rooms[roomId].players);
        console.log(`Player ${playerId} disconnected from room ${roomId}`);
        if (Object.keys(rooms[roomId].players).length === 0) {
            delete rooms[roomId];
        }
    });
});

function spawnFood(roomId) {
    const tileCount = 40;
    const newFood = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        hasAd: Math.random() < 0.5
    };
    rooms[roomId].foods.push(newFood);
    io.to(roomId).emit('foods', rooms[roomId].foods);
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
    io.to(roomId).emit('powerUps', rooms[roomId].powerUps);
}

setInterval(() => {
    for (let roomId in rooms) {
        const now = Date.now();
        for (let id in rooms[roomId].players) {
            if (now - rooms[roomId].players[id].lastUpdate > 15000) {
                delete rooms[roomId].players[id];
                io.to(roomId).emit('players', rooms[roomId].players);
            }
        }
        if (rooms[roomId].foods.length === 0) spawnFood(roomId);
        if (rooms[roomId].powerUps.length === 0) spawnPowerUp(roomId);
    }
}, 5000);


const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
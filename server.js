const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = 3000;
const roomName = ['1', '2', '3', '4'];

const chat = io.of('/chat');
chat.on('connection', (socket) => {
    socket.on('joinRoom_chat', (room) => {
        if (roomName.includes(room)) {
            socket.join(room);
            chat.to(room).emit('msg', `우리만의 비밀이야기 ${room}`)
            return socket.emit('success', '방에 들어오는데 성공했습니다.')
        } else {
            return socket.emit('error', '해당 방은 없습니다, ' + room)
        }
    })
});

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
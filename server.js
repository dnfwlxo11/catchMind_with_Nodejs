const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = 3000;
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

const chat = io.of('/chat');
chat.on('connection', (socket) => {
    let myRoom = 'open';

    socket.on('joinRoom_chat', (room) => {
        if (roomName.includes(room)) {
            socket.join(room);
            chat.to(room).emit('msg', `우리만의 비밀이야기 ${room}`)
            myRoom = room;
            return socket.emit('success', '방에 들어오는데 성공했습니다.')
        } else {
            return socket.emit('error', '해당 방은 없습니다, ' + room)
        }
    })

    socket.on('msg', (res) => {
        console.log('msg:', res);
        chat.to(myRoom)
        .emit('msg', res);
    })
});

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
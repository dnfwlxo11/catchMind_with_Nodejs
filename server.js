const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');

const PORT = 3000;

// 이걸 DB에서 방들을 불러왔다고 가정, 새로만드는 경우는 포함 x
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const chat = io.of('/chat');
chat.on('connection', (socket) => {
    let myRoom = 'open';

    socket.on('joinRoom_chat', (room) => {
        if (roomName.includes(room)) {
            console.log(room)
            socket.join(room);
            chat.to(room).emit('roomEnter', { roomNAme: room})
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

    socket.on('roomEnter', (res) => {
        console.log(res)
    })

    socket.on('success', (res) => {
        console.log(res)
    })

    socket.on('error', (res) => {
        console.log(res)
    })
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/room.html'));
})

app.post('/room/:roomName', (req, res) => {
    console.log('신호왔어')

    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/chatRoom.html'));
});

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
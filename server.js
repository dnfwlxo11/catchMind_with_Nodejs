const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysqlSession = require('express-mysql-session')(session);
const session_router = require('./session');

const db_infor = require('./key');

const PORT = 3000;

// 이걸 DB에서 방들을 불러왔다고 가정, 새로만드는 경우는 포함 x
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: '#@^!@#&&^$!@', // 쿠키 변조를 방지하기 위한 값
    saveUninitialized: true, // 세션이 저장되기 전 초기화되지 않은 상태로 만들어 저장
    store: new mysqlSession(db_infor),
    cookie: {
        maxAge: 1000*60*10
    }
}))

app.use('/api', session_router);

connectCounter = [];

const chat = io.of('/chat');
chat.on('connection', (socket) => {
    let myRoom = 'open';

    socket.on('joinRoom_chat', (room) => {
        if (roomName.includes(room)) {
            socket.join(room);
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

    socket.on('getUserNum', () => {
        console.log(io.sockets)

        chat.to(myRoom)
            .emit('userNum', io.engine.clientsCount);
    })

    socket.on('canvasBtn', (res) => {
        chat.to(myRoom)
            .emit('canvasBtn', res);
    })

    socket.on('roomEnter', (res) => {
        // console.log(res)
    })

    socket.on('success', (res) => {
        console.log(res)
    })

    socket.on('error', (res) => {
        console.log(res)
    })
    socket.on('mouseMove', (res) => {
        socket.broadcast
            .to(myRoom)
            .emit('mouseMove', res);
    })
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/room.html'));
})

app.post('/room/:roomName', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/chatRoom.html'));
});

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
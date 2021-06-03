const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const users = require('./router/users');
const rooms = require('./router/rooms')
const config = require('./config/key');

const PORT = 3000;

// 이걸 DB에서 방들을 불러왔다고 가정, 새로만드는 경우는 포함 x
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

app.use('/', express.static('public'));
app.use('/api/rooms', express.static(path.join(__dirname, '../public')));
app.use('/api/rooms/join', express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})
app.use('/api/users', users);
app.use('/api/rooms', rooms)

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

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
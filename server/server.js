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
const config = require('./config/dev');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');
const { Room } = require('./models/Room');

const PORT = 3000;

app.use('/', express.static(path.join(__dirname, '../public/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('#$@#AQasd2!@'));

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))

const quiz = [
    '나비',
    '호랑이',
    '핸드폰',
    '노트북',
    '마스크'
]

app.get('/', (req, res) => {
    if (!req.cookies.x_auth)
        res.sendFile(path.join(__dirname, '../public/html/index.html'));
    else
        res.redirect('/api/rooms/roomList');
})
app.use('/api/users', users);
app.use('/api/rooms', rooms);

connectCounter = [];

const chat = io.of('/chat');
chat.on('connection', (socket) => {
    let myRoom = 'open';
    let word = '호랑이'

    socket.on('joinRoom_chat', (room) => {
        socket.join(room, (err) => {
            console.log(err);
        });
        myRoom = room;
    });

    socket.on('msg', (res) => {
        console.log('msg:', res);
        chat.to(myRoom)
            .emit('msg', res);
    });

    socket.on('getUserNum', (res) => {
        // console.log(res)
        chat.to(myRoom)
            .emit('userNum', res);
    });

    socket.on('canvasBtn', (res) => {
        chat.to(myRoom)
            .emit('canvasBtn', res);
    });

    socket.on('updateUsers', () => {
        chat.emit('updateUsers');
    });

    socket.on('success', (res) => {
        console.log(res);
    });

    socket.on('error', (res) => {
        console.log(res);
    });

    socket.on('mouseMove', (res) => {
        chat.to(myRoom)
            .emit('mouseMove', res);
    });

    socket.on('updateRooms', (res) => {
        chat.emit('updateRooms', {msg: '업데이트 하라 오바'});
    });

    socket.on('startQuiz', (res) => {
        console.log('퀴즈 시작')
        chat.to(myRoom)
            .emit('startQuiz', { word, res });
    })

    socket.on('endQuiz', (res) => {
        console.log('퀴즈 끝')
        chat.to(myRoom)
            .emit('endQuiz', word);
    })

    socket.on('quizAnswer', (res) => {
        console.log(res);
        chat.to(myRoom)
            .emit('quizAnswer', { result: word===res, word});
    })
});

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
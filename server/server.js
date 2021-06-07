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
    socket.on('joinRoom_chat', (room) => {
        socket.join(room, (err) => {
            console.log(err);
        });
        myRoom = room;

        Room.findOne({ room: room}, (err, room) => {
            if (err) console.log('에러 발생')
            User.findOne({ _id: room.drawer }, (err, user) => {
                if (!user) {
                    return res.json({
                        success: false,
                        msg: '해당 유저는 없습니다.'
                    })
                }
                
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err)
        
                    return socket.emit('success', user.token)
                })
            })
        })
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
});

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
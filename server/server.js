const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:8080"],
        methods:["GET","POST"],
    }
});
const path = require('path')
const cookieParser = require('cookie-parser')
const users = require('./router/users')
const rooms = require('./router/rooms')
const config = require('./config/dev')
const cors = require('cors')
const { auth } = require('./middleware/auth')

const PORT = 3000


app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.use(cors())

app.use('/', express.static(path.join(__dirname, '../public/')))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

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

app.get('/', auth, (req, res) => {
    if (!req.cookies.x_auth)
        res.send({ success: true })
        // res.sendFile(path.join(__dirname, '../public/html/index.html'))
    else
        res.send({ success: false })
        // res.redirect('/api/rooms/roomList')
})
app.use('/api/users', users)
app.use('/api/rooms', rooms)

connectCounter = []

const chat = io.of('/chat')
chat.on('connection', (socket) => {
    console.log('zxc')
    let myRoom = 'open'
    let word = '호랑이'

    socket.on('joinRoom_chat', (room) => {
        console.log('asd')
        socket.join(room, (err) => {
            console.log(err)
        })
        myRoom = room
    })

    socket.on('msg', (res) => {
        console.log('msg)', res)
        chat.to(myRoom)
            .emit('msg', res)
    })

    socket.on('getUserNum', (res) => {
        chat.to(myRoom)
            .emit('getUserNum', res)
    })

    socket.on('canvasBtn', (res) => {
        chat.to(myRoom)
            .emit('canvasBtn', res)
    })

    socket.on('updateUsers', () => {
        chat.emit('updateUsers')
    })

    socket.on('mouseMove', (res) => {
        chat.to(myRoom)
            .emit('mouseMove', res)
    })

    socket.on('updateRooms', (res) => {
        chat.emit('updateRooms', {msg: '방 정보 업데이트'})
    })

    socket.on('startQuiz', (res) => {
        console.log('퀴즈 시작')
        chat.to(myRoom)
            .emit('startQuiz', { word, res })
    })

    socket.on('endQuiz', (res) => {
        console.log('퀴즈 끝')
        chat.to(myRoom)
            .emit('endQuiz', word)
    })

    socket.on('quizAnswer', (res) => {
        console.log(res)
        chat.to(myRoom)
            .emit('quizAnswer', { result: word===res, word})
    })

    socket.on('getDrawer', (res) => {
        chat.to(myRoom)
            .emit('getDrawer')
    })
})

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`)
})
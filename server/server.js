const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {cors: {origin: ["http://localhost:8081"]}});
const path = require('path')
const cookieParser = require('cookie-parser')
const users = require('./router/users')
const rooms = require('./router/rooms')
const config = require('./config/dev')
const cors = require('cors')
const { auth } = require('./middleware/auth')

const PORT = 3000

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


const chat = io.of('/chat')
chat.on('connection', (socket) => {
    let myRoom = ''
    let word = '호랑이'

    socket.on('joinRoom_chat', (room) => {
        myRoom = room
        socket.join(myRoom, (err) => {
            console.log(err)
        })

        chat.to(myRoom)
            .emit('userNum', chat.adapter.rooms.get(myRoom).size)
    })

    socket.on('disconnecting', () => {
        const roomInfo = chat.adapter.rooms.get(myRoom)

        socket.leave(myRoom)
        if (roomInfo != undefined) {
            chat.to(myRoom).emit('userNum', roomInfo.size)
        }
    })

    socket.on('disconnect', () => {
        console.log('나감', socket.id);
    })

    socket.on('msg', (res) => {
        console.log(`${res.name}(${myRoom}):`, res.msg)
        chat.to(myRoom).emit('msg', res)
    })

    socket.on('getUserNum', (res) => {
        chat.to(myRoom)
            .emit('getUserNum', res)
    })

    socket.on('mouseMove', (res) => {
        chat.to(myRoom)
            .emit('mouseMove', res)
    })

    socket.on('canvasOption', (res) => {
        chat.to(myRoom)
            .emit('canvasOption', res)
    })

    socket.on('initCanvas', () => {
        chat.to(myRoom)
            .emit('initCanvas')
    })

    socket.on('getRoomList', () => {
        console.log('업데이트')
        socket.broadcast.emit('getRoomList')
    })
})

server.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`)
})
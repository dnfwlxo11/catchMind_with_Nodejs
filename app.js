const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const io = require('socket.io-client');
const PORT = 5000;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const chat = io.connect('http://localhost:3000/chat')

chat.on('message', (msg) => {
    console.log(msg)
    
});

chat.emit('message', '안녕하슈');

chat.on('error', (res) => {
    console.log(res);
});

chat.on('success', (res) => {
    console.log(res);
});

chat.on('msg', (res) => {
    console.log(res);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/room.html'));
})

app.post('/room', (req, res) => {
    const roomNum = req.body.roomNum;

    chat.emit('joinRoom_chat', roomNum);

    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/chatRoom.html'));
});

app.listen(PORT, () => {
    console.log(`Server start!!\thttp://localhost:${PORT}`);
});
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/index.html'));
});

router.get('/roomList', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/roomList.html'));
});

router.post('/room/:roomName', (req, res) => {
    res.sendFile(path.join(__dirname, 'catchMind_with_Nodejs', '../public/chatRoom.html'));
});

module.exports = router
const express = require('express');
const path = require('path');
const router = express.Router();

const { auth } = require('../middleware/auth')

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/roomList.html'));
});

router.post('/:roomName', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/chatRoom.html'));
});

module.exports = router
const express = require('express');
const path = require('path');
const router = express.Router();

const { User } = require('../models/User');
const { Room } = require('../models/Room');
const { auth } = require('../middleware/auth')

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/roomList.html'));
});

router.post('/join/:roomName', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/chatRoom.html'));
});

router.post('/createRoom', auth, (req, res) => {
    console.log('123')
    console.log(req.user, req.body)

    const room = new Room({
        name: req.body.room,
        users: req.user._id,
        admin: true,
        drawer: true
    })

    room.save((err, roomInfo) => {
        if (err) return res.json({ success: false, err })
    })

    return res.status(200).json({
        success: true,
        msg: '방 등록 완료'
    })
});

router.post('/join', auth, (req, res) => {
    // const room = new Room({
    //     room: req.body.roomName,
    //     users: req.user._id
    // });

    // room.save((err, roomInfo) => {
    //     if (err) return res.json({ success: false, err })
    //     return res.status(200).json({
    //         success: true,
    //         msg: `${req.body.roomName}에 성공적으로 들어왔습니다.`
    //     })
    // })
})

module.exports = router
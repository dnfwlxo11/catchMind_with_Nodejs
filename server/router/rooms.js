const express = require('express');
const path = require('path');
const router = express.Router();

const { User } = require('../models/User');
const { Room } = require('../models/Room');
const { auth } = require('../middleware/auth')

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/roomList.html'));
});

router.post('/join', auth, (req, res) => {
    Room.findOne({ room: req.body.room })
    .exec((err, room) => {
        if (err) {
            console.log(err)
            return res.json({
                success: false,
                msg: '에러 발생',
                err
            })
        } else if (!room) {
            return res.json({
                success: false,
                msg: '해당 방은 존재하지 않습니다.'
            })
        } else {
            console.log(room.room, '방으로 들어갑니다.')
            room.users.push(req.user);
            res.sendFile(path.join(__dirname, '../../public/chatRoom.html'));
        }
    })
});

router.post('/createRoom', auth, (req, res) => {
    console.log(req.body)

    const room = new Room({
        room: req.body.room,
        admin: true,
        drawer: true
    })

    Room.findOne({ room: req.body.room }, (err, room) => {
        if (!room) {
            const new_room = new Room({
                room: req.body.room,
                admin: true,
                drawer: true
            })

            new_room.save((err, roomInfo) => {
                if (err) return res.json({
                    success: true,
                    msg: '방 등록 완료'
                })
            })
        } else {
            return res.json({
                success: false,
                msg: '이미 사용 중인 방입니다.'
            })
        }
    })
});

module.exports = router
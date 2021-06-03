const express = require('express');
const path = require('path');
const router = express.Router();

const { User } = require('../models/User');
const { Room } = require('../models/Room');
const { auth } = require('../middleware/auth')

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/roomList.html'));
});

router.get('/join/:roomName', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/chatRoom.html'), { room: 'test' })
})

router.post('/join/:roomName', auth, (req, res) => {
    Room.findOne({ room: req.body.room }, (err, room) => {
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
            Room.updateOne(
                { _id: room._id },
                { $addToSet: { users: req.user._id} }, (err) => {
                    if (err) console.log(err);// return res.json({success: false, err});
            }).exec();

            return res.json({ success: true, room: room.room });
        }
    })
});

router.post('/leave', auth, (req, res) => {
    const roomName = decodeURI(req.body.room)
    console.log(roomName, '방나가기 요청')

    Room.findOne({ room: roomName }, (err, room) => {
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
            console.log(room.room, '방에서 나갑니다.')
            Room.updateOne(
                { _id: room._id },
                { $pull: { users: req.user._id} }, (err) => {
                    if (err) console.log(err);// return res.json({success: false, err});
            }).exec();

            return res.redirect('/api/rooms/roomList');
        }
    });
})

router.post('/createRoom', auth, (req, res) => {
    const room = new Room({
        room: req.body.room,
        admin: true,
        drawer: true
    })

    Room.findOne({ room: decodeURI(req.body.room) }, (err, room) => {
        if (!room) {
            const new_room = new Room({
                room: req.body.room,
                admin: true,
                drawer: true
            })

            console.log(req.body.room);

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
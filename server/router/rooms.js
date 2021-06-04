const express = require('express');
const path = require('path');
const router = express.Router();

const { User } = require('../models/User');
const { Room } = require('../models/Room');
const { auth } = require('../middleware/auth')

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/roomList.html'));
});

router.get('/searchRooms', auth, (req, res) => {
    Room.find((err, rooms) => {
        res.json({ rooms: rooms });
    })
})

router.get('/createRoom', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/createRoom.html'));
});

router.post('/createRoom', auth, (req, res) => {
    Room.findOne({ room: decodeURI(req.body.room) }, (err, room) => {
        if (!room) {
            const new_room = new Room({
                room: req.body.room,
                users: [],
                admin: true,
                drawer: true
            })

            new_room.save((err, roomInfo) => {
                if (err) {
                    return res.json({
                        success: false,
                        msg: '방 등록 실패'
                    })
                } else {
                    return res.json({
                        success: true,
                        msg: '방 등록 완료',
                        roomInfo
                    })
                }
            })
        } else {
            return res.json({
                success: false,
                msg: '이미 사용 중인 방입니다.'
            })
        }
    })
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
                { $addToSet: { users: req.user}}, (err) => {
                    if (err) console.log(err);// return res.json({success: false, err});
            }).exec();

            return res.json({ success: true, room: room.room });
        }
    })
});

router.post('/leave', auth, (req, res) => {
    const roomName = req.body.room;

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
            room.users.pull(req.user);
            room.save();

            if (room.users.length === 0) {
                room.deleteOne();

                return res.json({
                    success: false,
                    move: true,
                    msg: '방이 사라집니다.'
                })
            } else {
                Room.find({ room: req.body.room }, (err, item) => {
                    return res.json({
                        success: true,
                        move: true,
                        len: item[0].users.length,
                        msg: '방을 나갑니다.'
                    })
                });
            }
        }
    });
})

router.post('/getUsers', auth, (req, res) => {
    Room.find({ room: req.body.room }, (err, item) => {
        if (err) return res.json({success: false, msg: '해당 방은 존재하지 않습니다.'});
        else return res.json({suces:true, len: item[0].users.length});
    });
});

router.post('/check', (req, res) => {
    Room.findOne({ room: req.body.room }, (err, user) => {
        if (!user) {
            return res.json({
                success: true,
                msg: '사용 가능한 방입니다.'
            })
        } else {
            return res.json({
                success: false,
                msg: '이미 사용 중인 방입니다.'
            })
        }
    });
});

module.exports = router
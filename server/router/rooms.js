const express = require('express');
const path = require('path');
const router = express.Router();

const { User } = require('../models/User');
const { Room } = require('../models/Room');
const { auth } = require('../middleware/auth')

let drawer;

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/roomList.html'));
});

router.get('/searchRooms', auth, (req, res) => {
    Room.find((err, rooms) => {
        res.json({ rooms: rooms });
    })
})

router.get('/createRoom', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/createRoom.html'));
});

router.post('/createRoom', auth, (req, res) => {
    Room.findOne({ room: decodeURI(req.body.room) }, (err, room) => {
        if (!room) {
            const new_room = new Room({
                room: req.body.room,
                users: [],
                admin: true,
                drawer: req.user
            })

            req.user.generateToken((err, user) => {
                res.cookie('drawer', user.token);
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

router.get('/checkDrawer', (req, res) => {
    if (req.cookies.x_auth === req.cookies.drawer) return res.json({ result: true })
    else return res.json({ result: false })
})

router.post('/getDrawer', (req, res) => {
    Room.findOne({ room: req.body.room }, (err, room) => {
        if (err) {
            console.log(err)
            return res.json({
                success: false,
                msg: '에러 발생',
                err
            })
        } else {
            User.findOne({ _id: room.drawer }, (err, result) => {
                return res.json({
                    success: true,
                    msg: '그리는 사람 전송',
                    result: result.name
                })
            })
        }
    })
})

router.post('/switchDrawer', (req, res) => {
    Room.findOne({ room: req.body.room }, (err, room) => {
        if (err) {
            console.log(err)
            return res.json({
                success: false,
                msg: '에러 발생',
                err
            })
        } else {
            const drawer = room.drawer;

            while (true) {
                const idx = Math.floor(Math.random() * room.users.length);
                const newDrawer = room.users[idx]

                if (newDrawer.toString() !== drawer.toString()) {
                    room.updateOne(
                        { drawer: room.users[idx] }
                    ).exec();

                    break;
                }
            }
        }

        return res.json({
            success: true,
            msg: 'Drawer 업데이트 성공'
        })
    })
})

router.get('/join/:roomName', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/chatRoom.html'), { room: 'test' })
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
            console.log(req.user.name, '가 ', room.room, '방으로 들어갑니다.')
            Room.updateOne(
                { _id: room._id },
                { $addToSet: { users: req.user } }, (err) => {
                    if (err) console.log(err);
                }).exec();

            User.findOneAndUpdate({ _id: req.user._id }, { roomAdmin: true }, (err, item) => {
                if (err) console.log(err);
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
            console.log(req.user.name, '가 ', room.room, '방에서 나갑니다.')

            User.findOneAndUpdate({ _id: req.user._id }, { roomAdmin: false }, (err, item) => {
                if (err) console.log(err);
            }).exec();
            room.users.pull(req.user);
            room.save(() => {
                if (room.users.length === 0) {
                    Room.deleteOne({ _id: room._id }).exec();
                    return res.json({ last: true, move: true });
                } else {
                    const drawer = room.drawer;

                    while (true) {
                        const idx = Math.floor(Math.random() * room.users.length);
                        const newDrawer = room.users[idx]

                        if (newDrawer.toString() !== drawer.toString()) {
                            room.updateOne(
                                { drawer: room.users[idx] }
                            ).exec();

                            break;
                        }
                    }

                    return res.json({ last: false, move: true });
                }
            });
        }
    });
})

router.post('/getUsers', auth, (req, res) => {
    Room.find({ room: req.body.room }, (err, item) => {
        if (err) return res.json({ success: false, msg: '해당 방은 존재하지 않습니다.' });
        else return res.json({ suces: true, len: item[0].users.length });
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
const express = require('express')
const path = require('path')
const router = express.Router()

const { User } = require('../models/User')
const { Room } = require('../models/Room')
const { auth } = require('../middleware/auth')

let drawer

router.get('/roomList', auth, (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/roomList.html'))
})

router.post('/checkName', auth, (req, res) => {
    Room.findOne({ room:  req.body.roomName}, (err, room) => {
        if (room) return res.send({ success: false, msg: '이미 존재하는 방입니다.'})
        return res.send({ success: true })
    })
})

router.get('/getRooms', auth, (req, res) => {
    Room.find((err, rooms) => {
        if (!rooms) return res.json({ success: false, msg: '현재 만들어진 방 없음' })
        res.json({ success: true, rooms: rooms })
    })
})

router.post('/createRoom', auth, (req, res) => {
    const roomName = decodeURI(req.body.room)

    Room.findOne({ room: roomName }, (err, room) => {
        if (!room) {
            const new_room = new Room({
                room: req.body.room,
                users: [],
                admin: true,
                drawer: req.user
            })

            new_room.save((err, roomInfo) => {
                if (err) {
                    return res.json({
                        success: false,
                        msg: '방 등록 실패',
                        err
                    })
                } else {
                    req.user.generateToken((err, user) => {
                        return res.json({
                            success: true,
                            msg: '방 등록 완료',
                            roomInfo
                        })
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
})

router.get('/canPaint', (req, res) => {
    if (req.cookies.x_auth === req.cookies.drawer) {
        return res.json({ result: true })
    } 
    else return res.json({ result: false })
})

router.post('/switchDrawer', (req, res) => {
    Room.findOne({ room: req.body.room })
        .populate('drawer')
        .populate('users')
        .exec((err, room) => {
            if (err) {
                console.log(err)
                return res.json({
                    success: false,
                    msg: '에러 발생',
                    err
                })
            } else {
                const drawer = room.drawer.token

                while (true) {
                    const idx = Math.floor(Math.random() * room.users.length)
                    const newDrawer = room.users[idx]

                    if (newDrawer.token !== drawer) {
                        room.updateOne({ drawer: newDrawer}).exec()
                        return res.cookie('drawer', newDrawer.token).json({
                            success: true,
                            msg: 'Drawer 업데이트 성공'
                        })
                    }
                }
            }            
        })
})

router.post('/join/:roomName', auth, (req, res) => {
    console.log('방들옴')
    const roomName = req.params.roomName

    Room.findOne({ room: roomName })
        .populate('drawer')
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
                Room.updateOne(
                    { _id: room._id },
                    { $addToSet: { users: req.user } }, (err) => {
                        if (err) console.log(err)
                    }).exec()

                return res.send({ success: true, room: room.room, name: req.user.name })
            }
        })
})

router.post('/leave', auth, (req, res) => {
    console.log('방 나간다')
    
    const roomName = req.body.room

    Room.findOne({ room: roomName })
        .populate('drawer')
        .populate('users')
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
                room.users.pull(req.user)
                room.save(() => {
                    if (room.users.length === 0) {
                        Room.deleteOne({ room: roomName }).exec()
                        return res.json({ success: true, last: true, move: true })
                    } else {
                        const idx = Math.floor(Math.random() * room.users.length)
                        const newDrawer = room.users[idx]

                        room.updateOne({ drawer: newDrawer }).exec()
                        return res.json({
                            success: true, last: false, move: true 
                        })
                    }
                })
            }
        })
})

router.post('/getDrawer', (req, res) => {
    Room.findOne({ room: req.body.room })
        .populate('drawer')
        .exec((err, room) => {
            if (err) {
                console.log(err)
                return res.json({
                    success: false,
                    msg: '에러 발생',
                    err
                })
            } else {
                return res.json({
                    success: true,
                    msg: '그리는 사람 전송',
                    result: room.drawer.name
                })
            }
        })
})

router.post('/getUsers', auth, (req, res) => {
    Room.findOne({ room: req.body.room })
        .populate('drawer')
        .exec((err, room) => {
            if (err) return res.json({ success: false, msg: '해당 방은 존재하지 않습니다.' })
            else return res.json({ success: true, len: room.users.length, cookie: room.drawer.token, msg: '쿠키 업데이트' })
        })
})

module.exports = router
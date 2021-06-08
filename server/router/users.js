const express = require('express');
const path = require('path');
const router = express.Router();

const { User } = require('../models/User');
const { Room } = require('../models/Room');
const { auth } = require('../middleware/auth')

router.post('/login', (req, res) => {
    User.findOne({ name: req.body.name }, (err, user) => {
        if (!user) {
            return res.json({
                success: false,
                msg: '해당 유저는 없습니다.'
            })
        }

        user.comparePassword(req.body.pass, (err, isMatch) => {
            if (!isMatch) return res.json({
                success: false,
                msg: '비밀번호가 틀렸습니다.'
            })

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                res.cookie('userName', user.name, {
                    maxAge: 60*60*10,
                    httpOnly: true
                });
                res.cookie('x_auth', user.token, {
                    maxAge: 60*60*10,
                    httpOnly: true
                })
                .status(200)
                .json({
                    success: true,
                    userId: user._id
                })
            })
        })
    })
});

router.get('/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        res.clearCookie('x_auth');
        res.clearCookie('userName');

        if (err) return res.json({
            success: false, err
        });

        return res.status(200).json({
            success: true
        })
    })
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/html/register.html'));
})

router.post('/submitRegister', (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true,
            msg: '회원가입에 성공했습니다 메인페이지로 이동합니다.'
        })
    })
})

router.post('/check', (req, res) => {
    User.findOne({ name: req.body.name }, (err, user) => {
        if (!user) {
            return res.json({
                success: true,
                msg: '사용 가능한 아이디입니다.'
            })
        } else {
            return res.json({
                success: false,
                msg: '이미 사용 중인 아이디입니다.'
            })
        }
    });
});

router.post('/getUsers', auth, (req, res) => {
    Room.findOne({ room: req.body.name }, (err, item) => {
        if (err) {
            return res.json({success: false, msg: '해당 방은 존재하지 않습니다.'});
        } else {
            const userArr = [];

            User.find({ _id: { $in: item.users}})
            .exec().then((data) => {
                data.forEach((item) => {
                    userArr.push(item.name);
                })
            })
            .then(() => {
                return res.json({success:true, users: userArr});
            });  
        }
    });
});

module.exports = router
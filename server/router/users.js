const express = require('express');
const path = require('path');
const router = express.Router();
const { User } = require('../models/User');

router.get('/test', (req, res) => {
    console.log(req.body)
})

router.post('/login', (req, res) => {
    console.log(req.body)

    User.findOne({ name: req.body.name }, (err, user) => {
        if (!user) {
            return res.json({
                success: false,
                msg: '해당 유저는 없습니다.'
            })
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({
                success: false,
                message: '비밀번호가 틀렸습니다.'
            })

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err)

                res.cookie('x_auth', user.token)
                    .status(200)
                    .json({
                        success: true,
                        userId: user._id
                    })
            })
        })
    })
});

router.get('/logout', (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" },
        (err, user) => {
            if (err) return res.json({
                success: false, err
            });

            return res.status(200).json({
                success: true
            })
        })
});

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/register.html'));
})

router.post('/submitRegister', (req, res) => {
    const user = new User(req.body);

    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

router.post('/check', (req, res) => {
    console.log(req.body)

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

router.post('/register/:id/:pass/:memo', (req, res) => {
    
});

router.post('/login/:id/:pass', (req, res) => {
    
});

module.exports = router
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // salt의 길이, salt는 암호화할때 사용하는 것
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },

    password: {
        type: String,
        minlength: 4
    },
    
    role: {
        type: Boolean,
        default: false
    },

    roomAdmin: {
        type: Boolean,
        default: false
    },

    room: {
        type: String
    },

    token: {
        type: String,
        default: ""
    },

    tokenExp: {
        type: Number
    }
}, { timestamps: true })

userSchema.pre('save', function(next) {
    // 이 곳을 가리킴
    const user = this;

    // password 필드가 변환될 때만 실행됨
    if (user.isModified('password')) {
        // 비밀번호를 암호화, bcrypt의 salt를 만들며 동작
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err)
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err)
                user.password = hash
                next()
            });
        });
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPass, cb) {
    // 비밀번호 비교, plainPass와 cryptPass
    bcrypt.compare(plainPass, this.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    // jwt을 이용해 token을 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token
    user.save((err, user) => {
        if (err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // 토큰을 복호화
    jwt.verify(token, 'secretToken', (err, decoded) => {
        // 유저 아이디를 이용해 조회 후, 클라이언트에서 가져온 토큰과 DB의 토큰과 비교
        user.findOne({
            "_id": decoded,
            "token": token
        }, (err, user) => {
            if (err) return cb(err);
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
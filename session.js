const db_infor = require('./key');
const mysql = require('mysql');
const session = require('express-session');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

router.post('/register/:id/:pass', (req, res) => {
    const conn = mysql.createConnection(db_infor);
    const sql = 'INSERT INTO node_table(name_, pass_, memo_) VALUES (?, ?, ?)';
    const data = req.params;

    const query = conn.query(sql, [data.name, data.pass, data.memo], (err, rows) => {
        if (err) {
            conn.end();
            res.send({ success: false, msg: '회원가입 중 에러가 발생했습니다.' })
        };
        if (rows[0].name1 == data.name && rows[0].pass == data.pass) {
            conn.end();
            res.json(200).send({ success: true, name: data.name, msg: '회원가입에 성공했습니다.' });
        } else {
            conn.end();
            res.send({ success: false, msg: '회원가입 중 에러가 발생했습니다.'  });
        }
    });
});

router.post('/login/:id/:pass', (req, res) => {
    const conn = mysql.createConnection(db_infor);
    const sql = 'SELECT * FROM node_table WHERE name_=?';
    const data = req.params;

    const query = conn.query(sql, [data.name], (err, rows) => {
        if (err) {
            conn.end();
            res.send({ success: false, msg: '로그인 중 에러가 발생했습니다.' })
        };
        if (rows[0].name1 == data.name && rows[0].pass == data.pass) {
            conn.end();
            res.json(200).send({ success: true, name: data.name, msg: '성공적으로 로그인 하였습니다.' });
        } else {
            conn.end();
            res.send({ success: false, msg: '로그인 중 에러가 발생했습니다.'  });
        }
    });
});

module.exports = router
const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.join(__dirname, '../../public/index.html'));
})

router.get('/roomList', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/roomList.html'));
})

router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/register.html'));
})

router.get('/check/:name', (req, res) => {
});

router.post('/register/:id/:pass/:memo', (req, res) => {
    
});

router.post('/login/:id/:pass', (req, res) => {
    
});

module.exports = router
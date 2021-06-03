const rooms = document.getElementsByClassName('roomNum'),
    submitBtn = document.getElementById('submit'),
    chat_ul = document.getElementById('messages'),
    chat_input = document.getElementById('msg_input'),
    roomTitle = document.getElementById('title'),
    userNumber = document.getElementById('userNumber'),
    leave_btn = document.getElementById('leave_room');

const socket = io('/chat');

socket.on('msg', (res) => {
    const new_li = document.createElement('li');

    new_li.innerText = res;

    chat_ul.appendChild(new_li);
})

socket.on('roomEnter', (res) => {
    // console.log(res);
})

socket.on('success', (res) => {
    console.log(res)
})

socket.on('error', (res) => {
    console.log(res)
})

socket.on('userNum', (res) => {
    userNumber.innerText = res;
})

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    socket.emit('msg', chat_input.value)
    chat_input.value = '';
});

function extractURL() {
    const url = window.location.href;

    return url.split('/')[url.split('/').length - 1];
}

function enterRoom() {
    const roomName = decodeURI(extractURL());

    socket.emit('joinRoom_chat', roomName);
    roomTitle.innerText = roomName;

    getUsers(roomName, false);
}

function getUsers(name, url) {
    console.log('유저 숫자 읽어오는 중')
    fetch('http://localhost:3000/api/rooms/getUsers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room: name })
    })
    .then((res) => { 
        res.json().then((data) => {
            console.log(data.len)
            socket.emit('getUserNum', data.len)

            if (url)
                window.location.href = url
        });
    })
}

function init() {
    enterRoom()

    leave_btn.addEventListener('click', () => {
        const roomName = decodeURI(extractURL());

        fetch('http://localhost:3000/api/rooms/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ room: roomName })
        })
        .then((res) => {
            getUsers(roomName, res.url);
        })
    })
}

init();
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

// window.onload = () => {
//     console.log('업데이트 하거라')

//     socket.emit('updateRooms', { msg: '방 목록 업데이트 메인' })
// }

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

function getUsers(name, move) {
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
                socket.emit('getUserNum', data.len)

                if (move)
                    location.replace('http://localhost:3000/api/rooms/roomList');
            });
        })
}

function init() {
    socket.emit('updateRooms', { msg: '방 목록 업데이트 메인' })

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
                res.json().then((data) => {
                    if (!data.last)
                        getUsers(roomName, data.move);
                    else
                        location.replace('http://localhost:3000/api/rooms/roomList');
                })

            })
    })

    enterRoom()
}

init();
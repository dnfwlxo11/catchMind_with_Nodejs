const rooms = document.getElementsByClassName('roomNum'),
    submitBtn = document.getElementById('submit'),
    chat_ul = document.getElementById('messages'),
    chat_input = document.getElementById('msg_input'),
    roomTitle = document.getElementById('title'),
    userNumber = document.getElementById('userNumber'),
    leave_btn = document.getElementById('leave_room');

socket.on('msg', (res) => {
    const new_li = document.createElement('li');

    new_li.setAttribute('class', 'msg-li')
    new_li.innerText = res;

    chat_ul.appendChild(new_li);
})

socket.on('roomEnter', (res) => {
    // console.log(res);
})

socket.on('success', (res) => {
    // console.log(res)
})

socket.on('error', (res) => {
    console.log(res)
})

socket.on('userNum', (res) => {
    userNumber.innerText = res.len;
    document.cookie = `drawer=${res.cookie}; path=/`
})

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (chat_input.value) {
        socket.emit('msg', `${getCookie('userName')} : ${chat_input.value}`)
        chat_input.value = '';
    }
});

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;
};

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
    fetch('/api/rooms/getUsers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ room: name })
    })
        .then((res) => {
            res.json().then((data) => {
                socket.emit('getUserNum', { len:data.len, cookie: data.cookie })

                if (move)
                    location.replace('http://localhost:3000/api/rooms/roomList');
            });
        })
}

function init() {
    socket.emit('updateRooms')

    leave_btn.addEventListener('click', () => {
        const roomName = decodeURI(extractURL());

        fetch('/api/rooms/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ room: roomName })
        })
            .then((res) => {
                res.json().then((data) => {
                    socket.emit('updateUsers')
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

export default {
    extractURL
}
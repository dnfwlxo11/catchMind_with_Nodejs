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
    const roomName = decodeURI(extractURL())
    socket.emit('joinRoom_chat', { room: roomName, stat: 'chat'});
    roomTitle.innerText = roomName;
}

function userNum() {
    socket.emit('getUserNum');
}

function init() {    
    enterRoom();
    userNum();

    leave_btn.addEventListener('click', () => {
        socket.emit('leave');
        window.history.back();
    })
}

init();
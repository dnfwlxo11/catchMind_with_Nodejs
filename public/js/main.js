const rooms = document.getElementsByClassName('roomNum');
const submitBtn = document.getElementById('submit');
const chat_ul = document.getElementById('messages');
const chat_input = document.getElementById('msg_input');
const roomTitle = document.getElementById('title');

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
    socket.emit('joinRoom_chat', roomName);
    roomTitle.innerText = roomName;
}

enterRoom();
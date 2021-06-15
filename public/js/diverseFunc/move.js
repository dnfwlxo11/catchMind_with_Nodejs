const rooms = document.getElementsByClassName('roomNum'),
    div = document.getElementById('list-room'),
    ul = document.getElementById('ul-room');

const socket = io('/chat');

socket.on('updateRooms', (res) => {
    console.log('서버가 업데이트 하래');
    searchRooms();
})

function logout() {
    fetch('/api/users/logout')
    .then((res) => {
        res.json().then((data) => {
            if (!data.success) alert('로그아웃중 오류가 발생했습니다.');
            else location.replace('/');
        })
    })
}

function createRoomPage() {
    location.replace('/api/rooms/createRoom');
}

function createRoom(name) {
    const data = {
        room: name
    }

    const config = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch('/api/rooms/createRoom', config)
}

function joinRoom(e) {
    const data = {
        room: e.target.innerText
    }

    const config = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch(`http://localhost:3000/api/rooms/join/${e.target.innerText}`, config)
    .then((res) => {
        window.location.href = res.url;
    })
}

function searchRooms() {
    fetch('http://localhost:3000/api/rooms/searchRooms')
    .then((res) => {

        
        while (ul.hasChildNodes())
            ul.removeChild(ul.firstChild);

        res.json().then((data) => {             
            data.rooms.forEach((item) => {
                const button = document.createElement('button');
                const li = document.createElement('li');

                li.setAttribute('class', 'room');

                button.addEventListener('click', joinRoom)
                button.innerText = item.room;

                li.appendChild(button);
                ul.appendChild(li);
            });
        });
    });
}

function createSubmit() {
    const body = document.querySelector('body');

    body.appendChild(div);

    socket.emit('updateRooms', { msg: '방 목록 업데이트 메인' })
}

createSubmit();
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

function joinRoom(name) {
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

    fetch(`http://localhost:3000/api/rooms/join/${name}`, config)
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
            if (data.success) {          
                data.rooms.forEach((item) => {
                    const button = document.createElement('button');
                    const li = document.createElement('li');

                    li.setAttribute('class', 'room');

                    button.addEventListener('click', () => {
                        joinRoom(item.room)
                    })
                    button.innerText = `방제 : ${item.room}\n접속 수 : ${item.users.length}/6`;

                    li.appendChild(button);
                    ul.appendChild(li);
                });
            }
        });
    });
}

function init() {
    const body = document.querySelector('body');

    body.appendChild(div);

    socket.emit('updateRooms', { msg: '방 목록 업데이트 메인' })
}

init();
const rooms = document.getElementsByClassName('roomNum');

const socket = io('/chat');

socket.on('updateRooms', (res) => {
    console.log('서버가 업데이트 하래');
    searchRooms();
})

function logout() {
    fetch('http://localhost:3000/api/users/logout')
    .then((res) => {
        res.json().then((data) => {
            if (!data.success) alert('로그아웃중 오류가 발생했습니다.');
            else location.replace('http://localhost:3000/');
        })
    })
}

function createRoomPage() {
    location.replace('http://localhost:3000/api/rooms/createRoom');
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

    fetch('http://localhost:3000/api/rooms/createRoom', config)
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
        const div = document.getElementById('rooms-id');
        while (div.hasChildNodes())
            div.removeChild(div.firstChild);

        res.json().then((data) => { 
            const div = document.getElementById('rooms-id');
            
            data.rooms.forEach((item) => {
                const button = document.createElement('button');
                button.addEventListener('click', joinRoom)
                button.innerText = item.room;

                div.appendChild(button);
            });
        });
    });
}

function createSubmit() {
    const body = document.querySelector('body');

    const div = document.createElement('div');

    div.setAttribute('id', 'rooms-id');
    body.appendChild(div);

    socket.emit('updateRooms', { msg: '방 목록 업데이트 메인' })
}

createSubmit();
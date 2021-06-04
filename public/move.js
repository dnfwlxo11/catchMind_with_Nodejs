const rooms = document.getElementsByClassName('roomNum');

// 이걸 DB에서 방들을 불러왔다고 가정, db를 쓴다면 숫자나 해쉬값이 들어갈 것임
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

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

    // roomName.forEach((item) => {
    //     const button = document.createElement('button');

    //     button.addEventListener('click', joinRoom)

    //     createRoom(item);

    //     button.innerText = item;

    //     div.appendChild(button);
    // });

    searchRooms();
}

createSubmit();
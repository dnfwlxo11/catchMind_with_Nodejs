const rooms = document.getElementsByClassName('roomNum');

// 이걸 DB에서 방들을 불러왔다고 가정, db를 쓴다면 숫자나 해쉬값이 들어갈 것임
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

function createRoom(e) {
    const data = {
        room: e.innerText
    }

    const config = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    fetch('http://localhost:3000/api/rooms/createRoom', config)
        .then((res) => {
            console.log(res)
            res.json().then((data) => console.log(data))
        })
}

function createSubmit() {
    const body = document.querySelector('body');
    const div = document.createElement('div');
    body.appendChild(div);

    roomName.forEach((item) => {
        const button = document.createElement('button');

        button.setAttribute('class', 'room-btn');
        button.setAttribute('method', 'GET');
        button.setAttribute('action', `/api/rooms/${item}`)

        createRoom(button);

        button.innerText = item;

        div.appendChild(button);
    });

    const btns = document.getElementsByClassName('room-btn');
    Array.from(btns).forEach((item) => {
        
    })
}

createSubmit();
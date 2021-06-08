const room = document.getElementById('register-id'),
    checkImg = document.getElementsByClassName('idCheck-img'),
    editBtn = document.getElementsByClassName('idEdit-btn'),
    dupleBtn = document.getElementById('duple-btn');

function check() {
    fetch('http://localhost:3000/api/rooms/check', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ room: room.value })
    })
    .then((res) => {
        res.json().then((data) => {
            if (data.success) {
                room.disabled = true;
                checkImg[0].classList.add('visible');
                editBtn[0].classList.add('visible');
                dupleBtn.classList.add('hide');
            } else {
                alert(data.msg);
            }
        });
    })
}

function enableInput() {
    room.disabled = false;
    checkImg[0].classList.remove('visible');
    editBtn[0].classList.remove('visible');
    dupleBtn.classList.remove('hide');
}

function createRoom() {
    if (room.disabled) {
        fetch('/api/rooms/createRoom', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ room: room.value })
        })
        .then((res) => {
            res.json().then((data) => {
                console.log(data.roomInfo.room)

                const data2 = {
                    room: data.roomInfo.room
                }

                const config = {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data2)
                }

                fetch(`/api/rooms/join/${data.roomInfo.room}`, config)
                .then((res) => {
                    window.location.href = res.url;
                })  
            }) 
        });
    } else {
        alert('방이름 중복체크를 해야합니다.')
    }
}
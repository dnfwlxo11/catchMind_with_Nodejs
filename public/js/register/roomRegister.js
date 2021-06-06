function check() {
    const room = document.getElementById('register-id');
    const checkImg = document.getElementsByClassName('idCheck-img');
    const editBtn = document.getElementsByClassName('idEdit-btn');

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
                alert(data.msg);
                room.disabled = true;
                checkImg[0].classList.add('visible');
                editBtn[0].classList.add('visible');
            } else {
                alert(data.msg);
            }
        });
    })
}

function enableInput() {
    const room = document.getElementById('register-id');
    const checkImg = document.getElementsByClassName('idCheck-img');
    const editBtn = document.getElementsByClassName('idEdit-btn');

    room.disabled = false;
    checkImg[0].classList.remove('visible');
    editBtn[0].classList.remove('visible');
}

function createRoom() {
    const room = document.getElementById('register-id');

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
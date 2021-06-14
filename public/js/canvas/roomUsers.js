import answer from './answer.js'

const roomName = document.getElementById('title'),
    usersUl = document.getElementById('users-ul');

const socket = io('/chat');

socket.on('updateUsers', () => {
    getUsers();
    answer.getDrawer();
})

function deleteUsers() {
    const userLi = document.getElementsByClassName('users-li');

    Array.from(userLi).forEach((item) => {
        usersUl.removeChild(item);
    });
}

function getUsers() {
    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: roomName.innerText
        })
    }

    fetch('/api/users/getUsers', config)
    .then((res) => {
        res.json().then((data) => {
            deleteUsers();

            data.users.forEach((item) => {
                const li = document.createElement('li');
                li.setAttribute('class', 'users-li');
                li.innerText = item;

                usersUl.appendChild(li);
            });
        })
    })
}

function init() {
    socket.emit('updateUsers');
}

init();


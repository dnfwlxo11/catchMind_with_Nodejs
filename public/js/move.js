const rooms = document.getElementsByClassName('roomNum');

// 이걸 DB에서 방들을 불러왔다고 가정, db를 쓴다면 숫자나 해쉬값이 들어갈 것임
const roomName = ['고수만', '초보오세요', '창의력 좋은 사람만', '들어올까 말까'];

function createSubmit() {
    roomName.forEach((item) => {
        const body = document.querySelector('body');
        const form = document.createElement('form');
        const button = document.createElement('button');

        form.setAttribute('method', 'POST');
        form.setAttribute('action', `/room/${item}`);

        button.setAttribute('type', 'submit');
        button.innerText = item;

        body.appendChild(form);
        form.appendChild(button);
    });
}

createSubmit();
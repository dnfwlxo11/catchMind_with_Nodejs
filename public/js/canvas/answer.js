import main from './main.js'

const ans_div = document.createElement('div'),
    ans_title = document.createElement('h2'),
    ans_input = document.createElement('input'),
    current_drawer = document.createElement('h2'),
    canvas = document.getElementById('jsCanvas'),
    quizTitle = document.getElementsByClassName('quizTitle'),
    startBtn = document.getElementById('start-quiz');

const ctx = canvas.getContext('2d');

ans_div.setAttribute('class', 'ans_div');
ans_title.setAttribute('class', 'ans_title');
ans_input.setAttribute('id', 'ans_input');
ans_input.setAttribute('class', 'ans_input');
current_drawer.setAttribute('id', 'current-drawer');
ans_input.setAttribute('type', 'text');
ans_input.disabled = true;

socket.on('quizAnswer', (res) => {
    checkAnswer(res);
})

socket.on('endQuiz', (res) => {
    initCanvas();
})

function switchDrawer() {
    const data = {
        room: decodeURI(main.extractURL())
    }

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }
    
    fetch('/api/rooms/switchDrawer', config)
    .then((res) => {
        res.json().then(data => {
            setTimeout(getDrawer, 0);
        })
        
    });
}

function getDrawer() {
    const data = {
        room: decodeURI(main.extractURL())
    }

    const config = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }

    fetch('/api/rooms/getDrawer', config)
    .then((res) => {
        res.json().then((data) => {
            current_drawer.innerText = `그리는 사람 : ${data.result}`;
            // ctx.fillStyle = 'white'
            // ctx.fillRect(0,0,canvas.width, canvas.height);
            // ctx.font = '15px Gulim';
            // ctx.textAlign = 'left';
            // ctx.fillText(`그리는 사람 : ${data.result}`, 20, 30)
        })
    })
}

function checkAnswer(answer) {
    const ctx = canvas.getContext('2d');
    if (answer.result) {
        socket.emit('getDrawer');
        show_wordDiv(answer.word);
        ctx.font = '200px serif';
        ctx.textAlign = 'center';
        ctx.fillText('👌', canvas.width/2, canvas.height/2);
        ans_input.value = '';
        show_wordDiv(answer.word);
        setTimeout(endQuiz, 3000)
    } else {
        alert('틀렸습니다.')
        ans_input.value = '';
    }
}

function initCanvas() {
    const word_div = Array.from(document.getElementsByClassName('word'));

    word_div.forEach((item) => {
        item.classList.add('hide');
        item.innerText = '?';
    })

    quizTitle[0].classList.remove('hide');
    startBtn.classList.remove('hide');

    ans_input.disabled = true;
}

function endQuiz() {
    socket.emit('endQuiz');
    switchDrawer();
}

function submitAnswer(e) {
    if (e.keyCode == 13) {
        const answer = ans_input.value;

        socket.emit('quizAnswer', answer)
    }
}

function show_wordDiv(answer) {
    const word = document.getElementsByClassName('word');

    Array.from(word).forEach((item, index) => {
        item.innerText = answer[index];
    })

    return true;
}

function init() {
    const div = document.getElementById('canvas-div');

    ans_title.innerText = '정답은?';

    div.appendChild(current_drawer);
    div.appendChild(ans_div);
    ans_div.appendChild(ans_title);
    ans_div.appendChild(ans_input);
    

    ans_input.addEventListener('keydown', submitAnswer);

    getDrawer();
}

init();

export default {
    show_wordDiv,
    getDrawer,
    switchDrawer
}
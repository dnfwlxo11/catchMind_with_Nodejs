import main from './chat.js'

const current_drawer = document.getElementById('current-drawer'),
    canvas = document.getElementById('jsCanvas'),
    quizTitle = document.getElementsByClassName('quizTitle'),
    startBtn = document.getElementById('start-quiz'),
    ans_input = document.getElementById('ans-input'),
    control_div = document.getElementById('controls-div'),
    control_colors = document.getElementById('jsColors'),
    canvas_div = document.getElementById('canvas-div');

ans_input.disabled = true;

socket.on('quizAnswer', (res) => {
    checkAnswer(res);
})

socket.on('endQuiz', (res) => {
    initWord();
})

const COLORS = [
    '#2c2c2c',
    'white',
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#4CD963',
    '#5AC8FA',
    '#0579FF',
    '#5856D6'
];

function createFalette() {
    COLORS.forEach(color => {
        const control_color = document.createElement('div');

        control_color.setAttribute('class', 'controls-color jsColor');
        control_color.style.backgroundColor = color;
        control_colors.appendChild(control_color);
    })
}

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
            socket.emit('getDrawer');
        })
    })
}

function checkAnswer(answer) {
    const ctx = canvas.getContext('2d');
    if (answer.result) {
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

function initWord() {
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
    canvas_div.appendChild(control_div);
    control_div.appendChild(control_colors);
    
    ans_input.addEventListener('keydown', submitAnswer);

    createFalette();
    getDrawer();
}

init();

export default {
    show_wordDiv,
    getDrawer,
    switchDrawer
}
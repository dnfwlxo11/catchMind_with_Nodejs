import canvas from './canvas.js';
import answer from './answer.js';

const q_div = document.createElement('div'),
    quizTitle = document.getElementsByClassName('quizTitle'),
    startBtn = document.getElementById('start-quiz');
    
q_div.setAttribute('class', 'words');

const WORD_NUM = 5;
const MAX_WORD = 7;
let word;

socket.on('startQuiz', (res) => {
    const ans_input = document.getElementById('ans_input');
    create_wordDiv(res);

    quizTitle[0].classList.add('hide');
    startBtn.classList.add('hide');

    if (!canvas.getDrawer())
        ans_input.disabled = false;
})

function create_wordDiv(word) {
    for (let i = 0; i < MAX_WORD; i++) {
        const label = document.createElement('div');

        label.setAttribute('class', 'word');
        label.classList.add('hide');
        label.innerText = '?';
        q_div.appendChild(label);
    }

    showTowordlength(word)
}

function showTowordlength(word) {
    const word_div = Array.from(document.getElementsByClassName('word'));

    word_div.forEach((item) => {
        item.classList.add('hide');
    })

    Array.from(word).forEach((item, index) => {
        word_div[index].classList.remove('hide');
    })

    if (canvas.getDrawer())
        answer.show_wordDiv(word);
}

function startQuiz() {
    socket.emit('startQuiz');
}

function init() {
    const div = document.getElementById('canvas-div');
    const title = document.createElement('h1');
    const startBtn = document.getElementById('start-quiz');

    startBtn.addEventListener('click', startQuiz);

    title.setAttribute('class', 'quizTitle');
    title.innerText = '시작하려면 시작하기를 눌러주세요!'

    q_div.appendChild(title);
    div.appendChild(q_div);
}

init();

export default {
    showTowordlength,
    startQuiz
};
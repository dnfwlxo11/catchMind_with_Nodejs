const q_div = document.createElement('div'),
    quizTitle = document.getElementsByClassName('quizTitle'),
    startBtn = document.getElementById('start-quiz');
    
q_div.setAttribute('class', 'words');

const WORD_NUM = 5;
const MAX_WORD = 7;
let word;

socket.on('startQuiz', (res) => {
    const ans_input = document.getElementById('ans_input');
    console.log(res)
    create_wordDiv(res.word, res.res);

    quizTitle[0].classList.add('hide');
    startBtn.classList.add('hide');

    if (getCookie('userName') !== res.res)
        ans_input.disabled = false;
})

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? unescape(value[2]) : null;
}

function create_wordDiv(word, userName) {
    for (let i = 0; i < MAX_WORD; i++) {
        const label = document.createElement('div');

        label.setAttribute('class', 'word');
        label.classList.add('hide');
        label.innerText = '?';
        q_div.appendChild(label);
    }

    showTowordlength(word, userName)
}

function showTowordlength(word, userName) {
    const word_div = Array.from(document.getElementsByClassName('word'));

    word_div.forEach((item) => {
        item.classList.add('hide');
    })

    Array.from(word).forEach((item, index) => {
        word_div[index].classList.remove('hide');
    })

    if (getCookie('userName') === userName)
        show_wordDiv(word);
}

function show_wordDiv(answer) {
    const word = document.getElementsByClassName('word');

    Array.from(word).forEach((item, index) => {
        item.innerText = answer[index];
    })

    return true;
}

function startQuiz() {
    socket.emit('startQuiz', getCookie('userName'));
}

function init() {
    const div = document.getElementById('canvas-div');
    const title = document.createElement('h1');
    const startBtn = document.getElementById('start-quiz');

    startBtn.addEventListener('click', startQuiz);

    title.setAttribute('class', 'quizTitle');
    title.innerText = '시작하려면 시작하기를 눌러주세요!'

    div.appendChild(q_div);
    q_div.appendChild(title);
}

init();

export default {
    showTowordlength,
    startQuiz
};
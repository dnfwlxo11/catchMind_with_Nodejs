const q_div = document.createElement('div'),
    quizTitle = document.getElementsByClassName('quizTitle'),
    startBtn = document.getElementById('start-quiz');

q_div.setAttribute('class', 'words');

const WORD_NUM = 5;
const MAX_WORD = 7;

function createNum() {
    return Math.floor(Math.random() * WORD_NUM);
}

function createWord() {
    return localStorage.getItem(`word_${createNum()}`);
}

function create_wordDiv() {
    const next = localStorage.getItem('next');

    if (next) {
        const word = createWord();
        for (let i=0;i<MAX_WORD;i++) {
            const label = document.createElement('div');

            label.setAttribute('class', 'word');
            label.classList.add('hide');
            label.innerText = '?';
            q_div.appendChild(label);
        }

        localStorage.setItem('answer', word);
        localStorage.setItem('next', false);

        showTowordlength()
    }
}

function showTowordlength() {
    const word = localStorage.getItem('answer');
    const word_div = Array.from(document.getElementsByClassName('word'));
    
    word_div.forEach((item) => {
        item.classList.add('hide');
    })

    Array.from(word).forEach((item, index) => {
        word_div[index].classList.remove('hide');
    })
}

function startQuiz() {
    quizTitle[0].classList.add('hide');
    startBtn.classList.add('hide');
    create_wordDiv();
}

function endQuiz() {
    const word_div = Array.from(document.getElementsByClassName('word'));

    word_div.forEach((item) => {
        item.classList.add('hide');
        item.innerText = '?';
    })

    quizTitle[0].classList.remove('hide');
    startBtn.classList.remove('hide');
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
    createWord, 
    showTowordlength, 
    startQuiz,
    endQuiz 
};
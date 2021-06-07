const q_div = document.createElement('div');

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
    
    word_div.forEach((item, index) => {
        word_div[index].classList.add('hide');
    })

    Array.from(word).forEach((item, index) => {
        word_div[index].classList.remove('hide');
    })
}

function init() {
    const div = document.getElementById('canvas-div');

    div.appendChild(q_div);
    create_wordDiv();
}

init();

export default { createWord, showTowordlength };
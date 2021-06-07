import question from './question.js'

const ans_div = document.createElement('div'),
    ans_title = document.createElement('h2'),
    ans_input = document.createElement('input');

ans_div.setAttribute('class', 'ans_div');
ans_title.setAttribute('class', 'ans_title');
ans_input.setAttribute('id', 'ans_input');
ans_input.setAttribute('class', 'ans_input');
ans_input.setAttribute('type', 'text');

function initQuestion() {
    const word = document.getElementsByClassName('word');

    ans_input.value = '';
    localStorage.setItem('next', false);
    localStorage.setItem('answer', question.createWord());
    
    question.showTowordlength();

    Array.from(word).forEach((item) => {
        item.innerText = '?';
    })
}

function submitAnswer(e) {
    if (e.keyCode == 13) {
        const answer = localStorage.getItem('answer');

        let predict = ans_input.value;

        if (answer === predict) {
            show_wordDiv()
            alert('정답입니다!!')
            setTimeout(initQuestion, 3000)
        } else {
            alert('틀렸습니다.')
            ans_input.value = '';
        }
    }
}

function show_wordDiv() {
    const word = document.getElementsByClassName('word');
    const answer = localStorage.getItem('answer');

    Array.from(word).forEach((item, index) => {
        item.innerText = answer[index];
    })

    return true;
}

function init() {
    const div = document.getElementById('canvas-div');

    ans_title.innerText = '정답은?';

    div.appendChild(ans_div);
    ans_div.appendChild(ans_title);
    ans_div.appendChild(ans_input);

    ans_input.addEventListener('keydown', submitAnswer);
}

init();
import question from './question.js'

const ans_div = document.createElement('div'),
    ans_title = document.createElement('h2'),
    ans_input = document.createElement('input');

ans_div.setAttribute('class', 'ans_div');
ans_title.setAttribute('class', 'ans_title');
ans_input.setAttribute('id', 'ans_input');
ans_input.setAttribute('class', 'ans_input');
ans_input.setAttribute('type', 'text');

socket.on('quizAnswer', (res) => {
    checkAnswer(res);
})

socket.on('endQuiz', (res) => {
    show_wordDiv(res);
})

function checkAnswer(answer) {
    if (answer) {
        // show_wordDiv(answer)
        question.endQuiz()
        alert('정답입니다!!')
        ans_input.value = '';
        setTimeout(question.endQuiz, 3000)
    } else {
        alert('틀렸습니다.')
        ans_input.value = '';
    }
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

    div.appendChild(ans_div);
    ans_div.appendChild(ans_title);
    ans_div.appendChild(ans_input);

    ans_input.addEventListener('keydown', submitAnswer);
}

init();

export default {
    show_wordDiv
}
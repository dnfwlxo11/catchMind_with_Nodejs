const ans_div = document.createElement('div'),
    ans_title = document.createElement('h2'),
    ans_input = document.createElement('input'),
    canvas = document.getElementById('jsCanvas'),
    quizTitle = document.getElementsByClassName('quizTitle'),
    startBtn = document.getElementById('start-quiz');

ans_div.setAttribute('class', 'ans_div');
ans_title.setAttribute('class', 'ans_title');
ans_input.setAttribute('id', 'ans_input');
ans_input.setAttribute('class', 'ans_input');
ans_input.setAttribute('type', 'text');
ans_input.disabled = true;

socket.on('quizAnswer', (res) => {
    checkAnswer(res);
})

socket.on('endQuiz', (res) => {
    initCanvas();
})

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

function initCanvas() {
    const word_div = Array.from(document.getElementsByClassName('word'));
    const ctx = canvas.getContext('2d');

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
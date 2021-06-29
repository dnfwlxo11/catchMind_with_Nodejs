import main from './main.js'

const canvas = document.getElementById('jsCanvas');

const ctx = canvas.getContext('2d'),
    colors = document.getElementsByClassName('jsColor');

canvas.setAttribute('id', 'jsCanvas');
canvas.setAttribute('class', 'jsCanvas');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let painting = false;
let mode = false;
let color = '#2c2c2c';
let drawer = 'none';

socket.on('canvasBtn', (res) => {
    const modeBtn = document.getElementById('jsMode');
    const rangeBtn = document.getElementById('jsRange');

    if (res.btn === 'init') {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        rangeBtn.value = 2.5;
        color = '#2c2c2c'
        setOption(false, res.color, 2.5, false);
    } else if (res.btn === 'range') {
        rangeBtn.value = res.range;
    } else if (res.btn === 'mode') {
        modeBtn.innerText = res.mode;
    }
})

socket.on('success', (res) => {
    drawer = res.result;
})

socket.on('userNum', (res) => {
    const usernum = document.getElementById('userNumber');
    usernum.innerText = res.len;
})

socket.on('mouseMove', (res) => {
    setOption(res.options.mode, res.options.color, res.options.width, res.options.painting);
   
    if (!mode) {
        if(res.stat === 'start') {
            ctx.beginPath();
            return ctx.moveTo(res.x_pos, res.y_pos);
        } else {
            ctx.lineTo(res.x_pos, res.y_pos);
            return ctx.stroke();
        }
    } else if (mode && painting) {
        fillMode(color);
    }
})

socket.on('endQuiz', (res) => {
    initCanvas();
})

socket.on('getDrawer', (res) => {
    checkDrawer();
})

window.onresize = (checkCanvase);

function checkCanvase() {
    if (drawer) {
        canvas.width = ctx.canvas.clientWidth;
        canvas.height = ctx.canvas.clientHeight;
        socket.emit('canvasBtn', { btn: 'init', color: '#2c2c2c'});
    }
}

function checkDrawer() {
    fetch('/api/rooms/checkDrawer')
    .then((res) => {
        res.json().then((data) => {
            drawer = data.result;
        })
    })
}

function getOption(color, width) {
    const data = {
        mode,
        color,
        width,
        painting
    }

    return data
}

function setOption(drawMode, lineColor, width, canPaint) {
    mode = drawMode;
    color = lineColor;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    ctx.lineWidth = width;
    painting = canPaint;
}

function getRange() {
    const range = document.getElementById('jsRange');

    return range.value;
}

function handleRangeChange(e) {
    setOption(mode, ctx.strokeStyle, e.target.value, painting);

    socket.emit('canvasBtn', { btn: 'range', range: e.target.value});
}

function startPainting() {
    painting = true;
}

function stopPainting() {
    painting = false;
}

function onMouseMove(e) {
    const x_pos = e.offsetX;
    const y_pos = e.offsetY;

    if (!drawer && painting) {
        alert('아직 그리는 순서가 아닙니다.\n기다려주세요')
    } else if (!painting) {
        if (drawer)
            socket.emit('mouseMove', { x_pos, y_pos, painting, stat: 'start', options: getOption(color, getRange()) })
    } else {
        if (drawer)
            socket.emit('mouseMove', { x_pos, y_pos, painting, stat: 'draw', options: getOption(color, getRange()) })
    }
}

function fillMode() {
    if (mode) {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function handleMenu(e) {
    e.preventDefault();
}

function canvasEvent() {
    if (canvas) {
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mousedown', startPainting);
        canvas.addEventListener('mouseup', stopPainting);
        canvas.addEventListener('mouseleave', stopPainting);
        canvas.addEventListener('click', fillMode);
        canvas.addEventListener('contextmenu', handleMenu);
    }
}

function handleColorClick(e) {
    color = e.target.style.backgroundColor;
    if (drawer)
        setOption(mode, color, getRange(), painting);
}

function handleMode() {
    const modeBtn = document.querySelector('.fill-btn');

    modeBtn.addEventListener('click', () => {
        if (drawer) {
            mode ? mode = false : mode = true;
            mode ? modeBtn.innerText = '채우기모드' : modeBtn.innerText = '연필모드'
            canvasEvent();

            socket.emit('canvasBtn', { btn: 'mode', mode: modeBtn.innerText});
        }
    })
}

function handleSave() {
    const img = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = img;
    link.download = 'export_Image';

    link.click();
}

function enterRoom() {
    const roomName = decodeURI(main.extractURL())
    socket.emit('joinRoom_chat', roomName);
    roomTitle.innerText = roomName;
}

function initCanvas() {
    if (drawer)
        socket.emit('canvasBtn', { btn: 'init', color: '#2c2c2c'});
}

function init() {
    const room_div = document.getElementById('chat-room-div');
    const div = document.getElementById('canvas-div');

    room_div.appendChild(div);
    div.appendChild(canvas);

    setOption(mode, '#2c2c2c', 2.5, painting);
    // enterRoom();
    canvasEvent();
    checkDrawer();
    checkCanvase();

    setTimeout(() => {
        const range = document.getElementById('jsRange');
        const saveBtn = document.getElementById('jsSave');
        const initBtn = document.getElementById('jsInit')

        if (range)
            range.addEventListener('input', handleRangeChange);

        Array.from(colors).forEach(color => {
            color.addEventListener('click', handleColorClick);
        });

        handleMode();

        if (saveBtn) {
            saveBtn.addEventListener('click', handleSave);
        }

        if (initBtn) {
            initBtn.addEventListener('click', initCanvas);
        }
    }, 0);
}

init();
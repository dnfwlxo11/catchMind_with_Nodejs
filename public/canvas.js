const canvas = document.createElement('canvas');

const ctx = canvas.getContext('2d'),
    colors = document.getElementsByClassName('jsColor');

canvas.setAttribute('id', 'jsCanvas');
canvas.setAttribute('class', 'jsCanvas');

canvas.width = 700;
canvas.height = 700;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 700, 700);

let painting = false;
let mode = false;
let color = '#2c2c2c';

const socket = io('/chat');

socket.on('mouseMove', (res) => {
    setOption(res.options.mode, res.options.color, res.options.width, res.options.painting);

    console.log(res)

    if (!mode) {
        if(res.stat === 'start') {
            ctx.beginPath();
            return ctx.moveTo(res.x_pos, res.y_pos);
        } else {
            ctx.lineTo(res.x_pos, res.y_pos);
            return ctx.stroke();
        }
    } else if (mode && painting) {
        fillMode();
    }
}) 

function getOption(color, width) {
    const data = {
        mode,
        color,
        width,
        painting
    }

    return data
}

function setOption(drawMode, color, width, canPaint) {
    mode = drawMode;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    painting = canPaint;
}

function getRange() {
    const range = document.getElementsByClassName('controls-range-input');

    return parseInt(range.value);
}

function handleRangeChange(e) {
    setOption(mode, ctx.strokeStyle, e.target.value);
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

    if (!painting) {
        socket.emit('mouseMove', { x_pos, y_pos, painting, stat: 'start', options: getOption(color, getRange(), painting) })
        
        ctx.beginPath();
        ctx.moveTo(x_pos, y_pos);
    } else {
        socket.emit('mouseMove', { x_pos, y_pos, painting, stat: 'draw', options: getOption(color, getRange(), painting) })
        
        ctx.lineTo(x_pos, y_pos);
        ctx.stroke();
    }
}

function fillMode() {
    if (mode) ctx.fillRect(0, 0, 700, 700);
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
    setOption(mode, color, getRange())
}

function handleMode() {
    const modeBtn = document.querySelector('.fill-btn');

    modeBtn.addEventListener('click', () => {
        mode ? mode = false : mode = true;
        mode ? modeBtn.innerText = '채우기모드' : modeBtn.innerText = '연필모드'
        canvasEvent();
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
    const roomName = decodeURI(extractURL())
    socket.emit('joinRoom_chat', roomName);
    roomTitle.innerText = roomName;
}

function init() {
    const body = document.querySelector('body');

    body.appendChild(canvas);

    setOption(mode, '#2c2c2c', '2.5');
    enterRoom();
    canvasEvent();

    setTimeout(() => {
        const range = document.getElementById('jsRange');
        const saveBtn = document.getElementById('jsSave');

        if (range)
            range.addEventListener('input', handleRangeChange);

        Array.from(colors).forEach(color => {
            color.addEventListener('click', handleColorClick);
        });

        handleMode();

        if (saveBtn) {
            saveBtn.addEventListener('click', handleSave);
        }
    }, 0);
}

init();
const $canvas = document.createElement('canvas');

const ctx = $canvas.getContext('2d'),
    colors = document.getElementsByClassName('jsColor');

$canvas.setAttribute('id', 'jsCanvas');
$canvas.setAttribute('class', 'jsCanvas');

$canvas.width = 700;
$canvas.height = 700;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 700, 700);

let painting = false;
let mode = false;

const socket = io('/chat');

socket.on('mouseMove', (res) => {
    console.log(res)
})

socket.on('getCanvasOption', (res) => {
    // console.log(res)
})

function setCanvas(color, width) {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
}

function handleRangeChange(e) {
    setCanvas(ctx.strokeStyle, e.target.value);
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
        ctx.beginPath();
        ctx.moveTo(x_pos, y_pos);
        // socket.emit('mouseMove', { x_pos, y_pos, painting })
        // socket.on('mouseMove', (res) => {
        //     ctx.beginPath();
        //     ctx.moveTo(res.x_pos, res.y_pos);
        // })  
    } else {
        // socket.emit('mouseMove', { x_pos, y_pos, painting })
        // socket.on('mouseMove', (res) => {
        //     ctx.lineTo(res.x_pos, res.y_pos);
        //     ctx.stroke();
        // })
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
    if ($canvas) {
        $canvas.addEventListener('mousemove', onMouseMove);
        $canvas.addEventListener('mousedown', startPainting);
        $canvas.addEventListener('mouseup', stopPainting);
        $canvas.addEventListener('mouseleave', stopPainting);
        $canvas.addEventListener('click', fillMode);
        $canvas.addEventListener('contextmenu', handleMenu);
    }
}

function handleColorClick(e) {
    const color = e.target.style.backgroundColor;
    setCanvas(color, getRange())
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
    const img = $canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = img;
    link.download = 'export_Image';

    link.click();
}

function getRange() {
    const range = document.getElementsByClassName('controls-range-input');

    return parseInt(range.value);
}

function enterRoom() {
    const roomName = decodeURI(extractURL())
    socket.emit('joinRoom_chat', roomName);
    roomTitle.innerText = roomName;
}



function init() {
    const body = document.querySelector('body');

    body.appendChild($canvas);

    setCanvas('#2c2c2c', '2.5');

    enterRoom();
    socket.emit('getCanvasOption', {
        color: '#2c2c2c',
        painting: painting,
        mode: mode,
        range: '2.5'
    })

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
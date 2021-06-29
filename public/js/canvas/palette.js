const control_div = document.getElementById('controls-div'),
    control_btns = document.getElementById('controls-btns'),
    control_btn_mode = document.getElementById('jsMode'),
    control_btn_save = document.getElementById('jsSave'),
    control_btn_init = document.getElementById('jsInit'),
    control_range = document.getElementById('controls-div'),
    control_range_input = document.getElementById('controls-range-input'),
    control_colors = document.getElementById('jsColors');


const COLORS = [
    '#2c2c2c',
    'white',
    '#FF3B30',
    '#FF9500',
    '#FFCC00',
    '#4CD963',
    '#5AC8FA',
    '#0579FF',
    '#5856D6'
];

function createFalette() {
    COLORS.forEach(color => {
        const control_color = document.createElement('div');

        control_color.setAttribute('class', 'controls-color jsColor');
        control_color.style.backgroundColor = color;
        control_colors.appendChild(control_color);
    })
}

function init() {
    const div = document.getElementById('canvas-div');

    div.appendChild(control_div);

    control_btn_mode.innerText = '연필모드'
    control_btn_save.innerText = '저장하기'
    control_btn_init.innerText = '초기화'

    control_div.appendChild(control_colors);

    createFalette();
}

init();
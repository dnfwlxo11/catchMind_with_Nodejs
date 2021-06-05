const control_div = document.createElement('div'),
    control_colors = document.createElement('div'),
    control_btns = document.createElement('div'),
    control_btn_mode = document.createElement('button'),
    control_btn_save = document.createElement('button'),
    control_btn_init = document.createElement('button'),
    control_range = document.createElement('div'),
    control_range_input = document.createElement('input');

control_div.setAttribute('class', 'controls');
control_colors.setAttribute('id', 'jsColors');
control_colors.setAttribute('class', 'controls-colors');
control_btns.setAttribute('class', 'controls-btns');
control_btn_mode.setAttribute('id', 'jsMode');
control_btn_save.setAttribute('id', 'jsSave');
control_btn_init.setAttribute('id', 'jsInit');
control_btn_mode.setAttribute('class', 'fill-btn');
control_btn_save.setAttribute('class', 'save-btn');
control_btn_init.setAttribute('class', 'init-btn');
control_range.setAttribute('class', 'controls-range');
control_range_input.setAttribute('id', 'jsRange');
control_range_input.setAttribute('class', 'controls-range-input');
control_range_input.setAttribute('type', 'range');
control_range_input.setAttribute('min', '0.2');
control_range_input.setAttribute('max', '10');
control_range_input.setAttribute('value', 2.5);
control_range_input.setAttribute('step', '0.2');

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
    const body = document.querySelector('body');

    body.appendChild(control_div);

    control_div.appendChild(control_range);
    control_range.appendChild(control_range_input);
    control_div.appendChild(control_btns);

    control_btns.appendChild(control_btn_mode);
    control_btns.appendChild(control_btn_save);
    control_btns.appendChild(control_btn_init);
    control_btn_mode.innerText = '연필모드'
    control_btn_save.innerText = '저장하기'
    control_btn_init.innerText = '초기화'

    control_div.appendChild(control_colors);

    createFalette();
}

init();
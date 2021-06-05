function createWord() {
    const word_arr = [
        '나비',
        '호랑이',
        '핸드폰',
        '노트북',
        '마스크'
    ]

    word_arr.forEach((item, index) => {
        localStorage.setItem(`word_${index}`, item);
    })
}

createWord();
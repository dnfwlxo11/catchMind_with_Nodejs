const name = document.getElementById('register-id'),
    checkImg = document.getElementsByClassName('idCheck-img'),
    editBtn = document.getElementsByClassName('idEdit-btn'),
    dupleBtn = document.getElementById('duple-btn'),
    pass = document.getElementById('register-pass');
    

function checkName() {
    fetch('/api/users/check', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name.value })
    })
    .then((res) => {
        res.json().then((data) => {
            if (data.success) {
                name.disabled = true;
                checkImg[0].classList.add('visible');
                editBtn[0].classList.add('visible');
                dupleBtn.classList.add('hide');
            } else {
                alert(data.msg);
            }
        });
    })
}

function enableInput() {
    name.disabled = false;
    checkImg[0].classList.remove('visible');
    editBtn[0].classList.remove('visible');
    dupleBtn.classList.remove('hide');
}

function register() {const data = {
        name: name.value,
        password: pass.value
    }

    if (name.disabled) {
        fetch('/api/users/submitRegister', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then((res) => {
            res.json().then((data) => {
                console.log(data)
                if (data.success) {
                    alert(data.msg)
                    location.replace("/")
                } else { 
                    alert(data.msg);
                }
            });
        })
    } else {
        alert('아이디 중복체크를 해야합니다.')
    }
}
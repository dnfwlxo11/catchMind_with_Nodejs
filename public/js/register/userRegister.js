function checkName() {
    const name = document.getElementById('register-id');
    const checkImg = document.getElementsByClassName('idCheck-img');
    const editBtn = document.getElementsByClassName('idEdit-btn');

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
                alert(data.msg);
                name.disabled = true;
                checkImg[0].classList.add('visible');
                editBtn[0].classList.add('visible');
            } else {
                alert(data.msg);
            }
        });
    })
}

function enableInput() {
    const name = document.getElementById('register-id');
    const checkImg = document.getElementsByClassName('idCheck-img');
    const editBtn = document.getElementsByClassName('idEdit-btn');

    name.disabled = false;
    checkImg[0].classList.remove('visible');
    editBtn[0].classList.remove('visible');
}

function register() {
    const name = document.getElementById('register-id');
    const pass = document.getElementById('register-pass');

    const data = {
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
function submitLogin() {
    const name = document.getElementById('id').value;
    const pass = document.getElementById('pass').value;

    const data = {
        name,
        pass
    }

    fetch('/api/users/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then((res) => {
        res.json().then(data => {
            if (!data.success) alert(data.msg);
            else location.replace('/api/rooms/roomList');
        })
    })
}
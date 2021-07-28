<template>
    <div class="container">
        <div class='row'>
            <div class='input-div item'>
                <div class='id-div'>
                    <div class="label">ID : </div>
                    <div class="input"><input type="text" id='id'></div>
                </div>
                <div class='pass-div'>
                    <div class="label">PASS : </div>
                    <div class="input"><input type="password" id='pass'></div>
                </div>
            </div>
            <div class="btn-div item">
                <div class="btn"><button class='login' onclick="submitLogin()">로그인</button></div>
                <div class="btn">
                    <form action="/api/users/register" method="GET">
                        <button class='register' type="submit">회원가입</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Room'
    }
</script>
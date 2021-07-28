<template>
    <div class="container">
        <div class='row justify-content-center'>
            <div class='col-2'>
                <p>아이디 : </p>
            </div>
            <div class="col-3">
                <input type="text" id='id' v-model="id">
            </div>

        </div>
        <div class="row justify-content-center">
            <div class='col-2'>
                <p>비밀번호 : </p>
            </div>
            <div class="col-3">
                <input type="password" id='pass' v-model="pass">

            </div>
        </div>
        <div class="row justify-content-center">
            <button class='btn btn-secondary mr-3' @click="logined">로그인</button>
            <button class='btn btn-primary' type="submit">회원가입</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'Main',

        data() {
            return {
                areLogined: false,

                id: null,
                pass: null
            }
        },
        
        mounted() {
            // this.logined()
        },

        methods: {
            async logined() {
                if (!this.id || !this.pass) {
                    alert('아이디나 비밀번호가 입력되지 않았습니다.')
                    return false
                }

                const sendData = {
                    name: this.id,
                    pass: this.pass
                }

                let res = await axios.post('http://localhost:3000/api/users/login', sendData)

                if (res.data.success) {
                    this.$router.push('/rooms')
                } else {
                    alert(res.data.msg)
                }
            }
        }
    }
</script>
<template>
    <div class="container mt-3 mb-3">
        <div class='row justify-content-center'>
            <div class="col-3 mb-3">
                <input class="input-group" type="text" id='id' v-model="id" placeholder="아이디">
            </div>

        </div>
        <div class="row justify-content-center">
            <div class="col-3 mb-3">
                <input class="input-group" type="password" id='pass' v-model="pass" placeholder="비밀번호">
            </div>
        </div>
        <div class="row justify-content-center">
            <button class='btn btn-secondary mr-3' @click="login">로그인</button>
            <button class='btn btn-primary' type="submit">회원가입</button>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import VueCookies from "vue-cookies"
    
    Vue.use(VueCookies);

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
            this.loginCheck()
        },

        methods: {
            async loginCheck() {
                const token = VueCookies.get('x_auth')
                if (token) this.$router.push('/rooms')
            },

            async login() {
                if (!this.id || !this.pass) {
                    alert('아이디나 비밀번호가 입력되지 않았습니다.')
                    return false
                }

                const sendData = {
                    name: this.id,
                    pass: this.pass
                }

                let res = await axios.post('http://localhost:3000/api/users/login', sendData)

                VueCookies.set('x_auth', res.data.token)

                if (res.data.success) {
                    this.$router.push('/rooms')
                } else {
                    alert(res.data.msg)
                }
            }
        }
    }
</script>
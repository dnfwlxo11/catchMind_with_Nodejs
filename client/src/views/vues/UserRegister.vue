<template>
    <div class='container mt-3 mb-3'>
        <div class="mb-5">
            <h2>회원가입</h2>
        </div>
        <div class="row justify-content-center mb-5">
            <div class="col-2">
                <input class="mr-3 mb-3" type="text" placeholder="아이디" v-model="id">
                <input class="mr-3" type="password" placeholder="비밀번호" v-model="pass">
            </div>
            <div class="col-2">
                <button v-if="!duplicate" type="button" class="btn btn-secondary mr-3" @click="dupliCheck">중복체크</button>
                <button v-if="duplicate" type="button" class='btn btn-secondary mr-3' @click="editName">수정</button>
                <img v-if="duplicate" class='img' src="@/assets/idCheck.png" style="width:25px">
            </div>
        </div>
        <div class="row justify-content-center">    
            <button type="button" class="btn btn-primary mr-3" @click="userRegister">회원가입</button>
            <button type="button" class="btn btn-danger" @click="$router.go(-1)">나가기</button>
        </div>
        <div class="row" style="overflow: auto; max-height: 800px">

        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'register',
    
    data() {
        return {
            duplicate: false,
            id: '',
            pass: ''
        }
    },

    methods: {
        async dupliCheck() {
            if (!this.id) {
                alert('아이디를 입력해주세요.')
                return false
            }

            let res = await axios.post('/api/users/check', { name: this.id })

            if (res.data.success) this.duplicate = true
            else {
                alert(res.data.msg)
                return false
            }
        },

        async userRegister() {
            let res = await axios.post('/api/users/submitRegister', { name: this.id, password: this.pass })

            if (res.data.success) {
                alert('회원가입이 완료되었습니다.\n로그인 해주세요.')
                this.$router.push('/')
            } else {
                alert('회원가입 중 문제가 발생했습니다.\n새로고침 해주세요.')
                return false
            }
        },

        editName() {
            this.roomName = ''
            this.duplicate = false
        },
    }
}
</script>
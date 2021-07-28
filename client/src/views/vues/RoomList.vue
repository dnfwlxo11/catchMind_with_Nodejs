<template>
    <div class="container mt-3">
        <div>
        <button class="btn btn-primary mr-3" @click="createRoom">방만들기</button>
        <button class="btn btn-danger" @click="logout">로그아웃</button>    
        </div>
        <div>
            <ul></ul>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import VueCookies from "vue-cookies"
import axios from 'axios'
    
Vue.use(VueCookies);

export default {
    name: 'createRoom',

    methods: {
        logout() {
            VueCookies.remove('x_auth')
            this.$router.push('/')
        },

        createRoom() {
            this.$router.push('/createRoom')
        }
    }
}
</script>
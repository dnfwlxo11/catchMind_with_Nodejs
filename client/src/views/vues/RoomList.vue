<template>
    <div class="container mt-3">
        <div class="mb-3">
            <button class="btn btn-primary mr-3" @click="createRoom">방만들기</button>
            <button class="btn btn-danger" @click="logout">로그아웃</button>    
        </div>
        <div v-if="isRoom" class="justify-content-center">
            <ul class="list-group">
                <li class="list-group-item w-75" v-for="(item, idx) of roomList" :key="idx">
                    <a class="w-100" @click="join">방이름 : {{item.name}}, 현재인원 : {{item.userNum}}</a>
                </li>
            </ul>
        </div>
        <div v-else>
            <h1>방이 존재하지 않습니다.</h1>
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

    data() {
        return {
            roomList: null,
            isRoom: false
        }
    },

    mounted() {
        this.init()
    },

    methods: {
        async init() {
            await this.getRoomList()
            console.log(this.roomList)
        },

        async getRoomList() {
            let res = await axios.get('/api/rooms/getRooms')

            if (res.data.success) {
                this.roomList = res.data.rooms.map(item => {
                    return {
                        name: item.room,
                        userNum: item.users.length
                    }
                })

                this.isRoom = true
            } else {
                this.isRoom = false
            }
        },

        logout() {
            VueCookies.remove('x_auth')
            this.$router.push('/')
        },

        createRoom() {
            this.$router.push('/createRoom')
        },

        join() {
            console.log('Hi')
        }
    }
}
</script>
<style>
    a {
        color: black;
        display: block;
        text-decoration: none;
    }

    a:link, a:hover, a:active, a:visited {
        text-decoration-line: none;
    }

    li {
        list-style-type: none;
    }
</style>
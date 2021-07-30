<template>
    <div class='container mt-3 mb-3'>
        <div class="row justify-content-center mb-3">
            <div class="id-div">
                <input class="mr-3" type="text" placeholder="방이름" v-model="roomName">
                <button v-if="!duplicate" type="button" class="btn btn-secondary mr-3" @click="dupliCheck">중복체크</button>
                <button v-if="duplicate" type="button" class='btn btn-secondary mr-3' @click="editName">수정</button>
                <img v-if="duplicate" class='img' src="@/assets/idCheck.png" style="width:25px">
            </div>
        </div>
        <div class="row justify-content-center">    
            <button type="button" class="btn btn-primary mr-3" @click="createRoom">방만들기</button>
            <button type="button" class="btn btn-danger" @click="$router.go(-1)">나가기</button>
        </div>
        <div class="row" style="overflow: auto; max-height: 800px">

        </div>
    </div>
</template>
<script>
import axios from 'axios'

export default {
    name: 'createRoom',
    
    data() {
        return {
            duplicate: false,
            roomName: ''
        }
    },

    methods: {
        async dupliCheck() {
            if (!this.roomName) {
                alert('방이름을 입력해주세요.')
                return false
            }

            let res = await axios.post('/api/rooms/checkName', { roomName: this.roomName })

            if (res.data.success) this.duplicate = true
            else {
                alert(res.data.msg)
                return false
            }
        },

        async createRoom() {
            if (!this.duplicate) {
                alert('방이름 중복체크를 해주세요')
                return false
            }

            let res = await axios.post('/api/rooms/createRoom', { room: this.roomName })
            
            alert(res.data.msg)
            if (res.data.success) {
                let res = await axios.get(`/api/rooms/join/${this.roomName}`)

                if (res.data.success) {
                    this.$router.push(`/rooms/${this.roomName}`)
                } else {
                    alert('방이 사라졌거나 꽉 찼습니다.\n새로고침 해주세요.')
                    return false
                }
            } else {
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
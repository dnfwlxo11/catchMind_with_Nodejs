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
            <button type="button" class="btn btn-primary mr-3">방만들기</button>
            <button type="button" class="btn btn-danger" @click="$router.go(-1)">나가기</button>
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
            let res = await axios.post('http://localhost:3000/api/rooms/checkName', { roomName: this.roomName })
            console.log(res)
            if (res.success) this.duplicate = !this.duplicate
            else alert(res.msg)
        },

        editName() {
            this.roomName = ''
            this.duplicate = !this.duplicate
        }
    }
}
</script>
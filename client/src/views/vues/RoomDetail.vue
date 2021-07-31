<template>
    <div class="m-3">
        <div class="row justify-content-center mb-3" style="height: 70px">
            <div class="col-8 bg-info">
                <h3 class="my-auto">{{ $route.params.id }}</h3><p class="my-auto">({{ userNum }})</p>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-2">
                <ul class="list-group mb-3" :style="`overflow: auto;max-height: ${canvasHeight}px;`">
                    <li class="list-group-item" v-for="(item, idx) of userArr" :key="idx">
                        <img class="mb-1" src="@/assets/user.png" style="width:50px"><p class="my-auto">{{ item }}</p>
                    </li>
                </ul>
                <button v-if="isAdmin" class="btn btn-primary mb-2 w-100" @click="startGame">시작하기</button>
                <button class="btn btn-danger mb-3 w-100" @click="leaveRoom">방나가기</button>
            </div>
            <div ref='canvasDiv' class="col-8">
                <div class="row mb-4 justify-content-center">
                    <canvas ref="canvas"></canvas>    
                </div>
                <div class="row mb-4 justify-content-center">
                    <input type="range" class="col-3 form-control-range" min="0.2" max="10" step="0.2" v-model="canvasOption.lineWidth">
                </div>
                <div class="row mb-4 justify-content-center">
                    <button v-if="canvasOption.paintMode" class="btn btn-outline-primary mr-3" @click="changeMode">연필모드</button>
                    <button v-if="!canvasOption.paintMode" class="btn btn-outline-primary mr-3" @click="changeMode">채우기모드</button>
                    <!-- <button class="btn btn-outline-primary mr-3">저장하기</button> -->
                    <button class="btn btn-outline-primary">초기화</button>
                </div>
                <div class="row mb-4 justify-content-center">
                    <div class="mr-3 palette" :ref="`palette_${item}`" v-for="(item, idx) of COLORS" :key="idx" @click="changeColor(item)"></div>
                </div>
            </div>
            <div class="col-2">
                <ul ref="chatUl" class="chat list-group mb-3" :style="`overflow: auto;height: ${canvasHeight}px;max-height: ${canvasHeight}px;`">
                    <li class="list-group-item text-left" v-for="(item, idx) of chatArr" :key="idx" :class="{'text-right': item[0] == userName}">
                        <p class="my-auto w-100">{{ item[0] }}: {{ item[1] }}</p>
                    </li>
                </ul>
                <input class="w-100" type="text" @keyup.enter="sendChat" v-model="chat">
            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import axios from 'axios'
    import io from 'socket.io-client'
    import VueCookies from "vue-cookies"
    
    Vue.use(VueCookies);

    export default {
        name: 'Room',

        data() {
            return {
                COLORS: ['#2c2c2c', '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#4CD963', '#5AC8FA', '#0579FF', '#5856D6'],
                chatArr: [],
                userArr: ['대인', '중인', '소인', '목캔디', '핫초코'],
                roomName: this.$route.params.id,
                userName: VueCookies.get('userName'),
                userNum: 0,
                canvasWidth: 0,
                canvasHeight: 0,
                chat: '',
                isAdmin: true,
                painting: false,
                canvas: null,
                ctx: null,
                canvasOption: {
                    color: '#2C2C2C',
                    lineWidth: 2.5,
                    paintMode: true
                },
                socket: null
            }
        },
        
        created() {
            this.socket = io('http://localhost:3000/chat')
            this.socket.emit('joinRoom_chat', this.roomName)

            this.socket.on('msg', (res) => {
                this.chatArr.push([res.name, res.msg])
            })

            this.socket.on('userNum', (res) => {
                console.log(res)
                this.userNum = res
             })
        },

        mounted() {
            this.init()

            this.setPalette()
        },

        watch: {
            canvasOption: {
                handler() {
                    this.ctx.strokeStyle = this.canvasOption.color
                    this.ctx.lineWidth = this.canvasOption.lineWidth
                },
                
                deep: true
            },
        },

        methods: {
            init() {
                this.canvasEvent()
                this.setCanvas()
            },

            setCanvas() {
                this.canvasWidth = this.$refs.canvasDiv.clientWidth
                this.canvas = this.$refs.canvas
                this.canvas.width  = this.canvasWidth
                this.canvas.height = (this.canvasWidth / 16) * 8
                this.canvasHeight = this.canvas.height
                this.ctx = this.canvas.getContext('2d')
            },

            canvasEvent() {
                this.$refs.canvas.addEventListener('mousemove', this.drawLine)
                this.$refs.canvas.addEventListener('mousedown', this.startPainting)
                this.$refs.canvas.addEventListener('mouseup', this.stopPainting)
                this.$refs.canvas.addEventListener('mouseleave', this.stopPainting)
                this.$refs.canvas.addEventListener('click', this.fillMode)
                this.$refs.canvas.addEventListener('contextmenu', this.handleMenu)
            },

            async leaveRoom() {
                let res = await axios.post('/api/rooms/leave', { room: this.$route.params.id })

                console.log(res.data)
                if (res.data.success) {
                    // this.socket.emit('updateUserNum')
                    this.socket.disconnect()
                    this.$router.push('/rooms')
                } else {
                    alert('방 퇴장중 문제가 발생했습니다.\n새로고침 해주세요.')
                }
            },

            startGame(e) {
                e.preventDefault()

                console.log('게임 시작')
            },

            setPalette() {
                this.COLORS.forEach(item => {
                    const el = this.$refs[`palette_${item}`][0]
                    el.style.backgroundColor = item
                })
            },

            sendChat() {
                this.chat = this.chat == '' ? this.chat : this.chat.trim()
                if (this.chat == '') return false

                this.socket.emit('msg', { msg: this.chat, name: this.userName  })
                this.chat = ''
            },

            startPainting() {
                this.painting = true;
            },

            stopPainting() {
                this.painting = false;
            },

            changeMode() {
                this.canvasOption.paintMode = !this.canvasOption.paintMode
            },

            drawLine(e) {
                const x_pos = e.offsetX
                const y_pos = e.offsetY

                if (!this.painting) {
                    this.ctx.beginPath()
                    this.ctx.moveTo(x_pos, y_pos)
                } else {
                    this.ctx.lineTo(x_pos, y_pos)
                    this.ctx.stroke()
                }
            },

            handleMenu(e) {
                e.preventDefault()
            },

            fillMode() {
                if (!this.canvasOption.paintMode) {
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
                }
            },

            changeColor(color) {
                this.canvasOption.color = color
            }
        }
    }
</script>
<style>
    canvas, ul, button {
        box-shadow: 0 4px 10px rgba(50,50,93,0.2), 0 1px 3px rgba(0.08, 0.08, 0.08, 0.08);
    }

    .palette {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        box-shadow: 0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
</style>
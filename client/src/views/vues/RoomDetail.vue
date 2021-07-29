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
                <button class="btn btn-danger mb-3 w-100">방나가기</button>
            </div>
            <div ref='canvasDiv' class="col-8">
                <div class="row mb-4 justify-content-center">
                    <canvas ref="canvas"></canvas>    
                </div>
                <div class="row mb-4 justify-content-center">
                    <button v-if="paintMode" class="btn btn-outline-primary mr-3" @click="changeMode">연필모드</button>
                    <button v-if="!paintMode" class="btn btn-outline-primary mr-3" @click="changeMode">채우기모드</button>
                    <!-- <button class="btn btn-outline-primary mr-3">저장하기</button> -->
                    <button class="btn btn-outline-primary">초기화</button>
                </div>
                <div class="row mb-4 justify-content-center">
                    <div class="mr-3 palette" :ref="`palette_${item}`" v-for="(item, idx) of COLORS" :key="idx"></div>
                </div>
            </div>
            <div class="col-2">
                <ul ref="chatUl" class="chat list-group mb-3" :style="`overflow: auto;height: ${canvasHeight}px;max-height: ${canvasHeight}px;`">
                    <li class="list-group-item" v-for="(item, idx) of chatArr" :key="idx">
                        <p class="my-auto">{{ item }}</p>
                    </li>
                </ul>
                <input class="w-100" type="text" @keyup.enter="sendChat" v-model="chat">
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Room',

        data() {
            return {
                COLORS: ['#2c2c2c', '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', '#4CD963', '#5AC8FA', '#0579FF', '#5856D6'],
                chatArr: ['안녕하세요', '감사합니다.'],
                userArr: ['대인', '중인', '소인', '목캔디', '핫초코'],
                userNum: 0,
                canvasWidth: 0,
                canvasHeight: 0,
                chat: '',
                isAdmin: true,
                painting: false,
                paintMode: true,
                canvas: null,
                ctx: null,
                color: '#2C2C2C'
            }
        },

        mounted() {
            this.init()

            this.canvasWidth = this.$refs.canvasDiv.clientWidth
            this.canvas = this.$refs.canvas
            this.canvas.width  = this.canvasWidth
            this.canvas.height = (this.canvasWidth / 16) * 8
            this.canvasHeight = this.canvas.height
            this.ctx = this.canvas.getContext('2d')

            this.setPalette()
        },

        methods: {
            init() {
                this.canvasEvent()
            },

            canvasEvent() {
                this.$refs.canvas.addEventListener('mousemove', this.drawLine)
                this.$refs.canvas.addEventListener('mousedown', this.startPainting)
                this.$refs.canvas.addEventListener('mouseup', this.stopPainting)
                this.$refs.canvas.addEventListener('mouseleave', this.stopPainting)
                this.$refs.canvas.addEventListener('click', this.fillMode)
                this.$refs.canvas.addEventListener('contextmenu', this.handleMenu)
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

                this.chatArr.push(this.chat)
                this.chat = ''
            },

            startPainting() {
                this.painting = true;
            },

            stopPainting() {
                this.painting = false;
            },

            changeMode() {
                this.paintMode = !this.paintMode
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
                if (!this.paintMode) {
                    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
                }
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
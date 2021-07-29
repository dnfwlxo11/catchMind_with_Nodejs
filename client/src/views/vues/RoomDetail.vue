<template>
    <div class="m-3 p-3">
        <div class="row justify-content-center">
            <p>asd</p><p>접속자 수</p>
        </div>
        <div class="row justify-content-center">
            <div class="col-3">
                <ul class="list-group">
                    <li class="list-group-item" v-for="(item, idx) of userArr" :key="idx">
                        <p>item</p>
                    </li>
                </ul>
            </div>
            <div ref='canvasDiv' class="col-6">
                <div class="row mb-3">
                    <canvas ref="canvas" style="border: 1px solid"></canvas>    
                </div>
                <div class="row mb-3">
                    <button class="btn btn-secondary mr-3">연필모드</button>
                    <button class="btn btn-secondary mr-3">저장하기</button>
                    <button class="btn btn-secondary">초기화</button>
                </div>
                <div class="row mb-3">
                    <div class="mr-3 palette" :ref="`palette_${item}`" v-for="(item, idx) of COLORS" :key="idx"></div>
                </div>
            </div>
            <div class="col-3">
                <ul class="list-group">
                    <li class="list-group-item" v-for="(item, idx) of chatArr" :key="idx">
                        <p>item</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="row justify-content-center">
            <button class="btn btn-primary" @click="startGame">시작하기</button>
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
                userArr: ['대인', '중인', '소인'],
                canvasWidth: 0
            }
        },

        mounted() {
            this.canvasWidth = this.$refs.canvasDiv.clientWidth
            this.$refs.canvas.width  = this.canvasWidth
            this.$refs.canvas.height = (this.canvasWidth / 16) * 9

            this.setPalette()
        },

        methods: {
            startGame() {
                console.log('게임 시작')
            },

            setPalette() {
                this.COLORS.forEach(item => {
                    const el = this.$refs[`palette_${item}`][0]
                    el.style.backgroundColor = item
                })
            }
        }
    }
</script>
<style>
    .palette {
        width: 50px;
        height: 50px;
        border-radius: 25px;
        box-shadow: 0 4px 6px rgba(50,50,93,0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
    }
</style>
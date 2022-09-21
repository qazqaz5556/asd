<template>
    <div class="drawing-board">
        <canvas ref="canvas"
                :width="options.width"
                :height="options.height"
                @mousedown="handleMouseDown"
                @touchstart="handleMouseDown"
        >
        </canvas>
    </div>
</template>

<script>
    import {isCanvasBlank} from '../utils'

    //自定义一些常量
    //pencilModeType : {DRAW: 'draw', ERASE: 'erase'},

    export default {
        name: "drawingBoard",
        props: {
            width: {
                type: Number,
                require: true,
            },
            height: {
                type: Number,
                require: true,
            },

            strokeStyle: {
                type: String,
                default: '#000000',
            },

            lineWidth: {
                type: Number,
                default: 10,
            },
            pencilMode: {
                type: String,
                default: 'draw'
            },
            scale: {
                type: Number,
                default: 1,
                validator(val) {
                    return val !== 0
                }
            },
            canvasStyle: {
                type: Object,
            }
        },
        data() {
            return {
                ctx: {},
                eventType: '',
                orientation: null,
                //接触点坐标
                startX: null,
                startY: null,
                touching: false,
                boundRect: {},
                lineJoin: 'round',
                lineCap: 'round',
                debounce: null,
            }
        },
        computed: {
            options() {
                return {width: this.width, height: this.height}
            }
        },

        watch: {
            options() {
                this.$nextTick(this.initCtx)
            },
            style: {
                deep: true,
                handler(val) {
                    this.$refs.canvas.style.width = val.width + 'px';
                    this.$refs.canvas.style.height = val.height + 'px';
                    this.$refs.canvas.style.left = val.left + 'px';
                    this.$refs.canvas.style.top = val.top + 'px';
                }
            },

            strokeStyle() {
                this.ctx.strokeStyle = this.strokeStyle
            },

            lineWidth() {
                this.ctx.lineWidth = this.lineWidth
            },
        },
        mounted() {
            this.ctx = this.$refs.canvas.getContext('2d');
            this.initCtx();
            window.onorientationchange = (e) => {
                this.orientation = window.orientation
            }

        }
        ,
        methods: {
            //初始（重置）化context对象，
            initCtx() {
                this.ctx.scale(1 / this.scale, 1 / this.scale);
                this.ctx.strokeStyle = this.strokeStyle;
                this.ctx.lineWidth = this.lineWidth;
                this.ctx.lineJoin = this.lineJoin;
                this.ctx.lineCap = this.lineCap;
            },
            handleMouseDown(event) {
                this.$emit('beforePointerDown');
                event.preventDefault();
                if (this.debounce) {
                    clearTimeout(this.debounce)
                }

                this.touching = true;
                if (event.type === 'touchstart') {
                    event.clientX = event.touches[0].clientX;
                    event.clientY = event.touches[0].clientY;
                }
                //每次点击事件重新绑定。//todo 解决下放到resize里不更新的问题
                this.boundRect = this.$refs.canvas.getBoundingClientRect();
                this.startX = event.clientX - this.boundRect.left;
                this.startY = event.clientY - this.boundRect.top;

                if (this.pencilMode === 'erase') {
                    this.ctx.globalCompositeOperation = "destination-out";
                } else {
                    this.ctx.globalCompositeOperation = "source-over";
                }

                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(this.startX, this.startY);
                this.ctx.stroke();
                window.addEventListener('mousemove', this.handleMouseMove);
                window.addEventListener('touchmove', this.handleMouseMove);
                window.addEventListener('mouseup', this.handleMouseUp);
                window.addEventListener('touchend', this.handleMouseUp);
                this.$emit('pointerDown')
            },

            handleMouseMove(event) {

                if (this.touching) {
                    if (event.type === 'touchmove') {
                        event.clientX = event.touches[0].clientX;
                        event.clientY = event.touches[0].clientY;
                    }
                    let x = event.clientX - this.boundRect.left;
                    let y = event.clientY - this.boundRect.top;
                    this.ctx.lineTo(x, y);
                    this.ctx.stroke();
                }
            },
            handleMouseUp(event) {
                this.touching = false;
                this.ctx.closePath();

                window.removeEventListener('mousemove', this.handleMouseMove);
                window.removeEventListener('touchmove', this.handleMouseMove);
                window.removeEventListener('mouseup', this.handleMouseUp);
                window.removeEventListener('touchend', this.handleMouseUp);

                this.debounce = setTimeout(() => {
                    console.log('发送 抬笔事件');
                    this.$emit('pointerRelease')
                }, 600)
            },
            drawImg(imgBase64) {
                if(!imgBase64) return
                this.$nextTick(() => {
                    let img = document.createElement('img')
                    img.src=imgBase64
                    img.onload=()=>{
                        this.ctx.drawImage(img, 0, 0, this.options.width * this.scale, this.options.height * this.scale)
                        console.log('load');
                        console.log(imgBase64);
                    }
                })
            },
            cleanBoard() {
                this.ctx.clearRect(0, 0, this.options.width * this.scale, this.options.height * this.scale)
            },
            /**
             * 判断canvas是否为空白
             * @return {boolean} canvas是否为空
             */
            isBlank() {
                return isCanvasBlank(this.$refs.canvas)
            },
            /**
             * 返回canvas的base64字符串
             * @returns {string} base64字符串
             */
            getBase64() {
                return this.$refs.canvas.toDataURL();
            }
        }
    }
</script>

<style lang="less">
    .drawing-board {
        position: relative;

        canvas {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
    }


    .mask {
        position: absolute;

    }
</style>

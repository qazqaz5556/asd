<template>
    <section class="draftCanvas">
        <div class="main-container">
            <router-link to="/">
                <button>返回上层</button>
            </router-link>

            <div class="main-draft-container">
                <div class="tools">
                    <button @click="handleToolsClick('pencil')"><i class="iconfont icon-pencil"></i></button>
                    <el-color-picker
                            v-model="pencilColor"
                            @active-change="handleColorChange"></el-color-picker>
                    <el-slider
                            :min="1"
                            :max="50"
                            class="tool-slider"
                            v-model="lineWidth"
                            @change="handleSliderChange">
                    </el-slider>
                    <button @click="handleToolsClick('eraser')"><i class="iconfont icon-erase"></i></button>
                    <button @click="handleToolsClick('clean')"><i class="iconfont icon-qingkong"></i> 清空画布</button>
                </div>
                <DrawingBoard class="canvas-container"
                              ref="drawBoard"
                              :width="800"
                              :height="600"
                              :scale="1"
                              :pencil-mode="pencilMode"
                              :line-width="lineWidth"
                              :stroke-style="pencilColor">
                </DrawingBoard>
                <div class="search-btn-container">
                    <button @click="searchOneKey">一键检索</button>
                    <br>
                    <button @click="searchDraft">草图检索</button>

                </div>
            </div>
            <div class="avatar-container">
                <transition-group name="showin" :duration="{ enter: 500, leave: 0 }">

                    <div class="avatar-view" @click=handleResultImgClick(value)
                         v-for="(value ,index) in searchResult"
                         :style="'width:236px;left:241px'  "
                         :key="index"
                    >
                        <img @load="handleImgLoad"
                             crossorigin='anonymous'
                             :src="`${serverUrl}/flaskr2/static/Imgs/` +value" width="220" alt="error">
                    </div>
                </transition-group>

            </div>

        </div>
    </section>
</template>

<script>

    import {serverUrl} from "../api/api";
    import eraserIcon from '../assets/mouseShape/eraser2.ico';
    import axios from 'axios';
    import {getDraftSelf, getDraftOneKey} from '../api/api'
    import DrawingBoard from "./DrawingBoard";
    import {mapMutations, mapState} from 'vuex'
    import {UPDATE_SELECTED_IMG_URL} from "../store/mutation-types";

    export default {
        name: "DraftCanvas",
        data() {
            return {
                serverUrl,
                pencilColor: '#000000',
                pencilMode: 'draw', //draw,erase
                lineWidth: 1,
                pointArray: [],
                ctx: null,
                canvasAttach: false,
                searchResult: [],
                //瀑布流
                imgs: [],
                colCount: 5,//定义列数,
                colHeightArray: [0, 0, 0, 0, 0] //定义列高度数组

            }
        },
        computed: mapState(['selectedImgUrl']),
        watch: {
            $route(to, from) {

                this.handleToolsClick('clean');
                this.searchResult = []
                this.colHeightArray = [0, 0, 0, 0, 0]

            }
        },

        components: {
            // toolSlider
            DrawingBoard
        },
        methods: {
            ...mapMutations([UPDATE_SELECTED_IMG_URL]),
            handleColorChange(value) {
                this.pencilMode = 'draw';
                this.pencilColor = value
            },
            handleSliderChange(value) {
                this.lineWidth = value
            },

            handleImgLoad(e) {

                var minValue = this.colHeightArray[0]  //定义最小的高度
                var minIndex = 0  //定义最小高度的下标
                for (var i = 0; i < this.colCount; i++) {
                    if (this.colHeightArray[i] < minValue) {   //如果最小高度组数中的值小于最小值
                        minValue = this.colHeightArray[i]   //那么认为最小高度数组中的值是真正的最小值
                        minIndex = i  //最小下标为当前下标;
                    }
                }

                e.target.parentElement.style.left = minIndex * (236 + 5) + 'px';
                e.target.parentElement.style.top = minValue + 'px';
                this.colHeightArray[minIndex] += e.target.parentElement.offsetHeight + 5

                // }
                // )


            },
            handleResultImgClick(value) {
                // localStorage.setItem('selectedImg', `${serverUrl}/flaskr2/static/Imgs/${value}`)
                let img = document.createElement('img');
                img.src = `${serverUrl}/flaskr2/static/Imgs/${value}`;

                localStorage.setItem('selectedImg', img.src);

                this.UPDATE_SELECTED_IMG_URL(img.src)

                this.$root.__selectedImg = img;  //todo 删除

                this.$router.push('/edit-page')
            },
            handleToolsClick(nameString) {
                switch (nameString) {
                    case 'eraser':
                        this.pencilMode = 'erase';
                        // this.$refs.drawBoard.style.cursor = `url(${eraserIcon}),auto`;
                        break;
                    case 'clean':
                        this.$refs.drawBoard.cleanBoard();
                    case 'pencil':
                        this.pencilMode = 'draw';
                        break;
                }
            },


            /**
             * 一键搜图 直接将结果显示到右侧界面
             */
            searchOneKey() {
                if (this.$refs.drawBoard.isBlank()) {
                    this.$message('草图不能为空');
                    return
                }

                let base64 = this.$refs.drawBoard.getBase64();
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    // spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                getDraftOneKey(base64)
                    .then(res => {
                        let img = document.createElement('img');
                        img.src = `${serverUrl}/flaskr2/static/Imgs/${res.data.result}`;

                        localStorage.setItem('selectedImgSrc', img.src);
                        this.$root.oneKeyImg = img;
                        this.$router.push({path: '/edit-page',});
                        loading.close()
                    })

                    .catch((e) => {
                        this.$message({type: 'error', message: e});
                        loading.close()
                    })
            },
            searchDraft() {
                if (this.$refs.drawBoard.isBlank()) {
                    this.$message('草图不能为空');
                    return
                }
                this.searchResult = [];
                this.colHeightArray = [0, 0, 0, 0, 0];
                let base64 = this.$refs.drawBoard.getBase64();
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    // spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                getDraftSelf(base64)
                    .then(res => {
                        this.searchResult.push(...res.data);
                        loading.close();
                    })
                    .catch((e) => {
                        this.$message({type: 'error', message: e});
                        loading.close();
                    })
            }
        }
    }
</script>

<style scoped lang="less">
    .draftCanvas {
        background: #fff;
        height: 100vh;

    }

    .main-container {
        /*background-color: #ccc;*/
        width: 1200px;
        margin: 0 auto;
        text-align: left;
        padding-top: 8px;

        .main-draft-container {
            margin-top: 24px;
            border: 1px solid #775ba3;
            box-sizing: border-box;
            height: 818px;

            .tools {
                display: flex;
                padding: 20px 200px;
                height: 100px;
                margin: 0 auto;
                justify-content: space-between;
                align-items: center;

                button {
                    min-width: 48px;
                    height: 40px;
                    color: #333;
                    background-color: #fff;
                    border: 1px solid #ccc;

                    &:focus {
                        outline: none;
                    }

                    &:hover {
                        background-color: #e6e6e6;
                    }

                    &:active {
                        background-color: #fff;
                        box-shadow: 2px 2px 2px #ccc inset;
                    }
                }

                .btn-select {

                }
            }
        }

        .canvas-container {
            height: 600px;
            width: 800px;
            margin: 0 auto;
            background-color: #ccc;
        }

        .search-btn-container {
            padding: 10px 200px;
            /*background-color: #ccc;*/
            text-align: right;

            button {

                margin: 5px 0;
            }
        }

    }

    .avatar-container {
        margin-top: 20px;
        position: relative;

        .avatar-view {
            position: absolute;
            border: 4px solid #fff;
            border-radius: 5px;
            box-sizing: border-box;
            box-shadow: 0 0 5px rgba(0, 0, 0, .15);
            cursor: pointer;

            img {
                width: 100%;
                border-radius: 3px;
            }
        }
    }

    button {
        background: #428bca;
        border: 1px solid #428bca;
        color: #FFFFFF;
        height: 32px;
        /*line-height: 32px;*/
        padding: 2px 10px;
        font-size: 16px;
        letter-spacing: 1.2px;

        border-radius: 5px;

        &:hover {
            background: #AADFFD;
            border-color: #78C3F3;
            color: #004974;
        }
    }

    .showin-enter-active, .showin-leave-active {
        transition: opacity 2s;
    }

    .showin-enter, .showin-leave-to {
        opacity: 0;
    }

    .tool-slider {
        width: 200px;
        height: 40px;
    }
</style>

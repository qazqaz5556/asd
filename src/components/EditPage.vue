<template>
    <div class="edit-page">
        <input type="file" @change="handleFileChange" accept="image/*" ref="fileInput" style="display:none">
        <input type="file" @change="_loadProject" accept="application/zip" ref="input_file_load" style="display:none">
        <input type="file" @change="_addBackgroundImg" accept="image/*" ref="input_file_bg" style="display: none">
        <div class="side-menu side-menu-left" :class="{open:leftMenuOpened}">
            <div class="content-container">
                <div @click="handleToDraftCanvas" class="left-menu-item"><i class="el-icon-search"></i></div>
                <span class="left-menu-text">草图检索</span>
                <div @click="handleUpdateImg" class="left-menu-item"><i class="el-icon-upload2"></i></div>
                <span class="left-menu-text">上传文件</span>
                <div @click="handleComplete" class="left-menu-item"><i class="el-icon-success"></i></div>
                <span class="left-menu-text">完成</span>
                <div @click="handleSaveProject" class="left-menu-item"><i class="el-icon-download"></i></div>
                <span class="left-menu-text">保存</span>
                <div @click="handleLoadProject" class="left-menu-item"><i class="el-icon-folder-opened"></i></div>
                <span class="left-menu-text">加载</span>
            </div>
            <div class="side-menu-switch" @click="switchMenuLeft">
                <i class="triangle triangle-top triangle-shadow"></i>
                <i class="triangle triangle-top"></i>
                <i class="square" :class="['el-icon-arrow-'+(leftMenuOpened?'left':'right')]"></i>
                <i class="triangle triangle-bottom"></i>
                <i class="triangle triangle-bottom triangle-shadow"></i>
            </div>
        </div>

        <div class="edit-main">
            <div class="edit-container">
                <div class="source-container">
                    <div class="canvas-container " ref="sourceContainer">
                        <!--                    <canvas class="source-canvas" ref="sourceCanvas"></canvas>-->
                        <DrawingBoard

                                ref="drawBoard"
                                :width="drawBoardWidth"
                                :height="drawBoardHeight"
                                :scale="drawBoardScale"
                                :pencil-mode="pencilMode"
                                :line-width="lineWidth"
                                :stroke-style="pencilColor"
                                :style="drawBoardStyle"
                                @beforePointerDown="handleBeforePointerDown"
                                @pointerDown="handlePointerDown"
                                @pointerRelease="handlePointerUp"

                        ></DrawingBoard>
                    </div>
                </div>
                <div class="gutter"></div>
                <div class="result-container">
                    <div class="canvas-container " ref="resultContainer">
                        <!--                    <canvas class="result-canvas" ref="resultCanvas"></canvas>-->
                    </div>
                </div>

            </div>
            <div class="controls-container" :class="{'control-bar-open':controlBarOpen}">

                <div class="controls-container-left">
                    <div class="controls-container-group">
                        <el-button size="small" @click="handleToolsClick('clip-front')">
                            <i class="iconfont icon-pencil green"></i>
                            保留
                        </el-button>
                        <el-button size="small" @click="handleToolsClick('clip-back')">
                            <i class="iconfont icon-pencil red"></i>
                            擦除
                        </el-button>
                        <el-button size="small" @click="handleToolsClick('clip-jingxi')">
                            <i class="iconfont icon-pencil blue"></i>
                            精细
                        </el-button>
                        <el-button size="small" @click="handleToolsClick('erase')">
                            <i class="iconfont icon-erase"></i>
                        </el-button>
                        <el-button size="small" @click="handleToolsClick('clean')">
                            <i class="iconfont icon-qingkong"></i>
                            清屏
                        </el-button>
                    </div>
                    <div class="controls-container-group">
                        <el-slider
                                :min="1"
                                :max="50"
                                class="tool-slider"
                                v-model="lineWidth"
                                @change="handleSliderChange"
                        >
                        </el-slider>
                    </div>
                    <div class="controls-container-group big-icon">
                        <el-tooltip :content="undoOptions.content" placement="bottom-start">
                            <el-button type="small" @click="undo" :disabled="!canUndo"
                                       class="left-menu-item">
                                <i class="iconfont icon-undo"></i>
                            </el-button>
                        </el-tooltip>
                        <el-tooltip :content="redoOptions.content" placement="bottom-end">
                            <el-button type="small" @click="redo" :disabled="!canRedo"
                                       class="left-menu-item"><i
                                    class="iconfont icon-redo"></i>
                            </el-button>
                        </el-tooltip>
                    </div>
                </div>
                <div class="controls-container-center">
                    <div class="controls-container-group big-icon" :class="{'reverse-group':!controlBarOpen}"
                         style="transition: transform .5s ease">
                        <el-button size="small" @click="hideAllSlider">
                            <i class="el-icon-full-screen"></i>
                        </el-button>
                    </div>
                </div>
                <div class="controls-container-right">
                    <div class="controls-container-group big-icon">
                        <!--                        <el-button size="small"-->
                        <!--                                   :disabled="!this.rightSprite"-->
                        <!--                                   @click="copySprite">-->
                        <!--                            <i class="iconfont icon-copy"></i>-->
                        <!--                            复制-->
                        <!--                        </el-button>-->
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="deleteSprite">
                            <i class="iconfont icon-clean"></i>
                            <!--                            删除-->
                        </el-button>
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="scale('enlarge')">
                            <i class="iconfont icon-fangda"></i>
                            <!--                            缩放-->
                        </el-button>
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="scale('reduce')">
                            <i class="iconfont icon-suoxiao"></i>
                            <!--                            缩放-->
                        </el-button>
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="reverse('lr')">
                            <i class="iconfont icon-lr-change"></i>
                            <!--                            左右翻转-->
                        </el-button>
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="reverse('tb')">
                            <i class="iconfont icon-tb-change"></i>
                            <!--                            上下翻转-->
                        </el-button>
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="goUp">
                            <i class="iconfont icon-goup"></i>
                            <!--                            上移一层-->
                        </el-button>
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="goDown">
                            <i class="iconfont icon-godown"></i>
                            <!--                            下移一层-->
                        </el-button>
                        <!--                        <el-button size="small"-->
                        <!--                                   :disabled="!this.rightSprite"-->
                        <!--                                   @click="resetSprite">-->
                        <!--                            <i class="iconfont icon-reset"></i>-->
                        <!--                            重置-->
                        <!--                        </el-button>-->
                    </div>
                    <div class="controls-container-group big-icon">
                        <el-button size="small"
                                   :disabled="!this.rightSprite"
                                   @click="handleDownloadFussion">
                            <i class="iconfont el-icon-download"></i>
                            <!--                            删除-->
                        </el-button>
                    </div>
                </div>


            </div>


        </div>
        <div class="side-menu side-menu-right" :class="{open:rightMenuOpened}">

            <div class="content-container">
                <el-tabs v-model="activeTab" :stretch="true" class="custom-tabs">
                    <el-tab-pane label="背景" name="background" class="custom-tab-pane">
                        <el-button @click="addBackgroundImg" style="margin:0 17px 10px 0">添加背景图</el-button>
                        <div class="picture-stack">
                            <div class="picture-stack-backgrounds-container">
                                <transition-group name="bgstack" tag="div">
                                    <div class="background-wrapper"
                                         v-for=" item in rightBackGroundImgs"
                                         :key="item.imgSrc">
                                        <img alt=""
                                             :class="[item.isBeingUse?'is-being-use':'']"
                                             :src="item.imgSrc"
                                             @click="switchBackGroundImg">
                                        <span class="deletbtn el-icon-delete" @click="removeBackgroundImg(item)"></span>
                                    </div>
                                </transition-group>
                            </div>


                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="图层" name="layer" class="custom-tab-pane">
                        <div class="picture-stack-rightImg-Container">
                            <div class="picture-unit" v-for="item in rightImages" :key="item.name">
                                <span class="lock iconfont icon-lock"
                                      :class="{locked:item.locked}"
                                      @click="lockSprite(item)"></span>
                                <img :class="{selected:item.selected}"
                                     :src="item.rt"
                                     alt=""
                                     @click="selectCurrentRightSprite(item.name,$event)">
                                <span><i class="restore iconfont icon-pencil" @click="restore(item)"></i></span>
                            </div>
                        </div>
                    </el-tab-pane>
                </el-tabs>


            </div>

            <div class="side-menu-switch" @click="switchMenuRight">

                <i class="triangle triangle-top triangle-shadow"></i>
                <i class="triangle triangle-top"></i>
                <i class="square" :class="['el-icon-arrow-'+(rightMenuOpened?'left':'right')]"></i>
                <i class="triangle triangle-bottom"></i>
                <i class="triangle triangle-bottom triangle-shadow"></i>

            </div>

        </div>

        <el-dialog
                title="Crop Image"
                :visible.sync="dialogVisible"
                append-to-body
                top="10vh"
                width="30%"
                :before-close=beforeDialogClose>
            <img :src="furtherCropData.result" alt="nothing to show" v-if="furtherCropData.result"
                 style="width: 100%;max-height:45vh;object-fit: contain">
            <span slot="footer" class="dialog-footer">
                <el-checkbox-group v-model="checkMatting">
                    <el-checkbox v-for="item in furtherCropData.data"
                                 :label="item.src" :key="item.src"
                                 border
                                 class="custom-checkbox"
                                 :class="['cus-'+item.color]"
                                 :style="{'border-color': item.color}"
                    >
                         {{item.name}}
                    </el-checkbox>
                </el-checkbox-group>

                <el-button @click="handleDoneClick">done</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
    import _ from 'lodash'
    import JSZip from 'jszip'
    import FileSaver from 'file-saver'
    import * as PIXI from 'pixi.js'
    import {
        getFurtherCrop,
        getInterSeg,
        getMatting,
        getEraser,
        getFineMatting,
        composePicture,
        loadWorkspace, saveWorkspace, downloadComposePicture
    } from "../api/api";
    import {createRightImage, isCanvasBlank, SpriteListItem, generateBase64, createHistoryRecord} from '../utils';
    import DrawingBoard from "./DrawingBoard";
    import History from "./History";
    import {mapState, mapMutations, mapGetters} from 'vuex';
    import {
        UPDATE_SELECTED_IMG_URL,
        PUSH_HISTORY,
        UNDO,
        REDO,
        GOTO_HISTORY,
        REPLACE_HISTORY, UPDATE_RIGHT_IMAGES
    } from "../store/mutation-types";


    window.PIXI = PIXI
    export default {
        name: "EditPage",
        data() {
            return {
                //控制菜单显示
                leftMenuOpened: true,
                rightMenuOpened: true,
                //右侧菜单选项卡
                activeTab: 'background',
                aa: 123,
                //dialog框开关
                dialogVisible: false,
                furtherCropData: '',
                hasBackgroundImg: false,
                //右侧已上传图片列表对应选中的Sprite
                rightSprite: null,
                brush: null,    //刷笔对象
                canvasAttach: false, //刷笔开关
                //画板分辨率，
                drawBoardHeight: 0,
                drawBoardWidth: 0,
                //图片相对于舞台的缩放比例
                drawBoardScale: 1,
                //交互式抠图线宽
                lineWidth: 10,
                pencilMode: 'draw',
                //交互式抠图画笔颜色
                pencilColor: '#00ff00',
                drawBoardStyle: {width: 0, height: 0, top: 0, left: 0, zIndex: 10, opacity: .5, position: 'absolute'},
                //右侧当前响应缩放的sprite
                rightHoverSprite: null,
                //自动扣图识别出的数量。给dialog下的checkbox用的
                checkMatting: [],
                leftImgBase64: '',
                lastSegUrl: '',
                //右侧背景存放数组
                rightBackGroundImgs: [],
                //右侧图片列表存放数组 //rightImages
                rightImgs: [],
                //右侧图片新增时命名的序号。
                ids: 0,
                clipMode: 'clip-front',
                //控制条显示隐藏
                controlBarOpen: true,
                //撤销按钮tooltip信息和disabled
                undoOptions: {content: '撤销', disabled: false},
                redoOptions: {content: '恢复', disabled: false},
                recycleBin: {},
                koutuLock: false
            }
        },
        computed: {
            ...mapState(['selectedImgUrl', 'selectedImgFile', 'selectedImgBase64', 'history', 'redoStack', 'rightImages']),
            ...mapGetters(['canUndo', 'canRedo'])

        },
        watch: {
            $route(to, from) {
                console.log(to, from)
                //新生成实例时不会更改$route
                console.log('$route change', this.$route);
                if (this.$route.path === '/edit-page') {

                    let handleFurtherCrop = (data) => {
                        this.furtherCropData = {...data.data};
                        this.dialogVisible = true
                    };

                    if (from.path === '/') {
                        getFurtherCrop(this.selectedImgBase64, 0)
                            .then(handleFurtherCrop)
                    } else if (from.path === '/draft-canvas') {
                        getFurtherCrop(this.selectedImgUrl, 1)
                            .then(handleFurtherCrop)
                    }
                }
            },

        },
        components: {
            DrawingBoard,
            History
        },
        created() {
            console.log('created');
        },
        mounted() {
            //首次创建实例，初始化并发送网络请求，随后变化在路由里控制
            console.log('mounted');
            console.log('routerInfo', this.$route, this.$router);
            window.addEventListener('resize', this.handleWindowResize.bind(this), true);

            let {width, height} = getComputedStyle(this.$refs.sourceContainer);
            let config = {
                width: parseFloat(width),
                height: parseFloat(height),
                autoResize: true,
                backgroundColor: '0x00ffcc',
                transparent: true,
                forceCanvas: true
            };


            this.cv1 = new PIXI.Application(config);
            this.cv2 = new PIXI.Application(config);
            this.$refs.sourceContainer.appendChild(this.cv1.view);
            this.$refs.resultContainer.appendChild(this.cv2.view);
            this.cv1.view.classList.add('pixi-app');
            this.cv2.view.classList.add('pixi-app');


            this.leftSprite = new PIXI.Sprite();
            this.cv1.stage.addChild(this.leftSprite);

            if (this.selectedImgUrl) {

                // this.createLeftSprite(this.$root.__selectedImg.src);

                let base64
                let isonserver

                this.loadLeftTexture(this.selectedImgUrl)
                    .then(() => {
                        this.leftSprite.texture = PIXI.Texture.from(this.selectedImgUrl);
                        this.leftSprite.textureSrc = this.selectedImgUrl
                        if (/^blob:/.test(this.$root.__selectedImg.src)) {// 本地选取的图片
                            base64 = this.selectedImgBase64
                            isonserver = 0
                        } else {// 草图检索后的图片
                            base64 = this.$root.__selectedImg.src;
                            isonserver = 1
                        }

                        this.leftImgBase64 = base64
                        let loading = this.$loading({
                            lock: true,
                            text: 'Loading',
                            // spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        })

                        getFurtherCrop(base64, isonserver)
                            .then(data => {
                                this.furtherCropData = {...data.data};
                                this.dialogVisible = true
                                loading.close()
                            })
                            .catch((e) => {
                                this.$message({type: "error", message: e})
                                loading.close()
                            })
                    }, (reason) => {
                        console.log(reason);
                    });
            }
            //本地读取文件
            if (this.$root.oneKeyImg) {
                this.createRightSprite(this.$root.oneKeyImg.src)
            }
            /*获取自动扣图*/

            //todo 添加左侧缩放功能
            // this.cv1.view.addEventListener('mousewheel', this.handleMouseWheel.bind(this));
            this.cv2.view.addEventListener('mousewheel', this.handleMouseWheel.bind(this));

            window.$editPage = this
            window.cv1 = this.cv1
            window.cv2 = this.cv2
        },
        methods: {
            ...mapMutations([UPDATE_SELECTED_IMG_URL, PUSH_HISTORY, UNDO, REDO, GOTO_HISTORY, REPLACE_HISTORY, UPDATE_RIGHT_IMAGES]),
            hideAllSlider() {
                if (this.leftMenuOpened || this.rightMenuOpened || this.controlBarOpen) {
                    this.leftMenuOpened = false
                    this.rightMenuOpened = false
                    this.controlBarOpen = false
                } else {
                    this.leftMenuOpened = true
                    this.rightMenuOpened = true
                    this.controlBarOpen = true
                }
            },
            async undo() {

                let currentRecord = this.history[this.history.length - 1];
                this[UNDO]();
                let lastState = this.history[this.history.length - 1]; //用来判断被撤销的操作
                switch (currentRecord.type) {
                    case '新增':

                        let cur_rightImg = this.rightImages.find(v => v.name === currentRecord.name);
                        let cur_sp = this.cv2.stage.getChildByName(currentRecord.name);
                        this.recycleBin[currentRecord.name] = {sp: cur_sp, rImg: cur_rightImg};

                        this[UPDATE_RIGHT_IMAGES]({type: 'remove', data: {name: currentRecord.name}});
                        this.cv2.stage.removeChild(cur_sp);

                        //todo 目标改变后的判断条件 ||新增操作前，左侧区域可能有正在扣边的图，也可能是空的。
                        this.leftSprite.texture = PIXI.Texture.from(lastState.lt);
                        this.leftSprite.mapName = lastState.name;
                        let info = lastState.leftSpriteInfo;
                        this.drawBoardWidth = info.width;
                        this.drawBoardHeight = info.height;
                        this.drawBoardScale = info.scale;
                        this.drawBoardStyle.width = info.styleWidth + 'px';
                        this.drawBoardStyle.height = info.styleHeight + 'px';
                        this.drawBoardStyle.left = info.x + 'px';
                        this.drawBoardStyle.top = info.y + 'px';
                        this.$refs.drawBoard.cleanBoard();
                        this.$refs.drawBoard.drawImg(lastState.label);
                        this.rightSprite = this.cv2.stage.getChildByName(lastState.name);
                        this.lastSegUrl = lastState.rt;
                        break;
                    case '删除':

                        let sp = this.recycleBin[currentRecord.name].sp;
                        let rImg = this.recycleBin[currentRecord.name].rImg;
                        this.cv2.stage.addChild(sp)
                        if(this.cv2.stage.children.length > currentRecord.zIndex){
                            this.cv2.stage.setChildIndex(sp, currentRecord.zIndex)
                        }
                        
                        this.rightSprite = sp;
                        sp.scale.x = currentRecord.scaleX
                        sp.scale.y = currentRecord.scaleY
                        sp.position.set(currentRecord.x, currentRecord.y);

                        rImg.selected = true;
                        this[UPDATE_RIGHT_IMAGES]({type: 'insert', data: rImg})
                        //todo 插入后排序
                        break;
                    case '抠图':
                        let edit_sp = this.cv2.stage.getChildByName(currentRecord.name);
                        edit_sp.texture = PIXI.Texture.from(currentRecord.lastInfo.rt);
                        edit_sp.textureSrc = currentRecord.lastInfo.rt;
                        this.lastSegUrl = currentRecord.lastInfo.rt;

                        let edit_info = currentRecord.leftSpriteInfo;
                        this.leftSprite = PIXI.Texture.from(currentRecord.lastInfo.lt);
                        this.leftSprite.textureSrc = currentRecord.lastInfo.lt;
                        this.leftSprite.scale.set(edit_info.scale);
                        this.leftSprite.x = edit_info.x;
                        this.leftSprite.y = edit_info.y;
                        this.leftSprite.mapName = currentRecord.name;

                        this.drawBoardWidth = edit_info.width;
                        this.drawBoardHeight = edit_info.height;
                        this.drawBoardScale = edit_info.scale;
                        this.drawBoardStyle.width = edit_info.styleWidth + 'px';
                        this.drawBoardStyle.height = edit_info.styleHeight + 'px';
                        this.drawBoardStyle.left = edit_info.x + 'px';
                        this.drawBoardStyle.top = edit_info.y + 'px';
                        this.$refs.drawBoard.cleanBoard();
                        if (currentRecord.lastInfo.label !== null) {
                            this.$refs.drawBoard.drawImg(currentRecord.lastInfo.label);
                        }

                        this[UPDATE_RIGHT_IMAGES]({
                            type: 'edit',
                            data: {
                                name: currentRecord.name,
                                rt: currentRecord.lastInfo.rt,
                                lt: currentRecord.lastInfo.lt,
                                label: currentRecord.lastInfo.label
                            }
                        })
                        break;
                    case '移动':
                        let move_sp = this.cv2.stage.getChildByName(currentRecord.name);
                        move_sp.x = currentRecord.lastInfo.x;
                        move_sp.y = currentRecord.lastInfo.y;
                        this[UPDATE_RIGHT_IMAGES]({
                            type: 'edit',
                            data: {name: currentRecord.name, x: currentRecord.lastInfo.x, y: currentRecord.lastInfo.y}
                        })
                        break;
                    case '翻转':
                    case '缩放':
                        let resize_sp = this.cv2.stage.getChildByName(currentRecord.name)
                        resize_sp.scale.x = currentRecord.lastInfo.scaleX;
                        resize_sp.scale.y = currentRecord.lastInfo.scaleY;
                        this[UPDATE_RIGHT_IMAGES]({
                            type: 'edit',
                            data: {
                                name: currentRecord.name,
                                scaleX: currentRecord.lastInfo.scaleX,
                                scaleY: currentRecord.lastInfo.scaleY,
                            }
                        })
                        break;
                    default:
                        break;
                }
                console.log(lastState);
            },
            async redo() {
                this[REDO]()
                let currentRecord = this.history[this.history.length - 1];

                switch (currentRecord.type) {
                    case '新增':
                        //todo 恢复排列纵深
                        let new_sp = this.recycleBin[currentRecord.name].sp
                        new_sp.texture = PIXI.Texture.from(currentRecord.rt);
                        new_sp.position.set(currentRecord.x, currentRecord.y)
                        new_sp.scale.x = currentRecord.scaleX;
                        new_sp.scale.y = currentRecord.scaleY;

                        let new_rImg = this.recycleBin[currentRecord.name].rImg
                        new_rImg.rt = currentRecord.rt
                        this.leftSprite.texture = PIXI.Texture.from(currentRecord.lt);
                        this.leftSprite.mapName = currentRecord.name;

                        let info = new_rImg.leftSpriteInfo
                        this.drawBoardWidth = info.width;
                        this.drawBoardHeight = info.height;
                        this.drawBoardScale = info.scale;
                        this.drawBoardStyle.width = info.styleWidth + 'px';
                        this.drawBoardStyle.height = info.styleHeight + 'px';
                        this.drawBoardStyle.left = info.x + 'px';
                        this.drawBoardStyle.top = info.y + 'px';
                        this.$refs.drawBoard.cleanBoard();

                        this[UPDATE_RIGHT_IMAGES]({type: 'add', data: new_rImg})
                        this.cv2.stage.addChild(new_sp);

                        this.rightSprite = new_sp
                        this.lastSegUrl = currentRecord.rt
                        break;
                    case '删除':
                        let sp = this.recycleBin[currentRecord.name].sp
                        let rImg = this.recycleBin[currentRecord.name].rImg
                        this.cv2.stage.removeChild(sp);
                        this[UPDATE_RIGHT_IMAGES]({type: 'remove', data: {name: rImg.name}});

                        if (sp.name === this.leftSprite.mapName) {
                            this.leftSprite.texture = null;
                            this.leftSprite.mapName = null;
                            this.drawBoardStyle = {
                                width: 0,
                                height: 0,
                                top: 0,
                                left: 0,
                                zIndex: 10,
                                opacity: .5,
                                position: 'absolute'
                            }
                            this.$refs.drawBoard.cleanBoard()
                        }
                        this.rightSprite = null;
                        break;
                    case '抠图':
                        let edit_sp = this.cv2.stage.getChildByName(currentRecord.name);
                        edit_sp.texture = PIXI.Texture.from(currentRecord.rt);
                        edit_sp.textureSrc = currentRecord.rt

                        this.lastSegUrl = currentRecord.rt

                        let edit_info = currentRecord.leftSpriteInfo

                        this.leftSprite.texture = PIXI.Texture.from(currentRecord.lt);
                        this.leftSprite.textureSrc = currentRecord.lt;
                        this.leftSprite.scale.set(info.scale);
                        this.leftSprite.x = info.x;
                        this.leftSprite.y = info.y;
                        this.leftSprite.mapName = currentRecord.name

                        this.drawBoardWidth = edit_info.width;
                        this.drawBoardHeight = edit_info.height;
                        this.drawBoardScale = edit_info.scale;
                        this.drawBoardStyle.width = edit_info.styleWidth + 'px';
                        this.drawBoardStyle.height = edit_info.styleHeight + 'px';
                        this.drawBoardStyle.left = edit_info.x + 'px';
                        this.drawBoardStyle.top = edit_info.y + 'px';
                        this.$refs.drawBoard.cleanBoard()
                        this.$refs.drawBoard.drawImg(currentRecord.label);

                        this[UPDATE_RIGHT_IMAGES]({
                            type: 'edit', data: {
                                name: currentRecord.name,
                                lt: currentRecord.lt,
                                rt: currentRecord.rt,
                                label: currentRecord.label
                            }
                        })
                        break;
                    case '移动':
                        let move_sp = this.cv2.stage.getChildByName(currentRecord.name);
                        move_sp.x = currentRecord.x;
                        move_sp.y = currentRecord.y;

                        this[UPDATE_RIGHT_IMAGES]({
                            type: 'edit',
                            data: {name: currentRecord.name, x: currentRecord.x, y: currentRecord.y}
                        })
                        break;
                    case '翻转':
                    case '缩放':
                        let resize_sp = this.cv2.stage.getChildByName(currentRecord.name)
                        resize_sp.scale.x = currentRecord.scaleX;
                        resize_sp.scale.y = currentRecord.scaleY;

                        this[UPDATE_RIGHT_IMAGES]({
                            type: 'edit',
                            data: {
                                name: currentRecord.name,
                                scaleX: currentRecord.scaleX,
                                scaleY: currentRecord.scaleY,
                            }
                        })
                        break;
                    //todo 图层绑定一起移除
                    // let wateToremove = this.rightSprite
                    // this.rightSprite = this.rightSprite.parent.getChildByName(lastState.spriteName);
                    // wateToremove.parent.removeChild(wateToremove);
                    // this.lastSegUrl = lastState.rightTextureSrc
                    // break;

                    default:
                        break;
                }
            },
            //左右悬浮菜单开关
            switchMenuLeft() {
                this.leftMenuOpened = !this.leftMenuOpened
            },
            switchMenuRight() {
                this.rightMenuOpened = !this.rightMenuOpened
            },
            //PIXIloader封装
            loadLeftTexture(url) {
                return new Promise((res, rej) => {
                    this.cv1.loader.add(url).load(() => {
                        res()
                    })
                })
            },
            changeLeftSprite(sp, src, info) {
                return new Promise((res, rej) => {
                    this.cv1.loader.add(src)
                        .load(() => {
                            sp.texture = PIXI.Texture.from(src);
                            sp.textureSrc = src;
                            sp.scale.set(info.scale);
                            sp.x = info.x;
                            sp.y = info.y;
                            let spBase64 = this.cv1.renderer.extract.base64(sp)
                            res(spBase64)
                        })
                })

            },
            createRightSprite(src, name) {
                let sp = PIXI.Sprite.from(src);
                sp.name = name;
                sp.textureSrc = src;
                let screenWith = this.cv2.screen.width;
                let screenHeight = this.cv2.screen.height;
                sp.position.set(screenWith / 2, screenHeight / 2);
                sp.anchor.set(0.5);
                return sp
            },
            handleToDraftCanvas() {
                this.$router.push('/draft-canvas')
            },
            handleUpdateImg() {
                this.$refs.fileInput.click()
            },
            handleFileChange(e) {//手动选择前景图
                let f = e.target.files[0];
                if (!/image/.test(f.type)) {
                    alert('格式错误');
                    return
                }
                let img = document.createElement('img');
                let blobUrl = URL.createObjectURL(f);
                img.src = blobUrl
                this.$root.__selectedImg = img;
                this[UPDATE_SELECTED_IMG_URL](img.src)
                localStorage.setItem('selectedImg', img.src);

                // this.cv1.stage.removeChildren()

                let textrue
                this.cv1.loader
                    .add(blobUrl)
                    .load(() => {
                        textrue = new PIXI.Texture.from(blobUrl)
                        this.leftSprite.texture = textrue
                        this.leftSprite.textureSrc = blobUrl
                        this.leftSprite.scale.set(1)
                        this.leftSprite.x = 0
                        this.leftSprite.y = 0
                    })

                // this.leftSprite = PIXI.Sprite.from( this.$root.__selectedImg);
                // this.cv1.stage.addChild(this.leftSprite)

                var fr = new FileReader();
                fr.readAsDataURL(f);
                let base64 = null;

                fr.onload = () => {
                    base64 = fr.result
                    // this.$root.__selectedImg.base64 = base64
                    let loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        // spinner: 'el-icon-loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    })
                    getFurtherCrop(base64, 0)
                        .then((data) => {
                            this.dialogVisible = true;
                            this.furtherCropData = {...data.data};
                            loading.close()
                        })
                        .catch((e) => {
                            this.$message({type: 'error', message: e})
                            loading.close()
                        })
                    this.$refs.fileInput.value = null
                }

            },

            handleSliderChange(value) {
                this.lineWidth = value
            },
            handleToolsClick(nameString) {
                switch (nameString) {
                    case 'erase':
                        this.pencilMode = 'erase';
                        this.clipMode = 'erase';
                        break;
                    case 'clean':
                        this.$refs.drawBoard.cleanBoard()
                    case 'clip-front':
                        this.clipMode = 'clip-front'
                        this.pencilMode = 'draw';
                        this.pencilColor = '#00ff00';
                        break;
                    case 'clip-back':
                        this.clipMode = 'clip-back'
                        this.pencilMode = 'draw';
                        this.pencilColor = '#ff0000';
                        break;
                    case 'clip-jingxi':
                        this.clipMode = 'clip-jingxi'
                        this.pencilMode = 'draw';
                        this.pencilColor = '#0000ff';
                        break;
                }
            },
            handleBeforePointerDown() {
                if (!this.koutuLock) {
                    this.$refs.drawBoard.lastPaint = this.$refs.drawBoard.getBase64();
                    this.koutuLock = true;
                }

                //下笔时重新锁定rightSprite
                this.rightSprite = this.cv2.stage.getChildByName(this.leftSprite.mapName)
            },
            handlePointerDown() {
                this.controlBarOpen = false
            },
            handlePointerUp(e) {
                this.controlBarOpen = true;
                let isonserver = 1
                let last = this.lastSegUrl

                if (!this.$refs.drawBoard.isBlank()) {
                    let label = this.$refs.drawBoard.getBase64();
                    let loading = this.$loading({
                        lock: true,
                        text: 'Loading',
                        background: 'rgba(0, 0, 0, 0.7)'
                    });

                    var lastInfo = {
                        lt: this.leftSprite.textureSrc,
                        rt: this.rightSprite.textureSrc,
                        x: this.rightSprite.x,
                        y: this.rightSprite.y,
                        scaleX: this.rightSprite.scale.x,
                        scaleY: this.rightSprite.scale.y,
                        label: this.$refs.drawBoard.lastPaint,
                    };
                    switch (this.clipMode) {
                        case 'clip-front':
                        case 'clip-back':

                            getInterSeg(isonserver, last, label)
                                .then(data => {
                                    let rt = data.data.front; //裁切好的图片 放到右侧
                                    let lt = data.data.mask; //新的边缘线图片 放到左侧
                                    this.lastSegUrl = data.data.front;

                                    this[UPDATE_RIGHT_IMAGES]({
                                        type: 'edit',
                                        data: {name: this.rightSprite.name, lt, rt, label}
                                    });

                                    PIXI.loader
                                        .add(rt)
                                        .add(lt)
                                        .load(() => {
                                            this.rightSprite.texture = new PIXI.Texture.from(rt);
                                            this.rightSprite.textureSrc = rt

                                            this.leftSprite.texture = new PIXI.Texture.from(lt);
                                            this.leftSprite.textureSrc = lt
                                        });


                                    let record = {
                                        type: '抠图',
                                        name: this.rightSprite.name,
                                        lt,
                                        rt,
                                        x: this.rightSprite.x,
                                        y: this.rightSprite.y,
                                        scaleX: this.rightSprite.scale.x,
                                        scaleY: this.rightSprite.scale.y,
                                        leftSpriteInfo: this.rightImages.find(v => v.name === this.rightSprite.name).leftSpriteInfo,
                                        label,
                                        lastInfo
                                    };
                                    this[REPLACE_HISTORY](record);
                                    this.koutuLock = false;
                                    loading.close()
                                })
                                .catch((e) => {
                                    this.$message({type: 'error', message: e});
                                    console.error(e);
                                    this.koutuLock = false;
                                    loading.close()
                                });
                            break;
                        case 'clip-jingxi':
                            getFineMatting(isonserver, last, label)
                                .then(data => {
                                    let rt = data.data.front; //裁切好的图片 放到右侧
                                    this.lastSegUrl = data.data.front;
                                    PIXI.loader
                                        .add(rt)
                                        .load(() => {
                                            this.rightSprite.texture = new PIXI.Texture.from(rt)
                                            this.rightSprite.textureSrc = rt
                                        });

                                    this[UPDATE_RIGHT_IMAGES]({
                                        type: 'edit',
                                        data: {name: this.rightSprite.name, rt, label}
                                    });

                                    let record = {
                                        type: '抠图',
                                        name: this.rightSprite.name,
                                        lt: this.leftSprite.textureSrc,
                                        rt,
                                        x: this.rightSprite.x,
                                        y: this.rightSprite.y,
                                        scaleX: this.rightSprite.scale.x,
                                        scaleY: this.rightSprite.scale.y,
                                        leftSpriteInfo: this.rightImages.find(v => v.name === this.rightSprite.name).leftSpriteInfo,
                                        label,
                                        lastInfo,
                                    };

                                    this[REPLACE_HISTORY](record);
                                    this.koutuLock = false;
                                    loading.close()
                                })
                                .catch((e) => {
                                    this.$message({type: 'error', message: e});
                                    console.error(e);
                                    this.koutuLock = false;
                                    loading.close()
                                });
                            break;
                        case 'erase':
                            getEraser(isonserver, last, label)
                                .then(data => {
                                    let rt = data.data.front; //裁切好的图片 放到右侧
                                    let lt = data.data.mask; //新的边缘线图片 放到左侧
                                    this.lastSegUrl = data.data.front;

                                    PIXI.loader
                                        .add(rt)
                                        .add(lt)
                                        .load(() => {
                                            this.rightSprite.texture = new PIXI.Texture.from(rt);
                                            this.rightSprite.textureSrc = rt

                                            this.leftSprite.texture = new PIXI.Texture.from(lt);
                                            this.leftSprite.textureSrc = lt

                                        });

                                    this[UPDATE_RIGHT_IMAGES]({
                                        type: 'edit',
                                        data: {name: this.rightSprite.name, lt, rt, label}
                                    });

                                    let record = {
                                        type: '抠图',
                                        name: this.rightSprite.name,
                                        lt,
                                        rt,
                                        x: this.rightSprite.x,
                                        y: this.rightSprite.y,
                                        scaleX: this.rightSprite.scale.x,
                                        scaleY: this.rightSprite.scale.y,
                                        leftSpriteInfo: this.rightImages.find(v => v.name === this.rightSprite.name).leftSpriteInfo,
                                        label,
                                        lastInfo
                                    };
                                    this[REPLACE_HISTORY](record);
                                    this.koutuLock = false;
                                    loading.close()
                                })
                                .catch((e) => {
                                    this.$message({type: 'error', message: e});
                                    loading.close()
                                });
                            break;
                        default:
                            break
                    }
                } else {
                    this.$message({type: 'warn', message: '请绘制前景'})
                }
            },
            drawSpriteBorder(sp) {
                if (!this.__border) {

                    this.__border = new PIXI.Container()
                    this.__border.on('mousedown', (e) => {
                        var borderEvent = _.cloneDeep(e)
                        console.log('border-Event', borderEvent)
                    })

                    for (let i = 0; i < 9; i++) {
                        let g = new PIXI.Graphics()
                        g.name = 'border' + i

                        if (i === 0) {
                            //1个边框
                        } else {
                            //8个控制点
                            g.beginFill(0x000000)
                            g.drawRect(0, 0, 8, 8)
                            g.pivot.set(4, 4);
                        }

                        g.interactive = true
                        g.on('mousedown', (e) => {
                            let name = e.target.name
                            console.log(e.target.name);

                            this.cv2.stage.interactive = true;
                            this.cv2.stage.on('mousemove', () => {
                                switch (name) {
                                    case 'border1':

                                        break;

                                    case 'border2':
                                        break;

                                    case 'border3':
                                        break;

                                    case 'border4':
                                        break;

                                    case 'border5':
                                        break;

                                    case 'border6':
                                        break;

                                    case 'border7':
                                        break;

                                    case 'border8':
                                        break;

                                }
                            })
                        })

                        this.__border.addChild(g)

                    }

                }
                var border = this.__border
                let line = border.children[0]
                line.clear()
                line.lineStyle(1, 0x000000)

                line.moveTo(0, 0)
                line.drawRect(0, 0, sp.width, sp.height)

                border.children[1].x = 0;
                border.children[1].y = 0;

                border.children[2].x = sp.width / 2;
                border.children[2].y = 0;

                border.children[3].x = sp.width;
                border.children[3].y = 0;

                border.children[4].x = 0;
                border.children[4].y = sp.height / 2;

                border.children[5].x = sp.width;
                border.children[5].y = sp.height / 2;

                border.children[6].x = 0;
                border.children[6].y = sp.height;

                border.children[7].x = sp.width / 2;
                border.children[7].y = sp.height;

                border.children[8].x = sp.width;
                border.children[8].y = sp.height;

            },
            /**
             * 为Sprite绑定事件
             * @param {PIXI.Sprite} sp
             */
            addInteractive(sp) {
                sp.interactive = true;
                sp.$selected = false;

                sp.on('mouseover', (e) => {
                    var ct = e.currentTarget
                    // console.log('over', e.currentTarget);
                    this.rightHoverSprite = e.currentTarget
                    ct.$isHover = true;
                });
                sp.on('mouseout', (e) => {
                    var ct = e.currentTarget
                    // console.log('out', e.currentTarget);
                    this.rightHoverSprite = null;
                    ct.$isHover = false;
                });
                sp.on('mousedown', (e) => {

                    var ct = e.currentTarget;
                    this.rightSprite = ct;
                    let lastInfo = {
                        lt: this.leftSprite.textureSrc,
                        rt: this.rightSprite.textureSrc,
                        x: this.rightSprite.x,
                        y: this.rightSprite.y,
                        scaleX: this.rightSprite.scale.x,
                        scaleY: this.rightSprite.scale.y,
                        label: this.$refs.drawBoard.lastPaint,
                    };
                    ct.lastInfo = lastInfo
                    this.rightHoverSprite = ct
                    this[UPDATE_RIGHT_IMAGES]({type: 'select', data: {selectedTargetName: ct.name}});

                    ct.$lastIndx = ct.parent.getChildIndex(ct) //记录上次的排列纵深
                    ct.parent.setChildIndex(ct, ct.parent.children.length - 1);
                    ct.$ox = e.data.global.x - e.currentTarget.x;
                    ct.$oy = e.data.global.y - e.currentTarget.y;

                    //todo 增加缩放框
                    // this.drawSpriteBorder(ct)
                    // this.__border.x = ct.x - ct.width / 2
                    // this.__border.y = ct.y - ct.height / 2
                    // this.cv2.stage.addChild(this.__border)
                    var move = (e) => {
                        var ct = e.currentTarget
                        ct.x = ct.parent.toLocal(e.data.global).x - ct.$ox;
                        ct.y = ct.parent.toLocal(e.data.global).y - ct.$oy;

                        // this.__border.x = ct.x - ct.width / 2
                        // this.__border.y = ct.y - ct.height / 2

                    };
                    var up = (e) => {
                        var ct = e.currentTarget;
                        ct.off('mousemove', move);
                        ct.off('mouseup', up);
                        ct.parent.setChildIndex(ct, ct.$lastIndx)
                        ct.$selected = false
                        this[UPDATE_RIGHT_IMAGES]({type: 'edit', data: {name: ct.name, x: ct.x, y: ct.y}});
                        let rightImage = this.rightImages.find(v => v.name === ct.name);

                        if (ct.lastInfo.x !== ct.x || ct.lastInfo.y !== ct.y) {

                            //若坐标变更，即移动了。新增历史记录
                            let record = {
                                type: '移动',
                                name: ct.name,
                                lt: this.leftSprite.textureSrc,
                                rt: ct.textureSrc,
                                x: ct.x,
                                y: ct.y,
                                scaleX: ct.scale.x,
                                scaleY: ct.scale.y,
                                label: rightImage.label,
                                zIndex: this.cv2.stage.getChildIndex(ct),
                                lastInfo: ct.lastInfo,
                            }
                            this[REPLACE_HISTORY](record)


                        }

                    };

                    ct.on('mousemove', move);
                    ct.on('mouseup', up);
                    ct.on('mouseupoutside', up)
                });


            },

            /**
             * 点击恢复抠图
             */
            restore(listItem) {
                let info = listItem.leftSpriteSizeInfo
                let sp = this.leftSprite;
                this.lastSegUrl = listItem.rt;
                // this.changeLeftSprite(this.leftSprite, listItem.lt, info)

                sp.texture = PIXI.Texture.from(listItem.lt);
                sp.textureSrc = listItem.lt;
                sp.scale.set(info.scale);
                sp.x = info.x;
                sp.y = info.y;

                //todo 重计算左侧图
                this.leftSprite.mapName = listItem.name
                this.drawBoardWidth = info.width;
                this.drawBoardHeight = info.height;
                this.drawBoardScale = info.scale;
                this.drawBoardStyle.width = info.styleWidth + 'px';
                this.drawBoardStyle.height = info.styleHeight + 'px';
                this.drawBoardStyle.left = info.x + 'px';
                this.drawBoardStyle.top = info.y + 'px';
                this.$refs.drawBoard.cleanBoard()
                this.$refs.drawBoard.drawImg(listItem.label);
                this.rightSprite = this.cv2.stage.getChildByName(listItem.name)

                this[UPDATE_RIGHT_IMAGES]({type:'select',data:{selectedTargetName:listItem.name}})
            },
            /**
             * 添加背景图功能，将图片添加到右侧画布作为背景板，同时添加到背景图数组
             */
            addBackgroundImg() {
                this.$refs.input_file_bg.click();
            },
            _addBackgroundImg(e) {
                if (e.target.files.length === 0) {
                    return
                }
                let f = e.target.files[0];
                if (!/image/.test(f.type)) {
                    alert('格式错误');
                    return
                }

                let imgLoadComplete = (e) => {
                    if (this.bgContainer) {
                        // 替换精灵背景图
                        let texture = PIXI.Texture.fromImage(bgImg.src)
                        this.bgSprite.texture = texture
                        let screenWith = this.cv2.screen.width;
                        let screenHeight = this.cv2.screen.height;
                        let scale = bgImg.width > bgImg.height
                            ? screenWith / bgImg.width
                            : screenHeight / bgImg.height;
                        this.bgSprite.scale.set(scale);
                        this.bgContainer.position.set(screenWith / 2, screenHeight / 2);
                    } else {
                        let texture = PIXI.Texture.fromImage(bgImg.src)
                        this.bgContainer = new PIXI.Container();
                        this.bgSprite = PIXI.Sprite.from(texture);
                        let screenWith = this.cv2.screen.width;
                        let screenHeight = this.cv2.screen.height;
                        let scale = bgImg.width > bgImg.height
                            ? screenWith / bgImg.width
                            : screenHeight / bgImg.height;
                        this.bgSprite.scale.set(scale);
                        this.bgSprite.anchor.set(0.5);
                        this.bgContainer.pivot.set(0.5);
                        this.bgContainer.position.set(screenWith / 2, screenHeight / 2);
                        this.bgContainer.addChild(this.bgSprite);
                        this.cv2.stage.addChildAt(this.bgContainer, 0);
                        this.hasBackgroundImg = true;

                    }

                }
                let readFileComplete = (e) => {
                    bgData.dataUrl = e.target.result
                }

                let bgData = {name: '', imgSrc: '', isBeingUse: true, dataUrl: ''}
                bgData.name = 'backGroundImg' + this.rightBackGroundImgs.length

                let fr = new FileReader()
                fr.readAsDataURL(f)
                fr.onload = readFileComplete

                let bgImg = document.createElement('img');
                let objUrl = URL.createObjectURL(f);

                bgImg.src = objUrl
                bgImg.onload = imgLoadComplete
                bgData.imgSrc = objUrl

                this.rightBackGroundImgs.forEach(v => {
                    v.isBeingUse = false
                });

                this.rightBackGroundImgs.push(bgData);


            },
            /**
             * 替换背景图
             */
            switchBackGroundImg(e) {

                let bgImg = e.target;
                this.rightBackGroundImgs.forEach(v => {
                    v.isBeingUse = v.imgSrc == bgImg.src;
                });
                let texture = PIXI.utils.TextureCache[bgImg.src]
                this.bgSprite.texture = texture
                let screenWith = this.cv2.screen.width;
                let screenHeight = this.cv2.screen.height;
                let scale = texture.width > texture.height
                    ? screenWith / texture.width
                    : screenHeight / texture.height;
                this.bgSprite.scale.set(scale);
                this.bgContainer.position.set(screenWith / 2, screenHeight / 2);
            },
            /**
             * 移除背景图
             */
            removeBackgroundImg(item) {
                this.rightBackGroundImgs = this.rightBackGroundImgs.filter(v => v !== item)
            },
            handleWindowResize() {
                let {width, height} = getComputedStyle(this.$refs.sourceContainer);
                this.cv1.view.style.width =
                    this.cv2.view.style.width
                        = width;
                this.cv1.view.style.height =
                    this.cv2.view.style.height
                        = height;
                this.cv1.renderer.resize(parseFloat(width), parseFloat(height));
                this.cv2.renderer.resize(parseFloat(width), parseFloat(height));
            },

            /**
             * 滚轮缩放控制
             * @param e
             */
            handleMouseWheel(e) {
                console.log(e);
                if (this.rightHoverSprite) {
                    if (e.wheelDelta > 0) {
                        if (Math.abs(this.rightHoverSprite.scale.x) > 3) return;
                        this.rightHoverSprite.scale.x += .02 * this.rightHoverSprite.scale.x / Math.abs(this.rightHoverSprite.scale.x);
                        this.rightHoverSprite.scale.y += .02 * this.rightHoverSprite.scale.y / Math.abs(this.rightHoverSprite.scale.y);
                    } else {
                        if (Math.abs(this.rightHoverSprite.scale.x) < 0.25) return;
                        this.rightHoverSprite.scale.x -= .02 * this.rightHoverSprite.scale.x / Math.abs(this.rightHoverSprite.scale.x);
                        this.rightHoverSprite.scale.y -= .02 * this.rightHoverSprite.scale.y / Math.abs(this.rightHoverSprite.scale.y);
                    }
                }

            },
            resultCanvasHover() {
            },
            /**
             * 初始化一个放在右侧的精灵，添加控制标签
             */
            initRightSprite(url) {
                var sp = new PIXI.Sprite.from(url)
                this.cv2.stage.addChild(sp)
                sp.interactive = true;
                // sp.
            },

            /**
             * 展示抠图结果。front 放右侧，mask 放左侧
             */
            async handleDoneClick() {
                this.dialogVisible = false;
                //把选择的图片在服务器上的地址遍历出来
                let front = this.checkMatting;
                let isChoose = front.length === 0 ? '0' : '1';
                let base = this.furtherCropData.result;
                this.lastSegUrl = ''; //每次精细抠图前清空手动（红绿）抠图结果
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    // spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                function calculateLeft(imgSrc, stage) {
                    return new Promise((res, rej) => {
                        let img = document.createElement('img')
                        img.src = imgSrc
                        let info = {}
                        img.onload = () => {
                            info.width = img.width
                            info.height = img.height

                            let scaleMin
                            if (img.width > stage.width) {
                                if (img.height > stage.height) {
                                    let scaleW = stage.width / img.width;
                                    let scaleH = stage.height / img.height;
                                    scaleMin = scaleW < scaleH ? scaleW : scaleH
                                } else {
                                    scaleMin = stage.width / img.width
                                }

                            } else {
                                if (img.height > stage.height) {
                                    scaleMin = stage.height / img.height;
                                } else {
                                    //扩大
                                    let scaleW = stage.width / img.width;
                                    let scaleH = stage.height / img.height;
                                    scaleMin = scaleW < scaleH ? scaleW : scaleH
                                }
                            }

                            info.scale = scaleMin;
                            let styleWidth = info.styleWidth = img.width * scaleMin;
                            let styleHeight = info.styleHeight = img.height * scaleMin;
                            info.x = stage.width / 2 - styleWidth / 2;
                            info.y = stage.height / 2 - styleHeight / 2;
                            res(info)
                        };
                    })
                }

                try {
                    let data = await getMatting(front, isChoose, base)
                    let src = data.data.front //裁切好的图片 放到右侧
                    this.lastSegUrl = data.data.front


                    // 右侧图片别名，添加ID顺序递增
                    let name = 'SpriteNo.' + this.ids++
                    this.rightSprite = this.createRightSprite(src, name);
                    this.addInteractive(this.rightSprite);
                    this.cv2.stage.addChild(this.rightSprite);

                    //计算左侧位置信息

                    let info = await calculateLeft(data.data.mask, this.cv1.screen);
                    let lsBase64 = await this.changeLeftSprite(this.leftSprite, data.data.mask, info);
                    //当前左侧图片所对应的右侧图片，用来检测删除右侧图时，左侧图是否跟随一起移除。
                    this.leftSprite.mapName = name;
                    this.drawBoardWidth = info.width;
                    this.drawBoardHeight = info.height;
                    this.drawBoardScale = info.scale;
                    this.drawBoardStyle.width = info.styleWidth + 'px';
                    this.drawBoardStyle.height = info.styleHeight + 'px';
                    this.drawBoardStyle.left = info.x + 'px';
                    this.drawBoardStyle.top = info.y + 'px';
                    this.$refs.drawBoard.cleanBoard();
                    //保存图片列表
                    let rightSpInfo = createRightImage(name,
                        data.data.mask,
                        data.data.front,
                        this.rightSprite.x,
                        this.rightSprite.y,
                        this.rightSprite.scale.x,
                        this.rightSprite.scale.y,
                        this.cv2.stage.children.length,
                        info
                    )
                    console.log(this.cv2.stage.children.length);

                    this[UPDATE_RIGHT_IMAGES]({type: 'add', data: rightSpInfo});


                    //todo  origin图保存
                    //增添历史记录
                    let record = {
                        type: '新增',
                        name,
                        lt: data.data.mask,
                        rt: data.data.front,
                        x: this.rightSprite.x,
                        y: this.rightSprite.y,
                        scaleX: this.rightSprite.scale.x,
                        scaleY: this.rightSprite.scale.y,
                        zIndex: this.cv2.stage.getChildIndex(this.rightSprite),
                        leftSpriteInfo: info,
                        label: null,
                    };
                    this[REPLACE_HISTORY](record);
                    //清空检索结果
                    this.checkMatting = [];
                    loading.close()
                } catch (e) {
                    this.$message({type: 'error', message: `接口matting ${e}`});
                    loading.close()
                }
            },
            beforeDialogClose(done) {
                this.$message({message: '请至少选择一项', type: 'warning'})
            },
            selectCurrentRightSprite(name, e) {
                this[UPDATE_RIGHT_IMAGES]({type:'select',data:{selectedTargetName:name}})
                this.rightSprite = cv2.stage.getChildByName(name)
            },
            lockSprite(itemFromRightImgs) {
                if (itemFromRightImgs.locked) {
                    itemFromRightImgs.locked = false;
                    this.cv2.stage.getChildByName(itemFromRightImgs.name).interactive = true
                } else {
                    itemFromRightImgs.locked = true;
                    this.cv2.stage.getChildByName(itemFromRightImgs.name).interactive = false
                }
            },
            copySprite() {
                // 拷贝后是插入当前元素下面，还是插到队尾
                // todo createRightSprite 改版
                this.createRightSprite(this.rightSprite.name)
            },
            deleteSprite(e) {

                let spName = this.rightSprite.name

                let cur_rightImg = this.rightImages.find(v => v.name === spName);
                let cur_sp = this.cv2.stage.getChildByName(spName);
                this.recycleBin[spName] = {sp: cur_sp, rImg: cur_rightImg};

                let record = {
                    type: '删除',
                    name: spName,
                    lt: cur_rightImg.lt,
                    rt: cur_rightImg.rt,
                    x: cur_rightImg.x,
                    y: cur_rightImg.y,
                    scaleX: cur_rightImg.scaleX,
                    scaleY: cur_rightImg.scaleY,
                    zIndex: cur_rightImg.zIndex,
                    leftSpriteInfo: cur_rightImg.leftSpriteInfo
                };

                this[REPLACE_HISTORY](record);
                this[UPDATE_RIGHT_IMAGES]({type: 'remove', data: {name: spName}});
                this.cv2.stage.removeChild(cur_sp);

                //如果删除的是正在编辑的图片。那么左侧编辑区一起移除
                if (cur_rightImg.lt === this.leftSprite.textureSrc) {
                    this.leftSprite.texture = null;
                    this.drawBoardStyle = {
                        width: 0,
                        height: 0,
                        top: 0,
                        left: 0,
                        zIndex: 10,
                        opacity: .5,
                        position: 'absolute'
                    }
                    this.$refs.drawBoard.cleanBoard()
                }
                this.rightSprite = null;
            },
            /**
             * 缩放控制
             * @param {String} direction 方向 enlarge = 放大 ，reduce = 缩小
             */
            scale(direction) {

                let lastInfo = {
                    lt: this.leftSprite.textureSrc,
                    rt: this.rightSprite.textureSrc,
                    x: this.rightSprite.x,
                    y: this.rightSprite.y,
                    scaleX: this.rightSprite.scale.x,
                    scaleY: this.rightSprite.scale.y,
                    label: this.$refs.drawBoard.lastPaint,
                };

                if (direction == 'enlarge') {
                    if (Math.abs(this.rightSprite.scale.x) > 3) return;
                    this.rightSprite.scale.x += .1 * this.rightSprite.scale.x / Math.abs(this.rightSprite.scale.x);
                    this.rightSprite.scale.y += .1 * this.rightSprite.scale.y / Math.abs(this.rightSprite.scale.y);
                } else if (direction == 'reduce') {
                    if (Math.abs(this.rightSprite.scale.x) < 0.25) return;
                    this.rightSprite.scale.x -= .1 * this.rightSprite.scale.x / Math.abs(this.rightSprite.scale.x);
                    this.rightSprite.scale.y -= .1 * this.rightSprite.scale.y / Math.abs(this.rightSprite.scale.y);
                } else {
                    console.error('丢失参数');
                    return
                }
                //新增历史记录
                let record = {
                    type: '缩放',
                    name: this.rightSprite.name,
                    scaleX: this.rightSprite.scale.x,
                    scaleY: this.rightSprite.scale.y,
                    lastInfo
                }
                this[REPLACE_HISTORY](record)
            },
            /**
             * 翻转图片
             * @param  {String} direction 方向标识 lr=左右 tb=上下
             */
            reverse(direction) {

                let lastInfo = {
                    lt: this.leftSprite.textureSrc,
                    rt: this.rightSprite.textureSrc,
                    x: this.rightSprite.x,
                    y: this.rightSprite.y,
                    scaleX: this.rightSprite.scale.x,
                    scaleY: this.rightSprite.scale.y,
                    label: this.$refs.drawBoard.lastPaint,
                };

                if (direction == 'lr') {
                    this.rightSprite.scale.x *= -1
                } else if (direction == 'tb') {
                    this.rightSprite.scale.y *= -1
                } else {
                    console.error('丢失参数');
                    return;
                }

                let record = {
                    type: '翻转',
                    name: this.rightSprite.name,
                    scaleX: this.rightSprite.scale.x,
                    scaleY: this.rightSprite.scale.y,
                    lastInfo
                }
                this[REPLACE_HISTORY](record)
            },
            goUp() {
                let cur = this.rightSprite
                let par = cur.parent;
                let zIndex = par.getChildIndex(cur);
                if (zIndex < this.rightImages.length) {
                    par.setChildIndex(cur, ++zIndex)
                    this[UPDATE_RIGHT_IMAGES]({type:goup, data:{name:cur.name}})
                }
            },
            goDown() {
                let cur = this.rightSprite
                let par = cur.parent;
                let zIndex = par.getChildIndex(cur);
                if (zIndex !== 1)
                    par.setChildIndex(cur, --zIndex);
            },
            resetSprite() {
                this.rightSprite.scale.set(1)

            },
            handleDownloadFussion() {
                if (!this.bgSprite) {
                    this.$alert('请添加背景图')
                    return
                }
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    // spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                let mask = new PIXI.Graphics();
                mask.beginFill('0xffffff', 0);
                mask.drawRect(0, 0, this.cv2.stage.children[0].width, this.cv2.stage.children[0].height);
                mask.endFill();

                console.log('mask', mask.width, mask.height);

                var sp = new PIXI.Sprite(mask.texture)
                // sp.addChild()
                if (mask.width > mask.height) {
                    mask.x = 0;
                    mask.y = this.cv2.screen.height / 2 - mask.height / 2;
                } else {
                    mask.x = this.cv2.screen.width / 2 - mask.width / 2;
                    mask.y = 0;
                }
                setTimeout(() => {
                    this.cv2.stage.mask = mask

                    this.cv2.stage.addChild(mask);
                }, 1000)

                let d
                setTimeout(() => {
                    let base64 = this.cv2.renderer.plugins.extract.base64(this.cv2.stage)
                    let img = new Image()
                    img.src = base64
                    // d = this.cv2.renderer.plugins.extract.base
                    img.style.position = 'absolute'
                    img.style.bottom = '0'
                    img.onload = () => {
                        window.ii = img
                        // document.body.appendChild(d)
                        composePicture(base64)
                            .then((res) => {
                                return downloadComposePicture()
                            })
                            .then((res) => {
                                let src = res.data.result.replace('./', 'http://10.112.224.111:8900/flaskr2/')
                                saveAs(src, src.substr(src.lastIndexOf('/') + 1))
                            })
                            .catch((e) => {
                                this.$message({message: e, type: 'error'})
                                loading.close()
                            })
                    }
                }, 2000)

            },
            /**
             * 完成构图跳转到风格化页面
             */
            handleComplete() {
                if (!this.bgSprite) {
                    this.$alert('请添加背景图')
                    return
                }
                let loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    // spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                let mask = new PIXI.Graphics();
                mask.beginFill('0xffffff', 0);
                mask.drawRect(0, 0, this.cv2.stage.children[0].width, this.cv2.stage.children[0].height);
                mask.endFill();

                console.log('mask', mask.width, mask.height);

                var sp = new PIXI.Sprite(mask.texture)
                // sp.addChild()
                if (mask.width > mask.height) {
                    mask.x = 0;
                    mask.y = this.cv2.screen.height / 2 - mask.height / 2;
                } else {
                    mask.x = this.cv2.screen.width / 2 - mask.width / 2;
                    mask.y = 0;
                }
                setTimeout(() => {
                    this.cv2.stage.mask = mask

                    this.cv2.stage.addChild(mask);
                }, 1000)

                let d
                setTimeout(() => {
                    let base64 = this.cv2.renderer.plugins.extract.base64(this.cv2.stage)
                    let img = new Image()
                    img.src = base64
                    // d = this.cv2.renderer.plugins.extract.base
                    img.style.position = 'absolute'
                    img.style.bottom = '0'
                    img.onload = () => {
                        window.ii = img
                        // document.body.appendChild(d)
                        composePicture(base64)
                            .then((res) => {
                                this.$message({message: 'success', type: 'success'})
                                console.log(res.data);
                                window.location.href = 'http://10.112.224.111:8900/draft/result'
                                // loading.close()
                            })
                            .catch((e) => {
                                this.$message({message: e, type: 'error'})
                                loading.close()
                            })
                    }
                }, 2000)


            },
            /**
             * 保存工作区
             */
            async handleSaveProject() {
                /*
                1. 保存右侧已经扣完的图片列表（层级，背景图列表，当前选中的背景图，包含对应的左侧图片，迭加图）
                2. 保存右侧展示区的图片
                3. jszip打包压缩
                */

                let workSpace = {
                    leftTextureData: [],
                    labelData: [],
                    rightTextureData: [],
                    base: [],
                    backgroundTextureData: [],
                    spriteInfo: [],
                }

                let zip = new JSZip()

                let rightTextureDataQueue = []
                let leftTextureDataQueue = []
                let labelDataQueue = []
                let baseDataQueue = []
                for (let i = 0; i < this.rightImages.length; i++) {
                    let obj = this.rightImages[i]
                    let sp = this.cv2.stage.getChildByName(obj.name);
                    workSpace.spriteInfo.push(obj);
                    leftTextureDataQueue.push(generateBase64(obj.lt));

                    rightTextureDataQueue.push(obj.rt);

                    let _base = obj.rt.replace(/matting-\d+/, 'base');
                    baseDataQueue.push(generateBase64(_base));

                    if (obj.label) {
                        //有叠加图的话则把叠加图保存下来。没有的话就存空值进行占位
                        labelDataQueue.push(generateBase64(obj.label));
                    } else {
                        labelDataQueue.push(Promise.resolve(null));
                    }
                }

                let result_base = saveWorkspace({img: rightTextureDataQueue}).then(data => {
                    if (data.data.status === 1 || data.data.message == '接口调用成功') {
                        return data.data.result_base
                    }
                });
                workSpace.labelData = await Promise.all(labelDataQueue);
                workSpace.base = await Promise.all(baseDataQueue);
                workSpace.leftTextureData = await Promise.all(leftTextureDataQueue);
                workSpace.rightTextureData = await result_base;
                console.log(workSpace);

                for (let i = 0; i < this.rightImages.length; i++) {
                    let obj = this.rightImages[i];
                    let rs = workSpace.rightTextureData[i];
                    let ls = workSpace.leftTextureData[i];
                    let base = workSpace.base[i]
                    let label = workSpace.labelData[i];
                    let name = obj.name
                    zip.folder('rs').file(name + '-rs.png', rs, {base64: true})
                    zip.folder('ls').file(name + '-ls.png', ls, {base64: true})
                    zip.folder('base').file(name + '-base.png', base, {base64: true})
                    zip.folder('label').file(name + '-label.png', label, {base64: true})
                }

                zip.file('spInfo.json', JSON.stringify(workSpace.spriteInfo))
                zip.generateAsync({type: 'blob'}).then((blob) => {
                    saveAs(blob, "hh.zip")
                })


            },
            /**
             * 加载工作区
             */
            async _loadProject(e) {

                let zfile = e.target.files[0]
                window.zfile = zfile
                window.JSZip = JSZip

                var zip = new JSZip()
                window.zzz = zip
                await zip.loadAsync(zfile)
                let dataObj = {}
                let promiseQueue = []
                let spriteInfo = null
                zip.forEach(path => {
                    if (!zip.files[path].dir) {

                        if (/\.json/.test(path)) {
                            promiseQueue.push(zip.file(path).async('string').then(str => {
                                spriteInfo = JSON.parse(str);
                                return true
                            }))
                        } else {

                            promiseQueue.push(zip.file(path).async('base64').then((base64) => {
                                dataObj[path.split('/').pop()] = base64;
                                return true
                            }))
                        }
                    }
                })
                await Promise.all(promiseQueue);
                console.log(JSON.parse(JSON.stringify(spriteInfo)))
                console.log(JSON.parse(JSON.stringify(dataObj)))
                window.dataObj = dataObj

                let dataToSend = {img: [], line: [], base: []}
                spriteInfo.forEach(value => {
                    dataToSend.img.push(dataObj[value.name + '-rs.png'])
                    dataToSend.line.push(dataObj[value.name + '-ls.png'])
                    dataToSend.base.push(dataObj[value.name + '-base.png'])
                })
                console.log(dataToSend);
                let workspaceData = await loadWorkspace(dataToSend)
                console.log(workspaceData);
                console.log(typeof workspaceData.data.status);
                for (let i = 0; i < workspaceData.data.line.length; i++) {
                    spriteInfo[i].lt = workspaceData.data.line[i]
                    spriteInfo[i].rt = workspaceData.data.result[i]
                }

                this[UPDATE_RIGHT_IMAGES]({type: 'load', data: spriteInfo})

                function renderfromload() {
                    this.rightImages.forEach(v => {
                        let sp = new PIXI.Sprite.from(v.rt)
                        sp.anchor.set(0.5);
                        sp.x = v.x;
                        sp.y = v.y;
                        sp.scale.x = v.scaleX;
                        sp.scale.y = v.scaleY;
                        sp.name = v.name;
                        this.cv2.stage.addChild(sp);

                        this.addInteractive(sp);
                    })
                }

                renderfromload.call(this)
            },
            handleLoadProject() {
                this.$refs.input_file_load.click()
            },
        }

    }
</script>

<style lang="less">
    .edit-page {
        position: relative;
        width: 100vw;
        height: 100vh;
        background-color: #fff;

        //side-menu 通用样式

        .side-menu {
            position: fixed;
            z-index: 100;
            box-sizing: border-box;
            box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
            transition: transform .7s ease;

            //menu内容 开始
            .content-container {
                display: flex;
                /*height: 100%;*/
                flex-direction: column;
                position: relative;
                padding: 10px;
                background: #ffffff;
                height: 100%;


                //todo 左边按钮样式
                .left-menu-item {
                    margin: 5px 0;
                    border: 1px solid #cccccc;
                    border-radius: 5px;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    font-size: 40px;
                }

                .left-menu-text {
                    font-size: 10px;
                    margin-bottom: 5px;
                }
            }

            //menu内容 结束

            //menu按钮 开始
            .side-menu-switch {
                width: 20px;
                height: 70px;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                position: absolute;
                top: 20%;
                z-index: -1;
                cursor: pointer;

                .triangle-shadow {
                    z-index: -1;
                    filter: blur(1px);
                    border-top-color: black !important;
                    border-bottom-color: black !important;
                }

                .triangle-bottom.triangle-shadow {
                    bottom: 0;
                }

                i {
                    display: block;
                    width: 20px;
                    height: 20px;
                    position: absolute;

                }

                .square {
                    height: 30px;
                    background-color: #fff;
                    border-right: 1px solid rgba(0, 0, 0, .5);
                    box-sizing: border-box;
                    line-height: 30px;
                }

                .triangle.triangle-top {
                    top: 0;
                    height: 0;
                    width: 0;
                    border-bottom: 20px solid;
                    border-right: 20px solid;
                    border-top: none;
                    border-left: none;
                    border-bottom-color: #fff;
                    border-right-color: transparent;
                }

                .triangle.triangle-bottom {
                    bottom: 0;
                    height: 0;
                    width: 0;
                    border-top: 20px solid;
                    border-right: 20px solid;
                    border-bottom: none;
                    border-left: none;
                    border-top-color: #fff;
                    border-right-color: transparent;
                }

            }

            //menu按钮 结束

            &.side-menu-left {
                left: 0;
                border-bottom-right-radius: 5px;
                border-top-right-radius: 5px;
                transform: translateX(-100%);

                .content-container {
                    border-bottom-right-radius: 6px;
                    border-top-right-radius: 6px;
                }

                .side-menu-switch {
                    right: -20px;
                }
            }

            &.side-menu-right {
                right: 0;
                border-bottom-left-radius: 5px;
                border-top-left-radius: 5px;
                transform: translateX(100%);

                .content-container {
                    border-bottom-left-radius: 6px;
                    border-top-left-radius: 6px;
                }

                .side-menu-switch {
                    left: -20px;
                    transform: scaleX(-1);
                }
            }


            &.open {
                transform: translateX(0);
            }

        }

        .edit-main {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            display: flex;


            .edit-container {
                display: flex;
                flex: 1;
                height: 100%;

                .source-container, .result-container {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    position: relative;


                    .canvas-container {
                        background-color: #ccc;
                        flex: 1;
                        background-image: linear-gradient(45deg, #f6fafc 25%, transparent 0), linear-gradient(45deg, transparent 75%, #f6fafc 0), linear-gradient(45deg, #f6fafc 25%, transparent 0), linear-gradient(45deg, transparent 75%, #f6fafc 0);
                        background-position: 0 0, 10px 10px, 10px 10px, 20px 20px;
                        background-size: 20px 20px;
                        /*background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');*/
                        position: relative;

                        .pixi-app {

                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: 100%;
                        }
                    }

                }

                .gutter {
                    width: 5px;
                    background-color: rgba(0, 0, 0, .5);
                }

            }

            .controls-container {
                align-self: center;
                display: flex;
                justify-content: space-around;
                align-items: start;
                width: 100vw;
                /*height: 50px;*/
                /*padding: 0 10px;*/
                position: absolute;
                top: 10px;
                /*box-shadow: 3px 3px 5px rgba(0, 0, 0, .5);*/
                /*border: 1px solid #ccc;*/

                z-index: 10;
                transform: translateY(-50px);
                transition: transform .5s ease;

                .controls-container-left {
                    flex: 1;
                    margin-left: 20px;
                    display: flex;
                    flex-wrap: wrap;
                }

                .controls-container-right {
                    flex: 1;
                    margin-right: 20px;
                    display: flex;
                }

                .controls-container-center {
                    display: flex;
                }


                &.control-bar-open {
                    transform: translateY(0);
                }

                .reverse-group {
                    transform: translateY(50px);
                }

                .controls-container-group {
                    float: left;
                    background-color: #fff;
                    padding: 0 5px;
                    margin: 0 auto 10px;
                    height: 40px;
                    box-sizing: content-box;
                    display: flex;
                    align-items: center;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04)
                }

                .big-icon button {
                    padding: 0 10px;
                    font-size: 18px;
                    height: 32px;
                    line-height: 32px;
                }

                .el-slider {
                    margin: 0 5px;
                    width: 100px;
                    flex: 1;
                }

                i {
                    font-size: unset;
                }

                .green {

                    color: green;
                }


                .red {
                    color: red;
                }

                .blue {
                    color: blue;
                }
            }


        }

        //定制 side菜单
        .side-menu-left {
            top: 20vh;
        }

        .side-menu-right {
            top: 5vh;
            height: 90vh;
            width: 150px;
        }

        .background-tab {
            /*background-color: #ccc;*/


        }

    }

    .custom-tabs {
        display: flex;
        flex-direction: column;
        height: 100%;

        .custom-tab-pane {
            max-height: 100%;
            display: flex;
            flex-direction: column;
            /*padding-right: 15px;*/
        }
    }


    .picture-stack::-webkit-scrollbar {
        width: 6px;
    }

    .picture-stack::-webkit-scrollbar-thumb {
        background-color: #333;
        border-radius: 3px;
    }

    .picture-stack::-webkit-scrollbar-track {
        background-color: #ccc;
        border-radius: 3px;
    }

    .picture-stack {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;

        .picture-stack-backgrounds-container {
            /*background-color: #ccc;*/
            padding-right: 17px;
            width: 130px;

            .bgstack-enter-active, .bgstack-leave-active {
                transition: all .5s ease;
                position: absolute;
            }

            .bgstack-enter, .bgstack-leave-to {
                opacity: 0;
                transform: scale(.5, .5);
            }

            .deleting {
                /*transition: all 1s ease;*/
                animation: aa 2s ease;
            }

            .background-wrapper {
                position: relative;
                border-radius: 5px;
                overflow: hidden;
                margin-bottom: 5px;

                img {
                    width: 100%;
                    user-select: none;
                }

                &:hover .deletbtn {
                    display: block;
                }

                .deletbtn {
                    display: none;
                    background: #fff;
                    position: absolute;
                    right: 5px;
                    top: 5px;
                    cursor: pointer;
                    border-radius: 3px;
                    padding: 3px;
                }
            }


            .is-being-use {
                border: 2px solid lightskyblue;
                box-sizing: border-box;
            }
        }


    }

    .picture-stack-rightImg-Container {
        flex: 1;
        margin-top: 10px;
        width: 100%;
        /*overflow-y: auto;*/

        .picture-unit {
            width: 100%;
            height: 100px;
            margin: 10px 0;
            border: 1px solid #409eff;
            border-radius: 3px;
            position: relative;
            user-select: none;

            &:hover .lock {
                display: inline-block;
            }

            .lock {
                display: none;
                width: 24px;
                height: 24px;
                line-height: 24px;
                position: absolute;
                top: 3px;
                left: 3px;
                box-sizing: border-box;
                cursor: pointer;
            }

            .lock:active {
                color: #409eff;
            }

            .locked {
                display: inline-block;
                border: 1px solid white;
                border-radius: 3px;
            }

            .restore {
                display: block;
                width: 24px;
                height: 24px;
                line-height: 24px;
                position: absolute;
                top: 3px;
                right: 3px;
                box-sizing: border-box;
                cursor: pointer;
            }

            img {
                display: inline-block;
                width: 100%;
                height: 100%;
                object-fit: contain;

            }

            .selected {
                background-color: rgba(10, 33, 233, 0.3);

            }
        }
    }

    .custom-checkbox.cus-red {
        border-color: red;
        color: red;

        span {
            color: red !important;
        }

        .el-checkbox__input.is-checked {
            span.el-checkbox__inner {
                background-color: red;
            }
        }
    }

    .custom-checkbox.cus-green {
        border-color: green;
        color: green;

        span {
            color: green !important;
        }

        .el-checkbox__input.is-checked {
            span.el-checkbox__inner {
                background-color: green;
            }
        }
    }

    .custom-checkbox.cus-blue {
        border-color: blue;
        color: blue;

        span {
            color: blue !important;
        }

        .el-checkbox__input.is-checked {
            span.el-checkbox__inner {
                background-color: blue;
            }
        }
    }

    .history {
        /*background-color: #fff;*/
        position: absolute;
        bottom: 0;
        /*padding: 10px;*/
        z-index: 999;
    }

</style>

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //已选择的图片url地址，可以是搜索获得的图片。也可以是本地选取转成BlobUrl,等待上传进行抠图
        selectedImgUrl: '',
        //本机选取的图片文件
        selectedImgFile: null,
        //本机选取图片文件的base64
        selectedImgBase64: '',
        //历史记录
        // history:[{
        //     type:['新增','删除','抠图','移动','缩放','图层变更','翻转'],
        //     spriteObject:{
        //         left:{},
        //         right:{},
        //     },
        //     currentInfo:{
        //         x:'',
        //         y:'',
        //         scaleX:'',
        //         scaleY:'',
        //         zIndex:'',
        //     },
        //     state:['now','history']
        // }],
        history: [],
        //重复操作栈
        redoStack: [],
        //rightImg
        rightImages:[]
    },
    getters: {
        canUndo(state) {
            if (state.history.length < 2) {
                return false
            } else {
              return true
            }
        },
        canRedo(state) {
            return state.redoStack.length !== 0
        },
    },
    mutations,
    actions,
    modules: {}
})

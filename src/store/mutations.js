import {
    GOTO_HISTORY,
    PUSH_HISTORY, REDO, REPLACE_HISTORY, UNDO,
    UPDATE_SELECTED_IMG_BASE64,
    UPDATE_SELECTED_IMG_FILE,
    UPDATE_SELECTED_IMG_URL,
    UPDATE_RIGHT_IMAGES,
} from './mutation-types'
import current from "element-ui/packages/table/src/store/current";

export default {
    [UPDATE_SELECTED_IMG_URL](state, url) {
        state.selectedImgUrl = url
    },
    [UPDATE_SELECTED_IMG_FILE](state, file) {
        state.selectedImgFile = file
    },
    [UPDATE_SELECTED_IMG_BASE64](state, base64) {
        state.selectedImgBase64 = base64
    },

    [UNDO](state) {
        // let currentHistoryIndex;
        // let currentHistory = state.history.find((value, index) => {
        //     if (value.state === 'now') {
        //         currentHistoryIndex = index;
        //         return true
        //     }
        // });
        //
        // if (currentHistoryIndex !== 0) {
        //     state.history[currentHistoryIndex - 1].state = 'now';
        // }
        // currentHistory.state = 'history';

        state.redoStack.push(state.history.pop())

    },
    [REDO](state) {
        // let currentHistoryIndex;
        // let currentHistory = state.history.find((value, index) => {
        //     if (value.state === 'now') {
        //         currentHistoryIndex = index;
        //         return true
        //     }
        // });
        //
        // if (currentHistory === undefined) {
        //     state.history[0].state = 'now'
        // } else {
        //     if (currentHistoryIndex < state.history.length - 1) {
        //         state.history[currentHistoryIndex + 1].state = 'now';
        //         currentHistory.state = 'history';
        //     }
        // }

        state.history.push(state.redoStack.pop())

    },
    [GOTO_HISTORY](state, selectIndex) {
        state.history.forEach((value, index) => {
            value.state = index === selectIndex ? 'now' : 'history'
        });
    },
    [REPLACE_HISTORY](state, payload) {
        // if (state.history.length === 0) {
        //     state.history.push(payload)
        // } else {
        //
        //     let currentHistoryIndex;
        //     let currentHistory = state.history.find((value, index) => {
        //         if (value.state === 'now') {
        //             currentHistoryIndex = index;
        //             return true
        //         }
        //     });
        //
        //     if (currentHistoryIndex !== state.history.length - 1) {
        //         currentHistory.state = 'history';
        //         state.history.splice(currentHistoryIndex + 1, state.history.length, payload)
        //     } else {
        //         currentHistory.state = 'history';
        //         state.history.push(payload)
        //     }
        // }

        state.history.push(payload);
        state.redoStack = []

    },
    [UPDATE_RIGHT_IMAGES](state, payload) {
        switch (payload.type) {
            case 'add':
                state.rightImages.forEach(v => v.selected = false);
                state.rightImages.push(payload.data);
                break;
            case 'remove':
                state.rightImages = state.rightImages.filter(v => v.name !== payload.data.name);
                state.rightImages.forEach((v, i) => {
                    v.zIndex = i + 1
                });
                break;
            case 'sort':
                state.rightImages.sort((a, b) => {
                    return b.zIndex - a.zIndex
                })
                break;
            case 'select':
                state.rightImages.forEach(v => v.selected = v.name === payload.data.selectedTargetName);
                break;
            case 'edit':
                let rightSpInfo = state.rightImages.find(v => v.name === payload.data.name);
                for (let i in payload.data) {
                    rightSpInfo[i] = payload.data[i]
                }
                break;
            case 'load':
                state.rightImages = payload.data;
                break;
            case 'goup': 
                // state.rightImages = 
            case 'insert':
                // state.rightImages.splice()
            
            default:

                throw new Error('类型不存在');
        }
    }

}

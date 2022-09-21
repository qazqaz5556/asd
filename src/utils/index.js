export function isCanvasBlank(canvas) {
    let blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() === blank.toDataURL();
}

export class SpriteListItem {
    /**
     * 右侧sp信息
     * @param name 对应的sp名
     * @param lt left-texture缩写，左侧图
     * @param rt right-texture缩写，右侧图
     * @param selected 是否被选中 默认为true
     * @param locked  是否被锁定无法编辑,默认为false
     * @param leftSpriteInfo
     */
    constructor(name, lt, rt, zIndex, leftSpriteInfo, selected = true, locked = false) {
        this.name = name;
        this.lt = lt;
        this.rt = rt;
        this.selected = selected;
        this.locked = locked;
        this.leftSpriteInfo = leftSpriteInfo;
    }

}

/**
 * 生成编辑区精灵图信息摘要
 * @param name {String} 精灵名字
 * @param leftTextureSrc {String} 左侧轮廓图地址
 * @param rightTextureSrc {String} 右侧精灵图地址
 * @param x {Number} x-坐标
 * @param y {Number} y-坐标
 * @param scaleX {Number} x-缩放
 * @param scaleY {Number} y-缩放
 * @param zIndex {Number} 纵深
 * @param leftSpriteSizeInfo {Object} 左侧编辑图对应的缩放信息
 * @param label {String} 左侧的绘制图。默认为空
 * @param selected {Boolean} 是否被选中
 * @param locked {Boolean} 是否可编辑
 * @returns {Object} 精灵图信息摘要对象
 */
export function createRightImage(name, leftTextureSrc, rightTextureSrc, x, y, scaleX, scaleY, zIndex, leftSpriteSizeInfo, label = null, selected = true, locked = false) {
    return {
        name,
        lt: leftTextureSrc,
        rt: rightTextureSrc,
        x,
        y,
        scaleX,
        scaleY,
        zIndex,
        leftSpriteSizeInfo,
        selected,
        locked,
    }
}

export function createHistoryRecord(name, type, lt, rt, x, y, scaleX, scaleY, zIndex, leftSpriteSizeInfo, label) {
    return {
        name,
        type,
        lt,
        rt,
        x,
        y,
        scaleX,
        scaleY,
        zIndex,
        leftSpriteSizeInfo,
        label
    }
}

/**
 * 图片转base64
 * @param src 图片url
 * @param dataUrl 是否转换成url链接形式，默认为否。
 * @returns {Promise<String>} 图片base64字符串
 */
export function generateBase64(src, dataUrl) {
    return new Promise((res, rej) => {
        let image = new Image();
        image.setAttribute("crossOrigin", 'Anonymous');
        image.onload = (evt) => {
            let canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            let base64 = canvas.toDataURL('image/png');
            if (dataUrl) {
                res(base64);
            } else {
                res(base64.split(',')[1]);
            }
        };
        image.onerror = (evt) => {
            rej(evt);
        };
        image.src = src;
    })
}



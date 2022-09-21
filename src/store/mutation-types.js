/**
 * 更新选中图片URL地址
 * @type {string}
 */
export const UPDATE_SELECTED_IMG_URL = 'UPDATE_SELECTED_IMG_URL';
/**
 * 更新选取的图片文件
 * @type {string}
 */
export const UPDATE_SELECTED_IMG_FILE = 'UPDATE_SELECTED_IMG_FILE';
/**
 * 更新选取的图片Base64
 * @type {string}
 */
export const UPDATE_SELECTED_IMG_BASE64 = 'UPDATE_SELECTED_IMG_BASE64';


/**
 * 撤销   沿队尾向前移动指针。更新当前队列中state值
 * @type {string}
 */
export const UNDO = 'UNDO';

/**
 * 重复  在当前队列找到state值所在位置，并向后移动指针
 * @type {string}
 */
export const REDO = 'REDO';

/**
 * 回溯 跳转到对应的位置，并设置state值
 * @type {string}
 */
export const GOTO_HISTORY = 'GOTO_HISTORY';

/**
 * 如果当前state不指向队尾。即处在历史中某一结点上时，移除之后的历史节点，并在当前节点进行新增历史记录操作
 * 新增历史记录 涉及 载入新图。删除，移动，缩放，翻转
 * @type {string}
 */
export const REPLACE_HISTORY = 'REPLACE_HISTORY';

/**
 * 更新右侧精灵图缩放列表信息。
 * @type {string}
 */
export const UPDATE_RIGHT_IMAGES = 'UPDATE_RIGHT_IMAGES';

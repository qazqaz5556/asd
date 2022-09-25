import axios from 'axios'
import qs from 'qs'

//线上服务器地址
export const serverUrl =
    // 'http://10.108.126.36:8900';
    ''
process.env.NODE_ENV === 'development'
    ? 'http://10.112.224.111:8900'
    : 'http://10.112.224.111:8900';

/**
 * 获取草图检索结果
 * @param {String} value 目标图片base64编码
 * @returns {Promise<AxiosResponse<T>>} 返回一组图片的相对路径字符串 ["extend_img/ant/ext_418.jpg","extend_img/ant/ext_418.jpg"]
 */
export let getDraftSelf = (value) => {
    value = value.split(',')[1];
    return axios.post(serverUrl + '/draft/draftSelf', qs.stringify({value}));
};

/**
 * 一键检索结果
 * @param {String} value 目标图片base64编码
 * @returns {Promise<AxiosResponse<T>>} 返回一个json对象。只有一个字段名 result 对应图片在服务器上的相对路径
 */
export let getDraftOneKey = (value) => {
    value = value.split(',')[1];
    return axios.post(serverUrl + '/draft/mindConvert', qs.stringify({value}));
};

/**
 * 将用户选择的图片发送服务器进行识别处理。服务器进行一次自动扣图，参数是url或图片base64编码，具体由isonserver决定
 * @param {String} base64 发送给服务器的图片base64编码,或者图片的完整url
 * @param {Number} isonserver 图片是否存在于服务器。本地选取的图片为0；草图检索后的图片为1
 * @returns {Promise<AxiosResponse<T>>} 返回的json对象包含 <String>result 和<Array>data两个字段；result为识别处理后的图片url地址;data为识别出的信息组成的数组对象，每个对象有src ,color,width,height,name字段
 *
 */
export let getFurtherCrop = (base64, isonserver) => {
    if (/data:image/.test(base64)) {
        base64 = base64.split(',')[1];
    }
    return axios.post(serverUrl + '/draft/furtherCrop', qs.stringify({value: base64, base64, isonserver, scale: 1}));
};
export let getFurtherCrop3d = (base64, isonserver) => {
    if (/data:image/.test(base64)) {
        base64 = base64.split(',')[1];
    }
    console.log(123)
    return axios.post(serverUrl + '/draft/3Ddraft' ,qs.stringify({ base64, isonserver}))
};

/**
 *
 *   对用户选择的自动抠图结果进行处理
 * @param  {Array} front 用户选择的图片地址
 * @param  {String}  isChoose  是否选择了图片
 * @param  {Array} base 原图的base64编码
 * @returns {Promise<AxiosResponse<T>>}
 */
export let getMatting = (front, isChoose, base) => {
    let dataJson = {}
    if (isChoose === '0') { //如果没有选择，则返回furtherCrop的result
        dataJson.isChoose = isChoose
        dataJson.base = base
    } else {
        dataJson.front = front
        dataJson.isChoose = isChoose
    }
    //axios post 数组去角标 {arrayFormat: 'brackets'}
    return axios.post(serverUrl + '/draft/matting', qs.stringify(dataJson, {arrayFormat: 'brackets'}));
};
/**
 * 手动抠图接口
 * @param isonserver
 * @param last
 * @param label
 * @returns {Promise<AxiosResponse<T>>}
 */
export let getInterSeg = (isonserver, last, label) => {
    if (/data:image/.test(label)) {
        label = label.split(',')[1];
    }
    console.log('seg');
    return axios.post(serverUrl + '/draft/interSeg',
        qs.stringify(
            {
                // isonserver,
                last,
                label
            }
        )
    )
}

/**
 * 精细抠图接口
 * 只返回右侧图片地址。
 */
export let getFineMatting = (isonserver, last, label) => {
    if (/data:image/.test(label)) {
        label = label.split(',')[1];
    }

    return axios.post(serverUrl + '/draft/fineMatting', qs.stringify({
        // isonserver,
        last,
        label
    }))
}

export let getEraser = (isonserver, last, label) => {
    if (/data:image/.test(label)) {
        label = label.split(',')[1];
    }

    return axios.post(serverUrl + '/draft/eraser', qs.stringify({
        // isonserver,
        last,
        label
    }))
}

export let composePicture = (base64) => {
    if (/data:image/.test(base64)) {
        base64 = base64.split(',')[1];
    }

    return axios.post(serverUrl + '/draft/getimgdata', qs.stringify({
        img: base64
    }))

}

/**
 * 获取合成后的图片
 * @returns {Promise<AxiosResponse<T>>}
 */
export let downloadComposePicture = () => {
    return axios.post(serverUrl + '/draft/display', qs.stringify({'send': 'send'}))
}

/**
 * 保存工作区接口。
 * @param {Object} data img字段为字符串数组。内容为最后一次保存的右侧图地址。
 * @returns {Promise<AxiosResponse<T>>} 返回对应图片的base64编码
 */
export let saveWorkspace = (data) => {
    return axios.post(serverUrl + '/draft/saveWorkspace', qs.stringify(data, {arrayFormat: 'brackets'}))
}


/**
 * 加载工作区接口。
 * @param {Object} data 包含两个字段的对象。img 和 line 。都为字符串数组。字符串为图片对应的base64 编码
 * @returns {Promise<AxiosResponse<T>>}
 */
export let loadWorkspace = (data) => {
    return axios.post(serverUrl + '/draft/loadWorkspace', qs.stringify(data, {arrayFormat: 'brackets'}))
}

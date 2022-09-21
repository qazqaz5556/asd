let timemodel = require('../../db/model/timeStamp');
console.log(timemodel);

class V1 {
    constructor() {

        this.getTimestamp = this.getTimestamp.bind(this)
    }

    checkQuery(req, res, next) {

    }

    async getTimestamp(req, res, next) {

        const {start, end, id} = req.query;

        if (!req.query.id) {
            res.send({
                code: -2,
                msg: '缺少参数:id'
            });
            return
        }

        if (!start || !end) {
            res.send({
                code: -2,
                msg: `缺少参数: ${!start ? 'start' : 'end'}`
            })
            return
        }

        if (start - end > 0) {
            res.send({
                code: -2,
                msg: `参数 start 必须大于 end`
            })
            return
        }


        let query = await timemodel.find({name: id}, '-_id -__v');
        let filterData = query[0].data.filter(v => parseInt(v) > parseInt(start) && parseInt(v) < parseInt(end));
        res.send({
            code: 0,
            msg: '查询成功',
            data: {
                name: id,
                data: filterData
            }
        })
    }

    async getLastTimestamp(req, res, next) {

        const {dataId: id, end} = req.query

        let now = (Date.now() + '').slice(0, -3)

        if (now - end > 300) {
            //保证一次最多发5个点
            //若本次请求与真实时间间隔大于25分钟 （5个点）

            let peace = Math.floor((now - end) / 300)

            if (peace > 5) peace = 5

            let query = await timemodel.find({name: id}, '-_id -__v')
            let endStick = Math.floor((query[0].data.length - peace) * Math.random() + peace)
            let dataAry = query[0].data.splice(endStick, peace);

            dataAry.forEach((v, i) => {
                v[0] = parseInt(end) + 300 * (i + 1)
            });
            console.log(dataAry);
            res.send({
                code: 0,
                msg: '查询成功',
                data: {
                    name: id,
                    data: dataAry
                }
            })
        } else {
            res.send({
                code: -2,
                msg: '没有新的数据',
            })
        }
    }
}

module.exports = new V1();

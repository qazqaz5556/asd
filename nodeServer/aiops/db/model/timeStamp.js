let mongoose = require('mongoose');

let initTimeData = require('../../timeStamp');

let Schema = mongoose.Schema;

let timeStamp = new Schema({
    name: String,
    data: Array
});

let timeStampModel = mongoose.model('timestamp', timeStamp);

timeStampModel.findOne((err, data) => {
    if (!data) {
        console.log('初始化数据');
        timeStampModel.create(initTimeData)
    }
});

module.exports = timeStampModel;



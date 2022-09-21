let fs = require('fs');
let path = require('path');

class TimeStamp {
    constructor() {

    }

    getTimestamp(req, res, next) {
        fs.readFile(path.resolve(__dirname, '../timeStamp.json'), (err, data) => {
            if (err) next(err);
            res.send(data)
        })
    }

}

module.exports = TimeStamp;

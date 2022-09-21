let fs = require('fs');
let path = require('path');
let cors = require('cors');
let express = require('express');
let bodyParser = require('body-parser');
let app = express()

// app.use(cors({
//     origin: function (ctx) {
//         return 'http://localhost:8900';
//     },
//     exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
//     maxAge: 5,
//     credentials: true,
//     allowMethods: ['GET', 'POST', 'DELETE'],
//     allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
// }))
app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))

app.post('/meter', (req, res) => {
    res.send({
        conf: '100%',  //可信度
        box: "", //图片识别的显示区域【x,y,w,h】
        num: 121313, //显示的数字结果
    })
})
app.listen(8080);

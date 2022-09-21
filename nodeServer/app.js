let fs = require('fs');
let path = require('path');
let cors = require('cors');
let express = require('express');
let bodyParser = require('body-parser');
let app = express()
let os = require('os');
let netInterFace = os.networkInterfaces()
let {address} = netInterFace['以太网'].find(item => item.family === 'IPv4')

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
app.post('/draft/draftSelf', (req, res) => {
    fs.readdir(path.join(__dirname, '/img'), (err, data) => {
        if (err) console.log(err);
        else res.send(data.filter(value => /\.jpg$/.test(value)));
    })
});
app.get('/flaskr2/static/Imgs/*', (req, res) => {
    console.log(req.url);
    let rs = fs.createReadStream(path.join(__dirname, '/img', req.url.replace('/flaskr2/static/Imgs/', '')))
    rs.on('error', (e) => {
        console.log(e);
    })
    rs.pipe(res)
    // console.log(rs);
});

app.post('/draft/furtherCrop', (req, res) => {
    console.log(req.body);


    if (req.body.isonserver == '0') {
        fs.readFile(path.join(__dirname, 'img', 'che-0.jpg'), (err, data) => {
            if (err) {
                console.log(err);
            }
            console.log(data.toString('base64'));
        })
    }


    res.send({
        result: `http://${address}:8900/flaskr2/static/Imgs/ren2hu-0.jpg`,
        data: [
            {
                src: `http://${address}:8900/flaskr2/static/Imgs/che-0.jpg`,
                color: 'red',
                name: '车'
            },
            {
                src: `http://${address}:8900/flaskr2/static/Imgs/ren2lu-0.jpg`,
                color: 'blue',
                name: '人'
            }
        ]
    })
});

app.post('/draft/mindConvert', (req, res) => {
    fs.readdir(path.join(__dirname, '/img'), (err, data) => {
        if (err) console.log(err);
        else res.send(data.filter(value => /\.jpg$/.test(value)));
    })
});
app.post('/draft/matting', (req, res) => {
    res.send({
        front: `http://${address}:8900/flaskr2/static/Imgs/che-0.jpg`,
        mask: `http://${address}:8900/flaskr2/static/Imgs/che-1.jpg`
    })
});

app.post('/mobile', (req, res) => {
    res.send({
        conf: '100%',  //可信度
        box: "", //图片识别的显示区域【x,y,w,h】
        num: 121313, //显示的数字结果
    })
})

//AIOPS 时间戳接口
app.get('/v1/test/id/', (req, res) => {
    fs.readFile(path.join(__dirname, '/aiops/timeStamp.json'), (err, data) => {
        if (err) {
            res.send({error: '数据未找到'})
        } else {
            res.send(data)
        }
    })
})
app.listen(8900);


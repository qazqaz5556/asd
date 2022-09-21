let fs = require('fs');
let path = require('path');
let cors = require('cors');
let express = require('express');
let bodyParser = require('body-parser');
let app = express()
let os = require('os');
let netInterFace = os.networkInterfaces()
let {address} = netInterFace['以太网'].find(item => item.family === 'IPv4')

app.use(cors())
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}))

app.get('/v1/cookieset',(req,res)=>{
    res.setHeader('set-cookie','csrf_key=ffffffk; Path=/')
    res.send('ok')
})
app.listen(9999);


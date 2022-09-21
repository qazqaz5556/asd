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

app.post('/temp', (req, res) => {
    console.log(req.body);
    res.send(req.body.image)
})
app.listen(5000);

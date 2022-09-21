let fs = require('fs');
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let cors = require('cors');

require('./db');
let app = express();
app.use(bodyParser());
app.use(cors())
let router = require('./router');

app.use(router);
// app.use(bodyParser());
// app.use(express.query());
// app.use(express.json());

app.listen(require('../server_port').aiops.serverPort);

let mongoose = require('mongoose');
let dbpath = require('../../server_port').aiops.mongodbURI;
mongoose.connect(dbpath);

let db = mongoose.connection;
db.on('open', () => {
    console.log('mongodb connected.');
});





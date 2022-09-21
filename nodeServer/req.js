const http = require('http')
var a = new http.ClientRequest('http://localhost:8900/v1/test/id/')
a.end()
a.on('connect', (res, socket, head) => {
    console.log('lianjie');
})

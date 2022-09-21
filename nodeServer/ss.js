let path = require('path');
let fs = require('fs');

fs.readdir(path.join(__dirname, 'img'), (err, data) => {
    // console.log(data);
    let c = data.filter((value) => {

        return /\.jpg$/.test(value)
    })
    console.log(c);
})


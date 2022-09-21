// function add(a, b, c, d, e) {
//     return eval([].slice.call(arguments).join('+'))
// }
//
// function carrying(fn) {
//     let args = []
//
//     return function _fn(arg) {
//         if (arguments.length) {
//             args.push(...arguments)
//         }
//
//         if (args.length >= fn.length) {
//             return fn(...args)
//         } else{
//             return _fn
//         }
//     }
//
// }
//
// console.log(carrying(add)(1)(2)(3)(4)(5));
//
// // console.log(add(1, 2, 3, 4, 5));


function lazy100() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(100)
        }, 100)
    })
}

function lazy50() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(50)
        }, 50)
    })
}


async function run() {
    console.time('d')
    let c = [lazy50, lazy100]

    let d = c.map(async (v, index) => {
        return await v();
    })
    let e = await Promise.all(d)
    console.log(e);
    console.timeEnd('d')
}

run()

function ajax() {

}

async function fn() {

    for (let i = 0; i < 10; i++) {
        await ajax('1s')
    }

    console.log('done') //用时10s
}

var a = 0;
var b = 1;
var obj = {
    a: 'a',
    b: 'b'
};

obj[a] = a;
obj[b] = obj[b];

console.log(obj);


//////////////////////////////


var a = 10;
var b = 20;

function fn(a) {
    a += 2;
    return function () {
        return a + b++
    }
}

let f1 = fn(a);
let f2 = fn(a);
console.log(f1());
console.log(f2());

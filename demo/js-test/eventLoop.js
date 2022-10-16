async function async1() {
    console.log('async1 start'); //2
    await async2();
    console.log('asnyc1 end'); //6
}

async function async2() {
    console.log('async2'); //3
}

console.log('script start'); //1

setTimeout(() => {
    console.log('setTimeOut'); //9
}, 0);

async1();

new Promise((reslove) => {
    console.log('promise1'); //4
    reslove();
}).then(() => {
    console.log('promise2'); //7
}).then(() => {
    console.log('promise2 then'); //8
})

console.log('script end'); //5


// async function async1() {
//     console.log("AAAA"); //2
//     async2();
//     console.log("BBBB"); //4

// }
// async function async2() {
//     console.log("CCCC"); //3
// }

// console.log("DDDD"); //1

// setTimeout(function () {
//     console.log("FFFF"); //8
// }, 0);

// async1();

// new Promise(function (resolve) {
//     console.log("GGGG"); //5
//     resolve();
// }).then(function () {
//     console.log("HHHH"); //7
// });

// console.log("IIII"); //6


// console.log('script start') //1
// let promise1 = new Promise(function (resolve) {
//     console.log('promise1') //2
//     resolve()
//     console.log('promise1 end') //3
// }).then(function () {
//     console.log('promise2') //5
// })
// setTimeout(function(){
//     console.log('settimeout')   //6
// })
// console.log('script end')   //4
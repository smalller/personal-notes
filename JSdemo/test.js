"use strict"
const print = console.log;


const num = 3;
const str1 = '1234';
const bool = true;
const null1 = null;
const unde = undefined;
const fn = function () {}
const obj1 = {}
const arr1 = [];
const Car = class {}
const date = new Date();
const reg = new RegExp();

function toRawType(type) {
    if (typeof type !== 'object') {
        return typeof type
    } else {
        return Object.prototype.toString.call(type).slice(8, -1);
    }
}
// print(toRawType(bool))
// print(Object.prototype.toString.call(bool).slice(8, -1));


// const str = '1234';
// let str = [-1, 2, 0, -2, 3];

// let iter = str[Symbol.iterator]();
// print(iter.next());
// print(iter.next());
// print(iter.next());
// print(iter.next());
// print(iter.next());
// str.push(111)
// print(iter.next());
// print(iter.next());
// print(iter.next());









//冒泡排序
let arr = [-1, 2, 0, -2, 3, 2, 10, 6, -1],
    len = arr.length;
for (let j = 0; j < len - 1; j++) {
    for (let i = 0; i < len; i++) {
        if (arr[i] > arr[i + 1]) {
            [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
        }
    }
}
// print(arr)



//数组扁平化，方式1
let arr2 = [1, 2, [3, 4, 5, [6, 7, 8], 9], 10, [11, 12]];

function flatten(arr) {
    let len = arr.length,
        res = [];
    for (let i = 0; i < len; i++) {
        if (Array.isArray(arr[i])) {
            // res = res.concat(flatten(arr[i]));
            res.push(...flatten(arr[i]));
        } else {
            res.push(arr[i]);
        }
    }

    return res
}

//数组扁平化，方式2
function flatten2(arr) {
    return arr.toString().split(',');
}

//数组扁平化，方式3
function flatten3(arr) {
    return arr.flat(Infinity);
}

//数组扁平化，方式4
function flatten4(arr) {
    return arr.reduce((prev, next) => {
        return prev.concat(Array.isArray(next) ? flatten4(next) : next)
    }, [])
}

// print(flatten4(arr2))



//数组去重
const a = {
    name: 'small',
    age: 28
}
let arr3 = [0, 1, 1, 66, '1', '22', 22, a, a, 66];

function uniq(arr) {
    // return Array.from(new Set(arr));
    return [...new Set(arr)];
}

// print(uniq(arr3))


let obj = {
    a: 1,
    b: undefined,
    c: null,
    d: {
        age: 18,
        say() {
            this.age++;
        }
    },
    e: [1, 2, 3]
};

//基础版深拷贝
function deepClone(origin, target = {}) {
    const toStr = Object.prototype.toString;
    for (let key in origin) {
        if (key in origin) {
            if (typeof origin[key] === 'object' && origin[key] !== null) {
                if (toStr.call(origin[key]) === '[object Array]') {
                    target[key] = [];
                } else {
                    target[key] = {};
                }
                deepClone(origin[key], target[key])
            } else {
                target[key] = origin[key];
            }
        }
    }
    return target;
}

let obj2 = deepClone(obj)

obj.b = 'small l';
obj.d.age = 20;
obj.d.say();
obj.e.push(4, {
    age: 29
});

print(obj)
print(obj2)


// 改进版深拷贝
const isComplexDateType = obj => typeof obj === 'object' || typeof obj === 'function' && obj !== null
const deepClone2 = function (obj, hash = new WeakMap()) {
    if (obj.constructor === Date) {
        return new Date(obj) //日期对象就直接返回一个新的日期对象
    }

    if (obj.constructor === RegExp) {
        return new RegExp(obj) //正则对象就直接返回一个新的正则对象
    }

    //如果循环引用了就用WeakMap来解决
    if (hash.has(obj)) {
        return hash.get(obj)
    }
    let allDesc = Object.getOwnPropertyDescriptor(obj)

    //遍历传入参数所有键的特性
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);

    //继承原型链
    hash.set(obj, cloneObj)

    for (let key of Reflect.ownKeys(obj)) {
        cloneObj[key] = (isComplexDateType(obj[key]) && typeof obj[key] !== 'function') ? deepClone(obj[key], hash) : obj[key]
    }

    return cloneObj
}



//extends关键字继承
class Person {
    constructor(name) {
        this.name = name;
    }

    getName() {
        print('Person:', this.name);
    }
}

class NewPerson extends Person {
    constructor(name, age) {
        //子类中存在构造函数，则需要在使用this之前先调用super()
        super(name);
        this.age = age;
    }
}

const per1 = new NewPerson('smalll', 20);
// per1.getName();
// print(per1.age);


//类数组借用方法，实现数组的增删改查操作方法
let arrLike = {
    0: 'a',
    1: 'b',
    length: 2
}

Array.prototype.push.call(arrLike, 'c', 'd');
Array.prototype.push.apply(arrLike, ['c', 'd']);

// print(arrLike)



let arr4 = [13, -2, 4, 6, 7];
const max = Math.max.apply(Math, arr4);
const min = Math.min(...arr4)
// print(max, min)
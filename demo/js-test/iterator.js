'use strict'
const print = console.log;

let obj = {
    a: 1,
    b: 2,
    c: 3,
    name: 'small',
    age: 28,
    sex: 'male'
}

obj[Symbol.iterator] = function () {
    let keys = Object.keys(obj); //将对象的键名展开成数组
    let values = Object.values(obj); //将对象的值展开成数组
    let index = 0;

    return {
        next() {
            if (index >= keys.length) {
                //return是固定写法，里面只能是对象形式
                return {
                    done: true //是否完成迭代
                }
            } else {
                return {
                    //迭代过程中要输出的值
                    value: {
                        key: keys[index],
                        value: values[index++] //迭代完一次后，就将下标加一，实现循环效果
                    }
                }
            }
        }
    }
}

//用for-of遍历对象
for (let val of obj) {
    print(val)
}
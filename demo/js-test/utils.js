/**
 * 防抖函数
 * @param {*} fn 要执行的方法
 * @param {*} delay 延时，单位ms
 * @returns 
 */
 function debounce(fn, delay) {
    let timer = null
    return function () {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, delay)
    }
}

/**
 * 节流函数
 * @param {*} fn 要执行的方法
 * @param {*} delay 延时，单位ms
 * @returns 
 */
 function throttle(fn, delay) {
    // let last = null
    // return function () {
    //     const now = Date.now()
    //     if (now - last > delay) {
    //         last = now
    //         fn.apply(this, arguments)
    //     }
    // }


    let flag = true
    return function () {
        if (flag) {
            flag = false
            setTimeout(() => {
                fn.apply(this, arguments)
                flag = true
            }, delay)
        }
    }
}

/**
 * 数组扁平化
 * @param {*} arr
 * @returns 
 */
function flatten(arr) {
    let newArr = []
    for(let i = 0; i < arr.length;i++) {
        if(Array.isArray(arr[i])) {
            newArr = [...newArr,...flatten(arr[i])]
        } else {
            newArr.push(arr[i])
        }
    }
    return newArr
}

/**
 * 深拷贝
 * @param {*} obj 
 * @returns 
 */
function deepClone(obj) {
    if (!obj || typeof obj !== 'object') return obj
    if (obj instanceof Date) return new Date(obj)
    if (obj instanceof RegExp) return new RegExp(obj)
    let clone = Array.isArray(obj) ? [] : {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] && typeof obj[key] === 'object') {
                clone[key] = deepClone(obj[key])
            } else {
                clone[key] = obj[key]
            }
        }
    }
    return clone
}

/**
 * 快速排序
 * @param {*} arr 
 * @returns 
 */
function qkSort(arr) {
    if(arr.length < 2) return arr
    const base = arr[0]
    let baseLeft = [],baseRight = []
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] < base) {
            baseLeft.push(arr[i])
        }  
        if(arr[i] > base) {
            baseRight.push(arr[i])
        }
    }
    return qkSort(baseLeft).concat(base).concat(qkSort(baseRight))
}

/**
 * 冒泡排序
 * @param {*} arr 
 * @returns 
 */
function bubbleSort(arr) {
    const len = arr.length
    for(let i = 0; i < len - 1; i++) {
        for(let j = 0; j < len; j++) {
            if(arr[j] > arr[j + 1]) {
                [arr[j],arr[j + 1]] = [arr[j + 1],arr[j]]
            }
        }
    }
    return arr
}

/**
 * 发布订阅者模式
 */
class Bus {
    constructor() {
        this.list = {}
    }
    $on(name,fn) {
        if(this.list[name]) {
            this.list[name].push(fn)
        } else {
            this.list[name] = [fn]
        }
    }
    $emit(name,data) {
        if(this.list[name]) {
            this.list[name].forEach(fn => {
                fn(data)
            })
        }
    }
    $off(name) {
        if(this.list[name]) {
            delete this.list[name]
        }
    }
}

/**
 * 两数之和
 * @param {*} arr 
 * @param {*} target 
 * @returns 
 */
function twoSum(arr, target) {
    let obj = {}
    for (let i = 0; i < arr.length; i++) {
        const num = arr[i]
        if (num in obj) {
            return [obj[num], i]
        }
        obj[target - num] = i
    }
}

/**
 * 获取变量类型
 * @param {*} type 
 * @returns 
 */
function toRawType(value) {
    if (typeof value !== 'object') {
        return typeof value
    } else {
        return Object.prototype.toString.call(value).slice(8, -1);
    }
}

/**
 * url转成json对象
 * @param {*} url 
 * @returns 
 */
function urlToObj(url) {
    if(!url) return {}
    const path = url.split('?')[0]
    const queryList = url.split('?')[1].replaceAll('=',':').split('&')
  
    let query = {}
    for(let key of queryList) {
      const queryKer = key.split(':')[0]
      const queryVal = key.split(':')[1]
      query[queryKer] = queryVal
    }
		
    return {
      path,
      query
    }
}

/**
 * json对象转成url
 * @param {*} obj 
 * @returns 
 */
function objToUrl(obj) {
    const queryObj = obj.query
    let argsList = []
    for (const key in queryObj) {
        argsList.push(`${key}=${queryObj[key]}`)
    }
    return `${obj.path}?${argsList.join('&')}`
}


/**
 * 比较版本号
 * @param {*} source 
 * @param {*} target 
 * @returns 
 */
function compareVersion(source, target) {
    const sourceV = source.split('.');
    const targetV = target.split('.');
    for (let i = 0; i < sourceV.length || i < targetV.length; i++) {
        let x = 0, y = 0;
        if (i < sourceV.length) {
            x = parseInt(sourceV[i]);
        }
        if (i < targetV.length) {
            y = parseInt(targetV[i])
        }
        if (x > y) return 1;
        if (x < y) return -1;
    }
}

/**
 * 菲波那切数列
 * @param {*} n 前多少个数之和
 * @returns 
 */
function fibonacci(n) {
  let num1 = 1,num2 = 1,sum = num2
  for(let i = 1; i < n; i++) {
    sum = num1 + num2
    num1 = num2
    num2 = sum
  }
  return sum
}
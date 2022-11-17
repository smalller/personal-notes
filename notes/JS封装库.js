//数据类型判断
function toRawType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

function toRawType(type) {
    if (typeof type !== 'object') {
        return typeof type
    } else {
        return Object.prototype.toString.call(type).slice(8, -1);
    }
}


//时间戳转换
function timestampToTime(timestamp) {
    let date = new Date(timestamp.length == 10 ? timestamp * 1000 : timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
}


//获取滚动条滚动情况
function getScrollOffset() {
    if (window.pageYOffset || window.pageXOffset) {
        return {
            x: window.pageXOffset + "px",
            y: window.pageYOffset + "px"
        }
    } else { //IE8以下版本浏览器的方法
        return {
            x: document.body.srcollLeft + document.documentElement.srcollLeft + "px",
            y: document.body.srcollTop + document.documentElement.srcollTop + "px"
        }
    }
}


//获取可视窗口尺寸：
function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth + "px",
            h: window.innerHeight + "px"
        }
    } else { //IE8以下的方法
        //向后版本兼容情况下的方法
        if (document.compatMode === "BackCompat") {
            return {
                w: document.body.clientWidth + "px",
                h: document.body.clientHeight + "px"
            }
        } else { //正常情况下的方法
            return {
                w: document.documentElement.clientWidth + "px",
                h: document.documentElement.clientHeight + "px"
            }
        }
    }
}


// 兼容性元素样式查询（可查询一个元素的任何样式值）
function getStyle(elem, prop) { //elem表要获取的dom元素，prop表要获取的元素的属性，传入的prop要加引号
    if (window.getComputedStyle) {
        return window.getComputedStyle(elem, null)[prop]; //[prop]表示存储输入的元素属性
    } else {
        return elem.currentStyle[prop]; //用中括号可以解决存储问题
    }
}


// 绑定事件的函数
function addEvent(elem, type, handle) { //第一个参数表示事件对象（dom对象），第二个参数表示事件的类型(如："click")，第三个参数表示事件的处理函数
    if (elem.addEventListener) {
        elem.addEventListener(type, handle, false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, function () {
            handle.call(elem);
        });
    } else {
        elem["on" + type] = handle;
    }
}


// 阻止冒泡事件流
function stopBubble(event) { //将事件对象传入，调用时，直接写 stopBubble(e)，主方法里也要将e传入;
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}


// 阻止默认事件，如a链接跳转，在调用时，直接写 cancleHandler(e)，主方法里也要将e传入; 
function cancleHandler(event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

//基础版深拷贝1
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


//基础版深拷贝2
function deepClone(origin, target) {
    var target = target || {};
    toStr = Object.prototype.toString;
    arrStr = "[object Array]";

    for (var prop in origin) {
        if (origin.hasOwnProperty(prop)) {
            if (origin[prop] !== null && typeof (origin[prop]) == "object") {
                if (toStr.call(origin[prop]) == arrStr) {
                    target[prop] = [];
                } else {
                    target[prop] = {};
                }
                deepClone(origin[prop], target[prop]);
            } else {
                target[prop] = origin[prop];
            }
        }
    }
    return target;
}


//获取字节长度的方法
function retBytes(str) { //注意，传入的实际值需带引号，直接传入变量不需要
    var num = str.length;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 255) {
            num++;
        }
    }
    return num;
}


// 精确版获取值的类型
function type(target) {
    var template = { //具体什么类型，就从这里调用并返回具体的类型
        "[object Array]": "array",
        "[object Object]": "object",
        "[object Boolean]": "boolean",
        "[object String]": "string"
    }
    if (target === null) {
        return "null";
    } else if (typeof (target) == "object") {
        var str = Object.prototype.toString.call(target);
        return template[str];
    } else {
        return typeof (target);
    }
}


// 数组去重（直接调用unique()方法）
Array.prototype.unique = function () {
    var temp = {},
        arr = [],
        len = this.length;
    for (var i = 0; i < len; i++) {
        if (!temp[this[i]]) { //如果temp里没有当前值
            temp[this[i]] = "abc"; //给当前的值存于一个对象并随便赋一个值
            arr.push(this[i]); //把当前值添加进arr
        }
    }
    return arr; //返回新添加的数组
}


//当需要异步加载js文件或者函数时，调用此方法
function loadScript(url, callback) { //url表示传入的js文件路径，callback表示传入的函数名
    var script = document.createElement("script");
    if (script.readyState) { //ie浏览器
        script.onreadystatechange = function () {
            if (script.readyState == "complete" || script.readyState == "loaded") {
                callback();
            }
        }
    } else { //其他浏览器
        script.onload = function () {
            callback();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}
//调用方式：loadScript("demo.js",function() {test();}); 按需加载


//继承封装，第一个参数为要继承者，第二个参数为被继承者（原型链上的所有属性都会被继承）
function inherit(Target, Origin) {
    function Middle() {}
    Middle.prototype = Origin.prototype; //这里的Target表示Son,Origin表示Father
    Target.prototype = new Middle();
    Target.prototype.constuctor = Target; //使Son的constuctor变为它本身
    Target.prototype.uber = Origin.prototype; //让Son清楚自己到底继承自谁，这里是继承自Father
}


//创建和追加元素的方法
function creatAppend(tag, parent) { //传入要创建的标签和要追加到的父元素
    var newElement = document.createElement(tag); //创建元素
    if (parent !== undefined) { //如果传参传了父元素（父元素可以不传），如果没传父元素就直接将创建好的元素返回，无需再追加到父元素中
        parent.appendChild(newElement); //就将该元素追加元素到父元素上
    }
    return newElement; //返回当前创建并追加好的元素
}

//获取数组中最大值
const maxItemofArray = (arr) => [...arr].sort((a, b) => b - a).slice(0, 1)[0];

//获取数组中最小值
const minItemofArray = (arr) => [...arr].sort((a, b) => a - b).slice(0, 1)[0];

//数组的所有项是否相等
const areAllEqual = array => array.every(item => item === array[0]);

//返回给定数的平均数
const averageOf = (...numbers) => numbers.reduce((a, b) => a + b, 0) / numbers.length;


var UA = window.navigator.userAgent || '';
var IS_IOS = Boolean(UA.match(/(iPhone|iPad|iPod|iOS)/));

// 是否为刘海屏iphone
function isIphonex() {
    // X XS, XS Max, XR
    var xSeriesConfig = [{
      devicePixelRatio: 3,
      width: 375,
      height: 812
    }, {
      devicePixelRatio: 3,
      width: 414,
      height: 896
    }, {
      devicePixelRatio: 2,
      width: 414,
      height: 896
    }]; // h5
  
    if (typeof window !== 'undefined' && window) {
      if (!IS_IOS) {
        return false;
      }
  
      var _window = window,
          devicePixelRatio = _window.devicePixelRatio,
          screen = _window.screen;
      var width = screen.width,
          height = screen.height;
      return xSeriesConfig.some(function (item) {
        return item.devicePixelRatio === devicePixelRatio && item.width === width && item.height === height;
      });
    }
  
    return false;
  }


/**
 * 获取全部url参数
 *
 * @param {string} url url地址，没传默认取当前页面的url
 * @return {string[]} query params
 */
function getQueryParams() {
    var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.href;
    url = decodeURIComponent(url);
    return (url.match(/([^?=&]+)(=([^&]*))/g) || []).reduce(function (a, v) {
      return a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a;
    }, {});
}
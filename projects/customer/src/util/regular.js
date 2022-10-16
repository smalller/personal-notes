/*
 * @Author: xuxiao 
 * @Date: 2020-08-24 18:02:13 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2021-02-06 17:12:52
 */

import Message from "element-ui/packages/message/index.js";
// 
// 手机号码验证
function phone(val) {
    if (!(/(^0\d{2,3}\d{7,8}$)|(^400[016789]\d{6}$)|(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(val))) {
        return false;
    } else {
        return true
    }
}
// 纯数字
function pureNumber(val) {
    if (!(/^\d{1,}$/.test(val))) {
        return false;
    } else {
        return true
    }
}

//验证金额
function money(val) {
    if (!/^\d+(\.\d{1,2})?$/.test(val)) {
        return false;
    } else {
        return true
    }
}


//身份证验证
function idCard(val) {
    if (!(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(val))) {
        Message.error("身份证号码有误，请重新输入");
        return false;
    }
}

// 邮箱验证
function email(val) {
    if (!(/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test(val))) {
        Message.error("邮箱不规范，请重新输入");
        return false;
    }
}
// url验证
function urlText() {
    var sUrl = location.search.toLowerCase();
    var sQuery = sUrl.substring(sUrl.indexOf("=") + 1);
    console.log(sQuery)
    let re = /select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
    if (re.test(sQuery)) {
        Message.error("请勿输入非法字符");
        location.href = sUrl.replace(sQuery, "");
    }
}

// input验证
function inputText(oField) {
    let re = /select|update|delete|exec|count|’|"|=|;|>|<|%/i;
    if (re.test(oField.value)) {
        //Message.error("请您不要在参数中输入特殊字符和SQL关键字！"); //注意中文乱码
        oField.value = "";
        oField.className = "errInfo";
        oField.focus();
        return false;
    }
}

// 时间格式化
function timeData(timestamp, type = 1) {
    /* type
        1.年月日时分秒
        2.年月日
        3.年月日时分
        4.时分
        5.年月
    */
    var date = new Date(timestamp); //10位*1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (type == 1) return Y + '-' + M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
    if (type == 2) return Y + '-' + M + '-' + addZero(D);
    if (type == 3) return Y + '-' + M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m);
    if (type == 4) return addZero(h) + ':' + addZero(m);
    if (type == 5) return Y + '-' + M;
}

function addZero(num) {
    return num < 10 ? '0' + num : num
}
// 深拷贝简单转换
function deep(val) {
    let str = JSON.stringify(val)
    return JSON.parse(str);
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


// 图片转base64
function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();
    var dataURL = canvas.toDataURL("image/" + ext);
    return dataURL;
}


// 压缩base64
function compress(base64String, w, quality) {
    var getMimeType = function (urlData) {
        var arr = urlData.split(',');
        var mime = arr[0].match(/:(.*?);/)[1];
        // return mime.replace("image/", "");
        return mime;
    };
    var newImage = new Image();
    var imgWidth, imgHeight;

    var promise = new Promise(resolve => newImage.onload = resolve);
    newImage.src = base64String;
    return promise.then(() => {
        imgWidth = newImage.width;
        imgHeight = newImage.height;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        if (Math.max(imgWidth, imgHeight) > w) {
            if (imgWidth > imgHeight) {
                canvas.width = w;
                canvas.height = w * imgHeight / imgWidth;
            } else {
                canvas.height = w;
                canvas.width = w * imgWidth / imgHeight;
            }
        } else {
            canvas.width = imgWidth;
            canvas.height = imgHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
        var base64 = canvas.toDataURL(getMimeType(base64String), quality);
        return base64;
    });
}

export default {
    phone,
    money,
    idCard,
    email,
    timeData,
    inputText,
    timestampToTime,
    deep,
    pureNumber,
    getBase64Image,
    compress
}
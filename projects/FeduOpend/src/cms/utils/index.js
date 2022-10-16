/**
 * 获取uuid
 */
import Vue from 'vue'
export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    return (c === 'x' ? (Math.random() * 16) | 0 : 'r&0x3' | '0x8').toString(16)
  })
}
// 安卓下载连接
export const androidDownloadUrl =
  'https://zdostatic.oss-cn-shenzhen.aliyuncs.com/android-2.3.3-2020-10-21.apk'
export function clone(target, source) {
  for (let key in source) {
    if (target[key]) continue
    const val = source[key]
    target[key] = typeof val === 'object' ? clone(target[key], val) : val
  }
  return target
}

export function getUrl(string, str) {
  // return 'fltdkzkt'
  // return process.env.NODE_ENV !== 'production' ? 'fltdkzkt' : 'yab'
  // return str_before
  // return 'yab'
  // console.log(window.location.hostname)
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname.indexOf('192') !== -1
  ) {
    return 'fltdkzkt'
    // return 'ywbtest'
    // return 'zxpt'
    // return 'yab'
  } else {
    let str_before = string.split(str)[0]
    return str_before
  }
}
// 将base64转换为文件
export function dataURLtoFile(dataurl, filename) {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, {
    type: mime,
  })
}

export function DateFormat(date, fmt, outTime) {
  if (outTime) {
    const time = date.getTime() - outTime
    date.setTime(time)
  }
  var o = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        +RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function strToHexCharCode(str) {
  if (str === '') {
    return ''
  }
  var hexCharCode = []
  hexCharCode.push('0x')
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push(str.charCodeAt(i).toString(16))
  }
  return hexCharCode.join('')
}

export function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim()
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === '0x'
      ? trimedStr.substr(2)
      : trimedStr
  var len = rawStr.length
  if (len % 2 !== 0) {
    // alert('Illegal Format ASCII Code!')
    return ''
  }
  var curCharCode
  var resultStr = []
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16) // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode))
  }
  return resultStr.join('')
}

// 函数防抖
export function debounce(callback, wait = 3000) {
  let timer
  return function () {
    let ctx = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      callback.apply(ctx, args)
    }, wait)
  }
}
// 函数节流
export function throttle(fn, threshold, scope) {
  let prev = Date.now()
  return function () {
    let context = scope || this
    let args = arguments
    let now = Date.now()
    if (now - prev > threshold) {
      prev = now
      fn.apply(context, args)
    }
  }
}

// 获取GPU信息
export function getGPUInfo() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('experimental-webgl')
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
  return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
}
// 时分秒转换为
export function countDown(time) {
  let s = 0
  let hour = time.split(':')[0]
  let min = time.split(':')[1]
  let sec = time.split(':')[2]
  s = Number(hour * 3600) + Number(min * 60) + Number(sec)
  return s
}
export function toHHmmss(time) {
  // console.log(time)
  let times
  let year = new Date().getFullYear()
  let month =
    new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1
  let day =
    new Date().getDate() < 10
      ? `0${new Date().getDate()}`
      : new Date().getDate()
  let nowTime = `${year}-${month}-${day}`
  if (+time === +nowTime) {
    let s = new Date()
    let hours = s.getHours()
    let minutes = s.getMinutes()
    let seconds = s.getSeconds()
    times = `${hours}:${minutes}:${seconds}`
  } else {
    times = `00:00:00`
  }
  return times
}

export function getTimes(num) {
  num = num / 1000
  let day = Math.floor(num / (24 * 3600))
  let hour = Math.floor((num % (24 * 3600)) / 3600)
  let minuts = Math.floor((num % 3600) / 60)
  let second = Math.floor(num % 60)
  if (second.toString().length < 2) {
    second = '0' + second.toString()
  }
  if (minuts.toString().length < 2) {
    minuts = '0' + minuts.toString()
  }
  if (hour.toString().length < 2) {
    hour = '0' + hour.toString()
  }
  return day > 0
    ? `${day}天 ${hour}:${minuts}:${second}`
    : `${hour}:${minuts}:${second}`
  // return `${day}天 ${hour}:${minuts}:${second}`
}

// 前往课中
export function goToClass(chapterInfo) {
  sessionStorage.setItem('chapterInfo', JSON.stringify(chapterInfo))
  // window.classRoom = window.open('https://192.168.1.178:8088')
  if (+chapterInfo.courseType === 300456) {
    window.classRoom = window.open(process.env['VUE_APP_ROOM'])
  } else {
    // window.classRoom = window.open('https://192.168.1.178:8088' + '/activity')
    window.classRoom = window.open(process.env['VUE_APP_ROOM'] + '/activity')
  }
}
export function copy(text) {
  return new Promise((resolve) => {
    const copy = function (e) {
      e.clipboardData.setData('text/plain', text) // clipboardData对象
      e.preventDefault() // 阻止默认行为
      resolve()
    }
    document.addEventListener('copy', copy)
    document.execCommand('copy')
  })
}

//限制图片大小
export function limitFileWH(E_width, E_height, file) {
  let _this = Vue.prototype
  let imgWidth = ''
  let imgHight = ''
  const isSize = new Promise(function (resolve, reject) {
    let width = E_width
    let height = E_height
    let _URL = window.URL || window.webkitURL
    let img = new Image()
    img.onload = function () {
      imgWidth = img.width
      imgHight = img.height
      let valid = img.width == width && img.height == height
      valid ? resolve() : reject()
    }
    img.src = _URL.createObjectURL(file)
  }).then(
    () => {
      return true
    },
    () => {
      _this.$message.warning({
        message:
          '上传文件的图片大小不合符标准,宽需要为' +
          E_width +
          'px，高需要为' +
          E_height +
          'px。当前上传图片的宽高分别为：' +
          imgWidth +
          'px和' +
          imgHight +
          'px',
        btn: false,
      })
      return false
    }
  )
  return isSize
}

//视频上传验证
export function limitedVideo(file) {
  let _this = Vue.prototype
  const isLt500M = file.size / 1024 / 1024 < 500
  if (
    [
      'video/mp4',
      // 'video/ogg',
      // 'video/flv',
      // 'video/avi',
      // 'video/wmv',
      // 'video/rmvb',
    ].indexOf(file.type) == -1
  ) {
    _this.$message.error('请上传正确的视频格式')
    return false
  }
  if (!isLt500M) {
    _this.$message.error('上传视频大小不能超过500MB哦!')
    return false
  }
  return true
}

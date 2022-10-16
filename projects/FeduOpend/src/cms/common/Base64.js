// 自定义一个类（构造函数）
export default function Base64() {
  // 自定义对象
  this._keyStr =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
  this._utf8_encode = function (string) {
    string = string.replace(/\r\n/g, '\n')
    let utftext = ''
    for (let n = 0; n < string.length; n++) {
      const c = string.charCodeAt(n)
      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }
    return utftext
  }
  this._utf8_decode = function (utftext) {
    let string = ''
    let i = 0
    let c
    let c3
    let c2 = 0
    while (i < utftext.length) {
      c = utftext.charCodeAt(i)
      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        )
        i += 3
      }
    }
    return string
  }

  // 定义字符串转base64的方法
  this.strToBase64 = function (str) {
    let output = ''
    let chr1, chr2, chr3, enc1, enc2, enc3, enc4
    let i = 0
    str = this._utf8_encode(str)
    while (i < str.length) {
      chr1 = str.charCodeAt(i++)
      chr2 = str.charCodeAt(i++)
      chr3 = str.charCodeAt(i++)
      enc1 = chr1 >> 2
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
      enc4 = chr3 & 63
      if (isNaN(chr2)) {
        enc3 = enc4 = 64
      } else if (isNaN(chr3)) {
        enc4 = 64
      }
      output =
        output +
        this._keyStr.charAt(enc1) +
        this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) +
        this._keyStr.charAt(enc4)
    }
    return output
  }

  // 定义base64转字符串的方法
  this.base64ToStr = function (base64) {
    let output = ''
    let chr1, chr2, chr3
    let enc1, enc2, enc3, enc4
    let i = 0
    base64 = base64.replace(/[^A-Za-z0-9\/]/g, '')
    while (i < base64.length) {
      enc1 = this._keyStr.indexOf(base64.charAt(i++))
      enc2 = this._keyStr.indexOf(base64.charAt(i++))
      enc3 = this._keyStr.indexOf(base64.charAt(i++))
      enc4 = this._keyStr.indexOf(base64.charAt(i++))
      chr1 = (enc1 << 2) | (enc2 >> 4)
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
      chr3 = ((enc3 & 3) << 6) | enc4
      output = output + String.fromCharCode(chr1)
      if (+enc3 !== 64) {
        output = output + String.fromCharCode(chr2)
      }
      if (+enc4 !== 64) {
        output = output + String.fromCharCode(chr3)
      }
    }
    output = this._utf8_decode(output)
    return output
  }

  // 定义图片转base64的方法(FileReader的方法)
  this.imgToBase64FR = function (obj) {
    const reader = new FileReader()
    const imgFile = obj.imgFile // 图片文件
    const size = parseInt(obj.size) * 1024 * 1024 // 限制的上传文件的大小,单位：B（字节）
    // var imgUrlBase64 = null;
    if (imgFile) {
      // 将文件以Data URL形式读入页面
      reader.readAsDataURL(imgFile)
      reader.onload = function () {
        if (+size !== 0 && size < reader.result.length) {
          obj.success({
            flag: 100,
          })
        } else {
          // 执行上传操作
          obj.success({
            flag: 101,
            data: reader.result,
          })
        }
      }
    }
  }

  // 定义图片转base64的方法（canvas的方法）
  this.imgToBase64Canvas = function (obj) {
    if (obj.imgFile) {
      const size = parseInt(obj.size) * 1024 * 1024 // 限制的上传文件的大小,单位：B（字节）
      if (+size !== 0 && size < obj.imgFile.size) {
        obj.success({
          flag: 100,
        })
        return
      }
      const imgurl = window.URL.createObjectURL(obj.imgFile) // 将文件创建url
      // var image = document.createElement('img');
      const image = new Image() // 创建一个图片对象
      image.src = imgurl // 对图片绑定src
      // 当图片加载完毕后执行的方法，必须加这个，否则返回的图片width和height为0
      image.onload = function () {
        const img = image
        let canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)
        const ext = img.src
          .substring(img.src.lastIndexOf('.') + 1)
          .toLowerCase()
        const dataURL = canvas.toDataURL('image/' + ext)
        canvas = null // 释放
        // 返回base64
        obj.success({
          flag: 101,
          data: dataURL,
        })
      }
    }
  }
}

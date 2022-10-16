const $api = require('./api')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 时间格式化
const timeData = (timestamp, type = 1)=>{
  /* type
      1.年月日时分秒
      2.年月日
      3.年月日时分
      4.时分
      5.年月
  */
  let date = new Date(timestamp.length == 10 ? timestamp * 1000 : timestamp);
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

const goApp = ()=>{
  wx.getSystemInfo({
    success: function (res) {
      if(res.platform == 'devtools'){
        console.log('跳转pc')
      }else if(res.platform == 'ios'){
        console.log('跳转ios')
      }else if(res.platform == 'android'){
        console.log('跳转android')    
      }
    }
  })
}

const phoneHide = (data)=>{
  return data.replace(data.substr(3,4),'****')
}


const timeFormat = (time,timeTwo,type)=>{
  /*
      type 1: 计算当前时间 和某个时间的差   取time 
      type 2: 一个时间的时分秒转换 取time
      type 3：传入2个时间进行计算 取time,timeTwo
      type 4: 传入差值  计算时分秒
  */
  let diff = null
  if(typeof time == 'string'){
    time = time.replace(/-/g, '/')
  }
  if(typeof timeTwo == 'string'){
    timeTwo = timeTwo.replace(/-/g, '/')
  }
  // time = 1259977
  switch(type){
      case 1:
          diff =  new Date(time).getTime() - new Date().getTime()
          break
      case 2:
          diff = time*1000
          break
      case 3:
          diff = new Date(time).getTime() - new Date(timeTwo).getTime()
          break
      case 4:
          diff = time*1000
          break
  }
  let getHours,minutes,seconds,leve1,leve2,leve3
  leve1 =  diff%(24*3600*1000)
  getHours = Math.floor(leve1/(3600*1000))
  leve2 =  leve1%(3600*1000)
  minutes = Math.floor(leve2/(60*1000))
  leve3 = leve2%(60*1000)
  seconds = Math.floor(leve3/1000)
  if(getHours<10){
      getHours = '0' + getHours
  }
  if(minutes<10){
      minutes = '0' + minutes
  }
  if(seconds<10){
      seconds = '0' + seconds
  }

  if(type == 4){
    return getHours + '小时' + minutes + '分钟' + seconds + '秒'
  }

  if(getHours <= 0){
      return minutes + '分钟' + seconds + '秒'
  }else{
      return getHours + '小时' + minutes + '分钟' + seconds + '秒'
  }


}

const iosOrAndTime = (data)=>{
  let time = data.toString()
  wx.getSystemInfo({
    success:(res=>{
      if(res.platform == 'ios'){
        time = time.replace(/-/g, '/');
        return time
      }else{
        return time
      }
    })
  })
}


const position = (data)=>{
  wx.showModal({
    title: '温馨提示',
    content: '需要获取位置授权，是否前往',
    success (res) {
      if (res.confirm) {
        wx.openSetting({
            success (res) {
                wx.getLocation({
                    type: 'wgs84',
                    success:res=> {
                        if (this.userInfoReadyCallback) {
                            this.userInfoReadyCallback(res)
                        }
                        wx.request({
                            url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ',
                            data: {},
                            success:res=> {
                                wx.setStorageSync('lat_lng', res.data.result.location.lat + ',' + res.data.result.location.lng)
                                wx.setStorageSync('address', res.data.result.ad_info)
                            }
                        })
                    }
                })
            }
        })
        } else if (res.cancel) {
            wx.showToast({
                title: '取消授权',
                icon: 'none',
                duration: 2000
            })
            setTimeout(()=>{
                wx.navigateBack({
                    delta: 1
                })
            },2000)
        }
    }
})          
}

// const numAutoPlusAnimation = (options) =>{
//   options = options || {}; 
//   console.log(options)
//   var time = options.time,
//   finalNum = options.num,
//   regulator = options.regulator || 100,
//   step = finalNum / (time / regulator),
//   count = 0, //计数器 
//   initial = 0; 
//   var timer = setInterval(function() { 
//     count = count + step; 
//     if(count >= finalNum) {
//       clearInterval(timer);
//       count = finalNum;
//     }
//     var t = Math.floor(count); 
//     if(t == initial) return; 
//     initial = t; 
//     return initial; 
//   }, 30); 
// }




const userLogin = (e,type='')=>{
  return new Promise((resolve, reject) => {
    var userinfo = e.userInfo || e.detail.userInfo
    let lat_lng = wx.getStorageSync('lat_lng');
    let lat,lon
    if(lat_lng){
      lat = lat_lng.split(',')[0]
      lon = lat_lng.split(',')[1]
    }else{
      lat = 0
      lon = 0
    }
    let lat_lon = {
      lat: lat,
	    lon: lon
    }
    if(userinfo){
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        code:wx.getStorageSync('code'),
        iv:e.iv || e.detail.iv,
        encryptedData:e.encryptedData || e.detail.encryptedData,
        avatar:userinfo.avatarUrl,
        nickName:userinfo.nickName,
        lat:lat,
        lon:lon,
        salespersonId:type
      }
      let header_str,token='';
      header_str = {"Content-type":"application/json"}
      token = wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo').token : ''
      header_str['X-App-Token'] = token
      wx.request({
        url: $api.baseUrl + '/app/wx/login',
        method: 'post',
        data: data,
        header: header_str,
        success (res) {
          if(res.data.code == 0){
            wx.setStorageSync('userinfo', res.data.data)
            res.data.data['msg'] = res.data.msg
            $api.ajax('/app/user/userLocation', 'post', lat_lon)
            wx.hideLoading()
            resolve(res.data.data)
          }else if(res.data.code == 700){
            wx.login({
              success: logRes => {
                wx.setStorageSync('code', logRes.code)
                wx.showToast({
                  title: '登录失败，请重试',
                  icon: 'none',
                  duration: 2000
                })
                wx.hideLoading()
                resolve(res.data.data)
              }
            })
          }else{
            wx.showToast({
              title: '登录失败，请重试',
              icon: 'none',
              duration: 2000
            })
            wx.hideLoading()
            resolve(res.data.data)
          }
        },
        fail(err){
          wx.showToast({
            title: err.msg,
            icon:'none',
            duration:2000
          })
          wx.hideLoading()
          wx.login({
            success: res => {
              wx.setStorageSync('code', res.code)
            }
          })
          reject(err)
        }
      })
    }else{
      wx.hideLoading()
      if(type){
        wx.switchTab({
          url: '../index/index',
        })
        return false
      }
      wx.showToast({
        title: '登录有更好的体验',
        icon:'none'
      })
      return false
    }
  })  
}

const userPhone = (e) =>{
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code)
        let code = wx.getStorageSync('code')
        let data = {
          iv:e.detail.iv,
          encryptedData:e.detail.encryptedData,
          code:code
        }
        let header_str,token='';
        header_str = {"Content-type":"application/json"}
        token = wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo').token : ''
        header_str['X-App-Token'] = token
        wx.request({
          url: $api.baseUrl + '/app/wx/bindPhone',
          method: 'post',
          data: data,
          header: header_str,
          success (res) {
            if(res.data.code == 0){
              let tel = wx.getStorageSync('userinfo')
              tel.phone = res.data.data.phone
              wx.setStorageSync('userinfo', tel)
              wx.hideLoading()
              resolve(res.data.data)
            }else{
              wx.showToast({
                title: '授权失败',
                icon:'none'
              })
              wx.hideLoading()
              resolve(res.data.data)
            }
          },
          fail(err){
            wx.showToast({
              title: err.msg,
              icon:'none',
              duration:2000
            })
            wx.hideLoading()
            wx.login({
              success: res => {
                wx.setStorageSync('code', res.code)
              }
            })
            reject(err)
          }
        })
      }
    })
  }) 
}



module.exports = {
  formatTime: formatTime,
  goApp,
  phoneHide,
  timeFormat,
  timeData,
  iosOrAndTime,
  userLogin,
  userPhone
}

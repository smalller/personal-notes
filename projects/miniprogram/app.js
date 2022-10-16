App({
  onLaunch: function () {

    wx.removeStorageSync('address')
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '已有新版本，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
            })
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('code', res.code)
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
        // if(res.authSetting['scope.userLocation']){
        //   if(wx.getStorageSync('address'))return
        //   wx.getLocation({
        //     type: 'wgs84',
        //     success:res=> {
        //       if (this.userInfoReadyCallback) {
        //           this.userInfoReadyCallback(res)
        //       }
        //       wx.request({
        //           url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ',
        //           data: {},
        //           success:res=> {
        //             wx.setStorageSync('address', res.data.result.ad_info)
        //             wx.setStorageSync('lat_lng', res.data.result.location.lat + ',' + res.data.result.location.lng)
        //             this.globalData.exchangeCity = res.data.result.ad_info.city
        //           }
        //       })
        //     }
        //   })
        // }else{
        //   wx.authorize({
        //     scope: 'scope.userLocation',
        //     success:res=> {
        //       wx.getLocation({
        //         type: 'wgs84',
        //         success:res=> {
        //           if (this.userInfoReadyCallback) {
        //               this.userInfoReadyCallback(res)
        //           }
        //           wx.request({
        //               url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ',
        //               data: {},
        //               success:res=> {
        //                 wx.setStorageSync('address', res.data.result.ad_info)
        //                 wx.setStorageSync('lat_lng', res.data.result.location.lat + ',' + res.data.result.location.lng)
        //                 this.globalData.exchangeCity = res.data.result.ad_info.city
        //               }
        //           })
        //         }
        //       })
        //     }
        //   })
        // }
      }
    })
  },
  globalData: {
    userInfo: null,
    queueSource : 1,
    storeId : '1303940591402762241',
    exchangeCity:'',
  }
})
const units = require('../../utils/util')
const $api = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popupFlag:false,
    getPhone:false,
    tel:'',
    addUrl: `${$api.fileUrl}`,
    show:false,
    childComponent:{}
  },
  clearStorage(){
    wx.removeStorageSync('coupons')
    wx.removeStorageSync('pay_timer')
    wx.removeStorageSync('payInfo')
    wx.removeStorageSync('ktv_info')
    wx.removeStorageSync('useCart')
    wx.removeStorageSync('selectKtvId')
    wx.showToast({
      title: '清除成功',
      icon:'success',
      duration:2000
    })
  },
  getPhoneNumber(e){
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code)
        let code = res.code
        let data = {
          iv:e.detail.iv,
          encryptedData:e.detail.encryptedData,
          code:code
        }
        $api.ajax('/app/wx/bindPhone','post',data).then(res=>{
          if(res.code == 0){
            this.setData({
              tel:units.phoneHide(res.data.phone),
              getPhone:false
            })
            let user = wx.getStorageSync('userinfo')
            user.phone = res.data.phone
            wx.setStorageSync('userinfo', user)
          }
        })  
      }
    })
  },
  //弹窗
  // popup(){
    // this.setData({
    //   popupFlag:!this.data.popupFlag
    // })
  // },
  //密码设置
  passwordSet(){
    wx.navigateTo({
      url: '/pages/personSet/passwordSet/passwordSet',
    })
  },
  goVerify(){
    wx.navigateTo({
      url: '/pages/personSet/phoneSet/phoneSet',
    })
  },
  blacklist(){
    wx.showToast({
      title: '请下载APP查看',
      icon: 'none',
      duration: 1500
    })
  },
  selfInfo(){
    wx.showToast({
      title: '请下载APP查看',
      icon: 'none',
      duration: 1500
    })
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
    }
    return {
      title: '玖座',
      // path: '/pages/downApp/downApp',
      path: '/pages/index/index',
      imageUrl : '../../images/shareXCX.png'
    }
  },
  logout(){
    this.setData({
      show:true,
    })
  },
  cancel(e){
    this.setData({
      show:false
    })
  },
  confirm(e){
    $api.ajax('/app/logout','post').then(res=>{
      this.setData({
        show:false,
      })
      if(res.code == 0){
        wx.removeStorageSync('userinfo')
        wx.removeStorageSync('coupons')
        wx.removeStorageSync('pay_timer')
        wx.removeStorageSync('payInfo')
        wx.removeStorageSync('ktv_info')
        wx.removeStorageSync('useCart')
        wx.removeStorageSync('selectKtvId')
        wx.login({
          success: res => {
            wx.setStorageSync('code', res.code)
          }
        })
        wx.navigateBack({delta: 1})
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })        
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var tel = wx.getStorageSync('userinfo').phone
    if(tel){
      this.setData({
        getPhone:false,
        tel:tel
      })
    }else{
      this.setData({
        getPhone:true
      })
    }
  },

 
})
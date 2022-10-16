// pages/allGoods/goodsCar/goodsCar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    HH:'',
    flag:true,
    colorFlag:true,
    delFlag:true,
  },
  //编辑
  redact(){
    this.setData({
      flag:!this.data.flag
    })
  },
  changeColor(){
    this.setData({
      colorFlag:!this.data.colorFlag
    })
  },
  shadeDis(){
    this.setData({
      delFlag:false
    })
  },
  goBack(){
    wx.navigateBack(1)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success:(res=>{
        // console.log(res)
        // wx.setStorageSync('phone', res)
      })
    })
    
    let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    // console.log(menuButtonObject.top)
    this.data.HH=menuButtonObject.top+2+'px'
    this.setData({
      HH:this.data.HH
    })
    // console.log(this.data.HH)
  },
})
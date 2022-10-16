// pages/discovery/index.js
const unils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    funArr:[
      {type:1,text:'摇骰子',icon:'../../images/touzi.png'},
      {type:2,text:'动态',icon:'../../images/dongtai.png'},
      {type:3,text:'附近的人',icon:'../../images/fujin.png'},
      {type:4,text:'扫一扫',icon:'../../images/saoma.png'},
    ]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  dice(e){
    wx.navigateTo({
      url: '../dice/dice',
    })
  },
  tips(){
    wx.showToast({
      title: '小程序暂不支持此功能',
      icon: 'none',
      duration: 2000
    })
  },
  goAPP(){
    unils.goApp()  
  },
})
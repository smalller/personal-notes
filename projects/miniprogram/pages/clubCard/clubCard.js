const app = getApp()
const $api = require('../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: 1,
    cards:[],
    storeId:'',
    addUrl: `${$api.fileUrl}`,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  check(e) {
    let type = e.currentTarget.dataset.type
    if(type == 1){
      if(this.data.flag == 1){
        return
      }
      this.setData({
        flag: 1
      })
      this.getCards()
    }else{
      if(this.data.flag == 0){
        return
      }
      this.setData({
        flag: 0
      })
      this.getCards()
    }
  },

  onLoad: function (options) {
    if(options.type){
      this.setData({
        flag : options.type,
        storeId:options.storeId || ''
      })
    }
    this.getCards()
  },

  getCards(){
    let type = this.data.flag
    let data = {
      storeId:this.data.storeId,
      type:type
    }
    $api.ajax(`/app/vipCard/myVipCard`, 'post',data).then(res => {
      if (res.code != 0) {
          wx.showToast({
              title: res.msg,
              icon:'none',
              duration:2000
          })
          return
      }
      this.setData({
        cards: res.data
      })
    })
  },


  toView(e){
    let value = e.currentTarget.dataset.value
    wx.setStorageSync('vipCard', value)
    if(this.data.flag == 1){
      wx.navigateTo({
        // url: './hasCard?id=' + JSON.stringify(value),
        url: './hasCard',
      })
    }else{
      wx.navigateTo({
        url: './buyCard?id=' + value.storeId,
      })
    }
  }
})
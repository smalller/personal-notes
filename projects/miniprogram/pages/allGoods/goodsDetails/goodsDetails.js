// pages/allGoods/goodsDetails/goodsDetails.js
const computedBehavior = require('miniprogram-computed')
const $api = require('../../../utils/api')
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    mealList: [],
    num: 3,
    num_flag: false,
    goodsDetails: [],
    addUrl: `${$api.fileUrl}/admin/system/upload/down?keyName=`,
  },
  //计算属性、
  computed: {
    sum: function (data) {
      return data.num
    },
    allPic: function (data) {
      return data.num * data.goodsDetails.presentPrice
    }
  },
  //加减
  lose(e) {
    if (e.target.dataset.tit == 1) {
      this.data.num--
      this.data.num == 0 ? this.data.num_flag = true : this.data.num_flag = false
    } else {
      this.data.num++
      this.data.num >= 1 ? this.data.num_flag = false : this.data.num_flag = true
    }
    this.setData({
      num_flag: this.data.num_flag,
      num: this.data.num
    })
  },
  goCar() {
    wx.navigateTo({
      url: '/pages/allGoods/goodsCar/goodsCar',
    })
  },
  goOrderdetail(){
    wx.navigateTo({
      url: '/pages/order/orderDetail',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    let storeId = options.storeId
    let goodsId = options.goodsId
    $api.ajax(`/app/store/getGoodsInfo/${storeId}/${goodsId}`).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      } else {
        // console.log(res)
        if (parseFloat(res.data.originalPrice) == parseInt(res.data.originalPrice)) {
          var s = res.data.originalPrice.toString()
          res.data.originalPrice = s.concat('.00')
          res.data.presentPrice = s.concat('.00')
        } else {
          res.data.originalPrice.toFixed(2)
          res.data.presentPrice.toFixed(2)
        }
        this.setData({
          goodsDetails: res.data
        })
      }

    })
  },
})
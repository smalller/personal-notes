// pages/index/citys/citys.js
const $api = require('../../../utils/api')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys: [],
    city:'',//当前定位城市
    code:'',//当前定位code
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // 新版
    wx.showLoading({
      title: '加载中',
    })
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ',
          data: {},
          success:val=> {
            that.setData({
              code:val.data.result.ad_info.adcode,
              city:val.data.result.ad_info.city
            })
            wx.hideLoading()
          }
        })
      }
    })

    //旧版本
    // let address = wx.getStorageSync('address')
    // if(!address){
    //   this.setData({
    //     city:'获取定位'
    //   })
    // }else{
    //   this.setData({
    //     city:address.city
    //   })
    // }
    
    //热门城市
    $api.ajax('/app/homeRegion/regionList/1', 'get').then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      } else {
        this.setData({
          citys: res.data
        })
      }
    })
  },
  // 
  goIndex(e) {
    let address  = wx.getStorageSync('address')
    address.city = e.currentTarget.dataset.name.name
    address.adcode = e.currentTarget.dataset.name.cityCode
    wx.setStorageSync('address',address)
    wx.navigateBack({
      delta: 1
    })
    // this.positioning() 旧版本
  },
  positioning(){
    let address  = wx.getStorageSync('address')
    address.city = this.data.city
    address.adcode = this.data.code
    wx.setStorageSync('address',address)
    wx.navigateBack({
      delta: 1
    })
    return 
    // 旧版本
    wx.chooseLocation({
      success:(res)=>{
        wx.request({
          url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ',
          data: {},
          success:res=> {
              wx.setStorageSync('lat_lng', res.data.result.location.lat + ',' + res.data.result.location.lng)
              wx.setStorageSync('address', res.data.result.ad_info)
              this.setData({
                city:res.data.result.ad_info.city
              })
              this.setLatLng()
              wx.redirectTo({
                url:'../index'
              })
          }
        })
      }
    })
  },
  setLatLng(){
    let lat_lng = wx.getStorageSync('lat_lng');
    let lat,lon
    if(lat_lng){
      lat = lat_lng.split(',')[0]
      lon = lat_lng.split(',')[1]
    }else{
      lat = 0
      lon = 0
    }
    let data = {
      lat: lat,
	    lon: lon
    }
    $api.ajax('/app/user/userLocation', 'post', data)
  },
})
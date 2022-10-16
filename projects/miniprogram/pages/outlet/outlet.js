// pages/outlet/outlet.js
const app = getApp()
const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin:true,
    id:'',
    info:'',
    addUrl:`${$api.fileUrl}`,
    lySize: '', //排队等待桌数
    lyDuration: '', //排队预计等待时长
    vieSize: '', //抢座等待桌数
    vieDuration: '', //抢座预计等待时长
    isLy: false,//是否排队
    isVie: false,//是否抢座
    showModal: false, //遮罩层与弹窗的开关
    type:'',//3 代表ktv
    modalInfo: {
      txt: '', //弹窗中的标题
    },
    site: [{
        id: 1,
        title: '夜店'
      },
      {
        id: 3,
        title: 'ktv'
      },
    ],
    show:false,
    childComponent:{}
  },


  //打开弹窗与遮罩层
  showDialogFn(e) {
    let txt = e.target.dataset.txt;
    let modalInfoTxt = 'modalInfo.txt';
    this.setData({
      [modalInfoTxt]: txt,
      showModal: true
    })
  },

  //关闭弹窗与遮罩层
  closeModa() {
    this.setData({
      showModal: false
    })
  },

  //排队跳转
  goRowNum(e) {
    if(!this.data.info.isOpen){
      wx.showToast({
        title: '该门店还没有营业',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let title = e.currentTarget?e.currentTarget.dataset.title:e
    if(this.data.isLy){
      wx.navigateTo({
        url: `../grabSeat/grabSeat?id=${this.data.id}&title=${title}`,
      })
      return
    }
  
    wx.navigateTo({
      url: `/pages/amendGetails/amendGetails?title=${title}&id=${this.data.id}&type=${this.data.type}`,
    })
  },
  //抢座跳转
  goSeat(e) {
    if(!this.data.info.isOpen){
      wx.showToast({
        title: '该门店还没有营业',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let that = this
    let title = e.currentTarget?e.currentTarget.dataset.title:e
    if(this.data.isVie){
      if(this.data.info.isPaid == 1 && this.data.info.orderNo){
        wx.navigateTo({
          url: `../grabSeat/grabSeat?id=${this.data.id}&&title=${title}`,
        })
      }else if(!this.data.info.orderNo){
        wx.navigateTo({
          url: `/pages/amendGetails/amendGetails?title=${title}&&id=${this.data.id}&type=${this.data.type}`,
        })
      }else{
        if(this.data.info.isPaid == 0 && this.data.info.orderNo){
            // 抢座已生成订单 但是没有支付
            let component = {}
            component['orderNo'] = that.data.info.orderNo
            component['id'] = that.data.id
            this.setData({
                show:true,
                childComponent:component
            })
            return
          }
      }
      return
    }
    if(!this.data.info.canVie){
      wx.showToast({
        title: '今日已经有一次抢座了',
        icon:'none'
      })
      return
    }

    // 么有抢座订单
    wx.navigateTo({
      url: `/pages/amendGetails/amendGetails?title=${title}&&id=${this.data.id}&type=${this.data.type}`,
    })
  },

  cancel(e){
    this.setData({
      show:false
    })
  },
  confirm(e){
    this.setData({
      show:false,
    })
    wx.setStorageSync('useCart', false)    
    wx.navigateTo({
      url: `../pay/pay?orderId=${e.detail.data.orderNo}&&storeId=${e.detail.data.id}`,
    })         
  },
  //禁止屏幕滚动
  preventTouchMove: function () {},

  //获取排号信息
  getLyInfo(storeId) {
    $api.ajax(`/app/ly/lyIndex/${storeId}`, 'get').then(res => {
      if (res.code === 0) {
        let data = res.data;
        data.money = Number(data.money).toFixed(2)
        this.setData({
          lySize: data.lySize,
          lyDuration: data.lyDuration,
          vieSize: data.vieSize,  
          vieDuration: data.vieDuration,
          isLy: data.isLy,
          isVie: data.isVie,
          info:data
        })
      }
    })
  },

  getStoreDeatil(storeId){
    wx.showLoading({
      title: '加载中',
    })
    $api.ajax(`/app/store/getById/${storeId}`,'get').then(res=>{
      if(res.code!=0){
        wx.showToast({
          title: '网络错误',
          icon:'none'
        })
      }else{
        this.setData({
          details:res.data.storeInfo,
        })
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      type:options.type
    })
  },
  onShow:function(options){
    this.getLyInfo(this.data.id)
    this.getStoreDeatil(this.data.id)
    let userinfo = wx.getStorageSync('userinfo'),isLogin = ''
    userinfo?isLogin=true:isLogin=false
    this.setData({
      isLogin
    })
  },
  bindGetUserInfo(e){
    let type = e.currentTarget.dataset.type
    wx.showLoading({
      title: '正在登录',
    })
    unils.userLogin(e).then((res) => { 
      if(!res){
        return
      }
      this.setData({
        isLogin:true
      })
      if(type == 1){
        this.goRowNum('lineUp')
      }else{
        this.goSeat('getSeat')
      }
    }).catch((res) => { 
      wx.showToast({
        title: '登录失败，请重试',
        icon:'none',
        duration:2000
      })
    })
  },
})
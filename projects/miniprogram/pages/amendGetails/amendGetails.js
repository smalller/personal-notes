// pages/amendGetails/amendGetails.js
const app = getApp()
const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasPhone:true,
    id:'',
    seatCapacity: 1, //预计人数
    contactTel: '', //手机号码
    remarks: '', //备注
    seatType: 0, //座位需求
    Upflag: true, //排队抢座
    needs: [{
        id: 0,
        value: "无需求",
        name: "无需求",
        flag: true
      },
      {
        id: 1,
        value: "卡座",
        name: "卡座",
        flag: false
      },
      {
        id: 2,
        value: "散台",
        name: "散台",
        flag: false
      },
      {
        id: 3,
        value: "高脚凳",
        name: "高脚凳",
        flag: false
      },
    ],
    type:'',
    remake:[],
    ktv:'',

  },
  onShow(){
    let userinfo = wx.getStorageSync('userinfo').phone,hasPhone = ''
    userinfo?hasPhone=true:hasPhone=false
    this.setData({
      hasPhone
    })
  },
  getPhoneNumber(e){
    let type = e.currentTarget.dataset.type
    let title = e.currentTarget.dataset.title
    unils.userPhone(e).then((res) => { 
      if(!res){
        return
      }
      this.setData({
        hasPhone:true
      })
      if(type == 1){
        this.confirm(title)
      }else{
        this.choose(title)
      }
    }).catch((res) => { 
      wx.showToast({
        title: '授权失败',
        icon:'none',
        duration:2000
      })
    })
  },

  chenck(e) {
    // console.log(e.currentTarget.dataset.id)
    let ind = e.currentTarget.dataset.id
    this.data.needs.forEach(item => {
      item.flag = false
    })
    this.data.needs[ind].flag = !this.data.needs[ind].flag
    this.setData({
      seatType: this.data.needs[ind].id,
      needs: this.data.needs
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
      type: options.title,
      ktv:options.type
    })
    let getTitle = options.title;
    switch (getTitle) {
      case 'lineUp':
        this.setData({
          Upflag: this.data.Upflag
        })
        wx.setNavigationBarTitle({
          title: '排号',
        })
        break;
      case 'getSeat':
        this.setData({
          Upflag: !this.data.Upflag
        })
        wx.setNavigationBarTitle({
          title: '抢座',
        })
        break;
    }
    this.getRemake()
  },

  // 获取备注
  getRemake(){
    $api.ajax(`/app/ly/lyIndex/${this.data.id}`, 'get').then(res => {
      if (res.code === 0) {
        let data = res.data;
        if(this.data.Upflag){
          this.setData({
            remake:data.lyExplain.split(/[(\r\n)\r\n]+/)
          })
        }else{
          this.setData({
            remake:data.vieExplain.split(/[(\r\n)\r\n]+/)
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  //备注输入框双向绑定
  inputRemarks(e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  bindInput_p(e){
    this.setData({
      seatCapacity: e.detail.value
    })
  },
  bindInput_n(e){
    this.setData({
      contactTel: e.detail.value
    })
  },

  //取号请求
  lyRequest(title) {
    let info = this.data;
    if(info.seatCapacity<1 || info.seatCapacity == ''){
      wx.showToast({
        title: '预计人数不能小于1',
        icon: 'none',
        duration: 1500,
      })
      return
    }

    if(!(/(^0\d{2,3}\-\d{7,8}$)|(^1[3|4|5|6|7|8][0-9]{9}$)/.test(info.contactTel))){ 
      wx.showToast({
          title: '请输入标准格式手机号',
          icon:'none',
          duration:1500,
      })
      return
    } 

    let data = {
      storeId:info.id,
      seatCapacity: info.seatCapacity,
      seatType: info.seatType,
      contactTel: info.contactTel,
      remarks: info.remarks,
      queueSource : app.globalData.queueSource
    }
    let url = this.data.type == 'lineUp'?'/app/ly/save':'/app/viefor/save'
    $api.ajax(url, 'post', data).then(res => {
      if (res.code === 0) {
        if(this.data.type == 'lineUp'){
          wx.navigateTo({
            url: `/pages/grabSeat/grabSeat?title=${title}&&id=${this.data.id}`,
          })
        }else{
          wx.navigateTo({
            url: `/pages/allGoods/allGoods?storeId=${this.data.id}&&isVie=1`,
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //确认取号
  confirm(e) {
    let title = e.currentTarget?e.currentTarget.dataset.title:e
    this.lyRequest(title);
  },
  //抢座进入
  choose(e) {
    let title = e.currentTarget?e.currentTarget.dataset.title:e
    this.lyRequest(title)
  },
})
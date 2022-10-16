const $api = require('../../utils/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Upflag: true, //取号抢座
    cancelFlag: false,
    numInfo:"",
    isChoose:false,
    storeId:'',
    showGoodsList:false,
    addUrl: `${$api.fileUrl}`,
    waitTimer:null,
    waiting:'加载中...',
    show:false,
    childComponent:{},
    topText:'',
    mobile:'',
    pageTitle:'',
    backPage:'',
  },
  backIcon(){
    if(!this.data.backPage){
      wx.navigateBack({
        delta: 1
      })
    }else{
      // 为判断是什么店铺类型 传值type
      wx.navigateBack({
        delta: 3
      })
    }
  },
  continueGoods(){
    wx.navigateTo({
      url: `/pages/allGoods/allGoods?storeId=${this.data.storeId}&&isVie=1`
    })
  },
  switch1Change(e) {
    let notifyType = e.detail.value?1:2
    let title = notifyType == 1?'已开启':'已关闭'
    let id,url = '';
    if(this.data.Upflag){
      url = "/app/ly/updateNotify/"
      id = this.data.numInfo.lyId
    }else{
      url = "/app/viefor/updateNotify/"
      id = this.data.numInfo.id
    }
    $api.ajax(`${url}${id}/${notifyType}`,'get').then(res=>{
      if(res.code == 0){
        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
        this.setData({
          'numInfo.notifyType':this.data.numInfo.notifyType
        })
      }
    })
  },
  getSysInfo(){
    let info = wx.getMenuButtonBoundingClientRect()
    this.setData({
      mobile:info,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSysInfo()
    this.setData({
      storeId:options.id,
      backPage:options.type?options.type:''
    })
    let getTitle = options.title
    switch (getTitle) {
      case 'lineUp':
        this.setData({
          Upflag: this.data.Upflag
        })
        this.myNumeral(options.id)
        break;
      case 'getSeat':
        this.setData({
          Upflag: false
        })
        this.myGrab(options.id)
        break;
    }

    this.setData({
      pageTitle:this.data.Upflag?'我的排号':'我的抢座'
    })
    // wx.setNavigationBarTitle({
    //   title: this.data.Upflag?'我的排号':'我的抢座'
    // })
    // Upflag
  },
  // 排号信息
  myNumeral(id){
    $api.ajax(`/app/ly/lyInfo/${id}`,'get').then(res=>{
      if(res.code == 0){
        // res.data.expectedWaitingTime = this.timeFormat(res.data.expectedWaitingTime)
        res.data.businessReminder = res.data.businessReminder.split(/[(\r\n)\r\n]+/)
        res.data.waiting = Number(res.data.waiting)
        this.waitTimer = setInterval(()=>{
          let t = this.waitTimeFilter(res.data.waiting+=1)
          this.setData({
            waiting:t    
          })
        },1000)
        // res.data.waiting = this.waitTimeFilter(res.data.waiting)
        this.setData({
          numInfo:res.data
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 抢座信息
  myGrab(id){
    $api.ajax(`/app/viefor/info/${id}`,'get').then(res=>{
      if(res.code == 0){
        // res.data.expectedWaitingTime = this.timeFormat(res.data.expectedWaitingTime)
        res.data.businessReminder = res.data.businessReminder.split(/[(\r\n)\r\n]+/)
        res.data.waiting = Number(res.data.waiting)
          this.waitTimer = setInterval(()=>{
          let t = this.waitTimeFilter(res.data.waiting+=1)
          this.setData({
            waiting:t 
          })
        },1000)
        // res.data.waiting = this.waitTimeFilter(res.data.waiting) 
        this.setData({
          numInfo:res.data
        })
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  
  waitTimeFilter(time){
    let m,s
    m = parseInt(time/60) 
    s = time%60
    if(m<10){
      m = '0' + m
    }
    if(s<10){
      s = '0' + s
    }
    if(m == 'NaN' || s == 'NaN'){
      return '加载中...'
    }
    return m + '分钟' + s + '秒'
  },

  timeFormat(time){
    time = time.replace(/-/g, '/')
    let diff = new Date(time).getTime() - new Date().getTime()
    if(diff<=0){
      return '请耐心等待~'
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
    if(getHours<=0){
      return minutes + '分钟'
    }
    return getHours + '时' + minutes + '分'
  },

  cancel(e){
    this.setData({
      show:false
    })
  },
  confirm(e){
    $api.ajax(`/app/ly/cancelLy/${e.detail.data.id}`,'get').then(res=>{
      this.setData({
        show:false
      })
      if(res.code == 0){
        this.setData({
          cancelFlag: !this.data.cancelFlag,
        })
        clearInterval(this.waitTimer)
      }else{
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //取消排队
  cancelUp() {
    let component = {}
    component['id'] = this.data.numInfo.lyId
    this.setData({
        show:true,
        childComponent:component,
        topText:'确定取消排队？'
    })
  },
  // 联系商家
  relation(){
    let arr = this.data.numInfo.customerServicePhoneList
    let that = this
    wx.showActionSheet({
      itemList: arr,
      success (res) {
        $api.ajax(`/app/store/getSecretNo/${that.data.storeId}/${res.tapIndex}`,'get').then(val=>{
          wx.showModal({
            title: '虚拟号码拨打',
            content: val.data,
            success (res) {
              if (res.confirm) {
                wx.makePhoneCall({
                  phoneNumber:val.data
                })
              } else if (res.cancel) {
              }
            }
          })
        })
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  againGetNum(){
    // wx.redirectTo({
    //   url: '../outlet/outlet?id=' + this.data.storeId
    // })
    wx.navigateBack({
      delta: 2
    })
  },
  // 查看已买酒水
  lookGood(){ 
    this.setData({
      showGoodsList:!this.data.showGoodsList
    })
  },
  onHide(){
    clearInterval(this.waitTimer)
  }
})
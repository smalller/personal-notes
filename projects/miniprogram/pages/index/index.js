const app = getApp()
const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({
  data: {
    isLogin:true,
    hasPhone:true,
    scanShow:false,
    luckyId:'',
    // 以上  接受扫码  进入线下抽奖

    userInfo: {},
    hasUserInfo: false,
    mobile:{},
    banner_top:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    plate_btn:[
      {
        id:1,
        name:'夜店',
        introduce:'优惠提前订桌',
        img: '../../icon/yedian.png',
        h:'40',
        w:'60',
        url:'../list/list',
      },
      {
        id:2,
        name:'清吧',
        introduce:'特色酒水优惠',
        img: '../../icon/qingba.png',
        h:'62',
        w:'58',
        url:'../list/list',
      },
      {
        id:3,
        name:'KTV',
        introduce:'欢乐优惠欢唱',
        img: '../../icon/KTV.png',
        h:'60',
        w:'54',
        url:'../list/list',
      },
      {
        id:4,
        name:'AA拼单',
        introduce:'简单拼桌 发现新朋友',
        img: '../../icon/AApindan.png',
        h:'46',
        w:'48',
        url:'../appPage/index',
      },
    ],

    shuffList: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 4000,
    duration: 800,
    storeList: [],
    storeTotalPage: null,
    pageIndex: 1,
    pageSize: 6,
    exchangeCity: '成都市',
    addUrl: `${$api.fileUrl}`,
    addressInfo:'',
    openSet:false,
    active:0,
    pageClassify:[
      {
          type:0,
          label:'推荐'
      },
      {
        type:1,
        label:'活动'
      },
      {
          type:2,
          label:'音乐节'
      },
    ],

    classifySwiper:{
      indicatorDots: false,
      vertical: false,
      autoplay: false,
      duration: 800,
    },

    activeData:{
      pageIndex: 1,
      pageSize: 4,
      actibeTotalPage:null
    },
    btmArr:{
      storeList:[],
      music:[],
      actives:[],
    },
    btm_width:'',
    animateChange:false,
    topSticky:0,
    showDrawList:false,
    showDrawBall:false,
    ballLists:[],
    // 拖动悬浮球
    buttonTop: 240,
    buttonLeft: 0,
    windowHeight: '',
    windowWidth: '',
    startPoint:'',
    aniClass:false,
    directionL:false,
    directionT:false,
  },

  getModelInfo(){
    var that =this;
    wx.getSystemInfo({
      success: function (res) {

        // console.log(res);
        // // 屏幕宽度、高度
        // console.log('height=' + res.windowHeight);
        // console.log('width=' + res.windowWidth);
        // 高度,宽度 单位为px
        that.setData({
          windowHeight:  res.windowHeight,
          windowWidth:  res.windowWidth,
          // buttonLeft:res.windowWidth - 
        })
      }
    })
  },


  buttonStart: function (e) {
    this.data.startPoint = e.touches[0]
    this.setData({
      aniClass:false,
      startPoint:this.data.startPoint
    })
  },
  buttonMove: function (e) {
    this.closeDraw()
    var endPoint = e.touches[e.touches.length - 1]
    var translateX = endPoint.clientX - this.data.startPoint.clientX
    var translateY = endPoint.clientY - this.data.startPoint.clientY
    this.data.startPoint = endPoint
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    //判断是移动否超出屏幕
    if (buttonLeft+80 >= this.data.windowWidth){
      buttonLeft = this.data.windowWidth-80;
    }
    if (buttonLeft<=0){
      buttonLeft=0;
    }
    if (buttonTop<=0){
      buttonTop=0
    }
    if (buttonTop + 70 >= this.data.windowHeight){
      buttonTop = this.data.windowHeight-70;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft,
    })
  },
  buttonEnd: function (e) {
    let bodyW = this.data.windowWidth
    let bodyH = this.data.windowHeight
    let elL = e.currentTarget.offsetLeft
    let elT = e.currentTarget.offsetTop
    let query = wx.createSelectorQuery().in(this);
    query.select('.award_img').boundingClientRect(rect => {
      if( (bodyW - elL - rect.width/2) > bodyW/2 ){
        // 为过半 靠左
        this.setData({
          buttonLeft:0,
          aniClass:true,
        })
      }else{
        this.setData({
          buttonLeft:bodyW - rect.width,
          aniClass:true,
        })
      }
    }).exec(); 
  },

  //  悬浮球 
  drawLucky(){
    let user = wx.getStorageSync('userinfo')
    if(user){
      this.setData({
        scanShow:false,
      })
      wx.navigateTo({
        url: '../offlineLuckyDraw/offlineLuckyDraw?id='+ this.data.luckyId,
      })
    }
  },
  // 进入抽奖页面前的登录
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
      if(res.phone){
        // 跳转
        this.setData({
          scanShow:false,
          showDrawList:false
        })
        wx.navigateTo({
          url: '../offlineLuckyDraw/offlineLuckyDraw?id='+ this.data.luckyId,
        })
      }else{
        //  未拿到手机号
        this.setData({
          hasPhone:false
        })
      }
    }).catch((res) => { 
      wx.showToast({
        title: '登录失败，请重试',
        icon:'none',
        duration:2000
      })
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
              hasPhone:true,
              scanShow:false,
              showDrawList:false
            })
            let user = wx.getStorageSync('userinfo')
            user.phone = res.data.phone
            wx.setStorageSync('userinfo', user)
            wx.navigateTo({
              url: '../offlineLuckyDraw/offlineLuckyDraw?id='+ this.data.luckyId,
            })
          }
        })  
      }
    })
  },


  getIsDraw(){
    $api.ajax('/app/getJoinedLuckyDrawList', 'post').then(res => {
      if (res.code == 0) {
        if(res.data.length<1){
          this.setData({
            showDrawBall:false
          })
        }else{
          // this.data.windowHeight
          // this.data.windowWidth
          
          this.setData({
            showDrawBall:true,
            ballLists:res.data
          })
            let query = wx.createSelectorQuery()
            query.select('.award_img').boundingClientRect(rect => {
              this.setData({
                buttonLeft:this.data.windowWidth - rect.width
              })
            }).exec()
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
      }
    })
  },
  closeDraw(){
    this.setData({
      showDrawList:false
    })
  },
  awardEntrance(){
    let query = wx.createSelectorQuery().in(this);
    query.select('.award_img').boundingClientRect(rect => {
      if(rect.left == 0){
        this.setData({
          directionL:true
        })
      }else{
        this.setData({
          directionL:false
        })
      }
      if(rect.top > this.data.windowHeight/2){
        // 靠下
        this.setData({
          directionT:true
        })
      }else{
        this.setData({
          directionT:false
        })
      }
      this.setData({
        showDrawList:true
      })
    }).exec();  
  },
  offlineLucky(e){
    this.closeDraw()
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../offlineLuckyDraw/offlineLuckyDraw?id=' + id,
    })
  },
  goCitys() {
    wx.navigateTo({
      url: '/pages/index/citys/citys',
    })
  },
  //进入搜索
  goSearch() {
    wx.navigateTo({
      url: "../../pages/search/search"
    })
  },
  goStore(e){
    let data = e.currentTarget.dataset.data
    if(data.resource == 9){
      return
    }
    if(data.resource == 0){
      wx.navigateTo({
        url: `/pages/details/details?id=${data.storeId}`
      })
    }else if(data.resource == 1){
      wx.navigateTo({
        url: `/pages/actives/actInfo?id=${data.storeId}`
      })
    }else if(data.resource == 2){
      this.award()
    }else if(data.resource == 3){
      wx.navigateTo({
        url: `../level/level`,
      })
    }else if(data.resource == 4){
      wx.navigateTo({
        url: `../langPicture/langPicture?url=` + data.bannerInfo,
      })
    }
  },
  // 获取活动列表
  activeList(){
    let data = {
      pageNo: this.data.activeData.pageIndex,
	    pageSize: this.data.activeData.pageSize
    }
    $api.ajax('/app/active/appActiveList', 'post', data).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
        return
      }

      this.setData({
        'btmArr.actives':res.data.list,
        'activeData.actibeTotalPage':res.data.totalPage
      })
    })    
  },
  



  changeSwiper(e){
    this.setData({
      active:e.detail.current
    })
    this.leftPosi()
  },

  //推荐
  getRecommendeds() {
    let data = {
      cityCode: this.data.addressInfo.adcode || '510100',
      cityName: this.data.addressInfo.city || '成都市',
      pageNo: this.data.pageIndex,
      pageSize: this.data.pageSize
    }
    $api.ajax('/app/index/limitStoreRecommend', 'post', data).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
        return
      }
      this.setData({
        storeList: res.data.list,
        storeTotalPage: res.data.totalPage,
        'btmArr.storeList':res.data.list
      })
    })
  },
  shuffling() {
    $api.ajax('/app/rotation/rotationList', 'post').then(res => {
      if (res.code == 0) {
        this.setData({
          shuffList: res.data
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
      }
    })
  },

  goIndex(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      active:index,
    })
    this.leftPosi()
  },

  // 抖一抖
  next() {
    this.setData({
      animateChange:true
    })
    let ani = setTimeout(()=>{
      this.setData({
        animateChange:false
      })
      clearTimeout(ani)
    },1000)
    let active = this.data.active
    if(active == 0){
      let nowPage = this.data.pageIndex
      nowPage < this.data.storeTotalPage ? nowPage = nowPage + 1 : nowPage = 1
      this.setData({
        pageIndex: nowPage
      })
      this.getRecommendeds()
    }else if(active == 1){
      let nowPage = this.data.activeData.pageIndex
      nowPage < this.data.activeData.actibeTotalPage ? nowPage = nowPage + 1 : nowPage = 1
      this.setData({
        'activeData.pageIndex': nowPage
      })
      this.activeList()    
    }
  },
  getAdr(){
    
    wx.getSystemInfo({
      success(res) {
        if(res.platform == 'windows' || res.platform == 'devtools'){
          
        }else{
          var locationEnabled = res.locationEnabled;
          if(!locationEnabled){
            wx.showModal({
              title: '',
              content: '请开启手机GPS定位服务',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                }
              }
            })
          }
        }
      }
    })
  },
  // getDrawPicture(){
  //   $api.ajax('/app/getStoreImage?id='+ this.data.luckyId , 'get').then(res => {
  //     if (res.code != 0) {
  //       wx.showToast({
  //         title: res.msg,
  //         icon:'none',
  //         duration:2000,
  //       })
  //       return
  //     }
  //     this.setData({
  //       drwaPicture:res.data,
  //     })
  //   })
  // },
  onReady(){


  },

  onLoad: function (options) {
    // if(options.id){
    //   this.setData({
    //     luckyId:options.id,
    //     scanShow:true
    //   })
    //   this.getDrawPicture()
    // }
    this.getModelInfo()
    this.getAdr()
    wx.getUserProfile({
      desc:'获取微信昵称，地址，性别',
      success : res => {
        console.log(res)
      }
    })
    wx.showLoading({
      title: '',
      mask:true,
    })
    this.getSysInfo()
    this.getPosition()
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    })
    this.leftPosi()
    this.activeList()
    let query = wx.createSelectorQuery().in(this);
    query.select('.top_sticky').boundingClientRect(rect => {
      this.setData({
        topSticky:rect.height
      })
      wx.hideLoading()
    }).exec();  
  },

  onShow: function () {
    if(wx.getStorageSync('userinfo')){
      if(wx.getStorageSync('userinfo').phone){
        this.getIsDraw()
      }
    }
    this.getRecommendeds()
    this.shuffling()
    this.setData({
      exchangeCity: this.data.addressInfo.city,
      addressInfo:wx.getStorageSync('address')
    })

    if(this.data.luckyId){
      let userinfo = wx.getStorageSync('userinfo'),isLogin = '',hasPhone = ''
      userinfo?isLogin=true:isLogin=false
      if(userinfo){
        userinfo.phone?hasPhone=true:hasPhone=false
      }else{
        hasPhone=false
      }
      this.setData({
        isLogin,
        hasPhone
      })
    }
  },
  leftPosi(){
    let query = wx.createSelectorQuery();
    query.select('.active').boundingClientRect(rect => {
        this.setData({
          btm_width:rect.width
        })
    }).exec();
    query.select('.important').boundingClientRect(rect_on => {
        let left_width = (rect_on.left + ((rect_on.width - this.data.btm_width)/2))
        this.setData({
          left_width:left_width + 'px'
        })
    }).exec();
  },
  onHide(){
    this.setData({
      openSet:false,
    })    
  },

  setLatLng(){
    if(!wx.getStorageSync('userinfo')){
      return
    }
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

  getPosition(){
    wx.getSetting({
      success: res => {
        if(res.authSetting['scope.userLocation']){
          // 已经授权
          // wx.showToast({
          //   duration: 2000,
          //   icon: 'none',
          //   title: wx.getStorageSync('address') + wx.getStorageSync('lat_lng'),
          // })
          this.setLatLng()
          if(wx.getStorageSync('address') && wx.getStorageSync('lat_lng'))return
          this.getLocation()
        }else{
          // 没有授权
          wx.authorize({
            scope: 'scope.userLocation',
            success:res=> {
              wx.showToast({
                duration: 2000,
                icon: 'success',
                title: '授权成功',
              })
              this.getLocation()
            },
            fail:err=>{
              wx.showToast({
                duration: 2000,
                icon: 'none',
                title: '授权获取更好的体验',
              })
              wx.hideLoading()
            }
          })
        }
      },
      fail:err=>{
        wx.showToast({
          duration: 2000,
          icon: 'none',
          title: '授权获取更好的体验',
        })    
        wx.hideLoading()
      }
    }) 
  },

  getLocation(){
    wx.getLocation({
      type: 'wgs84',
      success:res=> {
 
        if (app.userInfoReadyCallback) {
          app.userInfoReadyCallback(res)
        }
        wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=UXBBZ-RELWI-JJXG2-5YBRI-XPWW3-D3FIJ',
            
            data: {},
            success:res=> {
              if (app.userInfoReadyCallback) {
                app.userInfoReadyCallback(res)
              }
              wx.setStorageSync('address', res.data.result.ad_info)
              wx.setStorageSync('lat_lng', res.data.result.location.lat + ',' + res.data.result.location.lng)
              wx.hideLoading()
              this.setLatLng()
            },
            fail:err=>{
              wx.showToast({
                duration: 2000,
                icon: 'none',
                title: '错误',
              })
              wx.hideLoading()
            },
        })
      }
    })
  },
  // 获取手机刘海屏高度
  getSysInfo(){
    let info = wx.getMenuButtonBoundingClientRect()
    this.setData({
      mobile:info,
    })
    let query = wx.createSelectorQuery();
    query.select('.header').boundingClientRect(rect => {
        this.setData({
          banner_top:rect.height + 'px'
        })
    }).exec();
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  music(){
    wx.navigateTo({
      url: '../appPage/index'
    })
  },
  actives(){
    wx.navigateTo({
      url: '/pages/actives/actives'
    })
  },
  award(){
    wx.navigateTo({
      url: '../lucky/lucky'
    })
  },
  // 顶部板块跳转
  plateList(e) {
    let data = e.currentTarget.dataset.data
    if(!wx.getStorageSync('lat_lng')){
      this.setData({
        openSet:true,
      })
    }else{
      // if(!wx.getStorageSync('address')){
      //   return
      // }
      if(data.id == 4){
        wx.navigateTo({
          url: data.url
        })
        return
      }
      wx.navigateTo({
        url:  `${data.url}?id=${data.id}`
      })
    }
  },
  storeInfo(e){
    if(!wx.getStorageSync('address')){
      this.setData({
        openSet:true,
      })
    }else{
      let storeId = e.currentTarget.dataset.id
      wx.navigateTo({
          url: `/pages/details/details?id=${storeId}`,
      })
    }
  },
  activeInfo(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../actives/actInfo?id=${id}`,
    })
  },

  //打开openSetting
  openSetting() {
    wx.openSetting()
  },
  // 打开openSetting回调
  callback(e){
    let res = e.detail.authSetting['scope.userLocation']
    if(res){
      // wx.showToast({
      //   duration: 2000,
      //   icon: 'none',
      //   title: '授权成功',
      // })   
      wx.showLoading({
        title: '授权中',
      })
      setTimeout(()=>{
        wx.hideLoading()
      },10000)
      // this.getLocation()
      this.getPosition()
    }else{
      wx.showToast({
        duration: 2000,
        icon: 'none',
        title: '授权失败',
      })    
      wx.hideLoading()
    }
    this.cancel()
  },
  // 关闭弹窗
  cancel(){
    this.setData({
      openSet:false,
    })
  },

})
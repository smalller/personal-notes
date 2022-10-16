const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({
  data: {
    canIUseGetUserProfile:false,//是否支持最新授权方式
    isLogin:true,
    hasPhone:true,
    scanShow:false,
    luckyId:'',
    drwaPicture:'',
    // 以上  接受扫码  进入线下抽奖
    index:1,
    details:[],
    banner:[],
    detailsPhone:[],
    goodsList:[],
    addUrl:`${$api.fileUrl}`,
    distance:'',
    first:'',
    showAllContent:false,
    storeType:'',//门店类型
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 800,
    showActionsheet: false,
    storeId:'',
    isShowGood:false,
    goodInfo:'',
    bigImg:[],//大图列表
    lookBigImg:false,
    imgIndex:0,
    leaveLogo:'',
  },
  closeScan(){
    this.setData({
      scanShow:false,
    })
  },
  drawLucky(){
    let user = wx.getStorageSync('userinfo')
    if(user){
      if(user.phone){
        this.setData({
          scanShow:false,
        })
        wx.navigateTo({
          url: '../offlineLuckyDraw/offlineLuckyDraw?id='+ this.data.luckyId,
        })
      }else{
        wx.showToast({
          title: '手机号授权失败',
          icon:'none',
          duration:2000
        })
        this.setData({
          hasPhone:false,
          isLogin:true
        })
      }
    }
  },
  getDrawPicture(){
    $api.ajax('/app/getStoreImage?id='+ this.data.luckyId , 'get').then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
        return
      }
      this.setData({
        drwaPicture:res.data,
      })
    })
  },
  getUserProfileScan(){
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (result) => {
        unils.userLogin(result).then((res) => { 
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
              // showDrawList:false
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
      }
    })
  },
  // 进入抽奖页面前的登录
  bindGetUserInfoScan(e){
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
          // showDrawList:false
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
  getPhoneNumberScan(e){
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
              // showDrawList:false
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

  // 以上 扫码抽奖

  onShow(){
    this.isLoginFun()
  },
  // 是否登录判断
  isLoginFun(){
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
    }else{
      let userinfo = wx.getStorageSync('userinfo'),isLogin = ''
      userinfo?isLogin=true:isLogin=false
      this.setData({
        isLogin
      })
    }
  },

   // 最新授权登录
   getUserProfile(e){
    let type = e.currentTarget.dataset.type
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (result) => {
        console.log(result)
        unils.userLogin(result).then((res) => { 
          if(!res){
            return
          }
          this.setData({
            isLogin:true
          })
          if(type == 1){
            // 购买会员卡
            this.buyVip()
          }else if(type == 2){
            // 推荐商品
            this.goGoods()
          }else if(type == 3){
            // 评论点赞
            this.isLike()
          }
        }).catch((res) => { 
          wx.showToast({
            title: '登录失败，请重试',
            icon:'none',
            duration:2000
          })
        })
      }
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
        // 购买会员卡
        this.buyVip()
      }else if(type == 2){
        // 推荐商品
        this.goGoods()
      }else if(type == 3){
        // 评论点赞
        this.isLike()
      }
    }).catch((res) => { 
      wx.showToast({
        title: '登录失败，请重试',
        icon:'none',
        duration:2000
      })
    })
  },
  onShareAppMessage(e){
    let info = this.data.details
    return {
      title : info.name,
      path : '/pages/details/details?id=' + info.storeId,
      imageUrl : this.data.addUrl + info.logo
    }
  },
  changeSwiper(e){
    let VideoContext = wx.createVideoContext('myVideo', this)
    VideoContext.pause()
  },
  endVideo(){
    this.setData({
      autoplay:true
    })
  },
  playVideo(){
    this.setData({
      autoplay:false
    })
  },
  // 打开地图
  openMap(){
    let latitude = +this.data.details.lonlat.split(',')[0]
    let longitude = +this.data.details.lonlat.split(',')[1]
    wx.openLocation({
      latitude,
      longitude,
      scale: 18,
      name:this.data.details.trustAddress,
      address:this.data.details.trustAddress,
    })
  },
  // 前往购买会员卡
  buyVip(){
    wx.navigateTo({
      url: '../clubCard/clubCard?type=0&storeId='+ this.data.storeId,
    })
  },
  call(e){
    let that = this
    wx.showActionSheet({
      itemList: this.data.detailsPhone,
      success (res) {
        wx.showLoading({
          title: '加载中...',
        })
        $api.ajax(`/app/store/getSecretNo/${that.data.storeId}/${res.tapIndex}`,'get').then(val=>{
          wx.hideLoading()
          if(val.code != 0){
            wx.showToast({
              duration: 20000,
              icon: 'none',
              title: val.msg,
            })
            return
          }
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
  showAll(){
    this.setData({
      showAllContent:!showAllContent
    })
  },
  ftrGo(e){
    let type = e.currentTarget.dataset.type
    if(type == 2){
      wx.showToast({
        title: '商家暂未开通此功能',
        icon:'none',
        duration:2000
      })
      return
    }
    
    if(type == 3){
      wx.navigateTo({
        url: '../appPage/index'
      })
      return
    }

    let id =  this.data.details.storeId

    // 判断店家类型  1 夜店  2清吧  3 ktv
    if(this.data.storeType == 1 || this.data.storeType == 2){
      let url = type==1?'../makeTable/index':'../outlet/outlet'
      wx.navigateTo({
        url: url + '?id=' + id,
      })
    }else{
      let url = type==1?'../ktv/ktv':'../outlet/outlet'
      wx.navigateTo({
        url: `${url}?id=${id}&type=3`,
      })
    }
  },
  check(ind){
    this.setData({
      index:ind.currentTarget.dataset.index
    })
  },
  collect(){
    if(this.data.details.userCollectionFlag){
      //已收藏  调用取消接口
      $api.ajax(`/app/user/cancelCollection/${this.data.details.storeId}`,'get').then(res=>{
        if(res.code == 0){
          wx.showToast({
            title: '取消收藏成功',
            icon:'none',
            duration:1500
          })  
          this.setData({
            'details.userCollectionFlag' : !this.data.details.userCollectionFlag
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none',
            duration:1500
          })    
        }
      })
    }else{
      $api.ajax(`/app/user/collectionStore/${this.data.details.storeId}`,'get').then(res=>{
        if(res.code == 0){
          wx.showToast({
            title: '收藏成功',
            icon:'none',
            duration:1500
          })  
          this.setData({
            'details.userCollectionFlag' : !this.data.details.userCollectionFlag
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none',
            duration:1500
          })
        }
      })
    }
  },
  //全部评价
  goEvaluation(){
    wx.navigateTo({
      url: '/pages/details/evaluation/evaluation?id=' + this.data.storeId,
    })
  },
  //跳转
  goGoods(e){
    wx.navigateTo({
      url: `/pages/allGoods/allGoods?storeId=${this.data.storeId}&isPay=false`,
    })
  },
  // 查看商品
  lookGoods(e){
    let data = e.currentTarget.dataset.data
    this.setData({
      goodInfo:data,
      isShowGood:true
    })
    
  },
  closeGood(){
    this.setData({
      isShowGood: !this.data.isShowGood
    })
  },
  onClick(event) {
    if(event.detail.index==0){
      wx.navigateTo({
        url: '/pages/makeTable/index',
      })
    }
  },
  //商品详情
  goGoodsDetails(e){
    var goodsId=e.currentTarget.dataset.goodsid
    var storeId = e.currentTarget.dataset.storeid
    wx.navigateTo({
      url: `/pages/allGoods/goodsDetails/goodsDetails?storeId=${storeId}&goodsId=${goodsId}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  getQueryString(name) { 
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.search.substr(1).match(reg); 
    if (r != null) return unescape(r[2]); 
    return null; 
  },
  onLoad: function (options) {
    // let a = 'https://apptest.cdhqht.com/toStorePage?id=1326429169626079233&luckyDrawId=1383296869639528449'
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    let a =  decodeURIComponent(options.q)
    if(options.id){
      this.setData({
        storeId:options.id
      })
      this.getStoreInfo(options.id)
      this.firstEvaluation(options.id)
    }else{
      let index = a.indexOf('?')
      let b = a.substr(index+1)
      let c = b.split('&')
      let store_id = '',lucky_id=''
      store_id = c[0].substr(3)
      lucky_id = c[1].substr(12)
      // store_id = '1329624735638061058'
      // lucky_id = '1401144192700256257'
      this.setData({
        storeId:store_id,
        luckyId:lucky_id,
        scanShow:true
      })

      this.getDrawPicture()
      this.getStoreInfo(store_id)
      this.firstEvaluation(store_id)

      $api.ajax(`/app/isLogin`,'get').then(res=>{
        if(res.code != 0){
          return
        }
        if(res.data.code == 0){
          // 未登录
          wx.login({
            success: res => {
              wx.setStorageSync('code', res.code)
              wx.removeStorageSync('userinfo')
              wx.removeStorageSync('ktv_info')
              wx.removeStorageSync('payInfo')
              wx.removeStorageSync('useCart')
              wx.removeStorageSync('selectKtvId')
              wx.removeStorageSync('coupons')
              wx.removeStorageSync('pay_timer')
              setTimeout(()=>{
                this.isLoginFun()
              },100)
            }
          })
        }
      })   
      
    }
  },

  // 商家访问量
  // traffic(storeId){
    // $api.ajax(`/app/store/visit/${storeId}`,'get')
  // },

  // 第一条评价
  firstEvaluation(id){
    let data = {
      labels:'2',
      pageNo:1,
      pageSize:1,
      storeId:id,
    }
    $api.ajax(`/app/appraise/appAppraiseLimit`,'post',data).then(res=>{
      if(res.data.total>0){
        let lv = res.data.list[0].wealthLevel
        let leave = ''
        if(lv>=0 && lv<5){
          leave = '../../icon/lv_1.png'
        }else if(lv>=5 && lv<10){
          leave = '../../icon/lv_2.png'
        }else if(lv>=10 && lv<15){
          leave = '../../icon/lv_3.png'
        }else if(lv>=15 && lv<20){
          leave = '../../icon/lv_4.png'  
        }else if(lv>=20 && lv<25){
          leave = '../../icon/lv_5.png'
        }else if(lv>=25 && lv<30){
          leave = '../../icon/lv_6.png'
        }else if(lv>=30 && lv<35){
          leave = '../../icon/lv_7.png'
        }else if(lv>=35 && lv<40){
          leave = '../../icon/lv_8.png'
        }else if(lv>=40 && lv<45){
          leave = '../../icon/lv_9.png'
        }else if(lv>=45 && lv<50){
          leave = '../../icon/lv_10.png'
        }else if(lv>=50 && lv<55){
          leave = '../../icon/lv_11.png'
        }else if(lv>=55 && lv<60){
          leave = '../../icon/lv_12.png'
        }else if(lv>=60 && lv<65){
          leave = '../../icon/lv_13.png'
        }else if(lv>=65 && lv<70){
          leave = '../../icon/lv_14.png'
        }else if(lv>=70 && lv<75){
          leave = '../../icon/lv_15.png'
        }else if(lv>=75 && lv<80){
          leave = '../../icon/lv_16.png'
        }else if(lv>=80){
          leave = '../../icon/lv_17.png'
        }

        res.data.list[0].starWidth = res.data.list[0].appraiseLevel * 2 * 10 + '%'
        res.data.list[0].createTime = res.data.list[0].createTime.substr(0,10)
        this.setData({
          first:res.data.list[0],
          allEva:res.data.total,
          leaveLogo:leave,
        })
      }else{
        this.setData({
          first:'',
          allEva:0
        })
      }
    })
  },

  // 商家详情
  getStoreInfo(id){
    wx.showLoading({
      title: '加载中',
    })
    $api.ajax(`/app/store/getById/${id}`,'get').then(res=>{
      if(res.code!=0){
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
      }else{
        res.data.storeInfo.starWidth = res.data.storeInfo.score * 2 * 10 + '%'
        res.data.storeInfo.score = Number(res.data.storeInfo.score).toFixed(1)
        this.setData({
          storeType : res.data.storeInfo.storeLocation
        })
        res.data.storeInfo.picture = res.data.storeInfo.picture.split(',')
        let arr=[]
        res.data.storeInfo.picture.forEach(v=>{
          let sbj = {}
          if(v.substr(-3) == 'mp4'){
            sbj['isImg'] = false
            sbj['url'] = v
          }else{
            sbj['isImg'] = true
            sbj['url'] = v
          }
          arr.push(sbj)
        })
        res.data.recommendGoodsList.forEach(v=>{
          v.originalPrice = Number(v.originalPrice).toFixed(2)
          v.presentPrice = Number(v.presentPrice).toFixed(2)
        })  
        this.setData({
          details:res.data.storeInfo,
          detailsPhone:res.data.storeInfo.customerServicePhoneList,
          goodsList:res.data.recommendGoodsList,
          banner:arr
        })
        this.getAddress()
        wx.hideLoading()
      }
    })
  },

  // 获取当前定位
  getAddress(){
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        let destination = that.data.details.lonlat
        let arr = destination.split(',')
        let destination_new = that.getDistance(res.latitude,res.longitude,arr[0],arr[1])
        that.setData({
          distance:destination_new
        })
      }
    })
  },
  isLike(){
    let data = {
      "appraiseId": this.data.first.id,
      "appraiseUserId": this.data.first.userId,
    }
    $api.ajax(`/app/appraise/fabulous`,'post',data).then(res=>{
      if(res.code!=0){
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
      }else{
        if(this.data.first.fabulousType == 1){
          // 已点赞
          this.data.first.fabulous--
          this.setData({
            ['first.fabulous'] :  this.data.first.fabulous,
            ['first.fabulousType'] :0,
          })
        }else{
          this.data.first.fabulous++
          this.setData({
            ['first.fabulous'] :this.data.first.fabulous,
            ['first.fabulousType'] :1,
          })
        }
      }
    })    
  },
  // 计算距离函数
  Rad(d) {
    return d * Math.PI / 180.0;
  },
  getDistance(lat1, lng1, lat2, lng2) {
    // lat1用户的纬度
    // lng1用户的经度
    // lat2商家的纬度
    // lng2商家的经度
    var radLat1 = this.Rad(lat1);
    var radLat2 = this.Rad(lat2);
    var a = radLat1 - radLat2;
    var b = this.Rad(lng1) - this.Rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;
    s = Math.round(s * 10000) / 10000;
    s = s.toFixed(1) + 'km' //保留两位小数
    return s
  },
  toggleBigImg(){
    this.setData({
      lookBigImg : !this.data.lookBigImg
    })
  },
  showBigImg(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      bigImg : this.data.first.appraisePictureList,
      imgIndex : index
    })
    this.toggleBigImg()
  },

})
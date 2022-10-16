const app = getApp()
const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile:false,//是否支持最新授权方式
    loginFlag:true,//是否登录
    openPhone:false,
    hasPhone:false, //默认无号码
    info:{},
    head_portrait:'../../images/weidenlu.png',
    username:'',
    code:'',
    mobile:{},
    orderBtn:[
      {
        id:0,
        text:'全部订单',
        icon:'../../icon/quanbu.png',
        h:'42',
        w:'42',
      },
      {
        id:2,
        text:'待付款',
        icon:'../../icon/daifukuan.png',
        h:'48',
        w:'48',
      },
      {
        id:1,
        text:'待使用',
        icon:'../../icon/daishiyong.png',
        h:'50',
        w:'50',
      },
      {
        id:3,
        text:'已完成',
        icon:'../../icon/yiwanchen.png',
        h:'50',
        w:'48',
      },
      {
        id:4,
        text:'已作废',
        icon:'../../icon/yizuofei.png',
        h:'50',
        w:'38',
      },
    ],
    serviceBtn:[
      {
        id:5,
        text:'好友列表',
        icon:'../../icon/haoyou.png',
        h:'40',
        w:'40',
      },
      {
        id:1,
        text:'会员卡',
        icon:'../../icon/huiyuanka.png',
        h:'40',
        w:'44',
      },
      {
        id:2,
        text:'优惠券',
        icon:'../../icon/youhuiquan.png',
        h:'32',
        w:'44',
      },
      {
        id:3,
        text:'用户协议',
        icon:'../../icon/xieyi.png',
        h:'36',
        w:'36',
      },
      {
        id:4,
        text:'关于我们',
        icon:'../../icon/guanyu.png',
        h:'38',
        w:'38',
      },
      {
        id:5,
        text:'商家入驻',
        icon:'../../icon/shangjiaruzhu.png',
        h:'38',
        w:'40',
      },
      {
        id:5,
        text:'认证',
        icon:'../../icon/renzheng.png',
        h:'42',
        w:'36',
      },
      {
        id:6,
        text:'客服',
        icon:'../../icon/kefu.png',
        h:'40',
        w:'40',
      },
      {
        id:7,
        text:'存酒',
        icon:'../../icon/save_wine.png',
        h:'46',
        w:'44',
      },
      // {
      //   id:8,
      //   text:'邀请码',
      //   icon:'../../icon/invite_code.png',
      //   h:'40',
      //   w:'40',
      // }
    ],
    addUrl: $api.fileUrl,
    backgroundPortrait:'',
    leaveLogo:'',
    invitationCode:false,
    InvCode:''
    // addUrl: `${$api.fileUrl}shangzuo-dev/20201027/x7hruvpvwep5zew3wjnf.png`,
  },
  // 最新授权登录
  getUserProfile(e){
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: (result) => {
        unils.userLogin(result).then((res) => { 
          if(!res){
            return
          }
          this.getUser()
          if(!wx.getStorageSync('userinfo').phone){
            this.setData({
              openPhone:true,
              hasPhone:false
            })
            return
          }else{
            this.setData({
              hasPhone:true
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
  //授权
  bindGetUserInfo(e){
    var userinfo = e.detail.userInfo
    let lat_lng = wx.getStorageSync('lat_lng');
    let lat,lon
    if(lat_lng){
      lat = lat_lng.split(',')[0]
      lon = lat_lng.split(',')[1]
    }else{
      lat = 0
      lon = 0
    }
    let lat_lon = {
      lat: lat,
	    lon: lon
    }
    if(userinfo){
      wx.showLoading({
        title: '加载中',
      })
      let data = {
        code:wx.getStorageSync('code'),
        iv:e.detail.iv,
        encryptedData:e.detail.encryptedData,
        avatar:userinfo.avatarUrl,
        nickName:userinfo.nickName,
        lat:lat,
        lon:lon,
      }
      $api.ajax('/app/wx/login','post',data).then(item=>{
        if(item.code == 0){
          // this.setData({
            //   head_portrait:$api.fileUrl + item.data.avatar,
            //   loginFlag:false,
            //   username:item.data.nickName,
            // })
            wx.setStorageSync('userinfo', item.data)
            this.getUser()
            
            $api.ajax('/app/user/userLocation', 'post', lat_lon)
            if(!wx.getStorageSync('userinfo').phone){
              this.setData({
                openPhone:true,
                hasPhone:false
              })
              return
            }else{
              this.setData({
                hasPhone:true
              })
            }
            
        }else{
          wx.showToast({
            title: item.msg,
            icon:'none',
            duration:2000
          })
          wx.login({
            success: res => {
              wx.setStorageSync('code', res.code)
            }
          })
        }
        wx.hideLoading()
      })
    }else{
      wx.showToast({
        title: '登录有更好的体验',
        icon:'none'
      })
    }
  },
  backBeforePage(){
    return
    if(!wx.getStorageSync('currPage')){
      return
    }
    let currPage = wx.getStorageSync('currPage');
    let a =  JSON.stringify(currPage.options),route = currPage.route;
    console.log(route)
    let b = a.split('"');
    let url = '',c=[];
    if(b.length > 3){
      b.forEach((v,i)=>{
        if(i%2 != 0){
          c.push(v)
        }
      })
  
      c.forEach((v,i)=>{
        if(i%2 == 0){
          if(url.indexOf("?") != -1){
            url += '&' + v
          }else{
            url += '?' + v
          }
        }else{
          url += '=' + v
        }
      })    
    }
    
    wx.navigateTo({
      url: `/${route}${url}`,
    })
  },


  orderList(e){
    // let userinfo = wx.getStorageSync('userinfo')
    
    // if(!userinfo){
    //   wx.showToast({
    //     title: '请先登录',
    //     icon:'none'
    //   })
    //   return
    // }
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../order/order?id=${id}`,
    })
  },
  appTips(){
    wx.showToast({
      title: '请下载app查看',
      icon: 'none',
      duration: 2000
    })
  },
  levelInfo(){
    wx.navigateTo({
      url: `../level/level`,
    })
  },
  onShow(){
    // hasPhone
    if(wx.getStorageSync('userinfo').phone){
      this.setData({
        hasPhone:true
      })
    }else{
      this.setData({
        hasPhone:false
      })
    }
    this.getUser()
  },
  onLoad: function (options) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ffffff'
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    
    this.getSysInfo()
  },
  // 获取手机刘海屏高度
  getSysInfo(){
    let info = wx.getMenuButtonBoundingClientRect()
    this.setData({
      mobile:info,
    })
  },
  // 获取用户信息
  getUser(){
    if(!wx.getStorageSync('userinfo')){
      this.data.orderBtn.forEach(v=>{
        v.num = 0
      })
      this.setData({
        loginFlag:true,
        info:{},
        username:'',
        head_portrait:'../../images/weidenlu.png',
        backgroundPortrait:'default/background/0.png',
        orderBtn:this.data.orderBtn
      })
      wx.hideLoading()
      return
    }
    $api.ajax('/app/user/getUserInfo','get').then(res=>{
      if(res.code == 0){
        let picture = res.data.headPortrait?res.data.headPortrait:res.data.avatar
        let backgroundPicture = res.data.backgroundPlate?res.data.backgroundPlate:'default/background/0.png'
        res.data.wealthLevel = +res.data.wealthLevel
        let lv = res.data.wealthLevel
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
        res.data.orderUserCountDTOS.forEach(v=>{
          this.data.orderBtn.forEach(j=>{
            if(v.status == j.id){
              j['num'] = v.count      
            }
          })
        })
        let query = wx.createSelectorQuery();
        query.select('.all_w').boundingClientRect(rect => {
          res.data.levelRate = (rect.width * (+res.data.levelRate/100)) + 'px'
          this.setData({
            head_portrait:$api.fileUrl + picture,
            backgroundPortrait:backgroundPicture,
            loginFlag:false,
            username:res.data.name,
            info:res.data,
            leaveLogo:leave,
            orderBtn:this.data.orderBtn
          })
        }).exec();  
        wx.hideLoading()
        // wx.setStorageSync('userinfo', res.data)
      }else{
        wx.removeStorageSync('userinfo')
        wx.login({
          success: res => {
            wx.setStorageSync('code', res.code)
            this.getUser()
          }
        })
        this.setData({
          loginFlag:true
        })
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    }).catch(err=>{
      console.log(err,'err')
    })
  },
  // 关闭弹窗
  cancel(){
    this.setData({
      openPhone:false,
    })
  },
  // 获取手机号码
  getPhoneNumber(e){
    this.setData({
      openPhone:false
    })
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code)
        let code = wx.getStorageSync('code')
        let data = {
          iv:e.detail.iv,
          encryptedData:e.detail.encryptedData,
          code:code
        }
        $api.ajax('/app/wx/bindPhone','post',data).then(res=>{
          if(res.code == 0){
            let tel = wx.getStorageSync('userinfo')
            tel.phone = res.data.phone
            wx.setStorageSync('userinfo', tel)
            this.setData({
              hasPhone:true
            })
          }else{
            // this.cancel()
            wx.showToast({
              title: '授权失败',
              icon:'none'
            })
          }
        })  
      }
    })
  },

  goWhere(e){
    let url =  ''
    switch(e.currentTarget.dataset.id){
      case 1:
        url = '/pages/clubCard/clubCard'
        break
      case 2:
        url = '/pages/coupons/coupons'
        break
      case 3:
        url='/pages/my/agreement'
        break
      case 4:
        url = './about'
        break
      case 5:
        url = '/components/openApp/index'
        break
      case 6:
        wx.makePhoneCall({
          phoneNumber:'4000007226'
        })
        // let arr = []
        // $api.ajax('/app/im/getSystemId','get').then(res=>{
        //   if(res.code == 0){
        //     wx.makePhoneCall({
        //       phoneNumber:res.data.phone
        //     })
        //   }else{
        //     wx.showToast({
        //       title: res.msg,
        //       icon:'none'
        //     })
        //   }
        // })
        break
      case 7:
        url = '/pages/saveWine/saveWine' 
        break
      case 8:
        if(this.data.loginFlag){
          wx.showToast({
            title: '请先登录',
            icon: 'none',
            duration: 2000
          })
          return
        }
        if(!this.data.hasPhone){
          return
        }
        this.setData({
          invitationCode:true
        })
        break
    }
    if(e.currentTarget.dataset.id != 6 && e.currentTarget.dataset.id != 8){
      wx.navigateTo({
        url: url
      })
    }
  },
  //设置
  goPersonSet(){
    wx.navigateTo({
      url: '/pages/personSet/personSet',
    })
  },
  onHide(){
    wx.removeStorageSync('currPage')
  },


  cancelCode(){
    this.setData({
      InvCode:'',
      invitationCode:false
    })
  },

  submitCode(){
    $api.ajax(`/app/userInsertInvitationCode?code=${this.data.InvCode}`,'get').then(res=>{
      if(res.code == 0){
        wx.showToast({
          title: '绑定成功',
          icon:'none'
        })
        this.cancelCode()
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
})
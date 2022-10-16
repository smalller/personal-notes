const $api = require('../../utils/api');
const { phoneHide } = require('../../utils/util');
const unils = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    canIUseGetUserProfile:false,//是否支持最新授权方式
    isLogin:true,
    x:40,
    y:40,
    curMonth:1,//当前月份
    curDay:1,
    curWeekText:"",
    addUrl:`${$api.fileUrl}`,
    timeDate:'',//顶部选择时间  年月日
    weekArr:[],//顶部展示日期
    layoutState:true,//布局图展示状态
    pay:true,//支付方式弹窗
    // isShowBookedAlert:false,
    isShowSelType:false,
    isShowGoStore:false,
    scaleMin:0.5,
    scaleMax:10,
    scaleNum:1,
    touchStartTime:0,
    touchEndTime:0,
    lastTapTime:0,
    selBookType:[{
      index:0,
      isSel:false
    },
    {
      index:1,
      isSel:false
    },
    {
      index:2,
      isSel:false
    },
    {
      index:3,
      isSel:true
    }],
    selAlcoholType:[{
      index:0,
      isSel:false
    },
    {
      index:1,
      isSel:false
    }],
    coordinate1:[],
    preItem:'',//记录上一个点击座位
    nowSeat:'',//当前座位信息
    isHideSeatDetail:true,
    storeTips:'',//展示门店基本信息
    wutai:{
      sx:'',
      sy:'',
      lx:'',
      ly:'',
      h:'',
      w:'',
    },
    wutaiBoxTop:'',
    floors:[],
    floorAct:0,
    sessionType:0,
    readState:false,
    show:false,
    showPopupText:'',
    screenList:[],
    makeTableBoxHeight:'',
    showScreenState:false,
    changeType:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      storeId:options.id,
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  onShow(){
    this.getCurMonthDay();
    this.getDaysWeek();
    let userinfo = wx.getStorageSync('userinfo'),isLogin = ''
    userinfo?isLogin=true:isLogin=false
    this.setData({
      isLogin
    })
  },
  closePopup(){
    // console.log(this.data.screenList)
    this.data.timeDate = this.data.timeDate.replace(/-/g, '/')
    let dayIndex = new Date(this.data.timeDate).getDay() 
    this.setData({
      showScreenState:false,
      changeType:false
    })
    this.getStoreInfo(dayIndex)
  },
  showScreen(){
    let query = wx.createSelectorQuery();
      query.select('.makeTable-box').boundingClientRect();
      query.exec(rect => {
        let e = rect[0];
        this.setData({
          makeTableBoxHeight: e.height,
          showScreenState:true
        })
      })
  },
  checkedPeople(e){
    let data = e.currentTarget.dataset.data
    if(data.text == '不限'){
      this.data.screenList.forEach((v,i)=>{
        if(v.text == '不限'){
          v['checked'] = true
        }else{
          v['checked'] = false
        }
      })
    }else{
      this.data.screenList[0].checked = false
      let index = e.currentTarget.dataset.index
      let choose = `screenList[${index}].checked`
      this.setData({
        [choose]:this.data.screenList[index].checked?false:true,
      })
    }
    this.setData({
      screenList:this.data.screenList
    })
  },
  // 选取楼层
  cutFloor(e){
    let data = e.currentTarget.dataset.data
    let index = e.currentTarget.dataset.index
    this.data.timeDate = this.data.timeDate.replace(/-/g, '/')
    let dayIndex = new Date(this.data.timeDate).getDay() 
    this.setData({
      floorAct:index,
      changeType:true
    })
    this.getStoreInfo(dayIndex)
  },

  readed(){
    this.setData({
      readState:!this.data.readState
    })
  },

  // 选取场次
  session(e){
    let data = e.currentTarget.dataset.data
    this.data.timeDate = this.data.timeDate.replace(/-/g, '/')
    let dayIndex = new Date(this.data.timeDate).getDay() 
    let index = e.currentTarget.dataset.index
    if(data.option == 1){
      wx.showToast({
        title: '当前场次暂不可选取',
        icon:'none',
        duration:2000,
      })
    }else{
      this.data.storeTips.storeFields.forEach((v,i)=>{
        if(index == i){
          v.isSelected = 1
          this.setData({
            sessionType:v.field
          })
        }else{
          v.isSelected = 0
        }
      })
      this.setData({
        ['storeTips.storeFields']:this.data.storeTips.storeFields,
      })
      this.getStoreInfo(dayIndex)
    }
  },

  getStoreInfo(day){
    let numbers = []
    this.data.screenList.forEach(v=>{
      if(v.checked){
        numbers.push(v.text)
      }
    })
    let weekIndex = null
    day == 0 ? weekIndex = 7 : weekIndex = day
    wx.showLoading({
      title: '加载中...',
    })
    let data = {
      floor:  this.data.floors.length>0 ? this.data.floors[this.data.floorAct].floor : '',
      orderType: 0,
      storeId: this.data.storeId,
      weekIndex: weekIndex,
      field:this.data.sessionType,
      numbers,
    }
    $api.ajax(`/app/store/storeSeatLayout`, 'post',data).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
        return
      }

      res.data.tableReservationNotes = res.data.tableReservationNotes.split(/[(\r\n)\r\n]+/)
      res.data.storeFieldsDTOS.forEach((v,i)=>{
        if(v.isSelected == 1){
          this.setData({
            sessionType : v.field
          })
        }
      })

      let newStr = '',newStr_one = ''
      let orderHintSecond = res.data.orderHintSecond
      res.data.orderHintColors.forEach(v=>{
        if(orderHintSecond.indexOf(v) != -1){
          newStr = orderHintSecond.replace(v,`<p class="imp_tips">${v}</p>`)
          orderHintSecond = newStr
        }
      })
      newStr = newStr.replace(newStr,`<div>${newStr}</div>`)

      let orderHint = res.data.orderHint
      res.data.orderHintColors.forEach(v=>{
        if(orderHint.indexOf(v) != -1){
          newStr_one = orderHint.replace(v,`<p class="imp_tips">${v}</p>`)
          orderHint = newStr_one
        }
      })
      if(this.data.changeType){
        let crr = []
        res.data.numberOfPeoples.forEach(v=>{
          let table = new Object()
          table['text'] = v
          table['checked']=false
          crr.push(table)
        })
        this.setData({
          screenList:crr
        })
      }

      newStr_one = newStr_one.replace(newStr_one,`<div>${newStr_one}</div>`)

      let storeTips = {
        layoutPicture:res.data.layoutPicture,
        minPrice:Number(res.data.minPrice).toFixed(2),    
        perCapitaConsumption:res.data.perCapitaConsumption,    
        tableReservationNotes:res.data.tableReservationNotes,    
        storeFields:res.data.storeFieldsDTOS,
        orderHint:newStr_one,
        orderHintSecond:newStr
      }
      let arr = res.data.storeSeatList
      var theOneIndex = null
      for(let i=0;i<arr.length;i++){
        if(arr[i].seatType == 4){
          arr[i]['theOne']='true'
          theOneIndex = i
          break
        }
      }
    
      let brr = []
      let last_data = arr[arr.length-1]
      brr = this.chunk(arr,last_data.seatRow)
      this.setData({
        coordinate1:brr,
        storeTips,
        nowSeat:'',
        floors:res.data.storeSeatFloorDTOS,
        preItem:'',
      })
      // const query = wx.createSelectorQuery()
      // query.select('.zuowei_box').boundingClientRect()
      // query.selectAll('.wutai').boundingClientRect()
      // query.exec(res=>{
        // console.log(res[1])
        // let x = res[1][theOneIndex].left
        // let y = res[1][theOneIndex].top
        // let end = res[1].pop()
        // this.setData({
          // wutaiBoxTop  : Math.round(res[0].top), 
          // ['wutai.sx'] : Math.round(x),
          // ['wutai.sy'] : Math.round(y),
          // ['wutai.lx'] : Math.round(end.left+end.width),
          // ['wutai.ly'] : Math.round(end.top+end.height),
          // ['wutai.h']  : Math.round(end.top+end.height - y),
          // ['wutai.w']  : Math.round(end.left+end.width - x),
        // })
      // })
      wx.hideLoading()
    })
  },

  chunk(arr,num){
    let j = 0;
    let o = j;
    let newArr = []
    while(j<arr.length){
      j+=num;
      newArr.push([arr.slice(o,j)])
      o=j
    }
    return newArr
  },

  // 获取当前月或日或周
  getCurMonthDay(){
    let date = new Date();
    let week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
    this.setData({
      curMonth:date.getMonth() + 1,
      curDay:date.getDate(),
      curWeekText:week[date.getDay()]
    })
    // this.getStoreInfo(date.getDay())
  },
  getDaysWeek(){    
    let date = new Date();
    let year = date.getFullYear();
    let mouth = date.getMonth() + 1;
    let days ;
    if(mouth == 2){
        days= year % 4 == 0 ? 29 : 28;
    }
    else if(mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12){
        days= 31;
    }
    else{
        days= 30;
    }
    let totalDays = days;
    let curDay = date.getDate();
   
    let arr = [];
    for(let i =0;i<7;i++){
      if(totalDays<curDay+i){
        break;
      }
      // arr.push(curDay+i)
      arr.push({
        mouth:mouth,
        day:curDay+i,
        year:year
      })
    }
    let nextMouth = mouth
    if(arr.length<7){
      let poor = 7 - arr.length
      nextMouth = mouth+1
      if(nextMouth>12){
        nextMouth = 1
        year = year+1
      }
      for(let i=0;i<poor;i++){
        // arr.push(i+1)
        arr.push({
          mouth:nextMouth,
          day:i+1,
          year
        })
      }
    }
    if(nextMouth<10){
      nextMouth = '0' + nextMouth
    }
    if(curDay<10){
      curDay = '0' + curDay
    }
    arr.forEach(v=>{
      let week = ''
      if(v.mouth<10 && v.mouth.length<2){
        v.mouth = '0' + v.mouth
      }
      week = new Date(`${v.year}/${v.mouth}/${v.day}`).getDay()
      switch(week){
        case 0:
          v['week'] = '日'
          break;
        case 1:
          v['week'] = '一'
          break;
        case 2:
          v['week'] = '二'
          break;
        case 3:
          v['week'] = '三'
          break;
        case 4:
          v['week'] = '四'
          break;
        case 5:
          v['week'] = '五'
          break;
        case 6:
          v['week'] = '六'
          break;
      }

    })
    this.setData({
      weekArr:arr,
      timeDate:year + '-' + nextMouth + '-' + curDay
      // nowMouth:mouth,
    })
    this.changeWeekBtn(arr[0])
  },

  seatInfo(e){
    let info = e.currentTarget.dataset.data
    switch(info.seatAttribute){
      case 2:
        // 如果有上一次点击的座位  清空其选中状态
        if(this.data.preItem){
          this.data.preItem.choose = false    
          let newInfo_pre = `coordinate1[${this.data.preItem.seatColumn-1}][0][${this.data.preItem.seatRow-1}]`
          this.setData({
            [newInfo_pre]:this.data.preItem,
          })
        }
        info['choose'] = true
        let newInfo = `coordinate1[${info.seatColumn-1}][0][${info.seatRow-1}]`
        this.setData({
          [newInfo]:info,
          preItem:info//记录这次点击的 用于 下次取消选中状态
        })
        // console.log(info)
        this.setData({
          nowSeat:info
        })
        break;
      case 5:
        wx.showToast({
          title: 'AA拼单请在APP中查看',
          icon: 'none',
          duration: 2000
        })
        break;
    }
  },

  // 日期选择
  changeWeekBtn(e){
    let time = {}
    if(e.currentTarget){
        time = e.currentTarget.dataset.time;
    }else{
        time = e
    }
    let arr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
    if(time.mouth<10){
      time.mouth = '0' + time.mouth
    }
    if(time.day<10){
      time.day = '0' + time.day
    }
    let week = new Date(time.year + '/' + time.mouth + '/' + time.day).getDay()
    this.setData({
      curDay:time.day,
      curMonth:time.mouth,
      curWeekText:arr[week],
      timeDate:time.year + '-' + time.mouth + '-' + time.day,
      sessionType:0,
    })
    this.getStoreInfo(week)
  },
  // hideBooked(){
  //   this.setData({
  //     isShowBookedAlert:false
  //   })
  // },
  hideSelBooked(){
    this.setData({
      isShowSelType:false
    })
  },
  // showBooked(){
  //   this.setData({
  //     isShowBookedAlert:true
  //   })
  // },
  selBtn(e){
    let CurIndex = e.currentTarget.dataset.index
    this.data.selBookType.forEach((item,index)=>{
      if(CurIndex == index){
        item.isSel = true
      }else{
        item.isSel = false
      }
    })
    this.setData({
      selBookType:this.data.selBookType,
    })
  },
  selAlcoholBtn(e){
    let CurIndex = e.currentTarget.dataset.index
    this.data.selAlcoholType.forEach((item,index)=>{
      if(CurIndex == index){
        item.isSel = true
      }else{
        item.isSel = false
      }
    })
    this.setData({
      selAlcoholType:this.data.selAlcoholType
    })
  },
  // 查看布局图
  lookLayout(){
    this.setData({
      layoutState:!this.data.layoutState
    })
  },
  closeStoreMask(){
    this.setData({
      isShowGoStore:true
    })
  },
  closeOrder(){
    this.setData({
      isShowSelType:false
    })
  },

  cancelPopup(e){
    this.setData({
      show:false
    })
  },
  confirmPopup(e){
    this.setData({
      show:false
    })
    this.goCart()
  },
  // 参与订单
  // joinOrder(){
  //   if(!this.data.nowSeat){
  //     wx.showToast({
  //       title: '请选择一个座位',
  //       icon:'none',
  //       duration:2000,
  //     })
  //     return
  //   }

  //   if(!this.data.readState){
  //     wx.showToast({
  //       title: '请确认已阅读注意事项',
  //       icon:'none',
  //       duration:2000,
  //     })

  //     let query = wx.createSelectorQuery();
  //     query.select('.makeTable-box').boundingClientRect();
  //     query.exec(rect => {
  //       let e = rect[0];
  //       wx.pageScrollTo({
  //         scrollTop: e.bottom,
  //       });
  //     })


  //     return
  //   }

  //   this.data.timeDate = this.data.timeDate.replace(/\//g, '-')

  //   $api.ajax(`/app/store/storeCheckIsClose`,'post',{
  //     presetDate: this.data.timeDate,
  //     storeId: this.data.storeId,
  //   }).then(res => {
  //     if(res.code == 0){
  //       if(res.data.isClose == 0){
  //         this.goCart()
  //       }else if(res.data.isClose == 1){
  //         wx.showToast({
  //           title: '今日商家已打烊，换一天试试吧',
  //           icon:'none',
  //           duration:2000,
  //         })
  //       }
  //     }else{
  //       wx.showToast({
  //         title: res.msg,
  //         icon:'none',
  //         duration:2000,
  //       })
  //     }
  //   })
  // },
  // 最新授权登录
  getUserProfile(e){
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
          this.joinOrder()
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
      this.joinOrder()
    }).catch((res) => { 
      wx.showToast({
        title: '登录失败，请重试',
        icon:'none',
        duration:2000
      })
    })
  },
  joinOrder(){
    if(!this.data.nowSeat){
      wx.showToast({
        title: '请选择一个座位',
        icon:'none',
        duration:2000,
      })
      return
    }

    if(!this.data.readState){
      wx.showToast({
        title: '请确认已阅读注意事项',
        icon:'none',
        duration:2000,
      })
      let query = wx.createSelectorQuery();
      query.select('.makeTable-box').boundingClientRect();
      query.exec(rect => {
        let e = rect[0];
        wx.pageScrollTo({
          scrollTop: e.bottom,
        });
      })
      return
    }
    let storeFields = ''
    let arr = this.data.storeTips.storeFields
    if(arr.length>0){
      for(let i=0;i<arr.length;i++){
        if(arr[i].isSelected == 1){
          storeFields = arr[i]
          break
        }
      }
    }else{
      storeFields = {field:0}
    }

    this.data.timeDate = this.data.timeDate.replace(/\//g, '-')

    $api.ajax(`/app/store/storeCreateOrderCheck`,'post',{
      presetDate: this.data.timeDate,
      storeId: this.data.storeId,
      field:storeFields.field,
      seatCode:this.data.nowSeat.seatCode,
    }).then(res => {
      if(res.code == 0){
        if(res.data.isClose == 0){
          this.goCart()
        }else if(res.data.isClose == 1){
          wx.showToast({
            title: res.data.msg,
            icon:'none',
            duration:2000,
          })
        }else{
          this.setData({
            show:true,
            showPopupText:res.data.msg
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000,
        })
      }
    })
  },
   /// 按钮触摸开始触发的事件 
  touchStart: function(e) {
    this.touchStartTime = e.timeStamp
  },

  /// 按钮触摸结束触发的事件
  touchEnd: function(e) {
    this.touchEndTime = e.timeStamp
  },
   /// 双击
   doubleTap: function(e) {
    let that = this
    // 控制点击事件在350ms内触发，加这层判断是为了防止长按时会触发点击事件
    if (that.touchEndTime - that.touchStartTime < 350) {
      // 当前点击的时间
      let currentTime = e.timeStamp
      let lastTapTime = that.lastTapTime
      // 更新最后一次点击时间
      that.lastTapTime = currentTime

      // 如果两次点击时间在300毫秒内，则认为是双击事件
      if (currentTime - lastTapTime < 300) {
        // console.log("double tap")
        // 成功触发双击事件时，取消单击事件的执行
        this.data.scaleNum<1.5 && this.setData({
          scaleNum:1.5
        })
      }
    }
  },
  // 视图缩放触发
  bindscaleEvent(e){
    this.data.scaleNum = 0.5
  },
  cancel(){
    this.setData({
      isShowSelType:false
    })
  },
  // 前往店铺
  goPay(){
    this.saveInfo()
    wx.setStorageSync('useCart',false)
    this.hideSelBooked()
    wx.navigateTo({
      url:'../pay/pay',
    })
  },
  // 前往购物
  goCart(){
    this.saveInfo()
    wx.setStorageSync('useCart',true)
    this.hideSelBooked()
    wx.navigateTo({
      url:'../allGoods/allGoods?storeId=' + this.data.storeId,
    })
  },
  // 保存当前座位等信息
  saveInfo(){
    this.closeOrder()
    let storeFields = ''
    let arr = this.data.storeTips.storeFields
    if(arr.length>0){
      for(let i=0;i<arr.length;i++){
        if(arr[i].isSelected == 1){
          storeFields = arr[i]
          break
        }
      }
    }else{
      storeFields = {field:0}
    }
    this.data.timeDate = this.data.timeDate.replace(/\//g, '-')
    let payInfo = {
      storeId:this.data.storeId,
      seat:this.data.nowSeat,
      goods:[],
      time:this.data.timeDate,
      storeFields
    }
    wx.setStorageSync('payInfo',JSON.stringify(payInfo))
    if(wx.getStorageSync('coupons')){
      wx.removeStorage('coupons')
    }
  },

})
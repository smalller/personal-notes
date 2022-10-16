const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slideButtons: [{
      text: '删除',
    }],
    chooseList:[],//用于支付页跳转过来时  判断选中的优惠券，最多2张，商家，平台各一张
    satisfyPrice:0,//记录从支付页跳转时  必须满足的金额  才能选中
    minPrice:0,
    couponsList:[],
    state:0,//顶部边框
    inds:null,//优惠卷
    pageIndex:1,
    pageSize:20,
    ismore:true,
    isClick:'',//是否可以点击优惠券, 只有在支付页面跳转时为true
    canSlide:false,//是否禁用左滑
    nav:[
      {
        id:0,
        text:'全部'
      },
      {
        id:1,
        text:'待使用'
      },
      {
        id:2,
        text:'已使用'
      },
      {
        id:3,
        text:'已过期'
      },
    ],
    left_width:'',
    btm_width:'',
    addUrl: `${$api.fileUrl}`,
    show:false,
    childComponent:{}
  },
  leftPosi(){
    let query = wx.createSelectorQuery();
    query.select('.active').boundingClientRect(rect => {
        this.setData({
            btm_width:rect.width
        })
    }).exec();
    query.select('.on').boundingClientRect(rect_on => {
        let left_width = (rect_on.left + ((rect_on.width - this.data.btm_width)/2))
        this.setData({
            left_width:left_width + 'px'
        })
    }).exec();
  },
  check(ind){
    if(this.data.isClick){
      return
    }
    this.setData({
      state:ind.currentTarget.dataset.index
    })
    this.setData({
      couponsList:[],
      pageIndex:1,
      ismore:true
    })
    this.leftPosi()
    this.conuponList()
  },
  checkBg(e){
    if(this.data.isClick){
      return
    }
    if(e.currentTarget.dataset.index == this.data.inds){
      this.setData({
        inds:null
      })
    }else{
      this.setData({
        inds:e.currentTarget.dataset.index
      })
    }
    this.setData({
      couponsList:[],
      pageIndex:1,
      ismore:true
    })
    this.conuponList()
  },

  cancel(e){
    this.setData({
        show:false
    })
  },
  confirm(e){
    let that = this
    let id = e.detail.data.id
    let index = e.detail.data.index
    $api.ajax(`/app/coupon/${id}/del`, 'delete').then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
        return
      }
      wx.showToast({
        title: '删除成功',
        icon:'success',
        duration:1500
      })

      that.data.couponsList.splice(index,1)
      that.setData({
        couponsList:that.data.couponsList,
        show:false
      })
    })
  },

  slideButtonTap(e){
    let component = {}
    component['id'] = e.currentTarget.dataset.data.id
    component['index'] = e.currentTarget.dataset.index
    this.setData({
        show:true,
        childComponent:component
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(){
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      predata:[]
    })
  },
  onLoad: function (options) {
    if(options.order){
      // 表示从支付页面跳转  选择优惠券
      this.setData({
        isClick:options.order,
        satisfyPrice:options.price,
        minPrice:options.min,
        canSlide :true
      })
      this.orderCouponList()
    }else{
      this.setData({
        isClick:'',
        canSlide :false
      })
      this.conuponList()
      this.leftPosi()
    }
  },
  // 在支付页点击 进来  获取该商家的优惠券
  orderCouponList(){
    if(!this.data.ismore){
      return
    }
    let data = {
      pageNo:this.data.pageIndex,
      pageSize:this.data.pageSize,
      storeId:this.data.isClick,
    }
    $api.ajax('/app/coupon/orderCouponList', 'post', data).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
        return
      }
      if(res.data.list.length>0){
        this.setData({
          pageIndex:this.data.pageIndex+1,
          ismore:true
        })
      }else{
        this.setData({
          ismore:false
        })
      }
      res.data.list.forEach(v=>{
        if(v.useEndTime){
          v.useEndTime = v.useEndTime.replace(/-/g, '/')
          v.useEndTime = unils.timeData(v.useEndTime,2)
        }
        v.discountMoney = parseInt(+v.discountMoney)
        v.contentMoney = parseInt(+v.contentMoney)
        this.data.couponsList.push(v)
      })

      this.setData({
        couponsList: this.data.couponsList,
      })
    })
  },
  // 我的点击进来  获取所有
  conuponList(){
    if(!this.data.ismore){
      return
    }
    let data = {
      pageNo:this.data.pageIndex,
      pageSize:this.data.pageSize,
      couponType:+this.data.state,
      category:+this.data.inds,
    }
    $api.ajax('/app/coupon/list', 'post', data).then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon:'none',
          duration:2000
        })
        return
      }
      if(res.data.list.length>0){
        this.setData({
          pageIndex:this.data.pageIndex+1,
          ismore:true
        })
      }else{
        this.setData({
          ismore:false
        })
      }
      
      res.data.list.forEach(v=>{
        if(v.useEndTime){
          // v.useEndTime = v.useEndTime.replace(/-/g, '/')
          // v.useEndTime = unils.timeData(v.useEndTime,1)
          v.useEndTime = v.useEndTime.replace(/-/g, '/')
          
          if(new Date(v.useEndTime).getTime()<new Date().getTime()){
            v['past'] = true
          }else{
            v['past'] = false
          }
        }else{
          v['past'] = false
        }
        v.discountMoney = parseInt(+v.discountMoney)
        v.contentMoney = parseInt(+v.contentMoney)
        this.data.couponsList.push(v)
      })
      console.log(this.data.couponsList)
      this.setData({
        couponsList: this.data.couponsList,
      })
    })
  },
  choose(e){
    if(!this.data.isClick){
      return
    }
    let arr = this.data.chooseList
    let data = e.currentTarget.dataset.item
    let index = e.currentTarget.dataset.index
    let old = `couponsList[${index}].choose` //更改原数组中的选中状态

    let total = this.data.satisfyPrice
    let min = this.data.minPrice
    let condition = data.contentMoney //消费满金额 
    let discountMoney = data.discountMoney //优惠金额  用于抵扣券

    let select = 0
    if(this.data.chooseList.length>0){
      select = this.data.chooseList[0].discountMoney
    }else{
      select = 0
    }
    // 取消已经选中的券
    if(data.choose){
      data['choose'] = false
      arr.forEach((v,i)=>{
        if(v.id == data.id){
          arr.splice(i,1)
        }
      })
      this.setData({
        chooseList:arr,
        [old]:false
      })
      return
    }
    if(data.category == 1){
      // 折扣券  直接减
      if(Number(total) - Number(discountMoney) - Number(select) <= min){
          wx.showToast({
            title: '不满足使用条件',
            icon:'none',
            duration:2000
          }) 
        return
      }
    }else if(data.category == 2){
      // 满减券  满足金额 直接减
      if((Number(condition)-Number(total) - Number(select))>=0 && Number(total) - Number(condition) - Number(select <= min)){
        wx.showToast({
          title: '不满足使用条件',
          icon:'none',
          duration:2000
        }) 
        return
      }
    }else if(data.category == 3){
      // 礼券  满足金额  直接送
      if((Number(condition)-Number(total)-Number(select))>=0 && Number(total) - Number(condition) - Number(select) <= min){
        wx.showToast({
          title: '不满足使用条件',
          icon:'none',
          duration:2000
        }) 
        return
      }
    }

    if(arr.length>=2){
      wx.showToast({
        title: '最多只能使用2张优惠券',
        icon:'none',
        duration:2000
      })
      return 
    }

    if(arr.length>=1){
      if(arr[0].source == data.source){
        // 同种类型  
        wx.showToast({
          title: '商家券或平台券只能各选一张',
          icon:'none',
          duration:2000
        })
      }else{
        data['choose'] = true
        arr.push(data)
        this.setData({
          [old]:true
        })
      }
    }else{
      data['choose'] = true    
      arr.push(data)
      this.setData({
        [old]:true
      })
    }
    this.setData({
      chooseList:this.data.chooseList,
    })
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    prevPage.setData({
      predata:this.data.chooseList
    })
  },

  onReachBottom: function () {
    if(this.data.isClick){
      this.orderCouponList()
    }else{
      this.conuponList()
    }
  }
})
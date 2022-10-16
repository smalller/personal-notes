const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    seeDetail:false,//查看详情
    detailsInfo:'',//商品详情
    fixed_top:false,
    scrollTop:'0',
    store: [],
    storePic: [],
    addUrl: `${$api.fileUrl}`,
    goodsLeft: [],
    goodsLists: [],
    inds: 0, //选项卡
    num: 1, //商品数量
    rightTop: [], //右标题
    champagneArr: [], //右边商品
    hotFlag: true, //是否热门榜
    vipFlag: true,
    cardFlag1: true,
    cardFlag2: true,
    picAdd: true,
    shade_dis: true,
    bigFlag: true,
    specifications:'',//查看多规格
    specIndex:'',//点击选规格时，的下标
    spec_index:'',//选规格 里面的规格 下标
    spec_tips:'',//选择规格 底部文字说明
    showCar:false,
    carList:[],
    carListNow:[],
    linshi:0,
    total:0,
    oldTotal:0,
    oldPrice:0,
    storeId:'',
    carNum:0,
    isKtv:'',//是否时ktv  用于跳转到支付页的判断
    isVie:0,//是否是抢座状态  如果是1 结算时 直接弹出付款
    pay:true,//支付方式弹窗
    platform:null,//手机机型
    payType:null,//支付类型
    jifenInfo:'',//积分可使用状态
    on:0,
    code0:null,
    code1:null,
    code2:null,
    code3:null,
    code4:null,
    code5:null,
    showPsw:false,
    errTip:false,
    passWord:null,
    isPay:true,//  不能点击支付时为false
    addTo:-1,//如果是订单号  则是追加订单  直接支付 
    spec_pos:0,
    nums: 0,
    numArr: [{
        id: 1,
        colorFlag: false,
    },
    {
        id: 2,
        colorFlag: false,
    },
    {
        id: 3,
        colorFlag: false,
    },
    {
        id: 4,
        colorFlag: false,
    },
    {
        id: 5,
        colorFlag: false,
    },
    {
        id: 6,
        colorFlag: false,
    },
    {
        id: 7,
        colorFlag: false,
    },
    {
        id: 8,
        colorFlag: false,
    },
    {
        id: 9,
        colorFlag: false,
    },
    {
        id: 0,
        colorFlag: false,
    },
    ],
    passNum: ['', '', '', '', '', ''],
    truepassNum: ['', '', '', '', '', ''], //做比较的数组
    isBack:false,//用于修改资金密码 状态
    flag: true,
    aginFlag: true,
    xiugaiFlag: true,
    amendFlag: true,
    storeName:'',
    mobile:'',
    jifenState:0,
    payment:1,
    show:false,
    childComponent:{},
    topText:'',
  },
  bindKeyInput(e){
    if(e.detail.value){
        this.setData({
            on:+e.currentTarget.dataset.index
        })
    }
    this.pswRule()
  },
  pswRule(){
      if(this.data.code1 && this.data.code2 && this.data.code3 && this.data.code4 && this.data.code5 && this.data.code0){
          let  code = this.data.code0+this.data.code1 + this.data.code2 +this.data.code3 +this.data.code4+this.data.code5
          this.setData({
              passWord:code
          })
          this.weixin()
      }
  },
  allTotal() {
    var total=0;var all_num = 0,oldTotal=0
    this.data.carListNow.forEach(v=>{
      v['aloneNowPrice'] = (v.skuList[0].presentPrice * v.skuList[0].num).toFixed(2)
      v['aloneOldPrice'] = (v.skuList[0].originalPrice * v.skuList[0].num).toFixed(2)
      total += v.skuList[0].presentPrice * v.skuList[0].num
      oldTotal += v.skuList[0].originalPrice * v.skuList[0].num
      all_num += v.skuList[0].num
    })
    total = Math.fround(total*100)/100
    oldTotal = Math.fround(oldTotal*100)/100
    if(total.toString().indexOf('.') != -1){
        let pre_index = total.toString().split('.')[0];
        var index=total.toString().split('.')[1];
        if(index.length>=3){
          index = Number(index.substr(0,2))+1
          total = pre_index + '.' + index
        }
    }
    this.setData({
      total:total.toFixed(2),
      carNum:all_num,
      oldTotal:(oldTotal - total).toFixed(2),
      oldPrice:oldTotal.toFixed(2),
      carListNow:this.data.carListNow
    }) 
  },
  onShow(){
    this.getJifen(this.data.storeId)
    this.storeGoodsList(this.data.storeId)
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    let ispayBack = currPage.data.ispayBack
    if(ispayBack){
      this.setData({
        isPay:false
      })
    }
  },
  // 180px
  onPageScroll (e) { 
    const query = wx.createSelectorQuery()
    query.select('.content').boundingClientRect(rect=>{
      if(rect.top<=10){
        this.setData({
          // fixed_top:true,
        })
      }else{
        this.setData({
          // fixed_top:false,
        })
      }
      // if(e.scrollTop >= rect.height){
      //   this.setData({
      //     fixed_top:true,
      //   })
      // }else{
      //   this.setData({
      //     fixed_top:false
      //   })    
      // }
    }).exec()
    return
      query.select('.top_con').boundingClientRect(rect=>{
        console.log(e.scrollTop,rect.height)
        if(e.scrollTop >= rect.height){
          this.setData({
            fixed_top:true,
          })
        }else{
          this.setData({
            fixed_top:false
          })    
        }
      }).exec()
  },
  //左边栏
  check(e) {
    let goods = this.data.goodsLists
    let type = e?e.currentTarget.dataset.type:goods[0].type
    let index = e?e.currentTarget.dataset.index:0
    for(let i=0;i<goods.length;i++){
      if(goods[i].type == type){
        this.setData({
          inds: type,
          rightTop: this.data.goodsLists[index],
          // champagneArr: goods[i].goodsList
        })
        break
      }
    }
  },
  // 售罄
  sellOut(){
    wx.showToast({
      title: '该商品已售罄',
      icon: 'none',
    })
  },
  specifiSellOut(){
    wx.showToast({
      title: '该商品规格已售罄',
      icon: 'none',
    })
  },
  // 查看规格后  添加购物车
  addSpecCar(e){
    let value = e.currentTarget.dataset.value
    value.num +=1
    var goods = this.data.goodsLists  //所有商品
    let spec = this.data.specifications
    goods.forEach((v1,m)=>{
        if(v1.type == this.data.specifications.type){
        v1.goodsList.forEach((v2,n)=>{
          if(v2.goodsId == this.data.specifications.goodsId){
            v2.number+=1
            let strArr = JSON.stringify(spec)
            let new_arr = JSON.parse(strArr)
            new_arr.skuList = []
            new_arr.skuList.push(value)
            var goodsList = `goodsLists[${m}].goodsList[${n}]`
            //  详情中的加减
            if(this.data.seeDetail){
              v2['setMealGoodsList'] = this.data.detailsInfo.setMealGoodsList
              v2['infoPicture'] = this.data.detailsInfo.infoPicture
              this.setData({
                detailsInfo:v2
              })
            }
            
            this.setData({
              [goodsList]:v2,
            })
            v2.skuList.forEach((v3,k)=>{
                if(v3.skuId == value.skuId){
                    v3.num+=1
                    var lastVal = `goodsLists[${m}].goodsList[${n}].skuList[${k}]`
                    var spec_tips = `spec_tips`
                    // this.data.spec_tips.num = v3.num
                    // 以上 已经可以 给规格 加入数量
                    // 以下  给加入底部购物
                    // console.log(v3)
                    this.setData({
                      [lastVal]:v3,
                      // spec_tips:this.data.spec_tips,
                      [spec_tips]:v3
                    })
                    this.data.specifications.skuList.forEach((v4,s)=>{
                      if(v4.skuId == value.skuId){
                        let sp = `specifications.skuList[${s}]`
                        this.setData({
                          [sp]:v3
                        })
                      }
                    })
                    //  详情中的加减
                    if(this.data.seeDetail){
                      var lastDetVal = `detailsInfo.skuList[${k}]`
                      this.setData({
                        [lastDetVal]:v3
                      })
                    }
                    // console.log(new_arr)
                    this.saveCart(new_arr,1)
                }
            })
          }
        })
      }
    })

    // this.setData({
    //   carList:this.data.carList
    // })  
    this.lookCar()
    this.allTotal()
  },
  //加
    // add(e) {
    //     let addNum = e.currentTarget.dataset.value//数据
    //     var goods = this.data.goodsLists  //所有商品
    //     goods.forEach((v1,i)=>{
    //         if(v1.type == addNum.type){
    //             v1.goodsList.forEach((v2,j)=>{
    //                 if(v2.goodsId == addNum.goodsId){
    //                     v2.skuList.forEach((v3,k)=>{
    //                         if(v3.skuId == addNum.skuList[0].skuId){
    //                             v3.num+=1
    //                             var lastVal = `goodsLists[${i}].goodsList[${j}].skuList[${k}]`
    //                             this.setData({
    //                                 [lastVal]:v3,
    //                             })
    //                         }
    //                     })
    //                 }
    //             })
    //         }
    //     })
    //     this.lookCar()
    //     this.allTotal()
    // },

    // 加减状态
    addOrLose(e){
        let addNum = e.currentTarget.dataset.value//数据
        let type = e.currentTarget.dataset.type//1为加 -1为减
        var goods = this.data.goodsLists  //所有商品
        goods.forEach((v1,i)=>{
            if(v1.type == addNum.type){
                v1.goodsList.forEach((v2,j)=>{
                    if(v2.goodsId == addNum.goodsId){
                        var goodsList = `goodsLists[${i}].goodsList[${j}]`
                        v2.skuList.forEach((v3,k)=>{
                            if(v3.skuId == addNum.skuList[this.data.spec_pos].skuId){
                                if(type == 1){
                                    v2.number+=1 //购物车数量同步
                                    v3.num+=1  
                                    let section = v3.num
                                    this.setData({
                                      [goodsList]:v2
                                    })
                                    this.saveCart(addNum,1)
                                    // 详情中的加减
                                    if(this.data.seeDetail){
                                      this.data.detailsInfo.skuList[0].num +=1
                                    }
                                    if(this.data.spec_tips){
                                      this.data.specifications.skuList.forEach((sp,si)=>{
                                        if(sp.skuId == this.data.spec_tips.skuId){
                                          this.data.spec_tips.num +=1
                                          sp.num = this.data.spec_tips.num
                                          let a = `specifications.skuList[${si}].num`
                                          this.setData({
                                            [a]:sp.num
                                          })
                                          v3.num = section
                                        }
                                      })
                                    }
                                }else{
                                    if(v3.necessaryNum>0){
                                      if(v3.num<=v3.necessaryNum){
                                        wx.showToast({
                                          title: `该必选商品不得低于${v3.necessaryNum}件`,
                                          icon: 'none',
                                          duration: 1500
                                        })
                                        return
                                      }
                                    }
                                    v2.number-=1
                                    v3.num-=1
                                    let section = v3.num
                                    this.setData({
                                      [goodsList]:v2
                                    })
                                    this.saveCart(addNum,-1)
                                    // 详情中的加减
                                    if(this.data.seeDetail){
                                      this.data.detailsInfo.skuList[0].num -=1
                                    }
                                    if(this.data.spec_tips){
                                      this.data.spec_tips.num -=1
                                      this.data.specifications.skuList.forEach((sp,si)=>{
                                        if(sp.skuId == this.data.spec_tips.skuId){
                                          sp.num = this.data.spec_tips.num
                                          let a = `specifications.skuList[${si}].num`
                                          this.setData({
                                            [a]:sp.num
                                          })
                                          v3.num = section
                                        }
                                      })
                                    }
                                }
                                var lastVal = `goodsLists[${i}].goodsList[${j}].skuList[${k}]`
                                this.setData({
                                  [lastVal]:v3,
                                  detailsInfo:this.data.detailsInfo,
                                  spec_tips:this.data.spec_tips,
                                  // specifications:this.data.specifications,
                                })
                            }
                        })
                    }
                })
            }
        })
        if(type == -1){
          let query = wx.createSelectorQuery();
          query.select('.car_box').boundingClientRect(rect => {
              this.setData({
                dynamicHeight:rect.height*2
              })
          }).exec(); 
        }
        this.lookCar()
        this.allTotal()
    },
    
    saveCart(data,num){
      if(data.skuList.length>1){
        this.data.spec_pos = this.data.spec_pos
      }else{
        this.data.spec_pos = 0
      }
      let url = '';
      let value = {
        goodsId:data.goodsId,
        goodsName:data.name,
        number:1,
        presentPrice:data.skuList[this.data.spec_pos].presentPrice,
        skuCode:data.skuList[this.data.spec_pos].skuCode,
        specName:data.skuList[this.data.spec_pos].specName,
        storeId:data.storeId,
      }
      if(num >=1){
        url = '/app/cart/save'
      }else{
        url = '/app/cart/reduce'
      }
      $api.ajax(url,'post',value).then(res => {
      })
    },
    claerCart(){
      $api.ajax(`/app/cart/empty/${this.data.storeId}`,'delete').then(res => {
        if(res.code != 0 ){
          wx.showToast({
            title: res.msg,
            icon: 'none',
          })
          return
        }
        for(let i=0;i<this.data.carListNow.length;i++){
          if(this.data.carListNow[i].skuList[0].necessaryNum>0){
            wx.showToast({
              title: '必选商品不可清空',
              icon: 'none',
            })
            break;
          }
        }
        this.storeGoodsList(this.data.storeId)
        // 手动清除购物车  加入必选商品后作废
        // var goods = this.data.goodsLists  //所有商品
        // goods.forEach((v1,m)=>{
        //     v1.goodsList.forEach((v2,n)=>{
        //         v2.num = 0
        //         v2.number = 0
        //         v2.skuList.forEach((v3,k)=>{
        //           v3.num = 0
        //           v3.number = 0
        //         })
        //     })
        // })
        // this.setData({
        //   goodsLists:goods,
        //   carListNow:[],
        //   total:0,
        //   carNum:0,
        //   oldPrice:0,
        //   oldTotal:0,
        // })
      })
    },

  checkCard1() {
    this.setData({
      cardFlag1: !this.data.cardFlag1
    })
  },
  checkCard2() {
    this.setData({
      cardFlag2: !this.data.cardFlag2
    })
  },
  // 查看多规格商品
  shade(e) {
    let data = e.currentTarget.dataset.data;
    let index = e.currentTarget.dataset.index;
    let spec_index='',spec_tips='';
    for(let i=0;i<data.skuList.length;i++){
      if(data.skuList[i].sellOut == 0){
        spec_index = data.skuList[i].skuId
        spec_tips = data.skuList[i]
        break
      }
    }
    this.setData({
      specifications:data,
      specIndex:index,
      shade_dis: !this.data.shade_dis,
      spec_tips,
      spec_index
    })
  },
  shadeClose(){
    this.setData({
      shade_dis: !this.data.shade_dis,
      spec_pos:0
    })
  },
  big_small(e) {
    let data = e.currentTarget.dataset.type
    let pos = e.currentTarget.dataset.index
    // console.log(this.data.specifications)
    // this.data.specifications.skuList.forEach(i=>{
    //   i.num = 10
    // })
    this.setData({
      spec_tips:data,
      spec_index:data.skuId,
      spec_pos:pos,
      // specifications:this.data.specifications
    })
    // this.data.goodsLists.forEach(i=>{
    //   if(i.type == this.data.inds){
    //     i.goodsList.forEach(j=>{
    //       if(j.goodsId == data.goodsId){
    //         j.skuList.forEach(m=>{
    //           if(m.skuId == data.skuId){
    //             let pos = e.currentTarget.dataset.index
    //             this.setData({
    //               spec_tips:m,
    //               spec_index:m.skuId,
    //               spec_pos:pos
    //             })
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
  },
  //购物车
  lookCar() {
    let good = this.data.goodsLists
    var result = [];
    good.forEach((v1,i)=>{
        v1.goodsList.forEach((v2,j)=>{
            v2.skuList.forEach((v3,k)=>{
                if(v3.num>=1){
                    let strArr = JSON.stringify(this.data.goodsLists[i].goodsList[j])
                    let new_arr = JSON.parse(strArr)
                    new_arr.skuList = []
                    new_arr.skuList.push(v3)
                    result.push(new_arr)
                }
            })
        })
    })
    this.setData({
        carListNow:result,
    })
  },
  showCar(){
    this.setData({
        showCar:true,
        shade_dis:true,
        spec_pos:0
    })
  },
  closeCar(){
    this.setData({
      showCar:!this.data.showCar
    })
  },
  details(e){
    let data = e.currentTarget.dataset.data
    $api.ajax(`/app/store/getGoodsInfo/${data.storeId}/${data.goodsId}`,'get').then(res => {
      if(res.code != 0 ){
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      data['setMealGoodsList'] = res.data.setMealGoodsList
      data['infoPicture'] = res.data.infoPicture

      this.setData({
        detailsInfo:data
      })
    })
    this.setData({
      seeDetail:true
    })
  },
  closeDetail(){
    if(this.data.seeDetail){
      this.setData({
        seeDetail:false
      })
    }else{
      wx.navigateBack({
        delta: 1
      })
    }
    
  },
  getPhone(){
    wx.getSystemInfo({
        success:(res=>{
          this.setData({
            platform:res.platform=='ios'?1:0

            // platform:res.platform=='ios'?1:(res.platform=='android'?0:3)
          })
        })
    })
  },
  // 积分支付成功  查看订单
  goOrder(){
    if(this.data.addTo){
      wx.redirectTo({
        url: `../grabSeat/grabSeat?id=${that.data.storeId}&title=getSeat&type=1`,
      })
    }else{
      
    }
  },
  goStore(){
    wx.redirectTo({
      url:'../details/details?id=' + this.data.storeId
    })
  },
  //结算
  goOrderdetail() {
    let minPrice = 0
    if(this.data.isKtv == 3){
      wx.removeStorageSync('payInfo')
      if(wx.getStorageSync('ktv_info')){
        let ktv = wx.getStorageSync('ktv_info')
        let roomId = wx.getStorageSync('selectKtvId')
        for(let i=0;i<ktv.roomTimeIntervalList.length;i++){
          if(ktv.roomTimeIntervalList[i].roomTimeId == roomId){
            minPrice = ktv.roomTimeIntervalList[i].minConsumption
            break
          }
        }
      }
    }else{
      wx.removeStorageSync('selectKtvId')
      wx.removeStorageSync('ktv_info')
      if(wx.getStorageSync('payInfo')){
        minPrice = JSON.parse(wx.getStorageSync('payInfo')).seat.weekPriceList[0].price
      }
    }
    if(this.data.addTo>0){
      // 如果有追加状态
      this.createOrder()
      return
    }


    if(!this.data.isPay){
      wx.showToast({
        title: '您还没有预定座位',
        icon:'none',
        duration:2000,
      })
      return
    }
    if(this.data.isVie == 1){
      // 抢座  直接付钱
      if( Number(minPrice) > Number(this.data.total)){
        wx.showToast({
          title: '您选购的商品总额不满足最低消费，不能发起支付',
          icon:'none',
          duration:2000,
        })
        return
      }
      this.createOrder()
      return
    }
    
    if(minPrice>this.data.total){
      wx.showToast({
        title: '您选购的商品总额不满足最低消费，不能发起支付',
        icon:'none',
        duration:2000,
      })
      return
    }


    wx.setStorageSync('useCart',true)
    wx.navigateTo({
      url: '../pay/pay?type=' + this.data.isKtv,
    })

    // wx.redirectTo ({
    //   url: '../pay/pay?type=' + this.data.isKtv,
    // })
  },

  // 抢座状态  或 追加状态
  createOrder(){
    this.setData({
        pay:!this.data.pay
    })
  },

  weixinBefore(e){
    this.setData({
        payment:1
    })
  },
  jifenBefore(e){
      this.setData({
          payment:2
      })
  },
  selectAfter(){
      if(this.data.payment==1){
          this.weixin(1)
      }else{
          this.jifen(2)
      }
  },
  goBuyCard(){
    this.setData({
      jifenState:0
    })
    wx.navigateTo({
      url: '../clubCard/clubCard?type=0&storeId='+ this.data.storeId,
    })
  },
  hiddenJifen(){
    this.setData({
        jifenState : 0
    })
  },

  weixin(type){
    if(type){
      this.setData({
          payType:type
      })
    }
    if(this.data.addTo>0){
      // 如果有追加状态
      this.addOrder()
      return
    }
    var cartId = '',arr=[]
    // if(this.data.carListNow.length>0){
    //     console.log(this.data.carListNow)
    //     arr = this.data.carListNow.map((v)=>{return v.id})
    //     cartId = arr.join(',')
    // }
    let time = unils.timeData(new Date(),2)
    var data = {
        isSelection:0,
        orderType:2,
        orderSource:1,
        cartIds:'',
        storeId:this.data.storeId,
        presetDate:time,
        orderAmount:this.data.total
    }
    
    $api.ajax(`/app/pay/create/order`,'post',data).then(res => {
      wx.hideLoading()
        this.setData({
          code0:null,
          code1:null,
          code2:null,
          code3:null,
          code4:null, 
          code5:null,
        })
        if(res.code != 0){
            wx.showToast({
                title: res.msg,
                icon:'none',
                duration:2000,
            })
            return
        }
        this.weixinPay(res.data)
    })
  },

  // 追加
  addOrder(){
    let that = this
    let data = {
      orderNo : this.data.addTo, 
      payWay : this.data.payType, 
      payAmount : this.data.total, 
      deviceType : this.data.platform, 
      capitalPassword : this.data.passWord,
      orderSource : 1
    }
    $api.ajax(`/app/pay/unified/add/goods`,'post',data).then(res => {
      wx.hideLoading()
      this.setData({
        code0:null,
        code1:null,
        code2:null,
        code3:null,
        code4:null, 
        code5:null,
      })
      if(res.code != 0){
          wx.showToast({
              title: res.msg,
              icon:'none',
              duration:2000,
          })
          if(res.code == 901 && res.msg == "资金密码错误"){
            that.setData({
                errTip:true,
                on:0
            })
           }
          return
      }
      if(this.data.payType == 2){
        that.setData({
          pay:true,
          showPsw:false
        })
        // 积分支付  成功
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 1500,
        })
        setTimeout(()=>{
          wx.redirectTo({
            url: `../pay/pay?orderId=${this.data.addTo}&&storeId=${this.data.storeId}`,
          })
        },1500)
      }else{
        let pay = JSON.parse(res.data)
        wx.requestPayment({
          timeStamp: pay.timeStamp,
          nonceStr: pay.nonceStr,
          package: pay.package,
          signType: pay.signType,
          paySign: pay.paySign,
          success (res) { 
            that.setData({
              pay:true,
              showPsw:false
            })
            wx.showToast({
                title: '支付成功',
                icon: 'success',
                duration: 1500,
            })
            setTimeout(()=>{
              wx.redirectTo({
                url: `../pay/pay?orderId=${this.data.addTo}&&storeId=${this.data.storeId}`,
              })
            },1500)
          },
          fail (err) { 
            wx.showToast({
                title: '取消支付',
                icon: 'none',
                duration: 2000,
            })
          }
        })    
      }
      // this.weixinPay(res.data)
  })
  },
  //支付
  weixinPay(val){
    let that = this
    // let coupId = this.data.coupons.map((i)=>{return i.id})
    // !coupId?'':coupId = coupId.join(',')
    let data = {
        capitalPassword:this.data.passWord,
        contactName:'',
        contactTel:'',
        orderNo:val.orderNo,
        payAmount:val.orderAmount,
        payWay:that.data.payType,
        deviceType:this.data.platform,
        // userCouponIds:coupId
    }
    $api.ajax(`/app/pay/unified/order`,'post',data).then(res => {
        if(res.code != 0){
            wx.showToast({
                title: res.msg,
                icon:'none',
                duration:2000,
            })
            if(res.code == 901 && res.msg == "资金密码错误"){
                that.setData({
                    errTip:true,
                    on:0
                })
            }
            return
        }
        
        // 积分支付 payType
        if(that.data.payType == 2){
          that.setData({
            pay:true,
            showPsw:false
          })
          wx.showToast({
              title: '支付成功',
              icon:'success',
              duration:1500,
          })
          setTimeout(()=>{
            wx.redirectTo({
              url: `../grabSeat/grabSeat?id=${this.data.storeId}&title=getSeat&type=1`,
            })
          },1500)
          return
        }
        let pay = JSON.parse(res.data)
        wx.requestPayment({
            timeStamp: pay.timeStamp,
            nonceStr: pay.nonceStr,
            package: pay.package,
            signType: pay.signType,
            paySign: pay.paySign,
            success (res) { 
                that.createOrder()
                that.setData({
                  pay:true,
                  showPsw:false
                })
                wx.showToast({
                  title: '支付成功',
                  icon: 'success',
                  duration: 1500,
                })
                setTimeout(()=>{
                  wx.redirectTo({
                    url: `../grabSeat/grabSeat?id=${that.data.storeId}&title=getSeat&type=1`,
                  })
                },1500)
            },
            fail (err) { 
                that.createOrder()
                wx.showToast({
                    title: '取消支付',
                    icon: 'none',
                    duration: 2000,
                })
            }
        })
    })
  },

  // 积分支付
  jifen(type){
    // 判断是否有积分  和资金密码
    let that = this
    let jifenInfo = this.data.jifenInfo
    if(Number(jifenInfo.vipPoint) < Number(this.data.total)){
        this.setData({
          jifenState : 2,
          pay:!this.data.pay 
        })
        // wx.showModal({
        //     title: '积分不足',
        //     content: '是否前往够买？',
        //     confirmText:'前往',
        //     success (res) {
        //         if (res.confirm) {
        //             wx.navigateTo({
        //                 url: '../clubCard/buyCard?id=' + that.data.storeId,
        //             })
        //         } else if (res.cancel) {
        //             that.setData({
        //                 showPsw:false
        //             })
        //         }
        //     }
        // })
        return
    }
    if(!jifenInfo.isCapitalPassword){
      let component = {}
      component['type'] = 1
      this.setData({
          show:true,
          childComponent:component,
          topText:'是否前往设置密码?'
      })
      return
    }
    that.setData({
      payType:type,
      showPsw:true
    })
  },
  cancel(e){
    this.setData({
      show:false,
      showPsw:false
    })
  },
  confirm(e){
      this.setData({
        show:false,
        showPsw:false
      })
      wx.navigateTo({
        url: '../personSet/passwordSet/passwordSet',
      })
  },
  closeBg(){
    this.setData({
        showPsw:false
    })
  },
  // 忘记密码
  forget(){
    wx.navigateTo({
        url: '../personSet/passwordSet/passwordSet',
    })
  },

  // 键盘
  bind_num(e) {
      this.data.numArr[e.target.dataset.index].colorFlag = true
      this.setData({
        numArr: this.data.numArr
      })
      setTimeout(() => {
          this.data.numArr[e.target.dataset.index].colorFlag = false
          this.setData({
            numArr: this.data.numArr
          })
      }, 100)
      
      this.data.passNum.splice(this.data.nums, 1)
      this.data.truepassNum.splice(this.data.nums, 1)
      this.data.truepassNum.splice(this.data.nums, 0, e.currentTarget.dataset.num)
      this.data.passNum.splice(this.data.nums, 0, '·')
      this.setData({
          passNum: this.data.passNum,
          truepassNum: this.data.truepassNum
      })
      this.data.nums++
      let code = this.data.truepassNum.join('')
      if (code.length >= 6) {
          this.setData({
            passWord:code,
              passNum: ['', '', '', '', '', ''],
              truepassNum:['', '', '', '', '', ''],
              nums: 0,
          })
          wx.showLoading({
            title: '加载中...',
            mask:true
          })
          this.weixin()
      }
  },
  delate() {
      this.data.passNum.splice(this.data.nums - 1, 1)
      this.data.truepassNum.splice(this.data.nums - 1, 1)
      this.data.passNum.splice(this.data.nums - 1, 0, '')
      this.data.truepassNum.splice(this.data.nums - 1, 0, '')
      this.setData({
          passNum: this.data.passNum,
          truepassNum: this.data.truepassNum
      })
      if (this.data.nums <= 0) {
          return
      }
      this.data.nums--
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // let a = unils.numAutoPlusAnimation({
    //   time: 1500, 
    //   num: 153652, 
    //   regulator: 50 
    // })
   
    this.getSysInfo()
    if(options.isPay){
      this.setData({
        isPay:false
      })
    }
    this.setData({
      storeId:options.storeId,
      isKtv:options.type || '',
      isVie:options.isVie || 0,
      addTo:options.addTo || 0,
    })
    // console.log(this.data.isKtv)
    this.getPhone()
    // this.storeGoodsList(options.storeId)
  },


  getJifen(storeId){
    $api.ajax(`/app/store/getVipPoint/${storeId}`,'get').then(res => {
      if(res.code != 0){
        wx.showToast({
            title: res.msg,
            icon:'none',
            duration:2000,
        })
        return
      }
      this.setData({
        jifenInfo:res.data
      })  
    })
  },
  // 忘记密码
  forget(){
    wx.navigateTo({
        url: '../personSet/passwordSet/passwordSet',
    })
  },
  // 获取手机刘海屏高度
  getSysInfo(){
    let info = wx.getMenuButtonBoundingClientRect()
    this.setData({
      mobile:info,
    })
  },
  storeGoodsList(id){
    let roomId = ''
    if(this.data.isKtv){
      roomId = wx.getStorageSync('ktv_info').roomId
    }
    $api.ajax(`/app/store/storeGoodsList/${id}/${roomId}`).then(res => {
      // wx.setNavigationBarTitle({
      //   title: res.data.name
      // })
      if (res.code != 0) {
        wx.showToast({
          title: '网络错误',
          icon: 'none',
        })
      }
      else {
        if(res.data == null ){
          wx.showToast({
            title: '该商店还没有添加商品哦~',
            icon: 'none',
            duration:2000
          })
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },2000)
          return
        }
        this.setData({
          storeName:res.data.name
        })
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        res.data.adUrl.forEach((item, index) => {
          const picName = item.split(":")[0];
          let obj = {
            picName
          }
          this.data.storePic.push(obj)
        })
      }
      res.data.goods.forEach(i=>{
        i.goodsList.forEach(j=>{
            j['num'] = j.number
            j.originalPrice = Number(j.originalPrice).toFixed(2)
            j.presentPrice = Number(j.presentPrice).toFixed(2)
            j.skuList.forEach(k=>{
                if(k.necessaryNum>0){
                  j['necessaryNum'] = 1
                }
                k['num'] = k.number
                k.originalPrice = Number(k.originalPrice).toFixed(2)
                k.presentPrice = Number(k.presentPrice).toFixed(2)
            })
        })  
      })
      this.setData({
        store: res.data,//所有数据
        storePic: this.data.storePic,//banner
        goodsLists: res.data.goods,//商品
        rightTop: res.data.goods[0],//左侧top
        champagneArr: res.data.goods[0].goodsList//右侧top
      })
      this.check()
      this.lookCar()
      this.allTotal()
    })
  }
  
})

const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

    data: {
        /*
            0 刚进来  还未生成订单
            1 已生成订单  且支付成功  （商家未接单）
            2 已生成订单  取消支付  （显示等待买家支付）
            3 已生成订单  且支付成功  （商家已接单）  
        */
        payState:0,//订单信息展示  还未生成订单时,用于显示 不同元素  
        timeOut:false,
        /*
            // 只要有值  代表用户已经支付
            -2表示默认值 不做操作
            -1 待接单
            0 已接单
            1 已拒绝
            2 未到店
            3 已到店
            4 未消费  用户已经支付，并且已经到店  特殊原因 离开店时  已购买的商品记线下
            5 已离开
            2345   只有在商家接单之后才可操作
        */
        storeState:-2,//商家  接单与否状态    
        tips:'',//记录商家接单之后的操作
        orderInfo:'',//生成订单后的 订单数据
        payInfo:'',//展示数据
        storeInfo:'',//门店信息
        cartList:[],//该门店 购物车信息
        // coupons:[],//优惠券
        coupons:[],//优惠券 改版后  代表优惠金额
        hasPhone:true,
        pay_timer:'',//未支付倒计时
        waiting_timer:'',//以等待 时间
        payType:null,//支付类型
        addUrl:`${$api.fileUrl}`,
        markers: [{
            iconPath: "../../icon/xing.png",
            id: 0,
            latitude: 30.651772727001937,
            longitude: 104.07324441271973,
            width: 30,
            height: 30
        }],
        total:0,//总价
        preferential:0,//特价优惠
        pay:true,//支付方式弹窗
        username:'',
        tel:'',
        remake:'',
        isShowSelType:false,
        popup_txt:'',
        popup_type:'',//用于弹窗点击确定时  调用 取消  或  删除接口
        isKtv:'',//判断是否从ktv点进来
        ktvInfo:'',//上个页面的带过来的参数
        goodsCouponTotal:'',//只计算购物车的价格 小于低消就等于低效  用于判断 选择优惠券时 能否使用
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
        waitIng:'',//等待时长
        miniTotal:null,//低消
        plOrder:null,

        storeId:'',
        payTimerItv : null ,//支付倒计时
        waitingTimeNum : 0 ,//等待倒计时
        overPrice:0,//使用优惠券  小于低消的值
        occupyseat : false,//查看占座信息

        occupyseat_itv:0, //倒计时 清空
        occupyseatTime:0,//占座倒计时 显示

        nums: 0,
        num: [{
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
        ktvTimeShowText:'',//ktv最晚时间 显示文字
        snacksList:[],//ktv附赠小吃列表
        showExecute:0,
        jifenState:0,
        calculateTotal:{},
        detailsPhone:[],
        payment:1,
        show:false,
        childComponent:{},
        topText:'',
        mobile:'',
        pageTitle:'订单信息',
        jifenInfo:'',
        reachTimeDown:'',
        reachTimeSetTimeout:'',
        seeDetail:false,//查看详情
        detailsInfo:''
    },
    goodsInfo(e){
        let data = e.currentTarget.dataset.id
        $api.ajax(`/app/store/getGoodsInfo/${this.data.storeId}/${data.goodsId}`,'get').then(res => {
            if(res.code != 0 ){
              wx.showToast({
                title: res.msg,
                icon: 'none',
              })
              return
            }
            res.data['setMealGoodsList'] = res.data.setMealGoodsList
            res.data['infoPicture'] = res.data.infoPicture
            this.setData({
                detailsInfo:res.data,
                seeDetail:true
            })
        })
    },
    closeDetail(){
        this.setData({
          seeDetail:false
        })
    },
    regionchange(e) {
        // console.log(e.type)
    },
    markertap(e) {
        // console.log(e.detail.markerId)
    },
    controltap(e) {
        // console.log(e.detail.controlId)
    },
    copy(){
        wx.setClipboardData({
            data: this.data.orderInfo.orderNo,
        })
    },
    hold(){
        this.setData({
            occupyseat : false
        })
        wx.navigateTo({
            url:'./hold?orderNo=' + this.data.orderInfo.orderNo
        })
    },

    goCoupons(){
        wx.navigateTo({
            url:`../coupons/coupons?order=${this.data.storeInfo.storeId}&price=${this.data.goodsCouponTotal}&min=${this.data.miniTotal}`
        })
    },
    goCart(){
        wx.navigateBack({
            delta: 1
        })
    },
    goStore(){
        wx.redirectTo({
            url:'../details/details?id=' + this.data.storeInfo.storeId
        })
    },
    getSysInfo(){
        let info = wx.getMenuButtonBoundingClientRect()
        this.setData({
          mobile:info,
        })
    },
    backIcon(){
        let pages = getCurrentPages()
        if(!this.data.orderInfo.orderNo){
            if(pages.length>=1){
                wx.navigateBack({
                  delta: 1
                })
            }else{
                wx.switchTab({
                    url: '/pages/index/index'
                })
            }
        }else{
            let prevPage = pages[pages.length - 2].route
            // 上个页面是购物车
            if(prevPage == 'pages/allGoods/allGoods'){
                // wx.redirectTo({
                //     url:`/pages/details/details?id=${this.data.storeId}`
                // })
                wx.navigateBack({
                    delta: 3
                })
            }else{
                wx.navigateBack({
                    delta: 1
                })
            }
        }
    },
    // 存酒
    saveWine(){
        $api.ajax(`/app/order/applyWine/${this.data.orderInfo.orderNo}`,'put').then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            wx.showToast({
                title: '申请成功',
                icon:'success',
                duration:2000,
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getSysInfo()
        if(options){
            this.setData({
                orderId:options.orderId,
                storeId:options.storeId
            })
        }
        this.getPhone()
        if(this.data.orderInfo){
            this.order(this.data.orderInfo.orderNo)
            this.getStore(this.data.orderInfo.storeId)
            return
        }
        if(options.orderId){
            this.order(options.orderId)
            this.getStore(options.storeId)
            this.setData({
                orderId:options.orderId,
                storeId:options.storeId
            })
            return
        }
        if(options.type == 3){
            // ktv预定
            if(options.orderId){
                // 如果有订单id
            }else{
                let ktv_info = wx.getStorageSync('ktv_info')
                let selectKtvId = wx.getStorageSync('selectKtvId')
                let ktvTimeShowText = '',minPrice = '',TSTime = '',field = ''
                for(let i=0;i<ktv_info.roomTimeIntervalList.length;i++){
                    if(ktv_info.roomTimeIntervalList[i].roomTimeId == selectKtvId){
                        if(ktv_info.roomTimeIntervalList[i].ktvFieldStatus == 2){
                            TSTime = ktv_info.timeDate
                            // 有时间段选择  如果时凌晨场  则日期减1 只用于显示
                            ktv_info.roomTimeIntervalList[i].ktvFieldsDTOS.forEach(v=>{
                                if(v.isSelected == 1){
                                    field = v.field
                                    // v.field  1为凌晨场立即消费 2为今晚消费
                                    if(v.field == 1){
                                        let day = '',daySplit = []
                                        daySplit = TSTime.split('-')
                                        day = daySplit[2] = daySplit[2] - 1
                                        day = day<10?'0' + day : day
                                        daySplit[2] = day
                                        TSTime = daySplit.join('-')
                                    }
                                }
                            })
                        }else{
                            field = 0
                        }
                        ktvTimeShowText = TSTime + ' ' + ktv_info.roomTimeIntervalList[i].startTime + '-' + ktv_info.roomTimeIntervalList[i].endTime + ' 场'
                        minPrice = Number(ktv_info.roomTimeIntervalList[i].minConsumption).toFixed(2)
                        break
                    }
                }
                this.setData({
                    isKtv:3,
                    ktvInfo:ktv_info,
                    snacksList:ktv_info.snacksList,
                    plOrder:0,
                    ktvTimeShowText,
                    storeId:options.storeId || ktv_info.storeId,
                    miniTotal:minPrice,  //ktv最低消费
                    calculateTotal:{
                        field : field,
                        // ids : ktv_info.storeFields.field,
                        // isSelection : ktv_info.storeFields.field,
                        period : selectKtvId,
                        presetDate : ktv_info.timeDate,
                        seatCode : ktv_info.roomId,
                        storeId : ktv_info.storeId,
                    },
                })
                this.getStore(ktv_info.storeId)
                this.getCartList(ktv_info.storeId)
            }
        }else{
            if(options.orderId){
            }else{
                let payInfo = JSON.parse(wx.getStorageSync('payInfo'))
                this.setData({
                    payInfo,
                    storeId:payInfo.storeId,
                    plOrder:0,
                    calculateTotal:{
                        field : payInfo.storeFields.field,
                        // ids : payInfo.storeFields.field,
                        // isSelection : payInfo.storeFields.field,
                        // period : '',
                        presetDate : payInfo.time,
                        seatCode : payInfo.seat.seatCode,
                        storeId : payInfo.storeId,
                    },
                    miniTotal:payInfo.seat.weekPriceList[0].price //清吧/夜店最低消费
                })
                this.getStore(payInfo.storeId)
                this.getCartList(payInfo.storeId)
            }
        }
    },

    // 获取该门店购物车信息
    getCartList(storeId){
        this.theEnd(2)
    },

    // 计算价格
    theEnd(type){
        // 有订单号则在接口中取值
        if(this.data.orderInfo.orderNo){
            this.setData({
                total:this.data.orderInfo.paid == 0? (Number(this.data.orderInfo.orderAmount) - Number(this.data.orderInfo.couponAmount)).toFixed(2):this.data.orderInfo.paidAmount,
                preferential:this.data.orderInfo.discountFee
            })
            return
        }
        
        let total = 0,preferential = 0;
        let data = {
            field: this.data.calculateTotal.field,
            isSelection: 0,
            period: this.data.calculateTotal.period,
            presetDate: this.data.calculateTotal.presetDate,
            seatCode: this.data.calculateTotal.seatCode,
            storeId: this.data.calculateTotal.storeId
        }
        $api.ajax(`/app/pay/settlementOrderInfo`,'post',data).then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            let subtotal = Number(res.data.subtotal)
            let specialOffers = Number(res.data.specialOffers)
            this.setData({
                goodsCouponTotal:subtotal,
                cartList:res.data.shopCartList
            })
            if(this.data.coupons.length>0){
                // 如果使用优惠券
                this.data.coupons.forEach(c=>{
                    if(c.category == 1){
                        subtotal -= c.discountMoney
                    }else if(c.category == 2){
                        subtotal -= c.discountMoney
                    }
                })
                if(subtotal<this.data.miniTotal){
                    this.setData({
                        overPrice : -(subtotal - this.data.miniTotal)
                    })
                }
            }
            
            this.setData({
                total:this.toDecimal2(subtotal) ,
                preferential: this.toDecimal2(specialOffers),
                oldTotal : this.toDecimal2(this.data.goodsCouponTotal + specialOffers) 
            })
        })
    },

    // 价格进一
    priceInto(total,type){
        if(!total)return 0
        if(total.toString().indexOf('.') != -1){
            let pre_index = total.toString().split('.')[0];
            var index=total.toString().split('.')[1];
            if(index.length<2){
                index = index + '0'
            }
            if(index.length>=3){
                index = Number(index.substr(0,2))+1
                total = pre_index + '.' + index
            }
            if(type == 1){
                return +total<=0?this.data.miniTotal : total
            }else{
                return total
            }
        }else{
            if(type == 1){
                return +total<=0?this.data.miniTotal : total
            }else{
                return +total
            }
        }
    },
    toDecimal2(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
         return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
         rs = s.length;
         s += '.';
        }
        while (s.length <= rs + 2) {
         s += '0';
        }
        return s;
    },
    // 到店时间倒计时
    reachTime(timer){
        if(!timer)return
        if(this.data.reachTimeSetTimeout){
            clearInterval(this.data.reachTimeSetTimeout)
        }
        timer = timer.toString().replace(/-/g, '/')
        let time = Number(timer),that = this
        let diff = new Date(time).getTime() -  new Date().getTime()
        if(diff<=0){
            // 已超过15分钟
            this.setData({
                reachTimeDown: `已超过最晚到店时间`,
            })
            return
        }
        let timerSenconds = parseInt(diff/1000) 
        that.data.reachTimeSetTimeout = setInterval(()=>{
            timerSenconds --;
            if(timerSenconds<=0){
                clearInterval(that.data.reachTimeSetTimeout)
                that.setData({
                    reachTimeDown: `已超过最晚到店时间`,
                })
                
            }else{
                let dataTime = unils.timeFormat(time,'',1)
                that.setData({
                    reachTimeDown: `距离到店时间还剩${dataTime}，请尽快到店消费`  
                })
            }
        },1000)
    },    
    // 支付时间倒计时
    payCountdown(endTime){
        if(this.data.payTimerItv){
            clearInterval(this.data.payTimerItv)
        }
        // endtime下单时间
        endTime = endTime.toString().replace(/-/g, '/')
        let time = Number(endTime),that = this
        let diff = new Date(time).getTime() -  new Date().getTime()
        
        if(diff<=0){
            // 已超过15分钟
            this.setData({
                pay_timer: `支付超时，订单已取消`,
                timeOut:true
            })
            return
        }
        let timer = parseInt(diff/1000) 
        that.data.payTimerItv = setInterval(()=>{
            timer --;
            if(timer<=0){
                clearInterval(that.data.payTimerItv)
                that.setData({
                    pay_timer: `支付超时，订单已取消`,
                    timeOut:true  
                })
            }else{
                let dataTime = unils.timeFormat(time,'',1)
                that.setData({
                    pay_timer: `剩余${dataTime}自动取消订单`  
                })
            }
        },1000)
    },


    // 等待时间  计时器
    waitingTime(starTime,endTime='',type){
        clearInterval(this.data.payTimerItv)
        /*
            1 未接单  传支付时间
            2 已接单  传商家接单时间  支付时间
        */
        if(this.data.waitingTimeNum){
            clearInterval(this.data.waitingTimeNum)
        }
        if(typeof starTime == 'string'){
            starTime = starTime.replace(/-/g, '/')
        }
        if(typeof endTime == 'string'){
            endTime = endTime.replace(/-/g, '/')
        }
        let diff;
        // starTime = starTime.toString().replace(/-/g, '/')
        if(type == 1){
            diff = new Date().getTime() -  new Date(starTime).getTime()
        }else{
            // endTime = endTime.toString().replace(/-/g, '/')
            diff = new Date(endTime).getTime() -  new Date(starTime).getTime()
        }
        let timer = parseInt(diff/1000) 
        this.data.waitingTimeNum = setInterval(()=>{
            timer ++ ;
            let dataTime = unils.timeFormat(timer,'',2)
            this.setData({
                waitIng: dataTime
            })
        },1000)
        if(type == 2){
            clearInterval(this.data.waitingTimeNum)
        }
    },

    getPhoneNumber(e){
        unils.userPhone(e).then((res) => { 
            if(!res){
                return
            }
            this.setData({
                hasPhone:true
            })
            this.createOrder()
        }).catch((res) => { 
          wx.showToast({
            title: '授权失败',
            icon:'none',
            duration:2000
          })
        })
    },

    onShow(){
        let userinfo = wx.getStorageSync('userinfo').phone,hasPhone = ''
        userinfo?hasPhone=true:hasPhone=false
        this.setData({
            hasPhone
        })
        if(this.data.showExecute == 0){
            this.setData({
                showExecute : 1
            })
            return
        }
        if(this.data.orderId){
            this.order(this.data.orderId)
        }
        let pages = getCurrentPages();
        let currPage = pages[pages.length - 1];
        let coupons = currPage.data.predata
        if(coupons){
            this.setData({
                coupons
            })
        }else{
            this.setData({
                coupons:[]
            })
        }
        this.theEnd(4)
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
    // 忘记密码
    forget(){
        wx.navigateTo({
            url: '../personSet/passwordSet/passwordSet',
        })
    },
    getStore(id){
        let lat = '',lon = ''
        if(wx.getStorageSync('lat_lng')){
            lat = wx.getStorageSync('lat_lng').split(',')[0]
            lon = wx.getStorageSync('lat_lng').split(',')[1]
        }else{
            lat = 0,
            lon = 0
        }
        $api.ajax(`/app/store/getInfoById`,'post',{
            lat,
            lon,
            storeId: id
        }).then(res=>{
            if(res.code!=0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000
                })
            }else{
                res.data.storeInfo.starWidth = res.data.storeInfo.score * 2 * 10 + '%'
                res.data.storeInfo.score = Number(res.data.storeInfo.score).toFixed(1)
                let lonlat = res.data.storeInfo.lonlat.split(',')
                let lat = `markers[0].latitude`
                let lng = `markers[0].longitude`
                this.setData({
                    storeInfo:res.data.storeInfo,
                    detailsPhone:res.data.storeInfo.customerServicePhoneList,
                    [lat]:lonlat[0],
                    [lng]:lonlat[1],
                })
            }
        })
    },
    openMap(){
        let latitude = +this.data.storeInfo.lonlat.split(',')[0]
        let longitude = +this.data.storeInfo.lonlat.split(',')[1]
        wx.openLocation({
          latitude,
          longitude,
          scale: 18,
          name:this.data.storeInfo.trustAddress,
          address:this.data.storeInfo.trustAddress,
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
    createOrder(){
        let storeId =  this.data.storeId || this.data.orderInfo.storeId
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


        if(this.data.orderInfo){
            this.setData({
                pay:!this.data.pay
            })
            return
        }

        let tel = wx.getStorageSync('userinfo').phone
        if(this.data.tel){
            if(!(/(^0\d{2,3}\-\d{7,8}$)|(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(this.data.tel))){ 
                wx.showToast({
                    title: '请输入标准格式手机号',
                    icon:'none',
                    duration:2000,
                })
                return
            }   
        }
        if(!tel && !this.data.tel){
            wx.showToast({
                title: '请输入标准格式手机号',
                icon:'none',
                duration:2000,
            })
            return
        }
        this.setData({
            pay:!this.data.pay
        })
    },

    popup(e){
        let type = e.currentTarget.dataset.type
        /*
            1删除   2取消
        */
        if(type == 1){
            this.setData({
                popup_txt:'确认删除订单？',
                isShowSelType:!this.data.isShowSelType,
                popup_type:type
            })
        }else if(type == 2){
            $api.ajax(`/app/pay/cancel/orderCheck/${this.data.orderInfo.orderNo}`,'get').then(res => {
                if(!res.code == 0){
                    wx.showToast({
                        title: res.msg,
                        icon:'none',
                        duration:2000,
                    })
                    return
                }
                this.setData({
                    popup_txt:res.data,
                    isShowSelType:!this.data.isShowSelType,
                    popup_type:type
                })
            }) 
        }
    },

    closeOrder(){
        this.setData({
            isShowSelType:!this.data.isShowSelType
        })
    },
    confirmOrder(){
        this.setData({
            isShowSelType:!this.data.isShowSelType
        })
        this.data.popup_type == 1?this.deteleOrder():this.cancelOrder()
    },
    hiddenJifen(){
        this.setData({
            jifenState : 0
        })
    },
    goBuyCard(){
        this.setData({
            jifenState:0
        })
        wx.navigateTo({
            url: '../clubCard/clubCard?type=0&storeId='+ this.data.storeInfo.storeId,
        })
    },

    cancelOrder(){
        let data = {
            closedReason:'',
            orderNo:this.data.orderInfo.orderNo
        }
        $api.ajax(`/app/pay/cancel/order`,'post',data).then(res => {
            if(!res.code == 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }

            wx.showToast({
                title: '取消成功',
                icon:'success',
                duration:1500,
            })
            setTimeout(()=>{
                this.backIcon()
            },1500)
        }) 
    },
    deteleOrder(){
        $api.ajax(`/app/order/${this.data.orderInfo.orderNo}/del`,'delete').then(res => {
            if(!res.code == 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            wx.showToast({
                title: '删除成功',
                icon:'success',
                duration:1500,
            })
            setTimeout(()=>{
                this.backIcon()
            },1500)
        }) 
    },
    reminder(){
        $api.ajax(`/app/order/reminder/${this.data.orderInfo.orderNo}`,'get').then(res => {
            if(!res.code == 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }

            wx.showToast({
                title: '催单成功',
                icon:'success',
                duration:2000,
            })
        }) 
    },

    // 查看已占座信息
    lookOccupyseat(){
        this.setData({
            occupyseat : !this.data.occupyseat
        })
    },

    filterTime(){
        let nowTime = new Date().getTime()
        let occupyTime = this.data.orderInfo.occupySeatTime * 60 * 1000 //占座时间的秒数
        this.data.orderInfo.retentionTime = this.data.orderInfo.retentionTime.replace(/-/g, '/')
        let lastTime = new Date(this.data.orderInfo.retentionTime).getTime()  //最晚保留时间 毫秒
        
        let timer = "00:00:00",that = this
        // nowTime = new Date('2021-01-06 23:55').getTime()
        if(this.data.occupyseat_itv){
            clearInterval(this.data.occupyseat_itv)
        }
        if(!lastTime){
            lastTime = new Date().getTime()
        }
        
        if(nowTime < lastTime){
            this.setData({
                occupyseatTime : unils.timeFormat(occupyTime/1000,'',4) 
            })
        }else{
            timer = (occupyTime - (nowTime - lastTime))
            timer = parseInt(timer/1000) 
            if(timer <= 0){
                clearInterval(this.data.occupyseat_itv)
                this.setData({
                    occupyseatTime: '00:00:00'
                })
                return
            }
            
            this.data.occupyseat_itv = setInterval(()=>{
                timer -- ;
                if(timer<=0){
                    clearInterval(this.data.occupyseat_itv)
                }
                this.setData({
                    occupyseatTime: unils.timeFormat(timer,'',4)
                })
            },1000)
            
        }
    },

    // 追加订单
    addTo(){
        wx.navigateTo({
          url: `../allGoods/allGoods?addTo=${this.data.orderInfo.orderNo}&storeId=${this.data.orderInfo.storeId}`,
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


    // 支付  创建订单
    weixin(type){
        wx.showLoading({
            title: '加载中',
            mask:true,
        })
        if(type){
            this.setData({
                payType:type
            })
        }
        if(this.data.orderInfo){
            // 如果已生成订单
            // this.weixinPay(this.data.orderInfo)
            this.unpaid(this.data.orderInfo) //待支付的订单
            return
        }
        let isSelection = this.data.cartList.length>0?0:1
        var cartId = '',arr=[],that = this
        if(this.data.cartList.length>0){
            arr = this.data.cartList.map((v)=>{return v.id})
            cartId = arr.join(',')
        }
        var data = {
            isSelection,
            orderType:0,
            orderSource:1,
            cartIds:cartId,

            // storeId:this.data.payInfo.storeId,
            // presetDate:this.data.payInfo.time,
            remarks:this.data.remake,
            orderAmount:this.data.total,
            contactName:this.data.username,
            contactTel:this.data.tel
        }
        
        if(this.data.isKtv == 3){
            let selectId = wx.getStorageSync('selectKtvId')
            let selectRoom = '',field=""
            this.data.ktvInfo.roomTimeIntervalList.forEach((v,i)=>{
                if(v.roomTimeId == selectId){
                    selectRoom = v.roomTimeId
                    if(v.ktvFieldStatus == 2){
                        v.ktvFieldsDTOS.forEach(j=>{
                            if(j.isSelected == 1){
                                field = j.field
                            }
                        })
                    }else{
                        field = 0
                    }
                }

            })
            let str = JSON.stringify(this.data.ktvInfo.timeDate)
            let payTime = JSON.parse(str).replace(/\//g, '-');
            data['ktvRoomId'] = this.data.ktvInfo.roomId  
            data['period'] = selectRoom
            data['seatCode'] = ''
            data['presetDate'] = payTime
            data['storeId'] = this.data.ktvInfo.storeId
            data['field'] = field
        }else{
            let str = JSON.stringify(this.data.payInfo.time)
            let payTime = JSON.parse(str).replace(/\//g, '-');
            data['ktvRoomId'] = ''
            data['period'] = ''
            data['seatCode'] = this.data.payInfo.seat.seatCode
            data['presetDate'] = payTime
            data['storeId'] = this.data.payInfo.storeId
            data['field'] = this.data.payInfo.storeFields.field
        }
     
        $api.ajax(`/app/pay/create/order`,'post',data).then(res => {
            wx.hideLoading()
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            setTimeout(function () {
                that.order(res.data.orderNo)
            }, 1500)
            this.setData({
                orderInfo:res.data,
                // username:
            })
            this.weixinPay(res.data)
            
        })
    },
    // 积分支付成功  查看订单
    goOrder(){
        this.setData({
            jifenState:0
        })
        this.order(this.data.orderInfo.orderNo)
        // setTimeout(function () {
        // }, 1500)
    },
    // 创建订单之后  调用订单详情接口

    order(orderId){
        wx.showLoading({
            title: '加载中...',
            mask:true,
        })
        $api.ajax(`/app/order/${orderId}/info`,'get').then(res => {
            if(res.code != 0){
                wx.hideLoading()
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            prevPage.setData({
                ispayBack:1
            })
            let is_pay = null;
            let storeState = null
            let tips = '';
            if(res.data.paid == 0){
                // 未支付
                is_pay = 2
                storeState = -2
                this.payCountdown(res.data.orderClosedTime)
            }else{
                if(res.data.takeTime == ""){
                    // 商家未接单 已等待时间
                    let timer = ''
                    if(!res.data.paidTime){
                        timer = new Date().getTime()
                    }else{
                        timer = res.data.paidTime ? res.data.paidTime : new Date().getTime()
                    }
                    this.waitingTime(timer,'',1)
                }else{
                    this.waitingTime(res.data.takeTime,res.data.paidTime,2)
                    // 商家已接单
                }
                // 已支付
                //判断商家那边是否接单等状态
                switch(res.data.status){
                    case 0:
                        is_pay = 1
                        storeState = -1
                        break
                    case 1:
                        // 已接单
                        if(res.data.takeTime == ''){
                            // 接单时间如果为空  则是待接单状态
                            is_pay = 1
                            storeState = -1
                        }else{
                            is_pay = 3
                            storeState = 0
                        }
                        break
                    case 2:
                        // 已拒绝
                        storeState = 1
                        is_pay = 1
                        break
                    case 3:
                        // 未到店
                        storeState = 2
                        tips = '未到店'
                        is_pay = 3
                        break
                    case 4:
                        // 已到店
                        storeState = 3
                        is_pay = 3
                        break
                    case 5:
                        // 未消费
                        storeState = 4
                        is_pay = 3
                        tips = '未消费'
                        break
                    case 6:
                        // 已离开
                        storeState = 5
                        is_pay = 3
                        break
                    
                    default:
                        // 如果为空  则是待接单状态
                        is_pay = 1
                        storeState = -1
                }   
            }
            res.data.goodsList.forEach(v=>{
                v['listPicture'] = v.goodsPicture
                v['number'] = v.quantity
                v['presentPrice'] = v.activityPrice
            })

            if(res.data.orderType == 0){
                res.data['typeText'] = '预定桌'
            }else if(res.data.orderType == 1){
                res.data['typeText'] = 'AA拼单'
            }else if(res.data.orderType == 2){
                res.data['typeText'] = '抢座'
            }else if(res.data.orderType == 3){
                res.data['typeText'] = '会员卡'
            }else if(res.data.orderType == 4){
                res.data['typeText'] = '线下添单'
            }

            this.reachTime(res.data.arrivalTime)
            this.setData({
                orderInfo:res.data,
                ['payInfo.seat.seatCode']:res.data.seatCode,
                ['payInfo.seat.numberOfPeople']:res.data.seatCapacity,
                ['payInfo.seat.seatLatestReservationTime']:res.data.retentionTime,
                ['payInfo.seat.minConsumption']:res.data.minAmount,
                ['payInfo.goods']:res.data.goodsList,
                ['payInfo.storeLocation']:res.data.storeLocation,
                miniTotal:res.data.minAmount,
                username:res.data.contactName,
                tel:res.data.contactTel,
                remake:res.data.remarks || '无',
                payState:is_pay,
                storeState:storeState,
                snacksList:res.data.snacksList,
                tips,
                pay:true,
                cartList:res.data.groupGoods,
                orderId:res.data.orderNo,
                coupons:res.data.couponAmount, //优惠券分2个字段
                // coupons:res.data.couponDTOList //已废除字段  
                // isKtv:res.data.storeLocation
            })

            this.filterTime()
            wx.removeStorageSync('coupons')
            wx.removeStorageSync('pay_timer')
            wx.removeStorageSync('payInfo')
            wx.removeStorageSync('ktv_info')
            this.theEnd(1)
            wx.hideLoading()
        })
    },
    //待支付
    unpaid(val){
        let that = this
        let data = {
            capitalPassword: this.data.passWord,
            deviceType: this.data.platform,
            outTradeNo: val.outTradeNo,
            payWay: this.data.payType,
            orderSource:1
        }
        $api.ajax(`/app/pay/continuePay`,'post',data).then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                wx.hideLoading()
                return
            }
            that.setData({
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
                wx.hideLoading()
                return
            }
            // 积分支付 payType
            if(that.data.payType == 2){
                if(wx.getStorageSync('pay_timer')){
                    wx.removeStorageSync('pay_timer')
                }
                that.setData({
                    showPsw:false,
                    payState:1,
                    pay:true,
                    jifenState : 1,
                })
                wx.hideLoading()
                wx.showToast({
                    title: '支付成功',
                    icon:'success',
                    duration:1500,
                })
                setTimeout(function () {
                    that.order(val.orderNo)
                }, 1500)
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
                    wx.hideLoading()
                    if(wx.getStorageSync('pay_timer')){
                        wx.removeStorageSync('pay_timer')
                    }
                    // wx.showToast({
                    //     title: '支付成功',
                    //     icon: 'success',
                    //     duration: 1500,
                    // })
                    that.setData({
                        payState:1,
                        pay:true,
                        jifenState : 1,
                    })
                    // wx.showLoading({
                    //     title: '加载中...',
                    // })
                    // setTimeout(function () {
                    //     that.order(val.orderNo)
                    // }, 1000)
                },
                fail (err) { 
                    wx.hideLoading()
                    wx.showToast({
                        title: '取消支付',
                        icon: 'none',
                        duration: 1500,
                    })
                    that.setData({
                        payState:2,
                        pay:true
                    })
                }
            })
            
        })
    },
    //支付
    weixinPay(val){
        wx.showLoading({
            title: '加载中',
            mask:true,
        })
        let that = this
        let coupId = this.data.coupons.map((i)=>{return i.id})
        !coupId?'':coupId = coupId.join(',')
        let data = {
            capitalPassword:this.data.passWord,
            orderNo:val.orderNo,
            payAmount:val.orderAmount==0?this.data.total:val.orderAmount,
            payWay:this.data.payType,
            deviceType:this.data.platform,
            userCouponIds:coupId,
        }
        $api.ajax(`/app/pay/unified/order`,'post',data).then(res => {
            that.setData({
                code0:null,
                code1:null,
                code2:null,
                code3:null,
                code4:null, 
                code5:null,
            })
            if(res.code != 0){
                wx.hideLoading()
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
                if(wx.getStorageSync('pay_timer')){
                    wx.removeStorageSync('pay_timer')
                }
                that.setData({
                    showPsw:false,
                    payState:1,
                    pay:true,
                    jifenState : 1,
                })
                wx.hideLoading()
                // wx.showToast({
                //     title: '支付成功',
                //     icon:'success',
                //     duration:1500,
                // })
                // setTimeout(function () {
                //     that.order(val.orderNo)
                // }, 1500)
                console.log(1111)
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
                    wx.hideLoading()
                    if(wx.getStorageSync('pay_timer')){
                        wx.removeStorageSync('pay_timer')
                    }
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 1500,
                    })
                    that.setData({
                        payState:1,
                        pay:true
                    })
                    setTimeout(function () {
                        that.order(val.orderNo)
                    }, 1500)
                },
                fail (err) { 
                    wx.hideLoading()
                    wx.showToast({
                        title: '取消支付',
                        icon: 'none',
                        duration: 1500,
                    })
                    that.setData({
                        payState:2,
                        pay:true
                    })
                }
            })
        })
    },


    // 积分支付
    jifen(type){
        // 判断是否有积分  和资金密码
        let storeId =  this.data.storeId || this.data.orderInfo.storeId
        $api.ajax(`/app/store/getVipPoint/${storeId}`,'get').then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            let that = this
            if(Number(res.data.vipPoint) < Number(this.data.total)){
                this.setData({
                    jifenState : 2,
                    pay:!this.data.pay
                })
                return
            }
            if(!res.data.isCapitalPassword){
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
            show:false
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

    // 键盘
    bind_num(e) {
        this.data.num[e.target.dataset.index].colorFlag = true
        this.setData({
            num: this.data.num
        })
        setTimeout(() => {
            this.data.num[e.target.dataset.index].colorFlag = false
            this.setData({
                num: this.data.num
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
                truepassNum: ['', '', '', '', '', ''],
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

    onPullDownRefresh: function () {
        setTimeout(()=>{
            wx.showToast({
                title: '刷新成功',
                icon:'none',
                duration:1000,
            })
            this.onLoad()
        },1000)
    },

    onHide(){
        clearInterval(this.data.payTimerItv)
        clearInterval(this.data.waitingTimeNum)
        clearInterval(this.data.occupyseat_itv)
    },
    onShareAppMessage(e){
        let info = this.data.orderInfo
        return {
            title : info.contactName + '在' + info.storeName + '商家预定了座位，邀你来喝酒',
            desc:'好友邀你来喝酒',
            path : `/pages/shareInfo/shareInfo?orderId=${info.orderNo}&storeId=${info.storeId}`,
            imageUrl : this.data.addUrl + info.storeLogo
        }
    },
})
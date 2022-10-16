const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderNo:'',
        storeId:'',
        orderInfo:'',
        preferential:'',
        miniTotal:'',
        orderId:'',
        cartList:[],
        coupons:[],
        addUrl:`${$api.fileUrl}`,
        storeInfo:'',
        detailsPhone:[],

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderNo:options.orderId,
            storeId:options.storeId
        })
        this.order()
        this.getStore(options.storeId)
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
    order(){
        wx.showLoading({
            title: '加载中...',
            mask:true,
        })
        $api.ajax(`/app/order/${this.data.orderNo}/shareInfo`,'get').then(res => {
            if(res.code != 0){
                wx.hideLoading()
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:1500,
                })
                setTimeout(()=>{
                    wx.switchTab({
                        url: '/pages/index/index'
                    })
                },1500)
                return
            }
            let is_pay = null;
            let storeState = null
            let tips = '';
            
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

            this.setData({
                orderInfo:res.data,
                ['payInfo.seat.seatCode']:res.data.seatCode,
                ['payInfo.seat.numberOfPeople']:res.data.seatCapacity,
                ['payInfo.seat.seatLatestReservationTime']:res.data.retentionTime,
                ['payInfo.seat.minConsumption']:res.data.minAmount,
                ['payInfo.goods']:res.data.goodsList,
                ['payInfo.storeLocation']:res.data.storeLocation,
                storeState:storeState,
                snacksList:res.data.snacksList,
                tips,
                miniTotal:res.data.minAmount,
                pay:true,
                cartList:res.data.groupGoods,
                orderId:res.data.orderNo,
                coupons:res.data.couponAmount, //优惠券分2个字段
            })
            wx.hideLoading()
            this.theEnd()
            
        })
    },
    // 计算价格
    theEnd(){
        if(this.data.orderInfo.orderNo){
            this.setData({
                total:this.data.orderInfo.paid == 0? (Number(this.data.orderInfo.orderAmount) - Number(this.data.orderInfo.couponAmount)).toFixed(2):this.data.orderInfo.paidAmount,
                preferential:this.data.orderInfo.discountFee
            })
            return
        }
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
                this.setData({
                    storeInfo:res.data.storeInfo,
                    detailsPhone:res.data.storeInfo.customerServicePhoneList,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
const app = getApp()
const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        addUrl: `${$api.fileUrl}`,
        cardInfo:'',
        tips:[],
        hasPhone:true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.getVipCard(options.id) 
        this.setData({
            cardInfo:wx.getStorageSync('vipCard')
        })
        this.getTips()
    },

    // getVipCard(id){
    //     $api.ajax(`/app/vipCard/notBuyVip/${id}`, 'get').then(res => {
    //         if (res.code != 0) {
    //             wx.showToast({
    //                 title: res.msg,
    //                 icon: 'none',
    //             })
    //             return
    //         }
    //         this.setData({
    //             cardInfo: res.data
    //         })
    //     })        
    // },

    // 获取tips
    getTips(){
        $api.ajax(`/app/vipCard/vipShow`, 'get').then(res => {
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                })
                return
            }
            let newText = res.data.content.split(/[(\r\n)\r\n]+/)
            this.setData({
                tips: newText
            })
        }) 
    },

    buyCard(e){
        wx.showLoading({
            title: '加载中',
            mask:true,
        })
        let info = e.currentTarget?e.currentTarget.dataset.data:e
        let data = {
            goodsId: info.id,
            payWay: 1,
            storeId: info.storeId,
            orderSource:1,
        }
        $api.ajax(`/app/pay/purchaseVipCard`, 'post',data).then(res => {
            wx.hideLoading()
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                })
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
                    wx.showToast({
                        title: '支付成功',
                        icon: 'success',
                        duration: 2000,
                    })
                },
                fail (err) { 
                    wx.showToast({
                        title: '取消支付',
                        icon: 'none',
                        duration: 2000,
                    })
                }
            })

        })         
    },
    // 

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let userinfo = wx.getStorageSync('userinfo').phone,hasPhone = ''
        userinfo?hasPhone=true:hasPhone=false
        this.setData({
            hasPhone
        })
    },
    getPhoneNumber(e){
        let data = e.currentTarget.dataset.data
        unils.userPhone(e).then((res) => { 
            if(!res){
                return
            }
            this.setData({
                hasPhone:true
            })
            this.buyCard(data)
        }).catch((res) => { 
          wx.showToast({
            title: '授权失败',
            icon:'none',
            duration:2000
          })
        })
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
const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canIUseGetUserProfile:false,//是否支持最新授权方式
        isLogin:true,
        id:'',
        couponInfo:{},
        show:false,
        childComponent:{}
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
        let token = wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo').token : ''
        if(token){
            this.setData({
                isLogin:false
            })
        }
        let a =  decodeURIComponent(options.q)
        let index = a.indexOf('?')
        let b = a.substr(index+1)
        let c = b.split('&')
        let id = c[0].substr(3)
        this.setData({
            id 
        })
        this.getCoupon()
    },
    receiveCoupon(){
        $api.ajax(`/app/userGetCouponByExtensionCouponId?id=${this.data.id}`,'get').then(res=>{
            if(res.code == 0){
                wx.showToast({
                    title: '领取成功',
                    icon:'success',
                    duration:2500
                })
                setTimeout(()=>{
                    this.indexPage()
                },2500)
            }else{
                wx.showToast({
                    title: res.msg,
                    icon:'none'
                })
                setTimeout(()=>{
                    this.indexPage()
                },2500)
            }
        })
    },

    getCoupon(){
        $api.ajax(`/app/getExtensionCouponMSG?id=${this.data.id}`,'get').then(res=>{
            if(res.code == 0){
                this.setData({
                    couponInfo:res.data
                })
            }else{
                wx.showToast({
                    title: res.msg,
                    icon:'none'
                })
            }
        })
    },


    // 最新授权登录
    getUserProfile(e){
        wx.showLoading({
            title: '正在登录',
        })
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (result) => {
                unils.userLogin(result,this.data.id).then((res) => { 
                    wx.hideLoading()
                    if(!res){
                        return
                    }
                    this.setData({
                        isLogin:false
                    })
                    this.receiveCoupon()
                }).catch((res) => { 
                    wx.hideLoading()
                    wx.showToast({
                        title: '登录失败，请重试',
                        icon:'none',
                        duration:2500
                    })
                })
            },fail: (err) => {
                wx.hideLoading()
                wx.showToast({
                    title: '授权失败',
                    icon:'none',
                    duration:2500
                })
            }
        })
    },

    bindGetUserInfo(e){
        wx.showLoading({
            title: '正在登录',
        })
        unils.userLogin(e,this.data.id).then((res) => { 
            wx.hideLoading()
            if(!res){
                return
            }
            this.setData({
                isLogin:false
            })
            
            this.receiveCoupon()
        }).catch((res) => { 
            wx.hideLoading()
            wx.showToast({
                title: '登录失败，请重试',
                icon:'none',
                duration:2500
            })
        })
    },
   
    indexPage(){
        wx.switchTab({
          url: '../index/index',
        })
    },

    leavePage(){
        this.setData({
            show:true
        })
    },

    confirm(e){
        this.indexPage()
    },
    cancel(e){
        this.setData({
            show:false
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
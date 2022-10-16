const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showLogin:true,
        openPhone:false,
        id:'',
        canIUseGetUserProfile:false,//是否支持最新授权方式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo').token : ''
        if(token){
            this.setData({
                showLogin:false
            })
            this.logout()
        }
        let a =  decodeURIComponent(options.q)
        let index = a.indexOf('?')
        let b = a.substr(index+1)
        let c = b.split('&')
        let id = c[0].substr(3)
        this.setData({
            id
        })

        if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true
            })
        }
    },
    indexPage(){
        wx.switchTab({
          url: '../index/index',
        })
    },
    logout(){
        $api.ajax('/app/logout','post').then(res=>{
            if(res.code == 0){
              wx.removeStorageSync('userinfo')
              wx.removeStorageSync('coupons')
              wx.removeStorageSync('pay_timer')
              wx.removeStorageSync('payInfo')
              wx.removeStorageSync('ktv_info')
              wx.removeStorageSync('useCart')
              wx.removeStorageSync('selectKtvId')

              this.setData({
                showLogin:true,
              })
              wx.login({
                success: res => {
                  wx.setStorageSync('code', res.code)
                }
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
                        showLogin:false
                    })
                    if(res.phone == ''){
                        this.setData({
                            openPhone:true
                        })
                    }else{
                        wx.showToast({
                            title: res.msg,
                            icon:'none',
                            duration:1500
                        })
                        setTimeout(()=>{
                            this.indexPage()
                        },1500)
                    }
                }).catch((res) => { 
                    wx.hideLoading()
                    wx.showToast({
                        title: '登录失败，请重试',
                        icon:'none',
                        duration:2000
                    })
                })
            },fail: (err) => {
                wx.hideLoading()
                wx.showToast({
                    title: '授权失败',
                    icon:'none',
                    duration:2000
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
                showLogin:false
            })
            if(res.phone == ''){
                this.setData({
                    openPhone:true
                })
            }else{
                this.indexPage()
            }
        }).catch((res) => { 
            wx.hideLoading()
            wx.showToast({
                title: '登录失败，请重试',
                icon:'none',
                duration:2000
            })
        })
    },

    // 关闭弹窗
    cancel(){
        this.setData({
            openPhone:false,
        })
        this.indexPage()
    },
    getPhoneNumber(e){
        this.setData({
            openPhone:false
        })
        unils.userPhone(e).then((res) => { 
            if(!res){
                return
            }
            let tel = wx.getStorageSync('userinfo')
            tel.phone = res.phone
            wx.setStorageSync('userinfo', tel)
            this.indexPage()
        }).catch((res) => { 
            wx.showToast({
                title: '授权失败',
                icon:'none',
                duration:2000
            })
            setTimeout(()=>{
                this.indexPage()
            },1500)
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
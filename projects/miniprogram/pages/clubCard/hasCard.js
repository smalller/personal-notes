const app = getApp()
const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addUrl: `${$api.fileUrl}`,
        info:'',
        tips:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            info:wx.getStorageSync('vipCard')
        })
        this.getTips()
    },
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
        wx.removeStorageSync('vipCard')
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
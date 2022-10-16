const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        joinUrl:`${$api.baseUrl}`,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            url:`${this.data.joinUrl}/lottery/src/diceGame/diceGame.html`
        })
    },

    // onShareAppMessage(res) {
    //     $api.ajax(`/app/lottery/share`,'get')
    //     let share = this.data.shareContent
    //     return {
    //         title: share.shareTitle,
    //         desc: share.shareDesc,
    //         path: share.url,
    //         imageUrl: share.shareImage,
    //         success: function(data) {
    //             console.log(data)
    //         }
    //     }
    // },
    

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
})
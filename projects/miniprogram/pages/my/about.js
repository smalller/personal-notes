// pages/my/about.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        versions:'1.0.9',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var accountInfo = wx.getAccountInfoSync();
        this.setData({
            versions:accountInfo.miniProgram.version
        })
    },
})
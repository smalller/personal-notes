const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        joinUrl:`${$api.baseUrl}`,
        url:'',
        shareContent:'',
        web_src:'', // 嵌入的网址
        sharetitle:'', // 指定分享的标题
        share_src:'',  // 指定分享的网址
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let token = wx.getStorageSync('userinfo')?wx.getStorageSync('userinfo').token:''
        this.setData({
            // url:`${this.data.joinUrl}/lottery/src/egg/egg.html?token=${token}&time=${new Date().getTime()}`
            url:`${this.data.joinUrl}/lottery/src/blindBox/blindBox.html?token=${token}&time=${new Date().getTime()}`

        })
    },
    bindmessage(e){
        this.setData({
            shareContent:e.detail.data[e.detail.data.length-1]
        })
    },

    onShareAppMessage(res) {
        $api.ajax(`/app/lottery/share`,'get')
        let share = this.data.shareContent
        return {
            title: share.shareTitle,
            desc: share.shareDesc,
            path: share.url,
            imageUrl: share.shareImage,
            success: function(data) {
                console.log(data)
            }
        }
    },
    
    // onShareTimeline(){
    //     return {
    //         title: '盲盒',
    //         query: {
    //           key: ''
    //         },
    //         imageUrl: '../../images/quxiaoshanchu.png'
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
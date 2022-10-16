const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        addUrl: `${$api.fileUrl}`,
        addUrlBefore: `${$api.baseUrl}`,
        activeId:'',
        info:"",
        richText:'',
    },

    goDetail(){
        wx.navigateTo({
            url: `/pages/details/details?id=${this.data.info.storeId}`,
        })
    },

    onShareAppMessage(e){
        let info = this.data.info
        return {
          title : info.storeName + ' | ' + info.name,
          path : '/pages/actInfo/actInfo?id=' + this.data.activeId,
          imageUrl : this.data.addUrl + info.banner
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            activeId : options.id
        })
        this.getInfo()
    },

    getInfo(){
        let that = this
        wx.showLoading({
            title: '加载中...',
        })
        $api.ajax(`/app/active/getOneById/${this.data.activeId}`,'get').then(res => {
            wx.hideLoading()
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            res.data.endTime = res.data.endTime.split(' ')[0]
            res.data.startTime = res.data.startTime.split(' ')[0]

            var newContent= res.data.content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
                let newUrl = ''
                let backUrlProduction = capture.split('=')[0]
                if(capture.indexOf(backUrlProduction+'=') != -1){
                    newUrl = capture.replace(backUrlProduction+'=',that.data.addUrl)
                }
                var newStr=`<img style="height:auto;width:100%" src="${newUrl}" />`;
                return newStr;
            });

            newContent= newContent.replace(/<video [^>]*src=['"]([^'"]+)[^>]*>/gi,function(match,capture){
                let newUrl1 = ''
                let backUrlVideo = capture.split('=')[0]
                if(capture.indexOf(backUrlVideo+'=') != -1){
                    newUrl1 = capture.replace(backUrlVideo+'=',that.data.addUrl)
                }
                var newStr =`<video style="height:auto;width:100%" class="ql-video" controls="controls" controlslist="nofullscreen" type="video/mp4" style="object-fit:fill;width: 100%;" preload="auto" playsinline="true" x-webkit-airplay="allow" x5-video-orientation="portraint" x5-playsinline="true" x5-video-player-fullscreen="true" src="${newUrl1}" >`;
                // // var newStr =` <p style="color:red;>暂不支持视频播放</p>  `;
                return newStr;
            });

            this.setData({
                info : res.data,
                richText : newContent
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
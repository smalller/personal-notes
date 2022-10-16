const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageSize:20,
        keyword:'',
        pageNo:1,
        active:[],
        banner:[],
        addUrl: `${$api.fileUrl}`,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 800,
        whetherNext:true,
    },

    changeSwiper(e){
        let VideoContext = wx.createVideoContext('myVideo', this)
        VideoContext.pause()
    },
    endVideo(){
        this.setData({
            autoplay:true
        })
    },
    playVideo(){
        this.setData({
            autoplay:false
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getList()
        this.bannerList()
    },

    getList(){
        if(!this.data.whetherNext){
            return
        }
        let data = {
            keyword : this.data.keyword,
            pageNo : this.data.pageNo,
            pageSize : this.data.pageSize,
        }
        $api.ajax(`/app/active/appActiveList`,'post',data).then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            if(res.data.list.length>0){
                this.setData({
                    whetherNext:true,
                    pageNo : +this.data.pageNo +1
                })
            }else{
                this.setData({
                    whetherNext:false
                })
            }

            res.data.list.forEach(v=>{     
                this.data.active.push(v)
            })

            this.setData({
                active : this.data.active
            })
        })
    },
    bannerList(){
        $api.ajax(`/app/active/appActiveBanner`,'post').then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            res.data.forEach(v=>{
                if(v.picture.substr(-3) == 'mp4'){
                    v['isImg'] = false
                }else{
                    v['isImg'] = true
                }
            })
            this.setData({
                banner : res.data
            })
        })
    },
    goDetail(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: './actInfo?id=' + id,
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
        this.getList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
})
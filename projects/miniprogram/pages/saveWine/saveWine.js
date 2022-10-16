const $api = require('../../utils/api')
const computedBehavior = require('miniprogram-computed')
Page({
    behaviors: [computedBehavior],
    /**
     * 页面的初始数据
     */
    data: {
        pageNo:1,
        pageSize:10,
        wineList:[],
        property:'',
        isMore:true,
        addUrl: `${$api.fileUrl}`,
        initial: '', //输入框初始类容
        timer_idx:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getWine()
    },
    searchInp(e) {
        this.setData({
          initial: e.detail.value
        })
    },
    watch: {
        'initial': function(val) {
            this.debounce()
        },
    },
    debounce() {   
        clearTimeout(this.data.timer_idx); 
        this.data.timer_idx = setTimeout(()=>{
            this.setData({
                wineList:[],
                pageNo:1,
                isMore:true
            })
            this.getWine()
        },1000)
    },

    getWine(){
        if(!this.data.isMore){
            return
        }
        wx.showLoading({
            title: '加载中',
        })
        let data = {
            pageNo:this.data.pageNo,
            pageSize:this.data.pageSize,
            storeName:this.data.initial,
        }
        $api.ajax(`/app/order/inventoryWine`,'post',data).then(res => {
            wx.hideLoading()
            wx.hideNavigationBarLoading()
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            if(res.data.inventoryWineItemList.list.length>0){
                this.setData({
                    isMore:true,
                    pageNo:this.data.pageNo +1
                })
            }else{
                this.setData({
                    isMore:false
                })
            }
            res.data.inventoryWineItemList.list.forEach(v=>{
                this.data.wineList.push(v)
            })
            this.setData({
                wineList: this.data.wineList,
                property: res.data.asset
            })
        })
    },

    downOrder(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: '../details/details?id=' + id,
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
        wx.showNavigationBarLoading(
            {
                success:res=>{
                    if(res.errMsg=="showNavigationBarLoading:ok"){
                        this.getWine()
                    }
                }
            }
        );
    },
})
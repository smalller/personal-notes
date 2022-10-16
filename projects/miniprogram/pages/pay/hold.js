const $api = require('../../utils/api')
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // '30分钟','60分钟','90分钟','120分钟','150分钟'
        timeClassification:[],
        active:"",
        explain:[],
        orderNo:'',
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            orderNo:options.orderNo
        })
        this.occupyseatList()
    },
    occupyseatList(){
        $api.ajax(`/app/pay/occupyseatList`,'get').then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            res.data.occupyDesc = res.data.occupyDesc.split(/[(\r\n)\r\n]+/)
            this.setData({
                timeClassification : res.data.occupyseatpricedtos,
                explain : res.data.occupyDesc
            })
        })
    },
    changeBtn(e){
        let data = e.currentTarget.dataset.data
        this.setData({
            active:data
        })
    },
    payment(){
        if(!this.data.active){
            wx.showToast({
                title: '请选择占座时长',
                icon: 'none',
                duration: 1500,
            })
            return
        }

        let data = {
            id: this.data.active.id,
            orderNo: this.data.orderNo,
            orderSource: 1,
            payWay:1,
        }
        $api.ajax(`/app/pay/unified/add/occupyseat`, 'post',data).then(res => {
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
                        duration: 1500,
                    })
                    setTimeout(()=>{
                        wx.navigateBack({
                            delta: 1
                        })
                    },1200)
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
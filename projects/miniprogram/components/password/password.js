// components/password/password.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        on:0,
        code0:null,
        code1:null,
        code2:null,
        code3:null,
        code4:null,
        code5:null,

    },
    bindKeyInput(e){
        this.setData({
          on:+e.currentTarget.dataset.index
        })
        
        this.save()
    },

    save(){
        if(this.data.code1 && this.data.code2 && this.data.code3 && this.data.code4 && this.data.code5 && this.data.code0){
            let data = {
                code:this.data.code0+this.data.code1 + this.data.code2 +this.data.code3 +this.data.code4+this.data.code5 ,
            }

            return
            $api.ajax(`/app/user/verifySmsCode`,'post',data).then(res=>{
                if(res.code == 0){
                    wx.redirectTo({
                        url: '../passwordSet/passwordSet?back=true'
                    })
                }else{
                    wx.showToast({
                        title: res.msg,
                        icon:'none'
                    })
                }
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
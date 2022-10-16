const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        text:'获取验证码',
        phone:null,
        code:null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
    },
    getCode(){
        return
        $api.ajax(`/app/smsCode/${this.data.phone}`,'get').then(item=>{

        })
    },
    login(){
        let data = {
            avatar: "",
            code: "",
            lat: 1,
            lon: 2,
            nickName: "",
            phone: this.data.phone,
            smsCode: this.data.code
        }
        $api.ajax(`/app/bindPhone`,'post',data).then(res=>{
            console.log(res)
        })
    },

    getInfo(){
        wx.login({
            success (res) {
                if (res.code) {
                    let data = {
                        code: res.code
                    }
                    $api('/app/login','post',data,{'content-type':'application/x-www-form-urlencoded'}).then(item=>{
                        wx.showToast({
                            title: '登录成功',
                            icon:'success',
                            duration:2000,
                        })
                        wx.setStorage({
                            key:"userinfo",
                            data:item
                        })
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },

})
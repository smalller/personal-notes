const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag:true,
        content:'',
    },
    check() {
      this.setData({
        flag: !this.data.flag
      })
      this.getAgree()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getAgree()
    },

    getAgree(){
      let type = this.data.flag?'2364d428c38793bc2d0fbc3954751d3e':'21089449babeef9915e174c06f58b219'
      let data = {
        type
      }
      $api.ajax('/app/agreement/agreementByType','post',data).then(res=>{
        if(res.code == 0){
          this.setData({
            content:res.data
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })          
    }
})
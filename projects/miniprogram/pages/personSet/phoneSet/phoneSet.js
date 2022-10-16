const $api = require('../../../utils/api')
const computedBehavior = require('miniprogram-computed')
let timer;
Page({
  behaviors: [computedBehavior],
  /** 
   * 页面的初始数据
   */
  data: {
    time:'获取验证码',
    seconds:60,
    flag:true,
    phone:'',
    code:'',
  },
  watch: {
    'code': function(val) {
      this.debounce()
    },
  },
  goPerson(){
    wx.navigateTo({
      url: '/pages/personSet/personSet',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  debounce() {   
    clearTimeout(timer); 
    timer = setTimeout(()=>{
      this.save()
    },1000)
  },

  getCode(){
    if(!this.data.flag){
      return
    }
    if(!this.data.phone || !(/^1[3456789]\d{9}$/.test(this.data.phone))){
        wx.showToast({
          title: '请输入标准格式手机号码',
          icon:'none',
          duration:2000,
        })
        return
    }
    let timer = setInterval(()=>{
      this.setData({
        seconds:this.data.seconds-1,
        time:this.data.seconds + '秒',
        flag:false
      })
      if(this.data.seconds < 0){
        clearInterval(timer)
        this.setData({
          seconds:60,
          time:'获取验证码',
          flag:true
        })
      }
    },1000)
    $api.ajax(`/app/user/updatePhoneSmsCode/${this.data.phone}`,'get').then(res=>{
      if(res.code == 0){
        wx.showToast({
          title: '验证码已发送',
          icon:'success'
        })        
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  save(){
    if(!this.data.phone || !(/^1[3456789]\d{9}$/.test(this.data.phone))){
      return
    }    
    if(this.data.code.length == 4){
      let data = {
        code:this.data.code,
        updatePhone:this.data.phone,
      }
      $api.ajax(`/app/user/updatePhone`,'post',data).then(res=>{
        if(res.code == 0){
          wx.showToast({
            title: '修改成功',
            icon:'success'
          })     
          wx.setStorageSync('phone', this.data.phone) 
          wx.navigateBack({delta: 1})
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
        }
      })
    }
  }

})
const $api = require('../../../utils/api')
let timer;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    on:0,
    flag:true,
    seconds:60,
    phone:'',
    code0:null,
    code1:null,
    code2:null,
    code3:null,
    code4:null,
    code5:null,
    // 密码
    showPsw:true,
    passNum: ['', '', '', ''],
    truepassNum: ['', '', '', ''], //做比较的数组
    numArr: [{
      id: 1,
      colorFlag: false,
  },
  {
      id: 2,
      colorFlag: false,
  },
  {
      id: 3,
      colorFlag: false,
  },
  {
      id: 4,
      colorFlag: false,
  },
  {
      id: 5,
      colorFlag: false,
  },
  {
      id: 6,
      colorFlag: false,
  },
  {
      id: 7,
      colorFlag: false,
  },
  {
      id: 8,
      colorFlag: false,
  },
  {
      id: 9,
      colorFlag: false,
  },
  {
      id: 0,
      colorFlag: false,
  },
    ],
    nums: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCode()
    this.setData({
      phone:wx.getStorageSync('userinfo').phone
    })
    
  },
  // bindKeyInput(e){
  //   if(e.detail.value){
  //     this.setData({
  //       on:+e.target.dataset.index
  //     })
  //   }
  //   this.save()
  // },
  getCode(){
    if(!this.data.flag){
      return
    }
    let timer = setInterval(()=>{
      this.setData({
        seconds:this.data.seconds-1,
        flag:false
      })
      if(this.data.seconds < 0){
        clearInterval(timer)
        this.setData({
          seconds:60,
          flag:true
        })
      }
    },1000)
    $api.ajax(`/app/user/updateCapitalPasswordSmsCode`,'get').then(res=>{
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

  // debounce() {   
  //   clearTimeout(timer); 
  //   timer = setTimeout(()=>{
  //     this.save()
  //   },1000)
  // },

  save(){
    // if(this.data.code1 && this.data.code2 && this.data.code3 && this.data.code4){
      let data = {
        // code:this.data.code1 + this.data.code2 +this.data.code3 +this.data.code4 ,
        code : this.data.passWord
      }
      $api.ajax(`/app/user/verifySmsCode`,'post',data).then(res=>{
        wx.hideLoading()
        if(res.code == 0){
          wx.redirectTo({
            url: '../passwordSet/passwordSet?back=true'
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
          this.setData({
            passNum: ['', '', '', ''],
            nums: 0
          })
        }
      })
    // }
  },

  // 键盘
  bind_num(e) {
    let num = e.currentTarget.dataset.num
    this.data.numArr[e.target.dataset.index].colorFlag = true
    this.setData({
      numArr: this.data.numArr
    })
    setTimeout(() => {
        this.data.numArr[e.target.dataset.index].colorFlag = false
        this.setData({
          numArr: this.data.numArr
        })
    }, 100)
    
    this.data.passNum.splice(this.data.nums, 1)
    this.data.passNum.splice(this.data.nums, 0, num)
    this.data.truepassNum.splice(this.data.nums, 1)
    this.data.truepassNum.splice(this.data.nums, 0, num)
    this.setData({
        passNum: this.data.passNum,
        truepassNum: this.data.truepassNum
    })
    this.data.nums++
    let code = this.data.truepassNum.join('')
    if (code.length >= 4) {
        this.setData({
            passWord:code,
            passNum: ['', '', '', ''],
            truepassNum: ['', '', '', ''],
        })
        wx.showLoading({
          title: '加载中...',
          mask:true
        })
        this.save()
    }
  },
  delate() {
    this.data.passNum.splice(this.data.nums - 1, 1)
    this.data.truepassNum.splice(this.data.nums - 1, 1)
    this.data.passNum.splice(this.data.nums - 1, 0, '')
    this.data.truepassNum.splice(this.data.nums - 1, 0, '')
    this.setData({
        passNum: this.data.passNum,
        truepassNum: this.data.truepassNum
    })
    if (this.data.nums <= 0) {
        return
    }
    this.data.nums--
  },
})
const $api = require('../../../utils/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nums: 0,
    isBack:false,//用于修改资金密码 状态
    flag: true,
    aginFlag: true,
    xiugaiFlag: true,
    amendFlag: true,
    num: [{
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
    passNum: ['', '', '', '', '', ''],
    passNumtwo: ['', '', '', '', '', ''],
    truepassNum: ['', '', '', '', '', ''], //做比较的数组
    truepassNumtwo: ['', '', '', '', '', ''], //做比较的数组

  },
  onLoad: function (options) {
    
    if(options.back){
      // 如果是 修改 资金密码  短信成功返回后
      this.setData({
        aginFlag: !this.data.aginFlag,
        flag: !this.data.flag,
        isBack:true    
      })
    }else{
      this.hasPassword()
    }
  },
  check() {
    this.setData({
      aginFlag: false,
      flag: false
    })
  },
  hasPassword(){
    wx.showLoading({
      title: '加载中...',
    })
    $api.ajax(`/app/user/isPassword`,'post').then(res=>{
      wx.hideLoading()
      if(res.code == 0){
        if(res.data == true){
          this.setData({
            aginFlag: true,
            xiugaiFlag: false,
            flag: false,
            xiugaiFlag:false,
            amendFlag:false
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },
  // checkTwo() {

  // },
  goAffirm() {
    wx.navigateTo({
      url: '/pages/personSet/affirmPass/affirmPass'
    })
  },
  // 键盘
  bind_num(e) {
    this.data.num[e.target.dataset.index].colorFlag = true
    this.setData({
      num: this.data.num
    })
    setTimeout(() => {
      this.data.num[e.target.dataset.index].colorFlag = false
      this.setData({
        num: this.data.num
      })
    }, 100)
    this.data.passNum.splice(this.data.nums, 1)
    this.data.truepassNum.splice(this.data.nums, 1)
    this.data.truepassNum.splice(this.data.nums, 0, e.target.dataset.num)
    this.data.passNum.splice(this.data.nums, 0, '·')
    this.setData({
      passNum: this.data.passNum,
      truepassNum: this.data.truepassNum
    })
    this.data.nums++
    // console.log(111)
    if (this.data.passNum[5]) {
      this.setData({
        aginFlag: false,
        amendFlag: !this.data.amendFlag,
        // passNum: ['', '', '', '', '', ''],
        nums: 0
      })
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
  bind_numTwo(e) {
    this.data.num[e.target.dataset.index].colorFlag = true
    this.setData({
      num: this.data.num
    })
    setTimeout(() => {
      this.data.num[e.target.dataset.index].colorFlag = false
      this.setData({
        num: this.data.num
      })
    }, 100)
    this.data.passNumtwo.splice(this.data.nums, 1)
    this.data.truepassNumtwo.splice(this.data.nums, 1)
    this.data.truepassNumtwo.splice(this.data.nums, 0, e.target.dataset.num)
    this.data.passNumtwo.splice(this.data.nums, 0, '·')
    this.setData({
      passNumtwo: this.data.passNumtwo,
      truepassNumtwo: this.data.truepassNumtwo
    })
    this.data.nums++
    if (this.data.truepassNumtwo[5]) {
      if (this.data.truepassNum.toString() == this.data.truepassNumtwo.toString()) {
        this.updatePassword()
      } else {
        wx.showToast({
          title: '密码不一致',
          icon: 'none'
        })
        this.setData({
          passNumtwo: ['', '', '', '', '', ''],
          truepassNumtwo: ['', '', '', '', '', ''],
          nums:0
        })
      }
    }
  },
  delateTwo() {
    this.data.passNumtwo.splice(this.data.nums - 1, 1)
    this.data.truepassNumtwo.splice(this.data.nums - 1, 1)
    this.data.truepassNumtwo.splice(this.data.nums - 1, 0, '')
    this.data.passNumtwo.splice(this.data.nums - 1, 0, '')
    this.setData({
      passNumtwo: this.data.passNumtwo,
      truepassNumtwo: this.data.truepassNumtwo
    })
    if (this.data.nums <= 0) {
      return
    }
    this.data.nums--
  },

  updatePassword(){
    let data = {
      capitalPassword:this.data.truepassNum.join('')
    }
    $api.ajax(`/app/user/setCapitalPassword`,'post',data).then(res=>{
      if(res.code == 0){
        if(this.data.isBack){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500
          })
          let timer;
          timer = setTimeout(()=>{
            clearTimeout(timer)
            wx.redirectTo({
              url: '../personSet'
            })
          },1500)
        }else{
          this.setData({
            aginFlag: true,
            xiugaiFlag: false,
          })
        }
      }else{
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
      }
    })
  },


})
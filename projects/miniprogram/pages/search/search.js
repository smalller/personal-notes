const app = getApp()
const $api = require('../../utils/api')
const computedBehavior = require('miniprogram-computed')
let timer_idx;
Page({
  behaviors: [computedBehavior],
  /**
   * 页面的初始数据
   */
  data: {
    addUrl: `${$api.fileUrl}`,
    searHistory: [],//搜索历史
    hotRecom: [],//热门推荐列表
    num:10,
    searResult: [],//搜索结果展示
    hisFlag: true, //是否点击删除所有图标
    flag: true, //热门 显示隐藏
    initial: '', //输入框初始类容
    searchFlag: true, //搜索框 是否有值  有false  无true
    notHistory:false,//没有历史搜索记录
    searchNull:false,//搜索结果是否为空
    moreIcon:false,//展开
    packUp:false,//收起
    searchClassify:[],
    active:0,
  },
  back() {
    wx.navigateBack({
      delta: 1,
    })
  },
  chenckHis() {
    this.setData({
      hisFlag: !this.data.hisFlag
    })
    if(this.data.searHistory.length<10){
      this.setData({
        packUp:false,
        moreIcon:false,
      })
    }
    if(this.data.searHistory.length == 0){
      this.setData({
        packUp:false,
        moreIcon:false,
        notHistory:false
      })
    }
  },
  chenck() {
    this.setData({
      flag: !this.data.flag
    })
  },
  chenckAll(e) {
    if(e.currentTarget.dataset.type==1){
      this.setData({
        packUp:true,
        moreIcon:false,
        num:10000,
      })
    }else{
      this.setData({
        packUp:false,
        moreIcon:true,
        num:10,
      })
    }
  },
  chenckIinp() {
    this.setData({
      initial: '',
      searchFlag: true
    })
    this.getLocal()
  },
  //删除所有
  delAll() {
    this.setData({
      searHistory: [],
    })
    wx.removeStorageSync('searchHistory')
  },
  //删除单个
  delOne(ind) {
    let index = ind.currentTarget.dataset.index
    this.data.searHistory.splice(index, 1)
    this.setData({
      searHistory: this.data.searHistory
    })
    wx.setStorageSync('searchHistory',this.data.searHistory.join(','))
    this.getLocal()
  },
  searchInp(e) {
    this.setData({
      // searchFlag: false,
      initial: e.detail.value
    })
    // if (e.detail.value) {
    //   this.setData({
    //     searchFlag: false
    //   })
    // } else {
    //   this.setData({
    //     searchFlag: true
    //   })
    // }
  },

  watch: {
    'initial': function(val) {
      this.setData({
        searResult:[]
      })
      this.debounce()
    },
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.hotRecommended()
    this.getLocal()
    this.globalSearchType()
  },
  globalSearchType(){
    $api.ajax('/app/index/globalSearchType/1', 'get').then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        this.setData({
          searchClassify:res.data
        })
      }
    })
  },


  getLocal(){
    if(wx.getStorageSync('searchHistory')){
      let get_sh = wx.getStorageSync('searchHistory').split(',')
      let newArr = Array.from(new Set(get_sh.filter(v=>v)))

      this.setData({
        searHistory:newArr,
        notHistory:true,
      })
      if(newArr.length>10){
        this.setData({
          moreIcon:true
        })
      }
      if(newArr.length<1){
        this.setData({
          moreIcon:false,
          notHistory:false,
          packUp:false,
        })
      }
    }else{
      this.setData({
        notHistory:false,
      })
    }
  },
  filterArr(arr){
    arr.filter(function (s) {
      return s && s.trim();
    });
  },
  debounce() {   
    clearTimeout(timer_idx); 
    timer_idx = setTimeout(()=>{
      this.searchResults()
    },1000)
  },
  // 热门搜索
  hotRecommended(){
    $api.ajax('/app/searchTop/applyList', 'post').then(res => {
      if (res.code != 0) {
        wx.showToast({
          title: '网络错误',
          icon: 'none'
        })
      } else {
        this.setData({
          hotRecom:res.data
        })
      }
    })
  },
  // 搜索结果
  searchResults(){
    let lat_lng = wx.getStorageSync('lat_lng')
    let address = wx.getStorageSync('address')
    let latlon = lat_lng.split(',')
    let data = {
      cityName: address.city,
      lat: latlon[0],
      lon: latlon[1],
      name: this.data.initial,
      orderSource:1,
      type:this.data.active,
      pageNo: 1,
      pageSize: 20
    }
    if(!this.data.initial){
      this.setData({
        searchFlag: true
      })
      return
    }
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    $api.ajax('/app/index/globalSearch', 'post',data).then(res => {
      if (res.code == 0) {
        let sh = wx.getStorageSync('searchHistory')
        let str=''
        str = sh?sh + ',' + this.data.initial:this.data.initial
        wx.setStorage({
          key:"searchHistory",
          data:str
        })
        if(res.data.list.length<1){
          this.setData({
            searchNull:true,
            searResult:res.data.list
          })
        }else{
          this.setData({
            searchNull:false,
            searResult:res.data.list
          })
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
      if(this.data.initial){
        this.setData({
          searchFlag: false
        })
      }
      wx.hideLoading()
    })
  },
  historyOne(e){
    let val = e.currentTarget.dataset.value
    if(val){
      this.setData({
        initial:val,
        searchFlag: false,
      })
    }
  },

  goStore(e){
    let data = e.currentTarget.dataset.data
    let type = e.currentTarget.dataset.parent.type
    if(type == 1){
      wx.navigateTo({
        url:`/pages/details/details?id=${data.id}`,
      })
    }else{
      wx.navigateTo({
        url:`/pages/actives/actInfo?id=${data.id}`,
      })
    }
  },
  hotJump(e){
    let data = e.currentTarget.dataset.data
    if(data.recommendBrand == 1){
      wx.navigateTo({
        url:`/pages/details/details?id=${data.recommendDetails}`,
      })
    }else if(data.recommendBrand == 2){
      wx.navigateTo({
        url:`/pages/actives/actInfo?id=${data.recommendDetails}`,
      })
    }else{
      wx.showToast({
        title: `查看帖子，请前往APP`,
        icon: 'none',
        duration: 2000
      })
    }
  },
  lookMore(e){
    let type = e.currentTarget.dataset.type
    this.switchTypeMore(type)
  },

  switchTypeMore(type){
    this.setData({
      active:type
    }) 
    this.searchResults()
  },
  switchType(e){
    this.setData({
      active:e.currentTarget.dataset.data.type
    })
    this.searchResults()
  },
  



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
})
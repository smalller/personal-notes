const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // shuffList: [],
        canIUseGetUserProfile:false,//是否支持最新授权方式
        isLogin:true,
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 800,
        ktv:'',
        addUrl: `${$api.fileUrl}`, //图片路由
        active:'',
        isShowSelType:false,
        chooseTimePopup:false,
        readState:false,
        seeDetail:false,//查看详情
        detailsInfo:'',
        topText:'',
        show:false,
        childComponent:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    goodsInfo(e){
        let data = e.currentTarget.dataset.id
        $api.ajax(`/app/store/getGoodsInfo/${this.data.ktv.storeId}/${data.goodsId}`,'get').then(res => {
            if(res.code != 0 ){
              wx.showToast({
                title: res.msg,
                icon: 'none',
              })
              return
            }
            
            res.data['setMealGoodsList'] = res.data.setMealGoodsList
            res.data['infoPicture'] = res.data.infoPicture

            this.setData({
                detailsInfo:res.data,
                seeDetail:true
            })
        })
    },
    closeDetail(){
        this.setData({
          seeDetail:false
        })
    },
    closeTime(){
        this.setData({
            chooseTimePopup:false
        })
    },
    readed(){
        this.setData({
          readState:!this.data.readState
        })
    },
    onLoad: function (options) {
        let data = wx.getStorageSync('ktv_info')
        data.ktvReservationNotes = data.ktvReservationNotes.split(/[(\r\n)\r\n]+/)
        data.sketchMap = data.sketchMap.split(',')
        this.setData({
            ktv:data
        })
        if (wx.getUserProfile) {
            this.setData({
              canIUseGetUserProfile: true
            })
        }
    },
    selectTimeFiled(e){
        // 选择场次时 凌晨/夜晚
        let data = e.currentTarget.dataset.data
        let index = e.currentTarget.dataset.index
        this.data.active.ktvFieldsDTOS.forEach((v,i)=>{
            if(v.field == data.field){
                v.isSelected = 1
            }else{
                v.isSelected = 0
            }
        })

        
        let selectTime = this.data.ktv.roomTimeIntervalList
        for(let i=0;i<selectTime.length;i++){
            if(selectTime[i].roomTimeId == this.data.active.roomTimeId){
                selectTime[i] = this.data.active
                break;
            }
        }
        this.setData({
            active : this.data.active,
            ktv:this.data.ktv
        })
        // console.log(this.data.active)
        // console.log(this.data.ktv)
    },
    selectTime(e){
        // 选择时间段
        let data = e.currentTarget.dataset.data
        data.perCapitaConsumption = Number(data.perCapitaConsumption).toFixed(2)
        data.minConsumption = Number(data.minConsumption).toFixed(2)
        /*
            ktvFieldStatus  0-可选 1-过期 2-弹窗
        */
        if(data.ktvFieldStatus == 0){
            this.setData({
                active:data
            })
        }else if(data.ktvFieldStatus == 1){
            wx.showToast({
                title: '该时段暂不可预订',
                icon:'none',
                duration:2000,
            })
        }else if(data.ktvFieldStatus == 2){
            if(data.reserveFlag){
                this.setData({
                    active:data
                })
                return
            }
            this.setData({
                chooseTimePopup:true,
                active:data
            })
        }     
    },
    closeTime(){
        this.setData({
            chooseTimePopup:false,
        })
    },
    cancelPopup(e){
        this.setData({
            show:false,
        })
    },
    confirmPopup(e){
        let chooseTimeRoom = e.detail.data.chooseTimeRoom
        let isTimeOne = e.detail.data.isTimeOne
        this.setData({
            show:false,
        })
        if(chooseTimeRoom.ktvFieldStatus == 2){
            for(let i=0;i<chooseTimeRoom.ktvFieldsDTOS.length;i++){
                if(chooseTimeRoom.ktvFieldsDTOS[i].isSelected == 1){
                    isTimeOne = true
                    break;
                }
            }
        }else{
            isTimeOne = true
        }

        if(!isTimeOne){
            wx.showToast({
                title: '请选择一个时间段',
                icon:'none',
                duration:2000,
            })
            return
        }
        this.goCart()
    },
    reservation(){
        let chooseTimeRoom = this.data.active
        let isTimeOne = false;
        if(!chooseTimeRoom){
            wx.showToast({
                title: '请选择一个时间段',
                icon:'none',
                duration:2000,
            })
            return
        }

        if(!this.data.readState){
            wx.showToast({
              title: '请阅读并勾选注意事项',
              icon:'none',
              duration:2000,
            })
            let query = wx.createSelectorQuery();
            query.select('.content').boundingClientRect();
            query.exec(rect => {
                let e = rect[0];
                wx.pageScrollTo({
                scrollTop: e.bottom,
                });
            })
            return
        }

        if(this.data.ktv.fee > 0){
            this.setData({
                show:true,
                topText:`此包间需线下支付${this.data.ktv.fee}元管理费，到店后，会有相关人员进行线下收取`,
                childComponent:{
                    chooseTimeRoom,
                    isTimeOne
                }
            })
            return
        }
        
        if(chooseTimeRoom.ktvFieldStatus == 2){
            for(let i=0;i<chooseTimeRoom.ktvFieldsDTOS.length;i++){
                if(chooseTimeRoom.ktvFieldsDTOS[i].isSelected == 1){
                    isTimeOne = true
                    break;
                }
            }
        }else{
            isTimeOne = true
        }

        if(!isTimeOne){
            wx.showToast({
                title: '请选择一个时间段',
                icon:'none',
                duration:2000,
            })
            return
        }
        this.goCart()
        // this.setData({
        //     isShowSelType:true
        // })
    },

    // 最新授权登录
    getUserProfile(e){
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (result) => {
                unils.userLogin(result).then((res) => { 
                    if(!res){
                        return
                    }
                    this.setData({
                        isLogin:true
                    })
                    this.reservation()
                }).catch((res) => { 
                    wx.showToast({
                        title: '登录失败，请重试',
                        icon:'none',
                        duration:2000
                    })
                })
            }
        })
    },

    bindGetUserInfo(e){
        wx.showLoading({
          title: '正在登录',
        })
        unils.userLogin(e).then((res) => { 
            if(!res){
                return
            }
            this.setData({
                isLogin:true
            })
            this.reservation()
        }).catch((res) => { 
            wx.showToast({
                title: '登录失败，请重试',
                icon:'none',
                duration:2000
            })
        })
    },

    closeOrder(){
        this.setData({
            isShowSelType:false
        })
    },
    goPay(){
        wx.setStorageSync('selectKtvId', this.data.active.roomTimeId)
        if(wx.getStorageSync('payInfo')){
            wx.removeStorage('payInfo')
        }
        wx.setStorageSync('ktv_info', this.data.ktv)
        wx.setStorageSync('useCart',false)
        wx.redirectTo({
            url:'../pay/pay?type=3',
        })
    },
    // 前往购物
    goCart(){
        wx.setStorageSync('selectKtvId', this.data.active.roomTimeId)
        wx.setStorageSync('ktv_info', this.data.ktv)
        if(wx.getStorageSync('payInfo')){
            wx.removeStorage('payInfo')
        }
        wx.setStorageSync('useCart',true)
        wx.redirectTo({
            url:`../allGoods/allGoods?storeId=${this.data.ktv.storeId}&&type=3`,
        })
    },
    cancel(){
        this.setData({
            isShowSelType:false
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
        let userinfo = wx.getStorageSync('userinfo'),isLogin = ''
        userinfo?isLogin=true:isLogin=false
        this.setData({
          isLogin
        })
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
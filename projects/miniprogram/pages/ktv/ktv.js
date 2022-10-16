const $api = require('../../utils/api')
const unils = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        storeId:'',
        weekArr:[],//顶部展示日期
        curWeekText:'',
        curDay:'',
        curMonth:'',
        timeDate:'',
        ktvList:[],
        addUrl: `${$api.fileUrl}`, //图片路由
        ktvReservationNotes:'',
        minConsumption:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            storeId:options.id
        })
        this.getCurMonthDay()
        this.getDaysWeek();
        // this.getKtv()
    },

    // 获取当前月或日或周
    getCurMonthDay(){
        let date = new Date();
        let week = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
        this.setData({
            curMonth:date.getMonth() + 1,
            curDay:date.getDate(),
            curWeekText:week[date.getDay()]
        })
    },
    getDaysWeek(){    
        let date = new Date();
        let year = date.getFullYear();
        let mouth = date.getMonth() + 1;
        let days ;

        if(mouth == 2){
            days= year % 4 == 0 ? 29 : 28;
        }
        else if(mouth == 1 || mouth == 3 || mouth == 5 || mouth == 7 || mouth == 8 || mouth == 10 || mouth == 12){
            days= 31;
        }
        else{
            days= 30;
        }
        let totalDays = days;
        let curDay = date.getDate();
       
        let arr = [];
        for(let i =0;i<7;i++){
            if(totalDays<curDay+i){
                break;
            }
            arr.push({
                mouth:mouth,
                day:curDay+i,
                year:year
            })
        }
        let nextMouth = mouth
        if(arr.length<7){
            let poor = 7 - arr.length
            nextMouth = mouth+1
            if(nextMouth>12){
                nextMouth = 1
                year = year+1
            }
            for(let i=0;i<poor;i++){
                arr.push({
                    mouth:nextMouth,
                    day:i+1,
                    year
                })
            }
        }
        if(curDay<10){
            curDay = '0'+curDay
        }
        if(nextMouth<10){
            nextMouth = '0'+nextMouth
        }
        arr.forEach(v=>{
            let week = ''
            if(v.mouth<10 && v.mouth.length<2){
              v.mouth = '0' + v.mouth
            }
            week = new Date(`${v.year}/${v.mouth}/${v.day}`).getDay()
            switch(week){
              case 0:
                v['week'] = '日'
                break;
              case 1:
                v['week'] = '一'
                break;
              case 2:
                v['week'] = '二'
                break;
              case 3:
                v['week'] = '三'
                break;
              case 4:
                v['week'] = '四'
                break;
              case 5:
                v['week'] = '五'
                break;
              case 6:
                v['week'] = '六'
                break;
            }
        })
        
        this.setData({
            weekArr:arr,
            timeDate:year + '-' + nextMouth + '-' + curDay
            // nowMouth:mouth,
        })
        this.changeWeekBtn(arr[0])
    },
    // 日期选择
    changeWeekBtn(e){
        let time = {}
        if(e.currentTarget){
            time = e.currentTarget.dataset.time;
        }else{
            time = e
        }
        let arr = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"]
        let week = new Date(time.year + '/' + time.mouth + '/' + time.day).getDay()

        if(time.mouth<10){
            time.mouth = '0'+time.mouth
        }
        if(time.day<10){
            time.day = '0'+time.day
        }
        this.setData({
            curDay:time.day,
            curMonth:time.mouth,
            curWeekText:arr[week],
            timeDate:time.year + '-' + time.mouth + '-' + time.day
        })
        this.getKtv()
    },

    getKtv(){
        $api.ajax(`/app/store/ktvReserve/${this.data.storeId}/${this.data.timeDate}/1`, 'get').then(res => {
            if(res.code != 0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }
            this.setData({
                ktvList:res.data.ktvRoomList,
                ktvReservationNotes:res.data.ktvReservationNotes,
                minConsumption:res.data.minConsumption
            })
        })
    },

    ktvInfo(e){
        let data = e.currentTarget.dataset.data
        data['ktvReservationNotes'] = this.data.ktvReservationNotes
        data['timeDate'] = this.data.timeDate
        wx.setStorageSync('ktv_info',data)
        wx.navigateTo({
          url: './ktvInfo',
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
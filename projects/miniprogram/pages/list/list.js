// pages/list/list.js
const app = getApp()
const $api = require('../../utils/api')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        initData: [],//所有店
        AinitData:[],//评价标签
        active: '',
        labList: [{
                text: '热门商区',
                type: '1',
                flag: false
            },
            {
                text: '智能排序',
                type: '2',
                flag: false
            },
            {
                text: '筛选',
                type: '3',
                flag: false
            },
        ],
        sortList: [], //智能排序
        regionList: [], //地区
        placeList: [], //具体地址
        // filtList:[],//筛选
        // typeList:[],//筛选类型
        // peopleList:[],//容纳人数
        // picList:[],//均价范围
        showAdr: false,
        startX: 0,
        moveX: 0,
        percentage: 0,
        X: 0,
        moveWidth: 0, //移动宽度
        fixWidth: 0, //固定宽度
        km: 0, //拖动显示文字提示
        num: 0, //排序改变样式
        is: 0, //类型
        isPeople: 0, //人数
        isDollar: 0, //均价
        addUrl: `${$api.fileUrl}`, //图片路由
        index1: 0, //筛选开关
        index2: 0, //筛选开关
        index3: 0, //筛选开关
        placeInd: null, //地区背景左侧
        placeInds: null, //地区背景右侧
        starWidth: '',
        areaCode:'',//地区选择区code
        landmark:'',//地区选择  详细位置
        sortId:'',//排序id
        pageSize:10,
        pageNo:1,
        screening:'',
        screeningType:'',
        screeningNum:'',
        screeningPrice:'',
        typeId:'',
        whetherNext:true,
        addressInfo:''
    },
    pagingArr() {
        this.setData({
            initData:this.data.initData,
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            addressInfo:wx.getStorageSync('address')
        })
        this.districtList()
        this.init(options.id)
        this.getStore(options)
        this.setData({
            typeId : options
        })
        this.getScreeningList(options.id)
        
        //智能排序
        $api.ajax('/app/intelligent/apiList', 'post').then(res => {
            if (res.code != 0) {
                return
            }
            this.setData({
                sortList: res.data
            })
        })
        //店铺简介
        // $api.ajax('/app/screening/apiList', 'post').then(res => {
        //     // console.log(res)
        // })
    },

    //热门商区
    districtList(){
        let tit = {
            'cityName': this.data.addressInfo.city
        }
        $api.ajax('/app/store/districtList', 'post', tit).then(res => {
            if (res.code != 0) {
                this.setData({
                    addressInfo:wx.getStorageSync('address')
                })
                return
            }
            this.setData({
                regionList: res.data
            })
        })
    },

    getStore(options){
        if(!this.data.whetherNext)return
        wx.showLoading({
            title: '加载中...',
        })
        let address = this.data.addressInfo
        let lat_lng = wx.getStorageSync('lat_lng')
        var loc = Number(options.id)
        var city = address.city
        let lat,lng,cityLat,cityLon;
        if(this.data.landmark){
            cityLat = this.data.landmark.lat
            cityLon = this.data.landmark.lng
        }else{
            cityLat = ''
            cityLon = ''
        }
        lat = lat_lng.split(',')[0]
        lng = lat_lng.split(',')[1]
        let data = {
            pageNo:this.data.pageNo,
            pageSize:this.data.pageSize,
            cityName: city,//城市code
            storeLocation: loc,//ktv，夜店，清吧类型
            lat: lat,
            lon: lng,
            // cityLat,
            // cityLon,
            sortId: this.data.sortId,//排序id
            typeIds:this.data.screeningType,//筛选 类型
            numberOfPeople: this.data.screeningNum,//容纳人数
            avgConsumption: this.data.screeningPrice,//人均消费
            distance: this.data.km==0?'':this.data.km,//搜索半径
            districtCode:this.data.areaCode,//区code
        }
        $api.ajax('/app/store/limitStore', 'post', data).then(res => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            if (res.code != 0) {
                return
            }
            if(res.data.list.length<=0){
                this.setData({
                    whetherNext:false
                })
            }else{
                this.setData({
                    whetherNext:true,
                    pageNo:+this.data.pageNo +1
                })
            }
            res.data.list.forEach(v=>{     
                v.starWidth = v.score * 2 * 10 + '%'
                v.labels = v.labels.split(',')
                v.score = v.score.toFixed(1)
                this.data.initData.push(v)
            })
            this.setData({
                initData: this.data.initData,
            })
        })
    },

    onChange(event) {
        this.setData({
            value: event.detail,
        });
    },

    init(id) {
        let title = id == 1 ? '夜店' : (id == 2 ? '清吧' : 'KTV')
        wx.setNavigationBarTitle({
            title: title
        })
    },
    //地区背景
    cheBg(e) {
        this.setData({
            placeInd: e.target.dataset.index,//地区  左侧  下标
            placeList: e.target.dataset.val.streetList,//右侧列表
            placeInds: null,//地区  右侧  下标清空
            areaCode: e.target.dataset.val.id//区id
        })
    },
    cheBgs(ind) {
        // this.setData({
        //     placeInds: ind.target.dataset.index
        // })
        // let type = e.currentTarget.dataset.type
        // let latlng = {
        //     lat:type.lonlat.split(',')[1],
        //     lng:type.lonlat.split(',')[0],
        // }
        // this.setData({
        //      active: type.districtStreet,
        //      placeInds: e.target.dataset.index,
        //      showAdr: true,
        // })
    },

    showLab(e) {
        let type = e.currentTarget.dataset.type
        this.setData({
            active: type,
            showAdr: true
        })
        return
    },
    word(e) {
        let yourSite = e.currentTarget.dataset.type.districtStreet
        this.data.labList[0].text = yourSite
        this.data.labList[0].flag = true
        let latlng = {
            lat:e.currentTarget.dataset.type.lonlat.split(',')[0],
            lng:e.currentTarget.dataset.type.lonlat.split(',')[1],
        }
        if(!e.currentTarget.dataset.type.lonlat){
            let lat_lng = wx.getStorageSync('lat_lng')
            latlng = {
                lat : lat_lng.split(',')[0],
                lng : lat_lng.split(',')[1]
            }
            this.setData({
                areaCode : ''
            })
        }
        this.setData({
            labList: this.data.labList,
            placeInds: e.currentTarget.dataset.index,
            landmark:latlng,
        })
        this.hide()
    },
    wordColor(e) {
        var index = e.currentTarget.dataset.index
        this.setData({
            num: index
        })
        let data = e.currentTarget.dataset.data

        var title = data.collation
        this.data.sortList[index].text = title
        this.data.labList[1].text = this.data.sortList[index].text
        this.data.labList[1].flag = true
        this.setData({
            labList: this.data.labList,
            sortId:data.sortId
        })
        this.hide()
    },
    //筛选
    type_one(e) {
        let val = e.currentTarget.dataset
        if (val.index == this.data.index1) {
            this.data.index1 = 0
        } else {
            this.data.index1 = val.index
        }
        this.data.labList[2].flag = true
        this.setData({
            is: this.data.index1,
            labList: this.data.labList,
            screeningType:val.data.id,
        })
    },
    type_two(e) {
        let val = e.currentTarget.dataset
        if (val.index == this.data.index2) {
            this.data.index2 = 0
        } else {
            this.data.index2 = val.index
        }
        this.data.labList[2].flag = true
        this.setData({
            isPeople: this.data.index2,
            labList: this.data.labList,
            screeningNum:val.data,
        })
    },
    type_three(e) {
        let val = e.currentTarget.dataset
        if (val.index == this.data.index3) {
            this.data.index3 = 0
        } else {
            this.data.index3 = val.index
        }
        this.data.labList[2].flag = true
        this.setData({
            isDollar: this.data.index3,
            labList: this.data.labList,
            screeningPrice:val.data
        })
    },
    //重置
    reset() {
        this.data.index1 = 0
        this.data.index2 = 0
        this.data.index3 = 0
        this.data.labList[2].flag = false
        this.setData({
            is: this.data.index1,
            isPeople: this.data.index2,
            isDollar: this.data.index3,
            moveX: 0,
            km: 0,
            screeningType:'',
            screeningNum:'',
            screeningPrice:'',
            labList: this.data.labList
        })
    },
    loadMoreData() {
        wx.showToast({
            duration: 400,
            icon: 'loading',
            title: '正在加载更多数据',
        })
    },
    hide() {
        this.setData({
            active: '',
            showAdr: false,
            whetherNext:true,
            pageNo:1,
            initData:[]
        })
        this.getStore(this.data.typeId)
    },

    moveStart(e) {
        let query = wx.createSelectorQuery();
        query.select('.fix_line').boundingClientRect(rect => {
            this.setData({
                fixWidth: rect.width,
            })
        }).exec();
        query.select('.move_img').boundingClientRect(rect => {
            this.setData({
                startX: e.touches[0].pageX - rect.left
            })
        }).exec();
    },
    moveIng(e) {
        let pageX = e.touches[0].pageX - this.data.startX
        let percentage, X
        if (pageX <= 0) {
            pageX = 0
        }
        if (pageX >= this.data.fixWidth) {
            pageX = this.data.fixWidth
        }
        percentage = pageX / this.data.fixWidth,
            X = (percentage * 20).toFixed(0)
        this.setData({
            moveX: pageX,
            km: X
        })
    },
    moveEnd() {

    },
    goDetails(e) {
        let storeId = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/details/details?id=${storeId}`,
        })
    },
    getScreeningList(id){
        let data = {
            filterModule:id,
        }
        $api.ajax('/app/screening/apiList', 'post', data).then(res => {
            if (res.code != 0) {
                return
            }
            let arr = []
            res.data.accommodationList.forEach((v,i)=>{
                if(v.substring(v.length-2) != '以上'){
                    arr[i] = v + '人'
                }else{
                    arr[i] = v
                }
            })
            this.setData({
                screening:res.data,
                // ['screening.accommodationList']:arr
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
        this.data.labList.forEach(v=>{
            v.flag = false
        })
        this.data.labList[0].text = '热门商区'
        this.data.labList[1].text = '智能排序'
        this.data.labList[2].text = '筛选'
        let that = this
        setTimeout(()=>{
            that.setData({
                km:0,
                sortId:'',
                screeningType:'',
                screeningNum:'',
                screeningPrice:'',
                areaCode:'',
                landmark:'',
                whetherNext:true,
                pageNo : 1,
                initData:[],
                labList : that.data.labList,
                placeInd: null, //地区背景左侧
                placeInds: null, //地区背景右侧
                num:0,
                is: 0,
                isPeople: 0,
                isDollar: 0,
                moveX: 0,
            })
            that.getStore(that.data.typeId)
        },1000)
    },

    // onPageScroll(){
    //     console.log(111)
    // },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.getStore(this.data.typeId)
    },
})
const $api = require('../../utils/api')
const computedBehavior = require('miniprogram-computed')
let timer_idx_o;
Page({
    behaviors: [computedBehavior],
    /**
     * 页面的初始数据
     */
    data: {
        search_text:'',
        orderList:[],
        orderState:[
            {
                type:0,
                label:'全部'
            },
            {
                type:2,
                label:'待付款'
            },
            {
                type:1,
                label:'待使用'
            },
            {
                type:3,
                label:'已完成'
            },
            {
                type:4,
                label:'已作废'
            },
        ],
        count:[],
        // screenHeight:null
        active:0,
        left_width:'',
        btm_width:'',
        pageIndex:1,
        limit:10,
        keyWord:'',
        isMore:true,
        addUrl: `${$api.fileUrl}`,
        show:false,
        childComponent:{}
    },
    cancel(e){
        this.setData({
            show:false
        })
    },
    confirm(e){
        let that = this
        let id = e.detail.data.id
        let index = e.detail.data.index
        $api.ajax(`/app/order/${id}/del`,'delete').then(res => {
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                that.setData({
                    show:false
                })
                return
            }
            wx.showToast({
                title: '删除成功',
                icon:'success',
                duration:2000,
            })
            that.data.orderList.splice(index,1)   
            that.setData({
                orderList: that.data.orderList,
                show:false
            })
        })
    },
    lookOrder(e){
        let data = e.currentTarget.dataset.data
        wx.setStorageSync('useCart', false)    
        wx.navigateTo({
            url: `../pay/pay?orderId=${data.orderNo}&storeId=${data.storeId}`,
        })
        // wx.navigateTo({
        //     url: `../shareInfo/shareInfo?orderId=${data.orderNo}&storeId=${data.storeId}`,
        // })
    },
    goIndex(e){
        this.setData({
            orderList:[],
            pageIndex:1,
            isMore:true,
            active:e.currentTarget.dataset.index
        })
        this.leftPosi()
        this.getOrderList()
    },
    orderCount(){
        $api.ajax(`/app/order/listCount`,'post').then(res => {
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
                return
            }

            this.setData({
                count: res.data
            })
            this.leftPosi() 
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            active:options.id || 0
        })
        this.getOrderList()
        this.orderCount()
    },
    goStore(e){
        let data = e.currentTarget.dataset.data
        wx.navigateTo({
          url: '../details/details?id=' + data.storeId,
        })
    },
    onShow(){
        // this.setData({
        //     active:this.data.active,
        //     pageIndex:1,
        //     isMore:true,
        //     orderList:[],
        // })
        // this.getOrderList()
        // this.orderCount()
    },
    onResize:function(){
        this.leftPosi() 
    },
    leftPosi(){
        let query = wx.createSelectorQuery();
        query.select('.active').boundingClientRect(rect => {
            this.setData({
                btm_width:rect.width
            })
        }).exec();
        query.select('.on').boundingClientRect(rect_on => {
            let left_width = (rect_on.left + ((rect_on.width - this.data.btm_width)/2))
            this.setData({
                left_width:left_width + 'px'
            })
        }).exec();
    },
    watch: {
        'keyWord': function(val) {
            this.debounce()
        },
    },
    debounce() {   
        clearTimeout(timer_idx_o); 
        timer_idx_o = setTimeout(()=>{
            this.setData({
                orderList:[],
                isMore:true
            })
            this.getOrderList()
        },1000)
    },
    getOrderList(){
        if(!this.data.isMore){
            return
        }
        let data = {
            pageNo:this.data.pageIndex,
            pageSize:this.data.limit,
            type:+this.data.active,
            storeName:this.data.keyWord
        }

        $api.ajax('/app/order/list', 'post', data).then(res => {
            wx.hideNavigationBarLoading()
            if (res.code != 0) {
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000,
                })
              return
            }
            if(res.data.list.length>0){
                this.setData({
                    isMore:true,
                    pageIndex:this.data.pageIndex +1
                })
            }else{
                this.setData({
                    isMore:false
                })
            }
            res.data.list.forEach(v=>{
                // let practical = ''
                // if(Number(v.orderAmount) - Number(v.couponAmount)<v.minAmount){
                //     practical = v.minAmount
                // }else{
                //     practical = Number(v.orderAmount) - Number(v.couponAmount)
                // }
                // v['practical'] = Number(practical).toFixed(2)
                this.data.orderList.push(v)
            })
            this.setData({
              orderList: this.data.orderList,
            })
        })    
    },
    deteleOrder(e){
        let component = {}
        component['id'] = e.currentTarget.dataset.id
        component['index'] = e.currentTarget.dataset.index
        this.setData({
            show:true,
            childComponent:component
        })
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        wx.showNavigationBarLoading(
            {
                success:res=>{
                    if(res.errMsg=="showNavigationBarLoading:ok"){
                        this.getOrderList()
                    }
                }
            }
        );
    },
})
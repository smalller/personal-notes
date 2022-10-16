const $api = require('../../../utils/api')
const unils = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
    data: {
        addUrl:`${$api.fileUrl}`,
        isLogin:true,
        flag:false,//全文
        repayFlag:false,//回复
        ownXinflag:false,//作者心开关
        otherXinflag:false,//其他评论心心
        headerLabel:[],
        num:6,
        more:false,
        pageNo:1,
        pageSize:10,
        whetherNext:true,
        comments:[],
        storeId:'',
        bigImg:[],//大图列表
        lookBigImg:false,
        imgIndex:0,
        indicatorDots: true,
        active:0,
        label:'1'
    },
    onShow(){
        let userinfo = wx.getStorageSync('userinfo'),isLogin = ''
        userinfo?isLogin=true:isLogin=false
        this.setData({
            isLogin
        })
    },
    bindGetUserInfo(e){
        let type = e.currentTarget.dataset.type
        let data =  {}
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
            if(type == 1){
                data = {
                    data:e.currentTarget.dataset.data,
                    index:e.currentTarget.dataset.index,
                }
                this.isLike(data)
            }else if(type == 2){
                // 子评论点赞
                data = {
                    data:e.currentTarget.dataset.data,
                    index:e.currentTarget.dataset.index,
                    parent:e.currentTarget.dataset.parent,
                    pidx:e.currentTarget.dataset.pidx
                }
                this.isLikeChild(data)
            }
        }).catch((res) => { 
            wx.showToast({
                title: '登录失败，请重试',
                icon:'none',
                duration:2000
            })
        })
    },

    //全文
    allContent(e){
        let status = e.currentTarget.dataset.status
        let index = e.currentTarget.dataset.index
        let val = `comments[${index}].moreText`
        this.setData({
            [val]:!status
        })
    },
    //回复
    repay(e){
        let data = e.currentTarget.dataset.data
        let status = e.currentTarget.dataset.status
        let index = e.currentTarget.dataset.index
        let val = `comments[${index}].more`
        let num = `comments[${index}].childNum`
        this.setData({
            [val]:!status,
        })
        if(!status){
            this.setData({
                [num]:data.commentAllDTOList.length,
            })
        }else{
            this.setData({
                [num]:3,
            })
        }
    },
    isLike(e){
        let item = e.currentTarget?e.currentTarget.dataset.data:e.data
        let index =  e.currentTarget?e.currentTarget.dataset.index:e.index
        let data = {
            "appraiseId": item.id,
            "appraiseUserId": item.userId,
        }
        $api.ajax(`/app/appraise/fabulous`,'post',data).then(res=>{
            if(res.code!=0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000
                })
            }else{
                let val = `comments[${index}].fabulous`
                let type = `comments[${index}].fabulousType`
                if(item.fabulousType == 1){
                    // 已点赞
                    +item.fabulous--
                    this.setData({
                        [val] :  item.fabulous,
                        [type] :0,
                    })
                }else{
                    +item.fabulous++
                    this.setData({
                        [val] :item.fabulous,
                        [type] :1,
                    })
                }
            }
        })    
    },

    isLikeChild(e){
        let item = e.currentTarget?e.currentTarget.dataset.data:e.data
        let index = e.currentTarget?e.currentTarget.dataset.index:e.index
        let parent = e.currentTarget?e.currentTarget.dataset.parent:e.parent//父元素
        let parentIndex = e.currentTarget?e.currentTarget.dataset.pidx:e.pidx//父元素下标
        let data = {
            "appraiseCommentId": item.id,
            "appraiseCommentUserId": item.userId,
        }
        $api.ajax(`/app/appraise/fabulousComment`,'post',data).then(res=>{
            if(res.code!=0){
                wx.showToast({
                    title: res.msg,
                    icon:'none',
                    duration:2000
                })
            }else{
                let val = `comments[${parentIndex}].commentAllDTOList[${index}].fabulous`
                let type = `comments[${parentIndex}].commentAllDTOList[${index}].fabulousType`
                if(item.fabulousType == 1){
                    // 已点赞
                    +item.fabulous--
                    this.setData({
                        [val] :  item.fabulous,
                        [type] :0,
                    })
                }else{
                    +item.fabulous++
                    this.setData({
                        [val] :item.fabulous,
                        [type] :1,
                    })
                }
            }
        })    
    },
    onPullDownRefresh: function () {
        setTimeout(()=>{
            this.evaluation()
            this.getLabels()
        },1000)
    },
    onReachBottom: function () {
        this.evaluation()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            storeId:options.id
        })
        
        this.evaluation()
        this.getLabels()
    },
    commentsLabel(e){
        let data = e.currentTarget.dataset.data
        let index = e.currentTarget.dataset.index
        let label = ''
        if(data.labels=='全部'){
            label = 1
        }else if(data.labels=='最新'){
            label = 2
        }else if(data.labels=='好评'){
            label = 3
        }else{
            label = data.labels
        }
        this.setData({
            active:index,
            label,
            pageNo:1,
            whetherNext:true,
            comments:[]
        })
        this.evaluation()
    },
    // all评价
    evaluation(){
        if(!this.data.whetherNext){
            return
        }
        wx.showLoading({
            title: '加载中...',
        })
        let data = {
            labels:this.data.label,
            pageNo:this.data.pageNo,
            pageSize:this.data.pageSize,
            storeId:this.data.storeId,
        }
        $api.ajax(`/app/appraise/appAppraiseLimit`,'post',data).then(res=>{
            wx.hideLoading()
            wx.stopPullDownRefresh()
            let data = res.data.list
            if(data.length>0){
                this.setData({
                    whetherNext:true,
                    pageNo:+this.data.pageNo+1,
                })
            }else{
                this.setData({
                    whetherNext:false,
                })
            }

            data.map(item => {
                item.starWidth = item.appraiseLevel * 2 * 10 + '%'
                item.createTime = item.createTime.substr(0,10)
                item['childNum'] = 3  
                item['allChildNum'] = item.appraisePictureList.length
                item['more'] = false //评论更多
                item['moreText'] = false//全文更多
                item['leaveLogo'] = this.levelFun(item)
                item.commentAllDTOList.map((val)=>{
                    val['leaveLogo'] = this.levelFun(val)
                    val.createTime = val.createTime.substr(0,10)
                })
                this.data.comments.push(item)
            })
            this.setData({
                comments:this.data.comments
            })
        })
    },

    levelFun(item){
        if(item.wealthLevel>=0 && item.wealthLevel<5){
            return item['leaveLogo'] = '../../../icon/lv_1.png'
        }else if(item.wealthLevel>=5 && item.wealthLevel<10){
            return item['leaveLogo'] = '../../../icon/lv_2.png'
        }else if(item.wealthLevel>=10 && item.wealthLevel<15){
            return item['leaveLogo'] = '../../../icon/lv_3.png'
        }else if(item.wealthLevel>=15 && item.wealthLevel<20){
            return item['leaveLogo'] = '../../../icon/lv_4.png'  
        }else if(item.wealthLevel>=20 && item.wealthLevel<25){
            return item['leaveLogo'] = '../../../icon/lv_5.png'
        }else if(item.wealthLevel>=25 && item.wealthLevel<30){
            return item['leaveLogo'] = '../../../icon/lv_6.png'
        }else if(item.wealthLevel>=30 && item.wealthLevel<35){
            return item['leaveLogo'] = '../../../icon/lv_7.png'
        }else if(item.wealthLevel>=35 && item.wealthLevel<40){
            return item['leaveLogo'] = '../../../icon/lv_8.png'
        }else if(item.wealthLevel>=40 && item.wealthLevel<45){
            return item['leaveLogo'] = '../../../icon/lv_9.png'
        }else if(item.wealthLevel>=45 && item.wealthLevel<50){
            return item['leaveLogo'] = '../../../icon/lv_10.png'
        }else if(item.wealthLevel>=50 && item.wealthLevel<55){
            return item['leaveLogo'] = '../../../icon/lv_11.png'
        }else if(item.wealthLevel>=55 && item.wealthLevel<60){
            return item['leaveLogo'] = '../../../icon/lv_12.png'
        }else if(item.wealthLevel>=60 && item.wealthLevel<65){
            return item['leaveLogo'] = '../../../icon/lv_13.png'
        }else if(item.wealthLevel>=65 && item.wealthLevel<70){
            return item['leaveLogo'] = '../../../icon/lv_14.png'
        }else if(item.wealthLevel>=70 && item.wealthLevel<75){
            return item['leaveLogo'] = '../../../icon/lv_15.png'
        }else if(item.wealthLevel>=75 && item.wealthLevel<80){
            return item['leaveLogo'] = '../../../icon/lv_16.png'
        }else if(item.wealthLevel>=80){
            return item['leaveLogo'] = '../../../icon/lv_17.png'
        }
    },

    getLabels(){
        let data = {
            pageNo:1,
            pageSize: 1000,
            storeId: this.data.storeId,
        }
        $api.ajax(`/app/appraise/evaluationStatistical`,'post',data).then(res=>{
            this.setData({
                headerLabel:res.data.list
            })
        })
    },
    labMore(){
        this.setData({
            more:!this.data.more
        })
        if(this.data.more){
            this.setData({
                num:1000,
            })
        }else{
            this.setData({
                num:6,
            })
        }
    },
    toggleBigImg(){
        this.setData({
          lookBigImg : !this.data.lookBigImg
        })
      },
      showBigImg(e){
        let index = e.currentTarget.dataset.index
        let data = e.currentTarget.dataset.data.appraisePictureList
        console.log(index)
        this.setData({
          bigImg : data,
          imgIndex : index
        })
        this.toggleBigImg()
      },
})
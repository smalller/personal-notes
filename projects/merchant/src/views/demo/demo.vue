<template>
    <basic-container>
        <div>
            <div class="container">
                <div class="top_box">
                    <h2 class="title"> <span class="line lw1"></span><span>后台管理系统</span> </h2>
                    <div class="st">
                        <div>
                            <span class="top_num">1111</span>
                        </div>
                        <div>今日新增用户</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">1111</span>
                        </div>
                        <div>今日新增商家</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">1111</span>
                        </div>
                        <div>今日活跃数量</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">1111</span>
                        </div>
                        <div>今日订单数量</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">1111</span>
                        </div>
                        <div>入驻商家总数量</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">1111</span>
                        </div>
                        <div>平台用户总数量</div>
                    </div>
                </div>
                <div class="main_box">
                    <div class="m_l">
                        <div class="broken_box box_css">
                            <div class="column col_spe">
                                <span class="line lw2"></span>
                                <span>新增用户/商家</span>
                            </div>
                            <div ref='broken' id="brokenline" style="width: 98%;height: 500px;"> </div>        
                        </div>

                        <div class="columnar_box box_css">
                            <div class="column col_spe">
                                <span class="line lw2"></span>
                                <span>商家数据统计</span>
                            </div>
                            <div ref='columnar' id="columnarLine" style="width: 98%;height: 500px;"></div> 
                        </div>
                    </div>
                    <div class="m_m">
                        <div class="bread_box box_css">
                            <div class="column col_spe b_inp">
                                <span class="line lw2"></span>
                                <span>商家访问数</span>
                                <!-- <el-select v-model="b_inp" filterable  placeholder="请选择">
                                    <el-option
                                    v-for="item in selStoreList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                    </el-option>
                                </el-select> -->
                            </div>
                            <div ref='bread' id="breadLine" style="width: 98%;height: 500px;"></div>
                        </div>

                        <div class="Top_goods box_css">
                            <div class="column col_spe">
                                <span class="line lw2"></span>
                                <span>用户活跃数据</span>
                            </div>
                            <div ref='actUsers' id="actUsersLine" style="width: 98%;height: 500px;"></div> 
                        </div>
                    </div>
                    <div class="m_r box_css">
                        <div class="to_view">
                            <div><span  :class="day_mon==1?'t_way':''" @click="day_mon = 1">按天数据统计</span></div>
                            <div><span  :class="day_mon==2?'t_way':''" @click="day_mon = 2">按月数据统计</span></div>
                        </div>

                        <div class="timeData">
                            <div class="block">
                                <el-date-picker
                                    v-model="time_now"
                                    type="month"
                                    :clearable="false"
                                    :editable="false"
                                    @focus="focSta=true"
                                    @blur="focSta=false"
                                    @change='DaysChange'
                                    :time-arrow-control='true'
                                    >
                                </el-date-picker>
                                <i class="jt " :class="focSta?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                            </div>
                            <div class="day_li" ref="day_li">
                                <ul>
                                    <div class="choose" ref="choose" ></div>
                                    <li ref="day"  :style="{top:scrollY * 30 +'px'}"  :class="active==index?'onAct':''" v-for="(day,index) in days" :key="index">{{day}}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </basic-container>
</template>

<script>
import {init} from "@/api/demo/demo";
export default {
    data() {
        return {
            breadState:false,
            day_mon:1,
            focSta:false,
            value2: '',
            time_now:'',
            days:'',
            i:0,
            active:7,
            scrollY:0,
            b_inp:'',
            pingtai:[],
            topData:'',
            dayList : [],//新增用户/商家图表 天数
            userList : [],//新增用户/商家图表 新增用户
            addStoreList : [],  //新增用户/商家图表 新增商家
            activeList : [],//用户活跃数据图表 活跃用户
            storeData:[],//商家数据统计集合
            beforeStoreList:[],//商家数据统计,前7条数据
            accessStoreData:[],//商家前7条数据  集合
            accessStoreList:'',//商家访问 饼图  一条数据
            selStoreList:[],//商家列表  下拉框
        };
    },
    created(){
        this.time_now = this.$regular.timeData(new Date().getTime(),5)
        this.scrollY =  - (new Date().getDate() - 8)
        this.active = new Date().getDate()-1
        this.days = this.timeDay(this.time_now)
        this.$nextTick(() => {
            let day = this.$refs.day
            for(let i=0;i<day.length;i++){
                if(day[i].offsetTop == this.$refs.choose.offsetTop){
                    this.acitive = i
                    break;
                }
            }
        })
        // this.getData()
        this.getStoreList()
    },
    watch: {
        b_inp(val){
            this.getOneStore(val)
        },
        day_mon(){
            this.getData()
        }
    },
    mounted(){
        this.$refs.day_li.addEventListener("wheel", this.myFunction,true);
    },
    methods:{
        // 天数加0
        dayInit(time){
            if(time<10){
               time = '0' + time
               return time
            }
            return time
        },
        getData(){
            let data = {
                type:this.day_mon,
                localDate:this.time_now + '-' + this.dayInit(this.active+1),
                sid:'',
            }  
            init(data).then(res => {
                console.log(res)
                // const data = res.data.data;
                // this.page.total = data.total;
                // this.data = data.records;
                // this.loading = false;
                // this.selectionClear();
            }).catch(err=>{
                console.log(err)
            });
        },
        // getData(){
        //     this.dayList = []
        //     this.userList = []
        //     this.addStoreList = []
        //     this.activeList = []
        //     this.storeData=[]
        //     this.beforeStoreList=[]
        //     this.accessStoreData=[]
        //     this.accessStoreList=''
         
        //     this.$post('/admin/statistics/platformList',data1).then((res) => {
        //         if(res.code == 0){
        //             this.pingtai = res.data
        //             this.topData = res.data[0]  
        //             if(this.day_mon ==1){
        //                this.pingtai.shift()
        //             }
        //             this.pingtai.forEach(v=>{
        //                 if(this.day_mon == 1){
        //                     this.userList.unshift(v.newUserNum)
        //                     this.addStoreList.unshift(v.newStoreNum)
        //                     this.activeList.unshift((v.day+','+v.activityNum+','+v.inactivityNum).split(','))
        //                     this.dayList.unshift(v.statisticalTime)
        //                 }else{
        //                     this.userList.unshift(v.monthUserNum)
        //                     this.addStoreList.unshift(v.monthStoreNum)
        //                     this.activeList.unshift((v.month+','+v.activityNumMonth+','+v.inactivityNumMonth).split(','))
        //                     this.dayList.unshift(v.month)
        //                 }
                        
        //             })
        //             this.brokenChart()
        //             this.actUsersChart()
        //         }else{
        //             this.$message.warning(res.msg);
        //         }
        //     })     
            
        //     this.$post('/admin/statistics/getVisBySid',data1).then((res) => {
        //         if(res.code == 0){
        //             this.storeData = res.data
        //             this.columnarChart()
        //             // this.beforeStoreList.unshift(this.storeData.map(v=>{return (v.storeName+','+v.storeVisitNum).split(',')}))
        //         }else{
        //             this.$message.warning(res.msg);
        //         }
        //     })   
        //     this.getOneStore(this.b_inp)
        // },
        // 商家所有列表
        // getStoreList(){
        //     let data2 = {
        //         keyword: this.b_inp,
        //     }
        //     this.$post('/admin/statistics/storeList',data2).then((res) => {
        //         if(res.code == 0){
        //             this.selStoreList = res.data
        //         }else{
        //             this.$message.warning(res.msg);
        //             return false
        //         }
        //     })
        // },
        // 饼图  获取一个商家的数据
        getOneStore(val){
            let data = {
                localDate:this.time_now + '-' + this.dayInit(this.active+1),
                sid: val,
                type: this.day_mon
            }
            this.$post('/admin/statistics/getDayBySid',data).then((res) => {
                if(res.code == 0){
                    this.accessStoreList = res.data
                    this.breadChart()
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },

        debounce(fn, wait) {    
            var timeout = null;    
            if (this.fun!==null){
                clearTimeout(this.fun)
            }
            this.fun = setTimeout(fn,wait)
        },
        // 滚动监听
        myFunction(e){
            e.stopPropagation()
            e.preventDefault(); 
            if(e.wheelDelta>0){
                if(this.active == this.days-1){
                    this.active = this.days-1
                    return
                }
                this.scrollY -=1
                this.active +=1
            }else{
                if(this.active == 0){
                    this.active = 0
                    return
                }
                this.scrollY +=1
                this.active -=1
            }
            this.debounce(this.getData,800)
        },
        DaysChange(val){
            this.time_now = this.$regular.timeData(val,5)
            this.days = this.timeDay(this.time_now)     

            let poor=''
            // 切换月份时  天数不够的  自动定位到选中月最后一天
            if(this.days < this.active+1){
                poor = this.active+1 - this.days
                this.scrollY = this.scrollY + poor
                this.active = this.days-1
            }
            this.getData()
            this.getOneStore(this.b_inp)
        },
        // 日期选择
        timeDay(time){
            let trr = time.split('-')
            let day = new Date(trr[0],trr[1],0).getDate()
            return day
        },
        // 新增用户/商家 折线
        brokenChart(){
            let brokenline = echarts.init(this.$refs.broken);
            window.addEventListener("resize", function () {
                brokenline.resize();
            });
            let option = {
                dataZoom: {
                    type: 'inside',
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#0081ff','#1cbbb4','#e54d42','#a5673f','#39b54a','#f37b1d'],
                legend: {
                    // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                grid: {
                    left: '3%',
                    bottom: '5%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        // saveAsImage: {}//隐藏下载图标
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.dayList
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '新增用户',
                        type: 'line',
                        data: this.userList
                    },
                    {
                        name: '新增商家',
                        type: 'line',
                        data: this.addStoreList
                    },
                ]
            };
    
            // 使用刚指定的配置项和数据显示图表。
            brokenline.setOption(option);
        },
        // 柱状图 商家数据统计访问
        columnarChart(){
            let num=[],name=[];
            this.storeData.forEach(val=>{
                name.unshift(val.storeName)
                if(this.day_mon == 1){
                    num.unshift(val.storeVisitNum)
                }else{
                    num.unshift(val.storeVisitNumMonth)
                }
            })

            let columnarLine = echarts.init(this.$refs.columnar)
            window.addEventListener("resize", function () {
                columnarLine.resize();
            });
            let option = {
                color:[ '#cb99c5','#f0d264','#82c8a0','#7fccde', '#6698cb'],
                legend: {},
                tooltip: {},
                dataZoom: {
                    type: 'inside',
                },
                grid: {
                    left: '3%',
                    bottom: '5%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    data: name
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar',
                        // showBackground: true,
                        name: '访问数量',
                        data: num
                    },
                ]
            };
            columnarLine.setOption(option);
        },
        // 饼图 商家访问量
        breadChart(){
            let accessStore = []
            if(this.accessStoreList){
                accessStore = [
                    {value:this.accessStoreList.storeVisitNum,name:'昨日商家访问量'},
                    {value:this.accessStoreList.storeOrdersNum,name:'昨日商家订单量'},
                    {value:this.accessStoreList.storeQueueNum,name:'昨日商家排号数'},
                    {value:this.accessStoreList.storeOrderGrabbin,name:'昨日商家抢单数'}
                ]
            }else{
                accessStore = [
                    {value:0,name:'昨日商家访问量'},
                    {value:0,name:'昨日商家订单量'},
                    {value:0,name:'昨日商家排号数'},
                    {value:0,name:'昨日商家抢单数'}
                ]
            }
            let breadLine = echarts.init(this.$refs.bread)
            window.addEventListener("resize", function () {
                breadLine.resize();
            });
            let option = {
                // title: {
                //     text: '排号',
                //     subtext: '纯属虚构',
                //     left: 'center'
                // },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    // orient: 'vertical',
                    // left: 'auto',
                    // data: ['排号数 25% （29座）', '取消排号数', '生效排号数']
                },
                color:['#f37b1d','#1cbbb4','#6739b6','#e03997','#9c26b0'],
                series: [
                    {
                        name:' ',
                        type: 'pie',
                        radius: '65%',
                        center: ['50%', '55%'],
                        data: accessStore,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            breadLine.setOption(option);
        },
        // 用户活跃数据
        actUsersChart(){
            this.activeList.unshift(('product' + ',' + '活跃用户' + ',' + '失活用户').split(','))
            let actUsersLine = echarts.init(this.$refs.actUsers)
            window.addEventListener("resize", function () {
                actUsersLine.resize();
            });
            let option = {
                color:[ '#f0d264','#82c8a0','#7fccde', '#6698cb', '#cb99c5'],
                legend: {},
                tooltip: {},
                dataZoom: {
                    type: 'inside',
                },
                grid: {
                    left: '3%',
                    bottom: '5%',
                    containLabel: true
                },
                dataset: {
                    source: this.activeList
                },
                xAxis: {type: 'category'},
                yAxis: {},
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
                series: [
                    {
                        type: 'bar',
                    },
                    {type: 'bar'}
                ]
            };
            actUsersLine.setOption(option);
        },
    }
}
</script>

<style scoped lang="scss">
.top_box{
    font-size: 14px;
    height: 80px;
    border-bottom: 1px solid #cecece;
    display: flex;
    padding:  15px 30px;
    align-items: center;
    justify-content: space-between;
    .st{
        width: 12%;
        display: inline-block;
        display: flex;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        .top_num{
            color: #000;
            font-weight: bold;
            font-size: 30px;
            margin-bottom: 10px;
            margin-right: 5px;
        }
        .range{
            font-size: 14px;
            img{
                width: 10px;
            }
        }
    }
}

.main_box{
    font-size: 12px;
    display: flex;
    background: #ececec;
    padding: 15px;
    .m_l{
        flex: .45;
    }
    /deep/.m_m{
        flex: .35;
        .el-select{
            width: 40%;
            margin-left: 20px;
            height: 100%;
        }
        
    }
    .m_r{
        flex: .2;
        position: relative;
        background: #fff;
        padding-top: 15px;
        .to_view{
            z-index: 200;
            width: 125px;
            margin: 0 auto;
            text-align: center;
            height: 80px;
            div{
                span{
                    color: #000;
                    cursor: pointer;
                }
            }
            &>div:nth-child(1){
                margin-bottom: 25px;
            }
            .t_way{
                border-bottom: 4px solid #409EFF;
            }
        }
        .timeData{
            width: 125px;
            margin:0 auto ;
            margin-top:25px;
            .block{
                position: relative;
                .jt{
                    position: absolute;
                    top: 7px;
                    right: 18px;
                }
            }
            .day_li{
                height: 450px;
                overflow-y: scroll;
                ul{
                    // position: relative;
                }
                li{
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                }
                .onAct{
                    color: #000;
                    font-weight: bold;
                }
            }
            /deep/ .el-input__inner{
                border: none;
                font-size: 16px;
                color: #000;
                height: 30px;
                line-height: 30px;
            }
            .day_li::-webkit-scrollbar {display:none}
            .day_li {scrollbar-width: none;}
            .day_li {-ms-overflow-style: none;}
        }
    }
}

.box_css{
    width: 98%;
    margin-bottom: 15px;
    background: #fff;
    box-shadow: 0 0 4px#b5b5b5;
    border-radius: 8px;
}
.container{
    padding: 0;
}

.col_spe{
    margin: 0 0 20px 0;
    padding-left: 15px;
    padding-top: 15px;
}

.xtc{
    color: rgb(255, 102, 0);
    font-weight: 600;
    font-size: 1.2rem;
}
.xj{
    color: rgb(55, 55, 177);
    font-weight: 600;
}
.choose{
    position: absolute;
    font-weight: bold;
    font-size: 16px;
    width:125px;
    height:30px;
    top: 360px;
}
.choose::before{
    content: '';
    width: 40px;
    height: 1px;
    border-bottom: 2px solid #676767;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 14px;
}
.choose::after{
    content: '';
    width: 40px;
    height: 1px;
    border-bottom: 2px solid #676767;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 14px;
}
// element  
.el-rate{
    display: inline-block;
    position: absolute;
    left: 136px;
    top: -7px;
    /deep/.el-rate__icon{
        color: red!important;
        font-size: 1.7rem;
    }
    /deep/ .el-rate__decimal{
        color: red!important;
    }
    /deep/ .el-rate__text{
        position: absolute;
        left: -48px;
        top: -2px;
        font-size: 1.8rem;
        font-weight: bold;
        color: #000!important;
    }
}
/deep/ .el-date-editor{
    width: 120px;
    
}
/deep/ .el-input__prefix{
    display: none;
}


</style>
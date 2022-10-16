<template>
    <basic-container>
        <div>
            <div class="container">
                <div class="top_box">
                    <h2 class="title"> <span class="line lw1"></span><span>后台管理系统</span> </h2>
                    <div class="st">
                        <div>
                            <span class="top_num">{{topData.yesterdayNewUser}}</span>
                            <span class="range">
                                <img src="../../../img/shang.png" alt="">
                                111
                            </span>
                        </div>
                        <div>昨日新增用户</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">{{topData.yesterdayNewStore}}</span>
                            <span class="range">
                                <img src="../../../img/xia.png" alt="">
                                111
                            </span>
                        </div>
                        <div>昨日新增商家</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">{{topData.currentMonthNewUser}}</span>
                            <span class="range">
                                <img src="../../../img/xia.png" alt="">
                                111
                            </span>
                        </div>
                        <div>本月新增用户</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">{{topData.currentMonthNewStore}}</span>
                            <span class="range">
                                <img src="../../../img/shang.png" alt="">
                                111
                            </span>
                        </div>
                        <div>本月新增商家</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">{{topData.totalStore}}</span>
                        </div>
                        <div>入驻商家总数量</div>
                    </div>
                    <div class="st">
                        <div>
                            <span class="top_num">{{topData.totalUser}}</span>
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

                        <div class="bread_box box_css">
                        <div class="column col_spe b_inp">
                            <span class="line lw2"></span>
                            <span>商家访问数</span>
                            <el-select v-model="b_inp" filterable  placeholder="请选择">
                                <el-option
                                v-for="item in selStoreList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div ref='bread' id="breadLine" style="width: 98%;height: 500px;"></div>
                    </div>
                    </div>
                    <div class="m_m">
                        <div class="columnar_box box_css">
                            <div class="column col_spe">
                                <span class="line lw2"></span>
                                <span>总订单数/总金额</span>
                            </div>
                            <div ref='columnar' id="orderLine" style="width: 98%;height: 500px;"></div> 
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
const echarts =  require('echarts');
import {topCollect,getChartList,storeList,getStoreVisit} from "@/api/system/statistic";
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

            storeNameArr:[],
            storeNameHits:[],


            chartListArr:[],
            orderListDay:[], //订单数
            orderProfit:[],//利润
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
        this.getData()
        this.chartList()
        this.getStoreList()
        this.getOneStore()
    },
    watch: {
        b_inp(val){
            this.getOneStore(val)
        },
        day_mon(){
            this.chartList()
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
            topCollect().then(res => {
                if(res.data.code == 200){
                    this.topData = res.data.data
                }else{
                    this.$message.warning(res.data.msg);
                }
                // const data = res.data.data;
                // this.page.total = data.total;
                // this.data = data.records;
                // this.loading = false;
                // this.selectionClear();
            })
        },

        chartList(){
            let data = {
                isDay:this.day_mon,
                date :this.time_now + '-' + this.dayInit(this.active+1),
            }  
            getChartList(data).then(res => {
                if(res.data.code == 200){
                    this.chartListArr = res.data.data
                    res.data.data.forEach(v=>{
                        this.userList.push(v.newUser)
                        this.addStoreList.push(v.newStore)
                        this.dayList.push(v.date)

                        this.orderListDay.push(v.order)

                        this.orderProfit.push(v.turnover)

                        this.activeList.push((v.date+','+v.activeUser+','+v.inactiveUser).split(','))
                        
                    })

                    this.brokenChart()
                    this.orderChart()
                    this.actUsersChart()
                }else{
                    this.$message.warning(res.data.msg);
                }
            })
        },

        
        // 商家所有列表
        getStoreList(){
             let data = {
                size:200,
                current:1
            }
            storeList(data).then(res=>{
                if(res.data.code == 200){
                    this.selStoreList = res.data.data.records
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },
        //   获取商家访问量
        getOneStore(val = ''){
            let data = {
                localDate:this.time_now + '-' + this.dayInit(this.active+1),
                storeId: val,
                type: this.day_mon
            }
            getStoreVisit(data).then((res) => {
                if(res.data.code == 200){
                    // this.accessStoreList = res.data
                    res.data.data.forEach(v=>{
                        this.storeNameArr.push(v.storeName)
                        this.storeNameHits.push(v.hits)
                    })
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
            
            this.debounce(this.chartList,800)
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
        // 每日订单折线图
        orderChart(){
            let orderLine = echarts.init(this.$refs.columnar);
            window.addEventListener("resize", function () {
                orderLine.resize();
            });
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    data: ['订单数', '利润']
                },
                xAxis: [
                    {
                        type: 'category',
                        // data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                        data: this.dayList,
                        axisPointer: {
                            type: 'shadow'
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '订单数',
                        min: 0,
                        max: 250,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    {
                        type: 'value',
                        name: '利润',
                        min: 0,
                        max: 25,
                        interval: 5,
                        axisLabel: {
                            formatter: '{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '订单数',
                        type: 'bar',
                        data: this.orderListDay
                    },
                    {
                        name: '利润',
                        type: 'line',
                        yAxisIndex: 1,
                        data: this.orderProfit
                    }
                ]
            };

    
            // 使用刚指定的配置项和数据显示图表。
            orderLine.setOption(option);
        },
        //  商家访问量
        breadChart(){
            let breadLine = echarts.init(this.$refs.bread)
            window.addEventListener("resize", function () {
                breadLine.resize();
            });

            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {        
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                xAxis: {
                    type: 'category',
                    data: this.storeNameArr
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: this.storeNameHits,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }]
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
                legend: {
                    data: ['product','活跃用户', '失活用户']
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
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
                xAxis: {type: 'category',data:this.dayList},
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

/deep/.bread_box .el-select{
    left: 10px;
}
</style>
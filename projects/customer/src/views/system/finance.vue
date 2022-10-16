<template>
    <div class="finance">
        <div class="container">
            <div class="handle-box">
                <el-button :type="on == 1 ? 'primary' : ''" class="handle-del" @click="handleChange(1)">商家申请</el-button>
                <el-button :type="on == 2 ? 'primary' : ''" class="handle-del" @click="handleChange(2)">财务收入</el-button>
                <el-button disabled :type="on == 3 ? 'primary' : ''" class="handle-del mr10" @click="handleChange(3)">财务支出</el-button>
                <el-input v-model="orderNo" placeholder="请输入总订单号" class="handle-input mr10"></el-input>
                <el-date-picker
                    v-show="on == 1"
                    class="mr10"
                    v-model="query.times"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>

                <el-date-picker
                    v-show="on == 2"
                    class="mr10"
                    v-model="incomeData.times"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                >
                </el-date-picker>

                <el-select class="mr10" v-model="storeSelect" filterable placeholder="请选择商家" @change="selectStore">
                    <el-option v-for="item in allStore" :key="item.id" :label="item.name" :value="item.id"> </el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

                <!-- <el-button v-show="on == 1" type="primary" @click="audit">一键审核</el-button> -->
            </div>
            <div class="price_total" v-if="on == 1">
                <div style="margin-bottom: 10px">
                    订单数量：<span class="tl_num">{{ applyData.orderNum || 0 }}</span> 
                    佣金总额：<span class="tl_num">￥{{ applyData.commissionMoney || 0 }}</span>
                    实付总额：<span class="tl_num">￥{{ applyData.paidMoney || 0 }}</span> 
                    应收总额：<span class="tl_num">￥{{ applyData.payableMoney || 0 }}</span>
                    实收总额：<span class="tl_num">￥{{ applyData.receiptsMoney || 0 }}</span>
                </div>
                <!-- <div>
                    积分总额：<span class="tl_num">￥{{ applyData.pointPaySum }}</span> 实付总额:<span class="tl_num"
                        >￥{{ applyData.moneyPaySum }}</span
                    >
                    佣金总额：<span class="tl_num">￥{{ applyData.commissionPay }}</span> 优惠卷佣金：<span class="tl_num"
                        >￥{{ applyData.adminCoupon }}</span
                    >
                    第三方机构扣款：<span class="tl_num">￥{{ applyData.serviceCharge }}</span> 打款总金额：<span class="tl_num"
                        >￥{{ applyData.total }}</span
                    >
                </div> -->
            </div>

            <!-- <div class="price_total" v-if="on == 2">
                财务总收入：<span class="tl_num">￥{{ financeIncome.total }}</span> 总收入：<span class="tl_num"
                    >￥{{ financeIncome.timeTotal }}</span
                >
            </div> -->

            <div class="price_total" v-if="on == 3">
                财务总支出：<span class="tl_num">￥ 26154.35</span>
                <span class="tm">2020-03-04 至 2020-03-05</span>
                总支出：<span class="tl_num">￥2185.34</span>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable1"
                header-cell-class-name="table-header"
                v-if="on == 1"
                :key="1"
            >
                <!-- <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column> -->
                <el-table-column label="ID" type="index" width="50" align="center" fixed="left"></el-table-column>
                <el-table-column prop="storeName" label="申请商家" width="200" align="center"></el-table-column>
                <!-- <el-table-column prop="bankName" label="商家账户" width="280" align="center"></el-table-column>
                <el-table-column prop="bankAccount" label="商家转账账户" width="200" align="center"></el-table-column>
                <el-table-column prop="alipayAccount" label="商家支付宝账户号" min-width="180" align="center"></el-table-column>
                <el-table-column prop="wechatAccount" label="商家微信账户号" min-width="250" align="center"></el-table-column> -->
                <el-table-column prop="orderNo" label="总订单号" min-width="250" align="center"></el-table-column>

                <el-table-column prop="moneyPaid" label="实付金额" min-width="120" align="center"></el-table-column>
                <el-table-column prop="moneyPayable" label="应收金额" min-width="120" align="center"></el-table-column>
                <el-table-column prop="moneyReceipts" label="实收金额" min-width="120" align="center"></el-table-column>
                <el-table-column prop="moneyDiscount" label="优惠券抵扣金额" min-width="120" align="center"></el-table-column>

                <!-- <el-table-column prop="orderPay" label="订单原价" min-width="150" align="center"></el-table-column>
                <el-table-column prop="orderDiscount" label="订单折扣价" min-width="150" align="center"></el-table-column>
                <el-table-column prop="pointsPay" label="积分支付" min-width="150" align="center"></el-table-column>
                <el-table-column prop="moneyPay" label="现金支付" min-width="150" align="center"></el-table-column> -->
                <!-- <el-table-column prop="commissionPay" label="商品佣金" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div>￥{{ scope.row.commissionPay }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="commissionProp" label="佣金比例" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.commissionProp }}%</div>
                    </template>
                </el-table-column>
                <el-table-column prop="adminCoupon" label="优惠券佣金" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.adminCoupon }}</div>
                    </template>
                </el-table-column> -->
                <!-- <el-table-column prop="examineTime" label="申请时间" width="180" align="center"></el-table-column> -->
                <!-- <el-table-column prop="serviceCharge" label="第三方手续费" width="120" align="center"></el-table-column> -->
                <!-- <el-table-column prop="orderTypeText" label="订单类型" min-width="120" align="center"></el-table-column> -->
                <!-- <el-table-column prop="orderState" label="订单状态" min-width="120" align="center"></el-table-column> -->
                <el-table-column label="订单信息" min-width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div class="look_order" @click="look(scope.$index, scope.row)">查看订单</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            :disabled="scope.row.statusAudit != 0 && scope.row.statusAudit != 1?true:false"
                            @click="passOrBack(scope.$index, scope.row)"
                            :type="scope.row.statusAudit == 1 || scope.row.statusAudit == 0 ? 'primary' : scope.row.statusAudit == 4 ? 'success' : 'danger'"
                            >{{ scope.row.statusAudit == 1 || scope.row.statusAudit == 0 ? '待审核' : scope.row.statusAudit == 4 ? '已通过' : '已拒绝' }}</el-button
                        >
                        <!-- <el-button
                            @click="passOrBack(scope.$index, scope.row, 2)"
                            :type="scope.row.examine == 1 ? 'primary' : scope.row.examine == 4 ? 'info' : 'danger'"
                            >{{ scope.row.examine == 2 ? '已退回' : '退回申请' }}</el-button
                        > -->
                        <!-- <el-button @click="handleDelete(scope.$index, scope.row)" type="primary">冻结申请</el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <el-table
                :data="tableDataSecond"
                border
                class="table"
                ref="multipleTable2"
                header-cell-class-name="table-header"
                @selection-change="incomeSelectionChange"
                v-if="on == 2"
                :key="2"
            >
                <!-- <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column> -->
                <el-table-column label="ID" type="index" width="50" align="center" fixed="left"></el-table-column>
                <el-table-column prop="storeName" label="商家" width="280" align="center"></el-table-column>
                <el-table-column prop="phone" label="手机号" min-width="150" align="center"></el-table-column>
                <!-- <el-table-column prop="userName" label="账户" min-width="150" align="center"></el-table-column> -->
                <el-table-column prop="payWayText" label="支付方式" min-width="120" align="center"></el-table-column>
                <el-table-column prop="payTradeNo" label="第三方交易账号" min-width="300" align="center"></el-table-column>
                <el-table-column prop="orderId" label="总订单号（平台）" min-width="220" align="center"></el-table-column>
                <el-table-column prop="paid" label="支付金额" min-width="150" align="center"></el-table-column>
                <el-table-column prop="timePay" label="入账时间" min-width="180" align="center"></el-table-column>

                <el-table-column prop="refund" label="退款金额" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div style="color: red">{{ scope.row.refund > 0 ? scope.row.refund : '-' }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="订单信息" min-width="120" align="center" fixed="right">
                    <template slot-scope="scope">
                        <div class="look_order" @click="look(scope.$index, scope.row)">查看订单</div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="affirmOrder(scope.$index, scope.row)" :type="scope.row.affirm == 1 ? 'success' : 'primary'">{{
                            scope.row.affirm == 1 ? '已确认' : '确认订单'
                        }}</el-button>
                        <el-button @click="questionOrder(scope.$index, scope.row)" :type="scope.row.issue == 1 ? 'danger' : 'primary'">{{
                            scope.row.issue == 1 ? '有问题' : '问题订单'
                        }}</el-button>
                    </template>
                </el-table-column> -->
            </el-table>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable3"
                header-cell-class-name="table-header"
                v-if="on == 3"
                :key="3"
            >
                <el-table-column label="ID" fixed type="index"></el-table-column>

                <el-table-column prop="userName" label="商家" width="150" align="center"></el-table-column>
                <el-table-column prop="topicName" label="首款用户" width="130" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户手机" min-width="250" align="center"></el-table-column>
                <el-table-column prop="topicName" label="支付方式" min-width="150" align="center"></el-table-column>
                <el-table-column prop="userName" label="收款微信账户号" width="150" align="center"></el-table-column>
                <el-table-column prop="topicName" label="支付宝账户号" min-width="180" align="center"></el-table-column>
                <el-table-column prop="userName" label="总订单号" min-width="300" align="center"></el-table-column>
                <el-table-column prop="topicName" label="订单号" min-width="300" align="center"></el-table-column>
                <el-table-column prop="topicName" label="出账金额" min-width="300" align="center"></el-table-column>
                <el-table-column prop="createTime" label="出账时间" width="180" align="center"></el-table-column>
                <el-table-column label="订单信息" min-width="120" align="center">
                    <template slot-scope="scope">
                        <div class="look_order" @click="look(scope.$index, scope.row)">查看订单</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" :type="scope.row.affirm == 1 ? 'success' : 'primary'">{{
                            scope.row.affirm == 1 ? '已确认' : '确认订单'
                        }}</el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" :type="scope.row.affirm == 1 ? 'success' : 'primary'">{{
                            scope.row.affirm == 1 ? '已确认' : '问题订单'
                        }}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination" v-show="on == 1">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>

            <div class="pagination" v-show="on == 2">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="incomeData.pageIndex"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="incomeData.pageSize"
                    :total="pageTotalSecond"
                    @current-change="handlePageChangeSecond"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="60%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>订单信息</span>
            </div>
            <orderDetailPage :orderDetailInfo="orderDetailInfo"></orderDetailPage>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">返 回</el-button>
            </span>
        </el-dialog>

        <!-- 一键审核 -->
        <el-dialog :visible.sync="auditState" width="30%" center append-to-body="true">
            <div style="text-align: center">选择通过或是拒绝</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="refuseAudit()">拒 绝</el-button>
                <el-button type="primary" @click="passAudit()">通 过</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getList,storeList,orderDetail,getFinanceRecevoirList,statistics,orderStatusAudit,storeInfo } from "@/api/system/finance";
import {mapGetters} from "vuex";
import orderDetailPage from '@/components/order-detail/order-detail'
export default {
    data: function () {
        return {
            query: {
                text: '',
                times: '',
                pageIndex: 1,
                pageSize: 10
            },
            incomeData: {
                text: '',
                times: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            tableDataSecond: [],
            multipleSelection: [], //商家申请多选 选中
            incomeSelection: [], //财务收入多选 选中
            delList: [],
            editVisible: false,
            pageTotal: 1,
            pageTotalSecond: 1,
            form: {},
            coms_list: [],
            idx: -1,
            id: -1,
            on: 1,
            apply: {}, //申请 顶部提示
            financeIncome: {
                timeTotal: 0,
                total: 0
            }, //申请 顶部提示

            applyData: {
                orderNum: 0,
                orderPaySum: 0,
                commissionPay: 0,
                moneyPaySum: 0,
                pointPaySum: 0,
                total: 0,
                orderPriceDiscount: 0,
                serviceCharge: 0,
                orderPresent: 0,
                adminCoupon: 0
            },
            allStore: [],
            storeSelect: '',
            orderNo: '',
            auditState: false,
            orderDetailInfo:{},
            storeName:'',
            waitExaminer:{},//等待审核数据
            waitExaminerIndex:'',//等待审核数据下标
        };
    },
    components:{
        orderDetailPage
    },
    watch: {},
    created() {
        this.getData();
        this.storeList();
        // this.incomeList()
        this.applySelectionChange()
    },
    methods: {
        getData() {
            let data = {
                orderNo: this.orderNo,
                timeStart: this.query.times ? this.$regular.timeData(this.query.times[0], 2) : '',
                timeEnd: this.query.times ? this.$regular.timeData(this.query.times[1], 2) : '',
                current: this.query.pageIndex,
                size: this.query.pageSize,
                storeName: this.storeName || '',
            };
            getList(data).then((res) => {
                if(res.data.code == 200){
                    res.data.data.records.forEach(v=>{

                    })
                    this.tableData = res.data.data.records;
                    this.pageTotal = res.data.data.total;
                }else{
                    this.$message.error(res.data.msg);
                }
            });


            // return
            // let data = {
            //     orderNo: this.orderNo,
            //     beginTime: this.query.times ? this.$regular.timeData(this.query.times[0], 2) : '',
            //     overTime: this.query.times ? this.$regular.timeData(this.query.times[1], 2) : '',
            //     pageNo: this.query.pageIndex,
            //     pageSize: this.query.pageSize,
            //     storeId: this.storeSelect
            // };
            // this.$post('/admin/audit/auditLimit', data).then((res) => {
            //     res.data.list.forEach((v) => {
            //         switch (v.orderStatus) {
            //             case 0:
            //                 v['orderState'] = '未设置状态';
            //                 break;
            //             case 1:
            //                 v['orderState'] = '已接单';
            //                 break;
            //             case 2:
            //                 v['orderState'] = '已拒绝';
            //                 break;
            //             case 3:
            //                 v['orderState'] = '未到店';
            //                 break;
            //             case 4:
            //                 v['orderState'] = '已到店';
            //                 break;
            //             case 5:
            //                 v['orderState'] = '未消费';
            //                 break;
            //             case 6:
            //                 v['orderState'] = '已离开';
            //                 break;
            //         }
            //         switch (v.orderType) {
            //             case 0:
            //                 v['orderTypeText'] = '预定桌';
            //                 break;
            //             case 1:
            //                 v['orderTypeText'] = 'AA拼单';
            //                 break;
            //             case 2:
            //                 v['orderTypeText'] = '抢座';
            //                 break;
            //             case 3:
            //                 v['orderTypeText'] = '会员卡';
            //                 break;
            //             case 4:
            //                 v['orderTypeText'] = '扣除手续费';
            //                 break;
            //         }
            //     });
            //     this.tableData = res.data.list;
            //     this.pageTotal = res.data.total;
            // });
        },
        // 获取 财务收入列表
        incomeList() {
            let data = {
                orderId: this.orderNo,
                storeId: this.storeSelect,
                startDate: this.incomeData.times ? this.$regular.timeData(this.incomeData.times[0], 2) : '',
                endDate: this.incomeData.times ? this.$regular.timeData(this.incomeData.times[1], 2) : '',
                current: this.incomeData.pageIndex,
                size: this.incomeData.pageSize,
            };
            getFinanceRecevoirList(data).then(res=>{
                if(res.data.code == 200){
                    res.data.data.records.forEach((v) => {
                        switch (v.payWay) {
                            case 0:
                                v['payWayText'] = '支付宝';
                                break;
                            case 1:
                                v['payWayText'] = '微信';
                                break;
                            case 2:
                                v['payWayText'] = '积分';
                                break;
                        }
                    });
                    // this.financeIncome.total = res.data.total;
                    // this.financeIncome.timeTotal = res.data.timeTotal;
                    this.tableDataSecond = res.data.data.records;
                    this.pageTotalSecond = res.data.data.total;
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },

        storeList() {
            let data = {
                size:500,
                current:1
            }
            storeList(data).then(res=>{
                this.allStore = res.data.data.records;
                this.allStore.unshift({ id: '', name: '全部' });
            })
        },

        // 通过/退回申请
        passOrBack(index, row, type) {
            console.log(row)
            this.waitExaminer = row
            this.waitExaminerIndex = index
            this.auditState = true
            // let arr = [];
            // arr.push(row.id);
            // if (row.examine != 1) return;
            // let data = {
            //     examine: type,
            //     ids: arr
            // };
            // this.$post('/admin/audit/statusAudit', data).then((res) => {
            //     if (res.code == 0) {
            //         if (type == 2) {
            //             this.$set(row, 'examine', 2);
            //         } else if (type == 4) {
            //             this.$set(row, 'examine', 4);
            //         }
            //     } else {
            //         this.$message.error(res.msg);
            //     }
            // });
        },


        // 编辑操作
        look(index, row) {
            orderDetail({orderId:row.id || row.orderId,isPlatform:1}).then((res) => {
                if(res.data.code == 200){
                    this.editVisible = true;
                    this.idx = index;
                    this.orderDetailInfo = res.data.data
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.applySelectionChange()
            if (this.on == 1) {
                this.$set(this.query, 'pageIndex', 1);
                this.getData();
            } else {
                this.$set(this.incomeData, 'pageIndex', 1);
                this.incomeList();
            }
        },
        handleChange(type) {
            if (type == 1 && this.on != 1) {
                this.getData();
                this.$set(this.query, 'pageIndex', 1);
            } else if (type == 2 && this.on != 2) {
                this.incomeList();
                this.$set(this.incomeData, 'pageIndex', 1);
            }
            this.on = type;
        },
        // 选择商家
        selectStore(e){
            let obj = {};
            obj = this.allStore.find((item) => {
                return item.id === e;
            });
            this.storeName = obj.name;
        },
        //商家申请 多选操作
        applySelectionChange() {
            let data = {
                timeStart: this.incomeData.times ? this.$regular.timeData(this.incomeData.times[0], 2) : '',
                timeEnd: this.incomeData.times ? this.$regular.timeData(this.incomeData.times[1], 2) : '',
                storeName: this.storeName || '',
            };
            statistics(data).then(res=>{
                if (res.data.code == 200) {
                    this.applyData.orderNum = res.data.data.orderNum;
                    this.applyData.commissionPay = res.data.data.commissionPay;
                    this.applyData.paidMoney = res.data.data.paidMoney;
                    this.applyData.payableMoney = res.data.data.payableMoney;
                    this.applyData.receiptsMoney = res.data.data.receiptsMoney;
                    // this.applyData.orderPaySum = res.data.data.orderPaySum;
                    // this.applyData.moneyPaySum = res.data.data.moneyPaySum;
                    // this.applyData.pointPaySum = res.data.data.pointPaySum;
                    // this.applyData.total = res.data.data.total;
                    // this.applyData.orderPriceDiscount = res.data.data.orderPriceDiscount;
                    // this.applyData.serviceCharge = res.data.data.serviceCharge;
                    // this.applyData.orderPresent = res.data.data.orderPresent;
                    // this.applyData.adminCoupon = res.data.data.adminCoupon;
                } else {
                    this.$message({ message: res.data.msg, type: 'warning' });
                }
            })
        },
        // 财务收入  多选
        incomeSelectionChange(val) {
            let arr = [];
            this.incomeSelection = val;
            val.forEach((v) => {
                arr.push(v.id);
            });
            // this.$post(`/admin/audit/calculate`).then((res) => {
            //     if (res.code == 0) {
            //         this.$message.success('删除成功');
            //         this.tableData.splice(index, 1);
            //     }
            // });
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },

        // 拒绝审核
        refuseAudit() {
            let data = {
                accountsId: "",
                isPass: 0,
                orderId: this.waitExaminer.id,
                storeId: this.waitExaminer.storeId
            }
            orderStatusAudit(data).then(res=>{
                if (res.data.code == 200) {
                    this.$message.success('已拒绝');
                    this.auditState = false;
                    this.$set(this.waitExaminer,'statusAudit',2)
                }else{
                    this.$message.error(res.data.msg);
                }
            })
        },
        // 通过审核
        passAudit() {
            let data = {
                storeId:this.waitExaminer.storeId
            }
            storeInfo(data).then(res=>{
                if (res.data.code == 200) {
                    console.log(res)
                }else{
                    this.$message.error(res.data.msg);
                }
            })
            // let arr = [];
            // this.multipleSelection.forEach((v) => {
            //     arr.push(v.id);
            // });
            // let data = {
            //     examine: 4,
            //     ids: arr
            // };
            // this.$post(`/admin/audit/statusAudit`, data).then((res) => {
            //     if (res.code == 0) {
            //         this.getData();
            //         this.$message.success('已通过');
            //         this.auditState = false;
            //     }
            // });
        },

        // audit() {
        //     if (this.multipleSelection.length <= 0) {
        //         this.$message.error(`请选择商家`);
        //         return;
        //     }
        //     this.auditState = true;
        // },

        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handlePageChangeSecond(val) {
            this.$set(this.incomeData, 'pageIndex', val);
            this.incomeList();
        },

        // // 确认订单
        // affirmOrder(index, row) {
        //     this.$get(`/admin/transaction/affirmById/${row.id}`).then((res) => {
        //         if (res.code == 0) {
        //             this.$message.success('修改成功');
        //             this.$set(row, 'affirm', row.affirm == 1 ? 0 : 1);
        //         }
        //     });
        // },
        // // 问题订单
        // questionOrder(index, row) {
        //     this.$get(`/admin/transaction/issueById/${row.id}`).then((res) => {
        //         if (res.code == 0) {
        //             this.$message.success('修改成功');
        //             this.$set(row, 'issue', row.issue == 1 ? 0 : 1);
                    
        //         }
        //     });
        // }
    }
};
</script>

<style scoped lang='scss'>
$border-color: #e4e4e4;
$color_text: red;
.el-button--small {
    width: 80px;
}
.finance {
    /deep/.el-upload--text {
        width: 300px;
    }
    .price_total {
        margin-bottom: 20px;
        font-size: 14px;
        .tl_num {
            color: $color_text;
            margin-right: 40px;
            font-weight: bold;
        }
        .tm {
            margin: 0 40px;
        }
    }
    .look_order {
        text-decoration: underline;
        color: $color_text;
        cursor: pointer;
    }
    /* 弹窗 */
    .detail_box {
        margin-left: 40px;
        .order_detail {
            display: flex;
            .ol {
                flex: 0.4;
                .or_li {
                    display: flex;
                    margin-bottom: 10px;
                }
                .or_lab {
                    flex: 0.3;
                    width: 100px;
                }
                .or_info {
                    flex: 0.7;
                    width: 100px;
                    border: 1px solid $border-color;
                    border-radius: 5px;
                    padding: 7px 10px;
                    box-sizing: border-box;
                }
                .ors {
                    margin-right: 41px;
                }
                .sta {
                    color: #488c05;
                }
                .de_ad {
                    display: inline-block;
                    width: 50%;
                }
                .de_ad:nth-child(2) {
                    text-align: right;
                }
                .total {
                    display: inline-block;
                    border: 1px solid $border-color;
                    padding: 5px 7px;
                    border-radius: 5px;
                    margin-left: 20px;
                }
                .or_t {
                    flex: 0.7;
                }
                .dl {
                    margin: 20px 0;
                }
                .tr {
                    text-align: right;
                }
            }
            .or {
                flex: 0.6;
                // text-indent: 50px;
                display: flex;
                .orl {
                    flex: 0.2;
                    padding-left: 50px;
                }
                .orr {
                    flex: 0.65;
                    .seat,
                    .coupons {
                        border-bottom: 1px solid $border-color;
                        margin-bottom: 10px;
                    }
                    .drinks {
                        height: 220px;
                        overflow-y: scroll;
                    }
                    .drinks::-webkit-scrollbar {
                        display: none;
                    }
                    .tit {
                        color: rgb(236, 126, 0);
                        margin-bottom: 10px;
                    }
                    .oli {
                        line-height: 32px;
                        span {
                            display: inline-block;
                        }
                        .olil {
                            width: 50%;
                        }
                        .olir {
                            width: 50%;
                            span {
                                text-decoration: line-through;
                                color: rgb(138, 138, 138);
                            }
                        }
                    }
                    .save {
                        text-align: right;
                    }
                    .onu {
                        line-height: 20px;
                    }
                }
            }
            .addOrder {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                color: #7777f5;
            }
        }
    }
}
.list-box {
    border-bottom: 1px solid #c0c4cc;
    margin-bottom: 18px;

    p {
        display: flex;
        margin-bottom: 18px;

        :first-child {
            width: 160px;
        }
    }
}
.drink-list {
    display: flex;
    margin-bottom: 18px;

    .good-box {
        width: 160px;

        .good-name {
            margin-bottom: 6px;
            display: flex;
            justify-content: space-between;
            padding-right: 20px;

            .num {
                min-width: 20px;
            }
        }
    }

    .unline {
        text-decoration: line-through;
        color: #bcbcbc;
        margin-left: 10px;
    }
}

.add-drink-list {
    margin-bottom: 20px;
    border: 1px solid #c0c4cc;
    border-radius: 6px;
    padding: 20px;

    .order-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        color: #409eff;
    }
}
.change-seat {
    p {
        margin-bottom: 18px;
        display: flex;
        :first-child {
            width: 120px;
        }
    }
}
.handle-box {
    margin-bottom: 10px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 180px;
}
.com_del_box {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
/deep/ .el-icon-circle-close {
    color: white;
}
/deep/.handle-input {
    width: 150px;
    margin-bottom: 10px;
}
/deep/ .el-dialog {
    min-width: 900px;
    margin-top: 10vh !important;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/ .el-dialog__body {
    padding-top: 10px;
}
.addStyle {
    color: #fff !important;
    background: red !important;
}

/deep/.el-dialog--center {
    min-width: 500px !important;
    margin-top: 28vh !important;
}
</style>
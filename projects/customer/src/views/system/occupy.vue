<template>
    <div id="order_msg">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" :class="tabNav == 2 ? '' : 'off'" class="handle-add tab_btn" @click="getRoportList(2)">占座订单</el-button>
                <el-button type="primary" :class="tabNav == 1 ? '' : 'off'" class="handle-add tab_btn" @click="getData(1)">占座设置</el-button>
            </div>
            <div class="handle-box">
                <el-button type="primary" v-show="tabNav == 1" class="handle-add mr10" @click="addNewSeat">新增占座价格</el-button>
                <el-button class="mr10" v-show="tabNav == 1" type="danger" icon="el-icon-delete" @click="delAllSelectionPrice">批量删除</el-button>
                <el-input v-show="tabNav == 2" v-model="query.text" placeholder="请输入关键字" class="handle-input mr10"></el-input>
                <el-button v-show="tabNav == 2" type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>

            </div>

            <el-table
                v-show="tabNav == 1"
                :data="tableDataType"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChangePrice"
            >
                 <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" fixed prop="id" type="index" align="center"></el-table-column>
                <el-table-column prop="minutes" min-width="300" label="占座时间" align="center"></el-table-column>
                <el-table-column prop="price" min-width="300" label="占座价格" align="center"></el-table-column>
                <el-table-column label="操作" width="150" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handEditor(scope.$index, scope.row)" type="primary">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-table
                v-show="tabNav == 2"
                :data="tableDataList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChangeOrder"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="storeName" min-width="150" label="占座商家" align="center"></el-table-column>
                <el-table-column prop="timeCreate" min-width="180" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="timePay" min-width="180" label="支付时间" align="center"></el-table-column>
                <el-table-column prop="userName" min-width="150" label="预定用户" align="center"></el-table-column>
                <el-table-column prop="userPhone" min-width="160" label="预定手机号" align="center"></el-table-column>
                <el-table-column prop="accountPhone" min-width="160" label="玖座账号手机号" align="center"></el-table-column>
                <el-table-column prop="occupyNo" min-width="220" label="总订单号" align="center"></el-table-column>
                <el-table-column prop="orderNo" min-width="220" label="订单号" align="center"></el-table-column>
                <el-table-column prop="verify" min-width="120" label="验证码" align="center"></el-table-column>
                <el-table-column prop="payWay" min-width="120" label="支付方式" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.payWay==1?'微信':'支付宝'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="minutes" min-width="120" label="占座时间" align="center"> </el-table-column>
                <el-table-column prop="occupyPhone" min-width="180" label="接单人员电话" align="center" fixed="right">
                    <template  slot-scope="scope">
                        <!-- @click="seatTel(scope.$index, scope.row)" -->
                        <span class="seatTel">{{scope.row.occupyPhone?scope.row.occupyPhone:'-'}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="250" align="center" fixed="right">
                    <template slot-scope="scope">
                        <template>
                            <el-button v-if="scope.row.status == 0 || scope.row.status == 8" @click="setStatusOn(scope.$index, scope.row)" type="primary">
                                已安排
                            </el-button>
                            <el-button v-if="scope.row.status == 1" @click="setStatusOn(scope.$index, scope.row)" type="success">
                                已安排
                            </el-button>
                            <el-button v-if="scope.row.status == 6" type="info">
                                已安排
                            </el-button>
                        </template>

                        <template>
                            <el-button v-if="scope.row.status == 1" @click="setStatusOff(scope.$index, scope.row)" type="primary">
                                已离店
                            </el-button>
                            <el-button v-else  type="info">
                                已离店
                            </el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination" v-if="tabNav == 2">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>占座设置</span>
            </div>
            <div class="zan_seat">
                <el-form ref="form" :model="form" label-width="80px" class label-position="left ">
                    <div>
                        <el-form-item label="">
                            <el-form :model="formSeat" ref="formSeat" class="demo-dynamic">
                                <el-form-item
                                    v-for="(domain, index) in formSeat.domains"
                                    :key="domain.key"
                                    :prop="'domains.' + index + '.value'"
                                >
                                    <div class="inp_box">
                                        <label for="" class="lab">占座时间</label>
                                        <el-input v-model="domain.minutes" class="num" placeholder="请输入分钟数">
                                            <template slot="append">min</template>
                                        </el-input>

                                        <label for="" class="lab">占座价格</label>
                                        <el-input v-model="domain.price" class="num" placeholder="请输入价格">
                                            <template slot="append">￥</template>
                                        </el-input>

                                        <!-- <i v-show="addOrUp == 1" class="el-icon-error" @click.prevent="removeDomain(domain)"></i> -->
                                    </div>
                                </el-form-item>
                            </el-form>
                            <!-- <img class="addCou" src="../../assets/img/jia.png" @click="addLab()" alt=""  v-show="addOrUp == 1" /> -->
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('')">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog :visible.sync="editVisible1" width="20%" append-to-body="true">
            <div class="accepter">
                <el-form ref="form" :model="form1" label-width="120px" class label-position="left ">
                    <el-form-item label="接单人姓名">
                        <el-input v-model="form1.name" maxlength="15" placeholder="接单人姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="接单人手机号">
                        <el-input v-model="form1.tel" maxlength="15" placeholder="接单人手机号"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible1 = false">取 消</el-button>
                <el-button type="primary" @click="saveSetStatusOn('')">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
import {getList, add, update, remove,getOccupyOrder,getOccupyOrderTake,getOccupyOrderLeave} from "@/api/system/occupy";
import {mapGetters} from "vuex";
export default {
    name: 'basetable',
    data() {
        return {
            editVisible1:false,
            form1:{
                name:'',
                tel:'',
                id:''
            },
            query: {
                pageIndex: 1,
                pageSize: 10,
                text: ''
            },
            tabNav: 2,
            tableData: [],
            tableDataType: [],
            tableDataList: [],
            multipleSelectionP: [],
            multipleSelectionO: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            id: -1,
            formData: [],
            formSeat: {
                domains: [
                    {
                        price: '',
                        minutes: '',
                        id: '',
                    }
                ]
            },
            idx:'',
            removeDate: [],
            joinUrl: this.$imgHead,
            addOrUp:1,  //1新增  2修改
            idx:0,
        };
    },
    watch: {
        watchOnloadOrder: {
            handler(val) {
                this.getRoportList();
            }
        }
    },
    computed: {
        watchOnloadOrder() {
            return this.$store.state.onloadOrder;
        }
    },
    created() {
        // this.getData();
        this.getRoportList()
    },
    methods: {
        // 占座设置列表
        getData(type=1) {
            this.tabNav = type;
            let data = {
                current : 1,
                size : 100
            }
            getList().then((res) => {
                this.tableDataType = res.data.data.records;
            });
        },
        // 占座订单列表
        getRoportList(type=2) {
            this.tabNav = type;
            let data = {
                keyword: this.query.text,
                size: this.query.pageSize,
                current: this.query.pageIndex
            };
            getOccupyOrder(data).then((res) => {
                this.tableDataList = res.data.data.records;
                this.pageTotal = res.data.data.total;
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getRoportList();
        },

        setStatusOn(index, row){
            this.editVisible1 = true
            this.form1.id = row.orderId
            this.idx = index
        },
        saveSetStatusOn(){
            if (!this.form1.tel) {
                this.$message.warning(`接单人手机号不能为空`);
                return;
            }
            let data = {
                id:this.form1.id,
                consumerName:this.form1.name,
                consumerPhone:this.form1.tel,
            }
            getOccupyOrderTake(data).then(res=>{
                if(res.data.code == 200){
                    this.$message.success('操作成功');
                    this.editVisible1 = false
                    this.form1 = {
                        name:'',
                        tel:'',
                        id:''
                    }
                    this.$set(this.tableDataList[this.idx],'status',1)
                }else{
                    this.$message.warning(res.msg);
                }
            })
        },
        setStatusOff(index, row){
            if(row.status == 0 || row.status == 8){
                this.$message.warning('请先安排占座');
                return
            }
            this.$confirm('是否确认已离店？', '提示', {
                type: 'warning'
            }).then(() => {
                getOccupyOrderLeave({id:row.orderId}).then((res) => {
                    if(res.data.code == 200){
                        this.$set(row, 'status', 6);
                    }else{
                        this.$message.warning(res.msg);
                    }
                });
            })
            .catch(() => {});
        },

        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getRoportList(2);
        },
        //新增 价格
        addNewSeat() {
            this.form = {};
            this.addOrUp = 1;
            (this.formSeat = { domains: [{ value: '' }] }), (this.editVisible = true);
        },

        // 编辑 价格
        handEditor(index, row) {
            this.addOrUp = 2;
            (this.formSeat = {
                domains: [
                    {
                        minutes: '',
                        price: '',
                        id: '',
                    }
                ]
            }),
                (this.idx = index);
            this.form = this.$regular.deep(row);
            this.editVisible = true;
            let list = []
            list.push(row)
            for (let i = 0; i < list.length; i++) {
                this.$set(this.formSeat.domains,i,{
                    minutes: list[i].minutes,
                    price: list[i].price,
                    id: list[i].id,
                })
            }
        },

        // 批量删除占座价格
        handleSelectionChangePrice(val) {
            this.multipleSelectionP = val;
        },
        delAllSelectionPrice() {
            if(this.tabNav == 2){
                this.delAllSelectionOrder()
                return
            }
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                let arr = []
                this.multipleSelectionP.forEach(v=>{
                    arr.push(v.id)
                })
                let str = arr.join(',')
                remove(str).then((res) => {
                    if(res.data.code == 200){
                        this.$message.success('删除成功');
                        this.getData(1);
                    }else{
                        this.$message.warning('系统繁忙');
                    }
                });
                return;
            })
            .catch(() => {});
        },

        // 批量删除占座订单
        handleSelectionChangeOrder(val) {
            this.multipleSelectionO = val;
        },
        delAllSelectionOrder() {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                let arr = []
                this.multipleSelectionO.forEach(v=>{
                    arr.push(v.id)
                })
                this.$post('/admin/occupySeatOrder/deleteBatch', arr).then((res) => {
                    if(res.code == 0){
                        this.$message.success('删除成功');
                        this.getRoportList(2);
                    }else{
                        this.$message.warning('系统繁忙');
                    }
                });
                return;
            })
            .catch(() => {});
        },
     
        addLab() {
            this.formSeat.domains.push({});
        },
        removeDomain(item) {
            item.del = true;
            this.removeDate.push(item);
            var index = this.formSeat.domains.indexOf(item);
            if (index !== -1) {
                this.formSeat.domains.splice(index, 1);
            }
        },
        // 新增 价格
        saveEdit(val = '') {
            if(this.addOrUp == 2){
                this.updateEdit()
                return
            }
            // let arr = [];
            let str = {};
            this.formSeat.domains.forEach((i) => {
                str['minutes'] = i.minutes;
                str['id'] = i.id || '';
                str['price'] = i.price || '';
                // arr.push(str);
            });

            add(str).then((res) => {
                if (res.data.code == 200) {
                    this.$message.success('操作成功');
                    this.editVisible = false;
                    this.getData(1);
                }else{
                    this.$message.error(res.data.msg);
                }
            });
        },
        // 修改保存
        updateEdit(){
            let data = {
                id:this.formSeat.domains[0].id,
                minutes:this.formSeat.domains[0].minutes,
                price:this.formSeat.domains[0].price,
            }
            update(data).then((res) => {
                if (res.data.code == 200) {
                    this.$message.success('操作成功');
                    this.editVisible = false;
                    this.getData(1);
                }else{
                    this.$message.error(res.data.msg);
                }
            });
        },
        // // 设置手机号
        // seatTel(index, row){
        //     this.$prompt('请输入占座人员号码', '提示', {
        //         confirmButtonText: '确定',
        //         cancelButtonText: '取消',
        //         inputValue: row.occupyPhone,
        //         inputPattern: /(^0\d{2,3}\d{7,8}$)|(^400[016789]\d{6}$)|(^1[3|4|5|6|7|8|9][0-9]{9}$)/,
        //         inputErrorMessage: '请输入标准格式手机号'
        //     }).then(({ value }) => {
        //         this.$post(`/admin/occupySeatOrder/setPhone`,{occupyPhone:value,id:row.id}).then(res=>{
        //             if(res.code == 0){
        //                 this.$set(row,'occupyPhone',value)
        //                 this.$set(row,'verify',0)
        //                 this.$set(row,'leaveStatus',0)
        //                 this.$message.success('保存成功');
        //             }else{
        //                 this.$message.error(res.data);
        //             }
        //         })  
        //     }).catch(() => {
        //     }); 
        // },
    }
};
</script>

<style scoped lang='scss'>
.handle-box {
    margin-bottom: 20px;
    .tab_btn {
        margin-left: 0;
        border-radius: 0;
    }
    .off {
        background: #c5c5c5;
        border: 1px solid #c5c5c5;
    }
}
.zan_seat{
    .num{
        height: 32px;
        margin-right: 30px;
        width: 180px;
    }
    .lab{
        margin-right: 25px;
    }
    /deep/ .el-input-group__append{
        padding: 0 10px;
    }
}
.seatTel{
    color: #999999;
    // text-decoration: underline;
    // cursor: pointer;
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
    display: inline-block;
    margin: auto;
    width: 80px;
    height: 80px;
    margin-right: 10px;
}
.table-td-thumb img {
    width: 100%;
    height: 100%;
}
/deep/ .el-dialog {
    min-width: 850px;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/.handle-input {
    width: 150px;
}
// /deep/ .el-form--label-left{
//     margin-left: 30px;
// }
.self_inp {
    height: 32px;
    line-height: 32px;
    padding: 0 15px;
    border: 1px solid #e4e7ed;
    outline: none;
    color: #606266;
    width: 150px;
    border-radius: 4px;
    margin-right: 10px;
}
.self_inp::-webkit-input-placeholder {
    color: #c0c4cc;
}
.addCou {
    height: 32px;
    cursor: pointer;
}
/deep/.el-icon-circle-close {
    color: white;
}

.accepter{
    /deep/.el-input--small{
        width: 30%;
    }
}
</style>

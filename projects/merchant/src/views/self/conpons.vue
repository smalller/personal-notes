<template>
    <div id="coupons">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-text"></i> 优惠券 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="handleEdit()">添加</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="dtlCoupon('', primary_dtl_cou)"
                    >删除</el-button
                >
                <el-input v-model="query.text" placeholder="关键字" class="handle-input mr10"></el-input>
                <el-select v-model="query.coupons" placeholder="优惠券类型" class="handle-select mr10">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="满减券" value="2"></el-option>
                    <el-option key="2" label="抵扣券" value="1"></el-option>
                    <el-option key="3" label="消费礼券" value="3"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" fixed width="180" align="center"></el-table-column>
                <el-table-column prop="category" align="center" min-width="100" label="优惠券类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.category == 1 ? '抵扣券' : scope.row.category == 2 ? '满减券' : '消费礼券' }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="details" min-width="80" label="优惠详情"></el-table-column>
                <el-table-column prop="sum" align="center" min-width="150" label="发布张数"></el-table-column>
                <el-table-column align="center" prop="remainder" min-width="80" label="剩余张数"></el-table-column>
                <el-table-column align="center" prop="grantTime" min-width="100" label="截止发放时间"></el-table-column>
                <el-table-column align="center" prop="beginTime" min-width="100" label="开始时间"></el-table-column>
                <el-table-column align="center" prop="overTime" min-width="100" label="结束时间"></el-table-column>
                <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            :type="scope.row.apply == 1 ? (scope.row.storeApply == 1 ? 'success' : 'danger') : 'danger'"
                            @click="enable(scope.$index, scope.row)"
                            >{{ scope.row.apply == 1 ? (scope.row.storeApply == 1 ? '已启用' : '已禁用') : '已禁用' }}</el-button
                        >
                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row, 1)">查看</el-button>

                        <el-button type="primary" @click="handleEdit(scope.$index, scope.row, 2)">编辑</el-button>
                        <!-- <el-button
                            type="primary"
                            @click="dtlCoupon(scope.$index, scope.row)"
                        >删除</el-button> -->

                        <!-- <el-button type="text" icon="el-icon-view" @click="handleEdit(scope.$index, scope.row,1)" >查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row,2)" >编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="dtlCoupon(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
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
        <el-dialog :title="doing" :visible.sync="editVisible" width="32%" append-to-body="true">
            <el-form ref="form" :model="form" label-width="120px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>优惠券信息</span>
                </div>

                <div class="top_info">
                    <div class="activity">
                        <div class="in_act">
                            <el-form-item label="优惠券类型">
                                <el-select
                                    v-model="form.region"
                                    placeholder="请选择类型"
                                    @change="selChange"
                                    :disabled="readOnly || editRead"
                                >
                                    <el-option label="满减券" value="2"></el-option>
                                    <el-option label="抵扣券" value="1"></el-option>
                                    <el-option label="消费礼券" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="优惠券详情" v-if="form.region">
                                <div class="add_con">
                                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                                        <el-form-item
                                            v-for="(domain, index) in dynamicValidateForm.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div v-if="form.region == 2">
                                                <span class="tt">满</span>
                                                <el-input v-model="domain.full" class="num" :disabled="readOnly">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">减</span>
                                                <el-input v-model="domain.minus" class="num" :disabled="readOnly">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">送</span>
                                                <el-input v-model="domain.give" class="num" :disabled="readOnly">
                                                    <template slot="append">张</template>
                                                </el-input>
                                                <!-- <i
                                                    class="el-icon-error"
                                                    @click.prevent="removeDomain(domain)"
                                                    v-if="!readOnly && !editRead"
                                                ></i> -->
                                            </div>

                                            <div v-if="form.region == 1">
                                                <span class="tt">直接抵扣</span>
                                                <el-input v-model="domain.minus" class="num" :disabled="readOnly">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">送</span>
                                                <el-input v-model="domain.give" class="num" :disabled="readOnly">
                                                    <template slot="append">张</template>
                                                </el-input>
                                                <!-- <i
                                                    class="el-icon-error"
                                                    @click.prevent="removeDomain(domain)"
                                                    v-if="!readOnly && !editRead"
                                                ></i> -->
                                            </div>

                                            <div v-if="form.region == 3">
                                                <span class="tt">满</span>
                                                <el-input v-model="domain.full" class="num" :disabled="readOnly">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">赠</span>
                                                <el-input v-model="domain.minus" class="num" placeholder="自定义商品" :disabled="readOnly"> </el-input>
                                                <span class="tt">送</span>
                                                <el-input v-model="domain.give" class="num" :disabled="readOnly">
                                                    <template slot="append">张</template>
                                                </el-input>
                                                <!-- <i
                                                    class="el-icon-error"
                                                    @click.prevent="removeDomain(domain)"
                                                    v-if="!readOnly && !editRead"
                                                ></i> -->
                                            </div>

                                            <div class="block">
                                                <span>开始结束时间：</span>
                                                <el-date-picker
                                                    v-model="domain.start_end"
                                                    type="daterange"
                                                    :disabled="readOnly"
                                                    range-separator="至"
                                                    start-placeholder="开始日期"
                                                    end-placeholder="结束日期"
                                                >
                                                </el-date-picker>
                                            </div>

                                            <div class="block">
                                                <span>截止发放时间：</span>
                                                <el-date-picker
                                                    v-model="domain.offTime"
                                                    :disabled="readOnly"
                                                    type="date"
                                                    placeholder="截止发放时间"
                                                >
                                                </el-date-picker>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <!-- <img class="addCou" src="../../assets/img/jia.png" @click="addCou" alt="" v-if="!readOnly && !editRead" /> -->
                            </el-form-item>
                        </div>
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">返回</el-button>
                <el-button type="primary" @click="saveBefore" v-if="!readOnly">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {init} from "@/api/demo/conpons";
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                text: '',
                pageIndex: 1,
                pageSize: 20,
                coupons: ''
            },
            doing: '',
            form: {},
            pageTotal: null,
            editVisible: false,
            option:{
                dialogClickModal: false
            },
            tableData: [],
            dynamicValidateForm: {
                domains: [
                    {
                        full: '',
                        minus: '',
                        give: '',
                        start_end: ''
                    }
                ] //标签
            },
            primary_dtl_cou: '', //多选中的数组
            readOnly: false, //查看优惠券时禁点
            editRead: false, //编辑时禁点
            couId: '' //查看编辑时id
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            let data = {
                pageNo: this.query.pageIndex,
                pageSize: this.query.pageSize,
                category: this.query.coupons,
                details: this.query.text
            };
            // this.$post('/merchant/store/coupon/couponLimit', data).then((res) => {
            //     if (res.code == 0) {
            //         this.tableData = res.data.list;
            //         this.pageTotal = res.data.total;
            //     } else {
            //         this.$message({ message: res.mesg, type: 'warning' });
            //     }
            // });
            init(data).then(res => {
                console.log(res)
            }).catch(err=>{
                console.log(err)
            });
        },
        // 触发搜索按钮
        handleSearch() {
            // if (!this.query.text) {
            //     this.$message.error('请输入关键字');
            //     return;
            // }
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 下拉框改变时
        selChange() {
            this.dynamicValidateForm = {
                domains: [
                    {
                        full: '',
                        minus: '',
                        give: '',
                        start_end: '',
                        offTime: ''
                    }
                ]
            };
        },
        // 查看/编辑操作
        handleEdit(index = '', row = '', type) {
            this.form = {};
            if(row.category == 3){
                // 当前类型为消费礼券时
                let arr = row.details.split('赠')
                row.discountMoney = arr[1]
            }
            if (row) {
                this.couId = row.id;
                if (type == 1) {
                    this.readOnly = true;
                    this.editRead = false;
                } else {
                    this.readOnly = false;
                    this.editRead = true;
                }
                this.form.region = row.category.toString();
                this.dynamicValidateForm = {
                    domains: [
                        {
                            full: row.contentMoney,
                            minus: row.discountMoney,
                            give: row.remainder,
                            start_end: [row.beginTime, row.overTime],
                            offTime: row.grantTime
                        }
                    ]
                };
            } else {
                this.readOnly = false;
                this.editRead = false;
                this.couId = '';
            }
            // if(row){
            //     this.idx = index;
            //     this.form = row;
            // }
            this.editVisible = true;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 批量增加优惠券
        addCou() {
            this.dynamicValidateForm.domains.push({});
        },
        // 删除 新增时的优惠券
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        // 多选
        handleSelectionChange(val) {
            this.primary_dtl_cou = val;
        },
        //删除已有优惠券
        dtlCoupon(index, val) {
            let str;
            if (val.length) {
                str = val.map((v) => {
                    return v.id;
                });
            } else {
                str = val.id;
                str = str.split(',');
            }
            this.$post(`/merchant/store/coupon/batchDeleteCoupon`, str).then((res) => {
                if (res.code == 0) {
                    this.$message({ message: '删除成功', type: 'success' });
                    this.getData();
                } else {
                    this.$message({ message: res.msg, type: 'warning' });
                }
            });
        },
        // 启用
        enable(index, val) {
            if (val.apply == 0) {
                this.$alert('此优惠券为平台禁用，请联系平台', '提示', {
                    confirmButtonText: '确定'
                });
                return;
            }
            this.$get(`/merchant/store/coupon/storeApply/${val.id}`).then((res) => {
                if (res.code == 0) {
                    this.$set(val, 'storeApply', val.storeApply == 0 ? 1 : 0);
                } else {
                    this.$message({ message: res.msg, type: 'warning' });
                }
            });
        },
        // 新增/修改  保存
        save() {
            let from = this.dynamicValidateForm.domains;
            let url = '',
                id = '',
                urlType = '';
            if (!this.editRead) {
                var arr = [];
                // 新增
                url = '/merchant/store/coupon/save';
                id = '';
            } else {
                // 编辑修改
                url = '/merchant/store/coupon/update';
                id = this.couId;
                var arr = '';
            }
            from.forEach((i) => {
                let str = '';
                if (this.form.region == 1) {
                    str = `直接抵扣${i.minus}元`;
                } else if (this.form.region == 2) {
                    str = `满${i.full}元减${i.minus}元`;
                } else {
                    str = `满${i.full}元赠${i.minus}`;
                }
                let data = {
                    beginTime: this.$regular.timeData(i.start_end[0], 1),
                    category: this.form.region,
                    contentMoney: Number(i.full),
                    details: str,
                    discountMoney: Number(i.minus) || 0,
                    id: id,
                    overTime: this.$regular.timeData(i.start_end[1], 1),
                    remainder: Number(i.give),
                    source: 0,
                    sum: Number(i.give),
                    grantTime: this.$regular.timeData(i.offTime, 2)
                };
                if (!this.editRead) {
                    // 新增
                    arr.push(data);
                    urlType = this.$post;
                } else {
                    // 编辑修改
                    arr = data;
                    urlType = this.$put;
                }
            });
            urlType(url, arr).then((res) => {
                if (res.code == 0) {
                    if (id) {
                        this.$message({ message: '修改成功', type: 'success' });
                    } else {
                        this.$message({ message: '新增成功', type: 'success' });
                    }
                    this.getData();
                    this.editVisible = false;
                } else {
                       if (id) {
                        this.$message({ message: res.msg, type: 'error' });
                    } else {
                        this.$message({ message: res.msg, type: 'error' });
                    }
                }
            });
        },

        // 保存之前的 非空判断
        saveBefore() {
            if (!this.form.region) {
                this.$message({ message: '请选择优惠券类型', type: 'warning' });
                return;
            }
            let arr = this.dynamicValidateForm.domains;
            let addModificationFlag = true
            for (let i in arr) {
                if (this.form.region == 1) {
                    if (!arr[i].minus || !(/(^[1-9]\d*$)/.test(arr[i].minus))) {
                        this.$message({ message: '抵扣金额必须为正整数', type: 'warning' });
                        addModificationFlag = false
                        break;
                    }
                    if (!arr[i].give || !(/(^[1-9]\d*$)/.test(arr[i].give))) {
                        this.$message({ message: '优惠券张数必须为正整数', type: 'warning' });
                        addModificationFlag = false
                        break;
                    }
                } else {
                    if (!arr[i].full || !(/(^[1-9]\d*$)/.test(arr[i].full))) {
                        this.$message({ message: '满减金额必须为正整数', type: 'warning' });
                        addModificationFlag = false
                        break;
                    }
                    if(this.form.region == 2){
                        if (!arr[i].minus || !(/(^[1-9]\d*$)/.test(arr[i].minus))) {
                            this.$message({ message: '抵扣金额必须为正整数', type: 'warning' });
                            addModificationFlag = false
                            break;
                        }
                    }
                    if (!arr[i].give || !(/(^[1-9]\d*$)/.test(arr[i].give))) {
                        this.$message({ message: '优惠券张数必须为正整数', type: 'warning' });
                        addModificationFlag = false
                        break;
                    }
                }
                if (!arr[i].start_end) {
                    this.$message({ message: '请选择时间', type: 'warning' });
                    addModificationFlag = false
                    break;
                }
                if (!arr[i].offTime) {
                    this.$message({ message: '请选择截止发放时间', type: 'warning' });
                    addModificationFlag = false
                    break;
                }
            }
            if(addModificationFlag){
                this.save();
            }
            
            if (!this.editRead) {
                // 新增
            } else {
                // 编辑修改
            }
        }
    }
};
</script>

<style scoped lang='scss'>
$border-color: #dcdfe6;
.lab_list {
    span {
        border: 1px solid $border-color;
        border-radius: 4px;
        padding: 1px 10px;
        margin-right: 20px;
    }
}
.com_del {
    width: 50%;
    border-radius: 4px;
    border: 1px solid $border-color;
    padding: 10px;
}
.com_del_box {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}
.lab_span {
    border: 1px solid #7a7a7a;
    border-radius: 4px;
    margin-right: 10px;
    padding: 1px 10px;
}
.handle-box {
    margin-bottom: 20px;
}
.mr10 {
    margin-right: 10px;
}
.handle-input {
    width: 200px;
    display: inline-block;
}
.red {
    color: #ff0000;
}
.in_act {
    margin-left: 60px;
    .add_con {
        line-height: 32px;
        .tt {
            margin-right: 10px;
        }
        .num {
            height: 32px;
            margin-right: 30px;
            width: 100px;
        }
        /deep/ .el-input-group__append {
            padding: 0 10px;
        }
        i {
            cursor: pointer;
        }
    }
    .addCou {
        height: 32px;
        cursor: pointer;
    }
    .el-form-item--small {
        margin-bottom: 30px;
    }

    .block {
        margin-top: 20px;
    }
}

/deep/.table-td-thumb {
    display: inline-block;
    margin: auto;
    width: 80px;
    height: 80px;
    margin-right: 10px;
}
/deep/ .el-dialog {
    width: 55%;
    min-width: 850px;
}
/deep/ .el-dialog__body {
    padding-top: 20px;
}
/deep/ .el-dialog__header {
    padding: 0;
}
/deep/ .el-image-viewer__close {
    color: white;
}
</style>

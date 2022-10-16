<template>
    <div id="order_msg">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" :class="tabNav == 1 ? '' : 'off'" class="handle-add tab_btn" @click="getData">举报类型</el-button>
                <el-button type="primary" :class="tabNav == 2 ? '' : 'off'" class="handle-add tab_btn" @click="getRoportList"
                    >举报数据</el-button
                >
            </div>
            <div class="handle-box">
                <el-button type="primary" v-show="tabNav == 1" class="handle-add mr10" @click="addNewPerort">新增举报类型</el-button>
            </div>

            <el-table
                v-show="tabNav == 1"
                :data="tableDataType"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="type" min-width="120" label="举报类型" align="center"></el-table-column>
                <el-table-column prop="labels" min-width="300" label="举报单项"></el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handEditor(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="deteleEditor(scope.$index, scope.row)" type="primary">删除</el-button>
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
            >
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="userPhone" min-width="150" label="举报用户手机" align="center"></el-table-column>
                <el-table-column prop="userName" min-width="150" label="举报用户昵称"></el-table-column>
                <el-table-column prop="targetUserPhone" min-width="150" label="被举报用户手机" align="center"></el-table-column>
                <el-table-column prop="targetUserName" min-width="150" label="被举报用户昵称"></el-table-column>
                <el-table-column prop="content" min-width="300" label="举报详情"></el-table-column>
                <el-table-column prop="pictureList" label="举报图片" min-width="150" align="center">
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.pictureList" :key="index" >
                            <el-image
                                class="table-td-thumb"
                                v-if="item"
                                :src="imgHead + item"
                                :preview-src-list="imgHead + item"
                            ></el-image>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <!-- <el-button @click="handEditor(scope.$index, scope.row)" type="primary">查看</el-button> -->
                        <el-button @click="deteleEditorOne(scope.$index, scope.row)" type="primary">删除</el-button>
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
                <span>举报类型</span>
            </div>
            <div class="figure">
                <el-form ref="form" :model="form" label-width="120px" class label-position="left ">
                    <el-form-item label="类型">
                        <!-- <input class="self_inp" type="text" placeholder="请输入举报类型" v-model="form.type" /> -->
                        <el-select v-model="form.type" placeholder="请选择举报类型">
                            <el-option key="违规描述" label="违规描述" value="违规描述"></el-option>
                            <el-option key="侵权行为" label="侵权行为" value="侵权行为"></el-option>
                            <el-option key="未成年" label="未成年" value="未成年"></el-option>
                        </el-select>
                    </el-form-item>

                    <div>
                        <el-form-item label="举报单项">
                            <el-form :model="formReport" ref="formReport" class="demo-dynamic">
                                <el-form-item
                                    v-for="(domain, index) in formReport.domains"
                                    :key="domain.key"
                                    :prop="'domains.' + index + '.value'"
                                >
                                    <div class="inp_box">
                                        <input class="self_inp" type="text" v-model="domain.informTypeName" placeholder="举报单项" />
                                        <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                    </div>
                                </el-form-item>
                            </el-form>
                            <img class="addCou" src="../../../static/img/jia.png" @click="addLab()" alt="" />
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getList, add, update, remove, getReportList, removeReportList} from "@/api/system/configreport";
import {mapGetters} from "vuex";
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10,
                tel: ''
            },
            tabNav: 1,
            tableData: [],
            tableDataType: [],
            tableDataList: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            id: -1,
            formData: [],
            formReport: {
                domains: [
                    {
                        informTypeName: '',
                        informReasonId: '',
                        id: '',
                        del: ''
                    }
                ]
            },
            removeDate: [],
            imgHead: this.$imgHead,
            pictureBigList:[]
        };
    },
    created() {
        // this.getData();
        this.getRoportList()
    },
    methods: {
        // 举报类型列表
        getData() {
            this.tabNav = 1;
            getList().then(res=>{
                if(res.data.code == 200){
                    this.tableDataType = res.data.data.records;
                }
            })
        },
        // 数据列表 
        getRoportList() {
            this.tabNav = 2;
            let data = {
                size: this.query.pageSize,
                current: this.query.pageIndex
            };
            getReportList(data).then(res=>{
                if(res.data.code == 200){
                    res.data.data.records.forEach(v=>{
                        let arr = []
                        arr = v.attach.split(',')
                        v['pictureBigList'] = []
                        arr.forEach(j=>{
                            v.pictureBigList.push(this.imgHead + j)
                        })
                        v['pictureList'] = v.attach.split(',')
                    })

                    this.tableDataList = res.data.data.records;

                    this.pageTotal = res.data.data.total;
                }
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getRoportList();
        },

        addNewPerort() {
            this.form = {};
            (this.formReport = { domains: [{ value: '' }] }), (this.editVisible = true);
        },

        handEditor(index, row) {
            (this.formReport = {
                domains: [
                    {
                        informTypeName: '',
                        informReasonId: '',
                        id: '',
                        del: ''
                    }
                ]
            }),
                (this.idx = index);
            this.form = this.$regular.deep(row);
            let newArr = this.form.labels.split(',')

            for (let i = 0; i < newArr.length; i++) {
                this.formReport.domains[i] = {
                    informTypeName: newArr[i],
                };
            }
            this.editVisible = true;
        },

        // 举报类型删除
        deteleEditor(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(row.id).then(res=>{
                        if(res.data.code == 200){
                            this.$message.success('删除成功');
                            this.tableDataType.splice(index, 1);
                            this.getData();
                        }
                    })
                })
        },
        // 举报数据 删除
        deteleEditorOne(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    removeReportList(row.id).then(res=>{
                        if(res.data.code == 200){
                            this.$message.success('删除成功');
                            this.tableDataList.splice(index, 1);
                        }
                    })
                })
                .catch(() => {});
        },
        addLab() {
            this.formReport.domains.push({});
        },
        removeDomain(item) {
            item.del = true;
            this.removeDate.push(item);
            var index = this.formReport.domains.indexOf(item);
            if (index !== -1) {
                this.formReport.domains.splice(index, 1);
            }
        },

        // 保存编辑
        saveEdit(val = '') {
            let arr = [],str = '';
            this.formReport.domains.forEach((i) => {
                arr.push(i.informTypeName);
            });
            str = arr.join(',')
            
            let data = {
                id: this.form.id || '',
                status:0,
                labels: str,
                type:this.form.type
            };
            if(data.id){
                update(data).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('操作成功');
                        this.editVisible = false;
                        this.getData();
                    }
                })
            }else{
                add(data).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('操作成功');
                        this.editVisible = false;
                        this.getData();
                    }
                })
            }
        }
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
/deep/.table-td-thumb .el-image__inner {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
</style>

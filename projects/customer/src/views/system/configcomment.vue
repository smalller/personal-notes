<template>
    <div class="store_eva">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="addStar">新增配置规则</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="labels" label="好评标签" min-width="250" align="center"></el-table-column>
                <el-table-column prop="power" label="均价范围" min-width="280" align="center">
                    <template slot-scope="scope">
                        <div class="st_box">
                            <span class="st_li"
                                ><span class="star">★★★★★</span><span>{{ scope.row.starsArr[0] }}</span></span
                            >
                            <span class="st_li"
                                ><span class="star">★★★★</span><span>{{ scope.row.starsArr[1] }}</span></span
                            >
                            <br />
                            <span class="st_li"
                                ><span class="star">★★★</span><span>{{ scope.row.starsArr[2] }}</span></span
                            >
                            <span class="st_li"
                                ><span class="star">★★</span><span>{{ scope.row.starsArr[3] }}</span></span
                            >
                            <span class="st_li"
                                ><span class="star">★</span><span>{{ scope.row.starsArr[4] }}</span></span
                            >
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="250" align="left">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.status == 1 ? 'success' : 'danger'">
                            {{ scope.row.status == 1 ? '已启用' : '已禁用' }}
                        </el-button>
                        <el-button @click="deleteStar(scope.$index, scope.row)" type="primary">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination">
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
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>评价配置</span>
            </div>
            <div class="sort_type">
                <el-form ref="form" :model="form" label-width="80px" class="" label-position="left ">
                    <div style="display: flex">
                        <div style="flex: 0.5">
                            <el-form-item label="评分配置">
                                <div>
                                    <span class="star dio_st">★★★★★</span><input type="text" v-model="rulesData.five" class="inp_self" />
                                </div>
                                <div>
                                    <span class="star dio_st">★★★★</span><input type="text" v-model="rulesData.four" class="inp_self" />
                                </div>
                                <div>
                                    <span class="star dio_st">★★★</span><input type="text" v-model="rulesData.three" class="inp_self" />
                                </div>
                                <div><span class="star dio_st">★★</span><input type="text" v-model="rulesData.two" class="inp_self" /></div>
                                <div><span class="star dio_st">★</span><input type="text" v-model="rulesData.one" class="inp_self" /></div>
                            </el-form-item>
                        </div>
                        <div style="flex: 0.5">
                            <el-form-item label="好评标签">
                                <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                                    <el-form-item
                                        v-for="(domain, index) in dynamicValidateForm.domains"
                                        :key="domain.key"
                                        :prop="'domains.' + index + '.value'"
                                    >
                                        <el-input v-model="domain.value" placeholder="标签名"></el-input>
                                        <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                    </el-form-item>
                                </el-form>
                                <img class="addCou" src="../../../static/img/jia.png" @click="addLab" alt="" />
                            </el-form-item>
                        </div>
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
import {getList, getDetail, add, update, remove} from "@/api/system/configcomment";
import {mapGetters} from "vuex";
export default {
    data: function () {
        return {
            query: {
                text: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            imageUrl: '',
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            dynamicValidateForm: {
                domains: [
                    {
                        value: ''
                    }
                ]
            },
            formData: '',
            rulesData: {
                five: '',
                foue: '',
                three: '',
                two: '',
                one: ''
            }
        };
    },
    watch: {},
    created() {
        this.getData();
    },

    methods: {
        getData() {
            getList().then(res=>{
                let result = res.data.data  
                result.records.forEach(v=>{
                    v['starsArr'] = v.stars.split(',')
                })
                this.tableData = result.records;
                this.pageTotal = result.total;
            })
        },

        addStar() {
            this.form = {};
            this.rulesData = { five: '', foue: '', three: '', two: '', one: '' };
            (this.dynamicValidateForm = { domains: [{ value: '' }] }), (this.editVisible = true);
        },
        addLab() {
            this.dynamicValidateForm.domains.push({});
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        // 删除操作
        deleteStar(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(row.id).then(res=>{
                        if(res.data.code == 200){
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                })
        },

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = this.$regular.deep(row);
            this.form.labels = this.form.labels.split(',')
            for (let i = 0; i < this.form.labels.length; i++) {
                this.$set(this.dynamicValidateForm.domains,i,
                {
                    value:this.form.labels[i]
                })
            }
            this.rulesData = {
                five: row.starsArr[0],
                four: row.starsArr[1],
                three: row.starsArr[2],
                two: row.starsArr[3],
                one: row.starsArr[4]
            };
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(val = '') {
            let aveRangeList = [];
            aveRangeList.push(this.rulesData.five);
            aveRangeList.push(this.rulesData.four);
            aveRangeList.push(this.rulesData.three);
            aveRangeList.push(this.rulesData.two);
            aveRangeList.push(this.rulesData.one);

            aveRangeList = aveRangeList.join(',')

            let pagList = [];
            this.dynamicValidateForm.domains.forEach((i) => {
                pagList.push(i.value);
            });
            pagList = pagList.join(',')
            let data = {
                labels:pagList,
                id: this.form.id || '',
                stars:aveRangeList,
            };
            if (data.id) {
                update(data).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('修改成功');
                        this.editVisible = false;
                        this.getData();
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                })        
            } else {
                add(data).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('新增成功');
                        this.editVisible = false;
                        this.getData();
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                })
            }
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 启用
        enable(index, row) {
            let data = {
                status:row.status == 1 ? 0 : 1,
                id:row.id,
            }
            update(data).then(res=>{
                if(res.data.code == 200){
                    this.$message.success('修改成功');
                    this.tableData.forEach((i) => {
                        if (row.id == i.id) {
                            this.$set(i, 'status', i.status == 1 ? 0 : 1);
                        } else {
                            this.$set(i, 'status', 0);
                        }
                    });
                }else{
                    this.$message.warning(res.data.msg);
                }
            }) 
        }
    }
};
</script>

<style scoped lang='scss'>
/deep/.el-upload--text {
    width: 180px;
}
.st_box {
    word-break: break-all;
    word-wrap: break-word;
    width: 90%;
    margin: 0 auto;
    text-align: left;
    .st_li {
        margin-right: 40px;
    }
}
.star {
    color: red;
    font-size: 24px;
    margin-right: 10px;
}
.dio_st {
    display: inline-block;
    width: 100px;
}
.st_lab {
    border-radius: 4px;
    border: 1px solid rgb(187, 187, 187);
    padding: 2px 5px;
    margin-right: 10px;
}
.el-input {
    width: 150px;
    margin-right: 10px;
}
.addCou {
    height: 32px;
    cursor: pointer;
}
i {
    cursor: pointer;
}

.handle-box {
    margin-bottom: 20px;
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
    width: 40px;
    height: 40px;
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
}
/deep/ .table-td-thumb {
    max-width: 150px;
    max-height: 150px;
}
/deep/ .el-dialog {
    min-width: 850px;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/ .el-dialog__body {
    padding-top: 10px;
}
</style>
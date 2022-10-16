<template>
    <div>
        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-button type="primary" class="mr10" @click="handleAdd">新增认证资格</el-button>
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="applyObj.keyword"
                    placeholder="请输入关键词"
                    class="handle-input mr10"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column prop="description" label="认证资格"></el-table-column>
                <el-table-column label="操作" width="220">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 新增/编辑商家对话框 -->
            <el-dialog :visible.sync="dialog" class="dialog"  append-to-body="true">
                <span class="add-classify-title">认证资格</span>
                <div class="basic-info">
                    <el-form ref="form" :model="form" label-width="100px">
                        <el-form-item label="认证类型：">
                            <el-input v-model="form.type" style="width: 300px"></el-input>
                        </el-form-item>
                        <el-form-item label="认证资格：">
                            <el-input type="textarea" :rows="6" v-model="form.description" style="width: 300px"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="closeDialog">取 消</el-button>
                    <el-button type="primary" @click="handleSureEdit">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 表格数据分页 -->
            <el-pagination
                v-if="tableData.length > 0"
                background
                layout="total,prev, pager, next"
                @current-change="handleCurrentChange"
                :total="applyObj.dataListCount"
                :current-page="applyObj.currentPage"
                :page-size="applyObj.pagesize"
                class="page"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import {getList, add, update, remove} from "@/api/system/configauth";
import {mapGetters} from "vuex";
export default {
    data() {
        return {
            applyObj: {
                keyword: '', //用户昵称
                dataListCount: 0, //默认当前要显示的数据条数
                currentPage: 1, //默认显示的页码所在位置（第一页）
                pagesize: 10 //默认每页要显示多少条数据
            },
            pageTotal: 0,
            dialog: false,

            //列表信息
            form: {
                typeName: '',
                conditionsApply: '',
                id:''
            },

            tableData: [] //表格信息
        };
    },
    created(){
        this.getInfoList();
    },

    methods: {
        //获取列表信息
        getInfoList() {
            let data = {
                size:this.applyObj.pagesize,
                current:this.applyObj.currentPage,
                keyword:this.applyObj.keyword,
            }
            getList(data).then(res=>{
                if(res.data.code == 200){
                    this.tableData = res.data.data.records
                    this.pageTotal = res.data.data.total
                }
            })
        },

        //搜索操作
        handleSearch() {
            this.applyObj.currentPage = 1;
            this.getInfoList();
        },

        //翻页
        handleCurrentChange(val) {
            this.applyObj.currentPage = val;
            this.getInfoList();
        },

        //新增认证资格
        handleAdd() {
            this.dialog = true;
            this.form= {
                type: '',
                description: '',
                id:''
            }
        },

        //编辑
        handleEdit(row) {
            this.form = this.$regular.deep(row);
            this.dialog = true;
        },

        //删除
        handleDelete(index,row) {
            // let ids = [];
            // ids.push(row.id);
            // ids = ids.join(',')
            let data = {
                ids : row.id
            }
            this.$confirm('确定要删除吗?', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(data).then(res=>{
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                        this.dialog = false;
                    })
                })
        },

        //确认按钮
        handleSureEdit() {
            let data = {
                id: this.form.id || '',
                type: this.form.type,
                description: this.form.description
            };

            if(!data.type){
                this.$message.warning('请输入认证类型');
                return;
            }
            if(!data.description){
                this.$message.warning('请输入认证资格');
                return;
            }
            if (data.id) {
                this.ajaxRequest(data, '修改成功');
            } else {
                this.ajaxRequest(data, '新增成功');
            }
        },

        //新增/修改操作
        ajaxRequest(data, txt) {
            let url = '';
            if (data.id) {
                url = add(data);
            } else {
                url = update(data);
            }
            url.then((res) => {
                if(res.data.code == 200){
                    this.getInfoList();
                    this.$message.success(txt);
                    this.dialog = false;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        //关闭对话框
        closeDialog() {
            this.dialog = false;
            this.form = {};
        },

        
    },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header {
    padding: 0;
}

.handle-box {
    margin-bottom: 20px;

    .handle-input {
        width: 170px;
        display: inline-block;
    }

    .mr10 {
        margin-right: 10px;
    }
}

.page {
    text-align: right;
    margin-top: 20px;
}

.add-classify-title {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.add-classify-title::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    margin-right: 10px;
    background-color: #999;
}

.dialog {
    /deep/.el-dialog {
        width: 28%;
    }
}

/deep/ .el-textarea__inner {
    resize: none !important;
    line-height: 1.5;
}
</style>
<template>
    <div class="hot_recom">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="addEdit">新增热门推荐</el-button>
                <el-input v-model="query.name" placeholder="请输入热门话题" class="handle-input mr10" clearable></el-input>
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
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column type="index" label="Id" align="center"></el-table-column>
                <el-table-column prop="name" min-width="250" label="话题名称" align="center"></el-table-column>
                <el-table-column prop="weight" min-width="250" label="话题权重" align="center"></el-table-column>
                <el-table-column label="操作" align="center" min-width="250">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.status == 1 ? 'success' : 'danger'">{{
                            scope.row.status == 1 ? '已启用' : '已禁用'
                        }}</el-button>
                        <el-button @click="handleDelete(scope.row.id)" type="primary">删除</el-button>
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
                    :total="query.pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>话题编辑</span>
            </div>
            <div>
                <div class="reco-form">
                    <div>
                        <span>话题名称：</span>
                        <el-input v-model="topic.name" placeholder="话题名称" class="handle-input mr10" clearable></el-input>
                    </div>
                    <div>
                        <span>话题权重：</span>
                        <el-input-number v-model="topic.weight" :min="0" :max="99" label="话题权重"></el-input-number>
                    </div>
                </div>
            </div>

            <span slot="footer" class="dialog-footer">
                <el-button @click="clearInfo">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getList, getDetail, add, update, remove} from "@/api/system/searchrecommend";
import {mapGetters} from "vuex";
export default {
    data() {
        return {
            multipleSelection: [], //多选
            tableData: [], //表格数据
            editVisible: false, //对话框开关
            //查询时的字段
            query: {
                name: '',
                pageIndex: 1,
                pageSize: 10,
                pageTotal: 0
            },
            //推荐类型对话框里的字段
            topic: {
                name: '',
                power: '',
                status: 0,
                id: '',
            },
        };
    },

    created() {
        this.getData();
    },
    methods: {
        // 分页
        handlePageChange(val) {
            this.query.pageIndex = val;
            this.getData(); //请求数据
        },

        // 搜索按钮
        handleSearch() {
            this.query.pageIndex = 1;
            this.getData();
        },

        // 获取表格数据
        getData() {
            let data = {
                name: this.query.name,
                current: this.query.pageIndex,
                size: this.query.pageSize
            };
            getList(data).then(res => {
                this.tableData = res.data.data.records;
                this.query.pageTotal = res.data.data.total;
            });
        },

        // 删除操作
        handleDelete(id) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                remove(id).then(res => {
                    if (res.data.code == 200) {
                        this.getData();
                        this.$message.success('删除成功');
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            })
        },

        // 热门搜索启用/禁用
        enable(index, row) {
            this.$set(row, 'status', row.status == 1 ? 0 : 1);
            let data = {
                status:row.status,
                id:row.id,
            }
            update(data).then(res=>{
                if(res.data.code == 200){
                    this.$message.success('修改成功');
                }else{
                    this.$message.warning(res.data.msg);
                    this.$set(row, 'status', row.status == 1 ? 0 : 1);
                }
            }) 

        },


        // 编辑操作
        handleEdit(index, row) {
            this.editVisible = true;
            this.topic = row;
        },

        // 保存编辑
        saveEdit() {
            if(!this.topic.name){
                this.$message.warning('请输入话题名称');
                return;
            }
            if(!this.topic.weight){
                this.$message.warning('请输入权重');
                return;
            }
            this.topic.id ? this.editInfo(1) : this.editInfo(2);
        },

        clearInfo() {
            this.editVisible = false;
        },
        //编辑或新增操作
        editInfo(type) {
            let data = {
                id : this.topic.id || '',
                name : this.topic.name,
                weight : this.topic.weight
            }
            if(type == 1){
                update(data).then(res => {
                    if (res.data.code == 200) {
                        this.getData();
                        this.$message.success('修改成功');
                        this.editVisible = false;
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            }else{
                add(data).then(res => {
                    if (res.data.code == 200) {
                        this.getData();
                        this.$message.success('新增成功');
                        this.editVisible = false;
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                });
            }
            
        },


        // 新增热门推荐
        addEdit() {
            if(this.topic.id){
                this.topic = {
                    name: '',
                    power: '',
                    apply: '',
                    id: '',
                }
            }
            this.editVisible = true;
        },

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    }
};
</script>

<style scoped lang='scss'>
.hot_recom {
    /deep/.el-upload--text {
        width: 180px;
    }
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
    width: 200px;
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
    padding: 0 20px;
    padding-top: 10px;
}

.success {
    background-color: #67c23a !important;
}

.danger {
    background-color: #409eff;
}

.reco-form {
    > div {
        margin-bottom: 20px;
    }

    .reco-type {
        display: inline-block;
    }
}

.reco-type span {
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    margin: 0 10px 10px 0;
    box-sizing: border-box;
    white-space: nowrap;
    cursor: pointer;
}

.reco-type-span {
    background-color: #ecf5ff;
}

.reco-table {
    // border: 1px solid #c0c4cc;

    .top-search {
        margin-bottom: 20px;
    }

    .choose-status {
        background-color: #67c23a;
    }
}

.success {
    background-color: #67c23a !important;
}

.danger {
    background-color: #409eff;
}

#choose-reco-status {
    display: block;
    padding: 9px 15px;
    font-size: 12px;
    border-radius: 3px;
    background-color: #409eff;
    color: #fff;
    text-align: center;
    line-height: 1;
    width: 40px;
    margin: 0 auto;
}
</style>








<template>
    <div>
        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="applyObj.searchName"
                    placeholder="用户姓名"
                    class="handle-input mr10"
                ></el-input>
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="applyObj.searchPhone"
                    placeholder="用户手机"
                    class="handle-input mr10"
                ></el-input>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <!-- <authen :applyObj="applyObj"></authen> -->


            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="authName" label="用户姓名"></el-table-column>
                <el-table-column prop="authPhone" label="用户手机"></el-table-column>
                <el-table-column prop="configType" label="认证类型"></el-table-column>
                <el-table-column prop="authReason" label="认证简要说明"></el-table-column>
                <el-table-column prop="createTime" label="提交时间"></el-table-column>
                <!-- <el-table-column label="审核时间">
                    <template slot-scope="scope">
                        <span>{{ scope.row.examineTime == null ? '待认证' : scope.row.examineTime }}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="操作" fixed="right">
                    <template slot-scope="scope">  
                        <el-button
                            :type="scope.row.status == 2 ? 'success' : scope.row.status == 3 ? 'info' : 'primary'"
                            @click="sureCheck(scope.$index, scope.row)"
                            >{{ scope.row.status == 2 ? '已认证' : scope.row.status == 3 ? '已拒绝' : '待认证' }}</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <!-- 表格数据分页 -->
            <el-pagination
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
// import regular from '@/utils/regular'
import {getList, getDetail, add, update, remove} from "@/api/system/auth";
import {mapGetters} from "vuex";
import { registerLayout } from 'echarts';
export default {
    data() {
        return {
            applyObj: {
                searchName: '', //用户昵称
                searchPhone: '', //用户手机号
                dataListCount: 0, //默认当前要显示的数据条数
                currentPage: 1, //默认显示的页码所在位置（第一页）
                pagesize: 10, //默认每页要显示多少条数据
            },
            tableData: []
        };
    },

    created(){
        this.getUserInfo()
    },

    methods: {
        //获取认证信息
        getUserInfo() {
            let data = {
                current: this.applyObj.currentPage,
                size: this.applyObj.pagesize,
                authName: this.applyObj.searchName,
                authPhone: this.applyObj.searchPhone
            };
            getList(data).then(res=>{
                this.tableData = res.data.data.records;
                this.applyObj.dataListCount = res.data.data.total;
            })
        },

        //搜索操作
        handleSearch() {
            this.applyObj.currentPage = 1;
            this.getUserInfo()
        },

        //翻页
        handleCurrentChange(val) {
            this.applyObj.currentPage = val;
            this.getUserInfo()
        },

        sureCheck(index,row) {
            console.log(row)
            if (row.status != 2 && row.status != 3) {
                this.$confirm('是否同意该用户的认证申请?', '提示', {
                    distinguishCancelAndClose: true,
                    confirmButtonText: '同意',
                    cancelButtonText: '拒绝',
                    type: 'warning'
                })
                    .then(() => {
                        this.settlementApply(row.id, 2,index);
                    })
                    .catch((action) => {
                        this.$prompt('请输入拒绝原因', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            inputPattern: /.*[^\s]/ ,
                            inputErrorMessage: '请输入拒绝原因'
                        }).then(({ value }) => {
                            this.settlementApply(row.id, 3,index,value);
                        }).catch(() => {
                              
                        });
                    });
            }
        },

        //审核接口
        settlementApply(id, status,index,rejectReason) {
            update({id,status,rejectReason}).then(res=>{
                if(res.data.code == 200){
                    this.getUserInfo();
                    this.$message.success(res.data.data.msg);
                }else{
                    this.$message.warning(res.data.data.msg);
                }
            }).catch(err=>{
                this.$message.warning(err);
            })        
        },

        
    }
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
</style>

<template>
    <div id="order_msg">
        <div class="container">
            <el-table 
                :data="tableData" border class="table" 
                ref="multipleTable" 
                header-cell-class-name="table-header" 
            >
                <el-table-column  label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="beginTime" min-width="100" align="center" label="抽奖开启时间"></el-table-column>
                <el-table-column prop="overTime" min-width="100" align="center" label="抽奖结束时间"></el-table-column>
                <el-table-column prop="scope" min-width="100" align="center" label="抽奖范围设定"></el-table-column>  
                <el-table-column prop="ruleDescription" align="center" min-width="300" label="抽奖规则说明"></el-table-column>
                <el-table-column label="操作" width="150" align="center">   
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
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
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>抽奖设置</span>
            </div>
            <div class="sort_type">
                <el-form ref="form" :model="form" label-width="120px" class="" label-position='left '>
                    <el-form-item label="抽奖时间段">
                        <el-time-picker
                        is-range
                        v-model="form.value1"
                        range-separator="至"
                        value-format="HH:mm:ss"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围">
                    </el-time-picker>
                    </el-form-item>    

                    <el-form-item label="抽奖范围">
                        <el-input placeholder="请输入范围" v-model="form.scope">
                            <template slot="append">≤KM</template>
                        </el-input>
                    </el-form-item>    

                    <el-form-item label="抽奖规则">
                        <el-input
                            type="textarea"
                            :rows="5"
                            placeholder="请输入内容"
                            v-model="form.ruleDescription">
                        </el-input>
                    </el-form-item>   
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
import {getList, getDetail, add, update, remove} from "@/api/system/configblind";
import {mapGetters} from "vuex";
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 20,
                tel:'',
            },
            tableData: [],
            editVisible: false,
            pageTotal: 0,
            form: {
                value1:'',
                scope:'',
                ruleDescription:'',
                id:''
            },
            id: -1,
            formData:[],
      
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            // let data = { 
            //     pageSize: this.query.pageSize,
            //     pageNo:this.query.pageIndex,
            // }
            getList().then((res) => {
                this.tableData = res.data.data.records
                this.pageTotal = res.data.data.total
            })
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        handleEdit(index, row){
            this.idx = index;
            this.form = this.$regular.deep(row);
            this.editVisible = true;
            this.$set(this.form,'value1',[row.beginTime, row.overTime])    
        },
        saveEdit(){
            if(!this.form.value1){
                this.$message.warning('请选择抽奖时间');
                return;
            }
            if(!this.form.scope){
                this.$message.warning('请输入抽奖范围');
                return;
            }
            if(!this.form.ruleDescription){
                this.$message.warning('请输入抽奖规则');
                return;
            }
            console.log(this.form.value1)
            let data = {
                beginTime:this.form.value1[0],
                overTime:this.form.value1[1],
                id:this.form.id,
                ruleDescription:this.form.ruleDescription,
                scope:+this.form.scope,
            }
            update(data).then((res) => {
                if (res.data.code == 200) {
                    this.$message.success('修改成功');
                    this.editVisible = false;
                    if (this.form.id) {
                        this.$set(this.tableData, this.idx, data);
                    }
                }else{
                    this.$message.error(res.msg);
                }
            })

        }
        
    }
};
</script>

<style scoped lang='scss'>
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
    display: inline-block;
    margin: auto;
    width: 40px;
    height: 40px;
    margin-right: 10px;

}
.table-td-thumb img{
    width: 100%;
    height: 100%;
}
/deep/.handle-input{
    width: 150px;
}
/deep/ .el-dialog {
    min-width: 850px;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/ .el-dialog__body {
    padding-top: 10px;
    .el-input {
        width: 165px;
        margin-right: 10px;
    }
}
/deep/ .el-textarea{
    width: 51%;
}
</style>

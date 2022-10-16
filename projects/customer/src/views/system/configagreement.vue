<template>
    <div class="tip_text">
        <div class="container">
            <div class="handle-box">
                <el-button
                    v-for="(item, i) in btnType"
                    :key="i"
                    @click="changeType(item.type, item.text)"
                    :type="active == item.type ? 'primary' : ''"
                    class="handle-del"
                    >{{ item.text }}</el-button
                >
            </div>

            <div class="handle-box">
                <el-button
                    v-if="active == 1"
                    type="primary"
                    icon="el-icon-edit"
                    class="handle-del mr10"
                    @click="addEdit"
                >新增{{btnText}}</el-button>
                <el-input v-model="query.name" placeholder="协议名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                
                <el-table-column v-if="active == 1" prop="title" label="协议名称" min-width="150" align="center"></el-table-column>
                
                <el-table-column v-if="active == 2 || active == 4" prop="title" label="说明类型" min-width="150" align="center"></el-table-column>
                <el-table-column v-if="active != 1" prop="content" label="说明内容" min-width="150" align="center"></el-table-column>

                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button v-if="active == 1" @click="removeEdit(scope.$index, scope.row)" type="primary">删除</el-button>
                    </template>
                </el-table-column>


            </el-table>
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>{{ btnText }}</span>
            </div>

            <div class="sort_type">
                <el-form ref="form" :model="form" label-width="120px" class="" label-position="left ">

                    <template v-if="active == 1">
                        <el-form-item label="协议名称">
                            <el-input v-model="form.agreementTitle" placeholder="请输入协议名称" style="width: 300px"></el-input>
                        </el-form-item>

                        <div>协议内容</div>
                        <div class="editor">
                            <editor :formData="eritor_content" @getChild='theEditorContent'></editor>
                        </div>        
                    </template>

                    <template v-else>
                        <el-form-item label="说明类型">
                            <el-input v-model="form.title" placeholder="请输入说明类型" style="width: 300px"></el-input>
                        </el-form-item>
                        <el-form-item :label="textTitle">
                            <el-input type="textarea" :rows="8" :placeholder="'请输入' + textTitle" v-model="form.content"> </el-input>
                        </el-form-item>
                    </template>

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
import {getList, getDetail, add, update, remove,getOtherList,getAgreementDatail} from "@/api/system/configagreement";
import {mapGetters} from "vuex";

import editor from '../../components/common/editor'
export default {
    data: function () {
        return {
            btnType: [
                { type: '1', text: '协议设置' },
                { type: '2', text: '支付设置' },
                { type: '3', text: '附近的人设置' },
                { type: '4', text: 'App文本设置' }
            ],
            active: '',
            textTitle: '',
            btnText:"",
            query: {
                pageIndex: 1,
                pageSize: 20
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            eritor_content:{
                name:'',
                editor_text:'',
            },
        };
    },
    watch: {

    },
    created() {
        this.changeType()
    },
    components:{
        editor        
    },

    methods: {
        changeType(type='1', text='协议设置') {
            this.active = type;
            this.btnText = text;

            if(type == 1){
                this.getOtherData()
            }else{
                this.getData();
            }
        },
        getData() {
            let data = {
                category:this.active,
                title:this.query.name
            };
            getList(data).then((res) => {
                this.tableData = res.data.data;
            });
        },
        getOtherData() {
            let data = {
                current: this.query.pageIndex,
                size: this.query.pageSize,
                title:this.query.name
            };
            getOtherList(data).then((res) => {
                this.tableData = res.data.data.records;
            });
        },

        handleSearch(){
            if(this.active == 1){
                this.getOtherData()
            }else{
                this.getData()
            }
        },

        theEditorContent(data){
            this.form.agreementContent = data
        },

        removeEdit(index, row) {
            this.$confirm('确认删除吗？', '提示', {
                type: 'warning'
            }).then(() => {
                remove(row.id).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success(`删除成功`);
                        this.tableData.splice(index, 1);
                    }else {
                        this.$message.error(res.data.msg);
                    }
                })
            });
        },

        // 新增/修改 协议
        addEdit(){
            this.form = {}
            this.eritor_content.editor_text = ''
            this.editVisible = true;
            console.log(this.form.id)
        },

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editVisible = true;
            this.form = this.$regular.deep(row);
            this.textTitle = row.title;
            if(this.active == 1){
                getAgreementDatail({id:row.id}).then(res=>{
                    if(res.data.code == 200){
                        this.eritor_content.editor_text = res.data.data.content
                        this.$set(this.form,'agreementTitle',res.data.data.title)
                    }
                })
            }
        },
        saveAgreement(){
            let data = {
                content:this.form.agreementContent,
                title:this.form.agreementTitle,
                id:this.form.id,
                category : null,
                isBuiltin:null
            }
            update(data).then(res=>{
                if(res.data.code == 200){
                    this.$message({message: '修改成功',type: 'success'});
                    this.editVisible = false;
                    this.getOtherData()
                }else{
                    this.$message.warning(res.data.msg);
                }
            })

        },
        // 保存编辑
        saveEdit(val = '') {
            if(this.active == 1){
                this.saveAgreement()
                return
            }
            let data = {
                content: this.form.content,
                id: this.form.id || '',
                title:this.form.title,
                // category : null,
                // isBuiltin:null
            };
            update(data).then((res) => {
                if (res.data.code == 200) {
                    this.$message.success('修改成功');
                    this.editVisible = false;
                    this.getData()
                }else{
                    this.$message.warning(res.data.msg);
                }
            });
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped lang='scss'>
.tip_text {
    .el-textarea {
        width: 40%;
    }
}
.editor{
    margin-top: 20px;
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

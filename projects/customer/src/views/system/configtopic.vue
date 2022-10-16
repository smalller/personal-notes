<template>
    <div class="store_eva">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="addTopic">新增话题</el-button>
                <el-input v-model="query.text" placeholder="请输入关键字" class="handle-input mr10"></el-input>
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
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="type" label="话题类型" width="220" align="center"></el-table-column>
                <el-table-column prop="labels" label="话题包含项" min-width="200" align="center"></el-table-column>
                <el-table-column label="话题背景图" align="center" min-width="110">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="imgHead + scope.row.background"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="weight" label="权重" width="100" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="left">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.status == 1 ? 'success' : 'danger'">
                            {{ scope.row.status == 1 ? '已启用' : '已禁用' }}
                        </el-button>
                        <el-button @click="deleteTopic(scope.$index, scope.row)" type="primary">删除</el-button>
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
                <span>话题配置</span>
            </div>
            <div class="sort_type">
                <el-form ref="form" :inline="true" :model="form" label-width="120px" class="" label-position='left '>
                    <el-form-item label="话题种类">
                        <el-input v-model="form.type" placeholder="请输入话题种类"></el-input>
                    </el-form-item>
                    <el-form-item label="权重">
                        <el-input type="number" :min="0" :max="99" v-model="form.weight" placeholder="请输入权重"></el-input>
                    </el-form-item>
                    <div class="labels">
                        <el-form-item label="话题包含单项">
                            <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                                <el-form-item
                                    v-for="(domain, index) in dynamicValidateForm.domains"
                                    :key="domain.key"
                                    :prop="'domains.' + index + '.value'"
                                >
                                    <el-input v-model="domain.labels" placeholder="话题"></el-input>
                                    <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                </el-form-item>
                            </el-form>
                            <img class="addCou" src="../../../static/img/jia.png" @click="addLab" alt="" />
                        </el-form-item>

                    </div>
                </el-form>
            </div>
            <div class="up_text">类型背景图</div>
                    <el-upload
                        class="avatar-uploader"
                        action="fakeaction"
                        :show-file-list="false"
                        :on-change="handleChange"
                        :before-upload="beforeAvatarUpload"
                        :http-request="uploadSectionFile"
                    >
                        <img v-if="form.background" :src="imgHead + form.background" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit('')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getList, fileUpload, add, update, remove} from "@/api/system/configtopic";
import {mapGetters} from "vuex";
export default {
    data: function () {
        return {
            imgHead: this.$imgHead,
            query: {
                text: '',
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
                        subject: ''
                    }
                ]
            },
            formData: '',
            removeDate: []
        };
    },
    watch: {
        'form.weight': {
            handler: function (val) {
                if (val <= 0) {
                    this.form.weight = 0;
                }
                if (val >= 99) {
                    this.form.weight = 99;
                }
            },
            deep: true
        }
    },
    created() {
        this.getData();
    },

    methods: {
        // 上传
        handleChange(file, fileList) {
            this.formData = file.raw;
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        uploadSectionFile(file) {
            let config = {
                'Content-Type': 'multipart/form-data'
            };
            let fromdata = new FormData();
            fromdata.append('file', this.formData);

            fileUpload(fromdata).then(res=>{
                if (res.data.code == 200) {
                    this.$set(this.form, 'background', res.data.data.name);
                } else {
                    this.form.background = '';
                    this.$message.error('图片添加失败');
                }
            })
        },

        getData() {
            let data = {
                size: this.query.pageSize,
                current: this.query.pageIndex,
                keyword: this.query.text
            };
            getList(data).then(res=>{
                if(res.data.code == 200){
                    this.tableData = res.data.data.records;
                    this.pageTotal = res.data.data.total;
                }
            })
        },

        addTopic(){
            this.form = {}
            this.dynamicValidateForm = {domains: [{subject: '',}]},
            this.editVisible = true
        },
        addLab() {
            this.dynamicValidateForm.domains.push({});
        },
        removeDomain(item) {
            item.del = 1;
            this.removeDate.push(item);
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },
        // 删除操作
        deleteTopic(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(row.id).then(res=>{
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })
                })
                .catch(() => {});
        },
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        // 编辑操作
        handleEdit(index, row) {
            this.dynamicValidateForm.domains = []
            this.idx = index;
            this.form = this.$regular.deep(row);

            this.form.labels = this.form.labels.split(',')

            for (let i = 0; i < this.form.labels.length; i++) {
                this.$set(this.dynamicValidateForm.domains,i,
                {
                    labels: this.form.labels[i]
                })
            }
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(val = '') {
            if (!this.form.type) {
                this.$message.warning('请输入话题种类');
                return;
            }
            if(!this.form.background){
                this.$message.warning('请添加背景图');
                return;
            }
            let arr = [],str = ''
            this.dynamicValidateForm.domains.forEach(i=>{
                if(i.labels){
                    arr.push(i.labels);
                }
            })
            str = arr.join(',')

            let data = {
                status:this.form.status || 0,
                type:this.form.type,
                id:this.form.id || '',
                weight:this.form.weight,
                labels:str,
                background:this.form.background
            }
            if(data.id){
                update(data).then(res=>{
                    this.$message.success('修改成功');
                    this.editVisible = false;
                    this.getData();
                })
            }else{
                add(data).then(res=>{
                    this.$message.success('新增成功');
                    this.editVisible = false;
                    this.getData();
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
            this.$set(row, 'status', row.status == 1 ? 0 : 1);
            let data = {
                status:row.status,
                id:row.id,
            }
            update(data).then(res=>{
                if(res.data.code == 200){
                    this.$message.success('修改成功');
                }else{
                    this.$set(row, 'status', row.status == 1 ? 0 : 1);
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
// .el-form-item{
//     display: inline-block;
//     margin-right: 20px;
// }
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

.avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
.handle-box {
    margin-bottom: 20px;
}
.avatar {
        width: 100%;
        height: 100%;
        display: block;
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
/deep/.el-form--inline .el-form-item{
    display: block;
}
/deep/.labels .el-form-item{
    display: inline-block;
}
</style>

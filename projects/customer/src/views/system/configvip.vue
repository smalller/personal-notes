<template>
    <div class="vip_card">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="addCard">新增会员卡</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="name" label="色调名字（卡面）" min-width="150" align="center"></el-table-column>
                <el-table-column label="卡面图片" min-width="150" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="imgHead + scope.row.background"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="removeEdit(scope.$index, scope.row, 1)" type="primary">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>会员卡配置</span>
            </div>
            <div class="sort_type">
                <el-form ref="form" :model="form" label-width="120px" class="" label-position="left">
                    <div>
                        <el-form-item label="会员卡名字">
                            <el-input type="text" placeholder="请输入会员卡名字" v-model="form.name"> </el-input>
                        </el-form-item>
                        <el-form-item label="会员卡卡面">
                            <el-upload
                                class="avatar-uploader"
                                action="fakeaction"
                                :http-request="uploadSectionFile"
                                :show-file-list="false"
                                :on-change="handleChange"
                                :before-upload="beforeAvatarUpload"
                            >
                                <img v-if="form.background" :src="imgHead + form.background" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
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
import {getList, getDetail, add, update, remove,fileUpload} from "@/api/system/configvip";
import {mapGetters} from "vuex";

export default {
    data: function () {
        return {
            query: {
                pageIndex: 1,
                pageSize: 10,
                text: ''
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            formData: '',
            formDataOn: '',
            formDataOff: '',
            options: [],
            storeName: '', //商家名字
            imgHead: this.$imgHead
        };
    },
    watch: {},
    created() {
        this.getData()
    },

    methods: {
        getData() {
            let data = {
                current: this.query.pageIndex,
                size: this.query.pageSize
            };
            getList(data).then(res => {
                this.tableData = res.data.data.records;
                this.pageTotal = res.data.data.total;
            });
        },
        addCard() {
            this.form = {};
            this.idx = '';
            this.editVisible = true;
        },

        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.changeType(this.active);
        },
        removeEdit(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(row.id).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success(`删除成功`);
                        this.tableData.splice(index, 1);
                    }else {
                        this.$message.error(res.data.msg);
                    }
                })
                })
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = this.$regular.deep(row);
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(val = '') {
            if (!this.form.name) {
                this.$message.warning('请输入会员卡名字');
                return;
            }
            if (!this.form.background) {
                this.$message.warning('请上传会员卡卡面');
                return;
            }
            let data = {
                name: this.form.name,
                id: this.form.id || '',
                background: this.form.background
            };

            if (data.id) {
                update(data).then(res=>{
                    if(res.data.code == 200){
                        this.$message.success('修改成功');
                        this.editVisible = false;
                        this.getData()
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

            // this.$post('/admin/vipPhoto/update', card).then((res) => {
            //     if (res.data.code == 200) {
            //         this.$message.success('操作成功');
            //         this.editVisible = false;
            //     }else{
            //         this.$message.warning(res.data.msg);
            //     }
            // });
        },
        // // 分页导航
        // handlePageChange(val) {
        //     this.$set(this.query, 'pageIndex', val);
        //     this.getData();
        // },
        handleChange(file, fileList) {
            this.formData = file.raw;
        },

        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        // 会员卡配置 添加卡面图片
        uploadSectionFile(file) {
            let fromdata = new FormData();
            fromdata.append('file', this.formData);
            this.uploadPicture(fromdata);
        },

        uploadPicture(fromdata, type) {
            let config = {
                'Content-Type': 'multipart/form-data'
            };
            fileUpload(fromdata).then(res=>{
                if (res.data.code == 200) {
                    this.$set(this.form, 'background', res.data.data.name);
                } else {
                    this.form.background = '';
                    this.$message.error('图片添加失败');
                }
            })
        }
    }
};
</script>

<style scoped lang='scss'>
.el-textarea {
    width: 60%;
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
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
/deep/.el-input {
    width: 180px;
}
/deep/.el-upload--text {
    width: 180px;
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
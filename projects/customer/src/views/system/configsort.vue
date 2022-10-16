<template>
    <div class="smart_sort">
        <div class="container">
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="sortId" label="Id" width="80" align="center"></el-table-column>
                <el-table-column label="未选中图标" min-width="255" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="imgHead + scope.row.iconNormal"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="选中图标" min-width="255" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="imgHead + scope.row.iconSelected"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="rule" label="排序规则" min-width="150" align="center"></el-table-column>
                <el-table-column prop="weight" label="排序权重值" min-width="150" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="left">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.status == 1 ? 'success' : 'danger'">
                            {{ scope.row.status == 1 ? '已启用' : '已禁用' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 
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
            </div> -->
        </div>
        <!-- 编辑弹出框 -->
        <el-dialog :visible.sync="editVisible" width="50%" append-to-body="true">
            <div class="column">
                <span class="line lw2"></span>
                <span>规则属性</span>
            </div>
            <div class="sort_type">
                <el-form ref="form" :model="form" label-width="120px" class="" label-position="left ">
                    <el-form-item label="规则名称">
                        <div>{{ form.rule }}</div>
                    </el-form-item>
                    <el-form-item label="权重排序">
                        <el-input v-model="form.weight" type="number" placeholder="请输入纯数字0-99"></el-input>
                    </el-form-item>
                    <el-form-item label="未选中图标">
                        <el-upload
                            class="avatar-uploader"
                            action="fakeaction"
                            :http-request="uploadSectionFile"
                            :show-file-list="false"
                            :on-change="handleChange"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="form.iconNormal" :src="imgHead + form.iconNormal" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="选中图标">
                        <el-upload
                            class="avatar-uploader"
                            action="fakeaction"
                            :http-request="uploadSectionFileOn"
                            :show-file-list="false"
                            :on-change="handleChangeOn"
                            :before-upload="beforeAvatarUpload"
                        >
                            <img v-if="form.iconSelected" :src="imgHead + form.iconSelected" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
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
import {getList,update,fileUpload} from "@/api/system/configsort";
import {mapGetters} from "vuex";
export default {
    data: function () {
        return {
            imgHead: this.$imgHead,
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
            formYeDianType: {
                domains: [
                    {
                        type: ''
                    }
                ]
            }, //夜店类型
            formData: '',
            formDataOn: ''
        };
    },
    watch: {
        'form.weight': {
            handler: function (val) {
                if(val<=0){
                    this.form.weight = 0
                }
                if(val>=99){
                    this.form.weight = 99
                }
            },
            deep: true
        },
    },
    created() {
        this.getData();
    },

    methods: {
        getData() {
            getList().then(res => {
                this.tableData = res.data.data;
            });
        },
        addscree() {
            this.editVisible = true;
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = this.$regular.deep(row);
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit(val = '') {
            let data;
            val ? data = val : data = this.form;
            update(data).then(res => {
                if (res.data.code == 200) {
                    this.$message.success('修改成功');
                    this.editVisible = false;
                    this.getData();
                }
            });
            // this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 启用
        enable(index, row) {
            this.$set(row, 'status', row.status == 1 ? 0 : 1);
            this.saveEdit(row);
        },

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
                    this.$set(this.form, 'iconNormal', res.data.data.name);
                } else {
                    this.form.iconNormal = '';
                    this.$message.error('图片添加失败');
                }
            })
        },
        handleChangeOn(file, fileList) {
            this.formDataOn = file.raw;
        },

        uploadSectionFileOn(file) {
            let config = {
                'Content-Type': 'multipart/form-data'
            };
            let fromdata = new FormData();
            fromdata.append('file', this.formDataOn);
            fileUpload(fromdata).then(res=>{
                if (res.data.code == 200) {
                    this.$set(this.form, 'iconSelected', res.data.data.name);
                } else {
                    this.form.iconSelected = '';
                    this.$message.error('图片添加失败');
                }
            })
        }
    }
};
</script>

<style scoped lang='scss'>
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
    object-fit: none;
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
    .el-input {
        width: 150px;
        margin-right: 10px;
    }
    .addCou {
        height: 32px;
        cursor: pointer;
    }
    .el-form {
        margin-top: 10px;
    }
    .inp_box {
        position: relative;
        .close {
            position: absolute;
            right: 4px;
            top: -6px;
            font-size: 16px;
        }
    }
    i {
        cursor: pointer;
    }
}
</style>








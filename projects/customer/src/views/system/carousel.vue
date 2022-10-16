<template>
    <div class="city_local">
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-edit" class="handle-del mr10" @click="addHomeFigure">新增轮播图</el-button>
                <el-input v-model="query.text" placeholder="请输入启动页主题" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column label="ID" fixed type="index" align="center"></el-table-column>
                <el-table-column prop="name" label="轮播主题" min-width="150" align="center"></el-table-column>
                <el-table-column prop="storeName" label="所属商家" min-width="150" align="center"></el-table-column>
                <el-table-column label="轮播放置时间" min-width="150" align="center">
                    <template slot-scope="scope"
                        >{{ scope.row.timeStart | removeBlank }} 至 {{ scope.row.timeEnd | removeBlank }}</template
                    >
                </el-table-column>
                <el-table-column prop="weight" label="权重值" width="80" align="center"></el-table-column>
                <!-- <el-table-column prop="banner" label="图片" min-width="150" align="center">
                    <template slot-scope="scope">
                        {{scope.row.banner}}
                    </template>
                </el-table-column>-->
                <el-table-column prop="banner" label="图片" min-width="250" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="imgHead + scope.row.banner"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="enable(scope.$index, scope.row)" :type="scope.row.status == 1 ? 'success' : 'danger'">
                            {{ scope.row.status == 1 ? '已启用' : '已禁用' }}
                        </el-button>
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">编辑</el-button>
                        <el-button @click="handleDelete(scope.$index, scope.row)" type="primary">删除</el-button>
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
                <span>轮播信息</span>
            </div>
            <div class="figure">
                <el-form ref="form" :model="form" label-width="120px" class label-position="left ">
                    <el-form-item label="类型">
                        <el-radio-group v-model="form.type" :disabled="disabledRadio?true:false"  >
                            <el-radio label="0" @change="change_radio('0')">商家</el-radio>
                            <el-radio label="1" @change="change_radio('1')">活动</el-radio>
                            <el-radio label="2" @change="change_radio('2')">抽奖</el-radio>
                            <el-radio label="3" @change="change_radio('3')">等级领奖</el-radio>
                            <el-radio label="4" @change="change_radio('4')">指定长图</el-radio>
                            <el-radio label="9" @change="change_radio('9')">只读</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="商家/活动列表" v-show="form.type==0 || form.type==1">
                        <el-select v-model="form.title" filterable placeholder="请选择" @change="onSelected($event)">
                            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
                                <span style="float: left">{{ item.name }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.storeName }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="轮播主题">
                        <input class="inp_self just" type="text" placeholder="请输入主题" v-model="form.name" />
                    </el-form-item>

                    <el-form-item label="轮播图放置时间">
                        <el-date-picker
                            v-model="form.times"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        ></el-date-picker>
                        <label for style="margin: 0 20px">权重值</label>
                        <input class="inp_self" type="number" placeholder="请输入纯数字（0~99）" v-model="form.weight" />
                    </el-form-item>

                    <div class="up_text">轮播图片上传</div>
                    <el-upload
                        class="avatar-uploader"
                        action="fakeaction"
                        :show-file-list="false"
                        :on-change="handleChange"
                        :before-upload="beforeAvatarUpload"
                        :http-request="uploadSectionFile"
                    >
                        <img v-if="form.banner" :src="imgHead + form.banner" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                    <div class="lang">
                        <div class="up_text" v-show="form.type == 4">长图</div>
                        <el-upload
                            v-show="form.type == 4"
                            class="avatar-uploader"
                            action="fakeaction"
                            :show-file-list="false"
                            :on-change="handleChangeLang"
                            :before-upload="beforeAvatarUploadLang"
                            :http-request="uploadSectionFileLang"
                        >
                            <img v-if="form.bannerLarge" :src="imgHead + form.bannerLarge" class="avatar_lang" />
                            <i v-else class="el-icon-plus avatar-uploader-icon-lang"></i>
                        </el-upload>
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
import {getList, getDetail, add, update, remove,activeList,storeList,fileUpload} from "@/api/system/carousel";
 import {mapGetters} from "vuex";
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
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 1,
            form: {
                radio_type: '1'
            },
            idx: -1,
            id: -1,
            formData: '',
            formDataLang:'',
            options: [],
            disabledRadio:false,
            // 新增修改
            storeOrActName: '' //活动或商家名字
        };
    },
    watch: {
        'form.type': {
            handler: function (val) {
                if(val == 0 || val == 1){
                    console.log(1)
                    val == '0' ? this.marList() : this.actList();
                }
            },
            deep: true
        },
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
        getData() {
            let data = {
                keyword: this.query.text,
                current: this.query.pageIndex,
                size: this.query.pageSize
            };
            getList(data).then(res => {
                this.tableData = res.data.data.records;
                this.pageTotal = res.data.data.total;
            });
        },
        change_radio(val) {
            this.$set(this.form, 'title', '');
            this.$set(this.form, 'type', val);
        },
        // 获取商家或者活动列表
        marList() {
            let data = {
                size:200,
                current:1
            }
            storeList(data).then(res=>{
                this.options = res.data.data.records;
            })
        },
        actList() {
            let data = {
                size:200,
                current:1
            }
            activeList(data).then(res=>{
                this.options = res.data.data.records;
            })
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
        },
        addHomeFigure() {
            if (this.form.id) {
                this.form = {};
            }
            this.disabledRadio = false
            this.editVisible = true;
        },
        // 下拉框 改变
        onSelected(id) {
            // let obj = {};
            // obj = this.options.find((item) => {
            //     return item.id === id;
            // });

            // if (this.form.type == 0) {
            //     this.storeOrActName = obj.name;
            // } else {
            //     this.storeOrActName = obj.storeName;
            // }
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = this.$regular.deep(row);
            this.disabledRadio = true
            this.editVisible = true;
            this.$set(this.form, 'name', row.name);
            this.$set(this.form, 'times', [row.timeStart, row.timeEnd]);
            this.$set(this.form, 'title', row.refId);
            this.$set(this, 'storeName', row.storeName);
            this.$set(this.form, 'type', row.type.toString());
        },
        addCity() {
            this.dynamicValidateForm.domains.push({});
        },
        // 触发搜索按钮
        handleSearch() {
            // this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(row.id).then(res=>{
                        this.$message.success('删除成功');
                        this.tableData.splice(index, 1);
                    })
                })
                
        },

        // 保存编辑
        saveEdit(val = '') {
            if(this.form.type == 0 || this.form.type == 1){
                if(!this.form.title){
                    this.$message.warning('请选择商家/活动列表');
                    return
                }
            }

            if (!this.form.name) {
                this.$message.warning('请输入轮播主题');
                return;
            }
            if (!this.form.times) {
                this.$message.warning('请选择时间');
                return;
            }
            if (!this.form.weight) {
                this.$message.warning('请输入权重值');
                return;
            }
            if (!this.form.banner) {
                this.$message.warning('请添加轮播图');
                return;
            }

            if(this.form.type == 4){
                if(!this.form.bannerLarge){
                    this.$message.warning('请添加指定长图');
                    return
                }
            }

            let data = {
                timeStart: this.$regular.timeData(this.form.times[0]),
                id: this.form.id || '',
                timeEnd: this.$regular.timeData(this.form.times[1]),
                banner: this.form.banner,
                weight: this.form.weight,
                refId: this.form.title,
                name: this.form.name,
                bannerLarge:this.form.bannerLarge || ''
            };

            if(!data.id){
                data['type'] =  this.form.type
            }

            update(data).then(res=>{
                if(res.data.code == 200){
                    this.$message.success('操作成功');
                    this.editVisible = false;
                    this.getData();
                    this.$set(this.form, 'name', '');
                    this.$set(this.form, 'times', '');
                    this.$set(this.form, 'title', '');
                    this.$set(this.form, 'type', '');
                    this.$set(this.form, 'weight', '');
                    this.$set(this.form, 'banner', '');
                }else{
                    this.$message.warning(res.data.msg);
                }
            })
        
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
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
                    this.$set(this.form, 'banner', res.data.data.name);
                } else {
                    this.form.banner = '';
                    this.$message.error('图片添加失败');
                }
            })
        },

        handleChangeLang(file, fileList) {
            this.formDataLang = file.raw;
        },
        beforeAvatarUploadLang(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        uploadSectionFileLang(file) {
            let config = {
                'Content-Type': 'multipart/form-data'
            };
            let fromdata = new FormData();
            fromdata.append('file', this.formDataLang);

            fileUpload(fromdata).then(res=>{
                if (res.data.code == 200) {
                    this.$set(this.form, 'bannerLarge', res.data.data.name);
                } else {
                    this.form.bannerLarge = '';
                    this.$message.error('图片添加失败');
                }
            })
        }
    }
};
</script>

<style scoped lang='scss'>
/deep/.el-upload--text {
    width: 300px;
}
/deep/.lang .el-upload--text{
    width: 180px;
    height: 298px;
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
.avatar-uploader-icon-lang {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 298px;
    line-height: 298px;
    text-align: center;
}
.avatar {
    width: 298px;
    height: 178px;
    display: block;
}
.avatar_lang{
    width: 178px;
    height: 298px;
    display: block;
}
.figure {
    margin-left: 40px;
}
.up_text {
    line-height: 32px;
    margin-bottom: 18px;
}
.just {
    width: 210px;
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
    width: 180px;
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
// /deep/ .table-td-thumb{
//     max-width: 150px;
//     max-height: 150px;
// }
/deep/ .el-dialog {
    min-width: 850px;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/ .el-dialog__body {
    padding-top: 10px;
    .el-input {
        width: 240px;
        margin-right: 10px;
    }
}
</style>








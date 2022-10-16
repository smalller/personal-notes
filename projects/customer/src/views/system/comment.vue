<template>
    <div class="city_local">
        <div class="container">
            <div class="handle-box">
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
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column label="ID" fixed type="index"></el-table-column>

                <el-table-column prop="storeName" label="商家" width="180" align="center"></el-table-column>
                <el-table-column prop="userName" label="评论人" width="180" align="center"></el-table-column>
                <el-table-column prop="star" label="评分" width="80" align="center"></el-table-column>
                <el-table-column label="评论内容" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div class="com_del_box">{{ scope.row.content }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="评论时间" width="180" align="center"></el-table-column>
                <el-table-column label="操作" width="250" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="handleEdit(scope.$index, scope.row)" type="primary">查看</el-button>
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
                <span>评论内容</span>
            </div>
            <div class="figure">
                <el-form ref="form" :model="form" label-width="120px" class label-position="left ">
                    <div class="detail_box">

                        <el-form-item label="评论人：">
                            <div class="lab_text">{{ form.userName }}</div>
                        </el-form-item>
                        <el-form-item label="评分：">
                            <div class="lab_text">{{ form.star }}</div>
                        </el-form-item>
                        <el-form-item label="评论时间：">
                            <div class="lab_text">{{ form.createTime }}</div>
                        </el-form-item>
                        <el-form-item label="评论商家：">
                            <div class="lab_text">{{ form.storeName }}</div>
                        </el-form-item>

                        <el-form-item label="评论详情：">
                            <div class="lab_text">{{ form.content }}</div>
                        </el-form-item>

                        <el-form-item label="配图/视频：" v-if="form.attach">
                            <div class="imgs">
                                <div style="display: inline-block" v-for="(item, i) in form.appraisePictureList" :key="i">
                                    <img :src="addUrl + item" alt="" v-if="item.substr(-3) != 'mp4'" />
                                    <video width="320" height="240" controls class="video" v-else>
                                        <source :src="addUrl + item" type="video/mp4" />
                                        您的浏览器不支持 video 标签。
                                    </video>
                                </div>
                            </div>
                        </el-form-item>

                        <div class="look_more" @click="moreComs" v-if="!more && form.commentNum > 0">查看评论</div>
                        <div class="look_more" v-if="more && form.commentNum > 0" @click="more = false">收回评论</div>

                        <div class="coms_box" v-if="more && form.commentNum > 0">
                            <div class="reply_num">回复（{{ coms_total }}）：</div>
                            <div class="coms">
                                <div v-for="(item, index) in coms_list" :key="index" class="com_li">
                                    <div class="com_top">
                                        <div class="user">
                                            <span class="user_name">{{ item.userName }}</span>
                                            <span class="com_time">{{ item.createTime }}</span>
                                        </div>
                                        <div class="like">
                                            <i class="iconfont icon-dianzan"></i>
                                            <span class="like_num">{{ item.fabulous }}</span>
                                            <span>{{ index + 1 }}楼</span>
                                        </div>
                                    </div>
                                    <div class="com_text">
                                        <i
                                            v-show="removeDate"
                                            :class="item.select ? 'icon-dui' : 'icon-quan'"
                                            @click="deleteSelect(item)"
                                            class="iconfont"
                                        ></i>
                                        <span>{{ item.content }}</span>
                                        <template v-if="item.childList.length > 0">
                                            <div v-for="(child, i) in item.childList" :key="i" class="child_com">
                                                <div class="com_text">
                                                    <i
                                                        v-show="removeDate"
                                                        @click="deleteSelect(child)"
                                                        :class="child.select ? 'icon-dui' : 'icon-quan'"
                                                        class="iconfont"
                                                    ></i>
                                                    <span class="reply" v-if="child.userId == item.replyId">楼主回复:</span>
                                                    <span class="reply" v-else>{{ child.userName }}:</span>
                                                    <span>{{ child.content }}</span>
                                                </div>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button v-show="!removeDate" type="primary" @click="removeComsSelect()"> 批量删除</el-button>
                <el-button v-show="removeDate" type="primary" @click="removeComs()"> 确认删除</el-button>
                <el-button @click="editVisible = false">返 回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {getList, getDetail, add, update, remove,allComment,delComment} from "@/api/system/comment";
import {mapGetters} from "vuex";
export default {
    data: function () {
        return {
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
            form: {},
            coms_list: [],
            idx: -1,
            id: -1,
            formData: '',
            options: [],
            more: false,
            removeDate: false,
            addUrl: this.$imgHead
        };
    },
    watch: {},
    created() {
        this.getData();
    },
    filters: {
        timeFormat(time) {
            let diff = new Date().getTime() - new Date(time).getTime();
            let getHours, minutes, seconds, leve1, leve2, leve3;
            leve1 = diff % (24 * 3600 * 1000);
            getHours = Math.floor(leve1 / (3600 * 1000));
            leve2 = leve1 % (3600 * 1000);
            minutes = Math.floor(leve2 / (60 * 1000));
            leve3 = leve2 % (60 * 1000);
            seconds = Math.floor(leve3 / 1000);
            if (getHours < 10) {
                getHours = '0' + getHours;
            }
            if (minutes < 10) {
                minutes = '0' + minutes;
            }
            if (seconds < 10) {
                seconds = '0' + seconds;
            }
            return getHours + ':' + minutes + ':' + seconds;
        }
    },
    methods: {
        getData() {
            let data = {
                current: this.query.pageIndex,
                size: this.query.pageSize,
                keyword:this.query.text
            };
            getList(data).then((res) => {
                res.data.data.records.forEach(v=>{
                    v['appraisePictureList'] = v.attach.split(',')
                })
                this.tableData = res.data.data.records;
                this.pageTotal = res.data.data.total;
            });
        },
        // 编辑操作
        handleEdit(index, row) {
            this.more = false;
            this.removeDate = false;
            this.form = row
            this.editVisible = true;
            this.idx = index;
        },
        // 查看帖子详情
        moreComs() {
            let data = {
                current: 1,
                size: 200,
                refId: this.form.id,
                type:3
            };
            allComment(data).then((res) => {
                if (res.data.code == 200) {
                    this.more = true;
                    this.coms_list = res.data.data.records;
                    this.coms_total = res.data.data.total;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        // 批量选中  要删除的评论
        deleteSelect(item) {
            if (item.select) {
                this.$set(item, 'select', false);
            } else {
                this.$set(item, 'select', true);
            }
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    remove(row.id).then((res) => {
                        if (res.data.code == 200) {
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        }
                    });
                    return;
                })
                .catch(() => {});
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
        // 保存编辑
        saveEdit(val = '') {
            return;
            let data = {};
            let type, url;
            if (this.form.id) {
                type = this.$put;
                url = '/admin/rotation/update';
            }
            type(url, data).then((res) => {
                if (res.code == 0) {
                    this.$message.success('操作成功');
                    this.editVisible = false;
                    if (this.form.id) {
                        this.$set(this.tableData, this.idx, data);
                    }
                }
            });
        },

        removeComsSelect() {
            this.removeDate = true;
        },
        //删除评论
        removeComs() {
            let that = this;
            let arr = [];
            this.coms_list.forEach((v) => {
                if (v.select) {
                    arr.push(v.id);
                }
                v.childList.forEach((i) => {
                    if (i.select) {
                        arr.push(i.id);
                    }
                });
            });
            if (arr.length <= 0) {
                this.removeDate = false;
                return;
            }
            arr = arr.join(',')
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    delComment(arr).then((res) => {
                        if (res.data.code == 200) {
                            that.$message.success('删除成功');
                            that.removeDate = false;
                            that.moreComs();
                        } else {
                            that.$message.error(res.msg);
                        }
                    });
                })
                .catch((err) => {
                    console.log(err);
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
/deep/.el-upload--text {
    width: 300px;
}
.detail_box {
    margin-left: 40px;
    .lab_text {
        padding: 0 10px;
        display: inline-block;
        width: 75%;
    }
    .imgs {
        img {
            width: 140px;
            height: 180px;
            margin-right: 10px;
            border-radius: 5px;
            object-fit: fill;
        }
    }
    .video {
        height: 180px;
    }
    .look_more {
        cursor: pointer;
        padding-left: 120px;
        &:hover {
            color: #409eff;
        }
    }
    .coms_box {
        height: 300px;
        overflow-y: scroll;
        .reply_num {
            line-height: 42px;
        }
        .coms {
            margin-left: 30px;
            padding-right: 40px;
            .com_li {
                padding-bottom: 12px;
                margin-bottom: 12px;
                border-bottom: 1px solid #999;
                .com_top {
                    display: flex;
                    margin-bottom: 8px;
                    font-size: 14px;
                    .user {
                        flex: 1;
                        .user_name {
                            margin-right: 24px;
                        }
                        .com_time {
                            color: #bbb;
                        }
                    }
                    .like {
                        flex: 1;
                        text-align: right;
                        .like_num {
                            margin: 0 30px 0 8px;
                        }
                    }
                }
                .com_text {
                    font-size: 14px;
                    position: relative;
                    .iconfont {
                        position: absolute;
                        left: -25px;
                        cursor: pointer;
                    }
                    .icon-dui {
                        color: #409eff;
                    }
                    .child_com {
                        margin-top: 10px;
                    }
                    .reply {
                        color: #409eff;
                        margin-right: 15px;
                    }
                }
            }
        }
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
/deep/ .el-dialog {
    min-width: 850px;
    margin-top: 10vh !important;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/ .el-dialog__body {
    padding-top: 10px;
}
</style>









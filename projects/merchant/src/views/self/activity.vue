<template>
  <div class="">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 活动管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="container">
      <div class="handle-box">
        <el-button
          type="primary"
          icon="el-icon-edit"
          class="handle-del mr10"
          @click="addNewAct()"
          >新增活动</el-button
        >
        <el-input
          v-model="query.text"
          placeholder="活动主题"
          class="handle-input mr10"
        ></el-input>
        <el-date-picker
          v-model="query.times"
          type="datetimerange"
          format="yyyy-MM-dd HH:mm"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch"
          >搜索</el-button
        >
      </div>
      <el-table
        :data="tableData"
        border
        class="table"
        @row-dblclick="lineDb"
        ref="multipleTable"
        header-cell-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="ID"
          type="index"
          width="50"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          prop="name"
          min-width="200"
          label="活动主题"
        ></el-table-column>
        <el-table-column label="活动简介" min-width="200">
          <template slot-scope="scope">
            <div class="text_over t_o">{{ scope.row.synopsis }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="startTime"
          label="活动开始时间"
          min-width="220"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="endTime"
          label="活动结束时间"
          min-width="220"
          align="center"
        ></el-table-column>
        <!-- <el-table-column label="标签" prop="labelsList" min-width="250" align="center">
                    <template slot-scope="scope">
                        <span class="lab_span" v-for="(item, index) in scope.row.labelsList" :key="index">{{ item }}</span>
                    </template>
                </el-table-column> -->
        <el-table-column label="活动缩略图" align="center" min-width="180">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="imgHead + scope.row.thumb"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="act_content"
          class-name="beyond"
          min-width="320"
          label="活动内容"
        >
          <template slot-scope="scope">
            <div class="com_del_box">
              {{ scope.row.content | editorText }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" align="center" fixed="right">
          <template slot-scope="scope">
            <span v-for="(btn, i) in buttons" :key="i">
              <el-button
                style="margin-right: 10px"
                v-show="scope.row.examine == btn.type"
                :type="btn.color"
                :disabled="scope.row.examine != 0 && scope.row.examine != 3"
                @click="changeType(scope.row, scope.$index)"
              >
                {{ btn.text }}</el-button
              >
            </span>
            <el-button type="primary" @click="lineDb(scope.row, scope.$index)"
              >编辑</el-button
            >
            <el-button
              type="primary"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
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
    <el-dialog :title="doing" :visible.sync="editVisible" width="62%">
      <el-form ref="form" :model="form" label-width="70px">
        <div class="column">
          <span class="line lw2"></span>
          <span>活动详情</span>
        </div>
        <div class="top_info">
          <div class="activity">
            <div class="in_act">
              <el-form-item label="活动名称">
                <el-input
                  v-model="dynamicValidateForm.dio_name"
                  maxlength="30"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="活动简介">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 7, maxRows: 10 }"
                  v-model="dynamicValidateForm.dio_introduce"
                  maxlength="120"
                  show-word-limit
                ></el-input>
              </el-form-item>
              <el-form-item label="活动时间">
                <el-date-picker
                  v-model="dynamicValidateForm.times"
                  type="datetimerange"
                  range-separator="至"
                  format="yyyy-MM-dd HH:mm"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
              </el-form-item>
              <!-- <div class="lab_box">
                                <label class="label">活动标签</label>
                                <div class="iptList">
                                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
                                        <el-form-item
                                            v-for="(domain, index) in dynamicValidateForm.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <el-input v-model="domain.value"></el-input>
                                            <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                        </el-form-item>
                                        <el-form-item>
                                            <img src="../../assets/img/jia.png" @click="addDomain" class="addLab" />
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </div> -->
            </div>
          </div>
          <!-- <div class="banner" v-loading="loading">
                        <div class="imgs">
                            <p>活动详情宣传图:</p>
                            <el-upload
                                class="avatar-uploader"
                                action="fakeaction"
                                :show-file-list="false"
                                :on-remove="handleRemove"
                                :on-change="handleChange"
                                :http-request="uploadSectionFile"
                            >
                                <img v-if="dynamicValidateForm.fromdata" :src="imgHead + dynamicValidateForm.fromdata" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="" />
                            </el-dialog>
                            <span>（*请上传尺寸大小为351*154，格式为jpg/jpeg/png的图片）</span>
                        </div>
                    </div> -->

          <div class="breviary" v-loading="loading1">
            <div class="imgs">
              <p>活动缩略图:</p>
              <el-upload
                class="avatar-uploader1"
                action="fakeaction"
                :show-file-list="false"
                :on-remove="handleRemove1"
                :on-change="handleChange1"
                :http-request="uploadSectionFile1"
              >
                <img
                  v-if="dynamicValidateForm.thumb"
                  :src="imgHead + dynamicValidateForm.thumb"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible1">
                <img width="100%" :src="dialogImageUrl1" alt="" />
              </el-dialog>
              <span>(*请上传尺寸大小为120*120，格式为jpg/jpeg/png的图片）</span>
            </div>
          </div>
        </div>
        <div class="editor">
          <!-- <editor :formData="dynamicValidateForm" @getChild="theEditorContent"></editor> -->
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">返回</el-button>
        <el-button
          type="primary"
          @click="saveEdit"
          v-if="
            dynamicValidateForm.examine == 0 ||
            dynamicValidateForm.examine == 3 ||
            dynamicValidateForm.examine == 2
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import editor from '../../components/common/editor';
export default {
  name: "basetable",
  data() {
    return {
      imgHead: this.$imgHead,
      query: {
        times: [],
        text: "",
        pageIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      dio_name: "",
      dio_introduce: "",
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      formData: [],
      formData1: [],
      dialogImageUrl: "",
      dialogImageUrl1: "",
      dialogVisible: false,
      dialogVisible1: false,
      doing: "",
      dynamicValidateForm: {
        domains: [
          {
            value: "",
          },
        ], //标签
        dio_name: "", //名字
        dio_introduce: "", //简介
        fromdata: "", //图片
        thumb: "", //缩略图
        editor_text: "", //富文本
        times: [],
        id: "",
        examine: 0,
      },
      loading: false,
      loading1: false,
      buttons: [
        {
          type: 0,
          color: "",
          text: "提交审核",
        },
        {
          type: 1,
          color: "warning",
          text: "审核中",
        },
        {
          type: 2,
          color: "danger",
          text: "审核未通过",
        },
        {
          type: 3,
          color: "",
          text: "再次提交",
        },
        {
          type: 4,
          color: "success",
          text: "审核通过",
        },
        {
          type: 5,
          color: "info",
          text: "已下架",
        },
      ],
    };
  },
  components: {
    // editor
  },
  created() {
    this.getData();
  },
  methods: {
    // 新增活动标签相关
    removeDomain(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain() {
      this.dynamicValidateForm.domains.push({});
    },
    theEditorContent(val) {
      this.dynamicValidateForm.editor_text = val;
    },
    getData() {
      let data = {
        name: this.query.text,
        startTime: this.query.times[0]
          ? this.$regular.timeData(this.query.times[0], 3) + ":00"
          : null,
        endTime: this.query.times[1]
          ? this.$regular.timeData(this.query.times[1], 3) + ":00"
          : null,
      };
      this.$post("/merchant/store/active/getActive", data).then((res) => {
        this.tableData = res.data;
        this.pageTotal = res.data.length;
      });
    },
    changeType(val, index) {
      this.$confirm("是否提交审核", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$get(`/merchant/store/active/apply/${val.id}`).then((res) => {
            if (res.code == 0) {
              this.$set(val, "examine", 1);
            } else {
              this.$message.warning(res.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 触发搜索按钮
    handleSearch() {
      // if(!this.query.text){
      //     this.$message.error('请填写活动主题');
      //     return
      // }
      //  if(this.query.times.length==0){
      //     this.$message.error('请选择时间段');
      //     return
      // }
      this.$set(this.query, "pageIndex", 1);
      this.getData();
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          this.$Delete(`/merchant/store/active/deleteById/${row.id}`).then(
            (res) => {
              if (res.code == 0) {
                this.$message.success(`删除成功`);
                this.tableData.splice(index, 1);
              }
              this.loading = false;
            }
          );
        })
        .catch(() => {});
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 新增活动
    addNewAct(index = "", row = "") {
      if (this.dynamicValidateForm.id) {
        this.dynamicValidateForm = {
          domains: [
            {
              value: "",
            },
          ], //标签
          dio_name: "", //名字
          dio_introduce: "", //简介
          fromdata: "", //图片
          editor_text: "", //富文本
          times: [],
          id: "",
          examine: 0,
        };
      }
      this.editVisible = true;
    },
    //编辑
    lineDb(row, index, column, event) {
      (this.dynamicValidateForm = {
        domains: [
          {
            value: "",
          },
        ],
        dio_name: "",
        dio_introduce: "",
        fromdata: "",
        editor_text: "",
        times: [],
        id: "",
        examine: 0,
      }),
        this.$set(this.dynamicValidateForm, "dio_name", row.name);
      this.$set(this.dynamicValidateForm, "dio_introduce", row.synopsis);
      this.$set(this.dynamicValidateForm, "id", row.id);
      this.$set(this.dynamicValidateForm, "examine", row.examine);
      this.$set(this.dynamicValidateForm, "editor_text", row.content);
      this.$set(this.dynamicValidateForm, "times", [
        row.startTime,
        row.endTime,
      ]);
      this.$set(this.dynamicValidateForm, "fromdata", row.banner);
      this.$set(this.dynamicValidateForm, "thumb", row.thumb);

      for (let j = 0; j < row.labelsList.length; j++) {
        this.$set(this.dynamicValidateForm.domains, j, {
          value: row.labelsList[j],
        });
      }
      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      let str = "";
      this.dynamicValidateForm.domains.forEach((i) => {
        str += i.value + ",";
      });
      str = str.substr(0, str.length - 1);
      let data = {
        content: this.dynamicValidateForm.editor_text,
        id: this.dynamicValidateForm.id,
        // labels: str,
        name: this.dynamicValidateForm.dio_name,
        startTime:
          this.$regular.timeData(this.dynamicValidateForm.times[0], 3) + ":00",
        endTime:
          this.$regular.timeData(this.dynamicValidateForm.times[1], 3) + ":00",
        synopsis: this.dynamicValidateForm.dio_introduce,
        banner: this.dynamicValidateForm.fromdata,
        thumb: this.dynamicValidateForm.thumb,
        examine: this.dynamicValidateForm.examine,
      };
      if (!data.name) {
        this.$message.warning(`请输入活动名称`);
        return;
      }
      if (!data.synopsis) {
        this.$message.warning(`请输入活动简介`);
        return;
      }
      // if (!data.labels) {
      //     this.$message.warning(`请输入活动标签`);
      //     return;
      // }
      // if (!data.banner) {
      //     this.$message.warning(`请添加活动图片`);
      //     return;
      // }
      if (!data.thumb) {
        this.$message.warning(`请添加活动缩略图`);
        return;
      }
      if (!data.startTime) {
        this.$message.warning(`请选择活动开始时间`);
        return;
      }
      if (!data.content) {
        this.$message.warning(`请输入活动内容`);
        return;
      }

      let url, type;
      if (this.dynamicValidateForm.id) {
        type = this.$put;
        url = "/merchant/store/active/update";
      } else {
        type = this.$post;
        url = "/merchant/store/active/save";
      }
      type(url, data).then((res) => {
        if (res.code == 0) {
          this.$message.success(`操作成功`);
          this.editVisible = false;
          this.getData();
        }
      });
    },
    // 分页导航
    handlePageChange(val) {
      this.$set(this.query, "pageIndex", val);
      this.getData();
    },
    // 图片上传
    uploadImg() {
      let config = {
        "Content-Type": "multipart/form-data",
      };
      let fromdata = new FormData();
      fromdata.append("file", this.formData);
      this.$file_post(
        "/merchant/store/system/upload/create",
        fromdata,
        config
      ).then((res) => {
        if (res.code == 0) {
          this.dynamicValidateForm.fromdata = res.data;
        } else {
          this.$message.error(`图片上传失败，请刷新后再试`);
        }
        this.loading = false;
      });
    },
    handleRemove(file, fileList) {
      this.formData.forEach((i, index) => {
        if (file.name == i.name) {
          this.formData.splice(index, 1);
        }
      });
    },
    handleChange(file, fileList) {
      this.formData = file.raw;
    },
    uploadSectionFile(file) {
      this.loading = true;
      this.uploadImg();
    },

    // 图片上传 缩略
    uploadImg1() {
      let config = {
        "Content-Type": "multipart/form-data",
      };
      let fromdata = new FormData();
      fromdata.append("file", this.formData1);
      this.$file_post(
        "/merchant/store/system/upload/create",
        fromdata,
        config
      ).then((res) => {
        if (res.code == 0) {
          this.dynamicValidateForm.thumb = res.data;
        } else {
          this.$message.error(`图片上传失败，请刷新后再试`);
        }
        this.loading1 = false;
      });
    },
    handleRemove1(file, fileList) {
      this.formData1.forEach((i, index) => {
        if (file.name == i.name) {
          this.formData1.splice(index, 1);
        }
      });
    },
    handleChange1(file, fileList) {
      this.formData1 = file.raw;
    },
    uploadSectionFile1(file) {
      this.loading1 = true;
      this.uploadImg1();
    },
  },
};
</script>

<style scoped lang='scss'>
.handle-box {
  .el-date-editor {
    margin-right: 10px;
  }
}
.t_o {
  -webkit-line-clamp: 2;
}
.top_info {
  display: flex;
  .activity {
    flex: 0.4;
    .in_act {
      width: 85%;
    }
    .lab_box {
      display: flex;
      input {
        width: 100px;
        height: 32px;
        text-indent: 10px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        color: #606266;
        background: none;
        outline: none;
      }
      input:focus {
        border: 1px solid #409eff;
      }
      label {
        width: 70px;
      }
      .iptList {
        width: calc(100% - 70px);
        i {
          cursor: pointer;
        }
      }
    }
    .addLab {
      height: 32px;
      width: 32px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
  .banner,
  .breviary {
    flex: 0.3;
    padding-left: 10px;
    .imgs {
      p {
        margin-bottom: 15px;
      }
    }
  }
  .banner {
    /deep/.el-upload--text {
      width: 300px;
    }
    .avatar {
      width: 298px;
      height: 178px;
      display: block;
    }
  }
  .breviary {
    /deep/.el-upload--text {
      width: 180px;
    }
    .avatar {
      width: 180px;
      height: 178px;
      display: block;
    }
  }

  /deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
}
.handle-box {
  margin-bottom: 20px;
}
.lab_span {
  border: 1px solid #7a7a7a;
  border-radius: 4px;
  margin-right: 10px;
  padding: 1px 10px;
}
.handle-select {
  width: 120px;
}
.com_del_box {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
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
  width: 140px;
  height: 80px;
  margin-right: 10px;
}
.table-td-thumb img {
  width: 100%;
  height: 100%;
}
// element
/deep/ .el-dialog {
  width: 75%;
  // min-width: 1150px;
  min-width: 900px;
}
/deep/.el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__body {
  padding-top: 10px;
}
/deep/.lab_box {
  .el-form-item--small {
    display: inline-block;
    margin-right: 15px;
  }
  .el-input--small {
    width: 100px;
  }
  .el-icon-error {
    margin-left: 5px;
  }
}
/deep/.handle-input {
  width: 150px;
}
</style>

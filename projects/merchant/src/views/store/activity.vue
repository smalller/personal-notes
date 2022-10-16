<template>
  <div class="">
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
          clearable
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
        <el-table-column prop="reason" min-width="200" label="驳回原因">
          <template slot-scope="scope">
            <div class="text_over t_o">{{ scope.row.reason || "/" }}</div>
          </template>
        </el-table-column>
        <el-table-column label="活动简介" min-width="200">
          <template slot-scope="scope">
            <div class="text_over t_o">{{ scope.row.description }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="timeStart"
          label="活动开始时间"
          min-width="220"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="timeEnd"
          label="活动结束时间"
          min-width="220"
          align="center"
        ></el-table-column>
        <el-table-column label="活动缩略图" align="center" min-width="180">
          <template slot-scope="scope">
            <el-image
              class="table-td-thumb"
              :src="imgHead + scope.row.thumb"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          class-name="beyond"
          min-width="120"
          label="审核状态"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="com_del_box">
              <span v-for="(btn, i) in buttons" :key="i">
                <el-button
                  style="margin-right: 10px"
                  v-show="scope.row.audit == btn.type"
                  :type="btn.color"
                  :disabled="scope.row.audit != 0 && scope.row.audit != 2"
                  @click="changeType(scope.row, scope.$index)"
                >
                  {{ btn.text }}</el-button
                >
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template slot-scope="scope">
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
    <el-dialog
      :title="doing"
      :visible.sync="editVisible"
      width="62%"
      append-to-body="true"
    >
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
                  type="textarea"
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
              <!-- <el-form-item label="活动类型">
                <el-select
                  v-model="dynamicValidateForm.examine"
                  placeholder="请选择活动类型"
                >
                  <el-option
                    v-for="item in activeType"
                    :key="item.type"
                    :label="item.text"
                    :value="item.type"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item
                label="活动外链"
                v-if="dynamicValidateForm.examine == 2"
              >
                <el-input
                  placeholder="请输入链接"
                  v-model="dynamicValidateForm.link"
                ></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="banner" v-loading="loading">
            <div class="imgs">
              <p>活动缩略图:</p>
              <el-upload
                class="avatar-uploader"
                action="fakeaction"
                :show-file-list="false"
                :on-remove="handleRemove"
                :on-change="handleChange"
                :before-upload="beforeAvatarUpload"
                :http-request="uploadSectionFile"
              >
                <img
                  v-if="dynamicValidateForm.thumb"
                  :src="imgHead + dynamicValidateForm.thumb"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
              <!-- <span>（*请上传尺寸大小为351*154，格式为jpg/jpeg/png的图片）</span> -->
            </div>
          </div>

          <div class="breviary" v-loading="loading1">
            <div class="imgs">
              <p>活动宣传图:</p>
              <el-upload
                class="avatar-uploader1"
                action="fakeaction"
                :show-file-list="false"
                :on-remove="handleRemove1"
                :on-change="handleChange1"
                :http-request="uploadSectionFile1"
                :before-upload="beforeAvatarUpload1"
              >
                <img
                  v-if="dynamicValidateForm.fromdata"
                  :src="imgHead + dynamicValidateForm.fromdata"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible1">
                <img width="100%" :src="dialogImageUrl1" alt="" />
              </el-dialog>
              <!-- <span>(*请上传尺寸大小为120*120，格式为jpg/jpeg/png的图片）</span> -->
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">返回</el-button>
        <el-button
          type="primary"
          @click="saveEdit"
          v-if="
            dynamicValidateForm.audit == 0 || dynamicValidateForm.audit == 2
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import editor from '../../components/common/editor';
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  fileUpload,
  audit,
} from "@/api/store/activity";
import { mapGetters } from "vuex";

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
        dio_name: "", //名字
        dio_introduce: "", //简介
        fromdata: "", //图片
        thumb: "", //缩略图
        editor_text: "", //富文本
        times: [],
        id: "",
        examine: "",
        link: "",
        audit: 0,
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
          color: "success",
          text: "审核通过",
        },
      ],
      activeType: [
        { type: 1, text: "商家活动" },
        // { type: 2, text: "音乐节" },
      ],
    };
  },
  // components: {
  //     editor
  // },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      let data = {
        size: this.query.pageSize,
        current: this.query.pageIndex,
        name: this.query.text,
        timeStart: this.query.times[0]
          ? this.$regular.timeData(this.query.times[0], 3) + ":00"
          : null,
        timeEnd: this.query.times[1]
          ? this.$regular.timeData(this.query.times[1], 3) + ":00"
          : null,
      };
      getList(data).then((res) => {
        this.tableData = res.data.data.records;
        this.pageTotal = res.data.data.total;
      });
    },
    changeType(val, index) {
      this.$confirm("是否提交审核", "提示", {
        type: "warning",
      })
        .then(() => {
          audit(val.id).then((res) => {
            if (res.data.code == 200) {
              this.$set(val, "audit", 1);
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
          remove(row.id).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.tableData.splice(index, 1);
            }
          });
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
          dio_name: "", //名字
          dio_introduce: "", //简介
          fromdata: "", //图片
          editor_text: "", //富文本
          times: [],
          id: "",
          examine: "",
          link: "",
          audit: 0,
        };
      }
      this.editVisible = true;
    },
    //编辑
    lineDb(row, index, column, event) {
      this.dynamicValidateForm = {
        dio_name: "",
        dio_introduce: "",
        fromdata: "",
        editor_text: "",
        times: [],
        id: "",
        examine: "",
        link: "",
        audit: 0,
      };
      this.$set(this.dynamicValidateForm, "dio_name", row.name);
      this.$set(this.dynamicValidateForm, "dio_introduce", row.description);
      this.$set(this.dynamicValidateForm, "id", row.id);
      this.$set(this.dynamicValidateForm, "examine", row.type);
      this.$set(this.dynamicValidateForm, "editor_text", row.content);
      this.$set(this.dynamicValidateForm, "times", [
        row.timeStart,
        row.timeEnd,
      ]);
      this.$set(this.dynamicValidateForm, "fromdata", row.banner);
      this.$set(this.dynamicValidateForm, "thumb", row.thumb);

      this.$set(this.dynamicValidateForm, "audit", row.audit);

      this.$set(this.dynamicValidateForm, "store", row.storeId);

      this.editVisible = true;
    },
    // 保存编辑
    saveEdit() {
      let data = {
        id: this.dynamicValidateForm.id,
        name: this.dynamicValidateForm.dio_name,
        timeStart: this.$regular.timeData(this.dynamicValidateForm.times[0], 1),
        timeEnd: this.$regular.timeData(this.dynamicValidateForm.times[1], 1),
        description: this.dynamicValidateForm.dio_introduce,
        banner: this.dynamicValidateForm.fromdata,
        thumb: this.dynamicValidateForm.thumb,
        type: 1,
        link: this.dynamicValidateForm.link || "",
        audit: this.dynamicValidateForm.audit,
      };
      if (!data.name) {
        this.$message.warning(`请输入活动名称`);
        return;
      }
      if (!data.description) {
        this.$message.warning(`请输入活动简介`);
        return;
      }
      if (!data.thumb) {
        this.$message.warning(`请添加活动缩略图`);
        return;
      }
      if (!data.banner) {
        this.$message.warning(`请添加活动详情图`);
        return;
      }
      if (!data.timeStart) {
        this.$message.warning(`请选择活动开始时间`);
        return;
      }

      if (data.id) {
        update(data).then((res) => {
          if (res.data.code == 200) {
            this.$message.success(`修改成功`);
            this.editVisible = false;
            this.getData();
          }
        });
      } else {
        add(data).then((res) => {
          if (res.data.code == 200) {
            this.dynamicValidateForm = {
              dio_name: "",
              dio_introduce: "",
              fromdata: "",
              editor_text: "",
              times: [],
              id: "",
              examine: "",
              link: "",
              audit: 0,
            };
            this.$message.success(`新增成功`);
            this.editVisible = false;
            this.getData();
          }
        });
      }
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
      fileUpload(fromdata).then((res) => {
        if (res.data.code == 200) {
          this.$set(this.dynamicValidateForm, "thumb", res.data.data.name);
        } else {
          this.dynamicValidateForm.thumb = "";
          this.$message.error("图片添加失败");
        }
        this.loading = false;
      });
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error("只能上传jpg/png格式图片");
      }
      return isJPG;
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
      fileUpload(fromdata).then((res) => {
        if (res.data.code == 200) {
          this.$set(this.dynamicValidateForm, "fromdata", res.data.data.name);
        } else {
          this.dynamicValidateForm.fromdata = "";
          this.$message.error("图片添加失败");
        }
        this.loading1 = false;
      });
    },
    beforeAvatarUpload1(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      if (!isJPG) {
        this.$message.error("只能上传jpg/png格式图片");
      }
      return isJPG;
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
  min-width: 1100px;
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

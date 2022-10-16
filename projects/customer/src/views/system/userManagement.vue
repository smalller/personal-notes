<template>
  <basic-container>
    <div class="handle-box">
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.realName"
        placeholder="用户名字"
        class="handle-input mr10"
      ></el-input>
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.phone"
        placeholder="手机号码"
        class="handle-input mr10"
      ></el-input>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearch(page, searchObj)"
        >搜索</el-button
      >
    </div>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :permission="permissionList"
      v-model="form"
      ref="crud"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="handleSetUser(scope.row)"
          >用户设置</el-button
        >
      </template>
    </avue-crud>

    <el-dialog
      title="用户状态设置"
      :visible.sync="dialogFormVisible"
      append-to-body="true"
      width="30%"
    >
      <el-radio-group v-model="statusRestrict">
        <el-radio :label="0">正常</el-radio>
        <el-radio :label="1">禁言</el-radio>
        <el-radio :label="2">封号</el-radio>
      </el-radio-group>

      <template v-if="statusRestrict == 1 || statusRestrict == 2">
        <div class="dialog-item">
          <p>选择禁言/封号时长</p>
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="dialog-item">
          <p>封禁原因</p>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="reasonRestrict"
          >
          </el-input>
        </div>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitUserSetting">确定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, update } from "@/api/system/userManagement";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      userId: "",
      statusRestrict: 0,
      reasonRestrict: "",
      searchTime: [],

      dialogFormVisible: false,
      form: {},
      loading: true,
      searchObj: {
        realName: "",
        phone: "",
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        refreshBtn: false,
        showColumn: false,
        columnBtn: false,
        showBorder: true,
        height: "auto",
        calcHeight: 30,
        tip: false,
        border: true,
        index: true,
        viewBtn: true,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: "名字",
            prop: "name",
          },
          {
            label: "用户编号",
            prop: "codeNs",
          },
          {
            label: "性别",
            prop: "sex",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "未设置",
                value: 0,
              },
              {
                label: "男",
                value: 1,
              },
              {
                label: "女",
                value: 2,
              },
            ],
          },
          {
            label: "出生日期",
            prop: "birthday",
          },
          {
            label: "所在地",
            prop: "fullAddress",
          },
          {
            label: "手机号码",
            prop: "phone",
          },
          {
            label: "身份证号码",
            prop: "idCard",
          },
          {
            label: "最后登录时间",
            prop: "timeLast",
          },
          {
            label: "是否实名认证",
            prop: "isCertification",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "否",
                value: 0,
              },
              {
                label: "是",
                value: 1,
              },
            ],
          },
          {
            label: "财富等级",
            prop: "wealthLevel",
          },
          {
            label: "总消费金额",
            prop: "moneyConsume",
          },
          {
            label: "用户状态",
            prop: "statusRestrict",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "正常",
                value: 0,
              },
              {
                label: "已禁言",
                value: 1,
              },
              {
                label: "已封号",
                value: 2,
              },
              {
                label: "已冻结",
                value: 3,
              },
            ],
          },
        ],
      },
      data: [],
    };
  },

  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        viewBtn: this.vaildData(this.permission.store_view, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },

  methods: {
    handleSetUser(row) {
      this.userId = row.id;
      this.statusRestrict = row.statusRestrict;
      this.reasonRestrict = row.reasonRestrict;
      this.searchTime = [];
      this.searchTime.push(row.startRestrict, row.endRestrict);
      this.dialogFormVisible = true;
    },

    async submitUserSetting() {
      let data = {
        id: this.userId,
        statusRestrict: this.statusRestrict,
        reasonRestrict: this.reasonRestrict,
      };
      if (this.statusRestrict == 0) {
        data.reasonRestrict = "";
      } else {
        data.startRestrict = this.searchTime
          ? this.$regular.timeData(this.searchTime[0], 1)
          : "";
        data.endRestrict = this.searchTime
          ? this.$regular.timeData(this.searchTime[1], 1)
          : "";
      }

      const res = await update(data);
      if (res.data.code === 200) {
        this.$message.success("修改成功");
        this.dialogFormVisible = false;
        this.onLoad(this.page);
      }
    },

    handleSearch(page) {
      page.currentPage = 1;
      this.onLoad(page);
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    onLoad(page) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, this.searchObj).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.handle-box {
  .handle-input {
    width: 170px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }
}

.dialog-item {
  margin: 20px 0;

  > p {
    margin-bottom: 10px;
  }
}
</style>
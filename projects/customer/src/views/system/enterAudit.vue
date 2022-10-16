<template>
  <basic-container>
    <div class="handle-box">
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.name"
        placeholder="商家名称"
        class="handle-input mr10"
      ></el-input>
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.phoneService"
        placeholder="商家电话"
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
          @click="handlePassAudit(scope.row)"
          >通过</el-button
        >
        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="handleRejectAudit(scope.row)"
          >驳回</el-button
        >
      </template>
    </avue-crud>
    <el-dialog
      title="入驻审批"
      :visible.sync="dialogFormVisible"
      append-to-body="true"
      width="30%"
    >
      <template v-if="passOrRejectStatus === 1">
        <p>平台佣金比例</p>
        <el-input
          placeholder="请输入平台佣金比例"
          maxlength="2"
          type="number"
          v-model="ratePlatform"
        >
          <template slot="append">%</template>
        </el-input>
      </template>
      <template v-if="passOrRejectStatus === 2">
        <p>驳回原因</p>
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="reasonBusiness"
        >
        </el-input>
      </template>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSetting">确定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, update } from "@/api/system/enterAudit";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showImgPrefix: this.$imgHead, //回显图片前缀
      storeId: "",
      statusAudit: -1,
      passOrRejectStatus: -1,
      ratePlatform: "",
      reasonBusiness: "",
      dialogFormVisible: false,
      form: {},
      loading: true,
      searchObj: {
        name: "",
        phoneService: "",
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
            label: "商家名称",
            prop: "name",
          },
          {
            label: "商家地址",
            prop: "fullAddress",
          },
          {
            label: "商家电话",
            prop: "phoneService",
          },
          {
            label: "商家编码",
            prop: "code",
          },
          {
            label: "申请人",
            prop: "proposerName",
          },
          {
            label: "申请人电话",
            prop: "proposerPhone",
          },
          {
            label: "商家定位",
            prop: "type",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "夜店",
                value: 1,
              },
              {
                label: "清吧",
                value: 2,
              },
              {
                label: "ktv",
                value: 3,
              },
            ],
          },
          {
            label: "平台佣金比例",
            prop: "ratePlatform",
          },
          {
            label: "法人",
            prop: "corporation",
          },
          {
            label: "统一社会认证编码",
            prop: "authentication",
          },
          {
            label: "商家logo",
            prop: "logo",
            type: "upload",
            listType: "picture-img",
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
    //通过审核
    handlePassAudit(row) {
      this.passOrRejectStatus = 1;
      this.storeId = row.id;
      this.statusAudit = 0;
      this.ratePlatform = row.ratePlatform;
      this.dialogFormVisible = true;
    },

    //驳回操作
    handleRejectAudit(row) {
      this.passOrRejectStatus = 2;
      this.storeId = row.id;
      this.statusAudit = 2;
      this.reasonBusiness = row.reasonBusiness;
      this.dialogFormVisible = true;
    },

    //确认驳回
    async submitSetting() {
      let data = {
        id: this.storeId,
        statusAudit: this.statusAudit,
      };

      //通过审核
      if (this.passOrRejectStatus === 1) {
        data.ratePlatform = this.ratePlatform;
        if (!data.ratePlatform || data.ratePlatform > 99.99) {
          this.$message.error("请输入正确的平台佣金比例");
          return;
        }
      }

      //驳回审核
      if (this.passOrRejectStatus === 2) {
        data.reasonBusiness = this.reasonBusiness;
      }

      const res = await update(data);
      if (res.data.code === 200) {
        this.$message.success("修改成功");
        this.dialogFormVisible = false;
        this.onLoad(this.page);
      }
    },

    //点击搜索后的操作
    handleSearch(page) {
      page.currentPage = 1;
      this.onLoad(page);
    },

    //页面变化后
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    //每页数据条数发生变化后
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    //获取分页数据
    onLoad(page) {
      this.loading = true;
      let statusAudit = 1;
      getList(
        page.currentPage,
        page.pageSize,
        this.searchObj,
        statusAudit
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        //回显时给图片加上前缀
        this.data.forEach((item) => {
          item.logo = this.showImgPrefix + item.logo;
        });
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
</style>
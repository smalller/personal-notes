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
          @click="handlePassAudit(scope.row.id, scope.row.statusBusiness)"
          >通过</el-button
        >
        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="handleRejectAudit(scope.row.id, scope.row.statusBusiness)"
          >驳回</el-button
        >
      </template>
    </avue-crud>

    <el-dialog
      title="驳回原因"
      :visible.sync="dialogFormVisible"
      append-to-body="true"
      width="30%"
    >
      <p>驳回原因</p>
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入内容"
        v-model="reasonBusiness"
      >
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSetting">确定</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, update } from "@/api/system/issuedAudit";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showImgPrefix: this.$imgHead, //回显图片前缀

      storeId: "",
      statusBusiness: -1,
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
            label: "商家申请",
            prop: "statusBusiness",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "申请上架",
                value: 0,
              },
              {
                label: "申请下架",
                value: 1,
              },
              {
                label: "下架审核中",
                value: 10,
              },
              {
                label: "上架审核中",
                value: 11,
              },
            ],
          },
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
            label: "商家状态",
            prop: "statusBusiness",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "下架",
                value: 0,
              },
              {
                label: "上架",
                value: 1,
              },
              {
                label: "下架审核中",
                value: 10,
              },
              {
                label: "上架审核中",
                value: 11,
              },
            ],
          },
          {
            label: "商家logo",
            prop: "logo",
            type: "upload",
            listType: "picture-img",
          },
          {
            label: "申请时间",
            prop: "updateTime",
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
    handlePassAudit(id, status) {
      let statusBusiness = -1;
      if (status == 10) {
        statusBusiness = 0;
      }
      if (status == 11) {
        statusBusiness = 1;
      }
      let data = {
        id,
        statusBusiness,
      };
      this.$confirm("确认通过审核此吗?", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await update(data);
          if (res.data.code === 200) {
            this.$message.success("审核成功");
            this.onLoad(this.page);
          }
        })
        .catch(() => {});
    },

    //驳回操作
    handleRejectAudit(id, status) {
      this.reasonBusiness = "";
      this.storeId = id;
      if (status == 10) {
        this.statusBusiness = 1;
      }
      if (status == 11) {
        this.statusBusiness = 0;
      }
      this.dialogFormVisible = true;
    },

    //确认驳回
    async submitSetting() {
      let data = {
        id: this.storeId,
        statusBusiness: this.statusBusiness,
        reasonBusiness: this.reasonBusiness,
      };
      const res = await update(data);
      if (res.data.code === 200) {
        this.$message.success("修改成功");
        this.dialogFormVisible = false;
        this.onLoad(this.page);
      }
    },

    //点击搜索后的操作
    handleSearch(page, searchObj) {
      page.currentPage = 1;
      this.onLoad(page, searchObj);
    },

    //页面变化后
    currentChange(currentPage) {
      this.searchObj = {
        name: "",
        phoneService: "",
      };
      this.page.currentPage = currentPage;
    },

    //每页数据条数发生变化后
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    //获取分页数据
    onLoad(page, searchObj = {}) {
      this.loading = true;
      let statusBusinesses = "10,11";
      getList(
        page.currentPage,
        page.pageSize,
        searchObj,
        statusBusinesses
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
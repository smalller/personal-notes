<template>
  <basic-container>
    <div class="handle-box">
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.name"
        placeholder="活动名称"
        class="handle-input mr10"
      ></el-input>
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.storeName"
        placeholder="商家名称"
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
        v-model="reason"
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
import { getList, update } from "@/api/system/activityAudit";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showImgPrefix: this.$imgHead, //回显图片前缀
      storeId: "",
      reason: "",
      dialogFormVisible: false,
      form: {},
      loading: true,
      searchObj: {
        name: "",
        storeName: "",
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
            label: "活动名称",
            prop: "name",
          },
          {
            label: "活动简介",
            prop: "description",
          },
          {
            label: "活动链接",
            prop: "link",
          },
          {
            label: "活动开始时间",
            prop: "timeStart",
          },
          {
            label: "活动结束时间",
            prop: "timeEnd",
          },
          {
            label: "活动类型",
            prop: "type",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "店铺活动",
                value: 1,
              },
              {
                label: "音乐节",
                value: 2,
              },
              {
                label: "平台活动",
                value: 3,
              },
            ],
          },
          {
            label: "商家名称",
            prop: "storeName",
          },
          {
            label: "活动缩略图",
            prop: "thumb",
            type: "upload",
            listType: "picture-img",
          },
          {
            label: "活动长图",
            prop: "banner",
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
      let data = {
        id: row.id,
        audit: 3,
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
    handleRejectAudit(row) {
      this.storeId = row.id;
      this.reason = row.reason;
      this.dialogFormVisible = true;
    },

    //确认驳回
    async submitSetting() {
      let data = {
        id: this.storeId,
        audit: 2,
        reason: this.reason,
      };
      const res = await update(data);
      if (res.data.code === 200) {
        this.$message.success("驳回成功");
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
      let audit = 1;
      getList(page.currentPage, page.pageSize, this.searchObj, audit).then(
        (res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          //回显时给图片加上前缀
          this.data.forEach((item) => {
            item.thumb = this.showImgPrefix + item.thumb;
            item.banner = this.showImgPrefix + item.banner;
          });
          this.loading = false;
        }
      );
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
<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               v-model="form"
               ref="crud"
               @row-update="rowUpdate"
               @row-save="rowSave"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="danger"
                   size="small"
                   icon="el-icon-delete"
                   plain
                   v-if="permission.lottery_delete"
                   @click="handleDelete">删 除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
  import {getList, getDetail, add, update, remove} from "@/api/system/lottery";
  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0
        },
        selectionList: [],
        option: {
          height:'auto',
          calcHeight: 30,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          dialogClickModal: false,
          column: [
            {
              label: "抽奖主题",
              prop: "theme",
              rules: [{
                required: true,
                message: "请输入抽奖主题",
                trigger: "blur"
              }]
            },
            {
              label: "抽奖说明",
              prop: "explain",
              rules: [{
                required: true,
                message: "请输入抽奖说明",
                trigger: "blur"
              }]
            },
            {
              label: "奖池说明",
              prop: "prizeExplain",
              rules: [{
                required: true,
                message: "请输入奖池说明",
                trigger: "blur"
              }]
            },
            {
              label: "抽奖的开始时间",
              prop: "timeStart",
              rules: [{
                required: true,
                message: "请输入抽奖的开始时间",
                trigger: "blur"
              }]
            },
            {
              label: "抽奖的结束时间",
              prop: "timeEnd",
              rules: [{
                required: true,
                message: "请输入抽奖的结束时间",
                trigger: "blur"
              }]
            },
            {
              label: "承办抽奖的商家ID",
              prop: "storeId",
              rules: [{
                required: true,
                message: "请输入承办抽奖的商家ID",
                trigger: "blur"
              }]
            },
            {
              label: "承办抽奖的商家名",
              prop: "storeName",
              rules: [{
                required: true,
                message: "请输入承办抽奖的商家名",
                trigger: "blur"
              }]
            },
            {
              label: "客服电话",
              prop: "serviceTel",
              rules: [{
                required: true,
                message: "请输入客服电话",
                trigger: "blur"
              }]
            },
            {
              label: "抽奖登录账号",
              prop: "loginName",
              rules: [{
                required: true,
                message: "请输入抽奖登录账号",
                trigger: "blur"
              }]
            },
            {
              label: "抽奖登录密码",
              prop: "loginPassword",
              rules: [{
                required: true,
                message: "请输入抽奖登录密码",
                trigger: "blur"
              }]
            },
            {
              label: "抽奖宣传图",
              prop: "appImage",
              rules: [{
                required: true,
                message: "请输入抽奖宣传图",
                trigger: "blur"
              }]
            },
            {
              label: "app列表图",
              prop: "appListImage",
              rules: [{
                required: true,
                message: "请输入app列表图",
                trigger: "blur"
              }]
            },
          ]
        },
        data: []
      };
    },
    computed: {
      ...mapGetters(["permission"]),
      permissionList() {
        return {
          addBtn: this.vaildData(this.permission.lottery_add, false),
          viewBtn: this.vaildData(this.permission.lottery_view, false),
          delBtn: this.vaildData(this.permission.lottery_delete, false),
          editBtn: this.vaildData(this.permission.lottery_edit, false)
        };
      },
      ids() {
        let ids = [];
        this.selectionList.forEach(ele => {
          ids.push(ele.id);
        });
        return ids.join(",");
      }
    },
    methods: {
      rowSave(row, done, loading) {
        add(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          window.console.log(error);
        });
      },
      rowUpdate(row, index, done, loading) {
        update(row).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          done();
        }, error => {
          loading();
          console.log(error);
        });
      },
      rowDel(row) {
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(row.id);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      },
      handleDelete() {
        if (this.selectionList.length === 0) {
          this.$message.warning("请选择至少一条数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            return remove(this.ids);
          })
          .then(() => {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.$refs.crud.toggleSelection();
          });
      },
      beforeOpen(done, type) {
        if (["edit", "view"].includes(type)) {
          getDetail(this.form.id).then(res => {
            this.form = res.data.data;
          });
        }
        done();
      },
      searchReset() {
        this.query = {};
        this.onLoad(this.page);
      },
      searchChange(params, done) {
        this.query = params;
        this.page.currentPage = 1;
        this.onLoad(this.page, params);
        done();
      },
      selectionChange(list) {
        this.selectionList = list;
      },
      selectionClear() {
        this.selectionList = [];
        this.$refs.crud.toggleSelection();
      },
      currentChange(currentPage){
        this.page.currentPage = currentPage;
      },
      sizeChange(pageSize){
        this.page.pageSize = pageSize;
      },
      refreshChange() {
        this.onLoad(this.page, this.query);
      },
      onLoad(page, params = {}) {
        this.loading = true;
        getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }
    }
  };
</script>

<style>
</style>

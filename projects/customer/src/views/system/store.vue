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
        v-model.trim="searchObj.phoneOwner"
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
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
      :upload-after="uploadAfter"
      :upload-error="uploadError"
    >
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="handleStore(scope.row.id, scope.row.statusBusiness, 1)"
          :disabled="
            scope.row.statusBusiness == 10 || scope.row.statusBusiness == 11
          "
          >{{ scope.row.statusBusiness | statusBusiness }}</el-button
        >

        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="handleStore(scope.row.id, scope.row.statusRecommend, 2)"
          :disabled="
            scope.row.statusRecommend == 10 || scope.row.statusRecommend == 11
          "
          >{{ scope.row.statusRecommend | statusRecommend }}</el-button
        >
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { getList, add, update, remove } from "@/api/system/store";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showImgPrefix: this.$imgHead, //回显图片前缀
      form: {},
      query: {},
      loading: true,
      searchObj: {
        name: "",
        phoneOwner: "",
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
        dialogClickModal: false,
        column: [
          {
            label: "商家名称",
            prop: "name",
            rules: [
              {
                required: true,
                message: "请输入商家名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "商家电话",
            prop: "phoneOwner",
            editDisabled: true,
            rules: [
              {
                required: true,
                message: "请输入商家电话",
                trigger: "blur",
              },
            ],
          },
          {
            label: "商家编码",
            prop: "code",
            display: false,
          },
          {
            label: "申请人",
            prop: "proposerName",
            rules: [
              {
                required: true,
                message: "请输入申请人姓名",
                trigger: "blur",
              },
            ],
          },
          {
            label: "申请人电话",
            prop: "proposerPhone",
            rules: [
              {
                required: true,
                message: "请输入申请人电话",
                trigger: "blur",
              },
            ],
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
            rules: [
              {
                required: true,
                message: "请选择商家定位",
                trigger: "change",
              },
            ],
          },
          {
            label: "品质状态",
            prop: "statusQuality",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "默认",
                value: 0,
              },
              {
                label: "品质商家",
                value: 1,
              },
              {
                label: "连锁品牌",
                value: 2,
              },
              {
                label: "至臻悦享",
                value: 3,
              },
              {
                label: "舒适闲逸",
                value: 4,
              },
            ],
            rules: [
              {
                required: true,
                message: "请选择品质状态",
                trigger: "change",
              },
            ],
          },
          {
            label: "平台佣金比例",
            prop: "ratePlatform",
            rules: [
              {
                required: true,
                message: "请输入平台佣金比例",
                trigger: "blur",
              },
            ],
          },
          {
            label: "法人",
            prop: "corporation",
            rules: [
              {
                required: true,
                message: "请输入法人名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "统一社会认证编码",
            prop: "authentication",
            rules: [
              {
                required: true,
                message: "请输入统一社会认证编码",
                trigger: "blur",
              },
            ],
          },
          {
            label: "商家logo",
            prop: "logo",
            type: "upload",
            display: false,
          },
          {
            label: "打印机打印样式",
            prop: "printerStyle",
            type: "radio",
            border: false,
            dicData: [
              {
                label: "默认",
                value: 0,
              },
              {
                label: "样式一",
                value: 1,
              },
              {
                label: "样式二",
                value: 2,
              },
            ],
            rules: [
              {
                required: true,
                message: "请选择打印机打印样式",
                trigger: "change",
              },
            ],
          },
          {
            label: "打印机编号",
            prop: "printerCode",
          },
          {
            label: "商家权重",
            prop: "weight",
            rules: [
              {
                required: true,
                message: "请输入商家权重",
                trigger: "blur",
              },
            ],
          },
          {
            label: "顾客回馈比例",
            prop: "rateCustomer",
            rules: [
              {
                required: true,
                message: "请输入顾客回馈比例",
                trigger: "blur",
              },
            ],
          },
          {
            label: "营业执照",
            prop: "license",
            type: "upload",
            listType: "picture-img",
            action: "/api/blade-resource/oss/jz/put-file",
            propsHttp: {
              res: "data",
            },
            rules: [
              {
                required: true,
                message: "请上传营业执照",
                trigger: "blur",
              },
            ],
          },
          {
            label: "门店室内照片",
            prop: "photoIndoor",
            type: "upload",
            listType: "picture-img",
            action: "/api/blade-resource/oss/jz/put-file",
            propsHttp: {
              res: "data",
            },
            rules: [
              {
                required: true,
                message: "请上传门店室内照片",
                trigger: "blur",
              },
            ],
          },
          {
            label: "门店室外照片",
            prop: "photoOutdoor",
            type: "upload",
            listType: "picture-img",
            action: "/api/blade-resource/oss/jz/put-file",
            propsHttp: {
              res: "data",
            },
            rules: [
              {
                required: true,
                message: "请上传门店室外照片",
                trigger: "blur",
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
        addBtn: this.vaildData(this.permission.store_add, false),
        viewBtn: this.vaildData(this.permission.store_view, false),
        delBtn: this.vaildData(this.permission.store_delete, false),
        editBtn: this.vaildData(this.permission.store_edit, false),
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
    //禁用启用店铺/推荐位设置
    handleStore(id, status, index) {
      let statusBusiness = -1,
        statusRecommend = -1,
        txt = "",
        data = {};

      //启用禁用
      if (index === 1) {
        if (status == 0) {
          statusBusiness = 1;
          txt = "确认要启用此商家吗?";
        }
        if (status == 1) {
          statusBusiness = 0;
          txt = "确认要禁用此商家吗?";
        }

        data = {
          id,
          statusBusiness,
        };
      }

      //推荐位操作
      if (index === 2) {
        if (status == 0) {
          statusRecommend = 1;
          txt = "确认要设为推荐位吗?";
        }
        if (status == 1) {
          statusRecommend = 0;
          txt = "确认要解除推荐位吗?";
        }

        data = {
          id,
          statusRecommend,
        };
      }

      this.$confirm(txt, "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await update(data);
          if (res.data.code === 200) {
            this.$message.success("操作成功");
            this.onLoad(this.page);
          }
        })
        .catch(() => {});
    },

    //点击搜索后的操作
    handleSearch(page) {
      page.currentPage = 1;
      this.onLoad(page);
    },

    //上传完图片后的操作
    uploadAfter(res, done) {
      res.url = this.showImgPrefix + res.name; //给上传完的图片添加上前缀
      done(res);
    },

    //图片上传失败时
    uploadError() {
      this.$message.error("上传失败");
    },

    //新增数据
    rowSave(row, done, loading) {
      delete row.logo;
      delete row.code;

      //提交数据前要将前缀去掉
      let licenseIndex = row.license.indexOf("fileName=");
      let photoIndoorIndex = row.photoIndoor.indexOf("fileName=");
      let photoOutdoorIndex = row.photoOutdoor.indexOf("fileName=");

      row.license = row.license.substr(licenseIndex + 9);
      row.photoIndoor = row.photoIndoor.substr(photoIndoorIndex + 9);
      row.photoOutdoor = row.photoOutdoor.substr(photoOutdoorIndex + 9);

      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          window.console.log(error);
        }
      );
    },

    //修改数据
    rowUpdate(row, index, done, loading) {
      console.log("xxxx", row);
      delete row.logo;

      //提交数据前要将前缀去掉
      let licenseIndex = row.license.indexOf("fileName=");
      let photoIndoorIndex = row.photoIndoor.indexOf("fileName=");
      let photoOutdoorIndex = row.photoOutdoor.indexOf("fileName=");

      row.license = row.license.substr(licenseIndex + 9);
      row.photoIndoor = row.photoIndoor.substr(photoIndoorIndex + 9);
      row.photoOutdoor = row.photoOutdoor.substr(photoOutdoorIndex + 9);

      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          loading();
          console.log(error);
        }
      );
    },

    //删除数据
    rowDel(row) {
      this.$confirm("确定删除该店铺?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "删除成功",
          });
        });
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
      getList(page.currentPage, page.pageSize, this.searchObj).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        //回显时给图片加上前缀
        this.data.forEach((item) => {
          item.logo = this.showImgPrefix + item.logo;
          item.license = this.showImgPrefix + item.license;
          item.photoIndoor = this.showImgPrefix + item.photoIndoor;
          item.photoOutdoor = this.showImgPrefix + item.photoOutdoor;
        });
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.handle-box {
  margin-bottom: 10px;
  .handle-input {
    width: 170px;
    display: inline-block;
  }

  .mr10 {
    margin-right: 10px;
  }
}
</style>
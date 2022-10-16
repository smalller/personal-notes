<template>
  <basic-container>
    <!-- 头部模块 -->
    <div class="handle-box">
      <el-button class="mr10" type="primary" @click="handleAdd">新增</el-button>
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.userName"
        placeholder="客户姓名"
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
      ref="crud"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          icon="el-icon-view"
          @click="handleView(scope.row)"
          >存酒列表</el-button
        >
        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="hadnleEdit(scope.row)"
          >编辑</el-button
        >
        <el-button
          type="text"
          icon="el-icon-s-operation"
          @click="handleFetch(scope.row)"
          >取酒</el-button
        >
      </template>
    </avue-crud>

    <!-- 新增/编辑存酒弹窗 -->
    <el-dialog
      append-to-body="true"
      :visible.sync="dialog2"
      title="存酒信息"
      @close="hadnleClose"
    >
      <div class="top-box">
        <div>
          <span>客户姓名：</span>
          <el-input v-model="form.userName"></el-input>
        </div>
        <div>
          <span>手机号码：</span>
          <el-input v-model="form.phone" maxlength="11"></el-input>
        </div>
        <div>
          <span>存酒期限：</span>
          <el-input v-model="form.duration" type="number" min="1">
            <template slot="append">天</template>
          </el-input>
        </div>
      </div>

      <div class="middle-box">
        <!-- 回显酒水 -->
        <div v-for="(item, index) in form.stockDetails" :key="index">
          <div>
            <span>酒水：</span>
            <el-input
              v-if="'id' in item"
              readonly
              :value="item.goodsName"
              style="width: 215px"
            >
            </el-input>
            <el-input
              v-else
              style="width: 215px"
              v-model="item.goodsName.split('_')[1]"
              readonly
            ></el-input>
          </div>
          <div>
            <span>剩余数量：</span>
            <el-input
              v-model="item.num"
              type="number"
              min="0"
              placeholder="例：1.5为剩余一瓶半"
            ></el-input>
          </div>
          <div>
            <el-button type="danger" @click="delDrinks(item)">删除</el-button>
          </div>
        </div>
        <!-- 新增酒水 -->
        <div>
          <div>
            <span>酒水：</span>
            <el-select
              v-model="drinkObj.goodsName"
              placeholder="请选择"
              @focus="selectGoodsList"
              filterable
            >
              <el-option
                v-for="i in selGoodsList"
                :key="i.id"
                :label="i.name"
                :value="i.id + '_' + i.name"
              >
              </el-option>
            </el-select>
          </div>
          <div>
            <span>剩余数量：</span>
            <el-input
              v-model="drinkObj.num"
              type="number"
              min="0.1"
              placeholder="例：1.5为剩余一瓶半"
            ></el-input>
          </div>
          <div>
            <el-button type="primary" @click="addDrinks">添加</el-button>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="hadnleClose">取消</el-button>
        <el-button type="primary" @click="handleSureEdit">确定</el-button>
      </span>
    </el-dialog>

    <!-- 查看存酒列表弹窗 -->
    <el-dialog append-to-body="true" :visible.sync="dialog1" title="存酒列表">
      <el-table
        border
        ref="multipleTable"
        :data="drinksList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="ID" fixed type="index"></el-table-column>
        <el-table-column prop="goodsName" label="名称"> </el-table-column>
        <el-table-column prop="num" label="数量"></el-table-column>
        <el-table-column prop="dueDay" label="到期剩余天数"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog1 = false">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDrinksList,
  getGoodsList,
  add,
  update,
  takeWine,
} from "@/api/store/userstock";

export default {
  data() {
    return {
      dialog1: false,
      dialog2: false,
      form: {
        duration: "",
        inventoryDate: this.$regular.timeData(new Date(), 2),
        phone: "",
        userName: "",
        stockDetails: [],
      },
      selGoodsList: [],
      antiStatus: true,
      isUpdate: true,

      loading: true,
      drinksList: [],
      drinkObj: {
        goodsName: "",
        num: "",
      },
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      searchObj: {
        userName: "",
        phone: "",
      },
      option: {
        refreshBtn: false,
        showColumn: false,
        columnBtn: false,
        showBorder: true,
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchMenuSpan: 6,
        border: true,
        index: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: "客户姓名",
            prop: "userName",
          },
          {
            label: "手机号码",
            prop: "phone",
          },
          {
            label: "存酒时间",
            prop: "inventoryDate",
          },
        ],
      },
      data: [],
    };
  },

  methods: {
    // 获取可选择的存酒列表
    async selectGoodsList() {
      if (this.antiStatus === true) {
        this.antiStatus = false;
        const res = await getGoodsList();
        if (res.data.code === 200) {
          this.selGoodsList = res.data.data;
          this.antiStatus = true;
        }
      }
    },

    //添加存酒
    addDrinks() {
      if (!this.drinkObj.goodsName) {
        this.$message.error("请选择酒水");
      } else if (!this.drinkObj.num) {
        this.$message.error("请输入存酒数量");
      } else {
        let drinkObj = Object.assign({}, this.drinkObj);
        this.form.stockDetails.push(drinkObj);
        this.drinkObj = {
          goodsName: "",
          num: "",
        };
      }
    },

    //删除存酒
    delDrinks(item) {
      const index = this.form.stockDetails.indexOf(item);
      if (index !== -1) {
        this.form.stockDetails.splice(index, 1);
      }
    },

    //确认编辑存酒信息
    async handleSureEdit() {
      if (this.form.userName === "") {
        this.$message.error("请输入客户姓名");
        return;
      } else if (this.form.phone === "" || this.form.phone.length !== 11) {
        this.$message.error("请输入正确的手机号码");
        return;
      } else if (this.form.duration === "" || this.form.duration < 1) {
        this.$message.error("请输入正确的存酒期限");
        return;
      } else if (this.form.stockDetails.length === 0) {
        this.$message.error("请选择要存的酒水");
        return;
      } else {
        const res = this.form.stockDetails.some((item) => item.num <= 0);
        if (res) {
          this.$message.error("酒水剩余数量不能小于0");
          return;
        }

        if (this.isUpdate === false) {
          const res = await add(this.form);
          if (res.data.code === 200) {
            this.onLoad(this.page);
            this.$message.success("新增成功");
            this.dialog2 = false;
          }
        } else {
          const res = await update(this.form);
          if (res.data.code === 200) {
            this.onLoad(this.page);
            this.$message.success("修改成功");
            this.dialog2 = false;
          }
        }
      }
    },

    //新增存酒
    handleAdd() {
      this.isUpdate = false;
      this.dialog2 = true;
    },

    //编辑存酒回显相关信息
    async hadnleEdit(row) {
      this.isUpdate = true;
      const res = await getDrinksList(row.id);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.dialog2 = true;
      }
    },

    //取消编辑
    hadnleClose() {
      this.dialog2 = false;
      this.form = {
        duration: "",
        inventoryDate: this.$regular.timeData(new Date(), 2),
        phone: "",
        userName: "",
        stockDetails: [],
      };
      this.drinkObj = {
        goodsName: "",
        num: "",
      };
    },

    //取酒
    handleFetch(row) {
      this.$confirm("确认要取酒操作吗？", "提示", {
        type: "warning",
      })
        .then(async () => {
          const res = await takeWine(row.id);
          if (res.data.code === 200) {
            this.onLoad(this.page);
            this.$message.success("取酒成功");
          }
        })
        .catch(() => {});
    },

    //查看存酒列表
    async handleView(row) {
      const res = await getDrinksList(row.id);
      if (res.data.code === 200) {
        this.drinksList = res.data.data.stockDetails;
        this.dialog1 = true;
      }
    },

    //点击搜索后的操作
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

.top-box {
  display: flex;
  align-items: center;
  margin-bottom: 60px;

  > div {
    display: flex;
    align-items: center;
    margin-right: 40px;

    > span {
      width: 100px;
    }
  }
}

.middle-box {
  > div {
    display: flex;
    align-items: center;
    margin-bottom: 20px;

    > div {
      display: flex;
      align-items: center;
      margin-right: 40px;

      > span {
        width: 100px;
      }
    }
  }
}
</style>

<template>
  <basic-container>
    <!-- 头部模块 -->
    <div class="handle-box">
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.name"
        placeholder="用户昵称"
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
      <template slot="isMemberCard" slot-scope="scope">
        <span>{{ scope.row.isMemberCard | yesOrNo }}</span>
      </template>
      <template slot="isCollect" slot-scope="scope">
        <span>{{ scope.row.isCollect | yesOrNo }}</span>
      </template>
      <template slot="sex" slot-scope="scope">
        <span>{{ scope.row.sex | sex }}</span>
      </template>

      <template slot="menu" slot-scope="scope">
        <el-button
          type="text"
          icon="el-icon-view"
          @click="handleView(scope.row.userId)"
          >查看</el-button
        >
      </template>
    </avue-crud>

    <!-- 查看用户信息 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      append-to-body="true"
      title="用户信息"
    >
      <div class="basic-info-user-info">
        <div>
          <p>
            <span>昵称：</span>
            <span>{{ form.name }}</span>
          </p>
          <p>
            <span>性别：</span>
            <span>{{ form.sex | sex }}</span>
          </p>
        </div>
        <div>
          <p>
            <span>是否收藏本店：</span>
            <span>{{ form.isCollect | yesOrNo }}</span>
          </p>
          <p>
            <span>累计消费：</span>
            <span>{{ form.consumeMoney }}</span>
          </p>
          <p>
            <span>最后消费时间：</span>
            <span>{{ form.lastConsumeTime }}</span>
          </p>
        </div>
      </div>
      <el-table
        border
        ref="multipleTable"
        :data="userDetailConList"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column label="ID" fixed type="index"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="consumeMoney" label="消费金额"></el-table-column>
        <el-table-column prop="createTime" label="消费日期"></el-table-column>
        <el-table-column label="订单状态">
          <template slot-scope="scope">
            <span>{{ scope.row.orderStatusStr }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="getOrderDetail(scope.row.orderId)"
              >查看订单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 查看订单 -->
    <el-dialog
      :visible.sync="dialogFormVisible2"
      append-to-body="true"
      title="订单信息"
      width="70%"
    >
      <order-detail :orderDetailInfo="orderDetailInfo" :isHasGetTable="false" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible2 = false"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getOrderList, getOrderDetail } from "@/api/store/customer";
import orderDetail from "@/components/order-detail/order-detail";

export default {
  components: {
    orderDetail,
  },

  data() {
    return {
      userDetailConList: [], //用户的消费记录
      orderDetailInfo: {}, //当前消费记录对应的订单详情
      dialogFormVisible: false,
      dialogFormVisible2: false,
      searchObj: {
        name: "",
      },
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
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
            label: "用户昵称",
            prop: "name",
          },
          {
            label: "性别",
            prop: "sex",
            slot: true,
          },
          {
            label: "是否为会员",
            prop: "isMemberCard",
          },
          {
            label: "累计消费",
            prop: "consumeMoney",
          },
          {
            label: "最后一次消费时间",
            prop: "lastConsumeTime",
          },
          {
            label: "是否收藏本店",
            prop: "isCollect",
          },
        ],
      },
      data: [],
      form: {},
    };
  },

  methods: {
    onLoad(page) {
      this.loading = true;
      getList(page.currentPage, page.pageSize, this.searchObj).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },

    //获取消费记录对应的订单详情
    async getOrderDetail(orderId) {
      const { data: res } = await getOrderDetail(orderId);
      if (res.code === 200) {
        this.orderDetailInfo = res.data;
        this.dialogFormVisible2 = true;
      }
    },

    //查看详情
    handleView(userId) {
      this.data.forEach((item) => {
        if (item.userId === userId) {
          this.form = item;
          this.dialogFormVisible = true;
        }
      });
      this.getOrderList(userId);
    },

    //获取用户的消费记录
    async getOrderList(userId) {
      const { data: res } = await getOrderList(userId);
      if (res.code === 200) {
        this.userDetailConList = res.data;
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

.basic-info-user-info {
  div {
    display: flex;

    p {
      margin-bottom: 20px;
      display: flex;
      min-width: 260px;

      span:first-child {
        display: block;
        min-width: 80px;
      }
    }
  }
}
</style>

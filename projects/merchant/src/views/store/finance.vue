<template>
  <basic-container>
    <!-- 头部模块 -->
    <div class="handle-box">
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.phone"
        placeholder="预定手机"
        class="handle-input mr10"
      ></el-input>
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.orderNo"
        placeholder="订单号"
        class="handle-input mr10"
      ></el-input>
      <el-date-picker
        class="mr10"
        v-model="searchTime"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>

      <el-button
        type="primary"
        icon="el-icon-search"
        @click="handleSearch(page, searchObj)"
        >搜索</el-button
      >
    </div>

    <div class="order-info">
      <ul>
        <li>
          <span>订单数量：</span><span>{{ countInfo.orderNum || 0 }}</span>
        </li>
        <li>
          <span>实付总金额：</span><span>{{ countInfo.paidMoney || 0 }}</span>
        </li>
        <li>
          <span>应收总金额：</span
          ><span>{{ countInfo.payableMoney || 0 }}</span>
        </li>
        <li>
          <span>实收总金额：</span
          ><span>{{ countInfo.receiptsMoney || 0 }}</span>
        </li>
        <li>
          <span>佣金金额：</span><span></span
          >{{ countInfo.commissionMoney || 0 }}
        </li>
      </ul>
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
      <template slot="payWay" slot-scope="scope">
        <span>{{ scope.row.payWay }}</span>
      </template>

      <template slot="menu" slot-scope="scope">
        <el-button type="primary" @click="handleView(scope.row.id)">
          查看详情
        </el-button>
      </template>
    </avue-crud>

    <!-- 查看订单 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      append-to-body="true"
      title="订单信息"
      width="70%"
    >
      <order-detail :orderDetailInfo="orderDetailInfo" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getDetail, getFinanceCount } from "@/api/store/finance";
import orderDetail from "@/components/order-detail/order-detail";

export default {
  components: {
    orderDetail,
  },

  data() {
    return {
      dialogFormVisible: false,
      orderDetailInfo: {},

      searchTime: "",
      searchObj: {
        phone: "",
        orderNo: "",
        timeStart: this.searchTime
          ? this.$regular.timeData(this.searchTime[0], 2)
          : "",
        timeEnd: this.searchTime
          ? this.$regular.timeData(this.searchTime[1], 2)
          : "",
      },

      countInfo: {},

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
        border: true,
        index: true,
        viewBtn: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        column: [
          {
            label: "订单编号",
            prop: "orderNo",
          },
          {
            label: "订单原价",
            prop: "moneyPayable",
          },
          {
            label: "订单现价",
            prop: "moneyReceipts",
          },
          {
            label: "实付金额",
            prop: "moneyPaid",
          },
          {
            label: "优惠券折扣",
            prop: "moneyDiscount",
          },
          {
            label: "支付方式",
            prop: "payWay",
          },
          {
            label: "支付时间",
            prop: "timePay",
          },
        ],
      },
      data: [],
    };
  },

  methods: {
    //查看订单详情
    async handleView(id) {
      const { data: res } = await getDetail(id);
      if (res.code === 200) {
        this.orderDetailInfo = res.data;
        this.dialogFormVisible = true;
      }
    },

    //请求列表信息
    onLoad(page) {
      this.loading = true;
      this.searchObj.timeStart = this.searchTime
        ? this.$regular.timeData(this.searchTime[0], 2)
        : "";
      this.searchObj.timeEnd = this.searchTime
        ? this.$regular.timeData(this.searchTime[1], 2)
        : "";
      getList(page.currentPage, page.pageSize, this.searchObj)
        .then((res) => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
        })
        .then(() => {
          getFinanceCount(this.searchObj).then((res) => {
            if (res.data.code === 200) {
              this.countInfo = res.data.data;
            }
          });
        });
    },

    //点击搜索后的操作
    handleSearch(page) {
      page.currentPage = 1;
      this.onLoad(page);
    },

    //页码发生变化
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    //每页展示条数发生变化
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
  },
};
</script>

<style lang="scss" scoped>
.order-info {
  > ul {
    margin-top: 40px;

    display: flex;
    > li {
      margin-right: 70px;
    }
  }
}

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

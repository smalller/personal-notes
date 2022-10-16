<template>
  <basic-container>
    <div class="handle-box">
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.storeName"
        placeholder="商家名称"
        class="handle-input mr10"
      ></el-input>
      <el-input
        clearable
        @keydown.13.native="handleSearch(page, searchObj)"
        v-model.trim="searchObj.consumerPhone"
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
      <el-select
        clearable
        v-model.trim="searchObj.statusOrder"
        placeholder="订单状态"
        class="handle-input mr10"
      >
        <el-option
          v-for="(item, index) in statusOrderArr"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        clearable
        v-model.trim="searchObj.typeOrder"
        placeholder="订单类型"
        class="handle-input mr10"
      >
        <el-option
          v-for="(item, index) in orderTypeArr"
          :key="index"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
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
      <template slot="typeOrder" slot-scope="scope">
        <span>{{ scope.row.typeOrder | typeOrder }}</span>
      </template>
      <template slot="payStatus" slot-scope="scope">
        <span>{{ scope.row.payStatus | payStatus }}</span>
      </template>
      <template slot="payWay" slot-scope="scope">
        <span>{{ scope.row.payWay }}</span>
      </template>
      <template slot="seatActualCode" slot-scope="scope">
        <span>{{ scope.row.seatActualCode }}</span>
      </template>
      <template slot="statusOrder" slot-scope="scope">
        <template v-if="scope.row.statusOrder == 6">
          <span v-if="scope.row.statusTrade == 2">已离店</span>
          <span v-else-if="scope.row.statusTrade == 3">已关闭</span>
        </template>
        <span v-else>{{ scope.row.statusOrder | statusOrder }}</span>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="primary" @click="handleView(scope.row.id)">
          查看
        </el-button>
        <el-button
          v-if="
            scope.row.payStatusStr !== '未支付' &&
            scope.row.statusOrder !== 0 &&
            scope.row.statusOrder !== 2
          "
          type="warning"
          @click="handleRefundAudit(scope.row)"
        >
          退款
        </el-button>
        <el-button
          v-if="scope.row.typeOrder == 1"
          type="primary"
          @click="handleViewShareOrderUserList(scope.row.id)"
        >
          查看拼单用户
        </el-button>
      </template>
    </avue-crud>

    <el-dialog
      :visible.sync="dialog1"
      title="拼单用户"
      append-to-body="true"
      width="40%"
    >
      <share-order-list :tableData="tableData" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog1 = false">确定</el-button>
      </span>
    </el-dialog>

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

    <el-dialog
      title="退款"
      :visible.sync="refundAuditDialog"
      append-to-body="true"
      width="80%"
    >
      <order-refund :refundOrderList="refundOrderList" />
    </el-dialog>
  </basic-container>
</template>

<script>
import { getList, getDetail, getCollageUsers } from "@/api/system/order";
import orderDetail from "@/components/order-detail/order-detail";
import shareOrderList from "@/components/share-order-list/share-order-list";
import orderRefund from "@/components/order-refund/order-refund";

export default {
  components: {
    orderDetail,
    shareOrderList,
    orderRefund,
  },

  mounted() {
    this.$root.$on("closeRefundAuditDialog", (res) => {
      this.onLoad(this.page);
      this.refundAuditDialog = res;
    });
  },

  data() {
    return {
      dialog1: false,
      tableData: [],
      dialogFormVisible: false,
      orderDetailInfo: {},
      refundAuditDialog: false,
      refundOrderList: [],

      searchTime: "",
      searchObj: {
        storeName: "",
        consumerPhone: "",
        orderNo: "",
        statusOrder: "",
        typeOrder: "",
        timeStart: this.searchTime
          ? this.$regular.timeData(this.searchTime[0], 2)
          : "",
        timeEnd: this.searchTime
          ? this.$regular.timeData(this.searchTime[1], 2)
          : "",
      },

      statusOrderArr: [
        {
          label: "待支付",
          value: "0",
        },
        {
          label: "已接单",
          value: "1",
        },
        {
          label: "已拒绝",
          value: "2",
        },
        {
          label: "未到店",
          value: "3",
        },
        {
          label: "已到店",
          value: "4",
        },
        {
          label: "有追单",
          value: "5",
        },
        {
          label: "已离店",
          value: "6",
        },
        {
          label: "退款中",
          value: "7",
        },
        {
          label: "待接单",
          value: "8",
        },
      ],

      orderTypeArr: [
        {
          label: "预定桌",
          value: "0",
        },
        {
          label: "AA拼单",
          value: "1",
        },
        {
          label: "会员卡",
          value: "3",
        },
        {
          label: "线下添单",
          value: "4",
        },
      ],

      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        menuWidth: 260,
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
            label: "商家名称",
            prop: "storeName",
          },
          {
            label: "订单编号",
            prop: "orderNo",
          },
          {
            label: "预订用户",
            prop: "consumerName",
          },
          {
            label: "订单发起人",
            prop: "createUserName",
          },
          {
            label: "预留手机号",
            prop: "consumerPhone",
          },
          {
            label: "订单类型",
            prop: "typeOrder",
            slot: true,
          },
          {
            label: "支付状态",
            prop: "payStatus",
            slot: true,
          },
          {
            label: "实付金额",
            prop: "moneyPaid",
          },
          {
            label: "商品原价",
            prop: "moneyOrigin",
          },
          {
            label: "优惠券",
            prop: "couponDetail",
          },
          {
            label: "订单发起时间",
            prop: "timeCreate",
          },
          {
            label: "订单结束时间",
            prop: "timeEnd",
          },
          {
            label: "支付时间",
            prop: "timePay",
          },
          {
            label: "支付类型",
            prop: "payWay",
            slot: true,
          },
          {
            label: "订单备注",
            prop: "consumerRemark",
          },
          {
            label: "实际座位号/包间名称",
            prop: "seatActualCode",
            slot: true,
          },
          {
            label: "订单状态",
            prop: "statusOrder",
            slot: true,
          },
        ],
      },
      data: [],
    };
  },

  methods: {
    handleCloseRefund() {
      this.onLoad(this.page);
    },

    async handleViewShareOrderUserList(id) {
      const res = await getCollageUsers(id);
      if (res.data.code === 200) {
        this.tableData = res.data.data;
        this.dialog1 = true;
      }
    },

    async handleView(id) {
      const { data: res } = await getDetail(id);
      if (res.code === 200) {
        this.orderDetailInfo = res.data;
        this.dialogFormVisible = true;
      }
    },

    handleRefundAudit(row) {
      this.refundOrderList = row.orderUserList;
      this.refundAuditDialog = true;
    },

    onLoad(page) {
      this.loading = true;
      this.searchObj.timeStart = this.searchTime
        ? this.$regular.timeData(this.searchTime[0], 2)
        : "";
      this.searchObj.timeEnd = this.searchTime
        ? this.$regular.timeData(this.searchTime[1], 2)
        : "";
      getList(page.currentPage, page.pageSize, this.searchObj).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
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

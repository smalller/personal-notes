<template>
  <basic-container>
    <div class="handle-box">
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
      <template slot="statusOrder" slot-scope="scope">
        <template v-if="scope.row.statusOrder == 6">
          <span v-if="scope.row.statusTrade == 2">已离店</span>
          <span v-else-if="scope.row.statusTrade == 3">已关闭</span>
        </template>
        <span
          v-else
          :class="scope.row.statusOrder == 5 ? 'has-add-order' : ''"
          >{{ scope.row.statusOrder | statusOrder }}</span
        >
      </template>
      <template slot="consumerPhone" slot-scope="scope">
        <el-link @click="getCustomerPhone(scope.row)" type="primary">{{
          scope.row.consumerPhone
        }}</el-link>
      </template>
      <template slot="seatActualCode" slot-scope="scope">
        <template v-if="scope.row.storeType === 3">
          <span>{{ scope.row.seatActualCode }}</span>
        </template>
        <template v-else>
          <el-link
            v-if="
              scope.row.statusOrder == 1 ||
              scope.row.statusOrder == 4 ||
              scope.row.statusOrder == 5 ||
              scope.row.statusOrder == 8
            "
            @click="editSeat(scope.row)"
            type="primary"
            >{{ scope.row.seatActualCode }}</el-link
          >
          <span v-else>{{ scope.row.seatActualCode }}</span>
        </template>
      </template>
      <template slot="menu" slot-scope="scope">
        <el-button type="primary" @click="handleView(scope.row.id)">
          查看
        </el-button>

        <template v-if="scope.row.statusOrder == 8">
          <el-button type="primary" @click="handleTakeOrder(scope.row)"
            >接单</el-button
          >
          <el-button type="danger" @click="handleRejectOrder(scope.row)"
            >拒单</el-button
          >
        </template>
        <template v-else-if="scope.row.statusOrder == 1">
          <el-button type="primary" @click="handleReachStore(scope.row)"
            >到店核销</el-button
          >
          <el-button type="warning" @click="handleRefund(scope.row)"
            >退款</el-button
          >
        </template>
        <template
          v-else-if="scope.row.statusOrder == 3 || scope.row.statusOrder == 7"
        >
          <el-button type="warning" @click="handleRefund(scope.row)"
            >退款</el-button
          >
        </template>
        <template v-else-if="scope.row.statusOrder == 4">
          <el-button type="warning" @click="handleCheckOut(scope.row)"
            >确认离店</el-button
          >
        </template>
      </template>
    </avue-crud>

    <el-dialog
      :visible.sync="dialogFormVisible"
      append-to-body="true"
      title="订单信息"
      width="70%"
    >
      <order-detail
        :orderDetailInfo="orderDetailInfo"
        :isHasGetTable="true"
        @closeDialog="closeDialog"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="到店核销"
      :visible.sync="reachStoreDialog"
      @close="handleCancelCode"
      append-to-body="true"
      width="30%"
    >
      <el-input
        v-model="reachStoreCode"
        type="number"
        placeholder="请输入验证码"
      ></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelCode">取消</el-button>
        <el-button type="primary" @click="sureReachStore">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="修改座位号"
      :visible.sync="seatDia"
      width="30%"
      append-to-body="true"
    >
      <el-select
        style="width: 100%"
        v-model="setSeatObj.actualSeatId"
        filterable
        remote
        clearable
        placeholder="请选择座位号"
      >
        <el-option
          v-for="(item, index) in selectSeatList"
          :key="index"
          :label="item.seatCode"
          :value="item.id"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="seatDia = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSeat">确定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="priNumberDialog"
      append-to-body="true"
      width="30%"
    >
      <h2 style="margin-bottom: 10px">用户动态号码请在2分钟内使用</h2>
      <h2>{{ priNumber }}</h2>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="priNumberDialog = false"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  getBookableSeatList,
  receive,
  reject,
  arrived,
  closed,
  updateSeatInfo,
  refund,
  refundAudit,
  getCustomerPhone,
} from "@/api/store/order";
import orderDetail from "@/components/order-detail/order-detail";

export default {
  components: {
    orderDetail,
  },

  data() {
    return {
      orderId: "",
      dialogFormVisible: false,
      orderDetailInfo: {},
      reachStoreDialog: false,
      seatDia: false,
      selectSeatList: [],
      priNumberDialog: false,
      priNumber: "",
      reachStoreCode: "",

      setSeatObj: {
        actualSeatId: "",
        orderId: "",
      },

      searchTime: "",
      searchObj: {
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

      //订单状态字典
      statusOrderArr: [
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

      //订单类型字典
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
            label: "订单预约日期",
            prop: "presentDate",
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
    //追单成功后的操作
    closeDialog(res) {
      this.dialogFormVisible = res;
      this.onLoad(this.page);
    },

    //封装的弹窗
    confirm(txt, fn) {
      this.$confirm(txt, "提示", {
        type: "warning",
      })
        .then(() => {
          fn().then(() => {
            this.onLoad(this.page);
          });
        })
        .catch(() => {});
    },

    //接单
    handleTakeOrder(row) {
      this.confirm("确认要接单吗？", async () => {
        const res = await receive(row.id);
        if (res.data.code === 200) {
          this.$message.success("接单成功");
        }
      });
    },

    //拒单
    handleRejectOrder(row) {
      this.confirm("确认要拒单吗？", async () => {
        const res = await reject(row.id);
        if (res.data.code === 200) {
          this.$message.success("拒单成功");
        }
      });
    },

    //退款
    handleRefund(row) {
      this.confirm("确认要退款吗？", async () => {
        if (row.statusOrder == 7) {
          const res = await refundAudit(row.orderUserId);
          if (res.data.code === 200) {
            this.$message.success("退款成功");
          }
        } else {
          const res = await refund(row.orderUserId);
          if (res.data.code === 200) {
            this.$message.success("退款成功");
          }
        }
      });
    },

    //离店
    handleCheckOut(row) {
      this.confirm("确认要离店吗？", async () => {
        const res = await closed(row.id);
        if (res.data.code === 200) {
          this.$message.success("离店成功");
        }
      });
    },

    //到店核销
    handleReachStore(row) {
      this.orderId = row.id;
      this.reachStoreDialog = true;
    },

    //确认到店核销
    async sureReachStore() {
      let data = {
        assesCode: this.reachStoreCode,
        orderId: this.orderId,
      };
      const res = await arrived(data);
      if (res.data.code === 200) {
        this.onLoad(this.page);
        this.reachStoreDialog = false;
        this.$message.success("到店核销成功");
      }
    },

    //到店核销对话框中的取消按钮
    handleCancelCode() {
      this.reachStoreDialog = false;
      this.reachStoreCode = "";
    },

    //修改座位
    async editSeat(row) {
      this.setSeatObj.orderId = row.id;
      const res = await getBookableSeatList();
      if (res.data.code === 200) {
        this.selectSeatList = res.data.data;
        this.seatDia = true;
      }
    },

    //确定修改座位
    async handleEditSeat() {
      const res = await updateSeatInfo(this.setSeatObj);
      if (res.data.code === 200) {
        this.onLoad(this.page);
        this.$message.success("修改成功");
        this.seatDia = false;
        this.setSeatObj.actualSeatId = "";
      }
    },

    //查看隐私号码
    async getCustomerPhone(row) {
      const res = await getCustomerPhone(row.id);
      if (res.data.code === 200) {
        this.priNumber = res.data.data;
        this.priNumberDialog = true;
      }
    },

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
      getList(page.currentPage, page.pageSize, this.searchObj).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
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
.has-add-order {
  color: #f00;
  font-weight: 600;
  font-size: 18px;
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

.basic-info {
  .info-wrap {
    display: flex;
    justify-content: space-between;

    .info-box {
      width: 100%;

      .info1 {
        display: flex;
        justify-content: space-between;
        margin-bottom: 18px;
      }

      .info2 {
        display: flex;
        justify-content: space-between;

        & > div:first-child {
          margin-right: 20px;
        }
      }

      .info3 {
        > div {
          margin-bottom: 18px;
        }

        span {
          margin-left: 30px;
        }
      }
    }

    .info-box.right {
      box-sizing: border-box;
      padding-left: 60px;
      display: flex;

      .right-info-title {
        margin-right: 20px;
      }

      .right-list {
        display: flex;
        flex-direction: column;

        .title {
          color: #f00;
          margin-bottom: 18px;
        }

        .list-box {
          border-bottom: 1px solid #c0c4cc;
          margin-bottom: 18px;

          p {
            display: flex;
            margin-bottom: 18px;

            :first-child {
              width: 160px;
            }
          }
        }

        .drink-list {
          display: flex;
          margin-bottom: 18px;

          .good-box {
            width: 160px;

            .good-name {
              margin-bottom: 6px;
              display: flex;
              justify-content: space-between;
              padding-right: 20px;

              .num {
                min-width: 20px;
              }
            }
          }

          .unline {
            text-decoration: line-through;
            color: #bcbcbc;
            margin-left: 10px;
          }
        }

        .add-drink-list {
          margin-bottom: 20px;
          border: 1px solid #c0c4cc;
          border-radius: 6px;
          padding: 20px;

          .order-title {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            color: #409eff;
          }
        }

        .change-seat {
          p {
            margin-bottom: 18px;
            display: flex;
            :first-child {
              width: 120px;
            }
          }
        }
      }
    }
  }
}
</style>

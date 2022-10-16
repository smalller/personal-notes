<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="refundOrderList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column label="ID" fixed type="index"></el-table-column>
      <el-table-column prop="orderUserId" label="子订单ID"> </el-table-column>
      <el-table-column prop="isAppend" label="是否为追加订单">
        <template slot-scope="scope">
          <span>{{ scope.row.isAppend == 0 ? "否" : "是" }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="moneyPayable" label="应付金额"></el-table-column>
      <el-table-column prop="moneyPaid" label="实付金额"></el-table-column>
      <el-table-column prop="status" label="子订单状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | refundOrderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payWay" label="支付类型"> </el-table-column>
      <el-table-column label="退款金额" fixed="right" width="310">
        <template slot-scope="scope">
          <el-input
            @input="
              handleCheckMoney(
                scope.row.moneyPaid,
                scope.row.moneyApply,
                scope.$index
              )
            "
            v-model="scope.row.moneyApply"
            type="number"
            min="0"
            placeholder="请输入退款金额，若不输入框则全额退款"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
    <template v-if="refundOrderList.length !== 0">
      <div class="all-money" v-if="displayTotalStatus">
        总退款金额：<span>{{ total }}元</span>
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="sureRefundAudit">确定退款</el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { refundAudit } from "@/api/system/order";

export default {
  props: ["refundOrderList"],

  computed: {
    total() {
      return this.refundOrderList.reduce((prev, item) => {
        return prev + item.moneyApply;
      }, "");
    },

    displayTotalStatus() {
      return this.refundOrderList.every((item) => item.moneyApply !== "");
    },
  },

  methods: {
    //验证退款金额
    handleCheckMoney(moneyPaid, moneyApply, index) {
      if (moneyApply > moneyPaid || moneyApply < 0) {
        this.$message.error("退款金额不能大于实付金额并且不能小于0");
        this.refundOrderList[index].moneyApply = moneyPaid;
      }
    },

    //确定退款
    async sureRefundAudit() {
      let obj = {},
        arr = [];
      this.refundOrderList.forEach((item) => {
        obj.amount = item.moneyApply;
        obj.orderUserId = item.orderUserId;
      });
      arr.push(obj);
      const res = await refundAudit(arr);
      if (res.data.code === 200) {
        this.$root.$emit("closeRefundAuditDialog", false);
        this.$message.success("退款成功");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer,
.all-money {
  text-align: right;
  margin-top: 20px;
}

.all-money > span {
  color: #f00;
  font-size: 22px;
}
</style>
<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="学校名称" prop="orderId">
        <el-input
          v-model="params.schName"
          placeholder="请输入学校名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="orderId">
        <el-input
          v-model="params.mobile"
          placeholder="请输入联系电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="params.orderId"
          placeholder="请输入订单号"
        ></el-input>
      </el-form-item>
      <br />
      <el-form-item label="支付状态" prop="orderStatus">
        <el-select v-model="params.orderStatus" placeholder="请选择">
          <el-option
            v-for="(item, index) in payStatusList"
            :key="index"
            :label="item.describe"
            :value="item.index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式" prop="payGatewayType">
        <el-select v-model="params.payGatewayType" placeholder="请选择">
          <el-option
            v-for="(item, index) in payTypeList"
            :key="index"
            :label="item.describe"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="购买时间" prop="payTime">
        <el-date-picker
          v-model="params.startTime"
          type="date"
          placeholder="开始日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        <el-date-picker
          v-model="params.endTime"
          type="date"
          placeholder="结束日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="订单来源" prop="orderOrigin">
        <el-select v-model="params.orderOrigin" placeholder="请选择">
          <el-option
            v-for="(item, index) in orderOriginList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button
          icon="el-icon-search"
          native-type="submit"
          type="primary"
          @click="search()"
        >
          查询
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orderOriginList: [],
        params: {},
      }
    },
    computed: {
      payStatusList() {
        return this.$store.state.code_list.pay_status || []
      },
      payTypeList() {
        return this.$store.state.code_list.pay_type || []
      },
    },
    mounted() {
      // this.$store.dispatch('code_list/ac_getPayStatus')
      // this.$store.dispatch('code_list/ac_getPayType')
      // this.payStatusList = this.$store.state.code_list.pay_status
    },
    methods: {
      search() {
        this.$emit('search', this.params)
      },
      reset() {
        this.params = {}
        this.$emit('reset')
      },
    },
  }
</script>

<style lang="scss" scoped></style>

<template>
  <div>
    <el-form ref="myForm" :inline="true" @submit.native.prevent>
      <el-form-item label="订单号" prop="orderId">
        <el-input
          v-model="params.orderId"
          placeholder="请输入订单号"
        ></el-input>
      </el-form-item>
      <el-form-item label="付款状态" prop="return_status">
        <el-select v-model="params.return_status" placeholder="请选择">
          <el-option
            v-for="(item, index) in payStatus"
            :key="index"
            :label="item.describe"
            :value="item.index"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="入账时间" prop="startTime">
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
      <el-form-item label="金额范围" prop="orderId">
        <div style="display: flex">
          <el-input
            v-model="params.minAmount"
            placeholder="最小金额"
          ></el-input>
          <el-input
            v-model="params.maxAmount"
            placeholder="最大金额"
          ></el-input>
        </div>
      </el-form-item>
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
        payStatusList: [],
        payTypeList: [],
        orderOriginList: [],
        params: {},
        payStatus: [
          {
            index: 0,
            describe: '未返现',
          },
          {
            index: 1,
            describe: '返现中',
          },
          {
            index: 2,
            describe: '返现成功',
          },
          {
            index: 3,
            describe: '返现失败',
          },
        ],
      }
    },
    mounted() {},
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

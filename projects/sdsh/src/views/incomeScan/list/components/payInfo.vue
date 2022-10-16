<template>
<el-drawer custom-class="payInfo" :size="500" v-model="visible">
  <el-descriptions title="" border :column="1" direction="horizontal">
    <el-descriptions-item label="交易时间">{{dayjs(payInfos.payTime).format('YYYY-MM-DD HH:mm:ss')}}</el-descriptions-item>
    <el-descriptions-item label="交易订单号">{{payInfos.orderNumber}}</el-descriptions-item>
    <el-descriptions-item label="项目名称">{{payInfos.projectName}}</el-descriptions-item>
    <el-descriptions-item label="交费项目">{{payInfos.itemName}}
    </el-descriptions-item>
    <el-descriptions-item label="交费金额">{{payInfos.totalMoney}}</el-descriptions-item>
    <el-descriptions-item label="交费状态">
      <el-tag v-if="+payInfos.payStatus === 0">支付未完成</el-tag>
      <el-tag v-if="+payInfos.payStatus === 1">待支付</el-tag>
      <el-tag v-if="+payInfos.payStatus === 2">已支付</el-tag>
      <el-tag v-if="+payInfos.payStatus === 3">支付失败</el-tag>
      <el-tag v-if="+payInfos.payStatus === 4">退款</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="支付方式">{{payInfos.payType}}</el-descriptions-item>
  </el-descriptions>
</el-drawer>
</template>

<script lang="ts" setup>

import {defineExpose, ref} from "vue";
import {queryPayInfo} from "@/views/incomeScan/list/api";
import {PayInfo} from "@/views/incomeScan/list/data";
import dayjs from "dayjs";

const visible = ref(false);
const payInfos = ref<PayInfo>({
  itemName: '',
  orderNumber: '',
  payStatus: '',
  payTime: '',
  payType: '',
  projectName: '',
  totalMoney: 0
})

const open = (id: number,moddId: number) => {
  visible.value = true;
  getPayInfo(id,moddId);
}

const close = () => {
  visible.value = false
}

const getPayInfo = (id: number,moddId: number) => {
  queryPayInfo(id,moddId).then(res => {
    if(+res.code === 1000) {
      // console.log(res)
      payInfos.value =  res.data
    }
  })
}

defineExpose({
  open
})

</script>

<style lang="scss">
.payInfo{
  width: 50vw !important;
}
</style>

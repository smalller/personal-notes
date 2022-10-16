<template>
  <el-drawer title="按项目统计" custom-class="ItemTotal" v-model="visible">
    <el-row align="center">
      <el-col :span="9">
        <el-date-picker
            type="daterange"
            v-model="times"
            @change="timerChange"
            @panel-change="timeChange"
            range-separator="-"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
        />
      </el-col>
      <el-col :span="4" :offset="1">
        <el-button @click="queryList">查询</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableList">
      <el-table-column label="收费项名称" prop="itemName"/>
      <el-table-column label="已支付人数" prop="payCounts"/>
      <el-table-column label="已退款人数" prop="refundCounts"/>
      <el-table-column label="收款总额" prop="payMoneys"/>
      <el-table-column label="全额退款总额" prop="refundMoneys"/>
    </el-table>
    <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="pageForm.pageSize"
        :current-page="pageForm.pageNum"
        @current-change="pageChange"
    />
  </el-drawer>
</template>

<script lang="ts" setup>

import {defineExpose, reactive, ref} from "vue";
import {getItemList} from "@/views/incomeScan/total/api";
import {PageForm} from "@/common/types";
import dayjs from "dayjs";
import {QueryItemParams} from "@/views/incomeScan/total/data";

const visible = ref(false);
const pageForm = reactive<PageForm>({
  pageNum: 1,
  pageSize: 20,
});

const formData = reactive<QueryItemParams>({
  Mid: 0
})

const totalNum = ref<number>(0);

const tableList = ref([]);

const pageChange = (page: number) => {
  pageForm.pageNum = page;
  queryItemTotal();
}

const open = (id: number) => {
  visible.value = true;
  formData.Mid = id;
  pageChange(1);
}

const close = () => {
  visible.value = false;
}

const queryList = () => {
  pageForm.pageNum = 1;
  queryItemTotal();
}

const queryItemTotal = () => {
  getItemList(Object.assign(formData, pageForm)).then(res => {
    if (+res.code === 1000) {
      tableList.value = res.data.list;
      totalNum.value = res.data.total;
    }
  })
}

const times = ref([])

const timerChange = (e) => {
  if (e) {
    formData.startTime = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
    formData.endTime = dayjs(e[1]).format('YYYY-MM-DD') + ' 23:59:59'
  } else {
    formData.startTime = '';
    formData.endTime = '';
  }
}
const timeChange = e => {
  // console.log(e)
}

defineExpose({
  open
})

</script>

<style lang="scss">
.ItemTotal {
  width: 70vw !important;
}
</style>

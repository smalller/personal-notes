<template>
  <el-table :data="tableList" border style="width: 100%">
    <el-table-column label="交易完成时间">
      <template #default="{ row }">
        <span>{{ dayjs(row.payTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="paymentNo" label="交易订单号" />
    <el-table-column prop="projectTypeStr" label="支付场景" />
    <el-table-column prop="projectName" label="支付项目" />
    <el-table-column prop="payStatus" label="交易类型" />
    <el-table-column prop="payMoney" label="订单金额" />
    <el-table-column prop="payType" label="支付方式" />
    <el-table-column prop="remark" label="备注">
      <template #default="{ row }">
        <template v-if="+row.projectType === 1 && row.remark">
          <div v-for="(item, index) in JSON.parse(row.remark)" :key="index">
            {{ item.registerName }} : {{ item.registerValue }}
          </div>
        </template>
        <template v-else>
          {{ row.remark }}
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType } from "vue";
import { TableListItem } from "../data";
import dayjs from "dayjs";

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  dayjs: any;
}

export default defineComponent({
  name: "",
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: {},
  setup(props): Setup {
    const tableList = computed<TableListItem[]>(() => props.data);

    return {
      tableList,
      dayjs,
    };
  },
});
</script>
<style lang="scss" scoped>
</style>

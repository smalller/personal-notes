<template>
  <el-table :data="tableList" border style="width: 100%">
    <el-table-column prop="merchantName" label="所属商户" />
    <el-table-column prop="projectName" label="项目名称" />
    <el-table-column label="开始日期">
      <template #default="{ row }">
        <div> <span> {{ micell.date.format(row.beginTime, "YYYY-MM-DD") }}</span></div>

      </template>
    </el-table-column>
    <el-table-column label="截止日期">
      <template #default="{ row }">
        <div> <span> {{ micell.date.format(row.endTime, "YYYY-MM-DD") }}</span></div>

      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template #default="{ row }">
        <div> <span> {{ row.status == 1 ? '已失效' : "未失效" }}</span></div>

      </template>
    </el-table-column>

    <el-table-column prop="payCount" label="支付人数" />
    <el-table-column label="二维码">
      <template #default="{ row }">
        <div> <span @click="showCode(row)" style="color:blue;cursor: pointer">点击查看或下载二维码</span></div>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button type="text" @click="handleViewDetail(row)">详情</el-button>
        <el-button type="text" @click="handleViewStatisData(row)">统计</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="show" title="二维码" width="30%">
    <div style="margin:auto">
      <qrcode-vue :value="selectInfo.codeUrl" :size="180" level="H" />
    </div>
  </el-dialog>
  <merchantDetail ref="merchantDetailCom"></merchantDetail>
  <statisData ref="statisDataCom"></statisData>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue';
import { TableListItem } from '../data';
import micell from 'micell';
import QrcodeVue from 'qrcode.vue';
import merchantDetail, { Setup as MerSetup } from '@/views/merchantManage/merchantList/components/merchantDetail.vue'
import statisData, { Setup as StatisDataSetup } from '@/views/merchantManage/merchantList/components/statisData.vue'

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  viewDetail: (TableListItem) => void;
  showCode: (TableListItem) => void;
  merchantDetailCom: Ref<unknown>;
  show: Ref<boolean>;
  selectInfo: Ref<any>;
  micell: any
}

export default defineComponent({
  name: '',
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: {
    QrcodeVue,
    merchantDetail,
    statisData
  },
  setup(props) {
    const tableList = computed<TableListItem[]>(() => props.data);
    const merchantDetailCom = ref<unknown>(null);
    const statisDataCom = ref<unknown>(null);


    //查看详情
    function viewDetail(row: TableListItem): void {
    }
    const show = ref<boolean>(false);
    const selectInfo = ref<any>();
    //查看二维码
    function showCode(row: TableListItem): void {
      if (row?.merchantId) {
        show.value = true;
        selectInfo.value = { ...row };
      }
    }

    function handleViewDetail(row: any) {
      (merchantDetailCom.value as MerSetup).handleOpen(row);
    }

    const handleViewStatisData = (row: any): void => {
      (statisDataCom.value as StatisDataSetup).handleOpen(row.merchantId)
    }



    return {
      tableList,
      viewDetail,
      merchantDetailCom,
      micell,
      show,
      showCode,
      selectInfo,
      handleViewDetail,
      statisDataCom,
      handleViewStatisData
    };
  },
});
</script>
<style lang='scss' scoped>
</style>
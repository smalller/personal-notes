<template>
  <el-table
    :data="tableList"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="projectName"
      label="项目名称"
    />
    <el-table-column label="开始时间">
      <template #default="{ row }">
        <div> <span> {{  micell.date.format(row.beginTime, "YYYY-MM-DD")}}</span></div>

      </template>
    </el-table-column>
    <el-table-column label="截止时间">
      <template #default="{ row }">
        <div> <span> {{  micell.date.format(row.endTime, "YYYY-MM-DD")}}</span></div>

      </template>
    </el-table-column>
    <el-table-column
      prop="isExpire"
      label="状态"
    />
    <el-table-column
      prop="payNumber"
      label="支付人数"
    />
    <el-table-column
      prop="chargeRate"
      label="二维码"
    />
    <el-table-column label="操作">
      <template #default="{ row }">
        <el-button
          type="text"
          @click="viewDetail(row)"
        >详情</el-button>
        <el-button
          type="text"
          @click="setting"
        >明细</el-button>
        <el-button
          type="text"
          @click="setting"
        >统计</el-button>
      </template>
    </el-table-column>
  </el-table>
  <merchantDetail ref="merchantDetailCom"></merchantDetail>
  <!-- <merchantSetting ref="merchantSettingCom" title="商户信息修改" flag="1"></merchantSetting> -->
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
  ComputedRef,
  PropType,
  ref,
  Ref,
} from "vue";
import { TableListItem } from "../data";
import merchantDetail from "./merchantDetail.vue";
import { Setup as MerSetup } from "./merchantDetail.vue";
// import merchantSetting, { Setup as MerSettingSetup } from '../../components/merchantSetting.vue'
// import { Setup as MerSettingSetup } from '../../components/merchantSetting.vue'
import micell from "micell";

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  viewDetail: (TableListItem) => void;
  merchantDetailCom: Ref<unknown>;
  merchantSettingCom: Ref<unknown>;
  setting: () => void;
  micell: any;
}

export default defineComponent({
  name: "",
  props: {
    data: {
      type: Array as PropType<TableListItem[]>,
      required: true,
    },
  },
  components: {
    merchantDetail,
    // merchantSetting
  },
  setup(props): Setup {
    const data = [];
    const tableList = computed<TableListItem[]>(() => props.data);
    const merchantDetailCom = ref<unknown>(null);
    const merchantSettingCom = ref<unknown>(null);

    function viewDetail(row: TableListItem): void {
      (merchantDetailCom.value as MerSetup).handleOpen(row);
    }

    const setting = (): void => {
      // (merchantSettingCom.value as MerSettingSetup).handleOpen(1)
    };

    return {
      tableList,
      viewDetail,
      merchantDetailCom,
      merchantSettingCom,
      setting,
      micell,
    };
  },
});
</script>
<style lang='scss' scoped></style>
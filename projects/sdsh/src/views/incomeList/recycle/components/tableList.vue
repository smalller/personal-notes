<template>
  <el-table
    :data="tableList"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="mcName"
      label="项目名称"
    />
    <el-table-column
      prop="detailAddress"
      label="开始日期"
    />
    <el-table-column
      prop="contactsName"
      label="截止日期"
    />
    <el-table-column
      prop="contactsPhone"
      label="状态"
    />
    <el-table-column
      prop="createTime"
      label="进度"
    />
    <el-table-column
      prop="chargeRate"
      label="总人数"
    />
    <el-table-column
      prop="chargeRate"
      label="已交款"
    />
    <el-table-column
      prop="chargeRate"
      label="未参与/全额退款"
    />
    <el-table-column
      prop="chargeRate"
      label="未交款"
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

interface Setup {
  tableList: ComputedRef<TableListItem[]>;
  viewDetail: (TableListItem) => void;
  merchantDetailCom: Ref<unknown>;
  merchantSettingCom: Ref<unknown>;
  setting: () => void;
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
    const data = [
      {
        chargeRate: "2315",
        contactsName: "54564",
        contactsPhone: "5454",
        createTime: 5,
        detailAddress: "451",
        mcName: "54564",
        merchantId: 7,
        proceduresBalance: "string",
        totalBalance: "string",
      },
    ];
    const tableList = computed<TableListItem[]>(() => data);
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
    };
  },
});
</script>
<style lang='scss' scoped></style>
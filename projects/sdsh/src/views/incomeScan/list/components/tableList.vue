<template>
  <el-table :data="tableList" border style="width: 100%">
    <el-table-column label="支付完成时间">
      <template #default="{ row }">
        <div> <span> {{ dayjs(row.payTime).format("YYYY年MM月DD日 hh:mm:ss") }}</span></div>
      </template>
    </el-table-column>
    <el-table-column prop="projectName" label="项目名称" />
    <!--    <el-table-column prop="itemName" label="交费项" />-->
    <el-table-column prop="totalMoney" label="交费金额" />
    <el-table-column prop="payType" label="支付方式" />
    <el-table-column prop="remark" label="备注">
      <template #default="{ row }">
        <div v-for="(item, index) in getList(row.remark)" :key="index">
<!--          {{JSON.stringify(item)}}-->
          <span>{{item.registerName}}</span>:
          <span>{{item. registerValue}}</span>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="230px">
      <template #default="{ row }">
        <el-button type="text" @click="viewDetail(row)">查看</el-button>
        <el-button v-if="row.payStatus === '2'" type="text" @click="applyRefund(row)">退款</el-button>
        <el-button type="text" @click="setting(row)">备注</el-button>
      </template>
    </el-table-column>
  </el-table>
  <pay-info ref="payInfo" />
  <applyRefund ref="applyRefundCom"></applyRefund>
  <edit-remark ref="editRemark" @success="updateRemarkSuccess" />
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
import dayjs from "dayjs";
import { useRouter } from "vue-router";

// import merchantSetting, { Setup as MerSettingSetup } from '../../components/merchantSetting.vue'
// import { Setup as MerSettingSetup } from '../../components/merchantSetting.vue'
import PayInfo from "@/views/incomeScan/list/components/payInfo.vue";
import applyRefund, {
  Setup as ApplySetup,
} from '@/views/returnManage/components/applyRefund.vue'
import EditRemark from "@/views/incomeScan/list/components/editRemark.vue";
import bus from "@/utils/bus";

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
    EditRemark,
    PayInfo,
    applyRefund
  },
  setup(props) {
    const data = [];
    const tableList = computed<TableListItem[]>(() => props.data);

    const updateRemarkSuccess = () => {
      bus.$emit('updateRemarkSuccess')
    }

    const payInfo = ref(null);

    function viewDetail(row: any): void {
      // alert(row.moddId);
      (payInfo.value as any).open(row.moId, row.moddId);
    }

    const router = useRouter();
    function handleRefund(mccId: string) {
      router.push(`/returnManage/manage?mccId=${mccId}`)
    }

    const applyRefundCom = ref<unknown>(null);

    // 申请退款
    function applyRefund(row: any): void {
      (applyRefundCom.value as ApplySetup).handleOpen(row.id, 1);
    }

    const editRemark = ref(null);
    const setting = (row: any): void => {
      console.log(row.moId, row.remark);
      (editRemark.value as any).open(row.moId, row.remark)
    };

    const getList = (remark:string):any[] => {
      let list:any[] = [];
      try {
        const data = JSON.parse(remark)
        data.forEach(item => {
          list.push({
            registerName: item.registerName,
            registerValue: item.registerValue
          })
        })
      } catch {
        list = [];
      }
      return  list;
    }

    return {
      tableList,
      viewDetail,
      setting,
      dayjs,
      handleRefund,
      payInfo,
      applyRefundCom,
      applyRefund,
      editRemark,
      updateRemarkSuccess,
      getList
    };
  },
});
</script>
<style lang='scss' scoped>
</style>

<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="createTime" label="提交时间">
            <template #default="{ row }">
                <span>{{ micell.date.format(row.createTime, 'YYYY-MM-DD') }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="交易订单号" />
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="refundMoney" label="退款金额" />
        <el-table-column prop="refundTypeStr" label="支付方式" />
        <el-table-column prop="refundReason" label="退款说明" />
        <el-table-column prop="" label="备注" />
        <el-table-column prop="statusStr" label="退款状态" />
        <el-table-column prop="userName" label="提交人" />
        <el-table-column prop="" label="处理说明" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">查看详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <applyRefund ref="applyRefundCom"></applyRefund>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'
import applyRefund, { Setup as ApplySetup } from '../../components/applyRefund.vue'
import micell from "micell";

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (TableListItem) => void;
    applyRefundCom: Ref<unknown>;
    micell: any
}

export default defineComponent({
    name: '',
    props: {
        data: {
            type: Array as PropType<TableListItem[]>,
            required: true
        }
    },
    components: {
        applyRefund
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const applyRefundCom = ref<unknown>(null)

        function viewDetail(row: TableListItem): void {
            (applyRefundCom.value as ApplySetup).handleOpen(row, 2);
        }

        return {
            tableList,
            viewDetail,
            applyRefundCom,
            micell
        }

    }
})
</script>
<style lang='scss' scoped>
</style>
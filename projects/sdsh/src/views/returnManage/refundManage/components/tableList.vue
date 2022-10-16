<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column label="支付完成时间">
            <template #default="{ row }">
                <span>{{ dayjs(row.payTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="orderNumber" label="交易订单号" />
        <el-table-column prop="projectName" label="支付项目" />
        <el-table-column prop="totalMoney" label="订单金额" />
        <el-table-column prop="payTypeStr" label="支付方式" />
        <el-table-column prop="payStatusStr" label="订单状态" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="applyRefund(row)">申请退款</el-button>
            </template>
        </el-table-column>
    </el-table>
    <applyRefund ref="applyRefundCom"></applyRefund>
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
import applyRefund, {
    Setup as ApplySetup,
} from "../../components/applyRefund.vue";
import dayjs from "dayjs";

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    applyRefund: (row: TableListItem) => void;
    applyRefundCom: Ref<unknown>;
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
    components: {
        applyRefund,
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const applyRefundCom = ref<unknown>(null);

        function applyRefund(row: any): void {
            (applyRefundCom.value as ApplySetup).handleOpen(row.id, 1);
        }

        return {
            tableList,
            applyRefund,
            applyRefundCom,
            dayjs,
        };
    },
});
</script>
<style lang="scss" scoped>
</style>

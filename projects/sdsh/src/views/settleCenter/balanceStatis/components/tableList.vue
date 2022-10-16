<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="payTypeStr" label="收款方式" />
        <el-table-column prop="receiveCount" label="收款笔数" />
        <el-table-column prop="receive" label="收款总额" />
        <el-table-column prop="refundCount" label="退款笔数" />
        <el-table-column prop="refund" label="退款总额" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">查看明细</el-button>
            </template>
        </el-table-column>
    </el-table>
    <detailPage ref="detailPageCom"></detailPage>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'
import detailPage from './detailPage.vue'

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (TableListItem) => void;
    detailPageCom: Ref<unknown>
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
        detailPage
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const detailPageCom = ref<unknown>(null)

        function viewDetail(row: TableListItem): void {
            (detailPageCom.value as any).handleOpen(row);
        }

        return {
            tableList,
            viewDetail,
            detailPageCom
        }

    }
})
</script>
<style lang='scss' scoped>
</style>
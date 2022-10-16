<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="mcName" label="所属商户" />
        <el-table-column prop="detailAddress" label="项目名称" />
        <el-table-column prop="contactsName" label="开始日期" />
        <el-table-column prop="contactsPhone" label="截止日期" />
        <el-table-column prop="createTime" label="状态" />
        <el-table-column prop="createTime" label="支付人数" />
        <el-table-column prop="outBalance" label="二维码" />
        <el-table-column label="操作"></el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (TableListItem) => void;
    merchantDetailCom: Ref<unknown>
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
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const merchantDetailCom = ref<unknown>(null)

        function viewDetail(row: TableListItem): void {
            // (merchantDetailCom.value as MerSetup).handleOpen(row);
        }

        return {
            tableList,
            viewDetail,
            merchantDetailCom
        }

    }
})
</script>
<style lang='scss' scoped></style>
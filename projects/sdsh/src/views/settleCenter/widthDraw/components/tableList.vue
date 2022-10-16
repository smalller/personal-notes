<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="mcName" label="商户名称" />
        <el-table-column prop="detailAddress" label="商户地址" />
        <el-table-column prop="contactsName" label="联系人" />
        <el-table-column prop="contactsPhone" label="手机" />
        <el-table-column prop="createTime" label="申请时间" />
        <el-table-column prop="chargeRate" label="收费扣率" />
        <el-table-column prop="totalBalance" label="补贴扣率" />
        <el-table-column prop="outBalance" label="状态" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">详情</el-button>
            </template>
        </el-table-column>
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
<style lang='scss' scoped>
</style>
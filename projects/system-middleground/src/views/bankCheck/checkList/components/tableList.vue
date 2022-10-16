<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="createTime" label="角色名称" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">审核</el-button>
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
<style lang='scss' scoped></style>
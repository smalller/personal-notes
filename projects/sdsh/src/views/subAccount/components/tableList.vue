<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="insNameCn" label="入账主体名称" />
        <el-table-column prop="isIndividualMchntStr" label="入账主体类型" />
        <el-table-column prop="applyDate" label="申请日期">
            <template #default="{ row }">
                <span>{{ dayjs(row.applyDate).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="applyStatusStr" label="审核状态" />
        <el-table-column prop="outAcntNm" label="户名" />
        <el-table-column prop="outAcntNo" label="银行账号" />
        <el-table-column prop="applyInfo" label="审核信息" />

        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">详情</el-button>
                <el-button type="text" @click="handleDelete(row)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <editSubAccCom ref="editSubAccCom"></editSubAccCom>
</template>
<script lang="ts">
import { defineComponent, computed, PropType, ref } from 'vue'
import dayjs from 'dayjs';
import editSubAccCom from './editSubAccCom.vue'
import { deleteFastpAccountIn } from '../api'
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: '',
    props: {
        data: {
            type: Array as PropType<any[]>,
            required: true
        }
    },
    components: {
        editSubAccCom
    },
    setup(props, { emit }) {
        const tableList = computed<any[]>(() => props.data);
        const editSubAccCom = ref<unknown>(null)

        function viewDetail(row: any): void {
            (editSubAccCom.value as any).handleOpen(2, row);
        }

        async function handleDelete(row) {
            const { code } = await deleteFastpAccountIn(row.id)
            if (+code === 1000) {
                ElMessage.success('删除成功')
                emit('editComplete')
            }
        }

        return {
            tableList,
            viewDetail,
            editSubAccCom,
            dayjs,
            handleDelete
        }
    }
})
</script>
<style lang='scss' scoped>
</style>
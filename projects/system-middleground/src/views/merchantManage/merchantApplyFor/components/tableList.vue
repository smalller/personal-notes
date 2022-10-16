<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="mName" label="商户名称" />
        <el-table-column prop="detailAddress" label="商户地址" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactPhone" label="手机" />
        <el-table-column prop="createTime" label="申请时间">
            <template #default="{ row }">
                <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="chargeRate" label="收费扣率" />
        <el-table-column prop="subsidyRate" label="补贴扣率" />
        <el-table-column prop="statusStr" label="状态" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <merchantAllInfo ref="merchantAllInfoCom" title="商户详情" flag="2"></merchantAllInfo>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'
import merchantAllInfo from '../../components/merchantAllInfo.vue'
import dayjs from 'dayjs';

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (TableListItem) => void;
    merchantAllInfoCom: Ref<unknown>;
    dayjs: any;
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
        merchantAllInfo
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const merchantAllInfoCom = ref<unknown>(null)

        function viewDetail(row: TableListItem): void {
            (merchantAllInfoCom.value as any).handleOpen(row);
        }

        return {
            tableList,
            viewDetail,
            merchantAllInfoCom,
            dayjs,
        }

    }
})
</script>
<style lang='scss' scoped>
</style>
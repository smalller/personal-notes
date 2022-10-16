<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="title" label="通知名称" />
        <el-table-column prop="userName" label="发布人" />
        <el-table-column label="发布日期">
            <template #default="{ row }">
                <span>{{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="totalPeople" label="总人数" />
        <el-table-column prop="read" label="已阅读" />
        <el-table-column prop="unread" label="未阅读" />
        <el-table-column label="操作">
            <template #default="{ row }">
                <el-button type="text" @click="viewDetail(row)">详情</el-button>
            </template>
        </el-table-column>
    </el-table>
    <addNotice ref="addNoticeCom"></addNotice>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'
import addNotice from "./addNotice.vue";
import dayjs from 'dayjs';

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
    viewDetail: (row: TableListItem) => void;
    addNoticeCom: Ref<unknown>;
    dayjs: any
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
        addNotice
    },
    setup(props): Setup {
        const tableList = computed<TableListItem[]>(() => props.data);
        const addNoticeCom = ref<unknown>(null)

        function viewDetail(row: any): void {
            (addNoticeCom.value as any).handleOpen(2, row.id);
        }

        return {
            tableList,
            viewDetail,
            addNoticeCom,
            dayjs
        }

    }
})
</script>
<style lang='scss' scoped>
</style>
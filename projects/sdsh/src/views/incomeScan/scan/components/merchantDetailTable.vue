<template>
    <p class="top-info">
        收款总额：
        <span>321元</span>，
        共
        <span>1笔</span>，
        退款总额：
        <span>0元</span>，
        共
        <span>0笔</span>
    </p>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop label="交易完成时间" />
        <el-table-column prop label="交易订单号" />
        <el-table-column prop label="支付场景" />
        <el-table-column prop label="支付项目" />
        <el-table-column prop label="收费项" />
        <el-table-column prop label="交易类型" />
        <el-table-column prop label="订单金额" />
        <el-table-column prop label="支付方式" />
        <el-table-column prop label="备注" />
        <el-table-column label="操作"></el-table-column>
    </el-table>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, ComputedRef } from 'vue'

interface Setup {
    tableList: ComputedRef<any[]>;
}

export default defineComponent({
    name: '',
    props: {
        data: {
            type: Array as PropType<any[]>,
            required: true
        }
    },
    setup(props): Setup {
        const tableList = computed<any[]>(() => props.data);

        return {
            tableList
        }
    }
})
</script>
<style lang='scss' scoped>
.top-info {
    margin-bottom: 10px;
}
</style>
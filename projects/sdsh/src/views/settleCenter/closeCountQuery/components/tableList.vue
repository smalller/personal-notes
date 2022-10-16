<template>
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="addn_fee" label="附加手续费" />
        <el-table-column prop="d1_fee" label="提现手续费" />
        <el-table-column prop="pay_amt" label="金额（元）" />
        <el-table-column prop="pay_st" label="划拨状态" />
        <el-table-column prop="pay_st_desc" label="划拨状态描述" />
        <el-table-column prop="pay_ts" label="划款成功时间" />
        <el-table-column prop="payTxnCdStr" label="划款交易类型" />
        <el-table-column prop="repay_dt" label="重新划款日期" />
        <el-table-column prop="repay_tag" label="重新划款标识" />
        <el-table-column prop="settle_acnt_no" label="划款账号" />
        <el-table-column prop="settle_acnt_nm" label="划款户名" />
        <el-table-column prop="settle_dt" label="清算日期" />
    </el-table>
</template>
<script lang="ts">
import { defineComponent, computed, ComputedRef, PropType, ref, Ref } from 'vue'
import { TableListItem } from '../data'

interface Setup {
    tableList: ComputedRef<TableListItem[]>;
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

        return {
            tableList,
        }

    }
})
</script>
<style lang='scss' scoped>
</style>
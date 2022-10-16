<template>
    <!-- <p class="top-info">
        收款总额：
        <span>321元</span>，
        共
        <span>1笔</span>，
        退款总额：
        <span>0元</span>，
        共
        <span>0笔</span>
    </p>-->
    <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="payTime" label="交易完成时间" />
        <el-table-column prop="paymentNo" label="交易订单号" />
        <el-table-column prop="projectTypeStr" label="支付场景" />
        <el-table-column prop="projectName" label="支付项目" />
        <!-- <el-table-column prop="itemName" label="收费项" /> -->
        <el-table-column prop="payStatus" label="支付状态" />
        <el-table-column prop="payMoney" label="订单金额" />
        <el-table-column prop="payType" label="支付方式" />
        <!-- <el-table-column prop="remark" label="备注">
            <template #default="{ row }">
                <div v-html="row.remark"></div>
            </template>
        </el-table-column> -->
        <el-table-column prop="remark" label="备注">
            <template #default="{ row }">
                <template v-if="+row.projectType === 1 && row.remark">
                    <div v-for="(item, index) in JSON.parse(row.remark)" :key="index">
                        {{ item.registerName }} : {{ item.registerValue }}
                    </div>
                </template>
                <template v-else>
                    {{ row.remark }}
                </template>
            </template>
        </el-table-column>
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
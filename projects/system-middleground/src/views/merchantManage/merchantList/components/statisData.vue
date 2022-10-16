<template>
    <el-dialog v-model="dialogVisible" title="收支流水" width="70%">
        <ul>
            <li>
                <span class="label-title">交易时间</span>
                <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
                    start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChangeDate"></el-date-picker>
            </li>
            <li>
                <span class="label-title">支付方式</span>
                <el-select v-model="QueryObj.payType" placeholder="全部">
                    <el-option v-for="item in paywayList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </li>
            <li>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </li>
            <li>
                <el-button type="primary" @click="handleExportFile">导出Excel</el-button>
            </li>
        </ul>
        <el-table :data="tableList" border style="width: 100%">
            <el-table-column prop="payType" label="收款方式" />
            <el-table-column prop="totalMoneyCount" label="收款笔数" />
            <el-table-column prop="totalMoney" label="收款总额" />
            <el-table-column prop="refundMoneyCount" label="退款笔数" />
            <el-table-column prop="refundMoney" label="退款总额" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button v-if="row.payTypeId" type="text" @click="handleViewDetail(row.payTypeId)">查看明细
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
    <statisDataDetail ref="statisDataDetailCom"></statisDataDetail>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, computed, ComputedRef, PropType, reactive } from 'vue'
import { paywayList } from '../static'
import { KeyValue } from '@/common/data'
import { merchantStatistics } from '../api'
import micell from 'micell'
import statisDataDetail from './statisDataDetail.vue'
import { exportFile } from '@/common/api'

export interface Setup {
    dialogVisible: Ref<boolean>;
    handleOpen: (any) => void;
    selectedDate: Ref<Date[] | string>;
    paywayList: KeyValue[];
    handleSearch: () => void;
    tableList: Ref<any[]>;
    handleChangeDate: (string) => void;
    QueryObj: any;
    statisDataDetailCom: Ref<unknown>;
    handleViewDetail: (string) => void;
    handleExportFile: () => Promise<void>;
}

export default defineComponent({
    name: '',
    components: {
        statisDataDetail
    },
    setup(props): Setup {
        const dialogVisible = ref<boolean>(false);
        const selectedDate = ref([] as Date[] | "");
        const tableList = ref<any[]>([]);
        const merchantId = ref<number>(-1)
        const projectId = ref<number>(-1)
        const statisDataDetailCom = ref<unknown>(null)

        const QueryObj = reactive<any>({
            payType: '',
            payTimeFrom: '',
            payTimeTo: '',
        })

        const handleChangeDate = (res: string[]): void => {
            if (res !== null) {
                if (res.length !== 0) {
                    QueryObj.payTimeFrom = micell.date.format(res[0], "YYYY-MM-DD");
                    QueryObj.payTimeTo = micell.date.format(res[1], "YYYY-MM-DD");
                } else {
                    QueryObj.payTimeFrom = '';
                    QueryObj.payTimeTo = '';
                }
            } else {
                QueryObj.payTimeFrom = '';
                QueryObj.payTimeTo = '';
            }
        }

        const handleOpen = (res: number): void => {
            merchantId.value = res
            getMerchantStatistics()
            dialogVisible.value = true;
        };

        const handleSearch = (): void => {
            console.log(selectedDate.value);
            getMerchantStatistics()
        }

        const getMerchantStatistics = async (): Promise<void> => {
            const { code, data } = await merchantStatistics({
                merchantId: merchantId.value,
                ...QueryObj
            });
            if (+code === 1000) {
                tableList.value = data;
            }
        }

        const handleViewDetail = (payTypeId: string): void => {
            (statisDataDetailCom.value as any).handleOpen(merchantId.value, payTypeId)
        }

        async function handleExportFile() {
            await exportFile(`/pay-mg/template/exportExpensesList`, {
                merchantId: merchantId.value,
                ...QueryObj.value
            }, '收支统计列表')
        }

        return {
            dialogVisible,
            handleOpen,
            selectedDate,
            QueryObj,
            paywayList,
            handleSearch,
            tableList,
            handleChangeDate,
            handleViewDetail,
            statisDataDetailCom,
            handleExportFile
        }

    }
})
</script>
<style lang='scss' scoped>
ul {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    >li {
        margin-right: 20px;
    }

    .el-select .el-input {
        width: 130px;
    }

    .label-title {
        margin-right: 10px;
    }
}
</style>
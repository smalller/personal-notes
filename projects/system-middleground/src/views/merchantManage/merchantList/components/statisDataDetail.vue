<template>
    <el-dialog v-model="dialogVisible" title="查看明细" width="70%">
        <ul>
            <li>
                <span class="label-title">支付完成时间</span>
                <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
                    start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChangeDate"></el-date-picker>
            </li>
            <li>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </li>
            <li>
                <el-button type="primary" @click="handleExportFile">导出Excel</el-button>
            </li>
        </ul>
        <el-table :data="tableList" border style="width: 100%">
            <el-table-column prop="payTime" label="支付完成时间" />
            <el-table-column prop="projectName" label="项目名称" />
            <!-- <el-table-column prop="itemName" label="交费项" /> -->
            <el-table-column prop="payMoney" label="交费金额" />
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
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="text" @click="viewDetailChild(row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
    <statisDataDetailChild ref="statisDataDetailChildCom"></statisDataDetailChild>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue'
import { paywayList } from '../static'
import { KeyValue } from '@/common/data'
import { settlementDetail } from '../api'
import micell from 'micell'
import statisDataDetailChild from './statisDataDetailChild.vue'
import { exportFile } from '@/common/api'

export interface Setup {
    dialogVisible: Ref<boolean>;
    handleOpen: (number, string) => void;
    selectedDate: Ref<Date[] | string>;
    paywayList: KeyValue[];
    handleSearch: () => void;
    tableList: Ref<any[]>;
    handleChangeDate: (string) => void;
    QueryObj: any;
    viewDetailChild: (string) => void;
    statisDataDetailChildCom: Ref<unknown>;
    handleExportFile: () => Promise<void>;
}

export default defineComponent({
    name: '',
    components: {
        statisDataDetailChild
    },
    setup(props): Setup {
        const dialogVisible = ref<boolean>(false);
        const selectedDate = ref([] as Date[] | "");
        const tableList = ref<any[]>([]);
        const merchantId = ref<number>(-1)
        const payType = ref<string>('')
        const statisDataDetailChildCom = ref<unknown>(null)

        const QueryObj = reactive<any>({
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

        const handleOpen = (id: number, type: string): void => {
            merchantId.value = id;
            payType.value = type
            getSettlementDetail()
            dialogVisible.value = true;
        };

        const handleSearch = (): void => {
            getSettlementDetail()
        }

        const getSettlementDetail = async (): Promise<void> => {
            const { code, data } = await settlementDetail({ merchantId: merchantId.value, payType: payType.value, ...QueryObj });
            if (+code === 1000) {
                tableList.value = data;
            }
        }

        const viewDetailChild = (row): void => {
            (statisDataDetailChildCom.value as any).handleOpen(row)
        }

        async function handleExportFile() {
            await exportFile(`/pay-mg/template/exportExpensesDetailList`, {
                merchantId: merchantId.value,
                payType: payType.value,
                ...QueryObj
            }, '收支统计明细列表')
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
            statisDataDetailChildCom,
            viewDetailChild,
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
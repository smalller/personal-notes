<template>
    <el-dialog v-model="dialogVisible" title="已结算查询" width="70%">
        <ul>
            <li>
                <span class="label-title">日期</span>
                <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
                    start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChangeDate"></el-date-picker>
            </li>
            <li>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </li>
        </ul>
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
        <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
            :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue'
import { paywayList } from '../static'
import { KeyValue } from '@/common/data'
import micell from 'micell'
import { merchantSettledList } from '../api'

export interface Setup {
    dialogVisible: Ref<boolean>;
    handleOpen: (any) => void;
    selectedDate: Ref<Date[] | string>;
    paywayList: KeyValue[];
    handleSearch: () => void;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalNum: Ref<number>;
    tableList: Ref<any[]>;
    QueryObj: any;
    handleChangeDate: (string) => void;
    handleCurrentChange: (number) => void;
}

export default defineComponent({
    name: '',
    setup(props): Setup {
        const dialogVisible = ref<boolean>(false);
        const selectedDate = ref([] as Date[] | "");
        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数 
        const tableList = ref<any[]>([])
        const merchantId = ref<number>(-1)

        const QueryObj = reactive<any>({
            start_date: '',
            end_date: '',
        })

        const handleChangeDate = (res: string[]): void => {
            if (res !== null) {
                if (res.length !== 0) {
                    QueryObj.start_date = micell.date.format(res[0], "YYYYMMDD");
                    QueryObj.end_date = micell.date.format(res[1], "YYYYMMDD");
                } else {
                    QueryObj.start_date = '';
                    QueryObj.end_date = '';
                }
            } else {
                QueryObj.start_date = '';
                QueryObj.end_date = '';
            }
        }

        // 打开抽屉
        const handleOpen = (res: any): void => {
            merchantId.value = res;
            getMerchantSettledList()
            dialogVisible.value = true;
        };

        const handleSearch = (): void => {
            getMerchantSettledList()
        }

        // 翻页
        const handleCurrentChange = (res: number): void => {
            currentPage.value = res;
            getMerchantSettledList();
        };

        const getMerchantSettledList = async (): Promise<void> => {
            if (!QueryObj.start_date) {
                QueryObj.start_date = '20160601'
            }
            if (!QueryObj.end_date) {
                QueryObj.end_date = '20991229'
            }
            const { code, data } = await merchantSettledList(
                currentPage.value, pageSize.value,
                Object.assign({}, {
                    ...QueryObj,
                    merchantId: merchantId.value
                })
            );
            if (+code === 1000) {
                tableList.value = data.list;
                totalNum.value = data.count;
            }
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
            currentPage,
            pageSize,
            totalNum,
            handleCurrentChange
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
<template>
    <div class="indexlayout-main-conent">
        <el-card shadow="never">
            <div class="card-box">
                <div class="left-box">
                    <p>可提现余额</p>
                    <p class="money">0.00元</p>
                    <p>（今日微信收款暂未入账，1个工作日后结算到收款钱包）</p>
                </div>
                <div class="right-box">
                    <el-button type="primary" @click="bankAccountManage">银行账户管理</el-button>
                    <el-button type="primary" @click="viewWalletDatail">钱包明细</el-button>
                </div>
            </div>
        </el-card>
        <walletDetail ref="walletDetailCom"></walletDetail>
        <bankAccountManage ref="bankAccountManageCom"></bankAccountManage>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue'
import { QueryObj, TableListItem } from './data'
import { statusList } from './static'
import { KeyValue } from '@/common/types'
import walletDetail from './components/walletDetail.vue'
import bankAccountManage from './components/bankAccountManage.vue'

interface Setup {
    QueryObj: QueryObj;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalNum: Ref<number>;
    tableList: Ref<TableListItem[]>;
    bankAccountManage: () => void;
    walletDetailCom: Ref<unknown>;
    bankAccountManageCom: Ref<unknown>;
    viewWalletDatail: () => void;
    // selectedDate: Ref<Date[] | string>;
    selectedDate: Ref<any>;
    statusList: KeyValue[];
}

export default defineComponent({
    name: '',
    components: {
        walletDetail,
        bankAccountManage
    },
    setup(): Setup {
        const QueryObj = reactive<QueryObj>({
            mcName: '',
            contactsName: '',
            contactsPhone: '',
            status: ''
        })
        const selectedDate = ref([] as Date[] | "");
        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数
        const tableList = ref<TableListItem[]>([])  // 表格数据
        const walletDetailCom = ref<unknown>(null)
        const bankAccountManageCom = ref<unknown>(null)

        function bankAccountManage(): void {
            (bankAccountManageCom.value as any).handleOpen(1)
        }

        const viewWalletDatail = (): void => {
            (walletDetailCom.value as any).handleOpen(1)
        }

        return {
            QueryObj,
            currentPage,
            pageSize,
            totalNum,
            tableList,
            walletDetailCom,
            viewWalletDatail,
            selectedDate,
            statusList,
            bankAccountManage,
            bankAccountManageCom
        }
    }
})
</script>
<style lang='scss' scoped>
.card-box {
    display: flex;
    align-items: center;
    .left-box {
        margin-right: 100px;
        .money {
            font-size: 30px;
            color: #f00;
        }
    }
}
</style>

<template>
    <el-drawer v-model="drawer" title="商户详情" custom-class="drawer-box">
        <ul class="basic-info-box">
            <li>
                <span>商户名称：</span>
                <span>{{ basicDetail.mName || '-' }}</span>
            </li>
            <li>
                <span>联系人：</span>
                <span>{{ basicDetail.contactName || '-' }}</span>
            </li>
            <li>
                <span>手机：</span>
                <span>{{ basicDetail.contactPhone || '-' }}</span>
            </li>
            <li>
                <span>账户总收款：</span>
                <span>{{ basicDetail.totalMoney }}</span>
            </li>
            <li>
                <span>账户总退款：</span>
                <span>{{ basicDetail.refundMoney }}</span>
            </li>
            <li>
                <span>账户费率额：</span>
                <span>{{ basicDetail.serviceRate }}</span>
            </li>
            <li>
                <span>收费扣率：</span>
                <span>{{ basicDetail.chargeRate }}</span>
            </li>
            <li>
                <span>补贴扣率：</span>
                <span>{{ basicDetail.subsidyRate }}</span>
            </li>
        </ul>
        <div class="filter-box">
            <merchantDetailFilter @searchMerchantDetailList="searchMerchantDetailList"></merchantDetailFilter>
        </div>
        <div style="margin-bottom: 30px;">
            <el-button type="primary" @click="handleExportFile">导出Excel</el-button>
            <el-button type="primary" @click="viewStatisData">查看收支统计</el-button>
            <el-button type="primary" @click="viewCloseCountData">查看已结算统计</el-button>
        </div>
        <div class="table-box">
            <merchantDetailTable :data="tableList"></merchantDetailTable>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum"
                :page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" />
        </div>
    </el-drawer>
    <astatisData ref="astatisDataCom"></astatisData>
    <closeCountData ref="closeCountDataCom"></closeCountData>
</template>
<script lang="ts">
import { defineComponent, Ref, ref, reactive } from 'vue'
import { TableListItem, BasicDetailInfo } from '../data'
import { merchantDetailBasicInfo, merchantDetailTableList } from '../api'
import merchantDetailFilter from './merchantDetailFilter.vue'
import merchantDetailTable from './merchantDetailTable.vue'
import astatisData, { Setup as StatisDataSetup } from './statisData.vue'
import closeCountData, { Setup as closeCountDataSetup } from './closeCountData.vue'
import { exportFile } from '@/common/api'

export interface Setup {
    drawer: Ref<boolean>;
    handleOpen: (TableListItem) => void;
    basicDetail: Ref<BasicDetailInfo>;
    getMerchantDetailBasicInfo: (number) => Promise<void>;
    getMerchantDetailTableList: (number) => Promise<void>;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalNum: Ref<number>;
    tableList: Ref<TableListItem[]>;
    handleCurrentChange: (number) => void;
    searchMerchantDetailList: (any) => void;
    viewStatisData: () => void;
    viewCloseCountData: () => void;
    astatisDataCom: Ref<unknown>;
    closeCountDataCom: Ref<unknown>;
    handleExportFile: () => Promise<void>;
}

export default defineComponent({
    name: '',
    components: {
        merchantDetailFilter,
        merchantDetailTable,
        astatisData,
        closeCountData
    },
    setup(): Setup {
        const drawer = ref<boolean>(false);
        const basicDetail = ref({} as BasicDetailInfo)
        const astatisDataCom = ref<unknown>(null);
        const closeCountDataCom = ref<unknown>(null)

        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数 
        const tableList = ref<TableListItem[]>([])  // 表格数据
        const merchantId = ref<number>(-1);
        const projectId = ref<number>();

        const QueryObj = ref<any>({
            payType: '',
            projectType: '',
            payStatus: '',
            payTimeFrom: '',
            payTimeTo: '',
        })

        // 打开抽屉
        const handleOpen = (res: any): void => {
            merchantId.value = res.merchantId;
            res.projectId && (projectId.value = res.projectId)  // 订单列表中的详情要传projectId
            getMerchantDetailBasicInfo();
            getMerchantDetailTableList()
            drawer.value = true;
        };

        // 获取商户详情基本信息
        async function getMerchantDetailBasicInfo(): Promise<void> {
            const { code, data } = await merchantDetailBasicInfo(merchantId.value)
            if (+code === 1000) {
                basicDetail.value = data;
            }
        }

        // 获取商户详情列表信息
        async function getMerchantDetailTableList(): Promise<void> {
            const { code, data } = await merchantDetailTableList(currentPage.value, pageSize.value, Object.assign({}, {
                ...QueryObj.value,
                merchantId: merchantId.value,
                projectId: projectId.value
            }))
            if (+code === 1000) {
                tableList.value = data.list;
                totalNum.value = data.total;
            }
        }

        // 翻页
        const handleCurrentChange = (res: number): void => {
            currentPage.value = res;
            getMerchantDetailTableList()
        };

        // 查询操作
        function searchMerchantDetailList(res: any): void {
            QueryObj.value = res;
            getMerchantDetailTableList()
        }

        const viewStatisData = (): void => {
            (astatisDataCom.value as StatisDataSetup).handleOpen(merchantId.value)
        }

        const viewCloseCountData = (): void => {
            (closeCountDataCom.value as closeCountDataSetup).handleOpen(merchantId.value)
        }

        async function handleExportFile() {
            await exportFile(`/pay-mg/template/exportDetailList`, {
                merchantId: merchantId.value,
                pageNum: currentPage.value,
                pageSize: pageSize.value,
                ...QueryObj.value
            }, '商户详情列表')
        }

        return {
            drawer,
            handleOpen,
            basicDetail,
            getMerchantDetailBasicInfo,
            currentPage,
            pageSize,
            totalNum,
            tableList,
            handleCurrentChange,
            getMerchantDetailTableList,
            searchMerchantDetailList,
            viewStatisData,
            viewCloseCountData,
            astatisDataCom,
            closeCountDataCom,
            handleExportFile
        }
    }
})
</script>
<style lang='scss' scoped>
.basic-info-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;

    &::after {
        height: 0;
        width: 33.3333%;
        // min-width: 345px;
        content: "";
    }

    >li {
        width: 33.3333%;
        margin-bottom: 20px;

        >span:first-child {
            width: 100px;
        }
    }
}

.filter-box {
    margin-bottom: 30px;
}
</style>
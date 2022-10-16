<template>
    <el-drawer v-model="drawer" title="商户详情" custom-class="drawer-box">
        <ul class="basic-info-box">
            <li>
                <span>商户名称：</span>
                <span>{{ basicDetail.mcName || '-' }}</span>
            </li>
            <li>
                <span>联系人：</span>
                <span>{{ basicDetail.contactsName || '-' }}</span>
            </li>
            <li>
                <span>手机：</span>
                <span>{{ basicDetail.contactsPhone || '-' }}</span>
            </li>
            <li>
                <span>账户总收款：</span>
                <span>{{ basicDetail.totalMoney || '-' }}</span>
            </li>
            <li>
                <span>账户总退款：</span>
                <span>{{ basicDetail.refundMoney || '-' }}</span>
            </li>
            <li>
                <span>账户费率额：</span>
                <span>{{ basicDetail.serviceRate || '-' }}</span>
            </li>
            <li>
                <span>收费扣率：</span>
                <span>{{ basicDetail.chargeRate || '-' }}</span>
            </li>
            <li>
                <span>补贴扣率：</span>
                <span>{{ basicDetail.subsidyRate || '-' }}</span>
            </li>
        </ul>
        <div class="filter-box">
            <merchantDetailFilter></merchantDetailFilter>
        </div>
        <div class="table-box">
            <merchantDetailTable :data="tableList"></merchantDetailTable>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum"
                :page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" />
        </div>
    </el-drawer>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from 'vue'
import { TableListItem, BasicDetailInfo } from '../data'
import { merchantDetailBasicInfo } from '../api'
import merchantDetailFilter from './merchantDetailFilter.vue'
import merchantDetailTable from './merchantDetailTable.vue'

export interface Setup {
    drawer: Ref<boolean>;
    handleClose: () => void;
    handleOpen: (TableListItem) => void;
    basicDetail: Ref<BasicDetailInfo>;
    getMerchantDetailBasicInfo: (number) => Promise<void>;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalNum: Ref<number>;
    tableList: Ref<TableListItem[]>;
    handleCurrentChange: (number) => void
}

export default defineComponent({
    name: '',
    components: {
        merchantDetailFilter,
        merchantDetailTable,
    },
    setup(): Setup {
        const drawer = ref<boolean>(false);
        const basicDetail = ref({} as BasicDetailInfo)

        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数 
        const tableList = ref<TableListItem[]>([])  // 表格数据

        // 关闭抽屉回调
        const handleClose = (): void => {
            drawer.value = false;
        };

        // 打开抽屉
        const handleOpen = (res: TableListItem): void => {
            getMerchantDetailBasicInfo(res.merchantId)
            drawer.value = true;
        };

        // 获取商户详情基本信息
        async function getMerchantDetailBasicInfo(merchantId: number): Promise<void> {
            const { code, data } = await merchantDetailBasicInfo(merchantId)
            if (+code === 1000) {
                basicDetail.value = data;
            }
        }

        // 翻页
        const handleCurrentChange = (res: number): void => {
            currentPage.value = res;
        };

        return {
            drawer,
            handleClose,
            handleOpen,
            basicDetail,
            getMerchantDetailBasicInfo,
            currentPage,
            pageSize,
            totalNum,
            tableList,
            handleCurrentChange
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
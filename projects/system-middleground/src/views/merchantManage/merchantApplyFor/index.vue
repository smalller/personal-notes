<template>
    <div class="indexlayout-main-conent">
        <el-card shadow="never">
            <el-form :model="QueryObj" class="filter-box" label-position="right">
                <el-form-item label="商户名称：">
                    <el-input clearable v-model="QueryObj.mName" placeholder="请输入商户名称" />
                </el-form-item>
                <el-form-item label="联系人：">
                    <el-input clearable v-model="QueryObj.contactName" placeholder="请输入联系人" />
                </el-form-item>
                <el-form-item label="手机：">
                    <el-input clearable v-model="QueryObj.contactPhone" placeholder="请输入手机" />
                </el-form-item>
                <el-form-item label="申请时间：">
                    <el-date-picker v-model="QueryObj.createTime" type="date" placeholder="请选择时间" />
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="QueryObj.status" placeholder="全部">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="getMerchantList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="addMerchant">新增</el-button>
                </el-form-item>
            </el-form>
            <tableList :data="tableList"></tableList>
            <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum"
                :page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue'
import tableList from './components/tableList.vue'
import { QueryObj, TableListItem } from './data'
import { merchantApplyList } from './api'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'
import { statusList } from './static'
import { KeyValue } from '@/common/data'
import micell from 'micell'
import { useRouter } from 'vue-router'

interface Setup {
    QueryObj: QueryObj;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalNum: Ref<number>;
    tableList: Ref<TableListItem[]>;
    getMerchantList: () => Promise<void>;
    handleCurrentChange: (number) => void;
    addMerchant: () => void;
    statusList: KeyValue[];
}

export default defineComponent({
    name: '',
    components: {
        tableList,
        bankCardInfo,
        basicInfo,
        idCardInfo,
    },
    setup(): Setup {
        const QueryObj = reactive<QueryObj>({
            mName: '',
            contactName: '',
            contactPhone: '',
            status: '',
            createTime: ''
        })
        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数 
        const tableList = ref<TableListItem[]>([])  // 表格数据
        const router = useRouter()

        async function getMerchantList(): Promise<void> {
            if (QueryObj.createTime) {
                QueryObj.createTime = micell.date.format(QueryObj.createTime, "YYYY-MM-DD")
            } else {
                QueryObj.createTime = ''
            }
            const { code, data } = await merchantApplyList(currentPage.value, pageSize.value, Object.assign({}, {
                ...QueryObj
            }));
            if (+code === 1000) {
                tableList.value = data.list;
                totalNum.value = data.total;
            }
        }
        getMerchantList()

        // 翻页
        const handleCurrentChange = (res: number): void => {
            currentPage.value = res;
            getMerchantList();
        };

        const addMerchant = (): void => {
            router.push('/addMerchant')
        }

        return {
            QueryObj,
            currentPage,
            pageSize,
            totalNum,
            tableList,
            getMerchantList,
            handleCurrentChange,
            addMerchant,
            statusList,
        }
    }
})
</script>
<style lang='scss' scoped>
.filter-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .el-form-item {
        margin-right: 20px;
    }
}
</style>
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
                <el-form-item>
                    <el-button type="primary" @click="getMerchantList">查询</el-button>
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
import { merchantList } from './api'
import bankCardInfo from '@/components/merchant/bankCardInfo.vue'
import basicInfo from '@/components/merchant/basicInfo.vue'
import idCardInfo from '@/components/merchant/idCardInfo.vue'

interface Setup {
    QueryObj: QueryObj;
    currentPage: Ref<number>;
    pageSize: Ref<number>;
    totalNum: Ref<number>;
    tableList: Ref<TableListItem[]>;
    getMerchantList: () => Promise<void>;
    handleCurrentChange: (number) => void;
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
            contactPhone: ''
        })
        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数 
        const tableList = ref<TableListItem[]>([])  // 表格数据

        async function getMerchantList(): Promise<void> {
            const { code, data } = await merchantList(currentPage.value, pageSize.value, Object.assign({}, {
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

        return {
            QueryObj,
            currentPage,
            pageSize,
            totalNum,
            tableList,
            getMerchantList,
            handleCurrentChange,
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
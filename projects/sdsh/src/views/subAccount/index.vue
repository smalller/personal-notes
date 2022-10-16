<template>
    <div class="indexlayout-main-conent">
        <el-card shadow="never">
            <el-form :model="QueryObj" class="filter-box" label-position="right">
                <el-form-item label="入账主体名称：">
                    <el-input clearable v-model="QueryObj.insNameCn" placeholder="请输入" />
                </el-form-item>
                <el-form-item label="申请日期：">
                    <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
                        start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="审核状态：">
                    <el-select v-model="QueryObj.applyStatus" placeholder="全部">
                        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入账主体类型：">
                    <el-select v-model="QueryObj.isIndividualMchnt" placeholder="全部">
                        <el-option v-for="item in inAccType" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button type="success" @click="handleSignContact">去签约</el-button>
                    <el-button type="success" @click="editSubAcc">新增分账账户</el-button>
                </el-form-item>
            </el-form>
            <tableList :data="tableList" @editComplete="getMerchantList"></tableList>
            <!-- <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum"
                :page-size="pageSize" :current-page="currentPage" @current-change="handleCurrentChange" /> -->
        </el-card>
        <editSubAccCom ref="editSubAccCom" @editComplete="getMerchantList"></editSubAccCom>
        <signContact ref="signContactCom"></signContact>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue'
import tableList from './components/tableList.vue'
import { statusList, inAccType } from './static'
import micell from 'micell'
import editSubAccCom from './components/editSubAccCom.vue'
import { funSplitList } from './api'
import signContact from './components/signContact.vue'
import { ElMessage } from 'element-plus'

export default defineComponent({
    name: '',
    components: {
        tableList,
        editSubAccCom,
        signContact
    },
    setup() {
        const QueryObj = reactive<any>({
            insNameCn: '',
            applyDateBegin: '',
            applyDateEnd: '',
            applyStatus: '',
            isIndividualMchnt: ''
        })
        const selectedDate = ref(null as any);
        const currentPage = ref<number>(1); // 当前页码
        const pageSize = ref<number>(20); // 每页展示条数
        const totalNum = ref<number>(0); // 表格总条数 
        const tableList = ref<any>([])  // 表格数据
        const editSubAccCom = ref<unknown>(null)
        const signContactCom = ref<unknown>(null)

        async function getMerchantList(): Promise<void> {
            const { code, data } = await funSplitList(currentPage.value, pageSize.value, Object.assign({}, {
                ...QueryObj
            }));
            if (+code === 1000) {
                tableList.value = data;
                // totalNum.value = data.total;
            }
        }
        getMerchantList()

        // 转换时间格式
        const selectDate = () => {
            if (selectedDate.value) {
                QueryObj.applyDateBegin = micell.date.format(selectedDate.value[0], 'YYYY-MM-DD');
                QueryObj.applyDateEnd = micell.date.format(selectedDate.value[1], 'YYYY-MM-DD');
            } else {
                QueryObj.applyDateBegin = '';
                QueryObj.applyDateEnd = '';
            }
        };

        const handleSearch = (): void => {
            selectDate();
            getMerchantList();
        };

        // 翻页
        const handleCurrentChange = (res: number): void => {
            currentPage.value = res;
            getMerchantList();
        };

        // 新增分账
        function editSubAcc(row: any): void {
            (editSubAccCom.value as any).handleOpen(1);
        }

        // 签约
        function handleSignContact(): void {
            (signContactCom.value as any).handleOpen(tableList.value);
        }

        return {
            QueryObj,
            currentPage,
            pageSize,
            totalNum,
            tableList,
            getMerchantList,
            handleCurrentChange,
            statusList,
            inAccType,
            editSubAccCom,
            editSubAcc,
            selectedDate,
            handleSearch,
            signContactCom,
            handleSignContact,
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
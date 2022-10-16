<template>
    <div class="merchant-detail-filter-select-box">
        <ul>
            <li>
                <span class="label-title">支付方式</span>
                <el-select v-model="QueryObj.payType" placeholder="全部">
                    <el-option v-for="item in paywayList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </li>
            <li>
                <span class="label-title">收费类型</span>
                <el-select v-model="QueryObj.projectType" placeholder="全部">
                    <el-option v-for="item in projectTypeList" :key="item.value" :label="item.label"
                        :value="item.value"></el-option>
                </el-select>
            </li>
            <li>
                <span class="label-title">支付状态</span>
                <el-select v-model="QueryObj.payStatus" placeholder="全部">
                    <el-option v-for="item in payStatusList" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </li>
        </ul>
        <ul>
            <li>
                <span class="label-title">交易时间</span>
                <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
                    start-placeholder="开始日期" end-placeholder="结束日期" @change="handleChangeDate"></el-date-picker>
            </li>
            <li>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue'
import { paywayList, projectTypeList, payStatusList } from '../static'
import { KeyValue } from '@/common/data'
import micell from 'micell'

interface Setup {
    paywayList: KeyValue[];
    projectTypeList: KeyValue[];
    payStatusList: KeyValue[];
    selectedDate: Ref<Date[] | string>;
    handleSearch: () => void;
    QueryObj: any;
    handleChangeDate: (string) => void;
}

export default defineComponent({
    name: '',
    setup(props, { emit }): Setup {
        const selectedDate = ref([] as Date[] | "");

        const QueryObj = reactive<any>({
            payType: '',
            projectType: '',
            payStatus: '',
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

        const handleSearch = (): void => {
            emit('searchMerchantDetailList', QueryObj)
        }


        return {
            paywayList,
            projectTypeList,
            payStatusList,
            selectedDate,
            handleSearch,
            QueryObj,
            handleChangeDate
        }
    }
})
</script>
<style lang='scss'>
.merchant-detail-filter-select-box {
    >ul {
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
}
</style>
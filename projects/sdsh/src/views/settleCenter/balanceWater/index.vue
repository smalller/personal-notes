<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="支付项目：">
          <el-input clearable v-model="QueryObj.projectName" placeholder="支付项目" />
        </el-form-item>
        <el-form-item label="交易订单号：">
          <el-input clearable v-model="QueryObj.paymentNo" placeholder="交易订单号" />
        </el-form-item>
        <el-form-item label="金额范围：">
          <div style="display: flex">
            <el-input clearable v-model="QueryObj.itemMoneyBegin" placeholder="金额范围" />-
            <el-input clearable v-model="QueryObj.itemMoneyEnd" placeholder="金额范围" />
          </div>
        </el-form-item>
        <el-form-item label="交易时间：">
          <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
            start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="支付方式：">
          <el-select v-model="QueryObj.payType" placeholder="全部">
            <el-option v-for="item in payTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付场景：">
          <el-select v-model="QueryObj.projectType" placeholder="全部">
            <el-option v-for="item in projectTypeList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易类型：">
          <el-select v-model="QueryObj.payStatus" placeholder="全部">
            <el-option v-for="item in payStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="handleExportFile">导出Excel</el-button>
        </el-form-item>
      </el-form>
      <tableList :data="tableList"></tableList>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import tableList from "./components/tableList.vue";
import { QueryObj, TableListItem } from "./data";
import { payTypeList, projectTypeList, payStatusList } from "./static";
import { KeyValue } from "@/common/types";
import { waterList } from "./api";
import micell from "micell";
import { exportFile } from "@/common/api";

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  merchantAllInfoCom: Ref<unknown>;
  selectedDate: Ref<any>;
  payTypeList: KeyValue[];
  projectTypeList: KeyValue[];
  payStatusList: KeyValue[];
  handleSearch: () => void;
  handleExportFile: () => Promise<void>;
}

export default defineComponent({
  name: "",
  components: {
    tableList,
  },
  setup(): Setup {
    const QueryObj = reactive<QueryObj>({
      projectName: "",
      paymentNo: "",
      itemMoneyBegin: "",
      itemMoneyEnd: "",
      payTimeBegin: "",
      payTimeEnd: "",
      payType: "",
      projectType: "",
      payStatus: "",
    });
    const selectedDate = ref(null as any);
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await waterList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            ...QueryObj,
          }
        )
      );
      if (+code === 1000) {
        tableList.value = data.list;
        totalNum.value = data.total;
      }
    }
    getMerchantList();

    // 转换时间格式
    const selectDate = () => {
      if (selectedDate.value) {
        QueryObj.payTimeBegin = micell.date.format(
          selectedDate.value[0],
          "YYYY-MM-DD"
        );
        QueryObj.payTimeEnd = micell.date.format(
          selectedDate.value[1],
          "YYYY-MM-DD"
        );
      } else {
        QueryObj.payTimeBegin = "";
        QueryObj.payTimeEnd = "";
      }
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const handleSearch = (): void => {
      selectDate();
      getMerchantList();
    };

    async function handleExportFile() {
      await exportFile(
        `/pay-merchant/settle/listDown`,
        {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          ...QueryObj,
        },
        "收支流水列表"
      );
    }

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      merchantAllInfoCom,
      selectedDate,
      payTypeList,
      projectTypeList,
      payStatusList,
      handleSearch,
      handleExportFile,
    };
  },
});
</script>
<style lang="scss" scoped>
.filter-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-form-item {
    margin-right: 20px;
  }
}
</style>

<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="通知名称：">
          <el-input v-model="QueryObj.title"></el-input>
        </el-form-item>
        <el-form-item label="发布人：">
          <el-input v-model="QueryObj.createUserId"></el-input>
        </el-form-item>
        <el-form-item label="发布时间：">
          <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
            start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addNotice">新增通知</el-button>
        </el-form-item>
      </el-form>
      <tableList :data="tableList"></tableList>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <addNotice ref="addNoticeCom" @addNoticeComplete="getMerchantList"></addNotice>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import tableList from "./components/tableList.vue";
import { QueryObj, TableListItem } from "./data";
import { statusList } from "./static";
import { KeyValue } from "@/common/types";
import addNotice from "./components/addNotice.vue";
import micell from 'micell';
import { informList } from './api'

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  addNoticeCom: Ref<unknown>;
  selectedDate: Ref<any>;
  statusList: KeyValue[];
  addNotice: () => void;
  handleSearch: () => void;
}

export default defineComponent({
  name: "",
  components: {
    tableList,
    addNotice,
  },
  setup(): Setup {
    const QueryObj = reactive<QueryObj>({
      beginCreateTime: "",
      endCreateTime: '',
      createUserId: '',
      title: ''
    });
    const selectedDate = ref(null as any);
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const addNoticeCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await informList(currentPage.value, pageSize.value, Object.assign({}, {
        ...QueryObj
      }));
      if (+code === 1000) {
        tableList.value = data.list;
        totalNum.value = data.total;
      }
    }
    getMerchantList();

    const handleSearch = (): void => {
      selectDate();
      getMerchantList();
    };

    // 转换时间格式
    const selectDate = () => {
      if (selectedDate.value) {
        QueryObj.beginCreateTime = micell.date.format(selectedDate.value[0], 'YYYY-MM-DD');
        QueryObj.endCreateTime = micell.date.format(selectedDate.value[1], 'YYYY-MM-DD');
      } else {
        QueryObj.beginCreateTime = '';
        QueryObj.endCreateTime = '';
      }
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const addNotice = (): void => {
      (addNoticeCom.value as any).handleOpen(1);
    };

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      addNoticeCom,
      selectedDate,
      statusList,
      addNotice,
      handleSearch
    };
  },
});
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

<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="姓名：">
          <el-input v-model="QueryObj.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input v-model="QueryObj.account"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select v-model="QueryObj.status" placeholder="全部">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMerchantList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addStaff">新增</el-button>
        </el-form-item>
      </el-form>
      <tableList :data="tableList" @editComplete="getMerchantList"></tableList>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <addStaff ref="addStaffCom" @editComplete="getMerchantList"></addStaff>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue';
import tableList from './components/tableList.vue';
import { QueryObj, TableListItem } from './data';
import { peopleList } from './api';
import bankCardInfo from '@/components/merchant/bankCardInfo.vue';
import basicInfo from '@/components/merchant/basicInfo.vue';
import idCardInfo from '@/components/merchant/idCardInfo.vue';
import { statusList } from './static';
import { KeyValue } from '@/common/data';
import addStaff, { Setup as AddStaffSetup } from './components/addStaff.vue';

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  addStaffCom: Ref<unknown>;
  addStaff: () => void;
  editStaff: () => void;
  selectedDate: Ref<Date[] | string>;
  statusList: KeyValue[];
}

export default defineComponent({
  name: '',
  components: {
    tableList,
    bankCardInfo,
    basicInfo,
    idCardInfo,
    addStaff,
  },
  setup(): Setup {
    const QueryObj = reactive<QueryObj>({
      userName: '',
      account: '',
      status: '',
    });
    const selectedDate = ref([] as Date[] | '');
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const addStaffCom = ref<unknown>(null);
    async function getMerchantList(): Promise<void> {
      const { code, data } = await peopleList(
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

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const addStaff = (): void => {
      (addStaffCom.value as AddStaffSetup).handleOpen(0);
    };
    const editStaff = (): void => {
      (addStaffCom.value as AddStaffSetup).handleOpen(1);
    };

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      addStaffCom,
      addStaff,
      selectedDate,
      statusList,
      editStaff,
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
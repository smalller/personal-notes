<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="姓名：">
          <el-input v-model="QueryObj.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="状态：">
          <el-select placeholder="全部" v-model="QueryObj.status">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMerchantList">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="settingRoles">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="dictLabel" label="银行名称" />
        <el-table-column prop="itemName" label="支行名称" />
        <el-table-column prop="contactPerson" label="联系人" />
        <el-table-column prop="contactPhone" label="联系电话" />
        <el-table-column prop="account" label="登录账号" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <div> <span> {{ row.status == 1 ? '禁用' : "正常" }}</span></div>

          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="fixData(row)">修改</el-button>
            <el-button type="text" @click="setBankStatus(row)">{{ +row.status === 1 ? '解冻' : '冻结' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <addStaff ref="addStaffCom" @updateStaffComplete="getMerchantList"></addStaff>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue';
import { QueryObj, TableListItem } from './data';
import { bankList, setManageStatus } from './api';
import bankCardInfo from '@/components/merchant/bankCardInfo.vue';
import basicInfo from '@/components/merchant/basicInfo.vue';
import idCardInfo from '@/components/merchant/idCardInfo.vue';
import { statusList } from './static';
import { KeyValue } from '@/common/data';
import addStaff, { Setup as AddStaffSetup } from './components/addStaff.vue';
import { ElMessage } from 'element-plus';

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  addStaffCom: Ref<unknown>;
  settingRoles: () => void;
  selectedDate: Ref<Date[] | string>;
  statusList: KeyValue[];
  fixData: (row: any) => void;
  setBankStatus: () => Promise<void>;
}

export default defineComponent({
  name: '',
  components: {
    bankCardInfo,
    basicInfo,
    idCardInfo,
    addStaff,
  },
  setup(): Setup {
    const QueryObj = reactive<any>({
      contactPerson: '',
      status: '',
    });
    const selectedDate = ref([] as Date[] | '');
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const addStaffCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await bankList(
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
        tableList.value = data;
        totalNum.value = data.length;
      }
    }
    getMerchantList();

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const settingRoles = (): void => {
      (addStaffCom.value as AddStaffSetup).handleOpen(1);
    };

    const fixData = (row: any): void => {
      (addStaffCom.value as AddStaffSetup).handleOpen(2, row);
    };

    const setBankStatus = async (row: any): Promise<void> => {
      console.log(row);
      let obj = {
        id: row.sid,
        status: -1
      }
      if (+row.status === 0) {
        obj.status = 1;
      } else {
        obj.status = 0;
      }
      const { code } = await setManageStatus(obj)
      if (+code === 1000) {
        getMerchantList();
        ElMessage.success('修改成功')
      }
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
      settingRoles,
      selectedDate,
      statusList,
      fixData,
      setBankStatus
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

.add-roles-box {
  >li {
    display: flex;
    align-items: center;

    >span {
      width: 90px;
    }
  }

  .botom-btn-box {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
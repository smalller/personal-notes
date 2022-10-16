<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="姓名：">
          <el-input v-model="QueryObj.contactPerson"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input v-model="QueryObj.contactMobile"></el-input>
        </el-form-item>
        <el-form-item label="审核类型：">
          <el-select placeholder="全部" v-model="QueryObj.status">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select placeholder="全部" v-model="QueryObj.bankStatus">
            <el-option v-for="item in bankStatusList" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMerchantList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="mName" label="商户名称" />
        <el-table-column prop="contactAddr" label="商户地址" />
        <el-table-column prop="contactName" label="联系人" />
        <el-table-column prop="contactMobile" label="手机" />
        <el-table-column label="申请时间">
          <template #default="{ row }">
            <div> <span> {{ micell.date.format(row.createTime, "YYYY-MM-DD") }}</span></div>

          </template>
        </el-table-column>
        <el-table-column label="审核时间">
          <template #default="{ row }">
            <div v-if="row.examineTime"> <span> {{ micell.date.format(row.examineTime, "YYYY-MM-DD") }}</span></div>
          </template>
        </el-table-column>
        <el-table-column label="审核类型">
          <template #default="{ row }">
            <span> {{ row.statusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审核状态">
          <template #default="{ row }">
            <span>{{ row.bankStatusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="check(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <el-dialog v-model="dialogVisible" title="审核详情" width="80%">
      <ul class="mer-all-info-box">
        <li>
          <basicInfo :basicInfoData="checkData" flag="2" ref="basicInfoCom"></basicInfo>
        </li>
        <li>
          <idCardInfo :idCardInfoData="checkData" flag="2" ref="idCardInfoCom"></idCardInfo>
        </li>
        <li>
          <bankCardInfo :bankCardInfoData="checkData" flag="2" ref="bankCardInfoCom"></bankCardInfo>
        </li>
        <li class="botom-btn-box" style="margin:auto;margin-top:20px">
          <el-button @click="dialogVisible = false">取消</el-button>

        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue';
import { QueryObj, TableListItem } from './data';
import { checkList, checkInfo } from './api';
import bankCardInfo from '@/components/merchant/bankCardInfo.vue';
import basicInfo from '@/components/merchant/basicInfo.vue';
import idCardInfo from '@/components/merchant/idCardInfo.vue';
import { statusList, bankStatusList } from './static';
import { KeyValue } from '@/common/data';
import micell from 'micell';

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  selectedDate: Ref<Date[] | string>;
  statusList: KeyValue[];
  bankStatusList: KeyValue[];
  addRoles: () => void;
  dialogVisible: Ref<boolean>;
  statusChange: (status: string) => string
}

export default defineComponent({
  name: '',
  components: {
    bankCardInfo,
    basicInfo,
    idCardInfo,
  },
  setup(): Setup {
    const QueryObj = reactive<any>({
      contactPerson: '',
      contactMobile: '',
      bankStatus: '',
      status: '',
    });
    const selectedDate = ref([] as Date[] | '');
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const dialogVisible = ref<boolean>(false);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await checkList(
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
    const checkData = ref({} as any);

    const check = async (datas: any): Promise<void> => {
      const { code, data } = await checkInfo(datas.id);
      if (code === 1000) {
        checkData.value = { ...data };
      }
      dialogVisible.value = true;
    };

    getMerchantList();

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const addRoles = (): void => {
      dialogVisible.value = true;
    };

    const statusChange = (status: string): string => {
      let res = '';
      switch (status) {
        case '1':
          res = '新商户审核';
          break;
        case '2':
          res = '添加银行卡审核';
          break;
        case '3':
          res = '变更体现银行审核';
          break;
      }
      return res;
    }

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      selectedDate,
      statusList,
      addRoles,
      dialogVisible,
      micell,
      checkData,
      check,
      bankStatusList,
      statusChange
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
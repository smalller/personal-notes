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
            <span> {{ micell.date.format(row.createTime, "YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费扣率">
          <template #default="{ row }">
            <span> {{ row.chargeRate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="补贴扣率">
          <template #default="{ row }">
            <span> {{ row.subsidyRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="createName" label="审核人" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="check(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <el-drawer v-model="dialogVisible" title="商户详情" custom-class="drawer-box">
      <ul class="mer-all-info-box">
        <li>
          <basicInfo flag="2" ref="basicInfoCom" :basicInfoData="merchantData" :isCheckRate="true"></basicInfo>
        </li>
        <li>
          <idCardInfo flag="2" ref="idCardInfoCom" :idCardInfoData="merchantData"></idCardInfo>
        </li>
        <li>
          <bankCardInfo flag="2" ref="bankCardInfoCom" :bankCardInfoData="merchantData"></bankCardInfo>
        </li>
        <li class="botom-btn-box">
          <el-button type="success" @click="handleClick(1)">审核通过</el-button>
          <el-button type="danger" @click="handleClick(0)">审核拒绝</el-button>
          <el-button @click="handleClose">取消</el-button>
        </li>
      </ul>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from 'vue';
import { QueryObj, TableListItem } from './data';
import { checkList, checkInfo, updateBankAudit } from './api';
import bankCardInfo from '@/components/merchant/bankCardInfo.vue';
import basicInfo from '@/components/merchant/basicInfo.vue';
import idCardInfo from '@/components/merchant/idCardInfo.vue';
import { statusList } from './static';
import micell from 'micell';
import { ElMessage } from 'element-plus';

export default defineComponent({
  name: '',
  components: {
    bankCardInfo,
    basicInfo,
    idCardInfo,
  },
  setup() {
    const QueryObj = reactive<QueryObj>({
      contactPerson: '',
      contactMobile: '',
    });
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const dialogVisible = ref<boolean>(false);
    const merchantData = ref<any>(null)
    const chargeRateOld = ref()

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
    getMerchantList();

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };


    const check = async (row: any) => {
      const { code, data } = await checkInfo(row.id);
      if (code === 1000) {
        merchantData.value = data;
        chargeRateOld.value = JSON.parse(JSON.stringify(merchantData.value)).chargeRate
        dialogVisible.value = true;
      }
    };

    async function handleClick(status: number) {
      const data = {
        chargeRateOld: chargeRateOld.value,
        chargeRate: merchantData.value.chargeRate,
        subsidyRate: merchantData.value.subsidyRate,
        status,
        merchantId: merchantData.value.mId,
        bankId: merchantData.value.bankId
      }
      const { code } = await updateBankAudit(data)
      if (+code === 1000) {
        dialogVisible.value = false;
        ElMessage.success('操作成功')
        getMerchantList();
      }
    }

    function handleClose() {
      dialogVisible.value = false
    }

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      check,
      statusList,
      dialogVisible,
      micell,
      handleClose,
      merchantData,
      handleClick
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

.mer-all-info-box {
  >li {
    margin-bottom: 20px;

    &.botom-btn-box {
      text-align: right;
    }
  }
}
</style>
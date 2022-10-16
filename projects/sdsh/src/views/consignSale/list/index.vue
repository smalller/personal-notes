<template>
  <div class="">
    <el-card
      shadow="never"
      class="cus-card"
      style="margin-bottom: 15px"
      :body-style="{ 'padding-bottom': '0' }"
    >
      <el-form
        :model="QueryObj"
        class="filter-box"
        label-position="right"
      >
        <el-form-item label="项目名称：">
          <el-input
            clearable
            v-model="QueryObj.mcName"
            placeholder="请输入商户名称"
          />
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="开始时间"
          />-
          <el-date-picker
            v-model="value1"
            type="date"
            placeholder="截止时间"
          />
          <!-- <el-input
            clearable
            v-model="QueryObj.contactsName"
            placeholder="请输入联系人"
          /> -->
        </el-form-item>
        <el-form-item label="状态">
          <type-select></type-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="getMerchantList"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-button
        type="success"
        style="margin-bottom:5px"
        @click="getMerchantList"
      >发布收费</el-button>
      <tableList :data="tableList"></tableList>
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="totalNum"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- <merchantAllInfo
      ref="merchantAllInfoCom"
      title="新增商户"
      flag="1"
    ></merchantAllInfo> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import tableList from "./components/tableList.vue";
import { QueryObj, TableListItem } from "./data";
import { merchantList } from "./api";
import TypeSelect from "../components/TypeSelect.vue";
// import bankCardInfo from "@/components/merchant/bankCardInfo.vue";
// import basicInfo from "@/components/merchant/basicInfo.vue";
// import idCardInfo from "@/components/merchant/idCardInfo.vue";
// import merchantAllInfo, { Setup as MerAllInfoSetup } from '../components/merchantAllInfo.vue';

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  merchantAllInfoCom: Ref<unknown>;
  addMerchant: () => void;
}

export default defineComponent({
  name: "",
  components: {
    tableList,
    TypeSelect,
    // bankCardInfo,
    // basicInfo,
    // idCardInfo,
    // merchantAllInfo,
  },
  setup(): Setup {
    const QueryObj = reactive<QueryObj>({
      mcName: "",
      contactsName: "",
      contactsPhone: "",
    });
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await merchantList(
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

    const addMerchant = (): void => {
      // (merchantAllInfoCom.value as MerAllInfoSetup).handleOpen(1);
    };

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      merchantAllInfoCom,
      addMerchant,
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
.income {
  display: flex;
  margin-bottom: 10px;
  span {
    font-weight: bold;
  }
  p {
    color: red;
    display: contents;
  }
}
</style>
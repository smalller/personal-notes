<template>
  <div class="">
    <el-card shadow="never" class="cus-card" style="margin-bottom: 15px" :body-style="{ 'padding-bottom': '0' }">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="支付时间">
          <el-date-picker type="daterange" v-model="QueryObj.times" @change="timerChange" range-separator="-"
            start-placeholder="请选择开始时间" end-placeholder="请选择结束时间" />
          <!-- <el-input
            clearable
            v-model="QueryObj.contactsName"
            placeholder="请输入联系人"
          /> -->
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="QueryObj.payType">
            <el-option label="全部" value="" />
            <el-option label="支付宝" value="1" />
            <el-option label="微信" value="2" />
            <el-option label="其他" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="缴费状态">
          <el-select v-model="QueryObj.payStatus">
            <el-option label="全部" value="" />
            <el-option label="支付未完成" value="0" />
            <el-option label="待支付" value="1" />
            <el-option label="已支付" value="2" />
            <el-option label="支付失败" value="3" />
            <el-option label="退款" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-input clearable v-model="QueryObj.projectName" placeholder="请输入商户名称" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-button style="float:right;margin-bottom:5px" @click="exportExcel" type="primary">导出Excel</el-button>
      <span class="income">收款总额：<p>{{ totalInfo.totalMoneyAll }}</p>元，共<p>{{ totalInfo.totalMoneyCount }}</p>笔
        （{{ totalInfo.payType }}：{{ totalInfo.totalMoneyAll }}元）</span>
      <tableList :data="tableList"></tableList>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
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
import { exportDetailList, list, ListInfo } from "./api";
import micell from "micell";
import bus from "@/utils/bus";
import dayjs from "dayjs";
interface Setup {
  QueryObj: Ref<any>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  merchantAllInfoCom: Ref<unknown>;
  addMerchant: () => void;
  totalInfo: any;
}

export default defineComponent({
  name: "",
  components: {
    tableList,
  },
  props: {
    projectName: {
      type: String,
      default: "",
    }
  },
  setup(props) {

    bus.$on('updateRemarkSuccess', () => {
      query()
    })

    const QueryObj = ref({
      payStatus: "2",
      payTimeFrom: "",
      payTimeTo: "",
      payType: "",
      projectName: props.projectName,
      times: []
    });
    const totalInfo = ref<any>({});
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);
    async function getListInfo(): Promise<void> {
      const params = Object.assign(
        {},
        {
          ...QueryObj.value,
        }
      )
      if (params.times) {
        delete (params as any).times
      }
      const { code, data } = await ListInfo(params);
      if (+code === 1000) {
        totalInfo.value = data;
      }
    }
    getListInfo();
    async function getMerchantList(): Promise<void> {
      const params = Object.assign(
        {},
        {
          ...QueryObj.value,
        }
      )
      if (params.times) {
        delete (params as any).times
      }
      const { code, data } = await list(
        currentPage.value,
        pageSize.value,
        params
      );
      if (+code === 1000) {
        tableList.value = data.list;
        totalNum.value = data.total;
      }
    }
    getMerchantList();

    // 转换时间格式
    const selectDate = () => {
      if (QueryObj.value.payTimeFrom && QueryObj.value.payTimeTo) {
        QueryObj.value.payTimeFrom = micell.date.format(QueryObj.value.payTimeFrom, 'YYYY-MM-DD');
        QueryObj.value.payTimeTo = micell.date.format(QueryObj.value.payTimeTo, 'YYYY-MM-DD');
      } else {
        QueryObj.value.payTimeFrom = '';
        QueryObj.value.payTimeTo = '';
      }
    };

    //查询
    const query = () => {
      selectDate()
      getMerchantList();
      getListInfo()
    }

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const exportExcel = () => {
      exportDetailList(Object.assign(
        {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
        },
        {
          ...QueryObj.value,
        }
      )).then(res => {
        micell.download((res as unknown as Blob), '交易明细.xlsx')
      })
    }

    const addMerchant = (): void => {
      // (merchantAllInfoCom.value as MerAllInfoSetup).handleOpen(1);
    };

    //选择二维码生效时间
    const timerChange = (e) => {
      if (e) {
        QueryObj.value.payTimeFrom = dayjs(e[0]).format("YYYY-MM-DD HH:mm:ss");
        QueryObj.value.payTimeTo = dayjs(e[1]).format("YYYY-MM-DD") + " 23:59:59";

        // (formEl.value as any).validateField("times", () => null);
        // delete QueryObj.value.times;
      } else {
        QueryObj.value.payTimeFrom = "";
        QueryObj.value.payTimeTo = "";
      }
    };

    return {
      QueryObj,
      timerChange,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      merchantAllInfoCom,
      addMerchant,
      totalInfo,
      query,
      exportExcel
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

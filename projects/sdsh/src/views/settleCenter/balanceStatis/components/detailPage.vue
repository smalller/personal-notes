<template>
  <el-drawer v-model="drawer" title="收支明细" custom-class="drawer-box">
    <el-form :model="QueryObj" class="filter-box" label-position="right">
      <el-form-item label="支付完成时间：">
        <el-date-picker v-model="selectedDate" unlink-panels type="daterange" range-separator="~"
          start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="handleExportStaff">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 12px">
      收款总额<span>{{ statData?.receive || 0 }}</span>元, 共<span>{{ statData?.receiveCount }}</span>笔
      <p style="margin: 6px 0" v-for="(item, index) in statData?.dateList" :key="index">
        {{ item.payTypeStr }}：{{ item.payMoney }}元
      </p>
    </div>
    <div>
      <el-table :data="tableList" border style="width: 100%">
        <el-table-column prop="payTime" label="支付完成时间">
          <template #default="{ row }">
            {{ dayjs(row.beginTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称" />
        <el-table-column prop="payMoney" label="交费金额" />
        <el-table-column prop="payTypeStr" label="支付方式" />
        <el-table-column prop="remark" label="备注">
          <template #default="{ row }">
            <template v-if="+row.projectType === 1 && row.remark">
              <div v-for="(item, index) in JSON.parse(row.remark)" :key="index">
                {{ item.registerName }} : {{ item.registerValue }}
              </div>
            </template>
            <template v-else>
              {{ row.remark }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button type="text" @click="viewDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </div>
  </el-drawer>
  <el-dialog v-model="dialogVisible" title="交费详情">
    <ul class="detail-data">
      <li>
        交易时间：
        <span>{{ detailDataList.payTime && dayjs(detailDataList.payTime).format('YYYY-MM-DD HH:mm:ss') }} </span>
      </li>
      <li>
        交易订单号：
        <span>{{ detailDataList.orderNumber }}</span>
      </li>
      <li>
        项目名称：
        <span>{{ detailDataList.projectName }}</span>
      </li>
      <li>
        交费项目：
        <span>{{ detailDataList.itemName }}</span>
      </li>
      <li>
        交费金额：
        <span>{{ detailDataList.totalMoney }}</span>
      </li>
      <li>
        交费状态：
        <span>{{ detailDataList.payStatus }}</span>
      </li>
      <li>
        支付方式：
        <span>{{ detailDataList.payType }}</span>
      </li>
    </ul>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import micell from "micell";
import { statisticsDetailList, statisticsDetailTotal, payDetail } from "../api";
import { exportFile } from "@/common/api";
import dayjs from "dayjs";

export default defineComponent({
  name: "",
  setup() {
    const drawer = ref<boolean>(false);
    const selectedDate = ref(null as any);
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<any[]>([]); // 表格数据
    const dialogVisible = ref<boolean>(false);
    const detailDataList = ref<any[]>([]);
    const statData = ref<any>();
    const payType = ref<any>()

    const QueryObj = reactive({
      payTimeBegin: "",
      payTimeEnd: "",
    });

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

    const getStatisticsDetailList = async (): Promise<void> => {
      const { code, data } = await statisticsDetailList(
        currentPage.value,
        pageSize.value,
        payType.value,
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
    };

    const getStatisticsDetailTotal = async (): Promise<void> => {
      const { code, data } = await statisticsDetailTotal(
        currentPage.value,
        pageSize.value,
        payType.value,
        Object.assign(
          {},
          {
            ...QueryObj,
          }
        )
      );
      if (+code === 1000) {
        statData.value = data;
      }
    };

    // 打开抽屉
    const handleOpen = (res: any): void => {
      payType.value = res.payType
      getStatisticsDetailList();
      getStatisticsDetailTotal();
      drawer.value = true;
    };

    const handleSearch = (): void => {
      selectDate();
      getStatisticsDetailList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getStatisticsDetailList();
    };

    const getPayDetail = async (
      orderId: number,
      orderDetailId: number
    ): Promise<void> => {
      const { code, data } = await payDetail(orderId, orderDetailId);
      if (+code === 1000) {
        detailDataList.value = data;
        dialogVisible.value = true;
      }
    };

    const viewDetail = (res: any): void => {
      getPayDetail(res.orderId, res.orderDetailId);
    };

    // 导出收支统计明细
    async function handleExportStaff() {
      await exportFile(
        `/pay-merchant/settle/statisticsDetailE`,
        {
          pageNum: currentPage.value,
          pageSize: pageSize.value,
          payType: payType.value,
          ...QueryObj,
        },
        "收支统计明细列表"
      );
    }

    return {
      drawer,
      handleOpen,
      QueryObj,
      handleSearch,
      selectedDate,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      handleCurrentChange,
      viewDetail,
      dialogVisible,
      detailDataList,
      handleExportStaff,
      statData,
      dayjs
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

.detail-data {
  >li {
    margin-bottom: 20px;
  }
}
</style>

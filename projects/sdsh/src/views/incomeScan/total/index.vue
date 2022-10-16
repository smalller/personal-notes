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
            v-model="QueryObj.projectName"
            placeholder="请输入商户名称"
          />
        </el-form-item>
        <el-form-item label="支付时间：">
          <el-date-picker
              type="daterange"
              v-model="times"
              @change="timerChange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item label="状态">

          <el-select v-model="QueryObj.codeStatus">
            <el-option label="全部" value="" />
            <el-option label="待生效" value="1" />
            <el-option label="已生效" value="2" />
            <el-option label="已截止" value="3" />
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="queryList"
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-button
        style="float:right;margin-bottom:5px"
        @click="downloadFile"
      >导出Excel</el-button>
      <el-table :data="tableList">
        <el-table-column label="项目名称" prop="projectName"/>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag>{{+row.codeStatus === 1?'待生效':+row.codeStatus === 2?'已生效':'已截止'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="已支付人数" prop="payCounts"/>
        <el-table-column label="已退款人数" prop="refundCounts"/>
        <el-table-column label="收款总额" prop="payMoneys"/>
        <el-table-column label="全额退款总额" prop="refundMoneys"/>
        <el-table-column label="操作" prop="projectName">
          <template #default="{ row }">
            <el-button @click="openItemList(row.id)">按收费项统计</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  </div>
  <ItemTotal ref="itemTotal" />
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryObj, TableListItem } from "./data";
import {exportTotalList, List} from "./api";
import dayjs from "dayjs";
import micell from "micell";
import ItemTotal from "@/views/incomeScan/total/components/ItemTotal.vue";

export default defineComponent({
  name: "",
  components: {
    ItemTotal
  },
  props: {
    projectName: {
      type: String,
      default: "",
    }
  },
  setup(props) {
    const QueryObj = reactive<QueryObj>({
      codeStatus: '',
      projectName: props.projectName,
    });
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await List(
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

    const itemTotal = ref(null);
    //查询收费项列表
    const openItemList = (id: number) => {
      (itemTotal.value as any).open(id);
    }

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getMerchantList();
    };

    const times = ref([])

    const timerChange = (e) => {
      // console.log(e)
      if(e) {

      QueryObj.startTime = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
      QueryObj.endTime = dayjs(e[1]).format('YYYY-MM-DD')+' 23:59:59'
      } else {
        QueryObj.startTime = '';
        QueryObj.endTime = '';
      }
    }

    const queryList = () => {
      currentPage.value = 1
      getMerchantList()
    }

    const downloadFile = () => {
      exportTotalList(currentPage.value,
          pageSize.value,
          Object.assign(
              {},
              {
                ...QueryObj,
              }
          )).then(blob => {
            micell.download(blob, '交易统计.xlsx')
      })
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
      times,
      timerChange,
      queryList,
      downloadFile,
      itemTotal,
      openItemList
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

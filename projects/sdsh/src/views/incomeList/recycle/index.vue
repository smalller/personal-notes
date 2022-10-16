<template>
  <div class="">
    <el-card
      shadow="never"
      class="cus-card"
      style="margin-bottom: 15px"
      :body-style="{ 'padding-bottom': '0' }"
    >
      <el-form
        :model="formData"
        class="filter-box"
        label-position="right"
      >
        <el-form-item label="项目名称：">
          <el-input
            clearable
            v-model="formData.projectName"
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="支付时间">
          <el-date-picker
              type="daterange"
              v-model="times"
              @change="timerChange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择截止时间"
          />
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
      <el-table :data="tableList">
        <el-table-column label="项目名称" prop="projectName" />
        <el-table-column label="开始时间">
          <template #default="{ row }">
            {{dayjs(row.startTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="截止时间" >
          <template #default="{ row }">
            {{dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag>{{+row.status === 0?'未通过':+row.status === 1?'通过':+row.status === 2?'审核中':'草稿'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="schedule" />
        <el-table-column label="总人数" prop="totalPeople" />
        <el-table-column label="已交款" prop="paid" />
        <el-table-column label="不参与/全额退款" prop="notInvolved" />
        <el-table-column label="未交款" prop="unpaid" />
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
    <!-- <merchantAllInfo
      ref="merchantAllInfoCom"
      title="新增商户"
      flag="1"
    ></merchantAllInfo> -->
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryObj, TableListItem } from "./data";
import { getNameList } from "./api";
import dayjs from "dayjs";


export default defineComponent({
  name: "",
  components: {
    // TypeSelect,
    // bankCardInfo,
    // basicInfo,
    // idCardInfo,
    // merchantAllInfo,
  },
  setup() {
    const formData = reactive<QueryObj>({ });
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);

    async function getList(): Promise<void> {
      const { code, data } = await getNameList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            ...formData,
          }
        )
      );
      if (+code === 1000) {
        tableList.value = data.list;
        totalNum.value = data.total;
      }
    }
    getList();

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getList();
    };

    const addMerchant = (): void => {
      // (merchantAllInfoCom.value as MerAllInfoSetup).handleOpen(1);
    };

    const times = ref([])

    const timerChange = (e) => {
      // console.log(e)
      if(e) {

      formData.beginTime = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
      formData.endTime = dayjs(e[1]).format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        formData.beginTime = '';
        formData.endTime = '';
      }
    }

    const queryList = () => {
      currentPage.value = 1
      getList()
    }

    return {
      dayjs,
      formData,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getList,
      handleCurrentChange,
      merchantAllInfoCom,
      addMerchant,
      times,
      timerChange,
      queryList
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

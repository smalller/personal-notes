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
        <el-form-item label="支付时间">
          <el-date-picker
              type="datetimerange"
              v-model="times"
              @change="timerChange"
              range-separator="-"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item label="提交人：">
          <el-input
            clearable
            v-model="QueryObj.createUserId"
            placeholder="请输入"
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
      <el-button
        type="success"
        style="margin-bottom:5px"
        @click="getMerchantList"
      >审核设置</el-button>
      <el-table
          :data="tableList"
          border
          style="width: 100%"
      >
        <el-table-column
            prop="projectName"
            label="项目名称"
        />
        <el-table-column
            prop="type"
            label="收费场景"
        >
          <template #default="{row}">
            <el-tag type="info">{{+row.type === 1?'二维码收费':'按名单收费'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="userName"
            label="提交人"
        />
        <el-table-column
            prop="beginTime"
            label="发布日期"
        >
          <template #default="{row}">
            {{dayjs(row.beginTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
            prop="endTime"
            label="截止日期">
          <template #default="{row}">
            {{dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态">
          <template #default="{row}">
            <el-tag :type="+row.status === 2?'':'success'">{{+row.status === 2?'审核中':'已审核'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="100px">
          <template #default="{ row }">

            <el-popconfirm
                confirm-button-text="通过"
                cancel-button-text="未通过"
                icon-color="#626AEF"
                title="是否通过审核?"
                @confirm="toExamine(row, '1')"
                @cancel="toExamine(row, '0')"
            >
              <template #reference>
                <el-button>审核</el-button>
              </template>
            </el-popconfirm>

            <el-button
                type="text"
                @click="getDetails(row)"
            >详情</el-button>

          </template>
        </el-table-column>
      </el-table>
      <qr-code-details ref="qrCodeDetails" />
      <project-info ref="projectInfo" />
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
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryObj, TableListItem } from "./data";
import {getList, updateStatus} from "./api";
import dayjs from "dayjs";
import QrCodeDetails from "@/views/incomeCheck/list/components/qrCodeDetails.vue";
import {ElMessage} from "element-plus";
import ProjectInfo from "@/views/incomeList/list/components/projectInfo.vue";
// import TypeSelect from "../components/TypeSelect.vue";
// import bankCardInfo from "@/components/merchant/bankCardInfo.vue";
// import basicInfo from "@/components/merchant/basicInfo.vue";
// import idCardInfo from "@/components/merchant/idCardInfo.vue";
// import merchantAllInfo, { Setup as MerAllInfoSetup } from '../components/merchantAllInfo.vue';


export default defineComponent({
  name: "",
  components: {
    ProjectInfo,
    QrCodeDetails
    // TypeSelect,
    // bankCardInfo,
    // basicInfo,
    // idCardInfo,
    // merchantAllInfo,
  },
  setup() {
    const QueryObj = reactive<QueryObj>({});
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据


    async function getMerchantList(): Promise<void> {
      const { code, data } = await getList(
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

    const qrCodeDetails = ref(null);
    const projectInfo = ref(null);
    //查询详情
    const getDetails = (row: TableListItem) => {
      if(+row.type === 1) {
        (qrCodeDetails.value as any).open(row.id)
      } else {
        (projectInfo.value as any).open(row.id);
      }
    }


    //审核
    const toExamine = (row: TableListItem, status: string) => {
      updateStatus({
        id: row.id,
        type: row.type,
        status: status
      }).then(res => {
        if(+res.code === 1000) {
          getMerchantList()
          ElMessage.success('已提交')
        }
      })
    }

    const times = ref([])

    const timerChange = (e) => {
      // console.log(e)
      if(e) {

      QueryObj.startTime = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
      QueryObj.endTime = dayjs(e[1]).format('YYYY-MM-DD')+' 23:59:59';
      } else {
        QueryObj.startTime = '';
        QueryObj.endTime = '';
      }
    }

    const queryList = () => {
      currentPage.value = 1
      getMerchantList()
    }

    return {
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      qrCodeDetails,
      dayjs,
      getDetails,
      toExamine,
      times,
      timerChange,
      queryList,
      projectInfo
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

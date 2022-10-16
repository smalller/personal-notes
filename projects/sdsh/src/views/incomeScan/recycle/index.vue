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
              end-placeholder="请选择结束时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              @click="getMerchantList"
          >查询
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-table :data="tableList">
        <el-table-column label="项目名称" prop="projectName"/>
        <el-table-column label="开始时间" prop="projectName">
          <template #default="{ row }">
            {{ dayjs(row.beginTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="截止时间" prop="projectName">
          <template #default="{ row }">
            {{ dayjs(row.endTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <!--        <el-table-column label="状态" prop="isExpire"/>-->
        <el-table-column label="已交人数" prop="payNumber"/>
        <el-table-column label="操作" width="200px">
          <template #default="{ row }">
            <el-button @click="getDetails(row.id)">查看详情</el-button>
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                icon-color="#626AEF"
                title="确定恢复该收费项目?"
                @confirm="fallbackQrCode(row.id)"
            >
              <template #reference>
                <el-button>退回</el-button>
              </template>
            </el-popconfirm>
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
    <!-- <merchantAllInfo
      ref="merchantAllInfoCom"
      title="新增商户"
      flag="1"
    ></merchantAllInfo> -->
  </div>
  <qr-code-details ref="qrCodeDetails"/>
</template>
<script lang="ts">
import {defineComponent, ref, Ref, reactive} from "vue";
import {QueryObj, TableListItem} from "./data";
import {merchantList, merchantQrCode} from "./api";
import dayjs from "dayjs";
import QrCodeDetails from "@/views/incomeCheck/list/components/qrCodeDetails.vue";
import {ElMessage} from "element-plus";


export default defineComponent({
  name: "",
  components: {
    QrCodeDetails
  },
  setup() {
    const QueryObj = reactive<QueryObj>({});
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const {code, data} = await merchantList(
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

    // const getBill = () => {
    //
    // }

    const addMerchant = (): void => {
      // (merchantAllInfoCom.value as MerAllInfoSetup).handleOpen(1);
    };

    const times = ref([])

    const timerChange = (e) => {
      if (e) {

        QueryObj.payStart = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
        QueryObj.payEnd = dayjs(e[1]).format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        QueryObj.payStart = ''
        QueryObj.payEnd = ''
      }
    }

    const qrCodeDetails = ref(null)
    //查询详情
    const getDetails = (id: number) => {
      (qrCodeDetails.value as any).open(id);
    }

    const fallbackQrCode = (id: number) => {
      merchantQrCode(id).then(res => {
        if (+res.code === 1000) {
          getMerchantList();
          ElMessage.success('恢复二维码成功')

        }
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
      addMerchant,
      timerChange,
      times,
      dayjs,
      getDetails,
      qrCodeDetails,
      fallbackQrCode
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

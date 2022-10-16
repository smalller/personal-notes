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
          >查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card shadow="never">
      <el-button
        type="success"
        @click="mergeQrCode"
        style="margin-bottom:10px"
      >新增合并二维码</el-button>
      <el-table :data="tableList">
        <el-table-column label="项目名称" prop="projectName"/>
        <el-table-column label="创建时间">
          <template #default="{ row }">
            {{dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column label="二维码">
          <template #default="{ row }">
            <el-button  @click="openQrCodeMadel(row)">点击查看或下载二维码</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-popconfirm title="是否要删除？" @confirm="deleteQrCode(row.id)">
              <template #reference>
                <el-button type="danger">删除</el-button>
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
  <QrCodeMadel ref="qrCodeMadel" />
  <create-merge-qr-code ref="createMergeQrCode" @success="getMerchantList" />
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import { QueryObj, TableListItem } from "./data";
import {delQrCode, merchantList} from "./api";
import dayjs from "dayjs";
import QrCodeMadel from "@/views/incomeScan/scan/components/qrCodeMadel.vue";
import {QrCodeListItem} from "@/views/incomeScan/scan/data";
import {ElMessage} from "element-plus";
import CreateMergeQrCode from "@/views/incomeScan/components/createMergeQrCode.vue";

export default defineComponent({
  name: "",
  components: {
    CreateMergeQrCode,
    QrCodeMadel
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

    const qrCodeMadel = ref(null)
    const openQrCodeMadel = (data:QrCodeListItem) => {
      (qrCodeMadel.value as  any).open(data)
    }

    const times = ref([])

    const timerChange = (e) => {
      // console.log(e)
      if(e) {

      QueryObj.payStart = dayjs(e[0]).format('YYYY-MM-DD HH:mm:ss')
      QueryObj.payEnd = dayjs(e[1]).format('YYYY-MM-DD')+' 23:59:59'
      } else {
        QueryObj.payStart = '';
        QueryObj.payEnd = '';
      }
    }

    const deleteQrCode = (id: number) => {
      delQrCode(id).then(res => {
        if(+res.code === 1000) {
          ElMessage.success('删除成功')
          getMerchantList()
        }
      })
    }

    const createMergeQrCode = ref(null);


    const mergeQrCode = () => {
      (createMergeQrCode.value as any).open()
    }


    return {
      createMergeQrCode,
      QueryObj,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      getMerchantList,
      handleCurrentChange,
      merchantAllInfoCom,
      addMerchant,
      dayjs,
      qrCodeMadel,
      openQrCodeMadel,
      times,
      timerChange,
      deleteQrCode,
      mergeQrCode
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

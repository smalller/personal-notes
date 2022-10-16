<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="姓名：">
          <el-input v-model="QueryObj.userName"></el-input>
        </el-form-item>
        <el-form-item label="手机：">
          <el-input v-model="QueryObj.account"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getMerchantList">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="success" @click="addStaff">新增</el-button>
        <el-button type="success" @click="handleDelStaff">删除选中</el-button>
        <el-button type="success" @click="handleDownloadTem">下载模板</el-button>
        <el-button type="success" @click="importStaff">数据导入</el-button>
        <el-button type="success" @click="handleExportStaff">数据导出</el-button>
      </div>
      <tableList :data="tableList" @updateComplete="getMerchantList" @selectChange="selectChange"></tableList>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <merchantAllInfo ref="merchantAllInfoCom" title="新增商户" flag="1" @updateComplete="getMerchantList"></merchantAllInfo>
    <addStaff ref="editStaffCom" @editComplete="getMerchantList"></addStaff>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import tableList from "./components/tableList.vue";
import { QueryObj, TableListItem } from "./data";
import { statusList } from "./static";
import { KeyValue } from "@/common/types";
import { merchantList, delMerStaff, importStaffs } from "./api";
import { ElMessage } from "element-plus";
import addStaff from "./components/editStaff.vue";
import { exportFile } from '@/common/api'
import { log } from "console";

export default defineComponent({
  name: "",
  components: {
    tableList,
    addStaff,
  },
  setup() {
    const QueryObj = reactive<any>({
      userName: "",
      account: "",
    });
    const selectedDate = ref([] as Date[] | "");
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const merchantAllInfoCom = ref<unknown>(null);
    const selectList = ref([]);

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

    function selectChange(res: any) {
      console.log(res);

      selectList.value = res;
      console.log(selectList.value);

    }

    async function handleDelStaff() {
      console.log(selectList.value);

      if (selectList.value.length === 0) {
        return;
      }
      const ids = selectList.value.map((item: any) => item.id);
      const { code } = await delMerStaff(ids);
      if (+code === 1000) {
        ElMessage.success("删除成功");
        getMerchantList();
      }
    }

    const editStaffCom = ref<unknown>(null);
    function addStaff() {
      (editStaffCom.value as any).handleOpen(1);
    }

    // 下载员工模板
    async function handleDownloadTem() {
      await exportFile(`/pay-merchant/template/downStaffTemp`, {
      }, '员工模板')
    }

    // 导出员工
    async function handleExportStaff() {
      await exportFile(`/pay-merchant/staffMember/exportList`, {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        ...QueryObj
      }, '员工列表')
    }


    // 导入员工
    function importStaff() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = ".xls";
      input.onchange = async () => {
        if (input.files) {
          const file = input.files[0];
          const { code } = await importStaffs(file)
          if (+code === 1000) {
            ElMessage.success('导入成功')
            getMerchantList();
          }
        }
      }
      input.click();
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
      selectedDate,
      statusList,
      selectChange,
      handleDelStaff,
      editStaffCom,
      addStaff,
      handleDownloadTem,
      importStaff,
      handleExportStaff
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
</style>

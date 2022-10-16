<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never">
      <el-form :model="QueryObj" class="filter-box" label-position="right">
        <el-form-item label="学生姓名：">
          <el-input v-model="QueryObj.studentName"></el-input>
        </el-form-item>
        <el-form-item label="家长姓名：">
          <el-input v-model="QueryObj.parentName"></el-input>
        </el-form-item>
        <el-form-item label="手机号：">
          <el-input v-model="QueryObj.parentPhone"></el-input>
        </el-form-item>
        <el-form-item label="年级：">
          <el-select v-model="QueryObj.gradId" placeholder="全部" filterable clearable @change="handleSelectGrade">
            <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级：">
          <el-select v-model="QueryObj.classId" placeholder="全部" filterable clearable>
            <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getMerchantList">查询</el-button>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="success" @click="addStudent">新增</el-button>
        <el-button type="success" @click="handleDelStu">删除选中</el-button>
        <el-button type="success" @click="handleDownloadTem">下载模板</el-button>
        <el-button type="success" @click="importStudent">数据导入</el-button>
        <el-button type="success" @click="handleExportStu">数据导出</el-button>
      </div>
      <tableList :data="tableList" @selectChange="selectChange" @delComplete="getMerchantList"
        @updateComplete="getMerchantList"></tableList>
      <el-pagination class="pagination" background layout="prev, pager, next" :total="totalNum" :page-size="pageSize"
        :current-page="currentPage" @current-change="handleCurrentChange" />
    </el-card>
    <add ref="applyRefundCom" @updateComplete="getMerchantList"></add>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, Ref, reactive } from "vue";
import tableList from "./components/tableList.vue";
import { QueryObj, TableListItem } from "./data";
import { statusList } from "./static";
import { KeyValue } from "@/common/types";
import { studentList, merGradeList, merClassList, delBatch, importStu } from "./api";
import add from "./components/add.vue";
import { ElMessage } from "element-plus";
import { exportFile } from '@/common/api'

interface Setup {
  QueryObj: QueryObj;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  getMerchantList: () => Promise<void>;
  handleCurrentChange: (number) => void;
  addStudent: (number) => void;
  applyRefundCom: Ref<unknown>;
  // selectedDate: Ref<Date[] | string>;
  selectedDate: Ref<any>;
  statusList: KeyValue[];
  // applyRefund: () => void;
  gradeList: Ref<any>;
  classList: Ref<any>;
  handleSelectGrade: (res: string) => void;
  selectChange: (res) => void;
  handleDelStu: () => Promise<void>;
  handleDownloadTem: () => Promise<void>;
  importStudent: () => void;
  handleExportStu: () => Promise<void>
}

export default defineComponent({
  name: "",
  components: {
    tableList,
    add,
  },
  setup(): Setup {
    const QueryObj = reactive<QueryObj>({
      studentName: "",
      parentName: "",
      parentPhone: "",
      gradId: "",
      classId: "",
    });
    const selectedDate = ref([] as Date[] | "");
    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据
    const applyRefundCom = ref<unknown>(null);

    async function getMerchantList(): Promise<void> {
      const { code, data } = await studentList(
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

    const addStudent = (): void => {
      (applyRefundCom.value as any).handleOpen(1);
    };

    const gradeList = ref([]);
    async function getGradeList() {
      const { code, data } = await merGradeList();
      if (+code === 1000) {
        gradeList.value = data;
      }
    }
    getGradeList();

    const classList = ref([]);
    async function getClassList(gradeId?: number | string) {
      const { code, data } = await merClassList({
        pageNum: 1,
        pageSize: 999,
        gradeId,
      });
      if (+code === 1000) {
        classList.value = data.list;
      }
    }
    getClassList();

    function handleSelectGrade(res: string) {
      getClassList(res);
    }

    const selectList = ref([]);
    function selectChange(res: any) {
      selectList.value = res;
    }

    async function handleDelStu() {
      if (selectList.value.length === 0) {
        return;
      }
      const ids = selectList.value.map((item: any) => item.studentId);
      const { code } = await delBatch(ids);
      if (+code === 1000) {
        ElMessage.success("删除成功");
        getMerchantList();
      }
    }

    // 下载学生模板
    async function handleDownloadTem() {
      await exportFile(`/pay-merchant/template/downStudentTemp`, {
      }, '学生模板')
    }

    // 导出学生
    async function handleExportStu() {
      await exportFile(`/pay-merchant/merchantStudent/exportList`, {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        ...QueryObj
      }, '学生列表')
    }

    // 导入学生
    function importStudent() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = ".xls";
      input.onchange = async () => {
        if (input.files) {
          const file = input.files[0];
          const { code } = await importStu(file)
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
      applyRefundCom,
      selectedDate,
      statusList,
      addStudent,
      gradeList,
      classList,
      handleSelectGrade,
      selectChange,
      handleDelStu,
      handleDownloadTem,
      importStudent,
      handleExportStu
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

<template>
  <el-drawer v-model="drawer" title="新增学生" custom-class="drawer-box">
    <div style="
        background-color: #eee;
        width: 100%;
        height: 50px;
        text-align: left;
        padding-top: 15px;
      ">
      <span>学生信息</span>
    </div>
    <el-form :model="form" label-width="120px" style="margin-top: 20px">
      <el-form-item label="学生姓名">
        <el-input v-model="form.studentName" style="width: 200px" />
      </el-form-item>
      <el-form-item label="学生性别">
        <el-select v-model="form.sex">
          <el-option label="男" value="1" />
          <el-option label="女" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属年级">
        <el-select v-model="form.gradeId" placeholder="全部" filterable clearable @change="handleSelectGrade">
          <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属班级">
        <el-select v-model="form.classId" placeholder="全部" filterable clearable>
          <el-option v-for="item in classList" :key="item.id" :label="item.className" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="
        background-color: #eee;
        width: 100%;
        height: 50px;
        text-align: left;
        padding-top: 15px;
      ">
      <span>家长信息</span>
    </div>
    <div>
      <div style="width: 80%; display: flex; margin: 20px">
        <div>
          <span>姓名:</span>
          <el-input v-model="form.parentName" style="width: 200px" />
        </div>
        <div style="margin-left: 20px">
          <span>联系电话:</span>
          <el-input v-model="form.parentPhone" style="width: 200px" />
        </div>
      </div>
    </div>
    <div style="text-align: right">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="drawer = false">取消</el-button>

    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { TableListItem, BasicDetailInfo } from "../data";
import {
  merGradeList,
  merClassList,
  addMerStudent,
  setMerStudent,
  selStu,
} from "../api";
import { ElMessage } from "element-plus";

export interface Setup {
  drawer: Ref<boolean>;
  handleClose: () => void;
  handleOpen: (index: number, res?: TableListItem) => void;
  basicDetail: Ref<BasicDetailInfo>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  form: Ref<any>;
  gradeList: Ref<any>;
  classList: Ref<any>;
  handleCurrentChange: (number) => void;
  handleSave: () => Promise<void>;
  handleSelectGrade: (res: string) => void;
}

export default defineComponent({
  name: "",
  components: {},
  setup(props, { emit }): Setup {
    const drawer = ref<boolean>(false);
    const basicDetail = ref({} as BasicDetailInfo);

    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据

    const form = ref<any>({
      studentName: "",
      sex: "",
      gradeId: "",
      classId: "",
      parentName: "",
      parentPhone: "",
    });

    // 关闭抽屉回调
    const handleClose = (): void => {
      drawer.value = false;
    };

    async function handleSelStu(stuId: number) {
      const { code, data } = await selStu(stuId);
      if (+code === 1000) {
        form.value = data;
      }
    }

    const flagIndex = ref<number>(-1);
    // 打开抽屉
    const handleOpen = (index: number, res?: any): void => {
      flagIndex.value = index;
      if (index === 2) {
        handleSelStu(res.studentId);
      }
      drawer.value = true;
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
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

    function initData() {
      drawer.value = false;
      emit("updateComplete");
      ElMessage.success("新增成功");
      form.value = {
        studentName: "",
        sex: "",
        gradeId: "",
        classId: "",
        parentName: "",
        parentPhone: "",
      };
    }

    async function handleSave() {
      if (flagIndex.value === 1) {
        const { code } = await addMerStudent(form.value);
        if (+code === 1000) {
          initData();
        }
      } else {
        const { code } = await setMerStudent(form.value);
        if (+code === 1000) {
          initData();
        }
      }
    }

    function handleSelectGrade(res: string) {
      form.value.classId = ''
      getClassList(res);
    }

    return {
      drawer,
      handleClose,
      handleOpen,
      basicDetail,
      currentPage,
      pageSize,
      totalNum,
      tableList,
      handleCurrentChange,
      form,
      gradeList,
      classList,
      handleSave,
      handleSelectGrade,
    };
  },
});
</script>
<style lang="scss" scoped>
.el-input__inner {
  width: 200px;
}

.basic-info-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-bottom: 10px;

  &::after {
    height: 0;
    width: 33.3333%;
    // min-width: 345px;
    content: "";
  }

  >li {
    width: 33.3333%;
    margin-bottom: 20px;

    >span:first-child {
      width: 100px;
    }
  }
}

.filter-box {
  margin-bottom: 30px;
}
</style>

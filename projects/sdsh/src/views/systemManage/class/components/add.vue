<template>
  <el-drawer v-model="drawer" title="新增班级" custom-class="drawer-box">
    <el-form :model="form" label-width="120px" style="margin-top: 20px">
      <el-form-item label="年级">
        <el-select v-model="form.gradeId" placeholder="全部" filterable clearable>
          <el-option v-for="item in gradeList" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级序号">
        <el-input style="width: 200px" v-model="form.classNo"></el-input>
      </el-form-item>
      <el-form-item label="班级名称 ">
        <el-input style="width: 200px" v-model="form.className"></el-input>
      </el-form-item>
      <el-form-item label="班级别名">
        <el-input style="width: 200px" v-model="form.classAliasName"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button type="primary" @click="handleSave">保存</el-button>
      <el-button @click="drawer = false">取消</el-button>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { TableListItem, BasicDetailInfo } from "../data";
import { ElMessage } from "element-plus";
import { merGradeList } from "../../student/api";
import { addMerClass, merClassDetail, setMerClass } from "../api";

export interface Setup {
  drawer: Ref<boolean>;
  handleClose: () => void;
  handleOpen: (TableListItem) => void;
  basicDetail: Ref<BasicDetailInfo>;
  currentPage: Ref<number>;
  pageSize: Ref<number>;
  totalNum: Ref<number>;
  tableList: Ref<TableListItem[]>;
  form: Ref<any>;

  handleCurrentChange: (number) => void;
}

export default defineComponent({
  name: "",
  components: {},
  setup(props, { emit }) {
    const drawer = ref<boolean>(false);
    const basicDetail = ref({} as BasicDetailInfo);

    const currentPage = ref<number>(1); // 当前页码
    const pageSize = ref<number>(20); // 每页展示条数
    const totalNum = ref<number>(0); // 表格总条数
    const tableList = ref<TableListItem[]>([]); // 表格数据

    const form = ref({
      classAliasName: "",
      className: "",
      classNo: "",
      gradeId: "",
    });

    // 关闭抽屉回调
    const handleClose = (): void => {
      drawer.value = false;
    };

    const flagIndex = ref<number>(-1);

    async function getMerClassDetail(classId: number) {
      const { code, data } = await merClassDetail(classId);
      if (+code === 1000) {
        form.value = data;
      }
    }

    // 打开抽屉
    const handleOpen = (index: number, res?: any): void => {
      flagIndex.value = index;
      if (index === 2) {
        getMerClassDetail(res.id);
      }
      drawer.value = true;
      getGradeList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
    };

    function initData() {
      drawer.value = false;
      emit("updateComplete");
      ElMessage.success("新增成功");
      form.value = {
        classAliasName: "",
        className: "",
        classNo: "",
        gradeId: "",
      };
    }

    const gradeList = ref<any>([]);
    async function getGradeList() {
      const { code, data } = await merGradeList();
      if (+code === 1000) {
        gradeList.value = data;
      }
    }

    async function handleSave() {
      if (flagIndex.value === 1) {
        const { code } = await addMerClass(form.value);
        if (+code === 1000) {
          initData();
        }
      } else {
        const { code } = await setMerClass(form.value);
        if (+code === 1000) {
          initData();
        }
      }
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
      handleSave,
      gradeList,
    };
  },
});
</script>
<style lang="scss" scoped>
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

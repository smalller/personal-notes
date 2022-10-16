<template>
  <div>
    <div class="top-handle-box">
      <div class="left-box">
        <ui-input
          style="width: 200px; margin-right: 16px; margin-bottom: 15px"
          v-model="searchObj.name"
          placeholder="输入姓名/电话"
          icon="icon-a-101"
          @keydown.enter="handleSearchInfo"
          @iconClick="handleSearchInfo"
        >
        </ui-input>
        <SelectPostOrClass
          title="班级"
          placeholder="全部班级"
          width="140"
          :list="assignedSelectList"
          @handleSelect="handleSelectAssigned"
        ></SelectPostOrClass>
        <SelectPostOrClass
          title="状态"
          placeholder="全部状态"
          width="140"
          :list="staticData.stuStatusList"
          @handleSelect="handleSelectStatus"
        ></SelectPostOrClass>
      </div>
      <div class="right-box">
        <ui-button @click="handleDelStu">移除报名</ui-button>
        <ui-button type="primary" @click="handleAddStudent" icon="icon-a-81"
          >添加报名</ui-button
        >
        <ui-button type="primary" icon="icon-a-81" @click="handleBatchDivide"
          >批量分班</ui-button
        >
      </div>
    </div>
    <ui-table
      v-loading="loading"
      :data="dataList"
      :checkbox="true"
      @selectChange="selectChange"
    >
      <ui-table-column label="学员姓名">
        <template #default="{ row }">
          <div class="name-box">
            <img
              class="avatar"
              :src="row.headerImg || require('@/assets/staff-avatar.png')"
              alt=""
            />
            <span>{{ row.name }}</span>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column prop="contacts" label="电话"></ui-table-column>
      <ui-table-column label="性别/年龄">
        <template #default="{ row }">
          <div class="sex-age">
            <ui-icon
              class="icon-avatar"
              :icon="row.sex === 1 ? 'icon-a-zu7652' : 'icon-a-zu7653'"
            ></ui-icon>
            <span>{{ getAge(row.birthTime) }}</span>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column prop="clazzName" label="来自班级"></ui-table-column>
      <ui-table-column prop="" label="兴趣班"></ui-table-column>
      <ui-table-column label="学员状态"></ui-table-column>
      <ui-table-column label="操作" align="right">
        <template #default="{ row }">
          <ui-button
            style="margin-left: 16px"
            type="text-blue"
            @click="viewStuDetail(row)"
            >学员详情</ui-button
          >
        </template>
      </ui-table-column>
    </ui-table>
    <ui-pagination
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalNum"
    ></ui-pagination>
  </div>
  <logoutIdentity ref="logoutIdentityCom" @handleSure="handleSure">
    <p class="body-text">
      <span style="color: #f56060"
        >是否将{{ selectStuList.length }}位学员从报名列表中移除，</span
      >
      确定继续吗？
    </p>
  </logoutIdentity>
  <ui-modal
    v-model:visible="batchDivideModalStatus"
    @close="handleClose"
    @ok="handleSureDivide"
    title="批量分班"
    width="540"
    :tips="false"
  >
    <div class="top-tips">
      是否将选择的 {{ selectStuList.length }} 名学员分配到指定班级？
    </div>
    <div class="botom-form">
      <ui-form
        :model="ruleForm"
        :rules="staticData.batchDivide"
        ref="batchDivideFormCheck"
        label-width="90"
      >
        <ui-form-item label="批量分班" prop="selClass">
          <ui-select
            style="width: 270px"
            v-model="ruleForm.selClass"
            placeholder="请选择班级"
          >
            <ui-select-option
              v-for="item in batchClassList"
              :key="item.id"
              :label="item.clazzName"
              :value="item.id"
            >
            </ui-select-option>
          </ui-select>
          <ui-button
            icon="icon-a-81"
            style="margin-left: 10px"
            @click="handleAddClass"
            >新增班级</ui-button
          >
        </ui-form-item>
      </ui-form>
    </div>
  </ui-modal>
  <addStudents ref="addStudentsCom"></addStudents>
  <editClass ref="editClassCom"></editClass>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import {
  selectStuListApi,
  getSelectClassInCourse,
  addStudentsToClass,
  studentsUnSign,
} from "@/api/recruitStudentsPlan";
import { staticData, ListRow, ClassList } from "../index";
import Message from "@/themes/message";
import logoutIdentity from "@/components/logoutIdentity.vue";
import addStudents from "./AddStudents.vue";
import { getAge } from "@/utils/common";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import { throttle } from "@/utils/common";
import editClass from "./editClass.vue";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {
    logoutIdentity,
    addStudents,
    SelectPostOrClass,
    editClass,
  },
  props: {
    courseInfo: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const COURSE_INFO = computed(() => props.courseInfo);
    const courseInfo = ref(COURSE_INFO.value); // 传过来的id信息

    const searchObj = ref({
      name: "",
    }); //筛选条件

    let ruleForm = ref({
      selClass: "",
    });

    const editClassCom = ref(null);
    const logoutIdentityCom = ref(null);
    const addStudentsCom = ref(null);
    const batchDivideFormCheck = ref(null);
    const batchDivideModalStatus = ref(false);
    const targetId = ref(""); //当前要操作的学生id
    const dataList = ref([]); //学生列表
    const selectStuList = ref([]); //选择的学生列表
    const assignedSelectList = ref<any[]>([]); //已分班筛选列表
    const loading = ref(true);
    const batchClassList = ref<any[]>([]);

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    // 添加学员
    function handleAddStudent() {
      (addStudentsCom.value as any).handleOpen(courseInfo.value);
    }

    // 选择未分班学员
    function selectChange(res: any) {
      selectStuList.value = res;
    }

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      console.log("请求列表1");
    };

    // 输入框边输边查询
    watch(
      () => searchObj.value.name,
      () => {
        throttle(() => {
          console.log("请求列表1");
        }, 500);
      }
    );

    // 获取学员列表
    const getStudentsList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await selectStuListApi(
        currentPage.value,
        pageSize.value,
        {
          planId: courseInfo.value.planId,
          courseId: courseInfo.value.courseId,
        }
      );
      if (+code === 0) {
        dataList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    getStudentsList();

    // 筛选班级选择
    const handleSelectAssigned = (res: ClassList): void => {
      // if (res) {
      //   searchObj.value.classQuery = res.id;
      // } else {
      //   searchObj.value.classQuery = "";
      // }
      console.log("请求列表3", res);
    };

    // 筛选状态
    function handleSelectStatus(res: ClassList) {
      console.log(res);
    }

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getStudentsList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getStudentsList();
    };

    // 学员详情
    function viewStuDetail(row: any) {
      return;
    }

    // 移除学员
    function handleDelStu() {
      if (selectStuList.value.length > 0) {
        (logoutIdentityCom.value as any).handleOpen("操作提醒");
      }
    }

    // 确认移除学员
    async function handleSure() {
      const { code } = await studentsUnSign({
        courseId: courseInfo.value.courseId,
        planId: courseInfo.value.planId,
        studentList: selectStuList.value.map((item: any) => item.studentId),
      });
      if (+code === 0) {
        Message.success("移除成功");
        getStudentsList();
      }
    }

    onMounted(() => {
      bus.$on("updateEditClassComplete", () => {
        handleGetSelectClassInCourse();
      });
    });

    onUnmounted(() => {
      bus.$off("updateEditClassComplete");
    });

    // 获取批量分班中的班级列表
    async function handleGetSelectClassInCourse() {
      const { code, data } = await getSelectClassInCourse({
        planId: courseInfo.value.planId,
        courseId: courseInfo.value.courseId,
      });
      if (+code === 0) {
        batchClassList.value = data;
      }
    }

    // 批量分班
    function handleBatchDivide() {
      if (selectStuList.value.length > 0) {
        handleGetSelectClassInCourse();
        batchDivideModalStatus.value = true;
      }
    }

    // 创建班级
    function handleAddClass() {
      (editClassCom.value as any).handleOpen(1, courseInfo.value);
    }

    // 批量分班取消按钮
    const handleClose = () => {
      batchDivideModalStatus.value = false;
    };

    // 确认分班接口
    async function sureStuDivide() {
      const { code } = await addStudentsToClass({
        planId: courseInfo.value.planId,
        courseId: courseInfo.value.courseId,
        clazzId: ruleForm.value.selClass,
        students: selectStuList.value.map((item: any) => item.studentId),
      });
      if (+code === 0) {
        Message.success("操作成功");
        batchDivideModalStatus.value = false;
      }
    }

    // 批量分班确认按钮
    function handleSureDivide() {
      (batchDivideFormCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          sureStuDivide();
        } else {
          console.log("验证失败");
        }
      });
    }

    onMounted(() => {
      // 新增学生完成后更新表格
      bus.$on("updateAddStuComplete", () => {
        getStudentsList();
      });
    });

    onUnmounted(() => {
      bus.$off("updateAddStuComplete");
    });

    return {
      handleSure,
      staticData,
      logoutIdentityCom,
      addStudentsCom,
      handleAddStudent,
      getAge,
      selectChange,
      searchObj,
      handleSearchInfo,
      assignedSelectList,
      handleSelectAssigned,
      dataList,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      viewStuDetail,
      handleDelStu,
      selectStuList,
      handleSelectStatus,
      batchDivideModalStatus,
      handleBatchDivide,
      ruleForm,
      editClassCom,
      handleAddClass,
      handleSureDivide,
      batchDivideFormCheck,
      handleClose,
      loading,
      batchClassList,
    };
  },
});
</script>
<style lang="less" scoped>
.top-handle-box {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 20px;

  .container {
    margin-bottom: 15px;
  }

  .left-box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    > div {
      margin-right: 16px;
    }
  }

  .right-box {
    > button {
      margin-right: 16px;
      margin-bottom: 15px;
    }

    .icon {
      font-size: 22px;
      color: #9a9a9a;
      cursor: pointer;

      &:hover {
        color: #676767;
      }

      &:active {
        color: #999;
      }
    }
  }
}

.top-table-box {
  border: 1px solid #e8e8e8;
  margin-bottom: 30px;
  .top-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    padding-left: 0;
    border-bottom: 1px solid #e8e8e8;

    .icon {
      fill: #aaaaaa;
      width: 12px;
      height: 7px;
      cursor: pointer;

      &:hover {
        color: #676767;
      }

      &:active {
        color: #999;
      }
    }

    .left {
      font-size: 16px;
      font-weight: bold;
      color: #222222;
      padding-left: 16px;
      border-left: 3px solid #ff9900;
    }

    .right {
      display: flex;
      align-items: center;
    }
  }
}

.botom-table-box {
  border: 1px solid #e8e8e8;
  .top-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    padding-left: 0;
    border-bottom: 1px solid #e8e8e8;

    .icon {
      fill: #aaaaaa;
      width: 12px;
      height: 7px;
      cursor: pointer;

      &:hover {
        color: #676767;
      }

      &:active {
        color: #999;
      }
    }

    .left {
      font-size: 16px;
      font-weight: bold;
      color: #222222;
      padding-left: 16px;
      border-left: 3px solid #ff9900;
    }

    .right {
      display: flex;
      align-items: center;
    }
  }
  .botom-table {
    .class-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fafafa;
      border-bottom: 1px solid #e8e8e8;
      padding: 11px 24px;
      .left {
        font-size: 14px;
        color: #222222;
        .avatar {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          opacity: 1;
          border-radius: 4px;
        }
      }
      .right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #656565;
        > img {
          margin-right: 16px;
          cursor: pointer;
        }
        .num {
          margin-right: 16px;
        }
        > button {
          margin-right: 16px;
        }
        .icon {
          fill: #aaaaaa;
          width: 12px;
          height: 7px;
          cursor: pointer;

          &:hover {
            color: #676767;
          }

          &:active {
            color: #999;
          }
        }
      }
    }
  }
}

.sex-age {
  display: flex;
  align-items: center;
  .icon-avatar {
    width: 16px;
    height: 16px;
    margin-right: 10px;
  }
}

.body-text {
  font-size: 14px;
  margin-bottom: 10px;
}

.name-box {
  display: flex;
  align-items: center;
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

.top-tips {
  width: 480px;
  height: 32px;
  padding-left: 6px;
  line-height: 32px;
  font-size: 14px;
  background: rgba(79, 168, 249, 0.12);
  border: 1px solid rgba(79, 168, 249, 0.2);
  color: #222;
  border-radius: 3px;
}

.botom-form {
  margin-top: 20px;
}
</style>

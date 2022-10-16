<template>
  <div>
    <div class="top-handle-box">
      <div class="left-box">
        <ui-input
          style="width: 200px; margin-right: 16px; margin-bottom: 15px"
          v-model="searchObj.className"
          placeholder="班级名称"
          icon="icon-a-101"
          @keydown.enter="handleSearchInfo"
          @iconClick="handleSearchInfo"
        >
        </ui-input>
        <SelectPostOrClass
          title="教室"
          placeholder="全部教室"
          width="140"
          :list="staticData.stuStatusList"
          @handleSelect="handleSelectStatus"
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
        <ui-button
          style="margin-right: 20px"
          icon="icon-a-81"
          type="primary"
          @click="handleAddClass"
          >新增班级</ui-button
        >
      </div>
    </div>
    <ui-table :data="dataList" :checkbox="true" @selectChange="selectChange">
      <ui-table-column label="班级名称">
        <template #default="{ row }">
          <div class="name-box">
            <img
              class="avatar"
              :src="row.classImg || require('@/assets/staff-avatar.png')"
              alt=""
            />
            <span>{{ row.className }}</span>
          </div>
        </template>
      </ui-table-column>
      <ui-table-column label="所属课程" prop="courseName"></ui-table-column>
      <ui-table-column label="班级人数">
        <template #default="{ row }">
          <span>{{ row.studentNum }}/{{ row.classNum }}</span>
        </template>
      </ui-table-column>
      <ui-table-column label="已上课次（时）">
        <template #default="{ row }">
          <span>{{ row.studentNum }}/{{ row.classNum }}</span>
        </template>
      </ui-table-column>
      <ui-table-column label="授课老师" prop="headmasterName"></ui-table-column>
      <ui-table-column label="教室" prop="defaultRoomName"></ui-table-column>
      <ui-table-column label="班级状态" prop="">
        <template #default="{ row }">
          <span>{{ getClassStatus(row.classStatus) }}</span>
        </template>
      </ui-table-column>
      <ui-table-column label="操作" align="right">
        <template #default="{ row }">
          <div class="handle-btn-box">
            <ui-button type="text-blue" @click="handleSetSchedCourse(row)"
              >设置排课</ui-button
            >
            <ui-button type="text-blue" @click="viewClassStu(row)"
              >班级学员</ui-button
            >
            <ui-button type="text-blue" @click="viewStuDetail(row)"
              >班级课表</ui-button
            >
            <ui-button type="text-blue" @click="viewStuDetail(row)"
              >编辑</ui-button
            >
            <ui-button type="text-blue" @click="handleDelStu(row)"
              >删除</ui-button
            >
            <ui-button v-if="+row.classStatus === 2" type="text-blue"
              >结班</ui-button
            >
            <ui-button v-if="+row.classStatus === 3" type="text-blue"
              >复班</ui-button
            >
          </div>
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
  <editClass ref="editClassCom"></editClass>
  <ClassStudents ref="classStudentsCom"></ClassStudents>
  <logoutIdentity ref="logoutIdentityCom" @handleSure="handleSureDelStu">
    <p class="body-text">是否确认删除该班级</p>
  </logoutIdentity>
  <initSchedCourse ref="initSchedCourseCom"></initSchedCourse>
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
import { selectClassListApi, deleteClass } from "@/api/recruitStudentsPlan";
import { staticData, ClassList } from "../index";
import Message from "@/themes/message";
import { getAge } from "@/utils/common";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import { throttle } from "@/utils/common";
import editClass from "./editClass.vue";
import bus from "@/Layout/bus";
import ClassStudents from "./ClassStudents.vue";
import logoutIdentity from "@/components/logoutIdentity.vue";
import initSchedCourse from "./initSchedCourse.vue";

export default defineComponent({
  components: {
    SelectPostOrClass,
    editClass,
    ClassStudents,
    logoutIdentity,
    initSchedCourse,
  },
  props: {
    courseInfo: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const COURSE_INFO = computed(() => props.courseInfo);
    const courseInfo = ref(COURSE_INFO.value); // 传过来的id信息

    const searchObj = ref({
      className: "",
    }); //筛选条件

    const editClassCom = ref(null);
    const logoutIdentityCom = ref(null);
    const classStudentsCom = ref(null);
    const batchDivideFormCheck = ref(null);
    const targetId = ref(""); //当前要操作的班级id
    const dataList = ref([]); //学生列表
    const selectStuList = ref([]); //选择的学生列表
    const assignedSelectList = ref<any[]>([]); //已分班筛选列表
    const classId = ref<string>(); // 当前要操作的班级

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    // 勾选
    function selectChange(res: any) {
      selectStuList.value = res;
      console.log(selectStuList.value);
    }

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getClassList();
    };

    // 输入框边输边查询
    watch(
      () => searchObj.value.className,
      () => {
        throttle(() => {
          getClassList();
        }, 500);
      }
    );

    // 获取学校列表
    const getClassList = async (): Promise<void> => {
      const { code, data } = await selectClassListApi(
        currentPage.value,
        pageSize.value,
        {
          planId: courseInfo.value.planId,
          courseId: courseInfo.value.courseId,
          clazzType: 1,
          className: searchObj.value.className,
        }
      );
      if (+code === 0) {
        dataList.value = data.list;
        totalNum.value = data.page.totalNum;
      }
    };
    getClassList();

    // 筛选状态
    function handleSelectStatus(res: ClassList) {
      console.log(res);
    }

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getClassList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getClassList();
    };

    // 学员详情
    function viewStuDetail(row: any) {
      return;
    }

    // 创建班级
    function handleAddClass() {
      (editClassCom.value as any).handleOpen(1, courseInfo.value);
    }

    onMounted(() => {
      // 新增教室完成后更新表格
      bus.$on("updateEditClassComplete", () => {
        getClassList();
      });
    });

    onUnmounted(() => {
      bus.$off("updateEditClassComplete");
    });

    // 班级学员
    function viewClassStu(row: any) {
      (classStudentsCom.value as any).handleOpen(row);
    }

    // 删除班级
    function handleDelStu(row: any) {
      classId.value = row.id;
      (logoutIdentityCom.value as any).handleOpen("删除班级");
    }

    async function handleSureDelStu() {
      const { code } = await deleteClass({
        planId: courseInfo.value.planId,
        courseId: courseInfo.value.courseId,
        clazzId: classId.value,
      });
      if (+code === 0) {
        getClassList();
        Message.success("删除成功");
      }
    }

    // 获取状态
    function getClassStatus(status: number) {
      switch (status) {
        case 1:
          return "未开班";
        case 2:
          return "开班中";
        case 3:
          return "已结班";
        case 9:
          return "已删除";
      }
    }

    const initSchedCourseCom = ref(null);
    function handleSetSchedCourse(row: any) {
      (initSchedCourseCom.value as any).handleOpen();
    }

    return {
      staticData,
      logoutIdentityCom,
      getAge,
      selectChange,
      searchObj,
      handleSearchInfo,
      assignedSelectList,
      dataList,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      viewStuDetail,
      selectStuList,
      handleSelectStatus,
      editClassCom,
      handleAddClass,
      batchDivideFormCheck,
      classStudentsCom,
      viewClassStu,
      handleDelStu,
      handleSureDelStu,
      getClassStatus,
      initSchedCourseCom,
      handleSetSchedCourse,
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

.handle-btn-box {
  > button {
    margin-left: 16px;
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
    border-radius: 8px;
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

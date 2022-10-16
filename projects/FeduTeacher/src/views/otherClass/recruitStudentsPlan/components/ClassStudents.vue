<template>
  <el-drawer
    custom-class="drawer-box"
    v-model="drawerStatus"
    :before-close="handleClose"
    destroy-on-close
    z-index="99"
  >
    <div class="wrap">
      <div class="top-box">
        <div class="avatar">
          <img
            :src="classInfo.classImg || require('@/assets/infant-avatar.png')"
            alt=""
          />
        </div>
        <div class="user-info">
          <div class="top-info">
            <span class="name">{{ classInfo.className || "暂无名称" }}</span>
          </div>
          <div class="bottom-info">
            <span>班级人数：{{ classInfo.classNum }}</span>
            <span
              >已上课次（时）：{{ classInfo.studentNum }}/{{
                classInfo.classNum
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="filter-box">
        <div class="left-box">
          <ui-input
            style="width: 200px; margin-right: 20px"
            v-model="searchObj.phoneOrName"
            placeholder="学员姓名/电话"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          >
          </ui-input>
          <SelectPostOrClass
            title="状态"
            placeholder="全部状态"
            width="140"
            :list="staticData.stuStatusList"
            @handleSelect="handleSelectStatus"
          ></SelectPostOrClass>
        </div>
        <div class="right-box">
          <ui-button @click="handleDelStu">批量移出</ui-button>
          <ui-button @click="handleChangeClass">批量转班</ui-button>
          <ui-button type="primary" @click="handleAddStu">加入学员</ui-button>
        </div>
      </div>
      <div class="table-box">
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
                  :src="row.head || require('@/assets/staff-avatar.png')"
                  alt=""
                />
                <span>{{ row.studentName }}</span>
              </div>
            </template>
          </ui-table-column>
          <ui-table-column prop="contacts" label="联系电话"></ui-table-column>
          <ui-table-column label="性别">
            <template #default="{ row }">
              <span>{{ row.sex === 1 ? "男" : "女" }}</span>
            </template>
          </ui-table-column>
          <ui-table-column prop="clazzName" label="已上课时"></ui-table-column>
          <ui-table-column prop="createTime" label="入班时间"></ui-table-column>
          <ui-table-column label="状态">
            <template #default="{ row }">
              <span>{{ getStuStatus(row.studentStatus) }}</span>
            </template>
          </ui-table-column>
          <ui-table-column label="操作" align="right">
            <template #default="{ row }">
              <div class="handle-box">
                <ui-button type="text-blue" @click="editStu(row)"
                  >编辑</ui-button
                >
                <ui-button
                  v-if="+row.studentStatus === 1 || +row.studentStatus === 3"
                  type="text-blue"
                  @click="stopStudyOrRecover(row)"
                  >{{
                    +row.studentStatus === 1 ? "休学" : "恢复在读"
                  }}</ui-button
                >
                <ui-button type="text-blue" @click="changeClass(row)"
                  >转班</ui-button
                >
                <ui-button type="text-blue" @click="endClass(row)"
                  >结课</ui-button
                >
                <ui-button type="text-blue" @click="delStu(row)"
                  >移出班级</ui-button
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
    </div>
  </el-drawer>
  <ui-modal
    v-model:visible="batchDetModalStatus"
    @close="batchDetModalStatus = false"
    @ok="handleSureDet"
    title="移出班级"
    width="420"
    :tips="false"
  >
    <p class="del-stu-tip">
      学员移出班级后，将不能在该班级继续上课，确定继续吗？
    </p>
    <div class="stu-remark">
      <span>备注</span
      ><ui-input v-model="detClassRemark" placeholder="请输入" />
    </div>
  </ui-modal>
  <ui-modal
    v-model:visible="endClassModalStatus"
    @close="endClassModalStatus = false"
    @ok="handleSureEndClass"
    title="结课"
    width="420"
    :tips="false"
  >
    <p class="del-stu-tip">
      学员结课后，将不能在该班级继续上课，同时释放班级名额占用，确定继续吗？
    </p>
    <div class="stu-remark">
      <span>备注</span
      ><ui-input v-model="endClassRemark" placeholder="请输入" />
    </div>
  </ui-modal>
  <ui-modal
    v-model:visible="stopStudyModalStatus"
    @close="stopStudyModalStatus = false"
    @ok="handleSureStopStudy"
    title="休学"
    width="420"
    :tips="false"
  >
    <p class="del-stu-tip">
      学员休学后，将不能在该班级继续上课，但依然占据班级名额，确定继续吗？
    </p>
    <div class="stu-remark">
      <span>备注</span
      ><ui-input v-model="stopStudyRemark" placeholder="请输入" />
    </div>
  </ui-modal>
  <ui-modal
    v-model:visible="recoverStudyModalStatus"
    @close="recoverStudyModalStatus = false"
    @ok="handleSureRecoverStudy"
    title="恢复在读"
    width="420"
    :tips="false"
  >
    <p class="del-stu-tip">确定要恢复在读吗？</p>
    <div class="stu-remark">
      <span>备注</span
      ><ui-input v-model="recoverStudyRemark" placeholder="请输入" />
    </div>
  </ui-modal>
  <ui-modal
    v-model:visible="btachChangeClass"
    @close="btachChangeClass = false"
    @ok="handleSureChangeClass"
    title="转班"
    width="480"
    :tips="false"
  >
    <div class="top-tips">
      共有 {{ selectStuList.length }} 个在读学员将被批量转班，请谨慎操作！
    </div>
    <div class="del-stu-remark">
      <ui-form
        :model="changeClassForm"
        :rules="staticData.changeClass"
        ref="batchChangeClassFormCheck"
        label-width="90"
      >
        <ui-form-item label="转出班级">
          <ui-input
            readonly
            v-model="classInfo.className"
            placeholder="请输入"
          />
        </ui-form-item>
        <ui-form-item label="转入班级" prop="destClazzId">
          <ui-select
            style="width: 100%"
            v-model="changeClassForm.destClazzId"
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
        </ui-form-item>
        <ui-form-item label="备注">
          <ui-input v-model="changeClassForm.commend" placeholder="请输入" />
        </ui-form-item>
      </ui-form>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Message from "@/themes/message";
import {
  getStudentsInClass,
  removeStudentsFromClass,
  getSelectClassInCourse,
  transferStudentsToClass,
  finishClassInClass,
  suspensionClassInClass,
  recoverReadingForStudents,
} from "@/api/recruitStudentsPlan";
import { throttle } from "@/utils/common";
import { staticData } from "../index";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";

export default defineComponent({
  components: {
    SelectPostOrClass,
  },
  setup() {
    const drawerStatus = ref(false);
    const loading = ref(true);
    const classInfo = ref<any>({}); //传过来的幼儿信息
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const dataList = ref([]); //学生列表
    const selectStuList = ref<string[]>([]); //选择的学生列表
    const batchDetModalStatus = ref(false); // 批量删除弹窗
    const btachChangeClass = ref(false); // 批量转班
    const batchClassList = ref<any[]>([]); // 班级列表
    const batchChangeClassFormCheck = ref(null); // 批量转班表单验证
    const endClassModalStatus = ref(false); // 结课弹窗
    const stopStudyModalStatus = ref(false); // 休息弹窗
    const recoverStudyModalStatus = ref(false); // 恢复在学弹窗

    // 弹窗中的备注字段
    const endClassRemark = ref("");
    const detClassRemark = ref("");
    const stopStudyRemark = ref("");
    const recoverStudyRemark = ref("");

    // 公用请求数据
    let commonReqData = {
      planId: "",
      courseId: "",
      clazzId: "",
    };

    //筛选条件
    const searchObj = ref({
      phoneOrName: "",
      studentStatus: "",
    });

    // 批量转班
    let changeClassForm = ref({
      destClazzId: "",
      commend: "",
    });

    // 关闭抽屉回调
    const handleClose = (): void => {
      selectStuList.value = [];
      drawerStatus.value = false;
    };

    // 打开抽屉
    const handleOpen = (res: any): void => {
      classInfo.value = res;
      commonReqData = {
        planId: classInfo.value.planId,
        courseId: classInfo.value.courseId,
        clazzId: classInfo.value.id,
      };
      getStudentsList();
      drawerStatus.value = true;
    };

    // 获取学员列表
    const getStudentsList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getStudentsInClass(
        currentPage.value,
        pageSize.value,
        {
          planId: classInfo.value.planId,
          courseId: classInfo.value.courseId,
          classId: classInfo.value.id,
          phoneOrName: searchObj.value.phoneOrName,
          studentStatus: searchObj.value.studentStatus,
        }
      );
      if (+code === 0) {
        dataList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };

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

    // 勾选
    function selectChange(res: any) {
      selectStuList.value = res;
      console.log(selectStuList.value);
    }

    // 编辑学生
    function editStu(row: any) {
      console.log(row);
    }

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getStudentsList();
    };

    // 输入框边输边查询
    watch(
      () => searchObj.value.phoneOrName,
      () => {
        throttle(() => {
          getStudentsList();
        }, 500);
      }
    );

    // 筛选状态
    function handleSelectStatus(res: any) {
      searchObj.value.studentStatus = res.value;
      getStudentsList();
    }

    // 获取批量转班中的班级列表
    async function handleGetSelectClassInCourse() {
      const { code, data } = await getSelectClassInCourse({
        planId: classInfo.value.planId,
        courseId: classInfo.value.courseId,
      });
      if (+code === 0) {
        batchClassList.value = data;
      }
    }

    // 批量转班
    function handleChangeClass() {
      if (selectStuList.value.length > 0) {
        handleGetSelectClassInCourse();
        btachChangeClass.value = true;
      }
    }

    // 单个转班
    function changeClass(row: any) {
      handleGetSelectClassInCourse();
      selectStuList.value = [row];
      btachChangeClass.value = true;
    }

    async function sureChangeClass() {
      const { code } = await transferStudentsToClass({
        planId: classInfo.value.planId,
        courseId: classInfo.value.courseId,
        srcClazzId: classInfo.value.id,
        destClazzId: changeClassForm.value.destClazzId,
        commend: changeClassForm.value.commend,
        students: selectStuList.value.map((item: any) => item.id),
      });
      if (+code === 0) {
        Message.success("转班成功");
        btachChangeClass.value = false;
        getStudentsList();
        selectStuList.value = [];
      }
    }

    // 确认转班
    function handleSureChangeClass() {
      (batchChangeClassFormCheck.value as any)?.validate((valid: boolean) => {
        if (valid) {
          console.log("验证通过");
          sureChangeClass();
        } else {
          console.log("验证失败");
        }
      });
    }

    // 批量移出
    function handleDelStu() {
      if (selectStuList.value.length > 0) {
        batchDetModalStatus.value = true;
      }
    }

    // 单个移除
    function delStu(row: any) {
      selectStuList.value = [row];
      batchDetModalStatus.value = true;
    }

    // 批量移出确认按钮
    async function handleSureDet() {
      const { code } = await removeStudentsFromClass({
        ...commonReqData,
        commend: detClassRemark.value,
        students: selectStuList.value.map((item: any) => item.id),
      });
      if (+code === 0) {
        Message.success("移出成功");
        batchDetModalStatus.value = false;
        getStudentsList();
        selectStuList.value = [];
      }
    }

    // 获取状态
    function getStuStatus(status: string) {
      switch (status) {
        case "1":
          return "在读";
        case "2":
          return "结课";
        case "3":
          return "休学";
        case "4":
          return "转班";
        case "5":
          return "移出";
      }
    }

    // 加入学员
    function handleAddStu() {
      return;
    }

    // 结课
    function endClass(row: any) {
      selectStuList.value = [row];
      endClassModalStatus.value = true;
    }

    // 确认结课
    async function handleSureEndClass() {
      const { code } = await finishClassInClass({
        ...commonReqData,
        commend: endClassRemark.value,
        students: selectStuList.value.map((item: any) => item.id),
      });
      if (+code === 0) {
        Message.success("结课成功");
        endClassModalStatus.value = false;
        getStudentsList();
        selectStuList.value = [];
      }
    }

    // 休学/恢复在读
    function stopStudyOrRecover(row: any) {
      selectStuList.value = [row];
      if (+row.studentStatus === 1) {
        stopStudyModalStatus.value = true;
      } else {
        recoverStudyModalStatus.value = true;
      }
    }

    // 确认休学
    async function handleSureStopStudy() {
      const { code } = await suspensionClassInClass({
        ...commonReqData,
        commend: stopStudyRemark.value,
        students: selectStuList.value.map((item: any) => item.id),
      });
      if (+code === 0) {
        Message.success("休学成功");
        stopStudyModalStatus.value = false;
        getStudentsList();
        selectStuList.value = [];
      }
    }

    // 确认恢复在读
    async function handleSureRecoverStudy() {
      const { code } = await recoverReadingForStudents({
        ...commonReqData,
        commend: recoverStudyRemark.value,
        students: selectStuList.value.map((item: any) => item.id),
      });
      if (+code === 0) {
        Message.success("恢复在读成功");
        recoverStudyModalStatus.value = false;
        getStudentsList();
        selectStuList.value = [];
      }
    }

    return {
      handleClose,
      handleOpen,
      drawerStatus,
      classInfo,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      loading,
      dataList,
      selectChange,
      editStu,
      searchObj,
      handleSearchInfo,
      handleSelectStatus,
      staticData,
      handleDelStu,
      handleChangeClass,
      handleAddStu,
      batchDetModalStatus,
      handleSureDet,
      btachChangeClass,
      changeClassForm,
      batchClassList,
      selectStuList,
      handleSureChangeClass,
      batchChangeClassFormCheck,
      getStuStatus,
      changeClass,
      delStu,
      endClass,
      endClassModalStatus,
      handleSureEndClass,
      endClassRemark,
      detClassRemark,
      stopStudyOrRecover,
      stopStudyRemark,
      handleSureStopStudy,
      stopStudyModalStatus,
      recoverStudyRemark,
      recoverStudyModalStatus,
      handleSureRecoverStudy,
    };
  },
});
</script>
<style lang="less">
.drawer-box {
  width: 960px !important;

  .wrap {
    width: 100%;
    padding: 0 40px 40px 40px;

    .top-box {
      display: flex;
      margin-bottom: 30px;

      .avatar {
        width: 60px;
        height: 60px;
        margin-right: 15px;
        > img {
          width: 60px;
          height: 60px;
          border-radius: 8px;
        }
      }

      .user-info {
        .top-info {
          margin-bottom: 7px;
          display: flex;
          align-items: center;
          .name {
            font-size: 24px;
            color: #222;
            margin-right: 14px;
          }
          .icon {
            line-height: 0;
            font-size: 16px;
            color: #9a9a9a;
            cursor: pointer;
            &:hover {
              color: #ff9900;
            }
          }
        }

        .bottom-info {
          font-size: 14px;
          color: #999;
          > span {
            margin-right: 20px;
          }
        }
      }
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

    .filter-box {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
      margin-bottom: 15px;

      .left-box {
        display: flex;
        align-items: center;
        // flex-wrap: wrap;

        // > div {
        //   margin-right: 16px;
        // }
      }

      .right-box {
        > button {
          margin-left: 16px;
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
  }
}

.del-stu-tip {
  font-size: 14px;
  color: #222222;
}

.stu-remark {
  margin-top: 20px;
  display: flex;
  align-items: center;
  > span {
    font-size: 14px;
    color: #666;
    width: 50px;
  }
}

.del-stu-remark {
  margin-top: 20px;
}

.top-tips {
  width: 420px;
  height: 32px;
  padding-left: 6px;
  line-height: 32px;
  font-size: 14px;
  background: #fcf5f5;
  border: 1px solid rgba(245, 96, 96, 0.2);
  color: #222;
  border-radius: 3px;
}

.handle-box {
  > button {
    margin-left: 16px;
  }
}
</style>

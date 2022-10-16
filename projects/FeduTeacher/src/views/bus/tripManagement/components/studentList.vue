<template>
  <el-drawer
    custom-class="tripStudentList"
    @close="close"
    v-model="visible"
    size="960px"
    class="show-box"
    :before-close="close"
    :title="`学生列表【${tripInfo.name}】`"
  >
    <div>
      <div class="formBox">
        <div class="left">
          <ui-input
            placeholder="输入姓名"
            class="input"
            icon="icon-a-101"
            @keydown.enter="searchStudent"
            @iconClick="searchStudent"
            v-model="fromData.studentName"
          />
        </div>
        <div class="right">
          <ui-button
            @click="delSelectStudent"
            :disabled="selectStudent.length === 0"
            >删除</ui-button
          >
          <ui-button
            icon="icon-a-81"
            @click="openAddStudent"
            type="primary"
            style="margin-left: 16px"
          >
            添加学生
          </ui-button>
        </div>
      </div>
      <ui-table
        checkbox
        @selectChange="getSelectStudent"
        :data="list"
        style="margin-top: 20px"
      >
        <ui-table-column label="学生姓名" prop="studentName"></ui-table-column>
        <ui-table-column label="电话" prop="contacts"></ui-table-column>
        <ui-table-column label="性别/年龄" prop="busNo">
          <template #default="{ row }">
            {{ +row.sex === 1 ? "男" : "女" }}/{{
              dayjs().diff(row.birthTime, "year")
            }}岁
          </template>
        </ui-table-column>
        <ui-table-column label="班级" prop="clazzName"></ui-table-column>
      </ui-table>
      <div class="pageBox">
        <ui-pagination
          style="margin-top: 20px"
          @size-change="pageSizeChange"
          @current-change="pageChange"
          :current-page="pageForm.pageNo"
          :page-size="pageForm.pageSize"
          :total="pageForm.totalNum"
        ></ui-pagination>
      </div>
    </div>
  </el-drawer>
  <AddStudents ref="addStudents" />
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, reactive, ref } from "vue";
import { PageForm } from "@/api/interface";
import {
  QueryTripStudentListParams,
  QueryTripListParams,
} from "@/views/bus/tripManagement/interface";
import {
  addStudentToTrip,
  deleteStudentToTrip,
  queryStudentTripList,
} from "@/api/bus";
import AddStudents from "./AddStudents.vue";
import { ElMessage } from "element-plus";
import dayjs from "dayjs";
// import relativeTime from "dayjs/plugin/relativeTime";
// import localizedFormat from "dayjs/plugin/localizedFormat";
// import "dayjs/locale/zh-cn";
// dayjs.locale("zh-cn");
// dayjs.extend(localizedFormat);
// dayjs.extend(relativeTime);

const $emit = defineEmits(["close"]);

const visible = ref(false);
const pageForm = reactive<PageForm>({
  pageNo: 1,
  pageSize: 20,
  totalNum: 0,
});

const tripInfo = ref<any>({});

const fromData = reactive<QueryTripStudentListParams>({
  pid: "",
  studentName: "",
});

const addStudents = ref(null);
//打开选择学生弹窗
const openAddStudent = () => {
  (addStudents.value as any).handleOpen(tripInfo.value).then((res: any[]) => {
    saveStudentToTrip(res);
  });
};

const saveStudentToTrip = (data: any[]) => {
  const student = data.map((item) => ({
    studentId: item.studentId,
    studentName: item.name,
    clazzId: item.clazzId,
  }));
  addStudentToTrip(tripInfo.value.id, student).then((res) => {
    if (+res.code === 0) {
      ElMessage.success("保存学生成功");
      getStudentList();
    }
  });
};

const open = (data: any) => {
  tripInfo.value = data;
  visible.value = true;
  fromData.pid = data.id;
  getStudentList();
};
const close = () => {
  visible.value = false;
  $emit("close");
};

const pageChange = (page: number) => {
  pageForm.pageNo = page;
  getStudentList();
};
const pageSizeChange = (pageSize: number) => {
  pageForm.pageSize = pageSize;
  getStudentList();
};
const searchTrip = () => {
  pageForm.pageNo = 1;
  getStudentList();
};
const list = ref([]);

const searchStudent = () => {
  pageForm.pageNo = 1;
  getStudentList();
};

//获取学生列表
const getStudentList = () => {
  queryStudentTripList(Object.assign(pageForm, fromData)).then((res) => {
    if (+res.code === 0) {
      list.value = res.data.list;
      pageForm.pageNo = res.data.page.pageNo;
      pageForm.pageSize = res.data.page.pageSize;
      pageForm.totalNum = res.data.page.totalNum;
    }
  });
};

const selectStudent = ref<string[]>([]);
const getSelectStudent = (res: any[]) => {
  selectStudent.value = res.map((item) => item.id);
};
const delSelectStudent = () => {
  deleteStudentToTrip(tripInfo.value.id, selectStudent.value).then((res) => {
    if (+res.code === 0) {
      ElMessage.success("删除学生成功");
      searchStudent();
    } else {
      ElMessage.warning(res.msg);
    }
  });
};

defineExpose({
  open,
});
</script>

<style lang="less">
.tripStudentList {
  //background: #0ec2ee;
  padding: 24px 40px;
  box-sizing: border-box;
  .formBox {
    margin-top: 20px;
    font-size: 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    .label {
      color: #999999;
      font-size: 14px;
      margin-right: 6px;
    }
    .selectBox {
      width: 140px;
      margin-right: 16px;
    }
    .input {
      width: 200px;
    }
  }
}
</style>

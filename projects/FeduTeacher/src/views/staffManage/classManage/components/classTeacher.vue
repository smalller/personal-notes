<template>
  <div class="manage-teacher">
    <div v-loading="loading">
      <ui-table :data="teacherInfo" class="tableBoxItem">
        <ui-table-column prop="name" label="班级老师" align="center">
        </ui-table-column>
        <ui-table-column prop="mobile" label="手机号" align="center">
        </ui-table-column>
        <ui-table-column
          prop="title"
          label="称谓"
          align="center"
        ></ui-table-column>
        <ui-table-column prop="settleApp" label="入驻App" tips="" align="right">
          <template #default="{ row }">
            <ui-tag :type="+row.settleApp === 1 ? 'success' : 'danger'">
              {{ +row.settleApp === 1 ? "已入驻" : "未入驻" }}
            </ui-tag>
          </template>
        </ui-table-column>

        <ui-table-column prop="id" label="操作" align="right">
          <template #default="{ row }">
            <ul class="handle-box">
              <li>
                <ui-button
                  v-if="type === 0"
                  style="color: #bfbfbf"
                  type="text-blue"
                  @click="closeTeacher(row)"
                  >移除</ui-button
                >
              </li>
            </ul>
          </template>
        </ui-table-column>
      </ui-table>
    </div>

    <ui-button
      v-if="!showClass && +type === 0"
      icon="icon-a-81"
      style="color: #ffffff; background-color: #ffac2e; margin-top: 15px"
      @click="handleAdd"
      >添加教师</ui-button
    >
    <div v-if="showClass">
      <div style="border-bottom: 1px solid #eee">
        <ui-button @click="showClass = !showClass" style="margin-top: 15px"
          >收起列表 <ui-icon icon="icon-a-51"></ui-icon>
        </ui-button>
      </div>
      <div class="teacher-list">
        <span>选择要填加的老师</span>
        <ui-input
          class="teacher-input"
          v-model="searchInfo"
          placeholder="请输入教师姓名"
          @keydown.enter="handleSearchInfo"
          @iconClick="handleSearchInfo"
          icon="icon-a-101"
        ></ui-input>
      </div>
      <div v-loading="loadingList">
        <ui-table :data="schoolTeacher" class="tableBoxItem">
          <ui-table-column prop="name" label="班级老师" align="center">
          </ui-table-column>
          <ui-table-column prop="mobile" label="手机号" align="center">
          </ui-table-column>
          <ui-table-column
            prop="title"
            label="称谓"
            align="center"
          ></ui-table-column>
          <ui-table-column prop="settleApp" label="入驻App" align="right">
            <template #default="{ row }">
              <ui-tag :type="+row.settleApp === 1 ? 'danger' : 'success'">
                {{ +row.settleApp === 1 ? " 未入驻" : "已入驻" }}
              </ui-tag>
            </template>
          </ui-table-column>

          <ui-table-column prop="id" label="操作" align="right">
            <template #default="{ row }">
              <ul class="handle-box">
                <li>
                  <ui-button type="text-blue" @click="addTeacher(row)"
                    >添加</ui-button
                  >
                </li>
              </ul>
            </template>
          </ui-table-column>
        </ui-table>
      </div>

      <Nodata
        v-if="schoolTeacher.length === 0 && !loadingList"
        :type="1"
      ></Nodata>

      <ui-pagination
        v-if="schoolTeacher.length !== 0"
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalNum"
      ></ui-pagination>
    </div>
    <ClassManage ref="manageClassModel" @update="delTeacher()"></ClassManage>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, watch, reactive } from "vue";
import { getTeacherInfo, addClassTeacher } from "@/api/classManage";
import { useStore } from "vuex";
import Message from "@/themes/message";
import { throttle } from "@/utils/common";
import { setTableData } from "@/utils/common";
import Nodata from "./noData.vue";
import ClassManage from "./classManage.vue";

interface ruleForm {
  classIcon: string;
  className: string;
  classGrade: string;
  classTime: string;
}
interface addClass {
  title: string;
  width: string | number;
  open: boolean;
}
interface teacherList {
  name: string;
  clazzId: string;
  employeeId: string;
  enableStatus: number | string;
  schoolId: string;
  title: string;
  settleApp?: number | string;
  clazzIds: Array<string>;
}
export default defineComponent({
  props: {
    className: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    type: {
      type: [String, Number],
    },
    classId: {
      type: String,
      default: "",
    },
  },
  components: {
    Nodata,
    ClassManage,
  },
  setup(props) {
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const $store = useStore();
    const showClass = ref(false);
    const manageClassModel = ref(null); //管理模块
    const loading = ref(true);
    const loadingList = ref(true);
    const classMode = ref({
      className: props.className,
      width: props.width,
      type: props.type,
    });
    //班级教师信息
    const teacherInfo = reactive([] as Array<teacherList>);
    //获取班级基本信息
    const getTeacherInfos = async () => {
      loading.value = true;
      teacherInfo.length = 0;
      let id = props.classId;
      if (id) {
        let { code, data } = await getTeacherInfo(id);
        if (+code === 0 && data.list.length > 0) {
          data.list.forEach((listItem: teacherList) => {
            teacherInfo.push(listItem);
          });
        }
        loading.value = false;
      }
    };
    //学校教师信息
    const schoolTeacher = reactive([] as Array<teacherList>);
    const getTeacherLists = async (): Promise<any> => {
      let url = "/schools/api/employee/query";
      loadingList.value = true;
      schoolTeacher.length = 0;
      let { code, data } = await setTableData(
        url,
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            name: searchInfo.value,
            jobStatus: 1,
          }
        )
      );
      if (+code === 0 && data.list.length > 0) {
        data.list.forEach((listItem: teacherList) => {
          if (
            listItem.clazzIds &&
            listItem.clazzIds.indexOf(props.classId) === -1
          ) {
            let teacher = listItem;
            schoolTeacher.push(teacher);
          }
        });
        totalNum.value = data.page.totalNum;
      }
      loadingList.value = false;
    };

    watch(props, async () => {
      console.log("2221111111");
      teacherInfo.length = 0;
      getTeacherInfos();
    });

    onMounted(async () => {
      teacherInfo.length = 0;
      getTeacherInfos();
    });

    //初始化班级数据
    const ruleForm: ruleForm = {
      classIcon: "",
      className: "",
      classGrade: "",
      classTime: "",
    };
    //添加班级
    const addClass: addClass = {
      title: "新增班级",
      width: 600,
      open: true,
    };

    //关闭弹窗
    const handleClose = () => {
      console.log("1");
    };
    //添加班级教师
    const handleAdd = () => {
      showClass.value = true;
      // getSchoolInfo();
      getTeacherLists();
    };
    //绑定老师到班级
    const addTeacher = async (row: any) => {
      console.log(row);
      let data = ref({
        clazzId: props.classId,
        employeeId: row.id,
        enableStatus: 1,
        schoolId: $store.state.user.schoolId,
        title: row.title,
      });
      let { code } = await addClassTeacher(data);
      if (+code === 0) {
        Message.success("添加教师成功！");
        await getTeacherInfos();
        await getTeacherLists();
      }
    };
    //解绑老师
    const closeTeacher = async (row: any) => {
      let data = { ...row };
      data.classId = props.classId;
      if (row.id) {
        (manageClassModel.value as any).handleOpen("teacher", data);
      }
    };
    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getTeacherLists();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      console.log(res);
      currentPage.value = res;
      getTeacherLists();
    };
    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getTeacherLists();
    };
    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getTeacherLists();
        }, 500);
      }
    );
    const delTeacher = async () => {
      await getTeacherInfos();
      await getTeacherLists();
    };
    return {
      classMode,
      ruleForm,
      addClass,
      handleClose,
      handleAdd,
      showClass,
      teacherInfo,
      schoolTeacher,
      addTeacher,
      closeTeacher,
      handleSizeChange,
      handleCurrentChange,
      searchInfo,
      handleSearchInfo,
      totalNum,
      manageClassModel,
      delTeacher,
      loading,
      loadingList,
      currentPage,
    };
  },
});
</script>
<style lang="less" scoped>
.manage-teacher {
  //   overflow: scroll;
  .teacher-list {
    margin-top: 10px;
    margin-bottom: 20px;
    .teacher-input {
      width: 200px;
      float: right;
    }
  }
}
</style>

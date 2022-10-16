<template>
  <div class="schoolEnrollment">
    <el-drawer
      v-model="modeStatus.showView"
      :with-header="false"
      size="960px"
      class="show-box"
    >
      <div class="show-box" v-if="modeStatus.showView">
        <phoneShow
          :id="selectId"
          :school="schoolInfo ? schoolInfo : ''"
          @close="closePre"
        ></phoneShow>
      </div>
      <!-- <manage :classStatus="tableIndex" :classData="selectClassInfo"></manage> -->
    </el-drawer>
    <logoutIdentity ref="logoutIdentityCom" @handleSure="handleDelStudent">
      <p class="body-text" style="font-size: 14px; color: #f56060">
        删除后不可恢复，只能重新录入
      </p>
    </logoutIdentity>
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="school-info" v-loading="loading">
      <ui-card class="chartBox">
        <div class="bin">
          <div>
            <listSelect
              :option="enrollmentList"
              @selectItem="getSchoolAdv"
              v-if="enrollmentList.length"
            ></listSelect>
            <div class="school-img">
              <img :src="selectInfo.url" alt="" />
            </div>
            <div class="top-button">
              <ui-button
                class="show-button"
                @click="show"
                v-if="enrollmentList.length"
                >预览</ui-button
              >
            </div>
          </div>
        </div>
        <div class="line">
          <schoolLine
            v-if="enrollmentList.length"
            :option="selectId"
          ></schoolLine>
        </div>
      </ui-card>
    </div>
    <div class="school-table">
      <ui-card>
        <ui-tab v-model:index="tableIndex" :list="['报名幼儿']"></ui-tab>
        <div class="fromBox">
          <div>
            <div class="from-item">
              <DateFilter @handleSelectDate="handleSelectDate"></DateFilter>
            </div>
            <div class="from-item">
              <ui-input
                maxlength="40"
                style="width: 240px"
                v-model="searchInfo"
                placeholder="输入姓名或手机号"
                icon="icon-a-101"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
            </div>
          </div>
          <div class="from-items">
            <div class="del">
              <ui-button class="button" @click="deleteStudent">删除</ui-button>
              <div v-if="isDelete" class="is-empty-data">
                <span>请至少选择一项</span>
              </div>
            </div>
            <ui-button
              type="text"
              icon="icon-a-31"
              class="button"
              @click="handleExportStudents"
              >导出Excel</ui-button
            >
          </div>
        </div>
        <div v-loading="loading">
          <ui-table
            :data="studentList"
            class="tableBoxItem"
            :checkbox="true"
            @selectChange="chooseClass"
          >
            <ui-table-column prop="stuName" label="幼儿名称" align="left">
              <template #default="{ row }">
                <div class="itemNameBox">
                  <!-- <img :src="row.clazzImg" alt="" v-if="row.clazzImg" /> -->
                  <span>{{ row.stuName }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column prop="mobile" label="家长电话" align="left">
            </ui-table-column>
            <ui-table-column label="性别" align="left">
              <template #default="{ row }">
                <span>{{ +row.sex === 0 ? "女" : "男" }}</span>
              </template>
            </ui-table-column>
            <ui-table-column label="年龄" align="left">
              <template #default="{ row }">
                <span>{{ setTime(row.stuBirthday) }}</span>
              </template>
            </ui-table-column>
            <ui-table-column prop="createTime" label="报名时间" align="left">
            </ui-table-column>
            <ui-table-column prop="recommender" label="推荐人" align="left">
            </ui-table-column>
          </ui-table>
        </div>
        <ui-pagination
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalNum"
        ></ui-pagination>
      </ui-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute } from "vue-router";
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { ElDrawer } from "element-plus";
import DateFilter from "@/components/DateFilter.vue";
import listSelect from "./components/listSelect.vue";
import schoolLine from "./components/schoolLine.vue";
import phoneShow from "./components/phoneShow.vue";
import {
  getEnrollmentList,
  getStudentList,
  delStudent,
} from "@/api/enrollmentManage";
import { useStore } from "vuex";
import { listItem } from "./idnex";
import { throttle } from "@/utils/common";
import micell from "micell";
import Message from "@/themes/message";
import { download } from "@/base/common";
import logoutIdentity from "@/components/logoutIdentity.vue";

export default defineComponent({
  components: {
    DateFilter,
    listSelect,
    schoolLine,
    ElDrawer,
    phoneShow,
    logoutIdentity,
  },
  setup() {
    const route = useRoute();
    const $store = useStore();
    const tableIndex = ref(0);
    const schoolInfo = sessionStorage.getItem("schoolId");
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const searchInfo = ref(""); //检索信息
    const selectId = ref(""); //选择的招生ID
    const selectInfo = ref({} as any); //选择的数据
    const yearsList = reactive([
      {
        name: "春招样式-2021-08-10",
      },
    ]);
    //页面状态控制
    const modeStatus = ref({
      showView: false,
      addClassList: false,
      editClass: false,
      showManage: false,
    });
    //预览页面
    const show = () => {
      modeStatus.value.showView = true;
    };
    const loading = ref(true);
    const studentList = ref([]);
    let enrollmentList = ref([] as Array<listItem>);
    //获取招生列表
    const getList = () => {
      loading.value = true;
      let schoolId = $store.state.user.schoolId;
      getEnrollmentList(schoolId).then((res) => {
        if (+res.code === 0) {
          enrollmentList.value = [...res.data.list];
          loading.value = false;
          selectId.value = enrollmentList?.value[0].id;
          selectInfo.value = { ...enrollmentList?.value[0] };
          getStudent();
        }
      });
    };
    const getStudent = async (): Promise<any> => {
      // let url = "/schools/api/clazz/query";
      // checkRowInfo.value.length = 0;
      loading.value = true;
      let { code, data } = await getStudentList(
        selectId.value,
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            // grade: titleGrade.value,
            startTime: startTime.value,
            endTime: endTime.value,
            keywords: searchInfo.value,
          }
        )
      );
      if (+code === 0) {
        studentList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    //获取招生简章列表
    onMounted(() => {
      getList();
    });
    //获取招生简章
    const getSchoolAdv = (data: listItem) => {
      if (data) {
        selectId.value = data.id;
        console.log(selectId.value, "7777777777777");
        selectInfo.value = { ...data };
        getStudent();
      }
    };
    //处理学生年龄
    const setTime = (time: string) => {
      var birArr = time.split("-");
      var birYear = +birArr[0];
      var birMonth = +birArr[1];
      var birDay = +birArr[2];
      var monthData = 0;
      d = new Date();
      var nowYear = d.getFullYear();
      var nowMonth = d.getMonth() + 1; //记得加1
      var nowDay = d.getDate();
      var returnAge;
      if (birArr == null) {
        return false;
      }
      var d = new Date(birYear, birMonth - 1, birDay);
      if (
        d.getFullYear() == birYear &&
        d.getMonth() + 1 == birMonth &&
        d.getDate() == birDay
      ) {
        if (nowYear == birYear) {
          returnAge = 0; //
        } else {
          var ageDiff = nowYear - birYear; //
          if (ageDiff > 0) {
            if (nowMonth == birMonth) {
              var dayDiff = nowDay - birDay; //
              if (dayDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            } else {
              var monthDiff = nowMonth - birMonth; //
              monthData = monthDiff ? monthDiff : 0;
              if (monthDiff < 0) {
                returnAge = ageDiff - 1;
              } else {
                returnAge = ageDiff;
              }
            }
          } else {
            return "出生日期晚于今天，数据有误"; //返回-1 表示出生日期输入错误 晚于今天
          }
        }
        let year = monthData
          ? returnAge + "岁" + monthData + "个月"
          : returnAge + "岁";
        return year;
      } else {
        return "输入的日期格式错误！";
      }
    };

    const selectData = ref([] as Array<any>); //选择的学生
    const logoutIdentityCom = ref(null);
    const isDelete = ref(false);
    //获取选择数据
    const chooseClass = (data: any) => {
      if (data) {
        selectData.value = [...data];
      }
    };

    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (): void => {
      isDelete.value = true;
      let timer = null;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        isDelete.value = false;
      }, 2000);
    };
    // 删除幼儿
    function deleteStudent() {
      if (selectData.value.length === 0) {
        checkIsEmptyData();
      } else {
        (logoutIdentityCom.value as any).handleOpen(
          `确认将勾选的${selectData.value.length}个学生删除吗？`
        );
      }
    }

    const handleDelStudent = async () => {
      const arr = selectData.value.map((item: any) => item.id);
      const { code } = await delStudent(arr);
      if (+code === 0) {
        Message.success("删除成功");
        selectData.value = [];
        getStudent();
      }
    };
    //切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getStudent();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getStudent();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getStudent();
    };
    // 日期筛选
    const handleSelectDate = (res: string): void => {
      if (res) {
        startTime.value = micell.date.format(res[0], "YYYY-MM-DD");
        endTime.value = micell.date.format(res[1], "YYYY-MM-DD");
      } else {
        startTime.value = "";
        endTime.value = "";
      }
      getStudent();
    };
    // 导出excel
    const handleExportStudents = (): void => {
      if (studentList.value.length > 0) {
        download(
          process.env.VUE_APP_BASE_API + "/schools/api/studentSign/exportSign",
          "幼儿报名信息"
        );
      } else {
        Message.warning("暂无数据可导出");
      }
    };
    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getStudent();
        }, 500);
      }
    );
    const closePre = () => {
      modeStatus.value.showView = false;
    };

    return {
      route,
      tableIndex,
      yearsList,
      modeStatus,
      show,
      loading,
      enrollmentList,
      getSchoolAdv,
      currentPage,
      pageSize,
      totalNum,
      studentList,
      chooseClass,
      setTime,
      selectId,
      selectInfo,
      handleSizeChange,
      handleCurrentChange,
      searchInfo,
      handleSelectDate,
      handleExportStudents,
      schoolInfo,
      closePre,
      isDelete,
      deleteStudent,
      logoutIdentityCom,
      handleDelStudent,
      handleSearchInfo,
    };
  },
});
</script>
<style lang="less" scoped>
.schoolEnrollment {
  padding: 24px 40px;
  box-sizing: border-box;
  .show-box {
    width: 960px;
    height: 100%;
    background: linear-gradient(0deg, #46d2e8, #008fbc);
    box-shadow: 0px 2px 8px 0px undefined;
  }
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .chartBox {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;
    .bin {
      width: 400px;
      margin-bottom: 10px;
      margin-right: 80px;
      //   height: 260px;
      .school-img {
        margin-top: 10px;
        // margin-left: 25px;
        width: 400px;
        height: 258px;
        border: 1px solid #eeeeee;
        img {
          width: 400px;
        }
      }
      .top-button {
        display: flex;
        justify-content: center;
        width: 400px;
        .show-button {
          margin-top: 10px;
        }
      }
    }
    .line {
      flex-grow: 1;
      height: 300px;
      width: 300px;
    }
  }
  .school-table {
    margin-top: 24px;
    .fromBox {
      display: flex;
      padding: 22px 0 15px 0;
      flex-wrap: wrap !important;
      justify-content: space-between;
      > div {
        display: flex;
        flex-wrap: wrap;
      }
      .from-item {
        margin-right: 15px;
        margin-bottom: 10px;
        display: flex;
        white-space: nowrap;
        align-items: center;
      }
      .from-items {
        display: flex;
        flex-wrap: wrap;
        .del {
          .is-empty-data {
            height: 45px;
            position: absolute;
            top: 585px;
            right: 130px;
            width: 128px;
            font-size: 14px;
            border-radius: 4px;
            text-align: center;
            line-height: 45px;
            background-color: #f56060;
            color: #fff;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

            > span {
              position: relative;
              display: block;
              width: 100%;
              height: 100%;

              &::before {
                display: block;
                content: "";
                width: 0;
                position: absolute;
                bottom: -20px;
                left: 64px;
                margin-left: -10px;
                border: 10px solid transparent;
                border-top: 10px solid #f56060;
              }
            }
          }
        }
        .button {
          width: 64px;
          height: 32px;
          padding: 0px;
          margin-left: 15px;
        }
      }
    }
  }
}
</style>

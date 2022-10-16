<template>
  <div class="enrollProject">
    <el-drawer
      v-model="modeStatus.showView"
      :with-header="false"
      size="960px"
      class="show-box"
    >
      <div class="show-box" v-if="modeStatus.showView">
        <phoneShow
          :school="schoolInfo ? schoolInfo : ''"
          :id="modeStatus.id"
          @close="closePre"
        ></phoneShow>
      </div>
    </el-drawer>
    <logoutIdentity ref="logoutIdentityCom" @handleSure="handleDel">
      <p class="body-text" style="font-size: 14px; color: #f56060">
        删除后不可恢复，只能重新录入
      </p>
    </logoutIdentity>
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="school-table">
      <ui-card style="min-height: 600px">
        <span class="enroll-title">校园官网</span>
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
                placeholder="输入标题"
                icon="icon-a-101"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
            </div>
          </div>
          <div class="from-items">
            <div class="del">
              <ui-button class="button" @click="deleteProject">删除</ui-button>
              <div v-if="isDelete" class="is-empty-data">
                <span>请至少选择一项</span>
              </div>
            </div>
            <ui-button
              type="primary"
              icon="icon-a-81"
              class="button"
              @click="goToAdd"
              >新增</ui-button
            >
          </div>
        </div>
        <div class="show-table" v-loading="loading">
          <ui-table
            :data="schoolList"
            :checkbox="true"
            @selectChange="chooseClass"
          >
            <ui-table-column prop="name" align="left">
              <template #default="{ row }">
                <div class="list-show">
                  <div>
                    <img class="show-img" :src="row.url" alt="" />
                  </div>
                  <div class="show-info">
                    <div class="show-top">
                      <span class="show-title">{{ row.admissionsTitle }}</span>
                      <div class="show-button" v-if="+row.rstatus === 1">
                        <span>已发布</span>
                      </div>
                    </div>
                    <span class="show-style">样式：{{ row.templateName }}</span>
                  </div>
                  <div class="show-action">
                    <div class="show-time">
                      <span>{{ row.createTime }}</span>
                      <span>{{ row.createUser }}</span>
                    </div>
                    <div class="action-button">
                      <ui-button
                        class="action"
                        type="text-blue"
                        @click="editClass(row)"
                        >预览</ui-button
                      >
                      <ui-button
                        class="action"
                        type="text-blue"
                        @click="goToEdit(row.id)"
                        >编辑</ui-button
                      >
                    </div>
                  </div>
                </div>
              </template>
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
import { useRoute, useRouter } from "vue-router";
import { defineComponent, ref, onMounted, watch } from "vue";
import DateFilter from "@/components/DateFilter.vue";
import { getSchoolList, delProject } from "@/api/enrollmentManage";
import { ElDrawer } from "element-plus";
import phoneShow from "../schoolEnrollment/components/phoneShow.vue";
import micell from "micell";
import { throttle } from "@/utils/common";
import Message from "@/themes/message";
import logoutIdentity from "@/components/logoutIdentity.vue";

export default defineComponent({
  components: {
    DateFilter,
    ElDrawer,
    phoneShow,
    logoutIdentity,
  },
  setup() {
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const loading = ref(true);
    const route = useRoute();
    const router = useRouter();
    const schoolInfo = sessionStorage.getItem("schoolId");
    const tableIndex = ref(0);
    const schoolList = ref([]);
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const searchInfo = ref(""); // 输入框搜索值
    //页面状态控制
    const modeStatus = ref({
      showView: false,
      addClassList: false,
      editClass: false,
      showManage: false,
      id: "",
    });
    //预览页面
    const show = () => {
      modeStatus.value.showView = true;
    };
    //切换表单
    const getTableIndex = () => {
      //   searchInfo.value = ""; // 输入框搜索值
      //   titleGrade.value = ""; // 年级筛选值
      //   startTime.value = ""; // 筛选开始时间
      //   endTime.value = ""; // 筛选结束时间
      //   if (+tableIndex.value === 0) {
      //     getClassLists();
      //   } else {
      //     getClassListOver();
      //   }
    };
    // 跳转到发布/编辑通知页面
    function goToAdd() {
      let routeUrl = router.resolve({
        path: "/recipeDetail/school",
      });
      window.open(routeUrl.href, "_blank");
    }
    function goToEdit(id: string) {
      let routeUrl = router.resolve({
        path: "/recipeDetail/school",
        query: { id: id },
      });
      window.open(routeUrl.href, "_blank");
    }
    //获取招生列表
    const getClassLists = async (): Promise<any> => {
      loading.value = true;
      let { code, data } = await getSchoolList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            // grade: titleGrade.value,
            startTime: startTime.value,
            endTime: endTime.value,
            title: searchInfo.value,
          }
        )
      );
      if (+code === 0) {
        schoolList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    //切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getClassLists();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getClassLists();
    };
    onMounted(() => {
      window.addEventListener("message", (e) => {
        if (e.origin === location.origin) {
          switch (e.data) {
            case "updateEnrolment":
              getClassLists();
              break;
          }
        }
      });
    });
    onMounted(() => {
      getClassLists();
    });
    const editClass = (data: any) => {
      if (data) {
        console.log(data, sessionStorage.getItem("schoolId"));
        modeStatus.value.showView = true;
        modeStatus.value.id = data.id;
      }
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
      getClassLists();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getClassLists();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getClassLists();
        }, 500);
      }
    );
    const closePre = () => {
      modeStatus.value.showView = false;
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
    function deleteProject(data: any) {
      if (selectData.value.length === 0) {
        checkIsEmptyData();
      } else {
        (logoutIdentityCom.value as any).handleOpen(
          `确认将勾选的${selectData.value.length}个宣传删除吗？`
        );
      }
    }

    const handleDel = async () => {
      const arr = selectData.value.map((item: any) => item.id);
      const { code } = await delProject(arr);
      if (+code === 0) {
        Message.success("删除成功");
        selectData.value = [];
        getClassLists();
      }
    };

    return {
      route,
      tableIndex,
      getTableIndex,
      schoolList,
      modeStatus,
      show,
      currentPage,
      pageSize,
      totalNum,
      handleSizeChange,
      handleCurrentChange,
      chooseClass,
      editClass,
      schoolInfo,
      handleSelectDate,
      searchInfo,
      handleSearchInfo,
      closePre,
      goToAdd,
      goToEdit,
      isDelete,
      deleteProject,
      logoutIdentityCom,
      handleDel,
      loading,
    };
  },
});
</script>
<style lang="less">
.enrollProject {
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
  .school-table {
    margin-top: 24px;
    .enroll-title {
      font-size: 20px;
      font-weight: 400;
      text-align: left;
      color: #222222;
    }

    .fromBox {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap !important;
      margin: 10px 0 10px 5px;
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
            top: 145px;
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
    .show-table {
      border-top: 1px solid #eeeeee;
      .list-show {
        width: 100%;
        display: flex;
        .show-img {
          width: 128px;
          height: 96px;
          border: 1px solid #eeeeee;
          margin: 20px 0 20px 15px;
        }
        .show-info {
          width: 80%;
          margin-top: 20px;
          margin-left: 20px;
          // border: 1px solid #eeeeee;
          .show-top {
            display: flex;
            .show-title {
              font-size: 16px;
              font-weight: 400;
              color: #222222;
            }
            .show-button {
              margin-left: 10px;
              width: 52px;
              height: 22px;
              background: #ff9900;
              text-align: center;
              border-radius: 3px;
              span {
                width: 36px;
                height: 17px;
                font-size: 12px;
                font-weight: 400;
                color: #ffffff;
              }
            }
          }
          .show-style {
            display: block;
            margin-top: 54px;
            width: 98px;
            height: 20px;
            font-size: 14px;
            font-weight: 400;
            text-align: left;
            color: #999999;
          }
        }
        .show-action {
          width: 20%;
          margin-top: 20px;
          margin-left: 20px;
          .show-time {
            display: grid;
            text-align: right;
            span {
              margin-bottom: 10px;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
            }
          }
          .action-button {
            float: right;
            display: flex;
            margin-top: 15px;
            .action {
              margin-left: 15px;
            }
          }
        }
      }
    }
  }
  .ui-table-thead {
    width: 100%;
    height: 10px;
    display: none;
    background: #fafafa;
  }
}
</style>

<template>
  <div class="wrap">
    <div class="top-title">
      <span class="back-btn" @click="handleBack">
        <ui-icon icon="icon-a-zu2566"></ui-icon>
        返回
      </span>
      <span class="shu"></span>
      <span class="view-course">查看课程</span>
    </div>
    <ui-card class="top-card" v-if="planInfo">
      <div class="img-box">
        <img
          :src="planInfo.pic || require('@/assets/staff-avatar.png')"
          alt=""
        />
      </div>
      <div class="right-content flex-col-1">
        <ul class="flex-col-1">
          <li>
            <div class="live-title">
              <span class="live-name">{{ planInfo.name }}</span>
              <span
                :class="[
                  'live-status',
                  getLiveStatusBg(+planInfo.publishStatus),
                ]"
                >{{ getLiveStatusStr(+planInfo.publishStatus) }}</span
              >
            </div>
            <div class="handle-box">
              <ui-button type="text-blue" @click="handleChangeStatus">{{
                +planInfo.publishStatus === 0 ? "上架" : "下架"
              }}</ui-button>
              <ui-button
                style="margin-left: 16px"
                @click="sharePlan(planInfo)"
                type="text-blue"
                id="share-btn"
                >分享</ui-button
              >
              <sharePlan
                v-show="showQr"
                :text="planInfo.shareUrl"
                top="40"
                left="-6"
                arrows="top"
              ></sharePlan>
            </div>
          </li>
          <li>
            <div class="live-info">
              <ul>
                <li>
                  报名截止日期：{{
                    dayjs(planInfo.endTime).format("YYYY-MM-DD")
                  }}
                </li>
              </ul>
            </div>
          </li>
          <li style="justify-content: flex-end">
            <!-- <div class="live-data">报名人次：{{ "000" }}</div> -->
            <div class="hanlde-box">
              <!-- <ui-button type="text" icon="icon-a-31">导出学员</ui-button> -->
              <ui-button
                type="primary"
                icon="icon-a-81"
                @click="handleAddCourse(planInfo.id)"
                >添加课程</ui-button
              >
            </div>
          </li>
        </ul>
      </div>
    </ui-card>
    <ui-card class="botom-card">
      <div v-loading="loading">
        <courseList
          :data="courseList"
          @editCourseComplete="editCourseComplete"
          @setPageInfo="setPageInfoInSession"
        ></courseList>
        <ui-pagination
          style="margin-top: 20px"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalNum"
        ></ui-pagination>
      </div>
    </ui-card>
  </div>
  <ui-modal
    v-model:visible="putawayModalStatus"
    :title="`${modalTitle}招生计划`"
    @ok="handleSurePutaway"
    :tips="false"
  >
    <div class="body-text">确认要{{ modalTitle }}该招生计划吗？</div>
  </ui-modal>
  <editPlan ref="editPlanCom"></editPlan>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import {
  staticData,
  ListRow,
  getLiveStatusStr,
  getLiveStatusBg,
} from "../index";
import { useRoute, useRouter } from "vue-router";
import {
  queryCourses,
  upOrDownCourse,
  queryOnePlan,
} from "@/api/recruitStudentsPlan";
import courseList from "./CourseList.vue";
import editPlan from "./EditPlan.vue";
import Message from "@/themes/message";
import micell from "micell";
import bus from "@/Layout/bus";
import sharePlan from "./SharePlan.vue";
import dayjs from "dayjs";

export default defineComponent({
  components: {
    courseList,
    editPlan,
    sharePlan,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const editPlanCom = ref(null);
    const loading = ref(true);
    const courseList = ref([] as Array<ListRow>); // 列表数据
    const modalTitle = ref("");
    const putawayModalStatus = ref(false);
    const planInfo = ref();
    const planId = ref("") as any;

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    const sharePlanCom = ref(null);
    const showQr = ref(false);

    // 分享
    function sharePlan(row: ListRow) {
      if (+row.publishStatus === 0) {
        Message.warning("未上架的招生计划不允许被分享");
        return;
      }
      showQr.value = true;
    }

    const classList = ["qr", "share-qr-box bottom", "share-qr-box top"];
    // 当点击分享二维码本身以外的地方时，就隐藏分享二维码
    document.onclick = function (e: Event) {
      const className = (e.target as HTMLDivElement).className;
      if (
        (e.target as any).parentElement.id !== "share-btn" &&
        !classList.includes(className)
      ) {
        showQr.value = false;
      }
    };

    // 返回
    function handleBack() {
      sessionStorage.removeItem("coursePageInfo");
      router.push("/outClass/recruitStudentsPlan");
    }

    // 获取列表内容
    const getCourseList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await queryCourses(
        currentPage.value,
        pageSize.value,
        planId.value
      );
      if (+code === 0) {
        courseList.value = data.list;
        totalNum.value = data.page.totalNum;
      }
      loading.value = false;
    };

    // 获取顶部计划信息
    async function getPlanInfo() {
      const { code, data } = await queryOnePlan(planId.value);
      if (+code === 0) {
        planInfo.value = data;
      }
    }

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getCourseList();
      setPageInfoInSession();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getCourseList();
      setPageInfoInSession();
    };

    // 操作完课程后更新列表
    function editCourseComplete(res: boolean) {
      res && getCourseList();
    }

    // 新增课程，跳转到选课页面
    function handleAddCourse(id: string) {
      router.push(`/outClass?id=${id}`);
    }

    // 上下架
    function handleChangeStatus() {
      if (courseList.value.length === 0) {
        Message.warning("请至少添加一个课程");
        return;
      }

      const isHasForbid = courseList.value.some(
        (item: any) => +item.courseStatus === 0
      );
      if (isHasForbid) {
        Message.warning("请先移除已禁用的课程");
        return;
      }

      modalTitle.value = +planInfo.value.publishStatus === 0 ? "上架" : "下架";
      putawayModalStatus.value = true;
    }

    // 确认上下架
    async function handleSurePutaway() {
      const obj = {
        id: planId.value,
        publishStatus: +planInfo.value.publishStatus === 1 ? 0 : 1,
      };
      const { code } = await upOrDownCourse(obj);
      if (+code === 0) {
        putawayModalStatus.value = false;
        Message.success("操作成功");
        getPlanInfo();
      }
    }

    // 存储当前的页码信息等
    function setPageInfoInSession() {
      const coursePageInfo = JSON.stringify({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
        planId: planId.value,
      });
      sessionStorage.setItem("coursePageInfo", coursePageInfo);
    }

    // 初始化列表请求
    function requestCourseList() {
      const { id } = route.query;
      planId.value = id;
      getPlanInfo();
      const pageInfoSession = JSON.parse(
        sessionStorage.getItem("coursePageInfo") as string
      );
      if (pageInfoSession) {
        currentPage.value = pageInfoSession.currentPage;
        pageSize.value = pageInfoSession.pageSize;
      } else {
        currentPage.value = 1;
        pageSize.value = 20;
      }
      getCourseList();
    }

    onMounted(() => {
      requestCourseList();
      bus.$on("editCoursePlanComplete", () => {
        getCourseList();
      });
    });

    onUnmounted(() => {
      bus.$off("editCoursePlanComplete");
    });

    return {
      pageSize,
      courseList,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      totalNum,
      route,
      router,
      loading,
      staticData,
      editCourseComplete,
      handleAddCourse,
      handleChangeStatus,
      editPlanCom,
      handleBack,
      handleSurePutaway,
      putawayModalStatus,
      planInfo,
      getLiveStatusBg,
      getLiveStatusStr,
      micell,
      modalTitle,
      sharePlan,
      showQr,
      sharePlanCom,
      setPageInfoInSession,
      dayjs,
    };
  },
});
</script>

<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

  .top-card {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    display: flex;
    margin-bottom: 4px;

    .img-box {
      width: 170px;
      height: 96px;
      margin-right: 20px;

      > img {
        width: 170px;
        height: 96px;
        border-radius: 4px;
        object-fit: cover;
      }
    }

    .right-content {
      > ul {
        > li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          // flex-wrap: wrap;

          ul {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }

          .handle-box {
            min-width: 80px;
            position: relative;
          }

          .live-title {
            font-size: 16px;
            color: #222222;
            // display: flex;
            // flex-wrap: wrap;
            // align-items: center;

            .live-name {
              color: #222;
              font-size: 24px;
              margin-right: 16px;
            }

            .live-status {
              font-size: 12px;
              color: #ffffff;
              padding: 3px 8px;
              border-radius: 3px;
            }

            .blue-bg {
              background-color: #4fa8f9;
            }
            .yellow-bg {
              background-color: #ff9900;
            }

            .gray-bg {
              background-color: #9aadbb;
            }
          }

          .live-info {
            font-size: 14px;
            color: #666666;

            > ul > li {
              margin-right: 16px;
            }

            .flow-box {
              display: flex;
              align-items: center;
              position: relative;

              &:hover .url-box {
                display: block;
              }

              #flow {
                width: 200px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }

              .url-box {
                display: none;
                position: absolute;
                top: -74px;
                left: 0;
                padding: 10px;
                box-sizing: border-box;
                width: 410px;
                font-size: 14px;
                color: #222222;
                word-break: break-all;
                background-color: #ffffff;
                box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
                border-radius: 3px;

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
                    bottom: -28px;
                    left: 140px;
                    margin-left: -10px;
                    border: 10px solid transparent;
                    border-top: 10px solid #fff;
                  }
                }
              }
            }
          }

          .live-data {
            font-size: 14px;
            color: #4fa8f9;
          }

          .issuer {
            min-width: 50px;
            text-align: right;
            color: #f56060;
            font-size: 16px;
          }

          .live-time {
            min-width: 120px;
          }

          .hanlde-box {
            text-align: right;
            > button {
              margin-left: 32px;

              &:first-child {
                margin-left: 0;
              }
            }
          }
        }
      }
    }

    .flex-col-1 {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  .botom-card {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  .top-title {
    font-size: 18px;
    color: #606266;
    margin-bottom: 20px;
    display: flex;
    align-items: center;

    .back-btn {
      font-size: 14px;
      cursor: pointer;

      &:hover {
        color: #999;
      }

      &:active {
        color: #606266;
      }
    }

    .shu {
      width: 1px;
      height: 16px;
      margin: 0 20px;
      border-right: 1px solid #c2c5cc;
    }
  }
}

.body-text {
  font-size: 14px;
  color: #f56060;
  margin-bottom: 10px;
}
</style>

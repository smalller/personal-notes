<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <div class="top-handle-box">
        <div class="left-box">
          <ui-input
            style="width: 240px"
            v-model="searchObj.planName"
            placeholder="计划名称"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
          <span class="label-title">状态</span>
          <ui-select
            style="width: 140px"
            v-model="searchObj.status"
            placeholder="全部"
            @change="handleSelectStatus"
          >
            <ui-select-option
              v-for="item in allStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></ui-select-option>
          </ui-select>
        </div>
        <div class="right-box">
          <ui-button type="primary" icon="icon-a-81" @click="handleEditPlan">
            新建招生
          </ui-button>
        </div>
      </div>
      <div v-loading="loading">
        <planList
          :data="planList"
          @editPutawayStatusComplete="editPutawayStatusComplete"
          @setPageInfo="setPageInfoInSession"
        ></planList>
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
    <editPlan ref="editPlanCom"></editPlan>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import { ListRow } from "./index";
import { useRoute, useRouter } from "vue-router";
import planList from "./components/PlanList.vue";
import editPlan from "./components/EditPlan.vue";
import { throttle } from "@/utils/common";
import { queryPlan } from "@/api/recruitStudentsPlan";
import bus from "@/Layout/bus";

export default defineComponent({
  components: {
    planList,
    editPlan,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const editPlanCom = ref(null);
    const loading = ref(true);
    const planList = ref([] as Array<ListRow>); // 列表数据

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    const searchObj = ref({
      planName: "",
      status: "",
    }); //筛选条件

    const allStatusList = reactive([
      {
        label: "全部",
        value: "",
      },
      {
        label: "未上架",
        value: 0,
      },
      {
        label: "招生中",
        value: 1,
      },
    ]);

    // 获取列表内容
    const getPlanList = async (): Promise<void> => {
      loading.value = true;
      const { planName: name, status: publishStatus } = searchObj.value;
      const { code, data } = await queryPlan(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            name,
            publishStatus,
          }
        )
      );
      if (+code === 0) {
        planList.value = data.list;
        totalNum.value = data.page.totalNum;
      }
      loading.value = false;
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getPlanList();
    };

    // 输入框边输边查询
    watch(
      () => searchObj.value.planName,
      () => {
        throttle(() => {
          getPlanList();
        }, 500);
      }
    );

    // 筛选状态
    function handleSelectStatus(res: string) {
      searchObj.value.status = res;
      getPlanList();
    }

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getPlanList();
      setPageInfoInSession();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getPlanList();
      setPageInfoInSession();
    };

    // 新增招生计划
    function handleEditPlan() {
      (editPlanCom.value as any).handleOpen(1);
    }

    // 上下架成功后的回调
    function editPutawayStatusComplete(res: boolean) {
      res && getPlanList();
    }

    // 存储当前的页码信息等
    function setPageInfoInSession() {
      const planListPageInfo = JSON.stringify({
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      });
      sessionStorage.setItem("planListPageInfo", planListPageInfo);
    }

    // 初始化列表请求
    function requestPlanList() {
      const pageInfoSession = JSON.parse(
        sessionStorage.getItem("planListPageInfo") as string
      );
      if (pageInfoSession) {
        currentPage.value = pageInfoSession.currentPage;
        pageSize.value = pageInfoSession.pageSize;
        getPlanList();
      } else {
        currentPage.value = 1;
        pageSize.value = 20;
        getPlanList();
      }
    }

    onMounted(() => {
      requestPlanList();
      bus.$on("editPlanComplete", (res: boolean) => {
        res && getPlanList();
      });
    });

    onUnmounted(() => {
      bus.$off("editPlanComplete");
    });

    return {
      pageSize,
      planList,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      totalNum,
      route,
      router,
      loading,
      handleEditPlan,
      searchObj,
      allStatusList,
      editPlanCom,
      handleSearchInfo,
      handleSelectStatus,
      editPutawayStatusComplete,
      setPageInfoInSession,
    };
  },
});
</script>

<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

  .top-title {
    font-size: 24px;
    color: #222;
    margin-bottom: 20px;
  }

  .top-charts-box {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 24px;

    .left-map {
      width: 460px;
    }

    .right-map {
      flex-grow: 1;
    }
  }

  .top-handle-box {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap !important;

    .left-box {
      .label-title {
        min-width: 28px;
        color: #999;
        font-size: 14px;
        margin: 0 6px 0 16px;
      }
    }

    .right-box {
      display: flex;

      button {
        margin-bottom: 16px;
        margin-left: 16px;

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .body-text {
    font-size: 14px;
    color: #f56060;
    margin-bottom: 10px;
  }

  .handle-box {
    display: flex;
    align-items: center;
    > li {
      margin-right: 16px;
    }
  }
}
</style>

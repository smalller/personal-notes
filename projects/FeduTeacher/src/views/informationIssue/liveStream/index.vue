<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <logoutIdentity ref="logoutIdentityCom" @handleSure="handleDelLive">
        <p class="body-text">删除后不可恢复，只能重新发布</p>
      </logoutIdentity>
      <TopType
        :topTypeList="staticData.topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <div class="top-handle-box">
        <div class="left-box">
          <FilterSearch
            @handleSearch="handleSearch"
            @handleReset="handleReset"
            :changeTabStatus="changeTabStatus"
          ></FilterSearch>
        </div>
        <div class="right-box">
          <div class="del-btn">
            <ui-button @click="deleteLive">删除</ui-button>
            <div v-if="isDeleteLive" class="is-empty-data">
              <span>请至少选择一项</span>
            </div>
          </div>
          <ui-button type="primary" icon="icon-a-81" @click="goToEditLive">
            发布直播
          </ui-button>
        </div>
      </div>
      <div v-loading="loading">
        <LiveList
          :currentType="currentType"
          :data="liveList"
          @handleLive="handleLive"
          @checkChange="checkChange"
        ></LiveList>
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import TopType from "@/components/TopType.vue";
import { staticData, SearchObj, LiveListRow } from "./index";
import { TopTypeListItem } from "@/utils/common";
import { useRoute, useRouter } from "vue-router";
import { getList, deleteCmsLive } from "@/api/liveStream";
import LiveList from "./components/LiveList.vue";
import FilterSearch from "./components/FilterSearch.vue";
import logoutIdentity from "@/components/logoutIdentity.vue";
import Message from "@/themes/message";
import { throttle } from "@/utils/common";

export default defineComponent({
  components: {
    TopType,
    FilterSearch,
    LiveList,
    logoutIdentity,
  },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(true);
    const currentType = ref(2); // 标签页索引 // 这里到时候要改为1
    const liveList = ref([] as Array<LiveListRow>); // 列表数据
    const changeTabStatus = ref(false); //是否切换了标签页

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    const searchObj = ref({
      searchIssuer: "",
      searchAnchor: "",
      searchTheme: "",
      selectedStatus: "",
    }); //筛选条件

    const logoutIdentityCom = ref(null);
    const deleteLiveList = ref<LiveListRow[]>([]);
    let isDeleteLive = ref(false);

    // 搜索
    function handleSearch(res: SearchObj) {
      deleteLiveList.value = [];
      searchObj.value = res;
      getLiveList();
    }

    // 重置
    function handleReset(res: SearchObj) {
      deleteLiveList.value = [];
      searchObj.value = res;
      getLiveList();
    }

    // 获取列表内容
    const getLiveList = async (): Promise<void> => {
      loading.value = true;
      const {
        searchIssuer: createUserName,
        searchAnchor: publishUserName,
        searchTheme: liveName,
        selectedStatus: liveStatus,
      } = searchObj.value;
      const { code, data } = await getList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            createUserName,
            publishUserName,
            liveName,
            liveStatus,
            liveType: currentType.value === 1 ? "app" : "cms",
          }
        )
      );
      if (+code === 0) {
        liveList.value = data.list;
        totalNum.value = data.page.totalNum;
      }
      loading.value = false;
    };
    getLiveList();

    // 初始化筛选数据
    const initQueryData = (): void => {
      changeTabStatus.value = !changeTabStatus.value; // 只要改变了值，就能让其他地方监听到值改变，然后做其他操作
      deleteLiveList.value = [];
      currentPage.value = 1;
      searchObj.value = {
        searchIssuer: "",
        searchAnchor: "",
        searchTheme: "",
        selectedStatus: "",
      };
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      // currentType.value = res.value; //这里到时候要取消注释
      currentType.value = 2; //这里到时候改为1
      initQueryData();
      getLiveList();
    };

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      deleteLiveList.value = [];
      getLiveList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      deleteLiveList.value = [];
      getLiveList();
    };

    // 开始/结束直播后更新表格
    function handleLive() {
      getLiveList();
    }

    // 跳转到发布/编辑直播页面
    function goToEditLive() {
      let routeUrl = router.resolve({
        path: "/recipeDetail/EditLive",
      });
      window.open(routeUrl.href, "_blank");
    }

    // 获取勾选的直播
    function checkChange(res: LiveListRow[]) {
      deleteLiveList.value = res;
    }

    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (): void => {
      isDeleteLive.value = true;
      throttle(() => {
        isDeleteLive.value = false;
      }, 2000);
    };

    // 删除直播
    function deleteLive() {
      if (deleteLiveList.value.length === 0) {
        checkIsEmptyData();
      } else {
        const isHasLived = deleteLiveList.value.find(
          (item) => +item.liveStatus === 2
        );

        if (isHasLived) {
          Message.warning("直播中的数据无法删除");
          return;
        }

        (logoutIdentityCom.value as any).handleOpen(
          `确认将勾选的${deleteLiveList.value.length}条直播删除吗？`
        );
      }
    }

    // 确定删除直播数据
    async function handleDelLive() {
      const arr = deleteLiveList.value.map((item: LiveListRow) => item.liveId);
      const { code } = await deleteCmsLive(arr);
      if (+code === 0) {
        Message.success("删除成功");
        deleteLiveList.value = [];
        getLiveList();
      }
    }

    onMounted(() => {
      // 监听发布/修改直播页面是否完成，如果是就刷新列表
      window.addEventListener("message", (e) => {
        if (e.origin === location.origin) {
          switch (e.data) {
            case "updateLiveList":
              getLiveList();
              break;
          }
        }
      });
    });

    onUnmounted(() => {
      return;
    });

    return {
      changeTopType,
      pageSize,
      liveList,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      totalNum,
      route,
      router,
      loading,
      staticData,
      currentType,
      handleLive,
      checkChange,
      handleSearch,
      handleReset,
      changeTabStatus,
      goToEditLive,
      deleteLive,
      isDeleteLive,
      deleteLiveList,
      logoutIdentityCom,
      handleDelLive,
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
    margin-top: 20px;

    .right-box {
      display: flex;

      .del-btn {
        position: relative;
        .is-empty-data {
          position: absolute;
          top: -60px;
          left: -32px;
          width: 128px;
          height: 45px;
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

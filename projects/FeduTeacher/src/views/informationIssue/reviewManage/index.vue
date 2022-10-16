<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <TopType
        :topTypeList="staticData.topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <div class="top-handle-box">
        <div class="left-box">
          <DateFilter
            @handleSelectDate="handleSelectDate"
            :changeTabStatus="changeTabStatus"
          ></DateFilter>
          <ui-input
            maxlength="40"
            style="width: 200px; margin-bottom: 15px"
            v-model="reviewSearchInfo"
            placeholder="查找评论"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
        </div>
      </div>
      <div v-loading="loading">
        <DynamicList
          :currentType="currentType"
          :data="dynamicList"
          @deletedComment="deletedComment"
        ></DynamicList>
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
import { defineComponent, ref, watch } from "vue";
import TopType from "@/components/TopType.vue";
import DateFilter from "@/components/DateFilter.vue";
import { staticData } from "./index";
import { TopTypeListItem } from "@/utils/common";
import { useRoute } from "vue-router";
import micell from "micell";
import { throttle } from "@/utils/common";
import DynamicList from "./components/DynamicList.vue";
import { getList } from "@/api/reviewManage";
import { ReviewItem } from "./index";

export default defineComponent({
  components: {
    TopType,
    DateFilter,
    DynamicList,
  },

  setup() {
    const route = useRoute();
    const loading = ref(true);
    const currentType = ref(1); // 标签页索引
    const changeTabStatus = ref(false); //是否切换了标签页
    const dynamicList = ref([] as Array<ReviewItem>); // 列表数据

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    const reviewSearchInfo = ref(""); // 查找评论
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间

    // 获取列表内容
    const getReviewList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            type: currentType.value === 1 ? "Ablum" : "Recipes",
            comment: reviewSearchInfo.value,
            beginDate: startTime.value,
            endDate: endTime.value,
          }
        )
      );
      if (+code === 0) {
        dynamicList.value = data.list;
        totalNum.value = data.page.totalNum;
      }
      loading.value = false;
    };
    getReviewList();

    // 初始化筛选数据
    const initQueryData = (): void => {
      changeTabStatus.value = !changeTabStatus.value; // 只要改变了值，就能让其他地方监听到值改变，然后做其他操作
      currentPage.value = 1;
      reviewSearchInfo.value = "";
      startTime.value = "";
      endTime.value = "";
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      initQueryData();
      currentType.value = res.value;
      getReviewList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getReviewList();
    };

    // 查找评论边输边查询
    watch(
      () => reviewSearchInfo.value,
      () => {
        throttle(() => {
          getReviewList();
        }, 500);
      }
    );

    // 日期筛选
    const handleSelectDate = (res: string): void => {
      if (res) {
        startTime.value = micell.date.format(res[0], "YYYY-MM-DD");
        endTime.value = micell.date.format(res[1], "YYYY-MM-DD");
      } else {
        startTime.value = "";
        endTime.value = "";
      }
      getReviewList();
    };

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getReviewList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getReviewList();
    };

    // 删除评论成功后更新表格
    function deletedComment() {
      getReviewList();
    }

    return {
      changeTopType,
      handleSearchInfo,
      pageSize,
      dynamicList,
      handleSelectDate,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      totalNum,
      route,
      reviewSearchInfo,
      changeTabStatus,
      loading,
      staticData,
      currentType,
      deletedComment,
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
      > ul {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;

        li {
          margin: 0 0 15px 16px;
          position: relative;

          .is-dimission {
            width: 64px;
            height: 32px;
            padding: 0;
            box-sizing: border-box;
          }

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

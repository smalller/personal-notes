<template>
  <el-drawer
    custom-class="school-dynamic-drawer-box"
    v-model="drawerStatus"
    :before-close="handleClose"
    destroy-on-close
    z-index="99"
  >
    <div class="container">
      <div class="top-box" v-if="reviewDetailHtml !== undefined">
        <div class="avatar" v-if="reviewDetailHtml.headPortrait">
          <img :src="reviewDetailHtml.headPortrait" alt="" />
        </div>
        <div class="user-info">
          <p class="name" v-if="reviewDetailHtml.publisher">
            {{ reviewDetailHtml.publisher }}
          </p>
          <p class="time" v-if="reviewDetailHtml.createTime">
            {{ getDateDiff(getDateTimeStamp(reviewDetailHtml.createTime)) }}
          </p>
        </div>
      </div>
      <div v-if="dynamicCurrent === 'recipe'" class="recipe-link">
        <img src="@/assets/recipe-detail.png" alt="" />
        <router-link
          class="router-link"
          target="_blank"
          :to="{
            path: '/recipeDetail',
            query: {
              title: dynamicInfo.title,
              relatedId: dynamicInfo.relatedId,
            },
          }"
          >【食谱】{{ dynamicInfo.title }}</router-link
        >
      </div>
      <div
        v-if="dynamicCurrent === 'school' && reviewDetailHtml !== undefined"
        class="html-content"
      >
        <ReviewHtmlRender
          :reviewDetailHtml="reviewDetailHtml"
        ></ReviewHtmlRender>
      </div>
      <div
        v-if="dishesImgUrl && dynamicCurrent === 'recipe'"
        class="recipe-img"
      >
        <img :src="dishesImgUrl" alt="" />
      </div>
      <TopType
        :topTypeList="topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <DynamicDetailReview
        v-if="currentType === 1"
        :relatedId="dynamicInfo.relatedId"
        :dynamicCurrent="dynamicCurrent"
        @getTotalNum="getDynamicTotalNum"
      ></DynamicDetailReview>
      <DynamicGiveLikeList
        v-else
        :relatedId="dynamicInfo.relatedId"
        @getTotalNum="getGiveLikeNum"
      ></DynamicGiveLikeList>
    </div>
  </el-drawer>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import TopType from "@/components/TopType.vue";
import { TopTypeListItem } from "@/utils/common";
import DynamicDetailReview from "./DynamicDetailReview.vue";
import DynamicGiveLikeList from "./DynamicGiveLikeList.vue";
import ReviewHtmlRender from "./ReviewHtmlRender.vue";
import { ReviewItem } from "@/views/informationIssue/reviewManage/index";
import { queryAlbumsById } from "@/api/reviewManage";
import { getDateTimeStamp, getDateDiff } from "@/utils/common";
import { queryRecipes, queryPraises } from "@/api/reviewManage";

export default defineComponent({
  components: {
    TopType,
    DynamicDetailReview,
    DynamicGiveLikeList,
    ReviewHtmlRender,
  },
  setup() {
    const drawerStatus = ref(false);
    const currentType = ref(1); // 标签页索引
    const dynamicCurrent = ref(""); //'school'-校园动态 'recipe'-食谱动态
    const dynamicInfo = ref({} as ReviewItem);
    const dishesImgUrl = ref(""); //食谱动态-图片食谱（有就显示，没有就不显示）
    const topTypeList = ref([
      {
        label: `评论`,
        value: 1,
      },
      {
        label: "点赞",
        value: 2,
      },
    ]);
    const reviewDetailHtml = ref();

    // 关闭抽屉回调
    const handleClose = (): void => {
      topTypeList.value = [
        {
          label: `评论`,
          value: 1,
        },
        {
          label: "点赞",
          value: 2,
        },
      ];
      currentType.value = 1;
      dynamicCurrent.value = "";
      reviewDetailHtml.value = undefined;
      drawerStatus.value = false;
    };

    // 获取校园动态详情
    async function queryAlbums() {
      const { code, data } = await queryAlbumsById(dynamicInfo.value.relatedId);
      if (+code === 0) {
        reviewDetailHtml.value = data;
      }
    }

    // 获取食谱动态详情
    async function getRecipes() {
      // dynamicInfo.value.relatedId
      // 1452569257960841216
      const { code, data } = await queryRecipes(dynamicInfo.value.relatedId);
      if (+code === 0) {
        reviewDetailHtml.value = data[0];
        dishesImgUrl.value = data[0].dishesImgUrl;
      }
    }

    // 打开抽屉
    const handleOpen = (res: ReviewItem, current: string): void => {
      dynamicInfo.value = res;
      dynamicCurrent.value = current;
      if (current === "school") {
        queryAlbums();
      } else {
        getRecipes();
      }
      getGiveLikeList();
      drawerStatus.value = true;
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      currentType.value = res.value;
    };

    // 获取点赞列表总条数想·
    async function getGiveLikeList() {
      const { code, data } = await queryPraises(
        1,
        20,
        Object.assign(
          {},
          {
            relatedId: dynamicInfo.value.relatedId,
          }
        )
      );
      if (+code === 0) {
        topTypeList.value[1].label = `点赞 ${data.page.totalNum}`;
      }
    }

    // tab标签上显示对应的评论条数
    function getDynamicTotalNum(res: number) {
      topTypeList.value[0].label = `评论 ${res}`;
    }

    function getGiveLikeNum(res: number) {
      topTypeList.value[1].label = `点赞 ${res}`;
    }

    return {
      drawerStatus,
      handleClose,
      handleOpen,
      dynamicInfo,
      topTypeList,
      changeTopType,
      currentType,
      dynamicCurrent,
      getDynamicTotalNum,
      getGiveLikeNum,
      reviewDetailHtml,
      getDateTimeStamp,
      getDateDiff,
      dishesImgUrl,
    };
  },
});
</script>
<style lang="less">
.school-dynamic-drawer-box {
  width: 960px !important;

  .body-text-box {
    margin: 28px 0 40px 0;
    font-size: 14px;
    color: #f56060;
  }

  .container {
    padding: 0 142px 73px;
    box-sizing: border-box;

    .top-box {
      display: flex;
      align-items: center;
      margin-bottom: 20px;

      .avatar {
        > img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }

      .user-info {
        .name {
          font-size: 16px;
          color: #222222;
          margin-bottom: 2px;
        }

        .time {
          font-size: 14px;
          color: #999999;
        }
      }
    }

    .html-content {
      margin-bottom: 60px;
    }

    .recipe-img {
      max-width: 676px;
      margin-bottom: 60px;
      > img {
        width: 100%;
        height: auto;
        object-fit: cover;
        border-radius: 4px;
      }
    }

    .recipe-link {
      background: #fafafa;
      border-radius: 8px;
      padding: 13px 14px;
      box-sizing: border-box;
      margin: 20px 0;

      > img {
        width: 64px;
        height: 64px;
        vertical-align: middle;
        margin-right: 20px;
      }

      .router-link {
        vertical-align: middle;
        cursor: pointer;
        font-size: 14px;
        color: #222222;
        text-decoration: none;

        &:hover {
          color: #999999;
        }
        &:active {
          color: #222222;
        }
      }
    }
  }
}
</style>

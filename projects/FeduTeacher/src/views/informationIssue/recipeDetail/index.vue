<template>
  <div class="reipe-detail-wrap">
    <ui-card class="card">
      <div class="top-box" :class="[+recipeType === 1 ? '' : 'recipe-img']">
        <span class="title">{{
          +recipeType === 1 ? "文字食谱" : "图片食谱"
        }}</span>
        <div class="date-picker-box">
          <span>时间</span>
          <div class="date-show">
            <ui-icon class="icon" icon="icon-a-zu143"></ui-icon>
            <span>{{ recipeDate }}</span>
          </div>
        </div>
      </div>
      <div class="html-content" v-if="recipeType">
        <RecipeTable
          v-if="+recipeType === 1"
          :dataList="dataList"
        ></RecipeTable>
        <div v-else-if="+recipeType === 2" class="img-content">
          <img v-if="dishesImgUrl" :src="dishesImgUrl" alt="" />
          <p v-else class="empty-data">没有查询到数据</p>
        </div>
      </div>
    </ui-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import RecipeTable from "./components/RecipeTable.vue";
import { queryRecipes } from "@/api/reviewManage";

export default defineComponent({
  components: {
    RecipeTable,
  },
  setup() {
    const stroe = useStore();
    const { schoolId, token, userId } = stroe.state.user;
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("schoolId", schoolId);
    sessionStorage.setItem("userId", userId);
    const route = useRoute();
    const relatedId = route.query.relatedId as string;
    const recipeDate = route.query.title; //传过来的日期区间
    const recipeType = ref(""); //食谱类型 1-文字食谱，2-图片食谱
    const dishesImgUrl = ref(""); //图片食谱展示的内容
    const dataList = ref([]);

    // 获取食谱详情信息
    async function getRecipes() {
      // relatedId
      // 1452569257960841216
      const { code, data } = await queryRecipes(relatedId);
      if (+code === 0) {
        dataList.value = data;
        recipeType.value = data[0].recipesType;
        dishesImgUrl.value = data[0].dishesImgUrl;
      }
    }

    if (relatedId) {
      getRecipes();
    }

    return {
      recipeDate,
      recipeType,
      dataList,
      dishesImgUrl,
    };
  },
});
</script>
<style lang="less" scoped>
.reipe-detail-wrap {
  max-width: 1370px;
  margin: 0 auto;

  .card {
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
    border-radius: 0;
    padding: 30px 60px;
    box-sizing: border-box;
    height: calc(100vh - 100px);
    overflow-y: auto;

    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
      height: 8px;
      position: absolute;
      right: 0;
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      width: 6px;
      height: 90px;
      background-color: #bfbfbf;
      border-radius: 4px;
    }
    &::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // -webkit-box-shadow: inset 0 0 5px rgba(0, 34, 68, 0.01);
      border-radius: 4px;
      background: rgba(0, 34, 68, 0);
    }

    .recipe-img {
      border-bottom: 1px solid #e8e8e8;
      margin-bottom: 20px;
    }

    .top-box {
      padding-bottom: 15px;
      box-sizing: border-box;

      .title {
        font-size: 20px;
        color: #222;
      }

      .date-picker-box {
        margin: 22px 0 0 0;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        font-size: 14px;

        > span {
          color: #666;
          margin-right: 20px;
        }

        .date-show {
          min-width: 220px;
          height: 32px;
          padding: 6px 0;
          box-sizing: border-box;
          background-color: #f2f2f2;
          border: 1px solid #d9d9d9;
          border-radius: 3px;
          display: flex;
          align-items: center;

          .icon {
            color: #bfbfbf;
            margin: 0 7px 0 11px;
          }

          > span {
            color: #222;
          }
        }
      }
    }

    .html-content {
      .img-content {
        max-width: 676px;
        margin: 0 auto;
        > img {
          width: 100%;
          height: auto;
          object-fit: cover;
          border-radius: 4px;
        }
      }
    }

    .empty-data {
      text-align: center;
      color: #666666;
      font-size: 14px;
      padding: 30px 0;
    }
  }
}
</style>

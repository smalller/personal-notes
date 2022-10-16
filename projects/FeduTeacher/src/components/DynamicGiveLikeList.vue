<template>
  <div id="dynamic-give-like" v-loading="loading">
    <ul v-if="dataList.length > 0">
      <li v-for="item in dataList" :key="item.id">
        <div class="left-box">
          <img :src="item.userPortait" alt="" />
          <span class="name">{{ item.sysUserName }}</span>
        </div>
        <div class="right-box">
          <span>{{ getDateDiff(getDateTimeStamp(item.createTime)) }}</span>
          <img src="@/assets/give-like.png" alt="" />
        </div>
      </li>
    </ul>
    <p v-else-if="dataList.length === 0 && !loading" class="empty-data">
      没有查询到数据
    </p>
    <ui-pagination
      style="margin-top: 20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalNum"
    ></ui-pagination>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { getDateTimeStamp, getDateDiff } from "@/utils/common";
import { queryPraises } from "@/api/reviewManage";

export default defineComponent({
  props: {
    relatedId: {
      type: String,
    },
    isLive: {
      type: Boolean,
    },
  },
  emits: ["getTotalNum"],
  setup(props, { emit }) {
    onMounted(() => {
      // 如果是从直播那边进来的，那就要加上溢出滚动条效果
      if (props.isLive) {
        const box = document.getElementById("dynamic-give-like");
        box?.classList.add("is-live");
      }
    });

    const loading = ref(true);
    const dataList = ref([] as Array<any>);
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    async function getGiveLikeList() {
      const { code, data } = await queryPraises(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            relatedId: props.relatedId,
          }
        )
      );
      if (+code === 0) {
        dataList.value = data.list;
        totalNum.value = data.page.totalNum;
        emit("getTotalNum", data.page.totalNum); //告诉tab标签当前有多少条点赞
      }
      loading.value = false;
    }
    getGiveLikeList();

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getGiveLikeList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getGiveLikeList();
    };

    return {
      loading,
      dataList,
      currentPage,
      pageSize,
      totalNum,
      handleSizeChange,
      handleCurrentChange,
      getDateTimeStamp,
      getDateDiff,
    };
  },
});
</script>
<style lang="less" scoped>
.is-live {
  overflow-y: auto;
  height: calc(100vh - 252px);

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
}

#dynamic-give-like {
  margin-top: 20px;

  ul > li {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    align-items: center;
    padding: 10px 0;
    box-sizing: border-box;
    border-bottom: 1px solid #e8e8e8;

    .left-box {
      color: #222;
      display: flex;
      align-items: center;

      > img {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 12px;
      }

      .name {
        margin-right: 6px;
      }
    }

    .right-box {
      color: #999;

      > span {
        vertical-align: middle;
      }

      > img {
        vertical-align: middle;
        margin-left: 25px;
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
</style>

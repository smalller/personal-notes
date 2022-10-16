<template>
  <div class="share-box">
    <div class="share-list" v-loading="loading">
      <ui-table :data="dataList">
        <ui-table-column label="分享人">
          <template #default="{ row }">
            <div class="name-box">
              <img
                class="avatar"
                :src="row.headPortrait || require('@/assets/infant-avatar.png')"
                alt=""
              />
              <span>{{ row.userName }}</span>
            </div>
          </template>
        </ui-table-column>
        <ui-table-column label="浏览次数" prop="viewNum"> </ui-table-column>
      </ui-table>
      <ui-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalNum"
      ></ui-pagination>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { getDateTimeStamp, getDateDiff } from "@/utils/common";
import { getShareRecord } from "@/api/liveStream";

export default defineComponent({
  props: {
    liveId: {
      type: String,
    },
  },
  emits: ["getTotalNum"],
  setup(props, { emit }) {
    const loading = ref(true);
    const dataList = ref([] as Array<any>);
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    async function getShareList() {
      const { code, data } = await getShareRecord(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            id: props.liveId,
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
    getShareList();

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getShareList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getShareList();
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
.share-box {
  margin-top: 20px;
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

  .name-box {
    display: flex;
    align-items: center;
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }
}
</style>

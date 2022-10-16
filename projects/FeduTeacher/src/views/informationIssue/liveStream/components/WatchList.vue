<template>
  <div class="watch-box">
    <div class="watch-list" v-loading="loading">
      <ui-table :data="dataList">
        <ui-table-column label="昵称">
          <template #default="{ row }">
            <div class="name-box">
              <img
                class="avatar"
                :src="
                  row.userHeadPortait || require('@/assets/infant-avatar.png')
                "
                alt=""
              />
              <span>{{ row.username }}</span>
            </div>
          </template>
        </ui-table-column>
        <ui-table-column label="进入时间">
          <template #default="{ row }">
            <span>{{
              row.enterTime
                ? dayjs(row.enterTime).format("YYYY-MM-DD HH:mm:ss")
                : ""
            }}</span>
          </template>
        </ui-table-column>
        <ui-table-column label="观看时间" prop="">
          <template #default="{ row }">
            <span>{{ dayjs(row.totalTime).toDate().getMinutes() }}分钟</span>
          </template>
        </ui-table-column>
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
import { getViewRecord } from "@/api/liveStream";
import micell from "micell";
import dayjs from "dayjs";

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

    async function getList() {
      const { code, data } = await getViewRecord(
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
        emit("getTotalNum", data.page.totalNum); //告诉tab标签当前有多少条观看记录
        // dataList.value = data;
        // emit("getTotalNum", 666); //告诉tab标签当前有多少条观看记录
      }
      loading.value = false;
    }
    getList();

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getList();
    };

    return {
      loading,
      dataList,
      currentPage,
      pageSize,
      totalNum,
      handleSizeChange,
      handleCurrentChange,
      micell,
      dayjs,
    };
  },
});
</script>
<style lang="less" scoped>
.watch-box {
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

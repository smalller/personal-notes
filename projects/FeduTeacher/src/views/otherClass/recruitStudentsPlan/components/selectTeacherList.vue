<template>
  <div class="select-teacher-box">
    <ui-modal
      v-model:visible="modalStatus"
      @close="handleClose"
      :title="title"
      width="600"
      :tips="false"
      :buttonShow="false"
    >
      <div class="body-text-box">
        <ui-input
          style="width: 200px; margin-bottom: 15px"
          v-model="searchInfo"
          placeholder="输入姓名或手机号"
          icon="icon-a-101"
          @keydown.enter="handleSearchInfo"
          @iconClick="handleSearchInfo"
        ></ui-input>
        <div class="table-box">
          <ui-table :data="tableData">
            <ui-table-column label="员工姓名">
              <template #default="{ row }">
                <div class="name-box">
                  <img
                    class="avatar"
                    :src="
                      row.headPortraitUrl ||
                      require('@/assets/staff-avatar.png')
                    "
                    alt=""
                  />
                  <span>{{ row.name }}</span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column label="电话" prop="mobile"> </ui-table-column>
            <ui-table-column label="称谓" prop="title"> </ui-table-column>
            <ui-table-column label="操作" align="right">
              <template #default="{ row }">
                <ui-button type="text-blue" @click="handleChoose(row)"
                  >选择</ui-button
                >
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
      </div>
    </ui-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { staticData } from "../index";
import { getTableList } from "@/api/teachingManage";
import { throttle } from "@/utils/common";

export default defineComponent({
  setup(props, { emit }) {
    const modalStatus = ref(false);
    const title = ref("");
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const tableData = ref([]);
    const searchInfo = ref(""); // 输入框搜索值

    // 打开模态框
    const handleOpen = (tit: string) => {
      title.value = tit;
      hanldeGetTableList();
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    function handleChoose(res: any) {
      if (title.value === "选择班主任") {
        emit("chooseHeadmaster", res);
      } else {
        emit("chooseTeacher", res);
      }
      modalStatus.value = false;
    }

    async function hanldeGetTableList(): Promise<void> {
      const { code, data } = await getTableList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            name: searchInfo.value,
          }
        )
      );
      if (+code === 0) {
        tableData.value = data.list;
        totalNum.value = data.page.totalNum;
      }
    }

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      hanldeGetTableList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          hanldeGetTableList();
        }, 500);
      }
    );

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      hanldeGetTableList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      hanldeGetTableList();
    };

    return {
      modalStatus,
      title,
      handleClose,
      handleOpen,
      staticData,
      currentPage,
      pageSize,
      totalNum,
      tableData,
      searchInfo,
      handleSearchInfo,
      handleChoose,
      handleSizeChange,
      handleCurrentChange,
    };
  },
});
</script>

<style lang="less" scoped>
.select-teacher-box {
  .table-box {
    height: 400px;
    overflow: auto;
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

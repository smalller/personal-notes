<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card>
      <div class="top-handle-box">
        <div class="left-box">
          <ui-input
            maxlength="40"
            style="width: 240px; margin-bottom: 15px"
            v-model="searchInfo"
            placeholder="教室名称/教室编号"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
          <SelectPostOrClass
            title="状态"
            placeholder="全部"
            width="96"
            :list="staticData.statusFilterList"
            @handleSelect="handleSelect"
          ></SelectPostOrClass>
        </div>
        <div class="right-box">
          <ul>
            <li v-if="currentType === 1">
              <ui-button
                style="margin-right: 16px"
                type="default"
                @click="handleDelete"
                >删除</ui-button
              >
              <div v-if="isDeleteEmptyData" class="is-empty-data">
                <span>请至少选择一项</span>
              </div>
              <ui-button icon="icon-a-81" type="primary" @click="handleAdd"
                >新增教室</ui-button
              >
            </li>
          </ul>
        </div>
      </div>
      <div v-loading="loading">
        <roomListTable
          :data="tableData"
          @selectChange="checkBoxChange"
          @updateList="getRoomList"
        >
        </roomListTable>
      </div>
      <ui-pagination
        style="margin-top: 20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalNum"
      ></ui-pagination>
    </ui-card>
  </div>
  <editRoom ref="editRoomCom"></editRoom>
  <logoutIdentity ref="logoutIdentityCom" @handleSure="handleDeleteSure">
    <p class="body-text">删除后将不可恢复，请慎重！</p>
  </logoutIdentity>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted, onUnmounted } from "vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import { staticData, ListRow, SelectOption } from "./index";
import roomListTable from "./components/RoomListTable.vue";
import { throttle } from "@/utils/common";
import micell from "micell";
import { useRoute } from "vue-router";
import { queryClazzRoom } from "@/api/classroomManage";
import editRoom from "./components/EditRoom.vue";
import bus from "@/Layout/bus";
import logoutIdentity from "@/components/logoutIdentity.vue";
import { deleteClazzRoom } from "@/api/classroomManage";
import Message from "@/themes/message";

export default defineComponent({
  components: {
    SelectPostOrClass,
    roomListTable,
    editRoom,
    logoutIdentity,
  },
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const currentType = ref(1); // 标签页索引
    const checkRowInfo = ref([] as Array<ListRow>); // 已勾选的行信息
    const tableData = ref([] as Array<ListRow>); // 表格数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const roomStatusQuery = ref(""); //教室状态筛选值
    const editRoomCom = ref(null);
    const logoutIdentityCom = ref(null);
    const isDeleteEmptyData = ref(false);

    // 获取表格内容
    const getRoomList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await queryClazzRoom(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            name: searchInfo.value,
            isUse: roomStatusQuery.value,
          }
        )
      );
      if (+code === 0) {
        checkRowInfo.value = [];
        tableData.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    getRoomList();

    // 删除教室
    function handleDelete() {
      if (checkRowInfo.value.length === 0) {
        checkIsEmptyData();
      } else {
        (logoutIdentityCom.value as any).handleOpen(
          `确定要删除勾选的${checkRowInfo.value.length}个教室吗？`
        );
      }
    }

    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (): void => {
      isDeleteEmptyData.value = true;
      throttle(() => {
        isDeleteEmptyData.value = false;
      }, 2000);
    };

    // 删除操作
    const handleDeleteSure = async (): Promise<void> => {
      const ids = checkRowInfo.value.map((item) => item.id);
      const { code } = await deleteClazzRoom(ids);
      if (+code === 0) {
        Message.success("删除成功");
        getRoomList();
      }
    };

    // 表格勾选事件
    const checkBoxChange = (res: Array<ListRow>): void => {
      checkRowInfo.value = res;
    };

    // 学籍筛选表格
    const handleSelect = (res: SelectOption): void => {
      if (res) {
        roomStatusQuery.value = res.value;
      } else {
        roomStatusQuery.value = "";
      }
      getRoomList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getRoomList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getRoomList();
        }, 500);
      }
    );

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getRoomList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getRoomList();
    };

    // 新增教室
    function handleAdd() {
      (editRoomCom.value as any).handleOpen(1);
    }

    onMounted(() => {
      bus.$on("updateList", () => {
        getRoomList();
      });
    });

    onUnmounted(() => {
      bus.$off("updateList");
    });

    return {
      handleSearchInfo,
      tableData,
      checkBoxChange,
      staticData,
      currentType,
      route,
      searchInfo,
      getRoomList,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      loading,
      handleSelect,
      handleAdd,
      editRoomCom,
      handleDelete,
      logoutIdentityCom,
      isDeleteEmptyData,
      handleDeleteSure,
    };
  },
});
</script>
<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

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
}
.top-title {
  font-size: 24px;
  color: #222;
  margin-bottom: 20px;
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
    ul {
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;

      li {
        margin: 0 0 15px 16px;
        position: relative;

        &:first-child {
          margin-left: 0;
        }

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
</style>

<template>
  <div class="siteManagement">
    <div class="fromBox">
      <div>
        <!--        <div class="fromBoxItem">-->
        <!--          <span>场景</span>-->
        <!--          <ui-select v-model="form.project" style="width: 140px">-->
        <!--            <ui-select-option label="1" value="1"></ui-select-option>-->
        <!--            <ui-select-option label="2" value="2"></ui-select-option>-->
        <!--            <ui-select-option label="3" value="3"></ui-select-option>-->
        <!--          </ui-select>-->
        <!--        </div>-->
        <div class="fromBoxItem">
          <ui-input
            v-model="form.sceneName"
            placeholder="输入场景名称"
            icon="icon-a-101"
          ></ui-input>
        </div>
      </div>
      <div>
        <div class="fromBoxItem">
          <ui-button
            :disabled="selectSceneList.length === 0"
            @click="tipsStatus = true"
          >删除</ui-button>
        </div>
        <div class="fromBoxItem">
          <ui-button
            @click="openAddPlace"
            type="primary"
            icon="icon-a-81"
            class="primary"
          >新增场景</ui-button>
        </div>
        <div class="fromBoxItem">
          <ui-button
            icon="icon-a-zu1698"
            @click="queryFrom"
          >刷新场景</ui-button>
          <!--          <el-tooltip-->
          <!--            effect="light"-->
          <!--            content="全园特定开放时间"-->
          <!--            placement="bottom"-->
          <!--            :append-to-body="false"-->
          <!--          >-->
          <!--            <span style="margin-left: 6px">-->
          <!--              <ui-icon icon="icon-a-71"></ui-icon>-->
          <!--            </span>-->
          <!--          </el-tooltip>-->
        </div>
      </div>
    </div>
    <div
      class="tableBox"
      v-loadings="loading"
    >
      <ui-table
        :data="list"
        checkbox
        @selectChange="tableSelectChange"
      >
        <ui-table-column
          prop="sceneName"
          width="100"
          label="场景名称"
        ></ui-table-column>
        <ui-table-column
          prop="id"
          label="开放时间"
          width="300"
        >
          <template #default="{ row }">
            <div
              class="tableItem"
              style="max-width: 400px"
            >
              <div>{{ row.openDayText }}</div>
              <p style="color: #ff9900">
                <span v-show="row.amStartTime">
                  {{ row.amStartTime }}-{{ row.amEndTime }}</span>
                &nbsp;&nbsp;&nbsp;
                <span v-show="row.pmStartTime">{{ row.pmStartTime }}-{{ row.pmEndTime }}</span>
              </p>
            </div>
          </template>
        </ui-table-column>
        <ui-table-column
          width="80"
          prop="name"
          align="center"
          label="场景开放"
        >
          <template #default="{ row }">
            <el-switch
              v-model="row.rstatus"
              active-value="1"
              inactive-value="9"
              @change="changeSceneStatus($event, row)"
            ></el-switch>
          </template>
        </ui-table-column>
        <ui-table-column
          align="center"
          width="60"
          prop="name"
          label="操作"
        >
          <template #default="{ row }">
            <el-button
              type="text"
              @click="openEditPlace(row)"
            >编辑</el-button>
          </template>
        </ui-table-column>
      </ui-table>
    </div>
  </div>
  <ui-pagination
    :total="pageForm.total"
    :currentPage="pageForm.page"
    :pageSize="pageForm.pageSize"
    @handleCurrentChange="pageChange"
    @handleSizeChange="pageSizeChange"
  >
  </ui-pagination>
  <add-or-edit-place
    ref="addOrEditPlace"
    @close="queryFrom"
  ></add-or-edit-place>
  <ui-modal
    title="提示信息"
    v-model:visible="tipsStatus"
    :tips="false"
    :showClose="false"
    @ok="deleteSceneList"
  >
    <span>确定删除</span>
    <span style="color: #f56c6c">{{
      selectSceneList.map((item) => item.sceneName).join(",")
    }}</span>
    <span>这些场景吗?</span>
  </ui-modal>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import AddOrEditPlace from "@/views/surveillanceVideo/components/addOrEditPlace.vue";
import {
  deleteScene,
  openScene,
  queryScenePage,
} from "@/api/surveillanceVideo";
import Message from "@/themes/message";

interface TableSelect {
  sceneId: string;
  rstatus: string;
  sceneName: string;
}

export default defineComponent({
  components: { AddOrEditPlace },
  setup() {
    const tipsStatus = ref(false);
    const loading = ref(true);
    const pageForm = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
    });
    const deleteVisible = ref(false);
    const form = reactive({
      sceneName: "",
    });
    const selectSceneList = ref([] as TableSelect[]);
    let list = ref([]);
    const addOrEditPlace = ref("null");

    /**
     * 通过名称查询数据
     */
    const handleSearchInfo = (): void => {
      // console.log(form.name);
      queryFrom();
    };

    let searchTime: number;
    watch(
      () => form.sceneName,
      () => {
        if (searchTime) {
          clearTimeout(searchTime);
        }
        searchTime = setTimeout(() => {
          queryFrom();
        }, 500);
      }
    );

    type PlaceData = {
      id: string;
    };
    type Place = {
      open: (data?: PlaceData) => void;
    };
    /**
     * 打开新增场景
     */
    const openAddPlace = (): void => {
      (addOrEditPlace.value as unknown as Place).open();
    };
    /**
     * 编辑场景
     */
    const openEditPlace = (data: PlaceData): void => {
      (addOrEditPlace.value as unknown as Place).open(data);
    };

    /**
     * 翻页
     * @param page
     */
    const pageChange = (page: number) => {
      pageForm.page = page;
      queryFrom();
    };

    /**
     * pageSize修改
     * @param pageSize
     */
    const pageSizeChange = (pageSize: number) => {
      pageForm.pageSize = pageSize;
      queryFrom();
    };

    /**
     * 表格选择
     * @param list
     */
    const tableSelectChange = (list: TableSelect[]) => {
      selectSceneList.value = list;
    };

    interface sceneItem {
      sceneId: string;
    }
    /**
     * 启用或禁用场景
     * @param n
     * @param item
     */
    const changeSceneStatus = (n: string, item: sceneItem) => {
      openScene({
        sceneId: item.sceneId,
      }).then((res) => {
        if (res.code === 0) {
          Message.success(n === "1" ? "启用场景成功" : "禁用场景成功");
          queryFrom();
        }
      });
    };

    /**
     * 删除场景
     */
    const deleteSceneList = () => {
      const enableSelect = selectSceneList.value.filter(
        (item) => +item.rstatus === 1
      );
      if (enableSelect.length > 0) {
        Message.warning("已开启场景禁止删除");
        return;
      }
      const sceneIds = selectSceneList.value
        .map((item) => item.sceneId)
        .join(",");
      deleteScene({
        sceneIds: sceneIds,
      }).then((res) => {
        if (res.code === 0) {
          queryFrom();
          Message.success("删除场景成功");
          selectSceneList.value = [];
        } else {
          Message.warning(res.msg);
        }
        tipsStatus.value = false;
      });
    };

    /**
     * 查询场景管理列表
     */
    const queryFrom = () => {
      loading.value = true;
      queryScenePage({
        pageNo: pageForm.page,
        pageSize: pageForm.pageSize,
        sceneName: form.sceneName,
      }).then((res) => {
        if (res.code === 0) {
          pageForm.total = res.data.page.totalNum;
          list.value = res.data.list;
          loading.value = false;
        }
      });
    };

    queryFrom();

    return {
      loading,
      pageForm,
      form,
      list,
      addOrEditPlace,
      tipsStatus,
      selectSceneList,
      tableSelectChange,
      openAddPlace,
      openEditPlace,
      pageChange,
      pageSizeChange,
      queryFrom,
      changeSceneStatus,
      deleteSceneList,
    };
  },
});
</script>

<style lang="less">
.siteManagement {
  .fromBox {
    display: flex;
    padding: 22px 0 15px 0;
    justify-content: space-between;

    > div {
      display: flex;
      flex-wrap: wrap;
    }
    .fromBoxItem {
      margin-right: 16px;
      display: flex;
      white-space: nowrap;
      align-items: center;
      margin-bottom: 10px;
      .el-input {
        height: 32px;
        line-height: 32px;
      }
    }

    span {
      font-size: 14px;
      color: #999999;
      margin-right: 6px;
    }
    .primary {
      span {
        color: #ffffff !important;
      }
    }
  }
  .tableBox {
    .tableItem {
      padding: 15px 0;
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      > div {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
      > p {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
      }
    }
  }
}
</style>

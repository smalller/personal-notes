<template>
  <div class="toddler">
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <div class="tableBox">
      <ui-card>
        <div>现有班级绑定视频</div>
        <div class="fromBox">
          <div>
            <div class="fromBoxItem">
              <ui-input
                v-model="form.className"
                icon="icon-a-101"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
                placeholder="班级名称"
              ></ui-input>
            </div>
          </div>
          <div>
            <!--            <div class="fromBoxItem">-->
            <!--              已选-->
            <!--              <span>{{ classSelectList.length }}</span>-->
            <!--              项-->
            <!--            </div>-->
            <!--            <div class="fromBoxItem">-->
            <!--              <ui-button @click="videoBatchBinding">绑定视频</ui-button>-->
            <!--            </div>-->
          </div>
        </div>
        <ui-table
          v-loadings="loading"
          @selectChange="tableSelectChange"
          :data="data"
          class="tableBoxItem"
        >
          <ui-table-column
            prop="clazzName"
            label="班级名称"
            align="left"
          >
          </ui-table-column>
          <ui-table-column
            label="已绑定的视频"
            align="left"
          >
            <template #default="{ row }">
              <p v-if="+videoType === 0">
                {{ !!row?.deviceNames ? row.deviceNames : "-" }}
              </p>
              <p v-if="+videoType === 1">
                {{ !!row?.ezvizNams ? row.ezvizNams : "-" }}
              </p>
            </template>
          </ui-table-column>
          <ui-table-column
            prop="id"
            label="操作"
            align="right"
          >
            <template #default="{ row }">
              <ui-button
                type="text"
                style="color: #4fa8f9"
                @click="openVideoList(row)"
              >绑定视频</ui-button>
            </template>
          </ui-table-column>
        </ui-table>
        <ui-pagination
          :total="pageForm.total"
          :currentPage="pageForm.page"
          :pageSize="pageForm.pageSize"
          @handleCurrentChange="pageChange"
          @handleSizeChange="pageSizeChange"
        >
        </ui-pagination>
      </ui-card>
    </div>
  </div>
  <video-select
    ref="videoSelect"
    @ok="getSelectVideo"
    :videoType="videoType"
  ></video-select>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import VideoSelect from "@/views/surveillanceVideo/components/videoSelect.vue";
import {
  clazzBindDevice,
  queryClassDevicePage,
  queryClassEvDevicePage,
  queryCameraType,
  clazzBindEvDevice,
} from "@/api/surveillanceVideo";
import Message from "@/themes/message";
import { useStore } from "vuex";

type Toddler = {
  id: string;
  status: number;
};

export default defineComponent({
  components: { VideoSelect },
  setup() {
    const route = useRoute();
    const loading = ref(true);
    const videoSelect = ref(null);
    const tableIndex = ref(0);
    const $store = useStore();
    const pageForm = reactive({
      page: 1,
      pageSize: 20,
      total: 0,
    });
    const form = reactive({
      className: "",
    });
    let classSelectList = ref([] as TableSelect[]);
    const schoolTimeForm = reactive({
      times: [],
    });
    const data = ref([] as Array<Toddler>);
    const schoolData = $store.state.user.schoolId;
    const videoType = ref("0");
    const querySchool = () => {
      if (schoolData) {
        queryCameraType(schoolData).then((res) => {
          if (res.code === 0) {
            if (res.data) {
              videoType.value = res.data.cameraType ? res.data.cameraType : "0";
            }
            queryFrom();
          }
        });
      }
    };
    onMounted(() => {
      querySchool();
    });
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

    type videoItem = {
      deviceIds: string;
      clazzId: string;
      clazzName: string;
      ezvizIds?: string;
    };
    /**
     * 打开视频选择弹窗
     */
    const openVideoList = (item: videoItem) => {
      if (videoSelect?.value) {
        if (+videoType.value === 0) {
          (videoSelect.value as any).open(
            item.clazzName,
            !item?.deviceIds
              ? []
              : item.deviceIds.replace(/\s*/g, "").split(","),
            item.clazzId
          );
        } else {
          (videoSelect.value as any).open(
            item.clazzName,
            !item?.ezvizIds ? [] : item.ezvizIds.replace(/\s*/g, "").split(","),
            item.clazzId
          );
        }
      }
    };

    type selectVideo = {
      list: string[];
      classId: string;
    };

    let look = false;

    /**
     * 获取已选中的视频
     * @param data
     */
    const getSelectVideo = (data: selectVideo) => {
      if (look) {
        return;
      }
      look = true;
      const postData = ref({} as any);
      if (+videoType.value === 0) {
        postData.value = {
          ipcIds: data.list,
          clazzIds: data.classId,
        };
      } else {
        postData.value = {
          ezvizIds: data.list,
          clazzIds: data.classId,
        };
      }
      if (+videoType.value === 0) {
        clazzBindDevice(postData.value).then((res) => {
          if (res.code === 0) {
            pageForm.page = 1;
            queryFrom();
          } else {
            Message.warning(res.msg);
            look = false;
          }
        });
      } else {
        clazzBindEvDevice(postData.value).then((res) => {
          if (res.code === 0) {
            pageForm.page = 1;
            queryFrom();
          } else {
            Message.warning(res.msg);
            look = false;
          }
        });
      }
    };

    type TableSelect = {
      clazzId: string;
      ipcIds: string;
    };

    /**
     * 表格选择
     * @param list
     */
    const tableSelectChange = (list: TableSelect[]) => {
      classSelectList.value = list;
    };

    /**
     * 批量绑定
     */
    const videoBatchBinding = () => {
      if (classSelectList.value.length === 0) {
        Message.warning("请选择班级");
      } else {
        let ipcIds: string[] = [];
        const ids = classSelectList.value.map((item: TableSelect) => {
          ipcIds.push(item.ipcIds);
          return item.clazzId;
        });

        const idsIdList = ipcIds.join(",").split(",");
        const strIpcIds = Array.from(new Set(idsIdList));

        console.log(idsIdList, strIpcIds);

        if (videoSelect?.value) {
          (videoSelect.value as any).open("", strIpcIds, ids.join(","));
        }
      }
    };

    /**
     * 通过名称查询数据
     */
    const handleSearchInfo = (): void => {
      // console.log(form.name);
      queryFrom();
    };

    let searchTime: number;
    watch(
      () => form.className,
      () => {
        if (searchTime) {
          clearTimeout(searchTime);
        }
        searchTime = setTimeout(() => {
          queryFrom();
        }, 500);
      }
    );

    /**
     * 查询班级视频列表
     */
    const queryFrom = () => {
      loading.value = true;
      if (+videoType.value === 0) {
        queryClassDevicePage({
          pageNo: pageForm.page,
          pageSize: pageForm.pageSize,
          clazzName: form.className,
        }).then((res) => {
          if (+res.code === 0) {
            data.value = res.data.list;
            pageForm.total = res.data.page.totalNum;
            loading.value = false;
          } else {
            // Message.warning(res.msg);
          }
          look = false;
        });
      } else {
        queryClassEvDevicePage({
          pageNo: pageForm.page,
          pageSize: pageForm.pageSize,
          clazzName: form.className,
        }).then((res) => {
          if (+res.code === 0) {
            data.value = res.data.list;
            pageForm.total = res.data.page.totalNum;
            loading.value = false;
          } else {
            // Message.warning(res.msg);
          }
          look = false;
        });
      }
    };

    return {
      loading,
      route,
      tableIndex,
      data,
      pageForm,
      videoSelect,
      schoolTimeForm,
      classSelectList,
      videoType,
      form,
      handleSearchInfo,
      openVideoList,
      getSelectVideo,
      tableSelectChange,
      videoBatchBinding,
      pageChange,
      pageSizeChange,
    };
  },
});
</script>

<style lang="less">
.toddler {
  padding: 24px 40px;
  box-sizing: border-box;
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    .settingBox {
      display: flex;
      height: 36px;
      align-items: center;
      padding: 0 12px;
      margin-left: 40px;
      background: #ffffff;
      border: 1px solid #d9d9d9;
      opacity: 1;
      border-radius: 3px;
      span {
        font-size: 14px;
        &:nth-child(1) {
        }
        &:nth-child(2) {
          color: #ff9900;
          margin-left: 4px;
        }
        &:nth-child(3) {
          cursor: pointer;
          color: #bfbfbf;
          margin-left: 32px;
          user-select: none;
          &:hover {
            color: #61b4ff;
          }
          &:active {
            color: #bfbfbf;
          }
        }
      }
    }
  }
  .chartBox {
    margin-top: 20px;
    display: flex;
    .bin {
      width: 468px;
    }
    .line {
      flex: 1;
    }
  }
  .tableBox {
    margin-top: 20px;
    .tableBoxItem {
      .itemNameBox {
        display: flex;
        align-items: center;
        img {
          width: 32px;
          height: 32px;
          margin-right: 10px;
          border-radius: 4px;
        }
        span {
          color: #222222;
          font-size: 14px;
        }
      }
    }

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
        .el-input {
          height: 32px;
          line-height: 32px;
        }
        span {
          margin: 0 6px;
        }
      }
      span {
        font-size: 14px;
        color: #999999;
        margin-right: 6px;
      }
    }

    .itemDetails {
      background: #fafafa;
      border: 1px solid #e8e8e8;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      padding: 0 56px;
      &::after {
        content: "";
        position: absolute;
        top: -20px;
        right: 45px;
        width: 0;
        height: 0;
        border-top: 10px solid transparent;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 10px solid #fafafa;
      }
      .itemDetailsItem {
        display: flex;
        padding: 14px 0;
        img {
          width: 80px;
          height: 80px;
          border-radius: 4px;
        }
        .infoBox {
          margin-left: 16px;
          display: flex;
          flex-direction: column;
          .time {
            font-size: 14px;
            color: #222222;
            font-weight: 400;
          }
          span {
            font-size: 12px;
            color: #666666;
            margin-bottom: 4px;
          }
        }
      }
    }
  }
}
.toddlerModelBox {
  .el-checkbox {
    margin-right: 16px;
  }
  .toddlerModelForm {
    margin-top: 20px;
    margin-bottom: 48px;
  }
}
</style>

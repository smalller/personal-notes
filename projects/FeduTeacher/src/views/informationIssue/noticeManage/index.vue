<template>
  <div class="schoolNotice">
    <el-drawer v-model="modeStatus.showView" size="960px" class="show-box">
      <manage :dataInfo="selectData"></manage>
    </el-drawer>
    <div class="title">
      <span>{{ route.name }}</span>
    </div>
    <logoutIdentity ref="logoutIdentityCom" @handleSure="handleDelNotice">
      <p class="body-text" style="font-size: 14px; color: #f56060">
        删除后不可恢复，只能重新录入
      </p>
    </logoutIdentity>
    <div class="school-info"></div>
    <div class="school-table">
      <ui-card>
        <div class="fromBox">
          <div>
            <div class="from-item">
              <span
                style="
                  min-width: 28px;
                  color: #999;
                  font-size: 14px;
                  margin-right: 6px;
                "
                >发布人</span
              >
              <ui-input
                maxlength="40"
                style="width: 120px"
                v-model="searchName"
                placeholder="输入发布人"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
            </div>
            <div class="from-item">
              <SelectPostOrClass
                title="范围"
                placeholder="全部班级"
                width="140"
                :list="classList"
                @handleSelect="handleSelect"
              ></SelectPostOrClass>
            </div>
            <div class="from-item">
              <DateFilter @handleSelectDate="handleSelectDate"></DateFilter>
            </div>
            <div class="from-item">
              <ui-input
                maxlength="40"
                style="width: 240px"
                v-model="searchInfo"
                placeholder="输入标题"
                icon="icon-a-101"
                @keydown.enter="handleSearchInfo"
                @iconClick="handleSearchInfo"
              ></ui-input>
            </div>
          </div>
          <div class="from-items">
            <div class="del">
              <ui-button class="button" @click="deleteNotice">删除</ui-button>
              <div v-if="isDeleteNotice" class="is-empty-data">
                <span>请至少选择一项</span>
              </div>
            </div>
            <ui-button
              type="primary"
              icon="icon-a-81"
              class="button"
              @click="goToEditNotice"
              >发布通知</ui-button
            >
          </div>
        </div>
        <div v-loading="loading">
          <ui-table
            :data="noticeList"
            class="tableBoxItem"
            :checkbox="true"
            @selectChange="chooseClass"
          >
            <ui-table-column
              prop="title"
              label="通知标题"
              align="left"
              width="160"
            >
              <template #default="{ row }">
                <div class="itemNameBox">
                  <img :src="row.titleImage" alt="" v-if="row.titleImage" />
                  <span
                    style="
                      white-space: nowrap;
                      width: 110px;
                      overflow: hidden;
                      height: 20px;
                    "
                    >{{ row.title }}</span
                  >
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              label="通知内容"
              align="left"
              width="400"
              style="white-space: nowrap"
            >
              <template #default="{ row }">
                <div class="table-content">
                  <span>{{ row.content }} </span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="username"
              label="发布人"
              align="left"
              width="120"
            >
            </ui-table-column>
            <ui-table-column label="发布范围" align="left" width="200">
              <template #default="{ row }">
                <div class="itemNameBox">
                  <span
                    style="margin: 0px"
                    v-for="(item, index) in row.clazzNames"
                    :key="index"
                    >{{ item
                    }}{{
                      index === row.clazzNames.length - 1 ? "" : "、"
                    }}</span
                  >
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="createTime"
              label="发布时间"
              align="left"
              width="90"
            >
              <template #default="{ row }">
                <div>
                  <span>{{ row.createTime.slice(0, 10) }} </span>
                </div>
              </template>
            </ui-table-column>
            <ui-table-column
              prop="countNoReader"
              label="未读人数"
              align="center"
              width="90"
            >
            </ui-table-column>
            <ui-table-column prop="id" label="操作" align="right">
              <template #default="{ row }">
                <ul class="handle-box">
                  <li>
                    <ui-button type="text-blue" @click="manage(row)"
                      >查看详情</ui-button
                    >
                  </li>
                </ul>
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
      </ui-card>
    </div>
  </div>
</template>

<script lang="ts">
import { useRoute, useRouter } from "vue-router";
import { defineComponent, ref, reactive, onMounted, watch } from "vue";
import { ElDrawer } from "element-plus";
import DateFilter from "@/components/DateFilter.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import { getNoticeList } from "@/api/reviewManage";
import { delNotice } from "@/api/noticeManage";
import manage from "./components/noticeManage.vue";
import logoutIdentity from "@/components/logoutIdentity.vue";
import Message from "@/themes/message";
import micell from "micell";
import { throttle } from "@/utils/common";
import { useStore } from "vuex";
interface ClassList {
  name: string;
  id: string;
  [key: string]: any;
}
export default defineComponent({
  components: {
    DateFilter,
    manage,
    ElDrawer,
    SelectPostOrClass,
    logoutIdentity,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const $store = useStore();
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const searchName = ref(""); //发布人
    const classId = ref(""); // 年级筛选值
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const checkRowInfo = ref<any[]>([]);
    const loading = ref(true);
    const selectData = ref("");
    const noticeList = ref([]);
    //初始化班级数据
    $store.dispatch("getClassList");
    let classList = JSON.parse(
      JSON.stringify($store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "", name: "全部班级" });
    //页面状态控制
    const modeStatus = ref({
      showView: false,
      addClassList: false,
      editClass: false,
      showManage: false,
    });
    //预览页面
    const manage = (data: any) => {
      selectData.value = data.id;
      modeStatus.value.showView = true;
    };
    // 跳转到发布/编辑通知页面
    function goToEditNotice() {
      let routeUrl = router.resolve({
        path: "/recipeDetail/EditNotice",
      });
      window.open(routeUrl.href, "_blank");
    }
    const getNoticeLists = async (): Promise<any> => {
      checkRowInfo.value.length = 0;
      loading.value = true;
      let { code, data } = await getNoticeList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            startTime: startTime.value,
            endTime: endTime.value,
            title: searchInfo.value,
            username: searchName.value,
            clazzIds: classId.value,
          }
        )
      );
      if (+code === 0) {
        noticeList.value = data.list;
        totalNum.value = data.page.totalNum;
        loading.value = false;
      }
    };
    onMounted(() => {
      getNoticeLists();
      window.addEventListener("message", (e) => {
        if (e.origin === location.origin) {
          switch (e.data) {
            case "updateNotice":
              getNoticeLists();
              break;
          }
        }
      });
    });
    const deleteNoticeList = ref([] as any);
    const logoutIdentityCom = ref(null);
    const chooseClass = (res: any) => {
      deleteNoticeList.value = res;
    };
    const isDeleteNotice = ref(false);
    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (): void => {
      isDeleteNotice.value = true;
      let timer = null;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        isDeleteNotice.value = false;
      }, 2000);
    };
    // 删除通知
    function deleteNotice() {
      if (deleteNoticeList.value.length === 0) {
        checkIsEmptyData();
      } else {
        (logoutIdentityCom.value as any).handleOpen(
          `确认将勾选的${deleteNoticeList.value.length}条通知删除吗？`
        );
      }
    }
    const handleDelNotice = async () => {
      const arr = deleteNoticeList.value.map((item: any) => item.id);
      const { code } = await delNotice(arr);
      if (+code === 0) {
        Message.success("删除成功");
        deleteNoticeList.value = [];
        getNoticeLists();
      }
    };
    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      deleteNoticeList.value = [];
      getNoticeLists();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      deleteNoticeList.value = [];
      getNoticeLists();
    };
    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getNoticeLists();
    };
    // 日期筛选
    const handleSelectDate = (res: string): void => {
      if (res) {
        startTime.value = micell.date.format(res[0], "YYYY-MM-DD");
        endTime.value = micell.date.format(res[1], "YYYY-MM-DD");
      } else {
        startTime.value = "";
        endTime.value = "";
      }
      getNoticeLists();
    };
    // 班级筛选
    const handleSelect = (res: ClassList): void => {
      if (res) {
        classId.value = res.id;
      } else {
        classId.value = "";
      }
      getNoticeLists();
    };
    // 输入框边输边查询
    watch(
      () => [searchInfo.value, searchName.value],
      () => {
        throttle(() => {
          getNoticeLists();
        }, 500);
      }
    );
    return {
      route,
      selectData,
      noticeList,
      modeStatus,
      totalNum,
      manage,
      currentPage,
      pageSize,
      goToEditNotice,
      chooseClass,
      deleteNotice,
      isDeleteNotice,
      logoutIdentityCom,
      handleDelNotice,
      handleSizeChange,
      handleCurrentChange,
      searchName,
      searchInfo,
      handleSearchInfo,
      handleSelectDate,
      classList,
      handleSelect,
      loading,
    };
  },
});
</script>
<style lang="less" scoped>
.schoolNotice {
  padding: 24px 40px;
  box-sizing: border-box;
  .show-box {
    width: 960px;
    height: 100%;
    background: linear-gradient(0deg, #46d2e8, #008fbc);
    box-shadow: 0px 2px 8px 0px undefined;
  }
  .title {
    font-size: 24px;
    color: #222222;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
  .school-table {
    margin-top: 24px;
    .fromBox {
      display: flex;
      padding: 22px 0 15px 0;
      justify-content: space-between;
      > div {
        display: flex;
        flex-wrap: wrap;
      }
      .from-item {
        margin-right: 15px;
        margin-bottom: 10px;
        display: flex;
        white-space: nowrap;
        align-items: center;
      }
      .from-items {
        .button {
          min-width: 64px;
          height: 32px;
          padding: 0px 10 0 10;
          margin-left: 15px;
        }
        .del {
          .is-empty-data {
            height: 45px;
            position: absolute;
            top: 133px;
            /* left: -4px; */
            right: 175px;
            width: 128px;
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
    .tableBoxItem {
      .itemNameBox {
        display: inline-flex;
        img {
          display: block;
          width: 32px;
          height: 32px;
          border: 1px solid undefined;
          border-radius: 4px;
          margin-top: 10px;
        }
        span {
          display: block;
          height: 15px;
          margin-top: 14px;
          margin-left: 10px;
        }
      }
      .table-content {
        width: 400px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

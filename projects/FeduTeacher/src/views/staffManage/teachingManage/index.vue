<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card class="top-charts-box">
      <div class="left-map">
        <ChartsTitle title="教职工分布" tips="现有教职工的统计"></ChartsTitle>
        <PeopleNumChart></PeopleNumChart>
      </div>
      <div class="right-map">
        <PeopleLineChart></PeopleLineChart>
      </div>
    </ui-card>
    <ui-card>
      <EditStaff ref="editStaffCom"></EditStaff>
      <ImportUser
        ref="importUser"
        index="1"
        title="教职工"
        tips="填写的手机号同为APP登录账号"
      ></ImportUser>
      <logoutIdentity ref="logoutIdentityCom" @handleSure="handleLogoutSure">
        <template v-if="logoutIdentityIndex === 1">
          <p
            v-for="(item, index) in staticData.logoutIdentityTextArr"
            :key="index"
            class="body-text"
          >
            {{ index + 1 + "." }} {{ item }}
          </p>
        </template>
        <template v-else-if="logoutIdentityIndex === 2">
          <p class="body-text">{{ staticData.logoutDeleteTextArr }}</p>
        </template>
      </logoutIdentity>
      <TopType
        :topTypeList="staticData.topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <div class="top-handle-box">
        <div class="left-box">
          <SelectPostOrClass
            title="称谓"
            placeholder="全部称谓"
            width="140"
            :list="titleList"
            @handleSelect="handleSelect"
            :changeTabStatus="changeTabStatus"
          ></SelectPostOrClass>
          <DateFilter
            @handleSelectDate="handleSelectDate"
            :changeTabStatus="changeTabStatus"
          ></DateFilter>
          <ui-input
            maxlength="40"
            style="width: 240px; margin-bottom: 15px"
            v-model="searchInfo"
            placeholder="输入姓名或手机号"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
        </div>
        <div class="right-box">
          <ul v-if="currentType === 1">
            <li v-for="(item, index) in onTeachTopHandleList" :key="index">
              <ui-button
                :class="item.name === '离职' ? 'is-dimission' : ''"
                :type="item.type ? item.type : 'default'"
                :icon="item.icon ? item.icon : 'default'"
                @click="item.onClick"
                >{{ item.name }}</ui-button
              >

              <div
                v-if="
                  isEmptyDataFlag.isDimissionEmptyData && item.name === '离职'
                "
                class="is-empty-data"
              >
                <span>请至少选择一项</span>
              </div>
            </li>
          </ul>
          <ul v-else-if="currentType === 9">
            <li
              v-for="(item, index) in dimissionTeachTopHandleList"
              :key="index"
            >
              <ui-button
                :class="item.name === '删除' ? 'is-dimission' : ''"
                :type="item.type ? item.type : 'default'"
                :icon="item.icon ? item.icon : 'default'"
                @click="item.onClick"
                >{{ item.name }}</ui-button
              >

              <div
                v-if="isEmptyDataFlag.isDeleteEmptyData && item.name === '删除'"
                class="is-empty-data"
              >
                <span>请至少选择一项</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-loading="loading">
        <OnTeachTable
          v-if="currentType === 1"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></OnTeachTable>
        <DimissionTeachTable
          v-else-if="currentType === 9"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></DimissionTeachTable>
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
</template>

<script lang="ts">
import qs from "qs";
import {
  defineComponent,
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import TopType from "@/components/TopType.vue";
import logoutIdentity from "@/components/logoutIdentity.vue";
import ImportUser from "@/components/ImportUser.vue";
import EditStaff from "./components/EditStaff.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import DateFilter from "@/components/DateFilter.vue";
import {
  getTableList,
  staffDimission,
  deleteStaff,
} from "@/api/teachingManage";
import { staticData, IsEmptyDataFlag, StaffTableList, TitleList } from "./util";
import { TopTypeListItem } from "@/utils/common";
import OnTeachTable from "./components/OnTeachTable.vue";
import DimissionTeachTable from "./components/DimissionTeachTable.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import ChartsTitle from "@/components/ChartsTitle.vue";
import PeopleNumChart from "./components/PeopleNumChart.vue";
import micell from "micell";
import { throttle } from "@/utils/common";
import PeopleLineChart from "./components/PeopleLineChart.vue";
import { download } from "@/base/common";
import bus from "@/Layout/bus";
import Message from "@/themes/message";

export default defineComponent({
  components: {
    TopType,
    logoutIdentity,
    ImportUser,
    EditStaff,
    SelectPostOrClass,
    DateFilter,
    OnTeachTable,
    DimissionTeachTable,
    ChartsTitle,
    PeopleNumChart,
    PeopleLineChart,
  },

  setup() {
    const route = useRoute();
    const $store = useStore();
    $store.dispatch("getClassList");
    let titleList = JSON.parse(
      JSON.stringify($store.state.commonData.titleList)
    ); // 班级列表
    titleList.unshift({ codeInfoId: "allTitle", codeInfoName: "全部称谓" });
    const userId = $store.state.user.userId;
    const loading = ref(true);

    // 模态框组件初始化
    const logoutIdentityCom = ref(null);
    const importUser = ref(null);
    const editStaffCom = ref(null);
    const bindTimeCardCom = ref(null);

    const currentType = ref(1); // 标签页索引
    const changeTabStatus = ref(false); //是否切换了标签页
    const logoutIdentityIndex = ref(1); // 1-离职，2-删除
    let checkRowInfo = ref([] as Array<StaffTableList>); // 已勾选的行信息
    const tableData = ref([] as Array<StaffTableList>); // 表格数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const titleQuery = ref(""); // 称谓筛选值
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间

    // 获取表格内容
    const getTeachList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getTableList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            title: titleQuery.value,
            jobStatus: currentType.value,
            startTime: startTime.value,
            endTime: endTime.value,
            name: searchInfo.value,
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
    getTeachList();

    // 表格勾选事件
    const checkBoxChange = (res: Array<StaffTableList>): void => {
      checkRowInfo.value = res;
    };

    let isEmptyDataFlag: IsEmptyDataFlag = reactive({
      isDimissionEmptyData: false,
      isDeleteEmptyData: false,
    });
    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (flag: keyof IsEmptyDataFlag): void => {
      for (let key in isEmptyDataFlag) {
        isEmptyDataFlag[key as keyof IsEmptyDataFlag] = false;
      }

      isEmptyDataFlag[flag] = true;

      throttle(() => {
        isEmptyDataFlag[flag] = false;
      }, 2000);
    };

    // 导出excel
    const handleExportStaffs = (): void => {
      const str = qs.stringify({
        title: titleQuery.value,
        jobStatus: currentType.value,
        startTime: startTime.value,
        endTime: endTime.value,
        name: searchInfo.value,
        schoolId: sessionStorage.getItem("schoolId"),
      });

      if (tableData.value.length > 0) {
        download(
          process.env.VUE_APP_BASE_API +
            `/schools/api/employee/exportEmp?${str}`,
          "教职工信息"
        );
      } else {
        Message.warning("暂无数据可导出");
      }
    };

    // 现有教职工顶部左边操作按钮
    const onTeachTopHandleList = ref([
      {
        name: "离职",
        onClick: (): void => {
          logoutIdentityIndex.value = 1;
          if (checkRowInfo.value.length === 0) {
            checkIsEmptyData("isDimissionEmptyData");
          } else {
            let txt = "";
            if (checkRowInfo.value.length === 1) {
              txt = `确认将勾选的 ${checkRowInfo.value[0].name} 离职？`;
            } else {
              txt = `确认将勾选的${checkRowInfo.value.length}个人离职？`;
            }
            (logoutIdentityCom.value as any).handleOpen(txt);
          }
        },
      },
      {
        name: "批量导入",
        icon: "icon-a-65",
        onClick: (): void => {
          (importUser.value as any).handleOpen();
        },
      },
      {
        name: "新增员工",
        icon: "icon-a-81",
        type: "primary",
        onClick: (): void => {
          (editStaffCom.value as any).handleOpen(1);
        },
      },
      {
        name: "导出Excel",
        icon: "icon-a-31",
        type: "text",
        onClick: (): void => {
          handleExportStaffs();
        },
      },
    ]);

    // 离职教职工顶部左边操作按钮
    const dimissionTeachTopHandleList = ref([
      {
        name: "删除",
        onClick: (): void => {
          logoutIdentityIndex.value = 2;
          if (checkRowInfo.value.length === 0) {
            checkIsEmptyData("isDeleteEmptyData");
          } else {
            let txt = "";
            if (checkRowInfo.value.length === 1) {
              txt = `确认将勾选的 ${checkRowInfo.value[0].name} 删除？`;
            } else {
              txt = `确认将勾选的${checkRowInfo.value.length}个人删除？`;
            }
            (logoutIdentityCom.value as any).handleOpen(txt);
          }
        },
      },
      {
        name: "导出Excel",
        icon: "icon-a-31",
        type: "text",
        onClick: (): void => {
          handleExportStaffs();
        },
      },
    ]);

    // 离职操作
    const handleStaffDimission = async (): Promise<void> => {
      const ids = checkRowInfo.value.map((item) => item.id).join(",");
      const status = checkRowInfo.value.map((item) => item.id).includes(userId);

      if (status) {
        Message.warning("不能对登录账号进行离职操作");
        return;
      }

      const { code } = await staffDimission(ids);
      if (+code === 0) {
        emitUpdateChartData();
        Message.success("离职成功");
        getTeachList();
      }
    };

    // 删除操作
    const handleDeleteStaff = async (): Promise<void> => {
      const ids = checkRowInfo.value.map((item) => item.id).join(",");
      const { code } = await deleteStaff(ids);
      if (+code === 0) {
        Message.success("删除成功");
        getTeachList();
      }
    };

    // 确认离职/删除操作
    const handleLogoutSure = (): void => {
      if (logoutIdentityIndex.value === 1) {
        handleStaffDimission();
      } else if (logoutIdentityIndex.value === 2) {
        handleDeleteStaff();
      }
    };

    // 初始化筛选数据
    const initQueryData = (): void => {
      changeTabStatus.value = !changeTabStatus.value; // 只要改变了值，就能让其他地方监听到值改变，然后做其他操作
      currentPage.value = 1;
      searchInfo.value = "";
      titleQuery.value = "";
      startTime.value = "";
      endTime.value = "";
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      initQueryData();
      currentType.value = res.value;
      getTeachList();
    };

    // 称谓筛选表格
    const handleSelect = (res: TitleList): void => {
      if (res) {
        if (res.codeInfoId == "allTitle") {
          titleQuery.value = "";
        } else {
          titleQuery.value = res.codeInfoName;
        }
      } else {
        titleQuery.value = "";
      }
      getTeachList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getTeachList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getTeachList();
        }, 500);
      }
    );

    // 日期筛选
    const handleSelectDate = (res: string): void => {
      if (res) {
        startTime.value = micell.date.format(res[0], "YYYY-MM-DD");
        endTime.value = micell.date.format(res[1], "YYYY-MM-DD");
      } else {
        startTime.value = "";
        endTime.value = "";
      }
      getTeachList();
    };

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getTeachList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getTeachList();
    };

    // 通知更新图表数据
    const emitUpdateChartData = (): void => {
      bus.$emit("updateTeachNumData", true); // 通知更新教职工分布数据
      bus.$emit("updateTeachLineData", true); // 通知更新教职工数量趋势数据
    };

    onMounted(() => {
      // 更新表格
      bus.$on("editStaffComplete", (res: boolean) => {
        if (res) {
          getTeachList();
          emitUpdateChartData();
        }
      });
    });

    onUnmounted(() => {
      bus.$off("editStaffComplete");
    });

    return {
      changeTopType,
      handleSearchInfo,
      onTeachTopHandleList,
      dimissionTeachTopHandleList,
      currentType,
      pageSize,
      tableData,
      checkBoxChange,
      logoutIdentityCom,
      importUser,
      editStaffCom,
      bindTimeCardCom,
      handleSelect,
      handleLogoutSure,
      isEmptyDataFlag,
      checkIsEmptyData,
      getTeachList,
      staticData,
      handleSelectDate,
      handleSizeChange,
      handleCurrentChange,
      titleList,
      currentPage,
      totalNum,
      logoutIdentityIndex,
      route,
      searchInfo,
      titleQuery,
      startTime,
      endTime,
      changeTabStatus,
      loading,
    };
  },
});
</script>

<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

  .top-title {
    font-size: 24px;
    color: #222;
    margin-bottom: 20px;
  }

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
      > ul {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;

        li {
          margin: 0 0 15px 16px;
          position: relative;

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
}
</style>

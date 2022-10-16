<template>
  <div class="wrap">
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card class="top-charts-box">
      <div class="left-map">
        <ChartsTitle title="幼儿分布" tips="现有幼儿的统计"></ChartsTitle>
        <PeopleNumChart></PeopleNumChart>
      </div>
      <div class="right-map">
        <PeopleLineChart></PeopleLineChart>
      </div>
    </ui-card>
    <ui-card>
      <ChangeClass ref="changeClassCom" width="519"></ChangeClass>
      <EditInfant ref="editInfantCom"></EditInfant>
      <ImportUser
        ref="importUser"
        index="2"
        title="幼儿"
        tips="一次只能导入一个班级的幼儿数据"
      ></ImportUser>
      <logoutIdentity
        width="500"
        ref="logoutIdentityCom"
        @handleSure="handleLogoutSure"
      >
        <template v-if="logoutIdentityIndex === 1">
          <p
            v-for="(item, index) in staticData.logoutGradenTextArr"
            :key="index"
            class="body-text"
          >
            {{ index + 1 + "." }} {{ item }}
          </p>
        </template>
        <template v-else-if="logoutIdentityIndex === 2">
          <p class="body-text">
            {{ staticData.changeClassText }}
          </p>
        </template>
        <template v-else-if="logoutIdentityIndex === 3">
          <p class="body-text">
            {{ staticData.deleteStudentsText }}
          </p>
        </template>
      </logoutIdentity>
      <TopType
        :topTypeList="staticData.topTypeList"
        @changeTopType="changeTopType"
      ></TopType>
      <div class="top-handle-box">
        <div class="left-box">
          <SelectPostOrClass
            title="班级"
            placeholder="全部班级"
            width="140"
            :list="classList"
            @handleSelect="handleSelect"
            :changeTabStatus="changeTabStatus"
          ></SelectPostOrClass>
          <SelectPostOrClass
            title="筛选"
            placeholder="全部"
            width="140"
            :list="staticData.filterList"
            @handleSelect="handleSelectFilter"
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
            <li v-for="(item, index) in atSchoolTopHandleList" :key="index">
              <ui-button
                :class="
                  item.name === '退园' || item.name === '转班'
                    ? 'is-dimission'
                    : ''
                "
                :type="item.type ? item.type : 'default'"
                :icon="item.icon ? item.icon : 'default'"
                @click="item.onClick"
                >{{ item.name }}</ui-button
              >
              <div
                v-if="
                  (isEmptyDataFlag.isDropOutEmptyData &&
                    item.name === '退园') ||
                  (isEmptyDataFlag.isChangeClassEmptyData &&
                    item.name === '转班')
                "
                class="is-empty-data"
              >
                <span>请至少选择一项</span>
              </div>
            </li>
            <li>
              <ui-button type="text" @click="handleUpload">
                <ui-icon icon="icon-a-31"></ui-icon>
                导出Excel</ui-button
              >
            </li>
          </ul>
          <ul v-else-if="currentType === 2 || currentType === 3">
            <li v-if="currentType === 3">
              <ui-button @click="handleDelete">删除</ui-button>
              <div
                class="is-empty-data"
                v-if="isEmptyDataFlag.isDeleteStudentsEmptyData"
              >
                <span>请至少选择一项</span>
              </div>
            </li>
            <li style="height: 32px">
              <ui-button type="text" @click="handleUpload">
                <ui-icon icon="icon-a-31"></ui-icon>
                导出Excel</ui-button
              >
            </li>
          </ul>
        </div>
      </div>
      <div v-loading="loading">
        <AtSchoolInfantTable
          v-if="currentType === 1"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></AtSchoolInfantTable>
        <GraduateInfantTable
          v-else-if="currentType === 2"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></GraduateInfantTable>
        <DropOutInfantTable
          v-else-if="currentType === 3"
          :data="tableData"
          @selectChange="checkBoxChange"
        ></DropOutInfantTable>
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
import {
  defineComponent,
  reactive,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import TopType from "@/components/TopType.vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import DateFilter from "@/components/DateFilter.vue";
import logoutIdentity from "@/components/logoutIdentity.vue";
import ImportUser from "@/components/ImportUser.vue";
import EditInfant from "./components/EditInfant.vue";
import ChangeClass from "./components/ChangeClass.vue";
import {
  staticData,
  IsEmptyDataFlag,
  InfantTableList,
  ClassList,
} from "./util";
import { TopTypeListItem } from "@/utils/common";
import AtSchoolInfantTable from "./components/AtSchoolInfantTable.vue";
import GraduateInfantTable from "./components/GraduateInfantTable.vue";
import DropOutInfantTable from "./components/DropOutInfantTable.vue";
import ChartsTitle from "@/components/ChartsTitle.vue";
import { throttle } from "@/utils/common";
import micell from "micell";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  getTableList,
  infantDropOut,
  deleteStudents,
} from "@/api/infantManage";
import PeopleNumChart from "./components/PeopleNumChart.vue";
import PeopleLineChart from "./components/PeopleLineChart.vue";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import qs from "qs";
import { download } from "@/base/common";

export default defineComponent({
  name: "",
  components: {
    TopType,
    SelectPostOrClass,
    DateFilter,
    logoutIdentity,
    EditInfant,
    ImportUser,
    ChangeClass,
    AtSchoolInfantTable,
    GraduateInfantTable,
    DropOutInfantTable,
    ChartsTitle,
    PeopleNumChart,
    PeopleLineChart,
  },
  setup() {
    const route = useRoute();
    const $store = useStore();
    $store.dispatch("getClassList");
    let classList = JSON.parse(
      JSON.stringify($store.state.commonData.classList)
    ); // 班级列表
    classList.unshift({ id: "", name: "全部班级" });
    const loading = ref(true);

    // 模态框组件初始化
    const logoutIdentityCom = ref(null);
    const importUser = ref(null);
    const changeClassCom = ref(null);
    const editInfantCom = ref(null);

    const currentType = ref(1); // 标签页索引
    const logoutIdentityIndex = ref(1); // 1-退园，2-转班，3-删除幼儿
    const changeTabStatus = ref(false); //是否切换了标签页
    let checkRowInfo = ref([] as Array<InfantTableList>); // 已勾选的行信息
    const tableData = ref([] as Array<InfantTableList>); // 表格数据
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数
    const searchInfo = ref(""); // 输入框搜索值
    const classQuery = ref(""); // 班级筛选值
    const startTime = ref(""); // 筛选开始时间
    const endTime = ref(""); // 筛选结束时间
    const settleApp = ref(""); // 入住APP

    // 导出excel
    function handleUpload() {
      const str = qs.stringify({
        clazzId: classQuery.value,
        stuStatus: currentType.value,
        startTime: startTime.value,
        endTime: endTime.value,
        name: searchInfo.value,
        settleApp: settleApp.value,
        schoolId: sessionStorage.getItem("schoolId"),
      });

      if (tableData.value.length > 0) {
        download(
          process.env.VUE_APP_BASE_API +
            `/schools/api/student/exportClazz?${str}`,
          "幼儿信息"
        );
      } else {
        Message.warning("暂无数据可导出");
      }
    }

    // 获取表格内容
    const getInfantList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getTableList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            clazzId: classQuery.value,
            stuStatus: currentType.value,
            startTime: startTime.value,
            endTime: endTime.value,
            name: searchInfo.value,
            settleApp: settleApp.value,
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
    getInfantList();

    // 表格勾选事件
    const checkBoxChange = (res: Array<InfantTableList>): void => {
      checkRowInfo.value = res;
    };

    let isEmptyDataFlag: IsEmptyDataFlag = reactive({
      isDropOutEmptyData: false,
      isChangeClassEmptyData: false,
      isDeleteStudentsEmptyData: false,
    });

    // 如果勾选的数据为空，就展示相关tips样式
    const checkIsEmptyData = (flag: keyof IsEmptyDataFlag) => {
      for (let key in isEmptyDataFlag) {
        isEmptyDataFlag[key as keyof IsEmptyDataFlag] = false;
      }

      isEmptyDataFlag[flag] = true;

      throttle(() => {
        isEmptyDataFlag[flag] = false;
      }, 2000);
    };

    // 现有幼儿顶部左边操作按钮
    const atSchoolTopHandleList = ref([
      {
        name: "退园",
        onClick: (): void => {
          logoutIdentityIndex.value = 1;
          if (checkRowInfo.value.length === 0) {
            checkIsEmptyData("isDropOutEmptyData");
          } else {
            let txt = "";
            if (checkRowInfo.value.length === 1) {
              txt = `确认将勾选的 ${checkRowInfo.value[0].name} 退园？`;
            } else {
              txt = `确认将勾选的${checkRowInfo.value.length}个人退园？`;
            }
            (logoutIdentityCom.value as any).handleOpen(txt);
          }
        },
      },
      {
        name: "转班",
        onClick: (): void => {
          logoutIdentityIndex.value = 2;
          if (checkRowInfo.value.length === 0) {
            checkIsEmptyData("isChangeClassEmptyData");
          } else {
            let txt = "";
            if (checkRowInfo.value.length === 1) {
              txt = `确认将勾选的 ${checkRowInfo.value[0].name} 转班？`;
            } else {
              txt = `确认将勾选的${checkRowInfo.value.length}个人转班？`;
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
        name: "新增幼儿",
        icon: "icon-a-81",
        type: "primary",
        onClick: (): void => {
          (editInfantCom.value as any).handleOpen(1);
        },
      },
    ]);

    // 删除幼儿操作
    function handleDelete() {
      logoutIdentityIndex.value = 3;
      if (checkRowInfo.value.length === 0) {
        checkIsEmptyData("isDeleteStudentsEmptyData");
      } else {
        let txt = "";
        if (checkRowInfo.value.length === 1) {
          txt = `确认将勾选的 ${checkRowInfo.value[0].name} 删除？`;
        } else {
          txt = `确认将勾选的${checkRowInfo.value.length}个人删除？`;
        }
        (logoutIdentityCom.value as any).handleOpen(txt);
      }
    }

    // 确认删除幼儿
    async function sureDeleteStudents() {
      const ids = checkRowInfo.value.map((item) => item.id);
      const { code } = await deleteStudents(ids);
      if (+code === 0) {
        Message.success("删除成功");
        getInfantList();
      }
    }

    // 退园操作
    const handleInfantDropOut = async (): Promise<void> => {
      const ids = checkRowInfo.value.map((item) => item.id).join(",");
      const { code } = await infantDropOut(ids);
      if (+code === 0) {
        emitUpdateChartData();
        Message.success("退园成功");
        getInfantList();
      }
    };

    // 确认退园/转班/删除幼儿操作
    const handleLogoutSure = (): void => {
      if (logoutIdentityIndex.value === 1) {
        handleInfantDropOut();
      } else if (logoutIdentityIndex.value === 2) {
        (changeClassCom.value as any).handleOpen(checkRowInfo.value);
      } else if (logoutIdentityIndex.value === 3) {
        sureDeleteStudents();
      }
    };

    // 初始化筛选数据
    const initQueryData = (): void => {
      changeTabStatus.value = !changeTabStatus.value; // 只要改变了值，就能让其他地方监听到值改变，然后做其他操作
      currentPage.value = 1;
      searchInfo.value = "";
      classQuery.value = "";
      startTime.value = "";
      endTime.value = "";
      settleApp.value = "";
    };

    // 切换菜单栏
    const changeTopType = (res: TopTypeListItem): void => {
      initQueryData();
      currentType.value = res.value;
      getInfantList();
    };

    // 班级筛选表格
    const handleSelect = (res: ClassList): void => {
      if (res) {
        classQuery.value = res.id;
      } else {
        classQuery.value = "";
      }
      getInfantList();
    };

    // 筛选下拉框筛选
    const handleSelectFilter = (res: ClassList): void => {
      if (res) {
        settleApp.value = res.value;
      } else {
        settleApp.value = "";
      }
      getInfantList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getInfantList();
    };

    // 输入框边输边查询
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          getInfantList();
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
      getInfantList();
    };

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getInfantList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getInfantList();
    };

    // 通知更新图表数据
    const emitUpdateChartData = (): void => {
      bus.$emit("updateInfantNumData", true); // 通知更新幼儿分布数据
      bus.$emit("updateInfantLineData", true); // 通知更新幼儿数量趋势数据
    };

    onMounted(() => {
      // 更新表格
      bus.$on("editInfantComplete", (res: boolean) => {
        if (res) {
          getInfantList();
          emitUpdateChartData();
        }
      });
    });

    onUnmounted(() => {
      bus.$off("editInfantComplete");
    });

    return {
      changeTopType,
      handleSelect,
      handleSelectFilter,
      handleSearchInfo,
      handleSelectDate,
      atSchoolTopHandleList,
      handleLogoutSure,
      logoutIdentityCom,
      importUser,
      changeClassCom,
      editInfantCom,
      isEmptyDataFlag,
      checkIsEmptyData,
      classList,
      tableData,
      checkBoxChange,
      logoutIdentityIndex,
      staticData,
      currentType,
      route,
      searchInfo,
      getInfantList,
      changeTabStatus,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      totalNum,
      classQuery,
      loading,
      handleDelete,
      handleUpload,
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

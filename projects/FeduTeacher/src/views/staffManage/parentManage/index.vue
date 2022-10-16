<template>
  <div class="wrap">
    <openMonitoring ref="openMonCom"></openMonitoring>
    <div class="top-title">
      <span>{{ route.name }}</span>
    </div>
    <ui-card class="top-charts-box">
      <div class="left-map">
        <ChartsTitle title="家长分布" tips="现有家长的统计"></ChartsTitle>
        <PeopleNumChart></PeopleNumChart>
      </div>
      <div class="right-map">
        <PeopleLineChart></PeopleLineChart>
      </div>
    </ui-card>
    <ui-card>
      <span class="table-title">现有家长</span>
      <div class="top-handle-box">
        <div class="left-box">
          <SelectPostOrClass
            title="班级"
            placeholder="全部班级"
            width="140"
            :list="classList"
            @handleSelect="handleSelect"
          ></SelectPostOrClass>
          <ui-input
            maxlength="40"
            style="width: 240px; margin-bottom: 15px"
            v-model="infantName"
            placeholder="输入幼儿姓名"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
          <ui-input
            maxlength="11"
            style="width: 240px; margin-bottom: 15px"
            v-model="mobile"
            placeholder="输入手机号"
            icon="icon-a-101"
            @keydown.enter="handleSearchInfo"
            @iconClick="handleSearchInfo"
          ></ui-input>
        </div>
        <!-- <div class="right-box">
          <ul>
            <li v-for="(item, index) in topHandleList" :key="index">
              <ui-button type="default" @click="item.onClick">{{
                item.name
              }}</ui-button>
              <div
                v-if="
                  (isEmptyDataFlag.isOpenMonEmptyData &&
                    item.name === '开通监控') ||
                  (isEmptyDataFlag.isCloseMonEmptyData &&
                    item.name === '关闭监控')
                "
                class="is-empty-data"
              >
                <span>请至少选择一项</span>
              </div>
            </li>
          </ul>
        </div> -->
      </div>
      <div v-loading="loading">
        <nowParentTable
          :data="tableData"
          @selectChange="checkBoxChange"
        ></nowParentTable>
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
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
} from "vue";
import SelectPostOrClass from "@/components/SelectPostOrClass.vue";
import nowParentTable from "./components/nowParentTable.vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import ChartsTitle from "@/components/ChartsTitle.vue";
import PeopleNumChart from "./components/PeopleNumChart.vue";
import { throttle } from "@/utils/common";
import PeopleLineChart from "./components/PeopleLineChart.vue";
import bus from "@/Layout/bus";
import Message from "@/themes/message";
import { IsEmptyDataFlag, ClassList, OnCamera, RowInfo } from "./index";
import openMonitoring from "./components/OpenMonitoring.vue";
import { getList } from "@/api/parentManage";
import { onCamera } from "@/api/parentManage";

export default defineComponent({
  components: {
    SelectPostOrClass,
    nowParentTable,
    ChartsTitle,
    PeopleNumChart,
    PeopleLineChart,
    openMonitoring,
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
    const openMonCom = ref(null);

    let checkRowInfo = ref([] as Array<RowInfo>); // 已勾选的行信息
    const tableData = ref([] as Array<any>); // 表格数据

    const currentPage = ref(1); // 当前页码
    const pageSize = ref(20); //每页展示条数
    const totalNum = ref(0); // 表格总条数

    const infantName = ref(""); //幼儿姓名
    const mobile = ref(""); //手机号
    const classQuery = ref(""); // 班级筛选值

    // 获取表格内容
    const getParentList = async (): Promise<void> => {
      loading.value = true;
      const { code, data } = await getList(
        currentPage.value,
        pageSize.value,
        Object.assign(
          {},
          {
            clazzId: classQuery.value,
            stuName: infantName.value,
            mobile: mobile.value,
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
    getParentList();

    // 表格勾选事件
    const checkBoxChange = (res: Array<RowInfo>): void => {
      checkRowInfo.value = res;
    };

    let isEmptyDataFlag: IsEmptyDataFlag = reactive({
      isOpenMonEmptyData: false,
      isCloseMonEmptyData: false,
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

    // 现有家长顶部右边操作按钮
    const topHandleList = ref([
      {
        name: "开通监控",
        onClick: (): void => {
          if (checkRowInfo.value.length === 0) {
            checkIsEmptyData("isOpenMonEmptyData");
          } else {
            (openMonCom.value as any).handleOpen(checkRowInfo.value);
          }
        },
      },
      {
        name: "关闭监控",
        onClick: (): void => {
          if (checkRowInfo.value.length === 0) {
            checkIsEmptyData("isCloseMonEmptyData");
          } else {
            handleCloseMon();
          }
        },
      },
    ]);

    // 关闭监控操作
    const handleCloseMon = async (): Promise<void> => {
      let arr: Array<any> = [];
      checkRowInfo.value.forEach((item) => {
        let obj = {
          cameraStatus: false,
          expireTime: null,
          userId: item.userId,
        };
        arr.push(obj);
      });
      const { code } = await onCamera(arr);
      if (+code === 0) {
        Message.success("关闭成功");
        bus.$emit("editParentComplete", true); // 通知更新表格
      }
    };

    // 班级筛选表格
    const handleSelect = (res: ClassList): void => {
      if (res) {
        classQuery.value = res.id;
      } else {
        classQuery.value = "";
      }
      getParentList();
    };

    // 输入框回车/手动搜索
    const handleSearchInfo = (): void => {
      getParentList();
    };

    // 幼儿姓名边输边查询
    watch(
      () => infantName.value,
      () => {
        throttle(() => {
          getParentList();
        }, 500);
      }
    );

    // 手机号边输边查询
    watch(
      () => mobile.value,
      () => {
        throttle(() => {
          getParentList();
        }, 500);
      }
    );

    // 切换每页展示条数
    const handleSizeChange = (res: number): void => {
      pageSize.value = res;
      getParentList();
    };

    // 翻页
    const handleCurrentChange = (res: number): void => {
      currentPage.value = res;
      getParentList();
    };

    // 通知更新图表数据
    const emitUpdateChartData = (): void => {
      bus.$emit("updateParentNumData", true); // 通知更新家长分布数据
      bus.$emit("updateParentLineData", true); // 通知更新家长数量趋势数据
    };

    onMounted(() => {
      // 更新表格
      bus.$on("editParentComplete", (res: boolean) => {
        if (res) {
          getParentList();
          emitUpdateChartData();
        }
      });
    });

    onUnmounted(() => {
      bus.$off("editParentComplete");
    });

    return {
      handleSearchInfo,
      topHandleList,
      pageSize,
      tableData,
      checkBoxChange,
      handleSelect,
      isEmptyDataFlag,
      checkIsEmptyData,
      getParentList,
      handleSizeChange,
      handleCurrentChange,
      classList,
      currentPage,
      totalNum,
      route,
      infantName,
      mobile,
      loading,
      openMonCom,
    };
  },
});
</script>

<style lang="less" scoped>
.wrap {
  padding: 24px 40px;
  box-sizing: border-box;

  .table-title {
    font-size: 20px;
    color: #222222;
  }

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

          .is-empty-data {
            position: absolute;
            top: -60px;
            left: -16px;
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

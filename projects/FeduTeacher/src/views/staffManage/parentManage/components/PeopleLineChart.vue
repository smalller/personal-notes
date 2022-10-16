<template>
  <div class="teach-line-chart-box">
    <div class="top-title">
      <ChartsTitle title="家长数量趋势"></ChartsTitle>
      <ul>
        <li>
          <ui-button
            @click="handleChangeDate(1)"
            :type="typeIndex === 1 ? 'text-primary' : 'text'"
            >月度</ui-button
          >
        </li>
        <li>
          <ui-button
            @click="handleChangeDate(2)"
            :type="typeIndex === 2 ? 'text-primary' : 'text'"
            >年度</ui-button
          >
        </li>
        <li>
          <YearsSelect
            :option="yearsList"
            :highLight="highLight"
            @selectItem="selectYearsItem"
          ></YearsSelect>
        </li>
      </ul>
    </div>
    <div class="line-map" v-loading="loading">
      <EmptyData v-if="mapData.date.length === 0 && !loading"></EmptyData>
      <ui-echarts-line v-else :option="mapData"></ui-echarts-line>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ChartsTitle from "@/components/ChartsTitle.vue";
import { getMonthReport, getYearReport } from "@/api/parentManage";
import YearsSelect from "@/components/YearsSelect.vue";
import EmptyData from "@/components/EmptyData.vue";
import micell from "micell";
import bus from "@/Layout/bus";
import {
  MapData,
  YearsListItem,
  createYears,
  monthDateArg,
} from "@/utils/common";
import { DataItem } from "../index";

export default defineComponent({
  components: {
    ChartsTitle,
    YearsSelect,
    EmptyData,
  },
  setup() {
    let mapData: MapData = reactive({
      date: [],
      data: [
        {
          name: "总家长数", //单项名称
          color: "#4D70FF", //颜色
          num: [], //数据
        },
        {
          name: "开通监控人数",
          color: "#FFB73A",
          num: [],
        },
        {
          name: "关闭监控人数",
          color: "#9AADBB",
          num: [],
        },
      ],
    });

    const loading = ref(true);
    const yearsList = createYears(); // 近五年选项
    const highLight = ref(true); //选择年份是否高亮
    const typeIndex = ref(1); //日期筛选类型索引：1-月度，2-年度，3-年份
    const selectedYear = ref(-1 as string | number); //当前筛选的年份

    // 切换筛选条件
    const handleChangeDate = (index: number) => {
      typeIndex.value = index;
      highLight.value = false;
      if (typeIndex.value === 1) {
        // 筛选月度
        getMonthReportData(monthDateArg().start, monthDateArg().end);
      } else if (typeIndex.value === 2) {
        // 筛选年度
        getMonthReportData();
      }
    };

    // 切换年份筛选数据
    const selectYearsItem = (res: YearsListItem) => {
      selectedYear.value = res.value;
      typeIndex.value = 3;
      highLight.value = true;
      getMonthReportData(`${res.value}-01`, `${res.value}-12`);
    };

    //筛选月度/年份
    async function getMonthReportData(
      start?: string,
      end?: string
    ): Promise<void>;

    // 筛选年度
    // eslint-disable-next-line no-redeclare
    async function getMonthReportData(): Promise<void>;

    // 获取统计图数据
    // eslint-disable-next-line no-redeclare
    async function getMonthReportData(start?: string, end?: string) {
      loading.value = true;
      if (start && end) {
        // 筛选月度/年份数据
        const { code, data } = await getMonthReport(start, end);
        if (+code === 0) {
          changeData(data);
        }
      } else {
        // 筛选年度数据
        const { code, data } = await getYearReport();
        if (+code === 0) {
          changeData(data);
        }
      }
      loading.value = false;
    }
    getMonthReportData(monthDateArg().start, monthDateArg().end);

    // 初始化数据
    const initMapData = (): void => {
      mapData.date = [];
      mapData.data.forEach((item) => {
        item.num = [];
      });
    };

    // 如果有数据就传进去，没有就默认传0
    function pushData(item: DataItem | number) {
      if (typeof item === "number") {
        mapData.data[0].num.push(0);
        mapData.data[1].num.push(0);
        mapData.data[2].num.push(0);
      } else {
        mapData.data[0].num.push(item.allNum);
        mapData.data[1].num.push(item.onNum);
        mapData.data[2].num.push(item.offNum);
      }
    }

    // 转换数据格式
    const changeData = (data: Array<DataItem>) => {
      initMapData();
      const arr = data;

      if (+typeIndex.value === 1) {
        for (let i = 1; i <= new Date().getMonth() + 1; i++) {
          let date = micell.date.format(new Date("2021-" + i), "YYYY-MM");
          mapData.date.push(date);
          const item = arr?.find((item: DataItem) => item.reportDate === date);
          if (item) {
            pushData(item);
          } else {
            pushData(0);
          }
        }
      }

      if (+typeIndex.value === 2) {
        for (
          let i = new Date().getFullYear();
          i > new Date().getFullYear() - 6;
          i--
        ) {
          mapData.date.unshift(i.toString());
          const item = arr?.find((item: DataItem) => +item.reportDate === +i);
          if (item) {
            mapData.data[0].num.unshift(item.allNum);
            mapData.data[1].num.unshift(item.onNum);
            mapData.data[2].num.unshift(item.offNum);
          } else {
            mapData.data[0].num.unshift(0);
            mapData.data[1].num.unshift(0);
            mapData.data[2].num.unshift(0);
          }
        }
      }

      if (+typeIndex.value === 3) {
        for (let i = 1; i <= 12; i++) {
          let date = micell.date.format(
            new Date(selectedYear.value + "-" + i),
            "YYYY-MM"
          );
          mapData.date.push(date);
          const item = arr?.find((item: DataItem) => item.reportDate === date);
          if (item) {
            pushData(item);
          } else {
            pushData(0);
          }
        }
      }
    };

    onMounted(() => {
      // 更新图表数据
      bus.$on("updateParentLineData", (res: boolean) => {
        if (res) {
          // 默认展示月度数据
          typeIndex.value = 1;
          highLight.value = false;
          getMonthReportData(monthDateArg().start, monthDateArg().end);
        }
      });
    });

    onUnmounted(() => {
      bus.$off("updateParentLineData");
    });

    return {
      mapData,
      typeIndex,
      handleChangeDate,
      yearsList,
      selectYearsItem,
      highLight,
      createYears,
      monthDateArg,
      loading,
    };
  },
});
</script>
<style lang="less" scoped>
.teach-line-chart-box {
  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    > ul {
      display: flex;
      align-items: center;

      > li {
        margin-left: 24px;
      }

      > li:last-child {
        margin-left: 4px;
      }
    }
  }

  .line-map {
    height: 260px;
    // min-width: 800px;
  }
}
</style>

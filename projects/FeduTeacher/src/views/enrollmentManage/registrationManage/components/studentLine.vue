<template>
  <div class="teach-line-chart-box">
    <div class="top-title">
      <ChartsTitle title="数量趋势" tips="现有数量趋势"></ChartsTitle>

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
    <div class="line-map">
      <ui-echarts-line
        v-if="mapData.date.length !== 0"
        :option="mapData"
      ></ui-echarts-line>
      <p style="margin-top: 20px" v-else>暂无数量趋势</p>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, reactive, onMounted, onUnmounted } from "vue";
import ChartsTitle from "@/components/ChartsTitle.vue";
import YearsSelect from "@/components/YearsSelect.vue";
import { getClassListLine } from "@/api/classManage";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import dayjs from "dayjs";
import {
  MapData,
  YearsListItem,
  createYears,
  monthDateArg,
} from "@/utils/common";

export default defineComponent({
  components: {
    ChartsTitle,
    YearsSelect,
  },
  setup() {
    const $store = useStore();
    let mapData: MapData = reactive({
      date: [],
      data: [
        {
          name: "转发次数",
          color: "#4D70FF",
          index: 0,
          num: [],
        },
        {
          name: "浏览人数",
          color: "#FFB73B",
          index: 4,
          num: [],
        },
        {
          name: "报名人数",
          color: "#FF852A",
          index: 4,
          num: [],
        },
        {
          name: "回访人数",
          color: "#7673C1",
          index: 4,
          num: [],
        },
        {
          name: "成交人数",
          color: "#42C7C6",
          index: 4,
          num: [],
        },
      ],
    });

    const yearsList = createYears(); // 近五年选项
    const highLight = ref(true); //选择年份是否高亮
    const typeIndex = ref(1); //日期筛选类型索引：1-月度，2-年度，3-年份
    const monthInfo = ref(0); //月份
    const yearInfo = ref(0); //年份
    const gradeList = ref($store.state.commonData.gradeList); // 年级列表
    const date = dayjs().toDate();
    monthInfo.value = +date.getMonth() + 1;
    yearInfo.value = +date.getFullYear();
    const handleChangeDate = (index: number) => {
      typeIndex.value = index;
      highLight.value = false;
      if (typeIndex.value === 1) {
        // 筛选月度
        getLineReportData(monthInfo.value, yearInfo.value);
      } else if (typeIndex.value === 2) {
        initMapData();
        // 筛选年度
        getLineReportData(0, yearInfo.value);
      }
    };

    // 切换年份筛选数据
    const selectYearsItem = (res: YearsListItem) => {
      initMapData();
      typeIndex.value = 3;
      highLight.value = true;
      yearInfo.value = +res.value;
      getLineReportData(+monthInfo.value, yearInfo.value);
    };

    //筛选月度/年份
    async function getLineReportData(
      month?: undefined | number,
      year?: number | string
    ): Promise<void>;

    // 筛选年度
    // eslint-disable-next-line no-redeclare
    async function getLineReportData(): Promise<void>;

    // 获取统计图数据
    // eslint-disable-next-line no-redeclare
    async function getLineReportData(
      month?: undefined | number,
      year?: string | number
    ) {
      if (month && year) {
        // 筛选月度/年份数据
        let { code, data } = await getClassListLine(month, year);
        if (+code === 0) {
          changeData(data);
        }
      } else {
        let date = +dayjs().toDate().getFullYear();
        // 筛选年度数据
        let { code, data } = await getClassListLine("", date);
        if (+code === 0) {
          console.log(data);
          for (
            let i = dayjs().toDate().getFullYear();
            i > dayjs().toDate().getFullYear() - 6;
            i--
          ) {
            mapData.date.unshift(i.toString());
            console.log(mapData);
            const item = data?.find((item: any) => +item.year === +i);
            if (item) {
              if (item.list.length) {
                mapData.data[0].num.push(item.total);
                for (let i = 0; i < item.list.length; i++) {
                  for (let k = 1; k < mapData.data.length; k++) {
                    let code = mapData.data[k].index;
                    if (+item.list[i].grade === code) {
                      mapData.data[k].num.push(item.list[i].clazzNum);
                    }
                  }
                }
              }
            } else {
              for (let i = 0; i < gradeList.value.length + 1; i++) {
                mapData.data[i].num.unshift(0);
              }
            }
          }
        }
      }
    }
    // const gradeList = $store.state.commonData.gradeList; // 年级列表
    getLineReportData(+monthInfo.value, yearInfo.value);
    // 初始化数据
    const initMapData = (): void => {
      mapData.date = [];
      mapData.data.forEach((item) => {
        item.num = [];
      });
    };

    // 转换数据格式
    const changeData = (data: Array<any>) => {
      initMapData();
      let index = 0;
      data.forEach((item) => {
        let date = "";
        if (item) {
          if (typeIndex.value === 1 || typeIndex.value === 3) {
            date =
              +item.month > 9
                ? item.year + "-" + item.month
                : item.year + "-0" + item.month;
          } else {
            date = item.year;
          }
          mapData.date.push(date);
          mapData.data[0].num.push(item.total);
          if (item.list.length) {
            for (let i = 0; i < item.list.length; i++) {
              for (let k = 1; k < mapData.data.length; k++) {
                let code = mapData.data[k].index;
                if (+item.list[i].grade === code) {
                  mapData.data[k].num.push(item.list[i].clazzNum);
                }
              }
            }
          }
          mapData.data.forEach((item) => {
            if (!item.num[index]) {
              item.num[index] = 0;
            }
          });
          index++;
        }
      });
    };
    onMounted(() => {
      // 更新图表数据
      bus.$on("editClass", (res: boolean) => {
        if (res) {
          // 默认展示月度数据
          typeIndex.value = 1;
          highLight.value = false;
          getLineReportData(monthInfo.value, yearInfo.value);
        }
      });
    });

    onUnmounted(() => {
      bus.$off("editClass");
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
    height: 285px;
    // min-width: 800px;
  }
}
</style>

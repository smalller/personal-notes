<template>
  <div class="teach-line-chart-box">
    <div class="top-title">
      <ChartsTitle title="数量趋势"></ChartsTitle>
      <!-- <ul>
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
      </ul> -->
    </div>
    <div class="line-map">
      <ui-echarts-line
        v-if="mapData.date.length !== 0"
        :option="mapData"
      ></ui-echarts-line>
      <p style="margin-top: 20px" v-else>暂无班级数量趋势</p>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  onMounted,
  onUnmounted,
  computed,
  watch,
} from "vue";
import ChartsTitle from "@/components/ChartsTitle.vue";
import { getClassListLine } from "@/api/classManage";
import { getStudentLine } from "@/api/enrollmentManage";
import { useStore } from "vuex";
import bus from "@/Layout/bus";
import dayjs from "dayjs";
import { MapData, createYears, monthDateArg } from "@/utils/common";

interface dataItem {
  signSumVos: [
    {
      month: string;
      year: string;
      sum: string;
    }
  ];
  admissionsPosterViewsVos: [
    {
      month: string;
      year: string;
      sum: string;
    }
  ];
}
export default defineComponent({
  props: {
    option: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  components: {
    ChartsTitle,
  },
  setup(props) {
    console.log(props.option, "2222222");
    const selectId = computed(() => props.option as string);
    const $store = useStore();
    let mapData: MapData = reactive({
      date: [],
      data: [
        {
          name: "浏览次数", //单项名称
          color: "#4D70FF", //颜色
          index: 8,
          num: [], //数据
        },
        {
          name: "报名人数",
          color: "#FF852A",
          index: 3,
          num: [],
        },
      ],
    });

    const highLight = ref(true); //选择年份是否高亮
    const typeIndex = ref(1); //日期筛选类型索引：1-月度，2-年度，3-年份
    const monthInfo = ref(0); //月份
    const yearInfo = ref(0); //年份
    const gradeList = ref($store.state.commonData.gradeList); // 年级列表
    const date = dayjs().toDate();
    monthInfo.value = +date.getMonth() + 1;
    yearInfo.value = +date.getFullYear();

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
    async function getLineReportData() {
      let { code, data } = await getStudentLine(selectId.value);
      if (+code === 0) {
        changeData(data);
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
    const changeData = (data: dataItem) => {
      initMapData();
      for (let i = 1; i < monthInfo.value + 1; i++) {
        let date =
          +i > 9 ? yearInfo.value + "-" + i : yearInfo.value + "-0" + i;
        mapData.date.push(date);
        mapData.data[0].num.push(0);
        mapData.data[1].num.push(0);
      }
      for (let k = 0; k < data.admissionsPosterViewsVos.length; k++) {
        mapData.data[0].num[+data.admissionsPosterViewsVos[k].month - 1] =
          data.admissionsPosterViewsVos[k].sum;
      }
      for (let m = 0; m < data.signSumVos.length; m++) {
        mapData.data[1].num[+data.signSumVos[m].month - 1] =
          data.signSumVos[m].sum;
      }
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
      watch(
        selectId,
        () => {
          getLineReportData();
        },
        { immediate: true, deep: true }
      );
    });

    onUnmounted(() => {
      bus.$off("editClass");
    });
    return {
      mapData,
      typeIndex,
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
    height: 260px;
    // min-width: 800px;
  }
}
</style>

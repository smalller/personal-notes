<template>
  <ScreenBox class="screenOpeningRate" :headShow="false">
    <div class="childBox">
      <div class="childItem">
        <div class="title">幼儿出勤率</div>
        <div class="chartBox">
          <div ref="chart1"></div>
          <div class="charItem">
            <h1 class="percentage-value">
              {{ Math.floor((totalUser - userNoNum) / totalUser) * 100 }}%
            </h1>
            <span class="percentage-label">今天</span>
          </div>
        </div>
        <div class="info">
          <p>
            应出勤：<span>{{ totalUser }} 人</span>
          </p>
          <p>
            已出勤：<span>{{ totalUser - userNoNum }} 人</span>
          </p>
          <p>
            未出勤：<span>{{ userNoNum }} 人</span>
          </p>
        </div>
      </div>
      <!--      <div class="childItem">-->
      <!--        <div class="title">老师出勤率</div>-->
      <!--        <div class="chartBox">-->
      <!--          <div ref="chart2"></div>-->
      <!--          <div class="charItem">-->
      <!--            <h1 class="percentage-value">{{ 40 }}%</h1>-->
      <!--            <span class="percentage-label">昨天</span>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <div class="info">-->
      <!--          <p>应出勤：<span>169 人</span></p>-->
      <!--          <p>已出勤：<span>120 人</span></p>-->
      <!--          <p>未出勤：<span>20 人</span></p>-->
      <!--        </div>-->
      <!--      </div>-->
      <div class="childItem">
        <div class="title">监控开启率</div>
        <!-- <el-progress
          class="chartBox"
          indeterminate
          :width="104"
          color="#DC8F02"
          :stroke-width="18"
          type="circle"
          :percentage="monthNum"
        >
          <template #default="{ percentage }">
            <h1 class="percentage-value">{{ percentage }}%</h1>
            <span class="percentage-label">本月</span>
          </template>
        </el-progress> -->
        <div class="chartBox">
          <div ref="chart3"></div>
          <div class="charItem">
            <h1 class="percentage-value">{{ videoNum.num }}</h1>
            <span class="percentage-label">今天</span>
          </div>
        </div>
        <div class="info">
          <p>
            总监控: <span>{{ videoNum.totalNum }} 个</span>
          </p>
          <p>
            已开启：<span>{{ videoNum.onNum }} 个</span>
          </p>
          <p>
            未开启：<span>{{ videoNum.offNum }} 个</span>
          </p>
        </div>
      </div>
    </div>
  </ScreenBox>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import ScreenBox from "./screenBox.vue";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { getStatisticsNow } from "@/api/parentManage";
import { EChartsExtension } from "echarts/types/src/extension";
import { getSumClazzAttByDay } from "@/api/largeScreen";
import { useStore } from "vuex";
import dayjs from "dayjs";

echarts.use([
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>;

export default defineComponent({
  name: "screenOpeningRate",
  setup() {
    const $store = useStore();
    const classList = computed(() => $store.state.commonData.classList);
    const dayNum = ref(0);
    const yesterdayNum = ref(0);
    const monthNum = ref(0);
    const chart1 = ref(null);
    const chart2 = ref(null);
    const chart3 = ref(null);
    const userNoNum = ref(0);
    const totalUser = ref(0);
    const videoNum = reactive({
      totalNum: 0,
      onNum: 0,
      offNum: 0,
      num: "",
    });
    const opt: EChartsOption = {
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
        position: function (p) {
          //其中p为当前鼠标的位置
          return [p[0] + 10, p[1] - 10];
        },
      },
      series: [
        {
          type: "pie",
          radius: ["60%", "90%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          color: ["#065aab", "#06B4AB"],
          labelLine: {
            show: false,
          },
        },
      ],
    };
    interface Item {
      value: number;
      name: string;
    }

    const createChart = (
      el: HTMLElement,
      data: Item[],
      title: string,
      colors?: string[]
    ): echarts.ECharts => {
      const options: EChartsOption = Object.assign({}, opt);
      if (options.series && Array.isArray(options.series)) {
        options.series[0].data = data;
        options.series[0].name = title;
        if (colors) {
          options.series[0].color = colors;
        }
      }

      const chart = echarts.init(el);
      chart.setOption(options);
      return chart;
    };
    let myChart1: echarts.ECharts;
    let myChart2: echarts.ECharts;
    let myChart3: echarts.ECharts;
    onMounted(() => {
      dayNum.value = 50;
      yesterdayNum.value = 70;
      monthNum.value = 40;

      // myChart2 = createChart(
      //   chart2.value as unknown as HTMLElement,
      //   [
      //     { value: 2, name: "已出勤" },
      //     { value: 10, name: "未出勤" },
      //   ],
      //   "老师出勤率"
      // );
      // myChart2.resize();

      window.addEventListener("resize", () => {
        myChart1.resize();
        // myChart2.resize();
        myChart3.resize();
      });
    });

    //查询设备开启率
    const getDevicesNum = () => {
      getStatisticsNow().then((res) => {
        if (+res.code === 0) {
          videoNum.totalNum = res.data[0].totalNum;
          videoNum.onNum = res.data[0].onNum;
          videoNum.offNum = res.data[1].offNum;
          videoNum.num = res.data[0].proportion;
          myChart3 = createChart(
            chart3.value as unknown as HTMLElement,
            [
              { value: res.data[0].onNum, name: "已开启" },
              { value: res.data[1].offNum, name: "未开启" },
            ],
            "监控开启率",
            ["#065aab", "#DC8F02"]
          );
          myChart3.resize();
        }
      });
    };
    getDevicesNum();

    const getStudentAttByDay = () => {
      getSumClazzAttByDay({
        clazzIds: classList.value.map((item: any) => item.id).join(","),
        attDay: dayjs().format("YYYY-MM-DD"),
      }).then((res) => {
        if (+res.code === 0) {
          res.data.forEach((item: any) => {
            userNoNum.value += item.noShowNum;
            totalUser.value += item.classTotal;
          });
          myChart1 = createChart(
            chart1.value as unknown as HTMLElement,
            [
              { value: totalUser.value - userNoNum.value, name: "已出勤" },
              { value: userNoNum.value, name: "未出勤" },
            ],
            "幼儿出勤率"
          );
          myChart1.resize();
        }
      });
    };
    getStudentAttByDay();
    return {
      dayNum,
      yesterdayNum,
      monthNum,
      chart1,
      chart2,
      chart3,
      videoNum,
      totalUser,
      userNoNum,
    };
  },
  components: { ScreenBox },
});
</script>

<style scoped lang="less">
.screenOpeningRate {
  //max-width: 1110px;

  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    width: 100%;
    font-size: 0.15rem;
    font-weight: 400;
    text-align: center;
    color: #ffffff;
  }
  .childBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    .childItem {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .chartBox {
    margin-top: 14px;
    width: 104px;
    height: 104px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    > div {
      &:first-child {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        // z-index: 1;
      }
      &.charItem {
        position: absolute;
        height: 0.46rem;
        // z-index: 2;
        display: flex;
        flex-direction: column;
        h1 {
          font-size: 0.21rem;
          color: #fff;
        }
        span {
          text-align: center;
          color: #24a9c2;
          font-size: 0.13rem;
        }
      }
    }
  }
  .info {
    margin-top: 0.25rem;
    p {
      padding-bottom: 8px;
      font-size: 0.1rem;
      font-weight: 400;
      color: #24a9c2;
      span {
        color: #24a9c2;
        font-weight: bold;
      }
    }
  }
}
</style>

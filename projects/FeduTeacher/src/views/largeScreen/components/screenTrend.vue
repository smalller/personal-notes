<template>
  <screen-box class="screenTrend" title="人员增长趋势">
    <div class="screenChart" ref="screenChart"></div>
  </screen-box>
</template>

<script lang="ts">
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import { LineChart, LineSeriesOption } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { defineComponent, onMounted, reactive, ref } from "vue";
import ScreenBox from "@/views/largeScreen/components/screenBox.vue";
import dayjs from "dayjs";
import micell from "micell";
import { getHomePageReport } from "@/api/home";
export default defineComponent({
  name: "screenTrend",
  components: { ScreenBox },
  setup() {
    type EChartsOption = echarts.ComposeOption<
      | TitleComponentOption
      | ToolboxComponentOption
      | TooltipComponentOption
      | GridComponentOption
      | LegendComponentOption
      | LineSeriesOption
    >;
    const screenChart = ref(null);
    let EChart: echarts.ECharts;
    echarts.use([
      TitleComponent,
      ToolboxComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      LineChart,
      CanvasRenderer,
      UniversalTransition,
    ]);
    let studentNum: number[] = [];
    let teacherNum: number[] = [];
    let dateNum: string[] = [];
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            color: "#dddc6b",
          },
        },
      },
      legend: {
        top: "0%",
        data: ["幼儿", "教职工"],
        textStyle: {
          color: "rgba(255,255,255,.5)",
          fontSize: "12",
        },
      },
      grid: {
        left: "10",
        top: "30",
        right: "10",
        bottom: "10",
        containLabel: true,
      },

      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12,
            },
          },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.2)",
            },
          },

          data: dateNum,
        },
        {
          axisPointer: { show: false },
          axisLine: { show: false },
          position: "bottom",
          offset: 20,
        },
      ],

      yAxis: [
        {
          type: "value",
          axisTick: { show: false },
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
          axisLabel: {
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: 12,
            },
          },

          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
            },
          },
        },
      ],
      series: [
        {
          name: "教职工",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#0184d5",
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(1, 132, 213, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(1, 132, 213, 0.1)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
          },
          itemStyle: {
            normal: {
              color: "#0184d5",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
          },
          data: studentNum,
        },
        {
          name: "幼儿",
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              color: "#00d887",
              width: 2,
            },
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: "rgba(0, 216, 135, 0.4)",
                  },
                  {
                    offset: 0.8,
                    color: "rgba(0, 216, 135, 0.1)",
                  },
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
            },
          },
          itemStyle: {
            normal: {
              color: "#00d887",
              borderColor: "rgba(221, 220, 107, .1)",
              borderWidth: 12,
            },
          },
          data: teacherNum,
        },
      ],
    };

    const initMapData = () => {
      option.series[0].data = [];
      option.series[1].data = [];
    };
    interface PersonnelTrends {
      reportType?: string;
      startDay?: string;
      endDay?: string;
    }
    const queryForm = () => {
      initMapData();
      const params: PersonnelTrends = {};
      params.startDay = `${dayjs().toDate().getFullYear() - 1}-${dayjs().format(
        "MM-DD"
      )}`;
      params.endDay = dayjs().format("YYYY-MM-DD");

      getHomePageReport(params).then((res) => {
        if (res.code === 0) {
          const arr = res.data;
          for (let i = 1; i <= dayjs().toDate().getMonth() + 1; i++) {
            let date = dayjs(`${dayjs().toDate().getFullYear()}-${i}`).format(
              "YYYY-MM"
            );
            dateNum.push(date);
            const item = arr?.find((item: any) => item.reportDate === date);
            if (item) {
              // mapData.data[0].num.push(item.claNum);
              option.series[0].data.push(item.empNum);
              option.series[1].data.push(item.stuNum);
            } else {
              // mapData.data[0].num.push(0);
              option.series[0].data.push(0);
              option.series[1].data.push(0);
            }
          }
          const el = screenChart.value as never as HTMLElement;
          EChart = echarts.init(el);
          option && EChart.setOption(option);
          setTimeout(() => {
            EChart.resize();
          }, 100);
        }
      });
    };
    queryForm();

    onMounted(() => {
      window.addEventListener("resize", () => {
        EChart.resize();
      });
    });
    return { screenChart };
  },
});
</script>

<style scoped lang="less">
.screenTrend {
  // height: 28.5vh;
  width: 100% !important;
  .screenChart {
    width: 100%;
    height: 100%;
  }
}
</style>

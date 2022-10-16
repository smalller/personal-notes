<template>
  <screen-box class="screenActive" title="班级活跃">
    <div class="screenChartBox">
      <div class="screenChart" ref="screenChart"></div>
    </div>
  </screen-box>
</template>

<script lang="ts">
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
} from "echarts/components";
import { BarChart, BarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useStore } from "vuex";
echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

type EChartsOption = echarts.ComposeOption<
  TooltipComponentOption | GridComponentOption | BarSeriesOption
>;
import { computed, defineComponent, onMounted, ref } from "vue";
import ScreenBox from "@/views/largeScreen/components/screenBox.vue";
export default defineComponent({
  name: "screenActive",
  components: { ScreenBox },
  setup() {
    const $store = useStore();
    const screenChart = ref(null);
    let EChart: echarts.ECharts;
    echarts.use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);
    const classList = computed(() => $store.state.commonData.classList);
    console.log(classList.value);
    const classNameList = classList.value.map((item: any) => item.name);
    const activeList = classList.value.map((item: any) => item.active);
    const option = {
      //  backgroundColor: '#00265f',
      // tooltip: {
      //   trigger: "axis",
      //   axisPointer: {
      //     type: "shadow",
      //   },
      // },
      tooltip: {
        trigger: "axis",
        formatter: "{b}: {c} ",
        position: function (p: any[]) {
          //其中p为当前鼠标的位置
          return [p[0] + 10, p[1] - 10];
        },
      },
      grid: {
        left: "0%",
        top: "20px",
        right: "0%",
        bottom: "4%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: classNameList,
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 1,
              type: "solid",
            },
          },

          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
            // rotate:50,
            show: true,
            splitNumber: 15,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            //formatter: '{value} %'
            show: true,
            textStyle: {
              color: "rgba(255,255,255,.6)",
              fontSize: "12",
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: "rgba(255,255,255,.1	)",
              width: 1,
              type: "solid",
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
          type: "bar",
          data: activeList,
          barWidth: "35%", //柱子宽度
          // barGap: 1, //柱子之间间距
          itemStyle: {
            normal: {
              color: "#2f89cf",
              opacity: 1,
              barBorderRadius: 5,
            },
          },
        },
      ],
    };
    onMounted(() => {
      $store.dispatch("getClassList");
      const el = screenChart.value as never as HTMLElement;
      const leftBox = document
        .querySelector(".largeScreenBody")
        ?.querySelector(".left") as HTMLElement;
      EChart = echarts.init(el);
      option && EChart.setOption(option);
      window.addEventListener("resize", () => {
        EChart.resize();
      });
      setTimeout(() => {
        EChart.resize();
      }, 100);
    });
    return { screenChart };
  },
});
</script>

<style scoped lang="less">
.screenActive {
  display: flex;
  flex-direction: column;
  // height: 2;
  // width: 100% !important;
  .screenChartBox {
    flex: 1;
    position: relative;
  }
  .screenChart {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

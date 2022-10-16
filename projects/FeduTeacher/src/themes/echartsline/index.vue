<template>
  <div class="ui-echarts" style="width: 100%; height: 100%">
    <div ref="echart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script lang="ts">
interface normal {
  color: string;
  borderWidth?: number;
}
interface ItemStyle {
  normal: normal;
}
interface mapData {
  name: string;
  type: string;
  symbol: string; //标记的图形为实心圆
  symbolSize: number; //标记的大小
  itemStyle: ItemStyle;
  lineStyle: normal;
  data?: Array<number>;
}
import {
  defineComponent,
  onMounted,
  nextTick,
  watch,
  reactive,
  ref,
} from "vue";
import * as echarts from "echarts";

export default defineComponent({
  name: "ui-echarts-line",

  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
    echartId: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  setup(props) {
    const echart = ref(null);
    const option = reactive({
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "2%",
        right: "4%",
        bottom: "14%",
        top: "16%",
        containLabel: true,
      },
      legend: {
        data: [] as Array<string>,
        left: "35%",
        top: "90%",
        textStyle: {
          color: "#666666",
        },
        itemWidth: 15,
        itemHeight: 10,
        itemGap: 25,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: [] as Array<string>,
        axisLine: {
          lineStyle: {
            color: "#cdd5e2",
          },
        },
        axisLabel: {
          textStyle: {
            color: "#666666",
          },
        },
      },
      yAxis: {
        type: "value",
        nameTextStyle: {
          color: "#666666",
          fontSize: "14",
        },
        min: 0,
        position: "left",
        splitLine: {
          show: true,
          lineStyle: {
            color: ["rgb(1,155,246,0.3)"], //网格线
            width: 1,
          },
        },
      },
      series: [] as Array<any>,
    });

    const setMapData = (data: any): void => {
      option.legend.data.length = 0;
      option.series.length = 0;
      option.xAxis.data.length = 0;
      const datas: number[] = [];
      for (let item of data.data) {
        let setData: mapData = {
          name: "",
          type: "line",
          symbol: "circle", //标记的图形为实心圆
          symbolSize: 8, //标记的大小
          itemStyle: {
            normal: {
              color: "",
              borderWidth: 4,
            },
          },
          lineStyle: {
            color: "",
          },
          data: datas,
        };
        setData.name = item.name;
        setData.itemStyle.normal.color = item.color;
        setData.lineStyle.color = item.color;
        if (item.num) {
          setData.data = [...item.num];
        }
        if (data.date) {
          option.xAxis.data = [...data.date];
        }
        option.legend.data.push(item.name);
        option.series.push(setData);
      }
    };
    onMounted(() => {
      nextTick(() => {
        // console.log(props.option, "参数");
        setMapData(props.option);
        if (props.option?.data.length > 0) {
          const myEcharts = echarts.init(
            echart.value as unknown as HTMLElement
          );
          window.addEventListener("resize", () => {
            myEcharts.resize();
          });
          myEcharts.clear();
          props.option && myEcharts.setOption(option, true);
          watch(
            props.option,
            () => {
              setMapData(props.option);
              myEcharts.clear();
              option && myEcharts.setOption(option, true);
            },
            { immediate: true, deep: true }
          );
        }
      });
    });

    return {
      echart,
    };
  },
});
</script>

<style lang="less" scoped></style>

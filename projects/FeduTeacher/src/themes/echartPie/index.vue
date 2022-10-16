<template>
  <div class="ui-echarts" style="width: 100%; height: 100%">
    <div ref="chart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script lang="ts">
interface ItemStyle {
  color: string;
}
interface mapData {
  value: number;
  name: string;
  itemStyle: ItemStyle;
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
  name: "ui-echarts-pie",

  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const chart = ref(null);

    const option = reactive({
      title: [
        {
          text: props.option.titleValue,
          x: "center",
          y: "center",
          textStyle: {
            fontWeight: "600",
            color: "#222222",
            fontSize: 40,
          },
        },
        {
          text: props.option.title,
          x: "center",
          y: "55%",
          textStyle: {
            fontWeight: "400",
            color: "#676767",
            fontSize: 18,
          },
        },
      ],
      tooltip: {
        show: !props.option.isHome,
        formatter: function (params: any) {
          return params.name + "：" + params.percent + " %";
        },
      },

      series: {
        name: "circle",
        type: "pie",
        clockWise: true,
        radius: props.option.isHome ? ["68px", "80px"] : ["65px", "100px"],
        itemStyle: {
          normal: {
            label: {
              show: true,
            },
            labelLine: {
              show: true,
            },
          },
        },
        label: {
          normal: {
            show: !props.option.isHome,
            orient: "vertical",
            left: "left",
            formatter: function (parms: any) {
              return (
                parms.data.name +
                "  " +
                parms.data.value +
                (props.option.type ? props.option.type : "个")
              );
            },
          },
        },
        hoverAnimation: true,
        data: [] as Array<any>,
      },
    });

    const setMapData = (data: any): void => {
      for (let item of data.data) {
        let setData: mapData = {
          value: 0,
          name: "",
          itemStyle: {
            color: "",
          },
        };
        setData.name = item.name;
        setData.value = item.value;
        setData.itemStyle.color = item.color;
        option.series.data.push(setData);
      }
    };
    onMounted(() => {
      nextTick(() => {
        if (props.option?.data.length > 0) {
          const myEcharts = echarts.init(chart.value as unknown as HTMLElement);
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

    return { chart };
  },
});
</script>

<style lang="less" scoped></style>

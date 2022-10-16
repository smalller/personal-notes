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
  name: "ui-echarts-bar",

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
    let checkName = reactive({
      name: "",
    });
    const option = reactive({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: props.option.name,
          // axisTick: {
          //   alignWithLabel: true,
          // },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "班级活跃值",
          type: "bar",
          barWidth: "60%",
          data: props.option.data,
          label: {
            normal: {
              show: false,
              lineHeight: 30,
              width: 80,
              color: "#FF7C19",
              height: 30,
              backgroundColor: "#ffffff",
              borderRadius: 5,
              borderColor: "red",
              borderType: "solid",
              position: ["5", "-50"],
              distance: 1,
              formatter: (params: any) => {
                console.log(params);
                if (checkName.name === params.name) {
                  return params.data + "  活跃值";
                }
              },
              rich: {
                d: {
                  color: "#3CDDCF",
                },
                a: {
                  color: "#FF7C19",
                  // align: "center",
                },
                b: {
                  width: 1,
                  height: 0,
                  borderWidth: 1,
                  borderColor: "#234e6c",
                  // align: "left",
                },
              },
            },
          },
          itemStyle: {
            normal: {
              // label: { show: true },
              color: (params: any) => {
                //通过判断选中的名字改变柱子的颜色样式
                if (checkName.name === params.name) {
                  return "#FFB73B";
                } else {
                  return "#4FA8F9";
                }
              },
            },
          },
        },
      ],
    });

    // const setMapData = (data: any) => {
    //   for (let item of data.data) {
    //     let setData: mapData = {
    //       value: 0,
    //       name: "",
    //       itemStyle: {
    //         color: "",
    //       },
    //     };
    //     setData.name = item.name;
    //     setData.value = item.value;
    //     setData.itemStyle.color = item.color;
    //     option.series.data.push(setData);
    //   }
    // };
    onMounted(() => {
      nextTick(() => {
        // setMapData(props.option);
        const myEcharts = echarts.init(chart.value as unknown as HTMLElement);
        window.addEventListener("resize", () => {
          myEcharts.resize();
        });
        myEcharts.clear();
        props.option && myEcharts.setOption(option, true);
        myEcharts.on("click", (params) => {
          console.log(params);
          //点击的柱子的名称
          checkName.name = params.name;
          //柱形图重构
          myEcharts.setOption(option);
        });
        watch(
          () => props.option,
          () => {
            myEcharts.clear();
            option && myEcharts.setOption(option, true);
            myEcharts.on("click", (params) => {
              console.log(params);
              //点击的柱子的名称
              checkName.name = params.name;
              //柱形图重构
              myEcharts.setOption(option);
            });
          }
        );
      });
    });
    return { chart };
  },
});
</script>

<style lang="less" scoped></style>

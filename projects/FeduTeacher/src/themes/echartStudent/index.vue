<template>
  <div class="ui-echarts" style="width: 100%; height: 100%">
    <div ref="echart" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  nextTick,
  watch,
  reactive,
  ref,
} from "vue";
import * as echarts from "echarts";
import "echarts-liquidfill";
import { imgList } from "./index";
export default defineComponent({
  name: "ui-echarts-student",

  props: {
    option: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  setup(props) {
    const echart = ref(null);
    //处理百分数
    const toNum = (data: string) => {
      if (data !== "") {
        let str: any = data.replace("%", "");
        str = str / 100;
        return str;
      } else {
        return 0;
      }
    };
    const option = reactive({
      backgroundColor: "#ffffff",
      title: {
        textStyle: {
          fontWeight: "normal",
          fontSize: 25,
          color: "#fff",
        },
      },
      series: [
        {
          type: "liquidFill",
          data: [toNum(props.option.value)],
          radius: "100%",
          waveLength: "80%",
          waveHeight: "0",
          amplitude: 2,
          outline: { show: false },
          backgroundStyle: {
            color: imgList[props.option.type].backColor,
          },
          itemStyle: {
            opacity: 1, //波浪的透明度
            shadowBlur: 0, //波浪的阴影范围
            // shadowColor: "#FFFFFF", //阴影颜色
          },
          //   amplitude: 1,
          //path代码粘贴到此处,代码的多少取决于图形的复杂度
          shape: imgList[props.option.type].imgPath,
          color: [imgList[props.option.type].activeColor],
          label: { normal: { formatter: "" } },
        },
      ],
    });

    onMounted(() => {
      nextTick(() => {
        const myEcharts = echarts.init(echart.value as unknown as HTMLElement);
        window.addEventListener("resize", () => {
          myEcharts.resize();
        });
        myEcharts.clear();
        props.option && myEcharts.setOption(option, true);
        watch(
          props.option,
          () => {
            myEcharts.clear();
            option && myEcharts.setOption(option, true);
          },
          { immediate: true, deep: true }
        );
      });
    });

    return { echart };
  },
});
</script>

<style lang="less" scoped></style>

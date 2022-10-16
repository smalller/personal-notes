<template>
  <screen-box class="screenDistribution" title="教职工分布">
    <div class="screenDistributionBox">
      <div>
        <div class="chartEl" ref="chartEl"></div>
        <div class="chartText">
          <div>
            <i>/</i>
            <span>
              {{ userNumData.user.roleName }}: {{ userNumData.user.roleNum }}人
              ({{ userNumData.user.proportion }})
            </span>
          </div>
          <div>
            <i>/</i>
            <span>
              {{ userNumData.t.roleName }}: {{ userNumData.t.roleNum }}人 ({{
                userNumData.t.proportion
              }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </screen-box>
</template>
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import ScreenBox from "@/views/largeScreen/components/screenBox.vue";

import * as echarts from "echarts/core";
import "echarts-liquidfill";
import { getSchoolProportion } from "@/api/teachingManage";

export default defineComponent({
  name: "screenDistribution",
  components: { ScreenBox },
  setup() {
    const chartEl = ref(null);
    let myChart: echarts.ECharts;

    const userNumData = reactive({
      user: {},
      t: { roleNum: 0, totalNum: 0 },
    });

    const createChart = (myChart: echarts.ECharts, data: number[]) => {
      const option = {
        grid: {
          left: "0%",
          top: "20px",
          right: "0%",
          bottom: "4%",
        },
        series: [
          {
            type: "liquidFill",
            data: data,
            radius: "100%",
            waveLength: "80%",
            amplitude: 2,
            outline: {
              show: false,
            },

            backgroundStyle: {
              borderColor: "#156ACF",
              borderWidth: 1,
              shadowColor: "rgba(0, 0, 0, 0)",
              shadowBlur: 20,
              color: "#4FA8F9",
            },
            shape:
              "path://M698.433202 568.462699a227.134379 227.134379 0 0 1 227.134379 227.134379v210.086766a17.047613 17.047613 0 0 1-17.047613 17.047613H114.286699a17.047613 17.047613 0 0 1-17.047613-17.047613v-210.177018a227.134379 227.134379 0 0 1 227.134379-227.13438l374.044695 0.065183zM511.395813 0.646807a255.52367 255.52367 0 0 1 255.528683 255.528683 255.528684 255.528684 0 0 1-255.528683 255.528684 255.528684 255.528684 0 0 1-255.518656-255.528684A255.52367 255.52367 0 0 1 511.395813 0.646807z m8.107644 905.789842l65.212135-78.058013a21.249349 21.249349 0 0 0 4.597842-17.714476l-39.274693-205.238224a10.6698 10.6698 0 0 0-10.49431-8.614059H483.222124a10.659772 10.659772 0 0 0-10.49431 8.619073l-39.284721 205.238224a21.249349 21.249349 0 0 0 4.602856 17.714476l65.212135 78.022915a10.664786 10.664786 0 0 0 16.315569 0h-0.070196z m0 0",
            label: { normal: { formatter: "" } },
          },
        ],
      };
      myChart.setOption(option);
    };

    const getUserNum = (myChart: echarts.ECharts) => {
      getSchoolProportion().then((res) => {
        if (+res.code === 0) {
          console.log(res.data);
          res.data.forEach((item: any) => {
            if (item.roleName === "其他员工") {
              userNumData.user = item;
            } else {
              userNumData.t = item;
            }
          });
          createChart(myChart, [
            userNumData.t.roleNum / userNumData.t.totalNum,
          ]);
        }
      });
    };
    onMounted(() => {
      myChart = echarts.init(chartEl.value as unknown as HTMLElement);
      getUserNum(myChart);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
      setTimeout(() => {
        myChart.resize();
      }, 100);
    });
    return { chartEl, userNumData };
  },
});
</script>
<style lang="less" scoped>
.screenDistribution {
  display: flex;
  flex-direction: column;
  .screenDistributionBox {
    //flex: 1;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    > div {
      //height: 1.52rem;
      padding-left: 0.34rem;
      display: flex;
      .chartEl {
        width: 11.99vh;
        height: 13.5vh;
      }
      .chartText {
        margin-left: 0.1rem;
        box-sizing: border-box;
        height: 10vh;
        > div {
          height: 4.61vh;
          display: flex;
          margin-top: 0.1rem;
        }
        span {
          font-size: 0.21rem;
          color: #31e8e7;
          margin-left: 0.2rem;
        }
        i {
          color: #24a9c2;
          font-size: 0.41rem;
          transform: rotate(20deg);
          font-weight: 100;
        }
      }
    }
  }
}
</style>

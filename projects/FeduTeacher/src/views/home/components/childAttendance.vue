<template>
  <ui-card class="screenOpeningRate" :headShow="false">
    <div class="title">幼儿考勤</div>
    <div class="childBox">
      <div class="childItem">
        <div class="chartBox">
          <div ref="chart1"></div>
          <div class="charItem">
            <h1 class="percentage-value">{{ dayUserNum.toDay.b }}%</h1>
            <span class="percentage-label">今天</span>
          </div>
        </div>
        <div class="info">
          <p>
            应出勤：<span>{{ dayUserNum.toDay.userTotal }} 人</span>
          </p>
          <p>
            已出勤：<span>{{ dayUserNum.toDay.userNum }} 人</span>
          </p>
          <p>
            未出勤：<span>{{ dayUserNum.toDay.userNoNum }} 人</span>
          </p>
        </div>
      </div>
      <div class="childItem">
        <div class="chartBox">
          <div ref="chart2"></div>
          <div class="charItem">
            <h1 class="percentage-value">{{ dayUserNum.yesterday.b }}%</h1>
            <span class="percentage-label">昨天</span>
          </div>
        </div>
        <div class="info">
          <p>
            应出勤：<span>{{ dayUserNum.yesterday.userTotal }} 人</span>
          </p>
          <p>
            已出勤：<span>{{ dayUserNum.yesterday.userNum }} 人</span>
          </p>
          <p>
            未出勤：<span>{{ dayUserNum.yesterday.userNoNum }} 人</span>
          </p>
        </div>
      </div>
      <div class="childItem" v-show="false">
        <div class="chartBox">
          <div ref="chart3"></div>
          <div class="charItem">
            <h1 class="percentage-value">
              N {{ Math.floor((totalUser - userNoNum) / totalUser) * 100 }}%
            </h1>
            <span class="percentage-label">本月</span>
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
    </div>
  </ui-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
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
import { getSumClazzAttByDay } from "@/api/largeScreen";
import { useStore } from "vuex";
import dayjs from "dayjs";
import bus from "@/Layout/bus";

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
    const dayUserNum = reactive({
      toDay: {
        userNoNum: 0,
        userTotal: 0,
        userNum: 0,
        b: 0,
      },
      yesterday: {
        userNoNum: 0,
        userTotal: 0,
        userNum: 0,
        b: 0,
      },
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
          radius: ["70%", "100%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          color: ["#FFB73B", "#F5F5F5"],
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

      window.addEventListener("resize", () => {
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
      });
    });

    interface UserNum {
      userNoNum: number;
      userTotal: number;
    }
    const createCharts = () => {
      getStudentAttByDay(dayjs().format("YYYY-MM-DD")).then((res: UserNum) => {
        const { userNoNum, userTotal } = res;
        dayUserNum.toDay.userNoNum = userNoNum;
        dayUserNum.toDay.userTotal = userTotal;
        dayUserNum.toDay.userNum = userTotal - userNoNum;
        dayUserNum.toDay.b =
          +(+(userTotal - userNoNum) / userTotal).toFixed(3) * 100;
        dayUserNum.toDay.b = +dayUserNum.yesterday.b.toFixed(1);
        myChart1 = createChart(
          chart1.value as unknown as HTMLElement,
          [
            { value: userTotal - userNoNum, name: "已出勤" },
            { value: userNoNum, name: "未出勤" },
          ],
          "幼儿出勤率"
        );
        myChart1.resize();
      });
      getStudentAttByDay(
        dayjs(dayjs().toDate().getTime() - 24 * 60 * 60 * 1000).format(
          "YYYY-MM-DD"
        )
      ).then((res: UserNum) => {
        const { userNoNum, userTotal } = res;
        // const userNoNum = 20;
        dayUserNum.yesterday.userNoNum = userNoNum;
        dayUserNum.yesterday.userTotal = userTotal;
        dayUserNum.yesterday.userNum = userTotal - userNoNum;
        dayUserNum.yesterday.b =
          +(+(userTotal - userNoNum) / userTotal).toFixed(3) * 100;
        dayUserNum.yesterday.b = +dayUserNum.yesterday.b.toFixed(1);
        myChart2 = createChart(
          chart2.value as unknown as HTMLElement,
          [
            { value: userTotal - userNoNum, name: "已出勤" },
            { value: userNoNum, name: "未出勤" },
          ],
          "幼儿出勤率"
        );
        myChart2.resize();
      });
    };

    const getStudentAttByDay = (time: string): Promise<UserNum> => {
      return new Promise((resolve) => {
        getSumClazzAttByDay({
          clazzIds: classList.value.map((item: any) => item.id).join(","),
          attDay: time,
        }).then((res) => {
          if (+res.code === 0) {
            let userNoNum = 0;
            let userTotal = 0;
            res.data.forEach((item: any) => {
              userNoNum += item.noShowNum;
              userTotal += item.classTotal;
            });
            resolve({
              userNoNum,
              userTotal,
            });
          }
        });
      });
    };
    createCharts();

    bus.$on("schoolChanged", () => {
      createCharts();
    });
    onUnmounted(() => {
      bus.$off("schoolChanged");
    });
    return {
      dayNum,
      yesterdayNum,
      monthNum,
      chart1,
      chart2,
      chart3,
      totalUser,
      userNoNum,
      dayUserNum,
    };
  },
  components: {},
});
</script>

<style scoped lang="less">
@media only screen and (min-width: 1480px) {
  .screenOpeningRate {
    margin-left: 20px;
  }
}
.screenOpeningRate {
  flex: 1;
  //max-width: 1110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .title {
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    color: #222222;
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
    width: 110px;
    height: 110px;
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
        height: 56px;
        // z-index: 2;
        display: flex;
        flex-direction: column;
        h1 {
          font-size: 26px;
          color: #222222;
        }
        span {
          text-align: center;
          color: #676767;
          font-size: 13px;
        }
      }
    }
  }
  .info {
    margin-top: 22px;
    p {
      padding-bottom: 8px;
      font-size: 14px;
      font-weight: 400;
      color: #676767;
      span {
        color: #676767;
        font-weight: bold;
      }
    }
  }
}
</style>

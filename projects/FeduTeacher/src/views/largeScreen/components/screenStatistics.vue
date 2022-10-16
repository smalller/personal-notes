<template>
  <div class="screenStatistics">
    <div ref="chart1" class="chart1"></div>
    <div class="chart2Box">
      <div ref="chart2" class="chart2"></div>
      <div class="info">
        <div>
          <span>{{ userNum.maleNum.num }}</span>
          <span>男生人数</span>
        </div>
        <div>
          <span>{{ userNum.maleNum.rate }}</span>
          <span>男生占比</span>
        </div>
        <div>
          <span>{{ userNum.femaleNum.num }}</span>
          <span>女生人数</span>
        </div>
        <div>
          <span>{{ userNum.femaleNum.rate }}</span>
          <span>女生占比</span>
        </div>
      </div>
    </div>
  </div>
</template>
/
<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import * as echarts from "echarts/core";
import {
  TooltipComponent,
  TooltipComponentOption,
  LegendComponent,
  LegendComponentOption,
} from "echarts/components";
import "echarts-liquidfill";
import { PieChart, PieSeriesOption } from "echarts/charts";
import { LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { getClassList } from "@/api/classManage";
import { PieDataItemOption } from "echarts/types/src/chart/pie/PieSeries";
import { getSchoolProportion } from "@/api/infantManage";
import { InfantNumChartData } from "@/views/staffManage/infantManage/util";

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
  setup() {
    const chart1 = ref(null);
    const chart2 = ref(null);

    interface UserNum {
      maleNum: InfantNumChartData;
      femaleNum: InfantNumChartData;
    }
    const userNum = reactive<UserNum>({
      maleNum: {
        num: 0,
        rate: "",
        sex: 1,
        total: 0,
      },
      femaleNum: {
        num: 0,
        rate: "",
        sex: 0,
        total: 0,
      },
    });

    const createChart1 = (
      chart: echarts.ECharts,
      data: PieDataItemOption[]
    ) => {
      const opt: EChartsOption = {
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}人 ({d}%)",
          position: function (p) {
            //其中p为当前鼠标的位置
            return [p[0] + 10, p[1] - 10];
          },
        },
        series: [
          {
            name: "统计",
            type: "pie",
            radius: ["59%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: true,
              color: "#31E8E7",
              fontSize: 20,
              // position: "center",
            },
            color: ["#065aab", "#1070c7", "#1995df", "#19c0ff", "#31e8e7"],
            labelLine: {
              show: false,
            },
            data: data,
          },
        ],
      };
      chart.setOption(opt);
    };

    const createChart12 = (chart: echarts.ECharts, data: number[]) => {
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
            waveAnimation: true,
            animationDuration: 0,
            animationDurationUpdate: 0,
            data: data,
            radius: "80%",
            waveLength: "80%",
            waveHeight: "0",
            amplitude: 2,
            outline: {
              show: false,
            },
            color: ["#FC6392"],
            backgroundStyle: {
              borderColor: "#00E5FF",
              borderWidth: 1,
              shadowColor: "rgba(0, 0, 0, 0)",
              shadowBlur: 20,
              color: "#4FA8F9",
            },
            shape:
              "path://M361.366977 1021.567453v-194.774015H248.370317v-267.91583A151.109802 151.109802 0 0 1 399.017935 408.22999h225.939804a151.109802 151.109802 0 0 1 150.662214 150.647618v267.91583H662.633023v194.774015zM321.346719 192.17119a189.738644 189.738644 0 1 1 189.738643 189.738644 189.738644 189.738644 0 0 1-189.738643-189.738644z",
            label: { normal: { formatter: "" } },
          },
        ],
      };
      chart.setOption(option);
    };

    interface ClassNum {
      gradeLabel: string;
      studentNum: number;
    }
    const getClassLIstNum = (myChart1: echarts.ECharts) => {
      getClassList(1, 999, {
        // startTime: `${dayjs().year()}-1-1`,
        // endTime: dayjs().format("YYYY-MM-DD"),
        isGraduating: 0,
      }).then((res) => {
        if (+res.code === 0) {
          console.log(9999999, res.data);
          const cfArr: ClassNum[] = [];
          let arr = res.data.list.filter(
            (item: ClassNum, index: number, arr: ClassNum[]) => {
              if (
                arr.findIndex((data) => data.gradeLabel === item.gradeLabel) ===
                index
              ) {
                return item;
              } else {
                cfArr.push(item);
              }
            }
          );
          arr = arr.map((item: ClassNum) => {
            const list = cfArr.filter(
              (data: ClassNum) => data.gradeLabel === item.gradeLabel
            );
            if (list.length === 1) {
              item.studentNum += list[0].studentNum;
              return item;
            } else {
              console.log(88888, list, item.studentNum);
              list.forEach((data: ClassNum) => {
                item.studentNum += data.studentNum;
              });
              return item;
            }
          });
          console.log(cfArr, arr);
          const data = arr.map((item: ClassNum) => {
            return {
              value: item.studentNum,
              name: item.gradeLabel,
            };
          });
          createChart1(myChart1, data);
        }
      });
    };
    const getSchoolStudentNum = (myChart: echarts.ECharts) => {
      userNum.maleNum = {
        num: 0,
        rate: "",
        sex: 1,
        total: 0,
      };
      userNum.femaleNum = {
        num: 0,
        rate: "",
        sex: 0,
        total: 0,
      };
      getSchoolProportion().then((res) => {
        if (+res.code === 0) {
          res.data.forEach((item: InfantNumChartData) => {
            if (+item.sex === 1) {
              userNum.maleNum = item;
            }
            if (+item.sex === 2) {
              userNum.maleNum.num += item.num;
            }
            if (+item.sex === 0) {
              userNum.femaleNum = item;
            }
          });
          console.log(res.data);
          userNum.maleNum.rate =
            Math.floor((userNum.maleNum.num / res.data[0].total) * 100) + "%";
          userNum.femaleNum.rate =
            100 -
            Math.floor((userNum.maleNum.num / res.data[0].total) * 100) +
            "%";
          createChart12(myChart, [1 - userNum.maleNum.num / res.data[0].total]);
        }
      });
    };

    onMounted(() => {
      const myChart1 = echarts.init(chart1.value as unknown as HTMLElement);
      getClassLIstNum(myChart1);
      const myChart2 = echarts.init(chart2.value as unknown as HTMLElement);
      getSchoolStudentNum(myChart2);
      setTimeout(() => {
        myChart1.resize();
        myChart2.resize();
      }, 100);
    });
    return {
      chart1,
      chart2,
      userNum,
    };
  },
});
</script>
<style lang="less" scoped>
.screenStatistics {
  // width: 5.29rem;
  // height: 5.29rem;
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  .chart1 {
    position: absolute;
    width: 6.29rem;
    height: 6.29rem;
  }
  .chart2Box {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    .chart2 {
      position: absolute;
      width: 2.42rem;
      height: 3.75rem;
    }
    .info {
      position: absolute;
      width: 3rem;
      height: 1.6rem;
      > div {
        position: absolute;
        display: flex;
        flex-direction: column;
        span {
          &:first-child {
            color: #4aeceb;
            font-size: 0.33rem;
          }
          &:last-child {
            font-size: 0.19rem;
            color: #ffffff;
          }
        }
        &:nth-child(1) {
          top: 0;
          left: 0;
        }
        &:nth-child(2) {
          top: 0;
          right: 0;
        }
        &:nth-child(3) {
          bottom: 0;
          left: 0;
        }
        &:nth-child(4) {
          right: 0;
          bottom: 0;
        }
      }
    }
  }
}
</style>

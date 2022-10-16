<template>
  <div class="screenStatistics">
    <div ref="chart1" class="chart1"></div>
    <div class="chart2Box">
      <div ref="chart2" class="chart2"></div>
      <div class="info">
        <div>
          <span>{{ userNum.maleNum.num }}</span>
          <span>开通园所数</span>
        </div>
        <div>
          <span>{{ userNum.maleNum.rate }}</span>
          <span>开通园所占比</span>
        </div>
        <div>
          <span>{{ userNum.femaleNum.num }}</span>
          <span>未开通园所数</span>
        </div>
        <div>
          <span>{{ userNum.femaleNum.rate }}</span>
          <span>未开通园所占比</span>
        </div>
      </div>
      <!-- <div class="botom-text">监控状态</div> -->
    </div>
  </div>
</template>
/
<script>
  import * as echarts from 'echarts/core'
  import { TooltipComponent, LegendComponent } from 'echarts/components'
  import 'echarts-liquidfill'
  import { PieChart } from 'echarts/charts'
  import { LabelLayout } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'
  import {
    getClassList,
    getSchoolProportion,
  } from '@/cms/api/largeScreen/index'

  echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
  ])

  export default {
    data() {
      return {
        userNum: {
          maleNum: {
            num: 0,
            rate: '0%',
            sex: 1,
            total: 0,
          },
          femaleNum: {
            num: 0,
            rate: '0%',
            sex: 0,
            total: 0,
          },
        },
      }
    },

    mounted() {
      const myChart1 = echarts.init(this.$refs.chart1)
      this.getClassLIstNum(myChart1)
      const myChart2 = echarts.init(this.$refs.chart2)
      this.getSchoolStudentNum(myChart2)
      setTimeout(() => {
        myChart1.resize()
        myChart2.resize()
      }, 100)
    },
    methods: {
      getClassLIstNum(myChart1) {
        getClassList(1, 999, {
          // startTime: `${dayjs().year()}-1-1`,
          // endTime: dayjs().format("YYYY-MM-DD"),
          isGraduating: 0,
        }).then((res) => {
          if (+res.code === 0) {
            const cfArr = []
            let arr = res.data.list.filter((item, index, arr) => {
              if (
                arr.findIndex((data) => data.gradeLabel === item.gradeLabel) ===
                index
              ) {
                return item
              } else {
                cfArr.push(item)
              }
            })
            arr = arr.map((item) => {
              const list = cfArr.filter(
                (data) => data.gradeLabel === item.gradeLabel
              )
              if (list.length === 1) {
                item.studentNum += list[0].studentNum
                return item
              } else {
                list.forEach((data) => {
                  item.studentNum += data.studentNum
                })
                return item
              }
            })
            // const data = arr.map((item) => {
            //   return {
            //     value: item.studentNum,
            //     name: item.gradeLabel,
            //   }
            // })
            const data = [
              {
                name: '托班',
                value: 3,
              },
              {
                name: '中班',
                value: 4,
              },
            ]
            this.createChart1(myChart1, data)
          }
        })
      },

      createChart1(chart, data) {
        const opt = {
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}人 ({d}%)',
            position: function (p) {
              //其中p为当前鼠标的位置
              return [p[0] + 10, p[1] - 10]
            },
          },
          series: [
            {
              name: '统计',
              type: 'pie',
              radius: ['59%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: true,
                color: '#31E8E7',
                fontSize: 20,
              },
              color: ['#065aab', '#1070c7', '#1995df', '#19c0ff', '#31e8e7'],
              labelLine: {
                show: false,
              },
              data: data,
            },
          ],
        }
        chart.setOption(opt)
      },

      createChart12(chart, data) {
        const option = {
          grid: {
            left: '0%',
            top: '20px',
            right: '0%',
            bottom: '4%',
          },
          series: [
            {
              type: 'liquidFill',
              waveAnimation: true,
              animationDuration: 0,
              animationDurationUpdate: 0,
              data: data,
              radius: '80%',
              waveLength: '80%',
              waveHeight: '0',
              amplitude: 2,
              outline: {
                show: false,
              },
              color: ['#FB9E89'],
              backgroundStyle: {
                borderColor: '#00E5FF',
                borderWidth: 1,
                shadowColor: 'rgba(0, 0, 0, 0)',
                shadowBlur: 20,
                color: '#00E5FF',
              },
              shape:
                'path://M771.755109 1024H252.070279a48.828377 48.828377 0 0 1-23.440905-6.003925 48.200453 48.200453 0 0 1-17.557736-16.509584 47.335849 47.335849 0 0 1-2.270189-46.505057l92.841057-252.087547a381.971321 381.971321 0 0 1-158.217661-205.939925 380.251774 380.251774 0 0 1 154.005736-432.553056 390.119849 390.119849 0 0 1 415.116076-8.911698 384.483019 384.483019 0 0 1 98.729056 85.01132A378.981434 378.981434 0 0 1 898.412317 384.367094v2.120453a377.773887 377.773887 0 0 1-47.219925 181.330113 382.71034 382.71034 0 0 1-128.806641 137.20634l92.845887 249.962264a47.335849 47.335849 0 0 1-2.275019 46.505057 48.166642 48.166642 0 0 1-17.557736 16.509585 48.833208 48.833208 0 0 1-23.445736 5.999094zM291.189977 382.265962c0 120.445585 99.052679 218.435623 220.807246 218.435623s220.807245-97.990038 220.807245-218.435623S633.751789 163.83034 511.997223 163.83034 291.189977 261.796226 291.189977 382.265962z m184.474566-282.696453a39.100377 39.100377 0 1 0 39.095548-38.776754 38.979623 38.979623 0 0 0-39.095548 38.776754zM339.047487 382.261132A172.959396 172.959396 0 1 1 511.997223 553.22083 171.954717 171.954717 0 0 1 339.047487 382.261132z',
              label: { normal: { formatter: '' } },
            },
          ],
        }
        chart.setOption(option)
      },

      getSchoolStudentNum(myChart) {
        this.userNum.maleNum = {
          num: 0,
          rate: '80%',
          sex: 1,
          total: 0,
        }
        this.userNum.femaleNum = {
          num: 0,
          rate: '20%',
          sex: 0,
          total: 0,
        }

        this.createChart12(myChart, [0.2])

        // getSchoolProportion().then((res) => {
        //   if (+res.code === 0) {
        //     res.data.forEach((item) => {
        //       if (+item.sex === 1) {
        //         this.userNum.maleNum = item
        //       }
        //       if (+item.sex === 2) {
        //         this.userNum.maleNum.num += item.num
        //       }
        //       if (+item.sex === 0) {
        //         this.userNum.femaleNum = item
        //       }
        //     })
        //     this.userNum.maleNum.rate =
        //       Math.floor((this.userNum.maleNum.num / res.data[0].total) * 100) +
        //       '%'
        //     this.userNum.femaleNum.rate =
        //       100 -
        //       Math.floor((this.userNum.maleNum.num / res.data[0].total) * 100) +
        //       '%'
        //     this.createChart12(myChart, [
        //       1 - this.userNum.maleNum.num / res.data[0].total,
        //     ])
        //   }
        // })
      },
    },
  }
</script>
<style lang="scss" scoped>
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
      // width: 6.29rem;
      // height: 6.29rem;
      width: 6.5rem;
      height: 6.5rem;
      width: 6.8rem;
      height: 6.8rem;
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
        // top: -218px;
      }
      .info {
        position: absolute;
        width: 3.2rem;
        height: 1.6rem;
        // top: -100px;
        > div {
          position: absolute;
          display: flex;
          flex-direction: column;
          span {
            &:first-child {
              color: #4aeceb;
              font-size: 0.34rem;
            }
            &:last-child {
              font-size: 0.14rem;
              color: #ffffff;
            }
          }
          &:nth-child(1) {
            top: 0;
            left: 9px;
          }
          &:nth-child(2) {
            top: 0;
            right: -4px;
          }
          &:nth-child(3) {
            bottom: 0;
            left: 7px;
          }
          &:nth-child(4) {
            right: -17px;
            bottom: 0;
          }
        }
      }
      .botom-text {
        position: absolute;
        width: 2rem;
        height: 0.5rem;
        bottom: -130px;
        background: rgba(0, 24, 113, 0.7);
        border: 2px solid #4fa8f9;
        border-radius: 30px;
        font-size: 0.28rem;
        color: #00e5ff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>

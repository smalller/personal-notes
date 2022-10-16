<template>
  <screen-box :right-btn="true" class="screenTrend" title="增长趋势">
    <div ref="screenChart" class="screenChart"></div>
  </screen-box>
</template>

<script>
  import * as echarts from 'echarts/core'
  import {
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
  } from 'echarts/components'
  import { LineChart } from 'echarts/charts'
  import { UniversalTransition } from 'echarts/features'
  import { CanvasRenderer } from 'echarts/renderers'
  import ScreenBox from './screenBox.vue'
  import dayjs from 'dayjs'
  import { getHomePageReport } from '@/cms/api/largeScreen/index'

  echarts.use([
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    GridComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
  ])

  export default {
    components: { ScreenBox },
    data() {
      return {
        EChart: null,
        option: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: '#dddc6b',
              },
            },
          },
          legend: {
            top: '0%',
            data: ['园所', '班级', '幼儿', '入驻APP', '会员开通'],
            textStyle: {
              color: 'rgba(255,255,255,.5)',
              fontSize: '12',
            },
          },
          grid: {
            left: '10',
            top: '30',
            right: '10',
            bottom: '10',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              axisLabel: {
                textStyle: {
                  color: 'rgba(255,255,255,.6)',
                  fontSize: 12,
                },
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,.2)',
                },
              },
              data: [],
            },
            {
              axisPointer: { show: false },
              axisLine: { show: false },
              position: 'bottom',
              offset: 20,
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: { show: false },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,.1)',
                },
              },
              axisLabel: {
                textStyle: {
                  color: 'rgba(255,255,255,.6)',
                  fontSize: 12,
                },
              },

              splitLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,.1)',
                },
              },
            },
          ],
          series: [
            {
              name: '园所',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  color: '#0184d5',
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
                        color: 'rgba(1, 132, 213, 0.4)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(1, 132, 213, 0.1)',
                      },
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                },
              },
              itemStyle: {
                normal: {
                  color: '#0184d5',
                  borderColor: 'rgba(221, 220, 107, .1)',
                  borderWidth: 12,
                },
              },
              data: [],
            },
            {
              name: '班级',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  color: '#00d887',
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
                        color: 'rgba(0, 216, 135, 0.4)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(0, 216, 135, 0.1)',
                      },
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                },
              },
              itemStyle: {
                normal: {
                  color: '#00d887',
                  borderColor: 'rgba(221, 220, 107, .1)',
                  borderWidth: 12,
                },
              },
              data: [],
            },
            {
              name: '幼儿',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  color: '#DC8F02',
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
                        color: 'rgba(0, 216, 135, 0.4)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(0, 216, 135, 0.1)',
                      },
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                },
              },
              itemStyle: {
                normal: {
                  color: '#DC8F02',
                  borderColor: 'rgba(221, 220, 107, .1)',
                  borderWidth: 12,
                },
              },
              data: [],
            },
            {
              name: '入驻APP',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  color: '#7B72FF',
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
                        color: 'rgba(0, 216, 135, 0.4)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(0, 216, 135, 0.1)',
                      },
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                },
              },
              itemStyle: {
                normal: {
                  color: '#7B72FF',
                  borderColor: 'rgba(221, 220, 107, .1)',
                  borderWidth: 12,
                },
              },
              data: [],
            },
            {
              name: '会员开通',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  color: '#FC6392',
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
                        color: 'rgba(0, 216, 135, 0.4)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(0, 216, 135, 0.1)',
                      },
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                },
              },
              itemStyle: {
                normal: {
                  color: '#FC6392',
                  borderColor: 'rgba(221, 220, 107, .1)',
                  borderWidth: 12,
                },
              },
              data: [],
            },
          ],
        },
      }
    },
    mounted() {
      this.queryForm()
      window.addEventListener('resize', () => {
        const res = this.EChart.resize()
      })
    },
    methods: {
      initMapData() {
        this.option.series[0].data = []
        this.option.series[1].data = []
        this.option.series[2].data = []
        this.option.series[3].data = []
        this.option.series[4].data = []
      },
      queryForm() {
        this.initMapData()
        const params = {}
        params.startDay = `${
          dayjs().toDate().getFullYear() - 1
        }-${dayjs().format('MM-DD')}`
        params.endDay = dayjs().format('YYYY-MM-DD')

        getHomePageReport(params).then((res) => {
          if (+res.code === 0) {
            // const arr = res.data
            for (let i = 1; i <= dayjs().toDate().getMonth() + 1; i++) {
              const date = dayjs(
                `${dayjs().toDate().getFullYear()}-${i}`
              ).format('YYYY-MM')
              this.option.xAxis[0].data.push(date)

              // const item = arr?.find((item) => item.reportDate === date)
              // if (item) {
              //   this.option.series[0].data.push(item.empNum)
              //   this.option.series[1].data.push(item.stuNum)
              // } else {
              //   this.option.series[0].data.push(0)
              //   this.option.series[1].data.push(0)
              // }
            }

            this.option.series[0].data = [1, 2, 3]
            this.option.series[1].data = [2, 3, 4]
            this.option.series[2].data = [3, 4, 5]
            this.option.series[3].data = [4, 5, 6]
            this.option.series[4].data = [5, 6, 7]

            this.EChart = echarts.init(this.$refs.screenChart)
            this.option && this.EChart.setOption(this.option)

            // this.$nextTick(() => {
            //   const res = this.EChart.setOption(this.option, true)
            //   console.log(2222, res)
            // })

            setTimeout(() => {
              this.EChart.resize()
            }, 100)
          }
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  .screenTrend {
    // height: 28.5vh;
    width: 100% !important;
    .screenChart {
      width: 100%;
      height: 100%;
    }
  }
</style>

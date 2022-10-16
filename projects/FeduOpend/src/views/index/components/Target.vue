<template>
  <div class="target">
    <el-card class="target-card1" shadow="hover">
      <div slot="header">
        <span>
          <vab-remix-icon icon="body-scan-line" />
          小目标
        </span>
      </div>
      <vab-chart
        class="target-echart1"
        autoresize
        :options="options"
        theme="vab-echarts-theme"
      />
    </el-card>
    <el-card class="target-card2" shadow="hover">
      <div slot="header">
        <span>
          <vab-remix-icon icon="money-cny-box-line" />
          销售额
        </span>
      </div>
      <vab-chart
        class="target-echart2"
        autoresize
        :options="options2"
        theme="vab-echarts-theme"
      />
    </el-card>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  import VabChart from '@/extra/vabCharts'

  export default {
    components: {
      VabChart,
    },
    data() {
      const colorList = ['#9E87FF', '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
      return {
        options: {
          grid: {
            top: '0%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              splitLine: {
                show: false,
              },
              type: 'value',
              show: false,
            },
          ],
          yAxis: [
            {
              splitLine: {
                show: false,
              },
              axisLine: {
                show: false,
              },
              type: 'category',
              axisTick: {
                show: false,
              },
              data: [
                '莱山区',
                '高新区',
                '芝罘区',
                '牟平区',
                '蓬莱区',
                '开发区',
              ],
            },
          ],
          series: [
            {
              name: '目标',
              type: 'bar',
              barWidth: 25,
              label: {
                show: true,
                position: 'right',
                color: '#1890FF',
                fontSize: 14,
                formatter: ({ data }) => {
                  return `${data}亿元`
                },
              },
              itemStyle: {
                barBorderRadius: [0, 5, 5, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  1,
                  0,
                  ['#3ED572', '#399efd'].map((color, offset) => ({
                    color,
                    offset,
                  }))
                ),
              },
              data: [320, 302, 341, 374, 390, 650],
            },
          ],
        },
        options2: {
          grid: {
            top: '4%',
            left: '2%',
            right: '2%',
            bottom: '0%',
            containLabel: true,
          },
          tooltip: {
            backgroundColor: '#fff',
            trigger: 'axis',
            axisPointer: {
              label: {
                show: true,
                backgroundColor: '#fff',
                color: '#556677',
                borderColor: 'rgba(0,0,0,0)',
                shadowColor: 'rgba(0,0,0,0)',
                shadowOffsetY: 0,
              },
              lineStyle: {
                width: 0,
              },
            },
            textStyle: {
              color: '#5c6c7c',
            },
            extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)',
          },
          xAxis: [
            {
              type: 'category',
              data: [
                '1月',
                '2月',
                '3月',
                '4月',
                '5月',
                '6月',
                '7月',
                '8月',
                '9月',
                '10月',
                '11月',
                '12月',
              ],
              axisLine: {
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                interval: 0,
                textStyle: {
                  color: '#556677',
                },
                fontSize: 12,
                margin: 15,
              },
              axisPointer: {
                label: {
                  padding: [0, 0, 10, 0],
                  margin: 15,
                  fontSize: 12,
                  backgroundColor: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#fff',
                      },
                      {
                        offset: 0.86,
                        color: '#fff',
                      },
                      {
                        offset: 0.86,
                        color: '#33c0cd',
                      },
                      {
                        offset: 1,
                        color: '#33c0cd',
                      },
                    ],
                    global: false,
                  },
                },
              },
              boundaryGap: false,
            },
          ],
          yAxis: [
            {
              type: 'value',
              axisTick: {
                show: false,
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#DCE2E8',
                },
              },
              axisLabel: {
                textStyle: {
                  color: '#556677',
                },
              },
              splitLine: {
                show: false,
              },
            },
          ],
          series: [
            {
              name: '销售额',
              type: 'line',
              data: [
                1905,
                1020,
                3330,
                512,
                4463,
                2214,
                3330,
                5412,
                1205,
                820,
                5330,
                1112,
              ],
              symbolSize: 1,
              symbol: 'circle',
              smooth: true,
              yAxisIndex: 0,
              showSymbol: false,
              lineStyle: {
                width: 5,
                color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
                  {
                    offset: 0,
                    color: '#73DD39',
                  },
                  {
                    offset: 1,
                    color: '#73DDFF',
                  },
                ]),
                shadowColor: 'rgba(115,221,255, 0.3)',
                shadowBlur: 10,
                shadowOffsetY: 20,
              },
              itemStyle: {
                normal: {
                  color: colorList[1],
                  borderColor: colorList[1],
                },
              },
              /*   areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(0,179,244,0.3)',
                      },
                      {
                        offset: 1,
                        color: 'rgba(0,179,244,0)',
                      },
                    ],
                    false
                  ),
                  shadowColor: 'rgba(0,179,244, 0.9)',
                  shadowBlur: 20,
                },
              },
             */
            },
          ],
        },
      }
    },
  }
</script>
<style lang="scss" scoped>
  .target {
    margin-bottom: $base-padding;
  }
  ::v-deep {
    .target-echart1 {
      width: 100%;
      height: 290px;
    }
    .target-echart2 {
      width: 100%;
      height: 200px;
    }
  }
</style>

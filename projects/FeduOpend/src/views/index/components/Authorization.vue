<template>
  <el-card class="authorization" shadow="hover">
    <div slot="header">
      <span>
        <vab-remix-icon icon="bar-chart-2-line" />
        授权数
      </span>
      <el-tag class="card-header-tag" type="warning">周</el-tag>
    </div>
    <vab-chart autoresize :options="options" theme="vab-echarts-theme" />
    <div class="bottom">
      <span>
        授权数:

        <vab-count
          :decimals="countConfig.decimals"
          :duration="countConfig.duration"
          :end-val="countConfig.endVal"
          :prefix="countConfig.prefix"
          :separator="countConfig.separator"
          :start-val="countConfig.startVal"
          :suffix="countConfig.suffix"
        />
      </span>
    </div>
  </el-card>
</template>
<script>
  import echarts from 'echarts'
  import _ from 'lodash'
  import VabChart from '@/extra/vabCharts'
  import VabCount from '@/extra/vabCount'

  export default {
    components: {
      VabChart,
      VabCount,
    },
    data() {
      return {
        countConfig: {
          startVal: 0,
          endVal: _.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        //授权数
        options: {
          grid: {
            top: '4%',
            left: '2%',
            right: '4%',
            bottom: '0%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              /*boundaryGap: false,*/
              data: ['0时', '4时', '8时', '12时', '16时', '20时', '24时'],
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
            },
          ],
          series: [
            {
              name: '授权数',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 20, 33, 39, 33, 22],
              itemStyle: {
                barBorderRadius: [2, 2, 0, 0],
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  ['#88D1FF', '#1890FF'].map((color, offset) => ({
                    color,
                    offset,
                  }))
                ),
              },
            },
          ],
        },
      }
    },
  }
</script>

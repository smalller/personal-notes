<template>
  <el-card class="access" shadow="hover">
    <div slot="header">
      <span>
        <vab-remix-icon icon="line-chart-line" />
        访问量
      </span>
      <el-tag class="card-header-tag" type="success">日</el-tag>
    </div>
    <vab-chart autoresize :options="options" theme="vab-echarts-theme" />
    <div class="bottom">
      <span>
        日均访问量:

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
        timer: 0,
        countConfig: {
          startVal: 0,
          endVal: _.random(20000, 60000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
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
              boundaryGap: false,
              data: [],
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
              name: '访问量',
              type: 'line',
              data: [],
              smooth: true,
              areaStyle: {},
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
            },
          ],
        },
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    mounted() {
      let base = +new Date(2020, 1, 1)
      let oneDay = 24 * 3600 * 1000
      let date = []

      let data = [Math.random() * 1500]
      let now = new Date(base)

      const addData = (shift) => {
        now = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/')
        date.push(now)
        data.push(_.random(20000, 60000))

        if (shift) {
          date.shift()
          data.shift()
        }

        now = new Date(+new Date(now) + oneDay)
      }

      for (let i = 1; i < 6; i++) {
        addData()
      }
      addData(true)
      this.options.xAxis[0].data = date
      this.options.series[0].data = data
      this.timer = setInterval(() => {
        addData(true)
        this.options.xAxis[0].data = date
        this.options.series[0].data = data
      }, 6000)
    },
  }
</script>

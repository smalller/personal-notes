<template>
  <div class="indexlayout-main-conent">
    <div class="top-card">
      <div class="top-data-box">
        <ul>
          <li>
            <div class="top-box">
              <p class="top-title">
                <span>商户数</span>
                <el-tag size="large">今日</el-tag>
              </p>
              <p class="num">
                <span>{{ userInfo?.today?.merchantCount || 0 }}</span>
                个
              </p>
            </div>
            <div class="botom-box">
              <span>总数量</span>
              <span>{{ userInfo?.total?.merchantCount || 0 }}个</span>
            </div>
          </li>
          <li>
            <div class="top-box">
              <p class="top-title">
                <span>收款额</span>
                <el-tag size="large">今日</el-tag>
              </p>
              <p class="num">
                <span>{{ userInfo?.today?.receiveTotal || 0 }}</span>
                元
              </p>
            </div>
            <div class="botom-box">
              <span>总金额</span>
              <span>{{ userInfo?.total?.receiveTotal || 0 }}元</span>
            </div>
          </li>
          <li>
            <div class="top-box">
              <p class="top-title">
                <span>退款额</span>
                <el-tag size="large">今日</el-tag>
              </p>
              <p class="num">
                <span>{{ userInfo?.today?.refundTotal || 0 }}</span>
                元
              </p>
            </div>
            <div class="botom-box">
              <span>总金额</span>
              <span>{{ userInfo?.total?.refundTotal || 0 }}元</span>
            </div>
          </li>
          <li>
            <div class="top-box">
              <p class="top-title">
                <span>手续费</span>
                <el-tag size="large">今日</el-tag>
              </p>
              <p class="num">
                <span>{{ userInfo?.today?.serviceTotal || 0 }}</span>
                元
              </p>
            </div>
            <div class="botom-box">
              <span>总金额</span>
              <span>{{ userInfo?.total?.serviceTotal || 0 }}元</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <el-card shadow="never" class="botom-card">
      <div class="top-box">
        <span>统计报表</span>
        <div class="right-btn">
          <el-button-group>
            <el-button :type="+target === -1 && 'primary'" @click="getData(-1)">全部</el-button>
            <el-button :type="+target === 30 && 'primary'" @click="getData(30)">近30天</el-button>
            <el-button :type="+target === 90 && 'primary'" @click="getData(90)">近90天</el-button>
            <el-button :type="+target === 180 && 'primary'" @click="getData(180)">近180天</el-button>
            <el-button :type="+target === 360 && 'primary'" @click="getData(360)">近360天</el-button>
          </el-button-group>
        </div>
      </div>
      <div class="line-box">
        <span>商户增长曲线（当前商户：{{ userInfo?.refresh?.merchantCount || 0 }}个）</span>
        <div class="chart" ref="linksChartRef" id="lineChart"></div>
      </div>
      <div class="botom-map">
        <div class="bar">
          <span>商户收款排名</span>
          <div class="barChart" ref="barChartRef"></div>
        </div>
        <div class="pie">
          <span>平台收款、退款、手续费占比图（单位：元）</span>
          <div class="pieChart" ref="pieChartRef"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import { defineComponent, Ref, ref, watch, onMounted } from 'vue';
import { EChartOption } from 'echarts';
import useEcharts from '@/composables/useEcharts';
import { getList } from './api';

export interface Setup {
  linksChartRef: Ref<any>;
  pieChartRef: Ref<any>;
  userInfo: Ref<any>;
  getData: (day: number) => Promise<void>
  target: Ref<number>
  barChartRef: Ref<any>;
}

const linksChartOption: EChartOption = {};

interface userInfoList {
  date: string;
  merchantCount: string
}

export default defineComponent({
  name: '',
  setup(): Setup {
    const target = ref<number>(-1)
    const userInfo = ref<any>({});

    const linksChartRef = ref<HTMLDivElement>();
    const pieChartRef = ref<HTMLDivElement>();
    const barChartRef = ref<HTMLDivElement>();

    const echarts = useEcharts(linksChartRef, linksChartOption);
    const pieecharts = useEcharts(pieChartRef, linksChartOption);
    const barEachart = useEcharts(barChartRef, linksChartOption);



    // 获取商户详情基本信息
    async function getData(day: number): Promise<void> {
      target.value = day || -1
      const { code, data } = await getList(day);
      if (+code === 1000) {
        userInfo.value = data;
      }
    }

    onMounted(() => {
      getData(-1);
    });

    watch(() => userInfo.value, () => {
      if (echarts.value && pieecharts.value && barEachart.value) {
        let dateList: string[] = []
        let countList: string[] = []
        userInfo.value.merchantList.forEach((item: userInfoList) => {
          dateList.push(item.date)
          countList.push(item.merchantCount)
        })

        let merList: string[] = []
        let numList: string[] = []
        userInfo.value.receiveList.forEach((item: any) => {
          merList.unshift(item.merchantName)
          numList.unshift(item.receiveTotal)
        })

        const option: EChartOption = {
          tooltip: {
            trigger: 'axis',
            show: true,
          },
          xAxis: {
            type: 'category',
            data: dateList,
          },
          yAxis: {
            type: 'value',
            splitArea: {
              show: false
            },
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            backgroundColor: 'transparent',
            tooltip: {
              trigger: 'axis',
              show: true,
              axisPointer: {
                type: 'none'
              }
            },
          },
          series: [
            {
              data: countList,
              type: 'line',
              smooth: true,
            },
          ]
        };

        const barOption: EChartOption = {
          tooltip: {
            trigger: 'item'
          },
          color: ['#4FA8F9'],
          legend: {},
          grid: {
            left: '30%',
            right: '4%',
            bottom: '10%',
            backgroundColor: 'transparent'
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            splitArea: {
              show: false
            },
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          yAxis: {
            type: 'category',
            data: merList,
          },
          series: [
            {
              barMaxWidth: 30,
              name: '',
              type: 'bar',
              data: numList,
              label: {
                show: true,
                position: 'right',
                valueAnimation: true
              },
            },
          ]
        }

        const pieoption: EChartOption = {
          tooltip: {
            trigger: 'item',
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          color: ['#4FA8F9', '#FFB73B', '#f56060'],
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: [
                {
                  value: userInfo.value?.refresh?.receiveTotal || 0,
                  name: '收款金额',
                },
                {
                  value: userInfo.value?.refresh?.refundTotal || 0,
                  name: '退款金额',
                },
                {
                  value: userInfo.value?.refresh?.serviceTotal || 0,
                  name: '手续费',
                },
              ]
            }
          ]
        };

        echarts.value.setOption(option);
        barEachart.value.setOption(barOption);
        pieecharts.value.setOption(pieoption);
      }
    });

    return {
      linksChartRef,
      userInfo,
      pieChartRef,
      getData,
      target,
      barChartRef
    };
  },
});
</script>
<style lang='scss' scoped>
.top-card {
  margin-bottom: 20px;

  .top-data-box {
    >ul {
      display: flex;
      align-items: center;
      justify-content: space-between;

      >li {
        width: 25%;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        margin-right: 20px;
        background-color: #fff;

        &:last-child {
          margin-right: 0;
        }

        .top-box {
          padding: 20px;
          border-bottom: 1px solid #ddd;

          .top-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .num {
            margin-top: 20px;

            span {
              font-size: 36px;
            }
          }
        }

        .botom-box {
          padding: 20px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
}



.botom-card {
  .top-box {
    padding-bottom: 20px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .line-box {
    padding: 20px 0;
    border-bottom: 1px solid #ddd;

    .chart {
      height: 100%;
      height: 465px;
    }
  }

  .botom-map {
    display: flex;
    align-items: center;

    .bar {
      width: 60%;
      border-right: 1px solid #ddd;

      .barChart {
        width: 100%;
        height: 100%;
      }
    }

    .pie {
      width: 50%;

      >span {
        margin-left: 20px;
      }

      .pieChart {
        width: 100%;
        height: 100%;
      }
    }

    >div {
      height: 465px;
      padding: 20px 0;
    }
  }
}
</style>
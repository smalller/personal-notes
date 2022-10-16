<template>
  <div>
    <el-drawer
      :visible.sync="drawerStatus"
      custom-class="information-drawer-box"
      :before-close="handleClose"
      destroy-on-close
      z-index="99999"
      :modal="true"
    >
      <div class="wrap">
        <div class="manage-header">
          <img :src="require('../../assets/school-list/top-data3.png')" />
          <div class="manage-class">
            <p class="school-name">金树丫第一幼儿园高新分校</p>
            <p class="date">开通截止时间：2021-08-24</p>
          </div>
        </div>
        <div class="data-box">
          <ul>
            <li v-for="(item, index) in dataList" :key="index">
              <span class="num">{{ item.num }}</span>
              <span class="name">{{ item.name }}</span>
            </li>
            <li class="chart-data">
              <div class="left-chart">
                <canvas
                  id="drawer-graph-canvas"
                  width="160"
                  height="160"
                ></canvas>
              </div>
              <div class="right-data">
                <p>入驻App率</p>
                <div class="graph-data-box">
                  <div class="top">
                    <span class="diam"></span>
                    <span class="data">已入驻 2650人</span>
                  </div>
                  <div class="botom">
                    <span class="diam"></span>
                    <span class="data">未入驻 2650人</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="tabs-box">
          <Tabs :top-type-list="tabsList" @changeTopType="changeTabs"></Tabs>
        </div>
        <div class="filter-box">
          <TableCom :current-type="currentType"></TableCom>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { CircularChat } from '@/cms/common/circularChat'
  import Tabs from './tabs.vue'
  import TableCom from './table.vue'

  export default {
    components: {
      Tabs,
      TableCom,
    },
    data() {
      return {
        drawerStatus: false,
        currentType: 1,
        dataList: [
          {
            num: 23,
            name: '班级数',
          },
          {
            num: 23,
            name: '职工数',
          },
          {
            num: 23,
            name: '幼儿数',
          },
          {
            num: 23,
            name: '会员数',
          },
          {
            num: 23,
            name: '已开通时间',
          },
        ],
        tabsList: [
          {
            label: '园所幼儿',
            value: 1,
          },
          {
            label: '幼儿家长',
            value: 2,
          },
          {
            label: '园所老师',
            value: 3,
          },
          {
            label: '园所监控',
            value: 4,
          },
        ],
      }
    },
    mounted() {},
    methods: {
      // 关闭抽屉
      handleClose() {
        this.drawerStatus = false
        this.currentType = 1
      },
      // 打开抽屉
      handleOpen(res) {
        console.log(res)
        setTimeout(() => {
          const drawerGraphCanvas = document.getElementById(
            'drawer-graph-canvas'
          )
          new CircularChat({
            drawingElem: drawerGraphCanvas,
            percent: 90,
            lineWidth: 12,
            flag: 2,
            fontSize: 42,
          })
        }, 300)
        this.drawerStatus = true
      },
      // 切换标签页
      changeTabs(res) {
        this.currentType = res.value
      },
    },
  }
</script>

<style lang="scss">
  .el-drawer__wrapper {
    background: rgba(0, 0, 0, 0.5);
  }
  .el-drawer__header {
    margin-bottom: 0;
    padding: 0;
  }
  .information-drawer-box {
    width: 960px !important;
    .wrap {
      padding: 0 40px 40px;
      .manage-header {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        > img {
          width: 60px;
          height: 60px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 8px;
          margin-right: 15px;
        }
        .manage-class {
          .school-name {
            font-size: 24px;
            font-weight: 500;
            color: #222222;
            margin-bottom: 7px;
          }
          .date {
            font-size: 14px;
            color: #999999;
          }
        }
      }
      .data-box {
        width: 100%;
        background: #fafafa;
        padding: 18px 0 18px 36px;
        margin-bottom: 30px;
        > ul {
          display: flex;
          align-items: center;
          > li {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-right: 80px;
            .num {
              font-size: 24px;
              font-weight: bold;
              color: #222222;
              margin-bottom: 5px;
            }
            .name {
              font-size: 12px;
              color: #999999;
            }
            &.chart-data {
              margin-right: 0;
              flex-direction: inherit;
              .left-chart {
                width: 64px;
                height: 64px;
                margin-right: 12px;
                #drawer-graph-canvas {
                  width: 64px;
                  height: 64px;
                }
              }
              .right-data {
                > p {
                  margin-bottom: 5px;
                  font-size: 14px;
                  font-weight: 500;
                  color: #222222;
                }
                .graph-data-box {
                  font-size: 12px;
                  color: #222222;
                  .diam {
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                    margin-right: 6px;
                  }
                  .top {
                    margin-bottom: 8px;
                    .diam {
                      background: #4fa8f9;
                    }
                  }
                  .botom {
                    .diam {
                      background: #fc6392;
                    }
                  }
                }
              }
            }
          }
        }
      }
      .tabs-box {
        margin-bottom: 20px;
      }
    }
  }
</style>

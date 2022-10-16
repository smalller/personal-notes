<template>
  <basic-container>
    <div>
      <div class="container">
        <div class="top_box">
          <h2 class="title">
            <span class="line lw1"></span><span>商家后台管理系统</span>
          </h2>
          <div class="st">
            <div>
              <span class="top_num">{{ topData.followers }}</span>
            </div>
            <div>本店收藏总数</div>
          </div>
          <div class="st">
            <div>
              <span class="top_num">{{ topData.comments }}</span>
            </div>
            <div>当前评论条数</div>
          </div>
          <div class="st">
            <div class="star">
              <span>店铺评分</span>
              <el-rate
                disabled-void-icon-class="not el-icon-star-on"
                disabled-void-color="#b1b1b1!important"
                v-model="topData.star"
                disabled
                show-score
                text-color="#ff9900"
                score-template="{value}"
              ></el-rate>
            </div>
          </div>
          <div class="st">
            <div>
              <span class="top_num">{{ topData.hits }}</span>
              <span class="range">
                <img
                  v-if="topData.hitsML == '-'"
                  src="../../../static/img/xia.png"
                />
                <img v-else src="../../../static/img/shang.png" />
                {{ topData.rateHits }}
              </span>
            </div>
            <div>今日客访数</div>
          </div>
          <div class="st">
            <div>
              <span class="top_num">{{ topData.newCustomer }}</span>
              <span class="range">
                <img
                  v-if="topData.newCustomerML == '-'"
                  src="../../../static/img/xia.png"
                />
                <img v-else src="../../../static/img/shang.png" />
                {{ topData.rateNewCustomer }}
              </span>
            </div>
            <div>今日新增新用户</div>
          </div>
        </div>
        <div class="main_box">
          <div class="m_l">
            <div class="turnover_box box_css">
              <div class="column col_spe">
                <span class="line lw2"></span>
                <span>营业额</span>
              </div>
              <div
                ref="turnover"
                id="turnoverline"
                style="width: 98%; height: 500px"
              ></div>
            </div>

            <div class="reserve_box box_css">
              <div class="column col_spe">
                <span class="line lw2"></span>
                <span>开台数/预定桌数</span>
              </div>
              <div
                ref="reserve"
                id="reserveLine"
                style="width: 98%; height: 500px"
              ></div>
            </div>
          </div>
          <div class="m_m">
            <div class="visit_box box_css">
              <div class="column col_spe b_inp">
                <span class="line lw2"></span>
                <span>访问记录</span>
              </div>
              <div
                ref="visit"
                id="visitLine"
                style="width: 98%; height: 500px"
              ></div>
            </div>

            <div class="Top_goods box_css">
              <div class="column col_spe">
                <span class="line lw2"></span>
                <span>热销top榜</span>
              </div>
              <div
                ref="hotTop"
                id="hotTopLine"
                style="width: 98%; height: 500px"
              ></div>
            </div>
          </div>
          <div class="m_r box_css">
            <div class="to_view">
              <div>
                <span :class="day_mon == 1 ? 't_way' : ''" @click="day_mon = 1"
                  >按天数据统计</span
                >
              </div>
              <div>
                <span :class="day_mon == 2 ? 't_way' : ''" @click="day_mon = 2"
                  >按月数据统计</span
                >
              </div>
            </div>

            <div class="timeData">
              <div class="block">
                <el-date-picker
                  v-model="time_now"
                  type="month"
                  :clearable="false"
                  :editable="false"
                  @focus="focSta = true"
                  @blur="focSta = false"
                  @change="DaysChange"
                  :time-arrow-control="true"
                >
                </el-date-picker>
                <i
                  class="jt"
                  :class="focSta ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"
                ></i>
              </div>
              <div class="day_li" ref="day_li">
                <ul>
                  <div class="choose" ref="choose"></div>
                  <li
                    ref="day"
                    :style="{ top: scrollY * 30 + 'px' }"
                    :class="active == index ? 'onAct' : ''"
                    v-for="(day, index) in days"
                    :key="index"
                  >
                    {{ day }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { topCollect, getChartList } from "@/api/store/statistic";
const echarts = require("echarts");
export default {
  data() {
    return {
      breadState: false,
      day_mon: 1,
      focSta: false,
      value2: "",
      time_now: "",
      days: "",
      i: 0,
      active: 7,
      scrollY: 0,
      b_inp: "",
      pingtai: [],
      topData: {},
      dayList: [], //新增用户/商家图表 天数
      accessStoreData: [], //商家前7条数据  集合
      accessStoreList: "", //商家访问 饼图  一条数据

      chartListArr: [],
      storeTurnover: [], //营业额
      storeVisit: [], //访问数，
      reserveList: [], //开台，预定
    };
  },
  created() {
    this.time_now = this.$regular.timeData(new Date().getTime(), 5);
    this.scrollY = -(new Date().getDate() - 8);
    this.active = new Date().getDate() - 1;
    this.days = this.timeDay(this.time_now);
    this.$nextTick(() => {
      let day = this.$refs.day;
      for (let i = 0; i < day.length; i++) {
        if (day[i].offsetTop == this.$refs.choose.offsetTop) {
          this.acitive = i;
          break;
        }
      }
    });
    this.getData();
    this.chartList();
  },
  watch: {
    b_inp(val) {
      this.getOneStore(val);
    },
    day_mon() {
      this.getData();
    },
  },
  mounted() {
    this.$refs.day_li.addEventListener("wheel", this.myFunction, true);
  },
  methods: {
    // 天数加0
    dayInit(time) {
      if (time < 10) {
        time = "0" + time;
        return time;
      }
      return time;
    },
    getData() {
      let data = {
        isDay: this.day_mon,
      };
      topCollect(data).then((res) => {
        if (res.data.code == 200) {
          this.topData["hitsML"] = res.data.data.rateHits.substr(0, 1);
          this.topData["newCustomerML"] = res.data.data.rateNewCustomer.substr(
            0,
            1
          );
          this.topData = res.data.data;
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },

    chartList() {
      let data = {
        isDay: this.day_mon,
        date: this.time_now + "-" + this.dayInit(this.active + 1),
      };
      getChartList(data).then((res) => {
        if (res.data.code == 200) {
          this.chartListArr = res.data.data;
          res.data.data.forEach((v) => {
            this.storeTurnover.push(v.turnover);
            this.storeVisit.push(v.hits);
            this.dayList.push(v.date);
            this.reserveList.push(
              (v.date + "," + v.orderPreset + "," + v.orderArrive).split(",")
            );
          });
          this.turnoverChart();
          this.reserveChart();
          this.visitChart();
        } else {
          this.$message.warning(res.data.msg);
        }
      });
    },

    debounce(fn, wait) {
      var timeout = null;
      if (this.fun !== null) {
        clearTimeout(this.fun);
      }
      this.fun = setTimeout(fn, wait);
    },
    // 滚动监听
    myFunction(e) {
      e.stopPropagation();
      e.preventDefault();
      if (e.wheelDelta > 0) {
        if (this.active == this.days - 1) {
          this.active = this.days - 1;
          return;
        }
        this.scrollY -= 1;
        this.active += 1;
      } else {
        if (this.active == 0) {
          this.active = 0;
          return;
        }
        this.scrollY += 1;
        this.active -= 1;
      }
      this.debounce(this.getData, 800);
    },
    DaysChange(val) {
      this.time_now = this.$regular.timeData(val, 5);
      this.days = this.timeDay(this.time_now);

      let poor = "";
      // 切换月份时  天数不够的  自动定位到选中月最后一天
      if (this.days < this.active + 1) {
        poor = this.active + 1 - this.days;
        this.scrollY = this.scrollY + poor;
        this.active = this.days - 1;
      }
      this.getData();
      this.getOneStore(this.b_inp);
    },
    // 日期选择
    timeDay(time) {
      let trr = time.split("-");
      let day = new Date(trr[0], trr[1], 0).getDate();
      return day;
    },
    // 营业额
    turnoverChart() {
      let turnoverline = echarts.init(this.$refs.turnover);
      window.addEventListener("resize", function () {
        turnoverline.resize();
      });
      let option = {
        dataZoom: {
          type: "inside",
        },
        tooltip: {
          trigger: "axis",
        },
        color: [
          "#0081ff",
          "#1cbbb4",
          "#e54d42",
          "#a5673f",
          "#39b54a",
          "#f37b1d",
        ],
        legend: {},
        grid: {
          left: "3%",
          bottom: "5%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}//隐藏下载图标
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dayList,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "营业额",
            type: "line",
            data: this.storeTurnover,
          },
        ],
      };

      // 使用刚指定的配置项和数据显示图表。
      turnoverline.setOption(option);
    },
    // 商家开台/预定
    reserveChart() {
      this.reserveList.unshift(
        ("product" + "," + "预定数" + "," + "开台数").split(",")
      );
      let reserveLine = echarts.init(this.$refs.reserve);
      window.addEventListener("resize", function () {
        reserveLine.resize();
      });
      let option = {
        color: ["#f0d264", "#82c8a0", "#7fccde", "#6698cb", "#cb99c5"],
        legend: {
          data: ["product", "预定数", "开台数"],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        dataZoom: {
          type: "inside",
        },
        grid: {
          left: "3%",
          bottom: "5%",
          containLabel: true,
        },
        dataset: {
          source: this.reserveList,
        },
        xAxis: { type: "category", data: this.dayList },
        yAxis: {},
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
          },
          { type: "bar" },
        ],
      };

      reserveLine.setOption(option);
    },
    //商家访问量storeVisit visit
    visitChart() {
      let visitLine = echarts.init(this.$refs.visit);
      window.addEventListener("resize", function () {
        visitLine.resize();
      });
      let option = {
        dataZoom: {
          type: "inside",
        },
        tooltip: {
          trigger: "axis",
        },
        color: [
          "#0081ff",
          "#1cbbb4",
          "#e54d42",
          "#a5673f",
          "#39b54a",
          "#f37b1d",
        ],
        legend: {},
        grid: {
          left: "3%",
          bottom: "5%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            // saveAsImage: {}//隐藏下载图标
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.dayList,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "访问量",
            type: "line",
            data: this.storeVisit,
          },
        ],
      };
      visitLine.setOption(option);
    },
  },
};
</script>

<style scoped lang="scss">
.star {
  width: 100%;
  height: auto;
  margin-top: 30px;
  position: relative;
}
@media screen and (max-width: 1400px) {
  .star {
    margin-top: 14px;
  }
}
.top_box {
  font-size: 14px;
  height: 80px;
  border-bottom: 1px solid #cecece;
  display: flex;
  padding: 15px 30px;
  align-items: center;
  justify-content: space-between;
  .st {
    width: 16.6%;
    display: inline-block;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    .top_num {
      color: #000;
      font-weight: bold;
      font-size: 30px;
      margin-bottom: 10px;
      margin-right: 5px;
    }
    .range {
      font-size: 14px;
      img {
        width: 10px;
      }
    }
  }
}

.main_box {
  font-size: 12px;
  display: flex;
  background: #ececec;
  padding: 15px;
  .m_l {
    flex: 0.45;
  }
  /deep/.m_m {
    flex: 0.35;
    .el-select {
      width: 40%;
      margin-left: 20px;
      height: 100%;
    }
  }
  .m_r {
    flex: 0.2;
    position: relative;
    background: #fff;
    padding-top: 15px;
    .to_view {
      z-index: 200;
      width: 125px;
      margin: 0 auto;
      text-align: center;
      height: 80px;
      div {
        span {
          color: #000;
          cursor: pointer;
        }
      }
      & > div:nth-child(1) {
        margin-bottom: 25px;
      }
      .t_way {
        border-bottom: 4px solid #409eff;
      }
    }
    .timeData {
      width: 125px;
      margin: 0 auto;
      margin-top: 25px;
      .block {
        position: relative;
        .jt {
          position: absolute;
          top: 7px;
          right: 18px;
        }
      }
      .day_li {
        height: 450px;
        overflow-y: scroll;
        ul {
          // position: relative;
        }
        li {
          height: 30px;
          line-height: 30px;
          text-align: center;
          cursor: pointer;
          position: relative;
        }
        .onAct {
          color: #000;
          font-weight: bold;
        }
      }
      /deep/ .el-input__inner {
        border: none;
        font-size: 16px;
        color: #000;
        height: 30px;
        line-height: 30px;
      }
      .day_li::-webkit-scrollbar {
        display: none;
      }
      .day_li {
        scrollbar-width: none;
      }
      .day_li {
        -ms-overflow-style: none;
      }
    }
  }
}

.box_css {
  width: 98%;
  margin-bottom: 15px;
  background: #fff;
  box-shadow: 0 0 4px#b5b5b5;
  border-radius: 8px;
}
.container {
  padding: 0;
}

.col_spe {
  margin: 0 0 20px 0;
  padding-left: 15px;
  padding-top: 15px;
}

.xtc {
  color: rgb(255, 102, 0);
  font-weight: 600;
  font-size: 1.2rem;
}
.xj {
  color: rgb(55, 55, 177);
  font-weight: 600;
}
.choose {
  position: absolute;
  font-weight: bold;
  font-size: 16px;
  width: 125px;
  height: 30px;
  top: 360px;
}
.choose::before {
  content: "";
  width: 40px;
  height: 1px;
  border-bottom: 2px solid #676767;
  display: inline-block;
  position: absolute;
  left: 0;
  top: 14px;
}
.choose::after {
  content: "";
  width: 40px;
  height: 1px;
  border-bottom: 2px solid #676767;
  display: inline-block;
  position: absolute;
  right: 0;
  top: 14px;
}
// element
.el-rate {
  display: inline-block;
  left: 10px;
  top: -4px;
  position: relative;
  /deep/.el-rate__icon {
    color: red !important;
    font-size: 1.7rem;
  }
  /deep/ .el-rate__decimal {
    color: red !important;
  }
  /deep/ .el-rate__text {
    left: -48px;
    top: -2px;
    font-size: 1.8rem;
    font-weight: bold;
    color: #000 !important;
  }
}
/deep/ .el-date-editor {
  width: 120px;
}
/deep/ .el-input__prefix {
  display: none;
}
</style>
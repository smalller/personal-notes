<template>
  <ui-card class="surveillanceVideo">
    <div class="title">监控视频</div>
    <div class="childBox">
      <div class="childItem">
        <div class="chartBox">
          <ui-echarts-pie :option="opt"></ui-echarts-pie>
        </div>
        <div class="info">
          <p>应出勤：<span>169 人</span></p>
          <p>已出勤：<span>120 人</span></p>
          <p>未出勤：<span>20 人</span></p>
        </div>
      </div>
    </div>
  </ui-card>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "surveillanceVideo",
  setup() {
    const opt = reactive({
      titleValue: "55%",
      title: "已开启",
      value: 60,
      isHome: true,
      data: [
        {
          value: 70,
          color: "#FFB73B",
        },
        {
          value: 30,
          color: "#F5F5F5",
        },
      ],
    });
    return { opt };
  },
});
</script>

<style scoped lang="less">
.surveillanceVideo {
  //max-width: 326px;
  flex: 25;
  height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 24px;
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
    width: 160px;
    height: 160px;
  }
  .info {
    margin-top: 20px;
    p {
      padding-bottom: 8px;
      font-size: 14px;
      font-weight: 400;
      color: #676767;
      span {
        color: #222222;
        font-weight: bold;
      }
    }
  }
}
</style>

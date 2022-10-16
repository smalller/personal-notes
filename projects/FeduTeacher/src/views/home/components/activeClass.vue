<template>
  <ui-card class="activeClass">
    <div class="title">班级活跃</div>
    <div class="chartBox">
      <ui-echarts-bar :option="options"></ui-echarts-bar>
    </div>
  </ui-card>
</template>

<script>
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "activeClass",
  setup() {
    const options = reactive({
      title: "已开启",
      name: ["太阳班", "太阳班1", "太阳班2", "太阳班3", "太阳班4", "太阳班5"],
      data: [100, 200, 400, 450, 500, 600],
    });
    return { options };
  },
});
</script>

<style scoped lang="less">
.activeClass {
  //max-width: 956px;
  min-width: 300px;
  flex: 59;
  height: 360px;
  box-sizing: border-box;
  margin-left: 24px;
  .title {
    width: 100%;
    font-size: 20px;
    font-weight: 400;
    text-align: left;
    color: #222222;
  }
  .chartBox {
    width: 100%;
    height: 270px;
  }
}
</style>

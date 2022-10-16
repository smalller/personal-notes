<template>
  <div class="largeScreenHead">
    <h1>金树丫教育数据中心</h1>
    <div id="showTime" class="time">{{ time }}</div>
  </div>
</template>

<script>
  export default {
    name: 'LargeScreenHead',
    data() {
      return {
        time: '2021年11月01日 星期一 05:47:53',
      }
    },
  }
</script>

<style scoped lang="scss">
  .largeScreenHead {
    height: 1.05rem;
    background: url(../images/head_bg.png) no-repeat center center;
    background-size: 100% 100%;
    position: relative;
    z-index: 2;
    h1 {
      color: #fff;
      text-align: center;
      font-size: 0.4rem;
      line-height: 0.75rem;
      img {
        width: 1.5rem;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
  .time {
    position: absolute;
    right: 0.15rem;
    top: 0;
    line-height: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.23rem;
    padding-right: 0.1rem;
    // font-family: electronicFont;
  }
</style>

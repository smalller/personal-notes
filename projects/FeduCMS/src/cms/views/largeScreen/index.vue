<template>
  <div class="largeScreen">
    <large-screen-bg />
    <div class="largeScreenContent">
      <large-screen-head></large-screen-head>
      <div class="largeScreenBody">
        <div class="left">
          <notice></notice>
          <screen-active></screen-active>
          <screen-trend></screen-trend>
        </div>
        <div class="center">
          <school-number></school-number>
          <screen-statistics />
          <screen-student />
        </div>
        <div class="right">
          <screen-distribution />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LargeScreenBg from './components/largeScreenBg.vue'
  import SchoolNumber from './components/schoolNumber.vue'
  import LargeScreenHead from './components/largeScreenHead.vue'
  import Notice from './components/notice.vue'
  import ScreenActive from './components/screenActive.vue'
  import ScreenTrend from './components/screenTrend.vue'
  import ScreenDistribution from './components/screenDistribution.vue'
  import ScreenStatistics from './components/screenStatistics.vue'
  import ScreenStudent from './components/screenStudent.vue'

  export default {
    components: {
      ScreenTrend,
      ScreenActive,
      Notice,
      LargeScreenHead,
      SchoolNumber,
      LargeScreenBg,
      ScreenDistribution,
      ScreenStatistics,
      ScreenStudent,
    },
    data() {
      return {
        htmlWidth: 0,
        timer: 0,
      }
    },
    mounted() {
      this.getRem()
      this.timer = setInterval(() => {
        if (window.innerWidth !== this.htmlWidth) {
          location.reload()
        }
      }, 500)
    },
    destroyed() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      document.documentElement.style.fontSize = ''
    },
    methods: {
      getRem() {
        this.htmlWidth = window.innerWidth
        document.documentElement.style.fontSize = window.innerWidth / 20 + 'px'
      },
    },
  }
</script>

<style scoped lang="scss">
  .largeScreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;

    .item {
      width: 100px;
      height: 100px;
      padding: 50px;
    }
    .largeScreenContent {
      position: absolute;
      left: 0;
      top: 0;
      width: 100vw;
      height: 100vh;
    }
    .largeScreenBody {
      box-sizing: border-box;
      padding: 0 0.2rem;
      // height: calc(100vh - 1.08rem);
      display: grid;
      z-index: 2;
      grid-template-rows: repeat(1, 88vh);
      grid-template-columns: 5.73rem 7.92rem 5.73rem;
      // grid-row-gap: 14px;
      grid-column-gap: 0.1rem;
      .left {
        display: grid;
        grid-template-rows: auto repeat(2, 28.5vh);
        grid-row-gap: 0.16rem;
      }
      .right {
        height: auto;
        overflow: auto;
      }
      .center {
        display: grid;
        grid-template-rows: 1.6rem auto 1.22rem;
      }
    }
  }
</style>

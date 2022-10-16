<template>
  <div class="largeScreen">
    <large-screen-bg />
    <div class="largeScreenContent">
      <large-screen-head></large-screen-head>
      <div class="largeScreenBody">
        <div class="left">
          <!-- <notice></notice>
          <screen-active></screen-active>
          <screen-trend></screen-trend> -->
        </div>
        <div class="center">
          <!-- <school-number></school-number>
          <screen-statistics />
          <screen-student /> -->
        </div>
        <div class="right">
          <!-- <screen-video></screen-video>
          <screen-distribution />
          <screen-opening-rate /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LargeScreenBg from './components/largeScreenBg.vue'
  // import SchoolNumber from '@/views/largeScreen/components/schoolNumber.vue'
  import LargeScreenHead from './components/largeScreenHead.vue'
  // import Notice from '@/views/largeScreen/components/notice.vue'
  // import ScreenActive from '@/views/largeScreen/components/screenActive.vue'
  // import ScreenTrend from '@/views/largeScreen/components/screenTrend.vue'
  // import ScreenDistribution from './components/screenDistribution.vue'
  // import ScreenOpeningRate from './components/screenOpeningRate.vue'
  // import ScreenVideo from './components/screenVideo.vue'
  // import { locale } from 'dayjs'
  // import ScreenStatistics from './components/screenStatistics.vue'
  // import ScreenStudent from './components/screenStudent.vue'
  // import { LocaleInjectionKey } from 'element-plus'

  export default {
    components: {
      LargeScreenBg,
      LargeScreenHead,
    },
    data() {
      return {}
    },
  }
  // export default defineComponent({
  //   components: {
  //     ScreenTrend,
  //     ScreenActive,
  //     Notice,
  //     LargeScreenHead,
  //     SchoolNumber,
  //     LargeScreenBg,
  //     ScreenDistribution,
  //     ScreenOpeningRate,
  //     ScreenVideo,
  //     ScreenStatistics,
  //     ScreenStudent,
  //   },
  //   setup() {
  //     let htmlWidth = 0
  //     let timer = 0
  //     const getRem = () => {
  //       htmlWidth = window.innerWidth
  //       document.documentElement.style.fontSize = window.innerWidth / 20 + 'px'
  //     }
  //     onMounted(() => {
  //       getRem()
  //       // window.addEventListener("resize", () => {
  //       //   getRem();
  //       //   // if (timer) {
  //       //   //   clearTimeout(timer);
  //       //   //   timer = 0;
  //       //   // }
  //       //   // timer = setTimeout(() => {
  //       //   //   location.reload();
  //       //   // }, 300);
  //       // });
  //       timer = setInterval(() => {
  //         if (window.innerWidth !== htmlWidth) {
  //           location.reload()
  //         }
  //       }, 500)
  //     })
  //     onUnmounted(() => {
  //       if (timer) {
  //         clearInterval(timer)
  //       }
  //       document.documentElement.style.fontSize = ''
  //     })
  //     return {}
  //   },
  // })
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
        display: grid;
        grid-template-rows: 3.75rem auto 30%;
        grid-row-gap: 0.16rem;
      }
      .center {
        display: grid;
        grid-template-rows: 1.6rem auto 1.22rem;
      }
    }
  }
</style>

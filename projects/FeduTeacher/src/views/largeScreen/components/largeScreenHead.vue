<template>
  <div class="largeScreenHead">
    <h1>{{ school.schoolName }}教育数据中心</h1>
    <div class="time" id="showTime">{{ time }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onUnmounted, ref } from "vue";
import dayjs from "dayjs";
import { useStore } from "vuex";

export default defineComponent({
  name: "largeScreenHead",
  setup() {
    const $store = useStore();
    const time = ref("2021年11月01日 星期一 05:47:53");
    const schoolId = computed(() => $store.state.user.schoolId);
    const schoolList = computed(() => $store.state.user.schoolList);
    const school = schoolList.value.find(
      (item: any) => item.schoolId == schoolId.value
    );
    // const weeks: string[] = [
    //   "星期日",
    //   "星期一",
    //   "星期二",
    //   "星期三",
    //   "星期四",
    //   "星期五",
    //   "星期六",
    // ];
    const getTime = () => {
      time.value = dayjs().format("YYYY/MM/DD HH:mm:ss");
    };

    let timer: number = setInterval(() => {
      getTime();
    }, 1000);

    onUnmounted(() => {
      if (timer) {
        clearInterval(timer);
        timer = 0;
      }
    });
    return {
      time,
      school,
    };
  },
});
</script>

<style scoped lang="less">
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
  font-family: electronicFont;
}
</style>

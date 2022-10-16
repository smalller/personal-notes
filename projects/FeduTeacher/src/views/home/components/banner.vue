<template>
  <div
    class="banner swiper"
    ref="banner"
  >
    <div class="bannerBox swiper-wrapper">
      <div class="bannerItem swiper-slide">1</div>
      <div class="bannerItem swiper-slide">2</div>
      <div class="bannerItem swiper-slide">3</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import Swiper from "swiper";

import "swiper/swiper.less";
export default defineComponent({
  name: "banner",
  setup() {
    const banner = ref(null);
    onMounted(() => {
      const el = banner.value as any;

      const mySwiper = new Swiper(el, {
        direction: "horizontal",
        loop: true,
        speed: 500,
        autoplay: {
          delay: 1000,
          disableOnInteraction: false,
        },
      });
      setTimeout(() => {
        console.log(mySwiper);
      }, 2000);
      // mySwiper.autoplay.running = true;
    });
    return {
      banner,
    };
  },
});
</script>

<style scoped lang="less">
.banner {
  flex: 1;
  height: 200px;
  width: 400px;
  // padding: 30px 40px;
  overflow: hidden;
  .bannerBox {
    width: 100%;
    height: 100%;
  }
  .bannerItem {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    height: 200px;
    width: 400px;
    background: #eeeeee;
    opacity: 1;
    border-radius: 8px;
  }
}
</style>

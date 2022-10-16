<template>
  <div class="container scroll" id="container" @scroll="scrollEvent">
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import "./assets/normal.less";
import "./themes/select/index.less";
import "./themes/datePicker/index.less";
import "./themes/radio/index.less";
import "./themes/checkbox/index.less";
import "./base/commonStyle.less";
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup() {
    const $store = useStore();
    function scrollEvent() {
      const box = document.getElementById("container") as HTMLDivElement;
      // 如果元素的可见高度 + 元素的滚动条的垂直位置 >= 元素内容高度，则触底
      if (box?.clientHeight + box?.scrollTop >= box?.scrollHeight) {
        $store.commit("setTouchBottomFlag");
      }
    }
    return {
      scrollEvent,
    };
  },
});
</script>

<style scoped lang="less">
.container {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  right: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background: #f8f8f8;
}
</style>

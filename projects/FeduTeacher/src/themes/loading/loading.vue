<template>
  <div class="ui-loading-wrap">
    <div class="ui-loading-box">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "load",
  setup() {
    const visible = ref(true);

    return {
      visible,
    };
  },
});
</script>

<style scoped lang="less">
.ui-loading-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  z-index: 998;
  .ui-loading-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 20px;
    display: flex;
    justify-content: space-between;
    @-webkit-keyframes load {
      0%,
      100% {
        height: 20px;
        background: lightgreen;
      }
      50% {
        height: 40px;
        margin: -10px 0;
        background: lightblue;
      }
    }
    span {
      display: inline-block;
      width: 4px;
      height: 100%;
      border-radius: 2px;
      background: lightgreen;
      -webkit-animation: load 1s ease infinite;

      &:nth-child(2) {
        -webkit-animation-delay: 0.2s;
      }
      &:nth-child(3) {
        -webkit-animation-delay: 0.4s;
      }
      &:nth-child(4) {
        -webkit-animation-delay: 0.6s;
      }
      &:nth-child(5) {
        -webkit-animation-delay: 0.8s;
      }
    }
  }
}
</style>

<template>
  <div class="title">
    <span>{{ title }}</span>
    <div class="icon-box" v-if="tips">
      <ui-icon icon="icon-a-71" class="icon"></ui-icon>
      <div class="tips">{{ tips }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    title: {
      type: String,
    },
    tips: {
      type: String,
    },
  },
});
</script>
<style lang="less" scoped>
.title {
  display: flex;
  align-items: center;

  > span {
    font-size: 20px;
    color: #222;
    margin-right: 5px;
  }

  .icon-box {
    position: relative;

    .icon {
      font-size: 15px;
      color: #d9d9d9;
    }

    &:hover .tips {
      display: block;
    }

    .tips {
      width: 142px;
      height: 45px;
      text-align: center;
      line-height: 45px;
      font-size: 14px;
      display: none;
      position: absolute;
      top: 27px;
      left: -8px;
      z-index: 999999;
      background-color: #fff;
      color: #222;
      border-radius: 4px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);

      &::before {
        display: block;
        content: "";
        position: absolute;
        top: -14px;
        left: 9px;
        width: 0;
        border: 7px solid transparent;
        border-bottom: 7px solid #fff;
      }
    }
  }
}
</style>

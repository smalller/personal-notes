<template>
  <div
    class="ui-timeLine"
    :style="{ height: top + 'px', marginTop: top + 'px' }"
  >
    <div
      :style="{ height: top * 2 + 'px' }"
      :class="[
        index + 1 == length || +length === 0
          ? 'ui-timeLine-last'
          : 'ui-timeLine-tail',
      ]"
    ></div>
    <div
      class="ui-timeLine-dot"
      :style="{ backgroundColor: color, marginLeft: 2 + 'px' }"
    >
      <span>{{ index }}</span>
    </div>
    <div class="ui-timeLine-labelbox" :style="{ paddingLeft: left + 'px' }">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const Component = defineComponent({
  name: "ui-time-line",
  props: {
    top: {
      type: [Number, String],
      default: 0,
    },
    color: {
      type: String,
      default: "#4FA8F9",
    },
    index: {
      type: [Number, String],
      default: 0,
    },
    length: {
      type: [Number, String],
      default: 0,
    },
    left: {
      type: [Number, String],
      default: 20,
    },
  },
});

export default Component;
</script>

<style scoped lang="less">
.ui-timeLine {
  display: flex;
  position: relative;
  .ui-timeLine-tail {
    left: 15px;
    top: 24px;
    position: relative;
    // height: 100%;
    border-left: 2px solid #4fa8f9;
  }
  .ui-timeLine-tail :last-child {
    border-left: none;
  }
  .ui-timeLine-last {
    border: none;
    margin-left: 2px;
  }
  .ui-timeLine-content {
    position: relative;
    padding-bottom: 20px;
    list-style: none;
  }
  .ui-timeLine-dot {
    height: 24px;
    width: 24px;
    border-radius: 50%;
    opacity: 1;
    text-align: center;
    span {
      font-size: 12px;
      display: block;
      color: #ffffff;
      padding-top: 15%;
      font-weight: 400;
      display: inline-block;
    }
  }

  .ui-timeLine-labelbox {
    padding-left: 30px;
  }
}
</style>

<template>
  <div class="ui-tab">
    <div
      :class="{ 'ui-tab-active': tabIndex === index }"
      v-for="(item, index) in list"
      :key="item"
      @click="tabChange(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "ui-tab",
  // model: {
  //   prop: "index",
  //   event: "update",
  // },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
    index: {
      type: Number || String,
      default: 0,
    },
  },
  emits: {
    "update:index": null,
    change: null,
  },
  setup(props, context) {
    const tabIndex = ref(props.index);
    const tabChange = (index: number): void => {
      tabIndex.value = index;
      context.emit("update:index", index);
      context.emit("change", index);
    };

    watch(
      () => props.index,
      (newValue: number): void => {
        tabIndex.value = newValue;
      }
    );
    return {
      tabIndex,
      tabChange,
    };
  },
});
</script>

<style scoped lang="less">
.ui-tab {
  display: flex;
  user-select: none;
  > div {
    font-size: 20px;
    cursor: pointer;
    font-weight: 400;
    margin-left: 32px;
    color: #222222;
    display: flex;
    align-items: center;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    &:first-child {
      margin-left: 0;
    }
  }
  .ui-tab-active {
    color: #ff9900;
    border-bottom: 2px solid #ff9900;
  }
}
</style>

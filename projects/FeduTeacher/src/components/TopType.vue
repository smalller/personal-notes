<template>
  <div class="type-box">
    <div
      :class="['type-item', currentType == item.value ? 'is-selected' : '']"
      v-for="item in topTypeList"
      :key="item.value"
      @click="handleClick(item)"
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { TopTypeListItem } from "@/utils/common";

export default defineComponent({
  props: {
    topTypeList: {
      type: Array,
      required: true,
    },
    current: {
      type: Number,
    },
  },

  emits: ["changeTopType"],

  setup(props, cxt) {
    const currentType = ref(1);

    const current = computed(() => props.current);
    if (current.value) {
      currentType.value = current.value;
    }

    const handleClick = (item: TopTypeListItem) => {
      currentType.value = item.value;
      cxt.emit("changeTopType", item);
    };

    return {
      currentType,
      handleClick,
    };
  },
});
</script>

<style lang="less" scoped>
.type-box {
  display: flex;

  .type-item {
    font-size: 20px;
    color: #222;
    margin-right: 32px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }

  .is-selected {
    color: #ff9900;
    border-bottom: 2px solid #ff9900;
  }
}
</style>

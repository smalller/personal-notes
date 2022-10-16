<template>
  <div class="container">
    <span class="label-title">{{ title }}</span>
    <ui-select
      :style="{
        width: width + 'px',
      }"
      v-model="selected"
      @change="handleSelect"
      :placeholder="placeholder"
    >
      <template v-if="title === '称谓'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.codeInfoName"
          :value="index"
        ></ui-select-option>
      </template>
      <template v-else-if="title === '班级'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.name"
          :value="index"
        ></ui-select-option>
      </template>
      <template v-else-if="title === '范围'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.name"
          :value="index"
        ></ui-select-option>
      </template>
      <template v-else-if="title === '年级'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.codeInfoName"
          :value="index"
        ></ui-select-option>
      </template>
      <template v-else-if="title === '学籍'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.label"
          :value="index"
        ></ui-select-option>
      </template>
      <template v-else-if="title === '状态'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.label"
          :value="index"
        ></ui-select-option>
      </template>
      <template v-else-if="title === '回访进度' || title === '家长意向'">
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.codeInfoName"
          :value="item.label"
        >
          <span :style="{ color: item.color }">{{ item.label }}</span>
        </ui-select-option>
      </template>
      <template v-else>
        <ui-select-option
          v-for="(item, index) in list"
          :key="index"
          :label="item.label"
          :value="index"
        ></ui-select-option>
      </template>
    </ui-select>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
export default defineComponent({
  name: "",
  props: {
    title: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    width: {
      type: [String, Number],
    },
    list: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    changeTabStatus: Boolean,
  },
  emits: ["handleSelect"],
  setup(props, ctx) {
    const selected = ref<number | null | string>(null);
    const handleSelect = () => {
      ctx.emit("handleSelect", props.list[selected.value as number]);
    };

    // 只要监听到值改变就初始化值
    watch(
      () => props.changeTabStatus,
      () => {
        selected.value = "";
      }
    );

    return {
      selected,
      handleSelect,
    };
  },
});
</script>
<style lang="less" scoped>
.container {
  display: flex;
  align-items: center;

  .label-title {
    min-width: 28px;
    color: #999;
    font-size: 14px;
    margin-right: 6px;
  }
}
</style>

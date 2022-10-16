<template>
  <el-select v-bind="$attrs" class="ui-select" @change="onChange">
    <slot></slot>
  </el-select>
</template>
<script lang="ts">
import { defineComponent, inject } from "vue";
export type Validate = () => void;

export default defineComponent({
  name: "ui-select",
  setup() {
    // 注入父组件form-item中的验证函数
    const validate = inject("validate") as Validate;

    const onChange = () => {
      validate && validate();
    };

    return {
      onChange,
    };
  },
});
</script>
<style lang="less">
</style>

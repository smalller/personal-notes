<template>
  <el-option v-bind="$attrs">
    <slot></slot>
  </el-option>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ui-select-option",
});
</script>
<style lang="less" scoped></style>

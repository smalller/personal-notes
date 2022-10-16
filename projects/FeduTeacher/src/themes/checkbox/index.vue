<template>
  <el-checkbox v-bind="$attrs">
    <slot></slot>
  </el-checkbox>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ui-checkbox",
});
</script>
<style lang="less" scoped></style>

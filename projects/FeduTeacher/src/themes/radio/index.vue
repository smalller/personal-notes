<template>
  <el-radio v-bind="$attrs">
    <slot></slot>
  </el-radio>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ui-radio",
});
</script>
<style lang="less" scoped></style>

<template>
  <el-checkbox-group v-bind="$attrs">
    <slot></slot>
  </el-checkbox-group>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ui-checkbox-group",
});
</script>
<style lang="less" scoped></style>

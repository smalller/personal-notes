<template>
  <el-radio-group v-bind="$attrs">
    <slot></slot>
  </el-radio-group>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "ui-radio-group",
});
</script>
<style lang="less" scoped></style>

<template>
  <div class="ui-card">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ui-card",
});
</script>

<style lang="less" scoped>
.ui-card {
  background: #fff;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  padding: 30px 40px;
}
</style>

<template>
  <span :class="['ui-tag', type ? 'ui-tag-' + type : '']">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ui-tag",

  props: {
    type: {
      type: String,
      default: "default",
      validator: (val: string) => {
        return ["default", "primary", "success", "danger"].includes(val);
      },
    },
  },
});
</script>

<style lang="less" scoped>
.ui-tag {
  display: inline-block;
  text-align: center;
  padding: 3px 9px;
  font-size: 12px;
  border-radius: 4px;
  color: #4fa8f9;
}

.ui-tag-default {
  border: 1px solid #4fa8f9;
}

.ui-tag-primary {
  background-color: #f5f8fc;
}

.ui-tag-success {
  color: #42c7c6;
  background-color: #f5fbfc;
}

.ui-tag-danger {
  color: #f56060;
  background-color: #fcf5f5;
}
</style>

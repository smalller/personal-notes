<template>
  <ui-modal
    v-model:visible="modalStatus"
    @close="handleClose"
    @ok="handleSure"
    :title="title"
    :width="width"
    :tips="false"
  >
    <div class="body-text-box">
      <slot></slot>
    </div>
  </ui-modal>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: {
    width: {
      type: [String, Number],
    },
  },
  emits: ["handleSure"],
  setup(props, ctx) {
    const modalStatus = ref(false);
    let title = ref("");

    // 打开模态框
    const handleOpen = (text: string) => {
      title.value = text;
      modalStatus.value = true;
    };

    // 取消按钮
    const handleClose = () => {
      modalStatus.value = false;
    };

    // 确认按钮
    const handleSure = () => {
      ctx.emit("handleSure");
      modalStatus.value = false;
    };

    return {
      handleClose,
      handleSure,
      handleOpen,
      modalStatus,
      title,
    };
  },
});
</script>

<style lang="less" scoped>
.body-text-box {
  margin: 28px 0 40px 0;
}
</style>

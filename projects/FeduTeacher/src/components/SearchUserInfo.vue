<template>
  <div>
    <ui-input
      maxlength="40"
      style="width: 240px"
      v-model="searchInfo"
      placeholder="输入姓名或手机号"
      icon="icon-a-101"
      @keydown.enter="handleSearchInfo"
      @iconClick="handleIconClick"
    ></ui-input>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { throttle } from "@/utils/common";

export default defineComponent({
  props: {
    value: String,
  },
  setup(props, ctx) {
    const searchInfo = ref(props.value);

    // 回车搜索事件
    const handleSearchInfo = () => {
      ctx.emit("handleSearchInfo", searchInfo.value);
    };

    // 小图标搜索事件
    const handleIconClick = (): void => {
      ctx.emit("handleSearchInfo", searchInfo.value);
    };

    // 边输入边搜索
    watch(
      () => searchInfo.value,
      () => {
        throttle(() => {
          // ctx.emit("handleInputSearchInfo", searchInfo.value);
          ctx.emit("update:value", searchInfo.value);
        }, 500);
      }
    );

    return {
      searchInfo,
      handleSearchInfo,
      handleIconClick,
    };
  },
});
</script>
<style lang="less" scoped></style>

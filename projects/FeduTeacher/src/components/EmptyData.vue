<template>
  <div class="empty-data">
    <ui-icon icon="icon-a-zu2403" class="icon"></ui-icon>
    暂未找到相关数据
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
});
</script>
<style lang="less" scoped>
.empty-data {
  background-color: #f7f7f7;
  border-radius: 6px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: #999999;
  font-size: 12px;

  .icon {
    font-size: 50px;
    color: #ffb73b;
    margin-bottom: 15px;
  }
}
</style>

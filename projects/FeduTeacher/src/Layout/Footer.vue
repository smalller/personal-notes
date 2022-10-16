<template>
  <div class="main-footer">
    <span>Copyright @ 幼儿园管理系统 2021 FLTD</span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "main-footer",
});
</script>

<style scoped lang="less">
.main-footer {
  width: 100vw;
  height: 167px;
  display: flex;
  justify-content: center;
  span {
    margin-top: 100px;
    font-size: 12px;
    font-weight: 400;
    text-align: center;
    color: #999999;
  }
}
</style>

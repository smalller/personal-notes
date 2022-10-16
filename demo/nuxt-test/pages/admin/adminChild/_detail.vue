<template>
  <!-- 路由传参，文件名就是要通过url地址栏传参的变量名 -->
  <div>
    adminChild的传值页面（也是adminChild的子页面）
    {{ $route.params.detail }}
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

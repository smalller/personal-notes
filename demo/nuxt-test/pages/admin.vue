<template>
  <div>
    admin页面
    <!-- nuxt-child表示嵌套关系，类似于router-view -->
    <!-- 注：要给该路由添加子路由，必须创建一个同名的文件夹，文件夹里面的文件就表示子路由 -->
    <nuxt-child></nuxt-child>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>

<template>
  <div class="menu1-container">
    <el-alert :closable="false" title="嵌套路由 1" type="success">
      <router-view />
    </el-alert>
  </div>
</template>

<script>
  export default {
    name: 'Menu1',
  }
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-alert {
      padding: $base-padding;
      margin: 0;
    }
  }
</style>

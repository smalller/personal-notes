<template>
  <div class="test1-container">
    <h3>取值方式：this.params</h3>
    <el-alert
      :closable="false"
      :title="JSON.stringify(route)"
      show-icon
      type="success"
    ></el-alert>
  </div>
</template>
<script>
  export default {
    name: 'Test1',
    data() {
      return {
        route: {},
      }
    },
    watch: {
      $route: {
        handler(route) {
          this.route = {
            path: route.matched[route.matched.length - 1].path,
            params: route.params,
            query: route.query,
            name: route.name,
            meta: route.meta,
          }
        },
        immediate: true,
      },
    },
  }
</script>

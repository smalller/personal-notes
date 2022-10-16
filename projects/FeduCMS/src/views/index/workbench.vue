<template>
  <div class="workbench-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <order />
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="16" :xl="18">
        <target />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Order from './components/Order'
  import Target from './components/Target'

  export default {
    name: 'Workbench',
    components: {
      Order,
      Target,
    },
  }
</script>
<style lang="scss" scoped>
  .workbench-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;
  }
</style>

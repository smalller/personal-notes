<template>
  <div class="errorLog-container">
    <el-alert
      :closable="false"
      title="这里会在顶部navbar上模拟一个控制台错误日志"
      show-icon
      type="success"
    ></el-alert>
    <el-button type="primary" @click="handleError">
      点击模拟一个chuzhixinjiayou的错误
    </el-button>
    <error-test v-if="show" />
  </div>
</template>

<script>
  import ErrorTest from './components/ErrorTest'

  export default {
    name: 'ErrorLog',
    components: { ErrorTest },
    data() {
      return { show: false }
    },
    methods: {
      handleError() {
        this.show = true
      },
    },
  }
</script>

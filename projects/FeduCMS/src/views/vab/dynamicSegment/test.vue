<template>
  <div class="test-container">
    <el-button @click="handleLink1">params无问号传参</el-button>
    <el-button @click="handleLink2">query有问号传参</el-button>
  </div>
</template>
<script>
  import { uuid } from '@/utils'
  export default {
    name: 'Test',
    data() {
      return {}
    },
    methods: {
      handleLink1() {
        this.$router.push(`/vab/dynamicSegment/test1/${uuid()}`)
      },
      handleLink2() {
        this.$router.push(`/vab/dynamicSegment/test2?id=${uuid()}`)
      },
    },
  }
</script>

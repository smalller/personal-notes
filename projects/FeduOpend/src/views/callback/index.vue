<template>
  <div class="callback-container"></div>
</template>

<script>
  import { callback } from '@/utils/social'

  let loading = null
  export default {
    name: 'Callback',
    created() {
      loading = this.$baseLoading()
      callback()
      window.close()
    },
    beforeDestroy() {
      loading.close()
    },
  }
</script>

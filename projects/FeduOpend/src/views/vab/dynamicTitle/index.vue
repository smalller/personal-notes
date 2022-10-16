<template>
  <div class="dynamic-title-container">
    <el-button @click="handleTitle(defaultTitle, 'vab-demo')">
      标题变更为 vab-demo
    </el-button>
    <el-button @click="handleTitle('vab-demo', defaultTitle)">
      还原为默认标题
    </el-button>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import getPageTitle from '@/utils/pageTitle'
  export default {
    name: 'DynamicTitle',
    data() {
      return {
        defaultTitle: this.$route.meta.title,
      }
    },
    methods: {
      ...mapActions({
        changeRouteTitle: 'tabsBar/changeRouteTitle',
      }),
      async handleTitle(defaultTitle, currentTitle) {
        document.title = await getPageTitle(currentTitle)
        this.changeRouteTitle({
          defaultTitle,
          currentTitle,
        })
      },
    },
  }
</script>

<template>
  <vab-remix-icon
    v-if="theme.showFullScreen"
    :icon="isFullscreen ? 'fullscreen-exit-fill' : 'fullscreen-fill'"
    @click="click"
  />
</template>

<script>
  import { mapGetters } from 'vuex'
  import screenfull from 'screenfull'

  export default {
    name: 'FullScreen',
    data() {
      return {
        isFullscreen: false,
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    mounted() {
      this.init()
    },
    beforeDestroy() {
      this.destroy()
    },
    methods: {
      click() {
        if (!screenfull.isEnabled) {
          this.$baseMessage('开启全屏失败', 'error')
          return false
        }
        screenfull.toggle()
        this.$emit('refresh')
      },
      change() {
        this.isFullscreen = screenfull.isFullscreen
      },
      init() {
        if (screenfull.isEnabled) {
          screenfull.on('change', this.change)
        }
      },
      destroy() {
        if (screenfull.isEnabled) {
          screenfull.off('change', this.change)
        }
      },
    },
  }
</script>

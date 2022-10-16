<template>
  <div :class="classObj" class="vue-admin-beautiful-wrapper">
    <component
      :is="theme.layout"
      :collapse="collapse"
      :fixed-header="theme.fixedHeader"
      :show-tabs-bar="theme.showTabsBar"
      :device="device"
    ></component>
    <el-backtop />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { tokenName } from '@/config'

  export default {
    name: 'Layout',
    data() {
      return {
        isMobile: false,
        oldLayout: '',
      }
    },
    computed: {
      ...mapGetters({
        device: 'settings/device',
        collapse: 'settings/collapse',
        theme: 'settings/theme',
      }),
      classObj() {
        return {
          mobile: this.device === 'mobile',
        }
      },
    },
    beforeMount() {
      window.addEventListener('resize', this.handleLayouts)
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleLayouts)
    },
    mounted() {
      this.handleLayouts()
    },
    methods: {
      ...mapActions({
        updateTheme: 'settings/updateTheme',
        toggleDevice: 'settings/toggleDevice',
        foldSideBar: 'settings/foldSideBar',
        openSideBar: 'settings/openSideBar',
      }),
      handleLayouts() {
        const isMobile = document.body.getBoundingClientRect().width - 1 < 992
        if (this.isMobile !== isMobile) {
          if (isMobile) {
            this.oldLayout = this.theme.layout
            this.foldSideBar()
          } else {
            this.openSideBar()
          }
          this.updateTheme({ layout: isMobile ? 'vertical' : this.oldLayout })
          this.toggleDevice(isMobile ? 'mobile' : 'desktop')
          this.isMobile = isMobile
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .vue-admin-beautiful-wrapper {
    position: relative;
    width: 100%;
    height: 100%;

    /* 手机端开始 */
    &.mobile {
      ::v-deep {
        .el-pager,
        .el-pagination__jump {
          display: none;
        }
        .layout-container-vertical {
          .el-scrollbar.side-bar-container.is-collapse {
            width: 0;
          }
          .vab-main {
            width: 100%;
            margin-left: 0;
          }
        }
        .vab-main {
          .fixed-header {
            left: 0 !important;
            width: 100% !important;
          }
        }
      }
    }
    /* 手机端结束 */
  }
</style>

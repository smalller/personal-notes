<template>
  <!--画廊布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabsBar,
    }"
    class="layout-container-gallery"
  >
    <gallery-bar></gallery-bar>
    <div :class="collapse ? 'is-collapse-main' : ''" class="vab-main">
      <div :class="fixedHeader ? 'fixed-header' : ''" class="layout-header">
        <nav-bar />
        <tabs-bar v-if="showTabsBar" />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Gallery',
    props: {
      collapse: {
        type: Boolean,
        default() {
          return false
        },
      },
      fixedHeader: {
        type: Boolean,
        default() {
          return true
        },
      },
      showTabsBar: {
        type: Boolean,
        default() {
          return true
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  .layout-header {
    box-shadow: $base-box-shadow;
  }

  .layout-container-gallery {
    position: relative;

    .mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: $base-z-index - 1;
      width: 100%;
      height: 100vh;
      overflow: hidden;
      background: #000;
      opacity: 0.5;
    }

    &.fixed {
      padding-top: calc(#{$base-nav-bar-height} + #{$base-tabs-bar-height});
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-nav-bar-height;
    }

    .vab-main {
      position: relative;
      width: auto;
      min-height: 100%;
      margin-left: $base-left-menu-width;
      background: #f6f8f9;
      transition: $base-transition;

      ::v-deep {
        .fixed-header {
          position: fixed;
          top: 0;
          right: 0;
          left: $base-left-menu-width;
          z-index: $base-z-index - 2;
          width: $base-right-content-width;
          overflow: hidden;
          transition: $base-transition;
        }

        .nav-bar-container {
          position: relative;
          box-sizing: border-box;
        }

        .tabs-bar-container {
          box-sizing: border-box;
        }

        .app-main-container {
          width: calc(100% - #{$base-padding} - #{$base-padding});
          margin: $base-padding auto;
          background: $base-color-white;
          border-radius: $base-border-radius;
        }
      }

      &.is-collapse-main {
        margin-left: $base-left-menu-width-min;

        ::v-deep {
          .fixed-header {
            left: $base-left-menu-width-min;
            width: calc(100% - 65px);
          }
        }
      }
    }
  }
</style>

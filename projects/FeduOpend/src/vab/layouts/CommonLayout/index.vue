<template>
  <!--常规布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabsBar,
    }"
    class="layout-container-common"
  >
    <div :class="fixedHeader ? 'fixed-header' : ''" class="layout-header">
      <top-bar layout="common"></top-bar>
      <div>
        <side-bar layout="common"></side-bar>
        <div
          v-if="showTabsBar"
          :class="collapse ? 'is-collapse-main' : ''"
          class="vab-main"
        >
          <tabs-bar layout="common"></tabs-bar>
        </div>
      </div>
    </div>
    <div
      :class="collapse ? 'is-collapse-main' : ''"
      class="vab-main main-padding"
    >
      <app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Common',
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
      device: {
        type: String,
        default() {
          return 'desktop'
        },
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin fix-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: $base-z-index - 2;
    width: 100%;
    overflow: hidden;
    transition: $base-transition;
  }

  .layout-header {
    box-shadow: $base-box-shadow;
    z-index: 9999;
  }

  .layout-container-common {
    position: relative;
    ::v-deep {
      .tabs-content {
        width: calc(100% - 80px) !important;
      }
    }
    &.fixed {
      padding-top: calc(
        #{$base-top-bar-height} + #{$base-tabs-bar-height}
      ) !important;
    }

    &.fixed.no-tabs-bar {
      padding-top: $base-top-bar-height !important;
    }

    ::v-deep {
      .vab-main {
        width: 88%;
        margin: auto;
      }

      .fixed-header {
        @include fix-header;
      }

      .nav-bar-container {
        .fold-unfold {
          display: none;
        }
      }

      .main-padding {
        .app-main-container {
          margin-top: $base-padding;
          margin-bottom: $base-padding;
          background: $base-color-white;
        }
      }
    }
  }

  .layout-container-common {
    ::v-deep {
      .top-bar-container {
        .vab-main {
          width: 100%;
          margin: auto $base-padding;
        }
      }
    }
  }

  .layout-container-common {
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
          @include fix-header;

          left: $base-left-menu-width;
          width: $base-right-content-width;
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

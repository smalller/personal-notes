<template>
  <!-- 横向布局 -->
  <div
    :class="{
      fixed: fixedHeader,
      'no-tabs-bar': !showTabsBar,
    }"
    class="layout-container-horizontal"
  >
    <div :class="fixedHeader ? 'fixed-header' : ''" class="layout-header">
      <top-bar></top-bar>
      <div v-if="showTabsBar" :class="{ 'tag-bar-horizontal': showTabsBar }">
        <div class="vab-main">
          <tabs-bar></tabs-bar>
        </div>
      </div>
    </div>
    <div class="vab-main main-padding">
      <app-main />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Horizontal',
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
  .layout-header {
    box-shadow: $base-box-shadow;
  }

  .layout-container-horizontal {
    position: relative;

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
        width: 88% !important;
        margin: auto;
      }

      .fixed-header {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: $base-z-index - 2;
        width: 100%;
        overflow: hidden;
        transition: $base-transition;
      }

      .tag-bar-horizontal {
        background: $base-color-white;
        box-shadow: $base-box-shadow;
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

  .layout-container-horizontal {
    ::v-deep {
      .tabs-bar-container {
        padding-right: 0;
        padding-left: 0;
      }
    }
  }
</style>

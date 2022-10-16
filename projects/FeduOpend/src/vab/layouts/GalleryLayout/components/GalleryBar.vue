<template>
  <el-scrollbar
    :class="{ 'is-collapse': collapse }"
    class="gallery-bar-container"
  >
    <logo />
    <el-tabs
      v-model="firstMenu"
      tab-position="left"
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="item in handleRoutes"
        :key="item.path"
        :name="item.path"
      >
        <div
          slot="label"
          :title="translateTitle(item.meta.title)"
          class="gallery-grid"
        >
          <vab-remix-icon
            v-if="item.meta.remixIcon"
            :icon="item.meta.remixIcon"
            :is-custom-svg="item.meta.isCustomSvgIcon"
            class="vab-remix-icon"
          />
          {{ translateTitle(item.meta.title) }}
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-menu
      :background-color="variables['gallery-second-menu-background']"
      :default-active="activeMenu"
      :default-openeds="defaultOpens"
      :unique-opened="uniqueOpened"
      mode="vertical"
    >
      <el-divider>
        {{ translateTitle(groupTitle) }}
      </el-divider>
      <vab-menu
        v-for="route in partialRoutes"
        :key="route.path"
        :item="route"
      />
    </el-menu>
  </el-scrollbar>
</template>
<script>
  import { translateTitle } from '@/utils/i18n'
  import variables from '@/config/variables.scss'
  import { mapActions, mapGetters } from 'vuex'
  import { defaultOpeneds, openFirstMenu, uniqueOpened } from '@/config'

  export default {
    name: 'GalleryBar',
    data() {
      return {
        defaultOpens: defaultOpeneds,
        firstMenu: '',
        groupTitle: '',
        uniqueOpened,
        variables: variables,
      }
    },
    computed: {
      ...mapGetters({
        collapse: 'settings/collapse',
        routes: 'routes/routes',
        partialRoutes: 'routes/partialRoutes',
      }),
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) {
          return meta.activeMenu
        }
        return path
      },
      handleRoutes() {
        return this.routes.filter((item) => item.hidden !== true && item.meta)
      },
    },
    watch: {
      $route: {
        handler(route) {
          const firstMenu = route.matched[0].path || '/'
          if (this.firstMenu !== firstMenu) {
            this.firstMenu = firstMenu
            this.handleTabClick({ name: firstMenu }, true)
          }
        },
        immediate: true,
      },
    },
    methods: {
      translateTitle,
      ...mapActions({
        setPartialRoutes: 'routes/setPartialRoutes',
      }),
      handleTabClick(tab, mounted) {
        const childrenArr = this.routes.find(
          (item) => item.path === tab.name
        ).children
        this.setPartialRoutes(childrenArr)
        if (mounted !== true && openFirstMenu)
          this.$router.push(childrenArr[0].path)
        this.groupTitle = this.routes.find(
          (item) => item.path === tab.name
        ).meta.title
        this.$store.dispatch('settings/openSideBar')
      },
    },
  }
</script>
<style lang="scss" scoped>
  @mixin active {
    &:hover {
      color: $base-color-blue;
      background-color: $base-gallery-second-menu-background-active !important;

      i,
      svg {
        color: $base-color-blue;
      }
    }

    &.is-active {
      color: $base-color-blue;
      background-color: $base-gallery-second-menu-background-active !important;
    }
  }

  .gallery-bar-container {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: $base-z-index;
    width: $base-left-menu-width;
    height: 100vh;
    overflow: hidden;
    background: $base-gallery-second-menu-background;
    box-shadow: $base-box-shadow;
    transition: width $base-transition-time;

    .gallery-grid {
      width: $base-left-menu-width-min;
      height: $base-left-menu-width-min;
      padding-top: calc((#{$base-left-menu-width-min} - 55px) / 2);
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      word-break: break-all;
      white-space: nowrap;
      svg {
        display: block;
        height: 20px;
        margin: 10px auto -7px !important;
      }

      [class*='ri-'] {
        display: block;
        height: 20px;
        margin: auto;
      }
    }

    ::v-deep {
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }

      .el-tabs {
        position: fixed;
        width: $base-left-menu-width-min;

        .el-tabs__nav {
          height: calc(100vh - #{$base-logo-height});
          background: $base-gallery-first-menu-background;
        }

        .el-tabs__item {
          height: auto;
          padding: 0;
          color: $base-color-white;

          &.is-active {
            background: $base-color-blue;
          }
        }
      }

      .el-tabs__active-bar.is-left,
      .el-tabs--left .el-tabs__nav-wrap.is-left::after {
        display: none;
      }

      .el-tabs + .el-menu {
        left: $base-left-menu-width-min;
        width: calc(#{$base-left-menu-width} - #{$base-left-menu-width-min});
        border: 0;
      }

      .el-menu {
        border: 0;

        .el-divider {
          margin: 0 0 $base-padding 0;
          background-color: #f6f6f6;

          &__text {
            color: $base-color-black;
          }
        }

        .vab-fas-icon {
          padding-right: 3px;
          font-size: $base-font-size-default;
        }

        .vab-remix-icon {
          padding-right: 3px;
          font-size: $base-font-size-default + 2;
        }

        .el-menu-item,
        .el-submenu__title {
          height: $base-menu-item-height;
          overflow: hidden;
          line-height: $base-menu-item-height;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;

          @include active;
        }
      }
    }

    &.is-collapse {
      ::v-deep {
        width: 0;
      }
    }
  }
</style>

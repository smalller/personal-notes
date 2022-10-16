<template>
  <div class="tabs-bar-container">
    <fold v-if="layout === 'common'" />
    <el-tabs
      v-model="tabActive"
      class="tabs-content"
      type="card"
      @tab-click="handleTabClick"
      @tab-remove="handleTabRemove"
    >
      <el-tab-pane
        v-for="item in visitedRoutes"
        :key="item.path"
        :name="item.path"
        :closable="!isAffix(item)"
        :label="translateTitle(item.meta.title)"
      />
    </el-tabs>

    <el-dropdown @command="handleCommand">
      <span class="more">
        {{ translateTitle('更多') }}
        <vab-remix-icon icon="arrow-down-s-line" />
      </span>
      <el-dropdown-menu slot="dropdown" class="tabs-more">
        <el-dropdown-item command="closeOthersTabs">
          {{ translateTitle('关闭其他') }}
        </el-dropdown-item>
        <el-dropdown-item command="closeLeftTabs">
          {{ translateTitle('关闭左侧') }}
        </el-dropdown-item>
        <el-dropdown-item command="closeRightTabs">
          {{ translateTitle('关闭右侧') }}
        </el-dropdown-item>
        <el-dropdown-item command="closeAllTabs">
          {{ translateTitle('关闭全部') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'

  export default {
    name: 'TabsBar',
    props: {
      layout: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        affixTabs: [],
        tabActive: '',
      }
    },
    computed: {
      ...mapGetters({
        visitedRoutes: 'tabsBar/visitedRoutes',
        routes: 'routes/routes',
      }),
    },
    watch: {
      $route: {
        handler(route) {
          this.$nextTick(() => {
            this.addTabs(route)
          })
        },
        immediate: true,
      },
    },
    created() {
      this.initAffixTabs(this.routes)
    },
    methods: {
      translateTitle,
      ...mapActions({
        addVisitedRoute: 'tabsBar/addVisitedRoute',
        delVisitedRoute: 'tabsBar/delVisitedRoute',
        delOthersVisitedRoutes: 'tabsBar/delOthersVisitedRoutes',
        delLeftVisitedRoutes: 'tabsBar/delLeftVisitedRoutes',
        delRightVisitedRoutes: 'tabsBar/delRightVisitedRoutes',
        delAllVisitedRoutes: 'tabsBar/delAllVisitedRoutes',
      }),
      handleTabClick(tab) {
        if (!this.isActive(tab.name))
          this.$router.push(this.visitedRoutes[tab.index])
      },
      initAffixTabs(routes) {
        routes.forEach((route) => {
          if (route.meta && route.meta.affix) this.addTabs(route, true)
          if (route.children) this.initAffixTabs(route.children)
        })
      },
      /**
       * 添加标签页
       * @param tag route
       * @param init 是否是从router获取路由
       * @returns {Promise<void>}
       */
      async addTabs(tag, init = false) {
        if (tag.name && tag.meta && tag.meta.tagHidden !== true) {
          const path = this.handleRouteRawPath(tag)
          await this.addVisitedRoute({
            path: path,
            query: tag.query,
            params: tag.params,
            name: tag.name,
            matched: init
              ? [tag.name]
              : tag.matched.map((item) => item.components.default.name),
            meta: { ...tag.meta },
          })
          this.tabActive = path
        }
      },
      /**
       * 根据原生路径删除多标签中的标签
       * @param rawPath 原生路径
       * @returns {Promise<void>}
       */
      async handleTabRemove(rawPath) {
        await this.delVisitedRoute(rawPath)
        if (this.isActive(rawPath)) this.toLastTab()
      },
      handleCommand(command) {
        switch (command) {
          case 'closeOthersTabs':
            this.closeOthersTabs()
            break
          case 'closeLeftTabs':
            this.closeLeftTabs()
            break
          case 'closeRightTabs':
            this.closeRightTabs()
            break
          case 'closeAllTabs':
            this.closeAllTabs()
            break
        }
      },
      /**
       * 删除其他标签页
       * @returns {Promise<void>}
       */
      async closeOthersTabs() {
        await this.delOthersVisitedRoutes(this.handleRouteRawPath(this.$route))
      },
      /**
       * 删除左侧标签页
       * @returns {Promise<void>}
       */
      async closeLeftTabs() {
        await this.delLeftVisitedRoutes(this.handleRouteRawPath(this.$route))
      },
      /**
       * 删除右侧标签页
       * @returns {Promise<void>}
       */
      async closeRightTabs() {
        await this.delRightVisitedRoutes(this.handleRouteRawPath(this.$route))
      },
      /**
       * 删除所有标签页
       * @returns {Promise<void>}
       */
      async closeAllTabs() {
        await this.delAllVisitedRoutes()
        if (
          !this.affixTabs.some((tag) =>
            this.isActive(this.handleRouteRawPath(tag))
          )
        )
          this.toLastTab()
      },
      /**
       * 跳转最后一个标签页
       */
      toLastTab() {
        const latestView = this.visitedRoutes.slice(-1)[0]
        if (latestView) this.$router.push(latestView)
        else this.$router.push('/')
      },
      isActive(path) {
        return path === this.handleRouteRawPath(this.$route)
      },
      isAffix(tag) {
        return tag.meta && tag.meta.affix
      },
      /**
       * 获取原生路由地址
       * @param route route
       * @returns {string|*} 原生路由地址
       */
      handleRouteRawPath(route) {
        return route.matched
          ? route.matched[route.matched.length - 1].path
          : route.path
      },
    },
  }
</script>

<style lang="scss" scoped>
  .tabs-bar-container {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: space-between;
    height: $base-tabs-bar-height;
    padding-right: $base-padding;
    padding-left: $base-padding;
    user-select: none;
    background: $base-color-white;
    border-top: 1px solid #f6f6f6;

    ::v-deep {
      .fold-unfold {
        margin-right: $base-padding;
      }
    }

    .tabs-content {
      width: calc(100% - 70px);
      height: $base-tag-item-height;

      ::v-deep {
        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $base-tag-item-height;
          line-height: $base-tag-item-height;
        }

        .el-tabs__header {
          border-bottom: 0;

          .el-tabs__nav {
            border: 0;
          }

          .el-tabs__item {
            box-sizing: border-box;
            height: $base-tag-item-height;
            margin-right: 5px;
            line-height: $base-tag-item-height;
            border: 1px solid $base-border-color;
            border-radius: $base-border-radius;
            transition: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;

            &.is-active {
              color: $base-color-white;
              background: $base-color-blue;
              border: 1px solid $base-color-blue;
            }
          }
        }
      }
    }

    .more {
      display: flex;
      align-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
</style>

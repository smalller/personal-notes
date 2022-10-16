<template>
  <div class="top-bar-container">
    <div class="vab-main">
      <el-row>
        <el-col :span="6">
          <logo />
        </el-col>
        <el-col v-if="layout === 'horizontal'" :span="11">
          <el-menu
            :active-text-color="variables['menu-color-active']"
            :background-color="variables['menu-background']"
            :default-active="activeMenu"
            :text-color="variables['menu-color']"
            menu-trigger="hover"
            mode="horizontal"
          >
            <template v-for="route in handleRoutes">
              <vab-menu
                v-if="!route.hidden"
                :key="route.path"
                :layout="layout"
                :item="route"
              />
            </template>
          </el-menu>
        </el-col>
        <el-col :span="layout === 'horizontal' ? 7 : 18">
          <div class="right-panel">
            <error-log />
            <search />
            <notice />
            <full-screen />
            <language />
            <theme class="hidden-md-and-down" />
            <refresh />
            <avatar />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import variables from '@/config/variables.scss'
  import { mapGetters } from 'vuex'

  export default {
    name: 'TopBar',
    props: {
      layout: {
        type: String,
        default: 'horizontal',
      },
    },
    data() {
      return {
        menuTrigger: 'hover',
      }
    },
    computed: {
      ...mapGetters({
        routes: 'routes/routes',
      }),
      activeMenu() {
        const route = this.$route
        const { meta, path } = route
        if (meta.activeMenu) return meta.activeMenu
        return path
      },
      variables() {
        return variables
      },
      handleRoutes() {
        return this.routes.flatMap((route) => {
          return route.menuHidden === true && route.children
            ? route.children
            : route
        })
      },
    },
  }
</script>
<style lang="scss" scoped>
  .top-bar-container {
    display: flex;
    align-items: center;
    justify-items: flex-end;
    height: $base-top-bar-height;
    background: $base-menu-background;

    .vab-main {
      width: auto;

      ::v-deep {
        .el-menu {
          &.el-menu--horizontal {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: $base-top-bar-height;
            border-bottom: 0 solid transparent !important;

            .el-menu-item,
            .el-submenu__title {
              height: $base-top-bar-height/1.3;
              padding: 0 $base-padding;
              line-height: $base-top-bar-height/1.3;
            }

            > .el-menu-item,
            > .el-submenu {
              height: $base-top-bar-height;
              line-height: $base-top-bar-height;
              > .el-submenu__title {
                height: $base-top-bar-height;
                line-height: $base-top-bar-height;
              }
            }
          }

          svg {
            width: 1rem;
            margin-right: 3px;
          }

          .el-submenu,
          .el-menu-item {
            i {
              color: inherit;
            }

            &.is-active {
              border-bottom: 0 solid transparent;

              .el-submenu__title {
                border-bottom: 0 solid transparent;
              }
            }
          }
          .el-menu-item {
            &.is-active {
              background: $base-color-blue !important;
            }
          }
          > .el-menu-item {
            .el-tag {
              margin-top: calc(#{$base-top-bar-height} / 2 - 7.5px);
              margin-left: 5px;
            }

            @media only screen and (max-width: 1199px) {
              .el-tag {
                display: none;
              }
            }
          }
        }
      }
    }

    .right-panel {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      height: $base-top-bar-height;

      ::v-deep {
        .user-name {
          color: rgba($base-color-white, 0.9);
        }

        .user-name + i {
          color: rgba($base-color-white, 0.9);
        }

        [class*='ri-'] {
          margin-left: $base-padding;
          color: rgba($base-color-white, 0.9);
          cursor: pointer;
        }

        button {
          svg {
            margin-right: 0;
            color: rgba($base-color-white, 0.9);
            cursor: pointer;
            fill: rgba($base-color-white, 0.9);
          }
        }
      }
    }
  }
</style>

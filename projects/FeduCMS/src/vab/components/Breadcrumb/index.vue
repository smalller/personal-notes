<template>
  <el-breadcrumb class="breadcrumb-container" separator=">">
    <el-breadcrumb-item v-for="item in levelList" :key="item.path">
      <a @click.prevent="handleLink(item.redirect)">
        <vab-remix-icon
          v-if="item.meta && item.meta.remixIcon"
          :icon="item.meta.remixIcon"
        />
        {{ translateTitle(item.meta.title) }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'

  export default {
    name: 'Breadcrumb',
    data() {
      return {
        levelList: [],
      }
    },
    watch: {
      $route: {
        handler() {
          this.levelList = this.getBreadcrumb()
        },
        immediate: true,
      },
    },
    methods: {
      translateTitle,
      getBreadcrumb() {
        return this.$route.matched.filter(
          (item) => item.meta && item.meta.title
        )
      },
      handleLink(redirect) {
        console.log(redirect)
        // this.$router.push(redirect)
      },
    },
  }
</script>

<style lang="scss" scoped>
  .breadcrumb-container {
    height: $base-nav-bar-height;
    font-size: $base-font-size-default;
    line-height: $base-nav-bar-height;

    ::v-deep {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          a {
            font-weight: normal;
            color: #515a6e;

            [class='ri-'] {
              margin-right: 3px;
            }
          }
        }

        &:last-child {
          .el-breadcrumb__inner {
            a {
              color: #999;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <span v-if="theme.showTheme">
    <vab-remix-icon icon="brush-2-line" @click="handleOpenTheme" />
    <div class="theme-setting">
      <div @click="handleOpenTheme">
        <vab-remix-icon icon="brush-2-line" />
        <p>{{ translateTitle('主题配置') }}</p>
      </div>
      <div @click="randomTheme">
        <vab-remix-icon icon="apps-line" />
        <p>{{ translateTitle('随机换肤') }}</p>
      </div>
      <div @click="getCode">
        <vab-remix-icon icon="file-copy-line" />
        <p>{{ translateTitle('拷贝源码') }}</p>
      </div>
    </div>

    <el-drawer
      custom-class="vab-drawer"
      :title="translateTitle('主题配置')"
      :visible.sync="drawerVisible"
      append-to-body
      direction="rtl"
      size="463px"
    >
      <el-scrollbar class="theme-scrollbar">
        <div class="el-drawer__body">
          <el-form ref="form" :model="themeData" label-position="top">
            <el-form-item :label="translateTitle('布局')">
              <el-radio-group v-model="themeData.layout">
                <el-radio-button label="gallery">
                  {{ translateTitle('画廊') }}
                </el-radio-button>
                <el-radio-button label="comprehensive">
                  {{ translateTitle('综合') }}
                </el-radio-button>
                <el-radio-button label="vertical">
                  {{ translateTitle('纵向') }}
                </el-radio-button>
                <el-radio-button label="horizontal">
                  {{ translateTitle('横向') }}
                </el-radio-button>
                <el-radio-button label="common">
                  {{ translateTitle('常规') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('主题')">
              <el-radio-group
                v-model="themeData.themeName"
                @change="handleSetData"
              >
                <el-radio-button label="default">
                  {{ translateTitle('默认') }}
                </el-radio-button>
                <el-radio-button label="ocean">
                  {{ translateTitle('海洋之心') }}
                </el-radio-button>
                <el-radio-button label="green">
                  {{ translateTitle('绿荫草场') }}
                </el-radio-button>
                <el-radio-button label="glory">
                  {{ translateTitle('荣耀典藏') }}
                </el-radio-button>
                <el-radio-button label="white">
                  {{ translateTitle('碰触纯白') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="translateTitle('头部')">
              <el-radio-group
                v-model="themeData.fixedHeader"
                :disabled="themeData.layout === 'common'"
              >
                <el-radio-button :label="true">
                  {{ translateTitle('固定') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不固定') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('多标签')">
              <el-radio-group v-model="themeData.showTabsBar">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item :label="translateTitle('国际化')">
              <el-radio-group v-model="themeData.showLanguage">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('进度条')">
              <el-radio-group v-model="themeData.showProgressBar">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('刷新')">
              <el-radio-group v-model="themeData.showRefresh">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('搜索')">
              <el-radio-group v-model="themeData.showSearch">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('通知')">
              <el-radio-group v-model="themeData.showNotice">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="translateTitle('全屏')">
              <el-radio-group v-model="themeData.showFullScreen">
                <el-radio-button :label="true">
                  {{ translateTitle('显示') }}
                </el-radio-button>
                <el-radio-button :label="false">
                  {{ translateTitle('不显示') }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button @click="setDefaultTheme">
                {{ translateTitle('恢复默认') }}
              </el-button>
              <el-button type="primary" @click="handleSaveTheme">
                {{ translateTitle('保存') }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-scrollbar>
    </el-drawer>
  </span>
</template>

<script>
  import { translateTitle } from '@/utils/i18n'
  import { mapActions, mapGetters } from 'vuex'
  import { shuffle } from '@/utils/array'

  export default {
    name: 'Theme',
    data() {
      return {
        drawerVisible: false,
        themeData: {},
      }
    },
    computed: {
      ...mapGetters({
        theme: 'settings/theme',
      }),
    },
    created() {
      this.$baseEventBus.$on('theme', () => {
        this.handleOpenTheme()
      })
      this.$baseEventBus.$on('random-theme', () => {
        this.randomTheme()
      })
      this.themeData = Object.assign({}, this.theme)
      this.handleSetData()
    },
    methods: {
      translateTitle,
      ...mapActions({
        updateTheme: 'settings/updateTheme',
        saveTheme: 'settings/saveTheme',
        resetTheme: 'settings/resetTheme',
      }),
      handleOpenTheme() {
        this.themeData = Object.assign({}, this.theme)
        this.drawerVisible = true
      },
      async handleSaveTheme() {
        await this.updateTheme(this.themeData)
        await this.handleSetData()
        await this.saveTheme()
        this.drawerVisible = false
      },
      async setDefaultTheme() {
        await this.resetTheme()
        this.themeData = {}
        this.drawerVisible = false
      },
      async randomTheme() {
        const loading = this.$baseColorfullLoading(
          0,
          '随机换肤只用于演示会在页面刷新时自动失效，请放心切换，如需保存，在主题配置中保存...'
        )
        const themeNameArray = ['default', 'ocean', 'green', 'glory', 'white']
        this.updateTheme({
          themeName: shuffle(themeNameArray)[0],
        })
        if (document.body.getBoundingClientRect().width >= 992) {
          const layoutArray = [
            'horizontal',
            'vertical',
            'gallery',
            'comprehensive',
            'common',
          ]
          await this.updateTheme({
            layout: shuffle(layoutArray)[0],
          })
        }
        await this.handleSetData()
        loading.close()
      },
      handleSetData() {
        document.getElementsByTagName(
          'body'
        )[0].className = `vab-theme-${this.themeData.themeName}`
      },
      getCode() {
        const url =
          'https://github.com/vue-admin-beautiful/vue-admin-beautiful-pro/blob/master/src/views'
        let path = this.$route.path + '/index.vue'
        if (path === '/vab/icon/remixIcon/index.vue') {
          path = '/vab/icon/remixIcon.vue'
        }
        if (path === '/vab/icon/colorfulIcon/index.vue') {
          path = '/vab/icon/colorfulIcon.vue'
        }
        if (path === '/vab/icon/iconSelector/index.vue') {
          path = '/vab/icon/iconSelector.vue'
        }
        if (path === '/vab/table/comprehensiveTable/index.vue') {
          path = '/vab/table/comprehensiveTable.vue'
        }
        if (path === '/vab/table/inlineEditTable/index.vue') {
          path = '/vab/table/inlineEditTable.vue'
        }
        if (path === '/vab/table/customTable/index.vue') {
          path = '/vab/table/customTable.vue'
        }
        if (path === '/vab/drag/dialogDrag/index.vue') {
          path = '/vab/drag/dialogDrag.vue'
        }
        if (path === '/vab/drag/cardDrag/index.vue') {
          path = '/vab/drag/cardDrag.vue'
        }
        if (path === '/vab/form/comprehensiveForm/index.vue') {
          path = '/vab/form/comprehensiveForm.vue'
        }
        if (path === '/vab/form/stepForm/index.vue') {
          path = '/vab/form/stepForm.vue'
        }
        if (path === '/vab/editor/richTextEditor/index.vue') {
          path = '/vab/editor/richTextEditor.vue'
        }
        if (path === '/vab/editor/markdownEditor/index.vue') {
          path = '/vab/editor/markdownEditor.vue'
        }
        if (path === '/vab/menu1/menu1-1/menu1-1-1/menu1-1-1-1/index.vue') {
          path = '/vab/nested/menu1/menu1-1/menu1-1-1/menu1-1-1-1/index.vue'
        }
        if (path === '/vab/excel/exportExcel/index.vue') {
          path = '/vab/excel/exportExcel.vue'
        }
        if (path === '/vab/excel/exportSelectedExcel/index.vue') {
          path = '/vab/excel/exportSelectedExcel.vue'
        }
        if (path === '/vab/excel/exportMergeHeaderExcel/index.vue') {
          path = '/vab/excel/exportMergeHeaderExcel.vue'
        }
        window.open(url + path)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @mixin right-bar {
    position: fixed;
    right: 0;
    z-index: $base-z-index;
    width: 60px;
    min-height: 60px;
    text-align: center;
    cursor: pointer;
    background: $base-color-blue;
    border-radius: $base-border-radius;

    > div {
      padding-top: 10px;
      border-bottom: 0 !important;

      &:hover {
        opacity: 0.9;
      }

      & + div {
        border-top: 1px solid $base-color-white;
      }

      p {
        padding: 0;
        margin: 0;
        font-size: $base-font-size-small;
        line-height: 30px;
        color: $base-color-white;
      }
    }
  }

  .theme-scrollbar {
    height: calc(100vh - 80px);
    overflow: hidden;
  }

  .theme-setting {
    @include right-bar;

    top: calc((100vh - 110px) / 2);

    ::v-deep {
      [class*='ri-'] {
        display: block !important;
        margin-right: auto !important;
        margin-left: auto !important;
        color: $base-color-white !important;
        fill: $base-color-white !important;
      }
    }
  }
</style>
<style lang="scss">
  .el-drawer__wrapper {
    outline: none !important;
    * {
      outline: none !important;
    }
    .vab-drawer {
      .el-drawer__header {
        margin-bottom: $base-padding;
      }
      .el-drawer__body {
        padding: 0 $base-padding/2 $base-padding/2 $base-padding/2;
        .el-form-item--small.el-form-item {
          margin-bottom: 0;
        }
        .el-form-item--small.el-form-item:last-child {
          margin-top: $base-padding;
        }
      }
    }
  }
</style>

/**
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
  baseURL,
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  title,
  abbreviation,
  devPort,
  providePlugin,
  build7z,
  buildGzip,
} = require('./src/config')
const { webpackBarName, webpackBanner } = require('./vab.config')
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
const dateTime = dayjs().format('YYYY-M-D HH:mm:ss')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = author
process.env.VUE_APP_UPDATE_TIME = dateTime
process.env.VUE_APP_VERSION = version
const resolve = (dir) => {
  return path.join(__dirname, dir)
}
console.log(baseURL)
module.exports = {
  publicPath,
  assetsDir,
  outputDir,
  lintOnSave,
  transpileDependencies,
  devServer: {
    hot: true,
    port: devPort,
    open: true,
    noInfo: false,
    overlay: {
      warnings: true,
      errors: true,
    },
    // 注释掉的地方是前端配置代理访问后端的示例
    proxy: {
      [baseURL]: {
        target: `http://gateway.v2.test.jinshuy.com/`,
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          ['^/' + baseURL]: '',
        },
      },
    },
    after: require('./mock/mockServer.js'),
  },
  configureWebpack() {
    return {
      resolve: {
        alias: {
          '@': resolve('src'),
          '*': resolve(''),
          assets: resolve('@/cms/assets'),
          api: resolve('@/cms/api'),
        },
      },
      plugins: [
        new Webpack.ProvidePlugin(providePlugin),
        new WebpackBar({
          name: webpackBarName,
        }),
      ],
    }
  },
  chainWebpack(config) {
    config.resolve.symlinks(true)
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icon/remixIcon'))
      .add(resolve('src/icon/colorfulIcon'))
    config.module
      .rule('remixIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon/remixIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'remix-icon-[name]' })
    config.module
      .rule('colorfulIcon')
      .test(/\.svg$/)
      .include.add(resolve('src/icon/colorfulIcon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'colorful-icon-[name]' })
    config.when(process.env.NODE_ENV === 'development', (config) => {
      config.devtool('source-map')
    })
    config.when(process.env.NODE_ENV === 'production', (config) => {
      config.performance.set('hints', false)
      config.devtool('none')
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'vue-admin-beautiful-pro-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial',
          },
          elementUI: {
            name: 'vue-admin-beautiful-pro-element-ui',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
          },
        },
      })
      config
        .plugin('banner')
        .use(Webpack.BannerPlugin, [`${webpackBanner}${dateTime}`])
      if (buildGzip)
        config.plugin('compression').use(CompressionWebpackPlugin, [
          {
            filename: '[path][base].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
              '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 8192,
            minRatio: 0.8,
          },
        ])
      if (build7z)
        config.plugin('fileManager').use(FileManagerPlugin, [
          {
            onEnd: {
              archive: [
                {
                  source: `./${outputDir}`,
                  destination: `./${outputDir}/${abbreviation}_${dateTime}.7z`,
                },
              ],
            },
          },
        ])
    })
  },
  runtimeCompiler: true,
  productionSourceMap: false,
  css: {
    requireModuleExtension: true,
    sourceMap: true,
    loaderOptions: {
      scss: {
        additionalData(content, loaderContext) {
          const { resourcePath, rootContext } = loaderContext
          const relativePath = path.relative(rootContext, resourcePath)
          if (relativePath.replace(/\\/g, '/') !== 'src/config/variables.scss')
            return '@import "~@/config/variables.scss";' + content
          return content
        },
      },
    },
  },
}

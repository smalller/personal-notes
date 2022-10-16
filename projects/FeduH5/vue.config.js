
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const webpack = require('webpack')
const less = require("less");
const productionGzipExtensions = ['js', 'css']
  module.exports = {
    chainWebpack: config => {
      config.output.filename('assets/js/[name].[hash].js').chunkFilename('assets/js/[name].[hash].js').end()

      // 如果filenameHashing设置为了false，可以通过这段代码给打包出的css文件增加hash值
      // config.plugin('extract-css').tap(args => [{
      //   filename: 'assets/css/[name].[hash].css',
      //   chunkFilename: 'assets/css/[name].[hash].css'
      // }])
    },
    productionSourceMap: false,
    filenameHashing: true,
    configureWebpack: {
      // resolve: {
      //   extensions: ['.js', '.json', '.vue', '.less', '.css']
      // },
      externals: {
        'vue': 'Vue',
        'vuex': 'Vuex',
        'vue-router': 'VueRouter',
        'element-ui': 'ELEMENT',
        'axios':'axios',
        'dayjs': 'dayjs',
        'hls.js': 'Hls',
        'flv.js': 'flvjs'
      },
      plugins: [
        new VueLoaderPlugin(),
        // () => {
        //   if(process.env.NODE_ENV === 'production') {
        //     return new CompressionPlugin({
        //       filename: '[path].gz[query]',
        //       algorithm: 'gzip',
        //       test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
        //       threshold: 10240,
        //       minRatio: 0.8
        //     })
        //   }
        // },
        new CompressionPlugin({
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
          threshold: 10240,
          minRatio: 0.8
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100
        }),
        // new BundleAnalyzerPlugin()
      ],
      module: {
        rules: [
          {
            test: /\.vue$/,
            use: 'vue-loader'
          },
          {
            test: /\.less$/,
            use: 'less-loader'
          }
        ]
      }
    },
    devServer: {
       // host: 'localhost',
       // port: 1080,
       disableHostCheck: true,
        https: false,
        //以上的ip和端口是我们本机的;下面为需要跨域的
        // proxy: {//配置跨域
        //     '/api': {
        //         target: 'http://rc2uky.natappfree.cc:1080',//这里后台的地址模拟的;应该填写你们真实的后台接口
        //         ws: true,
        //         changOrigin: true,//允许跨域
        //         pathRewrite: {
        //             '^/api': ''//请求的时候使用这个api就可以
        //         }
        //     }

        // }
    }
}



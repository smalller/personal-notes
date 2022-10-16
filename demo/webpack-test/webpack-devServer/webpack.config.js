const path = require('path');

const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: ['./src/js/index.js'],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "首页index",
      filename: "index.html",
      template: "./index.html"
    })
  ],

  devServer: {
    // 生成的虚拟目录路径
    contentBase: "./dist",
    // 自动开启浏览器
    open: true,
    // 端口
    port: 9527,

    proxy: {
      '/api': {
        target: 'http://192.168.101.204:80',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
  }


};
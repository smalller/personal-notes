/**
 * webpack是基于Node实现的
 * 当我们执行webpack其实本质上是运行的node代码
 * 所以这里的配置文件是node代码文件
 */

const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

//导出的就是一个对象，这个对象就是webpack命令执行过程中使用到的配置
module.exports = {
  mode: "production",
  devtool: 'source-map',
  entry: ["./src/js/index.js", './src/js/cssLoader.js'], //编译入口文件
  // entry: {
  //   index: "./src/js/index.js",
  //   cssLoader: './src/js/cssLoader.js'
  // },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js" //打包后的出口文件名
  },

  //安装的loader
  module: {
    rules: [
      //可以将文件作为字符串导入的loader
      {
        test: /\.(txt)$/,
        use: 'raw-loader'
      },

      //可以将md文件座位html导入的loader
      {
        test: /\.md$/,
        use: [{
            loader: 'html-loader'
          },
          {
            loader: 'markdown-loader'
          }
        ]
      },

      //把识别出的资源模块，移动到指定的输出⽬目录，并且返回这个资源在输出目录的地址(字符串)
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            // placeholder 占位符 [name] 源资源模块的名称
            // [ext] 源资源模块的后缀
            name: "[name]_[hash].[ext]",
            //打包后的存放位置
            outputPath: "./images",
            //打包后文件的 url，可以直接通过该地址进行访问该图片（只是相对的一种映射关系，图片实际存放位置还是./images里）
            publicPath: 'images',
            //当大于这么多个字节的图片，才使用file-loader，否则就用url-loader
            limit: 10
          }
        }
      },

      //可以将css文件当成模块导入，并且自动将css代码插入到style标签里，style标签默认是插入到head标签里的
      // {
      //   test: /\.css$/i,
      //   use: ["style-loader", "css-loader"],
      // },

      //提取 CSS 到一个单独的文件中,并使用link的方式引入
      {
        test: /\.(s[ac]ss|less|css)$/,
        use: [{
            loader: MiniCssExtractPlugin.loader
          },
          'css-loader',
          // 'sass-loader'
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: "首页index",
      filename: "index.html",
      template: "./index.html"
    }),

    // new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ],
}
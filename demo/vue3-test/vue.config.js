const path = require("path");

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  publicPath: "/best-practice",
  devServer: {
    port: 9527,
    open: true,
    proxy: {
      "/mp4": {
        target:
          "https://yjbigfiles.oss-cn-shenzhen.aliyuncs.com/V6K/Zj/V6KRjZMy5LbDBF3ewU0v7Zja.mp4",
        changeOrigin: true,
        pathRewrite: {
          "^/mp4": ""
        }
      }
    }
  },
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       comps: path.join(__dirname, 'src/components')
  //     }
  //   }
  // }
  // configureWebpack(config) {
  //     config.resolve.alias.comps = path.join(__dirname, 'src/components')

  //     if (process.env.NODE_ENV === 'development') {
  //         config.name = 'vue best practice'
  //     } else {
  //         config.name = 'vue项目最佳实践'
  //     }
  // },
  chainWebpack(config) {
    // 1.添加一个loader，负责去icon目录中加载图标，方便直接使用
    config.module
      .rule("icon")
      .include.add(resolve("src/icon"))
      .end()
      .test(/\.svg$/)
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      });

    // 2.当前项目下有一个加载svg的loader，svg规则排除icon目录
    config.module.rule("svg").exclude.add(resolve("src/icon"));
  }
};

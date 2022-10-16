module.exports = {
  // 选项...

  chainWebpack: (config) => {
    config.output
      .filename("assets/js/[name].[hash].js")
      .chunkFilename("assets/js/[name].[hash].js")
      .end();

    // 如果filenameHashing设置为了false，可以通过这段代码给打包出的css文件增加hash值
    // config.plugin('extract-css').tap(args => [{
    //   filename: 'assets/css/[name].[hash].css',
    //   chunkFilename: 'assets/css/[name].[hash].css'
    // }])
  },
};

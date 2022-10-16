// 根目录创建plugin.js文件
export default (api, opts) => {
  // 引用第三方js
  api.addHTMLHeadScript({
    type: 'text/javascript',
    src: 'https://appx/web-view.min.js',
  });

  // api.addHTMLHeadScript({
  //   type: 'text/javascript',
  //   src: 'http://api.map.baidu.com/api?v=2.0&ak=...',
  // });
  // // 引用第三方css
  // api.addHTMLLink({
  //   rel: 'stylesheet',
  //   type: 'text/css',
  //   href: 'http://mapopen.bj.bcebos.com/github/BMapGLLib/DrawingManager/src/DrawingManager.min.css',
  // });
  // // 修改网页图标
  // api.addHTMLLink({
  //   rel: 'shortcut icon',
  //   type: 'image/x-icon',
  //   href: '/logo.png',
  // });
};

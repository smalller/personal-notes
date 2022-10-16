const getNavigatorType = () => {
  let navigatorType = 'h5';
  if (/MicroMessenger/.test(window.navigator.userAgent)) {
    navigatorType = 'wechat';
  }
  if (/AlipayClient/.test(window.navigator.userAgent)) {
    navigatorType = 'alipay';
  }
  sessionStorage.setItem('navigatorType', navigatorType);

  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('AlipayClient') > -1) {
    // 支付宝小程序的 JS-SDK 防止 404 需要动态加载，如果不需要兼容支付宝小程序，则无需引用此 JS 文件。
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://appx/web-view.min.js';
    document.head.appendChild(script);
  }
};
getNavigatorType();

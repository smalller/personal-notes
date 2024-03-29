/**
 * 全局配置文件
 */
export default {
  title: "",
  logo: "",
  key: 'saber', //配置主键,目前用于存储
  indexTitle: '玖座商家管理系统',
  tenantMode: false, // 是否开启租户模式
  tenantId: "000000", // 管理组租户编号
  captchaMode: false, // 是否开启验证码模式
  lockPage: '/lock',
  tokenTime: 3000,
  clientId: 'ns', // 客户端id
  clientSecret: 'ns_sk_20210430', // 客户端密钥
  tokenHeader: 'Blade-Auth',
  //http的status默认放行列表
  statusWhiteList: [],
  //配置首页不可关闭
  isFirstPage: false,
  fistPage: {
    label: "首页",
    value: "/wel/index",
    params: {},
    query: {},
    meta: {
      i18n: 'dashboard'
    },
    group: [],
    close: false
  },
  //配置菜单的属性
  menu: {
    iconDefault: 'iconfont icon-caidan',
    props: {
      label: 'name',
      path: 'path',
      icon: 'source',
      children: 'children'
    }
  },
  // 第三方系统授权地址
  authUrl: 'http://localhost/blade-auth/oauth/render',
  // 流程设计器地址
  flowDesignUrl: 'http://localhost:9999',
  // 报表设计器地址(cloud端口为8108,boot端口为80)
  reportUrl: 'http://localhost:8108/ureport',
}

/**
 * @description 导出通用配置
 */
module.exports = {
  //标题，此项修改后需要重启项目 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: '运营端',
  //标题分隔符
  titleSeparator: ' - ',
  //标题是否反转 如果为false:"page - title"，如果为ture:"title - page"
  titleReverse: false,
  //简写
  abbreviation: 'CMS',
  //pro版本copyright可随意修改
  copyright: '',
  //缓存路由的最大数量
  keepAliveMaxNum: 1,
  //路由模式，可选值为 history 或 hash
  routerMode: 'hash',
  //不经过token校验的路由
  routesWhiteList: ['/login', '/register', '/callback', '/404', '/403'],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token名称
  tokenName: 'token',
  //token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'cookie',
  //token存储位置localStorage sessionStorage cookie
  storage: 'cookie',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  //是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，只支持设置remixIcon下的图标，如果需要自定义请去logo组件修改源码
  logo: 'vuejs-fill',
  //语言类型zh、en
  i18n: 'zh',
  //消息框消失时间
  messageDuration: 3000,
  //在哪些环境下显示高亮错误
  errorLog: ['development', 'production'],
  //是否开启登录拦截
  loginInterception: true,
  //是否开启登录RSA加密
  loginRSA: false,
  //intelligence（前端导出路由）和all（后端导出路由）两种方式
  authentication: 'intelligence',
  // authentication: process.env.NODE_ENV === 'prod' ? 'all' : 'intelligence',
  //是否开启roles字段进行角色权限控制（如果是all模式后端完全处理角色并进行json组装，可设置false不处理路由中的roles字段）
  rolesControl: true,
  //vertical gallery comprehensive common布局时是否只保持一个子菜单的展开
  uniqueOpened: false,
  //vertical gallery comprehensive common布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOpeneds: ['/vab'],
  //需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  //画廊布局和综合布局时，是否点击一级菜单默认开启第一个二级菜单
  openFirstMenu: true,
  //代码生成机生成在view下的文件夹名称
  templateFolder: 'project',
}

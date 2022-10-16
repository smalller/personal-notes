import { defineConfig } from 'umi';

export default defineConfig({
  define: {},
  // history: {
  //   type: 'memory',
  // },
  hash: true,
  theme: {
    // 全部样式变量 https://github.com/3lang3/react-vant/blob/main/src/styles/themes/default.less
    'brand-color': '#ef5350',

    // hd需要根据设计稿尺寸设置
    // 若设计稿宽度为350则使用默认1px即可
    hd: '1px', // 对应350设计稿宽度
  },
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: '/',
  styles: ['body {background-color: #F9F9F9 !important;}'],
  // 按需引入组件
  extraBabelPlugins: [['import', { libraryName: 'react-vant', style: true }]],
  extraPostCSSPlugins: [
    // 高清方案
    require('postcss-px-to-viewport')({
      // 设计稿宽度
      viewportWidth: 375,
      unitPrecision: 4,
      viewportUnit: 'vw',
    }),
  ],
  routes: [
    { path: '/', component: '@/pages/home' },
    { path: '/teacher/user', component: '@/pages/teacher/user' },
    { path: '/teacher/editUser', component: '@/pages/teacher/editUser' },
    { path: '/login', component: '@/pages/login' },
    { path: '/wechatLogin', component: '@/pages/wechatLogin' },
    { path: '/loginInfo', component: '@/pages/loginInfo' },
    { path: '/selectUserType', component: '@/pages/selectUserType' },
    { path: '/changeSchool', component: '@/pages/changeSchool' },
    { path: '/changeStudent', component: '@/pages/changeStudent' },
    { path: '/teacher/notice', component: '@/pages/teacher/notice' },
    {
      path: '/teacher/noticeDetails',
      component: '@/pages/teacher/noticeDetails',
    },
    {
      path: '/teacher/paymentStatistics',
      component: '@/pages/teacher/paymentStatistics',
    },
    {
      path: '/teacher/paymentDetails',
      component: '@/pages/teacher/paymentDetails',
    },
    {
      path: '/teacher/paymentData',
      component: '@/pages/teacher/paymentData',
    },
    {
      path: '/teacher/paymentDataDetails',
      component: '@/pages/teacher/paymentDataDetails',
    },
    { path: '/teacher/payInfo', component: '@/pages/teacher/payInfo' },
    { path: '/teacher/payDetails', component: '@/pages/teacher/payDetails' },
    { path: '/teacher/wallet', component: '@/pages/teacher/wallet' },
    {
      path: '/teacher/walletDetails',
      component: '@/pages/teacher/walletDetails',
    },
    { path: '/teacher/walletInfo', component: '@/pages/teacher/walletInfo' },
    {
      path: '/teacher/transactionList',
      component: '@/pages/teacher/transactionList',
    },
    {
      path: '/teacher/transactionDetails',
      component: '@/pages/teacher/transactionDetails',
    },
    {
      path: '/parent/user',
      component: '@/pages/parent/user',
    },
    {
      path: '/parent/notice',
      component: '@/pages/parent/notice',
    },
    {
      path: '/parent/payDetails',
      component: '@/pages/parent/payDetails',
    },
    {
      path: '/pay',
      component: '@/pages/pay',
    },
    {
      path: '/payType',
      component: '@/pages/payType',
    },
    { path: '/parent/editUser', component: '@/pages/parent/editUser' },
    {
      path: '/parent/paymentStatistics',
      component: '@/pages/parent/paymentStatistics',
    },
    {
      path: '/parent/transactionList',
      component: '@/pages/parent/transactionList',
    },
    {
      path: '/parent/transactionDetails',
      component: '@/pages/parent/transactionDetails',
    },
    {
      path: '/parent/paymentStatisticsSelect',
      component: '@/pages/parent/paymentStatisticsSelect',
    },
    {
      path: '/middleQrPage',
      component: '@/pages/middleQrPage',
    },
    {
      path: '/parent/qrSurePay',
      component: '@/pages/parent/qrSurePay',
    },
    {
      path: '/parent/receiptList',
      component: '@/pages/parent/receiptList',
    },
    {
      path: '/parent/receipDetail',
      component: '@/pages/parent/receipDetail',
    },
    {
      path: '/judgeInfo',
      component: '@/pages/judgeInfo',
    },
    {
      path: '/accessFor',
      component: '@/pages/accessFor',
    },
    {
      path: '/payStatus',
      component: '@/pages/payStatus',
    },
  ],
  fastRefresh: {},
  // mfsu: {},
  // mfsu: { production: { output: '.mfsu-production' } },
});

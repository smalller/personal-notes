import Vue from 'vue'
import App from './App'
import i18n from './i18n'
import store from './store'
import router from './router'
import VueCookie from 'vue-cookie'
import './cms/utils/validation.js'
import './cms/assets/css/public.scss'
import '@/vab'
import './cms/common/classRoomMsg'
import JsonExcel from 'vue-json-excel'
import BMap from 'vue-baidu-map'

Vue.component('DownloadExcel', JsonExcel)
// import videoPlay from '@/cms/components/videoPlay'
// import cmsUpload from '@/cms/common/cmsUpload'

Vue.use(VueCookie)
// Vue.component('VideoPlay', videoPlay)
// Vue.component('CmsUpload', cmsUpload)
Vue.use(BMap, {
  ak: 'sXNlFc1G6E9W8tMG9QGbmVeq4WGiBBQK',
})
/**
 * @description 正式环境默认使用mock，正式项目记得注释后再打包
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('@/utils/static')
  mockXHR()
}
Vue.config.productionTip = false
new Vue({
  el: '#vue-admin-beautiful-pro',
  i18n,
  store,
  router,
  render: (h) => h(App),
})

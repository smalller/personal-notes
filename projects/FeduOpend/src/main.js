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
import filter from '@/cms/utils/filter'
// import AMap from 'AMap'

// Vue.component(AMap)
Vue.prototype.$filter = filter

// import videoPlay from '@/cms/components/videoPlay'
// import cmsUpload from '@/cms/common/cmsUpload'

Vue.use(VueCookie)
// Vue.component('VideoPlay', videoPlay)
// Vue.component('CmsUpload', cmsUpload)

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

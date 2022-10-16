 // uni.setStorageSync('baseUrl','https://api.v2.jinshuy.com')
uni.setStorageSync('baseUrl','https://gateway.v2.test.jinshuy.com')
// uni.setStorageSync('baseUrl','http://gateway.yjbit.zhidiansaas.com')
import App from './App'
import Pay from './base/pay.js'
import store from './store'
import {login} from './base/login.js'
import {wxDeCode} from './base/common.js'
import uView from '@/uni_modules/uview-ui'



import Vue from 'vue'
Vue.use(uView)

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$wxDecode = wxDeCode
Vue.prototype.$Pay = Pay
Vue.prototype.$login = login
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
app.$mount()
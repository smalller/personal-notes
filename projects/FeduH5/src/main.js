import Vue from 'vue'
import router from './router'
import {Message} from 'element-ui';
import App from './App.vue';
import request from "@/base/request";
// import BMap from 'vue-baidu-map'

Vue.prototype.$bus =window.$bus= new Vue()


// Vue.use(BMap, {
//   ak: 'sXNlFc1G6E9W8tMG9QGbmVeq4WGiBBQK',
// })
import VConsole from 'vconsole';

import store from './store'


if(process.env.NODE_ENV === 'release') {
  // const vConsole = new VConsole();
}

// const vConsole = new VConsole();

Vue.prototype.$request = request
Vue.prototype.$message = Message

Vue.config.productionTip = false
Vue.config.ignoredElements = [
  'wx-open-launch-app',
];
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

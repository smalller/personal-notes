import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import MintUI from "mint-ui"
import "mint-ui/lib/style.css"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

Vue.prototype.axios = axios;
Vue.use(ElementUI);
Vue.use(MintUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


//路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.isLogin) {
    if (sessionStorage.getItem("sessionJson")) {
      next();
    } else {
      next("/");
    }
  } else {
    next();
  }
})

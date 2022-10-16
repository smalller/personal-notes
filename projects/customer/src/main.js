import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache'; //页面缓存
import store from './store';
import {
  loadStyle
} from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import './util/filter'


// 自定义
import "../static/css/main.css";
import regular from './util/regular'
import {
  VueJsonp
} from 'vue-jsonp'
// import rongyun from '../src/assets/js/rongyun2.5.0'
import emoji from '@/assets/js/emoji'
import './assets/css/icon/iconfont.css';
import {
  post,
  get,
  Delete,
  put,
  map_get,
  file_get,
  file_post,
  fileUploadUrl,
  rongyunKey
} from './router/index';


import {
  iconfontUrl,
  iconfontVersion,
  imgHead
} from '@/config/env';
import i18n from './lang'; // Internationalization
import './styles/common.scss';
import basicBlock from './components/basic-block/main';
import basicContainer from './components/basic-container/main';
import thirdRegister from './components/third-register/main';
import avueUeditor from 'avue-plugin-ueditor';
import website from '@/config/website';
import crudCommon from '@/mixins/crud';


Vue.use(VueJsonp)


Vue.prototype.$post = post;
Vue.prototype.$map_get = map_get;
Vue.prototype.$get = get;
Vue.prototype.$Delete = Delete;
Vue.prototype.$put = put;
Vue.prototype.$file_get = file_get;
Vue.prototype.$file_post = file_post;
Vue.prototype.$imgHead = imgHead;
Vue.prototype.$fileUploadUrl = fileUploadUrl;
Vue.prototype.$rongyunKey = rongyunKey;
Vue.prototype.$regular = regular


// 注册全局crud驱动
window.$crudCommon = crudCommon;
// 加载Vue拓展
Vue.use(router);
Vue.use(VueAxios, axios);
Vue.use(Element, {
  size: 'small',
  i18n: (key, value) => i18n.t(key, value)
});

Vue.use(window.AVUE, {
  size: 'small',
  tableSize: 'small',
  calcHeight: 65,
  i18n: (key, value) => i18n.t(key, value)
});
// 注册全局容器
Vue.component('basicContainer', basicContainer);
Vue.component('basicBlock', basicBlock);
Vue.component('thirdRegister', thirdRegister);
Vue.component('avueUeditor', avueUeditor);
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
});
// 加载website
Vue.prototype.website = website;
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele));
});

Vue.config.productionTip = false;


new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app');

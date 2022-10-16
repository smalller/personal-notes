import Vue from 'vue'
import App from './App'
import store from './store/store'
import filter from './common/js/filter.js'
import uView from "uview-ui";
import VCharts from 'v-charts';
import date from './common/js/date.js'
import {
	get,
	post,
	Delete,
	put,
	file_post,
	arr_post,
	showImgPrefix,
	fileUpload,
	appkey
} from './api/index.js'
import {
	showLoading,
	errToast,
	successToast,
	getPrivate,
	GetPercent,
	FourGetPercent,
	phone,
	money,
	checkMinPrice,
	createSelectorQuery,
	scoreReg
} from './common/js/common.js'


Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$Delete = Delete;
Vue.prototype.$put = put;
Vue.prototype.$file_post = file_post;
Vue.prototype.$arr_post = arr_post;
Vue.prototype.$imgHead = showImgPrefix;
Vue.prototype.$fileUpload = fileUpload;
Vue.prototype.$appkey = appkey;
Vue.prototype.$showLoading = showLoading;
Vue.prototype.$errToast = errToast;
Vue.prototype.$successToast = successToast;
Vue.prototype.$date = date;
Vue.prototype.$getPrivate = getPrivate;
Vue.prototype.$GetPercent = GetPercent;
Vue.prototype.$FourGetPercent = FourGetPercent;
Vue.prototype.$phone = phone;
Vue.prototype.$money = money;
Vue.prototype.$checkMinPrice = checkMinPrice;
Vue.prototype.$createSelectorQuery = createSelectorQuery;
Vue.prototype.$scoreReg = scoreReg;

Vue.use(uView);
Vue.use(VCharts);

const role = JSON.parse(localStorage.getItem('uni-userInfo')) || ''
if (role) {
	store.commit('authFun', role.storeAuth)
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()

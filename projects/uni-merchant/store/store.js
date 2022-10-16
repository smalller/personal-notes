import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const stroe = new Vuex.Store({
	state:{
		onloadOrder : 1,
		 auth:'',
	},
	
	mutations : {
		//刷新座位状态管理页面
		getOrderFun(state,type){
		    state.onloadOrder = type
		},
		authFun(state, level) {
			state.auth = level
		},
	}
})

export default stroe
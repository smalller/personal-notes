import Vue from 'vue'
import Vuex from 'vuex'
import {getVipStatus} from '../api/login.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		userId: uni.getStorageSync('userId')||'',
		token: uni.getStorageSync('token')||'',
		userInfo: uni.getStorageSync('userInfo')?JSON.parse(uni.getStorageSync('userInfo')):{},
		email: uni.getStorageSync('email')||'',
		vipInfo: {}
	},
	getters: {
		userId: state => state.userId,
		token: state => state.token,
		email: state => state.email,
		userInfo: state => state.userInfo,
		vipInfo: state => state.vipInfo,
	},
	mutations: {
		setUserId: (state, userId) => {
			state.userId = userId;
			uni.setStorageSync('userId', userId)
		},
		setToken: (state, token) => {
			state.token = token
			uni.setStorageSync('token', token)
		},
		setUserInfo: (state, userInfo) => {
			state.userInfo = userInfo
			uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		},
		setVipInfo: (state, info) => {
			state.vipInfo = info
		},
		setEmail: (state, email) => {
			state.email = email
			uni.setStorageSync('email', email)
		}
	},
	actions: {
		setUserInfo({commit,dispatch}, userInfo) {
			commit('setToken', userInfo.token)
			commit('setUserId', userInfo.userId)
			commit('setEmail', userInfo.qqEmail)
			commit('setUserInfo', userInfo)
			dispatch('getVip')
		},
		loginOut({commit}) {
			commit('setUserId', '')
			commit('setToken', '')
			commit('setUserInfo', {})
		},
		getVip({commit}) {
			getVipStatus().then(res => {
				if(+res.code === 0) {
					if(res.data) {
						res.data.isVip = res.data.isOpening
						commit('setVipInfo', res.data)
					} else {
						commit('setVipInfo', {isVip: false})
					}
					
				}
			})
		}
	}
})
export default store

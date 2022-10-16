import store from '../store'
import { getServerType, wxDeCode } from "./common.js"
import { getOpenId, weChatLogin } from '../api/login.js'

export const login = async () => {
	const provider = await getServerType('oauth');
	// uni.showLoading({
	// 	mask: true,
	// 	title: '登录中'
	// })
	uni.checkSession({
		success: () => {
			uni.login({
				provider:provider.toString(),
				onlyAuthorize: true,
				success(e) {
					getOpenId({
						code: e.code,
						type: 'mini'
					}).then(res => {
						if(+res?.code === 0) {
							uni.setStorageSync('openId', res.data.openid)
							getUserInfo(res.data.openid)
						}
					})
				}
			})
		},
		fail: () => {
			uni.login({
				provider:provider.toString(),
				onlyAuthorize: true,
				success(e) {
					console.log(e.code);
					const code = e.code;
					getOpenId({
						code: code,
						type: 'mini'
					}).then(res => {
						if(+res?.code === 0) {
							uni.setStorageSync('openId', res.data.openid)
						}
					})
				}
			})
		}
	})

}

function getUserInfo (openId) {
	weChatLogin({
		openId: openId
	}).then(res => {
		if(+res.code ===0) {
			store.dispatch('setUserInfo', {
				userId: res.data.userId,
				token: res.data.token,
				userPortait: res.data.userPortait,
				username: res.data.username,
				mobile: res.data.mobile,
				nickName: res.data.nickName,
				qqEmail: res.data.qqEmail||''
			})
			uni.$emit('login')
		} else {
			store.dispatch('loginOut')
			let routes = getCurrentPages() //获取当前页面栈
			if(routes.length === 0){
				uni.setStorageSync('redirect', '/')
			} else {
				let curRoute ='/' + routes[routes.length - 1].route //获取当前页面的路由
				uni.setStorageSync('redirect', curRoute)
			}
		
			uni.navigateTo({
				url: '/pages/bindWx/bindWx?redirect=',
				success: (e) => {
					console.log(e);
				},
				fail: (e) => {
					console.error(e);
				}
			})
		}
	})
}
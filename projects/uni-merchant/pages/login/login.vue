<template>
	<view class="wrap">
		<view class="top-wrap">
			<view class="img-box">
				<image src="../../static/images/login_logo.png" mode=""></image>
			</view>
			<text>商家端后台管理系统</text>
		</view>
		<view class="botm-wrap">
			<view class="input-wrap">
				<view class="username">
					<input type="text" v-model.trim="username" placeholder="请输入登录账号" />
				</view>
				<view class="password">
					<input type="text" v-model.trim="password" password placeholder="请输入登录密码" />
				</view>
			</view>

			<view class="handle-password">
				<checkbox-group @change="checkboxChange">
					<label v-for="(item,index) in checkItems" :key="index">
						<checkbox :value="item.value" :checked="rememberPassStatus" />{{item.name}}
					</label>
				</checkbox-group>
				<text class="forget-password" @click="forgetPassword">忘记密码？</text>
			</view>
			<view class="login-btn" @click="login">登录</view>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import RongIMLib from '../../common/js/RongIMLib-3.0.7.1-dev.js'
	import {
		connectRongIM
	} from '../../common/js/conversation.js'

	// //客户端初始化
	var config = {
		appkey: Vue.prototype.$appkey,
	};
	var im = RongIMLib.init(config);


	export default {
		data() {
			return {
				username: '',
				password: '',
				token: '',
				checkItems: [{
					value: '1',
					name: '记住密码'
				}],
				rememberPassStatus: false,
			}
		},

		onLoad() {
			// 如果是安卓，就需要初始化
			// this.setupWebViewJavascriptBridge(function(bridge) {
			// 	bridge.init(function(message, responseCallback) {
			// 		responseCallback("");
			// 	});
			// });

			// this.setupWebViewJavascriptBridge(function(bridge) {
			// 	bridge.callHandler('getToken', function responseCallback(responseData) {
			// 		console.log('接收回调', responseData)
			// 		if (responseData) {
			// 			uni.switchTab({
			// 				url: '../store/store'
			// 			})
			// 		}
			// 	})
			// });

			// this.setupWebViewJavascriptBridge(function(bridge) {
			// 	bridge.registerHandler('receiveToken', (data, responseCallback) => {
			// 	    // callback(data, responseCallback)
			// 		if(data) {
			// 			alert(data)
			// 			console.log(data)
			// 		}
			// 	})
			// });

			this.showLoginInfo();
			this.linkToIndex();
		},

		methods: {
			//如果记住密码了，就回显用户登录信息
			showLoginInfo() {
				if (uni.getStorageSync('uni-loginInfo')) {
					const username = JSON.parse(uni.getStorageSync('uni-loginInfo')).username,
						password = JSON.parse(uni.getStorageSync('uni-loginInfo')).password;

					if (username && password) {
						this.username = username;
						this.password = password;
						this.rememberPassStatus = true;
					}
				}
			},

			//如果存在缓存就自动跳到首页
			linkToIndex() {
				if (uni.getStorageSync('uni-userInfo')) {
					if (JSON.parse(uni.getStorageSync('uni-userInfo')).token) {
						uni.switchTab({
							url: '../store/store'
						})
					}
				}
			},

			// setupWebViewJavascriptBridge(callback) {
			// 	if (window.WebViewJavascriptBridge) {
			// 		return callback(WebViewJavascriptBridge)
			// 	} else {
			// 		document.addEventListener('WebViewJavascriptBridgeReady', function() {
			// 			callback(WebViewJavascriptBridge)
			// 		}, false);
			// 	}
			// },

			//勾选框事件
			checkboxChange(e) {
				//如果记住密码勾上了，就将状态值改为真
				if (e.detail.value[0] == 1) {
					this.rememberPassStatus = true;
				} else {
					this.rememberPassStatus = false;
				}
			},

			//登录
			login() {
				this.$showLoading('登陆中');
				let data = {
					loginNameOrPhone: this.username,
					loginPassword: this.password,
					loginSource: 0
				}

				this.$post('/merchant/store/login', data).then(result => {
					if (result.code === 0) {
						const res = result.data;

						//如果记住密码了，就将登录信息存入缓存，否则就删除缓存
						if (this.rememberPassStatus) {
							let obj = {
								username: this.username,
								password: this.password
							};
							uni.setStorageSync('uni-loginInfo', JSON.stringify(obj));
						} else {
							uni.removeStorageSync('uni-loginInfo');
						}

						uni.setStorageSync('uni-userInfo', JSON.stringify(res));
						this.saveAuth();
						
						// this.setupWebViewJavascriptBridge(function(bridge) {
						// 	bridge.callHandler('saveToken', obj,
						// 		function(data, responseCallback) {

						// 		});
						// });

						uni.reLaunch({
							url: '../store/store'
						})
					} else {
						this.$errToast(result.msg)
					}
					uni.hideLoading()
				})
			},

			//保存权限等级
			saveAuth() {
				const role = JSON.parse(localStorage.getItem('uni-userInfo')) || ''
				if (role) {
					this.$store.commit('authFun', role.storeAuth)
				}
			},

			//忘记密码
			forgetPassword() {
				this.$errToast('请联系平台找回密码！');

				// uni.navigateTo({
				// 	url:'../mine/mySet/amendPass'
				// })
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding-top: 200rpx;
	}

	.top-wrap {
		margin-bottom: 118rpx;
		text-align: center;

		>text {
			font-size: 36rpx;
		}

		.img-box {
			width: 216rpx;
			height: 216rpx;
			margin: 0 auto 48rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.botm-wrap {
		padding: 0 120rpx 204rpx;

		.input-wrap {
			margin-bottom: 12rpx;

			>view {
				padding-left: 98rpx;
				height: 98rpx;
				width: 100%;
				border: 2rpx solid #191D26;
				border-radius: 48rpx;
				display: flex;
				align-items: center;
				position: relative;

				input {
					width: 100%;
					font-size: 28rpx;
				}

				&::before {
					display: block;
					content: "";
					width: 40rpx;
					height: 40rpx;
					background: url(../../static/icon/account%20.png) no-repeat;
					background-size: 100%;
					position: absolute;
					top: 50%;
					margin-top: -20rpx;
					left: 30rpx;
				}
			}

			>view:last-child {
				margin-top: 48rpx;

				&::before {
					background: url(../../static/icon/paddword.png) no-repeat;
					background-size: 100%;
				}
			}
		}

		.handle-password {
			text-align: right;
			font-size: 24rpx;
			margin-bottom: 48rpx;
			display: flex;
			justify-content: space-around;

			.forget-password {
				margin-left: 36rpx;
			}

			checkbox {
				transform: scale(0.6)
			}
		}

		.login-btn {
			width: 288rpx;
			height: 80rpx;
			background-color: #191D26;
			border-radius: 50rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #fff;
			margin: 0 auto;
		}
	}

	input {
		padding-left: 10rpx;
	}
</style>

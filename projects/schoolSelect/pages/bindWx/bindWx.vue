<template>
	<view class="wechatLogin">
		<view class="formTitle"><text>请输入手机号</text></view>
		<view class="formSubTitle"><text>未注册的手机号验证通过后将直接注册</text></view>
		<view class="inputBox">
			<input type="number" v-model="phone" placeholder="输入手机号" />
			<text class="errMsg">{{ phoneErrMsg }}</text>
		</view>
		<view class="inputBox">
			<input type="number" style="width:60%" v-model="smsCode" placeholder="输入验证码" />
			<text class="errMsg">{{ smsCodeStatus }}</text>
			<text class="btn" v-if="!smsLook" @click="getSms">{{ smsStatus ? '重新获取' : '获取验证码' }}</text>
			<text class="btn" v-else>重新获取{{ smsTime }}秒</text>
		</view>
		<view class="subBtn" @click="submit">确定</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import axios from 'axios';
import qs from 'qs';
import { getSms, bindWx } from '../../api/login.js';
import store from '../../store'
export default {
	name: 'wechatLogin',
	data() {
		return {
			phone: '',
			phoneErrMsg: false,
			phoneReg: /^[1]([3-9])[0-9]{9}$/,
			bindPhoneShow: false,
			smsCodeStatus: false,
			sms: '',
			smsCode: '',
			smsStatus: false,
			smsLook: false,
			smsTime: 120,
			isTeacher: 0,
			schoolId: '',
			loading: false
		};
	},
	watch: {
		phone: function(val) {
			this.phoneErrMsg = this.phoneReg.test(val);
		},
		smsCode: function(val) {
			this.smsCodeStatus = val === this.sms;
		}
	},
	methods: {
		getSms() {
			const that = this;
			if (this.smsLook) {
				return;
			}
			if (this.phone && this.phoneErrMsg) {
				this.smsLook = true;
				uni.showLoading({
					mask: true,
					title: '正在发送',
					position: 'center'
				})
				// uni.$u.toast({
				// 	type: 'loading',
				// 	loading: this.loading,
				// 	icon: false,
				// 	message: '正在发送',
				// 	iconUrl: 'https://cdn.uviewui.com/uview/demo/toast/loading.png'
				// });
				getSms(this.phone).then(res => {
					if (+res.code === 0) {
						uni.hideLoading()
						uni.showToast({
							icon: 'success',
							title: '发送短信成功',
							position: 'bottom'
						})
						this.startSmsTime();
					} else {
						uni.showToast({
							icon: 'error',
							title: '失败',
							position: 'bottom'
						})
					}
				});
			} else {
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'error',
						position: 'bottom'
					})
				} else if (!this.phoneErrMsg) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'error',
						position: 'bottom'
					})
				}
			}
		},
		startSmsTime() {
			this.smsStatus = true;
			this.smsTime = 120;
			let timer = setInterval(() => {
				if (this.smsTime <= 0) {
					clearInterval(timer);
					this.smsTime = 120;
					this.smsLook = false;
				}
				this.smsTime--;
			}, 1000);
		},
		submit() {
			if (!this.phone && this.phoneErrMsg) {
				uni.showToast({
					title: '请输入正确的手机号',
					icon: 'error',
					position: 'bottom'
				})
			} else if (!this.smsCode) {
				uni.showToast({
					title: '请输入短信验证码',
					icon: 'error',
					position: 'bottom'
				})
				this.smsCodeStatus = true;
			} else {
				//#ifdef MP-WEIXIN
				const FormData = require('../../base/formData');
				const formData = new FormData();
				formData.append('phone', this.phone);
				formData.append('openId', uni.getStorageSync('openId'));
				formData.append('smsCode', this.smsCode);
				const data = formData.getData();
				uni.showLoading({
					mask: true,
					title: '登录中'
				})
				bindWx(data.buffer, data.contentType).then(async res => {
					console.log(res, 777777);
					if (+res.code === 0) {
						console.log('绑定成功', res);
						store.dispatch('setUserInfo', {
							userId: res.data.userId,
							token: res.data.token,
							userPortait: res.data.userPortait,
							username: res.data.username,
							mobile: res.data.mobile,
							nickName: res.data.nickName,
							qqEmail: res.data.qqEmail
						});
						
						const redirect = uni.getStorageSync('redirect')
						uni.navigateTo({
							url: redirect?redirect:'/pages/user/user',
							success: e => {
								uni.removeStorageSync('redirect')
							},
							fail: e => {
								uni.switchTab({
									url: redirect?redirect:'/pages/user/user',
									success: e => {
										uni.removeStorageSync('redirect')
									},
									fail: e => {
									}
								});
							}
						})
						uni.$emit('login');
					} else {
					}
				}).finally(() => {
					uni.hideLoading()
				});
				//#endif
			}
		}
	},
	created() {},
	mounted() {
		// vant.Toast('微信未绑定用户信息，请输入要绑定的手机号');
	}
};
</script>

<style scoped lang="scss">
.wechatLogin {
	padding: 0 40px;
	* {
		box-sizing: border-box;
	}
	.logoInfo {
		margin-top: 24px;
		display: flex;
		align-items: center;
		img {
			width: 24px;
			height: 24px;
			margin-right: 8px;
		}
		span {
			font-size: 14px;
			color: #a2a5af;
		}
	}
	.formTitle {
		margin-top: 12px;
		color: #2d3540;
		font-weight: bold;
		font-size: 28px;
	}
	.formSubTitle {
		margin-top: 10px;
		font-size: 16px;
		color: #a2a5af;
		margin-bottom: 28px;
	}
	.inputBox {
		position: relative;
		height: 48px;
		padding: 0 20px;
		border-radius: 24px;
		overflow: hidden;
		background: #f6f7fb;
		margin-bottom: 16px;
		input {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			border: none;
			outline: none;
			background: rgba(255, 255, 255, 0);
			font-size: 18px;
			color: #000000;
			&::placeholder {
				font-size: 16px;
				color: #babfce;
			}
		}
		.btn {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			right: 20px;
			z-index: 1;
			font-size: 16px;
			color: #a2a5af;
		}
	}
	.subBtn {
		margin-top: 28px;
		height: 48px;
		background: linear-gradient(90deg, #ffc131 0%, #ff913d 100%);
		border-radius: 49px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		color: #ffffff;
	}
}
</style>

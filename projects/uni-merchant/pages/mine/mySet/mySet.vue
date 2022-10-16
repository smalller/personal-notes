<template>
	<view class="mySet">
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" content="确定要退出当前账号吗"
		 @confirm="resHandle"></u-modal>
		<navBar :switchUrl="'../mine'">设置</navBar>
		<view class="has-navBar">
			<view class="headPhoto">
				<view>
					<text class="iconfont">&#xe64b;</text>
					<text>头像</text>
				</view>
				<image :src="showImgPrefix + logo"></image>
			</view>
			<view class="password">
				<view>
					<text class="iconfont">&#xe627;</text>
					<text>密码</text>
				</view>
				<view class="pass-seat" @click="goPasswordset">
					<text>设置</text>
					<text class="iconfont">&#xe6f2;</text>
				</view>
			</view>
			<view class="phoneNum">
				<view style="display: flex;">
					<text class="iconfont">&#xe62e;</text>
					<text>手机</text>
					<!-- <input v-model="phone" disabled="true" style="margin-left: 80rpx; color: #ccc;" /> -->
				</view>
				<view :style="{color: '#ccc'}">{{phone}}</view>
				<!-- <view class="phone-seat" @click="goPhoneset">
					<text>修改</text>
					<text class="iconfont">&#xe6f2;</text>
				</view> -->
			</view>
			<template v-if="$store.state.auth > 0 ">
				<view class="password" @click="addAccount()">
					<view>
						<text class="iconfont">&#xe627;</text>
						<text>增加子账号</text>
					</view>
					<view class="pass-seat" >
						<text></text>
						<text class="iconfont">&#xe6f2;</text>
					</view>
				</view>
			</template>
			
		</view>
		<view class="btom-btn">
			<view @click="modalShow = true">退出当前账号</view>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import RongIMLib from '../../../common/js/RongIMLib-3.0.7.1-dev.js'
	
	//客户端初始化
	var config = {
		appkey : Vue.prototype.$appkey
	};
	var im = RongIMLib.init(config);
	
	export default {
		data() {
			return {
				showImgPrefix: this.$imgHead,
				modalShow: false,
				logo: '',
				phone: '',
			}
		},

		onLoad(option) {
			this.userInfo = JSON.parse(uni.getStorageSync('uni-userInfo'));
			this.logo = this.userInfo.logo;
			this.phone = this.userInfo.phone;
		},

		methods: {
			goPhoneset() {
				uni.navigateTo({
					url: "./phoneSet"
				})
			},
			goPasswordset() {
				uni.navigateTo({
					url: "./passwordSet"
				})
			},
			
				
			addAccount(){
				uni.navigateTo({
					url: "./addAccount"
				})
			},

			//退出确认
			resHandle() {
				this.$get('/merchant/store/logout').then((res) => {
					//断开链接融云服务器
					im.disconnect().then(() => {});
					uni.showToast({
						title: "退出成功",
						duration: 1000,
						success: (res) => {
							uni.removeStorageSync('uni-userInfo');
							setTimeout(() => {
								uni.reLaunch({
									url: '../../login/login'
								})
							}, 1000)
						}
					})

				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.has-navBar {
		padding: 168rpx 24rpx 0;
	}

	.headPhoto {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22rpx 0;
		border-bottom: 1px solid #f1f1f1;

		text {
			vertical-align: middle;
			font-size: 28rpx;

			&:nth-child(1) {
				font-size: 40rpx;
				margin-right: 22rpx;
			}
		}

		image {
			width: 72rpx;
			height: 72rpx;
			border-radius: 50%;
			margin-right: 10rpx;
		}
	}

	.password {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22rpx 0;
		border-bottom: 1px solid #f1f1f1;

		text {
			vertical-align: middle;
			font-size: 28rpx;

			&:nth-child(1) {
				font-size: 40rpx;
				margin-right: 22rpx;
			}
		}

		.pass-seat {
			text {
				&:nth-child(1) {
					font-size: 28rpx;
					color: #CCCCCC;
				}

				&:nth-child(2) {
					display: inline-block;
					font-size: 28rpx;
					color: #CCCCCC;
					transform: rotate(-90deg);
				}
			}
		}
	}

	.phoneNum {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 22rpx 0;
		border-bottom: 1px solid #f1f1f1;

		text {
			vertical-align: middle;
			font-size: 28rpx;

			&:nth-child(1) {
				font-size: 40rpx;
				margin-right: 22rpx;
			}
		}

		.phone-seat {
			text {
				&:nth-child(1) {
					font-size: 28rpx;
					color: #CCCCCC;
				}

				&:nth-child(2){
					display: inline-block;
					font-size: 28rpx;
					color: #CCCCCC;
					transform: rotate(-90deg);
				}
			}
		}
	}

	.btom-btn {
		padding: 0 96rpx;
		position: fixed;
		bottom: 48rpx;

		>view {
			width: 560rpx;
			height: 92rpx;
			background-color: #67a8fc;
			color: #fff;
			font-size: 36rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 12rpx;
		}
	}
</style>

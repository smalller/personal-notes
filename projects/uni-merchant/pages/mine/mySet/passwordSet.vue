<template>
	<view>
		<view class="nav-bar-wrap">
			<text class="iconfont" @click="goBack">&#xe625;</text>
			<text>修改密码</text>
			<text @click="goOver">完成</text>
		</view>
		<view class="old-password">
			<view class="top-one">
				<text>请输入旧密码</text>
				<text @click="amendPass">忘记密码？</text>
			</view>
			<input type="number" password="true" v-model="oldPassword" />
		</view>
		<view class="new-password">
			<view class="top-one">
				<text>请输入新密码</text>
			</view>
			<input type="number" password="true" v-model="newPassword" />
		</view>
		<view class="new-again">
			<view class="top-one">
				<text>再次确认密码</text>
			</view> 
			<input type="number" password="true" v-model="sureNewPassword" />
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword : '',
				newPassword : '',
				sureNewPassword : '',
			}
		},
		methods: {
			goBack() {
				uni.navigateTo({
					url:'./mySet'
				})
			},
			
			goOver() {
				const data = {
					newPassword : this.newPassword,
					oldPassword : this.oldPassword,
				}
				
				if(this.newPassword !== this.sureNewPassword) {
					this.$errToast('两次输入密码不一致');
				} else {
					this.$post('/merchant/store/updatePassword',data).then((res) => {
							console.log(res);
							if(res.code === 0) {
								uni.showToast({
									title: "修改成功",
									duration: 1000,
									success: (res) => {
										uni.removeStorageSync('uni-userInfo');
										setTimeout(() => {
											uni.navigateTo({
												url:'../../login/login'
											})
										},1000)
									}
								})
							} else {
								this.$errToast(res.msg);
							}
						}
					);
				}
			},
			amendPass(){
				this.$errToast('请联系平台找回密码！');
				
				// uni.navigateTo({
				// 	url:'amendPass'
				// })
			}
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body {
		height: 100%;
		background-color: #f7f7f7;
	}
	.nav-bar-wrap {
		width: 100%;
		height: 88rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
		
		.iconfont {
			font-size: 32rpx;
		}
	}

	.old-password {
		.top-one {
			padding: 0 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 88rpx;

			text {
				&:nth-child(1) {
					font-size: 28rpx;
					color: #999999;
				}
				&:nth-child(2) {
					font-size: 28rpx;
					color: #022877;
				}
			}
		}
		input{
			font-size: 28rpx;
			padding: 26rpx 0 26rpx 48rpx;
			background-color: #fff;
			width: 100%;
			height: 92rpx;
			box-sizing: border-box;
			border-radius: 0;
		}
	}
	.new-password{
		.top-one {
			padding: 0 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 88rpx;
		
			text {
				&:nth-child(1) {
					font-size: 28rpx;
					color: #999999;
				}
			}
		}
		input{
			font-size: 28rpx;
			padding: 26rpx 0 26rpx 48rpx;
			background-color: #fff;
			width: 100%;
			height: 92rpx;
			box-sizing: border-box;
			border-radius: 0;
		}
	}
	.new-again{
		.top-one {
			padding: 0 48rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			height: 88rpx;
		
			text {
				&:nth-child(1) {
					font-size: 28rpx;
					color: #999999;
				}
			}
		}
		input{
			font-size: 28rpx;
			padding: 26rpx 0 26rpx 48rpx;
			background-color: #fff;
			width: 100%;
			height: 92rpx;
			box-sizing: border-box;
			border-radius: 0;
		}
	}
</style>

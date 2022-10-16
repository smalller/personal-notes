<template>
	<view>
		<view class="nav-bar-wrap">
			<text class="iconfont" @click="goBack">&#xe625;</text>
			<text>忘记密码</text>
			<text @click="goOver">完成</text>
		</view>
		<view class="old-password">
			<view class="top-one">
				<text>请输入手机号</text>
			</view>
			<input type="number" />
		</view>
		<view class="old-password">
			<view class="top-one">
				<text>请输入新密码</text>
			</view>
			<input type="number" password="true" />
		</view>
		<view class="new-password">
			<view class="top-one">
				<text>再次确认密码</text>
			</view>
			<input type="number" password="true" />
		</view>
		<view class="new-again">
			<view class="top-one">
				<text>请输入验证码</text>
			</view>
			<view class="twoor">
				<input type="number" />
				<text>获取验证码</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goBack() {
				uni.navigateBack(1)
			},
			goOver() {
				console.log(1)
			},
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
		.twoor {
			position: relative;
			text {
				font-size: 28rpx;
				color: #022877;
				position: absolute;
				right: 40rpx;
				top: 26rpx;
			}
		}
	}
</style>

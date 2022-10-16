<template>
	<view>
		<view class="nav-bar-wrap">
			<text class="iconfont" @click="goBack">&#xe625;</text>
			<text>更换绑定手机</text>
			<text @click="goOver">完成</text>
		</view>
		<view class="hint">
			更换绑定手机的同时，我们将会为您的原手机号码发送一条通知短信，请注意查收
		</view>
		<view class="phone-num">
			<input type="number" placeholder="请输入新手机号码" />
		</view>
		<view class="verification">
			<view class="code">验证码</view>
			<view class="twoor">
				<input type="number" placeholder="请输入验证码" />
				<text>获取验证码</text>
			</view>
		</view>
	</view>

</template>

<script>
	export default{
		data(){
			return{
				
			}
		},
		methods:{
			goBack(){
				uni.navigateBack(1)
			},
			goOver(){
				console.log(1)
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
	}

	.hint {
		font-size: 28rpx;
		padding: 0 48rpx;
		margin: 24rpx 0;
		color: #999999;

	}

	.phone-num {
		input {
			font-size: 28rpx;
			padding: 26rpx 0 26rpx 48rpx;
			background-color: #fff;
			width: 100%;
			height: 92rpx;
			box-sizing: border-box;
			border-radius: 0;
		}
	}

	.verification {
		

		.code {
			font-size: 28rpx;
			color: #999999;
			padding: 0 0 0 48rpx;
			margin: 24rpx 0;
		}

		.twoor {
			position: relative;
			input {
				font-size: 28rpx;
				padding: 26rpx 0 26rpx 48rpx;
				background-color: #fff;
				width: 100%;
				height: 92rpx;
				box-sizing: border-box;
				border-radius: 0;
			}

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

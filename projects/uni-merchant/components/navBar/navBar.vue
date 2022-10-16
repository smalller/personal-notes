<template>
	<view>
		<view class="nav-bar-wrap">
			<view class="back-btn" @click="handleBack">
				<text class="iconfont">&#xe625;</text>
			</view>
			<view class="title-box">
				<h1 @click="handleclick">
					<slot></slot>
				</h1>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ["switchUrl", "navigateUrl","isUpdate"],

		data() {
			return {

			}
		},
		methods: {
			handleBack() {
				if(this.isUpdate === false) {
					this.$errToast('请先配置门店相关信息');
					return;
				}
				if (this.navigateUrl) {
					uni.navigateTo({
						url: this.navigateUrl
					})
				} else if (this.switchUrl) {
					uni.switchTab({
						url: this.switchUrl
					})
				} else {
					uni.navigateBack({});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nav-bar-wrap {
		position: fixed;
		z-index: 990;
		width: 100%;
		height: 88rpx;
		background-color: $uni-bg-color-navbar;
		display: flex;
		align-items: center;
		box-sizing: border-box;

		.back-btn {
			height: 100%;
			position: absolute;
			left: 24rpx;
			display: flex;
			align-items: center;

			text {
				font-size: 32rpx;
			}
		}

		.title-box {
			margin: 0 auto;

			h1 {
				font-size: 32rpx;
				font-weight: 400;
				color: #000;
			}

		}
	}
</style>

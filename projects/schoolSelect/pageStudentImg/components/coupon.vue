<template>
	<view class="couponBox" v-if="show">
		<view class="mask"></view>
		<view class="infoBox">
			<image src="../static/couponIcon.png" mode=""></image>
			<text class="title">参与成功</text>
			<text class="more">兑换劵已发送到个人中心</text>
			<text class="info">请于{{activityData.vld}}前往{{activityData.address}}</text>
			<view class="btn" @click="show = false">
				留在当前页
			</view>
			<view class="btn reviewBtn" @click="openAvtivity">
				查看兑换劵
			</view>
			<view class="closeBtn" @click="show = false">
				<image src="../static/close.png"  mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				show: false,
				activityData: {}
			}
		},
		created() {
			const that = this;
			uni.$on('couponPaySuccess', (data) => {
				this.activityData = data
				that.show = true;
			})
		},
		methods: {
			openAvtivity() {
				this.show = false;
				console.log(this.activityData);
				// uni.$emit('showActivity')
				uni.navigateTo({
					url: `/pages/coupon/coupon`
				})
			}
		}
	}
</script>

<style lang="scss">
	.couponBox{
		width: 100vw;
		height: 100vh;
		position: fixed;
		top: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		.mask {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			z-index: -1;
		}
		.infoBox{
			background: #ffffff;
			width: 300px;
			height: 359px;
			border-radius: 24px;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
			box-sizing: border-box;
			position: relative;
			image{
				width: 80px;
				height: 80px;
				margin-top: 8px;
			}
			.title{
				color: #333333;
				font-weight: 700;
				font-size: 18px;
				margin-top: 16px;
			}
			.more{
				color: #FE5A6E;
				font-weight: 400;
				font-size: 16px;
				margin-top: 6px;
			}
			.info{
				color: #333333;
				font-weight: 400;
				font-size: 13px;
				margin-top: 2px;
				display: flex;
				justify-content: center;
				text-align: center;
			}
			
			.btn{
				width: 100%;
				height: 44px;
				background: linear-gradient(270deg, #FF8B02 5.36%, #FFAF51 100%);
				border-radius: 40px;
				display: flex;
				justify-content: center;
				align-items: center;
				color: #FFFFFF;
				font-weight: 700;
				font-size: 18px;
				margin-top: 20px;
				&.reviewBtn{
					background: #80BF75;
					margin-top: 12px;
				}
			}
			.closeBtn{
				position: absolute;
				z-index: 2;
				right: 16px;
				top: 16px;
				width: 32px;
				height: 32px;
				image{
					width: 100%;
					height: 100%;
					margin: 0;
				}
			}
		}
	}
</style>
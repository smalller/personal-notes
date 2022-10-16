<template>
	<view class="paySuccess" v-if="show">
		<view class="mask"></view>
		<view class="infoBox">
			<image src="../static/success.png" mode=""></image>
			<text class="title">购买成功</text>
			<text class="info">照片稍后将发送到你的邮箱</text>
			<text class="email">{{email}}</text>
			<view class="btn" @click="openAvtivity">
				更多活动
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
				show: false
			}
		},
		computed: {
			email: function() {
				if (this.$store.getters) {
					return this.$store.getters.email;
				} else {
					return '';
				}
			},
		},
		created() {
			const that = this;
			uni.$on('imgPaySuccess', () => {
				that.show = true;
			})
		},
		methods: {
			openAvtivity() {
				this.show = false;
				uni.$emit('showActivity')
			}
		}
	}
</script>

<style lang="scss">
	.paySuccess{
		width: 100vw;
		height: 100vh;
		position: fixed;
		z-index: 1;
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
			height: 284px;
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
			.info{
				color: #FE5A6E;
				font-weight: 500;
				font-size: 16px;
				margin-top: 6px;
			}
			.email{
				color: #333333;
				font-weight: 500;
				font-size: 13px;
				margin-top: 2px;
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
<template>
	<view class="mine">
		<view class="nav-bar-wrap">我的</view>
		<view class="mine_bottom">
			<view class="user">
				<view class="left">
					<image :src="showImgPrefix + logo" class="img"></image>
					<text>{{storeName}}</text>
				</view>
				<text class="iconfont" @click="goSet">&#xe629;</text>
			</view>
			
			<template v-if="$store.state.auth > 0 ">
				<view class="my-scheme">
					<view class="header">
						<image src="../../static/icon/fangan.png"></image>
						<text>我的方案</text>
					</view>
					<view class="coupon" @click="goCoupon">
						优惠劵
					</view>
					<view class="activity" @click="goActivity">
						活动推广
						<view class="go-extension">
							<text>去推广</text>
							<view>
								<text>GO</text>
							</view>
						</view>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showImgPrefix: this.$imgHead,
				title: 'Hello',
				logo : '',
				storeName : '',
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		
		//当用户退出登录其他号时，就避免logo和店铺名称没改过来
		onTabItemTap() {
			this.getUserInfo();
		},
		
		methods: {
			//获取logo和店铺名称
			getUserInfo() {
				const userInfo = JSON.parse(uni.getStorageSync('uni-userInfo'));
				this.logo = userInfo.logo;
				this.storeName = userInfo.storeName;
			},
			
			goSet(){
				uni.navigateTo({
					url:`mySet/mySet`
				})
			},
			
			goCoupon(){
				uni.navigateTo({
					url:"myCoupons/myCoupons"
				})
			},
			goActivity(){
				uni.navigateTo({
					url:'myActivity/myActivity'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes myrotate
	{
	from {transform:rotate(0deg);}
	to {transform:rotate(360deg);}
	}
	uni-page-body {
		width: 100%;
		height: 100%;
	}

	.mine {
		width: 100%;
		min-height: 100%;
		height: auto;
		// height: 100%;
		background-color: #f7f7f7;
	}

	.nav-bar-wrap {
		height: 88rpx;
		width: 100%;
		text-align: center;
		line-height: 88rpx;
		font-size: 36rpx;
		background-color: #FDFDFD;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 990;
	}

	.mine_bottom {
		width: 100%;
		min-height: 100%;
		height: auto;
		padding: 88rpx 24rpx 0;

		.user {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 24rpx 48rpx;
			background-color: #fff;
			border-radius: 15rpx;
			margin-top: 24rpx;
			
			.left {
				display: flex;
				align-items: center;
				height: 128rpx;
				width: 100%;

				image {
					// animation:myrotate 2s infinite linear;
					max-width: 128rpx;
					max-height: 128rpx;
					border-radius: 50%;
					margin-right: 24rpx;
				}

				> text {
					// width: 50%;
					font-size: 32rpx;
					font-weight: 600;
					
					white-space:nowrap;		
					overflow:hidden;		
					text-overflow:ellipsis;	
				}

				.iconfont {
					animation:myrotate 1.5s linear;
					font-size: 32rpx;
				}
			}
			
			.iconfont {
				font-size: 32rpx;
			}

		}
	}
	
	.mine_bottom::after {
		display: table;
		content: "";
	}
	
	.my-scheme{
		width: 100%;
		border-radius: 15rpx;
		background-color: #fff;
		margin-top: 24rpx;
		margin-bottom: 100rpx;
		padding: 48rpx;
		padding-bottom: 114rpx;
		.header{
			image{
				width: 34rpx;
				height: 42rpx;
				vertical-align: middle;
			}
			text{
				font-size: 32rpx;
				font-weight: 600;
				vertical-align: middle;
				margin-left: 12rpx;
			}
		}
		.coupon{
			width: 100%;
			height: 316rpx;
			background: url(../../static/images/youhuijuan.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			box-sizing: border-box;
			padding: 54rpx 0 0 48rpx;
			box-sizing: border-box;
			font-size: 42rpx;
			color: #FFFFFF;
			margin-top: 24rpx;
		}
		.activity{
			width: 100%;
			height: 316rpx;
			background: url(../../static/images/tuiguang.png);
			background-repeat: no-repeat;
			background-size: 100% 100%;
			box-sizing: border-box;
			padding: 54rpx 0 0 48rpx;
			box-sizing: border-box;
			font-size: 42rpx;
			color: #FFFFFF;
			margin-top: 24rpx;
			.go-extension{
				border: 1px solid #fff;
				box-sizing: border-box;
				margin: 92rpx 0 0 8rpx;
				width: 116rpx;
				height: 40rpx;
				border-radius: 40rpx;
				line-height: 38rpx;
				display: flex;
				text-align: center;
				justify-content: space-between;
				background:linear-gradient(to bottom,#FFE873,#FFC984);
				text{
					box-sizing: border-box;
					&:nth-child(1){
						font-size: 20rpx;
						color: #FFFFFF;
						display: inline-block;
						width: 65%;
						text-align: right;
						white-space: nowrap;
						transform: scale(0.9);
					}
				}
				view{
					display: inline-block;
					font-size: 20rpx;
					background-color: #fff;
					border-radius: 50%;
					width: 38rpx;
					height: 38rpx;
					line-height: 38rpx;
					padding-right: 8rpx;
					text{
					color: #FFCA83!important;
					transform: scale(0.8)!important;
					}
				}
			}
		}
	}
</style>

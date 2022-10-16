<template>
	<view class="vip">
		<view class="vipHead"></view>
		<view class="vipContent">
			<view class="vipTips">
				<image src="../../static/image/vipBg2.png" mode=""></image>
				<view class="userInfo">
					<view class="userIcon">
						<image :src="userInfo.userPortait" shape="circle">
					</view>
					<view class="userText">
						<text>{{userInfo.nickName}}</text>
						<text v-if="vipInfo.isVip">VIP会员有效期至：{{vipInfo.expireTime}}</text>
						<text v-else class="tagText">您当前未开通VIP会员</text>
					</view>
				</view>
				
			</view>
			<view class="vipBtn">
				<view class="vipName">
					<text>年费VIP会员</text>
				</view>
				<view class="vipNum">
					<text>￥</text>
					<text>{{products.amount}}</text>
				</view>
				<view class="vipText">
					<text>折合¥{{(products.amount/12).toFixed(1)}}/月</text>
				</view>
			</view>
			<view class="btnBox">
				<button type="default" @click="sendPay">确认协议并支付</button>
			</view>
			<view class="vipMsg">
				<text>开通前请阅读</text>
				<text @click="toVipInfo">《会员服务协议》</text>
			</view>
		</view>
		<view class="vipDetails">
			<view class="detailsTitle">
				<text>VIP会员特权</text>
			</view>
			<view class="detailsBox">
				<view class="detailsItem">
					<view class="left">
						<image src="../../static/image/icons/icon3.png" mode=""></image>
					</view>
					<view class="right">
						<text>观看全部视频</text>
						<text>平台优质视频全开放</text>
					</view>
				</view>
				<view class="detailsItem">
					<view class="left">
						<image src="../../static/image/icons/icon4.png" mode=""></image>
					</view>
					<view class="right">
						<text>一对一咨询</text>
						<text>专家提供一对一指导</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getProducts } from '../../api/pay.js';
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				productType: 'Vip',
				products: {}
			};
		},
		computed: {
			userInfo: function() {
				if (this.$store.getters) {
					return this.$store.getters.userInfo;
				} else {
					return {};
				}
			},
			vipInfo: function() {
				if (this.$store.getters) {
					const info = this.$store.getters.vipInfo
					info.expireTime = dayjs(info.expireTime).format('YYYY-MM-DD')
					return	info;
					// return this.$store.getters.vipInfo;
				} else {
					return {};
				}
			},
		},
		onLoad() {
			uni.setNavigationBarColor({
				backgroundColor: '#FFF7E2',
				frontColor: '#000000'
			});
			this.getProducts()
		},
		methods: {
			//获取商品价格列表
			getProducts() {
				getProducts({
					productType: this.productType,
				}).then(res => {
					console.log(res);
					if(+res.code === 0) {
						this.products = res.data[0]
					}
				})
			},
			//购买会员
			sendPay() {
				uni.showLoading({
					mask: true,
					title: '支付中'
				})
				this.$Pay({
				productType: this.productType,
				productId: this.products.id,
				number: 1
			}).then(e => {
					console.log(e);
					this.$store.dispatch('getVip')
					uni.showToast({
						icon: 'success',
						title: '购买会员成功'
					})
				}).catch(e => {
					console.log(e);
					uni.showToast({
						icon: 'none',
						title: '支付失败'
					})
				}).finally(() => {
					uni.hideLoading()
				})
			},
			//前往会员服务协议
			toVipInfo() {
				uni.navigateTo({
					url: '../vipInfo/vipInfo'
				})
			}
		}
	}
</script>

<style lang="scss">
.vip{
	width: 100vw;
	.vipHead{
		background: #FFF7E2;
		height: 100px;
		width: 100%;
	}
	.vipContent{
		width: 100%;
		transform: translateY(-10px);
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		background: #FFFFFF;
		position: relative;
		padding: 72px 15px 0;
		box-sizing: border-box;
		border-bottom: 10px solid #F6F6F6;
		.vipTips{
			position: absolute;
			left: 50%;
			top: -40px;
			transform: translateX(-50%);
			width: calc(100% - 30px);
			height: 85px;
			image{
				width: 100%;
				height: 100%;
			}
			.userInfo{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				display: flex;
				padding: 18px 12px;
				box-sizing: border-box;
				.userIcon{
					width: 50px;
					height: 50px;
					image{
						border-radius: 50%;
						width: 100%;
						height: 100%;
					}
				}
				.userText{
					margin-left: 10px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					height: 100%;
					text{
						&:first-child{
							font-weight: 500;
							color: #333333;
							font-size: 18px;
						}
						&:last-child{
							font-weight: 400;
							color: #6C6C6C;
							font-size: 12px;
						}
					}
					.tagText {
						color: #f6a13e;
						font-size: 12px;
					}
				}
			}
		}
		.vipBtn{
			display: flex;
			flex-direction: column;
			align-items: center;
			border: 2px solid #F8B970;
			border-radius: 6px;
			width: 100%;
			height: 120px;
			background: #FFF7E2;
			box-sizing: border-box;
			.vipName{
				margin-top: 12px;
				text{
					font-weight: bold;
					color: #6C6C6C;
					font-size: 18px;
				}
			}
			.vipNum{
				margin-top: 2px;
				text{
					color: #D68F3C;
					&:first-child{
						font-weight: 500;
						font-size: 18px;
					}
					&:last-child{
						margin-left: 8px;
						font-weight: bold;
						font-size: 36px;
					}
				}
			}
			.vipText{
				text{
					font-weight: 400;
					color: #6C6C6C;
					font-size: 14px;
				}
			}
		}
		.btnBox{
			margin-top: 30px;
			button{
				box-sizing: border-box;
				height: 44px;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				color: #FFFFFF;
				border-radius: 22px;
				background: linear-gradient(270deg, #F6A13E 0%, #FEC685 100%);
				font-size: 16px;
				margin: 0
				&::after{
					border: none;
				}
				&::after{
					border: none;
				}
			}
		}
		.vipMsg{
			margin-top: 12px;
			padding-bottom: 12px;
			display: flex;
			justify-content: center;
			text{
				font-size: 12px;
				&:first-child{
					color: #6C6C6C;
				}
				&:last-child{
					color: #333333;
				}
			}
		}
	}
	.vipDetails{
		width: 100%;
		padding: 12px 15px;
		box-sizing: border-box;
		.detailsTitle{
			text{
				font-weight: 500;
				color: #333333;
				font-size: 14px;
			}
		}
		.detailsBox{
			margin-top: 12px;
			display: flex;
			justify-content: space-between;
			.detailsItem{
				padding: 18px 12px;
				box-sizing: border-box;
				width: 168px;
				height: 72px;
				background: #FFF7E2;
				border-radius: 8px;
				display: flex;
				.left{
					width: 42px;
					height: 42px;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.right{
					margin-left: 10px;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					text{
						&:first-child{
							font-weight: 500;
							color: #333333;
							font-size: 14px;
						}
						&:last-child{
							font-weight: 500;
							color: #A6A6A6;
							font-size: 10px;
						}
					}
				}
			}
		}
	}
}
</style>

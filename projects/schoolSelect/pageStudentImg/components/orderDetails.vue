<template>
	<view class="orderDetails">
		<u-popup class="" :show="show" @close="close" @open="open" mode="bottom" closeOnClickOverlay :round="9">
			<view class="closeBtn" @click="close"><image src="../static/closeBtn.png" mode=""></image></view>
			<view class="head">订单详情</view>
			<view class="orderContent">
				<view class="projectInfo">
					<view class="left"><image :src="activityData.activityUrl" mode=""></image></view>
					<view class="right">
						<view class="title">{{ activityData.activity }}</view>
						<view class="subTitle">{{ activityData.name }}</view>
						<view class="time">{{ activityData.vld }}</view>
					</view>
				</view>
				<view class="orderDetailsBox">
					<view class="title">订单详情</view>
					<view class="item">
						<view class="label">所属活动：</view>
						{{ activityData.activity }}
					</view>
					<view class="item">
						<view class="label">使用地址：</view>
						{{ activityData.address }}
					</view>
					<view class="item">
						<view class="label">不可叠加：</view>
						{{ activityData.nonStackable }}
					</view>
					<view class="item">
						<view class="label">有 效&nbsp; 期：</view>
						{{ activityData.vld }}
					</view>
					<view class="item">
						<view class="label">卡卷名称：</view>
						{{ activityData.name }}
					</view>
					<view class="item">
						<view class="label">卡卷数量：</view>
						{{ activityData.num }}
					</view>
					<view class="item">
						<view class="label">商品金额：</view>
						<text>￥{{ activityData.picType === 3 ? activityData.amount : activityData.originalAmout }}</text>
					</view>
					<view class="item" v-if="activityData.picType === 4">
						<view class="label">优惠金额：</view>
						<text class="red">-￥{{ activityData.favorablePrice }}</text>
					</view>
					<view class="item" v-if="activityData.picType === 4">
						<view class="label">合计金额：</view>
						<text class="red">￥{{ activityData.amount }}</text>
					</view>
				</view>
				<view class="warn" v-if="activityData.picType === 3">优惠：{{ activityData.discount }}</view>
			</view>
			<view class="payNumBox">
				<view class="numBox">
					￥
					<text>{{ activityData.amount }}</text>
				</view>
				<view class="btn" @click="sendPay">立即支付</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			activityInfo: {},
			productList: {},
			activityData: {}
		};
	},
	created() {
		uni.$on('sendShowPicActivity', data => {
			this.activityData = data;
			this.activityInfo = uni.getStorageSync('activityInfo');
			this.productList = uni.getStorageSync('photoProduct');
			this.open();
		});
		uni.$on('couponPaySuccess', () => {
			this.show = false;
		});
	},
	methods: {
		close() {
			this.show = false;
		},
		open() {
			this.show = true;
		},
		sendPay() {
			const product = this.productList.find(item => item.picType === this.activityData.picType);

			uni.showLoading({
				mask: true,
				title: '支付中'
			});
			this.$Pay({
				productType: 'ShowPic',
				productId: product.id,
				mechanismName: this.activityInfo.mechanismName,
				activity: this.activityData.activity,
				picType: this.activityData.picType
			})
				.then(() => {
					uni.$emit('couponPaySuccess', this.activityData);
				})
				.catch(e => {
					uni.showToast({
						icon: 'error',
						title: '支付失败'
					});
				})
				.finally(() => {
					uni.hideLoading();
				});
		}
	}
};
</script>

<style lang="scss">
.orderDetails {
	position: relative;
	.closeBtn {
		width: 16px;
		height: 16px;
		position: absolute;
		top: 17px;
		left: 15px;
		image {
			width: 100%;
			height: 100%;
		}
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 44px;
		color: #000000;
		font-weight: 400;
		font-size: 17px;
		box-sizing: border-box;
		border-bottom: 1px solid #f6f7f9;
	}
	.orderContent {
		padding: 12px 16px;
		box-sizing: border-box;
		.projectInfo {
			display: flex;
			.left {
				width: 64px;
				height: 64px;
				border: 0.5px solid rgba(0, 0, 0, 0.05);
				border-radius: 4px;
				overflow: hidden;
				margin-right: 10px;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.right {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.title {
					color: #333333;
					font-weight: 700;
					font-size: 13px;
				}
				.subTitle {
					color: #333333;
					font-weight: 400;
					font-size: 14px;
				}
				.time {
					color: #999999;
					font-weight: 400;
					font-size: 12px;
				}
			}
		}
		.orderDetailsBox {
			margin-top: 16px;
			background: #f6f7f9;
			border-radius: 8px;
			padding: 12px;
			box-sizing: border-box;
			.title {
				color: #333333;
				font-weight: 700;
				font-size: 16px;
			}
			.item {
				display: flex;
				align-items: center;
				margin-top: 8px;
				color: #333333;
				font-weight: 400;
				font-size: 14px;
				text {
					font-weight: 700;
				}
				.label {
					display: flex;
					justify-content: space-between;
				}
				.red {
					color: #f64237;
				}
			}
		}
		.warn {
			margin-top: 10px;
			padding: 6px 12px;
			box-sizing: border-box;
			background: #fcf3f7;
			border-radius: 8px;
			color: #f64237;
			font-weight: 400;
			font-size: 12px;
			margin-bottom: 4px;
		}
	}
	.payNumBox {
		margin-top: 16px;
		height: 56px;
		width: 100%;
		padding: 6px 16px;
		box-sizing: border-box;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.numBox {
			color: #f64237;
			font-weight: 900;
			font-size: 16px;
			text {
				font-size: 28px;
			}
		}
		.btn {
			width: 119px;
			height: 44px;
			margin-left: 20px;
			background: linear-gradient(270deg, #ff8b02 5.36%, #ffaf51 100%);
			border-radius: 99px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #ffffff;
			font-weight: 700;
			font-size: 18px;
		}
	}
}
</style>

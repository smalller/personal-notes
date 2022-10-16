<template>
	<view>
		<view class="order-info" v-for="(item,index) in orderList" :key="index">
			<view class="first">
				<view class="seat-num">
					<text>{{storeLocation == 3 ? '包间类型：' : '座位号：'}}</text>
					<text class="weight-font">{{item.seatCode}}</text>
					<text class="small-font">({{item.orderType | orderType}})</text>
				</view>
				<view class="look-details" @click="handleSearchDetail(item.orderNo,item.status)">
					<text>查看详情</text>
				</view>
			</view>
			<view class="pay-status">
				<view>
					支付状态：
					<text class="weight-font">{{item.payStatus | payStatus}}</text>
					<text class="small-font">({{item.payWay | payWay}})</text>
				</view>
				<view class="status">
					<text>{{item.status | orderStatus}}</text>
				</view>
			</view>
			<view class="pay-money">
				实付金额：
				<text class="weight-font">￥{{item.paidAmount}}</text>
			</view>
		</view>
		<view v-if="orderList.length === 0" class="empty-order">
			<image src="../../../static/images/empty_order.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props:['storeLocation'],
		
		data() {
			return {
				//订单列表
				orderList: [],
				
			}
		},
		
		mounted() {
			this.getOrderList();
		},

		methods: {
			//获取父组件传过来的订单列表
			getOrderList() {
				uni.$on('cancelOrderList',res => {
					this.orderList = res;
				})
			},
			
			//查看订单详情
			handleSearchDetail(id,status) {
				uni.$emit('searchDetail', `./orderDetails/orderDetails?id=${id}&status=${status}`);
			},
		},
	}
</script>

<style lang="scss" scoped>
	.order-info {
		border: 2rpx solid #67A8FC;
		border-radius: 12rpx;
		padding: 24rpx 24rpx 24rpx 48rpx;
		margin-bottom: 24rpx;
		font-size: 32rpx;

		>view {
			margin-bottom: 24rpx;

			.weight-font {
				font-weight: 600;
			}

			.small-font {
				font-size: 24rpx;
			}
		}

		>view:last-child {
			margin-bottom: 0;
		}

		.pay-status {
			display: flex;
			align-items: center;
			justify-content: space-between;

			.status {
				margin-right: 26rpx;
				font-size: 28rpx;
				font-weight: 600;

				text {
					color: #FF3636;
				}
			}
		}

		.first {
			.look-details {
				width: 136rpx;
				height: 54rpx;
				border-radius: 26rpx;
				font-size: 24rpx;
				border: 2rpx solid #67A8FC;
				display: flex;
				justify-content: center;
				align-items: center;

				text {
					color: #67A8FC;
				}
			}
		}

		.pay-money {
			text {
				color: #FF3636;
			}
		}

		.handle-btn {
			display: flex;

			>view {
				margin-left: 60rpx;
				width: 214rpx;
				height: 72rpx;
				border: 2rpx solid #67A8FC;
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 32rpx;
			}

			.consent-btn {
				background-color: #67A8FC;

				text {
					color: #fff;
				}
			}

		}

		.first {
			display: flex;
			justify-content: space-between;
		}


	}
	
	.empty-order {
		image {
			width: 100%;
			height: auto;
		}
	}
</style>

<template>
	<view>
		<view class="order-info" v-for="(item,index) in orderList" :key="index">
			<view class="first">
				<view class="seat-num">
					<text>{{storeLocation == 3 ? '包间类型：' : '座位号：'}}</text>
					<text class="weight-font">{{item.seatCode}}</text>
					<text class="small-font">({{item.orderType | orderType}})</text>
				</view>
				<view class="look-details" @click="handleSearchDetail(item.orderNo,item.status,item.reminder)">
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
					<text>{{item.reminderTime === null ? '待处理' : '已催单'}}</text>
				</view>
			</view>
			<view class="pay-money">
				实付金额：
				<text class="weight-font">￥{{item.paidAmount}}</text>
			</view>
			<view>
				预定手机：
				<text class="iconfont" :style="{'font-size' : '36rpx', 'color' : 'rgb(103, 168, 252)'}">&#xe604;</text>
				<text class="weight-font call-phone" @click="callPhone(item.orderNo)">{{item.contactTel | phoneNum}}</text>
			</view>
			<view>
				到店时间：
				<text class="weight-font">{{item.retentionTime || '未知'}}</text>
			</view>
			<view class="handle-btn">
				<view class="refuse-btn" @click="handleOrder(1,item.id)">
					<text>拒单</text>
				</view>
				<view class="consent-btn" @click="handleOrder(2,item.id)">
					<text>接单</text>
				</view>
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
				
				//模态框属性
				modal : {
					modalShow: true, //模态框开关
					modalContent: '', //模态框要展示的内容
					handleOrderStatus: 1, //判断当前是接单操作还是拒单操作（1：接单，2：拒单）
					modalIndex : 2,	//从哪个标签页点击的模态框按钮
					id : '',	//要操作的订单id
				},
			}
		},
		
		mounted() {
			this.getOrderList();
		},

		methods: {
			//jsBridge初始化方法
			setupWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					return callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false);
				}
			},
			
			callhandler(phone) {
				this.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('callPhone', {
						'phone': phone
					}, function responseCallback(responseData) {})
				});
			},
			
			//打电话
			callPhone(orderNo) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.$showLoading();
				this.$post(`/merchant/store/order/customer/${orderNo}`).then(res => {
					if(res.code === 0) {
						const resType = uni.getSystemInfoSync().platform;
						if (resType === 'ios') {
							this.callhandler(res.data);
						} else if (resType === 'android') {
							uni.makePhoneCall({
							    phoneNumber: res.data 
							});
						} else {
							this.$errToast('此手机不支持拨打电话')
						}
					} else {
						this.$errToast(res.msg)
					}
				}).finally(() => {
					uni.hideLoading()
				});
			},
			
			
			//获取父组件传过来的订单列表
			getOrderList() {
				uni.$on('urgeOrderList',res => {
					this.orderList = res;
				})
			},
			
			//操作父组件中的模态框
			handleModal(status, content,id) {
				this.modal.handleOrderStatus = status;
				this.modal.modalContent = content;
				this.modal.id = id;
				
				//发送到父组件中
				uni.$emit("handleModal",this.modal);
			},

			//接单操作
			handleOrder(index,id) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				index === 2 ? this.handleModal(1, "确认是否接单",id) : this.handleModal(2, "确认是否拒单",id);
			},

			//查看订单详情
			handleSearchDetail(id,status,reminder) {
				uni.$emit('searchDetail',`./orderDetails/orderDetails?id=${id}&status=${status}&reminder=${reminder}`);
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
		
		.call-phone {
			color: rgb(103, 168, 252);
			border-bottom: 4rpx solid rgb(103, 168, 252);
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

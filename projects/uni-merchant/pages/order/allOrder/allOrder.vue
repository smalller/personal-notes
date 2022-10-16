<template>
	<view class="orderManagement">
		<u-modal v-model="modal.underwayModalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true"
		 :content="modal.modalContent" @confirm="resOrderHandle"></u-modal>

		<view class="order-list-wrap">
			<scroll-view scroll-y class="scroll-view" @scrolltolower="onreachBottom" @scroll="scroll" :scroll-top="scrollTop">
				<view class="order-info" v-for="(item,index) in orderList" :key="index">
					<view class="first">
						<view class="seat-num">
							<text>{{storeLocation == 3 ? '包间类型：' : '座位号：'}}</text>
							<text class="weight-font">{{item.seatCode || '无'}}</text>
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
					<view v-if="item.smsCode && (item.status == 4 || item.status == 5 || item.status == 6)">
						验证码：
						<text class="weight-font">{{item.smsCode}}</text>
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
					<view class="order-status">
						订单状态：
						<template>
							<!-- 已经关闭的订单 -->
							<text v-if="item.closedStatus === 1">
								{{item.closedReason || '未知'}}
							</text>
							<!-- 其他订单 -->
							<text v-else-if="item.status == 0 && item.reminder != 1">待接单</text>
							<text v-else-if="item.reminder == 1">已催单</text>
							<text v-else-if="item.status == 1">已接单</text>
							<text v-else-if="item.status == 3">未到店</text>
							<text v-else-if="item.status == 4">已到店</text>
							<text v-else-if="item.status == 5">未消费</text>
							<text v-else>未知</text>
						</template>
					</view>
					<!-- 存酒的操作 -->
				<!-- 	<view class="save-drinks" v-if="(item.closedStatus === 1 && item.status === 6 && item.orderType !== 3) || (item.orderType1 == 1 && (item.status == 4 || item.status == 10))">
						操作：
						<text class="weight-font" @click="goToSaveDrinks(item.orderNo)">
							存酒
							<text class="weight-font" v-if="item.isWine == 1">（有存酒）</text>
						</text>
					</view> -->
					<view class="save-drinks" v-if="(item.closedStatus === 1 && item.status === 6 && item.orderType !== 3) || (item.orderType1 == 1 && (item.status == 4 || item.status == 11))">
						操作：
						<text class="weight-font" @click="goToSaveDrinks(item.orderNo)">
							<text v-if="item.isChargeback !== 2">存酒</text>
							<text class="weight-font" v-if="item.isWine == 1">（有存酒）</text>
						</text>
						<text class="weight-font back-order" @click="handleBackOrder(item.id)" v-if="item.isChargeback === 1">退款</text>
						<text class="weight-font back-orderd" v-if="item.isChargeback === 2">（已退款）</text>
					</view>
				</view>
				<view v-if="orderList.length === 0" class="empty-order">
					<image src="../../../static/images/empty_order.png" mode="widthFix"></image>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeLocation: '', //店铺类型
				current: 0, //tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, //swiper组件的current值，表示当前那个swiper-item是活动的
				currentPage: 1, //默认页码
				pagesize: 20, //默认每页要显示多少条数据
				orderType: 1, //订单类型（1-默认全部订单）
				orderList: [], //订单列表
				isShowNoMore: false, //如果上拉触底没有更多数据，就不再继续请求
				requestFlag: true, //防抖标杆
				scrollTop: 0, // 要将滚动条固定到的位置
				oldScrollTop: 0, //页面滚动到的位置
				backOrderId: '', //退单操作的id
				modal: {
					modalContent: '', //弹窗内容
					underwayModalShow: false, //弹窗开关
				}
			}
		},

		watch: {
			watchOnloadOrder: {
				handler(val) {
					this.getOrderInfo();
				},
				deep: true
			}
		},

		computed: {
			watchOnloadOrder() {
				return this.$store.state.onloadOrder;
			}
		},

		mounted() {
			this.getOrderInfo(); //默认获取新订单列表信息
			this.sendTabsIndex(); //发送当前标签页的下标给父组件
			this.getSearchVal(); //接收父组件输入框输入的值
			this.getonPullDownRefreshList(); //下拉刷新加载不同标签页的订单列表
			this.saveDrinksToOrder();	//从存酒页面跳回来的操作
		},

		methods: {
			//从存酒页面跳回来的操作
			saveDrinksToOrder() {
				uni.$on('saveDrinksToOrder', res => {
					this.getOrderInfo() //重新请求订单列表
				})
			},
			
			//退单操作
			handleBackOrder(id) {
				this.modal.modalContent = '是否确认退款？';
				this.modal.underwayModalShow = true;
				this.backOrderId = id;
			},

			//退单确认按钮
			resOrderHandle() {
				this.$put(`/merchant/store/order/chargeback/${this.backOrderId}`).then((res) => {
					if (res.code === 0) {
						this.$successToast('操作成功');
						this.getOrderInfo();
					} else {
						this.$errToast(res.msg)
					}
				});
			},

			//跳转到存酒页面
			goToSaveDrinks(id) {
				uni.$emit('saveDrinks', `./saveDrinks/saveDrinks?id=${id}`);
			},

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
				if (this.$store.state.auth < 1) {
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.$showLoading();
				this.$post(`/merchant/store/order/customer/${orderNo}`).then(res => {
					if (res.code === 0) {
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

			//查看订单详情
			handleSearchDetail(id, status) {
				uni.$emit('searchDetail', `./orderDetails/orderDetails?id=${id}&status=${status}`);
			},

			//页面滚动
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},

			//下拉刷新
			getonPullDownRefreshList() {
				uni.$on('onPullDownRefreshIndex', res => {
					if (res.tabs == 1) {
						this.currentPage = 1;
						this.isShowNoMore = false;
						this.getOrderInfo();
						this.scrollTop = this.oldScrollTop;
						this.$nextTick(() => {
							this.scrollTop = 0
						});
					}
				})
			},

			//接收父组件中的输入框传来的搜索值，根据该值进行搜索列表
			getSearchVal() {
				uni.$on('searchVal', res => {
					//如果当前处在全部订单标签页，才进行搜索操作
					if (res.tabs == 1) {
						this.currentPage = 1;
						this.getOrderInfo(res.searchVal); //搜索
					}
				})
			},

			//将当前的tab标签页下标传给父组件（作用：如果标签页为进行中页面，就展示输入框）
			sendTabsIndex() {
				//因为全部订单里只有已完成的订单才能进行查询订单，所以这里要将已完成页面的下标加1（已完成下标是0），与订单页面的搜索框的判断（this.swiperCurrent == 1）相匹配
				const data = {
					swiperCurrent: this.swiperCurrent + 1,
					tabs: '1'
				}

				uni.$emit('tabsIndex', data);
			},

			//根据标签页获取订单列表信息
			getOrderInfo(keyword) {
				if (this.requestFlag) {
					this.requestFlag = false;
					this.$showLoading();

					let data = {
						pageNo: this.currentPage,
						pageSize: this.pagesize,
						status: this.orderType,
						keyword //搜索的关键词
					}

					this.$post('/merchant/store/order/appAllOrder', data).then(res => {
						if (res.code === 0) {

							//当前店铺的类型
							this.storeLocation = res.data.storeLocation;

							if (this.currentPage === 1) {
								this.orderList = res.data.merchantOrderList.list;
							} else {
								this.orderList = this.orderList.concat(res.data.merchantOrderList.list)
							}

							//如果没有更多数据，就不再继续请求
							if (res.data.merchantOrderList.list.length === 0) {
								this.$errToast('暂无更多数据');
								this.isShowNoMore = true;
							}

							console.log('当前类目的订单信息', res.data.merchantOrderList.list);

							setTimeout(() => {
								uni.hideLoading();
								this.requestFlag = true;
								uni.stopPullDownRefresh()
							}, 500)
						} else {
							uni.$emit("orderList", []);
							this.$errToast(res.msg)
							setTimeout(() => {
								uni.hideLoading();
								uni.stopPullDownRefresh();
							}, 2000)
							this.requestFlag = true;
						}
					})
				}
			},

			// scroll-view到底部加载更多
			onreachBottom() {
				if (!this.isShowNoMore) {
					this.currentPage++; //加载下一页
					this.getOrderInfo();
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.orderManagement {
		height: calc(100% - 90rpx);
	}

	.botm-tab-wrap {
		margin: 0 36rpx 26rpx;
	}

	/deep/ .u-badge--bg--error {
		background-color: #67A8FC;
	}

	.order-list-wrap {
		height: calc(100% - 110rpx);

		.scroll-view {
			height: 100%;
		}

	}

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

			.call-phone {
				color: rgb(103, 168, 252);
				border-bottom: 4rpx solid rgb(103, 168, 252);
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
					color: #67A8FC;
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

		.order-status {
			text {
				font-weight: 600;
				color: #FF3636;
			}
		}

		.save-drinks {
			text {
				color: rgb(103, 168, 252);
				border-bottom: 4rpx solid rgb(103, 168, 252);
			}

			.back-order {
				margin-left: 24rpx;
			}

			.back-orderd {
				border-bottom: none;
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
					color: #67A8FC;
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

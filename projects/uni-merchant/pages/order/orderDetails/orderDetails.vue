<template>
	<view>
		<navBar :switchUrl="'../order'" v-if="orderStatus!==99">订单详情</navBar>
		<navBar v-if="orderStatus==99">订单详情</navBar>
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modalContent"
		 @confirm="resOrderHandle"></u-modal>
		 
	<!-- 	 <u-modal confirm-text="已到店" cancel-text="未到店" v-model="underwayModalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="underwayModalContent"
		  @confirm="underwayResHandle" @cancel="underwayCancelHandle"></u-modal> -->
		  
		<view class="has-navBar" v-if="orderDetail">
			<view class="top-wrap">
				<!-- 已经关闭的订单 -->
				<text v-if="orderDetail.closedStatus === 1">
					{{orderDetail.closedReason}}
				</text>
				<!-- 其他订单 -->
				<text v-else-if="orderStatus == 0 && reminder != 1">待接单</text>
				<text v-else-if="reminder == 1">已催单</text>
				<view class="double-text">
					<text v-if="orderStatus == 1">已接单</text>
					<text v-if="orderStatus == 3">未到店</text>
					<text v-if="orderStatus == 4">已到店</text>
					<text v-if="orderStatus == 5">未消费</text>
					<!-- <text class="code" v-if="orderStatus != 0">验证码：{{orderDetail.smsCode}}</text> -->
				</view>
			</view>
			<view class="order-details">
				<view class="seat-name">
					<text class="name">{{orderDetail.seatCode == '' ? '暂无' : orderDetail.seatCode}}</text>
					<text>({{orderDetail.orderType | orderType}})</text>
				</view>
				<view class="user-info">
					<text class="title">客户信息</text>
					<view class="info">
						<view>
							<text>预订用户</text>
							<text>{{orderDetail.contactName}}</text>
						</view>
						<view>
							<text>预定手机</text>
							<text>{{orderDetail.contactTel | phoneNum}}</text>
						</view>
						<view>
							<text class="remark">备注信息</text>
							<text>{{orderDetail.remarks || '无'}}</text>
						</view>
					</view>
				</view>
				<view class="drinks-list">
					<text class="title">酒水清单</text>
					<view class="null-list" v-if="orderDetail.goodsList.length === 0">
						<text>该顾客尚未预订酒水哦～</text>
					</view>
					<view class="list-info-wrap" v-if="orderDetail.goodsList.length !== 0">
						<view class="list" v-for="(item,index) in orderDetail.goodsList" :key="index">
							<view class="image">
								<image :src="showImgPrefix + item.goodsPicture" mode=""></image>
							</view>
							<view class="right-box">
								<view class="good-name">{{item.goodsName}}</view>
								<view class="good-num-price">
									<view class="good-num">
										<text class="num">
											<text style="margin-right: 16rpx;">x</text>
											{{item.quantity}}
										</text>
									</view>
									<view class="good-price">
										<text class="old-price">￥{{item.originalPrice}}</text>
										<text class="new-price">￥{{item.activityPrice}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="snacks" v-for="(item,index) in orderDetail.snacksList" :key="item + index">
							<view class="name-num">
								<text class="name">{{item.name}}</text>
								<text class="num">
									<text style="margin-right: 16rpx;">x</text>
									{{item.num}}
								</text>
							</view>
						</view>
					</view>
				</view>
				<view class="add-drinks-list" v-if="orderDetail.groupGoods.length !== 0">
					<text class="title">追加酒水</text>
					<view class="list-wrap">
						<view class="list" v-for="(item2,index2) in orderDetail.groupGoods" :key="index2">
							<view class="top-box">
								<text class="title">{{item2.groupName}}</text>
								<text class="time">{{item2.createTime}}</text>
							</view>
							<view class="middle-box">
								<view class="item" v-for="(item,index) in item2.goodsList" :key="index">
									<view class="image">
										<image :src="showImgPrefix + item.goodsPicture"></image>
									</view>
									<view class="right-box">
										<view class="good-name">{{item.goodsName}}</view>
										<view class="good-num-price">
											<view class="good-num">
												<text class="num">
													<text style="margin-right: 16rpx;">x</text>
													{{item.quantity}}
												</text>
											</view>
											<view class="good-price">
												<text class="old-price">￥{{item.originalPrice}}</text>
												<text class="new-price">￥{{item.activityPrice}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="botom-box">
								<view class="up-table"  v-if="item2.servedStatus == 0 || item2.servedStatus == 1" @click="getTable(item2.servedStatus,item2.id,1)">
									{{ item2.servedStatus == 1 ? '已上桌' : '上桌确认' }}
								</view>
								<view class="sell-out"  v-if="item2.servedStatus == 0 || item2.servedStatus == 2" @click="getTable(item2.servedStatus,item2.id,2)">
									{{ item2.servedStatus == 2 ? '已售罄' : '售罄' }}
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="order-info">
					<text class="title">订单信息</text>
					<view class="info">
						<view>
							<text>订单编号</text>
							<text>{{orderDetail.orderNo}}</text>
						</view>
						<view>
							<text>创建时间</text>
							<text>{{orderDetail.createTime}}</text>
						</view>
						<view>
							<text>支付方式</text>
							<text>{{orderDetail.payWay | payWay}}</text>
						</view>
						<view>
							<text>支付状态</text>
							<text class="pay-status">{{orderDetail.payStatus | payStatus}}</text>
						</view>
						<view>
							<text>商家优惠</text>
							<text class="pay-status">{{orderDetail.storeDetails === '' ? '无' : orderDetail.storeDetails}}</text>
						</view>
						<view>
							<text>平台优惠</text>
							<text class="pay-status">{{orderDetail.appDetails === '' ? '无' : orderDetail.appDetails}}</text>
						</view>
						<view>
							<text>实付金额</text>
							<text class="pay-money">￥{{orderDetail.paidAmount}}</text>
						</view>
						<view v-if="orderStatus != 0 && orderStatus != 2">
							<text>接单时间</text>
							<text>{{orderDetail.takeTime}}</text>
						</view>
						<view v-if="orderDetail.retentionTime">
							<text>保留时间</text>
							<text>{{orderDetail.retentionTime}}</text>
						</view>
						<view v-if="orderDetail.occupySeatTime">
							<text>占座时间</text>
							<text>{{orderDetail.occupySeatTime}}分钟</text>
						</view>
						
						<view v-if="orderDetail.finishTime">
							<text>完成时间</text>
							<text>{{orderDetail.finishTime}}</text>
						</view>
						<!-- <view v-if="orderStatus == 6">
							<text>完成时间</text>
							<text>{{orderDetail.finishTime}}</text>
						</view> -->
					</view>
				</view>
				<view class="handle-btn">
					<!-- <view class="double-btn" v-if="orderStatus == 0 || reminder == 1">
						<view class="cancel" @click="handleModal('确认是否拒单',2)">
							<text>拒单</text>
						</view>
						<view class="agree" @click="handleModal('确认是否接单',1)">
							<text>接单</text>
						</view>
					</view> -->
					<!-- <view class="single-btn" @click="underwayModalShow = true" v-if="orderStatus == 1">
						<view class="agree">
							<text>到店确认</text>
						</view>
					</view> -->
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showImgPrefix: this.$imgHead,
				
				orderDetail : null,	//订单详情信息
				
				modalShow: false, //模态框开关
				modalContent: '', //模态框要展示的内容
				handleOrderStatus: -1, //判断当前是接单操作还是拒单操作
				
				// underwayModalShow : false,	//确认是否到店模态框开关
				// underwayModalContent : '请确认顾客是否已到店',	//确认是否到店的模态框消息
				
				orderStatus : -1,	//根据父组件传过来的状态进行判断该展示何种页面
				reminder : -1,	//催单状态
				orderId : '',	//订单id
				addOrderId : '',	//追加订单/售罄的id
			}
		},
		
		onLoad(option) {
			this.orderStatus = option.status;
			this.orderId = option.id;
			
			if(option.reminder) {
				this.reminder = option.reminder;
			}
			this.getOrderDetail();
		},
		
		methods: {
			//追加订单上桌/售罄按钮操作
			getTable(status,id,index) {
				if(status === 0) {
					this.addOrderId = id;
					if (index === 1) {
						this.modalContent = '是否确认上桌';
					}
					if (index === 2) {
						this.modalContent = '是否确认售罄';
					}
					this.modalShow = true;
				}
			},
			
			//确认上桌/售罄
			sureGetTable(index) {
				this.$put(`/merchant/store/order/updateServedStatus/${this.addOrderId}/${index}`).then((res) => {
					if (res.code === 0) {
						this.$successToast('操作成功');
						setTimeout(() => {
							this.getOrderDetail();
						},1000)
					} else {
						this.$errToast(res.msg);
					}
					this.addOrderId = "";
				});
			},
			
			//获取订单详情信息
			getOrderDetail(id) {
				this.$showLoading();
				this.$get(`/merchant/store/order/${this.orderId}/info`).then(res => {
					if(res.code === 0) {
						this.orderDetail = res.data;
						console.log('zzz',this.orderDetail)
						uni.hideLoading();
					} else {
						uni.hideLoading();
						this.$errToast(res.msg);
					}
				})
			},
			
			//操作订单
			handleOrder() {
				let data = {
					id : this.orderDetail.id,
					status : this.handleOrderStatus
				}
				
				this.$put('/merchant/store/order/status',data).then(res => {
					if(res.code === 0) {
						uni.showToast({
							title: "操作成功",
							duration: 1000,
							success : () => {
								setTimeout(() => {
									uni.switchTab({
										url:`../order`,
										success : () => {
											//如果跳转成功，就把当前的tab类型回传到order页面
											const obj = {
												origin : 'detailPage',
												orderStatus : this.orderStatus
											}
											uni.$emit('orderStatus',obj);
										}
									})
								},1000)
							}
						});
					}
				})
			},
			
			//普通模态框展示
			handleModal(content,status) {
				this.modalContent = content;
				this.modalShow = true;
				this.handleOrderStatus = status;
			},
			
			//普通模态框点击确认时的操作
			resOrderHandle() {
				//追加订单上桌/售罄操作
				if(this.addOrderId !== '') {
					if(this.modalContent === '是否确认上桌') {
						this.sureGetTable(1);
					}
					
					if(this.modalContent === '是否确认售罄') {
						this.sureGetTable(2);
					}
				} else {
					//其他操作
					this.handleOrder()
				}
			},
			
			//确认是否到店模态框中的已到店操作
			underwayResHandle() {
				this.handleOrderStatus = 4;	//已到店
				this.handleOrder()
			},
			
			//确认是否到店模态框中的未到店操作
			underwayCancelHandle() {
				this.handleOrderStatus = 3;	//未到店
				this.handleOrder()
			},
		},
		
		
	}
</script>

<style lang="scss" scoped>
	.has-navBar {
		.top-wrap {
			padding: 16rpx;
			background-color: #67A8FC;
			font-size: 28rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			
			text {
				color: #fff;
			}
			
			.double-text {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				
				.code {
					font-weight: 600;
					margin-top: 12rpx;
				}
			}
		}
		
		.order-details {
			padding: 0 24rpx;
			margin-top: 36rpx;
			
			&::after {
				display: table;
				content: "";
			}
			
			>view {
				margin-bottom: 24rpx;
				border-bottom: 2rpx solid #F7F7F7;
				
				.title {
					font-size: 28rpx;
					font-weight: 600;
				}
				
				.info {
					padding: 0 24rpx;
					margin-top: 24rpx;
					
					>view {
						display: flex;
						justify-content: space-between;
						margin-bottom: 24rpx;
					}
					
					.remark {
						min-width: 160rpx;
					}
				}
			}
			
			.seat-name {
				border-bottom: 0;
			}
			
			.seat-name {
				font-size: 36rpx;
				margin-bottom: 38rpx;
				text-align: center;
				
				.name {
					font-weight: 600;
				}
			}
			
			.drinks-list {
				.null-list {
					margin: 24rpx 0 48rpx;
					text-align: center;
					
					text {
						font-size: 24rpx;
						color: #FF3636;
					}
				}
				
				.list-info-wrap {
					padding: 24rpx;
					
					.name-num {
						display: flex;
						flex-direction: column;
						margin-right: 30rpx;
						
						.name {
							margin-bottom: 12rpx;
							font-weight: 600;
						}
					}
					
					.snacks {
						padding-left: 152rpx;
					}
					
					.list {
						display: flex;
						justify-content: space-between;
						margin-bottom: 24rpx;
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.image {
							width: 128rpx;
							height: 128rpx;
							margin-right: 24rpx;
							
							image {
								border-radius: 12rpx;
								width: 100%;
								height: 100%;
							}
						}
						
						.right-box {
							flex-grow: 1;
							
							.good-name {
								margin-bottom: 12rpx;
								font-weight: 600;
							}
							
							.good-num-price {
								display: flex;
								justify-content: space-between;
								
								.old-price {
									color: #ccc;
									text-decoration: line-through;
									margin-right: 26rpx;
								}
									
								.new-price {
									font-weight: 600;
								}
							}
						}
					}
				}
			}
			
			.add-drinks-list {
				.list-wrap {
					padding: 24rpx 0;
					
					.list {
						border: 2rpx solid #F7F7F7;
						border-radius: 8rpx;
						padding: 24rpx;
						margin-bottom: 24rpx;
						
						&::after {
							display: table;
							content: "";
						}
						
						&:last-child {
							margin-bottom: 0;
						}
						
						.top-box {
							display: flex;
							justify-content: space-between;
							margin-bottom: 24rpx;
						}
						
						.middle-box {
							.item {
								display: flex;
								justify-content: space-between;
								margin-bottom: 24rpx;
								
								&:last-child {
									margin-bottom: 0;
								}
								
								.image {
									width: 128rpx;
									height: 128rpx;
									margin-right: 24rpx;
									
									image {
										border-radius: 12rpx;
										width: 100%;
										height: 100%;
									}
								}
								
								.right-box {
									flex-grow: 1;
									
									.good-name {
										margin-bottom: 12rpx;
										font-weight: 600;
									}
									
									.good-num-price {
										display: flex;
										justify-content: space-between;
										
										.old-price {
											color: #ccc;
											text-decoration: line-through;
											margin-right: 26rpx;
										}
											
										.new-price {
											font-weight: 600;
										}
									}
								}
							}
						}
					
						.botom-box {
							margin: 48rpx 0 16rpx;
							padding: 0 88rpx;
							display: flex;
							justify-content: space-between;
							
							>view {
								font-size: 32rpx;
								color: #fff;
								width: 212rpx;
								height: 72rpx;
								display: flex;
								justify-content: center;
								align-items: center;
								border-radius: 12rpx;
							}
							
							.up-table {
								background-color: #2AA54B;
							}
							
							.sell-out {
								background-color: #67A8FC;
							}
						}
					
					}
				}
			}
			
			.order-info {
				margin-bottom: 100rpx;
				
				.info {
					.pay-status {
						color: #FF3636;
					}
					
					.pay-money {
						color: #FF3636;
						font-weight: 600;
					}
				}
			}
			
			.handle-btn {
				border-bottom: none;
				margin-bottom: 0;
				
				>view {
					display: flex;
					justify-content: center;
					align-items: center;
					margin-bottom: 100rpx;
					
					>view {
						width: 214rpx;
						height: 72rpx;
						border: 2rpx solid #67A8FC;
						border-radius: 16rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						font-size: 32rpx;
					}
				}
				
				.cancel {
					margin-right: 60rpx;
				}
				
				.agree {
					background-color: #67A8FC;
					
					>text {
						color: #fff;
					}
				}
			}
			
		}
		
	}
</style>

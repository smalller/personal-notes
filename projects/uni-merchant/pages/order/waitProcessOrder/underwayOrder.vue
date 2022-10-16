<template>
	<view>
		<view class="order-info" v-if="orderList.length !== 0" v-for="(item,index) in orderList" :key="index">
			<view class="first">
				<view>
					<text>{{storeLocation == 3 ? '包间类型：' : '座位号：'}}</text>
					<text class="weight-font">{{item.seatCode == '' ? '暂无' : item.seatCode}}</text>
					<text class="small-font">({{item.orderType | orderType}})</text>
					<template v-if="$store.state.auth > 0 ">
					<!-- 抢座状态 -->
					<text @click="changeSeatNum(item)" v-if="item.orderType === 2 && item.seatCode == '' && item.closedStatus != 1 && item.status === 4 " :style="{'font-size' : '28rpx', 'color' : '#67A8FC'}">{{ storeLocation == 3 ? '设定包间类型' : '设定座位'}}</text>
					<!-- 预定桌状态 -->
					<text @click="changeSeatNum(item)" v-if="item.seatCode != '' && item.closedStatus !== 1 && storeLocation != 3" :style="{'font-size' : '28rpx', 'color' : '#67A8FC'}">{{ storeLocation == 3 ? '变更包间类型' : '变更座位'}}</text>
					
					</template>
					<!-- <u-select v-model="updateSeat" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true"
					 :list="seatOrRoomList" @confirm="updateSeatNum"></u-select> -->
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
					<text :style="{color : item.status == 4 ? '#2AA54B' : '#FF3636'}">{{item.status | orderStatus}}</text>
				</view>
			</view>
			<view class="pay-money">
				<view>
					实付金额：
					<text class="weight-font">￥{{item.paidAmount}}</text>
				</view>
				<view class="add-goods-status">
					<text v-if="item.status == 4 && item.addGoodsDesc" @click="handleSearchDetail(item.orderNo,item.status)">{{item.addGoodsDesc}}</text>
					<text v-else-if="item.orderType1 == 1 && item.status != 4" @click="handleVerif(item.id)">
						延时核销
						{{ item.isApplyWine == 1 ? '（已申请存酒）' : '' }}
					</text>
				</view>
			</view>
			<view class="code">
				预定手机：
				<text class="iconfont" :style="{'font-size' : '36rpx', 'color' : 'rgb(103, 168, 252)'}">&#xe604;</text>
				<text class="weight-font call-phone" @click="callPhone(item.orderNo)">{{item.contactTel | phoneNum}}</text>
			</view>
			<view>
				到店时间：
				<text class="weight-font">{{item.retentionTime || '未知'}}</text>
			</view>
			<view class="handle-btn">
				<!-- 如果顾客是抢座，且已到店 -->
				<template v-if="item.orderType === 2 && item.status === 4">
					<view class="not-click">
						<text>到店确认</text>
					</view>
					<view :class="[item.status == 4 ? 'consent-btn' : 'not-click']" @click="handleModal(item.id,'请确认顾客是否已离店',6,item.status)">
						<text>离店确认</text>
					</view>
				</template>
				
				<!-- 其他正常订单 -->
				<template v-else-if="item.closedStatus === 0">
					<view :class="[item.status == 4 ? 'not-click' : 'consent-btn']"  @click="handleModal(item.id,'请确认顾客是否已到店',4,item.status)">
						<text>到店确认</text>
					</view>
					<view :class="[item.status == 4 ? 'consent-btn' : 'not-click']" @click="handleModal(item.id,'请确认顾客是否已离店',6,item.status)">
						<text>离店确认</text>
					</view>
				</template>
				
				<!-- 如果订单有误，就报相关错误 -->
				<template v-else-if="item.closedStatus === 1">
					<text style="color: #FF3636;font-weight: 600;">{{ item.closedReason }}</text>
				</template>
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
					underwayModalShow: false, //模态框开关
					modalContent: '', //模态框要展示的内容
					confirmText : '',	//确认按钮要显示的文本
					cancelText : '',	//取消按钮要显示的文本
					handleOrderStatus: '', //判断当前操作订单的类型
					modalIndex : 1,	//从哪个标签页点击的模态框按钮
					id : '',	//要操作的订单id
				},

				setNumber : {
					id : '',	//当前订单的id
					seatOrRoomList : [],	//后端返回的可以选择的座位号/包间号
					newSeatNum : '',	//要修改成的座位号
					updateSeat : false,	//修改座位的开关
				}
			}
		},
		
		mounted() {
			this.getOrderList();
		},

		methods: {
			//获取可选的座位号/包间号
			changeSeatNum(item) {
				this.$showLoading();
				//订单id
				this.setNumber.id = item.id;
				this.$post('/merchant/store/order/seatOrRoomList').then((res) => {
					if (res.code === 0) {
						//暂存数组
						let seatList = [];
						
						 //如果是非KTV
						if (this.storeLocation != 3) {
							if (res.data.seatName.length === 0) {
								this.$errToast('暂无可修改的座位号')
								return;
							} else {
								//将返回的纯数组转为数组对象，并渲染到选择框里
								res.data.seatName.forEach(item => {
									const obj = {
										value : item,
										label : item
									}
									seatList.push(obj)
								})
								
								this.setNumber.seatOrRoomList = seatList;
								this.setNumber.updateSeat = true;
							}
						}
	
						//如果是KTV店铺
						if (this.storeLocation == 3) {
							if (res.data.esKtvRoomDTOS.length === 0) {
								this.$errToast('暂无可修改的包间号')
								return;
							} else {
								
								//将返回的纯数字转为数组对象，并渲染到选择框里
								res.data.esKtvRoomDTOS.forEach(item => {
									const obj = {
										value : item.roomTypeId,
										label : item.roomTypeName,
										children : item.roomTimeIntervalList
									}
									
									obj.children.forEach(item2 => {
										item2.value = item2.roomTimeId;
										item2.label = item2.startTime + '-' + item2.endTime;
									})
									
									
									seatList.push(obj)
								})
								
								this.setNumber.seatOrRoomList = seatList;
								
								console.log(this.setNumber.seatOrRoomList)
								this.setNumber.updateSeat = true;
							}
						}
						
						uni.hideLoading()
						
						uni.$emit('setNumber',this.setNumber);
					}
				});
			},
			
			//修改座位号操作
			updateSeatNum(seat) {
				if(seat[0].value) {
					//将页码改为1
					uni.$emit('currentPage',1);
					
					let data = {
						id : this.id,
						value : seat[0].value
					}
					
					this.$put('/merchant/store/order/seatOrRoom',data).then(res => {
						if(res.code === 0) {
							this.$successToast('修改成功')
							
							setTimeout(() => {
								//重新加载数据
								this.$emit('getOrderInfo')
							},1000)
							
							this.updateSeat = false;
						} else {
							this.$errToast(res.msg)
						}
					})
				} else {
					this.updateSeat = false;
				}
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
				uni.$on('underwayOrderList',res => {
					this.orderList = res;
				})
			},
			
			//核销操作
			handleVerif(id) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.modal.underwayModalShow = false;
				this.modal.id = id;
				this.modal.handleOrderStatus = -1;
				uni.$emit("handleVerif",this.modal);
			},
			
			//操作父组件中的模态框
			handleModal(id,txt,status,orderStatus) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.modal.underwayModalShow = true;
				this.modal.id = id;
				this.modal.modalContent = txt;
				this.modal.handleOrderStatus = status;
				
				//确认是否到店
				if(status === 4) {
					this.modal.confirmText = '已到店';
					this.modal.cancelText = '未到店';
					
					//如果商家没有先确认用户是否到店，就提示
					if(orderStatus == 4) {
						// this.$errToast('请先确认用户到店');
						return
					}
				}
				
				//确认是否离店
				if(status === 6) {
					if(this.$store.state.auth < 1){
						uni.showToast({
							icon: 'none',
							title: '暂无权限'
						})
						return
					}
					this.modal.confirmText = '已离店';
					this.modal.cancelText = '取消';
					
					//如果商家没有先确认用户是否到店，就提示
					if(orderStatus !== 4) {
						this.$errToast('请先确认用户到店');
						return
					}
				}
				
				uni.$emit("handleModal",this.modal);
			},
			
			//查看订单详情
			handleSearchDetail(id,status) {
				uni.$emit('searchDetail',`./orderDetails/orderDetails?id=${id}&status=${status}`)
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
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 0;
			
			.add-goods-status {
				margin-right: 26rpx;
				text {
					text-align: center;
					text-decoration: underline;
					color: #FF3636;
					font-size: 32rpx;
					font-weight: 600;
				}
				
			}
			
			text {
				color: #FF3636;
			}
		}
		
		.pay-status {
			display: flex;
			align-items: center;
			justify-content: space-between;
			
			.status {
				margin-right: 26rpx;
				font-size: 28rpx;
				font-weight: 600;
			}
		}
		
		.code {
			margin-top: 28rpx;
		}

		.handle-btn {
			display: flex;
			justify-content: space-around;
		
			>view {
				// margin-left: 60rpx;
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
			
			.not-click {
				background-color: #F5F7FA;
				border: 2rpx solid #E4E7ED;
				
				text {
					color: #C0C4CC;
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

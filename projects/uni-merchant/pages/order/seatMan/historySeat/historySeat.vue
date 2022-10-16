<template>
	<view style="height: 100%;">
		<navBar :switchUrl="'../../order'">历史{{title}}</navBar>
		<view class="has-navBar">
			<view class="tab_head">
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" :bar-width="84"
				 :bar-height="8" :font-size="28" :bold="false"></u-tabs-swiper>
			</view>
			<view class="time">{{continuationTime | dateyear}}</view>
			<view class="order-list-wrap">
				<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 100%" @scrolltolower="onreachBottom">
							<block v-if="grabLoadFlag">
								<view class="seat_box" v-for="(item,index) in GrabArr" :key="index">
									<view :class="[item.isOff=='成功'?'seat_top':'seat_top1']">{{item.isOff}}入座</view>
									<view class="seat_bottom">
										<view class="left">
											<view>预约座位：<text>{{item.codeNo || '无'}}</text></view>
											<view>已支付：<text>{{item.paidAmount || "0.00" }}</text></view>
											<view>已等待：<text>{{item.waitTime || '00:00:00'}}</text></view>
										</view>
										<view class="right">
											<view>预计人数：<text>{{item.seatCapacity}}</text></view>
											<view>座位需求：<text>{{item.seatType}}</text></view>
											<view>手机号码：<text>{{item.contactTel}}</text></view>
										</view>
									</view>
								</view>
							</block>

							<view v-if="!grabLoadFlag" class="seatImgs">
								<image src="../../../../static/images/empty_order.png" mode="widthFix"></image>
								<view style="text-align: center;font-size: 36rpx;">暂无更多数据...</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item">
						<scroll-view scroll-y style="height: 100%" @scrolltolower="onreachBottom">
							<block v-if="numberLoadFlag">
								<view class="seat_box" v-for="(item,index) in GrabArrTwo" :key="index">
									<view :class="[item.isOff=='成功'?'seat_top':'seat_top1']">{{item.isOff}}入座</view>
									<view class="seat_bottom">
										<view class="left">
											<view>预约座位：<text>{{item.codeNo || '无'}}</text></view>
											<view>已支付：<text>{{item.paidAmount || '0.00'}}</text></view>
											<view>已等待：<text>{{item.waitTime || '00:00:00'}}</text></view>
										</view>
										<view class="right">
											<view>预计人数：<text>{{item.seatCapacity}}</text></view>
											<view>座位需求：<text>{{item.seatType}}</text></view>
											<view>手机号码：<text>{{item.contactTel}}</text></view>
										</view>
									</view>
								</view>
							</block>

							<view v-if="!numberLoadFlag" class="seatImgs">
								<image src="../../../../static/images/empty_order.png" mode="widthFix"></image>
								<view style="text-align: center;font-size: 36rpx;">暂无更多数据...</view>
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: null,
				continuationTime: null, //抢座时间
				list: [{
					name: '抢座'
				}, {
					name: '排号',
				}],
				current: 0, //tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, //swiper组件的current值，表示当前那个swiper-item是活动的
				screenHeight: null, //屏幕高度
				GrabArr: [],
				GrabArrTwo: [],
				grabLoadFlag: true, //抢座
				numberLoadFlag: true, //排号
			}
		},
		onLoad(e) {
			this.getGrabArr()
			this.screenHeight = (uni.getSystemInfoSync().screenHeight - 170) * 2 + 'rpx'
			if (uni.getSystemInfoSync().model == 'iPad' && uni.getSystemInfoSync().screenHeight < 1200) {
				this.screenHeight = (uni.getSystemInfoSync().screenHeight - 230) + 'rpx'
			}
			this.title = e.title
			if (this.title == '抢座') {
				this.current = 0
				this.swiperCurrent = 0
			} else {
				this.current = 1
				this.swiperCurrent = 1
			}
		},
		methods: {
			changeArr(arr) {
				arr.map(item => {
					item.isOff = item.isOff == 0 ? '成功' : '取消';
					// 座位
					item.seatType = item.seatType == 1 ? '卡座' : item.seatType == 2 ? '散台' :' 无要求';
					// 电话
					item.contactTel = item.contactTel.slice(0, 3) + '***' + item.contactTel.slice(7, 11);
					// 时间
					if (this.$date.timeStamp(item.callTime) != 0) {
						item.createTime = new Date(item.createTime.replace(/-/g,'/')).getTime();
						item.waitTime = this.$date.timeStamp(item.callTime.replace(/-/g,'/')) - item.createTime
						var h = parseInt(item.waitTime / 3600000)
						h = h <= 9 ? '0' + h : h
						var m = parseInt(item.waitTime / 60000 - h * 60)
						m = m <= 9 ? '0' + m : m
						var s = parseInt(item.waitTime / 1000 - h * 3600 - m * 60)
						s = s <= 9 ? '0' + s : s
						item.waitTime = h + ':' + m + ":" + s
					}

					return item
				})
			},
			getGrabArr() {
				// this.$post('/merchant/store/ly/userHistory', {
				// 	"pageNo": 0,
				// 	"pageSize": 10,
				// 	"userId": '1308703933015228418'
				// })
				// .then(res=>{
				// 	console.log(res)
				// })
				let _this = this
				var timestamp = Date.parse(new Date());
				uni.showLoading({
					title: '加载中...'
				})
				this.$post('/merchant/store/ly/storeLyListBySuccessOrOff', {
						type: 0
					})
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							uni.hideLoading()
							if (res.data.vieList.length == 0) {
								_this.grabLoadFlag = false
							} else {
								_this.GrabArr = res.data.vieList
								_this.changeArr(_this.GrabArr)
							}
							if (res.data.lyList.length == 0) {
								_this.numberLoadFlag = false
							} else {
								_this.GrabArrTwo = res.data.lyList
								_this.changeArr(_this.GrabArrTwo)
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}
					})

			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				this.title = this.list[index].name
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				this.title = this.list[current].name
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				// console.log(1)
				uni.showToast({
					icon: 'none',
					title: '已经到底了'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body {
		height: 100%;
	}

	.has-navBar {
		height: 100%;
		box-sizing: border-box;
	}

	.tab_head {
		position: fixed;
		top: 88rpx;
		width: 100%;
		background-color: #fff;
		z-index: 777;
		// left: 0;
	}

	.time {
		font-size: 32rpx;
		color: #999999;
		margin: 22rpx 0 24rpx 0;
		padding: 0 0 0 24rpx;
		box-sizing: border-box;
	}

	.order-list-wrap {
		padding: 88rpx 24rpx 0;
		box-sizing: border-box;
		height: calc(100% - 24rpx);
		.seat_box {
			// width: 702rpx;
			height: 276rpx;
			border-radius: 15rpx;
			border: 1px solid #67A8FC;
			margin-bottom: 24rpx;

			.seat_top {
				width: 100%;
				height: 56rpx;
				text-align: center;
				line-height: 56rpx;
				border-radius: 12rpx 12rpx 0 0;
				color: #fff;
				background-color: #67A8FC;
			}

			.seat_top1 {
				width: 100%;
				height: 56rpx;
				text-align: center;
				line-height: 56rpx;
				border-radius: 12rpx 12rpx 0 0;
				color: #fff;
				background-color: #D72828;
			}

			.seat_bottom {
				display: flex;
				padding: 16rpx 40rpx 24rpx;

				.left {
					font-size: 24rpx;
					width: 224rpx;
					view {
						text-overflow: ellipsis;
						white-space: nowrap;

						&:nth-child(2) {
							margin: 24rpx 0;
						}
					}

					text {
						font-size: 32rpx;

					}
				}

				.right {
					font-size: 24rpx;
					margin-left: 86rpx;

					view {
						text-overflow: ellipsis;
						white-space: nowrap;

						&:nth-child(2) {
							margin: 24rpx 0;
						}
					}

					text {
						font-size: 32rpx;
					}
				}
			}
		}
	}

	.order-list-wrap {
		.swiper-box {
			height: 100%;
		}
	}

	.seatImgs {
		width: 100%;
		height: 50%;

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>

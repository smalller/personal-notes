<template>
	<view class="profit">
		<view class="header">
			<view>
				<text class="iconfont" @click="goBack()">&#xe625;</text>
				<text>今日营业额</text>
				<view></view>
			</view>
		</view>
		<view class="banner-pa">
			<view class="banner">
				<view class="image">
					<image src="../../../static/images/rili.png" @click="shows"></image>
					<view class="father">
						<u-calendar v-model="show" :mode="mode" @change="change"></u-calendar>
						<view @click="shows" class="title">{{datas}}</view>
						<view :class="[show?'transformarrows':'arrows']"></view>
					</view>
				</view>
				<view class="left">
					<text class="to_text">总营业额</text><br />
					<text class="pic_text">{{allTurnover | returnFloat}}</text>
				</view>
				<view class="middle">
					<text class="to_text">今日营业额</text><br />
					<text class="pic_text">{{nowTurnover | returnFloat}}</text>
				</view>
				<view class="right">
					<text class="to_text">今日有效订单</text><br />
					<text class="pic_text">{{appSeatArr.length}}</text>
					<text class="to_text to_text_one">单</text>
				</view>
			</view>
		</view>

		<view class="content">
			<scroll-view scroll-y @scrolltolower="onreachBottom" style="height: 100%;margin-top: 18rpx;">
				<block v-for="(item,index) in appSeatArr" :key="index">

					<view class="banner_aa" v-show="item.orderType==1" @click="goOrderNo(item.orderNo)">
						<view class="left" style="width: 202rpx;height: 278rpx;background-color: #FF7979;border-radius: 14rpx 0 0 14rpx;text-align: center;line-height: 278rpx;">
							AA拼单
						</view>
						<view class="middle">
							<view class="top">
								<text class="one_t">桌号</text><br />
								<text class="two_t">{{item.seatCode}}</text>
							</view>
							<view class="bootom">
								<text class="one_t">到店时间</text><br />
								<text class="two_t">{{item.startedTime || '/'}}</text>
							</view>
						</view>
						<view class="right">
							<view class="top">
								<text class="one_t">消费金额</text><br />
								<text class="two_t">{{item.paidAmount | returnFloat}}</text>
							</view>
							<view class="bootom">
								<text class="one_t">离店时间</text><br />
								<text class="two_t">{{item.finishTime || '/'}}</text>
							</view>
						</view>
					</view>
					<view class="banner_aa" v-show="item.orderType==0" @click="goOrderNo(item.orderNo)">
						<view class="left" style="width: 202rpx;height: 278rpx;background-color:#FFC950;border-radius: 14rpx 0 0 14rpx;text-align: center;line-height: 278rpx;">
							预订桌
						</view>
						<view class="middle">
							<view class="top">
								<text class="one_t">桌号</text><br />
								<text class="two_t">{{item.seatCode}}</text>
							</view>
							<view class="bootom">
								<text class="one_t">到店时间</text><br />
								<text class="two_t">{{item.startedTime || '/'}}</text>
							</view>
						</view>
						<view class="right">
							<view class="top">
								<text class="one_t">消费金额</text><br />
								<text class="two_t">{{item.paidAmount | returnFloat}}</text>
							</view>
							<view class="bootom">
								<text class="one_t">离店时间</text><br />
								<text class="two_t">{{item.finishTime || '/'}}</text>
							</view>
						</view>
					</view>
					<view class="banner_aa" v-show="item.orderType==2" @click="goOrderNo(item.orderNo)">
						<view class="left" style="width: 202rpx;height: 278rpx;background-color:#1393FF;border-radius: 14rpx 0 0 14rpx;text-align: center;line-height: 278rpx;">
							抢座
						</view>
						<view class="qiang_right">
							<view class="qiang_top">
								<text class="one_t">消费金额</text>
								<text class="two_t">{{item.paidAmount | returnFloat}}</text>
							</view>
							<view class="qiang_bottom">
								<text class="one_t">抢座时间</text>
								<text class="two_t">{{item.startedTime || '/'}}</text>
							</view>
						</view>
					</view>

				</block>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				mode: 'date',
				datas: '2020-11-01',
				appSeatArr: [], //获取到的数组
				allTurnover: 0, //总营业额
				nowTurnover: 0, //今日营业额
			}
		},
		onLoad() {
			this.datas = this.$date.date().currentdatess
			this.getAppSeatByDay(this.datas)
		},
		onPullDownRefresh() {
			this.getAppSeatByDay(this.datas)
		},
		methods: {
			getAppSeatByDay(time) {
				let data = {
					"localDate": time
				}
				uni.showLoading({
					title: '加载中...'
				})
				this.$post('/merchant/store/getAppSeatByDay', data)
					.then(res => {
						if (res.code == 0) {
							uni.stopPullDownRefresh()
							this.allTurnover = res.data.total || 0
							this.nowTurnover = res.data.today || 0
							if (res.data.list.length!=0) {
								uni.hideLoading()
								res.data.list.forEach(item => {
									if(item.startedTime){
										item.startedTime = this.$date.timeData(item.startedTime.replace(/-/g,'/'),4) 
									}
									if(item.finishTime){
										item.finishTime = this.$date.timeData(item.finishTime.replace(/-/g,'/'),4) 
									}
									
									
								})
								this.appSeatArr = res.data.list
							} else {
								this.allTurnover = res.data.total || 0
								this.nowTurnover = res.data.today || 0
								this.appSeatArr=[]
								uni.showToast({
									icon: 'none',
									title: '暂无数据'
								})
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}

					})
			},
			// 消费详情
			goOrderNo(val){
				console.log(val)
				uni.navigateTo({
					url:`../../order/orderDetails/orderDetails?id=${val}&status=${99}`
				})
			},
			change(e) {
				// console.log(e);
				this.datas = e.result
				this.getAppSeatByDay(this.datas)
			},
			goBack() {
				uni.switchTab({
					url: '../store'
				})
			},
			shows() {
				this.show = true
			},
			onreachBottom() {
				uni.showToast({
					icon: 'none',
					title: '已经到底了'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	uni-page-body{
		height: 100%;
	}
	.profit{
		height: 100%;
	}
	.one_t{
		white-space: nowrap;
	}
	.two_t {
		white-space: nowrap;
	}
	.content {
		// width: 718rpx;
		height: calc(100% - 300rpx);
		margin: 0 auto;
		padding: 0 16rpx 12rpx;
		box-sizing: border-box;
	}

	.header {
		position: fixed;
		left: 0;
		top: 0;
		display: block;
		width: 100%;
		background-color: #fff;
		z-index: 777;

		view {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-sizing: border-box;
			padding-top: 24rpx;

			.iconfont {
				margin-left: 24rpx;
			}

			text {
				font-size: 36rpx;

				&:nth-child(2) {
					margin-left: -48rpx;
				}
			}
		}

	}

	.banner-pa {
		padding-top: 64rpx;
	}

	.banner {
		width: 100%;
		height: 190rpx;
		display: flex;
		justify-content: space-around;
		padding: 36rpx 0 0 0;
		margin: 22rpx 0 10rpx 0;
		align-items: center;
		position: relative;
		background-color: #0D1D49;

		.image {
			position: absolute;
			left: 48rpx;
			top: 24rpx;
			display: flex;

			image {
				width: 32rpx;
				height: 32rpx;

				.father {
					position: relative;
				}
			}

			.title {
				background-color: #fff;
				width: 196rpx;
				height: 32rpx;
				margin-left: 20rpx;
				border-radius: 32rpx;
				padding-left: 14rpx;
				box-sizing: border-box;
				line-height: 32rpx;
			}

			.arrows {
				// width: 10rpx;
				// height: 10rpx;
				// padding: 10rpx;
				// background-color: #007AFF;
				position: absolute;
				right: 12rpx;
				top: 12rpx;
				z-index: 10;
				border-top: 10rpx solid #000;
				border-left: 5rpx solid transparent;
				border-bottom: 5rpx solid transparent;
				border-right: 5rpx solid transparent;
			}

			.transformarrows {
				position: absolute;
				right: 12rpx;
				top: 7rpx;
				z-index: 10;
				border-top: 10rpx solid #000;
				border-left: 5rpx solid transparent;
				border-bottom: 5rpx solid transparent;
				border-right: 5rpx solid transparent;
				transform: rotate(180deg);
			}
		}

		.left {
			font-size: 24rpx;
			font-weight: 400;
			
			.to_text {
				color: #FFFFFF;
			}

			.pic_text {
				color: #fee140;
				font-size: 32rpx;
				display: inline-block;
				margin-top: 8rpx;
				font-weight: 600;
			}
		}

		.middle {
			font-size: 24rpx;
			font-weight: 400;

			.to_text {
				color: #FFFFFF;

			}

			.pic_text {
				color: #fee140;
				font-size: 32rpx;
				display: inline-block;
				margin-top: 8rpx;
				font-weight: 600;
			}
		}

		.right {
			font-size: 24rpx;
			font-weight: 400;


			.to_text {
				color: #FFFFFF;
				
			}
			.to_text_one{
				display: inline-block;
				margin-left: 4rpx;
			}
			.pic_text {
				color: #fee140;
				font-size: 32rpx;
				display: inline-block;
				margin-top: 8rpx;
				font-weight: 600;
			}
		}
	}
	.bootom{
		text-align: center;
	}
	.banner_aa {
		width: 99%;
		height: 278rpx;
		display: flex;
		align-items: center;
		// padding-left: 54rpx;
		box-shadow: 0 0 6rpx 0rpx #c0c0c0;
		margin: 6rpx auto 16rpx;
		border-radius: 15rpx;

		.qiang_right {
			margin-left: 142rpx;

			.qiang_top {
				margin-bottom: 56rpx;
			}

			.qiang_bottom {
				margin-top: 56rpx;
			}

			.one_t {
				font-size: 28rpx;
				color: #999999;
				display: inline-block;
			}

			.two_t {
				font-size: 32rpx;
				font-weight: 600;
				margin-left: 24rpx;
				
			}
		}

		.left {
			font-size: 28rpx;
			color: #FFFFFF;
		}

		.middle {
			margin-left: 70rpx;
			width: 112rpx;
			.top {
				.one_t {
					font-size: 28rpx;
					color: #999999;
				}

				.two_t {
					display: inline-block;
					font-size: 32rpx;
					font-weight: 600;
					margin-top: 8rpx;
				}
			}

			.bootom {
				.one_t {
					font-size: 28rpx;
					color: #999999;
					display: inline-block;
					margin-top: 30rpx;
				}

				.two_t {
					font-size: 32rpx;
					font-weight: 600;
					margin-top: 8rpx;
					display: inline-block;

				}
			}
		}

		.right {
			margin-left: 92rpx;

			.top {
				.one_t {
					font-size: 28rpx;
					color: #999999;
				}

				.two_t {
					font-size: 32rpx;
					font-weight: 600;
					margin-top: 8rpx;
					display: inline-block;
				}
			}

			.bootom {
				.one_t {
					font-size: 28rpx;
					color: #999999;
					display: inline-block;
					margin-top: 30rpx;
				}

				.two_t {
					font-size: 32rpx;
					font-weight: 600;
					margin-top: 8rpx;
					display: inline-block;
				}
			}
		}
	}
</style>

<template>
	<view class="seatGrab_top">
		<block v-if="loadFlag">
			<scroll-view scroll-y v-bind:style="{ height: screenHeight}" @scrolltolower="onreachBottom">
				<view class="seatGrab" v-for="(item,index) in grabArr" :key="index" v-show="loadFlag">
					<view class="footer_left">
						<view>预约座位：<text>{{item.codeNo}}</text></view>
						<view>已支付：<text>{{item.paidAmount}}</text></view>
						<view>已等待：<text>{{item.waitTime}}</text></view>
					</view>
					<view class="footer_right">
						<view>预计人数：<text>{{item.seatCapacity}}</text></view>
						<view>座位需求：<text>{{item.seatType}}</text></view>
						<view>手机号码：<text>{{item.contactTel}}</text></view>
					</view>
				</view>
				<!-- <view class="loding" v-show="loadFlag">
					<u-loading mode="flower" :size="100"></u-loading>
					<view>正在加载...</view>
				</view> -->
			</scroll-view>
		</block>
		<view v-if="!loadFlag" class="seatImgs">
			<image src="../../../static/images/empty_order.png" mode="widthFix"></image>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				grabArr: [],
				loadFlag: false, //加载动画
				screenHeight: null, //屏幕高度
				GrabArr: [],
			}
		},
		created() {
			// this.timer = setInterval(() => {
				this.getSeat()
			// }, 1000)
			this.timer = setInterval(() => {
				this.timestamp = Date.parse(new Date());
				this.grabArr = this.grabArr.map(item => {
					// 时间
					// item.createTime = new Date(item.createTime.replace(/-/g,'/')).getTime();
					item.waitTime = this.timestamp - item.createTime
					var h = parseInt(item.waitTime / 3600000)
					h = h <= 9 ? '0' + h : h
					var m = parseInt(item.waitTime / 60000 - h * 60)
					m = m <= 9 ? '0' + m : m
					var s = parseInt(item.waitTime / 1000 - h * 3600 - m * 60)
					s = s <= 9 ? '0' + s : s
					item.waitTime = h + ':' + m + ":" + s
					return item
				})
			}, 1000)
		},
		destroyed() {
			clearInterval(this.timer)
		},
		beforeMount() {
			this.screenHeight = (uni.getSystemInfoSync().screenHeight - 440) * 2 + 'rpx'
			// console.log(this.screenHeight)
		},
		methods: {
			getSeat() {
				let _this = this
				uni.$on("change", function(e) {
					console.log(e)
					_this.grabArr = e.data.nowVieList.slice(1);
					
					if (_this.grabArr.length!=0) {
						_this.loadFlag = true
					}
					
				})
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				uni.showToast({
					icon:'none',
					title:'已经到底了'
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.seatGrab_top {
		border-top: 1px solid #f1f1f1;
		box-sizing: border-box;
		position: relative;
		height: 100%;
	}

	.seatGrab {
		// width: 702rpx;
		height: 228rpx;
		border-radius: 8rpx;
		border: 1px solid #67A8FC;
		display: flex;
		padding: 24rpx 40rpx;
		margin: 24rpx 0;

		.footer_left {
			white-space: nowrap;
			flex: 1;
			view {
				font-size: 24rpx;

				text {
					font-size: 32rpx;
				}

				&:nth-child(2) {
					margin: 24rpx 0;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}

		.footer_right {
			margin-left: 82rpx;
			white-space: nowrap;
			view {
				font-size: 24rpx;

				text {
					font-size: 32rpx;
				}

				&:nth-child(2) {
					margin: 24rpx 0;
				}

				&:nth-child(3) {
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	.loding {
		width: 120rpx;
		height: 120rpx;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;

		view {
			font-size: 24rpx;
			color: #ccc;
		}
	}

	.seatImgs {
		width: 100%;
		height: 80%;

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>

<template>
	<view class="orderManagement">
		<view class="header">
			<view class="nowTopPrice">
				<text>当前线下最高竞价：</text>
				<text>{{money | returnFloat}}</text>
				<template v-if="$store.state.auth > 0 ">
					<text @click="setTopPrice">设置</text>
				</template>
			</view>
			<text @click="goHistory(list[swiperCurrent].name)">历史{{list[swiperCurrent].name}}</text>
		</view>
		<block v-show="allArr.length!=0">
			<view class="content" v-for="(item,index) in allArr" :key="index">
				<view class="content_left">
					<view>预约座位：<text>{{item.codeNo}}</text></view>
					<view>已等待：<text>{{item.waitTime}}</text></view>
					<view v-show="item.paidAmount">已支付：<text>¥{{item.paidAmount}}</text></view>
				</view>
				<view class="content_right">
					<view>预计人数：<text>{{item.seatCapacity}}人</text></view>
					<view>座位需求：<text>{{item.seatType}}</text></view>
					<view>手机号码：<text>{{item.contactTel}}</text></view>
				</view>
				<view class="content_foot" @click="callChange(item.type)" v-if="callFlag">呼叫</view>
				<view class="content_foot2" v-else>
					<view class="comfime" @click="callConfirm(item.type)">确定</view>
					<view class="cancel" @click="callCancel(item.type)">取消</view>
					<view class="continue" @click="continues(item.type)">续排</view>
				</view>
			</view>
		</block>

		<view :class="[allArr.length==0?'footers':'footer']">
			<view>
				<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" :bar-width="84"
				 :bar-height="8"></u-tabs-swiper>
			</view>
			<view class="order-list-wrap">
				<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
					<swiper-item class="swiper-item">
						<scroll-view scroll-y @scrolltolower="onreachBottom" class="score-view">
							<seatGrab></seatGrab>
						</scroll-view>
					</swiper-item>
					<swiper-item class="swiper-item">
						<scroll-view scroll-y @scrolltolower="onreachBottom" class="score-view">
							<seatNumber></seatNumber>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>

		</view>
	</view>
</template>

<script>
	import seatGrab from './seatGrab.vue'
	import seatNumber from './rowNumber.vue'

	export default {
		components: {
			seatGrab,
			seatNumber
		},
		data() {
			return {
				list: [{
					name: '抢座',
					count: 0
				}, {
					name: '排号',
					count: 0
				}],
				current: 0, //tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, //swiper组件的current值，表示当前那个swiper-item是活动的
				callFlag: true, //呼叫
				timer: '', //定时器
				allArr: [], //存数组
				if: null, //第一个id
				nextId: null, ///第二个id
				timestamp: null,
				money: '', //最高竞价
				grabaFlag: true, //抢座
			}
		},
		
		watch: {
			watchOnloadOrder: {
				handler(val) {
					this.getSeat();
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
			this.getSeat()
			this.timer = setInterval(() => {
				if (this.allArr.length != 0) {
					this.timestamp = Date.parse(new Date());
					this.allArr = this.allArr.map(item => {
						// 时间
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
				}

			}, 1000)
			uni.$on('nowMoney', res => {
				this.money = res
			})

		},
		destroyed() {
			clearInterval(this.timer)
		},
		methods: {
			getSeat() {
				console.log('抢座页面')
				
				
				this.timestamp = Date.parse(new Date());
				uni.showLoading({
					title: '加载中...'
				})
				this.$get('/merchant/store/ly/storeLyList')
					.then(res => {
						if (res.code == 0) {
							uni.hideLoading()
							this.money = res.data.money
							this.list[0].count = res.data.nowVieList.length
							this.list[1].count = res.data.nowLyList.length
							if (res.data.nowVieList.length != 0) {
								this.allArr = Array.of(res.data.nowVieList[0])
							} else {
								this.allArr = Array.of(res.data.nowLyList[0])
							}
							if (res.data.nowVieList.length != 0) {
								this.grabaFlag = false
								this.id = res.data.nowVieList[0].id
								this.callFlag = res.data.nowVieList[0].callStatus == 1 ? false : true
								if (res.data.nowVieList.length >= 2) {
									this.nextId = res.data.nowVieList[1].id
								}
								res.data.nowVieList.map(item => {
									item.seatType = item.seatType == 1 ? '卡座' : item.seatType == 0 ? '无要求' : '散台';
									// 电话
									item.contactTel = item.contactTel.slice(0, 3) + '****' + item.contactTel.slice(7, 11);
									// 时间
									console.log(item.createTime)
									item.createTime = new Date(item.createTime.replace(/-/g, '/')).getTime();
									item.waitTime = this.timestamp - item.createTime
									var h = parseInt(item.waitTime / 3600000)
									h = h <= 9 ? '0' + h : h
									var m = parseInt(item.waitTime / 60000 - h * 60)
									m = m <= 9 ? '0' + m : m
									var s = parseInt(item.waitTime / 1000 - h * 3600 - m * 60)
									s = s <= 9 ? '0' + s : s
									item.waitTime = h + ':' + m + ":" + s
									item.type=2
									return item
								})
								uni.$emit("change", res)
							} else if (res.data.nowLyList.length != 0) {
								this.grabaFlag = true
								this.id = res.data.nowLyList[0].id
								this.callFlag = res.data.nowLyList[0].callStatus == 1 ? false : true
								if (res.data.nowLyList.length >= 2) {
									this.nextId = res.data.nowLyList[1].id
								}
								res.data.nowLyList.map(item => {
									item.seatType = item.seatType == 1 ? '卡座' : item.seatType == 0 ? '无要求' : '散台';
									// 电话
									item.contactTel = item.contactTel.slice(0, 3) + '****' + item.contactTel.slice(7, 11);
									// 时间
									console.log(item.createTime)
									item.createTime = new Date(item.createTime.replace(/-/g, '/')).getTime();
									item.waitTime = this.timestamp - item.createTime
									var h = parseInt(item.waitTime / 3600000)
									h = h <= 9 ? '0' + h : h
									var m = parseInt(item.waitTime / 60000 - h * 60)
									m = m <= 9 ? '0' + m : m
									var s = parseInt(item.waitTime / 1000 - h * 3600 - m * 60)
									s = s <= 9 ? '0' + s : s
									item.waitTime = h + ':' + m + ":" + s
									item.type=1
									return item
								})
							} else {
								this.grabaFlag = false
								this.allArr = []
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
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				// console.log(e)
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
				
				console.log(this.swiperCurrent,this.current)
				
				this.getSeat()
				// this.timer = setInterval(() => {
					this.getRowNumber()
				// }, 1000)
			},
			getRowNumber() {
				console.log('排号页面')
				
				this.$get('/merchant/store/ly/storeLyList')
					.then(res => {
						// console.log(res)
						console.log(this.grabaFlag)
						if (res.code == 0) {
							if (this.grabaFlag) {
								uni.$emit("rowNumber", res.data.nowLyList.slice(1))
							} else {
								uni.$emit("rowNumber", res.data.nowLyList)
							}

							if (res.data.nowLyList.length != 0) {
								res.data.nowLyList.map(item => {
									item.seatType = item.seatType == 1 ? '卡座' : item.seatType == 0 ? '无要求' : '散台';
									// 电话
									item.contactTel = item.contactTel.slice(0, 3) + '****' + item.contactTel.slice(7, 11);
									// 时间
									item.createTime = new Date(item.createTime.replace(/-/g, '/')).getTime();

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
								// uni.$emit("rowNumber", res)
							}
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}



					})
			},
		
			// 呼叫
			callChange(num) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				console.log(num)
				this.callFlag = false
				this.$get(`/merchant/store/ly/setCall/${this.id}/${num}`)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							uni.showToast({
								icon: 'none',
								title: '呼叫中'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '网络错误'
							})
						}
					})
			},
			// 取消
			callCancel(num) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.callFlag = true
				this.$get(`/merchant/store/ly/cancelCalling/${this.id}/${num}`)
					.then(res => {
						if (res.code == 0) {
							this.callFlag = true
							this.getSeat()
							this.getRowNumber()
							uni.showToast({
								icon: 'success',
								title: '已取消'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '网络错误'
							})
						}
					})
			},
			// 确定
			callConfirm(num) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.$get(`/merchant/store/ly/calling/${this.id}/${num}`)
					.then(res => {
						if (res.code == 0) {
							this.callFlag = true
							this.getSeat()
							this.getRowNumber()
							uni.switchTab({
								url: '../order'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '网络错误'
							})
						}
					})
			},
			// 续排
			continues(num) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				if (!this.nextId) {
					uni.showToast({
						icon: 'none',
						title: '只有一个人抢座无法续排'
					})
					return
				}
				let data = {
					"id": this.id,
					"nextId": this.nextId,
					"nextType": num,
					"type": num
				}
				this.$post(`/merchant/store/ly/setContinuation`, data)
					.then(res => {
						if (res.code == 0) {
							this.callFlag = true
							this.getSeat()
							this.getRowNumber()
							uni.showToast({
								icon: 'success',
								title: '已续排'
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: '网络错误'
							})
						}
					})
			},
			//跳转历史
			goHistory(e) {
				uni.$emit('goHistory', {
					url: `seatMan/historySeat/historySeat?title=${e}`
				})
			},
			// 设置
			setTopPrice() {
				uni.navigateTo({
					url: 'seatMan/topPrice/topPrice'
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
	/deep/ .u-badge--bg--error {
		background-color: #67A8FC;
	}

	.score-view {
		height: 100%;
	}

	.orderManagement {
		height: 90%;
	}

	.footer {
		height: calc(113% - 620rpx);
	}

	.footers {
		height: calc(113% - 320rpx);
	}

	.header {
		display: flex;
		justify-content: space-between;

		.nowTopPrice {
			display: inline-block;

			text {
				&:nth-child(1) {
					font-size: 28rpx;
					color: #000;
				}

				&:nth-child(2) {
					font-size: 28rpx;
					color: #FF3636;
				}

				&:nth-child(3) {
					margin-left: 16rpx;
					font-size: 28rpx;
					color: #6DABFC;
				}
			}
		}

		text {
			font-size: 28rpx;
			color: #6DABFC;
		}
	}

	.content {
		// width: 702rpx;
		height: 306rpx;
		background-color: #6DABFC;
		border-radius: 10rpx;
		display: flex;
		padding: 24rpx 40rpx;
		box-sizing: border-box;
		position: relative;
		margin: 24rpx auto;

		.content_left {
			flex: 1;

			view {
				font-size: 24rpx;
				color: #FFFFFF;

				&:nth-child(2) {
					margin: 24rpx 0;
				}
			}

			text {
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}

		.content_right {
			flex: 1;

			view {
				font-size: 24rpx;
				color: #FFFFFF;

				&:nth-child(2) {
					margin: 24rpx 0;
				}

				&:nth-child(3) {
					display: flex;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			text {
				color: #FFFFFF;
				font-size: 32rpx;
			}
		}

		.content_foot {
			position: absolute;
			left: 0;
			right: 0;
			margin: auto;
			bottom: 24rpx;
			width: 136rpx;
			height: 54rpx;
			background-color: #fff;
			border-radius: 54rpx;
			text-align: center;
			line-height: 54rpx;
		}

		.content_foot2 {
			position: absolute;
			left: 0;
			right: 0;
			margin: auto;
			bottom: 24rpx;
			width: 510rpx;
			display: flex;

			.comfime {
				width: 136rpx;
				height: 54rpx;
				background-color: #6AD26A;
				text-align: center;
				line-height: 54rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #fff;
			}

			.cancel {
				width: 136rpx;
				height: 54rpx;
				background-color: #fff;
				text-align: center;
				line-height: 54rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #000;
				margin: 0 40rpx;
			}

			.continue {
				width: 136rpx;
				height: 54rpx;
				background-color: #FBC774;
				text-align: center;
				line-height: 54rpx;
				border-radius: 8rpx;
				font-size: 28rpx;
				color: #fff;
			}
		}
	}

	.order-list-wrap {
		height: calc(113% - 180rpx);

		.swiper-box {
			height: 100%;
		}
	}
</style>

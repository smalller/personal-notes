<template>
	<view class="orderManagement">
		<navBar :switchUrl="'../mine'">优惠券</navBar>
		<view v-if="delFlag">
			<view class="coupons" v-if="setFlag">
				<view @click="addCoupons(currentNum)">新增优惠券</view>
				<view @click="delCoupons" :class="[rockFlag?'delanimation':'']">批量删除</view>
				<view @click="setCoupons" :class="[setrockFlag?'setanimation':'']">设置</view>
			</view>
		</view>
		<view class="couponss" v-if="!setFlag">
			<view class="cancel" @click="setCancel">取消</view>
			<view class="setcomfirm" @click="setCancel">确定</view>
		</view>
		<view class="couponss" v-if="!delFlag">
			<view class="cancel" @click="delCancel">取消</view>
			<view class="setcomfirm" @click="delConfirm">确认删除</view>
		</view>
		<u-modal v-model="delshows" :content="delcontents" :show-cancel-button="true" @confirm="delConfirmUltimate"></u-modal>
		<view class="threeCard">
			<u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" font-size="28"
			 bar-width="84" :bold="false"></u-tabs-swiper>
		</view>
		<view v-if="noneCoupons" class="noneCoupons">
			<image src="../../../static/images/empty_data.png" mode="widthFix"></image>
			没有优惠券，快去添加吧~
		</view>
		<view :class="[noneCoupons?'noHeight':'order-list-wrap']">
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scrollY" @scrolltolower="onreachBottom">
						<view>
							<block v-for="(item,index) in deduction" :key="index">
								<view class="bgBox">

									<text class="iconfont" v-if="!item.checked" @click="changeFlag(deduction,index)">&#xe702;</text>
									<text class="iconfont" v-if="item.checked" @click="changeFlag(deduction,index)">&#xe84b;</text>

									<view class="bg" v-bind:style="{'transform':iconFlag?'translateX(60rpx)':'','marginLeft':iconFlag?'10rpx':''}">
										<view class="bigBoxs" v-if="setFlag"></view>
										<view class="left" @click="godetails(deduction,index,current)">
											<view class="top">
												<text>{{item.storeName}}</text>
												<view class="fix">
													<view class="num1">限量<text>{{item.sum}}</text>张</view>
													<view class="num2">剩余<text>{{item.remainder}}</text>张</view>
												</view>
											</view>
											<view class="middle">该优惠券仅限本店使用</view>
											<view class="bottom">
												<view :style="{'transform':phoneFlag?'scale(.57)':'',whiteSpace:'nowrap',marginLeft:phoneFlag?-132+'rpx':''}">
													使用期限:<text>{{item.beginTime}}</text>至<text>{{item.overTime}}</text>
												</view>
												<view :class="[item. storeApply=='已启用'?'enable':'active']" :style="{'width':phoneFlag?150+'rpx':''}"><text>{{item. storeApply}}</text></view>
											</view>
										</view>
										<view class="right" @click="godetails(deduction,index,current)">
											<view class="one" :style="{fontSize: fontSize + 'px' }"><text>￥</text>{{item.discountMoney}}</view>
											<view class="two">抵扣券</view>
										</view>
										<view class="pos-one"></view>
										<view class="pos-two"></view>
									</view>
								</view>
							</block>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scrollY" @scrolltolower="onreachBottom">
						<view>
							<block v-for="(item,index) in present" :key="index">
								<view class="bgBox">

									<text class="iconfont" v-if="!item.checked" @click="changeFlag(present,index)">&#xe702;</text>
									<text class="iconfont" v-if="item.checked" @click="changeFlag(present,index)">&#xe84b;</text>

									<view class="bg" v-bind:style="{'transform':iconFlag?'translateX(60rpx)':'','marginLeft':iconFlag?'10rpx':''}">
										<view class="bigBoxs" v-if="setFlag"></view>
										<view class="left" @click="godetails(present,index,current)">
											<view class="top">
												<text>{{item.storeName}}</text>
												<view class="fix">
													<view class="num1">限量<text>{{item.sum}}</text>张</view>
													<view class="num2">剩余<text>{{item.remainder}}</text>张</view>
												</view>
											</view>
											<view class="middle">{{item.details}}</view>
											<view class="bottom">
												<view :style="{'transform':phoneFlag?'scale(.58)':'',whiteSpace:'nowrap',marginLeft:phoneFlag?-130+'rpx':''}">
													使用期限:<text>{{item.beginTime}}</text>至<text>{{item.overTime}}</text>
												</view>
												<view :class="[item.storeApply=='已启用'?'enable':'active']" :style="{'width':phoneFlag?150+'rpx':'',}"><text>{{item.storeApply}}</text></view>
											</view>
										</view>
										<view class="right" @click="godetails(present,index,current)">
											<view class="one"><text>￥</text>{{item.discountMoney}}</view>
											<view class="two">满减券</view>
										</view>
										<view class="pos-one"></view>
										<view class="pos-two"></view>
									</view>
								</view>
							</block>
						</view>
					</scroll-view>

				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scrollY" @scrolltolower="onreachBottom">
						<view>
							<block v-for="(item,index) in ceremony" :key="index">
								<view class="bgBox">

									<text class="iconfont" v-if="!item.checked" @click="changeFlag(ceremony,index)">&#xe702;</text>
									<text class="iconfont" v-if="item.checked" @click="changeFlag(ceremony,index)">&#xe84b;</text>
									<view class="bg" v-bind:style="{'transform':iconFlag?'translateX(60rpx)':'','marginLeft':iconFlag?'10rpx':''}">
										<view class="bigBoxs" v-if="setFlag"></view>
										<view class="left" @click="godetails(ceremony,index,current)">
											<view class="top">
												<text>{{item.storeName}}</text>
												<view class="fix">
													<view class="num1">限量<text>{{item.sum}}</text>张</view>
													<view class="num2">剩余<text>{{item.remainder}}</text>张</view>
												</view>
											</view>
											<view class="middle">{{item.details}}</view>
											<view class="bottom">
												<view :style="{'transform':phoneFlag?'scale(.58)':'',whiteSpace:'nowrap',marginLeft:phoneFlag?-130+'rpx':''}">
													使用期限:<text>{{item.beginTime}}</text>至<text>{{item.overTime}}</text>
												</view>
												<view :class="[item.storeApply=='已启用'?'enable':'active']" :style="{'width':phoneFlag?150+'rpx':''}"><text>{{item.storeApply}}</text></view>
											</view>
										</view>
										<view class="right" @click="godetails(ceremony,index,current)">
											<view class="one" style="font-size: 48rpx;">礼券</view>
											<view class="two" style="font-size: 24rpx;">满{{item.contentMoney}}可用</view>
										</view>
										<view class="pos-one"></view>
										<view class="pos-two"></view>
									</view>
								</view>
							</block>
						</view>
					</scroll-view>

				</swiper-item>
			</swiper>
		</view>
		<!-- 遮罩层 -->
		<u-mask :show="shadeShow" @click="shadeShow = false">
			<view class="warp">
				<view class="rect" @tap.stop>
					<view class="rect-one">确认删除所选优惠券</view>
					<view class="rect-two">
						<text @click="shadeCacel">取消</text>
						<text>确定</text>
					</view>
				</view>
			</view>
		</u-mask>
	</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				list: [{
					name: '抵扣券'
				}, {
					name: '满减券'
				}, {
					name: '消费礼券'
				}],
				deductionlist: [],
				deduction: [], //抵扣卷
				present: [], //满减券
				ceremony: [], //礼卷
				newdeductionlist: [], //编辑时存储之前数组
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				setFlag: true, //设置
				delFlag: true, //删除
				iconFlag: false, //icon删除
				shadeShow: false,
				id: null, //商家id
				currentFlag: false,
				delIndFlag: null, //删除哪个数组
				noneCoupons: false, //是否有优惠卷
				delshows: false, //删除modal
				delcontents: '确认删除吗？',
				phoneFlag: false,
				currentNum: 0,
				pageNo: 1, //当前页
				pageSize: 10, //每页大小
				lastPage: false, //是否最一页
				fontSize: '',
				rockFlag: false,
				setrockFlag: false
			}
		},
		onLoad(e) {
			this.getCoupons()
			if (e.current) {
				this.currentNum = e.current
				this.currentFlag = !this.currentFlag
			} else {
				this.current = 0;
				this.swiperCurrent = 0;
			}
			if (this.currentFlag) {
				this.current = Number(e.current);
				this.swiperCurrent = Number(e.current);
			}

		},
		onPullDownRefresh() {
			this.getCoupons()
		},
		methods: {
			// 接口获取
			getCoupons() {
				let data = {
					pageNo: this.pageNo, //当前页
					pageSize: this.pageSize, //每页大小
				}
				this.$post('/merchant/store/coupon/couponLimit', data)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							uni.stopPullDownRefresh();
						}
						this.deductionlist = []
						this.deduction = []
						this.present = []
						this.ceremony = []
						if (res.data.list.length > 0) {
							let pricearr = []

							uni.hideLoading()
							this.deductionlist = res.data.list
							this.lastPage = res.data.lastPage
							this.id = res.data.list[0].id
							this.deductionlist.map(item => {
								return item.beginTime = item.beginTime.substring(0, item.beginTime.indexOf(' '))
							})
							this.deductionlist.map(item => {
								return item.overTime = item.overTime.substring(0, item.overTime.indexOf(' '))
							})
							this.deductionlist.map(item => {
								return item.storeApply = item.storeApply == 1 ? '已启用' : '未启用'
							})
							this.deductionlist.map((item, index) => {
								this.$set(item,'checked',false)
								return item
							})
							
							// console.log(this.deductionlist)
							for (var i = 0; i < this.deductionlist.length; i++) {
								pricearr.push(this.deductionlist[i].discountMoney)
								if (this.deductionlist[i].category == 1) {
									this.deduction.push(this.deductionlist[i])
								} else if (this.deductionlist[i].category == 2) {
									this.present.push(this.deductionlist[i])
								} else {
									this.ceremony.push(this.deductionlist[i])
								}
							}
							// console.log(this.present)
							if (pricearr[pricearr.length - 1].length < 4) {
								return
							}
							this.fontSize = 28 - pricearr[pricearr.length - 1].length
							console.log(this.fontSize)
						} else {
							this.noneCoupons = true
						}

					})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.currentNum = index;
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				// console.log(e)
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
				this.currentNum = current
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				if (!this.lastPage) {
					uni.showLoading({
						title: '加载中'
					})
					this.pageNo++
					this.getCoupons()
				} else {
					uni.showToast({
						icon: 'none',
						title: '没有更多了哦'
					})
				}

			},
			// 新增
			addCoupons(e) {
				// console.log(e)
				uni.navigateTo({
					url: `addCoupons?title=${e}`
				})
			},
			// 删除
			delCoupons() {
				if (this.deductionlist.length == 0) {
					this.rockFlag = true
					uni.showToast({
						icon: 'none',
						title: '暂无优惠券'
					})
					setTimeout(() => {
						this.rockFlag = false
					}, 1000)
					return
				}
				this.delFlag = false
				this.iconFlag = true

			},
			// 删除取消
			delCancel() {
				this.delFlag = true
				this.iconFlag = false
			},
			// 确认删除
			delConfirm() {
				let couponList = [];
				for (var i = 0; i < this.deductionlist.length; i++) {
					if (this.deductionlist[i].checked) {
						couponList.push(this.deductionlist[i].id)
					}
				}
				if (couponList.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择要删除的优惠券'
					})
					return
				}
				this.delshows = true
			},
			// 最后确认删除
			delConfirmUltimate() {
				let couponList = [];
				for (var i = 0; i < this.deductionlist.length; i++) {
					if (this.deductionlist[i].checked) {
						couponList.push(this.deductionlist[i].id)
					}
				}
				this.$arr_post('/merchant/store/coupon/batchDeleteCoupon', couponList).then(res => {
					if (res.code == 741) {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					} else if (res.code == 0) {
						uni.showLoading({
							title: '删除中'
						})
						setTimeout(() => {
							uni.hideLoading()
							uni.showToast({
								icon: 'success',
								title: res.data
							})
						}, 500)
						this.currentNum = this.current
						this.getCoupons()
						this.delFlag = true
						this.iconFlag = false
					} else {
						uni.showToast({
							icon: 'none',
							title: '刷新试试'
						})
					}
				})
			},
			// 选项删除
			changeFlag(e, ind) {
				e[ind].checked = !e[ind].checked
			},
			// 遮罩取消
			shadeCacel() {
				this.shadeShow = false
			},
			// 点击设置
			setCoupons() {
				if (this.deductionlist.length == 0) {
					this.setrockFlag = true
					uni.showToast({
						icon: 'none',
						title: '暂无优惠券'
					})
					setTimeout(() => {
						this.setrockFlag = false
					}, 1000)
					return
				}
				this.setFlag = !this.setFlag
				this.newdeductionlist = JSON.parse(JSON.stringify(this.deductionlist));
			},
			// 设置取消
			setCancel() {
				this.setFlag = !this.setFlag;
				this.deductionlist = this.newdeductionlist
			},
			// 具体设置
			godetails(e, ind, current) {
				// console.log(current)
				uni.navigateTo({
					url: `compileCoupons?data=${e[ind].id}&current=${current}`
				})
			},


		}
	}
</script>

<style lang="scss" scoped>
	.delanimation {
		-webkit-animation: shake 1s .2s ease both;
		-moz-animation: shake 1s .2s ease both;
	}

	.setanimation {
		-webkit-animation: shake 1s .2s ease both;
		-moz-animation: shake 1s .2s ease both;
	}

	@-webkit-keyframes shake {

		0%,
		100% {
			-webkit-transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			-webkit-transform: translateX(-20rpx);
		}

		20%,
		40%,
		60%,
		80% {
			-webkit-transform: translateX(20rpx);
		}
	}

	@-moz-keyframes shake {

		0%,
		100% {
			-moz-transform: translateX(0);
		}

		10%,
		30%,
		50%,
		70%,
		90% {
			-moz-transform: translateX(-20rpx);
		}

		20%,
		40%,
		60%,
		80% {
			-moz-transform: translateX(20rpx);
		}
	}

	uni-page-body {
		height: 100%;
	}

	.orderManagement {
		height: 100%;
	}

	.swiper-item {
		margin-top: 18rpx;
	}

	.scrollY {
		width: 100%;
		height: calc(100% - 80rpx);
	}

	// 遮罩层
	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.noneCoupons {
		text-align: center;
		font-weight: 600;
		font-size: 32rpx;

		image {
			width: 100%;
		}
	}

	.rect {
		width: 550rpx;
		height: 360rpx;
		background-color: #fff;
		border-radius: 10rpx;

		.rect-one {
			font-size: 36rpx;
			margin: 112rpx 0 0 112rpx;
		}

		.rect-two {
			margin-top: 70rpx;
			display: flex;
			justify-content: space-around;

			text {
				&:nth-child(1) {
					display: inline-block;
					width: 200rpx;
					height: 80rpx;
					border: 1px solid #f1f1f1;
					border-radius: 10rpx;
					text-align: center;
					line-height: 80rpx;
				}

				&:nth-child(2) {
					display: inline-block;
					width: 200rpx;
					height: 80rpx;
					background-color: #67A8FC;
					border-radius: 10rpx;
					text-align: center;
					line-height: 80rpx;
					color: #fff;
				}
			}
		}

	}

	.bigBoxs {
		position: absolute;
		right: 0;
		top: 0;
		z-index: 997;
		height: 100%;
		width: 100%;
	}

	.coupons {
		padding: 112rpx 24rpx 0;
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 220rpx;
		box-shadow: 0 0 5rpx 0 #ccc;

		view {
			&:nth-child(1) {
				width: 238rpx;
				height: 74rpx;
				font-size: 32rpx;
				background-color: #67A8FC;
				text-align: center;
				line-height: 74rpx;
				border-radius: 15rpx;
				color: #fff;
			}

			&:nth-child(2) {
				width: 238rpx;
				height: 74rpx;
				font-size: 32rpx;
				background-color: #67A8FC;
				text-align: center;
				line-height: 74rpx;
				border-radius: 15rpx;
				color: #fff;
			}

			&:nth-child(3) {
				width: 162rpx;
				height: 74rpx;
				font-size: 32rpx;
				text-align: center;
				line-height: 74rpx;
				border-radius: 15rpx;
				border: 1px solid #67A8FC;
			}
		}
	}

	.couponss {
		padding: 112rpx 24rpx 0;
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 220rpx;
		box-shadow: 0 0 5rpx 0 #ccc;

		.cancel {
			width: 344rpx;
			height: 74rpx;
			background-color: #fff;
			border: 1px solid #67A8FC;
			border-radius: 15rpx;
			text-align: center;
			line-height: 74rpx;
		}

		.setcomfirm {
			width: 344rpx;
			height: 74rpx;
			background-color: #67A8FC;
			border-radius: 15rpx;
			text-align: center;
			line-height: 74rpx;
			color: #fff;
		}
	}

	.noHeight {
		height: 0;
	}

	.order-list-wrap {
		height: calc(100% - 300rpx) !important;
		padding-top: 4rpx;
		box-sizing: border-box;

		uni-swiper {
			height: 100%;
		}
	}

	.bgBox {
		padding: 0 16rpx;
		margin-top: 8rpx;
		position: relative;

		.iconfont {
			position: absolute;
			left: 0;
			top: 60rpx;
			font-size: 56rpx;
			z-index: 10;
			font-size: 60rpx;
			margin-left: 20rpx;
		}

		.bg {
			height: 200rpx;
			background-color: #fff;
			width: 100%;
			box-shadow: 0 0 5rpx 0 #ccc;
			padding-left: 32rpx;
			box-sizing: border-box;
			border: 1px solid #fff;
			display: flex;
			justify-content: space-between;
			border-radius: 20rpx;
			position: relative;
			transition: transform .5s;
			z-index: 20;

			.left {
				.top {
					display: flex;
					margin-top: 30rpx;

					text {
						font-size: 24rpx;
						font-weight: 600;
					}

					.fix {
						margin-left: 72rpx;
						display: flex;
						font-size: 20rpx;

						.num1 {
							font-size: 20rpx;

							text {
								font-size: 20rpx;
								font-weight: 400;
								color: #6AD26A;
							}
						}

						.num2 {
							margin-left: 28rpx;
							font-size: 20rpx;

							text {
								font-size: 20rpx;
								font-weight: 400;
								color: #ff5656;
							}
						}
					}
				}

				.middle {
					font-size: 28rpx;
					font-weight: 600;
					color: #000000;
					margin-top: 16rpx;
				}

				.bottom {
					display: flex;
					margin-top: 18rpx;
					white-space: nowrap;

					view {

						font-size: 20rpx;
						color: #999999;

						text {
							font-size: 20rpx;
							color: #000;
						}
					}

					.enable {
						font-size: 20rpx;
						color: #fff;
						width: 94rpx;
						height: 28rpx;
						background-color: #6AD26A;
						text-align: center;
						line-height: 28rpx;
						border-radius: 15rpx;
						margin-left: 38rpx;

						text {
							display: inline-block;
							color: #fff;
						}
					}

					.active {
						background-color: #ff5656;
						font-size: 20rpx;
						color: #fff;
						width: 88rpx;
						height: 28rpx;
						text-align: center;
						line-height: 28rpx;
						border-radius: 15rpx;
						margin-left: 38rpx;

						text {
							display: inline-block;
							color: #fff;
						}
					}
				}
			}

			.right {
				width: 200rpx;
				height: 200rpx;
				background-color: #FEE140;
				border-radius: 0 20rpx 20rpx 0;
				text-align: center;
				position: absolute;
				// left: 0;
				right: -1px;
				top: 0;
				bottom: 0;
				margin: auto;

				.one {
					font-size: 72rpx;
					color: #fff;
					margin-top: 42rpx;
					white-space: nowrap;
					height: 94rpx;

					text {
						font-size: 46rpx;
						font-weight: bold;
						color: #fff;
					}
				}

				.two {
					font-size: 20rpx;
					font-weight: 600;
					color: #FFFFFF;
				}
			}

			.pos-one {
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #fff;
				position: absolute;
				top: -10rpx;
				right: 190rpx;
				box-shadow: 0 4rpx 5rpx 0 #f1f1f1;
			}

			.pos-two {
				width: 20rpx;
				height: 20rpx;
				border-radius: 50%;
				background-color: #fff;
				position: absolute;
				bottom: -10rpx;
				right: 190rpx;
				box-shadow: 0 -4rpx 5rpx 0 #f1f1f1;
			}
		}
	}
</style>

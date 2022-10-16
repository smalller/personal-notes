<template>
	<view class="myActivity">
		<navBars style="background-color:#fff;" :switchUrl="'../mine'">推广活动</navBars>

		<view class="activityBox" v-if="!noneActivity">
			<scroll-view>
				<view class="activityList" v-for="(item,index) in allActivity" :key="index" @click="goDetails(index)">
					<view class="top">
						{{item.name}}
					</view>
					<view class="middle" v-html="item.synopsis">
						{{item.synopsis}}
					</view>
					<view class="bottom">
						<view class="left">
							{{item.startTime}}-{{item.endTime}}
						</view>
						<view class="right" :class="[item.examine=='已通过'?'right':item.examine=='审核中'?'right2':'right1']">
							{{item.examine}}
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="noneActivity" class="noneActivity">
			<image src="../../../static/images/empty_data.png" mode="widthFix"></image><br/>
			<text>
			没有活动，快去添加吧~	
			</text>
			
		</view>
		<view class="footer">
			<view class="left" @click="goAdd">添加活动</view>
			<view class="right" @click="showFlag">申请推荐位</view>
		</view>
		<!-- 遮罩层 -->
		<u-modal v-model="show" :content="content" @confirm="applyFor" :mask-close-able="true"></u-modal>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				allActivity: [],
				show: false,
				url: '../mine/mine',
				content: '手机暂不能使用此功能，请用电脑操作',
				// 获取时间
				query: {
					"endTime": null,
					"name": "",
					"startTime": null
				},
				id: null,
				noneActivity: false,
				// :show-cancel-button="true"
			}
		},
		onLoad() {
			this.getActivity()
		},
		methods: {
			getActivity() {
				uni.showLoading({
					title: '疯狂加载中...'
				})
				let data = {
					name: this.query.name,
					startTime: this.query.startTime ? '' : this.$date.date()[0],
					endTime: this.query.endTime ? '' : this.$date.date()[1]
				}
				this.$post('/merchant/store/active/getActive', data)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							uni.hideLoading()
							if (res.data.length == 0) {
								this.noneActivity = true
							}
							uni.hideLoading()
							res.data.map(item => {
								if (item.examine == 0) {
									item.examine = "未审核"
								} else if (item.examine == 1) {
									item.examine = "审核中"
								} else if (item.examine == 2) {
									item.examine = "未通过"
								} else if (item.examine == 3) {
									item.examine = "已通过"
								} else {
									item.examine = "已通过"
								}
								// item.startTime = item.startTime.substring(0, item.startTime.indexOf(' '))
								item.startTime = this.$date.timeFormatting(item.startTime)
								item.endTime = this.$date.timeFormatting(item.endTime)
								return item
							})

							// console.log(res)
							this.allActivity = res.data
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}

					})
			},
			showFlag() {
				this.show = true
			},
			goDetails(ind) {
				this.id = this.allActivity[ind].id;
				console.log(this.allActivity[ind])
				// if (this.allActivity[ind].examine == "未通过") {
				// 	uni.navigateTo({
				// 		url: `addActivity?id=${this.id}`
				// 	})
				// } else {
					uni.navigateTo({
						url: `activityDetails?id=${this.id}`,
					})
				// }

			},
			goAdd() {
				uni.navigateTo({
					url: 'addActivity'
				})
			},
			applyFor() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body {
		width: 100%;
		height: 100%;
	}

	.noneActivity {
		text-align: center;
		font-weight: 600;
		font-size: 32rpx;
		height: 100%;
		image {
			width: 100%;
			height: 50%;
			margin-top: 88rpx;
		}
	}

	.myActivity {
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
	}

	.activityBox {
		padding: 112rpx 24rpx;
		background-color: #f7f7f7;

		.activityList {
			height: 254rpx;
			width: 100%;
			border-radius: 15rpx;
			padding: 24rpx;
			box-sizing: border-box;
			background-color: #fff;
			margin-bottom: 24rpx;

			.top {
				font-size: 32rpx;
				font-weight: 600;
			}

			.middle {
				font-size: 28rpx;
				margin: 24rpx 0;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}

			.bottom {
				display: flex;
				justify-content: space-between;

				.left {
					font-size: 24rpx;
				}

				.right {
					width: 108rpx;
					height: 34rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 34rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					background-color: #6AD26A;
				}

				.right1 {
					width: 108rpx;
					height: 34rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 34rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					background-color: #FF5656;
				}

				.right2 {
					width: 108rpx;
					height: 34rpx;
					border-radius: 10rpx;
					text-align: center;
					line-height: 34rpx;
					font-size: 24rpx;
					color: #FFFFFF;
					background-color: #FFC145;
				}
			}
		}
	}

	.footer {
		width: 100%;
		height: 92rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		box-shadow: 0 0 5rpx 0 #ccc;

		.left {
			font-size: 32rpx;
			color: #67A8FC;
			text-align: center;
			line-height: 92rpx;
			width: 100%;
			height: 100%;
			border-right: 1px solid #f7f7f7;
		}

		.right {
			font-size: 32rpx;
			text-align: center;
			line-height: 92rpx;
			width: 100%;
			height: 100%;
			color: #67A8FC;
		}
	}

	.warp {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rect {
		width: 120px;
		height: 120px;
		background-color: #fff;
	}
</style>

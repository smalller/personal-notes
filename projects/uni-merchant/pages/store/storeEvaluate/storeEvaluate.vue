<template>
	<view>
		<view class="header">
			<navBar :switchUrl="'../store'">顾客评价</navBar>
		</view>
		<view class="content">
			<view class="top">
				店铺总评论 <text>{{alltotal}}</text> 条
			</view>
			<view class="body" v-for="(item,index) in commentArr" :key="index">
				<view class="bigBox">
					<view class="top2">
						<view>
							<text class="comment-on-the-user">评论用户：{{item.userName}}</text>
						</view>
						<view class="xing">
							<text class="fen_text">评分:</text>

							<view v-bind:style="{ width: item.grade}" class="huangxing">
								<view v-for="(item,index) in 5" :key="index">
									<image src="../../../static/imgs/xing.png" class="img"></image>
								</view>
							</view>
							<view style="display: flex; width: 150rpx;overflow: hidden;" class="hexing">
								<view v-for="(item,index) in 5" :key="index">
									<image src="../../../static/imgs/xing_1.png" class="img"></image>
								</view>
							</view>
							<text class="num_text">{{item.score}}</text>
						</view>
					</view>
					<view class="middle">
						<text>内容：</text>
						<text>{{item.content}}</text>
					</view>
					<view class="foot">
						<block v-for="(item,index) in item.labels" :key="index">
							<text>{{item}}</text>
						</block>
					</view>
					<view class="time">
						<text class="t1">{{item.createTime | dateyear}}</text>
						<text class="t2" @click="goDetails(item.id)">查看更多</text>
					</view>
				</view>
			</view>
		</view>
		<view v-if="branchesFlag" class="branches" :style="{height:screenHeight}">
			<image src="../../../static/images/empty_converList.png" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				grade: '40rpx',
				commentArr: [],
				alltotal:0,
				branchesFlag: false,
				screenHeight:'',
				pageNo:1,
				lastPage:false,
			}
		},
		onLoad() {
			this.getEvaluuate();
		},
		onReachBottom(){
			uni.showLoading({
				title:'加载中...'
			})
			if(!this.lastPage){
				this.pageNo++
				this.getEvaluuate()
			}else{
				uni.showToast({
				icon:'none',
				title:'没有更多评论了'
			})
			}
			
		},
		methods: {
			getEvaluuate() {
				let data = {
					pageNo: this.pageNo,
					pageSize: 10,
				}
				this.$post('/merchant/store/appraise/appraiseListByStoreId', data).then(res => {
					// console.log(res)
					if (res.code == 0) {
						uni.hideLoading();
						res.data.list.reverse().map(item => {
							if (item.labels != '') {
								item.labels = item.labels.split(',')
							}
							return item
						})
						this.commentArr = this.commentArr.concat(res.data.list.reverse())
						console.log(this.commentArr)
						this.alltotal = res.data.total
						this.lastPage = res.data.lastPage
						this.commentArr.map((item => {
							return item.grade = item.appraiseLevel * 10 + '%'
						}))
						// console.log(this.commentArr)
						if (res.data.list.length == 0) {
							this.branchesFlag = true
						} else {
							this.branchesFlag = false
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},

			goDetails(e) {
				uni.navigateTo({
					url: `evaluateDetails/evaluateDetails?id=${e}`
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.branches {
		width: 100%;
		height: 100%;
		text-align: center;
		image{
			width: 100%;
			height: 100%;
		}

	}

	.wrap {
		padding: 24rpx;
	}

	.item {
		padding: 24rpx 0;
		color: $u-content-color;
		font-size: 28rpx;
	}

	.header {
		font-size: 36rpx;
	}

	.content {
		padding: 0 24rpx;

		.top {
			padding-top: 112rpx;
			font-size: 36rpx;
			margin-bottom: 18rpx;

			text {
				color: #FF3636;
				margin: 0 10rpx;

			}
		}

		.body {
			box-shadow: 0 0 5rpx 5rpx #f1f1f1;
			border-radius: 10rpx;
			margin-bottom: 22rpx;

			.bigBox {
				padding: 30rpx 32rpx 24rpx;

				.top2 {
					display: flex;
					justify-content: space-between;
					font-size: 32rpx;
					.comment-on-the-user{
						overflow: hidden; 
						text-overflow: ellipsis; 
						white-space: nowrap;
						display: inline-block;
						width: 376rpx;
					}
					.xing {
						display: flex;
						align-items: center;
						width: 300rpx;
						justify-content: space-between;
						position: relative;

						.hexing {
							position: absolute;
							left: 96rpx;
							z-index: 1;
						}

						.huangxing {
							display: flex;
							position: absolute;
							left: 96rpx;
							z-index: 2;
							overflow: hidden;
						}

						.img {
							width: 20rpx;
							height: 20rpx;
							margin: 0 12rpx 0 0;
						}

						text {
							font-size: 32rpx;
						}

						.fen_text {
							margin-right: 22rpx;
						}

						.num_text {
							font-size: 24rpx;
							margin-left: 8rpx;
						}
					}
				}

				.middle {
					font-size: 28rpx;
					margin: 24rpx 0 12rpx;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
				}

				.foot {
					text {
						display: inline-block;
						padding: 0 20rpx;
						background-color: #FBAD68;
						color: #fff;
						border-radius: 8rpx;
						margin:10rpx 20rpx 0 0;
					}
				}

				.time {
					margin: 14rpx 0 0 0;
					display: flex;
					justify-content: space-between;

					.t1 {
						font-size: 28rpx;
						color: #999999;

					}

					.t2 {
						font-size: 28rpx;
						color: #67A8FC;

					}
				}
			}
		}

	}
</style>

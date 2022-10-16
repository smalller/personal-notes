<template>
	<view>
		<navBar :switchUrl="'../info'">公告信息</navBar>
		<view style="padding: 88rpx 40rpx 0;">
			<view class="time">2020-11-01</view>
			<view class="subject" v-for="(item,index) in list" :key="index">
			<view class="single">
				<view class="content">
					<text :class="[item.textFlag?'text1':'text3']">{{item.title}}</text>
					<text :class="[item.textFlag?'text2':'text4']">{{item.content}}</text>
					<view class="bottom">
						<view class="times">发布时间：{{item.time}}</view>
						<view class="btn" @click="seeText(index)" v-if="item.textFlag">查看全文</view>
						<view class="btn" @click="seeText(index)" v-else>收起全文</view>
					</view>
				</view>
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
			}
		},
		methods: {
			seeText(ind) {
				this.list[ind].textFlag = !this.list[ind].textFlag
			}
		},
		onLoad(){
			let _this = this
			setTimeout(function(){
				_this.list.push(
				{
						id: 0,
						time: '2020-11-01',
						title: '天府花溪谷森林音乐露营节，来一场夏日狂欢！',
						content: '天府花溪谷森林音乐露营节，资深DJ一起来嗨！',
						textFlag: true
					},
					)
				if(_this.list.length>0){
						uni.hideLoading()
					}
			},1000)
			uni.showLoading({
				title:'数据加载中',
				success:(res=>{
					// console.log(res)
				})
			})
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body {
		height: 100%;
		background-color: #f7f7f7;

	}
	.time {
			text-align: center;
			font-size: 28rpx;
			color: #CCCCCC;
			margin-top: 24rpx;
		}
	.subject {
		width: 100%;
		margin-bottom: 24rpx;
		.single {
			padding: 24rpx;
			border-radius: 15rpx;
			background-color: #fff;
			margin-top: 24rpx;
			width: 100%;

			.content {
				width: 100%;
				.text1 {
					width: 556rpx;
					font-size: 28rpx;
					font-weight: 600;
					display: inline-block;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				
				}

				.text3 {
					width: 556rpx;
					font-size: 28rpx;
					font-weight: 600;
				}

				.text2 {
					width: 556rpx;
					font-size: 28rpx;
					text-indent: 27rpx;
					color: #ccc;
					display: inline-block;
					margin: 12rpx 0 24rpx 0;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.text4 {
					width: 556rpx;
					font-size: 28rpx;
					text-indent: 27rpx;
					color: #ccc;
					display: inline-block;
					margin: 12rpx 0 24rpx 0;
				}

				.bottom {
					display: flex;
					justify-content: space-between;
					align-items: flex-end;

					view {
						&:nth-child(1) {
							font-size: 24rpx;
							font-weight: 400;
						}

						&:nth-child(2) {
							font-size: 24rpx;
							color: #6FBBFE;
							margin: 0;

						}
					}
				}
			}
		}
	}
</style>

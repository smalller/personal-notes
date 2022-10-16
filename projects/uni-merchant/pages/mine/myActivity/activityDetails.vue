<template>
	<view>
		<navBars :navigateUrl="'./myActivity'">活动详情</navBars>
		<view class="subject" v-for="(item,index) in detailArr" :key="index">
			<view class="ac-name">
				{{item.name}}
			</view>
			<view class="ac-title">
				{{item.synopsis}}
			</view>
			<view class="ac-pcture">
				<image :src="item.thumb"></image>
			</view>
			<view class="ac-detail">
				活动详情
			</view>
			<view class="place">
				<view class="right">
					<text v-html="item.content"></text>
				</view>
			</view>
		<!-- 	<view class="ac-pcture">
				<image :src="item.thumb"></image>
			</view> -->
			<!-- <view class="matters">
				<view class="header">注意事项</view>
				<view class="individual">1.希望大家享受这场派对</view>
				<view class="individual">2.未满18岁请勿入内</view>
				<view class="individual">3.活动期间请务必保管好身边贵重物品</view>
			</view> -->
		</view>
		<view class="footer" v-if="detailInfo.examine != 1 && detailInfo.examine != 3 && detailInfo.examine != 4">
			<view class="left" @click="compile">编辑</view>
			<view class="right" @click="submit">提交审核</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				detailArr: [],
				detailInfo : {},
				id:''
			}
		},
		onLoad(option) {
			this.getDetail(option.id)
			this.id = option.id
		},
		methods: {
			getDetail(id) {
				uni.showLoading({
					title: "请稍等"
				})
				this.$get(`/merchant/store/active/getOneById/${id}`)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							uni.hideLoading();
							this.detailArr = [res.data];
							this.detailInfo = res.data;
							this.detailArr[0].thumb = this.$imgHead+this.detailArr[0].thumb;
							this.detailArr[0].content = this.detailArr[0].content
							if(process.env.NODE_ENV==='development'){
								this.detailArr[0].content = this.detailArr[0].content.replace('/file/merchant/store/system/upload/down?keyName=','./h5api/merchant/store/system/upload/down?keyName=')
							}
						}

					})
			},
			compile(){
				uni.navigateTo({
					url: `addActivity?id=${this.id}`
				})
			},
			submit(){
				this.$get(`/merchant/store/active/apply/${this.id}`)
				.then(res=>{
					uni.showLoading({
					  title: "正在提交",
					});
					// console.log(res)
					if(res.code==0){
						uni.showToast({
						    icon: "success",
						    title: "操作成功",
						});
					}
					else{
						uni.showToast({
						    icon: 'none',
						    title: res.msg,
						});
					}
				})
			}

		},

	}
</script>

<style lang="scss" scoped>
	.subject {
		padding: 160rpx 24rpx 100rpx 24rpx;

		.ac-name {
			font-size: 32rpx;
			font-weight: 600;
		}

		.ac-title {
			font-size: 28rpx;
			margin: 16rpx 0 24rpx;
		}

		.ac-pcture {
			image {
				width: 100%;
				height: 308rpx;
				border-radius: 15rpx;
			}
		}

		.ac-detail {
			font-size: 32rpx;
			font-weight: 600;
			margin: 24rpx 0;
		}

		.time {
			font-size: 28rpx;
			margin-bottom: 24rpx;
		}

		.place {
			display: flex;
			font-size: 28rpx;
			margin-bottom: 24rpx;
			width: 100%;
			
			.left{
				white-space: nowrap;
			}
			
			.right {
				width: 100%;
				
				text {
					&:nth-child(3) {
						color: #15359D;
						display: inline-block;
						margin: 8rpx 0 0;
					}
				}
				
				/deep/ img {
					width: 100%;
				}
			}
		}

		.matters {
			.header {
				font-size: 32rpx;
				font-weight: 600;
				margin: 24rpx 0;
			}

			.individual {
				font-size: 28rpx;
				margin-bottom: 24rpx;
			}
		}
	}
	.footer{
		position: fixed;
		bottom: 0;
		background-color: #fff;
		z-index: 666;
		bottom: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 92rpx;
		box-shadow: 0 0 5rpx 0 #ccc;
		.left {
		  font-size: 32rpx;
		  width: 100%;
		  height: 100%;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  border-right: 1px solid #f1f1f1;
		}
		.right {
		  font-size: 32rpx;
		  color: #67a8fc;
		  height: 100%;
		  display: flex;
		  align-items: center;
		  justify-content: center;
		  width: 100%;
		}
	}
</style>

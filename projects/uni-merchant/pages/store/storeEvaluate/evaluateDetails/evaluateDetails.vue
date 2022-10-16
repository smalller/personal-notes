<template>
	<view>
		<navBar>评价详情</navBar>
		<view class="waiBox">
			<view class="theme" v-for="(item,index) in commentArr" :key="index">
				<view class="bigBox">
					<view class="top">
						<text>评论用户：{{item.userName}}</text>
					</view>
					<view class="xing">
						<text class="fen_text">评分:</text>
						<view v-bind:style="{ width: item.grade}" class="huangxing">
							<view v-for="(item,index) in 5" :key="index">
								<image src="../../../../static/imgs/xing.png" class="img"></image>
							</view>
						</view>
						<view style="display: flex; width: 150rpx;overflow: hidden;" class="hexing">
							<view v-for="(item,index) in 5" :key="index">
								<image src="../../../../static/imgs/xing_1.png" class="img" id="imgs"></image>
							</view>
						</view>
						<text class="num_text">{{item.score}}</text>
					</view>
				</view>
				<view class="content">
					<text>内容：{{item.content}}</text>
				</view>
				<view class="imgs">
					<block v-if="imgFlag" v-for="(itm,index) in item.appraisePictureList" :key= "index">
						<image :src="itm.flag?loadingImg:itm.img" class="img" id="bigimgs" @load="imgOk(index)" @click="lookPicture(index)" mode="aspectFill"></image>
					</block>
				</view>
				<view class="foot">
					<block v-for="(item,index) in item.labels" :key="index">
						<text>{{item}}</text>
					</block>
				</view>
				<view class="time">
					<text class="t1">{{item.createTime | dateyear}}</text>
					<!-- <text class="t2" @click="reply">回复</text> -->
				</view>
				<!-- <view class="replyInp">
					<textarea type="text" value="" auto-height="true" placeholder-style="color:#ccc" placeholder="请输入内容" v-model="hotelReplay" />
				</view>
				<view style="display: flex;font-weight: 600;">
					店家回复：<input type="text" :value="item.reply" v-model="successReplay" :disabled="true"/>
				</view> -->
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				grade: '40rpx',
				commentArr: [],
				bossreply: null,
				hotelReplay: null,
				id: '', //回复id
				successReplay: null,
				imgFlag:true,
				banner:[],
				num:'',
				loadingImg:'../../../../static/images/loading.gif',
				errorImg:'../../../../static/images/errimg.jpeg',
			}
		},
		onLoad(e) {
			this.getDetails(e)
		},
		methods: {
			getDetails(e) {
				let _this = this
				uni.showLoading({
					title: '疯狂加载中',
				})
				_this.$get(`/merchant/store/appraise/getById/${e.id}`).then(res => {
					// console.log(res)
					if (res.code == 0) {
						_this.commentArr = [res.data]
						if (_this.commentArr[0].labels != '') {
							_this.commentArr.map(item => {
								return item.labels = item.labels.split(',')
							})
						}
						_this.commentArr.map((item => {
							return item.grade = item.appraiseLevel * 10 + '%'
						}))
						let newArr = []
						if (_this.commentArr[0].appraisePictureList.length != 0) {
							for(let value of _this.commentArr[0].appraisePicture.split(',')){
								// console.log(value)
								newArr.push(this.$imgHead + value)
							}
							_this.commentArr[0].appraisePictureList = JSON.parse(JSON.stringify(newArr))
							_this.commentArr[0].appraisePictureList = _this.commentArr[0].appraisePictureList.map(item=>{
								return{
									img:item
								}
							})
							_this.commentArr[0].appraisePictureList = _this.commentArr[0].appraisePictureList.map(item=>{
								this.$set(item,'flag',true)
								return item
							})
							_this.banner = newArr
							this.imgFlag = true
						}else{
							this.imgFlag = false
						}
						_this.successReplay = res.data.reply
						uni.hideLoading();
					}

				})
			},
			imgOk(ind){
				this.commentArr[0].appraisePictureList[ind].flag=false
			},
			reply() {
				// console.log(this.hotelReplay)
				if(!this.hotelReplay){
					uni.showToast({
						icon:'none',
						title:'请输入回复内容'
					})
					return
				}
				let data = {
					"oid": this.id,
					"reply": this.hotelReplay
				}
				uni.showLoading({
					title: '回复中...'
				})
				let _this = this
				this.$post('/merchant/store/appraise/reply', data)
					.then(res => {
						// console.log(res)
						uni.hideLoading()
						if (res.code == 0) {
							uni.showToast({
								icon: 'none',
								title: '回复成功'
							})
							this.successReplay = this.hotelReplay
							this.hotelReplay = null

						}else{
							uni.showToast({
								icon:'none',
								title:res.msg
							})
						}
					})
			},
			// 查看图片
			lookPicture(ind){
				uni.previewImage({
				  current: ind,
				  urls: this.banner,
				});
			}

		}
	}
</script>

<style lang="scss" scoped>
	.waiBox {
		padding: 48rpx 24rpx;
	}

	.theme {
		box-shadow: 0 0 5rpx 5rpx #f1f1f1;
		border-radius: 10rpx;
		padding: 28rpx 24rpx 30rpx 24rpx;
		margin-top: 60rpx;

		.bigBox {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			.top {
				font-size: 32rpx;
				white-space: nowrap;
				overflow: auto;
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

				.fen_text {
					font-size: 32rpx;
					margin-right: 22rpx;
				}

				.img {
					width: 20rpx;
					height: 20rpx;
					margin-right: 12rpx;
				}

				.num_text {
					margin-left: 24rpx;
				}
			}
		}

		.content {
			font-size: 28rpx;
			margin: 24rpx 0 24rpx 0;
			width: 654rpx;
			text {
				&:nth-child(1) {
					display: inline-block;
					width: 654rpx;
					overflow: auto;
				}
			}

		}
		.imgs{
			display: inline-block;
		}

		.imgs image {
			width: 204rpx;
			height: 204rpx;
			border-radius: 8rpx;
			margin: 0 12rpx 0 0;
			
		}
		.foot {
			margin: 44rpx 0 50rpx 0;

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
			display: flex;
			justify-content: space-between;
			align-items: center;

			.t1 {
				font-size: 28rpx;
				color: #999999;
			}

			.t2 {
				width: 148rpx;
				height: 62rpx;
				text-align: center;
				line-height: 62rpx;
				color: #fff;
				background-color: #68A8FC;
				border-radius: 10rpx;
				display: inline-block;
			}
		}
	}

	.replyInp {
		width: 100%;
		// height: 72rpx;
		border: 1px solid #f1f1f1;
		padding: 16rpx 0 16rpx 48rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		margin: 24rpx 0;
		border-radius: 15rpx;
	}
</style>

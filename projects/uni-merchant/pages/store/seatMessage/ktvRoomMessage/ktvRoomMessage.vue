<template>
	<view>
		<navBar :switchUrl="'../../store'">包间信息</navBar>
		<view class="has-navBar">
			<template v-if="$store.state.auth > 0 ">
				<view style="display: flex;align-items: center;">
					<view class="add-btn" @click="addKtvRoom">
						<text>新增包间</text>
					</view>
					<view class="add-btn" @click="batchDel" style="margin-left: 48rpx;" v-if="delFlag">
						<text>批量删除</text>
					</view>
					<view class="desass" v-if="!delFlag">
						<view class="left" @click="cancelDel">取消</view>
						<view class="right" @click="comfirmDel">确认</view>
					</view>
				</view>
			</template>

			<view class="has-room">
				<text v-if="!lengthTrue">已有包间</text>
				<text v-if="lengthTrue">暂无包间</text>
			</view>
			<block v-for="(item,index) in ktvRoomArr">
				<view class="floor">
					{{item.floor}}
				</view>
				<block v-for="(value,ind) of item.ktvRoomList">
					<view :class="[value.colorflag?'room-list-wrap':'room-list-wraps']" @click="delCertain(index,ind)">
						<view :class="[value.flag?'room-infos':'room-info']">
							<view class="top">
								<view class="min-cons">
									包间类型：<text>{{value.roomTypeId | orderProperty(roomTypeList)}}</text>
								</view>
								<view class="min-con">
									低消：<text>￥{{value.minConsumption}}</text>
								</view>
							</view>
							<view class="middle">
								<view class="">
									容纳人数：<text>{{value.capacity}}</text>
								</view>
							</view>
							<view class="bottom">
								<view class="">
									包间数量：<text>{{value.roomNumber}}</text>
								</view>
								<view class="search-details">
									<view class="search-detail" v-if="!delFlag"></view>
									<text @click.stop="editKtvRoom(value.id)">查看详情</text>
								</view>
							</view>
						</view>
					</view>
				</block>

			</block>
		</view>
		<!-- 删除 -->
		<view>
			<u-modal v-model="delShow" :content="content" @confirm="delcom" :show-cancel-button="true"></u-modal>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				ktvRoomArr: [],
				storeId: null, //门店id
				delFlag: true,
				delShow: false, //删除
				content: '确认删除吗？',
				filterArr: [],
				roomTypeList: [],
				lengthTrue: true
			}
		},
		onLoad() {
			uni.showLoading({
				title: '疯狂加载中...'
			})
			this.getKtvMessage()
			this.$getPrivate(this, this.roomTypeList)
		},

		methods: {
			addKtvRoom() {
				uni.navigateTo({
					url: `./addKtvRoom/addKtvRoom?storeId=${this.storeId}`
				})
			},
			batchDel() {
				this.delFlag = false
			},
			cancelDel() {
				this.delFlag = true
				for (let value of this.ktvRoomArr) {
					value.ktvRoomList.map(item => {
						item.flag = false
					})
				}
			},
			// 确认删除
			comfirmDel() {
				this.delShow = true;
			},
			delcom() {
				let newArr = []
				let saveArr = []
				for (let value of this.ktvRoomArr) {
					value.ktvRoomList.map(item => {
						if (item.flag) {
							newArr.push(item)
						}
						return newArr
					})
				}
				let idArr = newArr.map(item => {
					return item.id
				})
				for (let value of this.ktvRoomArr) {
					value.ktvRoomList.map(item => {
						if (item.flag) {
							saveArr.push(item)

						}
						return saveArr
					})
				}
				saveArr.map(item => {
					item.roomAttribute = item.roomAttribute == '预定桌' ? 1 : 2
					return item
				})
				// console.log(this.storeId, idArr, saveArr)
				if (idArr.length == 0) {
					uni.showToast({
						icon: 'none',
						title: '请选择要删除的包间'
					})
					return
				}
				let data = {
					id: this.storeId,
					cassette: '20 × 20',
					deleteKtvRoomList: idArr,
					ktvRoomList: saveArr
				}
				uni.showLoading({
					title: '删除中...'
				})
				this.$put('/merchant/store/appUpdate', data)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							for (let value of this.ktvRoomArr) {
								value.ktvRoomList.map(item => {
									if (item.flag) {
										item.colorflag = true
									}
									return item
								})
							}
							uni.hideLoading()
							setTimeout(() => {
								uni.showToast({
									icon: 'success',
									title: '删除成功'
								})
								this.getKtvMessage()
							}, 800)

						} else {
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}
					})
			},
			editKtvRoom(id) {
				uni.navigateTo({
					url: `./editKtvRoom/editKtvRoom?id=${id}&storeId=${this.storeId}`
				})
			},
			// 删除某一个
			delCertain(index, ind) {
				if (!this.delFlag) {
					this.ktvRoomArr[index].ktvRoomList[ind].flag = !this.ktvRoomArr[index].ktvRoomList[ind].flag
				}

			},
			getKtvMessage() {
				this.$get('/merchant/store/getStoreInfo')
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							uni.hideLoading();
							this.storeId = res.data.id
							this.ktvRoomArr = res.data.list;
							this.lengthTrue = this.ktvRoomArr.length == 0 ? true : false
							if (res.data.list.length != 0) {
								for (let value of res.data.list) {
									value.ktvRoomList.map(item => {
										item.roomAttribute = item.roomAttribute == 1 ? '预定桌' : 'AA拼单桌';
										item.minConsumption = this.$date.price(item.minConsumption);
										return item
									})

									value.ktvRoomList.map(item => {
										this.$set(item, 'flag', false)
										return item
									})
									value.ktvRoomList.map(item => {
										this.$set(item, 'colorflag', false)
										return item
									})
								}
								
							}

						}
					})
				this.$get('/merchant/store/ktvDeploy/deployList')
					.then(res => {
						this.filterArr = res.data
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@-webkit-keyframes fadeOutLeft {
		0% {
			opacity: 1;
			-webkit-transform: translateX(0)
		}

		100% {
			-webkit-transform: translateX(-40px);
			opacity: 0;
		}
	}

	@-moz-keyframes fadeOutLeft {
		0% {
			opacity: 1;
			-moz-transform: translateX(0)
		}

		100% {
			opacity: 0;
			-moz-transform: translateX(-40rpx)
		}
	}

	@-webkit-keyframes fadeColor {
		0% {
			background-color: rgba(0, 0, 0, 0);
		}

		100% {
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	@-moz-keyframes fadeOutLeft {
		0% {
			background-color: rgba(0, 0, 0, 0);
		}

		100% {
			background-color: rgba(0, 0, 0, 0.2);
		}
	}

	.has-navBar {
		padding-left: 48rpx;
		padding-right: 48rpx;
		font-size: 32rpx;
		font-weight: 400;

		.desass {
			display: flex;
			margin-left: 36rpx;

			.left {
				width: 180rpx;
				height: 92rpx;
				border: 1px solid #67A8FC;
				background-color: #fff;
				border-radius: 10rpx;
				text-align: center;
				line-height: 92rpx;
				font-size: 32rpx;
				color: #67A8FC;
				margin-right: 24rpx;
			}

			.right {
				width: 180rpx;
				height: 92rpx;
				background-color: #67A8FC;
				border-radius: 10rpx;
				text-align: center;
				line-height: 92rpx;
				font-size: 32rpx;
				color: #fff;
			}
		}
	}

	.add-btn {
		width: 234rpx;
		height: 92rpx;
		background-color: #67A8FC;
		border-radius: 16rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 48rpx 0;

		text {
			color: #fff;
		}
	}

	.has-room {
		margin-bottom: 30rpx;

	}

	.floor {
		width: 192rpx;
		height: 84rpx;
		text-align: center;
		line-height: 84rpx;
		font-size: 32rpx;
		border: 1px solid #67A8FC;
		border-radius: 10rpx;
		margin-bottom: 48rpx;
		overflow: hidden;
	}

	.room-list-wrap {
		-webkit-animation: fadeOutLeft 1s .2s ease both;
		-moz-animation: fadeOutLeft 1s .2s ease both;
		overflow: hidden;
	}
	.room-list-wraps{
		overflow: hidden;
	}
	.room-infos {
		height: 228rpx;
		padding: 28rpx;
		margin-bottom: 48rpx;
		border: 2rpx solid #67A8FC;
		border-radius: 12rpx;
		background-color: #ccc;
		-webkit-animation: fadeColor 1s .1s ease both;

		>view {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			flex-wrap: nowrap;

			.min-cons {
				white-space: nowrap;
			}

			.min-con {
			color: #FF3636;
				white-space: nowrap;
				text {
					color: #FF3636;
				}
			}

			.search-details {
				position: relative;

				text {
					color: #67A8FC;
				}
			}

			.search-detail {
				// background-color: #000;
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 789;
			}
		}

		>view:last-child {
			margin-bottom: 0;
		}

	}

	.room-info {
		height: 228rpx;
		padding: 28rpx;
		margin-bottom: 48rpx;
		border: 2rpx solid #67A8FC;
		border-radius: 12rpx;

		>view {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20rpx;
			flex-wrap: nowrap;

			.min-cons {
				white-space: nowrap;
			}

			.min-con {
				color: #FF3636;
				white-space: nowrap;

				text {
					color: #FF3636;
				}
			}

			.search-details {
				position: relative;

				text {
					color: #67A8FC;
				}
			}

			.search-detail {
				// background-color: #000;
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 789;
			}
		}

		>view:last-child {
			margin-bottom: 0;
		}
	}
</style>

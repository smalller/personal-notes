<template>
	<view>
		<navBar :switchUrl="'../store'">商品列表</navBar>
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modalContent"
		 @confirm="resModalHandle"></u-modal>
		<view class="has-navBar">
			<view class="top-menu-wrap">
				<view class="add-goods" @click="addGoods">
					<view class="btn">添加商品</view>
				</view>
				<view class="type-choose-show" @click="chooseShowType">
					<view class="btn">展示商品</view>
				</view>
				<!-- 选择要给用户展示的商品分类弹窗 -->
				<u-popup v-model="showChooseType" mode="bottom">
					<view class="choose-show-type">
						<view class="top-title">
							<text>请选择需要展示的商品种类</text>
						</view>
						<view class="checkbox-wrap">
							<view v-for="(item, index) in goodsTypeList" :key="index" class="check">
								<u-checkbox v-model="item.hidden" label-size="32" :name="item.type">{{item.type | showAppGoodsType}}</u-checkbox>
							</view>
						</view>
						<view class="btn-wrap">
							<view class="btn cancel" @click="showChooseType = false">取消</view>
							<view class="btn" @click="handleSureShowType">确定</view>
						</view>
					</view>
				</u-popup>
				<view class="classify">
					<u-select v-model="showClassifyList" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true"
					 :list="classifyList" @confirm="resultClassify"></u-select>
					<view class="btn" @click="showClassifyList = true">
						<text>{{classifyName.label === undefined ? '分类' : classifyName.label}}</text>
					</view>
				</view>

			</view>
			<view class="goods-list-wrap">
				<view class="goods-list" v-for="(item,index) in goodsInfoList" :key="index">
					<view class="good-img">
						<image v-if="item.listPicture" :src="showImgPrefix + item.listPicture" mode=""></image>
					</view>
					<view class="good-info">
						<view class="good-name">
							<text>{{item.name}}</text>
						</view>
						<view class="good-price">
							<view class="now-price">
								售价：￥
								<text>{{item.presentPrice}}</text>
							</view>
							<view class="old-price">
								<text>￥{{item.originalPrice}}</text>
							</view>
						</view>
						<view class="handle-btn">
							<view class="btn edit" @click="editGood(item.id)">
								编辑
							</view>
							<view class="btn delete" @click="deleteGood(item.id)">
								删除
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- <view v-if="isShowNoMore" class="no-more">没有更多数据了</view> -->
		<view v-if="goodsInfoList.length === 0" class="empty-order"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showImgPrefix: this.$imgHead,

				modalShow: false, //模态框开关
				modalContent: '是否删除此商品', //模态框要展示的内容

				showChooseType: false, //选择要展示给用户的商品分类弹窗
				goodsTypeList: [], //该商家已有的商品种类列表


				//商品种类
				classifyList: [{
						value: '',
						label: '全部'
					},
					{
						value: '1',
						label: '套餐'
					},
					{
						value: '2',
						label: '威士忌'
					},
					{
						value: '3',
						label: '白兰地'
					},
					{
						value: '4',
						label: '伏特加'
					},
					{
						value: '5',
						label: '香槟'
					},
					{
						value: '6',
						label: '红酒'
					},
					{
						value: '7',
						label: '啤酒'
					},
					{
						value: '8',
						label: '鸡尾酒'
					},
					{
						value: '9',
						label: '小吃'
					},
					{
						value: '10',
						label: '其它'
					},
					{
						value: '11',
						label: '会员卡'
					},
					{
						label: '果酒',
						value: '12'
					},
					{
						label: '利口酒',
						value: '13'
					},
					{
						label: '朗姆酒',
						value: '14'
					},
					{
						label: '金酒',
						value: '15'
					},
					{
						label: '其他酒类',
						value: '16'
					},
					{
						label: '米酒',
						value: '17'
					}
				],
				goodId: '', //当前要操作的商品id
				goodsInfoList: [], //商品列表
				classifyName: {}, //当前选中的分类
				showClassifyList: false, //展示分类下拉框的开关

				currentPage: 1, //默认页码
				pagesize: 20, //默认每页要显示多少条数据
				isShowNoMore: false, //如果上拉触底没有更多数据，就展示没有更多数据了
				isOnReachBottom: false, //当前是否上拉触底
				isPllDown : false,	//是否下拉刷新
			}
		},

		onLoad() {
			this.getGoodsInfo();
		},
		
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				this.currentPage = 1;
				this.isPllDown = true;
				this.getGoodsInfo();
			},1000)
		},

		//上拉触底操作
		onReachBottom() {
			if (!this.isShowNoMore) {
				this.isOnReachBottom = true;
				this.currentPage++; //加载下一页
				this.getGoodsInfo();
				console.log("触底了", this.goodsInfoList)
			}
		},

		methods: {
			//选择要给用户展示的商品分类
			chooseShowType() {
				this.$get('/merchant/store/goods/hiddenList').then((res) => {
				    if (res.code === 0) {
				        this.showChooseType = true;
				        this.goodsTypeList = res.data;
				    }
				});
			},
			
			//要展示的商品分类弹窗中的确认按钮
			handleSureShowType() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				let data = {
					hiddenDTOS: this.goodsTypeList
				};
	
				this.$post('/merchant/store/goods/updateHidden', data).then((res) => {
					if (res.code === 0) {
						uni.showToast({
							title: "修改成功",
							duration: 1000,
							success: () => {
								this.showChooseType = false;
							}
						});
						
					}
				});
			},

			//获取商品列表
			async getGoodsInfo() {
				this.$showLoading();

				const data = {
					pageNo: this.currentPage,
					pageSize: this.pagesize,
					type: this.classifyName.value,
				}

				let res = await this.$post('/merchant/store/goods/goodsLimit', data);

				if (res.code === 0) {
					let list = [];
					
					//下拉刷新列表
					if(this.isPllDown) {
						this.goodsInfoList = res.data.list;
						this.isPllDown = false;
						uni.hideLoading();
						uni.stopPullDownRefresh();
						return
					}
					
					//判断是否已经上拉触底
					if (this.isOnReachBottom) {
						list = this.goodsInfoList.concat(res.data.list); //每次触底加载下一页数据时，就将新返回的数据拼接到商品列表数组中
					} else {
						list = res.data.list; //如果没有就正常返回
					}

					//如果没有更多数据，那么久显示没有更多数据
					if (res.data.list.length === 0) {
						this.$errToast('暂无更多数据');
						this.isShowNoMore = true;
					}
					
					this.goodsInfoList = list; //商品列表数据
					uni.hideLoading();
					console.log('xxxx', this.goodsInfoList)
				} else {
					this.$errToast(res.msg)
					setTimeout(() => {
						uni.hideLoading();
						uni.stopPullDownRefresh();
					}, 2000)
				}
			},

			//添加单品
			addGoods() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				uni.navigateTo({
					url: `addGoods/addGoods`
				})
			},

			//获取选择的商品分类
			resultClassify(res) {
				this.isShowNoMore = false; //关闭展示没有更多数据
				this.isOnReachBottom = false; //关闭上拉触底判断开关

				//获取当前选择的分类对象
				this.classifyName = res[0];

				this.currentPage = 1; //默认回到第一页
				this.getGoodsInfo();
			},

			//删除商品按钮
			deleteGood(id) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.goodId = id
				this.modalShow = true;
			},

			//初始化分页操作
			initPage() {
				this.isOnReachBottom = false;
				this.isShowNoMore = false;
				this.currentPage = 1;
			},

			//模态框的确定按钮（删除商品）
			resModalHandle(res) {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.$Delete(`/merchant/store/goods/deleteById/${this.goodId}`).then((res) => {
					if (res.code === 0) {
						this.initPage(); //初始化
						uni.showToast({
							title: "删除成功",
							duration: 1000,
							success: () => {
								setTimeout(() => {
									this.getGoodsInfo(); //重新请求数据
								}, 1000)
							}
						});
					}
				});
			},

			//编辑商品
			editGood(id) {
				uni.navigateTo({
					url: `goodsEdit/goodsEdit?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.no-more {
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 2rpx solid #ddd;
		padding: 12rpx 0;
	}

	.btn {
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 32rpx;
		font-weight: 400;
		border-radius: 16rpx;
	}

	.top-menu-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: 138rpx;
		padding: 28rpx 24rpx;
		background-color: #fff;
		box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.1);
		position: fixed;
		z-index: 99;

		.btn {
			width: 238rpx;
			height: 74rpx;
			background-color: rgba(103, 168, 252, 1);
		}

		.classify {
			position: relative;

			.btn {
				width: 162rpx;
				height: 74rpx;
				color: #000;
				border: 2rpx solid rgba(103, 168, 252, 1);
				background-color: #fff;
				position: relative;
			}

			.classify-list-wrap {
				display: none;
				position: absolute;
				top: 88rpx;
				width: 162rpx;
				background-color: #fff;
				border: 2rpx solid rgba(103, 168, 252, 1);
				border-radius: 16rpx;

				.classify-list {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 100%;
					height: 70rpx;
				}
			}
		}
	
		.choose-show-type {
			padding: 48rpx 116rpx 60rpx;
			
			.top-title {
				text-align: center;
				
				>text {
					font-size: 36rpx;
				}
			}
			
			.checkbox-wrap {
				margin: 48rpx 0 8rpx 0;
				display: flex;
				justify-content: space-between;
				flex-wrap:wrap;
				
				.check {
					width: 50%;
					margin-bottom: 48rpx;
				}
			}
			
			.btn-wrap {
				display: flex;
				justify-content: space-between;
				
				.btn {
					display: flex;
					justify-content: center;
					align-items: center;
					width: 216rpx;
					height: 76rpx;
				}
				
				.cancel {
					background-color: #fff;
					color: #000;
					border: 2rpx solid #67A8FC;
				}
			}
		}
	
	
	}

	.goods-list-wrap {
		// overflow-y: scroll;
		// overflow: hidden;
		// min-height: 100%;
		// height: auto;
		padding: 150rpx 24rpx 24rpx 24rpx;
		box-sizing: border-box;

		.goods-list {
			height: 224rpx;
			margin-bottom: 24rpx;
			display: flex;

			.good-img {
				min-width: 224rpx;
				height: 224rpx;
				margin-right: 40rpx;

				image {
					border-radius: 16rpx;
					width: 100%;
					height: 100%;
				}
			}

			.good-info {
				flex-grow: 1;
				font-size: 32rpx;
				font-weight: 400;

				.good-name {
					margin-bottom: 24rpx;
					text {
						display: -webkit-box;
						overflow: hidden;
						text-overflow: ellipsis;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}

				.good-price {
					display: flex;
					margin-bottom: 52rpx;
					font-size: 28rpx;
					
					// > view {
					// 	> text {
					// 		display: -webkit-box;
					// 		overflow: hidden;
					// 		text-overflow: ellipsis;
					// 		-webkit-line-clamp: 1;
					// 		-webkit-box-orient: vertical;
					// 	}
					// }

					.now-price {
						margin-right: 40rpx;
					}

					.old-price {

						text {
							text-decoration: line-through;
							color: rgba(153, 153, 153, 1);
						}

					}
				}

				.handle-btn {
					display: flex;


					.btn {
						width: 160rpx;
						height: 60rpx;
					}

					.edit {
						margin-right: 40rpx;
						color: #fff;
						background-color: rgba(154, 213, 255, 1);
					}

					.delete {
						color: #000;
						border: 2rpx solid rgba(154, 213, 255, 1);
					}
				}

			}
		}
	}

	.empty-order {
		width: 100%;
		height: 600rpx;
		background: url(../../../static/images/empty_data.png) no-repeat;
		background-size: 100%;
	}
</style>

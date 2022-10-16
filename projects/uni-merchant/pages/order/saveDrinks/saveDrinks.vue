<template>
	<view>
		<navBar :switchUrl="'../order'">存酒</navBar>
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modalContent"
		 @confirm="resModalHandle" @cancel="resCancelModal"></u-modal>
		<u-select v-model="showChooseDrinksShow" mode="single-column" :list="saveDrinksList" @confirm="resChooseDrinks"></u-select>
		<view class="has-navBar">
			<view class="drinks-box">
				<!-- 回显存酒 -->
				<view class="show-drinks-box" v-for="(item,index) in showSaveDrinksList" :key="index">
					<view>
						<text>商品</text>
						<view class="choose-drinks">{{item.goodsName || '请选择商品'}}</view>
					</view>
					<view>
						<text>剩余整数</text>
						<view>
							<u-number-box v-model="item.goodsNum" :min="0" :max="999" :input-width="100" :input-height="52"></u-number-box>
						</view>
					</view>
					<template v-if="item.isWine === true">
						<view>
							<text>剩余其他规格</text>
							<view @click="chooseShowOtherDrinksSpec(i.value,index)" :class="item.otherSku == i.value ? 'other-spec-btn-active' : 'other-spec-btn'"
							 v-for="(i,j) in saveDrinksOtherSpec" :key="j">{{i.label}}</view>
						</view>
						<view>
							<text></text>
							<view class="other-spec-input">
								<input v-model="item.otherSku" placeholder="自定义" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
					</template>
					<view>
						<text></text>
						<view class="add-drinks" @click="deleteSaveDrinks(item.goodsId, index)">
							删除
						</view>
					</view>
				</view>

				<!-- 添加存酒 -->
				<view class="add-drinks-box">
					<view>
						<text>商品</text>
						<view class="choose-drinks" @click="handleGetDrinks">{{saveDrinksObj.inventoryWineDTOS.goodsName || '请选择商品'}}</view>
					</view>
					<view v-if="saveDrinksObj.isWine !== ''">
						<text>剩余整数</text>
						<view>
							<u-number-box v-model="saveDrinksObj.inventoryWineDTOS.goodsNum" :min="0" :max="999" :input-width="100"
							 :input-height="52"></u-number-box>
						</view>
					</view>
					<template v-if="saveDrinksObj.isWine === true">
						<view>
							<text>剩余其他规格</text>
							<view @click="clickOtherSpecBtn(item.value)" :class="saveDrinksObj.inventoryWineDTOS.otherSku == item.value ? 'other-spec-btn-active' : 'other-spec-btn'"
							 v-for="(item,index) in saveDrinksOtherSpec" :key="index">{{item.label}}</view>
						</view>
						<view>
							<text></text>
							<view class="other-spec-input">
								<input v-model="saveDrinksObj.inventoryWineDTOS.otherSku" placeholder="自定义" placeholder-style="color:rgb(192, 196, 204)" />
							</view>
						</view>
					</template>
					<view>
						<text></text>
						<view class="add-drinks" @click="addSaveDrinks">
							添加
						</view>
					</view>
				</view>
			</view>
			<view class="save-date">
				<text>期限</text>
				<view>
					<input type="number" maxlength="3" v-model="allottedTime" />
				</view>
			</view>
		</view>
		<template v-if="$store.state.auth > 0 ">
			<view class="tab-handle">
				<view class="cancel" @click="handleCancel">
					<text>取消</text>
				</view>
				<view class="complete" @click="submitSaveDrinksInfo">
					<text>完成</text>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showChooseDrinksShow: false, //选择酒水框的展示标杆

				orderNo: '', //当前操作的订单号
				saveDrinksList: [], //可选择的存酒列表
				allottedTime: '', //存酒天数
				//新增存酒的参数
				saveDrinksObj: {
					isWine: '', //根据商品类型显示不同的规格
					deleteByIds: [], //要删除的酒id
					//存酒的相关数据
					inventoryWineDTOS: {
						goodsName: '',
						goodsId: '',
						goodsNum: 0,
						otherSku: ''
					}
				},
				judgeGoodsTypeGoodsList : [],	//根据商品类型显示不同规格的暂存数组
				goodsIdList: [], //已经选择的酒水列表里的酒水id
				showSaveDrinksList: [], //回显已经存的酒水列表
				checkOtherSpecStatus: true, //验证存酒里的其他规格是否合法
				//其他规格
				saveDrinksOtherSpec: [{
						label: '无',
						value: ''
					},
					{
						label: '1/2',
						value: '1/2'
					},
					{
						label: '1/3',
						value: '1/3'
					},
					{
						label: '1/4',
						value: '1/4'
					},
					{
						label: '1/5',
						value: '1/5'
					}
				],

				modalShow: false, //模态框开关
				modalContent: '', //模态框要展示的内容
			}
		},

		onLoad(option) {
			this.orderNo = option.id;
			this.handleSaveDrinks(this.orderNo);
		},

		methods: {
			//回显存酒列表
			handleSaveDrinks(orderNo) {
				this.$showLoading();
				let data = {
					orderNo
				};

				this.$post('/merchant/store/order/inventoryWineByUid', data).then((res) => {
					if (res.code === 0) {
						this.showSaveDrinksList = res.data;
						if (res.data.length !== 0) {
							this.allottedTime = this.showSaveDrinksList[0].allottedTime; //总的存酒日期
						} else {
							this.allottedTime = '';
						}
					} else {
						this.$errToast(res.msg);
					}
				}).finally(() => {
					uni.hideLoading()
				});
			},

			//请求酒水数据
			handleGetDrinks() {
				this.$showLoading();
				//将已经选择的酒水id回传给后台，避免下次选择会重复
				if (this.showSaveDrinksList.length !== 0) {
					this.showSaveDrinksList.forEach((item) => {
						const index = this.goodsIdList.indexOf(item.goodsId);
						if (index === -1) {
							this.goodsIdList.push(item.goodsId);
						}
					});
				}

				let data = {
					goodsIdList: this.goodsIdList,
					orderNo: this.orderNo
				};

				this.$post('/merchant/store/order/inventoryWineByOrderNo', data).then((res) => {
					if (res.code === 0) {
						if(res.data.length !== 0) {
							let flag = [];
							res.data.forEach(item => {
								let data = {
									value: item.goodsId,
									// label: item.goodsName + '（' + item.specName + '）',
									label: item.goodsName
								}
								flag.push(data);
							})
							this.saveDrinksList = flag;
							this.showChooseDrinksShow = true;
							this.judgeGoodsTypeGoodsList = res.data;
						} else {
							this.$errToast('暂无可选酒水');
						}
					} else {
						this.$errToast(res.msg);
					}
				}).finally(() => {
					uni.hideLoading();
				});
			},

			//选择的酒水信息
			resChooseDrinks(res) {
				this.saveDrinksObj.inventoryWineDTOS.goodsName = res[0].label;
				this.saveDrinksObj.inventoryWineDTOS.goodsId = res[0].value;

				//根据选择酒水类型来隐藏规格
				this.judgeGoodsTypeGoodsList.forEach((item) => {
					if (item.goodsId == this.saveDrinksObj.inventoryWineDTOS.goodsId) {
						this.saveDrinksObj.isWine = item.isWine;
					}
				});
			},

			//回显存酒里的规格选择
			chooseShowOtherDrinksSpec(item, index) {
				this.showSaveDrinksList[index].otherSku = item;
			},

			//点击其他规格按钮操作
			clickOtherSpecBtn(item) {
				this.saveDrinksObj.inventoryWineDTOS.otherSku = item;
			},

			//存酒确认操作
			handleSureSaveDrinks() {
				this.$showLoading();
				this.checkOtherSpecStatus = true;
				for (let i = 0; i < this.showSaveDrinksList.length; i++) {
					if (this.showSaveDrinksList[i].otherSku !== '') {
						if (!this.$scoreReg(this.showSaveDrinksList[i].otherSku)) {
							this.$errToast('请输入正确的规格格式，如：1/2');
							this.checkOtherSpecStatus = false;
							break;
						}
					} else {
						if (this.showSaveDrinksList[i].goodsNum == 0) {
							this.$errToast('请输入正确的瓶数或规格');
							this.checkOtherSpecStatus = false;
							break;
						}
					}
				}

				if (this.showSaveDrinksList.length !== 0 && this.allottedTime === '') {
					this.checkOtherSpecStatus = false;
					this.$errToast('请输入存酒期限');
				}

				if (this.checkOtherSpecStatus) {
					let data = {
						orderNo: this.orderNo,
						allottedTime: this.allottedTime,
						deleteByIds: this.saveDrinksObj.deleteByIds,
						inventoryWineDTOS: this.showSaveDrinksList
					};

					this.$post('/merchant/store/order/addInventoryWine', data).then((res) => {
						if (res.code === 0) {
							uni.hideLoading();
							uni.showToast({
								title: '保存成功',
								duration: 1000,
								success: () => {
									setTimeout(() => {
										uni.switchTab({
											url: '../order',
											success: () => {
												const obj = {
													origin: 'saveDrinksPage',
													orderStatus: ''
												}
												uni.$emit('orderStatus', obj);
											}
										});
									}, 1000)
								}
							});
						} else {
							this.$errToast(res.msg);
						}
					});
				}
			},

			//存酒界面的删除按钮操作
			deleteSaveDrinks(goodsId, index) {
				//将已经存在的酒水且要删除的酒水的id传入相关数组并从页面删除
				if ('id' in this.showSaveDrinksList[index]) {
					this.saveDrinksObj.deleteByIds.push(this.showSaveDrinksList[index].id);
				}
				this.showSaveDrinksList.splice(index, 1);

				//删除已经选择酒水列表里的酒水id
				const i = this.goodsIdList.indexOf(goodsId);
				if (i !== -1) {
					this.goodsIdList.splice(i, 1);
				}
			},
			
			//根据选择酒水类型来隐藏规格
			// judgeGoodsType() {
			// 	this.saveDrinksList.forEach((item) => {
			// 		if (item.goodsId == this.saveDrinksObj.inventoryWineDTOS.goodsId) {
			// 			this.saveDrinksObj.isWine = item.isWine;
			// 		}
			// 	});
			// },

			//存酒界面的添加按钮操作
			addSaveDrinks() {
				if (!this.saveDrinksObj.inventoryWineDTOS.goodsId) {
					this.$errToast('请选择商品');
					return;
				} else if (this.saveDrinksObj.inventoryWineDTOS.goodsNum == 0 && this.saveDrinksObj.inventoryWineDTOS.otherSku ==
					'') {
					this.$errToast('请输入正确的数量或规格');
				} else {
					let data = {
						goodsName: this.saveDrinksObj.inventoryWineDTOS.goodsName,
						goodsId: this.saveDrinksObj.inventoryWineDTOS.goodsId,
						goodsNum: this.saveDrinksObj.inventoryWineDTOS.goodsNum,
						otherSku: this.saveDrinksObj.inventoryWineDTOS.otherSku,
						isWine: this.saveDrinksObj.isWine
					};

					this.showSaveDrinksList.push(data);

					//清空添加存酒输入框
					this.saveDrinksObj.inventoryWineDTOS = {
						goodsName: '',
						goodsId: '',
						goodsNum: 0,
						otherSku: ''
					};
					this.saveDrinksObj.isWine = '';
				}
			},

			//确认编辑
			submitSaveDrinksInfo() {
				if (this.$store.state.auth < 1) {
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}

				this.modalContent = '是否保存当前页面';
				this.modalShow = true;
			},

			//取消编辑
			handleCancel() {
				this.modalContent = '是否放弃编辑当前页面';
				this.modalShow = true;
			},

			//模态框的确认按钮
			resModalHandle() {
				if (this.modalContent === '是否放弃编辑当前页面') {
					uni.switchTab({
						url: '../order'
					})
				} else {
					this.handleSureSaveDrinks();
				}
			},

			//模态框的取消按钮
			resCancelModal() {},
		}
	}
</script>

<style lang="scss" scoped>
	.has-navBar {
		padding: 136rpx 24rpx 96rpx;
	}

	.drinks-box {
		.add-drinks-box {
			margin-top: 36rpx;
		}

		.show-drinks-box {
			margin-bottom: 24rpx;
		}

		>view {
			border: 2rpx solid #67A8FC;
			border-radius: 16rpx;
			padding: 24rpx;

			>view {
				display: flex;
				align-items: center;
				margin-bottom: 36rpx;

				>text {
					font-size: 32rpx;
					font-weight: 400;
					text-align: right;
					min-width: 192rpx;
					margin-right: 24rpx;
				}
			}

			.choose-drinks {
				width: 100%;
				min-height: 64rpx;
				border: 2rpx solid #67A8FC;
				border-radius: 12rpx;
				box-sizing: border-box;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				padding-left: 24rpx;
				// white-space: nowrap;
				// overflow: hidden;
				// text-overflow: ellipsis;
			}

			.other-spec-btn,
			.other-spec-input {
				border: 1px solid #ccc;
				height: 64rpx;
				border-radius: 12rpx;
			}

			.other-spec-btn,
			.other-spec-btn-active {
				height: 64rpx;
				border-radius: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				margin-right: 12rpx;

				&:last-child {
					margin-right: 0;
				}
			}

			.other-spec-btn-active {
				color: #fff;
				background-color: #67a8fc;
			}

			.other-spec-input {
				width: 252rpx;
				line-height: 252rpx;
				display: flex;
				align-items: center;

				>input {
					padding-left: 24rpx;
				}
			}



			.add-drinks {
				width: 252rpx;
				height: 68rpx;
				background-color: #67a8fc;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 12rpx;
				font-size: 32rpx;
			}
		}
	}

	.save-date {
		display: flex;
		align-items: center;
		font-size: 32rpx;
		font-weight: 400;
		margin: 48rpx 0 96rpx 0;

		>text {
			margin-right: 24rpx;
		}

		>view {
			position: relative;
			display: flex;
			align-items: center;
			width: 252rpx;

			input {
				width: 100%;
				height: 64rpx;
				padding-left: 24rpx;
				border: 2rpx solid #67A8FC;
				border-radius: 12rpx;
				box-sizing: border-box;
			}

			&::after {
				display: block;
				content: "天";
				color: #fff;
				width: 52rpx;
				height: 64rpx;
				line-height: 64rpx;
				background-color: #67a8fc;
				text-align: center;
				position: absolute;
				border-radius: 0;
				border-top-right-radius: 12rpx;
				border-bottom-right-radius: 12rpx;
				top: 0;
				right: 0;
			}
		}
	}





















	.tab-handle {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 96rpx;
		z-index: 99;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.1);


		font-size: 32rpx;
		font-weight: 400;

		.cancel {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			background-color: #fff;
		}

		.complete {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			background-color: rgba(103, 168, 252, 1);

			text {
				color: #fff;
			}
		}
	}
</style>

<template>
	<view>
		<navBar :navigateUrl="'./myCoupons'">编辑优惠卷</navBar>
		<view class="has-navBar">
			<view class="header">
				<text @click="couponsCancel">取消</text>
				<text @click="couponsConfirm">确定</text>
			</view>
		</view>
		<block v-for="(item,index) in couponsArr" :key="index">
			<view class="message">
				<view class="top">优惠信息</view>
				<!-- <textarea maxlength="12" v-model="item.details" @input="texts"></textarea>
				<view class="count">
					<input type="text" v-model="num" disabled="true" class="count-inp" />
					<text>/12</text>
				</view> -->
			</view>
			<view class="discounts">
				<view class="discounts-one">
					<block v-if="!couponsFlag">
						<text>满</text>
						<view><input type="number" v-model="item.contentMoney" class="inp1" maxlength="6" /></view>
						<text v-if="!couponsFlag2">减</text>
						<text v-if="couponsFlag2">赠</text>
						<view style="width: 50%;">
							<input type="number" placeholder-style="color:#ccc"  v-model=" item.discountMoney" class="inp2" v-if="!couponsFlag2" maxlength="6"/>
							<input type="text" placeholder-style="color:#ccc"  v-model=" item.discountMoney" class="inp3" placeholder="自定义商品" v-if="couponsFlag2" />
						</view>
					</block>

					<block v-if="couponsFlag">
						<text>抵扣额度</text>
						<view><input type="number" placeholder-style="color:#ccc"  v-model="item.discountMoney" class="inp1" maxlength="6" /></view>
					</block>

				</view>
				<view class="discounts-two">
					<text>送</text>
					<view class="step">
						<text @click="changeNum('lose')">-</text>
						<input type="number" placeholder-style="color:#ccc"  v-model="item.sum" @input="changeInp" @blur="inpConfirm" maxlength="7"/>
						<text @click="changeNum('add')">+</text>
					</view>
					<text>张</text>
				</view>
				<view class="discounts-three">
					<text>使用期限</text>
					<input type="text" placeholder-style="color:#ccc"  value="" @click="showPopup1" disabled="true" v-model="item.beginTime"/>
					<text>至</text>
					<input type="text" placeholder-style="color:#ccc"  value="" @click="showPopup2" disabled="true" v-model="item.overTime" />
					<u-picker mode="time" v-model="popupShow1" :params="paramsTime" @confirm="timeCon1"></u-picker>
					<u-picker mode="time" v-model="popupShow2" :params="paramsTime" @confirm="timeCon2"></u-picker>
				</view>
				<view class="discounts-foue">
					<text>启用</text>
					<u-switch v-model="storeApplys" active-color="#FEE140" inactive-color="#fff" size="60" @change="change"></u-switch>
				</view>
			</view>
		</block>
		<!-- 遮罩层 -->
		<u-modal v-model="delshows" :content="delcontents" :show-cancel-button="true" @confirm="delConfirmUltimate"></u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				minDate: new Date(2020, 0, 1),
				// num: 7,
				presentValue: null,
				currentTime: null, //时间
				popupShow1: false, //弹出层
				popupShow2: false, //弹出层
				couponsArr: [], //请求数组存数组
				couponsFlag: true, //什么类产品
				current: 2, //tab
				storeApplys: true, //启用
				couponsFlag2: true,
				// couponsFlag:true,//
				paramsTime: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				delshows: false,
				delcontents:'确认保存已编辑优惠券吗?'
			}
		},
		onLoad(option) {
			// console.log(option)
			let data = option.data
			this.current = option.current
			console.log(data,this.current)
			if (this.current == 1) {
				this.couponsFlag2 = false
			} else if (this.current == 2) {
				this.couponsFlag2 = true
			}
			this.$get(`/merchant/store/coupon/getOneById/${data}`)
				.then(res => {
					console.log(res)
					uni.showLoading({
						title: '疯狂加载中',
					})
					// console.log(res)
					if (res.code == 0) {
						uni.hideLoading();
						this.couponsArr = [res.data]
						// this.num = this.couponsArr[0].details.length
						if (this.couponsArr[0].category == 1) {
							this.couponsFlag = true
						} else {
							this.couponsFlag = false
						}
						// console.log(this.couponsArr)
						if(this.current == 2){
							this.couponsArr[0].discountMoney = this.couponsArr[0].details.substring(this.couponsArr[0].details.indexOf('赠') +1)
						}
						this.couponsArr[0].storeApply = this.couponsArr[0].storeApply == 1 ? true : false;
						this.storeApplys = this.couponsArr[0].storeApply == 1 ? true : false
						this.couponsArr[0].beginTime = this.couponsArr[0].beginTime.substring(0, this.couponsArr[0].beginTime.indexOf(
							' '))
						this.couponsArr[0].overTime = this.couponsArr[0].overTime.substring(0, this.couponsArr[0].overTime.indexOf(' '))

					}
				})
			var date = new Date
			this.minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
		},
		methods: {
			// texts() {
			// 	this.num = this.couponsArr[0].details.length
			// 	// console.log(this.num)
			// },
			valChange(e) {
				// console.log('当前值为: ' + e.value)
			},
			// 加减
			changeNum(e) {
				if (e == 'lose') {
					if (this.couponsArr[0].sum <= 0) {
						this.couponsArr[0].sum = 0
						return
					}
					this.couponsArr[0].sum--

				} else {
					this.couponsArr[0].sum++
				}
			},
			// 输入框内容
			changeInp() {
				// console.log(parseFloat(parseInt(this.couponsArr[0].sum)))
				// let decimals = parseFloat(this.couponsArr[0].sum)
				let integer = parseInt(this.couponsArr[0].sum)
				if (this.$date.decimals(this.couponsArr[0].sum)) {
					this.couponsArr[0].sum = integer
					uni.showToast({
						title: '请输入整数',
						icon: 'none'
					})
				}
			},
			// 输入框完成
			inpConfirm() {
				this.presentValue = parseInt(this.presentValue)
			},
			// 弹出层
			showPopup1() {
				this.popupShow1 = true;
			},
			showPopup2() {
				this.popupShow2 = true;
			},
			// 时间确定
			timeCon1(e) {
				// console.log(e.getFullYear())
				var months = e.month
				var dates = e.day
				this.couponsArr[0].beginTime = e.year + '-' + months + '-' + dates
				this.popupShow1 = false;
			},
			timeCon2(e) {
				var months = e.month
				var dates = e.day
				this.couponsArr[0].overTime = e.year + '-' + months + '-' + dates
				this.popupShow2 = false;
			},
			// switch打开或者关闭时触发，值为true或者false
			// 即使不监听此事件，this.checked此时也会相应的变成true或者false
			change(status) {
				// console.log(status);
			},
			// 确定按钮
			couponsConfirm() {
				this.couponsArr[0].storeApply = this.storeApplys ? 1 : 0
				if (!this.couponsArr[0].beginTime) {
					uni.showToast({
						icon: 'none',
						title: '请选择使用期限'
					})
					return
				}
				if (!this.couponsArr[0].overTime) {
					uni.showToast({
						icon: 'none',
						title: '请选择使用期限'
					})
					return
				}
				const begingetTime = this.$date.timeStamp(this.couponsArr[0].beginTime);
				const overgetTime = this.$date.timeStamp(this.couponsArr[0].overTime);
				if (begingetTime > overgetTime) {
					uni.showToast({
						icon: 'none',
						title: '结束时间小于开始时间'
					})
					return
				}
				if (this.current == 0) {
					if (!this.couponsArr[0].discountMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入折扣额度'
						})
						return
					}
					if(this.$date.decimals(this.couponsArr[0].discountMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
				}
				if (this.current == 1) {
					if (!this.couponsArr[0].contentMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入满额度'
						})
						return
					}
					if (!this.couponsArr[0].discountMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入赠额度'
						})
						return
					}
					if(this.$date.decimals(this.couponsArr[0].contentMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
					if(this.$date.decimals(this.couponsArr[0].discountMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
					if(Number(this.couponsArr[0].contentMoney)<Number(this.couponsArr[0].discountMoney)){
						uni.showToast({
							icon: 'none',
							title: '折扣不合理'
						})
						return
					}
					this.couponsArr[0].details = '满' + this.couponsArr[0].contentMoney + '减' + this.couponsArr[0].discountMoney
				}
				if (this.current == 2) {
					if (!this.couponsArr[0].contentMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入满额度'
						})
						return
					}
					if (!this.couponsArr[0].discountMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入赠商品'
						})
						return
					}
					if(this.$date.decimals(this.couponsArr[0].contentMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
					this.couponsArr[0].details = '满' + this.couponsArr[0].contentMoney + '赠' + this.couponsArr[0].discountMoney
					this.couponsArr[0].discountMoney = 0;
				}
				this.delshows=true;
			},
			delConfirmUltimate(){
				let data = {
					apply: this.couponsArr[0].apply,
					beginTime: this.couponsArr[0].beginTime + ' ' + '00:00:00',
					category: this.couponsArr[0].category,
					contentMoney: this.couponsArr[0].contentMoney,
					details: this.couponsArr[0].details,
					discountMoney: this.couponsArr[0].discountMoney,
					grantTime: this.couponsArr[0].grantTime,
					overTime: this.couponsArr[0].overTime + ' ' + '00:00:00',
					remainder: this.couponsArr[0].remainder,
					sum: this.couponsArr[0].sum,
					id: this.couponsArr[0].id,
					storeApply: this.couponsArr[0].storeApply
				}
				this.$put('/merchant/store/coupon/update', data)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							uni.showToast({
								icon: "none",
								title: res.data
							})
							uni.navigateTo({
								url: `myCoupons?current=${this.current}`
							})
						} else {
							uni.showToast({
								icon: "none",
								title: res.msg
							})
						}
					})
			},
			// 遮罩取消
			shadeCacel() {
				this.shadeShow = false
			},
			// 取消按钮
			couponsCancel() {
				uni.redirectTo({
					url: './myCoupons'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header {
		display: flex;
		padding: 28rpx 24rpx;
		justify-content: space-between;
		box-sizing: border-box;
		box-shadow: 0 5rpx 5rpx 0 #f1f1f1;

		text {
			&:nth-child(1) {
				width: 344rpx;
				height: 74rpx;
				text-align: center;
				line-height: 74rpx;
				border: 1px solid #67A8FC;
				box-sizing: border-box;
				border-radius: 15rpx;
				font-size: 32rpx;
				display: inline-block;
			}

			&:nth-child(2) {
				width: 344rpx;
				height: 74rpx;
				text-align: center;
				line-height: 74rpx;
				background-color: #67A8FC;
				box-sizing: border-box;
				border-radius: 15rpx;
				font-size: 32rpx;
				display: inline-block;
				color: #fff;
			}
		}
	}

	.message {
		padding: 0 48rpx;
		position: relative;

		.top {
			font-size: 32rpx;
			font-weight: 600;
			margin: 18rpx 0 24rpx;
		}

		textarea {
			border: 1px solid #67A8FC;
			border-radius: 10rpx;
			height: 128rpx;
			width: 100%;
			padding: 24rpx 24rpx;
			box-sizing: border-box;
			font-size: 32rpx;
		}

		.count {
			font-size: 32rpx;
			color: #CCCCCC;
			display: flex;
			align-items: flex-start;
			position: absolute;
			bottom: 12rpx;
			right: 64rpx;

			.count-inp {
				width: 36rpx;
				display: inline-block;
				margin-top: 2rpx;
			}

			text {
				font-size: 32rpx;
				color: #CCCCCC;
				width: 46rpx;
			}
		}
	}

	.discounts {
		padding: 0 100rpx 0 48rpx;
		margin-top: 60rpx;

		.discounts-one {
			display: flex;
			align-items: center;

			text {
				font-size: 32rpx;
				font-weight: 600;

				&:nth-child(3) {
					margin-left: 24rpx;
				}
			}

			view {
				.inp1 {
					padding: 6rpx 10rpx;
					width: 100%;
					height: 100%;
					text-align: center;
					box-sizing: border-box;
				}

				&:nth-child(2) {
					width: 196rpx;
					height: 56rpx;
					border: 1px solid #67A8FC;
					border-radius: 14rpx;
					display: flex;
					box-sizing: border-box;
					margin-left: 26rpx;

					&::before {
						content: "￥";
						width: 76rpx;
						height: 54rpx;
						background-color: #67A8FC;
						color: #fff;
						border-radius: 12rpx 0 0 12rpx;
						text-align: center;
						line-height: 56rpx;
					}
				}

				.inp2 {
					padding: 6rpx 10rpx;
					width: 100%;
					height: 100%;
					text-align: center;
				}

				&:nth-child(4) {
					width: 196rpx;
					height: 56rpx;
					border: 1px solid #67A8FC;
					border-radius: 14rpx;
					display: flex;
					box-sizing: border-box;
					margin-left: 26rpx;

					&::before {
						content: "￥";
						width: 76rpx;
						height: 54rpx;
						background-color: #67A8FC;
						color: #fff;
						border-radius: 12rpx 0 0 12rpx;
						text-align: center;
						line-height: 56rpx;
					}
				}

				.inp3 {
					padding: 6rpx 10rpx;
					width: 100%;
					height: 100%;
					font-size: 32rpx;
				}
			}
		}

		.discounts-two {
			display: flex;
			align-items: center;
			margin-top: 40rpx;

			text {
				font-size: 32rpx;
				font-weight: 600;

				&:nth-child(1) {
					margin-right: 24rpx;
				}

				&:nth-child(3) {
					margin-left: 24rpx;
				}
			}

			.step {
				display: flex;

				text {
					display: inline-block;
					text-align: center;
					line-height: 44rpx;
					width: 52rpx;
					height: 52rpx;
					border-radius: 10rpx;
					font-size: 40rpx;
					font-weight: 400;
					color: #ccc;
					background-color: #fff;
					border: 1px solid #ccc;
				}

				input {
					width: 148rpx;
					height: 56rpx;
					border-radius: 15rpx;
					border: 1px solid #67A8FC;
					text-align: center;
					font-size: 32rpx;
				}
			}
		}

		.discounts-three {
			width: 100%;
			display: flex;
			align-items: center;
			margin-top: 40rpx;

			input {
				width: 190rpx;
				height: 56rpx;
				border: 1px solid #67A8fc;
				border-radius: 10rpx;
				text-align: center;
			}

			text {
				&:nth-child(1) {
					margin-right: 24rpx;
				}

				&:nth-child(3) {
					margin: 0 16rpx 0 16rpx;
				}

				font-size: 32rpx;
				font-weight: 600;
			}
		}

		.discounts-foue {
			display: flex;
			align-items: center;
			margin-top: 40rpx;

			text {
				font-size: 32rpx;
				font-weight: 600;
				margin-right: 24rpx;
			}
		}
	}
</style>

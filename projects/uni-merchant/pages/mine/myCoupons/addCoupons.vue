<template>
	<view>
		<navBar v-if="idFlag1" :navigateUrl="'./myCoupons'">新增抵扣卷</navBar>
		<navBar v-if="idFlag2" :navigateUrl="'./myCoupons'">新增满减卷</navBar>
		<navBar v-if="idFlag3" :navigateUrl="'./myCoupons'">新增消费礼卷</navBar>
		<view class="has-navBar">
			<view class="header">
				<text @click="couponsCancel">取消</text>
				<text @click="couponsConfirm">确定</text>
			</view>
		</view>
		<block v-for="(item,index) in deductionArr" :key="index">
			<view class="message">
				<view class="top">优惠信息</view>
			</view>
			<view class="discounts">
				<view class="discounts-one" v-if="idFlag1">
					<text>折扣额度</text>
					<view><input type="number" placeholder-style="color:#ccc" v-model="item.discountMoney" class="inp1" maxlength="6" @blur="changediscount"/></view>
				</view>
				<view class="discounts-one" v-if="idFlag2">
					<text>满</text>
					<view><input type="number" placeholder-style="color:#ccc" v-model="item.contentMoney" class="inp1" maxlength="6"  @blur="changediscount"/></view>
					<text>减</text>
					<view><input type="number" placeholder-style="color:#ccc" v-model="item.discountMoney" class="inp2"  @blur="changediscount" maxlength="6"/></view>
				</view>
				<view class="discounts-one" v-if="idFlag3">
					<text>满</text>
					<view><input type="number" placeholder-style="color:#ccc" v-model="item.contentMoney" class="inp1" maxlength="6"
						 style="width: 70px;" /></view>
					赠
					<view style="width: 150%;"><input type="text" placeholder-style="color:#ccc" v-model="item.discountMoney" class="inp3"
						 placeholder="自定义商品" /></view>
				</view>

				<view class="discounts-two">
					<text>送</text>
					<view class="step">
						<text @click="changeNum('lose')">-</text>
						<input type="number" placeholder-style="color:#ccc" v-model="item.sum" @input="changeInp" @blur="inpConfirm" maxlength="7"/>
						<text @click="changeNum('add')">+</text>
					</view>
					<text>张</text>
				</view>
				<view class="discounts-three">
					<text>使用期限</text>
					<input type="text" placeholder-style="color:#ccc" value="" @click="showPopup1" disabled="true" v-model="item.beginTime" />
					<text>至</text>
					<input type="text" placeholder-style="color:#ccc" value="" @click="showPopup2" disabled="true" v-model="item.overTime" />
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
				// num: 0,
				bestow: null, //赠
				currentTime: null, //时间
				popupShow1: false, //弹出层
				popupShow2: false, //弹出层
				enableChecked: true, //启用
				current: null, //tab
				idFlag1: true, //0:抵扣卷；1：赠额卷；2：消费礼卷
				idFlag2: true,
				idFlag3: true,
				deductionArr: [{
					// "apply": 0, //启用标记 1启用 0禁用
					"beginTime": "", //开始时间
					"category": 1, //优惠券类型：1-抵扣券 2-满减券 3-消费礼券
					"contentMoney": 0, //消费满金额
					"details": "", //优惠详情
					"discountMoney": null, //优惠金额
					"grantTime": "2020-12-10", //截至发放时间
					"id": "",
					"overTime": "", //结束时间
					"remainder": 0, //剩余数量
					"source": 0, //优惠券来源 :0-商家 1-App平台
					"storeApply": true, //商家启用标记 1启用 0禁用
					"sum": 1 //优惠券总数
				}],
				paramsTime: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				storeApplys: true, //启用
				delshows: false,
				delcontents:'确认保存已编辑优惠券吗?'
			}
		},
		onLoad(id) {
			this.current = id.title
			switch (id.title) {
				case "0":
					this.idFlag1 = true;
					this.idFlag2 = false;
					this.idFlag3 = false;
					break;
				case "1":
					this.idFlag1 = false;
					this.idFlag2 = true;
					this.idFlag3 = false;
					break;
				case "2":
					this.idFlag1 = false;
					this.idFlag2 = false;
					this.idFlag3 = true;
			}
			var date = new Date
			this.minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
			this.deductionArr[0].category = Number(id.title) + 1
		},
		methods: {
			// texts() {
			// 	this.num = this.deductionArr[0].details.length
			// },
			valChange(e) {
				// console.log('当前值为: ' + e.value)
			},
			// 加减
			changeNum(e) {
				if (e == 'lose') {
					if (this.deductionArr[0].sum <= 0) {
						this.deductionArr[0].sum = 0
						return
					}
					this.deductionArr[0].sum--

				} else {
					this.deductionArr[0].sum++
				}
			},
			// 输入框内容
			changeInp() {
				// console.log(parseFloat(parseInt(this.deductionArr[0].sum)))
				// let decimals = parseFloat(this.deductionArr[0].sum)
				let integer = parseInt(this.deductionArr[0].sum)
				if (this.$date.decimals(this.deductionArr[0].sum)) {
					this.deductionArr[0].sum = integer
					uni.showToast({
						title: '请输入整数',
						icon: 'none'
					})
				}
			},
			// 输入框完成
			inpConfirm() {
				this.deductionArr[0].sum = parseInt(this.deductionArr[0].sum)
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
				var months = e.month
				var dates = e.day
				this.deductionArr[Symbol.iterator]().next().value.beginTime = e.year + '-' + months + '-' + dates
				this.popupShow1 = false;
				console.log(this.deductionArr[Symbol.iterator]().next().value)
			},
			timeCon2(e) {
				var months = e.month
				var dates = e.day
				this.deductionArr[Symbol.iterator]().next().value.overTime = e.year + '-' + months + '-' + dates
				this.deductionArr[Symbol.iterator]().next().value.grantTime = this.deductionArr[Symbol.iterator]().next().value.overTime
				this.popupShow2 = false;
			},
			// switch打开或者关闭时触发，值为true或者false
			// 即使不监听此事件，this.checked此时也会相应的变成true或者false
			change(status) {
				// console.log(status);
			},
			// 确定按钮
			couponsConfirm() {
				// console.log(this.current)
				let introductionArr = this.deductionArr[Symbol.iterator]().next().value
				introductionArr.storeApply = this.storeApplys ? 1 : 0;
				if(this.current==1){
					introductionArr.details = '满' + introductionArr.contentMoney + '减' + introductionArr.discountMoney
				}else if(this.current==2){
					introductionArr.details = '满' + introductionArr.contentMoney + '赠' + introductionArr.discountMoney
				}
				

				if (!introductionArr.beginTime) {
					uni.showToast({
						icon: 'none',
						title: '请选择使用期限'
					})
					return
				}
				if (!introductionArr.overTime) {
					uni.showToast({
						icon: 'none',
						title: '请选择使用期限'
					})
					return
				}
				const begingetTime = this.$date.timeStamp(introductionArr.beginTime);
				const overgetTime = this.$date.timeStamp(introductionArr.overTime);
				if (begingetTime > overgetTime) {
					uni.showToast({
						icon: 'none',
						title: '结束时间小于开始时间'
					})
					return
				}
				if (this.current == 0) {
					if (!introductionArr.discountMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入折扣额度'
						})
						return
					}else{
						introductionArr.details = '直接抵扣'+introductionArr.discountMoney+'元'
					}
					if(this.$date.decimals(introductionArr.discountMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
					
				}
				if (this.current == 1) {
					if (!introductionArr.contentMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入满额度'
						})
						return
					}
					if (!introductionArr.discountMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入赠额度'
						})
						return
					}
					if(this.$date.decimals(introductionArr.contentMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
					if(this.$date.decimals(introductionArr.discountMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
						return
					}
					if(Number(introductionArr.contentMoney)<Number(introductionArr.discountMoney)){
						uni.showToast({
							icon: 'none',
							title: '折扣不合理'
						})
						return
					}
				}
				if (this.current == 2) {
					if (!introductionArr.contentMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入满额度'
						})
						return
					}
					if (!introductionArr.discountMoney) {
						uni.showToast({
							icon: 'none',
							title: '请输入赠商品'
						})
						return
					}
					if(this.$date.decimals(introductionArr.contentMoney)){
						uni.showToast({
							icon: 'none',
							title: '请输入整数'
						})
					
						return
					}
					introductionArr.discountMoney = 0
				}
				// console.log(11)
				this.delshows=true;
			},
			delConfirmUltimate(){
				let data = JSON.parse(JSON.stringify(this.deductionArr));
				data[0].beginTime = data[0].beginTime + ' ' + '00:00:00';
				data[0].overTime = data[0].overTime + ' ' + '00:00:00';
				data[0].remainder = data[0].sum
				console.log(data)
				this.$arr_post('/merchant/store/coupon/save', data)
					.then(res => {
						uni.showLoading({
							title: '保存中'
						})
						if (res.code == 0) {
							uni.hideLoading()
							uni.navigateTo({
								url: `myCoupons?current=${this.current}`
							})
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}
						// console.log(res)
					})
			},
			// 取消按钮
			couponsCancel() {
				uni.redirectTo({
					url: './myCoupons'
				})
			},
			// 遮罩取消
			shadeCacel() {
				this.shadeShow = false
			},
			// 不能是小数
			changediscount(e){
				if(this.$date.decimals(e.detail.value)){
					uni.showToast({
						icon: 'none',
						title: '请输入整数'
					})
				}
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

			// .count-inp {
			// 	width: 36rpx;
			// 	display: inline-block;
			// 	margin-top: 2rpx;
			// }

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
			width: 105%;
			font-size: 32rpx;
			font-weight: 600;

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
					font-size: 32rpx;
					font-weight: 400
				}

				&:nth-child(2) {
					width: 196rpx;
					height: 56rpx;
					border: 1px solid #67A8FC;
					border-radius: 14rpx;
					display: flex;
					box-sizing: border-box;
					margin: 0 24rpx 0 26rpx;

					&::before {
						content: "￥";
						width: 66rpx;
						height: 54rpx;
						background-color: #67A8FC;
						color: #fff;
						border-radius: 12rpx 0 0 12rpx;
						text-align: center;
						line-height: 56rpx;
						box-sizing: border-box;
					}
				}

				.inp2 {
					padding: 6rpx 10rpx;
					width: 100%;
					height: 100%;
					text-align: center;
					font-size: 32rpx;
					font-weight: 400
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
					border: 1px solid #67A8FC;
					margin-left: 24rpx;
					font-weight: 400;
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
			// width: 100%;
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

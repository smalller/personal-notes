<template>
	<view class="payresult" v-if="result===1||result===0">
		<view class="topimg">
			<view class="topcolor"></view>
			<image
				src="https://mycpcdn.maihuominiapps.com/tmp/wx6b7cdce2dc3ddd98.o6zAJs5w_znmMqhienY8MPXGuqo4.DCJYQNed5uLL30a10d28b3f1f3609a00cc25489e7512.png"
				class="sucessimg"
				v-if="result==1"
			></image>
			<image
				src="https://mycpcdn.maihuominiapps.com/tmp/wx6b7cdce2dc3ddd98.o6zAJs5w_znmMqhienY8MPXGuqo4.m0pzz60tunps00cc1a78788e47e2077c5a1402957a63.png"
				class="failimg"
				v-if="result==0"
			></image>
			<view class="zhifusucess" v-if="result==1">
				<view class="zhifutishi">支付成功</view>
				<view class="zhifumoney">￥{{ app_pay.amount }}</view>
				<view class="zhifuinfo">支付方式：微信支付</view>
			</view>
			<view class="zhifutishi zhifufai" v-if="result==0">支付失败</view>
		</view>
		<button
			class="backhome btn"
			style="border:0;background-color:#fff;font-size:34rpx;padding:0 0;line-height:88rpx;"
			open-type="launchApp"
			:app-parameter="result"
			binderror="launchAppError"
		>
			返回APP
		</button>
		<view class="titinfo">
			<view class="tishi">
				<image src="/img/wxts@2x.png"></image>
				温馨提示
			</view>
			<view class="tishiyu">平台不会以订单异常、系统升级为由要求您点击任何网址链接进行退款操作。谨防上当受骗！</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			app_pay: {},
			wchat_code: '',
			open_id: '',
			result: ''
		};
	},

	onLoad(options) {
		//#ifdef MP-WEIXIN

		if (options.token == undefined) {
			wx.redirectTo({
				url: ''
			});
		} else {
			const _this = this;
			wx.showLoading({
				title: '支付中'
			});
			wx.setStorage({
				key: 'accesstoken',
				data: options.token,
				success: function() {
					wx.login({
						success(res) {
							if (res.code) {
								let wchat_code = res.code;
								_this.app_pay = options;
								_this.wchat_code = res.code;
								uni.request({
									url: uni.getStorageSync('baseUrl')+'/pays/paycert/unAccess/getOpenId?type=mini&code=' + res.code,
									method: 'GET',
									header: {
										// token: options.token,
										// userId: options.userId,
										firmId: 'zdyjb'
									},
									success(resDatas) {
										_this.open_id = resDatas.data.data.openid;

										if (!!_this.open_id) {
											wx.showModal({
												title: '订单信息openid',
												showCancel: false,
												content: options.is_order,
												success(res) {}
											});
											if (options.is_order == 1) {
												_this.orderPayoff(options);
											} else {
												_this.payoff(options);
											}
										}
									},
									fail(err) {
										uni.showModal({
											content: JSON.stringify(err)
										});
									}
								});
							}
						}
					});
				}
			});
		}

		//#endif
	},
	methods: {
		payoff() {
			const _this = this;
			let payurl = uni.getStorageSync('baseUrl')+'/pays/pay/payUrl';

			let sdata = {
				// wchat_code: this.data.wchat_code,
				// queue_id: this.data.app_pay.queue_id,
				// pay_way: 20,
				// goods_title: this.data.app_pay.goods_title
				amount: this.app_pay.amount,
				//amount: 0.01,
				body: 'body',
				openId: _this.open_id,
				orderDesc: this.app_pay.orderDesc,
				orderId: this.app_pay.orderId,
				// orderId: "0b93b6dadecf4570b90503adf9ad611c",
				payGatewayType: 'YOP',
				payTradeType: 'MINI_PROGRAM'
			};

			wx.request({
				url: payurl,
				data: sdata,
				method: 'POST',
				header: {
					'content-type': 'application/json',
					token: this.app_pay.token,
					userId: this.app_pay.userId,
					firmId: 'zdyjb'
				},
				success(ress) {
					
					if (+ress.data.code === 0) {
						const extraMsg = ress.data.data.extraMsg
						console.log(extraMsg, '22222333');
						wx.requestPayment({
							timeStamp: extraMsg.timeStamp,
							nonceStr: extraMsg.nonceStr,
							package: extraMsg.package,
							signType: extraMsg.signType,
							paySign: extraMsg.paySign,
							success(res) {
								wx.setNavigationBarTitle({
									title: '支付成功'
								});
								_this.result = 1;
								_this.test = JSON.stringify(res);
							},
							fail(res) {
								wx.setNavigationBarTitle({
									title: '支付失败'
								});
								_this.result = 0;
							}
						});
					} else if (ress.data === 'refresh') {
						wx.setNavigationBarTitle({
							title: '支付失败'
						});
						_this.result = 0;
					} else {
						wx.showModal({
							title: '提示',
							showCancel: false,
							content: ress.data.message,
							success(res) {
								if (res.confirm) {
									wx.setNavigationBarTitle({
										title: '支付失败'
									});
									_this.result = 0;
								} else if (res.data.cancel) {
									wx.setNavigationBarTitle({
										title: '取消支付'
									});
									_this.result = 0;
								}
							}
						});
					}
					wx.hideLoading();
				}
			});
		},
		orderPayoff() {
			var _this = this;
			var url = '/v1/mine-order/order-re-payment';
			var dat = {
				wchat_code: _this.wchat_code,
				order_id: _this.app_pay.order_id,
				pay_way: 20
			};

			wx.request({
				url: url,
				method: 'post',
				data: dat,
				success(res) {
					if (res.data.timeStamp) {
						wx.requestPayment({
							timeStamp: res.data.timeStamp,
							nonceStr: res.data.nonceStr,
							package: res.data.package,
							signType: res.data.signType,
							paySign: res.data.paySign,
							success(res) {
								_this.result = 1;
								wx.setNavigationBarTitle({
									title: '支付成功'
								});
							},
							fail(res) {
								_this.result = 0;
								wx.setNavigationBarTitle({
									title: '支付失败'
								});
							}
						});
					} else if (res.code == 200) {
						// _this.setlist('pay', e.currentTarget.dataset.id, e.currentTarget.dataset.status)
					} else {
						wx.showToast({
							icon: 'none',
							title: res.message
						});
					}
					wx.hideLoading();
				}
			});
		}
	}
};
</script>

<style>
.topimg,
.topimg image {
	position: relative;
	width: 100%;
	z-index: 30;
}

.topimg .sucessimg {
	height: 566rpx;
}

.topimg .failimg {
	height: 414rpx;
}

.topcolor {
	position: absolute;
	left: 0;
	height: 100rpx;
	width: 100%;
	background: #5ec6c2;
	top: 0;
}

button {
	line-height: 88rpx !important;
	padding: 0;
}

.payresult .btn {
	width: 560rpx;
	height: 88rpx;
	background: linear-gradient(90deg, #8adfd6, #5ec6c2);
	border-radius: 44rpx;
	text-align: center;
	margin: 0 auto 20rpx;
	color: #fff;
}

.payresult .lookorder {
	color: #5ec6c2;
	border: 1px solid #5ec6c2;
	background: #f5f5f5;
}

.zhifuinfo {
	font-size: 28rpx;
	/* margin: 45rpx auto; */
	text-align: center;
	color: #999;
	position: relative;
	z-index: 30;
	top: -149rpx;
	background-blend-mode: multiply;
}

.titinfo {
	width: 671rpx;
	margin: 60rpx auto 0;
}

.titinfo .tishi {
	color: #5ec6c2;
	font-size: 32rpx;
}

.titinfo .tishi image {
	width: 28rpx;
	height: 28rpx;
	margin-right: 10rpx;
}

.tishiyu {
	font-size: 28rpx;
	color: #9a9a9a;
}

.zhifutishi {
	position: absolute;
	left: 0;
	right: 0;
	margin: auto;
	top: 282rpx;
	text-align: center;
	z-index: 100;
	font-size: 34rpx;
	color: #343434;
}

.zhifumoney {
	position: absolute;
	top: 328rpx;
	left: 0;
	right: 0;
	margin: auto;
	font-weight: bold;
	text-align: center;
	z-index: 100;
	font-size: 48rpx;
	color: #343434;
}
</style>

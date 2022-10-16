<template>
	<view class="homepage">
		<!-- <button @click="handle">编辑商铺信息</button> -->
		<view class="main">
			<view class="header" v-if="shopFlag">
				<view class="">
					<view class="title">{{ name }}</view>
					<view class="score">
						<text>店铺评分</text>
						<view class="star">
							<view class="mask star-wrap">
								<view v-for="(item, index) in xing1" :key="index">
									<image src="../../static/imgs/xing.png" mode=""></image>
								</view>
							</view>
							<view class="mask star-wrap">
								<view v-if="xing3">
									<image src="../../static/imgs/banxing.png" mode=""></image>
								</view>
							</view>

							<view class="bottom star-wrap">
								<view v-for="(item, index) in xing2" :key="index">
									<image src="../../static/imgs/xing_1.png" mode=""></image>
								</view>
							</view>
						</view>
						<text>{{ star }}</text>
					</view>
				</view>
				<view :class="[!doDusinessFlag ? 'businesss' : 'business']">
					<view v-if="doDusinessFlag">营业中</view>
					<view v-if="!doDusinessFlag">已打烊</view>
				</view>
			</view>
			<view class="turnover" @click="goProfit()">
				<view class="left">
					<text class="to_text">今日营业额</text><br />
					<text class="pic_text">{{ turnover | returnFloat }}</text>
				</view>
				<view class="right">
					<text class="to_text">今日有效订单</text><br />
					<text class="pic_text">{{ reserveTableTimes }}</text>
					<text class="to_text">单</text>
				</view>
			</view>
			<view class="middle">
				<view class="m_img" @click="goStagenum(0)">
					<text>开台数量</text>
					<image src="../../static/imgs/2.png" />
				</view>
				<view class="m_img" @click="goStagenum(1)">
					<text>酒水销量</text>
					<image src="../../static/imgs/1.png" />
				</view>
				<view class="m_img" @click="goStagenum(2)">
					<text>男女比例</text>
					<image src="../../static/imgs/3.png" />
				</view>
				<view class="m_img" @click="goStagenum(3)">
					<text>年龄分布</text>
					<image src="../../static/imgs/4.png" />
				</view>
			</view>
			<view class="btm">
				<view class="b_img" @click="goStage()">
					<text>店铺管理</text>
					<image src="../../static/imgs/t1.png" />
				</view>
				<view class="b_img" @click="goMessage(storeLocation)">
					<text v-if="storeLocation!=3">座位管理</text>
					<text v-if="storeLocation==3">包间管理</text>
					<image src="../../static/imgs/t2.png" />
				</view>
				<view class="b_img" @click="goManage()">
					<text>商品管理</text>
					<image src="../../static/imgs/t3.png" />
				</view>
				<view class="b_img" @click="goEvaluate()">
					<text>顾客评价</text>
					<image src="../../static/imgs/t4.png" />
				</view>
			</view>
		</view>
		<view class="bg" v-if="!loadingOk" @click="loadingAgain"></view>
	</view>
</template>

<script>
	import Vue from "vue";
	import RongIMLib from "../../common/js/RongIMLib-3.0.7.1-dev.js";
	import {
		connectRongIM,
		getConversationList,
	} from "../../common/js/conversation.js";

	// //客户端初始化
	var config = {
		appkey: Vue.prototype.$appkey,
	};
	var im = RongIMLib.init(config);

	export default {
		data() {
			return {
				starWidth: "",
				star: 0,
				xing1: null, //黄星
				xing2: null, //灰星
				xing3: false, //半星
				id: null,
				storeLocation: null,
				turnover: 0,
				name: "",
				widthFlag: false,
				reserveTableTimes: 0,
				shopFlag: true,
				doDusinessFlag: true, //是否营业
				imgHead: this.$imgHead,
				loadingOk: false, //是否加载完成
				clickFlag: true, //bg是否可点
				converClientList: [], //客户对话列表
				resultUserInfo: [], //返回的用户基本信息
			};
		},

		onLoad() {
			const rongToken = uni.getStorageSync("uni-userInfo") ?
				JSON.parse(uni.getStorageSync("uni-userInfo")).rongToken :
				"";
			if (rongToken) {
				//链接服务器
				connectRongIM()
					.then((res) => {
						//客户端开始监听服务端消息
						this.watchConversation();
					})
					.catch((err) => {
						console.log(err);
					});
			}
			this.getStoreInfo();
		},

		onPullDownRefresh() {
			this.getStoreInfo();
		},
		methods: {
			changeZero(specificTime) {
				if (specificTime < 10) {
					specificTime = "0" + specificTime;
				}
				return specificTime;
			},
			async getStoreInfo() {
				uni.showLoading({
					title: '数据加载中...'
				})
				const res = await this.$get("/merchant/store/getStoreBasic");
				var date = new Date();
				if (res.code === 0) {
					uni.hideLoading()
					this.id = res.data.id;
					this.name = res.data.name;
					this.storeLocation = res.data.storeLocation;
					let month = date.getMonth() + 1;
					let day = date.getDate();
					month = this.changeZero(month);
					day = this.changeZero(day);
					var localDates = date.getFullYear() + "-" + month + "-" + day;
					// console.log(localDates)
					let data = {
						localDate: localDates,
						sid: this.id,
						type: 1,
					};
					this.$nextTick(() => {
						this.star = res.data.score == "" ? 0 : res.data.score;
						this.xing1 = Math.floor(this.star);
						this.xing2 = Math.floor(5 - this.star);
						if (this.xing1 + this.xing2 != 5) {
							this.xing3 = true;
						} else {
							this.xing3 = false;
							this.star = this.star;
						}
						if (String(this.star).length == 1) {
							this.star = this.star + '.0'
						}
					});
					this.loadingOk = true
					let hour = date.getHours();
					let minute = date.getMinutes();
					this.changeZero(hour);
					this.changeZero(minute);
					let startTimeHour = res.data.startTime.substring(
						0,
						res.data.startTime.indexOf(":")
					);
					startTimeHour = startTimeHour == "00" ? "24" : startTimeHour;
					let startTimeMinute = res.data.startTime.substring(
						res.data.startTime.indexOf(":") + 1,
						res.data.startTime.length
					);
					let endTimeHour = res.data.endTime.substring(
						0,
						res.data.endTime.indexOf(":")
					);
					endTimeHour = endTimeHour == "00" ? "24" : endTimeHour;
					let endTimeMinute = res.data.endTime.substring(
						res.data.endTime.indexOf(":") + 1,
						res.data.endTime.length
					);
					if (endTimeHour - startTimeHour > 0) {
						if (hour > startTimeHour && hour < endTimeHour) {
							this.doDusinessFlag = true;
						} else {
							this.doDusinessFlag = false;
						}
						if (hour == startTimeHour) {
							if (startTimeMinute <= minute) {
								this.doDusinessFlag = true;
							} else {
								this.doDusinessFlag = false;
							}
						}
						if (hour == endTimeHour) {
							if (endTimeMinute >= minute) {
								this.doDusinessFlag = true;
							} else {
								this.doDusinessFlag = false;
							}
						}
					} else if (endTimeHour - startTimeHour == 0) {
						if (startTimeMinute <= minute && endTimeMinute >= minute) {
							this.doDusinessFlag = true;
						} else {
							this.doDusinessFlag = false;
						}
					}
					//第二天
					else if (endTimeHour - startTimeHour < 0) {
						if (hour > startTimeHour || hour < Number(endTimeHour)) {
							this.doDusinessFlag = true;
						} else if (hour == startTimeHour) {
							if (startTimeMinute <= minute) {
								this.doDusinessFlag = true;
							} else {
								this.doDusinessFlag = false;
							}
						} else if (hour == endTimeHour) {
							if (endTimeMinute >= minute) {
								this.doDusinessFlag = true;
							} else {
								this.doDusinessFlag = false;
							}
						} else {
							this.doDusinessFlag = false;
						}
					}
					const onLineType = await this.$get(
						"/merchant/store/settled/applyOnlineType"
					);
					if (this.doDusinessFlag) {
						if (onLineType.code == 0) {
							this.doDusinessFlag = onLineType.data.type == 1 ? true : false;
						}
					}
					uni.stopPullDownRefresh();
				} else if (res.code === 600) {
					uni.navigateTo({
						url: "/pages/store/storeManage/storeManage",
					});
					uni.hideLoading()
					return;
				} else {
					this.shopFlag = false;
					// this.$errToast(res.msg)
					this.loadingOk = false;
					this.clickFlag = false;
					uni.hideLoading()
					return;
				}
				// console.log(date.getDate())
				const appSeatByDays = await this.$post(
					"/merchant/store/getAppSeatByDay", {
						localDate: localDates,
					}
				);
				// console.log(appSeatByDays)
				if (appSeatByDays.code == 0) {
					this.turnover = appSeatByDays.data.today || 0;
					this.reserveTableTimes = appSeatByDays.data.list.length || 0;
				} else {
					uni.showToast({
						icon: "none",
						title: appSeatByDays.msg,
					});
				}
			},
			handle() {
				uni.navigateTo({
					url: "storeManage/storeManage",
				});
			},
			goProfit() {
				uni.navigateTo({
					url: "./profit/profit",
				});
			},
			goStagenum(e) {
				// console.log(e)
				uni.navigateTo({
					url: `stageNum/stageNum?id=${e}`,
				});
			},
			goStage() {
				// console.log(1)
				uni.navigateTo({
					url: "storeManage/storeManage",
				});
			},
			goEvaluate() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				uni.navigateTo({
					url: "storeEvaluate/storeEvaluate",
				});
			},
			goManage() {
				uni.navigateTo({
					url: "goodsManage/goodsManage",
				});
			},
			goMessage(storeLocation) {
				if (storeLocation == 3) {
					uni.navigateTo({
						url: "seatMessage/ktvRoomMessage/ktvRoomMessage",
					});
				} else {
					uni.navigateTo({
						url: "seatMessage/seatMessage",
					});
				}
			},

			//获取用户的ID
			async getUserId(index, length) {
				const resUserList = this.resultUserInfo;

				const res = await this.$get(`/merchant/store/im/getUserById/${resUserList[index].targetId}`);

				//将相关要用到的字段存到数组里
				this.converClientList.push({
					userId: res.data.userId,
					nickname: res.data.nickname,
					headPortrait: res.data.headPortrait,
					receivedTime: resUserList[index].latestMessage.sentTime,
					content: resUserList[index].latestMessage.content.content,
					unreadMessageCount: resUserList[index].unreadMessageCount,
					show: false
				})

				//使用递归，这样能保证循环中的异步能够同步执行
				if (++index < length) {
					this.getUserId(index, length)
				}
			},

			//获取会话列表
			getConversationFn() {
				getConversationList()
					.then((result) => {
						console.log("会话列表", result);

						this.resultUserInfo = result;
						this.converClientList = []; //先清空页面上的对话列表

						//渲染相关数据到页面上
						this.getUserId(0, result.length);
						
						uni.$emit("converClientList", this.converClientList);
					})
					.catch((err) => {
						console.log(err);
					});
			},

			//jsBridge初始化方法
			setupWebViewJavascriptBridge(callback) {
				if (window.WebViewJavascriptBridge) {
					return callback(WebViewJavascriptBridge)
				} else {
					document.addEventListener('WebViewJavascriptBridgeReady', function() {
						callback(WebViewJavascriptBridge)
					}, false);
				}
			},

			//ios震动
			callhandler() {
				this.setupWebViewJavascriptBridge(function(bridge) {
					bridge.callHandler('vibrator', {
						'key': 'value'
					}, function responseCallback(responseData) {})
				});
			},

			//根据机型进行震动
			vibrator() {
				const res = uni.getSystemInfoSync().platform;
				if (res === 'ios') {
					this.callhandler();
				} else if (res === 'android') {
					window.AndroidJs.vibrator()
				} else {
					return
				}
			},
			
			//根据订单类型播放声音
			playVoice(result) {
				const innerAudioContext = uni.createInnerAudioContext();
				innerAudioContext.autoplay = true;
				
				//聊天消息提示音
				if (result.messageType === "RC:TxtMsg") {
					innerAudioContext.src = this.imgHead + 'default/system/message.mp3';
				}
				
				//订单消息提示音
				if (result.messageType === "JZ:MessageCustomOrder") {
					
					//如果收到新订单，就让座位状态页面刷新
					this.$store.commit('getOrderFun', (this.$store.state.onloadOrder++));
					
					//显示消息右上角的小红点
					uni.showTabBarRedDot({
						index: 1,
					})
					
					//新订单
					if (result.content.kind === 'JZ:MessageCustomOrder') {
						innerAudioContext.src = this.imgHead + 'default/system/order.mp3'
					} else {
						//其他类型订单
						innerAudioContext.src = this.imgHead + 'default/system/message.mp3'
					}
				}
				
				//官方消息提示音
				if (result.messageType === "JZ:MessageCustomSystem") {
					innerAudioContext.src = this.imgHead + 'default/system/system.mp3'
				}
			},

			//客户端监听服务端消息
			watchConversation() {
				im.watch({
					conversation: (event) => {
						//更新的会话列表
						const result = event.updatedConversationList[0].latestMessage;

						if (!result) return;

						console.log("监听到的消息", result);

						//如果当前监听到的消息是接收状态，那就重新请求会话列表
						if (result.messageDirection === 2) {
							setTimeout(() => {
								//手机来消息就震动
								this.vibrator();

								//播放铃声
								this.playVoice(result);

								//显示消息右上角的小红点
								uni.showTabBarRedDot({
									index: 2,
								})

								//获取会话列表
								this.getConversationFn();
								
								//将监听到的数据传给聊天详情页面
								uni.$emit("converResult", result);

							}, 1000);
						}
						
						//将监听到的数据传给聊天详情页面
						// uni.$emit("converResult", result);

					},
				});
			},

			// 首页加载失败时
			loadingAgain() {
				if (this.clickFlag) {
					return
				}
				uni.showToast({
					icon: 'none',
					title: '请刷新或重启应用'
				})
			},
		},
		created() {
			const role = JSON.parse(localStorage.getItem('uni-userInfo')) || ''
			if (role) {
				this.$store.commit('authFun', role.storeAuth)
			}
			let star = this.star;
			this.starWidth = star * 2 * 10 + "%";
		},
	};
</script>

<style scoped lang="scss">
	.bg {
		height: calc(100% - 110rpx);
		width: 100%;
		background-color: #fff;
		opacity: 0;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 999;
	}

	.homepage {
		.main {
			padding: 10rpx 24rpx 0;

			.header {
				display: flex;
				align-items: top;
				justify-content: space-between;
				min-height: 112rpx;
				word-break: break-all;

				.title {
					font-size: 48rpx;
					font-weight: 600;
				}

				.score {
					display: flex;
					align-items: center;
					height: 26rpx;
					margin: 8rpx 0 16rpx 0;

					.star-wrap {
						display: flex;

						text {
							display: inline-block;
							margin: 5rpx 12rpx 5rpx 0;
						}

						image {
							width: 20rpx;
							height: 20rpx;
							margin-right: 12rpx;
						}
					}
				}

				.star {
					position: relative;
					display: flex;
					margin: 0 24rpx;
				}

				.star-wrap text {
					float: left;
					width: 20rpx;
					height: 20rpx;
				}

				.star-wrap text:not(:last-child) {
					margin-right: 12rpx;
				}

				// .mask {
				// 	image {
				// 		width: 20rpx;
				// 		height: 20rpx;
				// 	}
				// }

				.business {
					background: url(../../static/imgs/he_r.png) no-repeat;
					background-size: 100%;
					min-width: 100rpx;
					height: 34rpx;
					margin-left: 24rpx;
					text-align: center;
					font-size: 20rpx;
					padding-left: 14rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding-bottom: 2rpx;
					box-sizing: border-box;
					margin-top: 10rpx;

					view {
						transform: scale(0.83);
					}
				}

				.businesss {
					background: url(../../static/imgs/weihe_r.png) no-repeat;
					background-size: 100%;
					width: 100rpx;
					height: 34rpx;
					text-align: center;
					font-size: 20rpx;
					padding-left: 14rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					padding-bottom: 2rpx;
					box-sizing: border-box;
					margin-top: 10rpx;

					view {
						transform: scale(0.83);
						white-space: nowrap;
					}
				}
			}

			.turnover {
				width: 100%;
				height: 210rpx;
				background: url(../../static/imgs/h1.png) no-repeat;
				background-size: 100%;
				font-size: 222rpx;
				display: flex;
				padding: 48rpx 0 0 50rpx;

				.left {
					font-size: 32rpx;
					font-weight: 600;

					.to_text {
						color: #ffffff;
					}

					.pic_text {
						color: #fee140;
					}
				}

				.right {
					font-size: 32rpx;
					font-weight: 600;
					padding-left: 110rpx;

					.to_text {
						color: #ffffff;
					}

					.pic_text {
						color: #fee140;
					}
				}
			}
		}

		.middle,
		.btm {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.m_img {
				width: 48%;
				margin-bottom: 24rpx;

				position: relative;

				text {
					font-size: 28rpx;
					font-weight: 600;
					color: #100a63;
					position: absolute;
					left: 28rpx;
					top: 22rpx;
					z-index: 10;
				}

				image {
					width: 100%;
					height: 356rpx;
				}
			}

			.m_img:hover {
				border-radius: 20rpx;
				box-shadow: 0px 1px 3px 0px rgba(197, 197, 197, 0.5);
			}

			.b_img {
				width: 48%;
				margin-bottom: 24rpx;
				position: relative;

				text {
					position: absolute;
					left: 24rpx;
					top: 24rpx;
					z-index: 10;
					font-size: 28rpx;
					font-weight: 600;
					color: #ffffff;
				}

				image {
					width: 100%;
					height: 180rpx;
				}
			}
		}
	}
</style>

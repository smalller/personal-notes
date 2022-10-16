<template>
	<view class="info">
		<u-back-top :scroll-top="scrollTop" :top="1000"></u-back-top>
		<!-- <view class="header">消息</view> -->
		<view class="nav-bar-wrap">消息</view>
		<!-- <view class="search">
			<text class="iconfont">&#xe628;</text>
			<input placeholder="请输入搜索内容" confirm-type="search" />
		</view> -->

		<!-- <view class="announcement" @click="goInformation">
			<view class="announcement_box">
				<view class="bg">
					<view class="img">最新公告</view>
					<view class="time">2020-11-01</view>
				</view>
				<view class="content">天府花溪谷森林音乐露营节，资深DJ掌控全场嗨点，森林音乐露营节秒变大型蹦迪现场，掀起潮流电音狂潮！</view>
			</view>
		</view> -->


		<view class="feedback" v-if="converClientList.length > 0">
			<u-swipe-action :show="item.show" :index="index" v-for="(item, index) in converClientList" :key="index + item.userId"
			 @click="deleteConver(item.userId)" @open="openDelete" :options="options" :btnWidth="btnWidth">
				<view class="feedback_item u-border-bottom" @click="goUser(item.userId,item.nickname)">
					<image v-if="item.headPortrait" :src="imgHead + item.headPortrait"></image>
					<view class="title-wrap">
						<view class="feedback_middle">
							<text>{{item.nickname}}</text>
							<text>{{item.content}}</text>
						</view>
						<view class="feedback_right">
							<text>{{item.receivedTime | timestampTodate(6)}}</text>
							<text v-if="item.unreadMessageCount > 0">{{item.unreadMessageCount}}</text>
						</view>
					</view>
				</view>
			</u-swipe-action>
		</view>
		<view v-else class="empty-converList">
			<image src="../../static/images/empty_converList.png" mode="widthFix"></image>
		</view>
	</view>
</template>
<script>
	import Vue from 'vue'
	import RongIMLib from '../../common/js/RongIMLib-3.0.7.1-dev.js' //融云SDK
	import {
		connectRongIM,
		disconnect,
		getConversationList
	} from '../../common/js/conversation.js'

	// //客户端初始化
	var config = {
		appkey: Vue.prototype.$appkey,
	};
	var im = RongIMLib.init(config);


	export default {
		data() {
			return {
				disabled: false,
				btnWidth: 140,
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d',
						marginLeft: '20rpx',
					}
				}],

				imgHead: this.$imgHead,
				converClientList: [], //客户对话列表
				scrollTop: 0, //跳回顶部的距离
				resultUserInfo: [], //返回的用户基本信息
			}
		},

		//下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				this.getConversationFn();
			}, 1000)
		},

		onLoad() {
			//如果全局收到消息，就更新会话列表
			uni.$on('converClientList', res => {
				uni.hideLoading();
				this.converClientList = res;

				// setTimeout(() => {
				// 	this.converClientList = res;
				// },1)
			})

			//获取最新的会话列表
			this.getConversationFn()


		},

		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		
		onShow() {
			//隐藏消息右上角的小红点
			uni.hideTabBarRedDot({
				index: 2,
			})
		},

		methods: {
			//获取用户的ID
			async getUserId(index, length) {
				const resUserList = this.resultUserInfo;
				if(resUserList.length !== 0) {
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
					} else {
						//如果所有异步都请求完了，就关闭相关操作
						setTimeout(() => {
							uni.stopPullDownRefresh();
							uni.hideLoading();
						}, 1000)
					}
				} else {
					this.$errToast('暂无会话列表')
					uni.stopPullDownRefresh();
					uni.hideLoading();
				}
			},


			//获取会话列表
			getConversationFn() {
				this.$showLoading();
				getConversationList().then(result => {
						console.log('会话列表', result)

						this.resultUserInfo = result;
						this.converClientList = []; //先清空页面上的对话列表

						//渲染相关数据到页面上
						this.getUserId(0, result.length);

					})
					.catch(err => {
						if (err.code === 30001) {
							//链接服务器
							connectRongIM().then(res => {
								//客户端开始监听服务端消息
								this.watchConversation();

								//获取最新的会话列表
								this.getConversationFn();
							}).catch(err => {
								
								console.log('zzz',err)
								this.$errToast('获取会话列表失败，请检查网络或重启应用')
							});
						}
					})
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
				if(res === 'ios') {
					this.callhandler();
				} else if(res === 'android') {
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

						if (!result) return

						console.log('监听到的消息', result)

						//如果当前监听到的消息是接收状态，那就重新请求会话列表
						if (result.messageDirection === 2) {
							setTimeout(() => {
								//手机来消息就震动
								this.vibrator();
								
								this.playVoice(result);
								
								//显示消息右上角的小红点
								uni.showTabBarRedDot({
									index: 2,
								})

								//获取会话列表
								this.getConversationFn();
								
								//将监听到的数据传给聊天详情页面
								uni.$emit('converResult', result);

							}, 1000);
						}

						//将监听到的数据传给聊天详情页面
						// uni.$emit('converResult', result);
					}
				});
			},

			//删除当前消息
			deleteConver(targetId) {
				let conversation = im.Conversation.get({
					targetId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});

				//删除指定会话
				conversation.destory().then(() => {
					//重新获取会话列表
					this.getConversationFn();
				});
			},

			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openDelete(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.converClientList[index].show = true;
				this.converClientList.map((val, idx) => {
					if (index != idx) this.converClientList[idx].show = false;
				})
			},

			//跳转到消息对话详情页面
			goUser(targetId, name) {
				const userInfo = {
					targetId,
					name
				}

				uni.navigateTo({
					url: `userInformation/userInformation?userInfo=${JSON.stringify(userInfo)}`,
				})
			},

			//查看公告
			goInformation() {
				uni.navigateTo({
					url: "tellInformation/tellInformation"
				})
			},

		}
	}
</script>
<style lang="scss" scoped>
	.empty-converList {
		image {
			width: 100%;
			height: auto;
		}
	}

	uni-page-body {
		height: 100%;
	}

	.info {
		padding-top: 88rpx;
		min-height: 100%;
		height: auto;
		background-color: #fbfbfb;

		.header {
			height: 88rpx;
			width: 100%;
			text-align: center;
			line-height: 88rpx;
			font-size: 32rpx;
			background-color: #F7F7F7;
		}

		.nav-bar-wrap {
			height: 88rpx;
			width: 100%;
			text-align: center;
			line-height: 88rpx;
			font-size: 36rpx;
			background-color: #F7F7F7;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 990;
		}

		.search {
			width: 100%;
			height: 60rpx;
			padding: 0 24rpx;
			position: relative;
			margin-top: 24rpx;

			text {
				position: absolute;
				left: 48rpx;
				top: 16rpx;
			}

			input {
				width: 100%;
				height: 60rpx;
				background-color: #EEEEEE;
				border-radius: 60rpx;
				padding: 10rpx 0 10rpx 64rpx;
				font-size: 28rpx;
			}
		}

		.announcement {
			margin-top: 24rpx;
			padding: 0 40rpx;

			.announcement_box {
				width: 100%;
				height: 244rpx;
				background-color: #fff;
				border-radius: 15rpx;
				padding: 30rpx 20rpx 0;
				box-sizing: border-box;

				.bg {
					display: flex;
					justify-content: flex-end;
					position: relative;

					.img {
						width: 272rpx;
						height: 64rpx;
						background: url(../../static/images/redbg.png);
						background-repeat: no-repeat;
						background-size: 100%;
						position: absolute;
						left: -44rpx;
						padding: 10rpx 44rpx;
						box-sizing: border-box;
						font-size: 28rpx;
						color: #FFFFFF;
					}

					.time {
						font-size: 28rpx;
						color: #CCCCCC;
					}
				}

				.content {
					text-indent: 2rem;
					margin-top: 30rpx;
					font-size: 26rpx;
				}
			}

		}

		.feedback {
			width: 100%;
			margin-top: 24rpx;
			padding-bottom: 100rpx;

			.feedback_item {
				width: 100%;
				display: flex;
				padding: 34rpx 32rpx;
				box-sizing: border-box;
			}

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
			}

			.title-wrap {
				flex-grow: 1;
				display: flex;
				justify-content: space-between;

				.feedback_middle {
					display: flex;
					flex-direction: column;
					margin-left: 24rpx;
					width: 380rpx;

					text {
						&:nth-child(1) {
							width: 100%;
							font-size: 32rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}

						&:nth-child(2) {
							width: 100%;
							font-size: 28rpx;
							color: #ccc;
							display: inline-block;
							margin-top: 16rpx;
							white-space: nowrap;
							overflow: hidden;
							text-overflow: ellipsis;
						}
					}
				}

				.feedback_right {
					width: 168rpx;
					// flex-grow: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-end;

					text-align: right;

					text {
						&:nth-child(1) {
							font-size: 28rpx;
							color: #CCCCCC;
						}

						&:nth-child(2) {
							display: inline-block;
							width: 36rpx;
							height: 36rpx;
							background-color: #FB9E74;
							text-align: center;
							line-height: 36rpx;
							font-size: 28rpx;
							color: #fff;
							border-radius: 50%;
							margin-top: 16rpx;
						}
					}
				}
			}
		}
	}
</style>

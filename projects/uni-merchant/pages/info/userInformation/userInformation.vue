<template>
	<view>
		<view class="nav-bar-wrap">
			<view class="back-btn" @click="handleBack">
				<text class="iconfont">&#xe625;</text>
			</view>
			<view class="title-box">
				<h1>{{userName}}</h1>
			</view>
		</view>
		
		<template v-if="targetId == 10000 || targetId == 10001">
			<view v-if="contentList.length > 0" class="information" >
				<view class="loading-box">
					<u-loading :show="loadingShow" color="rgb(41, 121, 255)"></u-loading>
				</view>
				<view class="context" v-for="(item, index) in contentList" :key="index">
					<view class="first">
						<text>{{item.sentTime | formatTime}}</text>
					</view>
					<view class="content">
						<template v-if="item.content.TYPE === 'JZ:MessageCustomSystem'">
							<image class="header" src="../../../static/icon/system.png"></image>
							<view class="utterance">
								<text selectable>{{ item.content.content }}</text>
							</view>
						</template>
						<template v-if="item.content.TYPE === 'JZ:MessageCustomOrder'">
							<image class="header" src="../../../static/icon/order.png"></image>
							<view class="utterance">
								<view>内容：{{item.content.content}}</view>
								<view>时间：{{item.sentTime | timestampTodate(1)}}</view>
								<view>用户：{{item.content.title}}</view>
								<view class="look-order" @click="lookOrder">查看订单</view>
							</view>
						</template>
					</view>
				</view>
			</view>
		</template>
		
		<template v-else>
			<view v-if="contentList.length > 0" class="information">
				<view class="loading-box">
					<u-loading :show="loadingShow" color="rgb(41, 121, 255)"></u-loading>
				</view>
				<view :class="[item.messageDirection === 1 ? 'selfContent' : 'context']" v-for="(item, index) in contentList" :key="index">
					<view class="first">
						<text>{{item.sentTime | formatTime}}</text>
					</view>
					<view class="content">
						<image class="header" v-if="item.content.user" :src="item.content.user.portrait.indexOf('http') === -1 ? imgHead + item.content.user.portrait : item.content.user.portrait"></image>
						<image class="header" v-else src="../../../static/icon/4-4.png" mode=""></image>
						<view class="utterance" v-if="item.messageType === 'RC:VcMsg'">暂时不支持查看语音消息</view>
						<view class="utterance imageUri" v-else-if="item.messageType === 'RC:ImgMsg'">
							<image class="imageUri" :src="item.content.imageUri" @click="showImage(item.content.imageUri)"></image>
						</view>
						<view class="utterance" v-else-if="item.messageType === 'RC:LBSMsg'">暂时不支持查看位置消息</view>
						<view class="RcCmd" v-else-if="item.messageType === 'RC:RcCmd'">对方撤回了一条消息</view>
						<view class="utterance" v-else>
							<text selectable>{{ item.content.content }}</text>
						</view>
					</view>
				</view>
			</view>
		</template>
		
		
		<template v-if="$store.state.auth > 0 ">
			<view class="inp_bottom" v-if="targetId != 10000 && targetId != 10001">
				<!-- <view class="one">
					<text class="iconfont">&#xe66a;</text>
				</view> -->
				<view class="two">
					<input type="text" confirm-type="send" v-model="inputContent" @confirm="send" />
				</view>
				<!-- <view class="three">
					<text class="iconfont">&#xe644;</text>
				</view>
				<view class="four">
					<text class="iconfont">&#xe642;</text>
				</view> -->
				<view class="send" @click="send"> 发送 </view>
			</view>
		</template>
	</view>
</template>

<script>
	import Vue from 'vue'
	import RongIMLib from "../../../common/js/RongIMLib-3.0.7.1-dev.js"; //融云SDK
	import {
		connectRongIM,
		disconnect,
		getConversationList
	} from '../../../common/js/conversation.js'

	//客户端初始化
	var config = {
		appkey: Vue.prototype.$appkey,
	};
	var im = RongIMLib.init(config);


	export default {
		data() {
			return {
				imgHead : this.$imgHead,  //头像头
				storeInfo : null,	//当前店铺的信息
				contentList: [], //所有消息对话列表
				inputContent: '', //输入框内容
				targetId: '', //当前的聊天对象Id
				userName: '', //当前的聊天对象名称
				showConver : false,	//展示消息的开关
				hasMore : false,	//是否还有更多历史消息
				count : 20,	//每次请求多少条消息记录
				loadingShow : false,
				heightTop : -1,
				heightBotom : -1,
				converResultStatus : false,	//是否在当前页面的状态值
				converClientList: [], //客户对话列表
				resultUserInfo : [],	//返回的用户基本信息
			};
		},

		onUnload() {
			this.converResultStatus = false;
			
			//清除未读消息数量
			this.clearConverNum();
			
			//重新获取会话列表
			this.getConversationFn();
		},

		onLoad(option) {
			this.converResultStatus = true;
			
			const userInfo = JSON.parse(option.userInfo);
			this.storeInfo = JSON.parse(uni.getStorageSync("uni-userInfo"));
			this.targetId = userInfo.targetId;
			this.userName = userInfo.name;

			//获取历史消息
			this.getMessages()

			//监听服务器端的消息
			this.watchConversation()
		},
		
		//下拉触顶获取历史消息
		onPageScroll(e) {
			if(e.scrollTop < 5) {
				this.$createSelectorQuery('.information').then(res => {
					//获取历史消息前最后一刻滚动条所在的高度
					this.heightTop = res.height;
				})
			}
			
			//加载更多消息
			if(e.scrollTop === 0 && this.hasMore) {
				this.loadingShow = true;
				setTimeout(() => {
					this.getMessages();
				},1000)
			}
		},

		methods: {			
			//查看图片
			showImage(image) {
				// 单张预览
				let imgArr = [];
				imgArr.push(image);
							
				uni.previewImage({
					urls: imgArr,
					current: image,
				});
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
						this.converClientList = [];	//先清空页面上的对话列表
						
						//渲染相关数据到页面上
						this.getUserId(0, result.length);
			
						//将最新的对话列表传到列表页面
						uni.$emit("converClientList", this.converClientList);
					})
					.catch((err) => {
						if(err.code === 30001) {
							//链接服务器
							connectRongIM().then(res => {
								//获取最新的会话列表
								this.getConversationFn();
							}).catch(err => {
								this.$errToast('获取会话列表失败，请检查网络或重启应用')
							});
						}
					});
			},
			
			//监听服务器端的消息
			watchConversation() {
				uni.$on('converResult', result => {
					//如果监听到的消息是别人发给商家的，并且是停留在当前页面
					if (result.messageDirection === 2 && this.converResultStatus === true) {
						//重新获取历史消息
						// setTimeout(() => {
							this.getMessages(2);
						// }, 1000)
					}
				});
			},

			//获取历史消息
			getMessages(status) {
				var conversation = im.Conversation.get({
					targetId: this.targetId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE
				});
				
				let timestrap = 0,count = this.count;
				
				//获取历史消息的时间戳默认为当前历史消息数组中最后一条消息的时间戳
				if(this.contentList.length !== 0) {
					timestrap = this.contentList[0].sentTime;
				}
				
				//如果监听到是别人发消息给商家
				if(status === 2) {
					//就将时间戳置零，为了自动跳转到底部
					timestrap = 0;
				}
				
				//要传的参数
				let option = {
				  timestrap,
				  count
				};

				conversation.getMessages(option).then(result => {
					//是否还有历史消息可以获取
					this.hasMore = result.hasMore;
					
					//如果是最开始进入消息详情或者是别人发消息给商家的情况
					if(this.contentList.length === 0 || status === 2) {
						
						//获取最新的历史消息
						const resContentList = Promise.resolve(this.contentList = result.list) 
						
						//自动触底
						resContentList.then(() => {
							this.pageScrollToBottom();
						})
						
					} else {
						//下拉获取更多历史消息
						const resContentList = Promise.resolve(this.contentList.unshift(...result.list));
						
						resContentList.then(() => {
							(async () => {
								const res = await this.$createSelectorQuery('.information');
								if(res) {
									//获取历史消息后滚动条所在的高度
									this.heightBotom = res.height;
								}
								
								//自动滚动到翻页之前的位置
								this.$nextTick(() => {
									uni.pageScrollTo({
										scrollTop: this.heightBotom - this.heightTop - 90, 
										duration : 0
									});
								})
								
								this.loadingShow = false
							})()
						})
						
						
						// (async ($self,result) => {
						// 	await $self.contentList.unshift(...result.list);
							
						// 	const res = await $self.$createSelectorQuery('.information');
						// 	if(res) {
						// 		//获取历史消息后滚动条所在的高度
						// 		$self.heightBotom = res.height;
						// 	}
							
						// 	//自动滚动到翻页之前的位置
						// 	$self.$nextTick(() => {
						// 		uni.pageScrollTo({
						// 			scrollTop: $self.heightBotom - $self.heightTop - 90, 
						// 			duration : 0
						// 		});
						// 	})
							
						// 	$self.loadingShow = false
						// })(this,result)
					}
					
					console.log('获取历史消息成功', this.contentList);
				});
			},

			//清除消息列表所对应的当前用户的消息未读数量
			clearConverNum() {
				im.Conversation.get({
					targetId: this.targetId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE,
				}).read();
			},
			
			//自动页面触底
			pageScrollToBottom(duration = 0) {
				uni.pageScrollTo({
					scrollTop: 99999999999, 
					duration
				})
			},

			//回退到消息列表页面
			handleBack() {
				uni.switchTab({
					url: "../info",
				});
			},

			//发送消息按钮
			send() {
				//禁止直接发送空格
				if (this.inputContent.trim() == '') {
					this.inputContent = '';
					return;
				}

				//发送消息
				this.clientSendMessage();
				
				//收起键盘
				uni.hideKeyboard();
			},
			
			//发送消息
			clientSendMessage() {
				//当前聊天的用户信息
				let conversation = im.Conversation.get({
					targetId: this.targetId,
					type: RongIMLib.CONVERSATION_TYPE.PRIVATE,
				});
			
				conversation.send({
					messageType: RongIMLib.MESSAGE_TYPE.TEXT, // 'RC:TxtMsg'
					// 发送的文本内容
					content: {
						content: this.inputContent,
						user: {
							name: this.storeInfo.storeName,
							// portrait: this.$imgHead + this.storeInfo.logo,
							portrait: this.storeInfo.logo,
						},
					},
				}).then((message) => {
					//将发送的消息本地渲染当前页面上
					const resContentList = Promise.resolve(this.contentList.push(message))
			
					//自动触底
					resContentList.then(() => {
						this.pageScrollToBottom();
					})
			
					//清空输入框
					this.inputContent = '';
				}).catch((err) => {
					this.$errToast("发送失败，请检查网络");
				});
			},
		
			//查看订单
			lookOrder() {
				uni.switchTab({
					url:'../../order/order'
				})
			},
		},
	};
</script>

<style lang="scss" scoped>
	uni-page-body {
		width: 100%;
		height: 100%;
		background-color: #f7f7f7;
	}
	
	.loading-box {
		text-align: center;
		margin-top: 20rpx;
	}

	.nav-bar-wrap {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 66;
		width: 100%;
		height: 88rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		box-sizing: border-box;

		.back-btn {
			position: absolute;
			left: 24rpx;
			display: flex;

			text {
				font-size: 32rpx;
			}
		}

		.title-box {
			margin: 0 auto;

			h1 {
				font-size: 32rpx;
				font-weight: 400;
				color: #000;
			}
		}
	}
	
	.info-wrap {
		overflow-anchor: auto;
		overflow-y: scroll;
		height: calc(100% - 50px);
		background-color: #f7f7f7;
	}

	.information {
		// overflow-anchor: auto;
		overflow-y: scroll;
		box-sizing: border-box;
		padding:88rpx 24rpx 100rpx;
		background-color: #f7f7f7;
		// min-height: 100%;
		// height: auto;
		
		height: calc(100% - 50px);
		
		.first {
			text-align: center;
			margin: 32rpx 0;

			text {
				margin: 0 24rpx;
				font-size: 24rpx;
			}
		}

		.context {
	
			margin: 0 0 40rpx 0;
			
			.content {
				display: flex;
				align-items: center;
			}

			.header {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
			}

			.utterance {
				padding: 12rpx 24rpx;
				box-sizing: border-box;
				background-color: #fff;
				text-align: left;
				line-height: 64rpx;
				margin: 0 24rpx;
				border-radius: 10rpx;
				min-height: 88rpx;
				box-sizing: border-box;
				max-width: 558rpx;
				
				.look-order {
					border-top: 2rpx solid #999;
					text-align: center;
				}
			}
			
			.utterance .imageUri {
				width: 100rpx;
				height: 260rpx;
			}
			
			.utterance .audio-box {
				width: 100rpx;
			}
			
			.RcCmd {
				margin: 0 auto;
				font-size: 24rpx;
				background-color: #ddd;
				color: #fff;
				padding: 12rpx;
				border-radius: 12rpx;
			}
		}

		.selfContent {
			align-items: center;
			margin: 0 0 40rpx 0;
			
			.content {
				display: flex;
				justify-content: flex-end;
			}

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: 50%;
				order: 8;
			}

			.utterance {
				padding: 12rpx 24rpx;
				box-sizing: border-box;
				text-align: left;
				line-height: 64rpx;
				margin-left: 24rpx;
				border-radius: 10rpx;
				order: 1;
				background-color: #67a8fc;
				min-height: 88rpx;
				box-sizing: border-box;
				margin-right: 24rpx;
				max-width: 558rpx;

				text {
					color: #fff;
				}
			}
		}
	}

	.inp_bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 66;
		padding: 24rpx;
		box-sizing: border-box;
		width: 100%;
		height: 100rpx;
		background-color: #eee;
		display: flex;
		align-items: center;


		.one {
			text {
				font-size: 58rpx;
			}
		}

		.two {
			flex-grow: 1;
			margin-right: 24rpx;

			input {
				width: 100%;
				height: 62rpx;
				border-radius: 62rpx;
				background-color: #fff;
				padding: 0 15rpx;
				box-sizing: border-box;
			}
		}

		.three {
			text {
				font-size: 58rpx;
			}
		}

		.four {
			text {
				font-size: 58rpx;
			}
		}

		.send {
			width: 120rpx;
			height: 62rpx;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 62rpx;
			background-color: #68a8fc;
		}
	}
</style>

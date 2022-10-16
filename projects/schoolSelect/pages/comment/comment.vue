<template>
	<view class="comment">
		<view class="schoolInfoBox">
			<view class="schoolImg"><image :src="schoolInfo.imagesUrl"></image></view>
			<view class="schoolInfo">
				<view class="schoolName">
					<text>{{ schoolInfo.name }}</text>
				</view>
				<view class="schoolTag">
					<view class="tag" v-for="txt in splitTags(schoolInfo.tag)" :key="txt">
						<text>{{ txt }}</text>
					</view>
				</view>
				<view class="schoolMore">
					<view class="schoolAddress">
						<image src="../../static/address.png" mode=""></image>
						<text>{{ schoolInfo.county }}-{{ schoolInfo.address }}</text>
					</view>
					<view class="schoolMsgLength">
						<image src="../../static/message.png" mode=""></image>
						<text>{{schoolInfo.commentNums}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="msgBox" v-if="!isSendShow">
			<view class="msgHead"><text>全部评价({{schoolInfo.commentNums}})</text></view>
			<scroll-view class="msgContent" scroll-y="true">
				<view>
					<view class="msgItem" v-for="item in msgList" :key="item.uuid">
						<view class="msgUserPic">
							<u-avatar v-if="item.userPortait" :src="item.userPortait"></u-avatar>
							<u-avatar v-else text="无头像"></u-avatar>
						</view>
						<view class="msgInfo">
							<view class="msgUserName">
								<text>{{ item.sysUserName }}</text>
							</view>
							<view class="msgTime">
								<text>{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd') }}</text>
							</view>
							<view class="msgText">
								<text>{{ item.comment }}</text>
							</view>
							<!-- <view class="msgMore">
								<view class="moreItem">
									<text>
										<text class="moreUserName">张无忌：</text>
										取取织每龙飞身性见必，北社里级革美理工 地只十龙刷众什五束关。
									</text>
								</view>
								<view class="moreBtn"><text type="default">展开全部18条评论</text></view>
							</view> -->
							<view class="msgMoreIcon"><image src="../../static/message.png" mode=""></image></view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>

		<view v-else class="setMsgBox">
			<view class="textTitle"><text></text></view>
			<u--textarea height="256" v-model="sendText" maxlength="300" placeholder="您可以从学校的环境、师资力量等多方面，分享观点哟" count></u--textarea>
			<button type="default" class="subSendBtn" @click="subSent">提交</button>
		</view>
		<view class="setMsgBtn" v-if="!isSendShow"><button @click="openSendShow">我要评价</button></view>
	</view>
</template>

<script>
import { sendMsg, getMsgList } from '../../api/message.js';
export default {
	data() {
		return {
			schoolInfo: {},
			showMoreList: [],
			isSendShow: false,
			sendText: '',
			isSend: false,
			msgList: [],
			pageForm: {
				pageNo: 1,
				pageSize: 20
			}
		};
	},
	onLoad(e) {
		if (!!e.isSend) {
			this.isSend = e.isSend;
			this.isSendShow = true;
		}

		this.schoolInfo = JSON.parse(uni.getStorageSync('schoolInfo'));
		// uni.removeStorage({
		// 	key: 'schoolInfo'
		// });
		this.msgList = [];
		this.getMsgList();
	},
	onShow() {},
	computed: {
		userInfo: function() {
			if (this.$store.getters) {
				return this.$store.getters.userInfo;
			} else {
				return {};
			}
		},
		userId: function() {
			if (this.$store.getters) {
				return this.$store.getters.userId;
			} else {
				return '';
			}
		},
		isLogin: function() {
			let status = false;
			if (this.$store.getters) {
				status = this.$store.getters.userId && this.$store.getters.token;
			}
			return status;
		}
	},
	methods: {
		splitTags(tag) {
			if (typeof tag === 'string') {
				let arr = [];
				return (arr = tag.split(/[,，]/));
			} else {
				return [];
			}
		},
		//获取评论列表
		getMsgList() {
			getMsgList({
				pageNo: this.pageForm.pageNo,
				pageSize: this.pageForm.pageSize,
				relatedId: this.schoolInfo.id
			}).then(res => {
				if (+res.code === 0) {
					this.msgList = this.msgList.concat(res.data.list);
				}
				// console.log(res);
			});
		},
		//显示发布评价界面
		openSendShow() {
			if (this.isLogin) {
				this.isSendShow = true;
			} else {
				uni.showToast({
					image: 'none',
					title: '请登录'
				});
			}
		},
		//发布评价
		subSent() {
			if(!this.sendText.trim()) {
				uni.showToast({
					icon: 'none',
					title: '内容不能为空'
				})
				return
			}
			sendMsg({
				comment: this.sendText,
				relatedId: this.schoolInfo.id,
				sysUserId: this.userId, //用户id
				sysUserName: this.userInfo.nickName, //姓名
				userPortait: this.userInfo.userPortait //头像
			}).then(res => {
				if (+res.code === 0) {
					uni.showToast({
						title: '提交成功',
						icon: 'none'
					});
					if (this.isSend) {
						uni.navigateBack({
							delta: 1
						});
					}
					this.msgList = [];
					this.getMsgList();
					this.isSendShow = false;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.comment {
	width: 100vw;
	min-height: 100vh;
	background: #f6f6f6;
	display: flex;
	flex-direction: column;
	.schoolInfoBox {
		padding: 0 15px;
		box-sizing: border-box;
		height: 108px;
		width: 100%;
		display: flex;
		align-items: center;
		background: #ffffff;
		.schoolImg {
			width: 105px;
			height: 80px;
			border-radius: 8px;
			overflow: hidden;
			margin-right: 10px;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.schoolInfo {
			height: 80px;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.schoolName {
				font-size: 16px;
				font-weight: 500;
				color: #333333;
			}
			.schoolTag {
				.tag {
					display: inline-block;
					padding: 2px 8px;
					background: #f1f6f9;
					color: #a6a6a6;
					border-radius: 4px;
					font-size: 11px;
					margin-right: 8px;
				}
			}
			.schoolMore {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.schoolAddress {
					font-size: 12px;
					color: #b4b4b4;
					display: flex;
					align-items: center;
					image {
						width: 10px;
						height: 10px;
						margin-right: 6px;
					}
				}
				.schoolMsgLength {
					font-size: 12px;
					color: #c4c4c4;
					display: flex;
					align-items: center;
					image {
						width: 20px;
						height: 20px;
						margin-right: 4px;
					}
				}
			}
		}
	}
	.msgBox {
		padding-bottom: 68px;
		box-sizing: border-box;
		width: 100%;
		flex: 1;
		display: flex;
		flex-direction: column;
		.msgHead {
			box-sizing: border-box;
			padding: 0 15px;
			width: 100%;
			height: 36px;
			display: flex;
			align-items: center;
			text {
				font-weight: 400;
				color: #b4b4b4;
				font-size: 10px;
			}
		}
		.msgContent {
			flex: 1;
			background: #ffffff;
			> view {
				padding-top: 2px;
			}
			.msgItem {
				display: flex;
				box-sizing: border-box;
				padding: 16px 15px;
				.msgUserPic {
					margin-right: 8px;
				}
				.msgInfo {
					border-bottom: 1px solid #f6f7f9;
					flex: 1;
					.msgUserName {
						font-weight: 500;
						color: #333333;
						font-size: 14px;
					}
					.msgTime {
						font-weight: 400;
						color: #b0b0b0;
						font-size: 10px;
						margin-top: 4px;
					}
					.msgText {
						margin-top: 8px;
						font-size: 14px;
						font-weight: 400;
						color: #585858;
					}
					.msgMore {
						margin-top: 8px;
						padding: 10px;
						background: #f6f6f6;
						.moreItem {
							margin-top: 8px;
							&:first-child {
								margin-top: 0;
							}
							text {
								color: #585858;
								font-size: 12px;
								.moreUserName {
									font-weight: 500;
									color: #333333;
								}
							}
						}
						.moreBtn {
							margin-top: 8px;

							text {
								font-size: 12px;
								font-weight: 500;
								color: #487bc7;
							}
						}
					}
					.msgMoreIcon {
						margin-top: 4px;
						display: flex;
						justify-content: flex-end;
						padding-bottom: 8px;
						image {
							width: 20px;
							height: 20px;
						}
					}
				}
			}
		}
	}
	.setMsgBox {
		width: 100vw;
		margin-top: 10px;
		box-sizing: border-box;
		padding: 14px 15px 0;
		.textTitle {
			font-size: 14px;
			font-weight: 500;
			color: #333333;
		}
		.subSendBtn {
			height: 44px;
			width: 100%;
			background: #f6a13e;
			border-radius: 22px;
			font-weight: 500;
			color: #ffffff;
			font-size: 16px;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 30px;
		}
	}
	.setMsgBtn {
		position: fixed;
		box-sizing: border-box;
		bottom: 0;
		width: 100%;
		padding: 12px 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top: 1px solid #f1f1f1;
		background: #ffffff;
		button {
			flex: 1;
			height: 44px;
			background: #f6a13e;
			border-radius: 22px;
			font-weight: 500;
			color: #ffffff;
			font-size: 16px;
		}
	}
}
</style>

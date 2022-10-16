<template>
	<view class="shuXiangDetail">
		<view class="head">
			<view v-if="workInfo.worksType === 'Image'">
				<view class="work-list albumBox"><u-album :multipleSize="albumWidth" space="5" :urls="workInfo.worksUrl" multipleMode="aspectFit"></u-album></view>
			</view>
			<view v-if="workInfo.worksType !== 'Image'">
				<video :poster="workInfo.worksCover" class="work-box" :src="workInfo.worksUrl[0]" controls enable-play-gesture></video>
			</view>
			<view :animation="animationData" v-if="countShow" class="heatBox" ref="heatBox">
				<view class="userData">
					<view class="left">
						<image :src="wxUserInfo.avatarUrl" mode=""></image>
						<view class="nameBox">
							<text>{{wxUserInfo.nickName}}</text>
							<text>点赞</text>
						</view>
					</view>
					<view class="right">
						<image src="../static/image/heat2.png" mode=""></image>
					</view>
				</view>
				<view class="numData">
					<text>x{{count}}</text>
				</view>
			</view>
		</view>
		<scroll-view class="content" scroll-y enable-flex @scrolltolower="pageNext" lower-threshold="100">
			<view class="work-detail">
				<view class="work-name">
					<view class="top">
						<img class="work-photo" :src="workInfo.headerImg" />
						<view class="nameBox">
							<span>{{ workInfo.publishName }}</span>
							<p>{{ workInfo.createTime }}</p>
						</view>
					</view>
					<view class="bottom">
						<button class="shareBtn" open-type="share">
							<!-- 转发 -->
							<image src="../static/image/share.png" mode=""></image>
							<text>分享</text>
						</button>
						<view class="work-vote" @click="sendVote">
							<u-icon name="heart-fill" color="#FE5A6E" size="24px" class="icon"></u-icon>
							<text>{{ workInfo.pointCount }}赞</text>
						</view>
					</view>
				</view>
				<view class="workInfo">
					<text>{{ workInfo.worksTitle }}</text>
					<text>{{ workInfo.description }}</text>
				</view>
			</view>

			<view class="msgBox">
				<view class="msgHead">
					<text>全部评价({{ workInfo.commentNums }})</text>
				</view>
				<view class="msgContent">
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
								<!-- <view class="msgMoreIcon">
			        <image
			          src="../../static/message.png"
			          mode=""
			        ></image>
			      </view> -->
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="setMsgBtn" v-if="!isSendShow">
				<view class="input"><u-input border="surround" v-model="msg" shape="circle" @confirm="sendMsg()" confirmType="send"></u-input></view>
				<!-- <image src="../../static/common/replay.png" @click="sendMsg()"></image> -->
				<view class="btn" @click="sendMsg()">发送</view>
			</view>

			<shareBox ref="share" @pay="payVote" />
			<u-popup mode="bottom" :show="payShow" title="购买次数" :round="10" @close="payShow = false" closeable closeIconPos="top-left">
				<view class="payInfo">
					<view class="payTitle"><text>购买次数</text></view>
					<view class="typeList">
						<view class="border" @click="selectPayType(item.id)" v-for="item in productsList" :key="item.id" :class="{ active: item.id === productId }">
							<view class="payItem">
								<view>
									<text>购买{{ item.ticketNums }}次</text>
								</view>
								<view>
									<text>￥</text>
									<text>{{ item.amount }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="btnBox"><button type="default" @click="pay">立即购买</button></view>
				</view>
			</u-popup>
		</scroll-view>
	</view>
</template>

<script>
import region from '../components/region.vue';
import { voteWork, setTourist, getDetails } from '../../api/shuxiang.js';
import { getMsgList, sendTouristMsg } from '../../api/message.js';
import { getProducts } from '../../api/pay.js';
import { getWxUserInfo } from '../../base/common.js';
import shareBox from '../components/shareBox.vue';
export default {
	data() {
		return {
			albumWidth: '100',
			show: false,
			value: '',
			cover: '',
			imagesUrl: '',
			video: '',
			msgList: [],
			workInfo: {
				pointCount: 0
			},
			msg: '',
			loading: false,
			pageForm: {
				pageNo: 1,
				pageSize: 15
			},
			payShow: false,
			productsList: [],
			productId: '',
			look: false,
			count: 0,
			countShow: true,
			timer: null,
			closeTimer: null,
			animationData: {},
			wxUserInfo: {}
		};
	},
	components: {
		region,
		shareBox
	},
	onReachBottom() {
		// this.pageNext();
	},
	onShow() {
		var animation = uni.createAnimation({
			duration: 900,
			timingFunction: 'ease'
		});
		animation.translateX(-300).step({duration:0});
		this.animation = animation;
		this.animationData = animation.export();
	},
	onReady() {
		const that = this;
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.shuXiangDetail')
			.boundingClientRect(data => {
				that.albumWidth = (data.width - 40) / 3;
			})
			.exec();
	},
	onLoad(e) {
		//#ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		//#endif
		this.getDetails(e.id);
		uni.showShareMenu({
			title: `我是${this.workInfo.publishName}小朋友，正在参加书香天府阅读比赛，目前排名第${this.workInfo.num}，请帮我点赞吧，每天可点5次哦！`,
			path: '/pageShuXiang/shuXiang/shuXiangDetail?id=' + this.workInfo.id,
			imageUrl: this.workInfo.worksCover
		});
	},
	onShareAppMessage() {
		const promise = new Promise(resolve => {
			setTimeout(() => {
				resolve({
					title: `我是${this.workInfo.publishName}小朋友，正在参加书香天府阅读比赛，目前排名第${this.workInfo.num}，请帮我点赞吧，每天可点5次哦！`,
					path: '/pageShuXiang/shuXiang/shuXiangDetail?id=' + this.workInfo.id,
					imageUrl: this.workInfo.worksCover
				});
			}, 2000);
		});
		return {
			promise
		};
	},
	onShareTimeline() {
		return {
			title: `我是${this.workInfo.publishName}小朋友，正在参加书香天府阅读比赛，目前排名第${this.workInfo.num}，请帮我点赞吧，每天可点5次哦！`,
			query: {
				id: this.workInfo.id
			},
			imageUrl: this.workInfo.worksCover
		};
	},
	methods: {
		
		showMove() {
			this.countShow = true;
			this.animation.translateX(20).step({duration:400});
			this.animationData = this.animation.export();
			console.log(12333);
		},
		closeMove() {
			var heatBoxEl = this.$refs.heatBox;
			this.countShow = true;
			this.animation.opacity(0).step({duration:200});
			this.animation.translateX(-300).opacity(1).step({duration:0});
			this.animationData = this.animation.export();
			this.closeTimer = setTimeout(() => {
				this.count = 0;
				this.closeTimer = null;
			}, 1000)
		},
		//计算点赞次数
		countPlus() {
			if (this.timer) {
				clearTimeout(this.timer);
			} else {
				this.showMove();
			}
			if(this.closeTimer) {
				clearTimeout(this.closeTimer)
			} 
			this.timer = setTimeout(() => {
				this.closeMove();
				this.timer = null
			}, 2000);
		},
		//查询作品详情
		getDetails(id) {
			getDetails({
				id: id
			}).then(res => {
				if (+res.code === 0) {
					this.workInfo = { ...res.data };
					this.getMsgList();
				}
			});
		},
		//登记游客信息
		setTourist() {
			return new Promise(async (resolve, reject) => {
				if (!uni.getStorageSync('wxUserInfo')) {
					try {
						await getWxUserInfo();
						const wxUserInfo = uni.getStorageSync('wxUserInfo');
						setTourist({
							nickName: wxUserInfo.nickName,
							portrait: wxUserInfo.avatarUrl,
							openId: uni.getStorageSync('openId')
						})
							.then(res => {
								if (+res.code === 0) {
									resolve();
								} else {
									reject(e.msg);
								}
							})
							.catch(e => {
								reject(e);
							});
					} catch (e) {
						reject(e);
					}
				}
			});
		},
		// 点赞投票
		async sendVote() {
			if (!uni.getStorageSync('wxUserInfo')) {
				await this.setTourist();
			}
			if (this.workInfo.id) {
				this.wxUserInfo = uni.getStorageSync('wxUserInfo')
				voteWork(this.workInfo.id, uni.getStorageSync('openId')).then(res => {
					if (res.code === 0) {
						uni.showToast({
							icon: 'none',
							title: '点赞成功'
						});
						this.count++;
						this.countPlus()
						this.workInfo.pointCount++;
					} else if (+res.code === 1) {
						this.$refs.share.init();
					} else if (+res.code === -99) {
						uni.showToast({
							icon: 'none',
							title: '活动已结束'
						});
					} else {
						uni.showToast({
							icon: 'none',
							title: res.msg
						});
					}
				});
			}
		},
		// 购买投票
		async payVote() {
			if (this.productsList.length === 0) {
				await this.queryPayType();
			}
			this.payShow = true;
		},
		// 查询购买价格
		queryPayType() {
			return new Promise((resolve, reject) => {
				getProducts({
					productType: 'Ticket',
					schoolId: '1'
				}).then(res => {
					if (+res.code === 0) {
						this.productsList = res.data;
						resolve();
					}
				});
			});
		},
		// 选择购买种类
		selectPayType(id) {
			this.productId = id;
		},
		//购买票数
		pay() {
			this.$Pay({
				productType: 'Ticket',
				productId: this.productId,
				openId: uni.getStorageSync('openId')
			}).then(() => {
				uni.showToast({
					icon: 'success',
					title: '购买成功'
				});
				this.payShow = false;
			});
		},
		//下一页
		pageNext() {
			this.loading = true;
			this.pageForm.pageNo++;
			this.getMsgList();
		},
		//查询评论列表
		getMsgList() {
			getMsgList({
				pageNo: this.pageForm.pageNo,
				pageSize: this.pageForm.pageSize,
				relatedId: this.workInfo.id
			})
				.then(res => {
					if (+res.code === 0) {
						if (this.pageForm.pageNo === 1) {
							this.msgList = res.data.list;
						} else {
							this.msgList = this.msgList.concat(res.data.list);
						}
						if (res.data.list.length > 0) {
							this.pageForm.pageNo = res.data.page.pageNo;
						} else {
							this.pageForm.pageNo--;
							if (this.pageForm.pageNo < 1) {
								this.pageForm.pageNo = 1;
							}
						}
					}
				})
				.finally(() => {
					this.loading = false;
				});
		},
		//发送评论
		async sendMsg() {
			let userStatus = false;
			if (this.look) {
				return;
			}
			if (!this.msg) {
				uni.showToast({
					icon: 'none',
					title: '评论为空'
				});
				return;
			}

			const wxUserInfo = uni.getStorageSync('wxUserInfo');
			if (!wxUserInfo.nickName && !wxUserInfo.avatarUrl) {
				try {
					await this.setTourist();
					userStatus = true;
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: '用户已拒绝,发送评论失败'
					});
					userStatus = false;
				}
			} else {
				userStatus = true;
			}
			if (this.workInfo.id && userStatus) {
				const wxUserInfo = uni.getStorageSync('wxUserInfo');
				this.look = true;
				sendTouristMsg({
					sysUserName: wxUserInfo.nickName,
					userPortait: wxUserInfo.avatarUrl,
					relatedId: this.workInfo.id,
					openId: uni.getStorageSync('openId'),
					comment: this.msg
				})
					.then(res => {
						if (+res.code === 0) {
							uni.showToast({
								icon: 'none',
								title: '发送评论成功'
							});
							this.msgList.unshift({
								sysUserName: wxUserInfo.nickName,
								comment: this.msg,
								createTime: new Date(),
								userPortait: wxUserInfo.avatarUrl
							});
							this.msg = '';
						} else if (+res.code === -99) {
							uni.showToast({
								icon: 'none',
								title: '活动已结束'
							});
						} else {
							uni.showToast({
								icon: 'error',
								title: res.msg
							});
						}
					})
					.finally(() => {
						this.look = false;
					});
			}
		}
	}
};
</script>

<style lang="scss">
.album {
	@include flex;
	align-items: flex-start;

	&__avatar {
		background-color: $u-bg-color;
		padding: 5px;
		border-radius: 3px;
	}

	&__content {
		padding: 0px 15px;
		// margin-left: 10px;
		// margin-bottom: 5px;
		flex: 1;
		image {
			width: 112px;
			height: 112px;
		}
	}
}
.shuXiangDetail {
	background: #ffffff;
	height: 100vh;
	width: 100vw;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	.head {
		padding-bottom: 15px;
		position: relative;
		.heatBox{
			position: absolute;
			left: 4px;
			bottom: 20px;
			display: flex;
			align-items: center;
			.userData{
				background: rgba(105, 19, 81, 0.6);
				border-radius: 86px;
				height: 42px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-left: 6px;
				padding-right: 16px;
				box-sizing: border-box;
				.left{
					display: flex;
					image{
						border: 1px solid rgba(0, 0, 0, 0.05);
						width: 30px;
						height: 30px;
						overflow: hidden;
						border-radius: 50%;
					}
					.nameBox{
						margin-left: 8px;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						text{
							&:first-child{
								color: #FFFFFF;
								font-weight: 700;
								font-size: 14px;
							}
							&:last-child{
								color: rgba(255, 255, 255, 0.7);
								font-size: 12px;
							}
						}
					}
				}
				.right{
					margin-left: 30px;
					image{
						width: 32px;
						height: 29px;
					}
				}
			}
			.numData{
				text{
					margin-left: 8px;
					font-weight: 900;
					font-size: 30px;
					color: #FFFFFF;
					text-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
					font-style:italic;
				}
			}
		}
	}
	.content {
		flex: 1;
		overflow-y: auto;
	}
	.u-album__row {
		> view {
			background-color: #3a3a3a;
		}
	}
	.work-box {
		height: 222px;
		width: 100%;
		background: #c4c4c4;
	}
	.work-list {
		width: 100vw;
	}
	.albumBox {
		padding: 0 15px;
		box-sizing: border-box;
	}
	.work-detail {
		width: 100%;
		.work-name {
			width: 100%;
			box-sizing: border-box;
			.top {
				padding: 0 15px;
				display: flex;
				align-items: center;
				.work-photo {
					width: 38px;
					height: 38px;
					border-radius: 50%;
					border: 1px solid rgba(0, 0, 0, 0.05);
					box-sizing: border-box;
				}
				.nameBox {
					width: 40px;
					flex: 1;
					span {
						font-size: 14px;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 16px;
						min-width: 60vw;
						display: block;
						margin-left: 8px;
						margin-top: 5px;
					}
					p {
						font-size: 10px;
						font-family: PingFang SC-Regular, PingFang SC;
						font-weight: 500;
						color: #b0b0b0;
						line-height: 12px;
						display: block;
						margin-left: 8px;
						margin-top: 5px;
					}
				}
			}
			.bottom {
				margin-top: 12px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 15px;
				.shareBtn {
					display: flex;
					justify-content: center;
					align-items: center;
					border: none;
					padding: 0 12px;
					white-space: nowrap;
					background: #ebf7ff;
					border-radius: 22.5px;
					height: 45px;
					margin: 0;
					flex: 1;
					margin-right: 5px;
					box-sizing: border-box;
					image {
						display: block;
						width: 24px;
						height: 24px;
					}
					text {
						margin-left: 4px;
						color: #289ff5;
						font-weight: 700;
						font-size: 16px;
					}
					&::before {
						border: none;
					}
					&::after {
						border: none;
					}
				}
				.work-vote {
					// width: 68px;
					box-sizing: border-box;
					margin-left: 5px;
					padding: 0 12px;
					height: 45px;
					display: flex;
					justify-content: center;
					align-items: center;
					background: #FFF2E2;
					border-radius: 22.5px;
					flex: 1;
					.icon {
						display: block;
						width: 24px;
						height: 24px;
					}
					text {
						margin-left: 6px;
						font-weight: 700;
						font-size: 16px;
						color: #fe5a6e;
						line-height: 14px;
					}
				}
			}
		}
		.workInfo {
			box-sizing: border-box;
			padding: 0 15px;
			display: flex;
			flex-direction: column;
			text {
				&:nth-child(1) {
					margin-top: 14px;
					font-weight: 700;
					font-size: 20px;
					color: #333333;
				}
				&:nth-child(2) {
					margin-top: 8px;
					color: #585858;
					font-size: 14px;
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
			background: #f6f6f6;
			border-radius: 0px 0px 0px 0px;
			margin-top: 15px;
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
	.setMsgBtn {
		position: fixed;
		box-sizing: border-box;
		bottom: 0;
		width: 100%;
		padding: 12px 15px;
		display: flex;
		justify-content: left;
		align-items: left;
		background: #ffffff;
		padding-bottom: 20px;
		// image {
		// 	width: 30px;
		// 	display: block;
		// 	height: 30px;
		// 	margin-left: 20px;
		// 	margin-top: 5px;
		// }
		.input {
			width: 85%;
			background: #f6f6f6;
			border-radius: 50px;
		}
		.btn {
			margin-left: 10px;
			background: linear-gradient(270deg, #ff8b02 5.36%, #ffaf51 100%);
			border-radius: 22px;
			width: 72px;
			height: 38px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 16px;
			color: #ffffff;
		}
	}
	.payInfo {
		width: 100%;
		padding: 0 15px;
		box-sizing: border-box;
		.payTitle {
			height: 44px;
			box-sizing: border-box;
			border-bottom: 1px solid #f6f7f9;
			display: flex;
			justify-content: center;
			align-items: center;
			text {
				font-weight: 500;
				color: #000000;
				font-size: 17px;
			}
		}
		.typeList {
			margin-top: 20px;
			display: flex;
			justify-content: space-between;
			.border {
				border-radius: 8px;
				width: 110px;
				height: 108px;
				overflow: hidden;
				background: #e8e8e8;
				padding: 2px;
				box-sizing: border-box;
				&.active {
					background: linear-gradient(90deg, rgba(254, 226, 177, 1), rgba(248, 186, 99, 1));
					.payItem {
						background: #fff7e2;
					}
				}
			}
			.payItem {
				width: 100%;
				height: 100%;
				background: #ffffff;

				border-radius: 8px;
				display: flex;
				flex-direction: column;
				align-items: center;
				view {
					&:first-child {
						margin-top: 14px;
						text {
							font-weight: 500;
							color: #585858;
							font-size: 14px;
						}
					}
					&:last-child {
						margin-top: 10px;
						text {
							font-weight: 500;
							color: #333333;
							&:first-child {
								font-size: 14px;
							}
							&:last-child {
								font-size: 26px;
							}
						}
					}
				}
			}
		}
		.btnBox {
			margin-top: 54px;
			button {
				border: none;
				background: linear-gradient(270deg, #f7a13e 5.36%, #fec685 100%);
				border-radius: 22px;
				color: #ffffff;
				font-weight: 400;
				font-size: 16px;
				margin-bottom: 4px;
				&::after {
					border: none;
				}
			}
		}
	}
}
</style>

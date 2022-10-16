<template>
	<view>
		<view class="videoBox">
			<my-video
				v-if="videoSrc2"
				:poster="schoolInfo.imagesUrl"
				:isTry="false"
				:vip="false"
				:amount="0.01"
				:src="schoolInfo.promotionalVideoUrl"
			></my-video>
			<image v-else  :src="schoolInfo.imagesUrl" mode=""></image>
		</view>
		<view class="content-wrap">
			<view class="school-info">
				<view class="top-box">
					<view class="title">{{ schoolInfo.name }}</view>
					<!-- <view class="collect-btn" >收藏</view> -->
				</view>
				<view class="middle-box">
					<ul>
						<li v-for="(item, index) in splitTags(schoolInfo.tag)" :key="index">{{ item }}</li>
					</ul>
				</view>
				<view class="botom-box">
					<view class="location">{{ schoolInfo.county }}-{{ schoolInfo.address }}</view>
				</view>
			</view>
			<view class="other-info">
				<view class="enter-school-node">
					<view class="title">幼升小入学节点</view>
					<view class="node-detail">
						<!-- <view class="node-item" v-for="(item,index) in enterSchoolNode" :key="index">
							<view class="name">
								<text>
									{{item.name}}
								</text>
								<view class="circle">
									<view class="dot"></view>
								</view>
							</view>
							<view class="date">
								{{item.date}}
							</view>
						</view>
						<view class="line" :style="{width:180 * (enterSchoolNode.length - 1) + 'px'}"></view> -->
						<view class="node-item" v-for="(item, index) in schoolInfo.enrollmentNodePos" :key="index">
							<view class="name">
								<text>{{ item.describe }}</text>
								<view class="circle"><view class="dot"></view></view>
							</view>
							<view class="date">{{ $u.timeFormat(new Date(item.startTime), 'mm,dd') }}-{{ $u.timeFormat(new Date(item.endTime), 'mm,dd') }}</view>
						</view>
						<view class="line" :style="{ width: 180 * (schoolInfo.enrollmentNodePos.length - 1) + 'px' }"></view>
					</view>
				</view>
				<view class="enroll-data">
					<view class="title">招生数据</view>
					<view class="year-list">
						<view class="name">年份</view>
						<view v-for="(item, index) in schoolInfo.enrollmentDataPos" :key="index">{{ item.year }}</view>
						<!-- <view v-for="(item,index) in createFiveYears().reverse()" :key="index">
							{{item.label}}
						</view> -->
					</view>
					<view class="class-num">
						<view class="name">新招生班级数</view>
						<view v-for="(item, index) in schoolInfo.enrollmentDataPos" :key="index">{{ item.totals }}</view>
					</view>
				</view>
				<view class="basic-info">
					<view class="title">学校基本信息</view>
					<view class="info-list">
						<view class="flex-box">
							<text class="name">学校地址：</text>
							<view class="box" @click="handleToMap">
								<text class="value stress address">{{ schoolInfo.address }}</text>
								<u-icon name="map" color="#F6A13E"></u-icon>
							</view>
						</view>
						<view>
							<text class="name">学段：</text>
							<text class="value">小学</text>
						</view>
						<view>
							<text class="name">直管单位：</text>
							<text class="value">{{ schoolInfo.straightPipeUnit }}</text>
						</view>
						<view>
							<text class="name">学校性质：</text>
							<text class="value">{{ schoolInfo.schoolNature == 1 ? '公立' : '私立' }}</text>
						</view>
						<view class="flex-box">
							<text class="name">学校电话：</text>
							<view class="box" @click="handleCall(schoolInfo.mobile)">
								<text class="value stress">{{ schoolInfo.mobile }}</text>
								<u-icon name="phone" color="#F6A13E"></u-icon>
							</view>
						</view>
					</view>
				</view>
				<view class="expert-eval" v-if="schoolInfo.evaluationVideoUrl">
					<view class="top-box">
						<view class="title">专家评测</view>
						<text>98%的人会选择收看专家的评价</text>
					</view>
					<view class="info-box">
						<view class="teacher-info">
							<view class="img-box"><image :src="schoolInfo.evaluatorImgUrl" mode=""></image></view>
							<view class="right-info">
								<view class="teacher-name">
									<text class="name">{{ schoolInfo.evaluator }}</text>
									<view class="view-btn">立即查看</view>
								</view>
								<view class="teacher-title">{{ schoolInfo.evaluatorTag }}</view>
							</view>
						</view>
						<view class="video-box video-box2" :style="{ height: videoHeight }">
							<view class="videoVIew" v-if="!videoSrc">
								<image :src="schoolInfo.imagesUrl" mode=""></image>
								<view class="playBtn" @click="playVideo(videoSrc)"><image src="../../static/image/play.png" mode=""></image></view>
							</view>
							<my-video v-else :poster="schoolInfo.imagesUrl" :vip="true" :amount="0.01" :src="videoSrc"></my-video>
						</view>
					</view>
				</view>
				<view class="consult-team">
					<view class="top-box">
						<view class="title">咨询团队</view>
						<view class="more-btn">
							更多
							<u-icon name="arrow-right" size="12px"></u-icon>
						</view>
					</view>
					<view class="team-list">
						<ul>
							<li v-for="item in kefuItem" :key="item.url" @click="openKf(item.url)">
								<image :src="item.pic" mode="aspectFill"></image>
								<text class="name">{{ item.name }}</text>
								<text class="title">{{ item.title }}</text>
								<view class="btn">问问TA</view>
							</li>
						</ul>
					</view>
				</view>
				<view class="parent-eval">
					<view class="top-box">
						<view class="title">家长评价({{ schoolInfo.commentNums }})</view>
						<view class="more-btn" @click="openMsg">
							查看全部
							<u-icon name="arrow-right" size="12px"></u-icon>
						</view>
					</view>
					<view class="eval-list-box">
						<view class="eval-item" v-for="item in msgList" :key="item.uuid">
							<view class="img-box"><image :src="item.userPortait" mode=""></image></view>
							<view class="eval-content">
								<view class="name">{{ item.sysUserName }}</view>
								<view class="date">{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd') }}</view>
								<view class="content">{{ item.comment }}</view>
							</view>
						</view>
					</view>
					<view class="eval-btn" @click="openSendMsg">我要评价</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import myVideo from '../../components/myVideo.vue';
import { createFiveYears } from '../../base/common.js';
import { getSchoolDetails } from '../../api/school.js';
import { getMsgList } from '../../api/message.js';
import { getProducts, getVideoStatus } from '../../api/pay.js';
export default {
	data() {
		return {
			enterSchoolNode: [],
			createFiveYears,
			schoolInfo: {},
			videoHeight: '',
			msgList: [],
			kefuItem: [
				{
					name: '王林',
					title: '金树丫主编',
					pic: '../../static/image/kf/1.jpg',
					url: 'https://work.weixin.qq.com/kfid/kfc6ca09b572a772423'
				},
				{
					name: '贺辉',
					title: '升学规划师',
					pic: '../../static/image/kf/3.jpg',
					url: 'https://work.weixin.qq.com/kfid/kfc6bc1d0f1e0b9d659'
				},
				{
					name: '李绍贤',
					title: '学区专家',
					pic: '../../static/image/kf/2.jpg',
					url: 'https://work.weixin.qq.com/kfid/kfcda054a17650ecd65'
				}
			],
			//评测视频价格
			products: {},
			//宣传视频价格
			products2: {},
			productType: 'SchVideo',
			videoSrc: '',
			videoSrc2: '',
		};
	},
	components: {
		myVideo
	},
	computed: {
		isLogin: function() {
			let status = false;
			if (this.$store.getters) {
				status = this.$store.getters.userId && this.$store.getters.token;
			}
			return status;
		},
		vipInfo: function() {
			if (this.$store.getters) {
				return this.$store.getters.vipInfo;
			} else {
				return {};
			}
		}
	},
	onLoad(opt) {
		
	},
	onShow() {
		this.schoolInfo = JSON.parse(uni.getStorageSync('schoolInfo'));
		
		uni.setNavigationBarTitle({
			title: this.schoolInfo.name
		});
		this.getSchoolDetails();
		this.getProducts();
		this.getMsgList();
	},
	onReady() {
		const that = this;
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.video-box2')
			.boundingClientRect(data => {
				// console.log("得到布局位置信息" + JSON.stringify(data));
				// console.log("节点离页面顶部的距离为" + data.top);
				if (data) {
					that.videoHeight = data.width / 1.7777777 + 'px';
				}
			})
			.exec();
	},
	methods: {
		//播放评测视频
		playVideo(src) {
			const that = this;
			if(!src) {
				uni.showModal({
					title: '提示',
					content: '观看视频需要购买视频或会员',
					cancelText: '购买会员',
					confirmText: '购买视频',
					confirmColor: '#000000',
					success: e => {
						if (e.confirm) {
							console.log('购买视频');
							that.sendPay();
						}
						if (e.cancel) {
							console.log('购买会员');
							uni.navigateTo({
								url: '../vip/vip'
							})
						}
					},
					fail: () => {}
				});
			}
			
		},
		//获取商品价格列表
		getProducts() {
			getProducts({
				productType: this.productType,
				schoolId: this.schoolInfo.id
			}).then(res => {
				if (+res.code === 0) {
					this.products = res.data.find(item => +item.videoType === 1);
					this.products2 = res.data.find(item => +item.videoType === 0);
				}
			});
		},
		//购买视频
		sendPay() {
			uni.showLoading({
				mask: true,
				title: '支付中'
			});this.productType, this.products.id, 1
			this.$Pay({
				productType: this.productType,
				productId: this.products.id,
				number: 1
			}).then(e => {
					console.log(e);
					uni.showToast({
						icon: 'none',
						title: '购买成功'
					})
					this.getIsPayVideo()
				})
				.catch(e => {
					uni.showToast({
						icon: 'none',
						title: '支付失败'
					});
				})
				.finally(() => {
					uni.hideLoading();
				});
		},
		//判断购买视频
		getIsPayVideo() {
			return new Promise((resolve, reject) => {
				getVideoStatus({
					schoolId: this.schoolInfo.id
				}).then(res => {
					if(+res.code === 0) {
						if(!res.data) {
							reject()
						} else {
							console.log(res.data);
							//判断是否购买评测视频
							const data = res.data.find(item => item.videoType === this.products.videoType)
							if(data) {
								this.videoSrc = this.schoolInfo.evaluationVideoUrl
							}
							//判断是否购买宣传视频
							const data2 = res.data.find(item => item.videoType === this.products2.videoType)
							if(data2) {
								this.videoSrc2 = this.schoolInfo.promotionalVideoUrl
							}
							resolve(res.data)
						}
					} else {
						reject()
					}
				})
			})
			
		},
		//获取评论列表
		getMsgList() {
			getMsgList({
				pageNo: 1,
				pageSize: 4,
				relatedId: this.schoolInfo.id
			}).then(res => {
				if (+res.code === 0) {
					this.msgList = res.data.list;
				}
				// console.log(res);
			});
		},
		// 转换学校标签格式
		splitTags(tag) {
			if (typeof tag === 'string') {
				let arr = [];
				return (arr = tag.split(/[,，]/));
			} else {
				return [];
			}
		},
		// 打电话
		handleCall(number) {
			uni.makePhoneCall({
				phoneNumber: number
			});
		},
		// 导航
		handleToMap() {
			uni.openLocation({
				latitude: Number(this.schoolInfo.latitude),
				longitude: Number(this.schoolInfo.longitude),
				name: this.schoolInfo.name,
				address: this.schoolInfo.address
			});
		},
		//打开全部评论
		openMsg() {
			// uni.setStorageSync('schoolInfo', JSON.stringify(this.schoolInfo));
			uni.navigateTo({
				url: '../comment/comment'
			});
		},
		//查询学校详情
		getSchoolDetails() {
			getSchoolDetails({
				id: this.schoolInfo.id
			}).then(res => {
				console.log(res);
				if(+res.code === 0) {
					if(!this.vipInfo.isVip) {
						this.getIsPayVideo()
					} else {
						this.videoSrc = res.data.evaluationVideoUrl
						this.videoSrc2 = res.data.promotionalVideoUrl
					}
				}
			});
		},
		//打开评价界面
		openSendMsg() {
			if (!this.isLogin) {
				uni.showToast({
					icon: 'none',
					title: '请登录'
				});
				return;
			}
			uni.setStorageSync('schoolInfo', JSON.stringify(this.schoolInfo));
			uni.navigateTo({
				url: '../comment/comment?isSend=true'
			});
		},
		//联系客服
		openKf(url) {
			if (!this.isLogin) {
				uni.showToast({
					icon: 'none',
					title: '请登录'
				});
				return;
			}
			//#ifdef MP-WEIXIN
			wx.openCustomerServiceChat({
				extInfo: {
					url: url
				},
				corpId: 'wwcd87c23fa5690ca1',
				showMessageCard: false
			});
			//#endif
		}
	}
};
</script>

<style lang="scss">
.videoBox {
	width: 100vw;
	height: calc(100vw / 1.7777);
	image {
		width: 100%;
		height: 100%;
	}
}
.content-wrap {
	-webkit-overflow-scrolling: touch;
	.title {
		font-size: 18px;
		font-weight: 500;
		color: #333333;
	}
	.school-info {
		padding: 16px 15px 14px;
		border-bottom: 1px solid #f6f7f9;
		.top-box {
			display: flex;
			align-items: center;
			justify-content: space-between;
			.collect-btn {
				width: 50px;
				height: 21px;
				line-height: 21px;
				text-align: center;
				background: #f8ab51;
				border-radius: 88px;
				font-size: 12px;
				color: #ffffff;
			}
		}
		.middle-box {
			margin-top: 8px;
			> ul {
				display: flex;
				flex-wrap: wrap;
				> li {
					padding: 2px 8px;
					background: #f4fbff;
					font-size: 11px;
					color: #a6a6a6;
					margin-right: 8px;
					margin-bottom: 8px;
					border-radius: 4px;
				}
			}
		}
		.botom-box {
			.location {
				font-size: 12px;
				color: #b4b4b4;
			}
		}
	}
	.other-info {
		padding: 16px 15px;
		.enter-school-node {
			margin-bottom: 16px;
			.node-detail {
				margin-top: 12px;
				padding: 10px 20px 12px;
				background: #f4fbff;
				border-radius: 5px;
				color: #f6a13e;
				font-size: 10px;
				overflow-x: auto;
				display: flex;
				position: relative;
				.node-item {
					margin-right: 50px;
					display: flex;
					flex-direction: column;
					align-items: center;
					&:nth-last-child(2) {
						margin-right: 0;
					}
					.name {
						// height: 44px;
						height: 30px;
						text-align: center;
						margin-bottom: 6px;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: space-between;
						overflow: hidden;
						> text {
							display: -webkit-box;
							overflow: hidden;
							text-overflow: ellipsis;
							// -webkit-line-clamp: 2;
							-webkit-line-clamp: 1;
							-webkit-box-orient: vertical;
						}
						.circle {
							margin-top: 6px;
							width: 10px;
							height: 10px;
							background: #f8ab51;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							z-index: 2;
							.dot {
								width: 4px;
								height: 4px;
								background: #ffffff;
								border-radius: 50%;
							}
						}
					}
					.date {
						text-align: center;
						min-width: 130px;
						&:last-child {
							margin-right: 0;
						}
					}
				}
				.line {
					height: 2px;
					background: #569bec;
					position: absolute;
					left: 85px;
					// top: 48px;
					top: 34px;
				}
			}
		}
		.enroll-data {
			margin-bottom: 20px;
			.year-list {
				padding: 6px 20px 6px 24px;
				background: #f4fbff;
				border-radius: 5px 5px 0px 0px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 10px;
				font-weight: 500;
				color: #333333;
				margin: 12px 0 8px;
				.name {
				}
			}
			.class-num {
				font-size: 10px;
				color: #585858;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 19px;
				.name {
					width: 30px;
				}
			}
		}
		.basic-info {
			margin-bottom: 20px;
			.info-list {
				margin-top: 12px;
				> view {
					font-size: 13px;
					margin-bottom: 10px;
					&:last-child {
						margin-bottom: 0;
					}
				}
				.name {
					width: 65px;
					color: #585858;
					display: inline-block;
				}
				.value {
					color: #333333;
				}
				.stress {
					color: #f6a13e;
				}
				.address {
					max-width: 250px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.flex-box {
					display: flex;
					align-items: center;
					.box {
						display: flex;
						align-items: center;
						line-height: 15px;
					}
				}
			}
		}
		.expert-eval {
			margin-bottom: 20px;
			.top-box {
				display: flex;
				align-items: center;
				margin-bottom: 12px;
				> text {
					font-size: 10px;
					color: #585858;
					margin-left: 8px;
				}
			}
			.info-box {
				background: linear-gradient(129deg, #fff4d8 0%, #ffe6bf 100%);
				border-radius: 5px;
				padding: 12px 8px 10px;
				.teacher-info {
					display: flex;
					margin-bottom: 12px;
					.img-box {
						margin-right: 16px;
						width: 42px;
						height: 42px;
						border: 2px solid #ffffff;
						border-radius: 50%;
						box-sizing: border-box;
						> image {
							width: 42px;
							height: 42px;
							border-radius: 50%;
						}
					}
					.right-info {
						flex-grow: 1;
						.teacher-name {
							display: flex;
							align-items: center;
							justify-content: space-between;
							margin-bottom: 5px;
							.name {
								font-size: 14px;
								font-weight: 500;
								color: #333333;
							}
							.view-btn {
								padding: 3px 9px;
								background: #f6a13e;
								border-radius: 11px;
								font-size: 12px;
								color: #ffffff;
							}
						}
						.teacher-title {
							font-size: 12px;
							color: #585858;
						}
					}
				}
				.video-box {
					width: 100%;
					height: calc(100% / 1.7777);
					border-radius: 5px;
					.videoVIew {
						width: 100%;
						height: 100%;
						position: relative;
						image {
							width: 100%;
							height: 100%;
						}
						.playBtn {
							position: absolute;
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							z-index: 1;
							width: 46px;
							height: 46px;
						}
					}
				}
			}
		}
		.consult-team {
			margin-bottom: 20px;
			.top-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;

				.more-btn {
					display: flex;
					align-items: center;
					font-size: 12px;
					color: #585858;
					line-height: 14px;
				}
			}
			.team-list {
				> ul {
					display: flex;
					justify-content: space-between;
					> li {
						padding: 12px 23px 10px;
						background: #ffffff;
						box-shadow: 0px 4px 8px 1px rgba(0, 0, 0, 0.04);
						margin-right: 8px;
						display: flex;
						flex-direction: column;
						align-items: center;
						&:last-child {
							margin-right: 0;
						}
						> image {
							width: 42px;
							height: 42px;
							border-radius: 50%;
							margin-bottom: 8px;
						}
						.name {
							font-size: 14px;
							font-weight: 500;
							color: #333333;
							margin-bottom: 2px;
						}
						.title {
							font-size: 10px;
							color: #b0b0b0;
							margin-bottom: 6px;
						}
						.btn {
							width: 64px;
							height: 22px;
							line-height: 22px;
							text-align: center;
							background: #f6a13e;
							border-radius: 11px;
							font-size: 11px;
							color: #ffffff;
						}
					}
				}
			}
		}
		.parent-eval {
			.top-box {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;

				.more-btn {
					display: flex;
					align-items: center;
					font-size: 12px;
					color: #585858;
					line-height: 14px;
				}
			}
			.eval-list-box {
				margin-bottom: 30px;
				.eval-item {
					margin-bottom: 16px;
					display: flex;
					&:last-child {
						margin-bottom: 0;
					}
					.img-box {
						width: 38px;
						height: 38px;
						border-radius: 50%;
						margin-right: 8px;
						> image {
							width: 38px;
							height: 38px;
							border-radius: 50%;
						}
					}
					.eval-content {
						flex-grow: 1;
						.name {
							font-size: 14px;
							font-weight: 500;
							color: #333333;
							margin-bottom: 4px;
						}
						.date {
							font-size: 10px;
							color: #b0b0b0;
							margin-bottom: 8px;
						}
						.content {
							font-size: 14px;
							color: #585858;
							line-height: 16px;
						}
					}
				}
			}
			.eval-btn {
				width: 100%;
				height: 44px;
				background: #f6a13e;
				border-radius: 22px;
				font-size: 16px;
				font-weight: 500;
				color: #ffffff;
				line-height: 44px;
				text-align: center;
			}
		}
	}
}
</style>

<template>
	<view class="shuXiangBox">
		<view class="shuXiangImg" @click="openDatail"><image src="../static/image/img.png" mode="widthFix"></image></view>
		<!-- <view class="shuXiangInfo">
			<view class="infoTitle"><text>书香天府 - 我读我秀阅读比赛（海选）</text></view>
			<view class="shuXiangTime">
				<text v-if="isActivityEnd">已结束</text>
				<text v-if="!isActivityEnd">进行中 | 距离截至{{activityTimeText}}</text>
			</view>
			<view class="infoText">
			</view>
			<view class="infoBtnBox">
				<button class="infoBtn" @click="openDatail">
					比赛详情介绍
					<u-icon name="arrow-right" size="12px"></u-icon>
				</button>
			</view>
		</view> -->
		<view class="shuXiangInfoBox">
			<view class="timeBox">
				<view class="top">
					<text v-if="isActivityEnd">已结束</text>
					<text v-if="!isActivityEnd">进行中</text>
				</view>
				<view class="button" v-if="!isActivityEnd">
					<text>距离截止</text>
					<text class="num">{{ activityTimeText }}</text>
				</view>

				<!-- <text>天</text> -->
			</view>
			<view class="btnBox" v-if="isReady && !isActivityEnd && isActiveityStart">
				<view @click="toSignUp" v-if="signStatus === 0 && !isSignEnd">立即报名</view>
				<view @click="toSignUp" v-if="signStatus === 1">立即投稿</view>
			</view>
		</view>
		<view class="screenBox">
			<view class="screenItem" @click="selectTab(1)" :class="{ active: activeType === 1 }" >
				<text>{{ groupList[formData.groupType - 1] }}</text>
				<u-icon name="arrow-up-fill" size="10px"></u-icon>
			</view>
			<view class="screenItem" @click="selectTab(2)" :class="{ active: activeType === 2 }">
				<text>{{ formData.division }}</text>
				<u-icon name="arrow-up-fill" size="10px"></u-icon>
			</view>
			<view class="screenItem" @click="selectTab(3)" :class="{ active: activeType === 3 }">
				<text>{{ sort === 0?'最高热度':'最新发布' }}</text>
				<u-icon name="arrow-up-fill" size="10px"></u-icon>
			</view>
		</view>

		<view style="margin-bottom: 50px;">
			<view class="work-list">
				<view class="work-item" v-for="(item, index) in list" :key="index" @click="selectWork(item)">
					<view class="tan-list-box">
						<view class="tan-img-pic"><image :src="item.worksCover" mode="widthFix"></image></view>
						<view class="tan-list-title">{{ item.worksTitle }}</view>
						<view class="tan-list-info">
							<image :src="item.headerImg"></image>
							<span>{{ item.publishName }}</span>
							<view class="vote">
								<text>{{ item.pointCount }}</text>
								<u-icon class="heart" color="#FF7D6B" name="heart-fill" size="17px"></u-icon>
							</view>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore :status="listStatus"></u-loadmore>
		</view>

		<view class="setMsgBtn" v-if="isReady && !isActivityEnd && isActiveityStart">
			<button @click="toSignUp" v-if="enroll === 0 && !isSignEnd">立即报名</button>
			<button @click="toSignUp" v-if="enroll !== 0">立即投稿</button>
		</view>
		<region ref="region" @select="selectDivision"></region>
		<u-popup :show="show" :round="10" mode="bottom" class="detail">
			<view class="textInfoBox">
				<view class="detail-title">
					<image @click="closeDetail" src="../../static/common/close.png" class="close"></image>
					<span class="title">比赛详情</span>
				</view>
				<view class="detail-content">
					<view class="title">书香天府 - 我读我秀阅读比赛 （海选）</view>
					<view class="time">
						<text v-if="isActivityEnd">已结束</text>
						<text v-if="!isActivityEnd">进行中 | 距离截至{{ activityTimeText }}</text>
					</view>
					<view class="info">
						<text>
							在四川省妇女联合会指导下，四川省早期教育行业协会联合四川省儿童活动中心、四川电视台等单位已成功举办了五届绘本阅读大赛，得到社会各界好评。今年，我们将坚持打造“书香天府我读我秀”这一具有影响力的亲子阅读品牌，延续“书香家庭、书香校园、书香社会”的良好氛围，经组委会讨论报省妇联批准，决定举办2022年第六届“书香天府我读我秀”阅读大赛系列活动。本次活动以“阅读—思考—表达，展示风采喜迎党的二十大”为主题，希望广大亲子家庭、各相关单位积极参与，赛出水平秀出风采。
						</text>
						<text class="info-title">比赛时间</text>
						<span>报名时间：2022年4月23日-{{ signEndTime }}</span>
						<span>海选时间：2022年4月23日-{{ activityEndTime }}</span>
						<span>分区决赛：2022年6月5日</span>
						<span>总决赛时间：2022年6月26日</span>
						<text class="info-title">比赛规则及奖励</text>
						<span>（一）组别</span>
						<span>A组：0-2岁、个人作品</span>
						<span>B组：0-2岁、团体作品</span>
						<span>C组：3-6岁、个人作品</span>
						<span>D组：3-6岁、团体作品</span>
						<span>（二）分区海选</span>
						<span>
							1.在活动指定金树丫（微信搜索金树丫）小程序上传阅读绘本或创作绘本及表演绘本故事的视频（单个作品限8分钟内）、图片（单个作品限10张内）、音频（单个作品限8分钟内）等作品，通过投稿、点赞、评论等获取积分。
						</span>
						<span>
							2.线上各组排名前20名进入复选，兑换排名积分：1-5名得100分，6-10名得95分，11-15名得90分，16-20名得85分；复选由专业评委评分，排名积分占比50%，评委评分占比50%，按照总分进行最终排名。
						</span>
						<span>3.各分赛区A、B、C、D各组前10名进入分区决赛，并获得总决赛门票。</span>
						<span>4.设置优秀作品奖若干（前30%）、优秀组织奖若干名，颁发荣誉证书及奖品。</span>
						<span>（三）分区决赛</span>
						<span>1.具体比赛时间及地点另行通知，现场表演（以绘本朗诵、演讲及舞台剧等形式为主），评委当场亮分，当天进行表彰。</span>
						<span>
							2.若遇疫情等不可抗力因素，则采用线上评比形式，在参赛平台上传提交分区决赛作品（作品为10分钟以内视频），线上积分占比50%，评委评分占比50%，进行总计分评奖，择期表彰。
						</span>
						<span>（四）分区决赛奖项及奖品</span>
						<span>（1）作品奖项评选</span>
						<span>1.作品评选各组冠亚季军各1名，颁发奖杯、荣誉证书和奖品；一等奖1名、二等奖2名、三等奖4名，颁发荣誉证书和奖品；分区决赛各组冠军进入总决赛。</span>
						<span>（2）参赛单位奖项评选</span>
						<span>2.优秀领队、优秀指导老师、优秀组织单位各10名，颁发荣誉证书和奖品。</span>
						<text class="info-title">亲子盛典暨阅读大赛总决赛</text>
						<span>1、具体比赛时间地点另行通知，决赛盛典分组别完成参赛作品表演展示，表演顺序由赛前抽签决定；评委当场亮分，当天进行表彰。</span>
						<span>
							2、若遇疫情等不可抗力因素，则采用线上评比形式，在参赛平台上传提交总决赛作品（作品为15分钟以内视频），线上积分占比50%，评委评分占比50%，进行总计分评奖，择期表彰。
						</span>
						<span>3、总决赛奖项及奖品</span>
						<span>（1）作品奖项评选</span>
						<span>一等奖2名、二等奖4名、三等奖8名，颁发奖杯、荣誉证书和奖品；优秀作品奖若干，颁发荣誉证书和奖品。</span>
						<span>（2）参赛单位奖项评选</span>
						<span>优秀领队若干、优秀指导老师若干，颁发荣誉证书和奖品；优秀组织单位若干，颁发奖牌、荣誉证书和奖品。</span>
					</view>
				</view>
			</view>
		</u-popup>
		<ad-box ref="ad"></ad-box>
	</view>
</template>

<script>
import region from '../components/region.vue';
import { group } from '../base/config.js';
import { getEroStatus, getWorkList, getAd, getActivityInfo } from '../../api/shuxiang.js';
import { wxBtoa } from '../../base/common.js';
// import amap from '../../sdk/amap-wx.130.js';
import adBox from '../components/adBox.vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
export default {
	data() {
		return {
			show: false,
			groupList: group.map(item => `${item.title}组-${item.type}作品`),
			pageForm: {
				pageNo: 1,
				pageSize: 15
			},
			formData: {
				division: '成都市',
				groupType: 3
			},
			triggered: false,
			list: [],
			enroll: 0,
			sort: 0,
			listStatus: 'loading',
			userAd: [],
			adList: [],
			isReady: false,
			endSignTime: '2022-05-20 24:00:00',
			userDivision: '成都市',
			isSignEnd: false,
			signTimeText: '',
			signEndTime: '',
			isActivityEnd: false,
			isActiveityStart: true,
			activityTimeText: '',
			activityEndTime: '',
			signStatus: 0
		};
	},
	computed: {
		isLogin: function() {
			let status = false;
			if (this.$store.getters) {
				status = this.$store.getters.userId && this.$store.getters.token;
			}
			return status;
		}
	},
	components: {
		region,
		adBox
	},
	onReachBottom() {
		this.pageForm.pageNo++;
		this.getWorkList();
	},
	onShow() {
		if (this.isLogin) {
			this.getUserStatus();
		}
		if (this.formData.division) {
			this.getWorkList();
		}
	},
	onLoad() {
		//#ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		//#endif

		this.getActivityInfo();
		this.isEndSign = dayjs().valueOf() > dayjs(this.endSignTime).valueOf();
		const that = this;
		this.getLocation();
		// this.openAd();
		// that.serachList();
		const eventChannel = this.getOpenerEventChannel();
		uni.$on('signSuccess', () => {
			that.openAd();
		});
		uni.$on('sendWork', () => {
			that.openAd();
		});
	},

	methods: {
		myIsNaN(value) {
			console.log(value, typeof value === 'number' && !isNaN(value));
			return typeof value === 'number' && !isNaN(value);
		},
		getActivityInfo() {
			getActivityInfo().then(res => {
				if (+res.code === 0) {
					const signEndTime = dayjs(res.data.signEndTime).valueOf();
					const activityEndTime = dayjs(res.data.submitEndTime).valueOf();
					this.isSignEnd = dayjs().valueOf() > signEndTime;
					this.signTimeText = dayjs().to(signEndTime, true);
					this.signEndTime = dayjs(signEndTime).format('YYYY年M月DD日');

					this.activityTimeText = dayjs(activityEndTime).toNow(true);
					console.log(this.activityTimeText);
					// this.activityTimeText = dayjs(activityEndTime).toNow( true).split('')
					// this.activityTimeText = this.activityTimeText.filter(item =>this.myIsNaN(+item)).join('')
					// console.log(this.activityTimeText);
					// this.activityTimeText = dayjs().subtract(7, 'day')
					this.isActivityEnd = dayjs().valueOf() > activityEndTime;
					this.activityEndTime = dayjs(activityEndTime).format('YYYY年M月DD日');
					this.isActiveityStart = dayjs().valueOf() > dayjs('2022-04-23 00:00:00').valueOf();
				}
			});
		},
		getAd() {
			getAd({
				division: this.formData.division,
				enableStatus: 1,
				pageSize: 999,
				division: this.userDivision
			}).then(res => {
				if (+res.code === 0) {
					this.adList = res.data.list;
				}
			});
		},
		openAd() {
			const adList = this.adList.filter(ad => +ad.isRepeat === 1 || this.userAd.indexOf(ad.id) === -1);
			if (adList?.length > 0) {
				const i = Math.floor(Math.random() * adList.length);
				const adInfo = adList[i];
				if (adInfo.link) {
					adInfo.src = wxBtoa(adInfo.link);
				}
				// adInfo.src = adInfo.link
				this.$refs.ad.init(adInfo);
			}
		},
		getLocation() {
			const that = this;
			// if (uni.getStorageSync('location')) {
			// 	const e = JSON.parse(uni.getStorageSync('location'));
			// 	const location = e.regeocodeData;
			// 	const city = location.addressComponent.city;
			// 	const district = location.addressComponent.district;
			// 	that.formData.division = city === '成都市' ? `成都市` : `${city}-全部`;
			// 	that.serachList();
			// } else {
			// 	const amapPlugin = new amap.AMapWX({
			// 		key: '8b7ad04c932db43c9c8219563d0bccf7'
			// 	});
			// 	amapPlugin.getRegeo({
			// 		success: data => {
			// 			const e = data[0];
			// 			uni.setStorageSync('location', JSON.stringify(e));
			// 			const location = e.regeocodeData;
			// 			const city = location.addressComponent.city;
			// 			const district = location.addressComponent.district;
			// 			that.formData.division = city === '成都市' ? `${city}-${district}` : `${city}-全部`;
			// 			that.serachList();
			// 		}
			// 	});
			// }
			if(this.userDivision) {
				this.formData.division = this.userDivision
				if(this.userDivision.indexOf('成都')>-1){
					this.formData.division = '成都市'
				}
			}
		},
		//按组别筛选
		openSelectGroup() {
			const that = this;
			uni.showActionSheet({
				itemList: group.map(item => `${item.title}组-${item.type}作品(${item.age})`),
				success: e => {
					// const group = group[e.tapIndex]
					that.formData.groupType = ++e.tapIndex;
					that.serachList();
				}
			});
		},
		// 查询报名状态
		getUserStatus() {
			let id = uni.getStorageSync('userId') || '';
			if (id) {
				getEroStatus(id).then(res => {
					if (+res.code === 0) {
						this.isReady = true;
						this.signStatus = res.data.signStatus;
						if (res.data.signStatus === 1) {
							// 	this.getAd()
							this.userAd = res.data.ads || [];
							this.userDivision = res.data.division;
						}
						this.getAd();
						this.enroll = res.data.groupType ? res.data.groupType : 0;
						uni.setStorageSync('signStatus', this.enroll);
					}
				});
			}
		},
		serachList() {
			this.list = [];
			this.pageForm.pageNo = 1;
			this.getWorkList();
		},
		onPulling(e) {
			// console.log('onpulling', e.detail.dy);
		},
		//搜索作品
		onRefresh() {
			this.list = [];
			this.pageForm.pageNo = 1;
			this.triggered = true;
			this.getWorkList();
		},
		onRestore() {
			this.triggered = 'restore'; // 需要重置
			console.log('onRestore');
		},
		onAbort() {
			console.log('onAbort');
		},
		//加载后一页数据
		getListData() {
			this.pageForm.pageNo++;
			this.getWorkList();
		},
		getWorkList() {
			let params = {
				pageNo: this.pageForm.pageNo,
				pageSize: this.pageForm.pageSize,
				groupType: this.formData.groupType,
				division: this.formData.division,
				sort: this.sort
			};
			this.listStatus = 'loading';
			getWorkList(params)
				.then(res => {
					if (res.code === 0) {
						const page = res.data.page;
						if (this.pageForm.pageNo === 1) {
							this.list = res.data.list;
						} else {
							this.list = this.list.concat(res.data.list);
						}
						if (res.data.list.length > 0) {
							this.pageForm.pageNo = res.data.page.pageNo;
						} else {
							this.pageForm.pageNo--;
							this.listStatus = 'nomore';
						}
						this.triggered = false;
					}
				})
				.finally(() => {
					this.listStatus = 'nomore';
				});
		},
		// 地区选择
		selectDivision(data) {
			this.formData.division = data.value[0].label + '-' + data.value[1].label;
			this.serachList();
			if (this.enroll !== 0) {
				this.getAd();
			}
		},
		openDatail() {
			this.show = true;
		},
		closeDetail() {
			this.show = false;
		},
		selectSortType() {
			const that = this
			uni.showActionSheet({
				itemList: ['最高热度','最新发布'],
				success: e => {
					console.log(e);
					that.sort = e.tapIndex
					that.serachList()
				}
			})
		},
		selectTab(type) {
			switch (+type) {
				case 1:
					this.openSelectGroup();
					break;
				case 2:
					this.$refs.region.init(this.formData.division);
					break;
				case 3:
					this.selectSortType()
					break;
				default:
					break;
			}
			// this.$refs.region.init()
		},
		//前往报名
		toSignUp() {
			if (!this.isLogin) {
				uni.showToast({
					icon: 'none',
					title: '未登录，请登录'
				});
				uni.switchTab({
					url: '/pages/user/user'
				});
				return false;
			}
			if (+this.enroll === 0) {
				uni.showActionSheet({
					itemList: ['个人报名', '团体报名'],
					success: e => {
						if (+e.tapIndex === 0) {
							console.log('个人报名');
							uni.navigateTo({
								url: '../signUp/signUp'
							});
						}
						if (+e.tapIndex === 1) {
							console.log('团体报名');
							uni.navigateTo({
								url: '../groupSignUp/groupSignUp'
							});
						}
					}
				});
			} else {
				uni.navigateTo({
					url: '../upload/upload',
					fail: res => {
						console.log(res); //打印错误信息
					}
				});
			}
		},
		selectWork(item) {
			uni.navigateTo({
				url: `shuXiangDetail?id=${item.id}`,
				success: res => {
					// res.eventChannel.emit('workInfo', item);
				},
				fail: res => {
					console.log(res); //打印错误信息
				}
			});
			// uni.setStorageSync('workInfo', JSON.stringify(item));

			//   uni.navigateTo({
			//     url: `../schoolDetails/schoolDetails`
			//   });
			//   uni.navigateTo({
			//     url: `./shuXiangDetail.vue`
			//   });
		}
	}
};
</script>

<style lang="scss">
.shuXiangBox {
	background: #f6f7f9;
	min-height: 100vh;
	width: 100vw;

	@media screen and (min-width: 700px) and (max-width: 1023.98px) {
		.work-list {
			width: 100vw;
			columns: 3;
			column-gap: 20px;
		}
	}

	.work-list {
		width: 100%;
		min-height: 1vh;
		columns: 2;
		column-gap: 10px;
		padding: 30px 15px;
		box-sizing: border-box;
		.work-item {
			width: 100%;
			break-inside: avoid;
			margin-top: 0px;
			margin-bottom: 10px;
		}
	}

	.textInfoBox {
		height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.detail-title {
		display: flex;
		width: 100%;
		height: 44px;
		border-bottom: 1px solid #f6f7f9;

		.close {
			width: 16px;
			height: 16px;
			display: block;
			margin-top: 20px;
			margin-left: 15px;
		}

		.title {
			width: 100px;
			margin: auto;
			font-weight: 550;
			font-size: 17px;
			margin-top: 10px;
		}
	}

	.detail-content {
		box-sizing: border-box;
		padding: 15px;
		flex: 1;
		overflow-y: auto;
		// height: 500px;
		// overflow: scroll;
		.title {
			font-size: 18px;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 550;
			color: #333333;
		}

		.time {
			margin-top: 6px;

			text {
				color: #f6a13e;
				font-size: 14px;
			}
		}

		.info {
			margin-top: 48px;
			display: flex;
			flex-direction: column;

			text {
				color: #585858;
				font-size: 14px;
				line-height: 22px;
				&:first-child {
					margin-bottom: 20px;
				}
			}

			.info-title {
				font-size: 14px;
				margin-top: 20px;
				font-weight: 550;
				color: #333333;
			}

			span {
				color: #585858;
				font-size: 14px;
				line-height: 22px;

				&:first-child {
					margin-bottom: 20px;
				}
			}
		}
	}

	.shuXiangImg {
		background: #ffffff;
		width: 100vw;
		display: flex;
		// height: calc(100vw * 0.592);
		image {
			width: 100%;
			// height: 100%;
		}
	}

	.shuXiangInfo {
		background: #ffffff;
		box-sizing: border-box;
		padding: 10px 15px 12px;

		.infoTitle {
			text {
				font-weight: 500;
				color: #333333;
				font-size: 18px;
			}
		}

		.shuXiangTime {
			margin-top: 6px;

			text {
				color: #f6a13e;
				font-size: 14px;
			}
		}

		.infoText {
			margin-top: 12px;
			display: flex;
			flex-direction: column;

			text {
				color: #585858;
				font-size: 14px;

				&:first-child {
					margin-bottom: 20px;
				}
			}
		}

		.infoBtnBox {
			margin-top: 6px;

			button {
				box-sizing: border-box;
				// height: 50px;
				border: none;
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: 500;
				color: #585858;
				background: #ffffff;
				font-size: 12px;

				margin: 0;
				&::after {
					border: none;
				}

				&::after {
					border: none;
				}
			}
		}
	}

	.shuXiangInfoBox {
		height: 60px;
		width: 100%;
		background: #fe5a6e;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-sizing: border-box;
		padding: 0 15px;
		.timeBox {
			padding: 8px 0;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			font-weight: 900;
			.top {
				text {
					color: #ffffff;
					font-size: 14px;
					font-weight: 900;
				}
			}
			.button {
				transform: translateY(-4px);
				// margin-top: 2px;
				text {
					color: #ffffff;
					font-size: 16px;
				}
				.num {
					font-size: 24px;
				}
			}
		}
		.btnBox {
			width: 130px;
			height: 44px;
			background: linear-gradient(270deg, #ff8b02 5.36%, #ffaf51 100%);
			border-radius: 22px;

			color: #ffffff;
			font-weight: 700;
			font-size: 20px;
			view {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
	}
	.screenBox {
		width: 100vw;
		height: 50px;
		background: #ffffff;
		box-shadow: 0px 2px 2px 1px rgba(0, 0, 0, 0.03);
		margin-top: 6px;
		display: flex;
		justify-content: space-around;
		padding: 0 15px;
		box-sizing: border-box;
		.screenItem {
			padding: 14px 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			font-size: 14px;
			color: #3f3f3f;
			max-width: 30vw;

			text {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-right: 6px;
			}

			// .uicon-arrow-up-fill {
			// 	transition: 0.3s;
			// 	color: #3f3f3f !important;
			// }
			color: #f6a13e;

			.uicon-arrow-up-fill {
				transform: rotate(180deg);
				transition: 0.3s;
				color: #f6a13e !important;
			}
		}
	}
	.tan-list-box {
		// margin: 10rpx;
		// width: calc(48vw - 15rpx);
		background-color: #ffffff;
		overflow: hidden;
		// margin-bottom: 10px;
		border-radius: 4px 4px 4px 4px;
	}

	.tan-img-pic {
		width: 100%;

		image {
			width: 100%;
			height: 100%;
		}

		margin: auto;
	}

	.tan-list-title {
		margin-left: 8px;
		font-size: 14px;
		font-weight: 500;
		color: #333333;
	}

	.tan-list-info {
		margin-top: 10px;
		display: flex;
		margin-bottom: 10px;
		padding: 0 8px;
		box-sizing: border-box;
		image {
			width: 20px;
			height: 20px !important;
			border-radius: 50%;
		}

		span {
			width: 100px;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			font-size: 12px;
			font-weight: 500;
			color: #7c7c7c;
			margin-top: 3px;
			margin-left: 5px;
			display: block;
		}

		.vote {
			display: flex;

			text {
				margin-right: 4px;
				height: 17px;
				font-size: 13px;
				font-weight: 400;
				color: #c4c4c4;
				display: block;
				margin-top: 2px;
			}

			.heart {
				display: block;
				margin-left: 5px;
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
		justify-content: center;
		align-items: center;

		button {
			flex: 1;
			height: 44px;
			background: linear-gradient(270deg, #f6a13e 0%, #fec685 100%);
			border-radius: 22px;
			font-weight: 500;
			color: #ffffff;
			font-size: 16px;
		}
	}
}
</style>

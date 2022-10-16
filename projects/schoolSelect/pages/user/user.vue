<template>
	<view class="userBox">
		<view class="userInfoBox" v-if="isLogin">
			<view class="userHeadBox">
				<view class="userIcon"><image :src="userInfo.userPortait" shape="circle"></image></view>

				<view class="userInfo">
					<view class="userName">
						<text>{{ userInfo.nickName }}</text>
					</view>
					<view class="userTag">
						<text v-if="vipInfo.isVip">VIP会员有效期至：{{ vipInfo.expireTime }}</text>
						<text v-else class="tagText">您当前未开通VIP会员</text>
					</view>
				</view>
				<view class="msgIcon" v-if="status">
					<image src="../../static/image/notification.png" mode=""></image>
					<u-badge class="iconText" numberType="overflow" type="error" max="99" :value="100"></u-badge>
				</view>
			</view>
			<view class="getVipBox">
				<view class="vipInfoBox">
					<image src="../../static/image/vipBg.png" mode="widthFix"></image>
					<button type="default" @click="toVip">
						{{ vipInfo.isVip ? '立即续费' : '立即开通' }}
						<u-icon name="arrow-right" size="9" color="#E54D52" />
					</button>
				</view>
			</view>
		</view>
		<view class="userInfoBox" v-else>
			<view class="loginBtn"><text @click="login">请登录</text></view>
		</view>
		<scroll-view class="userBoxContent" :scroll-y="true">
			<view class="shuXiangStatusBox" v-if="isLogin && shuXiangSign">
				<view class="statusTitle">
					<view class=""></view>
					<text>书香天府</text>
				</view>
				<view class="statusBox">
					<view class="" @click="toUserSHuxiang">
						<view class="statusTop">
							<text>参赛作品</text>
							<u-icon name="arrow-right" color="#585858" size="12" />
						</view>
						<view class="statusButtom">
							<view class="left">
								<text>{{ shuxiangStatusInfo.worksNums }}</text>
								<text>组</text>
							</view>
							<view class="right">
								<text>{{ shuxiangStatusInfo.examineNums }}组审核中</text>
							</view>
						</view>
					</view>
					<view v-if="signType === '0'">
						<view class="statusTop"><text>获得积分</text></view>
						<view class="statusButtom num" >
							<view class="left">
								<text>{{ shuxiangStatusInfo.point }}</text>
								<text>分</text>
							</view>
							<view class="right">
								<text>排名{{ shuxiangStatusInfo.num }}</text>
							</view>
							<view class="textBox" v-if="shuxiangStatusInfo.num>20">距进入决赛还差{{shuxiangStatusInfo.pointGap}}分</view>
							<view class="textBox" v-else-if="shuxiangStatusInfo.num>1">距离上一名还差{{shuxiangStatusInfo.pointGap}}分</view>
						</view>
					</view>
					<view v-if="signType === '1'">
						<view class="statusTop"><text>获得积分</text></view>
						<view class="statusButtom num" >
							<view>B组：</view>
							<view class="left">
								
								<text>{{ shuXiangGroupInfo['B'].point}}</text>
								<text>分</text>
							</view>
							<view class="right">
								<text>排名{{ shuXiangGroupInfo['B'].num}}</text>
							</view>
							<view class="textBox" v-if="shuXiangGroupInfo['B'].num>20">距进入决赛还差{{shuXiangGroupInfo['B'].pointGap}}分</view>
							<view class="textBox" v-else-if="shuXiangGroupInfo['B'].num>1">距离上一名还差{{shuXiangGroupInfo['B'].pointGap}}分</view>
						</view>
						<view class="statusButtom num" >
							<view>D组：</view>
							<view class="left">
								<text>{{ shuXiangGroupInfo['D'].point }}</text>
								<text>分</text>
							</view>
							<view class="right">
								<text>排名{{ shuXiangGroupInfo['D'].num }}</text>
							</view>
							<view class="textBox" v-if="shuXiangGroupInfo['D'].num>20">距进入决赛还差{{shuXiangGroupInfo['D'].pointGap}}分</view>
							<view class="textBox" v-else-if="shuXiangGroupInfo['D'].num>1">距离上一名还差{{shuXiangGroupInfo['D'].pointGap}}分</view>
						</view>
					</view>
					<!-- <view class="group" v-if="signType === 1">
						<view class="groupItem">
							<view class="title">B组积分</view>
							<view class="point">
								<text>{{shuXiangGroupInfo['B'].point}}</text>
								<text>分</text>
							</view>
							<view class="num">
								<text>排名</text>
								<text>{{shuXiangGroupInfo['B'].num}}</text>
							</view>
						</view>
						<view class="groupItem">
							<view class="title">D组积分</view>
							<view class="point">
								<text>{{shuXiangGroupInfo['D'].point}}</text>
								<text>分</text>
							</view>
							<view class="num">
								<text>排名</text>
								<text>{{shuXiangGroupInfo['D'].num}}</text>
							</view>
						</view> -->
					<!-- </view> -->
				</view>
			</view>
			<u-cell-group class="itemBox" :border="false" :customStyle="{ color: '#333333' }">
				<u-cell icon="integral-fill" v-if="isLogin" :border="false" title="选片订单" isLink url="/pages/order/order">
					<image class="itemIcon" slot="icon" src="../../static/image/icons/order.png" mode=""></image>
				</u-cell>
				<u-cell icon="integral-fill" v-if="isLogin" :border="false" title="兑换劵" :isLink="true" url="/pages/coupon/coupon">
					<image class="itemIcon" slot="icon" src="../../static/image/icons/coupon.png" mode=""></image>
					<text slot="value">{{couponNum}}</text>
				</u-cell>
				<u-cell v-if="isLogin&&signType !== ''" @click="toIdCard" icon="setting-fill" :border="false" title="参赛证" :isLink="true">
					<image class="itemIcon" slot="icon" src="../../static/image/icons/IDCard.png" mode=""></image>
				</u-cell>
				<u-cell icon="setting-fill" v-if="isLogin" :border="false" title="我的收藏" :isLink="true">
					<image class="itemIcon" slot="icon" src="../../static/image/icons/icon2.png" mode=""></image>
				</u-cell>
				<u-cell icon="integral-fill" v-if="isLogin" :border="false" title="绑定邮箱" @click="openEditEmail" :isLink="true">
					<image class="itemIcon" slot="icon" src="../../static/image/icons/email.png" mode=""></image>
					<text class="email" slot="value">{{email?email:'未填写'}}</text>
				</u-cell>
				<u-cell icon="integral-fill" :border="false" title="关于我们" :isLink="true">
					<image class="itemIcon" slot="icon" src="../../static/image/icons/icon1.png" mode=""></image>
				</u-cell>
			</u-cell-group>
		</scroll-view>
		<editEmail ref="editEmail" />
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import { getEroStatus, getUserPerson, getGroupPerson } from '../../api/shuxiang.js';
import editEmail from '@/components/editEmail.vue'
import {getCouponsList} from '@/api/photo.js'
import dayjs from 'dayjs'
export default {
	data() {
		return {
			status: false,
			shuXiangSign: 0,
			signType: '',
			shuXiangGroupType: '',
			shuxiangStatusInfo: {
				examineNums: 0,
				num: 0,
				point: 0,
				worksNums: 0
			},
			shuXiangGroupInfo: {
				B: {},
				D: {}
			},
			couponNum: 0
		};
	},
	components: {
		editEmail
	},
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
		token: function() {
			if (this.$store.getters) {
				return this.$store.getters.token;
			} else {
				return '';
			}
		},
		email: function() {
			if (this.$store.getters) {
				return this.$store.getters.email;
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
		},
		vipInfo: function() {
			if (this.$store.getters) {
				const info = this.$store.getters.vipInfo
				info.expireTime = dayjs(info.expireTime).format('YYYY-MM-DD')
				return	info;
			} else {
				return {};
			}
		}
	},
	onLoad() {
		uni.setNavigationBarColor({
			backgroundColor: '#FFF7E2',
			frontColor: '#000000'
		});

		uni.$on('login', () => {
			this.getUserStatus();
			this.getCouponsList()
		});
	},
	onShow() {
		if (this.isLogin) {
			this.getUserStatus();
			this.getCouponsList()
		}
	},
	methods: {
		//查询兑换卷数量
		getCouponsList() {
			getCouponsList().then(res => {
				if(+res.code === 0) {
					this.couponNum = res.data.length
				}
			})
		},
		//编辑邮箱
		openEditEmail() {
			this.$refs.editEmail.open()
		},
		//查看自己的参赛证
		toIdCard() {
			uni.navigateTo({
				url: '/pages/user/IDCard/IDCard'
			})
		},
		//查看自己已提交的作品
		toUserSHuxiang() {
			uni.navigateTo({
				url: '/pages/user/shuxiang/shuxiang'
			});
		},
		//查询个人积分排名及作品
		getUserPerson() {
			getUserPerson().then(res => {
				if (+res.code === 0) {
					// console.log(res.data);
					this.shuxiangStatusInfo = res.data;
				}
			});
		},
		//查询团体积分排名及作品
		getGroupPerson() {
			getGroupPerson().then(res => {
				if (+res.code === 0) {
					// console.log(res.data);
					this.shuXiangGroupInfo = res.data;
					this.shuxiangStatusInfo.worksNums = res.data.worksNums
					this.shuxiangStatusInfo.examineNums = res.data.examineNums
				}
			});
		},
		// 查询报名状态
		getUserStatus() {
			let id = uni.getStorageSync('userId') || '';
			if (id) {
				getEroStatus(id).then(res => {
					if (+res.code === 0) {
						this.shuXiangSign = res.data.signStatus;
						if (res.data.signStatus > 0) {
							
							this.shuXiangGroupType = res.data.groupType;
							this.signType = res.data.signType.toString()
							if (this.signType === '1') {
								this.getGroupPerson();
							} else {
								this.getUserPerson();
							}
						}
					}
				});
			}
		},
		toVip() {
			uni.navigateTo({
				url: '../vip/vip'
			});
		},
		login() {
			uni.getUserProfile({
				desc: '登录',
				success: () => {
					this.$login();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.userBox {
	height: 100vh;
	position: relative;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	.userInfoBox {
		box-sizing: border-box;
		padding: 22px 20px 130px;
		position: relative;
		width: 100vw;
		background: #fff7e2;
		border-bottom: 1px solid #dadbde;
		display: flex;
		flex-direction: column;
		position: relative;
		.userHeadBox {
			display: flex;
			align-items: center;
			.userIcon {
				margin-right: 10px;
				border-radius: 50%;
				box-sizing: border-box;
				width: 50px;
				height: 50px;
				overflow: hidden;
				border: 2px solid #ffd9ac;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.userInfo {
				height: 50px;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.userName {
					text {
						font-weight: 500;
						color: #333333;
						font-size: 18px;
					}
				}
				.userTag {
					display: flex;
					text {
						color: #333333;
						font-size: 12px;
					}
					.tagText {
						color: #f6a13e;
						font-size: 12px;
					}
				}
			}
			.msgIcon {
				position: absolute;
				right: 32px;
				width: 28px;
				height: 28px;
				image {
					width: 100%;
					height: 100%;
				}
				.u-badge {
					position: absolute;
					left: 16px;
					top: -4px;
				}
			}
			.loginBtn {
				text {
					font-size: 16px;
					font-weight: bold;
					color: #3c9cff;
				}
			}
		}
		.getVipBox {
			position: absolute;
			left: 0;
			bottom: 9px;
			width: 100%;
			box-sizing: border-box;
			padding: 0 15px;
			height: 85px;
			.vipInfoBox {
				width: 100%;
				height: 100%;
				position: relative;
				image {
					width: 100%;
					height: 100%;
				}
				button {
					position: absolute;
					right: 15px;
					top: 17px;
					padding: 0 10px;
					height: 26px;
					display: flex;
					align-items: center;
					background: #ffffff;
					border-radius: 13px;
					font-weight: 500;
					color: #e54d52;
					font-size: 13px;
					&::after {
						border: none;
					}
					view {
						margin-left: 4px;
					}
				}
			}
		}
	}
	.userBoxContent {
		width: 100vw;
		transform: translateY(-37px);
		border-top-left-radius: 16px;
		border-top-right-radius: 16px;
		background: #ffffff;
		flex: 1;
		.shuXiangStatusBox {
			padding: 20px 15px 0;
			.statusTitle {
				display: flex;
				align-items: center;
				view {
					width: 5px;
					height: 14px;
					background: linear-gradient(0deg, #f66a3e 0%, #fec685 100%);
					border-radius: 2px 2px 2px 2px;
				}
				text {
					font-weight: 500;
					color: #333333;
					font-size: 14px;
					margin-left: 6px;
				}
			}
			.statusBox {
				margin-top: 12px;
				// display: flex;
				// align-items: center;
				// justify-content: space-between;
				> view {
					margin-bottom: 12px;
					flex: 1;
					// height: 72px;
					background: #fff7e2;
					border-radius: 8px;
					padding: 13px 14px 10px;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					box-sizing: border-box;
					margin-right: 10px;;
					.statusTop {
						display: flex;
						justify-content: space-between;
						> text {
							font-weight: 500;
							color: #585858;
							font-size: 12px;
						}
					}
					.statusButtom {
						margin-top: 13px;
						width: 100%;
						display: flex;
						justify-content: space-between;
						
						.left {
							display: flex;
							align-items: center;
							text {
								&:first-child {
									font-weight: bold;
									color: #333333;
									font-size: 18px;
								}
								&:last-child {
									margin-left: 4px;
									font-weight: 500;
									color: #585858;
									font-size: 14px;
								}
							}
						}
						.right {
							display: flex;
							align-items: center;
							text {
								font-weight: 500;
								color: #a6a6a6;
								font-size: 12px;
							}
						}
						&.num{
							justify-content: flex-start;
							.right{
								margin-left: 15px;
								text{
									color: #FF6B62;
									font-weight: 700;
									font-size: 16px;
								}
							}
							.textBox{
								margin-left: 12px;
								padding: 4px 9px 3px;
								box-sizing: border-box;
								background: #FF6B62;
								border-radius: 6px;
								color: #FFFFFF;
								font-size: 12px;
							}
						}
					}
					&:last-child {
						margin-right: 0;
						.statusButtom {
							.right {
								text {
									color: #f6a13e;
								}
							}
						}
					}
					&.group{
						flex: none;
						width: 196px;
						display: flex;
						flex-direction: row;
						box-sizing: border-box;
						padding-top: 6px;
						padding-left: 0;
						.groupItem{
							padding-left: 22px;
							box-sizing: border-box;
							height: 100%;
							flex: 1;
							border-right: 1px solid #F2E4C0;
							&:last-child{
								border-right: none;
							}
							.title{
								color: #585858;
								font-size: 14px;
							}
							.point{
								margin-top: 2px;
								display: flex;
								align-items: center;
								text{
									&:first-child{
										color: #333333;
										font-weight: 700;
										font-size: 16px;
									}
									&:last-child{
										margin-left: 2px;
										color: #898989;
										font-size: 12px
									}
								}
							}
							.num{
								text{
									color: #F7A13E;
									font-size: 12px;
								}
							}
						}
					}
				}
			}
		}
		.itemBox {
		}
		.itemIcon {
			width: 34px;
			height: 34px;
		}
		.email{
			color: #B4B4B4;
			font-weight: 400;
			font-size: 16px;
		}
	}
}
</style>

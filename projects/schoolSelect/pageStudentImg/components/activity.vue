<template>
	<view class="activity">
		<u-popup class="" :show="show" @close="close" mode="bottom" closeOnClickOverlay :round="9">
			<view class="activityBox">
				<view class="tabBox">
					<view class="tabItem" @click="setType('0')" :class="{ active: type === '0' }">
						活动信息
						<view class="border" v-if="type === '0'"></view>
					</view>
					<view class="tabItem" @click="setType('1')" :class="{ active: type === '1' }">
						商家信息
						<view class="border" v-if="type === '1'"></view>
					</view>
				</view>
				<swiper class="content" :current="type" :interval="3000" :duration="300" @change="typeChange">
					<swiper-item>
						<view class="activityInfo">
							<view class="imgBox"><image :src="activityInfo.activityUrl" mode="widthFix"></image></view>
							<view class="btnBox"><view class="btn" @click="getActivityOrder">立即参与</view></view>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="businessBox">
							<view class="title">{{ activityInfo.mechanismName }}</view>
							<view class="businessInfo">{{ activityInfo.introduction }}</view>
						</view>
					</swiper-item>
				</swiper>
				<view class="closeBtn" @click="close"><image src="../static/closeBtn.png" mode=""></image></view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import dayjs from 'dayjs';
import { getShowPicInfo } from '@/api/photo.js';
export default {
	name: 'activity',
	data() {
		return {
			show: false,
			dayjs,
			type: '0',
			activityInfo: {}
		};
	},
	created() {
		uni.$on('couponPaySuccess', () => {
			this.show = false;
		});
	},
	methods: {
		close() {
			this.show = false;
		},
		open(type = '0') {
			this.show = true;
			this.type = type;
			this.activityInfo = uni.getStorageSync('activityInfo');
		},
		typeChange(data) {
			this.type = data.detail.current.toString()
		},
		setType(index) {
			this.type = index;
		},
		//参与活动  查询是否可以直接购买
		getActivityOrder() {
			getShowPicInfo().then(res => {
				if (+res.code === 0) {
					uni.$emit('sendShowPicActivity', res.data[0]);
				}
			});
			//
		}
	}
};
</script>

<style lang="scss">
.activity {
	.activityBox {
		position: relative;
		.tabBox {
			display: flex;
			justify-content: center;
			padding-top: 10px;
			.tabItem {
				font-weight: 500;
				font-size: 17px;
				display: flex;
				flex-direction: column;
				align-items: center;
				&:first-child {
					margin-right: 46px;
				}
				.border {
					margin-top: 6px;
					width: 38px;
					height: 4px;
					background: #f6a13e;
					border-radius: 2px;
				}
				&.active {
					font-weight: 700;
					color: #f6a13e;
				}
			}
		}
		.content {
			border-top: 1px solid #f6f7f9;
			padding: 10px 12px;
			box-sizing: border-box;
			width: 100%;
			height: 80vh;
			overflow-y: auto;
			.activityInfo {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				overflow-y: auto;
				.imgBox {
					flex: 1;
					width: 100%;
					display: block;
					image {
						width: 100%;
					}
				}
				.btnBox {
					height: 56px;
					width: 100%;
					display: flex;
					align-items: center;
					.btn {
						width: 100%;
						height: 44px;
						background: linear-gradient(270deg, #ff8b02 5.36%, #ffaf51 100%);
						border-radius: 99px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #ffffff;
						font-weight: 700;
						font-size: 18px;
					}
				}
			}
			.businessBox {
				.title {
					margin-top: 18px;
					color: #333333;
					font-weight: 700;
					font-size: 20px;
				}
				.businessInfo {
					margin-top: 12px;
					font-weight: 400;
					font-size: 16px;
					color: #333333;
				}
			}
		}
		.closeBtn {
			width: 16px;
			height: 16px;
			position: absolute;
			top: 17px;
			left: 15px;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>

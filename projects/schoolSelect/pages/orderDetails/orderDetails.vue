<template>
	<view class="orderDetails">
		<view class="content">
			<view class="emailBox" @click="openEditEmail">
				<view class="left">
					<view class="top">
						收件邮箱
					</view>
					<view class="bottom">25686656545@qq.com</view>
				</view>
			</view>
			<view class="orderInfoBox">
				<view class="title">订单详情</view>
				<view class="item">所属活动：{{orderInfo.activity}}</view>
				<view class="item">已选照片：{{ list.length }}张</view>
				<view class="item">
					订单金额：
					<text>￥{{orderInfo.amount}}</text>
				</view>
			</view>
			<view class="imgViewBox">
				<view class="title">已选照片({{ list.length }}张)</view>
				<view class="imgList">
					<view class="img" :style="{ width: albumWidth + 'px', height: albumWidth + 'px' }" v-if="index < maxNum" v-for="(item, index) in list" :key="index">
						<image :src="item" mode="aspectFill" @click="previewImg(index)"></image>
						<view v-if="index === 7 && maxNum === 8" class="moreNum" @click="showMore">+{{ list.length - maxNum }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btnBox">
			<!-- <view class="btn" @click="sendPay">立即支付</view> -->
			<view class="btn" v-if="item.orderStatus === 'success'" @click="toSelectPhtot">
				再次购买
			</view>
			<view class="btn payBtn" v-if="item.orderStatus === 'execute'" @click="sendPay">
				立即支付
			</view>
			<view class="btn delBtn" @click="deleteOrder(item)" v-if="item.orderStatus === 'execute'||item.status === 'close'">
				删除订单
			</view>
		</view>
	</view>
</template>

<script>
	import {getShowPicTime} from '@/api/photo.js'
	import {getOrderDetails} from '@/api/pay.js'
export default {
	components: {
	},
	data() {
		return {
			list: [],
			maxNum: 8,
			albumWidth: 76,
			orderInfo: {},
			orderId: '',
			activetyInfo: {}
		};
	},
	onLoad(data) {
		this.orderId = data.orderId
		this.getShowPicTime()
		this.getOrderDetails()
	},
	onReady() {
		const that = this;
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.imgList')
			.boundingClientRect(data => {
				that.albumWidth = (data.width - 15) / 4;
			})
			.exec();
	},
	methods: {
		showMore() {
			this.maxNum = this.list.length + 1;
		},
		previewImg(index) {
			uni.previewImage({
				urls: this.list,
				current: index
			});
		},
		openEditEmail() {
			this.$refs.editEmail.open();
		},
		sendPay() {
			uni.showLoading({
				mask: true,
				title: '支付中'
			})
			pay(this.orderInfo).then(() => {
				uni.navigateBack({
					delta: 1
				})
			}).catch(() => {
				uni.showToast({
					icon: 'none',
					title: '支付失败'
				})
			}).finally(() => {
				uni.hideLoading()
			});
			// uni.navigateTo({
			// 	url: '/pageStudentImg/home/home',
			// 	success: () => {
			// 		setTimeout(() => {
			// 			uni.$emit('imgPaySuccess');
			// 		}, 500)
			// 	}
			// });
		},
		//查询商家信息，活动信息
		getShowPicTime() {
			getShowPicTime().then(res => {
				if(+res.code === 0) {
					this.activetyInfo = res.data
				}
			})
		},
		//查询订单详情
		getOrderDetails() {
			getOrderDetails({
				orderId: this.orderId
			}).then(res => {
				if(+res.code === 0) {
					this.orderInfo = res.data;
					this.list = res.data.picUrls.map(item => `${this.activetyInfo.picUrlPre}${item}${this.activetyInfo.picUrlSuffix}`)
					console.log(this.list);
				}
			})
		}
	}
};
</script>

<style lang="scss">
@import './index.scss';
</style>

<template>
	<view class="orderInfo">
		<view class="content">
			<view class="emailBox" @click="openEditEmail">
				<view class="left">
					<view class="top">
						收件邮箱
						<text>用于接收照片</text>
					</view>
					<view class="bottom">{{email}}</view>
				</view>
				<view class="right"><image src="../static/right_1.png" mode=""></image></view>
			</view>
			<view class="orderInfoBox">
				<view class="title">订单详情</view>
				<view class="item">所属活动：{{activityInfo.activity}}</view>
				<view class="item">已选照片：{{ list.length }}张</view>
				<view class="item">
					订单金额：
					<text>￥{{ orderInfo.allAmount }}</text>
				</view>
			</view>
			<view class="moreInfo">订单1小时后失效，请尽快支付</view>
			<view class="imgViewBox">
				<view class="title">已选照片({{ list.length }}张)</view>
				<view class="imgList">
					<view class="img" :style="{ width: albumWidth + 'px', height: albumWidth + 'px' }" v-if="index < maxNum" v-for="(item, index) in list" :key="index">
						<image :src="`${activityInfo.picUrlPre}${item.fileUrl}${activityInfo.picUrlSuffix}`" mode="aspectFill" @click="previewImg(index)"></image>
						<view v-if="index === 7 && maxNum === 8" class="moreNum" @click="showMore">+{{ list.length - maxNum }}</view>
					</view>
				</view>
			</view>
			<view class="info">
				<image src="../static/payInfoBg.png" mode="widthFix"></image>
				<text>已为您节省：{{ orderInfo.allOriginalAmout }}元</text>
			</view>
		</view>
		<view class="btnBox">
			<view class="num">
				￥
				<text>{{ orderInfo.allAmount }}</text>
			</view>
			<view class="btn" @click="sendPay">立即支付</view>
		</view>
		<editEmail ref="editEmail" />
	</view>
</template>

<script>
import editEmail from '@/components/editEmail.vue'
export default {
	components: {
		editEmail
	},
	data() {
		return {
			list: [],
			maxNum: 8,
			albumWidth: 76,
			isAllSelect: false,
			orderInfo: {},
			activityInfo: {},
			productList: []
		};
	},
	onLoad() {
		let createOrderInfo = uni.getStorageSync('createOrderInfo');
		this.productList = uni.getStorageSync('photoProduct');
		this.activityInfo = uni.getStorageSync('activityInfo');
		if (createOrderInfo) {
			this.list = createOrderInfo.list;
		}
		const that = this;
		const eventChannel = this.getOpenerEventChannel();
		eventChannel.on('orderInfo', data => {
			createOrderInfo = data;
			console.log(data);
			that.isAllSelect = data.isAll;
			that.list = data.list;
			that.orderInfo = {
				allAmount: data.allAmount,
				allOriginalAmout: data.allOriginalAmout,
				picIds: data.list.map(item => item.id),
				picNums: data.list.length,
				mechanismName: that.activityInfo.mechanismName,
				activity: that.activityInfo.activity,
				productType: 'ShowPic'
			};
		});
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
	computed: {
		email: function() {
			if (this.$store.getters) {
				return this.$store.getters.email;
			} else {
				return '';
			}
		},
	},
	methods: {
		
		showMore() {
			this.maxNum = this.list.length + 1;
		},
		previewImg(index) {
			uni.previewImage({
				urls: this.list.map(item => `${this.activityInfo.picUrlPre}${item.fileUrl}${this.activityInfo.picUrlSuffix}`),
				current: index
			});
		},
		openEditEmail() {
			this.$refs.editEmail.open();
		},
		sendPay() {
			if(!this.email){
				uni.showToast({
					icon: 'none',
					title: '请添加邮箱'
				})
				return
			}
			const product = this.isAllSelect ? this.productList.find(item => item.picType === 1) : this.productList.find(item => item.picType === 2);

			this.orderInfo.productId = product.id;
			this.orderInfo.picType = product.picType;
			if (!this.isAllSelect) {
				this.orderInfo.number = this.list.length;
			}
			uni.showLoading({
				mask: true,
				title:"支付中"
			})
			this.$Pay(this.orderInfo)
				.then(() => {
					
					uni.navigateBack({
						delta: 2,
						success: () => {
							setTimeout(() => {
								uni.$emit('imgPaySuccess');
							}, 500);
						}
					})
				})
				.catch(e => {
					console.error(e);
					if (+e.code === 1) {
						setTimeout(() => {
							uni.showToast({
								icon: 'none',
								duration: 1500,
								title: '有未支付的订单，请前往订单支付或取消'
							});
						}, 500)
					} else {
						setTimeout(() => {
							uni.showToast({
								icon:'error',
								title: '支付失败'
							})
						}, 500)
					}
				}).finally(() => {
					uni.hideLoading()
				});
		}
	}
};
</script>

<style lang="scss">
@import './index.scss';
</style>

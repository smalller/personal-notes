<template>
	<view class="studentImg">
		<view class="banner">
			<image src="../static/banner.png" mode="widthFix"></image>
			<view class="btnBox">
				<view class="btn" @click="openAvtivity('0')">
					<text>活动信息</text>
					<image src="../static/right.png" mode=""></image>
				</view>
				<view class="btn" @click="openAvtivity('1')">
					<text>商家信息</text>
					<image src="../static/right.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="content">
			<view class="titleBox">
				<text>选片时间：{{dayjs(activityInfo.startTime).format('YYYY年MM月DD日')}}-{{dayjs(activityInfo.endTime).format('YYYY年MM月DD日')}}</text>
				<text>活动编号：{{activityInfo.activityNo}}</text>
			</view>
			<view class="imgBox">
				<view class="imgItem">
					<image :src="picList[0].imgUrl" mode="aspectFill"></image>
				</view>
				<view class="imgItem">
					<image :src="picList[1].imgUrl" mode="aspectFill"></image>
				</view>
				<view class="imgItem btn">
					<view class="top">
						<text>可选照片</text>
						<image src="../static/icon.png" mode=""></image>
					</view>
					
					<view class="center">
						<text>{{picList.filter(item => item.isBuy === 0).length}}</text>
						<text>张</text>
					</view>
				</view>
			</view>
			<view class="listBox">
				<view class="listBtn">
					<view class="btn" @click="toSelectImg(1)">
						立即选择
					</view>
					<view class="title">
						原片打包
					</view>
					<view class="infoBox">
						<view class="infoItem">· 3张笑脸墙</view>
						<view class="infoItem">· 全部原始底片打包</view>
						<view class="infoItem">· 全部电子版原始底片40张，现价仅需￥{{allProduct.amount}}元</view>
					</view>
				</view>
				<!-- <view class="listBtn">
					<view class="btn">
						立即选择
					</view>
					<view class="title">
						实物套系制作
					</view>
					<view class="infoBox">
						<view class="infoItem">· 3张书包柜</view>
						<view class="infoItem">· 精修实物制作，现价仅需￥100元</view>
					</view>
				</view> -->
				<view class="listBtn">
					<view class="btn" @click="toSelectImg(2)">
						立即选择
					</view>
					<view class="title">
						单张原片
					</view>
					<view class="infoBox">
						<view class="infoItem">· 3张照片盒子</view>
						<view class="infoItem">· 3张原片免费赠送</view>
						<view class="infoItem">· 原价￥{{product.originalAmout}}元/张，现价优惠￥{{product.amount}}元/张</view>
					</view>
				</view>
			</view>
		</view>
		<paySuccess />
		<activity ref="activity" />
		<orderDetails />
		<coupon />
	</view>
</template>

<script>
	import paySuccess from '../components/paySuccess.vue'
	import activity from '../components/activity.vue'
	import orderDetails from '../components/orderDetails.vue'
	import coupon from '../components/coupon.vue'
	import {getShowPicTime} from '@/api/photo.js'
	import {getProducts} from '@/api/pay.js'
	import {getShowPicList} from '@/api/photo.js'
	import dayjs from 'dayjs'
	export default {
		components: {
			paySuccess,
			activity,
			orderDetails,
			coupon
		},
		data() {
			return {
				activityInfo: {},
				dayjs,
				productList: [],
				picList: [],
				allProduct: {},
				product: {}
			};
		},
		computed: {
			
		},
		onLoad() {
			uni.$on('showActivity', () => {
				this.openAvtivity('0')
			})
			this.getShowPicTime()
			this.getProducts()
			
		},
		onShow() {
			
		},
		methods: {
			toSelectImg(type) {
				// this.picList.filter(item => item.isBuy === 0).length
				uni.navigateTo({
					url: `/pageStudentImg/selectImg/selectImg?type=${type}`,
					fail: (e) => {
						console.log(e)
						
					}
				})
			},
			//打开活动弹窗
			openAvtivity(type) {
				this.$refs.activity.open(type)
			},
			//查询活动和商家详情
			getShowPicTime() {
				getShowPicTime().then(res => {
					console.log(res);
					if(+res.code === 0) {
						this.activityInfo = res.data;
						uni.setStorageSync('activityInfo', res.data)
						this.getShowPicList()
					}
				})
			},
			//获取商品列表
			getProducts() {
				getProducts({
					productType: 'ShowPic',
					schoolId: '1'
				}).then(res => {
					if(+res.code === 0) {
						this.productList = res.data;
						this.product =this.productList.find(item => item.picType === 2)
						this.allProduct =this.productList.find(item => item.picType === 1)
						uni.setStorageSync('photoProduct', res.data)
					}
				})
			},
			//查询照片列表
			getShowPicList() {
				getShowPicList().then(res => {
					if(+res.code === 0) {
						this.picList = res.data.map(item => {
							item.imgUrl = `${this.activityInfo.picUrlPre}${item.fileUrl}${this.activityInfo.picUrlSuffix}`
							return item
						})
						uni.setStorageSync('showPicList', this.picList)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
@import "./index.scss";
</style>

<template>
	<view class="content">
		<swiper class="swiper" :indicator-dots="true" indicator-active-color="#F8AB51" indicator-color="#DFDFDF" :autoplay="true" :interval="interval" :circular="true">
			<swiper-item><image src="../../static/image/banner.png" mode="widthFix"></image></swiper-item>
		</swiper>
		<view class="content-box">
			<view class="title-box">
				<view class="flag"></view>
				<text>常用功能</text>
			</view>
			<view class="mod-list">
				<ul>
					<li
						v-for="item in modListInfo"
						@click="toSchoolList(item.url)"
						:key="item.title"
						:style="{
							background: `linear-gradient(${item.bgColor})`
						}"
					>
						<view class="left-box">
							<view class="title">{{ item.title }}</view>
							<view class="explain">{{item.tips}}</view>
							<view class="view-btn">立即查看</view>
						</view>
						<view class="right-box"><image :src="item.img" mode=""></image></view>
					</li>
				</ul>
			</view>
		</view>
	</view>
</template>

<script>

import myVideo from '../../components/myVideo.vue';
import {checkByUser} from '@/api/photo.js'
// import amap from '../../sdk/amap-wx.130.js';
export default {
	data() {
		return {
			products: null,
			videoContext: null,
			index: 0,
			array: [],
			value: '',
			interval: 3000,
			modListInfo: [
				{
					img:'../../static/mask-group1.png',
					title:'幼小衔接',
					bgColor:'131deg, #19B0D8 0%, #68D8F5 100%',
					url: '../schoolList/schoolList',
					tips: '资深教育媒体人给您专业择校意见'
				},
				{
					img:'../../static/mask-group2.png',
					title:'书香天府',
					bgColor:'131deg, #19D87C 0%, #68F5CB 100%',
					url: '../../pageShuXiang/shuXiang/shuXiang',
					// url: '',
					tips: '书香亲子，我读我秀'
				},
				{
					img:'../../static/mask-group3.png',
					title:'我图我秀',
					bgColor:'131deg, #EE8E57 0%, #F5CE68 100%',
					url: '/pageStudentImg/home/home',
					tips: '萌娃精美艺术照，一键制作'
				},
				{
					img:'../../static/mask-group4.png',
					title:'往期回顾',
					bgColor:'131deg, #EE57C4 0%, #E268F5 100%',
					url: '',
					tips: '前期精彩集锦大盘点'
				}
			]
		};
	},
	components: {
		myVideo
	},
	onLoad() {
		// console.log(MediaStream);
	},
	computed: {
		isLogin: function() {
			let status = false;
			if (this.$store.getters) {
				status = this.$store.getters.userId && this.$store.getters.token;
			}
			return status;
		},
	},
	onReady: function() {
		// console.log(this.$refs.myVideo);
	},
	methods: {
		toSchoolList(url) {
			
			if(url) {
				if(url === '/pageStudentImg/home/home') {
					if(!this.isLogin) {
						uni.showToast({
							icon:'none',
							title: '请登录用户'
						})
						uni.getUserProfile({
							desc: '登录',
							success: () => {
								this.$login();
							}
						});
						
						uni.$once('login', () => {
							uni.navigateTo({
								url: url
							});
						})
						return
					}
					checkByUser().then(res => {
						if(+res.code === 0) {
							uni.navigateTo({
								url: url
							});
						} else {
							uni.showToast({
								icon: 'error',
								title: res.msg
							})
						}
					})
				} else {
					uni.navigateTo({
						url: url
					});
				}
				console.log(url);
				
			}
			
		},
		onchange(e) {
			console.log(e);
			const value = e.detail.value;
		},
		onnodeclick(node) {},
		bindPickerChange(e) {
			console.log(e);
		},
		handleContact(e) {
			console.log(e);
		},
		edidAddress() {
			uni.chooseAddress({
				success: e => {
					console.log(e);
				}
			});
		},
		login() {
			if (this.products) {
				this.$Pay({
				productType: 'Camera',
				productId: this.orderInfo.id,
				number: 1
			});
			}
		},
		
		openMsg() {
			//#ifdef MP-WEIXIN
			wx.requestSubscribeMessage({
				tmplIds: [],
				success: () => {},
				fail: e => {
					console.error(e);
				}
			});
			//#endif
		},
		openKf() {
			//#ifdef MP-WEIXIN
			wx.openCustomerServiceChat({
				extInfo: {
					url: 'https://work.weixin.qq.com/kfid/kfc6ca09b572a772423'
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
}
.content {
	width: 100vw;
	.swiper{
		// height: calc(100vw / 1.7777);
		width: 100%;
		swiper-item{
			width: 100%;
			image{
				height: 100%;
				width: 100%;
			}
		}
	}
}
.content-box {
	padding: 0 15px;
	.title-box {
		display: flex;
		align-items: center;
		.flag {
			width: 4px;
			height: 14px;
			background: linear-gradient(180deg, #ffd089 0%, #ffad33 100%);
			border-radius: 2px;
			margin: 14px 6px 14px 0;
		}
		> text {
			font-size: 16px;
			font-weight: 500;
			color: #333333;
		}
	}
	.mod-list {
		> ul {
			padding: 0;
			margin: 0;
			> li {
				width: 100%;
				height: 128px;
				background: linear-gradient(131deg, #19b0d8 0%, #68d8f5 100%);
				border-radius: 8px;
				display: flex;
				justify-content: space-between;
				padding: 16px 20px;
				box-sizing: border-box;
				margin-bottom: 10px;
				.left-box {
					color: #ffffff;
					.title {
						font-size: 26px;
						font-weight: bold;
						margin-bottom: 4px;
					}
					.explain {
						font-size: 12px;
						margin-bottom: 9px;
					}
					.view-btn {
						width: 100px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						border-radius: 66px;
						border: 1px solid #ffffff;
						font-size: 12px;
					}
				}
				.right-box {
					width: 106px;
					height: 106px;
					> image {
						width: 106px;
						height: 106px;
						object-fit: cover;
					}
				}
			}
		}
	}
}
</style>

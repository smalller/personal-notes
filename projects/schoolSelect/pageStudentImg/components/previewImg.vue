<template>
	<view class="previewImg" v-if="show">
		<swiper class="imgViewBox"  :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item, index) in imgs" :key="index">
				<view class="imgItem">
					<u-checkbox shape="circle" activeColor="#F6A13E" inactiveColor="#ffffff" size="40px"></u-checkbox>
					
					<image :src="item.url" mode="aspectFit"></image>
				</view>
			</swiper-item>
		</swiper>
		<view class="btn" @click="show = false">
			完成
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: '',
				imgs: [],
				index: 0,
				show: false
			}
		},
		methods: {
			open(imgs, index=0) {
				this.show = true
				this.imgs = imgs
			}
		}
	}
</script>

<style lang="scss">
	.previewImg{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		.imgViewBox{
			width: 100%;
			height: 100%;
		}
		.imgItem{
			width: 100%;
			height: 100%;
			background: #000000;
			image{
				width: 100%;
				height: 100%;
			}
			.u-checkbox{
				position: absolute;
				left: 16px;
				bottom: 16px;
			}
			
		}
		.btn{
			width: 119px;
			height: 44px;
			background: linear-gradient(270deg, #FF8B02 5.36%, #FFAF51 100%);
			border-radius: 99px;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			font-weight: 700;
			font-size: 18px;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: 16px;
		}
	}
</style>
<template>
	<view class="adBox" v-if="show">
		<view class="mask"></view>
		<view class="adData">
			<image @click="openAd" :src="adImg" alt="" />
			<view class="closeBtn" @click="closeAd">
				<image src="../static/image/clearBtn.png" mode="aspectFit"></image>
			</view>
		</view>
	</view>
</template>

<script>
	import {saveAd} from '@/api/shuxiang.js'
	export default {
		name: 'adBox',
		data() {
			return {
				show: false,
				adImg: '',
				adSrc: '',
				adInfo: {}
			}
		},
		methods:{
			init(opt) {
				this.adInfo = opt;
				this.adImg = opt.img;
				this.adSrc = opt.src;
				this.show = true;
			},
			openAd() {
				this.closeAd()
				if(+this.adInfo.isRepeat === 0) {
					saveAd(this.adInfo)
				}
				console.log(this.adInfo);
				if(this.adInfo.link) {
					uni.navigateTo({
						url: `../ad/ad?url=${this.adSrc}`
					})
				}
			},
			closeAd() {
				this.show = false
			}
		}
	}
</script>

<style lang="less">
	.adBox{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0,0,0,0.2);
		}
		.adData{
			position: relative;
			z-index: 2;
			// background: #fff;
			width: 70vw;
			height: 50vh;
			>image{
				width: 100%;
				height: 100%;
			}
			.closeBtn{
				position: absolute;
				right: 4px;
				top: 4px;
				width: 20px;
				height: 20px;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
		
	}
</style>

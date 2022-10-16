<template>
	<view class="couponDetails">
		<view class="tips_a">
			请服务员扫码验卷
		</view>
		<view class="topBorder"></view>
		<view class="content">
			<view class="top">
				<view class="title">
					{{couponInfo.activity}}
				</view>
				<view class="qrcodeBox">
					<!-- <tki-qrcode
					   ref="qrcode"
					   cid="cid"
					   :val="couponInfo.id"
					   :size="170"
					   useDynamicSize
					   unit="px"
					   background="#ffffff"
					   foreground="#000000"
					   pdground="#ffffff"
					   onval
					   showLoading
					   loadingText="正在生成"
					   @result="qrR" /> -->
					   <canvas class="qrcodes" id="qrcodes" canvas-id="qrcodes"></canvas>
				</view>
				<view class="num">
					{{couponInfo.id}}
				</view>
			</view>
			<view class="bottom">
				<view class="time">
					有效期：{{couponInfo.vld}}
				</view>
			</view>
		</view>
		<view class="tips_b">
			该服务由{{couponInfo.mechanismName}}提供
		</view>
		
	</view>
</template>

<script>
	import uQRCode from '@/uni_modules/Sansnn-uQRCode/js_sdk/u-qrcode'
	import {getCouponsDetail} from '@/api/photo.js'
	export default {
		components: {},
		data() {
			return {
				couponId: '',
				couponInfo: {}
			};
		},
		onLoad(data) {
			this.couponId = data.id
			
		},
		onReady() {
			this.getCouponsDetail()
		},
		methods: {
			qrR(e) {
				// console.log(e);
			},
			getCouponsDetail() {
				getCouponsDetail({
					id: this.couponId
				}).then(res => {
					if(+res.code === 0){
						this.couponInfo = res.data
						// this.$refs.qrcode._makeCode()
						this.createQrCode()
					}
				})
			},
			createQrCode() {
				const ctx = uni.createCanvasContext('qrcodes');
				    const uqrcode = new uQRCode(
				      {
				        text: this.couponInfo.id,
				        size: 170
				      },
				      ctx
				    );
				    uqrcode.make();
				    uqrcode.draw();
			}
		}
	}
</script>

<style lang="scss">
@import './index.scss'
</style>

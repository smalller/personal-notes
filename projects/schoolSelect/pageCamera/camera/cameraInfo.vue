<template>
	<view class="cameraInfo">
		<view class="view">
			<view class="imgBox">
				<image :src="imgUrl" mode=""></image>
				<text>{{ photoHeight }}px</text>
				<text>{{ photoWidth }}px</text>
			</view>
			<view class="errInfo" v-if="!photoStatus">
				<view>
					<img src="../static/image/err.png" alt="" />
					{{ errMsg }}
				</view>
			</view>
		</view>
		<view class="content">
			<view class="colorHead">
				<image src="../static/image/camera/colorSelect.png" mode=""></image>
				<text>选择背景色</text>
			</view>
			<view class="colorBox">
				<view v-for="(item, index) in colorList" class="colorItem" :class="{ active: item.color === color }" @click="selectColor(item.color)" :key="index">
					<view class="color">
						<view class="" :style="{ background: item.color }">
							<image v-if="item.color === color && item.title !== '白色'" src="../static/image/camera/ok_1.png" mode=""></image>
							<image v-if="item.color === color && item.title === '白色'" src="../static/image/camera/ok_2.png" mode=""></image>
						</view>
					</view>
					<text>{{ item.title }}</text>
				</view>
			</view>
			<view class="colorBtn">
				<button type="default" v-if="photoStatus" @click="payShow = true">保存并使用照片</button>
				<button class="saveBtn" v-if="!photoStatus" @click="openSelectPhoto">重新拍摄</button>
			</view>
		</view>
		<u-action-sheet :show="payShow" @close="payShow = false" title="提交订单" :round="10">
			<view class="payInfoBox">
				<view class="payInfo">
					<view class="payTitle"><text>证件照</text></view>
					<view class="payText">
						<view><text>电子版高清证件照</text></view>
						<view>
							<text>¥{{ orderInfo.originalAmout }}</text>
							<text>¥{{ orderInfo.amount }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="payBtnBox">
				<view class="payNumBox">
					<text>应付款:</text>
					<text>{{ orderInfo.amount }}</text>
				</view>
				<view class="payBtn"><button type="default" @click="getPay">确认支付</button></view>
			</view>
		</u-action-sheet>
		<helangCompress ref="helangCompress" />
	</view>
</template>

<script>
import { reviewImg,getIDPhoto } from '../../api/camera.js';
import { getProducts } from '../../api/pay.js';
import { getFileUrl } from '../../api/common.js'
import helangCompress from '../../components/helang-compress/helang-compress';

export default {
	data() {
		return {
			base64: '',
			src: '',
			imgUrl: '',
			photoWidth: 295,
			photoHeight: 413,
			photoStatus: true,
			color: '#ffffff',
			spec: '1',
			photoKey: '',
			errMsg: '',
			payShow: false,
			imgUrls: [],
			orderInfo: {},
			colorList: [
				{
					title: '白色',
					color: '#ffffff'
				},
				{
					title: '红色',
					color: '#861a1d'
				},
				{
					title: '浅蓝色',
					color: '#93cdfc'
				},
				{
					title: '深蓝色',
					color: '#3856b4'
				}
			]
		};
	},
	components: {
		helangCompress
	},
	onLoad(e) {
		console.log(e);
		this.getImgBase64(e.url);
		this.getProduct();
	},
	onUnload() {
		this.imgUrl = '';
		this.color = '#ffffff';
	},
	methods: {
		//重新选择
		openSelectPhoto() {
			uni.navigateBack({
				delta: 1,
			})
		},
		getImgBase64(src) {
			const that = this;
			this.imgUrl = src;
			this.src = src;
			this.$refs.helangCompress.compress({
				src:src,
				maxSize: 750,
				fileType: 'jpg',
				minSize: 650
			}).then(url => {
				uni.getFileSystemManager().readFile({
					filePath: url,
					encoding: 'base64',
					success: r => {
						that.base64 = r.data;
						that.getReviewImg();
					}
				})
			})
		},
		getReviewImg() {
			const item = this.imgUrls.find(item => item.color === this.color);
			if (item) {
				this.imgUrl = item.url;
				this.photoKey = item.key;
			} else {
				uni.showLoading({
					mask: true,
					title: '生成照片中'
				});
				reviewImg({
					params: {
						bk: this.color,
						spec: this.spec
					},
					base64: this.base64
				}).then(res => {
					console.log(res);
					if (+res.code === 0) {
						this.imgUrl = res.data.previewUrl;
						this.photoKey = res.data.photoKey;
						this.imgUrls.push({
							key: res.data.photoKey,
							url: res.data.previewUrl,
							color: this.color
						});

						this.photoStatus = res.data.pass;
						this.errMsg = res.data.reasons.join(',');
					}
					uni.hideLoading();
				});
			}
		},
		selectColor(color) {
			this.color = color;
			this.getReviewImg();
		},
		// 获取证件照商品信息
		getProduct() {
			getProducts({
				productType: 'Camera',
				schoolId: '1'
			}).then(res => {
				if (+res.code === 0) {
					if (res.data.length > 0) {
						this.orderInfo = res.data[0];
						console.log(this.orderInfo);
					}
				}
			});
		},
		//发起支付
		getPay() {
			this.$Pay({
				productType: 'Camera',
				productId: this.orderInfo.id,
				number: 1
			}).then(res => {
				console.log(res);
				this.getIDPhoto()
			}).catch(e => {
				console.warn(e)
			})
		},
		//生成照片
		getIDPhoto() {
			const that = this;
			getIDPhoto({
				photoKey: this.photoKey
			}).then(res => {
				if(+res.code === 0){
					getFileUrl(res.data).then(r => {
						uni.setStorageSync('createPhoto', {
							url: r.data,
							id: res.data
						});
						uni.navigateBack({
							delta: 2,
							success: (res) => {
								console.log(res);
							}
						})
					})
					
				}
			})
		}
	}
};
</script>

<style lang="scss">
.cameraInfo {
	width: 100vw;
	min-height: 100vh;
	box-sizing: border-box;
	background: #f6f7f9;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	.view {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.errInfo {
			margin-top: 40px;
			//position: absolute;
			//left: 50%;
			//transform: translateX(-50%);
			bottom: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 80vw;
			image {
				width: 16px;
				height: 16px;
				margin-right: 6px;
				transform: translateY(3px);
			}
			view {
				margin-left: 4px;
				color: #1c1c1c;
				font-size: 14px;
				word-break: break-all;
			}
		}
	}
	.imgBox {
		margin-top: 58px;
		position: relative;
		width: 147px;
		image {
			width: 100%;
			height: 207px;
		}
		text {
			position: absolute;
			color: #1c1c1c;
			font-size: 18px;
			font-weight: 500;
			&:nth-child(2) {
				left: -40px;
				top: 50%;
				transform: rotate(-90deg);
			}
			&:nth-child(3) {
				left: 50%;
				transform: translateX(-50%);
				bottom: -30px;
			}
		}
	}
	.content {
		margin-top: 40px;
		width: 100%;
		background: #ffffff;
		box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.06);
		opacity: 1;
		border-radius: 14px 14px 0px 0px;
		.colorHead {
			height: 52px;
			border-bottom: 1px solid #f5f5f5;
			box-sizing: border-box;
			display: flex;
			align-items: center;
			justify-content: center;
			image {
				width: 24px;
				height: 24px;
				margin-right: 5px;
			}
			text {
				font-size: 16px;
				font-weight: 500;
				color: #6a6a6a;
			}
		}
		.colorBox {
			margin-top: 40px;
			display: flex;
			justify-content: space-around;
			.colorItem {
				display: flex;
				flex-direction: column;
				justify-content: center;
				.color {
					border-radius: 50%;
					width: 42px;
					height: 42px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					justify-content: center;
					view {
						width: 34px;
						height: 34px;
						border-radius: 50%;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						justify-content: center;
						image {
							width: 20px;
							height: 20px;
						}
					}
				}
				text {
					margin-top: 6px;
					text-align: center;
					font-weight: 400;
					color: #1c1c1c;
					font-size: 12px;
				}

				&:first-child {
					.color {
						view {
							border: 1px solid #e8e8e8;
						}
					}
				}
				&.active {
					.color {
						background: #dfdfdf;
					}
				}
			}
		}
		.colorBtn {
			padding: 50px 16px 20px;
			button {
				width: 100%;
				height: 50px;
				border-radius: 25px;
				background: #ffaa53;
				border: none;
				color: #ffffff;
				font-size: 16px;
				display: flex;
				align-items: center;
				justify-content: center;
				&::after {
					border: none;
				}
			}
		}
	}
	.payInfoBox {
		box-sizing: border-box;
		padding: 0 16px;
		.payInfo {
			box-sizing: border-box;
			padding: 0 16px;
			background: #ffffff;
			.payTitle {
				padding-top: 15px;
				display: flex;
				justify-content: flex-start;
				text {
					font-size: 18px;
					font-weight: 500;
					color: #1c1c1c;
				}
			}
			.payText {
				display: flex;
				justify-content: space-between;
				padding-bottom: 15px;
				view {
					margin-top: 8px;

					&:first-child {
						text {
							font-size: 14px;
							font-weight: 500;
							color: #8a8a8a;
						}
					}
					&:last-child {
						text {
							font-size: 14px;
							&:first-child {
								color: #8a8a8a;
								font-weight: 400;
								text-decoration: line-through;
							}
							&:last-child {
								font-weight: bold;
								color: #1c1c1c;
							}
						}
					}
				}
			}
		}
	}
	.payBtnBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 8px 0;
		background: #FFFFFF;
		margin-top: 35px;
		.payNumBox{
			padding-left: 16px;
			text{
				&:nth-child(1) {
					font-weight: 500;
					font-size: 14px;
					color: #8A8A8A;
				}
				&:nth-child(2) {
					margin-left: 6px;
					font-weight: bold;
					font-size: 21px;
					color: #FFBA53;
				}
			}
		}
		.payBtn{
			padding-right: 16px;
			button{
				background: #FFAA53;
				width: 140px;
				height: 43px;
				border-radius: 25px;
				border: none;
				color: #FFFFFF;
				font-size: 16px;
				&::after{
					border: none;
				}
			}
		}
	}
	.u-popup__content {
		background-color: #f6f7fc !important;
		> view {
			// background: #F6F7FC !important;
		}
	}
}
</style>

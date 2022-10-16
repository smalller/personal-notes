<template>
	<view class="cameraInfo">
		<view class="view">
			<view class="imgBox">
				<image :src="imgUrl" mode=""></image>
				<!-- 	<text>{{ photoHeight }}px</text>
				<text>{{ photoWidth }}px</text> -->
			</view>
			<view class="errInfo" v-if="!photoStatus">
				<view>
					<img src="../static/image/err.png" alt="" />
					{{ errMsg }}
				</view>
			</view>
		</view>
		<view class="content">
			<view class="colorBtn">
				<button type="default" v-if="photoStatus" @click="uploadFile">使用照片</button>
				<button class="saveBtn" v-if="!photoStatus" @click="openSelectPhoto">重新拍摄</button>
			</view>
		</view>
		<helangCompress ref="helangCompress"/>
	</view>
</template>

<script>
import { reviewImg } from '../../api/camera.js';
import { uploadFile } from '../../base/common.js';
import helangCompress from '../../components/helang-compress/helang-compress';
export default {
	data() {
		return {
			base64: '',
			src: '',
			imgUrl: '',
			photoStatus: true,
			spec: '1',
			photoKey: '',
			errMsg: '',
			cameraType: '',
			eventChannel: null
		};
	},
	components: {
		helangCompress
	},
	onLoad(e) {
		console.log(e);
		this.getImgBase64(e.url);
		this.cameraType = e.type;
		this.eventChannel = this.getOpenerEventChannel();
	},
	onUnload() {
		this.imgUrl = '';
	},
	methods: {
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
			uni.showLoading({
				mask: true,
				title: '检测照片中'
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
					// this.imgUrl = res.data.previewUrl;
					// this.photoKey = res.data.photoKey;
					// this.imgUrls.push({
					// 	key: res.data.photoKey,
					// 	url: res.data.previewUrl,
					// 	color: this.color
					// });

					this.photoStatus = res.data.pass;
					this.errMsg = res.data.reasons;
				}
				uni.hideLoading();
			});
		},
		//重新选择
		openSelectPhoto() {
			const that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				sourceType: [that.cameraType],
				success(e) {
					// console.log(e.tempFilePaths[0]);
					that.getImgBase64(e.tempFilePaths[0]);
				}
			});
		},
		//上传图片
		uploadFile() {
			const that = this;
			console.log(this.src);
			uploadFile([this.src], 'image').then(res => {
				if(that.eventChannel) {
					that.eventChannel.emit('uploadSuccess', res)
				}
				uni.navigateBack({
					delta: 1
				})
			});
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
		width: 179px;
		image {
			width: 100%;
			height: 221px;
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
		// background: #ffffff;
		// box-shadow: 0px -2px 6px rgba(0, 0, 0, 0.06);
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
	.u-popup__content {
		background-color: #f6f7fc !important;
		> view {
			// background: #F6F7FC !important;
		}
	}
}
</style>

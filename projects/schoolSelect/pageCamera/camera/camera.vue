<template>
	<view class="camera">
		<view class="cameraHead">
			<view class="titleBox"><text>学籍照</text></view>
			<view class="headInfo">
				<view class="">
					<view class="headInfoItem">
						<text>像素尺寸</text>
						<text>358x441px</text>
					</view>
					<view class="headInfoItem">
						<text>分辨率</text>
						<text>300DPI</text>
					</view>
					<view class="headInfoItem">
						<text>文件大小</text>
						<text>50k-200k</text>
					</view>
				</view>
				<view class="colorBox">
					<view class="colorTitle"><text>背景颜色</text></view>
					<view class="colorSelectBox">
						<view class="colorItem">
							<view class="color"></view>
							<text>白色</text>
						</view>
						<view class="colorItem">
							<view class="color"></view>
							<text>红色</text>
						</view>
						<view class="colorItem">
							<view class="color"></view>
							<text>浅蓝色</text>
						</view>
						<view class="colorItem">
							<view class="color"></view>
							<text>深蓝色</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cameraInfo">
			<view class="titleBox"><text>拍照指南</text></view>
			<view class="cameraInfoText">
				<swiper @change="infoChange" :autoplay="true" :interval="2000" :circular="true">
					<swiper-item><image src="../static/image/camera/bj1.png" mode=""></image></swiper-item>
					<swiper-item><image src="../static/image/camera/bj2.png" mode=""></image></swiper-item>
					<swiper-item><image src="../static/image/camera/bj3.png" mode=""></image></swiper-item>
				</swiper>
				<view class="infoText">
					<text>{{ list[index] }}</text>
					<view><view v-for="(item, i) in list" :key="item" :class="{ active: i === index }"></view></view>
				</view>
			</view>
		</view>
		<view class="btnBox">
			<button type="default" class="albumBtn" @click="openCamera('album')">相册上传</button>
			<button type="default" class="cameraBtn" @click="openCamera('camera')">拍摄</button>
		</view>
	</view>
</template>

<script>
	// import Cropper from '@/components/yankai-cropper/cropper.vue';
export default {

	data() {
		return {
			list: ['光线充足，曝光正常', '姿势端正，五官无遮挡', '画面清晰，免冠免饰'],
			index: 0
		};
	},
	methods: {
		infoChange(item) {
			this.index = item.detail.current;
		},
		openCamera(type) {
			uni.chooseImage({
				sourceType: [type],
				count: 1,
				crop: {
					width: '358px',
					height: '441px',
					resize: false
				},
				success: (e) => {
					uni.compressImage({
						src: e.tempFilePaths[0],
						width: '358px',
						height: '441px',
						success(data) {
							uni.navigateTo({
								url: `./cameraInfo?url=${data.tempFilePath}`
							})
						}
					})
					
				}
			})
		},
	}
};
</script>

<style lang="scss">
.camera {
	margin-top: 4px;
	background: #ffffff;
	padding: 0 16px;
	box-sizing: border-box;
	.titleBox {
		margin-top: 18px;
		margin-bottom: 14px;
		text {
			font-size: 18px;
			font-weight: 500;
			color: #1c1c1c;
		}
	}
	.cameraHead {
		.headInfo {
			border-radius: 6px;
			background: #f6f7fc;
			width: 100%;
			height: 143px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			> view {
				&:first-child {
					display: flex;
					padding-top: 23px;
					justify-content: space-between;
					.headInfoItem {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						text {
							&:first-child {
								font-size: 12px;
								font-weight: 400;
								color: #8a8a8a;
							}
							&:last-child {
								font-size: 18px;
								font-weight: 500;
								color: #1c1c1c;
								margin-top: 6px;
							}
						}
					}
				}
			}
			.colorBox {
				padding: 0 15px;
				display: flex;
				justify-content: space-between;
				align-self: center;
				padding-bottom: 18px;
				.colorTitle {
					color: #8a8a8a;
					font-size: 12px;
					font-weight: 400;
					display: flex;
					align-items: center;
				}
				.colorSelectBox {
					display: flex;
					.colorItem {
						flex: 1;
						display: flex;
						align-items: center;
						margin-left: 15px;
						.color {
							width: 16px;
							height: 16px;
							box-sizing: border-box;
							border-radius: 50%;
						}
						&:nth-child(1) {
							.color {
								border: 1px solid #e8e8e8;
								background: #ffffff;
							}
						}
						&:nth-child(2) {
							.color {
								background: #861a1d;
							}
						}
						&:nth-child(3) {
							.color {
								background: #93cdfc;
							}
						}
						&:nth-child(4) {
							.color {
								background: #3856b4;
							}
						}
						text {
							margin-left: 4px;
							white-space: nowrap;
							font-size: 12px;
							font-weight: 400;
							color: #1c1c1c;
						}
					}
				}
			}
		}
	}
	.cameraInfo {
		margin-top: 40px;
		.titleBox {
		}
		.cameraInfoText {
			border-radius: 6px;
			overflow: hidden;
			position: relative;
			height: calc((100vw - 32px) / 1.45957);
			swiper {
				width: 100%;
				height: 100%;
				swiper-item {
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.infoText {
			position: absolute;
			bottom: 0;
			width: 100%;
			height: 37px;
			background: rgba(144, 239, 144, 0.39);
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 14px;
			box-sizing: border-box;
			text {
				color: #ffffff;
				font-size: 16px;
			}
			> view {
				width: 44px;
				display: flex;
				justify-content: space-between;
				> view {
					width: 9px;
					height: 9px;
					background: #ffffff;
					border-radius: 4px;
					transition: 0.5s;
					&.active {
						background: #ffba53;
						width: 16px;
					}
				}
			}
		}
	}
	.btnBox{
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 35px 0;
		button{
			box-sizing: border-box;
			width: 165px;
			height: 50px;
			border-radius: 25px;
			border: none;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #8A8A8A;
			font-size: 16px;
			background: #F6F7FC;
			margin: 0
			
			
		}
		.cameraBtn{
			background: #FFAA53;
			color: #FFFFFF;
			&:after{
				border-color: rgba(0,0,0,0)
			}
		}
		.albumBtn{
			&:after{
				border-color: rgba(0,0,0,0)
			}
		}
	}
}
</style>

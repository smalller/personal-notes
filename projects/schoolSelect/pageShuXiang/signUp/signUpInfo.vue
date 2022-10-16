<template>
	<view class="signInfo">
		<view class="signInfoHead"><text>* 请添加孩子证件照和生活照各一张</text></view>
		<view class="signInfoContent">
			<view class="signInfoForm">
				<view class="formItem">
					<view class="itemTitleBox">
						<view class="title">
							<text>孩子证件照</text>
							<text>*</text>
						</view>
					</view>
					<view class="itemContent">
						<view class="imgSelect">
							<view class="selectBtn" @click="selectCameraTypeShow = true" v-if="!idPhoto">
								<u-icon name="plus" color="#f6a13e" size="36px" />
								<text>添加孩子证件照</text>
							</view>
							<view v-else @click="selectCameraTypeShow = true" class="selectImgBtn"><image :src="idPhoto" mode=""></image></view>
						</view>
					</view>
				</view>
				<view class="formItem">
					<view class="itemTitleBox">
						<view class="title">
							<text>用户头像</text>
							<text>*</text>
						</view>
						<view class="subTitle"><text>生活照将用于参赛用户头像</text></view>
					</view>
					<view class="itemContent">
						<view class="imgSelect">
							<view class="selectBtn" @click="opemSelectPhoto" v-if="!lifePhoto">
								<u-icon name="plus" color="#f6a13e" size="36px" />
								<text>添加用户头像</text>
							</view>
							<view v-else class="selectImgBtn" @click="opemSelectPhoto"><image :src="lifePhoto" mode=""></image></view>
						</view>
					</view>
				</view>
			</view>
			<view class="signInfoBtnBox"><button type="default" @click="submit">立即报名</button></view>
		</view>
		<u-action-sheet :show="selectCameraTypeShow" @close="selectCameraTypeShow = false" cancelText="取消" :closeOnClickOverlay="true" :round="10">
			<view class="selectBox">
				<button type="default" @click="selectCameraType(1)">
					在线制作证件照
					<view class="tag"><text>推荐</text></view>
				</button>
				<button type="default" @click="selectCameraType(2)">拍摄</button>
				<button type="default" @click="selectCameraType(3)">从相册上传</button>
			</view>
		</u-action-sheet>
	</view>
</template>

<script>
import { uploadFile, getIDPhoto } from '../../base/common.js';

import {sign} from '../../api/shuxiang.js'
export default {
	data() {
		return {
			selectCameraTypeShow: false,
			formData: {},
			idPhoto: '', //证件照
			lifePhoto: '' //生活照
		};
	},
	onShow() {
		this.formData = uni.getStorageSync('signUpInfo');
		if(uni.getStorageSync('createPhoto')) {
			const photoData = uni.getStorageSync('createPhoto')
			this.idPhoto = photoData.url;
		}
	},
	onUnload() {
		if(uni.getStorageSync('createPhoto')){
			uni.removeStorageSync('createPhoto');
		}
	},
	onLoad(e) {
		for (let key in e) {
			e[key] = decodeURI(e[key])
		}
		this.formData = e;
		uni.setStorageSync('signUpInfo', e);
		
	},
	methods: {
		//生成证件照
		getIDPhoto() {
			getIDPhoto()
			this.selectCameraTypeShow = false
		},
		//打开证件照选择
		openSelectIDPhoto() {
			uni.showActionSheet({
				itemList: ['']
			});
		},
		selectCameraType(type) {
			switch (type) {
				case 1:
					this.getIDPhoto();
					break;
				case 2:
					this.openCamera('camera');
					break;
				case 3:
					this.openCamera('album');
					break;
			}
		},
		//选择或拍摄证件照片
		openCamera(type = 'album') {
			const that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				sourceType: [type],
				success(e) {
					console.log(e);
					uni.navigateTo({
						url: `../../pageCamera/cameraTesting/cameraTesting?url=${e.tempFilePaths[0]}&type=${type}`,
						events: {
							uploadSuccess: e => {
								that.idPhoto = e[0];
								that.selectCameraTypeShow = false
							}
						}
					});
				}
			});
		},
		// 选择生活照
		opemSelectPhoto() {
			const that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				success: e => {
					// e.tempFilePaths[0]
					uploadFile(e.tempFilePaths, 'image').then(res => {
						 console.log(res);
						that.lifePhoto = res[0];
					});
				}
			});
		},
		//提交报名信息
		submit() {
			if(!this.idPhoto) {
				uni.showToast({
					icon: 'none',
					title: '请上传证件照'
				})
				return
			}
			if(!this.lifePhoto) {
				uni.showToast({
					icon: 'none',
					title: '请上传生活照'
				})
				return
			}
			sign(Object.assign(this.formData, {
				idPhoto: this.idPhoto,
				lifePhoto: this.lifePhoto,
				signType: 0
			})).then(res => {
				console.log(res);
				if(+res.code === 0) {
					
					uni.navigateBack({
						delta: 2,
						success: () => {
							uni.$emit('signSuccess')
							uni.showToast({
								icon: 'success',
								title: '报名成功',
							})
						}
					})
				}  else if(+res.code === -99) {
					uni.showToast({
						icon: 'error',
						title: '报名已结束'
					})
				} else {
					uni.showToast({
						icon: 'error',
						title: res.msg
					})
				}
			})
		}
	}
};
</script>

<style lang="scss">
.signInfo {
	width: 100vw;
	height: 100vh;
	display: flex;
	flex-direction: column;
	.signInfoHead {
		width: 100%;
		height: 36px;
		background: #f6f6f6;
		display: flex;
		align-items: center;
		padding: 0 15px;
		box-sizing: border-box;
		text {
			font-weight: bold;
			color: #ff7d6b;
			font-size: 14px;
		}
	}
	.signInfoContent {
		width: 100%;
		flex: 1;
		display: flex;
		background: #ffffff;
		flex-direction: column;
		justify-content: space-between;
		.signInfoForm {
			width: 100%;
			padding: 0 15px;
			box-sizing: border-box;
			.formItem {
				margin-top: 26px;
				margin-bottom: 6px;
				.itemTitleBox {
					.title {
						text {
							font-weight: bold;
							color: #6c6c6c;
							font-size: 16px;
							&:nth-child(2) {
								color: #ff3014;
							}
						}
					}
					.subTitle {
						margin-top: 4px;
						text {
							font-weight: 400;
							color: #c4c4c4;
							font-size: 11px;
						}
					}
				}
				.itemContent {
					margin-top: 18px;
					width: 100%;
					display: flex;
					justify-content: center;
					.imgSelect {
						width: 130px;
						height: 180px;
						border: 2px solid #f6a13e;
						box-sizing: border-box;
						border-radius: 8px;
						overflow: hidden;
						.selectBtn {
							width: 100%;
							height: 100%;
							background: #fff7e2;
							box-sizing: border-box;
							display: flex;
							flex-direction: column;
							align-items: center;
							justify-content: space-around;
							text {
								color: #f6a13e;
								&:nth-child(1) {
									font-size: 72px;
								}
								&:nth-child(2) {
									font-size: 14px;
								}
							}
						}
						.selectImgBtn {
							width: 100%;
							height: 100%;
							image {
								width: 100%;
								height: 100%;
							}
						}
					}
				}
				&:nth-child(2) {
					.itemContent {
						.imgSelect {
							height: 130px;
						}
					}
				}
			}
		}
		.signInfoBtnBox {
			width: 100%;
			padding: 0 15px;
			margin-bottom: 20px;
			box-sizing: border-box;
			button {
				width: 100%;
				height: 44px;
				background: linear-gradient(270deg, #f6a13e 0%, #fec685 100%);
				border-radius: 22px;
				font-weight: 500;
				color: #ffffff;
				font-size: 16px;
				display: flex;
				justify-content: center;
				align-items: center;
				&::after {
					border: none;
				}
			}
		}
	}
	.selectBox {
		button {
			width: 100%;
			background-color: #ffffff;
			color: #1c1c1c;
			position: relative;
			.tag {
				position: absolute;
				right: 64px;
				top: 50%;
				transform: translateY(-50%);
				width: 51px;
				height: 24px;
				background: #ffd557;
				border-radius: 13px;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #883505;
				font-weight: 400;
				font-size: 14px;
			}
			border-bottom: 1px solid #e6e6e6;
			&:last-child {
				border: none;
			}
			&:active {
				background-color: #f0f0f0;
			}
			&::after {
				border: none;
			}
		}
	}
}
</style>

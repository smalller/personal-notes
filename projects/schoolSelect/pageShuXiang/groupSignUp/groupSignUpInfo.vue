<template>
	<view class="signInfo">
		<view class="signInfoHead"><text>* 请添加学校图片或标识</text></view>
		<view class="signInfoContent">
			<view class="signInfoForm">
				<view class="formItem">
					<view class="itemTitleBox">
						<view class="title">
							<text>学校图片</text>
							<text>*</text>
						</view>
						<view class="subTitle"><text>添加学校图片或标识以便于识别</text></view>
					</view>
					<view class="itemContent">
						<view class="imgSelect">
							<view class="selectBtn" @click="opemSelectPhoto" v-if="!schoolLogo">
								<u-icon name="plus" color="#f6a13e" size="36px" />
								<text></text>
							</view>
							<view v-else class="selectImgBtn" @click="opemSelectPhoto"><image :src="schoolLogo" mode=""></image></view>
						</view>
					</view>
				</view>
			</view>
			<view class="signInfoBtnBox"><button type="default" @click="submit">立即报名</button></view>
		</view>
	</view>
</template>

<script>
import { uploadFile } from '../../base/common.js';
import {sign} from '../../api/shuxiang.js'
export default {
	data() {
		return {
			selectCameraTypeShow: false,
			formData: {},
			schoolLogo: '' //生活照
		};
	},
	onLoad(e) {
		for (let key in e) {
			e[key] = decodeURI(e[key])
		}
		this.formData = e;
	},
	methods: {
		//打卡证件照选择
		openSelectIDPhoto() {
			uni.showActionSheet({
				itemList: ['']
			});
		},
		selectCameraType(type) {
			switch (type) {
				case 1:
					break;
				case 2:
					this.openCamera('camera');
					break;
				case 3:
					this.openCamera('album');
					break;
			}
		},
		// 选择学校图片
		opemSelectPhoto() {
			const that = this;
			uni.chooseImage({
				count: 1,
				sizeType: ['original'],
				success: e => {
					// e.tempFilePaths[0]
					uploadFile(e.tempFilePaths, 'image').then(res => {
						// console.log(res);
						that.schoolLogo = res[0];
					});
				}
			});
		},
		//提交报名信息
		submit() {
			if(!this.schoolLogo) {
				uni.showToast({
					icon: 'none',
					title: '请上传团体头像'
				})
				return
			}
			sign(Object.assign(this.formData, {
				schoolLogo: this.schoolLogo,
				signType: 1
			})).then(res => {
				console.log(res);
				if(+res.code === 0) {
					
					// uni.redirectTo({
					// 	url: '../shuXiang/shuXiang'
					// })
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
				} else if(+res.code === -99) {
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
						height: 130px;
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
							justify-content: center;
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

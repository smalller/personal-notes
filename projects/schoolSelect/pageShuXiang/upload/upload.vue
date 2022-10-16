<template>
	<view class="shuXiangUpload">
		<view class="teamInfo" v-if="signStatus == '2,4'">
			<u-cell-group :border="false">
				<u-cell @click="setGroup" :border="false" isLink size="large" title="参赛组别">
					<view slot="value">
						<text>{{ enrollName }}</text>
					</view>
				</u-cell>
			</u-cell-group>
		</view>
		<view class="uploadType">
			<view class="title">
				<span>选择作品类型</span>
				<img src="../../static/common/qu.png" />
			</view>
			<view class="upload-list">
				<u-button
					@click="setType(item)"
					v-for="(item, index) in typeList"
					:key="index"
					shape="circle"
					:type="upType === item.value ? 'warning' : 'info'"
					:plain="upType !== item.value"
				>
					{{ item.label }}
				</u-button>
				<!-- <u-button shape="circle">音频作品</u-button> -->
			</view>
		</view>
		<view class="teamInfo">
			<text>作品标题</text>
			<u--input style="border:none" 
			count 
			maxlength="40" 
			slot="value" v-model="formData.worksTitle" placeholder="请输入标题"></u--input>
		</view>
		<view class="upload-file">
			<view v-if="upType == 'Image'">
				<u-upload
					uploadIcon="plus"
					accept="image"
					:maxCount="10"
					:fileList="files['image']"
					@afterRead="afterRead"
					@delete="deletePic"
					name="image"
					:previewFullImage="true"
					class="upload-box"
					:width="imgWidth"
					:height="imgWidth"
				></u-upload>
			</view>
			<view v-if="upType == 'Video'">
				<view class="videoSelectBox" v-if="files['video'].length == 0" @click="selectVideoFile"><u-icon color="#c4c4c4" size="32" name="plus"></u-icon></view>
				<view v-else class="videoBox">
					<video :src="files['video'][0].url" controls></video>
					<image class="clearBtn" @click="files['video'] = []" src="../static/image/clearBtn.png" mode=""></image>
				</view>
			</view>
			<view class="uploadAudioBox" v-if="upType == 'Audio'">
				<text>音频封面</text>
				<u-upload
					:fileList="files['audioPic']"
					accept="image"
					@afterRead="afterRead"
					@delete="deletePic"
					name="audioPic"
					uploadIcon="plus"
					:maxCount="1"
					:previewFullImage="true"
					class="audioPic"
					width="174"
					height="98"
				></u-upload>
				<text>音频文件</text>
				<view class="" v-if="files['audio'].length == 0" @click="selectAudioFile"><image src="../static/image/upload.png" mode=""></image></view>
				<view class="audioName" v-else>
					<text>{{ files['audio'][0].name }}</text>
					<image class="clearBtn" @click="files['audio'] = []" src="../static/image/clearBtn.png" mode=""></image>
				</view>
				<!-- <u-upload :fileList="fileList3" @afterRead="afterRead" @delete="deletePic" name="Audio" multiple :maxCount="1" :previewFullImage="true" class="upload-box" accept="all">
					<view class="upload-video"><image src="../../static/student/add.png" mode="widthFix" class="img"></image></view>
				</u-upload> -->
			</view>
		</view>
		<view class="titleBox" style="margin-top:15px;margin-bottom:10px;">
			<u-textarea count maxlength="160" v-model="formData.description" placeholder="请简短介绍您的作品" border="bottom" count></u-textarea>
			<p class="notice">* 作品提交后将交由组委会审核，请耐心等待并留意通知</p>
		</view>
		<view class="btnBox"><button type="default" @click="save">提交作品</button></view>
		<view class="alert" v-if="alertShow">
			<view class="mask">
				
			</view>
			<view class="alertBox">
				<view class="">
					<text>请勿重复上传相同的作品</text>
				</view>
				<view class="btn" @click="closeALert">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import UIcon from '../../uni_modules/uview-ui/components/u-icon/u-icon.vue';
import region from '../components/region.vue';
import store from '../../store/index.js';
import { submitWork } from '../../api/shuxiang.js';
import { uploadFile } from '../../base/common.js';
import { group } from '../base/config.js';
export default {
	data() {
		return {
			show: false,
			formData: {
				groupType: '',
				worksCover: '',
				worksTitle: '',
				worksType: '',
				worksUrl: [],
				description: ''
			},
			enrollName: '',
			imgWidth: 0,
			files: {
				image: [],
				video: [],
				audio: [],
				audioPic: []
			},
			value: '',
			value1: '',
			cover: '',
			imagesUrl: '',
			video: '',
			typeList: [
				{
					label: '图片作品',
					value: 'Image'
				},
				{
					label: '视频作品',
					value: 'Video'
				},
				{
					label: '音频作品',
					value: 'Audio'
				}
			],
			upType: 'Image',
			signStatus: '',
			showGroup: false,
			groupList: [],
			alertShow: true,
		};
	},
	components: {
		region,
		UIcon
	},
	onLoad() {
		this.signStatus = uni.getStorageSync('signStatus');
		if (this.signStatus === '2,4') {
			this.groupList = group
				.filter(item => item.type === '团体')
				.map(item => {
					return {
						label: `${item.title}组-${item.type}(${item.age})`,
						index: item.index
					};
				});
			this.selectGroup(0);
		}
	},
	onReady() {
		const that = this;
		const query = uni.createSelectorQuery().in(this);
		query
			.select('.titleBox')
			.boundingClientRect(data => {
				console.log('得到布局位置信息' + JSON.stringify(data));
				that.imgWidth = (data.width - 30) * 0.3;
			})
			.exec();
	},
	methods: {
		closeALert() {
			console.log();
			this.alertShow = false
		},
		//选择组别
		setGroup() {
			const that = this;
			uni.showActionSheet({
				itemList: this.groupList.map(item => item.label),
				success: e => {
					that.selectGroup(e.tapIndex);
				}
			});
		},
		selectGroup(index) {
			this.enrollName = this.groupList[index].label;
			this.formData.groupType = this.groupList[index].index;
		},
		getGroup(data) {
			console.log(data.value);
			this.enrollName = data.value[0];
			this.signStatus = data.value[0].value;
			this.showGroup = false;
		},
		save() {
			this.formData.groupType = this.formData.groupType;
			this.formData.worksType = this.upType;
			this.formData.worksUrl = [];
			switch (this.upType) {
				case 'Image':
					this.formData.worksUrl = this.files['image'].map(item => item.url);
					this.formData.worksCover = this.formData.worksUrl[0];
					break;
				case 'Video':
					this.formData.worksUrl = this.files['video'].map(item => item.url);
					this.formData.worksCover = this.formData.worksUrl[0] + '?x-oss-process=video/snapshot,t_1000,m_fast';
					break;
				case 'Audio':
					this.formData.worksUrl = this.files['audio'].map(item => item.url);
					this.formData.worksCover = this.files['audioPic'][0].url;
					break;
				default:
					break;
			}
			if (this.signStatus === '2,4') {
				if (!this.formData.groupType) {
					uni.showToast({
						icon: 'none',
						title: '请选择组别'
					});
					return;
				}
			} else {
				console.log(1233);
				this.formData.groupType = this.signStatus;
			}

			if (!this.formData.worksTitle) {
				uni.showToast({
					icon: 'none',
					title: '请输入作品名称'
				});
				return;
			}
			if (!this.formData.worksUrl.length) {
				uni.showToast({
					icon: 'none',
					title: '请上传作品'
				});
				return;
			}
			if (!this.formData.description) {
				uni.showToast({
					icon: 'none',
					title: '请输入作品描述'
				});
				return;
			}
			uni.showLoading({
				mask: true,
				title: '提交中'
			})
			submitWork(this.formData).then(res => {
				if (+res.code === 0) {
					// console.log(res);
					uni.hideLoading()
					uni.navigateBack({
						delta: 1,
						success: r => {
							uni.$emit('sendWork');
							uni.showToast({
								icon: 'success',
								title: '作品已提交审核'
							});
						}
					});
				} else if (+res.code === -99) {
					uni.showToast({
						icon: 'error',
						title: '活动已结束'
					});
				} else {
					uni.showToast({
						icon: 'error',
						title: res.msg
					});
				}
			}).finally(() => {
				uni.hideLoading()
			});
		},
		setType(data) {
			if (data) {
				this.upType = data.value;
			}
		},
		//选择音频文件
		selectAudioFile() {
			const that = this;
			//#ifdef MP-WEIXIN
			wx.chooseMessageFile({
				count: 1,
				type: 'file',
				success: e => {
					if (e.tempFiles.length > 0) {
						const file = e.tempFiles[0];

						uni.getVideoInfo({
							src: file.path,
							success: async e => {
								console.log(e, file);
								if (e.type === 'audio/mpeg') {
									if (e.duration < 8 * 60) {
										const res = await uploadFile([file.path], 'audio');
										file.url = res[0];
										that.files['audio'] = [file];
									} else {
										uni.showToast({
											icon: 'none',
											title: '音频长度不能超过8分钟'
										});
									}
								} else {
									uni.showToast({
										icon: 'none',
										title: '只能选择MP3文件'
									});
								}
							},
							fail: e => {
								console.warn(e);
							}
						});
					}
				}
			});
			//#endif
		},
		// 删除图片
		deletePic(event) {
			this.files[event.name].splice(event.index, 1);
		},
		// 上传作品
		async afterRead(event) {
			let file = {};
			if (Array.isArray(event.file)) {
				file = event.file[0];
			} else {
				file = event.file;
			}
			if (event.name !== 'video') {
				this.uploadImage(file, event.name);
			} else {
				this.uploadVideo(file);
			}
		},
		// 上传图片
		uploadImage(file, type) {
			uni.getImageInfo({
				src: file.url,
				success: async e => {
					console.log(e);
					if (e.type === 'jpeg' || e.type === 'png') {
						uni.showLoading({
							mask: true,
							title: '上传中'
						})
						this.files[type].push({
							status: 'uploading',
							message: '上传中',
							...file
						});
						try{
							const res = await uploadFile([file.url], 'image');
							this.files[type] = this.files[type].map(item => {
								if (item.thumb === file.thumb) {
									return Object.assign(item, {
										status: 'success',
										message: '',
										url: res[0]
									});
								} else {
									return item;
								}
							});
							uni.hideLoading()
						}catch(e){
							this.files[type].pop()
							uni.hideLoading()
							uni.showToast({
								icon: 'none',
								title: '上传图片失败，请检查网络'
							})
							//TODO handle the exception
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: '请选择JPG或PNG格式图片'
						});
					}
				},
				fail: e => {
					uni.showToast({
						icon: 'none',
						title: '请选择JPG或PNG格式图片'
					});
				}
			});
		},
		//选择视频文件
		selectVideoFile() {
			const that = this;
			uni.chooseVideo({
				sourceType: ['album'],
				success: e => {
					this.uploadVideo({
						url: e.tempFilePath
					});
				}
			});
		},
		//上传视频
		uploadVideo(file) {
			uni.getVideoInfo({
				src: file.url,
				success: async e => {
					console.log(e);
					this.files['video'] = [];
					if (e.type === 'video/mp4') {
						if (e.duration < 8 * 60) {
							this.files['video'].push({
								status: 'uploading',
								message: '上传中',
								...file
							});
							const res = await uploadFile([file.url], 'video');
							this.files['video'] = [];
							this.files['video'].push(
								Object.assign(file, {
									status: 'success',
									message: '',
									url: res[0]
								})
							);
						} else {
							uni.showToast({
								icon: 'none',
								title: '视频长度不能超过8分钟'
							});
						}
					} else {
						uni.showToast({
							icon: 'none',
							title: '请选择MP4格式视频'
						});
					}
				},
				fail: e => {
					console.warn(e);
				}
			});
		}
	}
};
</script>

<style lang="scss">
.shuXiangUpload {
	background: #ffffff;
	min-height: 100vh;
	width: 100vw;
	.teamInfo {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 55px;
		padding: 0 15px;
		box-sizing: border-box;
		border-top: 1px solid #f6f7f9;
		border-bottom: 1px solid #f6f7f9;
		text {
			flex: 1;
		}
		.u-input {
			flex: 1;
			border: none;
			box-sizing: border-box;
		}
	}
	.uploadType {
		padding: 18px 15px 32px;
		box-sizing: border-box;
		.title {
			margin-bottom: 16px;
			span {
				font-size: 14px;
				font-weight: 500;
				color: #6a6a6a;
				line-height: 16px;
			}
			img {
				width: 14px;
				height: 14px;
				margin-left: 5px;
			}
		}
		.upload-list {
			display: inline-flex;
			.u-button--normal {
				padding: 0 12px;
				font-size: 12px;
				margin-right: 10px;
			}
			.u-button {
				height: 25px;
				font-size: 12px;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				line-height: 14px;
			}
		}
	}
	.upload-file {
		display: flex;
		margin-top: 20px;
		padding: 0 15px;
		box-sizing: border-box;
		width: 100%;
		.u-upload {
			// width: 98px;
			// margin-left: 15px;
			margin-top: 20px;
		}
		.upload-box {
			display: inline-flex;
		}
		.upload-video {
			width: 174px;
			height: 98px;
			background: #f0f0f0;
			.img {
				height: 32px;
				width: 32px;
				margin-left: 40%;
				margin-top: 20%;
				top: 50%;
				left: 50%;
			}
		}
		text {
			font-size: 14px;
			font-weight: 500;
			color: #6a6a6a;
			line-height: 16px;
		}
		.audioPic {
		}
		.videoBox {
			width: 174px;
			height: 98px;
			position: relative;
			video {
				width: 100%;
				height: 100%;
			}
			.clearBtn {
				position: absolute;
				width: 10px;
				height: 10px;
				right: 0;
				top: 0;
			}
		}
		.videoSelectBox {
			width: 174px;
			height: 98px;
			background: #f0f0f0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.uploadAudioBox {
			> text {
			}
			> view {
				.u-upload__button {
					margin: 0;
				}
				margin-top: 15px;
				&:nth-child(2) {
					margin-top: 16px;
					margin-bottom: 18px;
					background: #f0f0f0;
				}
				&:nth-child(4) {
					width: 126px;
					height: 44px;
					background: #f0f0f0;
					border-radius: 4px;
					display: flex;
					justify-content: center;
					align-items: center;
					image {
						width: 24px;
						height: 24px;
					}

					&.audioName {
						width: 142px;
						padding: 0 15px;
						box-sizing: border-box;
						height: 40px;
						background: #ffd9ac;
						border-radius: 6px;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						text {
							width: 100%;
							font-weight: bold;
							color: #ffffff;
							font-size: 14px;
							text-overflow: ellipsis;
							white-space: nowrap;
							overflow: hidden;
						}
						.clearBtn {
							position: absolute;
							width: 10px;
							height: 10px;
							right: 0;
							top: 0;
						}
					}
				}
			}
		}
	}
	.titleBox {
		view {
			&:nth-child(1) {
				border-color: #f6f7f9 !important;
			}
		}
	}
	.notice {
		font-size: 12px;
		font-family: PingFang SC-Regular, PingFang SC;
		font-weight: 400;
		color: #ff7d6b;
		line-height: 14px;
		margin: 15px;
	}
	.btnBox {
		// position: fixed;
		// box-sizing: border-box;
		bottom: 15px;
		width: 100%;
		// padding: 12px 15px;
		padding: 25px 15px;
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
	.alert{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 10;
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			background: rgba(0, 0, 0, 0.3);
			width: 100%;
			height: 100%;
			z-index: 1;
		}
		.alertBox{
			position: absolute;
			z-index: 2;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			width: 300px;
			background: #FFFFFF;
			border-radius: 24px;
			padding: 20px;
			box-sizing: border-box;
			view{
				&:first-child{
					display: flex;
					justify-content: center;
					text{
						color: #333333;
						font-weight: 700;
						font-size: 18px;
					}
				}
				&:last-child{
					margin-top: 20px;
					background: linear-gradient(270deg, #FF8B02 5.36%, #FFAF51 100%);
					border-radius: 40px;
					width: 100%;
					height: 44px;
					color: #FFFFFF;
					font-weight: 700;
					font-size: 18px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}
		}
		
	}
}
</style>

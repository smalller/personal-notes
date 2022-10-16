<template>
	<view class="IDCard">
		<view class="content">
			<image class="topBg" src="../../../static/image/sxtf/idBg1.png" mode="widthFix"></image>
			<image class="butBg" src="../../../static/image/sxtf/idbg2.png" mode="widthFix"></image>
			<view class="head">
				<text class="title">书香天府</text>
				<text class="subTitle">我读我秀阅读比赛</text>
				<text class="cardName">参 赛 证</text>
			</view>
			<view class="formData">
				<view class="infoBox">
					<view class="item">
						<text class="label">参赛人</text>
						<text class="value">{{signType === '0'?info.contestants:info.schoolName}}</text>
					</view>
					<view class="item">
						<text class="label">幼儿园</text>
						<text class="value">{{info.schoolName}}</text>
					</view>
					<view class="item">
						<text class="label">赛区</text>
						<text class="value">{{info.division}}</text>
					</view>
					<view class="item">
						<text class="label">组别</text>
						<text class="value">{{signType === '1'?'团体':`${groupItem.title}组-(${groupItem.age})`}}</text>
					</view>
					
				</view>
				<view class="photoBox" v-if="signType === '0'" @click="selectCameraTypeShow = true">
					<image :src="info.idPhoto" mode=""></image>
				</view>
			</view>
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
	import { uploadFile, getIDPhoto } from '@/base/common.js';
	import {getSignData, updateSignData} from '@/api/shuxiang.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				info: {},
				signType: '',
				dayjs: dayjs,
				idPhoto: '',
				selectCameraTypeShow: false,
				group: [
					{
						title: 'A',
						age: '0-2岁',
						type: '个人',
						index: 1,
					},
					{
						title: 'B',
						age: '0-2岁',
						type: '团体',
						index: 2,
					},
					{
						title: 'C',
						age: '3-6岁',
						type: '个人',
						index: 3,
					},
					{
						title: 'D',
						age: '3-6岁',
						type: '团体',
						index: 4,
					}
				],
				groupItem: {}
			}
		},
		onShow() {
			if(uni.getStorageSync('createPhoto')) {
				const photoData = uni.getStorageSync('createPhoto')
				this.idPhoto = photoData.url;
				this.editPhoto()
			}
		},
		onUnload() {
			if(uni.getStorageSync('createPhoto')){
				uni.removeStorageSync('createPhoto');
			}
		},
		created() {
			this.getSignData()
		},
		methods: {
			getSignData() {
				getSignData().then(res => {
					if(+res.code ===0) {
						console.log(res);
						this.info = res.data;
						this.signType = res.data.signType.toString();
						if(this.signType === '0'){
							this.groupItem = this.group.find(item => +item.index === +res.data.groupType)
						}
					}
				})
			},
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
			editPhoto() {
				
				updateSignData({
					id: this.info.id,
					idPhoto: this.idPhoto
				}).then(res => {
					if(+res.code === 0) {
						this.getSignData()
						uni.showToast({
							icon: 'none',
							title: '更新成功'
						})
					}
				})
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
							url: `/pageCamera/cameraTesting/cameraTesting?url=${e.tempFilePaths[0]}&type=${type}`,
							events: {
								uploadSuccess: re => {
									that.idPhoto = re[0];
									that.selectCameraTypeShow = false
									that.editPhoto()
								}
							}
						});
					}
				});
			},
		}
	}
</script>

<style lang="less">
.IDCard{
	width: 100vw;
	height: 100vh;
	background: #4374E6;
	box-sizing: border-box;
	padding: 26px 30px 0;
	.content{
		position: relative;
		border-radius: 20px;
		background: #FFFFFF;
		width: 100%;
		overflow: hidden;
		padding-bottom: 150px;
		>image{
			z-index: 1;
			position: absolute;
			width: 100%;
			left: 0;
		}
		.topBg{
			top: 0;
		}
		.butBg{
			bottom: 0;
		}
		.head{
			position: relative;
			z-index: 2;
			margin-top: 40px;
			display: flex;
			flex-direction: column;
			align-items: center;
			.title{
				color: #3B87F7;
				font-weight: bold;
				font-size: 34px;
			}
			.subTitle{
				font-weight: 400;
				line-height: 23px;
				color: #3B87F7;
				font-size: 26px;
			}
			.cardName{
				color: #EB4E3D;
				font-size: 36px;
				margin-top: 10px;
			}
		}
		.formData{
			position: relative;
			z-index: 2;
			padding: 0 16px;
			box-sizing: border-box;
			margin-top: 30px;
			display: flex;
			.infoBox{
				flex: 1;
				.item{
					width: 100%;
					height: 42px;
					box-sizing: border-box;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #E9E9E9;
					.label{
						color: #25262B;
						font-size: 16px;
						font-weight: bold;
					}
					.value{
						margin-left: 14px;
						color: #25262B;
						font-weight: 500;
						font-size: 16px;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
					}
				}
			}
			.photoBox{
				margin-left: 10px;
				width: 120px;
				height: 168px;
				border: 1px solid #FFAA53;
				border-radius: 6px;
				box-sizing: border-box;
				overflow: hidden;
				image{
					width: 100%;
					height: 100%;
				}
			}
		}
	}
}
</style>

<template>
	<view class="signUp">
		<view class="signUpHead"><image src="../static/image/img.png" mode="widthFix"></image></view>
		<view class="hotBox">
			<view class="hot">
				<image src="../static/image/hot.png" mode=""></image>
				<text>已有</text>
				<view class="textBox"><text>{{signCount + 316}}</text></view>
				<text>人参加活动</text>
			</view>
		</view>
		<view class="formBox">
			<view class="formItem">
				<view class="itemTitle">
					<text>赛区</text>
					<text>*</text>
				</view>
				<view class="itemContent" @click="openSelectRegion">
					<!-- <view class="selectBtn" @click="openSelectGroup">
						<text>{{ selectGroupText }}</text>
					</view> -->
					<u--input :value="formData.division" placeholder="请选择参赛赛区" suffixIcon="arrow-down" :readonly="true" suffixIconStyle="color: #A6A6A6"></u--input>
				</view>
			</view>
			<view class="formItem">
				<view class="itemTitle">
					<text>单位</text>
					<text>*</text>
				</view>
				<view class="itemContent" >
					<u--input
						v-model="formData.schoolName"
						placeholder="请输入幼儿园/早托育机构等"
						suffixIconStyle="color: #A6A6A6"
					></u--input>
				</view>
			</view>
			<view class="formItem">
				<view class="itemTitle">
					<text>联系人</text>
					<text>*</text>
				</view>
				<view class="itemContent"><u--input v-model="formData.userName" placeholder="请填写联系人"></u--input></view>
			</view>
			<view class="formItem">
				<view class="itemTitle">
					<text>联系电话</text>
					<text>*</text>
				</view>
				<view class="itemContent"><u--input type="number" v-model="formData.userMobile" placeholder="请填写联系电话"></u--input></view>
			</view>
		</view>
		<view class="btnBox"><button type="default" @click="toSignInfo">立即报名</button></view>
		<view class="moreBox">
			<view class="moreTitle"><text>最新参与用户</text></view>
			<view class="moreContent">
				<view class="moreContent">
					<view class="moreItem" v-for="(item, index) in signList" v-if="index<3"  :key="index">
						<image :src="index === 1 ?'../static/image/volume2.png':'../static/image/volume1.png'" mode=""></image>
						<text>{{item.contestants}}</text>
						<text>{{item.userMobile}}</text>
						<text>{{item.timeText}}</text>
					</view>
				</view>
			</view>
		</view>
		<region ref="region" @select="selectRegion" />
		<u-picker @cancel="selectGroupShow = false" :show="selectGroupShow" :columns="[groupList]" keyName="schoolName" @confirm="getSelectGroup"></u-picker>
	</view>
</template>

<script>
import region from '../components/region.vue';
import {getGroupList} from '../../api/shuxiang.js'
import {getSignNum} from '../../api/shuxiang.js'
import qs from 'qs';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
export default {
	components: {
		region
	},
	data() {
		return {
			region: {},
			formData: {
				userName: '', //联系人
				groupType: '24', //组别
				division: '成都市-金牛区', //赛区
				schoolName: '', //学校名称
				userMobile: ''
			},
			groupList: [],
			selectGroupShow: false,
			signList: [],
			signCount: 0,
			timer: null
		};
	},
	onLoad() {
		this.getLocation()
		this.getSignNum()
	},
	methods: {
		//获取最新报名情况
		getSignNum() {
			getSignNum().then(res => {
				if(+res.code === 0) {
					this.signCount = res.data.signCount;
					this.signList = res.data.SxAppletSignVo.map(item => {
						item.timeText = dayjs(item.createTime).fromNow()
						const n = item.userMobile.substring(3,7)
						item.userMobile = item.userMobile.replace(n,'****')
						return item;
					});
					this.startTime()
				}
			})
		},
		startTime() {
			if(this.timer) {
				clearInterval(this.timer)
				this.timer = null
			}
			this.timer = setInterval(() => {
				if(this.signList.length>3) {
					this.signList.push(this.signList.shift())
				}
			}, 3000)
		},
		getLocation() {
			try{
				// const location = JSON.parse(uni.getStorageSync('location')).regeocodeData;
				// const city = location.addressComponent.city;
				// this.formData.division = city === '成都市'?`${city}-${district}`:`${city}-全部`;
			}catch{
				
			}
			this.formData.division = `成都市-青羊区`;
			// this.getGroupList()
		},
		//查询团体列表
		getGroupList() {
			getGroupList({
				division: this.formData.division
			}).then(res => {
				if(+res.code === 0) {
					console.log(res);
					this.groupList = res.data;
				}
			})
		},
		//选择赛区
		openSelectRegion() {
			this.$refs.region.init(this.formData.division);
		},
		selectRegion(e) {
			this.region = {
				city: e.value[0].label,
				area: e.value[1].label
			};
			this.formData.division = `${this.region.city}-${this.region.area}`;
			this.getGroupList()
		},
		//选择团体幼儿园
		openSelectGroup() {
			if(!this.formData.division) {
				uni.showToast({
					icon: 'none',
					title: '请先选择赛区'
				});
				return false;
			}
			this.selectGroupShow = true;
		},
		getSelectGroup(e) {
			this.formData.schoolId = e.value[0].id;
			this.formData.schoolName = e.value[0].schoolName;
			this.selectGroupShow = false;
		},
		// 前往上传报名照片页面
		toSignInfo() {
			if (!this.formData.userName) {
				uni.showToast({
					icon: 'none',
					title: '请输入联系人'
				});
				return;
			}
			if (!this.formData.division) {
				uni.showToast({
					icon: 'none',
					title: '未选择赛区'
				});
				return;
			}
			if (!this.formData.schoolName) {
				uni.showToast({
					icon: 'none',
					title: '请输入单位'
				});
				return;
			}
			if (!this.formData.userMobile) {
				uni.showToast({
					icon: 'none',
					title: '请输入联系电话'
				});
				return;
			} else {
				const rex = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
				if(!rex.test(this.formData.userMobile)) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的联系电话'
					});
					return;
				}
			}
			uni.navigateTo({
				url: `groupSignUpInfo?${qs.stringify(this.formData)}`
			});
		}
	}
};
</script>

<style lang="scss">
.signUp {
	width: 100vw;
	.signUpHead {
		width: 100%;
		image {
			width: 100%;
		}
	}
	.hotBox {
		width: 100%;
		padding-top: 18px;
		padding-bottom: 26px;
		display: flex;
		justify-content: center;
		.hot {
			display: flex;
			align-items: center;
			padding: 0 16px;
			height: 36px;
			background: #fff7e2;
			border-radius: 37px;
			image {
				width: 30px;
				height: 30px;
				margin-right: 4px;
			}
			> text {
				font-weight: 500;
				color: #ff7d6b;
				font-size: 14px;
			}
			.textBox {
				margin: 0 4px;
				height: 28px;
				background: #ff7d6b;
				border-radius: 5px;
				display: flex;
				align-items: center;
				padding: 0 6px;
				font-weight: bold;
				color: #ffffff;
				font-size: 18px;
			}
		}
	}
	.formBox {
		padding: 0 15px;
		box-sizing: border-box;
		width: 100%;
		.formItem {
			margin-bottom: 16px;
			.itemTitle {
				display: flex;
				align-items: center;
				margin-bottom: 8px;
				text {
					font-weight: bold;
					color: #6c6c6c;
					font-size: 16px;
					&:nth-child(2) {
						color: #ff3014;
					}
				}
			}
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
	.btnBox {
		margin-top: 26px;
		padding: 0 15px;
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
	.moreBox {
		width: calc(100% - 30px);
		margin-top: 20px;
		margin-bottom: 28px;
		height: 158px;
		background: #fff7e2;
		border-radius: 8px;
		margin-left: 50%;
		transform: translateX(-50%);
		padding: 0 20px;
		box-sizing: border-box;
		.moreTitle {
			width: 100%;
			display: flex;
			justify-content: center;
			padding: 12px 0;
			box-sizing: border-box;
			text {
				font-weight: bold;
				color: #f6a13e;
				font-size: 16px;
			}
		}
		.moreItem {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 32px;
			box-sizing: border-box;
			image {
				width: 18px;
				height: 18px;
			}
			text {
				font-weight: bold;
				color: #ffd9ac;
				font-size: 12px;
			}
			&:nth-child(2) {
				padding: 0 22px;
				margin: 8px 0;
				height: 42px;
				background: #fee5c7;
				border-radius: 21px;
				text {
					color: #df851c;
					font-size: 13px;
				}
			}
		}
	}
}
</style>

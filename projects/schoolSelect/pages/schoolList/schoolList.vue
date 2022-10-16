<template>
	<view class="schoolList">
		<view class="searchBox">
			<u-search
				placeholder="请输入您要查找的学校名字"
				@search="searchData"
				height="34"
				v-model="formData.name"
				bgColor="#f6f7f9"
				:clearabled="true"
				:show-action="true"
				actionText="搜索"
				:animation="true"
			></u-search>
		</view>
		<view class="screenBox">
			<view class="screenItem" @click="selectTab(1)" :class="{ active: activeType === 1 }">
				<text>{{ !formData.city ? '城市' : formData.city }}</text>
				<u-icon name="arrow-up-fill" size="10px"></u-icon>
			</view>
			<view class="screenItem" @click="selectTab(2)" :class="{ active: activeType === 2 }">
				<text>{{ formData.districtAndCounty.length === 0 ? '区域' : formData.districtAndCounty.toString() }}</text>
				<u-icon name="arrow-up-fill" size="10px"></u-icon>
			</view>
			<view class="screenItem" @click="selectTab(3)" :class="{ active: activeType === 3 }">
				<text>{{ !formData.nature ? '性质' : nature }}</text>
				<u-icon name="arrow-up-fill" size="10px"></u-icon>
			</view>
			<view class="selectCommonBox" v-show="selectQuXianShow">
				<view class="mask" @click="selectQuXianShow = false"></view>
				<view class="quxianContent">
					<view class="quxianBox">
						<view class="quxian">
							<view
								v-for="item in districtAndCountyList"
								:class="{ active: selectDistrictAndCounty.indexOf(item.name) > -1 }"
								:key="item.adcode"
								@click="selectQuXian(item.name)"
							>
								<text>{{ item.name }}</text>
							</view>
						</view>
						<button @click="subSelectQuXian()">确定</button>
					</view>
				</view>
			</view>
			<view class="selectCommonBox" v-show="natureShow">
				<view class="mask" @click="natureShow = false"></view>
				<view class="quxianContent">
					<view class="quxianBox">
						<view class="quxian">
							<view :class="{ active: nature === '公办' }" @click="selectNature('公办')"><text>公办</text></view>
							<view :class="{ active: nature === '民办' }" @click="selectNature('民办')"><text>民办</text></view>
						</view>
						<button @click="subSelectNature()">确定</button>
					</view>
				</view>
			</view>
		</view>
		<scroll-view
			class="schoolListBox"
			:scroll-with-animation="true"
			@scrolltolower="getSchoolData()"
			v-if="list.length > 0"
			:scroll-y="true"
			:lower-threshold="100"
			refresher-enabled="true"
			:refresher-triggered="triggered"
			:refresher-threshold="100"
			refresher-background="#FFFFFF"
			@refresherpulling="onPulling"
			@refresherrefresh="onRefresh"
			@refresherrestore="onRestore"
			@refresherabort="onAbort"
		>
			<view class="schoolItem" v-for="item in list" :key="item.id" @click="toSchoolDetails(item)">
				<view class="schoolImg"><image :src="item.imagesUrl" mode="aspectFill"></image></view>
				<view class="schoolInfo">
					<view class="schoolName">
						<text>{{ item.name }}</text>
					</view>
					<view class="schoolTag">
						<view class="tag" v-for="(txt, index) in splitTags(item.tag)" :key="index">
							<text>{{ txt }}</text>
						</view>
					</view>
					<view class="schoolMore">
						<view class="schoolAddress">
							<image src="../../static/address.png" mode=""></image>
							<text>{{ item.city }}-{{ item.county }}</text>
						</view>
						<view class="schoolMsgLength">
							<image src="../../static/message.png" mode=""></image>
							<text>{{ item.commentNums }}</text>
						</view>
					</view>
				</view>
			</view>
			<u-loadmore  :status="listStatus"></u-loadmore>
		</scroll-view>
		<u-empty v-else text="没有学校" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<view>
			<u-popup :show="selectCityShow" mode="top" @close="selectCityClose" @open="selectCityOpen"><t-index-address @select="citySelect"></t-index-address></u-popup>
		</view>
	</view>
</template>

<script>
import qs from 'qs';
import { getSchoolList } from '../../api/school.js';

export default {
	data() {
		return {
			triggered: false,
			locationData: null,
			activeType: '',
			selectCityShow: false,
			districtAndCountyList: [],
			selectDistrictAndCounty: [],
			selectQuXianShow: false,
			natureShow: false,
			nature: '',
			formData: {
				name: '',
				province: '青羊区',
				city: '成都市',
				districtAndCounty: [],
				nature: ''
			},
			pageForm: {
				pageNo: 1,
				pageSize: 15
			},
			list: [],
			showLoading: false,
			listStatus: 'loading'
		};
	},
	onReady() {},
	onLoad() {
		// this.getLocation();
		this.searchData();
	},
	onShow() {
		uni.removeStorage({
			key: 'schoolInfo'
		});
	},
	methods: {
		onPulling(e) {
			// console.log('onpulling', e.detail.dy);
		},
		onRefresh() {
			this.triggered = true
			// this.list = []
			this.pageForm.pageNo = 1
			this.listStatus = 'loading'
			this.getSchoolList()
		},
		onRestore() {
			this.triggered = 'restore'; // 需要重置
			console.log('onRestore');
		},
		onAbort() {
			console.log('onAbort');
		},
		splitTags(tag) {
			if (typeof tag === 'string') {
				let arr = [];
				return (arr = tag.split(/[,，]/));
			} else {
				return [];
			}
		},
		getLocation() {
			// const e = JSON.parse(uni.getStorageSync('location'));
			// this.formData.city = e.regeocodeData.addressComponent.city;
			// this.formData.province = e.regeocodeData.addressComponent.province;
			// uni.setNavigationBarTitle({
			// 	title: e.regeocodeData.addressComponent.city + '学校介绍'
			// });
			// this.queryDistrictAndCounty();
		},
		toSchoolDetails(item) {
			uni.setStorageSync('schoolInfo', JSON.stringify(item));
			uni.navigateTo({
				url: `../schoolDetails/schoolDetails`
			});
		},
		//按条件搜索学校列表
		searchData() {
			this.list = [];
			this.pageForm = {
				pageNo: 1,
				pageSize: 15
			};
			this.listStatus = 'loading'
			this.getSchoolList();
		},
		//加载后一页数据
		getSchoolData() {
			this.pageForm.pageNo++
			this.getSchoolList()
		},
		getSchoolList() {
			// if(this.showLoading){
			// 	return
			// }
			// this.showLoading = true
			let params = uni.$u.queryParams(
				{
					city: this.formData.city.indexOf('市') > -1 ? this.formData.city : this.formData.city + '市',
					schoolNature: this.formData.nature,
					county: this.formData.districtAndCounty,
					name: this.formData.name,
					pageNo: this.pageForm.pageNo,
					pageSize: this.pageForm.pageSize
				},
				true,
				'repeat'
			);
			getSchoolList(params).then(res => {
				if (+res.code === 0) {
					if(this.pageForm.pageNo === 1) {
						// console.log(JSON.stringify(res.data.list) )
						this.list = res.data.list
					} else {
						this.list = this.list.concat(res.data.list);
					}
					if(res.data.list.length === 0) {
						if(res.data.page.pageNo === 1) {
							this.pageForm.pageNo = 1
						} else {
							this.pageForm.pageNo--
						}
						this.listStatus = 'nomore'
					}
					if(res.data.list.length < this.pageForm.pageSize) {
						this.listStatus = 'nomore'
					}
					this.triggered = false
				}
			}).finally(() => {
				this.showLoading = false
			})
		},
		selectTab(type) {
			this.activeType = type;
			if (this.activeType === 1) {
				this.selectCityShow = true;
			}
			if (this.activeType === 2) {
				this.selectQuXianShow = true;
			}
			if (this.activeType === 3) {
				this.natureShow = true;
			}
		},
		selectCityClose() {
			this.selectCityShow = false;
		},
		selectCityOpen() {},
		//选择城市
		citySelect(e) {
			this.selectCityShow = false;
			this.formData.province = e.province;
			this.formData.selectDistrictAndCounty = [];
			this.formData.city = e.name;
			uni.setNavigationBarTitle({
				title: e.name + '学校介绍'
			});
			this.queryDistrictAndCounty();
			this.searchData();
		},
		//选择区县
		selectQuXian(text) {
			this.selectDistrictAndCounty.indexOf(text) > -1
				? (this.selectDistrictAndCounty = this.selectDistrictAndCounty.filter(item => item != text))
				: this.selectDistrictAndCounty.push(text);
		},
		//确定区县选择
		subSelectQuXian() {
			this.formData.districtAndCounty = this.selectDistrictAndCounty;
			this.selectQuXianShow = false;
			this.searchData();
		},
		//选择学校性质
		selectNature(type) {
			this.nature = this.nature === type ? '' : type;
		},
		//确定学校性质选择
		subSelectNature() {
			this.formData.nature = '';
			if (this.nature) {
				this.formData.nature = this.nature === '公办' ? 1 : 2;
			}
			this.natureShow = false;
			this.searchData();
		},
		//查询区县
		queryDistrictAndCounty() {
			const that = this;
			uni.request({
				url: 'https://restapi.amap.com/v3/config/district',
				method: 'GET',
				data: {
					key: '9564d379001e7f7589b3376cc2dd90a8',
					keywords: that.formData.city,
					subdistrict: 3,
					extensions: 'base'
				},
				success(res) {
					that.formData.districtAndCounty = [];
					that.selectDistrictAndCounty = [];
					that.districtAndCountyList = res.data.districts[0].districts;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.schoolList {
	-webkit-overflow-scrolling: touch;
	height: 100vh;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	.searchBox {
		padding: 0 15px;
		padding-top: 10px;
		padding-bottom: 4px;
		.scarchInput {
			background: #f6f7f9;
			height: 36px;
		}
	}
	.screenBox {
		display: flex;
		position: relative;
		border-bottom: 1px solid #f6f7f9;
		align-items: center;
		.screenItem {
			padding: 14px 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex: 1;
			font-size: 14px;
			color: #3f3f3f;
			max-width: 33.3vw;
			text {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				margin-right: 6px;
			}

			.uicon-arrow-up-fill {
				transition: 0.3s;
				color: #3f3f3f !important;
			}
			&.active {
				color: #f6a13e;
				.uicon-arrow-up-fill {
					transform: rotate(180deg);
					transition: 0.3s;
					color: #f6a13e !important;
				}
			}
		}
		.selectCommonBox {
			z-index: 2;
			position: absolute;
			top: 0;
			width: 100vw;
			height: 100vh;
			.mask {
				position: absolute;
				width: 100%;
				height: 100%;
				background: rgba(0, 0, 0, 0.5);
			}
			.quxianContent {
				width: 100%;
				background: #ffffff;
				position: absolute;
				top: 0;
				display: flex;
				justify-content: center;
			}
			.quxianBox {
				box-sizing: border-box;
				background: #ffffff;
				padding: 16px 26px 12px 26px;
				display: flex;
				flex-direction: column;
				.quxian {
					width: auto;
					display: grid;
					grid-template-rows: repeat(auto-fill, 22px);
					grid-template-columns: repeat(4, 66px);
					grid-row-gap: 12px;
					grid-column-gap: 20px;
					view {
						display: flex;
						justify-content: center;
						align-items: center;
						background: #f6f7f9;
						color: #333333;
						border-radius: 2px;
						text {
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
						}
						&.active {
							background: #f6a13e;
							color: #ffffff;
						}
					}
				}
				button {
					margin-top: 36px;
					width: 90vw;
					height: 44px;
					background: #f6a13e;
					border: none;
					border-radius: 22px;
					font-weight: 500;
					color: #ffffff;
					font-size: 16px;
				}
			}
		}
	}
	.schoolListBox {
		flex: 1;
		height: 80vh;
		padding: 0 15px;
		box-sizing: border-box;
		.schoolItem {
			height: 80px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			&:first-child {
				margin-top: 16px;
			}
			.schoolImg {
				width: 105px;
				height: 80px;
				border-radius: 8px;
				overflow: hidden;
				margin-right: 10px;
				image {
					width: 100%;
					height: 100%;
				}
			}
			.schoolInfo {
				height: 100%;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				.schoolName {
					font-size: 16px;
					font-weight: 500;
					color: #333333;
				}
				.schoolTag {
					.tag {
						display: inline-block;
						padding: 2px 8px;
						background: #f1f6f9;
						color: #a6a6a6;
						border-radius: 4px;
						font-size: 11px;
						margin-right: 8px;
					}
				}
				.schoolMore {
					width: 100%;
					display: flex;
					justify-content: space-between;
					align-items: center;
					.schoolAddress {
						font-size: 12px;
						color: #b4b4b4;
						display: flex;
						align-items: center;
						image {
							width: 10px;
							height: 10px;
							margin-right: 6px;
						}
					}
					.schoolMsgLength {
						font-size: 12px;
						color: #c4c4c4;
						display: flex;
						align-items: center;
						image {
							width: 20px;
							height: 20px;
							margin-right: 4px;
						}
					}
				}
			}
		}
	}
}
</style>

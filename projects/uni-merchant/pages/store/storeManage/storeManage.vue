<template>
	<view>
		<u-back-top :scroll-top="scrollTop" :top="1000"></u-back-top>
		<navBar :switchUrl="'../store'" :isUpdate="isUpdate">店铺信息</navBar>
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modalContent"
		 @confirm="resModalHandle"></u-modal>
		<view class="wrap">
			<view class="store-top-info has-navBar">
				<template v-if="$store.state.auth > 0 ">
					<view class="btn-wrap">
						<view class="show-btn" v-if="isReadonly">
							<button v-if="recoType !== -1" :style="{'background-color' : recoType === 2 ? '#335683' : recoType === 3 ? '#ccc' : '#67A8FC'}"
							 class="btn edit-btn" @click="storeRecommend">
								{{recoType | recoType}}
							</button>

							<button v-if="putawayStatus !== -1" :style="{'background-color' : putawayStatus === 3 ? '#335683' : '#67A8FC'}"
							 class="btn edit-btn" @click="putawayStore">
								{{putawayStatus | putawayStatus}}
							</button>
							
							<button v-if="putawayStatus !== -1" class="btn edit-btn" :style="{'background-color' : putawayStatus !== 2 ? '#ccc' : '#67A8FC'}"
							 @click="handleEdit">编辑</button>
						</view>
						<view class="edit-wrap" v-if="!isReadonly">
							<button type="default" class="btn cancel-btn" @click="handleCancel">
								取消
							</button>
							<button type="default" class="btn sure-btn" @click="handleSure">
								确定
							</button>
						</view>
					</view>
				</template>
				<view class="logo-info" :style="{ 'margin-top': isReadonly == false ? '164rpx' : '' }">
					<view class="logo-title">
						<text class="title">店铺logo（154X154）</text>
					</view>
					<view class="logo-upload-top">
						<view class="img-show" v-if="storeLogo">
							<image :src="showImgPrefix + storeLogo" @click="showImage(storeLogo)" mode=""></image>
							<view class="delete-btn" v-if="!isReadonly && storeLogo" @click="deleteStoreLogo(1)"></view>
						</view>
						<view class="file-upload" v-if="!storeLogo" @click="chooseImage(1,'462upx','462upx')"></view>
					</view>
					<!-- <view class="logo-title">
						<text class="title">店铺logo-列表大图（351X154）</text>
					</view>
					<view class="logo-upload-botm">
						<view class="img-show" v-if="storeLongImg">
							<image :src="showImgPrefix + storeLongImg" @click="showImage(storeLongImg)" mode=""></image>
							<view class="delete-btn" v-if="!isReadonly && storeLongImg" @click="deleteStoreLogo(2)"></view>
						</view>
						<view class="file-upload" v-if="!storeLongImg" @click="chooseImage(2,'702upx','308upx')"></view>
					</view> -->
				</view>
			</view>

			<view class="store-basic-info-top">
				<view class="store-name">
					<view class="title">
						<text>店铺名称：</text>
					</view>
					<view class="name">
						<text v-if="isReadonly">{{
              storeName == "" ? "待编辑" : storeName
            }}</text>
						<u-input maxlength="20" v-if="!isReadonly" v-model="storeName" type="text" :custom-style="{
                padding: '0',
                'border-bottom': '1px solid rgb(238, 238, 238)',
              }" />
					</view>
				</view>
				<view class="store-brief">
					<view v-if="isReadonly">
						<text class="title">店铺简介：</text>
						<text>{{ storeBrief == "" ? "待编辑" : storeBrief }}</text>
					</view>
					<view v-if="!isReadonly">
						<view class="title"> 店铺简介： </view>
						<view class="brief">
							<view>
								<u-input :custom-style="{
                    padding: '0',
                    'border-bottom': '1px solid rgb(238, 238, 238)',
                    'min-height': '26px',
                  }"
								 v-model="storeBrief" type="textarea" :auto-height="true" maxlength="120" />
							</view>
						</view>
					</view>
				</view>
				<view class="store-type">
					<view class="title">
						<text>店铺类型：</text>
					</view>
					<view class="type-box">
						<view v-if="!isUpdate" class="item" v-for="(item, index) in storeTypeList" :key="index">
							<button :style="{
                  'background-color':
                    storeLocaIndex == item.value ? '#4c9a49' : '#fff',
                  color: storeLocaIndex == item.value ? '#fff' : '#000',
                  border:
                    storeLocaIndex == item.value
                      ? 'none'
                      : '2rpx solid rgba(204, 204, 204, 1)',
                }"
							 @click="changeShopLoca(item.value)">
								{{ item.label }}
							</button>
						</view>
						<view v-if="isUpdate" class="item">
							<button :style="{
                  'background-color': '#4c9a49',
                  color: '#fff',
                  border: 'none',
                }">
								{{ storeLocaIndex | shopType }}
							</button>
						</view>
					</view>
				</view>
				<view class="store-buss-hours">
					<view class="title">
						<text>店铺营业时间：</text>
					</view>
					<view class="hours-range">
						<view>
							<view class="hours-box" v-if="isReadonly">
								<text>{{ startBussTime }}</text>
							</view>
							<view class="hours-box" v-if="!isReadonly" @click="startBussTimeShow = true">
								<text>{{ startBussTime }}</text>
								<u-picker mode="time" v-model="startBussTimeShow" :params="bussTimeParams" @confirm="returnStartBussTime"></u-picker>
							</view>
						</view>
						<view class="line"></view>
						<view>
							<view class="hours-box" v-if="isReadonly">
								<text>{{ endBussTime }}</text>
							</view>
							<view class="hours-box" v-if="!isReadonly" @click="endBussTimeShow = true">
								<text>{{ endBussTime }}</text>
								<u-picker mode="time" v-model="endBussTimeShow" :params="bussTimeParams" @confirm="returnEndBussTime"></u-picker>
							</view>
						</view>
					</view>
				</view>
				<view class="person-con">
					<view class="title">
						<text>人均消费：</text>
					</view>
					<view class="con-box">
						<view class="price">
							<text v-if="isReadonly">{{ perCon }}</text>
							<input @blur="checkPrice(perCon)" v-if="!isReadonly" type="text" v-model="perCon" />
						</view>
					</view>
				</view>
				<view class="latest-min" v-if="storeLocaIndex != 3">
					<view class="title">
						<text>晚于最晚到店时间后订单的保留分钟数：</text>
					</view>
					<view class="con-box" @click="!isReadonly ? latestRetainTimeShow = true :''">
						<text>{{ latestRetainTime }}</text>
						<u-select v-model="latestRetainTimeShow" mode="single-column" :list="latestRetainTimeList" @confirm="resLatestRetainTime"></u-select>
					</view>
				</view>
			</view>
			
			<template v-if="isLoadingAll">
				<storeMap @getAddress="getAddress" :newAddress="newAddress" :isReadonly="isReadonly"></storeMap>
			</template>

			<view class="store-basic-info-botm">
				<view class="service-phone-box">
					<view class="title">
						<text>客服电话（输入完后点击加号视为添加成功）：</text>
					</view>
					<view class="phone-list-box">
						<view class="phone-list" v-for="(item, index) in servicePhoneList" :key="index">
							<view class="phone">
								<input @blur="checkService(servicePhoneList[index],index)" type="number" v-model="servicePhoneList[index]" :disabled="isReadonly" />
							</view>
							<view class="handle" v-if="!isReadonly" @click="reduceService(item)">
								<image src="../../../static/icon/reduce.png" mode=""></image>
							</view>
						</view>
						<view class="add-phone" v-if="!isReadonly && servicePhoneList.length < 3">
							<view class="phone">
								<input type="number" v-model="servicePhone" />
							</view>
							<view class="handle" @click="addService">
								<image src="../../../static/icon/add.png" mode=""></image>
							</view>
						</view>
					</view>
				</view>
				<view class="store-label">
					<view class="title">
						<text>店铺标签：</text>
					</view>
					<view class="label-list">
						<view v-if="isReadonly" class="label" v-for="(item, index) in shopTypeOptStrArr" :key="index">
							<text class="shop-label-btn">{{ item.recommendBrand }}</text>
						</view>
						<view v-if="!isReadonly" class="label" v-for="(item, index) in shopTypeOpt" :key="index">
							<text :class="{'shop-label-btn' : shopTypeOptStrArr.includes(item)}" @click="changeStoreLabel(item)">{{ item.recommendBrand }}</text>
						</view>
					</view>
				</view>
				<view class="mall-brief store-brief">
					<view v-if="isReadonly">
						<text class="title">商城简介：</text>
						<text>{{ mallBrief }}</text>
					</view>
					<view v-if="!isReadonly">
						<view class="title"> 商城简介： </view>
						<view class="brief">
							<view>
								<u-input :custom-style="{
                    padding: '0',
                    'border-bottom': '1px solid rgb(238, 238, 238)',
                    'min-height': '26px',
                  }"
								 v-model="mallBrief" type="textarea" :auto-height="true" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="store-image-wrap">
				<view class="store-banner">
					<view class="title">
						<text>店铺顶部展示图(375x181)</text>
					</view>
					<view class="img-show" v-for="(item, index) in bannerShowBox" :key="index" v-if="item && item.search(/.mp4/i) == -1">
						<image :src="showImgPrefix + item" @click="showImage(item)" mode=""></image>
						<view class="delete-btn" v-if="!isReadonly && item" @click="deleteStoreLogo(3, item)"></view>
					</view>
					<view class="file-upload" v-show="!isReadonly && bannerShowBox.length < 6" @click="chooseImage(3,'750upx','362upx')"></view>
				</view>
				<view class="store-bgimg">
					<view class="title">
						<text>排号背景图(351x181)</text>
					</view>
					<view class="img-show" v-if="rowNumImageUrl">
						<image :src="showImgPrefix + rowNumImageUrl" @click="showImage(rowNumImageUrl)" mode=""></image>
						<view class="delete-btn" v-if="!isReadonly && rowNumImageUrl" @click="deleteStoreLogo(4)"></view>
					</view>
					<view class="file-upload" v-if="!rowNumImageUrl" @click="chooseImage(4,'702upx','362upx')"></view>
				</view>
				<view class="store-seatImg" v-if="storeLocaIndex != 3">
					<view class="title">
						<text>座位布局图</text>
					</view>
					<view class="img-show" v-if="overallImageUrl">
						<image :src="showImgPrefix + overallImageUrl" @click="showImage(overallImageUrl)" mode="widthFix"></image>
						<view class="delete-btn" v-if="!isReadonly && overallImageUrl" @click="deleteStoreLogo(5)"></view>
					</view>
					<view class="file-upload" v-if="!overallImageUrl" @click="chooseImage(5)"></view>
				</view>
			</view>

			<view class="setting-seat" v-if="isReadonly">
				<button type="default" @click="goSeatMessage">{{storeLocaIndex === 3 ? '布置包间信息' : '布置座位'}}</button>
			</view>
		</view>
		
		<yq-avatar @upload="chooseImageComplete" ref="avatar" ></yq-avatar>
	</view>
</template>

<script>
	import {chooseImage} from '../../../common/js/upload.js'
	
	export default {
		data() {
			return {
				uploadType : -1, //当前上传的哪个区域的图片
				
				isUpdate: true, //判断当前操作为修改还是新增店铺

				showImgPrefix: this.$imgHead,

				modalShow: false, //模态框开关
				modalContent: "", //模态框展示的内容
				isReadonly: true,
				latestRetainTimeShow: false, //最晚保留分钟数选择器开关
				latestRetainTimeList: [{
						value: '10',
						label: '10分钟'
					},
					{
						value: '20',
						label: '20分钟'
					},
					{
						value: '30',
						label: '30分钟'
					},
					{
						value: '40',
						label: '40分钟'
					},
					{
						value: '50',
						label: '50分钟'
					},
					{
						value: '60',
						label: '60分钟'
					},
					{
						value: '70',
						label: '70分钟'
					},
					{
						value: '80',
						label: '80分钟'
					},
					{
						value: '90',
						label: '90分钟'
					},
					{
						value: '100',
						label: '100分钟'
					},
					{
						value: '110',
						label: '110分钟'
					},
					{
						value: '120',
						label: '120分钟'
					},
				],

				shopId: "", //门店ID
				storeLogo: "", //logo
				// storeLongImg: "", //logo（大图）
				storeName: "", //店铺名称
				storeBrief: "", //店铺简介
				//店铺类型
				storeTypeList: [{
						value: 1,
						label: "夜店",
					},
					{
						value: 2,
						label: "清吧",
					},
					{
						value: 3,
						label: "KTV",
					},
				],
				storeLocaIndex: 0, //店铺类型下标
				startBussTime: "", //开始营业时间
				endBussTime: "", //结束营业时间
				perCon: "", //人均消费
				latestRetainTime: '', //晚于最晚保留时间的订单保留分钟数
				servicePhoneList: [], //客服电话
				servicePhone: "", //当前要添加的客服电话

				shopTypeOpt: [], //所有店铺标签
				shopTypeArr: "", //后端返回的当前店铺标签的id数组
				shopTypeOptStrArr: [], //回显当前店铺标签
				submitShopType: [], //提交时所选的店铺标签id

				mallBrief: "", //商城简介

				bannerShowBox: [], //要上传的banner图集和回显的banner图集

				rowNumImageUrl: "", //排号背景图
				overallImageUrl: "", //座位布局图

				//要传给地图子组件的值
				newAddress: {
					province: "", //省
					city: "", //市
					district: "", //区县
					districtCode: "", //区县编码
					searchAddress: "", //地址搜索框里的值
					trustAddress: "", //输入的详细地址
					lonlat: "" //经纬度
				},
				// newAddress: {},

				province: "", //省
				city: "", //市
				district: "", //区县
				districtCode: "", //区县编码
				searchAddress: "", //地址搜索框里的值
				trustAddress: "", //输入的详细地址
				lonlat: "", //经纬度

				//营业时间选择器
				bussTimeParams: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false,
				},
				startBussTimeShow: false, //开始营业时间选择器开关
				endBussTimeShow: false, //结束营业时间选择器开关

				recoType: -1, //申请推荐位状态
				putawayStatus: -1, //店铺的申请上下架状态

				allRegRight: false, //全部验证通过的开关
				
				isLoadingAll : false,	//是否获取到所有的店铺信息
				
				scrollTop : 0,

			};
		},
		
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},

		onLoad() {
			this.getStoreInfo();
		},
		
		//下拉刷新
		onPullDownRefresh() {
			setTimeout(() => {
				this.getStoreInfo();
			},1000)
		},

		methods: {
			//人均消费验证
			checkPrice(price) {
				if (!this.isReadonly && price !== '') {
					if(this.$checkMinPrice(price) === false) {
						this.perCon = 0.1;
					}
				}
			},
			
			//保存之前的字段验证
			checkFormInfo() {
				if (!this.storeLogo) {
					this.$errToast('请上传店铺logo')
					return;
				} 
				// else if (!this.storeLongImg) {
				// 	this.$errToast('请上传店铺logo（大图部分）')
				// 	return;
				// } 
				else if (!this.storeName) {
					this.$errToast('请输入店铺名称')
					return;
				} else if (!this.storeBrief) {
					this.$errToast('请输入店铺简介')
					return;
				} else if (!this.storeLocaIndex) {
					this.$errToast('请选择店铺类型')
					return;
				} else if (!this.startBussTime) {
					this.$errToast('请选择店铺开始营业时间')
					return;
				} else if (!this.endBussTime) {
					this.$errToast('请选择店铺结束营业时间')
					return;
				} else if (!this.perCon) {
					this.$errToast('请输入人均消费')
					return;
				} else if (!this.latestRetainTime && this.storeLocaIndex != 3) {
					this.$errToast('请选择晚于最晚保留时间的订单保留分钟数')
					return;
				} else if (!this.districtCode || !this.searchAddress || !this.trustAddress) {
					this.$errToast('请选择并输入店铺地址')
					return;
				} else if (this.servicePhoneList.length === 0) {
					this.$errToast('请输入客服电话')
					return;
				} else if (this.submitShopType.length === 0) {
					this.$errToast('请选择店铺标签')
					return;
				} else if (!this.mallBrief) {
					this.$errToast('请输入商城简介')
					return;
				} else if (this.bannerShowBox.length === 0) {
					this.$errToast('请上传店铺顶部展示图')
					return;
				} else if (!this.rowNumImageUrl) {
					this.$errToast('请上传排号背景图')
					return;
				} else if (!this.overallImageUrl && this.storeLocaIndex != 3) {
					this.$errToast('请上传座位背景图')
					return;
				} else {
					this.allRegRight = true;
				}
			},

			//选择到店最晚保留分钟数
			resLatestRetainTime(res) {
				this.latestRetainTime = res[0].value;
			},

			//获取商家上架下架状态
			getPutawayStatus() {
				this.$get('/merchant/store/settled/applyOnlineType').then((res) => {
					if (res.code === 0) {
						this.putawayStatus = res.data.type;
					}
				});
			},

			//申请商家推荐
			storeRecommend() {
				if (this.recoType === 1) {
					this.modalContent = "是否向平台申请商家推荐位资格？";
					this.modalShow = true;
				}
			},

			//申请商家上下架
			putawayStore() {
				if (this.putawayStatus !== 3) {
					if (this.putawayStatus === 1) {
						this.modalContent = '是否向平台申请下线店铺，为保证呈现给用户的数据准确性，下线成功后需重新提交上线店铺审核，通过后则能在App展示';
					}

					if (this.putawayStatus === 2) {
						this.modalContent = '是否向平台申请上线店铺，为保证呈现给用户的数据准确性，上线成功后需再次申请下线店铺才能进行资料变更';
					}

					this.modalShow = true;
				}
			},

			//获取申请商家推荐状态
			storeRecommendType() {
				this.$get('/merchant/store/recommend/storeRecommendType').then((res) => {
					if (res.code === 0) {
						this.recoType = res.data.type;
					}
				});
			},

			//模态框的确定按钮
			resModalHandle() {
				if (this.modalContent === "是否保存？") {
					this.submitShopInfo();
					return
				}

				if (this.modalContent === "是否取消编辑？") {
					this.isReadonly = true;
					this.getStoreInfo();
					return
				}

				if (this.isUpdate === false) {
					uni.switchTab({
						url: "../store",
					});
					return
				}

				//申请商家推荐位
				if(this.modalContent === '是否向平台申请商家推荐位资格？') {
					if (this.recoType === 1) {
						this.$get('/merchant/store/recommend/storeRecommend').then((res) => {
							if (res.code === 0) {
								this.$successToast('申请成功');
								this.storeRecommendType();
							}
						});
						return
					}
				}

				//店铺上下架申请
				if(this.modalContent === '是否向平台申请下线店铺，为保证呈现给用户的数据准确性，下线成功后需重新提交上线店铺审核，通过后则能在App展示' || this.modalContent === '是否向平台申请上线店铺，为保证呈现给用户的数据准确性，上线成功后需再次申请下线店铺才能进行资料变更') {
					if (this.putawayStatus !== 3) {
						this.$get('/merchant/store/settled/applyOnline').then((res) => {
							if (res.code === 0) {
								this.$successToast('申请成功');
								this.getPutawayStatus();
							}
						});
						return
					}
				}
			},

			//接收地图子组件回传的值
			getAddress(data) {
				if (data) {
					this.province = data.province;
					this.city = data.city;
					this.district = data.district;
					this.districtCode = data.districtCode;
					this.searchAddress = data.searchAddress;
					this.trustAddress = data.trustAddress;
					this.lonlat = data.lonlat.join(',');
				}
			},
			
			//选择图片成功后的回调
			chooseImageComplete(res) {
				this.uploadImage(this.uploadType, res.path);
			},

			//选择图片并上传（type:判断是上传的什么图片）
			chooseImage(type,selWidth,selHeight) {
				if (!this.isReadonly) {
					this.uploadType = type;
					if(type === 5) {
						chooseImage(type).then(res => {
							this.uploadImage(res.type, res.path);
						})
					} else {
						this.$refs.avatar.fChooseImg(undefined,{
							selWidth,
							selHeight,
							stretch : 'longSel',
							inner : true
						});
					}
				}
			},

			//上传图片
			uploadImage(type, data) {
				this.$showLoading('上传中');
				this.$file_post(this.$fileUpload, data)
					.then((res) => {
						if (res.code === 0) {
							if (type === 1) this.storeLogo = res.data;
							// if (type === 2) this.storeLongImg = res.data;
							if (type === 4) this.rowNumImageUrl = res.data;
							if (type === 5) this.overallImageUrl = res.data;
							if (type === 3) this.bannerShowBox.push(res.data);
						}
						uni.hideLoading();
					})
					.catch((err) => {
						uni.hideLoading();
						this.$errToast('上传失败');
					});
			},

			// 预览图片
			showImage(image) {
				// 单张预览
				let imgArr = [];
				imgArr.push(this.showImgPrefix + image);

				uni.previewImage({
					urls: imgArr,
					current: image,
				});
			},

			//移除当前图片
			deleteStoreLogo(type, url) {
				if (type === 1) this.storeLogo = "";
				// if (type === 2) this.storeLongImg = "";
				if (type === 4) this.rowNumImageUrl = "";
				if (type === 5) this.overallImageUrl = "";
				if (type === 3) {
					let index = this.bannerShowBox.indexOf(url);
					this.bannerShowBox.splice(index, 1); //删除banner
				}
			},

			//获取店铺信息
			getStoreInfo() {
				this.$showLoading();
				this.$get("/merchant/store/getStoreInfo").then((result) => {
					if (result.code === 0) {
						let res = result.data;
						this.shopId = res.id;
						this.storeLogo = res.logo;
						this.storeName = res.name;
						this.storeBrief = res.synopsis;
						this.storeLocaIndex = res.storeLocation;
						this.startBussTime = res.startTime;
						this.endBussTime = res.endTime;
						this.latestRetainTime = res.latestRetainTime;
						this.perCon = res.perCapitaConsumption;
						this.servicePhoneList = res.customerServicePhoneList;
						this.shopTypeArr = res.type.split(","); //当前店铺标签的id数组
						this.mallBrief = res.goodsStoreSynopsis;
						// this.storeLongImg = res.appListBigPicture;
						this.bannerShowBox = res.picture.split(",");
						this.rowNumImageUrl = res.rowNumberBanner;
						this.overallImageUrl = res.layoutPicture;
						this.newAddress.province = res.province;
						this.newAddress.city = res.city;
						this.newAddress.district = res.district;
						this.newAddress.districtCode = res.districtCode;
						this.newAddress.searchAddress = res.searchAddress;
						this.newAddress.trustAddress = res.trustAddress;
						this.newAddress.lonlat = res.lonlat;
						this.isLoadingAll = true;

						//获取商家推荐位的状态
						this.storeRecommendType();

						//获取商家上下架状态
						this.getPutawayStatus();

						//获取所有店铺标签
						this.getShopType(res.storeLocation);
					} else if(result.code === 600) {
						this.isReadonly = false;
						this.isUpdate = false;
						this.isLoadingAll = true;
						this.$errToast("您还未配置门店信息，请配置门店信息")
					} else {
						this.$errToast(result.msg);
					}

					uni.stopPullDownRefresh();
					uni.hideLoading();
				})
			},

			//新增/修改店铺
			submitShopRequest() {
				this.$showLoading();
				//要传的值
				let data = {
					source: 0,
					cassette: '6x6',
					// appListBigPicture: this.storeLongImg,
					customerServicePhoneList: this.servicePhoneList,
					endTime: this.endBussTime,
					goodsStoreSynopsis: this.mallBrief,
					layoutPicture: this.overallImageUrl,
					logo: this.storeLogo,
					name: this.storeName,
					perCapitaConsumption: this.perCon,
					picture: this.bannerShowBox.join(","),
					rowNumberBanner: this.rowNumImageUrl,
					startTime: this.startBussTime,
					latestRetainTime: this.storeLocaIndex == 3 ? '20' : this.latestRetainTime,
					storeLocation: this.storeLocaIndex,
					synopsis: this.storeBrief,
					businessReminder: "商家排号提醒",
					tableReservationNotes: "订桌注意事项",
					type: this.submitShopType.join(","),
					province: this.province,
					city: this.city,
					district: this.district,
					districtCode: this.districtCode,
					searchAddress: this.searchAddress,
					trustAddress: this.trustAddress,
					lonlat: this.lonlat,
				};

				if (this.isUpdate) {
					data.id = this.shopId;
					console.log("修改时传的值", data);
					this.$put("/merchant/store/update", data).then((res) => {
						if (res.code === 0) {
							this.requestSuccessInit("修改成功");
						} else {
							this.requestErrInit(res.msg)
						}
					});
				} else {
					console.log("新增时传的值", data);
					this.$post("/merchant/store/save", data).then((res) => {
						if (res.code === 0) {
							this.requestSuccessInit("新增成功",res.attach);
							this.isUpdate = true;
							
							console.log(res.attach)
						} else {
							this.requestErrInit(res.msg)
						}
					});
				}
			},

			//保存按钮
			submitShopInfo() {
				this.checkFormInfo(); //验证所有输入的值
				if (this.allRegRight) {
					this.submitShopRequest(); //新增/修改店铺
				}
			},

			//请求成功后，处理的操作
			requestSuccessInit(txt,rongToken) {
				uni.hideLoading();
				this.getStoreInfo();
				this.$successToast(txt);
				this.submitShopType = [];
				this.isReadonly = true;
				this.allRegRight = false;
				
				//每次修改店铺信息就重新保存缓存里的店铺信息
				const userInfo = JSON.parse(uni.getStorageSync('uni-userInfo'));
				userInfo.logo = this.storeLogo;
				userInfo.storeName = this.storeName;
				if(rongToken) {
					userInfo.rongToken = rongToken;
				}
				uni.setStorageSync('uni-userInfo', JSON.stringify(userInfo));
			},
			
			//请求失败后，处理的操作
			requestErrInit(txt) {
				uni.hideLoading();
				this.$errToast(txt);
				this.allRegRight = false;
			},

			//获取当前店铺类型下的所有店铺标签
			getShopType(index) {
				let data = {
					filterModule: index,
				};

				this.$post("/merchant/store/screening/apiList", data).then((res) => {
					if (res.code === 0) {
						this.shopTypeOpt = res.data.storeScreeningDTOS;

						//用后端返回的店铺标签id去匹配中文名
						this.showShopType(this.shopTypeArr);
					}
				});
			},

			//回显当前店铺标签
			showShopType(arr) {
				this.shopTypeOptStrArr = [];
				this.shopTypeOpt.forEach((item) => {
					arr.includes(item.id) && this.shopTypeOptStrArr.push(item);
				});
			},

			//回显当前店铺选中的标签（编辑时）
			showCheckType() {
				this.shopTypeOptStrArr.forEach((item) => {
					this.shopTypeOpt.forEach((obj) => {
						if (item.id == obj.id) {
							this.submitShopType.push(obj.id); //将原有的类型id存入上传数组中
						}
					});
				});
			},

			//切换店铺标签
			changeStoreLabel(item) {
				if (!this.isReadonly) {
					if(this.storeLocaIndex != 3) {
						//查询当前点击的标签在数组中是否存在
						const resIndex = this.submitShopType.indexOf(item.id);
						
						//查询当前点击的标签在已选中的标签中是否存在
						const resTypeIndex = this.shopTypeOptStrArr.indexOf(item);
						
						
						//不存在id就添加，否则就移除
						if (resIndex === -1) {
							this.submitShopType.push(item.id);
						} else {
							this.submitShopType.splice(resIndex, 1);
						}
						
						//不存在该对象就添加，否则就移除
						if (resTypeIndex === -1) {
							this.shopTypeOptStrArr.push(item);
						} else {
							this.shopTypeOptStrArr.splice(resIndex, 1);
						}
					} else {
						//如果是KTV，就只保留当前点击的店铺标签
						this.shopTypeOptStrArr = [];
						this.submitShopType = [];
						this.shopTypeOptStrArr.push(item);
						this.submitShopType.push(item.id)
					}
				}
				console.log(this.submitShopType);
			},

			//切换店铺类型
			changeShopLoca(value) {
				if (!this.isReadonly) {
					this.storeLocaIndex = value;

					//获取当前店铺类型下的店铺标签
					this.getShopType(this.storeLocaIndex);

					//清空店铺标签提交id数组
					this.submitShopType = [];
				}
			},

			//编辑店铺信息
			handleEdit() {
				if (this.putawayStatus === 2) {
					this.isReadonly = false;
					this.showCheckType();
				}
			},

			//取消编辑店铺信息
			handleCancel() {
				this.modalContent = "是否取消编辑？";
				if(!this.isUpdate) {
					this.$errToast('请先配置门店相关信息');
					return;
				}
				this.modalShow = true;
			},

			//确定编辑店铺信息
			handleSure() {
				this.modalContent = "是否保存？";
				this.modalShow = true;
			},
			
			//已经输入的电话失去焦点后
			checkService(number,index) {
				if (this.$phone(number) === false) {
					this.$errToast('请输入正确的电话号码')
				} 
			},

			//添加客服电话
			addService() {
				if (this.$phone(this.servicePhone) === false) {
					this.$errToast('请输入正确的电话号码')
				} else {
					this.servicePhoneList.push(this.servicePhone);
				}
				this.servicePhone = "";
			},

			//删除客服电话
			reduceService(item) {
				this.servicePhoneList.forEach((ele, i) => {
					if (ele == item) {
						this.servicePhoneList.splice(i, 1);
					}
				});
			},

			//返回开始营业时间
			returnStartBussTime(res) {
				this.startBussTime = res.hour + ":" + res.minute;
			},

			//返回结束营业时间
			returnEndBussTime(res) {
				this.endBussTime = res.hour + ":" + res.minute;
			},

			//布置座位
			goSeatMessage() {
				//验证所有输入的值
				// this.checkFormInfo();
				// if (this.allRegRight) {
					// this.submitShopRequest(); //新增/修改店铺
					
					let url = '';
					if(this.storeLocaIndex == 3) {
						url = "../seatMessage/ktvRoomMessage/ktvRoomMessage";
					} else {
						url = "../seatMessage/seatMessage";
					}
					
					uni.navigateTo({
						url
					});
					
					// setTimeout(() => {
					// 	uni.navigateTo({
					// 		url
					// 	});
					// }, 1000)
				// }
			},
		},
	};
</script>

<style lang="scss" scoped>
	uni-button:after {
		border: none;
	}

	.title {
		font-size: 28rpx;
		font-weight: 600;
	}

	/deep/uni-input {
		border-radius: 0;
		font-size: 28rpx;
	}

	.img-show {
		font-size: 0;
		position: relative;

		.delete-btn {
			background: url(../../../static/icon/delete.png);
			width: 50rpx;
			height: 50rpx;
			background-size: 100%;
			position: absolute;
			right: 10rpx;
			top: 10rpx;
		}

		image {
			width: 100%;
			height: 100%;
			border-radius: 10rpx;
		}
	}

	.store-top-info {
		.btn-wrap {
			.btn {
				font-size: 32rpx;
				font-weight: 600;
				border-radius: 16rpx;
				height: 86rpx;
			}

			.show-btn {
				padding: 0 24rpx;
				display: flex;
				align-items: center;
				margin: 24rpx 0;

				.edit-btn {
					padding: 0;
					width: 33.33333%;
					margin-right: 20rpx;
					color: #fff;
					background-color: rgb(103, 168, 252);

					&:last-child {
						margin: 0;
					}
				}
			}

			.edit-wrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 100%;
				height: 150rpx;
				padding: 30rpx 40rpx;
				background-color: #fff;
				box-shadow: 0 2rpx 8rpx 0 rgba(0, 0, 0, 0.1);
				position: fixed;
				z-index: 99;

				uni-button {
					margin: 0;
					padding: 0;
				}

				>button {
					width: 300rpx;
					height: 86rpx;
				}

				.cancel-btn {
					color: rgba(204, 204, 204, 1);
					background-color: #fff;
					border: 2rpx solid rgba(103, 168, 252, 1);
				}

				.sure-btn {
					color: #fff;
					background-color: rgb(103, 168, 252);
				}
			}
		}

		.logo-info {
			padding: 0 24rpx;

			.logo-title {
				margin-left: 16rpx;
			}

			.logo-upload-top {
				margin: 24rpx 0;
				display: flex;

				.title {
					margin-left: 40rpx;
				}

				.img-show {
					width: 308rpx;
					height: 308rpx;
				}

				.file-upload {
					width: 308rpx;
					height: 308rpx;
				}
			}

			.logo-upload-botm {
				margin-top: 24rpx;
				margin-bottom: 48rpx;

				.img-show {
					height: 308rpx;
				}

				.file-upload {
					height: 308rpx;
				}

				.title {
					text-align: center;
					margin-top: 24rpx;
				}
			}
		}
	}

	.store-basic-info-top {
		padding: 0 40rpx;

		.store-name {
			display: flex;
			align-items: center;
			margin-bottom: 48rpx;

			.name {
				flex-grow: 1;
			}
		}

		.store-brief {
			/deep/ uni-textarea {
				height: 0;
			}
		}

		.store-type {
			margin: 48rpx 0;

			.title {
				margin-bottom: 24rpx;
			}

			.type-box {
				display: flex;
				justify-content: space-between;

				.item {
					button {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 184rpx;
						height: 80rpx;
						font-size: 32rpx;
						font-weight: 400;
						color: #fff;
						outline: none;
						border: 2rpx solid rgba(204, 204, 204, 1);
						border-radius: 12rpx;
						background-color: rgba(204, 204, 204, 1);
					}
				}
			}
		}

		.store-buss-hours {
			margin-bottom: 48rpx;

			.title {
				margin-bottom: 24rpx;
			}

			.hours-range {
				display: flex;
				align-items: center;

				.line {
					width: 40rpx;
					height: 2rpx;
					margin: 0 8rpx;
					background-color: rgba(216, 216, 216, 1);
				}

				.hours-box {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 184rpx;
					height: 56rpx;
					border: 2rpx solid rgba(204, 204, 204, 1);
					border-radius: 12rpx;
				}
			}
		}

		.person-con {
			margin-bottom: 48rpx;

			.title {
				margin-bottom: 24rpx;
			}

			.con-box {
				display: flex;
				align-items: center;
				justify-content: space-between;
				width: 200rpx;
				height: 56rpx;
				border: 2rpx solid rgba(204, 204, 204, 1);
				border-radius: 12rpx;

				.price {
					padding: 8rpx 12rpx;
				}
			}

			.con-box::before {
				display: block;
				content: "￥";
				display: flex;
				align-items: center;
				justify-content: center;
				min-width: 44rpx;
				height: 100%;
				color: #fff;
				background-color: rgba(204, 204, 204, 1);
				border-top-left-radius: 10rpx;
				border-bottom-left-radius: 10rpx;
			}

			.con-box::after {
				display: block;
				content: "人";
				display: flex;
				align-items: center;
				justify-content: center;
				min-width: 40rpx;
				height: 100%;
				color: #fff;
				background-color: rgba(204, 204, 204, 1);
				border-top-right-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
			}
		}

		.latest-min {
			margin-bottom: 24px;

			.title {
				margin-bottom: 24rpx;
			}

			.con-box {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 184rpx;
				height: 56rpx;
				border: 2rpx solid rgba(204, 204, 204, 1);
				border-radius: 12rpx;
			}
		}
	}

	.store-basic-info-botm {
		padding: 0 40rpx;
		margin: 48rpx 0;

		.service-phone-box {
			margin-bottom: 48rpx;

			.title {
				margin-bottom: 24rpx;
			}

			.phone-list-box {
				.phone {
					// width: 242rpx;
					height: 56rpx;
					padding: 8rpx 20rpx;
					display: flex;
					align-items: center;
					border: 2rpx solid rgba(204, 204, 204, 1);
					border-radius: 12rpx;
					margin-right: 32rpx;
				}

				.handle {
					cursor: pointer;

					image {
						width: 56rpx;
						height: 56rpx;
					}
				}

				.phone-list {
					display: flex;
					margin-bottom: 24rpx;
				}

				.phone-list:last-child {
					margin-bottom: 0;
				}

				.add-phone {
					display: flex;
					// margin-bottom: 24rpx;
				}
			}
		}

		.store-label {
			margin-bottom: 24rpx;

			.title {
				margin-bottom: 24rpx;
			}

			.label-list {
				display: flex;
				justify-content: space-between;
				flex-wrap: wrap;

				.label {
					text {
						display: flex;
						align-items: center;
						justify-content: center;
						width: 184rpx;
						height: 56rpx;
						margin-right: 0rpx;
						margin-bottom: 24rpx;
						border: 2rpx solid rgba(204, 204, 204, 1);
						border-radius: 12rpx;
						cursor: pointer;
					}

					.shop-label-btn {
						background-color: #4C9A49;
						color: #fff;
						border: none;
					}
				}
			}

			.label-list::after {
				height: 0;
				width: 184rpx;
				min-width: 184rpx;
				content: "";
			}
		}
	}

	.store-image-wrap {
		&::after {
			display: table;
			content: "";
		}
		
		.store-banner {
			margin-bottom: 48rpx;

			.title {
				margin-left: 40rpx;
				margin-bottom: 24rpx;
			}

			.img-show {
				height: 362rpx;
				margin-bottom: 24rpx;

				image {
					border-radius: 0 !important;
				}
			}

			.file-upload {
				height: 362rpx;
				border-radius: 0;
			}
		}

		.store-bgimg {
			padding: 0 24rpx;
			margin-bottom: 48rpx;

			.title {
				margin-left: 16rpx;
				margin-bottom: 24rpx;
			}

			.img-show {
				height: 362rpx;
			}

			.file-upload {
				height: 362rpx;
			}
		}

		.store-seatImg {
			padding: 0 24rpx;
			margin-bottom: 48rpx;

			.title {
				margin-left: 16rpx;
				margin-bottom: 24rpx;
			}

			.file-upload {
				height: 440rpx;
			}
		}
	}

	.setting-seat {
		margin: 0 172rpx 0 172rpx;
		
		&::after {
			display: table;
			content: '';
		}

		>button {
			margin-bottom: 50rpx;
			font-size: 28rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 86rpx;
			border-radius: 16rpx;
			color: #fff;
			background-color: rgba(103, 168, 252, 1);
		}
	}
</style>

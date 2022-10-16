<template>
	<view class="store-address-wrap">
		<template>
			<view class="store-address">
				<view class="title">
					<text>店铺地址：</text>
				</view>
				<view v-if="getLocationFlag === false" class="map-err">*请允许获取您的手机位置权限，否则无法使用定位服务（若不小心拒绝，请前往设置里打开该APP的定位服务；或者在PC商家端进行编辑店铺信息）
				</view>
				<view class="address-box">
					<view class="area">
						<view @click="isReadonly === false ? showAreaSelSheet = true : showAreaSelSheet = false" class="area-select">
							<text>{{showLocalAdd === '' ? '请选择省市区' : showLocalAdd}}</text>
						</view>
						<view class="open-map" @click="openMap">
							<text>{{ address.searchAddress == "" ? '请选择地址' : address.searchAddress}}</text>
						</view>
					</view>
					<view class="detail-add">
						<text v-if="isReadonly">{{address.trustAddress}}</text>
						<input v-if="!isReadonly" type="text" v-model="address.trustAddress" placeholder="请输入详细地址" />
					</view>
				</view>
				<u-picker v-model="showAreaSelSheet" mode="region" :params="params" :safe-area-inset-bottom="true" @confirm="resRegion"
				 :default-region='defaultRegion'></u-picker>
			</view>
			<map style="width: 100%; height: 400rpx;" :latitude="markers[0].latitude" :longitude="markers[0].longitude" :markers="markers"></map>
		</template>
	</view>
</template>

<script>
	export default {
		props: ['newAddress', 'isReadonly'],

		data() {
			return {
				showAreaSelSheet: false, //省市区选择器开关
				
				getLocationFlag : true,	//是否获取到定位的标杆

				//省市区选择器里要显示的内容
				params: {
					province: true,
					city: true,
					area: true
				},

				showLocalAdd: '', //当前选择的省市区展示到页面上
				defaultRegion: [], //如果用户选择了省市区，那么下次点开选择省市区选择器就默认展示用户上次选择的省市区

				//要传给父组件的值
				address: {
					province: '', //选择的省份
					city: '', //选择的市
					district: '', //选择的区县
					districtCode: '', //区县编码
					searchAddress: '', //选择的地址
					trustAddress: '', //详细地址
					lonlat: [], //经纬度
				},

				//地图标记点
				markers: [{
					id: 0,
					latitude: '30.657372248',
					longitude: '104.065901124',
					iconPath: require('../../static/icon/loca.png'),
					width: 28,
				}],
			}
		},

		watch: {
			//如果地址操作发生改变，就往父组件回传
			"address": {
				handler() {
					this.$emit('getAddress', this.address);
				},
				deep: true
			},
		},

		mounted() {
			this.getParentAdd();
		},

		methods: {
			//获取父组件传过来的地址信息
			getParentAdd() {
				if (!this.newAddress.lonlat) {
					//如果是首次选择地址就定位到用户当前的地址
					this.getLocation();
				} else {
					this.address.province = this.newAddress.province;
					this.address.city = this.newAddress.city;
					this.address.district = this.newAddress.district;
					this.address.districtCode = this.newAddress.districtCode;
					this.address.searchAddress = this.newAddress.searchAddress;
					this.address.trustAddress = this.newAddress.trustAddress;
					this.address.lonlat = this.newAddress.lonlat.split(',');
					
					this.showLocalAdd = `${this.newAddress.province}-${this.newAddress.city}-${this.newAddress.district}`; //将省市区展示到页面上
					this.defaultRegion.push(this.newAddress.province, this.newAddress.city, this.newAddress.district) //省市区选择器默认的选择地址
					
					this.markers[0].latitude = this.address.lonlat[1]; //纬度
					this.markers[0].longitude = this.address.lonlat[0]; //经度
				}
			},

			//获取当前定位信息
			getLocation() {
				uni.getLocation({
					type: 'wgs84',
					success: res => {
						this.markers[0].latitude = res.latitude;
						this.markers[0].longitude = res.longitude;
					},
					fail: err => {
						// this.$errToast('获取当前位置失败')
					}
				});
			},

			//选择地址，打开腾讯地图
			openMap() {
				if (!this.isReadonly) {
					uni.chooseLocation({
						success: res => {
							this.address.searchAddress = res.name;
							this.markers[0].latitude = res.latitude;
							this.markers[0].longitude = res.longitude;
							this.address.lonlat = [];
							this.address.lonlat.push(res.longitude, res.latitude);
							
							console.log(res)
						},
						fail: err => {
							this.$errToast('选择位置失败，请允许获取并打开您的手机定位服务');
							this.getLocationFlag = false;
						}
					});
				}
			},

			//选择省市区返回的结果
			resRegion(res) {
				this.defaultRegion = [];
				this.address.province = res.province.label; //省
				this.address.city = res.city.label; //市
				this.address.district = res.area.label; //区
				this.address.districtCode = res.area.value; //区编码
				this.showLocalAdd = `${this.address.province}-${this.address.city}-${this.address.district}`; //将省市区展示到页面上
				this.defaultRegion.push(this.address.province, this.address.city, this.address.district) //省市区选择器默认的选择地址
			},
		}
	}
</script>

<style lang="scss" scoped>
	.store-address-wrap {
		.store-address {
			padding: 0 40rpx;

			.title {
				font-size: 28rpx;
				font-weight: 600;
				margin-bottom: 24rpx;
			}

			.address-box {
				.area {
					margin-bottom: 24rpx;
					display: flex;
					align-items: center;

					>view {
						height: 56rpx;
						border: 2rpx solid rgba(204, 204, 204, 1);
						border-radius: 12rpx;
						padding: 8rpx 28rpx;
						display: flex;
						align-items: center;
						position: relative;
						cursor: pointer;
						font-size: 24rpx;
					}

					.area-select {
						width: 50%;
						margin-right: 12rpx;
					}

					.open-map {
						width: 50%;
					}
				}

				.detail-add {
					display: flex;
					align-items: center;
					height: 56rpx;
					border: 2rpx solid rgba(204, 204, 204, 1);
					border-radius: 12rpx;
					padding: 8rpx 28rpx;
					margin-bottom: 24rpx;
					font-size: 24rpx;

					input {
						width: 100%;
					}
				}
			}
		}

		.map-err {
			font-weight: 600;
			color: #f00;
			margin-bottom: 20rpx;
		}
	}
</style>

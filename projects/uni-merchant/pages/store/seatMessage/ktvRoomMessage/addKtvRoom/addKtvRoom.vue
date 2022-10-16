<template>
	<view>
		<view class="bg" v-if="picFlag">

		</view>
		<navBar :navigateUrl="'../ktvRoomMessage'">包间信息</navBar>
		<view class="has-navBar">
			<view class="basic-info-wrap">
				<view class="inpview">
					<text>楼层</text>
					<input type="text" v-model="floor" class="inputFloor" placeholder-style="color:#ccc" placeholder="请输入楼层" />
				</view>
				<view class="room-type">
					<text>包间类型</text>
					<view class="inputs">
						<text @click="inputFlag">{{roomType | orderProperty(roomTypeList)}}</text>
						<u-select v-model="showChooseRoomType" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true"
						 :list="roomTypeList" @confirm="resultRoomType"></u-select>
					</view>
				</view>
				<view>
					<text>包间描述</text>
					<u-input :custom-style="{
						'padding' : '8rpx 24rpx',
						'border' : '2rpx solid rgba(103, 168, 252, 1)',
						'border-radius': '16rpx',
						'box-sizing' : 'border-box',
						'font-size' : '32rpx',
						}"
					 height="186" v-model="roomDetail" type="textarea" :auto-height="true" placeholder="请添加包间描述(非必填)" />
				</view>
				<!-- 	<view class="room-porp">
					<text>包间属性</text>
					<view class="check-box">
						<view class="check1" @click="roomAttribute = 1">
							<image :src="roomAttribute == 1 ? '../../../../../static/images/xuanzhong.png' : '../../../../../static/images/weixuan.png'"
							 mode=""></image>
							<text>预定桌</text>
						</view>
						<view class="check2" @click="roomAttribute = 2">
							<image :src="roomAttribute == 2 ? '../../../../../static/images/xuanzhong.png' : '../../../../../static/images/weixuan.png'"
							 mode=""></image>
							<text>AA拼单</text>
						</view>
					</view>
				</view> -->
				<view class="room-num">
					<text>包间数量</text>
					<view class="room-input">
						<input type="number" v-model="roomNumber" maxlength="4" />
					</view>
				</view>
				<view class="room-num-peo">
					<text>包间人数</text>
					<view class="room-input">
						<input type="number" v-model="capacity" maxlength="4" />
					</view>
				</view>
				<view class="room-num-fee">
					<text>服务费</text>
					<view class="room-input">
						<input type="number" v-model="fee" />
					</view>
				</view>
				<view class="room-porp">
					<text>独立卫生间</text>
					<view class="check-box">
						<view class="check1" @click="haveToilet = 1">
							<image :src="
                  haveToilet == 1
                    ? '../../../../../static/images/xuanzhong.png'
                    : '../../../../../static/images/weixuan.png'
                "
							 mode=""></image>
							<text>有</text>
						</view>
						<view class="check2" @click="haveToilet = 2">
							<image :src="
                  haveToilet == 2
                    ? '../../../../../static/images/xuanzhong.png'
                    : '../../../../../static/images/weixuan.png'
                "
							 mode=""></image>
							<text>无</text>
						</view>
					</view>
				</view>
				<view class="room-mahjong">
					<!-- <text>机麻</text>
					<view class="room-input">
						<input type="number" v-model="mahjong" />
					</view> -->
					<text style="margin-right: 70rpx">配套设施</text>
					<u-checkbox-group>
						<u-checkbox v-model="item.checked" v-for="(item, index) in playList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<view class="time-quan-wrap" v-for="(item, index) in roomTimeIntervalList">
				<view class="time-quan-info">
					<view class="time">
						<text>时间段</text>
						<view class="hours-range">
							<view>
								<view class="hours-box" @click="startBussTimeShows(index)">
									<text>{{ item.startTime }}</text>
									<u-picker mode="time" v-model="startBussTimeShow" :params="bussTimeParams" @confirm="returnStartBussTime" v-if="ind==index"></u-picker>
								</view>
							</view>
							<view class="line"></view>
							<view>
								<view class="hours-box" @click="endBussTimeShows(index)">
									<text>{{ item.endTime }}</text>
									<u-picker mode="time" v-model="endBussTimeShow" :params="bussTimeParams" @confirm="returnEndBussTime" v-if="ind==index"></u-picker>
								</view>
							</view>
						</view>
					</view>
					<!-- <view class="long-time">
            <text>最晚保留时间</text>
            <view>
              <view class="hours-box" @click="showChooseMins(index)">
                <text>{{ item.latestTime }}</text>
                <u-select
                  v-model="showChooseMin"
                  confirm-color="#67a8fc"
                  cancel-color="#000"
                  :safe-area-inset-bottom="true"
                  :list="longTimeMinList"
                  @confirm="resultLongTimeMin"
                ></u-select>
              </view>
            </view>
          </view> -->
					<view class="min-con">
						<text>最低消费</text>
						<view class="room-input">
							<input type="number" v-model="item.minConsumption" :data-index="index" @blur="changeNum" maxlength="6" style="text-align: center;" />
						</view>
					</view>
					<view class="add-btn">
						<view class="btn" @click="delDefaultTime(index)" v-if="index!=roomTimeIntervalList.length-1">
							<text>删除</text>
						</view>
						<view class="btn" @click="addDefaultTime(index)" v-if="index==roomTimeIntervalList.length-1">
							<text>添加</text>
						</view>
					</view>
				</view>
			</view>
			<view class="snacks-wrap" v-for="(item, index) in snacks" :key="index">
				<view class="snacks-info">
					<text>赠品</text>
					<view class="input">
						<input type="text" v-model="item.name" placeholder-style="color:#ccc" placeholder="请输入赠品名称" maxlength="10" />
					</view>
					<text>×</text>
					<view class="input num">
						<input type="number" v-model="item.num" maxlength="3" />
					</view>
					<view class="add-btn">
						<view class="btn" @click="delDefaultSnacks(index)" v-if="index!=snacks.length-1">
							<text>删除</text>
						</view>
						<view class="btn" @click="addDefaultSnacks(index)" v-if="index==snacks.length-1">
							<text>添加</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 必选商品 -->
			<template>
				<view class="ncs-wrap">
					<view v-for="(item,index) in ncsGoodsSkuList" :key="index" >
						<text class="title" >必选商品</text>
						<view class="choose-goods">{{item.goodsName + '（' + item.specName + '）'}}</view>
						<text class="sign">×</text>
						<view class="input num">
							<input type="number" placeholder="数量" v-model="item.number" maxlength="3" />
						</view>
						<view class="add-btn">
							<view class="btn" @click="delNcsGoods(item)">
								<text>删除</text>
							</view>
						</view>
					</view>
			
					<view>
						<text class="title">必选商品</text>
						<view v-if="ncsGoodsFlag.goodsName && ncsGoodsFlag.specName"  class="choose-goods add" @click="getNcsGoods">{{ncsGoodsFlag.goodsName + '（' + ncsGoodsFlag.specName + '）'}}</view>
						<view v-else class="choose-goods add" @click="getNcsGoods">请选择必选商品</view>
						<text class="sign">×</text>
						<view class="input num">
							<input type="number" placeholder="数量" v-model="ncsGoodsFlag.number" maxlength="3" />
						</view>
						<view class="add-btn">
							<view class="btn" @click="addNcsGoods">
								<text>添加</text>
							</view>
						</view>
					</view>
					<u-select v-model="showNcsSelect" mode="mutil-column-auto" :list="selNcsGoods" @confirm="confirmNcs"></u-select>
				</view>
			</template>
			
			<view class="room-sketch">
				<text>包间示意图 (375 × 220)</text>
				<block v-for="(item, index) in sketchArr" :key="index">
					<view style="
              width: 100%;
              height: 320rpx;
              border-radius: 15rpx;
              margin-bottom: 24rpx;
            "
					 class="room-sketch-child">
						<image src="../../../../../static/icon/delete.png" class="chacha" @click="delNowPcture(index)"></image>
						<image :src="pictureHead + item" mode="" style="width: 100%; height: 100%; border-radius: 15rpx" @click="lookImg(index)"></image>
					</view>
				</block>
				<view class="sketch-wrap" @click="addPicture('750upx','440upx')">
					<view class="file-upload"></view>
				</view>
			</view>
		</view>
		<view class="tab-handle">
			<view class="cancel" @click="handleCancel">
				<text>取消</text>
			</view>
			<view class="complete" @click="handleConfirm">
				<text>完成</text>
			</view>
		</view>
		<yq-avatar @upload="chooseImageComplete" ref="avatar"></yq-avatar>
	</view>
</template>

<script>
	import {
		chooseImage
	} from '../../../../../common/js/upload.js'
	export default {
		data() {
			return {
				necessary : '',
				goodsIdList : [],	//已经选择的必选商品列表里的商品id
				ncsGoodsFlag : {
					goodsName:'',	//商品名
					goodsId : '',	//商品id
					specName : '',	//规格名
					id : '',	//规格id
					number:'',	//商品数量
				},
				ncsGoodsSkuList: [],	//回显的必选商品列表
				selNcsGoods : [],	//可选择的必选商品列表
				showNcsSelect : false,	//选择必选商品的开关
				
				picFlag: false,
				pictureHead: "",
				floor: '',
				roomType: "", //包间类型
				roomDetail : '',	//包间描述
				roomNumber: null, //包间数量
				capacity: null, //包间人数
				fee:0,	//服务费
				mahjong: 0, //机麻
				roomAttribute: 0, //包间属性
				haveToilet: 2, //独立卫生间
				minConsumption: null, //最低消费
				id: null, //门店id
				ind: null, //时间下标
				// 时间
				roomTimeIntervalList: [{
					startTime: null, //开始时间
					endTime: null, //结束时间
					latestTime: 20, //最晚保留时间
					minConsumption: 1, //最低消费
				}, ],
				// 玩
				playList: [{
						name: "泳池",
						checked: false,
						disabled: false,
					},
					{
						name: "餐桌",
						checked: false,
						disabled: false,
					},
					{
						name: "桌球",
						checked: false,
						disabled: false,
					},
					{
						name: "机麻",
						checked: false,
						disabled: false,
					},
				],
				haveDiningTable: "", //餐桌
				haveMahjong: "", //机麻
				haveSwimming: "", //泳池
				haveTableTennis: "", //桌球
				// snacks//零嘴
				snacks: [{
					name: "",
					num: "",
				}, ],
				uploadingsnacks: [],
				// 时间默认数组
				defaultTime: {
					startTime: null, //开始时间
					endTime: null, //结束时间
					latestTime: 20, //最晚保留时间
					minConsumption: 1, //最低消费
				},
				// 零嘴默认
				defaultSnacks: {
					name: "",
					num: "",
				},
				//营业时间选择器
				bussTimeParams: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false,
				},
				// filterArr: [],
				startBussTime: "",
				endBussTime: "",
				startBussTimeShow: false,
				endBussTimeShow: false,
				sketchArr: [], //包间示意图存储
				showChooseMin: false, //选择最晚保留时间picker开关
				showChooseRoomType: false,
				longTimeMin: "", //最晚保留时间
				roomTypeList: [],
				uploadingroomTypeList: [], //上传数组
				longTimeMinList: [{
						value: "10",
						label: "10分钟",
					},
					{
						value: "20",
						label: "20分钟",
					},
					{
						value: "30",
						label: "30分钟",
					},
					{
						value: "40",
						label: "40分钟",
					},
					{
						value: "50",
						label: "50分钟",
					},
					{
						value: "60",
						label: "60分钟",
					},
					{
						value: "70",
						label: "70分钟",
					},
					{
						value: "80",
						label: "80分钟",
					},
					{
						value: "90",
						label: "90分钟",
					},
					{
						value: "100",
						label: "100分钟",
					},
					{
						value: "110",
						label: "110分钟",
					},
					{
						value: "120",
						label: "120分钟",
					},
				],
			};
		},
		onLoad(option) {
			this.id = option.storeId;
			this.pictureHead = this.$imgHead;
			this.$getPrivate(this, this.roomTypeList);
			// console.log(chooseImage);
		},

		methods: {
			//获取必选商品列表
			getNcsGoods() {
				this.$showLoading();
				if (this.ncsGoodsSkuList.length !== 0) {
					this.ncsGoodsSkuList.forEach((item) => {
						const index = this.goodsIdList.indexOf(item.id);
						if (index === -1) {
							this.goodsIdList.push(item.id);
						}
					});
				}
				
				let data = {
					goodsIdList: this.goodsIdList,
					name: ''
				};
			
				this.$post('/merchant/store/goods/selectGoodsList', data).then((res) => {
					if (res.code === 0) {
						//将返回的数据转为想要的格式
						let flag = [];
						
						if(res.data.length !== 0) {
							res.data.forEach((item) => {
								let obj = {
									value: item.id,
									label: item.name,
									children: []
								};
							
								item.skuList.forEach((j) => {
									let obj2 = {
										value: j.id,
										label: j.specName
									};
									obj.children.push(obj2);
								});
							
								flag.push(obj);
							});
							
							this.selNcsGoods = flag;
							this.showNcsSelect = true;
						} else {
							this.$errToast('暂无可选商品');
						}
					} else {
						this.$errToast(res.msg);
					}
				}).finally(() => {
					uni.hideLoading();
				});
			},
			
			//选择必选商品后的操作
			confirmNcs(e) {
				this.ncsGoodsFlag = {
					goodsName : e[0].label,
					goodsId : e[0].value,
					specName : e[1].label,
					id : e[1].value
				}
			},
			
			//添加必选商品按钮
			addNcsGoods() {
				if(!this.ncsGoodsFlag.goodsName) {
					this.$errToast('请选择必选商品');
				} else if(!this.ncsGoodsFlag.number) {
					this.$errToast('请输入数量');
				} else {
					this.ncsGoodsSkuList.push(this.ncsGoodsFlag)
					
					//初始化
					this.ncsGoodsFlag = {
						goodsName:'',	//商品名
						goodsId : '',	//商品id
						specName : '',	//规格名
						id : '',	//规格id
						number:'',	//商品数量
					}
				}
			},
			
			//删除必选商品按钮
			delNcsGoods(item) {
				const index1 = this.ncsGoodsSkuList.indexOf(item);
				const index2= this.goodsIdList.indexOf(item.id);
				
				//删除回显列表里的必选商品
				if (index1 !== -1) {
					this.ncsGoodsSkuList.splice(index1, 1);
				}
				
				//删除已经选择的必选商品列表里的商品id
				if (index2 !== -1) {
					this.goodsIdList.splice(index2, 1);
				}
			},
			startBussTimeShows(ind) {
				this.startBussTimeShow = true;
				this.ind = ind;
			},
			endBussTimeShows(ind) {
				this.endBussTimeShow = true;
				this.ind = ind;
			},
			showChooseMins(ind) {
				this.showChooseMin = true;
				this.ind = ind;
			},
			inputFlag() {
				this.showChooseRoomType = true;
			},
			//返回选择的店铺类型
			resultRoomType(res) {
				this.roomType = res[0].value;
				// console.log(this.roomType)
			},
			// 添加时间段
			addDefaultTime(ind) {
				// console.log(ind)
				if (
					!this.roomTimeIntervalList[ind].startTime ||
					!this.roomTimeIntervalList[ind].endTime ||
					!this.roomTimeIntervalList[ind].latestTime ||
					!this.roomTimeIntervalList[ind].minConsumption
				) {
					uni.showToast({
						icon: "none",
						title: "请补全当前时间段信息",
					});
					return;
				}
				this.roomTimeIntervalList.push(this.defaultTime)
				this.defaultTime = {
					startTime: null, //开始时间
					endTime: null, //结束时间
					latestTime: 20, //最晚保留时间
					minConsumption: 1, //最低消费
				};
			},
			// 最低消费
			changeNum(e) {
				// console.log(e)
				if (e.detail.value == "") {
					this.roomTimeIntervalList[
						e.currentTarget.dataset.index
					].minConsumption = 0.1;
				}
			},
			// 删除时间段
			delDefaultTime(ind) {
				this.roomTimeIntervalList.splice(ind, 1);
			},
			// 添加零碎
			addDefaultSnacks(ind) {
				if (!this.snacks[ind].name || !this.snacks[ind].num) {
					uni.showToast({
						icon: "none",
						title: "请补全当前小吃信息",
					});
					return;
				}
				this.snacks.push(this.defaultSnacks);
				this.defaultSnacks = {
					name: "",
					num: "",
				};
			},
			// 删除零碎
			delDefaultSnacks(ind) {
				this.snacks.splice(ind, 1);
			},
			//选择图片成功后的回调
			chooseImageComplete(res) {
				// console.log(res)
				let _this = this
				uni.showLoading({
					title: '上传中...'
				})
				var data = res.path;
				_this.$file_post(this.$fileUpload, data).then((res) => {
					// console.log(res)
					if (res.code == 0) {
						this.picFlag = false
						uni.hideLoading()
						_this.sketchArr.push(res.data);
						console.log(_this.sketchArr);
						if (_this.sketchArr.length >= 5) {
							uni.showToast({
								icon: "none",
								title: "上传最多四张",
							});
							_this.sketchArr.splice(0, 1);
						}
						// _this.getInfo(data);

					} else {
						this.picFlag = false
						uni.showToast({
							icon: "none",
							title: res.msg,
						});
					}
				});
			},
			// 上传图片
			addPicture(selWidth, selHeight) {
				this.$refs.avatar.fChooseImg(undefined, {
					selWidth,
					selHeight,
					stretch: 'longSel',
					inner: true
				});
			},
			// 获取图片信息
			getInfo(imgd) {
				let _this = this;
				uni.showLoading({
					title: '上传中...'
				})
				uni.getImageInfo({
					src: imgd,
					success: (result) => {
						// console.log(result)
						//       if (result.width > 375 || result.height > 220) {
						//         // console.log(_this.sketchArr,_this.sketchArr.length-1)
						//         _this.sketchArr.splice(_this.sketchArr.length - 1, 1);
						//         uni.showToast({
						//           icon: "none",
						//           title: "请传指定规格图片",
						//         });
						//       }else{
						// uni.hideLoading()
						// }
					},
				});
			},
			//查看图片
			lookImg(ind) {
				let imgArr = [];
				for (let value of this.sketchArr) {
					imgArr.push(this.$imgHead + value)
				}
				uni.previewImage({
					urls: imgArr,
					current: ind,
				});
			},
			// 删除当前图片
			delNowPcture(ind) {
				this.sketchArr.splice(ind, 1);
			},

			//返回开始营业时间
			returnStartBussTime(res) {
				this.startBussTime = res.hour + ":" + res.minute;
				this.roomTimeIntervalList[this.ind].startTime = this.startBussTime;
			},

			//返回结束营业时间
			returnEndBussTime(res) {
				this.endBussTime = res.hour + ":" + res.minute;
				this.roomTimeIntervalList[this.ind].endTime = this.endBussTime;
			},

			//返回选择的最晚保留时间
			resultLongTimeMin(res) {
				this.longTimeMin = res[0].value;
				this.roomTimeIntervalList[this.ind].latestTime = this.longTimeMin;
			},

			//取消
			handleCancel() {
				uni.navigateTo({
					url: '../ktvRoomMessage'
				})
			},
			// 确定
			handleConfirm() {
				if (!this.floor) {
					uni.showToast({
						icon: "none",
						title: "请输入楼层",
					});
					return;
				}
				if (!this.roomType) {
					uni.showToast({
						icon: "none",
						title: "请选择包间类型",
					});
					return;
				}
				if (!this.roomNumber) {
					uni.showToast({
						icon: "none",
						title: "请输入包间数量",
					});
					return;
				}
				if (!this.capacity) {
					uni.showToast({
						icon: "none",
						title: "请输入包间人数",
					});
					return;
				}
				if (this.sketchArr.length == 0) {
					uni.showToast({
						icon: "none",
						title: "请至少上传一张图片",
					});
					return;
				}
				this.uploadingroomTypeList = JSON.parse(JSON.stringify(this.roomTimeIntervalList))
				this.uploadingroomTypeList.splice(this.uploadingroomTypeList.length - 1, 1)
				if (this.uploadingroomTypeList.length == 0) {
					uni.showToast({
						icon: "none",
						title: "请至少添加一条时间段",
					});
					return;
				}
				// for (var i = 0; i < this.uploadingroomTypeList.length; i++) {
				// 	if (
				// 		!this.uploadingroomTypeList[i].startTime ||
				// 		!this.uploadingroomTypeList[i].endTime ||
				// 		!this.uploadingroomTypeList[i].latestTime ||
				// 		!this.uploadingroomTypeList[i].minConsumption
				// 	) {
				// 		uni.showToast({
				// 			icon: "none",
				// 			title: "请补全时间段",
				// 		});
				// 		return;
				// 	}
				// }
				this.uploadingsnacks = JSON.parse(JSON.stringify(this.snacks))
				this.uploadingsnacks.splice(this.uploadingsnacks.length - 1, 1)
				for (var i = 0; i < this.snacks.length - 1; i++) {
					if (!this.snacks[i].name || !this.snacks[i].num) {
						uni.showToast({
							icon: "none",
							title: "请补全赠品信息",
						});
						return
					}
				}
				
				for(let i = 0; i < this.ncsGoodsSkuList.length; i++) {
					if(!this.ncsGoodsSkuList[i].number) {
						this.$errToast('请输入必选商品数量');
						return
					}
				}
				
				
				this.haveSwimming = this.playList[0].checked ? 1 : 2;
				this.haveDiningTable = this.playList[1].checked ? 1 : 2;
				this.haveTableTennis = this.playList[2].checked ? 1 : 2;
				this.haveMahjong = this.playList[3].checked ? 1 : 2;
				let data = {
					id: this.id,
					cassette: "20 × 20",
					ktvRoomList: [{
						fee:this.fee,
						capacity: this.capacity,
						floor: this.floor,
						minConsumption: this.minConsumption,
						roomAttribute: this.roomAttribute,
						roomNumber: this.roomNumber,
						roomTypeId: this.roomType,
						roomDetail : this.roomDetail,
						roomTimeIntervalList: this.uploadingroomTypeList,
						snacks: JSON.stringify(this.uploadingsnacks),
						sketchMap: this.sketchArr.join(","),
						haveDiningTable: this.haveDiningTable, //餐桌
						haveMahjong: this.haveMahjong, //机麻
						haveSwimming: this.haveSwimming, //泳池
						haveTableTennis: this.haveTableTennis, //桌球
						haveToilet:this.haveToilet,//卫生间
						ncsGoodsSkuList : this.ncsGoodsSkuList,
						necessary : this.necessary
					}, ],
				};
				// console.log(data)
				uni.showLoading({
					title: "添加中...",
				});
				this.$put("/merchant/store/appUpdate", data).then((res) => {
					// console.log(res)
					if (res.code == 0) {
						uni.hideLoading();
						uni.showToast({
							icon: "success",
							title: res.data,
						});
						setTimeout(() => {
							uni.navigateTo({
								url: "../ktvRoomMessage",
							});
						}, 500)

					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
						});
					}
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.bg {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		height: 100%;
		width: 100%;
	}

	.has-navBar {
		padding-left: 24rpx;
		padding-right: 24rpx;
		padding-bottom: 96rpx;
		font-size: 32rpx;
		font-weight: 400;
	}

	.inputFloor {
		display: inline-block;
		width: 420rpx;
		height: 68rpx;
		border: 2rpx solid #67a8fc;
		border-radius: 12rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
	}

	.room-type {
		display: flex;
		align-items: center;
	}
	
	.input {
		input {
			border: 2rpx solid #67a8fc;
			border-radius: 12rpx;
			height: 68rpx;
			text-align: center;
			// padding: 12rpx 28rpx;
			box-sizing: border-box;
		}
	}

	.inputs {
		width: 60%;
		height: 68rpx;
		text-align: center;

		text {
			display: inline-block;
			border: 2rpx solid #67a8fc;
			border-radius: 12rpx;
			height: 68rpx;
			padding: 12rpx 28rpx;
			box-sizing: border-box;
			width: 100%;
			font-size: 32rpx;
		}
	}

	.room-input {
		position: relative;
		display: flex;
		align-items: center;

		input {
			width: 184rpx;
			height: 56rpx;
			padding-left: 24rpx !important;
			border: 2rpx solid #67a8fc;
			border-radius: 12rpx;
			box-sizing: border-box;
		}
	}

	.room-input::after {
		display: block;
		content: "";
		color: #fff;
		width: 56rpx;
		height: 56rpx;
		line-height: 56rpx;
		background-color: #67a8fc;
		border-top-right-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
		text-align: center;
		position: absolute;
		top: 0;
		right: 0;
	}

	.basic-info-wrap {
		margin-top: 48rpx;
		margin-left: 28rpx;

		.inpview {
			display: flex;
			align-items: center;
		}

		>view {
			display: flex;
			margin-bottom: 48rpx;

			>text {
				width: 160rpx;
				margin-right: 56rpx;
			}

			.check-box {
				>view {
					margin-right: 48rpx;

					text {
						margin-left: 16rpx;
					}
				}
			}
		}

		>view:last-child {
			margin-bottom: 0;
		}

		.room-porp {
			.check-box {
				display: flex;

				>view {
					cursor: pointer;

					image {
						width: 28rpx;
						height: 28rpx;
					}
				}
			}
		}

		.room-num {
			.room-input::after {
				content: "间";
			}
		}

		.room-num-peo {
			.room-input::after {
				content: "人";
			}
		}
		
		.room-num-fee {
			.room-input::after {
				content: "￥";
			}
		}

		.room-mahjong {
			.room-input::after {
				content: "桌";
			}
		}
	}

	.time-quan-wrap {
		margin: 20rpx 0;

		.time-quan-info {
			border-radius: 16rpx;
			border: 2rpx solid #67a8fc;
			// height: 436rpx;
			margin-bottom: 16rpx;
			padding: 28rpx 40rpx;

			>view {
				display: flex;
				margin-bottom: 48rpx;

				>text {
					white-space: nowrap;
					margin-right: 114rpx;
					display: inline-block;
				}
			}

			>view:last-child {
				margin-bottom: 0;
			}

			.hours-range {
				display: flex;
				align-items: center;

				.line {
					width: 40rpx;
					height: 2rpx;
					margin: 0 8rpx;
					background-color: #67a8fc;
				}

				.hours-box {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 184rpx;
					height: 56rpx;
					border: 2rpx solid #67a8fc;
					border-radius: 12rpx;
				}
			}

			.long-time {
				text {
					margin-right: 20rpx;
				}

				.hours-box {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 184rpx;
					height: 56rpx;
					border: 2rpx solid #67a8fc;
					border-radius: 12rpx;
				}
			}

			.min-con {
				text {
					margin-right: 88rpx;
				}

				.room-input {
					input {
						padding-left: 56rpx;
					}
				}

				.room-input::after {
					content: "￥";
					border-radius: 0;
					border-top-left-radius: 12rpx;
					border-bottom-left-radius: 12rpx;
					top: 0;
					left: 0;
				}
			}

			.add-btn {
				.btn {
					margin: 0 auto;
					width: 224rpx;
					height: 68rpx;
					background-color: #67a8fc;
					border-radius: 12rpx;
					display: flex;
					justify-content: center;
					align-items: center;

					text {
						color: #fff;
					}
				}
			}
		}

		.time-quan-info::after {
			margin-bottom: 0;
		}
	}
	
	.snacks-info-none {
		padding: 28rpx;
		margin-bottom: 20rpx;
	}
	
	.ncs-wrap {
		margin: 48rpx 0;
	
		>view {
			display: flex;
			align-items: center;
			margin-bottom: 32rpx;
	
			.choose-goods {
				width: 272rpx;
				min-height: 68rpx;
				border: 2rpx solid #67A8FC;
				border-radius: 12rpx;
				box-sizing: border-box;
				font-size: 32rpx;
				display: flex;
				align-items: center;
				padding-left: 24rpx;
				margin: 0 20rpx;
			}
	
			.input.num {
				text-align: center;
				margin: 0 20rpx;
	
				input {
					width: 68rpx;
					padding: 0;
				}
			}
	
			.add-btn {
				width: 124rpx;
				height: 68rpx;
				border: 2rpx solid #67a8fc;
				border-radius: 12rpx;
				background-color: #67a8fc;
				display: flex;
				justify-content: center;
				align-items: center;
	
				.btn text {
					color: #fff;
				}
			}
		}
	
	
	}
	

	.snacks-wrap {
		margin-bottom: 20rpx;

		.snacks-info {
			margin-bottom: 16rpx;
			height: 124rpx;
			border: 2rpx solid #67a8fc;
			border-radius: 16rpx;
			padding: 28rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			&:last-child {
				margin-bottom: 0;
			}

			.input {
				input {
					height: 68rpx;
					border: 2rpx solid #67a8fc;
					// padding: 12rpx 20rpx;
					text-align: center;
					width: 272rpx;
					border-radius: 12rpx;
				}
			}

			.input.num {
				text-align: center;

				input {
					width: 68rpx;
				}
			}

			.add-btn {
				width: 124rpx;
				height: 68rpx;
				border: 2rpx solid #67a8fc;
				border-radius: 12rpx;
				background-color: #67a8fc;
				display: flex;
				justify-content: center;
				align-items: center;

				.btn text {
					color: #fff;
				}
			}
		}
	}

	.room-sketch {
		margin-bottom: 60rpx;
		padding: 0 52rpx;

		.room-sketch-child {
			position: relative;

			.chacha {
				width: 60rpx;
				height: 60rpx;
				position: absolute;
				right: 14rpx;
				top: 14rpx;
				z-index: 10;
			}
		}

		.sketch-wrap {
			margin-top: 24rpx;
			margin-bottom: 24rpx;
		}

		.file-upload {
			height: 320rpx;
			margin-bottom: 26rpx;

			&:last-child {
				margin-bottom: 0;
			}
		}
	}

	.tab-handle {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 96rpx;
		z-index: 99;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, 0.1);

		font-size: 32rpx;
		font-weight: 400;

		.cancel {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			background-color: #fff;
		}

		.complete {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 50%;
			background-color: rgba(103, 168, 252, 1);

			text {
				color: #fff;
			}
		}
	}
</style>

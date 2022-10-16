<template>
	<view>
		<view class="bg" v-if="picFlag">

		</view>
		<navBar :navigateUrl="'../ktvRoomMessage'">包间信息</navBar>
		<view class="has-navBar">
			<template v-if="$store.state.auth > 0 ">
				<view :class="[isReadonly ? '' : 'show-btn-active']" class="show-btn" @click="handleEdit">
					<text>编辑</text>
				</view>
			</template>

			<view class="basic-info-wrap">
				<view>
					<text>楼层</text>
					<text v-if="isReadonly">{{floor}}</text>
					<input type="text" v-model="floor" v-if="!isReadonly" class="inputFloor" placeholder-style="color:#ccc"
					 placeholder="请输入楼层" />
				</view>
				<view class="room-type">
					<text>包间类型</text>
					<text v-if="isReadonly">{{
            roomType | orderProperty(roomTypeList)
          }}</text>
					<view v-else class="choose-room-type" @click="showChooseRoomType = true">
						<text>{{
              roomType == ""
                ? "请选择店铺类型"
                : roomType | orderProperty(roomTypeList)
            }}</text>
					</view>
					<u-select v-model="showChooseRoomType" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true"
					 :list="roomTypeList" @confirm="resultRoomType"></u-select>
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
					 height="186" :disabled="isReadonly" v-model="roomDetail" type="textarea" :auto-height="true" placeholder="请添加包间描述(非必填)" />
				</view>

				<!-- 	<view class="room-porp">
					<text>包间属性</text>
					<text v-if="isReadonly">{{roomProp == 1 ? '预定桌' : 'AA拼单'}}</text>
					<view v-else class="check-box">
						<view class="check1" @click="roomProp = 1">
							<image :src="roomProp == 1 ? '../../../../../static/images/xuanzhong.png' : '../../../../../static/images/weixuan.png'"
							 mode=""></image>
							<text>预定桌</text>
						</view>
						<view class="check2" @click="roomProp = 2">
							<image :src="roomProp == 2 ? '../../../../../static/images/xuanzhong.png' : '../../../../../static/images/weixuan.png'"
							 mode=""></image>
							<text>AA拼单</text>
						</view>
					</view>
				</view> -->
				<view class="room-num">
					<text>包间数量</text>
					<view class="room-input">
						<input type="text" v-model="roomNumber" :disabled="isReadonly" maxlength="4" />
					</view>
				</view>
				<view class="room-num-peo">
					<text>容纳人数</text>
					<view class="room-input">
						<input type="text" v-model="capacity" :disabled="isReadonly" maxlength="4" />
					</view>
				</view>
				<view class="room-num-fee">
					<text>服务费</text>
					<view class="room-input">
						<input type="number" v-model="fee" :disabled="isReadonly" />
					</view>
				</view>
				<view class="room-porp">
					<text>独立卫生间</text>
					<text v-if="isReadonly" class="toilet">{{
            haveToilet == 1 ? "有" : "无"
          }}</text>
					<view v-else class="check-box">
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
						<input type="text" v-model="mahjong" :disabled="isReadonly" />
					</view> -->
					<text style="margin-right: 68rpx">配套设施</text>
					<u-checkbox-group @change="checkboxGroupChange">
						<u-checkbox v-model="item.checked" v-for="(item, index) in playList" :key="index" :name="item.name"
						 :disabled="item.disabled">{{ item.name }}</u-checkbox>
					</u-checkbox-group>
				</view>
			</view>
			<view class="time-quan-wrap">
				<block v-for="(item, index) in roomTimeIntervalList" :key="index">
					<view class="time-quan-info" :style="{ border: isReadonly ? 'none' : '2rpx solid #67A8FC' }">
						<view class="time">
							<text>时间段</text>
							<view class="hours-range">
								<view>
									<view class="hours-box" v-if="isReadonly">
										<text>{{ item.startTime }}</text>
									</view>
									<view v-else class="hours-box" @click="startBussTimeShows(index)">
										<text>{{ item.startTime }}</text>
									</view>
									<u-picker mode="time" v-model="startBussTimeShow" :params="bussTimeParams" @confirm="returnStartBussTime" v-if="ind==index"></u-picker>
								</view>
								<view class="line"></view>
								<view>
									<view class="hours-box" v-if="isReadonly">
										<text>{{ item.endTime }}</text>
									</view>
									<view v-else class="hours-box" @click="endBussTimeShows(index)">
										<text>{{ item.endTime }}</text>
									</view>
									<u-picker mode="time" v-model="endBussTimeShow" :params="bussTimeParams" @confirm="returnEndBussTime" v-if="ind==index"></u-picker>
								</view>
							</view>
						</view>
						<!-- <view class="long-time">
							<text>最晚保留时间</text>
							<view>
								<view v-if="isReadonly" class="hours-box">
									<text>{{ item.latestTime }}</text>
								</view>
								<view v-else class="hours-box" @click="showChooseMins(index)">
									<text>{{ item.latestTime }}</text>
								</view>
								<u-select v-model="showChooseMin" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true"
								 :list="longTimeMinList" @confirm="resultLongTimeMin"></u-select>
							</view>
						</view> -->
						<view class="min-con">
							<text>最低消费</text>
							<view class="room-input">
								<input type="number" v-model="item.minConsumption" :disabled="isReadonly" :data-index="index" @blur="changeNum"
								 maxlength="6" style="text-align: center;" />
							</view>
						</view>
						<view class="add-btn" v-if="!isReadonly">
							<view class="btn" @click="delDefaultTime(index)" v-if="index!=roomTimeIntervalList.length-1">
								<text>删除</text>
							</view>
							<view class="btn" @click="addDefaultTime(index)" v-if="index==roomTimeIntervalList.length-1">
								<text>添加</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<template>
				<view class="snacks-wrap" v-if="snacks.length !== 0">
					<block v-for="(item, index) in snacks" :key="index">
						<view class="snacks-info" :style="{ border: isReadonly ? 'none' : '2rpx solid #67A8FC' }">
							<text :class="[compileSketchFlag ? 'present' : 'jiapresent']">赠品</text>
							<view class="input">
								<input type="text" v-model="item.name" placeholder-style="color:#ccc" placeholder="请输入赠品名称" :disabled="isReadonly"
								 maxlength="10" />
							</view>
							<text class="sign">×</text>
							<view class="input num">
								<input type="number" placeholder="数量" v-model="item.num" :disabled="isReadonly" maxlength="3" />
							</view>
							<view class="add-btn" v-if="!isReadonly">
								<view class="btn" @click="delDefaultSnacks(index)" v-if="index!=snacks.length-1">
									<text>删除</text>
								</view>
								<view class="btn" @click="addDefaultSnacks(index)" v-if="index==snacks.length-1">
									<text>添加</text>
								</view>
							</view>
						</view>
					</block>
				</view>
				<view v-else class="snacks-info-none">
					赠品：无
				</view>
			</template>

			<!-- 必选商品 -->
			<template>
				<view v-if="ncsGoodsSkuList.length === 0 && isReadonly" class="snacks-info-none">
					必选商品：无
				</view>
				<view class="ncs-wrap" v-else>
					<view v-for="(item,index) in ncsGoodsSkuList" :key="index" :style="{'padding' : isReadonly ? '0 28rpx' : '0'}">
						<text class="title" :style="{'margin-right' : isReadonly ? '68rpx' : '0'}">必选商品</text>
						<view class="choose-goods">{{item.goodsName + '（' + item.specName + '）'}}</view>
						<text class="sign">×</text>
						<view class="input num">
							<input type="number" placeholder="数量" v-model="item.number" :disabled="isReadonly" maxlength="3" />
						</view>
						<view class="add-btn" v-if="!isReadonly">
							<view class="btn" @click="delNcsGoods(item)">
								<text>删除</text>
							</view>
						</view>
					</view>

					<view v-if="!isReadonly">
						<text class="title">必选商品</text>
						<view v-if="ncsGoodsFlag.goodsName && ncsGoodsFlag.specName"  class="choose-goods add" @click="getNcsGoods">{{ncsGoodsFlag.goodsName + '（' + ncsGoodsFlag.specName + '）'}}</view>
						<view v-else class="choose-goods add" @click="getNcsGoods">请选择必选商品</view>
						<text class="sign">×</text>
						<view class="input num">
							<input type="number" placeholder="数量" v-model="ncsGoodsFlag.number" :disabled="isReadonly" maxlength="3" />
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
				<block v-for="(item, index) in sketchMap" :key="index">
					<view style="
              width: 100%;
              height: 320rpx;
              margin-top: 24rpx;
              border-radius: 15rpx;
            "
					 v-if="sketchFlag" @click="lookImg(index)" class="room-sketch-child">
						<image :src="pictureHead + item" mode="" style="width: 100%; height: 100%; border-radius: 15rpx"></image>
						<image src="../../../../../static/icon/delete.png" class="chacha" @click.stop="delNowPcture(index)" v-if="compileSketchFlag"></image>
					</view>
				</block>

				<view class="sketch-wrap" v-if="!sketchFlag" @click="addPicture">
					<view class="file-upload"></view>
				</view>
				<view class="sketch-wrap" v-if="compileSketchFlag" @click="addPicture('750upx','440upx')">
					<view class="file-upload"></view>
				</view>
			</view>
		</view>
		<view class="tab-handle" v-if="!isReadonly">
			<view class="cancel" @click="handleCancel">
				<text>取消</text>
			</view>
			<view class="complete" @click="handleComfirm">
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

				id: '',
				picFlag: false,
				pictureHead: "",
				isReadonly: true,
				showChooseRoomType: false,
				floor: null, //楼层
				roomType: null, //包间类型
				roomDetail: '', //包间描述
				roomProp: null, //包间属性
				roomNumber: null, //包间数量
				capacity: null, //容纳人数
				fee:0,	//服务费
				haveToilet: 2, //独立卫生间
				mahjong: null, //机麻
				minConsumption: null, //最低消费(只算)
				snacks: [], //赠品
				uploadingsnacks: [],
				begainsnacks: [],
				loadingOk: false, //数据是否获取
				sketchMapArr: [], //存储图片
				sketchMap: null, //包间示意图
				sketchFlag: false, //包间示意图
				compileSketchFlag: false, //编辑包间示意图
				roomTimeIntervalList: [], //时间段
				uploadingroomTypeList: [], //上传数组
				begainroomTimeIntervalList: [],
				// 时间默认数组
				defaultTime: {
					startTime: null, //开始时间
					endTime: null, //结束时间
					latestTime: 20, //最晚保留时间
					minConsumption: 1, //最低消费
				},
				// 玩
				playList: [{
						name: "泳池",
						checked: false,
						disabled: true,
					},
					{
						name: "餐桌",
						checked: false,
						disabled: true,
					},
					{
						name: "桌球",
						checked: false,
						disabled: true,
					},
					{
						name: "机麻",
						checked: false,
						disabled: true,
					},
				],
				uploadingPlay: [], //上传判断
				haveDiningTable: "", //餐桌
				haveMahjong: "", //机麻
				haveSwimming: "", //泳池
				haveTableTennis: "", //桌球
				// 零嘴默认
				defaultSnacks: {
					name: "",
					num: "",
				},
				id: null, //详情id
				storeId: null, //门店id
				ind: null, //点击下标
				//营业时间选择器
				bussTimeParams: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false,
				},
				startBussTime: "",
				endBussTime: "",
				startBussTimeShow: false,
				endBussTimeShow: false,
				showChooseMin: false, //选择最晚保留时间picker开关
				longTimeMin: null, //最晚保留时间
				roomTypeList: [],
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
			this.getKtvDetail(option.id);
			this.id = option.id
			this.storeId = option.storeId;
			this.pictureHead = this.$imgHead;
			this.$getPrivate(this, this.roomTypeList);
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

			// 选中任一checkbox时，由checkbox-group触发
			checkboxGroupChange(e) {
				this.uploadingPlay = e;
			},
			getKtvDetail(id) {
				this.$get(`/merchant/store/getKtvInfoById/${id}`).then((res) => {
					if (res.code == 0) {
						this.sketchMapArr = []
						res.data.sketchMap = res.data.sketchMap.split(",");
						// console.log(res.data.sketchMap)
						this.floor = res.data.floor;
						this.roomType = res.data.roomTypeId;
						this.roomProp = res.data.roomAttribute;
						this.roomDetail = res.data.roomDetail;
						this.roomNumber = res.data.roomNumber;
						this.capacity = res.data.capacity;
						this.fee = res.data.fee;
						this.haveToilet = res.data.haveToilet;
						this.mahjong = Number(res.data.mahjong);
						this.minConsumption = res.data.minConsumption;
						// 设施
						this.playList[0].checked = res.data.haveSwimming == 1 ? true : false;
						this.playList[1].checked =
							res.data.haveDiningTable == 1 ? true : false;
						this.playList[2].checked =
							res.data.haveTableTennis == 1 ? true : false;
						this.playList[3].checked = res.data.haveMahjong == 1 ? true : false;
						this.haveSwimming = res.data.haveSwimming;
						this.haveDiningTable = res.data.haveDiningTable;
						this.haveTableTennis = res.data.haveTableTennis;
						this.haveMahjong = res.data.haveMahjong;
						this.snacks = JSON.parse(JSON.stringify(JSON.parse(res.data.snacks)));
						this.sketchMap = res.data.sketchMap;
						this.sketchMapArr.push(res.data.sketchMap);
						this.sketchFlag = true;
						this.roomTimeIntervalList = JSON.parse(JSON.stringify(res.data.roomTimeIntervalList));
						this.id = res.data.id;
						this.begainroomTimeIntervalList = JSON.parse(JSON.stringify(res.data.roomTimeIntervalList))
						this.begainsnacks = JSON.parse(JSON.stringify(JSON.parse(res.data.snacks)))
						this.loadingOk = true;
						this.ncsGoodsSkuList = res.data.ncsGoodsSkuList;
						this.necessary = res.data.necessary;
					} else {
						uni.showToast({
							icon: 'none',
							title: '网络错误'
						})
						this.loadingOk = false
					}
				});
			},

			handleEdit() {
				if (this.$store.state.auth < 1) {
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				if (!this.loadingOk) {
					return
				}
				this.roomTimeIntervalList.push(this.defaultTime);
				this.snacks.push(this.defaultSnacks);
				this.playList.map((item) => {
					item.disabled = false;
					return item;
				});
				this.isReadonly = false;
				this.compileSketchFlag = true;
				this.defaultTime = {
					startTime: null, //开始时间
					endTime: null, //结束时间
					latestTime: 20, //最晚保留时间
					minConsumption: 1, //最低消费
				}
				this.defaultSnacks = {
					name: "",
					num: "",
				}
			},

			// 确定
			handleComfirm() {
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
						title: "请输入容纳人数",
					});
					return;
				}
				if (this.sketchMap.length == 0) {
					uni.showToast({
						icon: "none",
						title: "请至少添加一张图片",
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
					id: this.storeId,
					cassette: "20 × 20",
					ktvRoomList: [{
						floor: this.floor,
						capacity: this.capacity, //容纳人数
						fee:this.fee,
						minConsumption: this.minConsumption, //最低消费
						roomAttribute: this.roomProp, //包间所属类型 1-预定桌 2-AA拼单桌
						roomDetail: this.roomDetail, //包间描述
						roomNumber: this.roomNumber, //包间数量
						roomTypeId: this.roomType, //ktv包间类型id
						id: this.id, //包间id
						mahjong: this.mahjong, //机麻
						roomTimeIntervalList: this.uploadingroomTypeList, //ktv包间时段集合
						snacks: JSON.stringify(this.uploadingsnacks), //零嘴
						sketchMap: this.sketchMapArr.toString(), //图
						storeId: this.storeId, //门店id
						haveDiningTable: this.haveDiningTable, //餐桌
						haveMahjong: this.haveMahjong, //机麻
						haveSwimming: this.haveSwimming, //泳池
						haveTableTennis: this.haveTableTennis, //桌球
						haveToilet: this.haveToilet, //卫生间
						ncsGoodsSkuList : this.ncsGoodsSkuList,
						necessary : this.necessary
					}, ],
				};
				uni.showLoading({
					title: "修改中",
				});
				// console.log(data)
				this.$put("/merchant/store/appUpdate", data).then((res) => {
					// console.log(res)
					if (res.code == 0) {
						uni.showToast({
							icon: "success",
							title: res.data,
						});
						this.roomTimeIntervalList.splice(this.roomTimeIntervalList.length - 1, 1)
						this.snacks.splice(this.snacks.length - 1, 1)
						this.isReadonly = true;
						this.compileSketchFlag = false;
						this.playList.map((item) => {
							item.disabled = true;
							return item;
						});
					} else {
						uni.showToast({
							icon: "none",
							title: res.msg,
						});
					}

				});
			},

			//取消
			handleCancel() {
				this.isReadonly = true;
				this.compileSketchFlag = false;
				this.playList.map((item) => {
					item.disabled = true;
					return item;
				});
				this.getKtvDetail(this.id);
				this.roomTimeIntervalList = JSON.parse(JSON.stringify(this.begainroomTimeIntervalList))
				this.snacks = JSON.parse(JSON.stringify(this.begainsnacks))
				// console.log(this.begainroomTimeIntervalList)
			},

			//返回选择的店铺类型
			resultRoomType(res) {
				this.roomType = res[0].value;
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
				this.roomTimeIntervalList[this.ind].latestTime = Number(this.longTimeMin);
			},
			// 添加时间段
			addDefaultTime(ind) {
				console.log(ind)
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
				this.roomTimeIntervalList.push(this.defaultTime);
				this.defaultTime = {
					startTime: null, //开始时间
					endTime: null, //结束时间
					latestTime: 20, //最晚保留时间
					minConsumption: 1, //最低消费
				};
			},
			// 删除时间段
			delDefaultTime(ind) {
				this.roomTimeIntervalList.splice(ind, 1);
			},
			// 最低消费
			changeNum(e) {
				// console.log(e)
				if (e.detail.value == "") {
					this.roomTimeIntervalList[
						e.currentTarget.dataset.index
					].minConsumption = 1;
				}
			},
			// 添加零碎
			addDefaultSnacks(ind) {
				if (!this.snacks[ind].name || !this.snacks[ind].num) {
					uni.showToast({
						icon: "none",
						title: "请补全当前赠品信息",
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
			chooseImageComplete(res) {
				let _this = this;
				uni.showLoading({
					title: '上传中...'
				})
				var data = res.path;
				_this.$file_post(this.$fileUpload, data).then((res) => {
					// console.log(res)
					if (res.code == 0) {
						this.picFlag = false
						uni.hideLoading()
						_this.sketchMap.push(res.data);
						console.log(_this.sketchMap);
						if (_this.sketchMap.length >= 5) {
							uni.showToast({
								icon: "none",
								title: "上传最多四张",
							});
							_this.sketchMap.splice(0, 1);
						}

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
				uni.getImageInfo({
					src: imgd,
					success: (result) => {},
				});
			},
			//查看图片
			lookImg(ind) {
				let imgArr = [];
				for (let value of this.sketchMap) {
					imgArr.push(this.$imgHead + value)
				}
				uni.previewImage({
					urls: imgArr,
					current: ind,
				});
			},
			// 删除当前图片
			delNowPcture(ind) {
				this.sketchMap.splice(ind, 1);
			},

			// 保留时间
			showChooseMins(ind) {
				this.showChooseMin = true;
				this.ind = ind;
			},
			// 时间段
			startBussTimeShows(ind) {
				this.startBussTimeShow = true;
				// console.log(ind)
				this.ind = ind;
			},
			endBussTimeShows(ind) {
				this.endBussTimeShow = true;
				// console.log(ind)
				this.ind = ind;
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

	.show-btn {
		font-size: 32rpx;
		font-weight: 600;
		border-radius: 16rpx;
		height: 92rpx;
		color: #fff;
		background-color: rgb(103, 168, 252);
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 24rpx;
		margin-bottom: 48rpx;

		>text {
			color: #fff;
		}
	}

	.show-btn-active {
		margin-bottom: 24rpx;
		background-color: #67a8fc;
		opacity: 0.5;
	}

	.input {
		input {
			border: 2rpx solid #67a8fc;
			border-radius: 12rpx;
			height: 68rpx;
			text-align: center;
			padding: 12rpx 28rpx;
			box-sizing: border-box;
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
			// text-align: center;
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
		padding-left: 28rpx;

		.room-type {
			text {}
		}

		>view {
			display: flex;
			margin-bottom: 48rpx;

			.choose-room-type {
				width: 420rpx;
				height: 68rpx;
				border: 2rpx solid #67a8fc;
				border-radius: 12rpx;
				display: flex;
				justify-content: center;
				align-items: center;

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

			>text:first-child {
				width: 160rpx;
				margin-right: 52rpx;
				text-align: left;
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
			text {}

			&:nth-child(5) {
				// padding-left: 32rpx;
				box-sizing: border-box;
			}

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
			margin-bottom: 16rpx;
			padding: 28rpx;

			>view {
				display: flex;
				margin-bottom: 48rpx;

				>text {
					margin-right: 114rpx;
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
					&:nth-child(1) {
						margin-right: 20rpx;
					}
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
					&:nth-child(1) {
						margin-right: 84rpx;
					}
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
			.jiapresent {
				margin-right: 128rpx;
			}

			.present {
				margin-right: 0 !important;
			}

			margin-bottom: 16rpx;
			height: 124rpx;
			border: 2rpx solid #67a8fc;
			border-radius: 16rpx;
			padding: 28rpx;
			display: flex;
			align-items: center;

			&:last-child {
				margin-bottom: 0;
			}

			.input {
				margin: 0 20rpx;

				input {
					padding: 12rpx 0;
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

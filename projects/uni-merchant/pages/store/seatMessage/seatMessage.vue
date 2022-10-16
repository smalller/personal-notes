<template>
	<view class="seatMessage">
		<navBar :switchUrl="'../store'">座位信息</navBar>
		<view class="has-navBar" v-show="bigFlag" v-if="!messageFlag">
			<button class="btn1" @click="shade" :disabled="!bigFlag">场地布局：{{x}}x{{y}}</button>
			<button class="btn1" @click="stateFlag()" :disabled="!statsFourFlag" v-if="btnOkFlag">编辑座位信息</button>
			<button class="btn1" @click="goConfirm()" v-if="!btnOkFlag" :disabled="!bigFlag">确定保存</button>
		</view>
		<view class="has-navBar" v-show="messageFlag">
			<view class="cancelbtn1" @click="cancel1">取消</view>
			<button class="cancelbtn2" @click="confirm1">确定</button>
		</view>
		<view v-show="bigFlag" style="padding-bottom: 20rpx;">
			<view class="header">
				<view class="left">
					<text>可预订</text><text></text>
				</view>
				<view class="middle">
					<text>不可预订</text><text></text>
				</view>
				<view class="passage">
					<text>过道</text><text></text>
				</view>
				<view class="right">
					<text>舞台</text><text></text>
				</view>
			</view>
			<view :class="[animationFlag?'details':'room-list-wrap']">
				<movable-area style="width: 100%;height: 704rpx;overflow: hidden;box-sizing: border-box;margin: 40rpx auto 0;">
					<movable-view :style="{'width':width,'height':'auto','margin-top':30+'rpx','text-align':'center'}" direction="all"
					 inertia="true" out-of-bounds="true" scale="true" scale-min=0.2 scale-max=2 :scale-value=scaleValue :animation="false">
						<view v-for="(item,index) in newArrays" :key="index" class="details_row" v-if="arrFlag" @click="dblclick">
							<view class="details_col" v-for="(itm,ind) in item" :key="ind">
								<text v-bind:class="[itm.seatType==4?'acbg3':itm.seatType==3?'acbg5':itm.seatAttribute==2?'acbg1':itm.seatAttribute==1?'acbg2':itm.seatAttribute==16?'acbg4':'']"
								 @click="pleaseSit(index,ind)"></text>
							</view>
						</view>
						<view v-for="(item,index) in newArrays" :key="index" class="details_row" v-if="!arrFlag" @click="dblclick">
							<view v-for="(itm,ind) in item" :key="ind" class="details_col">
								<text v-bind:class="[itm.seatType==4?'acbg3':itm.seatType==3?'acbg5':itm.seatAttribute==2?'acbg1':itm.seatAttribute==1?'acbg2':itm.seatAttribute==16?'acbg4':'']"
								 @click.stop="sitStatus(index,ind)" v-if="!seatMessageOk" v-bind:style="{'border':index+'_'+ind==seatStatsNum?'1px solid #67A8FC':''}"></text>
								<text v-bind:class="[itm.seatType==4?'acbg3':itm.seatType==3?'acbg5':itm.seatAttribute==2?'acbg1':itm.seatAttribute==1?'acbg2':itm.seatAttribute==16?'acbg4':'']"
								 @click.stop="newNumber(index,ind)" v-else v-bind:style="{'border':index+'_'+ind==seatStatsNum?'1px solid #67A8FC':''}"></text>
							</view>
						</view>
					</movable-view>
				</movable-area>
			</view>
			<view style="display: flex;">
				<button @click="message()" class="footer" :disabled="!bigFlag" v-show="!messageFlag">配置座位状态</button>
				<button @click="messageFloor()" class="footer" :disabled="!bigFlag" v-show="!messageFlag" style="width: 180rpx;">设置楼层</button>
				<button  @click="goSetState" class="footer" v-show="!messageFlag">配置线下状态</button>
			</view>
		</view>
		<view v-show="!bigFlag" class="bigBox">
			<view>
				<text style="font-size: 32rpx;">座位号</text>
				<input class="one" type="text" value="" v-model="seatCode" />
			</view>
			<view class="two">
				<text>座位类型</text>
				<view style="display: flex;margin-left: 24rpx;">
					<view @click="softHardStatus = 1">
						<image class="img-icon" :src="softHardStatus == 1 ? activeIcon : inactiveIcon"></image>
						卡座
					</view>
					<view @click="softHardStatus = 2" style="margin-left: 48rpx;">
						<image class="img-icon" :src="softHardStatus == 2 ? activeIcon : inactiveIcon"></image>
						散台
					</view>
				</view>
			</view>
			<view class="other-two" @click="softHardStatus = 3">
				<image class="img-icon" :src="softHardStatus == 3 ? activeIcon : inactiveIcon"></image>
				独立高脚凳
			</view>
			<view class="three">
				<text>容纳人数</text>
				<view class="three_after">
					<input type="number" value="" v-model=" numberOfPeople" style="padding-left: 10rpx;" />
				</view>
			</view>
			<view class="four">
				<text>最晚保留时间</text>
				<input type="text" value="" v-model="seatLatestReservationTime" @focus="inpTime" />
			</view>
			<text class="five_text">最低消费</text>
			<view class="five">
				<view class="funday" v-for="(item,index) in weekPriceList" :key="index">
					<view class="left">
						<text>{{item.weekIndex | dayOfWeek}}</text>
						<input type="number" placeholder="请输入价格" v-model="item.price" adjust-position="true" @blur="changePrice(index,item.price)" />
					</view>
					<!-- 	<view class="right">
						<text>最晚保留时间</text>
						<input type="text" value="" v-model="item.seatLatestReservationTime" @focus="inpTime(index)" />
					</view> -->
				</view>
			</view>
			<view class="foot_bootom">
				<view class="cancelbtn" @click="stateFalse">取消</view>
				<button class="comfimbtn" @click="stateOk">完成</button>
			</view>
		</view>
		<u-picker mode="time" v-model="show" :params="paramsTime" @confirm="confirms" @cancel="cancelTime"></u-picker>

		<!-- 遮罩层1shade -->
		<view class="shade" v-show="shadeFlag">
			<view class="top"><text>行</text><text>列</text></view>
			<view class="middle">
				<input type="number" v-model="seatrow" maxlength=2 />
				<text>x</text>
				<input type="number" v-model="seatcol" maxlength=2 />
			</view>
			<view class="bottom">
				<view class="bt1" @click="cancel">取消</view>
				<button class="bt2" @click="confirm">确定</button>
			</view>
		</view>
		<view class="floor-shade" v-show="floorFlag">
			<view style="text-align: center;font-size: 32rpx;">设置楼层</view>
			<view v-for="(item,index) in seatfloor" :key="index" style="display: flex;align-items: center;">
				<input type="text" maxlength="4" v-model="item.floor" class="floorInp" @input="cutInput(index,item.floor)" @blur="blurInput(index,item.floor)" />
				<view class="floor-add" v-if="index!=seatfloor.length-1" @click=floorChange(0,index)>-</view>
				<view class="floor-add" v-if="index==seatfloor.length-1" @click=floorChange(1,index,seatfloor.length)>+</view>
			</view>
			<view class="bottom">
				<view class="bt1" @click="floorcancel">取消</view>
				<button class="bt2" @click="floorConfirm">确定</button>
			</view>
		</view>
		<view class="floor-name" v-if="!bigMessageFlag" v-show="showbigMessageFlag">
			<view class="specific-name" v-for="(item,index) in list" :key="index" :style="{'backgroundColor':index==defaultNowFloor?'rgba(179,211,253,.3)':'#fff'}"
			 @click="cutFloor(index)">{{item.floor}}</view>
		</view>
		<view class="bg" v-show="shadeFlag" @click="cancel">

		</view>
		<view class="bg" v-show="floorShadeFlag" @click="setFloorcancel">

		</view>
		<view class="bgm" v-if="bigMessageFlag" @click="closeMessage">

		</view>
		<view class="operationBg" v-if="operationFlag">

		</view>
		<view style="margin-top: 40rpx;" v-show="messageFlag">
			<view class="select">
				<text>选择区</text>
				<text @click="color(2)"></text>
				<text @click="color(1)"></text>
				<text @click="color(3)"></text>
				<text @click="color(4)"></text>
			</view>
		</view>
		<view class="bigMessage" v-if="bigMessageFlag" v-for="(item,index) in presentMessage" :key="index">
			<view class="top">
				<text>座位详情</text>
				<text @click="closeMessage">×</text>
			</view>
			<view class="one">
				<text>楼层:</text><text>{{item.floor}}</text>
			</view>
			<view class="one">
				<text>座位号:</text><text>{{item.seatCode | substrSeatNum}}</text>
			</view>
			<view class="one">
				<text>座位类型:</text><text>{{Number(item.softHardStatus) | seatType}}</text>
			</view>
			<view class="one">
				<text>容纳人数:</text>
				<text>{{item. numberOfPeople}}人</text>
			</view>
			<view class="one">
				<text>最晚保留时间</text>
				<text>{{item. seatLatestReservationTime}}</text>
			</view>
			<view class="five">
				最低消费
			</view>
			<view class="foot_six">
				<view class="weeks" v-for="(itm,ind) in item.weekPriceList" :key="ind">
					<view class="left">
						<text>{{itm.weekIndex | dayOfWeek}}</text><br />
						<text>{{itm.price | returnFloat}}</text>
					</view>
					<!-- <view class="right">
						<text>最晚保留时间</text><br />
						<text>{{itm.seatLatestReservationTime}}</text>
					</view> -->

				</view>
			</view>
		</view>
		<!-- <view  class="newBottom">
			<view class="goState" @click="batchInc">
			批量配置座位信息
		</view>
		<view class="goState" v-if="!onLineType" @click="goSetState">
			修改座位状态
		</view>
		</view> -->
		
	</view>

</template>

<script>
	export default {
		data() {
			return {
				newStore: false,
				onLineType: true,
				animationFlag: true,
				// 获取座位list
				showbigMessageFlag: true,
				operationFlag: false,
				list: [],
				defaultNowFloor: 0,
				defaultNowFloorName: 1,
				floorName: '',
				width: '200px',
				id: '1308703933015228418', //个人id
				menid: null, //门店id
				show: false, //弹出层
				// 时间
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(2025, 10, 1),
				currentDate: new Date(),
				// 最晚保留时间
				seatLatestReservationTime: null,
				// 人数
				numberOfPeople: null,
				// 每天价格
				shadeFlag: false,
				messageFlag: false,
				messagebgFlag: false, //编辑座位信息
				floorFlag: false, //楼层设置
				floorShadeFlag: false,
				bigFlag: true,
				seatfloor: [],
				storageSeatfloor: [], //存储编辑层数之前数组
				seatcol: 6,
				seatrow: 6,
				x: 6, //行
				y: 6, //列
				getOldArr: [], //请求后台数据的数组的下标数组
				allFloorGetOldArr: [], //请求后台数据的数组
				seatArr: [], //没分割数组
				newArrays: [], //分割后数组
				beforeArrays: [], //存储编辑座位信息之前数组
				seatMessageOk: true, //座位信息确定
				arrFlag: true, //改变排座数组
				reserveBgColor: 2, //预定改变颜色参数
				stageBgColor: 1, //舞台改变颜色参数
				seatStatsNum: null, //配置座位状态某一个
				statsFourFlag: true, //配置座位状态是否禁用
				seatStatusNum: null, //编辑座位信息颜色
				stats: '',
				softHardStatus: '1', //座位类型单选框
				shadebgFlag: false, //座位遮罩层开关
				activeIcon: '../../../static/images/xuanzhong.png',
				inactiveIcon: '../../../static/images/weixuan.png',
				seatCode: '', //座位号
				seatBigArr: [], //单独座位信息
				rowInd: '', //配置座位状态所在行
				colInd: '', //配置座位状态所在列
				seatM: '', //配置座位状态是哪一座位
				bigMessageFlag: false, //配置座位状态是哪一座位信息
				presentMessage: [], //点击有座位信息的赋值数组
				touchStartTime: 0,
				scaleValue: .8,
				scaleValueFlag: true,
				btnOkFlag: true,
				defaultFloorArr: [], // 默认座位数组
				paramsTime: {
					year: false,
					month: false,
					day: false,
					hour: true,
					minute: true,
					second: false
				},
				nowWeek: 0,
				weekPriceList: [{
						id: '',
						weekIndex: 1,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 2,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 3,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 4,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 5,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 6,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 7,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},

				],
				// 清空座位信息
				clearWeekPic: [{
						id: '',
						weekIndex: 1,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 2,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 3,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 4,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 5,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 6,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},
					{
						id: '',
						weekIndex: 7,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime
					},

				],
				seat: function() {
					let that = this;
					this.seatArr = [];
					for (var i = 0; i < that.y; i++) {
						for (var j = 0; j < that.x; j++) {
							// console.log(i, j)
							that.seatArr.push({
								floor: this.defaultNowFloorName,
								floorPower: this.defaultNowFloor,
								minConsumption: '0.1',
								numberOfPeople: 1,
								// seatAttribute: 2,
								seatAttribute: 1,
								seatCode: this.defaultNowFloor + 1 + '-' + (j + 1) + '-' + (i + 1),
								seatColumn: i + 1,
								seatLatestReservationTime: this.seatLatestReservationTime,
								seatRow: j + 1,
								// seatType: 1,
								seatType: 3,
								softHardStatus: '1',
								weekPriceList: [{
										id: '',
										weekIndex: 1,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
									{
										id: '',
										weekIndex: 2,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
									{
										id: '',
										weekIndex: 3,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
									{
										id: '',
										weekIndex: 4,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
									{
										id: '',
										weekIndex: 5,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
									{
										id: '',
										weekIndex: 6,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
									{
										id: '',
										weekIndex: 7,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime,
									},
								],
							})
						}

					}
					this.allFloorGetOldArr[this.defaultNowFloor].layoutList = this.seatArr
					this.allFloorGetOldArr[this.defaultNowFloor].cassettes = this.x + 'x' + this.y
				},
				newSeat: function() {
					this.newArrays = [];
					let arrIndex = 0;
					while (arrIndex < this.seatArr.length) {
						this.newArrays.push(this.seatArr.slice(arrIndex, arrIndex += this.x));
					}
					this.animationFlag = true
				},
				defaultFloorArrfun: function() {
					let that = this
					that.defaultFloorArr = []
					for (var i = 0; i < 6; i++) {
						for (var j = 0; j < 6; j++) {
							// console.log(i, j)
							that.defaultFloorArr.push({
								floor: this.seatfloor.length + 1,
								floorPower: this.seatfloor.length,
								minConsumption: '0.1',
								numberOfPeople: 1,
								// seatAttribute: 2,
								seatAttribute: 1,
								seatCode: this.seatfloor.length + 1 + '-' + (j + 1) + '-' + (i + 1),
								seatColumn: i + 1,
								seatLatestReservationTime: this.seatLatestReservationTime,
								seatRow: j + 1,
								// seatType: 1,
								seatType: 3,
								softHardStatus: '1',
								weekPriceList: [{
										id: '',
										weekIndex: 1,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
									{
										id: '',
										weekIndex: 2,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
									{
										id: '',
										weekIndex: 3,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
									{
										id: '',
										weekIndex: 4,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
									{
										id: '',
										weekIndex: 5,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
									{
										id: '',
										weekIndex: 6,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
									{
										id: '',
										weekIndex: 7,
										price: 0.1,
										storeId: '',
										seatAttribute: '',
										seatLatestReservationTime: this.seatLatestReservationTime
									},
								],
							})
						}
					}
				},
			}
		},
		onLoad() {
			uni.showLoading({
				title: '疯狂加载中',
			})
			this.getBeagainArr()
			this.getonLineType()
		},
		// onPullDownRefresh() {
		// 	if (!this.floorFlag) {
		// 		this.getBeagainArr()
		// 		this.getonLineType()
		// 	} else {
		// 		uni.stopPullDownRefresh()
		// 	}

		// },
		methods: {
			batchInc(){
				console.log(1)
			},
			getonLineType() {
				this.$get("/merchant/store/settled/applyOnlineType")
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.onLineType = res.data.type == 1 ? true : false;
						}
					})
			},
			getBeagainArr() {
				uni.showLoading({
					title: '座位加载中...'
				})
				this.operationFlag = true
				this.$get('/merchant/store/getStoreInfo').then(res => {
					// console.log(res)
					if (res.code == 0) {
						// uni.stopPullDownRefresh()
						this.seatLatestReservationTime = res.data.startTime
						uni.showToast({
							icon: 'success',
							title: '加载成功',
						})
						this.operationFlag = false;
						if (res.data.list.length !== 0) {
							this.list = JSON.parse(JSON.stringify(res.data.list));
							this.seatfloor = JSON.parse(JSON.stringify(res.data.list));
							this.allFloorGetOldArr = res.data.list;
							this.floorName = this.allFloorGetOldArr[this.defaultNowFloor].floor;
							this.getOldArr = this.allFloorGetOldArr[this.defaultNowFloor].layoutList;
							this.menid = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[0].id;
							this.id = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[0].storeId;
							let leng = this.allFloorGetOldArr[this.defaultNowFloor].layoutList.length - 1;
							this.seatrow = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[leng].seatRow;
							this.seatcol = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[leng].seatColumn;
							this.x = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[leng].seatRow;
							this.y = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[leng].seatColumn;
							this.seatArr = this.getOldArr;
							// console.log(this.allFloorGetOldArr)
							this.width = 124 * (this.y + 1) + 'rpx'
							this.newSeat();
							// console.log(this.seatfloor)
						} else {
							console.log(res)
							this.newStore = true;
							this.id = res.data.id;
							this.floorChange();
							this.allFloorGetOldArr = this.seatfloor;
							this.list = JSON.parse(JSON.stringify(this.seatfloor));
							this.width = 124 * (this.y + 1) + 'rpx';
							this.seat();
							this.newSeat();
							uni.hideLoading()
						}
					} else {
						// uni.stopPullDownRefresh()
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
						uni.hideLoading();
					}
				})
			},
			cutInput(ind, e) {
				// console.log(e)
				for (let value of this.seatfloor[ind].layoutList) {
					value.floor = e;
					let newStr = value.seatCode.substr(0, value.seatCode.indexOf('-'))
					value.seatCode = value.seatCode.replace(newStr, e)

				}
				// console.log(this.seatfloor)
			},
			// 楼层输入框失焦
			blurInput(ind, e) {
				console.log(e)
				console.log(this.seatfloor)
				if (e == '') {
					// this.seatfloor[ind].floor = ind+1
					// uni.showToast({
					// 	title: '请输入楼层名字',
					// 	icon: 'none'
					// })
				}
			},
			// 设置楼层
			messageFloor() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}

				if (this.onLineType) {
					uni.showToast({
						icon: 'none',
						title: '请先店铺下线在进行修改'
					})
				} else {
					this.defaultFloorArrfun()
					this.seatfloor.push({
						cassettes: '6x6',
						floor: '',
						floorPower: this.seatfloor.length,
						layoutList: this.defaultFloorArr,
						ktvRoomList: [],
					})
					this.floorFlag = true;
					this.floorShadeFlag = true;
					this.storageSeatfloor = JSON.parse(JSON.stringify(this.seatfloor))
				}
			},
			floorChange(changeE, ind, length) {
				if (changeE == 0) {
					this.seatfloor.splice(ind, 1)
					for (let [index, value] of this.seatfloor.entries()) {
						// console.log(index, value)
						value.floorPower = index
						value.layoutList.forEach(item => {
							item.floorPower = index;
						})
					}
				} else {
					if (this.seatfloor.length != 0) {
						if (this.seatfloor[ind].floor == '') {
							uni.showToast({
								icon: 'none',
								title: '请输入楼层名字'
							})
							return
						}
					}

					if (length > 5) {
						uni.showToast({
							icon: 'none',
							title: '目前最多五层'
						})
						return
					}
					this.defaultFloorArrfun()
					this.seatfloor.push({
						cassettes: '6x6',
						floor: this.newStore ? '1' : '',
						floorPower: this.seatfloor.length,
						layoutList: this.defaultFloorArr,
						ktvRoomList: [],
					})
					this.newStore = false
				}
				// console.log(this.seatfloor)
			},
			// 查看楼层
			cutFloor(ind) {
				if (!this.messageFlag) {
					if (this.floorName === this.list[ind].floor) {
						return
					} else {
						this.floorName = this.list[ind].floor
					}
					this.animationFlag = false
					setTimeout(() => {
						this.defaultNowFloor = ind;
						this.seatArr = this.allFloorGetOldArr[ind].layoutList;
						// console.log(this.seatArr);
						this.x = this.seatArr[this.seatArr.length - 1].seatRow;
						this.seatRow = this.seatArr[this.seatArr.length - 1].seatRow;
						this.y = this.seatArr[this.seatArr.length - 1].seatColumn;
						this.seatColumn = this.seatArr[this.seatArr.length - 1].seatColumn;
						this.seatrow = this.x;
						this.seatcol = this.y;
						this.width = 124 * (this.y + 1) + 'rpx'

						this.newSeat()
					}, 500)

				} else {
					uni.showToast({
						icon: 'none',
						title: '请配置当前楼层座位状态'
					})
				}

			},
			// 弹出层
			showPopup() {
				this.show = true;
			},
			//确定时间
			confirms(value) {
				this.seatLatestReservationTime = value.hour + ':' + value.minute
				// this.weekPriceList[this.nowWeek].seatLatestReservationTime = value.hour + ':' + value.minute
				this.show = false;
			},
			// 取消时间
			cancelTime() {
				this.show = false;
			},
			inpTime(e) {
				// console.log(e)
				this.nowWeek = e
				this.show = true;
				uni.hideKeyboard()
			},
			// 场地布局
			shade() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				if (this.onLineType) {
					uni.showToast({
						icon: 'none',
						title: '请先店铺下线在进行修改'
					})
				} else {
					this.shadeFlag = true;
					this.defaultNowFloorName = this.seatArr[Symbol.iterator]().next().value.floor
				}

			},
			// 场地布局取消
			cancel() {
				this.seatrow = Number(this.x);
				this.seatcol = Number(this.y);
				// this.seatfloor = this.storageSeatfloor
				// this.seatfloor.splice(this.seatfloor.length-1,1)
				this.shadeFlag = false;
				this.floorFlag = false;
				this.floorShadeFlag = false
			},
			// 设置楼层取消
			setFloorcancel() {
				this.seatrow = Number(this.x);
				this.seatcol = Number(this.y);
				this.seatfloor = this.storageSeatfloor
				this.seatfloor.splice(this.seatfloor.length - 1, 1)
				this.shadeFlag = false;
				this.floorFlag = false;
				this.floorShadeFlag = false
			},
			// 座位背景颜色开关
			color(e) {
				// console.log(e)
				if (e == 4 || e == 3) {
					this.stageBgColor = e
					this.reserveBgColor = 1
				} else {
					this.reserveBgColor = e
					this.stageBgColor = 1
				}
			},
			// 最开始的数组
			pleaseSit(num, nums) {
				if (this.newArrays[num][nums].seatType != 4) {
					this.presentMessage = [this.newArrays[num][nums]]
					this.shadebgFlag = true
					this.bigMessageFlag = true
				} else {
					uni.showToast({
						title: '这是舞台',
						icon: 'none'
					})
				}
			},
			newNumber(num, nums) {
				let seatM = (num) * this.x + nums + 1
				// console.log(seatM)
				this.newArrays[num][nums].seatAttribute = this.reserveBgColor
				this.newArrays[num][nums].seatType = this.stageBgColor
			},
			// 配置座位状态具体值
			sitStatus(num, nums) {
				if (!this.shadebgFlag) {
					if (this.newArrays[num][nums].seatAttribute == 16 || this.newArrays[num][nums].seatAttribute == 1 || this.newArrays[
							num][nums].seatAttribute == 2) {
						let index = this.newArrays[num][nums].seatCode.indexOf('-')
						this.seatCode = this.newArrays[num][nums].seatCode.substr(index + 1);
						this.numberOfPeople = this.newArrays[num][nums].numberOfPeople;
						this.softHardStatus = this.newArrays[num][nums].softHardStatus;
						this.seatLatestReservationTime = this.newArrays[num][nums].seatLatestReservationTime;
						this.weekPriceList = this.newArrays[num][nums].weekPriceList;
						this.seatStatsNum = num + '_' + nums;
						this.rowInd = num;
						this.colInd = nums;
						let seatMs = (num) * this.x + nums + 1;
						this.seatM = seatMs;
						this.bigFlag = false;
						this.showbigMessageFlag = false
					}
				} else {
					if (this.newArrays[num][nums].seatType != 4) {
						this.presentMessage = [this.newArrays[num][nums]]
						this.shadebgFlag = true
						this.bigMessageFlag = true
					} else {
						uni.showToast({
							title: '这是舞台',
							icon: 'none'
						})
					}
				}
			},
			// 价格至少为0.1
			changePrice(ind, e) {
				console.log(e)
				if (e == '' || e < 0.1) {
					this.weekPriceList[ind].price = 0.1
					uni.showToast({
						title: '最低消费为0.1',
						icon: 'none'
					})
				}
			},
			closeMessage() {
				this.bigMessageFlag = false
			},
			// 场地布局确定
			confirm() {
				// console.log(this.newArrays,this.defaultNowFloor)
				if (!this.seatcol || !this.seatrow) {
					uni.showToast({
						title: '请输入内容',
						icon: 'none'
					})
					return
				}
				this.seatcol = Number(this.seatcol) >= 20 ? 20 : this.seatcol
				this.seatrow = Number(this.seatrow) >= 20 ? 20 : this.seatrow
				this.seatcol = Number(this.seatcol) <= 6 ? 6 : this.seatcol
				this.seatrow = Number(this.seatrow) <= 6 ? 6 : this.seatrow
				this.x = Number(this.seatrow);
				this.y = Number(this.seatcol);
				this.width = 124 * (this.y + 1) + 'rpx';
				this.seat();
				this.newSeat()
				this.shadeFlag = false;
			},
			// 楼层取消
			floorcancel() {
				this.floorFlag = false;
				this.floorShadeFlag = false;
				this.seatfloor = this.storageSeatfloor
				this.seatfloor.splice(this.seatfloor.length - 1, 1)
			},
			// 楼层确定
			floorConfirm() {
				uni.showLoading({
					title: '正在保存'
				})
				console.log(this.seatfloor)
				if (this.seatfloor.length == 1) {
					uni.showToast({
						title: '楼层不可以被删完哦!!!',
						icon: 'none'
					})
					return
				}
				for (let i = 0; i < this.seatfloor.length - 1; i++) {
					if (this.seatfloor[i].floor == '') {
						uni.showToast({
							title: '请补全楼层名字',
							icon: 'none'
						})
						return
					}
				}
				this.operationFlag = true
				let id = this.id;
				// this.seatfloor.splice(this.seatfloor.length-1,1)
				let list = JSON.parse(JSON.stringify(this.seatfloor))
				list.splice(list.length - 1, 1)
				let data = {
					id,
					list
				};
				this.$put('/merchant/store/appUpdate', data)
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.floorFlag = false;
							this.floorShadeFlag = false;
							this.list = JSON.parse(JSON.stringify(data.list));
							this.allFloorGetOldArr = data.list;
							this.defaultNowFloor = 0
							this.animationFlag = false
							this.getBeagainArr()
							this.operationFlag = false
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
							this.operationFlag = false
						}
					})
			},
			// 座位状态
			message() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				if (this.onLineType) {
					uni.showToast({
						icon: 'none',
						title: '请先店铺下线在进行修改'
					})
				} else {
					this.seatMessageOk = true;
					this.messageFlag = true;
					this.arrFlag = false;
					this.shadebgFlag = true;
					this.messagebgFlag = false;
					this.statsFourFlag = true;
					this.btnOkFlag = true;
					// 存储之前数组
					this.beforeArrays = JSON.parse(JSON.stringify(this.newArrays))
				}
			},
			// 座位状态取消
			cancel1() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.seatMessageOk = false;
				this.messageFlag = false;
				this.newArrays = this.beforeArrays;
				let newArr = [];
				for (let i = 0; i < this.newArrays.length; i++) {
					newArr = newArr.concat(this.newArrays[i])
				}
				this.allFloorGetOldArr[this.defaultNowFloor].layoutList = newArr
			},
			// 座位状态确定
			confirm1() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.seatMessageOk = false;
				this.messageFlag = false;
				this.beforeArrays = this.newArrays;
				this.goConfirm();
			},
			// 配置座位信息
			stateFlag() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				if (this.onLineType) {
					uni.showToast({
						icon: 'none',
						title: '请先店铺下线在进行修改'
					})
				} else {
					this.messagebgFlag = true;
					this.shadebgFlag = false;
					this.seatMessageOk = false;
					this.arrFlag = false;
					this.btnOkFlag = false;
				}
			},
			// 取消
			// 配置座位信息
			stateFalse() {
				// console.log(
				this.bigFlag = true
				this.numberOfPeople = null;
				seatLatestReservationTime: this.seatLatestReservationTime
				this.weekPriceList = this.clearWeekPic;
				this.showbigMessageFlag = true
			},
			// 确定
			// 配置座位信息
			stateOk() {
				let weekFlag = true
				for (var i = 0; i < this.weekPriceList.length; i++) {
					if (this.weekPriceList[i].seatLatestReservationTime == '') {
						weekFlag = false
					}
				}
				console.log(this.weekPriceList)
				if (this.seatCode == null) {
					uni.showToast({
						title: "请填写座位号",
						icon: 'none'
					})
					return
				}
				if (this.numberOfPeople == null) {
					uni.showToast({
						title: "请填写容纳人数",
						icon: 'none'
					})
					return
				}
				// if (this.seatLatestReservationTime == null) {
				// 	uni.showToast({
				// 		title: "请选择最晚保留时间",
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				// if (!weekFlag) {
				// 	uni.showToast({
				// 		title: "请选择最晚保留时间",
				// 		icon: 'none'
				// 	})
				// 	return
				// }
				this.showbigMessageFlag = true
				this.seatBigArr = [{
					seatCode: this.seatCode,
					softHardStatus: this.softHardStatus == '1' ? '卡座' :this.softHardStatus == '2'? '散台':'独立高脚凳',
					numberOfPeople: this.numberOfPeople,
					seatLatestReservationTime: this.seatLatestReservationTime,
					weekPriceList: this.weekPriceList,
				}]
				// 提交数据
				let getArr = this.allFloorGetOldArr[this.defaultNowFloor].layoutList
				getArr[this.seatM - 1].seatCode = this.allFloorGetOldArr[this.defaultNowFloor].floor + '-' + this.seatCode; //座位号
				getArr[this.seatM - 1].numberOfPeople = this.numberOfPeople; //容纳人数
				getArr[this.seatM - 1].softHardStatus = this.softHardStatus; //卡座散台
				getArr[this.seatM - 1].seatLatestReservationTime = this.seatLatestReservationTime, //座位保留最晚时间
					getArr[this.seatM - 1].weekPriceList = this.weekPriceList; //一周价格
				this.allFloorGetOldArr[this.defaultNowFloor].layoutList = getArr;
				this.newSeat();
				this.bigFlag = true;
				this.numberOfPeople = null;
				seatLatestReservationTime: this.seatLatestReservationTime
				this.weekPriceList = [{
						id: '',
						weekIndex: 1,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
					{
						id: '',
						weekIndex: 2,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
					{
						id: '',
						weekIndex: 3,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
					{
						id: '',
						weekIndex: 4,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
					{
						id: '',
						weekIndex: 5,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
					{
						id: '',
						weekIndex: 6,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
					{
						id: '',
						weekIndex: 7,
						price: 0.1,
						storeId: '',
						seatAttribute: '',
						seatLatestReservationTime: this.seatLatestReservationTime,
					},
				]
				// console.log(this.weekPriceList, this.clearWeekPic)
			},
			// 双击事件
			dblclick: function(e) {
				//console.log(new Date().getTime())
				if (this.touchStartTime == 0) {
					this.touchStartTime = new Date().getTime()
				} else {
					if (+new Date() - this.touchStartTime <= 300 && this.scaleValueFlag) {
						this.scaleValueFlag = !this.scaleValueFlag
						this.scaleValue = 1.5
					} else {
						this.scaleValueFlag = !this.scaleValueFlag
						this.scaleValue = 0.8
						// console.log(this.scaleValue)
					}
					this.touchStartTime = 0
				}

			},
			// 全部保存
			goConfirm() {
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				this.operationFlag = true
				uni.showLoading({
					title: '正在保存'
				})
				this.seatArr.map(item => {
					if (item.weekPriceList.length == 0) {
						item.weekPriceList = this.clearWeekPic
					}

				})
				for (let value of this.allFloorGetOldArr) {
					value.layoutList.map(item => {
						if (item.weekPriceList.length == 0) {
							item.weekPriceList = this.clearWeekPic
						}
					})
				}
				let list = this.allFloorGetOldArr;
				let id = this.id;
				let data = {
					id,
					list
				};
				// console.log(data)
				this.$put('/merchant/store/appUpdate', data).then(res => {
					// console.log(res)
					if (res.code == 0) {
						this.btnOkFlag = true;
						this.shadebgFlag = true;
						this.operationFlag = false;
						this.getBeagainArr()
					} else {
						this.operationFlag = false;
						uni.showToast({
							icon: 'none',
							title: res.msg
						})
					}
				})
			},
			// 上线店铺修改座位状态
			goSetState(){
				if(this.$store.state.auth < 1){
					uni.showToast({
						icon: 'none',
						title: '暂无权限'
					})
					return
				}
				uni.navigateTo({
					url:"./setState"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.newBottom{
		display: flex;
	}
	.batch{
		width: 200rpx;
		height: 100rpx;
		border: 1px solid #4CD964;
		text-align: center;
		line-height: 100rpx;
	}
	.goState{
		width: 342rpx;
		height: 100rpx;
		border: 1px solid #67A8FC;
		text-align: center;
		line-height: 100rpx;
		font-size: 32rpx;
		border-radius: 18rpx;
		margin: 40rpx auto;
		background-color: #fff;
	}
	@-webkit-keyframes fadeOutLeft {
		0% {
			opacity: 1;
			-webkit-transform: scale(1)
		}

		100% {
			opacity: 0;
			-webkit-transform: scale(.5)
		}
	}

	@-moz-keyframes fadeOutLeft {
		0% {
			opacity: 1;
			-moz-transform: scale(1)
		}

		100% {
			opacity: 0;
			-moz-transform: scale(.5)
		}
	}

	@-webkit-keyframes fadeOutLefts {
		0% {
			opacity: 0;
			-webkit-transform: scale(1)
		}

		100% {
			opacity: 1;
			-webkit-transform: scale(1)
		}
	}

	@-moz-keyframes fadeOutLefts {
		0% {
			opacity: 0;
			-moz-transform: scale(1)
		}

		100% {
			opacity: 1;
			-moz-transform: scale(1)
		}
	}

	uni-page-body {
		height: 100%;
	}

	.floorInp {
		width: 380rpx;
		height: 84rpx;
		border: 1px solid #ccc;
		border-radius: 15rpx;
		padding-left: 14rpx;
		margin-top: 14rpx;
		margin-bottom: 10rpx;
		margin-right: 24rpx;

		&:last-child {
			margin-bottom: 24rpx;
		}
	}

	.floor-add {
		width: 48rpx;
		height: 48rpx;
		border: 1px solid #ccc;
		border-radius: 10rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 44rpx;
		font-weight: 600;
		color: #ccc;
	}

	.seatMessage {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.has-navBar {
		height: 170rpx;
		display: flex;
		justify-content: space-around;
		box-shadow: 0 0 0 5rpx #f1f1f1;
		box-sizing: initial;
		align-items: center;

		.btn1 {
			width: 342rpx;
			height: 106rpx;
			text-align: center;
			line-height: 106rpx;
			border-radius: 14rpx;
			background-color: #67A8FC;
			color: #fff;
			font-size: 32rpx;
		}

		.cancelbtn1 {
			width: 342rpx;
			height: 106rpx;
			text-align: center;
			line-height: 106rpx;
			border-radius: 14rpx;
			background-color: #fff;
			color: #000;
			border: 1px solid #67A8FC;
			font-size: 32rpx;
		}

		.cancelbtn2 {
			width: 342rpx;
			height: 106rpx;
			text-align: center;
			line-height: 106rpx;
			border-radius: 14rpx;
			background-color: #67A8FC;
			color: #fff;
			font-size: 32rpx;
			margin: 0;
		}

		.active {
			width: 342rpx;
			height: 106rpx;
			text-align: center;
			line-height: 106rpx;
			border-radius: 14rpx;
			background-color: #67A8FC;
			opacity: 0.5;
			color: #fff;
			font-size: 32rpx;
		}

	}

	.header {
		width: 680rpx;
		height: 116rpx;
		margin: 0 auto;
		display: flex;
		justify-content: space-around;
		align-items: center;

		.left {
			display: flex;
			align-items: top;

			text {
				&:nth-child(1) {
					font-size: 32rpx;
				}

				&:nth-child(2) {
					display: inline-block;
					width: 48rpx;
					height: 48rpx;
					border: 1px solid #CCCCCC;
					border-radius: 15rpx;
					margin-left: 12rpx;
				}
			}
		}

		.middle {
			display: flex;
			align-items: top;

			text {
				&:nth-child(1) {
					font-size: 32rpx;
				}

				&:nth-child(2) {
					display: inline-block;
					width: 48rpx;
					height: 48rpx;
					background-color: #e6a23c;
					border-radius: 15rpx;
					margin-left: 12rpx;
				}
			}
		}

		.passage {
			display: flex;
			align-items: top;

			text {
				&:nth-child(1) {
					font-size: 32rpx;
				}

				&:nth-child(2) {
					display: inline-block;
					width: 48rpx;
					height: 48rpx;
					background-color: #999;
					border-radius: 15rpx;
					margin-left: 12rpx;
				}
			}
		}

		.right {
			display: flex;
			align-items: top;

			text {
				&:nth-child(1) {
					font-size: 32rpx;
				}

				&:nth-child(2) {
					display: inline-block;
					width: 48rpx;
					height: 48rpx;
					background-color: #008000;
					border-radius: 15rpx;
					margin-left: 12rpx;
				}
			}
		}
	}

	.room-list-wrap {
		height: 750rpx;
		background-color: #F7F7F7;
		border: 1px solid #fff;
		box-sizing: border-box;
		position: relative;
		width: 100%;

		.details_row {
			// display: flex;
			// justify-content: space-around;
			display: inline-block;

			.details_col {
				// display: inline-block;
				width: 72rpx;
				height: 72rpx;
				border-radius: 15rpx;
				margin-bottom: 40rpx;
				margin-left: 40rpx;
			}
		}

		-webkit-animation: fadeOutLeft 1s .2s ease both;
		-moz-animation: fadeOutLeft 1s .2s ease both;
	}

	.details {
		height: 750rpx;
		background-color: #F7F7F7;
		border: 1px solid #fff;
		box-sizing: border-box;
		position: relative;
		width: 100%;
		-webkit-animation: fadeOutLefts .2s .2s ease both;
		-moz-animation: fadeOutLefts .2s .2s ease both;

		.details_row {
			// display: flex;
			// justify-content: space-around;
			display: inline-block;

			.details_col {
				// display: inline-block;
				width: 72rpx;
				height: 72rpx;
				border-radius: 15rpx;
				margin-bottom: 40rpx;
				margin-left: 40rpx;
			}
		}
	}

	uni-movable-view {
		height: 100%;
		// padding: 56rpx 0;
	}

	.floor-shade {
		width: 550rpx;
		min-height: 360rpx;
		background-color: #fff;
		padding: 40rpx 48rpx 48rpx 48rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 372rpx;
		right: 0;
		margin: auto;
		z-index: 988;
		border-radius: 8rpx;

		.bottom {
			display: flex;
			justify-content: center;

			.bt1 {
				width: 200rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				background-color: #fff;
				margin-right: 54rpx;
				border: 1px solid #ccc;
			}

			.bt2 {
				width: 200rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				background-color: #67A8FC;
				color: #fff;
			}
		}
	}

	.floor-name {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		margin: 0 auto;

		.specific-name {
			width: 216rpx;
			height: 82rpx;
			text-align: center;
			line-height: 82rpx;
			font-size: 32rpx;
			background-color: #fff;
			border: 2rpx solid #67A8FC;
			border-radius: 16rpx;
			margin: 0 0 24rpx 24rpx;
		}
	}

	.footer {
		width: 242rpx;
		height: 100rpx;
		border: 1px solid #67A8FC;
		text-align: center;
		line-height: 100rpx;
		font-size: 32rpx;
		border-radius: 18rpx;
		margin: 40rpx auto;
		background-color: #fff;
		padding: 0;
	}

	.shade {
		width: 550rpx;
		height: 360rpx;
		background-color: #fff;
		padding: 40rpx 48rpx 48rpx 48rpx;
		box-sizing: border-box;
		position: absolute;
		left: 0;
		top: 372rpx;
		right: 0;
		margin: auto;
		z-index: 988;
		border-radius: 8rpx;

		.top {
			display: flex;
			justify-content: space-around;
			flex-wrap: nowrap;

			text {
				font-size: 32rpx;
			}
		}

		.middle {
			display: flex;
			align-items: center;
			justify-content: space-around;
			padding: 24rpx 40rpx 28rpx;
			box-sizing: border-box;

			input {
				width: 96rpx;
				height: 96rpx;
				text-align: center;
				line-height: 96rpx;
				font-size: 36rpx;
				border: 1px solid #999;
				border-radius: 10rpx;
			}
		}

		.bottom {
			display: flex;
			justify-content: center;

			.bt1 {
				width: 200rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				background-color: #fff;
				margin-right: 54rpx;
				border: 1px solid #ccc;
			}

			.bt2 {
				width: 200rpx;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
				font-size: 28rpx;
				border-radius: 10rpx;
				background-color: #67A8FC;
				color: #fff;
			}
		}
	}

	.bigBox {
		padding: 108rpx 48rpx 124rpx 48rpx;

		.one {
			width: 110rpx;
			height: 70rpx;
			border-radius: 15rpx;
			border: 1px solid #67A8FC;
			font-size: 32rpx;
			text-align: center;
			line-height: 70rpx;
			display: inline-block;
			margin-left: 24rpx;
			vertical-align: middle;
		}

		.two {
			font-size: 32rpx;
			margin-top: 48rpx;
			display: flex;

			.img-icon {
				width: 28rpx;
				height: 28rpx;
				margin-right: 12rpx;
			}
		}
		.other-two{
			margin-left: 152rpx;
			margin-top: 24rpx;
			.img-icon {
				width: 28rpx;
				height: 28rpx;
				margin-right: 12rpx;
				vertical-align: middle;
			}
		}
		.three {
			display: flex;
			margin-top: 46rpx;

			.three_after {
				width: 140rpx;
				display: flex;
				border: 1px solid #67A8FC;
				border-radius: 10rpx 12rpx 12rpx 10rpx;
				width: 184rpx;
				height: 56rpx;
				margin-left: 24rpx;

				input {
					line-height: 56rpx;
					font-size: 32rpx;
					padding-left: 8rpx;
					box-sizing: border-box;
					height: 100%;
					width: 100%;
				}

				&::after {
					display: inline-block;
					content: "人";
					font-size: 32rpx;
					border-radius: 0 10rpx 10rpx 0;
					background-color: #67A8FC;
					text-align: center;
					line-height: 56rpx;
					color: #fff;
					padding: 0 10rpx;
					box-sizing: border-box;
				}
			}

		}

		.four {
			font-size: 32rpx;
			display: flex;
			margin-top: 48rpx;
			align-items: center;
			margin-bottom: 48rpx;

			text {
				font-size: 32rpx;
			}

			input {
				width: 184rpx;
				height: 70rpx;
				border-radius: 10rpx;
				border: 1px solid #007AFF;
				margin-left: 24rpx;
				font-size: 32rpx;
			}
		}

		input {
			text-align: center;
		}

		.five_text {
			font-size: 32rpx;
			display: inline-block;
			margin-top: 36rpx;
		}

		.five {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			padding-bottom: 50rpx;

			.funday {
				width: 100%;
				height: 150rpx;
				border-radius: 15rpx;
				border: 1px solid #67A8FC;
				padding: 16rpx 0 0 64rpx;
				box-sizing: border-box;
				margin-top: 32rpx;
				display: flex;

				.left {
					width: 50%;

					text {
						font-size: 28rpx;
						display: inline-block;
						margin-bottom: 20rpx;
					}

					input {
						font-size: 32rpx;
						display: inline-block;
						width: 218rpx;
						height: 60rpx;
						border-radius: 17rpx;
						text-align: center;
						line-height: 60rpx;
						background-color: #f7f7f7;
					}
				}

				.right {
					width: 50%;

					text {
						font-size: 28rpx;
						display: inline-block;
						width: 218rpx;
						text-align: center;
						margin-bottom: 20rpx;
					}

					input {
						font-size: 32rpx;
						display: inline-block;
						width: 218rpx;
						height: 60rpx;
						border-radius: 17rpx;
						text-align: center;
						line-height: 60rpx;
						background-color: #f7f7f7;
					}
				}


			}
		}

		.foot_bootom {
			font-size: 32rpx;
			display: flex;
			justify-content: space-between;
			height: 96rpx;
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;

			.cancelbtn {
				height: 96rpx;
				text-align: center;
				line-height: 96rpx;
				color: #000;
				width: 50%;
				border-radius: 0rpx;
				box-shadow: 0 0 8rpx 0 #f1f1f1;
				background-color: #fff;
			}

			.comfimbtn {
				height: 96rpx;
				text-align: center;
				line-height: 96rpx;
				color: #fff;
				width: 50%;
				background-color: #67A8FC;
				border-radius: 0rpx;
			}
		}
	}

	.bg {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .1);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 987;
	}

	.bgm {
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, .1);
		position: fixed;
		left: 0;
		top: 0;
		z-index: 987;
	}

	.select {
		width: 552rpx;
		height: 112rpx;
		border-radius: 15rpx;
		border: 1px solid #67A8FC;
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin: 0 auto;

		text {
			&:nth-child(1) {
				font-size: 32rpx;
			}

			&:nth-child(2) {
				display: inline-block;
				width: 48rpx;
				height: 48rpx;
				border: 1px solid #CCCCCC;
				border-radius: 15rpx;
			}

			&:nth-child(3) {
				display: inline-block;
				width: 48rpx;
				height: 48rpx;
				background-color: #e6a23c;
				border-radius: 15rpx;
			}

			&:nth-child(4) {
				display: inline-block;
				width: 48rpx;
				height: 48rpx;
				background-color: #999;
				border-radius: 15rpx;
			}

			&:nth-child(5) {
				display: inline-block;
				width: 48rpx;
				height: 48rpx;
				background-color: #008000;
				border-radius: 15rpx;
			}
		}
	}

	.select_btn {
		display: flex;
		justify-content: space-between;
		margin-top: 40rpx;
		padding-bottom: 100rpx;

		.bt1 {
			width: 200rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 28rpx;
			border-radius: 10rpx;
			background-color: #fff;
			border: 1px solid #ccc;
			margin-left: 100rpx;
		}

		.bt2 {
			width: 200rpx;
			height: 80rpx;
			text-align: center;
			line-height: 80rpx;
			font-size: 28rpx;
			border-radius: 10rpx;
			background-color: #67A8FC;
			color: #fff;
		}
	}

	.bigMessage {
		position: absolute;
		top: 86rpx;
		left: 0;
		right: 0;
		margin: auto;
		width: 718rpx;
		height: 1900rpx;
		// height: 1804rpx;
		padding: 24rpx 24rpx 0 24rpx;
		background-color: #fff;
		font-size: 36rpx;
		letter-spacing: 3rpx;
		border-radius: 10rpx;
		z-index: 988;

		.top {
			text-align: left;
			margin-bottom: 44rpx;
			position: relative;

			text {
				&:nth-child(2) {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
					text-align: center;
					line-height: 32rpx;
					color: #ccc;
					border: 1px solid #ccc;
					border-radius: 50%;
					position: absolute;
					top: 5rpx;
					right: 10rpx;
					padding-left: 2rpx;
				}
			}
		}

		.one {
			// display: flex;
			margin-bottom: 42rpx;

			text {

				&:nth-child(1) {
					display: inline-block;
					width: 35%;
					text-align: left;
					// margin-left: -22rpx;
				}

				&:nth-child(2) {
					display: inline-blocks;
					width: 50%;
					text-align: left;
					margin-left: 40rpx;
				}
			}
		}

		.five {
			text-align: left;
			margin-bottom: 22rpx;
		}

		.foot_six {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;

			.weeks {
				width: 100%;
				height: 150rpx;
				border: 1px solid #67A8FC;
				border-radius: 10rpx;
				padding: 8rpx 0 16rpx 64rpx;
				margin-bottom: 24rpx;
				display: flex;

				.left {
					width: 50%;

					text {
						&:nth-child(1) {
							font-size: 28rpx;
							display: inline-block;
							margin-bottom: 20rpx;
						}

						&:nth-child(3) {
							margin-top: 4rpx;
							font-size: 32rpx;
							display: inline-block;
							width: 218rpx;
							height: 60rpx;
							border-radius: 17rpx;
							text-align: center;
							line-height: 60rpx;
							background-color: #f7f7f7;
						}
					}
				}

				.right {
					width: 50%;

					text {
						&:nth-child(1) {
							font-size: 28rpx;
							display: inline-block;
							margin-bottom: 20rpx;
						}

						&:nth-child(3) {
							margin-top: 4rpx;
							font-size: 32rpx;
							display: inline-block;
							width: 218rpx;
							height: 60rpx;
							border-radius: 17rpx;
							text-align: center;
							line-height: 60rpx;
							background-color: #f7f7f7;
						}
					}
				}

			}
		}
	}

	.acbg1 {
		display: inline-block;
		width: 72rpx;
		height: 72rpx;
		border-radius: 15rpx;
		background-color: #fff;
		border: 1px solid #f1f1f1;
		margin-bottom: 40rpx;
	}

	.acbg2 {
		display: inline-block;
		width: 72rpx;
		height: 72rpx;
		border-radius: 15rpx;
		background-color: #e6a23c;
		border: 1px solid #f1f1f1;
		margin-bottom: 40rpx;
	}

	.acbg3 {
		display: inline-block;
		width: 72rpx;
		height: 72rpx;
		border-radius: 15rpx;
		background-color: #008000;
		border: 1px solid #f1f1f1;
		margin-bottom: 40rpx;
	}

	.acbg4 {
		display: inline-block;
		width: 72rpx;
		height: 72rpx;
		border-radius: 15rpx;
		background-color: #f7f7f7;
		border: 1px solid #B3D3FD;
		margin-bottom: 40rpx;
	}

	.acbg5 {
		display: inline-block;
		width: 72rpx;
		height: 72rpx;
		border-radius: 15rpx;
		background-color: #999;
		border: 1px solid #f1f1f1;
		margin-bottom: 40rpx;
	}

	uni-page-body {
		width: 100%;
		height: 100%;
	}

	.operationBg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background-color: #fff;
		opacity: 0;
		z-index: 989;
	}
</style>

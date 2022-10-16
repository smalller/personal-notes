<template>
	<view class="seatMessage">
		<navBar :navigateUrl="'./seatMessage'">座位状态</navBar>
		<view v-show="bigFlag" style="padding: 88rpx 0 40rpx 0;">
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
			<view style="display: flex;">
				<view class="reserved">
					<text>已预定</text><text></text>
				</view>
				<view class="mostRight">
					<text>禁用</text><text></text>
				</view>
				
			</view>

			<view :class="[animationFlag?'details':'room-list-wrap']">
				<movable-area style="width: 100%;height: 704rpx;overflow: hidden;box-sizing: border-box;margin: 40rpx auto 0;">
					<movable-view :style="{'width':width,'height':'auto','margin-top':30+'rpx','text-align':'center'}" direction="all"
					 inertia="true" out-of-bounds="true" scale="true" scale-min=0.2 scale-max=2 :scale-value=scaleValue :animation="false">
						<view v-for="(item,index) in newArrays" :key="index" class="details_row" v-if="arrFlag" @click="dblclick">
							<view class="details_col" v-for="(itm,ind) in item" :key="ind">
								<text v-bind:class="[itm.seatType==4?'acbg3':itm.seatType==3?'acbg5':itm.seatAttribute==2?'acbg1':itm.seatAttribute==1?'acbg2':itm.seatAttribute==0?'acbg4':itm.seatAttribute==3||4?'acbg6':'']"
								 @click="pleaseSit(itm.seatCode,itm.seatAttribute)">
								 <!-- {{itm.seatCode}} -->
								 </text>
							</view>
						</view>
						<!-- 	<view v-for="(item,index) in newArrays" :key="index" class="details_row" v-if="!arrFlag" @click="dblclick">
							<view v-for="(itm,ind) in item" :key="ind" class="details_col">
								<text v-bind:class="[itm.seatType==4?'acbg3':itm.seatType==3?'acbg5':itm.seatAttribute==2?'acbg1':itm.seatAttribute==1?'acbg2':itm.seatAttribute==16?'acbg4':'']"
								 @click.stop="sitStatus(index,ind)" v-if="!seatMessageOk" v-bind:style="{'border':index+'_'+ind==seatStatsNum?'1px solid #67A8FC':''}"></text>
								<text v-bind:class="[itm.seatType==4?'acbg3':itm.seatType==3?'acbg5':itm.seatAttribute==2?'acbg1':itm.seatAttribute==1?'acbg2':itm.seatAttribute==16?'acbg4':'']"
								 @click.stop="newNumber(index,ind)" v-else v-bind:style="{'border':index+'_'+ind==seatStatsNum?'1px solid #67A8FC':''}"></text>
							</view>
						</view> -->
					</movable-view>
				</movable-area>
			</view>
		</view>
		<view class="floor-name" v-if="!bigMessageFlag" v-show="showbigMessageFlag">
			<view class="specific-name" v-for="(item,index) in list" :key="index" :style="{'backgroundColor':index==defaultNowFloor?'rgba(179,211,253,.3)':'#fff'}"
			 @click="cutFloor(index)">{{item.floor}}</view>
		</view>
		<u-modal v-model="modalShow" :content="content" :show-cancel-button="true" @confirm="confirm"></u-modal>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				modalShow: false,
				content: '确认修改吗？',
				seatAttribute: '',
				nowSeat: '',
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
				menid: null, //门店id
				show: false, //弹出层
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
				seatCode: '', //座位号
				rowInd: '', //配置座位状态所在行
				colInd: '', //配置座位状态所在列
				seatM: '', //配置座位状态是哪一座位
				bigMessageFlag: false, //配置座位状态是哪一座位信息
				presentMessage: [], //点击有座位信息的赋值数组
				touchStartTime: 0,
				scaleValue: .8,
				scaleValueFlag: true,
				defaultFloorArr: [], // 默认座位数组
				seat: function() {
					let that = this;
					this.seatArr = [];
					for (var i = 0; i < that.y; i++) {
						for (var j = 0; j < that.x; j++) {
							that.seatArr.push({
								floor: this.defaultNowFloorName,
								floorPower: this.defaultNowFloor,
								minConsumption: '0.1',
								numberOfPeople: 1,
								seatAttribute: 2,
								seatCode: this.defaultNowFloor + 1 + '-' + (j + 1) + '-' + (i + 1),
								seatColumn: i + 1,
								seatLatestReservationTime: this.seatLatestReservationTime,
								seatRow: j + 1,
								seatType: 1,
								softHardStatus: '1',
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
								seatAttribute: 2,
								seatCode: this.seatfloor.length + 1 + '-' + (j + 1) + '-' + (i + 1),
								seatColumn: i + 1,
								seatLatestReservationTime: this.seatLatestReservationTime,
								seatRow: j + 1,
								seatType: 1,
								softHardStatus: '1',
							})
						}
					}
				},
			}
		},
		
		watch: {
			watchOnloadOrder: {
				handler(val) {
					this.getBeagainArr();
				},
				deep: true
			}
		},
	
		computed: {
			watchOnloadOrder() {
				return this.$store.state.onloadOrder;
			}
		},
		
		onLoad() {
			uni.showLoading({
				title: '疯狂加载中',
			})
			this.getBeagainArr()
			this.getonLineType()
		},
		methods: {
			getonLineType() {
				this.$get("/merchant/store/settled/applyOnlineType")
					.then(res => {
						console.log(res)
						if (res.code == 0) {
							this.onLineType = res.data.type == 1 ? true : false;
						}
					})
			},
			getBeagainArr(e) {
				uni.showLoading({
					title: '座位加载中...'
				})
				this.operationFlag = true
				let data = {
					floor: e
				}
				this.$post('/merchant/store/getStoreSeat', data).then(res => {
					// console.log(res)
					if (res.code == 0) {
						// uni.stopPullDownRefresh()
						// this.seatLatestReservationTime = res.data.startTime
						uni.showToast({
							icon: 'success',
							title: '加载成功',
						})
						this.operationFlag = false;
						if (res.data.storeSeatFloorDTOS.length !== 0) {
							this.list = JSON.parse(JSON.stringify(res.data.storeSeatFloorDTOS));
							this.seatfloor = JSON.parse(JSON.stringify(res.data.storeSeatFloorDTOS));
							this.allFloorGetOldArr = res.data.storeSeatDTOS;
							this.floorName = res.data.storeSeatFloorDTOS[this.defaultNowFloor].floor;
							this.getOldArr = this.allFloorGetOldArr;
							// this.menid = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[0].id;
							// this.id = this.allFloorGetOldArr[this.defaultNowFloor].layoutList[0].storeId;
							let leng = this.allFloorGetOldArr.length - 1;
							this.seatrow = this.allFloorGetOldArr[leng].seatRow;
							this.seatcol = this.allFloorGetOldArr[leng].seatColumn;
							this.x = this.allFloorGetOldArr[leng].seatRow;
							this.y = this.allFloorGetOldArr[leng].seatColumn;
							this.seatArr = this.getOldArr;
							this.width = 124 * (this.y + 1) + 'rpx'
							this.newSeat();
						} else {
							console.log(res)
							this.newStore = true;
							this.id = res.data.id;
							// this.floorChange();
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
			// 查看楼层
			cutFloor(ind) {
				if (!this.messageFlag) {
					if (this.floorName === this.list[ind].floor) {
						return
					} else {
						this.floorName = this.list[ind].floor
					}
					this.animationFlag = false
					this.getBeagainArr(this.list[ind].floor)
					this.defaultNowFloor = ind;
					// setTimeout(() => {
					// 	
					// 	this.seatArr = this.allFloorGetOldArr[ind].layoutList;
					// 	// console.log(this.seatArr);
					// 	this.x = this.seatArr[this.seatArr.length - 1].seatRow;
					// 	this.seatRow = this.seatArr[this.seatArr.length - 1].seatRow;
					// 	this.y = this.seatArr[this.seatArr.length - 1].seatColumn;
					// 	this.seatColumn = this.seatArr[this.seatArr.length - 1].seatColumn;
					// 	this.seatrow = this.x;
					// 	this.seatcol = this.y;
					// 	this.width = 124 * (this.y + 1) + 'rpx'

					// 	this.newSeat()
					// }, 500)

				} else {
					uni.showToast({
						icon: 'none',
						title: '请配置当前楼层座位状态'
					})
				}

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
			pleaseSit(seat,Attribute) {
				this.seatAttribute = Attribute;
				
				let txt = '', //弹窗文案
					status = -1, //座位要修改成的状态
					statusTxt; //座位要修改成的状态中文
				
				if (Attribute == 2) {
					status = 0;
					statusTxt = '禁用';
					txt = `座位号：${seat}，当前状态为：可预订，是否要修改为：${statusTxt}状态`;
				} else if (Attribute == 0) {
					status = 2;
					statusTxt = '可预订';
					txt = `座位号：${seat}，当前状态为：禁用，是否要修改为：${statusTxt}状态`;
				} else if (Attribute == 3 || Attribute == 4) {
					txt = `座位号：${seat}，当前座位已被线上用户预定，不可修改`;
				} else {
					txt = `座位号：${seat}，当前座位不可修改，仅能修改可预订与禁用状态的座位`;
				}
				
				if(Attribute == 2 || Attribute == 0){
					this.modalShow = true
					this.nowSeat = seat;
					this.content = txt;
				}else{
					this.$errToast(txt);
				}
			},
			confirm() {
				let status = this.seatAttribute == 2 ? 0 : 2;
				this.$put(`/merchant/store/storeSeatStatus/${this.nowSeat}/${status}`)
					.then(res => {
						if (res.code == 0) {
							this.getBeagainArr(this.floorName)
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}
					})
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
		}
	}
</script>

<style lang="scss" scoped>
	.newBottom {
		display: flex;
	}

	.batch {
		width: 200rpx;
		height: 100rpx;
		border: 1px solid #4CD964;
		text-align: center;
		line-height: 100rpx;
	}

	.goState {
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

	.seatMessage {
		position: relative;
		width: 100%;
		height: 100%;
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

	.mostRight {
		margin: 0 0 20rpx 20rpx;
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
				background-color: #800080;
				border-radius: 15rpx;
				margin-left: 12rpx;
			}
		}
	}

	.reserved {
		margin: 0 0 20rpx 48rpx;
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
				background-color: #409eff;
				border-radius: 15rpx;
				margin-left: 12rpx;
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
		background-color: #800080;
		// border: 1px solid #800080;
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

	.acbg6 {
		display: inline-block;
		width: 72rpx;
		height: 72rpx;
		border-radius: 15rpx;
		background-color: #409eff;
		border: 1px solid #f1f1f1;
		margin-bottom: 40rpx;
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

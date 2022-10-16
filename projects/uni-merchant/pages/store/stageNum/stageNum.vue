<template>
	<view class="box">
		<view class="stageNum">
			<navBar :switchUrl="'../store'">数据分析图</navBar>
		</view>
		<view class="title">
			<!-- 	<text class="active" @click="platform">开台数量</text>
			<text @click="liquor">酒水销量</text>
			<text @click="sex">男女比例</text>
			<text @click="old">年龄分布</text> -->
			<!-- <block v-for="(item,index) in nums" :key="item.id">
				<text :class="[ind==index?'active':'']" @click="platform(index,item.title)">{{item.title}}</text>
			</block> -->
			<text @click="platform(0,'开台数量')" :class="[ind==0?'active':'']">开台数量</text>
			<text @click="platform(1,'酒水销量')" :class="[ind==1?'active1':'']">酒水销量</text>
			<text @click="platform(2,'男女比例')" :class="[ind==2?'active2':'']">男女比例</text>
			<text @click="platform(3,'年龄分布')" :class="[ind==3?'active3':'']">年龄分布</text>
		</view>
		<view v-if="one_flag">
			<view class="num">
				<text>{{name[0]}}{{title}}<text class="hui">{{name[1]}}</text></text>
			</view>
			<ve-line :data="chartData1" :settings="chartSettings" :tooltip-visible="false" :colors="color1" :events="chartEvents"
			 :extend="extend1"></ve-line>
		</view>
		<view v-if="two_flag">
			<view class="num">
				<text>{{name[0]}}{{title}}<text class="hui">{{name[1]}}</text></text>
			</view>
			<ve-histogram :data="chartData2" :settings="chartSettings2" :events="chartEvents" :extend="extend2" :tooltip-visible="false"></ve-histogram>
		</view>
		<view v-if="three_flag">
			<view class="num">
				<text>{{name[0]}}{{title}}<text class="hui">{{name[1]}}</text></text>
			</view>
			<view class="father">
				<!-- <u-calendar v-model="" :mode="mode"></u-calendar> -->
				<u-picker mode="time" v-model="showcalendar" :params="params" @confirm="change"></u-picker>
				<view @click="shows" class="titles">{{datas}}</view>
				<view :class="[showcalendar?'transformarrows':'arrows']"></view>
			</view>
			<ve-pie :data="chartData3" :settings="chartSettings3" :colors="color3" :tooltip-visible="false"></ve-pie>
		</view>
		<view v-if="four_flag">
			<view class="num">
				<text>{{name[0]}}{{title}}<text class="hui">{{name[1]}}</text></text>
			</view>
			<view class="father">
				<!-- <u-calendar v-model="" :mode="mode"></u-calendar> -->
				<u-picker mode="time" v-model="showcalendar" :params="params" @confirm="change"></u-picker>
				<view @click="shows" class="titles">{{datas}}</view>
				<view :class="[showcalendar?'transformarrows':'arrows']"></view>
			</view>
			<ve-ring :data="chartData4" :settings="chartSettings4" :colors="color4" :tooltip-visible="false"></ve-ring>
		</view>

	</view>
</template>

<script type="text/javascript">
	export default {
		data() {
			this.color1 = ['#ffc623']
			this.color3 = ['#608CFF', '#EC9CFC']
			this.color4 = ['#41C9FF', '#9DFB4C', '#FFBB43', '#FF8686']
			this.chartSettings = {
				// yAxisName: '台',
				selectedMode: 'single',
				hoverAnimation: false,
				dataType: 'percent',
				labelMap: {
					openTableTimes: '开台数量',
				},
				min: [0],
				max: [this.openMax],
			}
			// 折线
			this.extend1 = {
				series: {
					label: {
						normal: {
							show: true,
						}
					}
				}
			}
			// 柱状
			this.extend2 = {
				series: {
					label: {
						show: true,
						position: "top"
					}
				}
			}
			this.chartSettings2 = {
				legendName: {
					'sellNum': '酒水销量',
				},
				min: [0],
				max: [this.liquorMax],
			}
			this.chartSettings3 = {
				calculable: true,
				label: {
					show: true,
					position: 'inside'

				},
				itemStyle: {
					borderWidth: 5,
					borderColor: "#fff",
					shadowBlur: .7,
					shadowColor: 'rgba(0, 0, 0, 0.2)',
				}
			}
			this.chartSettings4 = {
				radius: [145, 110],
				offsetY: 240,
				labelLine: {
					length:50,
					length2:15
				},
				itemStyle: {
					borderWidth: 5,
					borderColor: "#fff",
					shadowBlur: .7,
					shadowColor: 'rgba(0, 0, 0, 0.2)',
				}
			}
			var self = this
			this.chartEvents = {
				click: function(e) {
					self.name = e.data
					self.title = e.seriesName
					console.log(e)
				},
			}
			return {
				one_flag: true,
				two_flag: false,
				three_flag: false,
				four_flag: false,
				sumNum: [],
				windowHeight: '',
				ind: 0,
				showcalendar: false,
				mode: 'date',
				params: {
					year: true,
					month: true,
					day: false,
					hour: false,
					minute: false,
					second: false
				},
				chartData1: {
					columns: ['month', 'openTableTimes'],
					rows: []
				},
				name: [],
				title: '',
				chartData2: {
					columns: ['name', 'sellNum'],
					rows: []

				},
				chartData3: {
					columns: ['sex', 'visitNum'],
					rows: []
				},
				chartData4: {
					columns: ['age', 'proportion'],
					rows: []
				}
			}

		},
		onLoad(option) {
			this.platform(Number(option.id))
			// this.getPlatform()
			this.datas = this.$date.date().currentdatesNoday
			// this.getAppSeatByDay(this.datas)

		},
		methods: {
			getLiquor() {
				var date = new Date();
				let month = date.getMonth() + 1
				let day = date.getDate()
				if (month < 10) {
					month = '0' + month
				}
				if (day < 10) {
					day = '0' + date.getDate()
				}
				var localDates = date.getFullYear() + '-' + month + '-' + day;
				let datas = {
					"localDate": localDates,
					"timeType": 2
				}
				this.$post('/merchant/store/getAppSell', datas)
					.then(res => {
						// console.log(res)
						if (res.code == 0) {
							if (res.data.length != 0) {
								this.chartData2.rows=[]
								for (var i = 0; i < res.data.length; i++) {
									this.chartData2.rows.push({
										name: this.$date.liquorNmae(res.data[i].name),
										sellNum: res.data[i].sellNum
									})
									// console.log(this.chartData2)
								}
							} else {
								uni.showToast({
									icon: 'none',
									title: '没有数据'
								})
							}
							let newLiquorArr = []
							for (let item of this.chartData2.rows) {
								newLiquorArr.push(item.sellNum)
							}
							newLiquorArr = this.$date.bubbling(newLiquorArr)
							this.chartSettings2.max = Array.of(parseInt((newLiquorArr[newLiquorArr.length - 1] + 10)/10)*10)
						}
					})
			},
			getPlatform(time) {
				var date = new Date();
				let month = date.getMonth() + 1
				let day = date.getDate()
				if (month < 10) {
					month = '0' + month
				}
				if (day < 10) {
					day = '0' + date.getDate()
				}
				var localDates = date.getFullYear() + '-' + month + '-' + day;
				if (time) {
					localDates = time
				}
				let data = {
					"localDate": localDates,
					"type": 2
				}
				this.$post('/merchant/store/getHomePage', data)
					.then(res => {
						// console.log(res)
						let newRows1 = [] //开台数量
						let newRows3 = [] //男女比例
						let newRows4 = [] //年龄分布
						// 开台
						if (res.code == 0) {
							if (!res.data == false && res.data.length != 0) {
								for (var i = 0; i < res.data.length; i++) {
									if (res.data[i].month) {
										newRows1.unshift({
											month: res.data[i].month+'月',
											openTableTimes: res.data[i].openTableTimes
										})
										
										let mapArr = new Map()
										mapArr = newRows1.map(item => {
											return Number(item.openTableTimes)

										})
										
										this.chartSettings.max = Array.of(parseInt((this.$date.bubbling(mapArr)[mapArr.length - 1] + 10)/10)*10)
										this.chartData1.rows = newRows1;
										
									} else {
										uni.showToast({
											icon: 'none',
											title: '当前开台没数据'
										})
									}

								}
								// 男女
								// console.log(this.$GetPercent(res.data[0].gentlemen,res.data[0].ladies))
								if(res.data[0].gentlemen&&res.data[0].ladies){
									newRows3.push({
									sex: '男' + this.$GetPercent(res.data[0].gentlemen, res.data[0].ladies),
									visitNum: res.data[0].gentlemen
								}, {
									sex: '女' + this.$GetPercent(res.data[0].ladies, res.data[0].gentlemen),
									visitNum: res.data[0].ladies
								})
								this.chartData3.rows = newRows3
								}else{
									uni.showToast({
										icon: 'none',
										title: '当前男女没数据'
									})
								}
								
								// console.log(this.$FourGetPercent(4,2,1,3))
								if(!res.data[0].firstRange&&!res.data[0].secondRange&&!res.data[0].thirdRange&&!res.data[0].fourthRange){
									uni.showToast({
										icon: 'none',
										title: '当前年龄没数据'
									})
									return
								}
								let firstRange = res.data[0].firstRange
								let secondRange = res.data[0].secondRange
								let thirdRange = res.data[0].thirdRange
								let fourthRange = res.data[0].fourthRange
								let one = this.$FourGetPercent(firstRange, secondRange, thirdRange, fourthRange)
								let two = this.$FourGetPercent(secondRange, firstRange, thirdRange, fourthRange)
								let three = this.$FourGetPercent(thirdRange, firstRange, secondRange, fourthRange)
								let four = this.$FourGetPercent(fourthRange, firstRange, secondRange, thirdRange)
								const oldSet = new Set()
								// console.log(oldSet)
								oldSet.add([{
										age: '18-23岁' + ' ' + one,
										proportion: res.data[0].firstRange,
									},
									{
										age: '24-29岁' + ' ' + two,
										proportion: res.data[0].secondRange,
									},
									{
										age: '30-35岁' + ' ' + three,
										proportion: res.data[0].thirdRange,
									},
									{
										age: '36岁以上' + ' ' + four,
										proportion: res.data[0].fourthRange,
									}
								])
								newRows4 = [...oldSet][Symbol.iterator]().next().value
								this.chartData4.rows = newRows4
								// console.log(this.chartData4.rows)
							} else {
								uni.showToast({
									icon: 'none',
									title: '没有数据'
								})
							}

						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}
					})

			},
			platform(ind, tit) {
				this.ind = ind
				// console.log(this.ind)
				switch (this.ind) {
					case 0:
						this.one_flag = true
						this.two_flag = false
						this.three_flag = false
						this.four_flag = false
						this.getPlatform()
						this.$router.push({ query: { id: 0 } })
						break;
					case 1:
						this.one_flag = false
						this.two_flag = true
						this.three_flag = false
						this.four_flag = false
						this.getLiquor()
						this.$router.push({ query: { id: 1 } })
						break;
					case 2:
						this.one_flag = false
						this.two_flag = false
						this.three_flag = true
						this.four_flag = false
						this.getPlatform()
						this.$router.push({ query: { id: 2 } })
						break;
					case 3:
						this.one_flag = false
						this.two_flag = false
						this.three_flag = false
						this.four_flag = true
						this.getPlatform()
						this.$router.push({ query: { id: 3 } })
						break;
				}
			},
			change(e) {
				console.log(e);
				this.datas = e.year + '-' + e.month
				let spreadDatas = this.datas + '-' + '01'
				this.getPlatform(spreadDatas)
			},
			shows() {
				this.showcalendar = true
			},
		}
	}
</script>

<style scoped lang="scss">
	.box {
		overflow: hidden;
	}

	.data-empty {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(255, 255, 255, .7);
		color: #888;
		font-size: 34rpx;
	}

	.father {

		position: relative;
		width: 196rpx;
		height: 32rpx;
		margin: 50rpx auto;
		text-align: center;
		box-sizing: border-box;

		.titles {
			background-color: #f7f7f7;
			width: 224rpx;
			height: 46rpx;
			border-radius: 46rpx;
			box-sizing: border-box;
			line-height: 46rpx;
			font-size: 24rpx;
		}
	}

	.arrows {
		position: absolute;
		right: -10rpx;
		top: 20rpx;
		z-index: 10;
		border-top: 10rpx solid #000;
		border-left: 5rpx solid transparent;
		border-bottom: 5rpx solid transparent;
		border-right: 5rpx solid transparent;
	}

	.transformarrows {
		position: absolute;
		right: -10rpx;
		top: 14rpx;
		z-index: 10;
		border-top: 10rpx solid #000;
		border-left: 5rpx solid transparent;
		border-bottom: 5rpx solid transparent;
		border-right: 5rpx solid transparent;
		transform: rotate(180deg);
	}

	.title {
		padding-top: 128rpx;
		display: flex;
		justify-content: space-around;

		text {
			display: inline-block;
			font-size: 28rpx;
			color: #999999;
			width: 156rpx;
			height: 60rpx;
			border-radius: 10rpx;
			background-color: #F7F7F7;
			text-align: center;
			line-height: 60rpx;
		}

		.active {
			background: linear-gradient(to bottom, #FFEE1A, #FF982D);
			color: #fff;
		}

		.active1 {
			background: linear-gradient(to bottom, #87D361, #289E58);
			color: #fff;

		}

		.active2 {
			background: linear-gradient(to bottom, #A5F1FF, #4388FF);
			color: #fff;
		}

		.active3 {
			background: linear-gradient(to bottom, #FFBBB4, #FF9A96);
			color: #fff;
		}
	}

	.num {
		width: 802rpx;
		height: 10rpx;
		border-radius: 20rpx;
		// background-color: #F7F7F7;
		font-size: 28rpx;
		text-align: center;
		line-height: 100rpx;
		color: #999999;
		width: 94%;
		margin: 12rpx auto 0;

		.hui {
			font-size: 36rpx;
			font-weight: 600;
			margin: 0 14rpx;
		}
	}
</style>

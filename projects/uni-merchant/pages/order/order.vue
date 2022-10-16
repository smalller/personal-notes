<template>
	<view style="height: 100%">
		<view class="nav-bar-wrap">
			<view class="title-box">订单管理</view>
		</view>
		<view class="has-navBar">
			<view :class="[swiperCurrent == 1 ? 'search-wrap' : 'search-wrap not-click']">
				<input type="text" :disabled="swiperCurrent != 1" v-model="searchVal" placeholder="请输入验证码" @confirm="handleConfirmSearch" confirm-type="search" />
			</view>
			<view class="top-tab-wrap">
				<view :style="{
            'background-color': tabIndex == index ? '#67A8FC' : '#fff',
          }" :class="[item.label === '全部订单' && refuseBid ? 'fefuse-tab' : '']"
				 class="tab" v-for="(item, index) in tabList" :key="index" @click="handleChangeTab(item.value)">
					<text :style="{ color: tabIndex == index ? '#fff' : '#000' }">{{
            item.label
          }}</text>
				</view>
			</view>

			<template v-if="tabIndex == 2">
				<seatMan></seatMan>
			</template>
			<template v-if="tabIndex == 1">
				<waitProcessOrder></waitProcessOrder>
			</template>
			<template v-if="tabIndex == 0">
				<allOrder></allOrder>
			</template>
		</view>
	</view>
</template>

<script>
	import waitProcessOrder from "./waitProcessOrder/waitProcessOrder.vue";
	import seatMan from "./seatMan/seatMan.vue";
	import allOrder from "./allOrder/allOrder.vue";

	export default {
		components: {
			waitProcessOrder,
			seatMan,
			allOrder,
		},

		data() {
			return {
				//标签页集合
				tabList: [{
						value: 0,
						label: "全部订单",
					},
					{
						value: 1,
						label: "待处理",
					},
					{
						value: 2,
						label: "抢座排号",
					},
				],

				searchVal: "", //输入框输入值
				tabIndex: 0, //顶部标签页下标
				refuseBid: false, //若拒接订单，则全部订单的按钮上显示一个小红点

				swiperCurrent: 0, //子组件中的标签页下标
				tabs : -1,	//当前处于全部订单/待处理一级菜单
			};
		},

		onPullDownRefresh() {
			console.log('下拉刷新了',this.swiperCurrent)
			
			const data = {
				swiperCurrent : this.swiperCurrent,
				tabs : this.tabs,
			}
			
			uni.$emit('onPullDownRefreshIndex',data)
		},
		
		//当从订单详情回到主页面时的操作
		onShow() {
			//接收从子页回传的tab类型，去重新请求页面数据
			uni.$on('orderStatus', res => {
				//从订单详情跳回全部订单
				if(res.origin === 'detailPage') {
					uni.$emit('detailToOrder', res.orderStatus)
				}
				
				//从存酒页面跳回全部订单
				if(res.origin === 'saveDrinksPage') {
					uni.$emit('saveDrinksToOrder', res.orderStatus)
				}
			})
			
			uni.$on("money", function(e) {
				uni.$emit('nowMoney', e)
			})
			
			//隐藏消息右上角的小红点
			uni.hideTabBarRedDot({
				index: 1,
			})
		},

		onLoad(option) {
			//如果拒接订单，那么全部订单按钮上就会有个小红点
			uni.$on("refuseBid", (res) => {
				this.refuseBid = res;
			});
			
			//跳转到查看订单详情
			uni.$on("searchDetail", (res) => {
				uni.navigateTo({
					url: res,
				});
			});
			
			//跳转到存酒页面
			uni.$on("saveDrinks", (res) => {
				uni.navigateTo({
					url: res,
				});
			});
			
			uni.$on("goHistory", (res) => {
				// console.log(res.url);
				uni.navigateTo({
					url: res.url,
				});
			});
			
			// 定时器
			uni.$on('timer', (e) => {
				console.log(e)
			})

			//接收子组件传过来的标签页下标
			uni.$on('tabsIndex', res => {
				this.swiperCurrent = res.swiperCurrent;
				this.tabs = res.tabs;
			})
		},

		methods: {
			//调用键盘的完成按钮事件
			handleConfirmSearch() {
				const data = {
					searchVal : this.searchVal,
					tabs : this.tabs
				}
				
				uni.$emit('searchVal', data);
				this.searchVal = '';
				uni.hideKeyboard(); //收起键盘
			},

			//切换顶部标签页
			handleChangeTab(value) {
				if (value != 0) {
					this.swiperCurrent = 0; //默认隐藏搜索框
				}

				this.tabIndex = value;

				//当点击全部订单标签页时，就讲小红点去除
				if (value == 0) {
					this.refuseBid = false;
				}
			},
		},
	};
</script>

<style lang="scss" scoped>
	
	uni-page-body{
		height: 100%;
	}
	.nav-bar-wrap {
		position: fixed;
		z-index: 990;
		width: 100%;
		height: 88rpx;
		background-color: $uni-bg-color-navbar;
		display: flex;
		align-items: center;
		box-sizing: border-box;

		.back-btn {
			height: 100%;
			position: absolute;
			left: 24rpx;
			display: flex;
			align-items: center;

			text {
				font-size: 32rpx;
			}
		}

		.title-box {
			margin: 0 auto;
			font-size: 32rpx;
			font-weight: 400;
			color: #000;

		}
	}

	.has-navBar {
		height: 100%;
		padding-left: 24rpx;
		padding-right: 24rpx;

	}

	.search-wrap {
		margin-top: 24rpx;
		border: 2rpx solid #ccc;
		border-radius: 30rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		padding-left: 64rpx;
		position: relative;
		

		&::before {
			display: flex;
			align-items: center;
			content: "\e628";
			position: absolute;
			font-family: "iconfont";
			font-size: 28rpx;
			left: 24rpx;
		}

		input {
			width: 100%;
		}
	}
	
	.not-click {
		background-color: #ddd;
	}

	.top-tab-wrap {
		display: flex;
		justify-content: space-between;
		padding: 0 60rpx;
		font-size: 28rpx;
		margin-top: 24rpx;
		margin-bottom: 24rpx;
		.tab {
			width: 168rpx;
			height: 60rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2rpx solid #67a8fc;
			border-radius: 36rpx;
		}

		.fefuse-tab {
			position: relative;

			&::before {
				display: block;
				content: "";
				width: 8rpx;
				height: 8rpx;
				background-color: #ff3636;
				border-radius: 50%;
				display: flex;
				align-items: center;
				position: absolute;
				left: 12rpx;
			}
		}
	}
</style>

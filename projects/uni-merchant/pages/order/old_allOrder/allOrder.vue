<template>
	<view class="orderManagement">
		<view class="botm-tab-wrap">
			<u-tabs-swiper ref="uTabs" :list="botomTablist" :current="current" :is-scroll="false" bar-width="84" bar-height="8"
			 active-color="#67A8FC" font-size="28" @change="tabsChange"></u-tabs-swiper>
		</view>
		<view :class="[swiperFlag?'order-list-wrap-one':'order-list-wrap-two']">
			<swiper class="swiper-box" @change="changeSwiperCurrent" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="onreachBottom" @scroll="scroll" :scroll-top="scrollTop">
						<complete :storeLocation="storeLocation"></complete>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="onreachBottom" @scroll="scroll" :scroll-top="scrollTop">
						<cancelOrder :storeLocation="storeLocation"></cancelOrder>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import complete from './complete.vue'
	import cancelOrder from './cancelOrder.vue'
	
	export default {
		components: {
			complete,
			cancelOrder
		},
		
		data() {
			return {
				storeLocation : '',	//店铺类型
				
				//订单标签页集合
				botomTablist: [{
						name: '已完成',
						count: 0
					},
					{
						name: '取消订单',
						count: 0
					}
				],
				
				current: 0, //tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, //swiper组件的current值，表示当前那个swiper-item是活动的
				
				currentPage: 1, //默认页码
				pagesize: 20, //默认每页要显示多少条数据
				orderType : 2, //订单类型（1-取消 2-已完成）
				
				orderList: [],//订单列表
				
				isShowNoMore : false, //如果上拉触底没有更多数据，就不再继续请求
				
				requestFlag : true,	//防抖标杆
				swiperFlag:true,
				
				scrollTop: 0,	// 要将滚动条固定到的位置
				oldScrollTop: 0,	//页面滚动到的位置
			}
		},
		
		watch: {
			watchOnloadOrder: {
				handler(val) {
					this.getOrderInfo();
				},
				deep: true
			}
		},
			
		computed: {
			watchOnloadOrder() {
				return this.$store.state.onloadOrder;
			}
		},
		
		mounted() {
			this.getOrderInfo();	//默认获取新订单列表信息
			this.sendTabsIndex();  //发送当前标签页的下标给父组件
			this.getSearchVal();  //接收父组件输入框输入的值
			this.getonPullDownRefreshList();  //下拉刷新加载不同标签页的订单列表
		},
		
		methods: {
			//页面滚动
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			
			//下拉刷新
			getonPullDownRefreshList() {
				uni.$on('onPullDownRefreshIndex',res => {
					if(res.tabs == 1) {
						if(res.swiperCurrent == 1) {
							this.orderType = 2;
						}
						if(res.swiperCurrent == 2) {
							this.orderType = 1;
						}
						
						this.currentPage = 1;
						this.isShowNoMore = false;
						
						this.getOrderInfo();
						
						this.scrollTop = this.oldScrollTop;
						this.$nextTick(() => {
							this.scrollTop = 0
						});
						
						
					}
				})
			},
			
			//接收父组件中的输入框传来的搜索值，根据该值进行搜索列表
			getSearchVal() {
				uni.$on('searchVal',res => {
					this.getOrderInfo(res);	//搜索
				})
			},
			
			//将当前的tab标签页下标传给父组件（作用：如果标签页为进行中页面，就展示输入框）
			sendTabsIndex() {
				//因为全部订单里只有已完成的订单才能进行查询订单，所以这里要将已完成页面的下标加1（已完成下标是0），与订单页面的搜索框的判断（this.swiperCurrent == 1）相匹配
				const data = {
					swiperCurrent : this.swiperCurrent + 1,
					tabs : '1'
				}
				
				uni.$emit('tabsIndex',data);
			},
			
			//获取所有订单类目的总数量
			getOrderTypeNum() {
				this.$get('/merchant/store/order/appCountOrder').then(res => {
					if(res.code === 0) {
						this.botomTablist[0].count = res.data[1].count;
						this.botomTablist[1].count = res.data[0].count;
					}
				})
			},
			
			//根据标签页获取订单列表信息
			getOrderInfo(keyword) {
				if(this.requestFlag) {
					this.requestFlag = false;
					this.$showLoading();
					let data = {
						pageNo : this.currentPage,
						pageSize : this.pagesize,
						status : this.orderType,
						keyword	//搜索的关键词
					}
					
					this.$post('/merchant/store/order/appAllOrder',data).then(res => {
						if(res.code === 0) {
							this.getOrderTypeNum();	//获取所有订单类目的总数量
							
							//当前店铺的类型
							this.storeLocation = res.data.storeLocation;
							
							if(this.currentPage === 1) {
								this.orderList = res.data.merchantOrderList.list;
							} else {
								this.orderList = this.orderList.concat(res.data.merchantOrderList.list)
							}
							
							//如果没有更多数据，就不再继续请求
							if(res.data.merchantOrderList.list.length === 0) {
								this.$errToast('暂无更多数据');
								this.isShowNoMore = true;
							}
							
							//如果当前是取消订单页面
							if(this.orderType == 1) {
								uni.$emit("cancelOrderList", this.orderList);
							}
							
							//如果当前是已完成页面
							if(this.orderType == 2) {
								uni.$emit("completeOrderList", this.orderList);
							}
							
							console.log('当前类目的订单信息',res.data.merchantOrderList.list);
							
							
							setTimeout(() => {
								uni.hideLoading();
								this.requestFlag = true;
								uni.stopPullDownRefresh()
							}, 500)
						} else {
							uni.$emit("orderList",[]);
							this.$errToast(res.msg)
							setTimeout(() => {
								uni.hideLoading();
								uni.stopPullDownRefresh();
							},2000)
							this.requestFlag = true;
						}
					})
				}
			},
			
			//根据swiper下标转换orderType值
			indexToType(index) {
				switch(index) {
					case 0 :
						this.orderType = 2;
						this.swiperFlag = true
						break;
					case 1 :
						this.orderType = 1;
						this.swiperFlag = false
						break;
					default:
						break;
				}
			},
			
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			
			//当swiper标签页切换后，初始化相关变量
			initSwiperInfo(index) {
				this.currentPage = 1;
				this.isShowNoMore = false;
				this.swiperCurrent = index;
				this.sendTabsIndex();
				this.indexToType(index);
				this.getOrderInfo();
			},
			
			//切换中部标签页
			tabsChange(index) {
				this.initSwiperInfo(index);
			},
			
			//swiper页面横向滑动时，获取当前的页面下标
			changeSwiperCurrent(e) {
				let index = e.detail.current;
				this.initSwiperInfo(index);
			},
			
			// scroll-view到底部加载更多
			onreachBottom() {
				if(!this.isShowNoMore) {
					this.currentPage ++; //加载下一页
					this.getOrderInfo();
					console.log("触底了")
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.orderManagement{
		height: calc(100% - 190rpx);
	}
	.botm-tab-wrap {
		margin: 0 36rpx 26rpx;
	}
	
	/deep/ .u-badge--bg--error {
		background-color: #67A8FC;
	}

	.order-list-wrap-one {
		height: calc(100% - 110rpx);
		// height: 100%;
		// height: auto;

		.swiper-box {
			height: 100%;
		}

		.scroll-view {
			height: 100%;
		}

	}
	.order-list-wrap-two {
		height: calc(100% - 110rpx);
		// height: 100%;
		// height: auto;

		.swiper-box {
			height: 100%;
		}

		.scroll-view {
			height: 100%;
		}

	}


</style>

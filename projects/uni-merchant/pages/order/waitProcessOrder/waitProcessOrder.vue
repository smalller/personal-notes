<template>
	<view :class="[swiperFlag?'orderManagement-one':'orderManagement-two']">
		<!-- 处理新订单和催单的模态框 -->
		<u-modal v-model="modal.modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modal.modalContent" @confirm="resOrderHandle"></u-modal>

		<!-- 处理进行中订单（确认到店/确认离店）的操作 -->
		<u-modal :confirm-text="modal.confirmText" :cancel-text="modal.cancelText" v-model="modal.underwayModalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modal.modalContent" @confirm="resOrderHandle" @cancel="resCancelHandle"></u-modal>

		<!-- 验证用户的验证码 -->
		<u-modal v-model="codeDialog" :content-style="{'padding-bottom' : '56rpx'}" :negative-top="500" :show-confirm-button="false" mask-close-able title="请输入验证码" @confirm="resOrderHandle">
			<u-message-input mode="bottomLine" :focus="true" :breathe="true" @finish="finishCode"></u-message-input>
		</u-modal>
		
		<!-- 更换座位 -->
		<u-select  :mode="storeLocation == 3 ? 'mutil-column-auto' : 'single-column'"  v-model="setNumber.updateSeat" confirm-color="#67a8fc" cancel-color="#000" :safe-area-inset-bottom="true" :list="setNumber.seatOrRoomList" @confirm="updateSeatNum"></u-select>
		
		<u-toast ref="uToast" />

		<view class="botm-tab-wrap">
			<u-tabs-swiper ref="uTabs" :list="botomTablist" :current="current" :is-scroll="false" bar-width="84" bar-height="8"
			 active-color="#67A8FC" font-size="28" @change="tabsChange"></u-tabs-swiper>
		</view>
		<view class="order-list-wrap">
			<swiper class="swiper-box" @change="changeSwiperCurrent" :current="swiperCurrent" @transition="transition"
			 @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="onreachBottom" @scroll="scroll" :scroll-top="scrollTop">
						<newOrder :storeLocation="storeLocation"></newOrder>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="onreachBottom" @scroll="scroll" :scroll-top="scrollTop">
						<underwayOrder :storeLocation="storeLocation"></underwayOrder>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="onreachBottom" @scroll="scroll" :scroll-top="scrollTop">
						<urgeOrder :storeLocation="storeLocation"></urgeOrder>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import newOrder from './newOrder.vue'
	import underwayOrder from './underwayOrder.vue'
	import urgeOrder from './urgeOrder.vue'

	export default {
		components: {
			newOrder,
			underwayOrder,
			urgeOrder
		},

		data() {
			return {
				storeLocation : '',	//店铺类型
				
				//订单标签页集合
				botomTablist: [{
						name: '新订单',
						count: 0
					},
					{
						name: '进行中',
						count: 0
					},
					{
						name: '催单',
						count: 0
					}
				],

				//模态框属性
				modal: {
					modalShow: false, //处理新订单和催单的模态框开关
					underwayModalShow: false, //处理进行中订单的模态框
					modalContent: '', //模态框要展示的内容
					confirmText: '', //确认按钮要显示的文本
					cancelText: '', //取消按钮要显示的文本
					handleOrderStatus: '', //判断当前操作订单的类型
					modalIndex: 0, //从哪个标签页点击的模态框按钮，默认新订单标签页（0-新订单 1-进行中 2-催单）
					id: '', //要操作的订单id
				},

				current: 0, //tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, //swiper组件的current值，表示当前那个swiper-item是活动的

				currentPage: 1, //默认页码
				pagesize: 20, //默认每页要显示多少条数据
				orderType: 3, //订单类型（3-新订单 4-进行中 5-催单）

				orderList: [], //订单列表

				isShowNoMore: false, //如果上拉触底没有更多数据，就不再继续请求

				codeDialog: false, //输入验证码的弹窗开关
				
				requestFlag : true,	//防抖标杆
				swiperFlag:true,
				
				isPllDown : false,	//上拉刷新列表
				
				//设定座位/包间号操作
				setNumber : {
					// id : '',	//当前订单的id
					// seatOrRoomList : [],	//后端返回的可以选择的座位号/包间号
					// newSeatNum : '',	//要修改成的座位号
					// updateSeat : false,	//修改座位的开关
				},
				
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
			this.getcurrentPage();	//获取子组件传过来的页码
			this.getModalAttr(); //获取子组件的模态框属性值
			this.handleVerif();	//核销输入验证码操作
			this.getOrderInfo(); //默认获取新订单列表信息
			this.getSearchVal(); //接收父组件输入框输入的值
			this.detailToOrder(); //从订单详情跳回到order页面，重新请求订单列表
			this.getSetNumberSelect();  //获取设定座位组件的值
			this.sendTabsIndex();	//发送当前标签页的下标给父组件
			this.getonPullDownRefreshList();  //下拉刷新加载不同标签页的订单列表
		},

		methods: {
			//页面滚动
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop
			},
			
			//下拉刷新加载不同标签页的订单列表
			getonPullDownRefreshList() {
				uni.$on('onPullDownRefreshIndex',res => {
					if(res.tabs == 2) {
						this.indexToType(res.swiperCurrent);
						this.currentPage = 1;
						this.isShowNoMore = false;
						this.getOrderInfo();
						
						this.scrollTop = this.oldScrollTop;
						this.$nextTick(() =>{
							this.scrollTop = 0
						});
					}
				})
			},
			
			//获取子组件传过来的页码
			getcurrentPage() {
				uni.$on('currentPage',res => {
					this.currentPage = res;
				})
			},
			
			//从订单详情跳回到order页面的操作
			detailToOrder() {
				//获取父组件order回传过来的tab类型
				uni.$on('detailToOrder', res => {
					this.initSwiperInfo(res) //重新请求订单列表
				})
			},

			//接收父组件中的输入框传来的搜索值，根据该值进行搜索列表
			getSearchVal() {
				uni.$on('searchVal', res => {
					//如果当前处在待处理标签页，才进行搜索操作
					if(res.tabs == 2) {
						this.currentPage = 1;
						this.getOrderInfo(res.searchVal); //搜索
					}
				})
			},

			//获取子组件的模态框属性值
			getModalAttr() {
				uni.$on("handleModal", res => {
					this.modal = Object.assign({}, res)
				});
			},
			
			//获取设定座位组件的值
			getSetNumberSelect() {
				uni.$on('setNumber',res => {
					this.setNumber = Object.assign({},res);
				})
			},

			//将当前的tab标签页下标传给父组件（作用：如果标签页为进行中页面，就展示输入框）
			sendTabsIndex() {
				const data = {
					swiperCurrent : this.swiperCurrent,
					tabs : '2'
				}
				uni.$emit('tabsIndex', data);
			},

			//根据swiper下标转换orderType值
			indexToType(index) {
				switch (index) {
					case 0:
						this.orderType = 3;
						this.swiperFlag = true
						break;
					case 1:
						this.orderType = 4;
						this.swiperFlag = false
						break;
					case 2:
						this.orderType = 5;
						this.swiperFlag = true
						break;
					default:
						break;
				}
			},

			//获取所有订单类目的总数量
			getOrderTypeNum() {
				this.$get('/merchant/store/order/appCountOrder').then(res => {
					if (res.code === 0) {
						this.botomTablist[0].count = res.data[2].count;
						this.botomTablist[1].count = res.data[3].count;
						this.botomTablist[2].count = res.data[4].count;
					}
				})
			},

			//根据标签页获取订单列表信息
			getOrderInfo(keyword) {
				if(this.requestFlag) {
					this.requestFlag = false;
					this.$showLoading();
					let data = {
						pageNo: this.currentPage,
						pageSize: this.pagesize,
						status: this.orderType,
						keyword //搜索的关键词
					}
					this.$post('/merchant/store/order/appAllOrder', data).then(res => {
						if (res.code === 0) {
							//获取所有订单类目的总数量
							this.getOrderTypeNum();
							
							//当前店铺的类型
							this.storeLocation = res.data.storeLocation;
	
							//获取列表
							if (this.currentPage === 1) {
								this.orderList = res.data.merchantOrderList.list;
							} else {
								this.orderList = this.orderList.concat(res.data.merchantOrderList.list)
							}
	
							//如果没有更多数据，就不再继续请求
							if (res.data.merchantOrderList.list.length === 0) {
								this.$errToast('暂无更多数据');
								this.isShowNoMore = true;
							}
							
							//如果当前是新订单页面
							if(this.orderType == 3) {
								uni.$emit("newOrderList", this.orderList);
							}
							
							//如果当前是进行中页面
							if(this.orderType == 4) {
								uni.$emit("underwayOrderList", this.orderList);
							}
							
							//如果当前是催单页面
							if(this.orderType == 5) {
								uni.$emit("urgeOrderList", this.orderList);
							}
	
							console.log('当前类目的订单信息', res.data.merchantOrderList.list);
							
							
							setTimeout(() => {
								uni.hideLoading()
								this.requestFlag = true;
								uni.stopPullDownRefresh()
							}, 500)
						} else {
							uni.$emit("orderList", []);
							this.$errToast(res.msg)
							setTimeout(() => {
								uni.hideLoading();
								uni.stopPullDownRefresh();
							}, 2000)
							this.requestFlag = true;
						}
					})
				
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
				this.currentPage = 1; //页码回到第一页
				this.isShowNoMore = false; //是否继续请求
				this.swiperCurrent = index; //tab标签页下标
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
				if (!this.isShowNoMore) {
					this.currentPage++; //加载下一页
					this.getOrderInfo();
				}
			},

			//操作订单
			handleOrder(id, status, smsCode = '') {
				//恢复到第一页
				this.currentPage = 1;
				
				let data = {
					id,
					status,
					smsCode
				}

				this.$put('/merchant/store/order/status', data).then(res => {
					if (res.code === 0) {
						this.$successToast('操作成功');
						
						setTimeout(() => {
							//重新加载数据
							this.getOrderInfo();
						},1000)

						//如果是拒单，就在全部订单按钮上显示一个小红点
						status === 2 && uni.$emit('refuseBid', true);

						//关闭输入验证码弹窗
						this.codeDialog = false;
					} else {
						//如果是验证码输错就弹出专门的错误弹窗
						if (status === 4) {
							this.$refs.uToast.show({
								title: res.msg,
								type: 'error', 
								position : 'top',
							})
						} else {
							this.$errToast(res.msg)
						} 
					}
				})
			},

			//验证输入的验证码操作
			finishCode(code) {
				this.handleOrder(this.modal.id, this.modal.handleOrderStatus, code);
			},
			
			//核销输入验证码操作
			handleVerif() {
				uni.$on("handleVerif", res => {
					this.modal = Object.assign({}, res)
					this.codeDialog = true;
				});
			},

			//模态框中的确认按钮操作
			resOrderHandle() {
				//新订单中的操作&催单中的操作
				if (this.modal.modalIndex === 0 || this.modal.modalIndex === 2) {

					//接单操作
					this.modal.handleOrderStatus === 1 && this.handleOrder(this.modal.id, 1);

					//拒单操作					
					this.modal.handleOrderStatus === 2 && this.handleOrder(this.modal.id, 2);
				}

				//进行中订单的操作
				if (this.modal.modalIndex === 1) {
					//确认到店操作就打开输入验证码弹窗
					if (this.modal.handleOrderStatus === 4) {
						this.codeDialog = true;
					}

					//确认离店操作
					this.modal.handleOrderStatus === 6 && this.handleOrder(this.modal.id, 6);
				}
			},

			//进行中订单的模态框的未到店操作
			resCancelHandle() {
				//进行中订单的取消操作
				if (this.modal.modalIndex === 1) {
					//未到店操作
					this.modal.handleOrderStatus === 4 && this.handleOrder(this.modal.id, 3);
				}
			},

			//修改座位号/包间号操作
			updateSeatNum(seat) {
				let value = '';
				if(this.storeLocation == 3) {
					value = seat[1].value;
				} else {
					value = seat[0].value;
				}
				
				if(value) {
					//将页码改为1
					uni.$emit('currentPage',1);
					
					let data = {
						id : this.setNumber.id,
						value
					}
					
					this.$put('/merchant/store/order/seatOrRoom',data).then(res => {
						if(res.code === 0) {
							this.$successToast('修改成功')
							
							setTimeout(() => {
								//重新加载数据
								this.getOrderInfo();
							},1000)
							
							this.setNumber.updateSeat = false;
						} else {
							this.$errToast(res.msg)
						}
					})
				} else {
					this.setNumber.updateSeat = false;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.orderManagement-one{
		height: calc(100% - 200rpx);
	}
	.orderManagement-two{
		height: calc(100% - 200rpx);
	}
	.botm-tab-wrap {
		margin: 0 36rpx 26rpx;
	}

	/deep/ .u-badge--bg--error {
		background-color: #67A8FC;
	}

	.order-list-wrap {
		height: calc(100% - 110rpx);
		.swiper-box {
			height: 100%;
		}

		.scroll-view {
			height: 100%;
		}

	}
</style>

<template>
	<view class="order">
		<view class="tabBox">
			<view class="tabItem" @click="tabChange('')" :class="{active: type === ''}">
				全部
				<view class="border" v-if="type === ''"></view>
			</view>
			<view class="tabItem"  @click="tabChange('0')" :class="{active: type === '0'}">
				待付款
				<view class="border" v-if="type === '0'"></view>
			</view>
			<view class="tabItem"  @click="tabChange('1')" :class="{active: type === '1'}">
				已完成
				<view class="border" v-if="type === '1'"></view>
			</view>
		</view>
		<scroll-view scroll-y="true"  class="orderBox" v-if="list.length >0">
			<view class="orderItem" v-for="item in list" :key="item.id">
				<view class="top" @click="openOrderDetails(item.id)">
					<view class="left">
						{{item.mechanismName}}
					</view>
					<view class="right">
						<text v-if="item.orderStatus === 'success'" class="ok">已完成</text>
						<text v-if="item.orderStatus === 'execute'" class="no">待付款</text>
						<text v-if="item.orderStatus === 'close'">已失效</text>
					</view>
				</view>
				<view class="info" @click="openOrderDetails(item.id)">
					<view class="left">
						<image :src="item.picUrl" mode="aspectFill"></image>
						<text>{{item.picNums}}</text>
					</view>
					<view class="right">
						<view class="">
							所属活动：{{item.activity}}
						</view>
						<view class="">
							已选照片：{{item.picNums}}张
						</view>
						<view class="">
							订单金额：<text>￥{{item.amount}}</text>
						</view>
					</view>
				</view>
				<view class="itemBtnBox">
					<view class="btn" v-if="item.orderStatus === 'success'" @click="toSelectPhtot">
						再次购买
					</view>
					<view class="btn payBtn" v-if="item.orderStatus === 'execute'" @click="sendPay(item)">
						立即支付
					</view>
					<view class="btn delBtn" @click="deleteOrder(item)" v-if="item.orderStatus === 'execute'||item.status === 'close'">
						删除订单
					</view>
					
				</view>
			</view>
		</scroll-view>
		<view class="normal" v-if="list.length === 0">
			<image src="@/static/image/photo/orderNormal.png" />
			<text>还没有相关订单</text>
		</view>
		<deleteOrder ref="deleteOrder" @deleteSuccess="getOrderList()" />
	</view>
</template>

<script>
	import deleteOrder from '@/components/photo/deleteOrder.vue'
	import {getOrderList} from '@/api/pay.js'
	import {pay} from '@/base/pay.js'
	export default {
		components: {
			deleteOrder
		},
		data() {
			return {
				type: '',
				list: []
			};
		},
		onShow() {
			this.getOrderList()
		},
		methods: {
			tabChange(type) {
				this.type = type
				this.getOrderList()
			},
			deleteOrder(order) {
				this.$refs.deleteOrder.open(order.id)
			},
			openOrderDetails(orderId) {
				uni.navigateTo({
					url: `/pages/orderDetails/orderDetails?orderId=${orderId}`
				})
			},
			//前往选择照片页面
			toSelectPhtot() {
				uni.navigateTo({
					url: '/pageStudentImg/home/home',
					fail: (e) => {
						console.log(e);
					}
				})
			},
			getOrderList() {
				getOrderList({
					payStatus: this.type
				}).then(res => {
					if(+res.code === 0){
						console.log(res);
						
						this.list = res.data
					}
				})
			},
			sendPay(order) {
				uni.showLoading({
					mask: true,
					title: '支付中'
				})
				pay(order).then(() => {
					this.getOrderList()
				}).catch(() => {
					uni.showToast({
						icon: 'none',
						title: '支付失败'
					})
				}).finally(() => {
					uni.hideLoading()
				});
			}
		}
	}
</script>

<style lang="scss">
@import "./index.scss"
</style>

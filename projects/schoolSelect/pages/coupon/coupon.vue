<template>
	<view class="couponList">
		<view class="tabBox">
			<view class="tabItem" @click="tabChange('')" :class="{ active: type === '' }">
				全部
				<view class="border" v-if="type === ''"></view>
			</view>
			<view class="tabItem" @click="tabChange('0')" :class="{ active: type === '0' }">
				未使用
				<view class="border" v-if="type === '0'"></view>
			</view>
			<view class="tabItem" @click="tabChange('1')" :class="{ active: type === '1' }">
				已使用
				<view class="border" v-if="type === '1'"></view>
			</view>
		</view>
		<scroll-view class="couponListContent" scroll-y v-if="list.length>0">
			<view class="conponItem" v-for="item in list" :key="item.id" >
				<view class="itemContent">
					<view class="left">
						<view class="top">
							<view class="info_left">
								<image :src="item.activityUrl" mode="aspectFill"></image>
							</view>
							<view class="info_right">
								<text class="title">{{item.activity}}</text>
								<text class="time">{{item.vld}}</text>
							</view>
						</view>
						<view class="bottom" @click="openMore(item.id)">
							<text>使用条件</text>
							<image src="../../static/image/photo/down_Fill.png" mode="aspectFill"></image>
						</view>
					</view>
					<view class="right" :class="{no: item.isUse === 1}">
						<view class="num">
							￥
							<text>{{item.amount}}</text>
						</view>
						<view class="btn" @click="toDetails(item.id)">{{item.isUse === 0?'立即使用':'已使用'}}</view>
					</view>
				</view>
				<view class="itemMore" v-if="item.id === activeId">
					<view class="moreItem">
						使用地址：{{item.useAddress}}
					</view>
					<view class="moreItem">
						不可叠加：不能与其它卷叠加使用
					</view>
					<view class="moreItem">
						卡卷编号：{{item.id}}
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="normal" v-if="list.length === 0">
			<image src="@/static/image/photo/couponNormal.png" />
			<text>还没有相关兑换劵</text>
		</view>
	</view>
</template>

<script>
	import {getCouponsList} from '@/api/photo.js'
export default {
	data() {
		return {
			type: '',
			list: [],
			activeId: ''
		};
	},
	onLoad() {
		this.getCouponsList()
	},
	methods: {
		openMore(id) {
			this.activeId = id === this.activeId?'':id
		},
		tabChange(type) {
			this.type = type;
			this.getCouponsList()
		},
		toDetails(id) {
			uni.navigateTo({
				url: `/pages/couponDetails/couponDetails?id=${id}`
			})
		},
		//查询兑换卷列表
		getCouponsList() {
			getCouponsList({
				useStatus: this.type
			}).then(res => {
				if(+res.code === 0) {
					console.log(res);
					this.list = res.data
				}
			})
		}
	}
};
</script>

<style lang="scss">
@import './index.scss';
</style>

<template>
	<view class="selectImg">
		<view class="content" v-if="list.length>0">
			<view class="head">
				<view class="left">共{{ list.length }}张照片</view>
				<view class="right" v-if="!isAllSelect" @click="allSelectImg()">全选</view>
			</view>
			<view class="imgSelectBox" ref="imgSelectBox">
				<u-checkbox-group @change="selectImg">
					<view class="imgItem" :style="{ width: albumWidth + 'px', height: albumWidth + 'px' }" v-for="(item, index) in list" :key="index">
						<image @click="previewImg(item, index)" :src="`${activityInfo.picUrlPre}${list[index].fileUrl}${activityInfo.picUrlSuffix}`" mode="aspectFill" />
						<u-checkbox
							:name="item.id"
							v-if="item.isBuy === 0 && !isAllSelect"
							shape="circle"
							:checked="item.isSelect"
							activeColor="#F6A13E"
							inactiveColor="#ffffff"
							size="20px"
						></u-checkbox>
						<view v-if="item.isBuy === 1" class="payMore">已购买</view>
					</view>
				</u-checkbox-group>
			</view>
			
		</view>
		<view class="btnBox" v-if="list.length>0">
			<view class="selectNumBox">
				已有
				<text>{{activityInfo.payNums + 30}}</text>
				位家长选择
			</view>
			<view class="payBtnBox">
				<view class="numBox">
					<view class="selectNum">
						{{ selectNum }}
						<text>/</text>
						<text>{{ list.length }}</text>
					</view>
					<view class="more">已选择</view>
				</view>
				<view class="payInfoBox">
					<view class="left">
						<view class="top" v-if="!isAllSelect">
							<view class="originalPrice">已省:￥{{ allOriginalAmout - allAmount }}</view>
							<view class="total">
								合计:
								<text>￥{{ allAmount }}</text>
							</view>
						</view>
						<view class="top" v-else>
							<view class="originalPrice">已省:￥{{ ypProduct.originalAmout - ypProduct.amount }}</view>
							<view class="total">
								合计:
								<text>￥{{ ypProduct.amount }}</text>
							</view>
						</view>
						<view class="bottom">照片{{ dayjs().to(activityInfo.endTime) }}失效，付款后发送邮箱</view>
					</view>
					<view class="right"><view class="payBtn" @click="createOrder">提交</view></view>
				</view>
			</view>
		</view>
		<view class="normal" v-if="list.length === 0">
			<image src="@/static/image/photo/orderNormal.png" />
			<text>还没有相关订单</text>
		</view>
		<previewImg ref="previewImg" />
		<view class="tipsModal" v-if="show&&isTips">
			<view class="mask"></view>
			<view class="content">
				<view class="title">
					当前已选照片总价已超出打包购买价格，是否继续选择
				</view>
				<view class="subTitle">
					打包内容包括原片中未购买过的所有照片
				</view>
				<view class="tipsBtnBox">
					<view class="btn no" @click="show = false">
						取消
					</view>
					<view class="btn ok" @click="() => {
						show = false
						isTips = false
					}">
						确定
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import previewImg from '../components/previewImg.vue';
import { getShowPicList } from '@/api/photo.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);
export default {
	components: {
		previewImg,
	},
	computed: {
		selectNum() {
			return this.list.filter(item => item.isBuy === 0 && item.isSelect).length;
			// return 0;
		},
		ypProduct() {
			return this.productList.find(item => item.picType === 1);
		},
		allAmount() {
			const product = this.isAllSelect ? this.productList.find(item => item.picType === 1) : this.productList.find(item => item.picType === 2);
			const num = product ? this.selectNum * product.amount : 0;
			if(num>this.ypProduct.amount&&!this.isAllSelect){
				// console.log(1233)
				this.show = true
			}
			return num
		},
		allOriginalAmout() {
			const product = this.isAllSelect ? this.productList.find(item => item.picType === 1) : this.productList.find(item => item.picType === 2);

			return product ? this.selectNum * product.originalAmout : 0;
		}
	},
	data() {
		return {
			show: false,
			dayjs,
			imgNum: 43,
			albumWidth: 113,
			isAllSelect: false,
			activityInfo: {},
			isTips: true,
			list: [],
			productList: [],
		};
	},
	onLoad(data) {
		this.isAllSelect = data.type === '1';
		this.activityInfo = uni.getStorageSync('activityInfo');
		this.productList = uni.getStorageSync('photoProduct');
		this.list = uni.getStorageSync('showPicList');
		this.getShowPicList();
	},
	onShow() {
		this.computedData()
	},
	methods: {
		computedData() {
			const that = this;
			const query = uni.createSelectorQuery().in(this);
			query
				.select('.imgSelectBox')
				.boundingClientRect(data => {
					that.albumWidth = (data.width - 10) / 3;
				})
				.exec();
		},
		previewImg(img, index) {
			// console.log(`${this.activityInfo.picUrlPre}${this.list[index].fileUrl}${this.activityInfo.picUrlSuffix}`);
			uni.previewImage({
				urls: this.list.map(item => `${this.activityInfo.picUrlPre}${item.fileUrl}${this.activityInfo.picUrlSuffix}`),
				current: index
			});
		},
		allSelectImg(type = true) {
			const l = this.list.filter(item => !item.isSelect)
			type = l.length!== 0
			this.list = this.list.map(item => {
				item.isSelect = type;
				return item;
			});
		},
		selectImg(e) {
			if (this.isAllSelect) {
				this.list = this.list.map(item => {
					item.isSelect = true;
					return item;
				});
			} else {
				this.list = this.list.map(item => {
					item.isSelect = e.indexOf(item.id) > -1;
					return item;
				});
			}
		},
		createOrder() {
			const that = this;
			const list = that.list.filter(item => item.isSelect && item.isBuy === 0);
			if(this.selectNum === 0) {
				uni.showToast({
					icon: 'none',
					title: '未选择照片'
				})
				return
			}
			const createOrderInfo = {
				list: list,
				isAll: that.isAllSelect,
				allAmount: this.allAmount,
				allOriginalAmout: this.allOriginalAmout - this.allAmount
			};
			if (this.isAllSelect) {
				createOrderInfo.allAmount = this.ypProduct.amount;
				createOrderInfo.allOriginalAmout = this.ypProduct.originalAmout - this.ypProduct.amount 
			}
			uni.navigateTo({
				url: '/pageStudentImg/payInfo/payInfo',
				success(res) {
					res.eventChannel.emit('orderInfo', createOrderInfo);
					uni.setStorageSync('createOrderInfo', createOrderInfo);
				}
			});
		},
		//查询照片列表
		getShowPicList() {
			getShowPicList().then(res => {
				console.log(res);
				if (+res.code === 0) {
					this.list = res.data.map(item => {
						item.isSelect = false;
						item.imgUrl = `${this.activityInfo.picUrlPre}${item.fileUrl}${this.activityInfo.picUrlSuffix}`
						
						return item;
					});
					setTimeout(() => {
						this.computedData()
					}, 500)
					if (this.isAllSelect) {
						this.allSelectImg();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import './index.scss';
</style>

<template>
	<view class="deleteMadel" v-if="show">
		<view class="mask"></view>
		<view class="content">
			<view class="title">
				确定删除订单吗？
			</view>
			<view class="subTitle">
				删除后订单不可恢复
			</view>
			<view class="btnBox">
				<view class="btn" @click="close">
					取消
				</view>
				<view class="btn ok" @click="deleteOrder">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {deleteOrder} from '@/api/pay.js'
	export default {
		data() {
			return {
				show: false,
				orderId: ''
			}
		},
		methods: {
			open(orderId) {
				this.show = true
				this.orderId = orderId
			},
			close() {
				this.show = false
			},
			deleteOrder() {
				deleteOrder({
					id: this.orderId
				}).then(res => {
					if(+res.code === 0) {
						this.$emit('deleteSuccess')
					} else {
						uni.showToast({
							icon:'none',
							title: res.msg
						})
					}
				})
				this.close()
				
			},
		}
	}
</script>

<style lang="scss">
	.deleteMadel{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		.mask{
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			z-index: 1;
		}
		.content{
			width: 300px;
			height: 152px;
			background: #FFFFFF;
			border-radius: 24px;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 20px;
			box-sizing: border-box;
			z-index: 2;
			.title{
				color: #333333;
				font-weight: 700;
				font-size: 18px;
			}
			.subTitle{
				font-weight: 400;
				font-size: 13px;
				color: #333333;
				margin-top: 6px;
			}
			.btnBox{
				width: 100%;
				display: flex;
				justify-content: space-between;
				margin-top: 20px;
				.btn{
					width: 124px;
					height: 44px;
					background: #F2F2F2;
					border-radius: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: 400;
					font-size: 18px;
					color: #656980;  
					box-sizing: border-box;
					&.ok{
						background: linear-gradient(270deg, #FF8B02 5.36%, #FFAF51 100%);
						font-weight: 700;
						color: #FFFFFF;
					}
				}
			}
		}
	}
	
</style>
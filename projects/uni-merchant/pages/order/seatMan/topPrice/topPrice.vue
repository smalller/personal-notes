<template>
	<view>
		<navBar :switchUrl="'../../order'">抢座排号</navBar>
		<view class="header">
			<text>请输入当前线下最高竞价金额</text>
			 	<input type="number" v-model="price" class="inputFloor" placeholder-style="color:#ccc" placeholder="请输入金额"/>
		</view>
		<view class="comfirm" @click="goBack">确定</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				price:''
			}
		},
		methods: {
			goBack(){
				uni.showLoading({
					title:'保存中'
				})
				this.$post('/merchant/store/ly/setMoney',{"money": this.price})
				.then(res=>{
					if(res.code==0){
						uni.$emit("money", this.price)
						uni.switchTab({
							url:'../../order'
						})
					}else{
						uni.showToast({
							icon:'none',
							title:res.msg
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header{
		padding: 112rpx 40rpx 0 40rpx;
		font-size: 16px;
		
		text{
		color: #FF3636;	
		}
		.inputFloor{
			font-size: 16px;
			color: #000;
			height: 84rpx;
			border-radius: 10rpx;
			background-color: #f7f7f7;
			padding-left: 24rpx;
			margin-top: 24rpx;
		}

	}
	.comfirm{
		width: 212rpx;
		height: 72rpx;
		text-align: center;
		line-height: 72rpx;
		font-size: 32rpx;
		background-color: #67A8FC;
		border-radius: 10rpx;
		color: #fff;
		margin: 80rpx auto;
	}
</style>

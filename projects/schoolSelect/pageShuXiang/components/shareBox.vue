<template>
	<view class="shareBox" v-if="show">
		<view class="boxInfo">
			<view class="closeBtn" @click="close">
				<image src="../static/image/close.png" mode=""></image>
			</view> 
			<view class="heat">
				<image src="../static/image/heat.png" mode=""></image>
			</view>
			<view class="info">
				<text>您今日的点赞次数已用完</text>
				<text>可分享或购买获取点赞次数</text>
			</view>
			<view class="btnBox">
				<button @click="getPay">购买点赞次数</button>
				<button open-type="share">立即分享</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false
			}
		},
		methods: {
			init() {
				this.show = true
			},
			getPay() {
				this.$emit('pay')
				this.close()
			},
			close() {
				this.show = false
			}
		}
	}
</script>

<style lang="scss">
	.shareBox{
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		background: rgba(0,0,0,0.4);
		.boxInfo{
			width: 300px;
			background: #FFFFFF;
			border-radius: 8px;
			position: relative;
			.closeBtn{
				width: 32px;
				height: 32px;
				position: absolute;
				right: 14px;
				top: 14px;
				image{
					width: 100%;
					height: 100%;
				}
			}
			.heat{
				margin-top: 27px;
				display: flex;
				justify-content: center;
				image{
					width: 80px;
					height: 80px;

				}
			}
			.info{
				margin-top: 17px;
				display: flex;
				flex-direction: column;
				align-items: center;
				text{
					&:first-child{
						color: #333333;
						font-weight: 700;
						font-size: 18px;
					}
					&:last-child{
						margin-top: 6px;
						color: #FE5A6E;
						font-weight: 400;
						font-size: 16px;
					}
				}
			}
			.btnBox{
				padding: 20px;
				box-sizing: border-box;
				width: 100%;
				button{
					width: 100%;
					height: 44px;
					box-sizing: border-box;
					flex: 1;
					font-weight: 700;
					font-size: 18px;
					border: none;
					display: flex;
					align-items: center;
					justify-content: center;
					border-radius: 40px;
					overflow: hidden;
					color: #FFFFFF;
					&::before{
						border: none;
					}
					&::after{
						border: none;
					}
					&:nth-child(1){
						background: linear-gradient(270deg, #FF8B02 5.36%, #FFAF51 100%);
						&:active{
							background: linear-gradient(270deg, #e77c01 5.36%, #FFAF51 100%);
						}
					}
					&:nth-child(2){
						margin-top: 12px;
						border-top: 1px solid #EAEAEA;
						background: #289FF5;
					}
					
				}
			}
		}
	}
</style>

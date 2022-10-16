<template>
	<view class="shuXiangBox">
		<view class="shuXiangImg"><image src="../static/image/img.png" mode="widthFix"></image></view>
		<view class="shuXiangInfo">
			<text>报名通道将在4月23号正式开启</text>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss">
	.shuXiangBox{
		width: 100vw;
		.shuXiangImg{
			width: 100%;
			image{
				width: 100%;
			}
		}
		.shuXiangInfo{
			margin-top: 20px;
			display: flex;
			justify-content: center;
			text{
				font-size: 16px;
				color: #333333;
			}
		}
	}
</style>

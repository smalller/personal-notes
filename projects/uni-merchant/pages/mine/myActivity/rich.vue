<template>
	<view class="bigBox">
		<navBar :navigateUrl="'./addActivity'">活动详情</navBar>
		<view class="ruch">
			<jin-edit :html="html" @editOk="editOk" :showImgPrefix="showImgPrefix" :uploadFileUrl="action"></jin-edit>
		</view>
		
	</view>
</template>

<script>
	export default{
		data(){
			return{
				action: this.$fileUpload,
				showImgPrefix : this.$imgHead,
				html : '',
			}
		},
		mounted(){
			let _this = this
			uni.$on('rich',function(res){
				if(res){
					uni.setStorageSync('richs',_this.html)
					uni.navigateTo({
						url:`addActivity`
					})
					
				}
				
			})
		},
		onLoad(){
			this.id = uni.getStorageSync('text').id;
			this.html = uni.getStorageSync('richs');
		},
		methods:{
			editOk(res) {
				console.log(res)
				this.html = res.html
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bigBox{
		height: 100%;
	}
	.ruch{
		height: 100%;
		padding-top: 88rpx;
	}
</style>

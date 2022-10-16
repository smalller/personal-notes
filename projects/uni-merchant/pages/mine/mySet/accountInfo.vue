<template>
	<view>
		<view class="nav-bar-wrap">
			<text class="iconfont" @click="goBack">&#xe625;</text>
			<text>子账号</text>
			<text></text>
		</view>
		<view class="account">
			<view class="old-password">
				<input type="text" placeholder="请输入子账号名称" v-model="name" />
			</view>
			<view class="old-password">
				<input type="number" placeholder="请输入子账号手机号" v-model="phone" />
			</view>
			<view class="old-password">
				<input type="text" placeholder="请输入子账号密码" v-model="password" />
			</view>
			
			<view class="fx">
				<view class="btn save" @click="save">保存</view>
				<view class="btn cancel" @click="goBack">取消</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				name : '',
				phone : '',
				password : '',
				pid:'',
				id:'',
				
			}
		},
		onLoad(options) {
			if(options){
				this.name = options.name
				this.phone = options.phone
				this.id = options.id
			}
		},
		created() {
			let info = JSON.parse(uni.getStorageSync('uni-userInfo'))
			this.pid = info.pid
			this.storeAuth = info.storeAuth
		},
		methods: {
			goBack() {	
				uni.navigateTo({
					url:'./addAccount'
				})
			},
			
			
			
			save() {
				const data = {
					password:this.password,
					phone:this.phone,
					loginName:this.name,
					pid:this.pid,
					storeAuth:this.storeAuth
				}
				
				if (!data.loginName) {
					this.$errToast(`请输入子账号名称`);
					return;
				}
				if (!data.phone || !this.$phone(data.phone)) {
					this.$errToast(`请输入标准格式手机号`);
					return;
				}
				if (!data.password) {
					this.$errToast(`请输入登录密码`);
					return;
				}
				
					
				if(this.id){
					data['id'] = this.id
					this.$post('/merchant/store/modifyChildStoreAccount',data).then((res) => {
							if(res.code === 0) {
								uni.showToast({
									title: "修改成功",
									duration: 1000,
									success: (res) => {
										setTimeout(() => {
											this.goBack()
										},1000)
									}
								})
							} else {
								this.$errToast(res.msg);
							}
						}
					);
				}else{
					this.$post('/merchant/store/createChildAccount',data).then((res) => {
							if(res.code === 0) {
								uni.showToast({
									title: "新增成功",
									duration: 1000,
									success: (res) => {
										setTimeout(() => {
											this.goBack()
										},1000)
									}
								})
							} else {
								this.$errToast(res.msg);
							}
						}
					);
					
				}
				
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	uni-page-body {
		height: 100%;
		background-color: #f7f7f7;
	}
	.nav-bar-wrap {
		width: 100%;
		height: 88rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 24rpx;
		
		.iconfont {
			font-size: 32rpx;
		}
	}
	.account{
		padding: 30rpx 20rpx;
	}
	.old-password {
		margin-bottom: 20rpx;
		input{
			font-size: 30rpx;
			padding: 0 56rpx;
			background-color: #EDEDED;
			height: 100rpx;
			box-sizing: border-box;
			border-radius: 6rpx;
			color: #999999;
		}
	}
	.fx{
		display: flex;
		justify-content: space-between;
		height: 76rpx;
		.save{
			background: #67a8fc;
			color: #fff;
		}
		.cancel{
			background: #EDEDED;
			color: #333333;
		}
			
		.btn{
			height: 100%;
			width: 192rpx;
			text-align: center;
			line-height: 76rpx;
			font-size: 30rpx;
			border-radius: 6rpx;
		}
	}




</style>

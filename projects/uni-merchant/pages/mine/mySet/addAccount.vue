<template>
	<view>
		<view class="nav-bar-wrap">
			<text class="iconfont" @click="goBack">&#xe625;</text>
			<text>子账号</text>
			<text></text>
		</view>
		<view class="account">
			<view class="add" @click="add">添加账号</view>
			<view class="account_ul">
				<view class="account_li" v-for="(item,index) in  accountArr" :key="index">
					<view class="account_no">账号{{index+1}}:</view>
					<view class="account_info">
						<view class="li">
							<text class="ac_name">子账号名称：</text>
							<text class="ac_content">{{item.loginName}}</text>
						</view>
						<view class="li">
							<text class="ac_name">子账号手机号：</text>
							<text class="ac_content">{{item.phone}}</text>
						</view>
					</view>
					<view class="fx">
						<view class="btn save" @click="update(item)">修改</view>
						<view :class="item.disable==1?'':'red'" class="btn save" @click="enable(item,index)"> {{item.disable==1?'已启用':'已禁用'}}</view>
						<view class="btn cancel" @click="remove(item,index)">删除</view>
					</view>
				</view>
			</view>
		</view>
		
		
		<u-modal v-model="modalShow" :show-title="false" :show-cancel-button="true" :mask-close-able="true" :content="modalContent"
		 @confirm="resModalHandle" @cancel="resCancelModal"></u-modal>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				oldPassword : '',
				newPassword : '',
				sureNewPassword : '',
				accountArr:[],
				modalShow:false,
				modalContent:'',
				present:{
					index:'',
					value:'',
				}
			}
		},
		created() {
			this.accountList()
		},
		methods: {
			goBack() {	
				uni.navigateTo({
					url:'./mySet'
				})
			},
				
			add(){
				uni.navigateTo({
					url:'./accountInfo'
				})
			},
				
			remove(val,index){
				this.modalContent = '是否删除当前账号';
				this.modalShow = true;
				this.present.index = index
				this.present.value = val
			},
			update(val){
				uni.navigateTo({
					url:`./accountInfo?name=${val.loginName}&phone=${val.phone}&id=${val.id}`
				})
			},
				
			enable(val,index){
				this.$post(`/merchant/store/disableChildAccount`,{id:val.id}).then((res) => {
					if(res.code == 0){
						this.$set(val,'disable',val.disable==1?0:1)
					}else{
						this.$errToast(res.msg);
					}
				})    
			},
			resModalHandle(){
				this.$post('/merchant/store/deleteChildStoreAccount',{id:this.present.value.id}).then((res) => {
						if(res.code === 0) {
							this.$successToast(`删除成功`);
							this.accountArr.splice(this.present.index, 1);
						} else {
							this.$errToast(res.msg);
						}
					}
				);
			},
				
			resCancelModal(){
				this.modalShow = false
			},
			
			accountList() {
				this.$post('/merchant/store/getAllChildAccount').then((res) => {
						if(res.code === 0) {
							this.accountArr = res.data
						} else {
							this.$errToast(res.msg);
						}
					}
				);
				
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
		.add{
			background: #E3E3E3;
			height: 100rpx;
			color: #222222;
			font-size: 30rpx;
			line-height: 100rpx;
			text-align: center;
		}
	}
	.account_ul{
		margin-top: 50rpx;
		.account_li{
			border-top: 2rpx solid #EBEBEB;
			padding: 30rpx 0;
				
			.account_no{
				margin-bottom: 34rpx;
				font-weight: 600;
			}
			.li{
				margin-bottom: 24rpx;
				.ac_name{
					color: #333333;
					font-size:28rpx;
				}
				.ac_content{
					color: #999999;
					font-size:26rpx;
				}
			}
			.fx{
				display: flex;
				justify-content: space-between;
				height: 76rpx;
				margin-top: 20rpx;
				.save{
					background: #67a8fc;
					color: #fff;
				}
				.red{
					background: #FF3636;
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
		}
	}
		
	
	

</style>

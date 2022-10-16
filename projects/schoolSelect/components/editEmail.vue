<template>
	<view class="editEmail" v-if="show">
		<view class="mask"></view>
		<view class="modal">
			<view class="title">填写邮箱地址</view>
			<view class="formBox">
				<u--form :model="formData" ref="formBox">
					<u-form-item prop="email"><u--input v-model="formData.email" border="bottom" placeholder="输入邮箱"></u--input></u-form-item>
					<u-form-item prop="email2"><u--input v-model="formData.email2" border="bottom" placeholder="再次输入邮箱"></u--input></u-form-item>
				</u--form>
			</view>
			<view class="btnBox">
				<view class="left" @click="show = false">取消</view>
				<view class="right" @click="changeEmail">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {editEmail} from '@/api/login.js'
	import store from '@/store'
export default {
	data() {
		return {
			show: false,
			formData: {
				email: '',
				email2: ''
			},
			rules: {
				email: [
					{
						type: 'string',
						required: true,
						trigger: ['change', 'blur'],
						message: '此为必填字段'
					},
					{
						type: 'string',
						trigger: ['change', 'blur'],
						validator: (rule, value, callback) => {
							return uni.$u.test.email(value);
						},
						message: '必须为邮箱地址'
					}
				],
				email2: [
					{
						type: 'string',
						required: true,
						trigger: ['change', 'blur'],
						message: '此为必填字段'
					},
					{
						type: 'string',
						trigger: ['change', 'blur'],
						validator: (rule, value, callback) => {
							return uni.$u.test.email(value);
						},
						message: '必须为邮箱地址'
					},
					{
						type: 'string',
						trigger: ['change', 'blur'],
						validator: (rule, value, callback) => {
							return value === this.formData.email;
						},
						message: '两次邮箱地址不一致'
					}
				]
			}
		};
	},
	mounted() {
		
	},
	methods: {
		open() {
			this.show = true;
			console.log(123);
			setTimeout(() => {
				this.$refs.formBox.setRules(this.rules);
			}, 500)
			this.formData = {
				email: '',
				email2: ''
			};
		},
		changeEmail() {
			this.$refs.formBox
				.validate()
				.then(() => {
					editEmail(this.formData).then(res => {
						if(+res.code === 0) {
							uni.showToast({
								icon: 'none',
								title: '修改邮箱成功'
							})
							this.show = false
							store.commit('setEmail', this.formData.email)
						} else {
							uni.showToast({
								icon: 'none',
								title: res.msg
							})
						}
					})
				})
				.catch((e) => {
					uni.showToast({
						icon: 'none',
						title: e.msg
					})
				}).finally(() => {
					
				})
		}
	}
};
</script>

<style lang="scss">
.editEmail {
	width: 100vw;
	height: 100vh;
	position: fixed;
	z-index: 1000;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	.mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		z-index: -1;
	}
	.modal {
		background: #fff;
		width: 300px;
		// height: 230px;
		border-radius: 24px;
		padding: 20px;
		box-sizing: border-box;
		.title {
			width: 100%;
			display: flex;
			justify-content: center;
			color: #333333;
			font-weight: 700;
			font-size: 18px;
			margin-bottom: 12px;
		}
		.u-form-item {
			// height: 45px;
		}
		.u-form-item__body {
			// padding: 0;
		}
		.u-input {
			height: 45px;
			border-color: #ebebeb;
			box-sizing: border-box;
		}
	}
	.btnBox {
		margin-top: 20px;
		display: flex;
		justify-content: space-between;
		view {
			height: 44px;
			flex: 1;
			border-radius: 40px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.left {
			margin-right: 12px;
			background: #f2f2f2;
			color: #656980;
		}
		.right {
			background: linear-gradient(270deg, #ff8b02 5.36%, #ffaf51 100%);
			color: #ffffff;
		}
	}
}
</style>

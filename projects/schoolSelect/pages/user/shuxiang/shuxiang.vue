<template>
	<view class="userWork">
		<view class="work-item" v-for="item in workList" :key="item.id" @click="openWorkShare(item)">
			<view class="work-cover">
				<image :src="item.worksCover" mode="widthFix"></image>
			</view>
			<view class="work-title">
				<text>{{item.worksTitle}}</text>
			</view>
			<view class="work-user">
				<view class="user-left">
					<image :src="item.headerImg" mode="aspectFill"></image>
					<text>{{item.publishName}}</text>
				</view>
				<view class="user-right" v-if="item.enableStatus === 1">
					<text>{{item.pointCount}}</text>
					<u-icon class="heart" color="#FF7D6B" name="heart-fill" size="17px"></u-icon>
				</view>
				<view class="work-status" @click="openWorkShare(item)" :class="{refuse:item.enableStatus === 9, ok: item.enableStatus === 1}">
					<text v-if="item.enableStatus === 0">审核中</text>
					<button v-if="item.enableStatus === 1" open-type="share">分享作品</button>
					<text  v-if="item.enableStatus === 9">未通过</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {getUserWork} from '../../../api/shuxiang.js'
	export default {
		data() {
			return {
				workList: [],
				workInfo: {},
				group: [
					{
						title: 'A',
						age: '0-2岁',
						type: '个人',
						index: 1,
					},
					{
						title: 'B',
						age: '0-2岁',
						type: '团体',
						index: 2,
					},
					{
						title: 'C',
						age: '3-6岁',
						type: '个人',
						index: 3,
					},
					{
						title: 'D',
						age: '3-6岁',
						type: '团体',
						index: 4,
					}
				]
			}
		},
		onLoad() {
			this.getUserWork()
		},
		onShareAppMessage() {
			const promise = new Promise(resolve => {
				setTimeout(() => {
					resolve({
						title: `我是${this.workInfo.publishName}小朋友，正在参加书香天府阅读比赛，目前排名第${this.workInfo.num}，请帮我点赞吧，每天可点5次哦！`,
						path: '/pageShuXiang/shuXiang/shuXiangDetail?id=' + this.workInfo.id,
						imageUrl: this.workInfo.worksCover,
					});
				}, 2000);
			});
			
			return {
				promise
			};
		},
		onShareTimeline() {
			return {
				title: '自定义转发标',
				path: '/pageShuXiang/shuXiang/shuXiangDetail',
				imageUrl: this.workInfo.worksCover,
				query: {
					id: this.workInfo.id
				}
			}
		},
		methods: {
			//查询自己的作品列表
			getUserWork() {
				getUserWork().then(res => {
					if(+res.code === 0) {
						this.workList = res.data
					}
				})
			},
			openWorkShare(item) {
				if(item.enableStatus === 1) {
					this.workInfo = item
				}
			}
		}
	}
</script>

<style lang="scss">
	@media screen and (min-width: 768px) and (max-width: 1023.98px) {
		.userWork {
			width: 100vw;
			columns: 3;
			column-gap: 20px;
		}
	}
	
	.userWork {
		width: 100%;
		min-height: 100vh;
		columns: 2;
		column-gap: 10px;
		padding: 30px 15px;
		box-sizing: border-box;
		background: #F6F6F6;
		.work-item {
			width: 100%;
			break-inside: avoid;
			margin-top: 0px;
			margin-bottom: 10px;
			background: #FFFFFF;
			border-radius: 4px;
			overflow: hidden;
			position: relative;
			.work-cover{
				width: 100%;
				border-radius: 4px;
				overflow: hidden;
				image{
					border-radius: 4px;
					width: 100%;
				}
			}
			.work-title{
				padding: 0 8px;
				box-sizing: border-box;
				margin-top: 6px;
				text{
					font-weight: 500;
					color: #333333;
					font-size: 14px;
				}
			}
			.work-user{
				width: 100%;
				justify-content: space-between;
				align-items: center;
				display: flex;
				padding: 10px 8px 6px;
				box-sizing: border-box;
				.user-left{
					display: flex;
					align-items: center;
					image{
						width: 20px;
						height: 20px;
						border-radius: 50%;
						margin-right: 4px;
					}
					text{
						font-weight: 500;
						color: #7C7C7C;
						font-size: 10px;
					}
				}
				.user-right{
					display: flex;
					align-items: center;
					text{
						margin-right: 4px;
						color: #C4C4C4;
						font-size: 12px;
					}
				}
			}
			.work-status{
				position: absolute;
				top: 0;
				left: 0;
				height: 22px;
				padding: 0 9px;
				box-sizing: border-box;
				background: linear-gradient(270deg, #F6A13E 0%, #FEC685 100%);
				border-radius: 4px 0px 4px 0px;
				&.refuse{
					background: linear-gradient(270deg, #F63E3E 0%, #FF7676 100%);
				}
				&.ok {
					background: linear-gradient(270deg, #00aa00 0%, #00ff7f 100%);
					button{
						display: flex;
						align-items: center;
						justify-content: center;
						width: 100%;
						height: 100%;
						border: none;
						font-weight: 500;
						color: #FFFFFF;
						font-size: 12px;
						background-color: rgba(0, 0, 0, 0);
						padding: 0;
						margin: 0;
						&::before{
							border: none;
						}
						&::after{
							border: none;
						}
					}
				}
				text{
					font-weight: 500;
					color: #FFFFFF;
					font-size: 12px;
				}
			}
		}
	}
</style>

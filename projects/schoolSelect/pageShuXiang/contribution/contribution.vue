<template>
	<view class="contribution">
		<view class="contributionHead"  @click="openSelectGroup">
			<view class="left">
				<text>参赛组别</text>
			</view>
			<view class="right">
				<text>{{selectGroupText}}</text>
				<u-icon name="arrow-right" />
			</view>
		</view>
		<view class="selectTypeBox">
			<view class="selectTypeTitle">
				<text>选择作品类型</text>
				<u-icon name="question-circle-fill" size="14px" color="#ff7d6b"/>
			</view>
			<view class="selectTypeContent">
				<view class="typeItem" v-for="item in typeList" :key="item.type">
					<text>{{item.title}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { group } from '../base/config.js';
	const groupList = group.filter(item => item.type === '团体')
	export default {
		data() {
			return {
				group:groupList,
				selectGroupText: `${groupList[0].title}组-${groupList[0].type}作品(${groupList[0].age})`,
				selectGroup: groupList[0],
				typeList: [
					{
						type: 'video',
						title: '视频',
						tips: '单个作品限8分钟内'
					},
					{
						type: 'image',
						title: '图片',
						tips: '单个作品限10张内'
					},
					{
						type: 'audio',
						title: '音频',
						tips: '单个作品限8分钟内'
					},
				]
			};
		},
		methods: {
			//选择组别
			openSelectGroup() {
				const that = this;
				uni.showActionSheet({
					itemList: this.group.map(item => `${item.title}组-${item.type}作品(${item.age})`),
					success(e) {
						that.selectGroup = that.group[e.tapIndex];
						that.selectGroupText = `${that.selectGroup.title}组-${that.selectGroup.type}作品(${that.selectGroup.age})`;
					}
				});
			},
		}
	}
</script>

<style lang="scss">
.contribution{
	width: 100vw;
	>view{
		width: 100%;
		padding: 0 15px;
		box-sizing: border-box;
	}
	.contributionHead{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 18px 15px;
		box-sizing: border-box;
		border-bottom: 1px solid #F6F7F9;
		.left{
			text{
				font-weight: 500;
				color: #6A6A6A;
				font-size: 14px;
			}
		}
		.right{
			display: flex;
			text{
				font-weight: bold;
				color: #333333;
				font-size: 14px;
			}
		}
	}
}
</style>

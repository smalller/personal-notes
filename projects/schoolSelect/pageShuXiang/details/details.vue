<template>
	<view class="detailsBox">
		<scroll-view class="msgContent" scroll-y="true">
			<view>
				<view class="msgItem" v-for="item in msgList" :key="item.uuid">
					<view class="msgUserPic">
						<u-avatar v-if="item.userPortait" :src="item.userPortait"></u-avatar>
						<u-avatar v-else text="无头像"></u-avatar>
					</view>
					<view class="msgInfo">
						<view class="msgUserName">
							<text>{{ item.sysUserName }}</text>
						</view>
						<view class="msgTime">
							<text>{{ $u.timeFormat(item.createTime, 'yyyy-mm-dd') }}</text>
						</view>
						<view class="msgText">
							<text>{{ item.comment }}</text>
						</view>
						<!-- <view class="msgMore">
							<view class="moreItem">
								<text>
									<text class="moreUserName">张无忌：</text>
									取取织每龙飞身性见必，北社里级革美理工 地只十龙刷众什五束关。
								</text>
							</view>
							<view class="moreBtn"><text type="default">展开全部18条评论</text></view>
						</view> -->
						<view class="msgMoreIcon"><image src="../../static/message.png" mode=""></image></view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		},
	}
</script>

<style lang="scss">
.detailsBox{
	.msgContent {
		flex: 1;
		background: #ffffff;
		> view {
			padding-top: 2px;
		}
		.msgItem {
			display: flex;
			box-sizing: border-box;
			padding: 16px 15px;
			.msgUserPic {
				margin-right: 8px;
			}
			.msgInfo {
				border-bottom: 1px solid #f6f7f9;
				flex: 1;
				.msgUserName {
					font-weight: 500;
					color: #333333;
					font-size: 14px;
				}
				.msgTime {
					font-weight: 400;
					color: #b0b0b0;
					font-size: 10px;
					margin-top: 4px;
				}
				.msgText {
					margin-top: 8px;
					font-size: 14px;
					font-weight: 400;
					color: #585858;
				}
				.msgMore {
					margin-top: 8px;
					padding: 10px;
					background: #f6f6f6;
					.moreItem {
						margin-top: 8px;
						&:first-child {
							margin-top: 0;
						}
						text {
							color: #585858;
							font-size: 12px;
							.moreUserName {
								font-weight: 500;
								color: #333333;
							}
						}
					}
					.moreBtn {
						margin-top: 8px;
	
						text {
							font-size: 12px;
							font-weight: 500;
							color: #487bc7;
						}
					}
				}
				.msgMoreIcon {
					margin-top: 4px;
					display: flex;
					justify-content: flex-end;
					padding-bottom: 8px;
					image {
						width: 20px;
						height: 20px;
					}
				}
			}
		}
	}
}
</style>

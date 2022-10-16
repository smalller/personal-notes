<template>
	<view class="myVideo">
		<video
			v-if="isTry"
			:id="videoId"
			:duration="tryTime"
			:autoplay="autoplay"
			playBtnPosition="center"
			:poster="poster"
			@play="videoPlay"
			@ended="videoEnd()"
			@timeupdate="videoLengthChange"
			:src="src"
		></video>
		<video v-else :id="videoId" :autoplay="autoplay" :poster="poster" playBtnPosition="center" @play="videoPlay" @ended="videoEnd()" @timeupdate="videoLengthChange" :src="src"></video>
	</view>
</template>

<script>
export default {
	name: 'myVideo',
	props: {
		vip: {
			type: Boolean,
			default: () => false
		},
		isTry: {
			type: Boolean,
			default: () => false
		},
		amount: {
			type: Number,
			default: 0.01
		},
		src: {
			type: String,
			default: ''
		},
		poster: {
			type: String,
			default: ''
		}
	},
	computed: {
		isLogin: function() {
			let status = false;
			if (this.$store.getters) {
				status = this.$store.getters.userId && this.$store.getters.token;
			}
			return status;
		}
	},
	data() {
		return {
			videoId: new Date().getTime().toString(),
			videoContent: null,
			autoplay: false,
			tryTime: 10
		};
	},
	onReady: function() {
		this.videoContent = uni.createVideoContext(this.videoId, this);
	},
	onLoad() {
		
	},
	methods: {
		setPlay(src, opt = {}) {},
		videoPlay(e) {
			if(this.isLogin) {
			} else {
				this.videoContent.stop();
				this.videoContent.seek(0);
				this.$login()
				uno.$on('login', () => {
					
				})
			}
		},
		addVideoStatus() {
			if (this.isTry) {
				// this.videoContent.stop();
				return;
			}
		},
		videoEnd() {
			console.log('videoEnd');
		},
		videoLengthChange(e) {
		}
	}
};
</script>

<style lang="scss">
.myVideo {
	width: 100%;
	height: 100%;
	video {
		width: 100%;
		height: 100%;
	}
}
</style>

<script>
// import amap from './sdk/amap-wx.130.js';
export default {
	onLaunch: function() {
		// this.getLocation();
		this.$login();
		
		
	},
	onShow: function() {
		console.log('App Show');
		
	},
	onHide: function() {
		console.log('App Hide');
	},
	methods: {
		//获取用户位置
		// getLocation() {
		// 	const amapPlugin = new amap.AMapWX({
		// 		key: '8b7ad04c932db43c9c8219563d0bccf7'
		// 	});
		// 	amapPlugin.getRegeo({
		// 		success: data => {
		// 			const e = data[0];
		// 			this.locationData = e.regeocodeData.addressComponent;
		// 			uni.setStorageSync('location', JSON.stringify(e));
		// 		}
		// 	});
		// },
	}
};
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
/*每个页面公共css */
</style>

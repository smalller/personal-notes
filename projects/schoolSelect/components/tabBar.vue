<template>
	<u-tabbar :value="active" @change="routerChange" :fixed="true" :placeholder="false" :safeAreaInsetBottom="false">
		<u-tabbar-item text="首页" icon="home" name="home"></u-tabbar-item>
		<u-tabbar-item text="我的" icon="account" ></u-tabbar-item>
	</u-tabbar>
</template>

<script>
export default {
	name: 'tabBar',
	data() {
		return {
			active: ''
		};
	},
	methods: {
		routerChange(e) {
			console.log(e)
		}
	}
};
</script>

<style lang="scss"></style>

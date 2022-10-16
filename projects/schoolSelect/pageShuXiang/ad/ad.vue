<template>
	<view>
		<web-view :src="src"></web-view>
	</view>
</template>

<script>
	import {wxAtob} from '../../base/common.js'
	export default {
		data() {
			return {
				src: ''
			}
		},
		methods: {
			
		},
		onLoad(e) {
			this.src = wxAtob(e.url)
		}
	}
</script>

<style>

</style>

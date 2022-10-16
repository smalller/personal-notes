<template>
	<u-popup :show="show" mode="bottom" class="selectDevision" @close="close" title="选择地区" :safeAreaInsetBottom="true" :round="10">
		<view class="ctrBox">
			<view class="" @click="close"><text>取消</text></view>
			<view class="" @click="confirm"><text>确定</text></view>
		</view>
		<picker-view class="cityBox" v-if="show" @change="bindPickerChange" @pickstart="look = true" @pickend="look = false" :indicator-style="indicatorStyle" :value="value">
			<picker-view-column>
				<view class="item" v-for="(item, index) in city" :key="index">{{ item.label }}</view>
			</picker-view-column>
			<picker-view-column>
				<view class="item" v-for="(item, index) in area" :key="index">{{ item.label }}</view>
			</picker-view-column>
		</picker-view>
	</u-popup>
	<!-- <u-picker :show="show" ref="uPicker" :columns="city" keyName="label" @cancel="close()" @confirm="confirm" @change="bindPickerChange"></u-picker> -->

</template>

<script>
import city from '../base/city.js';
export default {
	data() {
		return {
			show: false,
			dataIndex: 0,
			city: city,
			area: [],
			value: [0,0],
			indicatorStyle: `height: 50px;`,
			devision: [],
			look: false
		};
	},
	onReady() {
		// this.init();
	},
	methods: {
		init(division) {
			const that = this;
			this.dataIndex = 0;
			
			const picker = this.$refs.uPicker;
			if (division) {
				const divisions = division.split('-');
				city.forEach((item, index) => {
					if (item.label === divisions[0]) {
						const i = item.list.findIndex(data => data.label === divisions[1]);
						that.area = item.list
						this.value = [index, i]
						this.show = true;
					}
				});
			} else {
				// picker.setColumnValues(1, city[this.dataIndex].list);
			}
			
		},
		bindPickerChange(e) {
			const picker = this.$refs.uPicker;
			this.dataIndex = e.index;
			this.value = e.detail.value;
			this.area = city[e.detail.value[0]].list;
			if (e.columnIndex === 0) {
				// picker为选择器this实例，变化第二列对应的选项
				// picker.setColumnValues(1, city[e.index].list);
			}
		},
		close() {
			this.show = false;
		},
		confirm() {
			if(this.look){
				return
			}
			this.show = false;
			const area = city[this.value[0]].list;
			const devision ={
				value: [city[this.value[0]], area[this.value[1]]]
			}
			this.$emit('select', devision);
		}
	}
};
</script>

<style lang="less">
.ctrBox {
	display: flex;
	justify-content: space-between;
	height: 40px;
	view {
		box-sizing: border-box;
		width: 100px;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
}
.cityBox {
	height: 400rpx;
	margin-top: 20rpx;

	.item {
		display: flex;
		height: 50px;
		align-items: center;
		justify-content: center;
		text-align: center;
	}
}
</style>

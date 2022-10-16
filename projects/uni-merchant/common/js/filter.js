import Vue from 'vue'
import date from './date.js'

//手机号
Vue.filter("phoneNum", function(oldVal) {
	let newVal = oldVal.replace(oldVal.slice(3, 7), "****");
	return newVal;
});

//申请商家推荐状态
Vue.filter("recoType", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 1:
			newVal = '申请店铺推荐';
			break;
		case 2:
			newVal = '推荐位申请中';
			break;
		case 3:
			newVal = '店铺已被推荐';
			break;
	}
	return newVal;
})

//商家上下架状态
Vue.filter("putawayStatus", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 1:
			newVal = '店铺下线申请';
			break;
		case 2:
			newVal = '店铺上线申请';
			break;
		case 3:
			newVal = '申请中';
			break;
	}
	return newVal;
})

//店铺类型
Vue.filter("shopType", function(oldVal) {
	let newVal = "";
	switch (oldVal) {
		case 1:
			newVal = "夜店";
			break;
		case 2:
			newVal = "清吧";
			break;
		case 3:
			newVal = "ktv";
			break;
	}
	return newVal;
});

//座位类型
Vue.filter("seatType", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 0:
			newVal = '无要求';
			break;
		case 1:
			newVal = '卡座';
			break;
		case 2:
			newVal = '散台';
			break;
		case 3:
			newVal = '独立高脚凳';
			break;
	}
	return newVal;
})

//星期几
Vue.filter("dayOfWeek", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 1:
			newVal = '星期一';
			break;
		case 2:
			newVal = '星期二';
			break;
		case 3:
			newVal = '星期三';
			break;
		case 4:
			newVal = '星期四';
			break;
		case 5:
			newVal = '星期五';
			break;
		case 6:
			newVal = '星期六';
			break;
		case 7:
			newVal = '星期日';
			break;
	}
	return newVal;
})

//支付方式
Vue.filter("payType", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 0:
			newVal = '支付宝支付';
			break;
		case 1:
			newVal = '微信支付';
			break;
		case 2:
			newVal = '会员卡支付';
			break;
		case 3:
			newVal = '优惠券支付';
			break;
		case 4:
			newVal = '现金支付';
			break;
	}
	return newVal;
})

//包间属性
Vue.filter("roomType", function(oldVal, ktvTypeOpt) {
	let newVal = '';
	ktvTypeOpt.forEach(item => {
		if (oldVal == item.id) {
			newVal = item.name;
		}
	})
	return newVal;
})

//支付状态
Vue.filter("payStatus", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 0:
			newVal = '未支付';
			break;
		case 1:
			newVal = '已支付';
			break;
	}
	return newVal;
})

//支付类型
Vue.filter("payWay", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 0:
			newVal = '支付宝';
			break;
		case 1:
			newVal = '微信';
			break;
		case 2:
			newVal = '会员积分';
			break;
	}
	return newVal;
})

//订单属性
Vue.filter("orderType", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 0:
			newVal = '预定桌';
			break;
		case 1:
			newVal = 'AA拼单';
			break;
		case 2:
			newVal = '抢座';
			break;
		case 3:
			newVal = '会员卡';
			break;
		case 4:
			newVal = '线下添单';
			break;
	}
	return newVal;
})

// 订单类型
Vue.filter("orderProperty", function(oldVal, newVal) {
	if (newVal.length > 0) {
		let newVals = '';
		for (let i = 0; i < newVal.length; i++) {
			switch (oldVal) {
				case newVal[i].value:
					newVals = newVal[i].label;
					break;
			}
		}
		return newVals;
	}

})
//订单状态
Vue.filter("orderStatus", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 1:
			newVal = '已接单';
			break;
		case 2:
			newVal = '已拒绝';
			break;
		case 3:
			newVal = '未到店';
			break;
		case 4:
			newVal = '已到店';
			break;
		case 5:
			newVal = '未消费';
			break;
		case 6:
			newVal = '已离开';
			break;
	}
	return newVal;
})

// 价格保留两位
Vue.filter("returnFloat", function(value) {
	if (value) {
		var value = Math.round(parseFloat(value) * 100) / 100;
		var xsd = value.toString().split(".");
		if (xsd.length == 1) {
			value = '￥' + value.toString() + ".00";
			return value;
		}
		if (xsd.length > 1) {
			if (xsd[1].length < 2) {
				value = '￥' + value.toString() + "0";
			} else {
				value = '￥' + value.toString();
			}
			return value;
		}
	} else {
		return '￥0.00'
	}

})

// 时间只有年月日
Vue.filter("dateyear", function(value) {
	if (value) {
		var value = value.substring(0, value.indexOf(' '))
		return value
	}
})

//APP要展示的商品分类
Vue.filter("showAppGoodsType", function(oldVal) {
	let newVal = '';
	switch (oldVal) {
		case 1:
			newVal = '套餐';
			break;
		case 2:
			newVal = '威士忌';
			break;
		case 3:
			newVal = '白兰地';
			break;
		case 4:
			newVal = '伏特加';
			break;
		case 5:
			newVal = '香槟';
			break;
		case 6:
			newVal = '红酒';
			break;
		case 7:
			newVal = '啤酒';
			break;
		case 8:
			newVal = '鸡尾酒';
			break;
		case 9:
			newVal = '小吃';
			break;
		case 10:
			newVal = '其它';
			break;
		case 11:
			newVal = '会员卡';
			break;
		case 12:
			newVal = '果酒';
			break;
		case 13:
			newVal = '利口酒';
			break;
		case 14:
			newVal = '朗姆酒';
			break;
		case 15:
			newVal = '金酒';
			break;
		case 16:
			newVal = '其他酒类';
			break;
		case 17:
			newVal = '米酒';
			break;
	}
	return newVal;
})

/*
时间戳转为字符格式的时间
type
   1.年月日时分秒
   2.年月日
   3.年月日时分
   4.时分
   5.年月
   6.月日时分
*/
Vue.filter("timestampTodate", function(oldVal, type) {
	let newVal = '';
	newVal = date.timeData(oldVal, type);
	return newVal;
})

//消息记录里的时间
Vue.filter("formatTime", function(time) {
	var s1 = new Date(time),
		s2 = new Date(),
		runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
	var year = Math.floor(runTime / 86400 / 365);
	runTime = runTime % (86400 * 365);
	var month = Math.floor(runTime / 86400 / 30);
	runTime = runTime % (86400 * 30);
	var day = Math.floor(runTime / 86400);
	runTime = runTime % 86400;
	var hour = Math.floor(runTime / 3600);
	runTime = runTime % 3600;
	var minute = Math.floor(runTime / 60);
	runTime = runTime % 60;
	var second = runTime;

	if (year > 0 || month > 0) {
		return date.timeData(time, 3)
	}

	if (day > 0) {
		return date.timeData(time, 3)
	}

	if (hour > 0 && hour <= 3) {
		return hour + '小时前'
	}

	if (hour > 3) {
		return date.timeData(time, 4)
	}

	if (minute > 0 && minute <= 10) {
		return minute + '分钟前'
	}

	if (minute > 10) {
		return date.timeData(time, 4)
	}

	if (second > 0) {
		return '刚刚'
	}
})

//回显每个座位号时，不要带上楼层号
Vue.filter("substrSeatNum", function(oldVal) {
	const index = oldVal.indexOf('-');
	oldVal = oldVal.substr(index + 1);
	return oldVal;
})

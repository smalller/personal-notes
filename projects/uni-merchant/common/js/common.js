//加载转圈方法
function showLoading(title = '加载中') {
	uni.showLoading({
		mask: true,
		title
	});
}

//错误提示弹框
function errToast(title) {
	uni.showToast({
		title,
		duration: 2000,
		icon: 'none'
	});
}

//成功提示框
function successToast(title) {
	uni.showToast({
		title,
		duration: 2000,
	});
}

//获取DOM节点信息
function createSelectorQuery(node) {
	return new Promise((resolve,reject) => {
		uni.createSelectorQuery().select(node).boundingClientRect((data) => {
			resolve(data);
		}).exec()
	})
}


// 获取包间类型
function getPrivate(_this, arr2) {
	_this.$get('/merchant/store/ktvDeploy/deployList')
		.then(res => {
			// console.log(res)
			if (res.code == 0) {
				for (var i = 0; i < res.data.length; i++) {
					arr2.push({
						label: res.data[i].name,
						value: res.data[i].id
					})
				}
			}
		})
	return {
		arr2
	}
}
// 两位数百分比
function GetPercent(num, total) {
	num = parseFloat(num);
	total = parseFloat(total);
	if (isNaN(num) || isNaN(total)) {
		return "-";
	}
	return (num + total) <= 0 ? "0%" : (Math.round(num / (num + total) * 10000) / 100.00) + "%";
}
// 四位数百分比
function FourGetPercent(one, two, three, four) {
	one = parseFloat(one);
	two = parseFloat(two);
	three = parseFloat(three);
	four = parseFloat(four);
	if (isNaN(one) || isNaN(two) || isNaN(three) || isNaN(four)) {
		return "-";
	}
	return (one + two + three + four) <= 0 ? "0%" : (Math.round(one / (one + two + three + four) * 10000) / 100.00) + "%";
}


// 手机号码验证
function phone(val) {
    if (!(/(^0\d{2,3}\d{7,8}$)|(^400[016789]\d{6}$)|(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(val))) {
        return false;
    } else {
        return true
    }
}

//验证分数
function scoreReg(val) {
    if (!(/^[\-\+]?(([1-9]\d*\/[1-9]\d*))$/.test(val))) {
        return false;
    } else {
        return true
    }
}

//验证金额
function money(val) {
	if (!/^\d+(\.\d{1,2})?$/.test(val)) {
		return false;
	} else {
		return true
	}
}

//验证金额不能低于0.1
function checkMinPrice(price) {
	if (price < 0.1 || money(price) === false) {
		if (price < 0.1) {
			errToast('消费金额不能低于0.1元');
		} else if (money(price) === false) {
			errToast('请输入正确格式的金额');
		}
		return false
	}
}

export {
	showLoading,
	errToast,
	successToast,
	getPrivate,
	GetPercent,
	FourGetPercent,
	phone,
	money,
	checkMinPrice,
	createSelectorQuery,
	scoreReg
}

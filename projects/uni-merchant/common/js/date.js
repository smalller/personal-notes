function date() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	var hh = date.getHours();
	var mm = date.getMinutes();
	var ss = date.getSeconds();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	if (hh >= 0 && hh <= 9) {
		hh = "0" + hh;
	}
	if (mm >= 0 && mm <= 9) {
		mm = "0" + mm;
	}
	if (ss >= 0 && ss <= 9) {
		ss = "0" + ss;
	}
	var currentdate = year - 1 + seperator1 + month + seperator1 + strDate + ' ' + hh + ':' + mm + ':' + ss;
	var currentdates = year + 10 + seperator1 + month + seperator1 + strDate + ' ' + hh + ':' + mm + ':' + ss;
	var currentdatess = year + seperator1 + month + seperator1 + strDate
	var currentdatesNoday = year + seperator1 + month
	return {
		currentdate,
		currentdates,
		currentdatess,
		currentdatesNoday
	};
}
//年月日
function timeFormatting(time) {
	var newTime = time.substring(0, time.indexOf(' ')).split('-')
	newTime = newTime[0] + '年' + newTime[1] + '月' + newTime[2] + '日'
	// console.log(newTime)
	return newTime
}
//年月日时
function timeFormattingDay(time) {
	var newTime = time.substring(0, time.indexOf(' ')).split('-')
	newTime.push(time.substring(time.indexOf(' '),time.indexOf(':')))
	newTime = newTime[0] +'年'+newTime[1]+'月'+newTime[2]+'日'+newTime[3] +'时'
	console.log(newTime)
	return newTime
}
// 价格
function price(num) {
	num += '';
	num = num.replace(/[^0-9|\.]/g, '');

	if (/^0+/)
		num = num.replace(/^0+/, '');
	if (!/\./.test(num))
		num += '.00';
	if (/^\./.test(num))
		num = '0' + num;
	num += '00';
	num = num.match(/\d+\.\d{2}/)[0];
	// console.log(num)
	return num
}

//时间戳转换
// 时间格式化
function timeData(timestamp, type = 1) {
    /* type
        1.年月日时分秒
        2.年月日
        3.年月日时分
        4.时分
        5.年月
		6.月日时分
    */
    var date = new Date(timestamp); //10位*1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (type == 1) return Y + '-' + M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
    if (type == 2) return Y + '-' + M + '-' + addZero(D);
    if (type == 3) return Y + '-' + M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m);
    if (type == 4) return addZero(h) + ':' + addZero(m);
    if (type == 5) return Y + '-' + M;
	if (type == 6) return M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m);
}
// 转时间戳
function timeStamp(time){
	return new Date(time).getTime()
}
function addZero(num) {
    return num < 10 ? '0' + num : num
}
//酒名字长度截取
function liquorNmae(name){
	uni.getSystemInfo({
		success:(res=>{
			// console.log(res)
			if(res.windowWidth>=630){
				name = name
			}else if(res.windowWidth<=630 && res.windowWidth>=500){
				name = name.substring(0,8)
			}else if(res.windowWidth<500 && res.windowWidth>=350){
				name = name.substring(0,5)
			}else if(res.windowWidth<350 && res.windowWidth>=270){
				name = name.substring(0,3)
			}else{
				name = name.substring(0,2)
			}
		})
	})
	return name
}
//排序
function bubbling(arr){
	for(let i=0;i<arr.length-1;i++){
		for(let j=0;j<arr.length-i-1;j++){
			let temp = []
			if(arr[j]>arr[j+1]){
				temp = arr[j]
				arr[j] = arr[j+1]
				arr[j+1] = temp
			}
		}
	}
	return arr
}
// 是否为小数
function decimals(num){
	let regexp = /^(([^0][0-9]*|0)\.([0-9]{1,6}))$/
	return regexp.test(num)
}
export default {
	date,
	timeFormatting,
	price,
	timeData,
	timeFormattingDay,
	timeStamp,
	liquorNmae,
	bubbling,
	decimals
}

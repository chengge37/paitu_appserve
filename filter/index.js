import {getOrderStatusText} from "@/common/utils/config.js"

//获取订单状态名称
function getOrderStatus(str){
	return getOrderStatusText(str);
}

//金额格式化方法
function formatMoney(num) {
	var str = num.toString();
	var reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
	return str.replace(reg, "$1,");
}
//将unix时间戳转换为年月日
function time2Date(value) {
	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	var time = new Date((value*1000));
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d);
}

//将unix时间戳转换为年月日,'YYYY-MM-DD hh:mm:ss' 时分秒
function time2FullDate(value) {
	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	var time = new Date((value*1000));
	var y = time.getFullYear();
	var m = time.getMonth() + 1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
}

//将时分秒时间转为日期 如2019-09-29 00:00:00 返回2019-09-29
function strTime2Date(value) {
	return value.split(' ')[0];
}

//转换收入/支出类型
function formatInOrOut(type) {
	if(type == 1) {
		return "收入";
	} else if(type == 0) {
		return "支出";
	}
}

//将年月日时分秒时间转换为年月日
function formatTimeToDay(str) {
	return str.split(' ')[0];
}

//手机号码中间4位显示*符号
function toTel(value) {
	let start = value.slice(0, 3);
	let end = value.slice(-4);
	return `${start}****${end}`
}

//将字符串转成整形数字
function toNumber(str) {
	return parseFloat(str);
}

export default {
	formatMoney,
	time2Date,
	time2FullDate,
	formatInOrOut,
	formatTimeToDay,
	toTel,
	toNumber,
	strTime2Date,
	getOrderStatus
}
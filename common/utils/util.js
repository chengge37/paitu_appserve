import $Vm from '../../main'
import store from '../../store'
import {
	format
} from "date-fns";
import {
	socketUrl,
	qiniuHost,
	errorPic,
	defaultEquipPic,
	defaultStorePic,
	conditionArray,
	defaultAvatar
} from './config.js'
import {
	calendar,
	refund,
	message,
	job,
	orderNum,
	finance,
	customer,
	check,
	agree,
	order,
	employee,
	equip,
	studio
} from '../api/api.js'


//个位数字前面补0
export const toDouble = function(str) {
	let num = parseInt(str);
	return num > 9 ? num : '0' + num;
}
export const getConditions = function(conditions) {
	let newArray = []
	conditionArray.forEach(cdt_item => {
		conditions.forEach(scdt_item => {
			if (scdt_item == cdt_item.id) {
				newArray.push(cdt_item.name);
			}
		})
	});
	return newArray;
}
export const isJSON = (str) => {
	if (typeof str == 'string') {
		try {
			var obj = JSON.parse(str);
			if (typeof obj == 'object' && obj) {
				return true;
			} else {
				return false;
			}
		} catch (e) {
			return false;
		}
	}
}
//根据相同字段拆分成数组形式方法
export const changeArr = function(arr) {
	var map = {},
		dest = [];
	for (var i = 0; i < arr.length; i++) {
		var ai = arr[i];
		if (!map[ai.check_sn]) {
			dest.push({
				id: ai.relation_id,
				check_sn: ai.sn,
				name: ai.name,
				type: ai.type,
				imgInfo: [ai]
			});
			map[ai.check_sn] = ai;
		} else {
			for (var j = 0; j < dest.length; j++) {
				var dj = dest[j];
				if (dj.check_sn == ai.check_sn) {
					dj.imgInfo.push(ai);
					break;
				}
			}
		}
	}
	return dest;
}

//深拷贝
export const deepcopy = function(source) {
	if (!source) {
		return source;
	}
	let sourceCopy = source instanceof Array ? [] : {};
	for (let item in source) {
		sourceCopy[item] = typeof source[item] === 'object' ? deepcopy(source[item]) : source[item];
	}
	return sourceCopy;
};
//根据某个属性，排序数组
export const compare = function(propertyName) {
	return function(object1, object2) {
		var value1 = object1[propertyName];
		var value2 = object2[propertyName];
		if (value2 < value1) {
			return 1;
		} else if (value2 > value1) {
			return -1;
		} else {
			return 0;
		}
	}
}

//比较两个时间大小,time1,time2 格式为'2019-09-30 00:00:00','02:00','01:00'
export const compareTime = function(time1, time2) {
	if (time1 > time2) {
		return true;
	} else {
		return false;
	}
}

// date对象转字符串
export const dateToStr = function(date) {
	let year = date.getFullYear();
	let month = toDouble(date.getMonth() + 1);
	let day = toDouble(date.getDate());
	return `${year}-${month}-${day}`;
}
// 字符串转date对象
export const strToDate = function(str) {
	let date = new Date(dateToTimestamp(str))
	return date
}
// 日期转时间戳,避免IOS时间戳转换坑坑
function dateToTimestamp(date) {
	var arr = date.split(/[- :\/]/);
	let nndate;
	if (arr.length > 3) {
		// 有时分秒
		nndate = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
	} else {
		// 不含时分秒
		nndate = new Date(arr[0], arr[1] - 1, arr[2], 23, 59, 59);
	}
	nndate = Date.parse(nndate)
	return nndate
}
export const toTimestamp = function(date) {
	return dateToTimestamp(date)
}

//获取两个时间内所有日期，返回数组，例如：2020-02-01 到 2020-3-10之间的所有日期信息
export const getDateInfo = (begin, end) => {
	var arr = [];
	var str_b = begin.split("-");
	var str_e = end.split("-");
	var date_b = new Date();
	date_b.setUTCFullYear(str_b[0], str_b[1] - 1, str_b[2]);
	var date_e = new Date();
	date_e.setUTCFullYear(str_e[0], str_e[1] - 1, str_e[2]);
	var unixDb = date_b.getTime() - 24 * 60 * 60 * 1000;
	var unixDe = date_e.getTime() - 24 * 60 * 60 * 1000;
	for (var j = unixDb; j <= unixDe;) {
		j = j + 24 * 60 * 60 * 1000;
		// 　　　　　　arr.push((new Date(parseInt(j))).format());s
		arr.push(time2Date(new Date(parseInt(j))));
	}
	return arr;
}

//获取两日期之间日期列表函数
export const getdiffdate = (stime, etime) => {
	//初始化日期列表，数组
	var diffdate = new Array();
	var i = 0;
	//开始日期小于等于结束日期,并循环
	while (stime <= etime) {
		diffdate[i] = stime;

		//获取开始日期时间戳
		var stime_ts = new Date(stime.replace(/-/g, '/')).getTime();

		//增加一天时间戳后的日期
		var next_date = stime_ts + (24 * 60 * 60 * 1000);

		//拼接年月日，这里的月份会返回（0-11），所以要+1
		var next_dates_y = new Date(next_date).getFullYear() + '-';
		var next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (
			new Date(next_date).getMonth() + 1) + '-';
		var next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();

		stime = next_dates_y + next_dates_m + next_dates_d;

		//增加数组key
		i++;
	}
	return diffdate;
}


//根据两个属性排序 (暂时日程方面用)
export const sortByProp = (arr, prop1, prop2) => {
	arr.sort(function(a, b) {
		if (a[prop1] === b[prop1]) {
			if (a[prop2] > b[prop2]) {
				return 1;
			} else if (a[prop2] < b[prop2]) {
				return -1;
			} else {
				return 0;
			}
		} else {
			if (a[prop1] > b[prop1]) {
				return 1;
			} else {
				return -1;
			}
		}
	})
}


//获取日期前后几天日期
export const getCountDay = (curDay, AddDayCount) => {
	var dd = new Date(curDay.replace(/-/g, '/'));
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
	var y = dd.getFullYear();
	var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
	var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
	return y + "-" + m + "-" + d;
}

//计算两个时间的天数，//startDate和endDate是2006-12-18格式 
export const dayCount = function(startDate, endDate) {
	var dateSpan, iDays;
	startDate = dateToTimestamp(startDate);
	endDate = dateToTimestamp(endDate);
	dateSpan = endDate - startDate;
	dateSpan = Math.abs(dateSpan);
	iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	return iDays + 1;
}

//给时间添加，num为秒单位，d格式为：'2020-05-09 12:22:59'
export const addTime = (d, num) => {
	var d = new Date(d.substring(0, 4),
		d.substring(5, 7) - 1,
		d.substring(8, 10),
		d.substring(11, 13),
		d.substring(14, 16),
		d.substring(17, 19));
	d.setTime(d.getTime() + num * 1000);
	return d.getFullYear() + "-" +
		(d.getMonth() + 1) +
		"-" + toDouble(d.getDate()) +
		" " + toDouble(d.getHours()) +
		":" + toDouble(d.getMinutes()) +
		":" + toDouble(d.getSeconds());
}

// 计算两个时间的小时差,例子:2020-04-22 13:00:00  ,13:00 
export const hoursCount = function(startTime, endTime) {
	if (startTime.split(' ').length == 1 && startTime.split(' ').length == 1) {
		let date = new Date();
		let curDay = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
		startTime = curDay + ' ' + startTime;
		endTime = curDay + ' ' + endTime;
	}
	let hour =
		(new Date(endTime).getTime() -
			new Date(startTime).getTime()) /
		3600000;
	return Math.ceil(hour);
}

//将unix时间戳转换为年月日  //yyyy-MM-dd  //yyyy-MM-dd HH:mm:ss 
export const time2Date = function (value, formatStr = 'yyyy-MM-dd') {
	if(value.length==10){
		value=value*1000;
	}
	let str=format(new Date(value), formatStr);
	return str;
}

//获取当前年份
export const getCurYear = function() {
	let date = new Date();
	return date.getFullYear();
}

//获取当前月份
export const getCurMonth = function() {
	let date = new Date();
	return toDouble(date.getMonth() + 1);
}

//获取当前日期(年月日)  yyyy-mm-dd
export const getDate = function() {
	const date = new Date();
	let year = date.getFullYear();
	let month = toDouble(date.getMonth() + 1);
	let day = toDouble(date.getDate());
	return `${year}-${month}-${day}`;
}

//获取当前时间(时分)  h-m
export const getTime = function() {
	const date = new Date();
	let hour = toDouble(date.getHours());
	let minutes = toDouble(date.getMinutes());
	return `${hour}:${minutes}`;
}

//返回错误图片地址
export const errPic = (function() {
	let errPic = qiniuHost + errorPic;
	return `this.src="${errPic}"`;
})();

// 七牛裁切图片 默认宽度为400px，高度等比缩放，defaultPic默认为影棚设备之类的默认图，如果type,0/默认头像，1/店铺头像,为店铺默认图片
export const picExplode = function(arrayStr, type, size = 400) {
	if (arrayStr === null || arrayStr === undefined || arrayStr === '' || Object.prototype.toString.call(arrayStr) !==
		'[object String]') {
		if (type == '0') {
			return qiniuHost + defaultAvatar;
		}
		return arrayStr;
	}
	// console.error('picExplode----------',arrayStr);
	let newArray = arrayStr.split(',').filter(item => {
		return item
	})
	if (newArray.length > 0) {
		return qiniuHost + newArray[0] + '?imageMogr2/auto-orient/thumbnail/' + size + 'x' + size +
			'>/blur/1x0/quality/75|imageslim';
	} else {
		if (type == '0') {
			return qiniuHost + defaultAvatar;
		}
	}
}

//判断数据是否为空
export const isEmpty = (res) => {
	if (res == null || res == '' || res == undefined || JSON.stringify(res) == '[]' || JSON.stringify(res) == '{}') {
		return true;
	} else {
		return false;
	}
}

//获取当天是周几 
export const getWeek = function(str) {
	let date;
	if (str) {
		date = date = new Date(dateToTimestamp(str));
	} else {
		date = new Date()
	}
	let day = date.getDay();
	let week = "";
	switch (day) {
		case 1:
			week = '周一';
			break;
		case 2:
			week = '周二';
			break;
		case 3:
			week = '周三';
			break;
		case 4:
			week = '周四';
			break;
		case 5:
			week = '周五';
			break;
		case 6:
			week = '周六';
			break;
		case 7:
			week = '周日';
			break;
		default:
			break;
	}
	return week;
}

//限制时间选择时间，startDate (60年前) 和endDate(20年后)
export const setDate = function(type) {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === 'start') {
		year = year - 60;
	} else if (type === 'end') {
		year = year + 2;
	}
	month = month > 9 ? month : '0' + month;;
	day = day > 9 ? day : '0' + day;
	return `${year}-${month}-${day}`;
}

//计算两个时间的时长  时间格式2019-07-20 14:25:20
export const calHours = function(startTime, endTime) {
	let hour =
		(new Date(endTime).getTime() -
			new Date(startTime).getTime()) /
		3600000;
	return Math.ceil(hour);
}

//计算两个时间的分钟差数,默认是计算与当天00:00:00 相差分钟差
export const calMinDif = (time1, time2) => {
	let temp = time1;
	if (!time2) {
		time1 = time1.split(' ')[0] + ' ' + '00:00:00';
		time2 = temp;
	}
	//截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
	var begin1 = time1.substr(0, 10).split("-");
	var end1 = time2.substr(0, 10).split("-");
	//将拆分的数组重新组合，并实例成化新的日期对象
	var date1 = new Date((begin1[1] + '-' + begin1[2] + '-' + begin1[0]).replace(/-/g, '/'));
	var date2 = new Date((end1[1] + '-' + end1[2] + '-' + end1[0]).replace(/-/g, '/'));
	var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);
	//小时数和分钟数相加得到总的分钟数
	var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
	var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));
	if (time2.substr(17, 2) > time1.substr(17, 2)) {
		min2++;
	}
	//两个分钟数相减得到时间部分的差值，以分钟为单位
	var n = min2 - min1;
	//将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
	var minutes = m + n;
	return Number(minutes);
}

//判断时间是按天，还是按小时,true/按小时，false/按天
export const checkJobTime = (time1, time2) => {
	//截取字符串，得到日期部分"2009-12-02",用split把字符串分隔成数组
	var begin1 = time1.substr(0, 10).split("-");
	var end1 = time2.substr(0, 10).split("-");
	//将拆分的数组重新组合，并实例成化新的日期对象
	var date1 = new Date((begin1[1] + '-' + begin1[2] + '-' + begin1[0]).replace(/-/g, '/'));
	var date2 = new Date((end1[1] + '-' + end1[2] + '-' + end1[0]).replace(/-/g, '/'));
	var m = parseInt(Math.abs(date2 - date1) / 1000 / 60);
	//小时数和分钟数相加得到总的分钟数
	var min1 = parseInt(time1.substr(11, 2)) * 60 + parseInt(time1.substr(14, 2));
	var min2 = parseInt(time2.substr(11, 2)) * 60 + parseInt(time2.substr(14, 2));
	if (time2.substr(17, 2) > time1.substr(17, 2)) {
		min2++;
	}
	//两个分钟数相减得到时间部分的差值，以分钟为单位
	var n = min2 - min1;
	//将日期和时间两个部分计算出来的差值相加，即得到两个时间相减后的分钟数
	var minutes = m + n;
	if (minutes < 1440) {
		return true;
	}
	return false;
}

//判断两个数组是否存在相同元素，存在返回true,否则返回false
export const getArrSame = (arr1, arr2) => {
	var result = new Array();
	var c = arr2.toString();
	for (var i = 0; i < arr1.length; i++) {
		if (c.indexOf(arr1[i].toString()) > -1) {
			for (var j = 0; j < arr2.length; j++) {
				if (arr1[i] == arr2[j]) {
					result.push(arr1[i]);
					break;
				}
			}
		}
	}
	console.log(result);
	if (result.length > 0) {
		return true;
	}
	return false;
}

//判断两个时间数组，是否有重叠 ,如["2020-05-15 01:00:00","2020-05-15 03:00:00"];，["2020-05-15 02:01:00","2020-05-15 03:59:59"];
export const checkTime = (time1, time2) => {
	let a = time1[0];
	let b = time1[1];
	let x = time2[0];
	let y = time2[1];
	var times1 = [],
		times2 = [];
	if (a < b) {
		//未跨天
		times1.push([a, b]);
	} else {
		//跨天
		times1.push([a, "24:00"], ["00:00", b]);
	}

	if (x < y) {
		times2.push([x, y]);
	} else {
		times2.push([x, "24:00"], ["00:00", y]);
	}

	var flag = false;
	//循环比较时间段是否冲突
	for (var i = 0; i < times1.length; i++) {
		if (flag) break;
		for (var j = 0; j < times2.length; j++) {
			if (checkHourTime(times1[i][0], times1[i][1], times2[j][0], times2[j][1])) {
				flag = true;
				break;
			}
		}
	}
	if (flag) {
		return false;
	} else {
		return true;
	}
}


export const checkHourTime = (a, b, x, y) => {
	if (y < a || b <= x) {
		return false;
	} else {
		return true;
	}
}

//复制内容方法
export const copyContent = (str) => {
	uni.setClipboardData({
		data: str
	});
}


// 监听消息发送
export const listenMsg = () => {
	// console.log('util-------------------listenMsg------');
	// uni.connectSocket({
	// 	url: socketUrl,
	// 	protocols: [store.getters.user_data.token],
	// });
	// uni.onSocketError(function(res) {
	// 	console.log('socket err---', res)
	// 	console.log('WebSocket连接打开失败，请检查！');
	// });
	// uni.onSocketOpen(function(res) {
	// 	console.log('WebSocket连接已打开！-------', res);
	// 	// uni.closeSocket();
	// });
	// uni.onSocketClose(function(res) {
	// 	console.log('WebSocket 已关闭！---------------', res);
	// });
	// uni.onSocketMessage(function(res) {
	// 	console.log('收到服务器内容：' + res.data);
	// 	let new_msg = JSON.parse(res.data);
	// 	let msg = '';
	// 	switch (new_msg.json.type) {
	// 		case 22:
	// 			msg = '商家已接收您的订单~'
	// 			break;
	// 		case 23:
	// 			msg = '您有订单已上传核验单~'
	// 			break;
	// 		case 24:
	// 			msg = '您有订单已开始~'
	// 			break;
	// 		case 25:
	// 			msg = '您有订单待评价~'
	// 			break;
	// 		case 71:
	// 			msg = '您的活动已开始~'
	// 			break;
	// 		default:
	// 			break;
	// 	}
	// 	if (msg) {
	// 		uni.showToast({
	// 			title: msg,
	// 			icon: 'none',
	// 			duration: 2000
	// 		})
	// 	}
	// });
}

//同步设置storage  将数据存储在本地缓存中指定的 name 中
export const setStorage = function(name, data, validTime) {
	return new Promise((resolve, reject) => {
		try {
			uni.setStorageSync(name, data)
			let tmp = Date.parse(new Date()) / 1000;
			if (validTime > 0) {
				uni.setStorageSync(name + '_valid_time', tmp + validTime)
			} else {
				//默认有效一小时
				uni.setStorageSync(name + '_valid_time', tmp + 3600)
			}
			resolve(true);
		} catch (e) {
			console.log(e)
			resolve(false);
		}
	})
}

//同步获取storage
export const getStorage = function(name) {
	let data
	try {
		let validTime = uni.getStorageSync(name + '_valid_time');
		if (validTime) {
			let tmp = Date.parse(new Date()) / 1000;
			if (validTime - tmp > 0) {
				data = uni.getStorageSync(name);
			} else {
				uni.removeStorageSync(name)
				uni.removeStorageSync(name + '_valid_time')
			}
		}
	} catch (e) {
		console.log(e)
	}
	return data
}

// 从本地缓存中移除指定 key
export const delStorage = function(name) {
	try {
		uni.removeStorageSync(name);
	} catch (e) {
		console.log(e)
	}
}
export const avatarUtil = function(avatar) {
	if (avatar !== false && avatar !== undefined && avatar !== null && avatar.length !== 0) {
		if (avatar.indexOf("http") != -1) {
			return avatar;
		} else {
			if (avatar.indexOf(',') != -1) {
				let avatarArray = avatar.split(',');
				avatarArray.forEach(item => {
					if (avatar !== false && avatar !== undefined && avatar !== null && avatar.length !== 0) {
						return qiniuHost + item;
					}
				});
			}
			return qiniuHost + avatar;
		}
	} else {
		return qiniuHost + defaultAvatar;
	}

}
export const picExplode1 = function(arrayStr, defaultPic, size = 400) {
	if (arrayStr === null || arrayStr === undefined || arrayStr === '' || Object.prototype.toString.call(arrayStr) !==
		'[object String]') {
		return defaultPic;
	}
	let newArray = arrayStr.split(',').filter(item => {
		return item
	});
	console.log('newArray-------', newArray, qiniuHost);
	if (newArray.length > 0) {
		let test = qiniuHost + newArray[0] + '?imageMogr2/auto-orient/thumbnail/' + size + 'x' + size +
			'>/blur/1x0/quality/75|imageslim';
		console.log('test-----------', test);
		return qiniuHost + newArray[0] + '?imageMogr2/auto-orient/thumbnail/' + size + 'x' + size +
			'>/blur/1x0/quality/75|imageslim';
	} else {
		return defaultPic;
	}

}
export const shopAvatarUtil = function(avatar) {
	if (avatar !== false && avatar !== undefined && avatar !== null && avatar.length !== 0) {
		if (avatar.indexOf("http") != -1) {
			return avatar;
		} else {
			if (avatar.indexOf(',') != -1) {
				let avatarArray = avatar.split(',');
				avatarArray.forEach(item => {
					if (avatar !== false && avatar !== undefined && avatar !== null && avatar.length !== 0) {
						return qiniuHost + item;
					}
				});
			}
			return qiniuHost + avatar;
		}
	} else {
		return qiniuHost + defaultStorePic;
	}
}

/**
 * offetHeight 滚动计算部分到顶部距离
 * scrollTop   滚动高度
 * height      每个模块的高度
 * colunm      列数
 **/
export const countIndex = function(offetHight, scrollTop, height, colunm) {
	// 单例获取屏幕宽度比
	if (!countIndex.pix) {
		try {
			let res = wx.getSystemInfoSync()
			countIndex.pix = res.windowWidth / 375
		} catch (e) {
			countIndex.pix = 1
		}
	}
	let scroll = scrollTop - offetHight * countIndex.pix
	let hei = height * countIndex.pix
	return scroll > 0 ? Math.floor(scroll / hei) * colunm : 0
}

export const generateUUID = () => {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

//判断是否为空的日期
export const isEmptyDate = (str) => {
	if (str == '0000-00-00') {
		return true;
	}
	return false;
}

//返回上一步
export const back = () => {
	uni.navigateBack();
}

//获取当前页面
export const currentPage = () => {
	var pages = getCurrentPages();
	var page = pages[pages.length - 1]; //当前页面
	return page;
}

//获取上一个路由页面
export const prevPage = () => {
	var pages = getCurrentPages();
	var page = pages[pages.length - 2]; //上一个页面
	return page;
}

//显示加载中
export const showLoading = (title = '加载中') => {
	uni.showLoading({
		title: title
	});
}

//关闭加载弹框
export const hideLoading = () => {
	uni.hideLoading();
}

//弹出提示
export const showTip = (tip, showIcon = false) => {
	let params = {
		title: tip
	}
	if (!showIcon) {
		params.icon = 'none';
	}
	uni.showToast(params);
}

//二次确认弹窗方法
export const confirm = (tip = "确定该操作吗?") => {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: '提示',
			content: tip,
			success: function(res) {
				if (res.confirm) {
					resolve(true);
				} else if (res.cancel) {
					resolve(false);
				}
			}
		});
	})

}
export const tipAndBack=(tip)=>{
	let params = {
		title: tip
	}
	uni.showToast(params);
	setTimeout(() => {
		uni.navigateBack();
	}, 500);
}


//操作和返回操作,showIcon
export const operateBack = (tip, update = false) => {
	let params = {
		title: tip
	}
	// if(!showIcon){
	// 	params.icon='none';
	// }
	uni.showToast(params);
	if (update) {
		var prevPage = $Vm.util.prevPage(); //上一个页面
		prevPage.setData({
			update: true
		});
	}
	setTimeout(() => {
		uni.navigateBack();
	}, 500);
}

//判断上一个页面是否是更新
export const prevPageUpdate = () => {
	let currentPage = $Vm.util.currentPage();
	if (currentPage.data) {
		let update = currentPage.data.update;
		if (update) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

//uni获取元素属性
export const getDom = (o, str) => {
	return new Promise((resolve, reject) => {
		const query = uni.createSelectorQuery().in(o);
		query.select(str).boundingClientRect(data => {
			// console.error('textDom=======',data);
			resolve(data);
		}).exec();
	})
}


//--------------------------获取接口数据方法------------------


//-------------影棚模块-----------
//获取影棚列表
export const studioList = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(studio.studioList, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}


//-----------器材模板-------------
//获取器材列表
export const equipList = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(equip.equipList, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//-----------员工模块------------
//添加员工分组
export const addEmployeeGroup = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(employee.addGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//修改员工分组
export const updateEmployeeGroup = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(employee.updateGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//删除员工分组
export const delEmployeeGroup = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(employee.delGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//添加员工
export const addEmployee = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(employee.add, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//修改员工
export const updateEmployee = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(employee.update, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//删除员工
export const delEmployee = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(employee.del, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取员工分组列表
export const employeeGroup = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(employee.getGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//根据分组获取员工
export const employeeList = function(groupId) {
	let params = {
		page: 1,
		page_size: 1000000,
		group_id: groupId
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(employee.getAll, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//-----------客户/分组模块-----------
//获取客户
export const getCustomer = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(customer.getCustomer, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取客户分组列表
export const getCustomerGroup = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(customer.getGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家添加或修改客户分组信息
export const editCustomerGroup = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(customer.eidtGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家删除客户分组
export const delCustomerGroup = function(groupId) {
	let params = {
		id: groupId
	}
	return new Promise((resolve, reject) => {
		$Vm.$http.post(customer.delGroup, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家添加客户
export const addCustomer = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(customer.addCustomer, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家修改客户
export const editCustomer = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(customer.editCustomer, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家删除客户
export const delCustomer = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(customer.delCustomer, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//根据分组id获取相关客户数据(简单数据)
export const getCustomerSimple = function(groupId) {
	let params = {
		page: 1,
		page_size: 1000000,
		group_id: groupId
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(customer.getCustomerSimple, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取员工列表
export const allEmployee = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(employee.getAll, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//-----------订单模块-------------
//商家添加线下订单
export const addOrder = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(equip.addOrder, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家修改线下订单
export const updaetOrder = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(order.updaetOrder, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家接单
export const acceptOrder = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(order.acceptOrder, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家拒单
export const rejectOrder = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(order.rejectOrder, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家删除线下订单
export const delOrder = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(order.delOrder, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家修改订单价格
export const updateOrderPrice = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(order.updatePrice, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取订单详情
// export const getOrderDetail = function (id) {
// 	let params={id:id};
// 	return new Promise((resolve, reject) => {
// 		$Vm.$http.get(order.getOrderDetail, params).then(res => {
// 			resolve(res);
// 		}).catch(err => {});
// 	});
// }

//获取租赁订单信息（影棚设备订单）
export const getDSOrder = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(order.getDSOrder, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//----------协议模块--------------
//获取协议模板列表
export const getAgreeList = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(agree.getAgreeList, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取协议模板详情
export const getAgreeDetail = function(id) {
	let params = {
		tpl_id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(agree.getAgreeDetail, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//添加协议模板
export const addAgree = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(agree.addAgree, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//修改协议模板
export const editAgree = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(agree.editAgree, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//删除协议模板
export const delAgree = function(id) {
	let params = {
		tpl_id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(agree.delAgree, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}


//--------------核验单模块-----------
//添加核验单
export const addCheck = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(check.addCheck, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家获取核验单信息
export const getCheck = (orderId) => {
	let params = {
		order_id: orderId
	}
	return new Promise((resolve, reject) => {
		$Vm.$http.get(check.getCheck, params).then(res => {
			resolve(res);
		}).catch(err => {});
	})
}

//商家获取核验单信息
export const editCheck = (params) => {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(check.editCheck, params).then(res => {
			resolve(res);
		}).catch(err => {});
	})
}


//------------财务模块--------------
//获取商家收入支出列表
export const financeAll = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(finance.financeAll, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取收入支出类别
export const financeType = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(finance.financeType, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}


//获取指定年份财务数据
export const financePeriod = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(finance.financePeriod, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}


//-------------首页数据统计-----------------
export const homeOrderNum = function() {
	let params = {
		is_all: 0
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(orderNum.orderInfo, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}


//---------------工作模块-----------------
//商家添加工作
export const addJob = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(job.add, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家修改工作
export const updateJob = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(job.updateJob, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家获取工作详情
export const jobDetail = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(job.jobDetail, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//商家删除工作
export const delJob = function(id) {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.post(job.delJob, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}

//获取时间段内容工作列表
export const getJob = function(params) {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(calendar.getByDay, params).then(res => {
			resolve(res);
		}).catch(err => {});
	});
}


//-----------------消息模块----------------
//获取消息列表
export const getMsgList = (params) => {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(message.getMsgList, params).then(res => {
			resolve(res)
		}).catch(err => {})
	})
}

//修改消息已读状态
export const hasRead = (id) => {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(message.hasRead, params).then(res => {
			resolve(res)
		}).catch(err => {})
	})
}

//删除消息
export const delMsg = (id) => {
	let params = {
		id: id
	};
	return new Promise((resolve, reject) => {
		$Vm.$http.get(message.delMsg, params).then(res => {
			resolve(res)
		}).catch(err => {})
	})
}


//-------------sn码模块----------------
//查询sn码状态
export const snStatus = (params) => {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(equip.inOutStatus, params).then(res => {
			resolve(res)
		}).catch(err => {})
	})
}


//------------------退款模块--------------
// 退款查询(用户/商家)
export const ajaxUserRefundOrderDetail = (params) => {
	return new Promise((resolve, reject) => {
		$Vm.$http.get(refund.ajaxUserRefundOrderDetail, params).then(res => {
			resolve(res)
		}).catch(err => {})
	})
}

// 退款审核(商家)
export const serveRefundAnswer = (params) => {
	return new Promise((resolve, reject) => {
		$Vm.$http.post(refund.serveRefundAnswer, params).then(res => {
			resolve(res)
		}).catch(err => {})
	})
}

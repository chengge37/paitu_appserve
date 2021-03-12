<template>
	<div class="preview">
		<div class="top">
			<picker mode="date" fields="month" @change="changeMonth" :value="selectMonth">
				<div class="month">{{selectMonth}}</div>
			</picker>
			<p>日程</p>
			<span>icon</span>
		</div>
		<div class="head">
			<div class="headTitle">今天</div>
			<view class="uni-padding-wrap" style="flex:1">
				<view class="page-section swiper">
					<view class="page-section-spacing">
						<swiper class="swiper" :current="current" @change="change" @animationfinish="animationfinish" style="height:306rpx">
							<swiper-item v-for="(item,index) in (days.length)/7" :key="index">
								<view style="width:92rpx;height:306rpx;display:inline-block;border:1px solid #f0f0f0;text-align:center;padding-top:30rpx" v-for="item in days.slice(index*7,(index+1)*7)" :key="item.day.toString()" class="swiper-item" @tap="tapDay" :class="{today:formatDay(item.day)==today&&item.day.getMonth()+1==getMonth(selectMonth)}">{{item.day.getDate()}}</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</div>

		<div class="timeInfo">
			<div class="time">
				<span v-for="(item,index) in timeList" :key="index">{{item}}</span>
			</div>

			<div class="info">
				<ul v-for="(item,index) in dayNum" :key="index">
					<li ref="liItem" v-for="(item,index2) in timeList" :key="index2">
						<span></span>
					</li>

					<div v-for="(item2,index2) in todoOneDay" v-if="item2.day==days.slice(current*7,(current+1)*7)[index].day.getDate()">
						<p v-if="item3" class="cursor" :style="'margin-top:'+item3.top+'px'+';'+'height:'+item3.height+'px'" v-for="(item3,index3) in item2.info" :key="index3">{{item3.info}}</p>
					</div>

					<div v-for="(item2,index2) in todoOneDay" v-if="item2.day==days.slice(current*7,(current+1)*7)[index].day.getDate()">
						<div v-for="(item3,index3) in item2.info2">
							<p class="cursor" v-if="item3" :style="'margin-top:'+item3.top+'px'+';'+'height:'+item3.height+'px'">{{item3.info}}</p>
						</div>
					</div>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
	import { Format } from "@/common/utils/formatDate.js";
	export default {
		components: {},
		data() {
			return {
				headDay: [],
				current: 1,
				timeList: [],
				dayNum: 7,
				selectMonth: "",
				todoList: [],
				todoOneDay: [],
				itemWidth: 0,
				itemHeight: 0,
				allWidth: 0,
				allHeight: 0,
				minHeight: 0, //每分钟高度
				days: [],
				today: Format.formatDateNoHouer(new Date())
			};
		},
		onLoad() {
			for(let i = 1; i < 25; i++) {
				this.timeList.push(i + ":00");
			}
			this.selectMonth = Format.formatDateNoDay(new Date());
		},
		mounted() {
			//获取每项的宽度和高度
			this.itemWidth = parseInt(
				window.getComputedStyle(this.$refs.liItem[0]).width
			);
			this.itemHeight = parseInt(
				window.getComputedStyle(this.$refs.liItem[0]).height
			);
			this.allWidth = this.itemWidth * 7;
			this.allHeight = this.itemHeight * 24;
			this.minHeight = (this.itemHeight / 60).toFixed(2);
			this.days = this.initCalendar(null);
			console.log(this.days, "this.days");
			this.current = this.getLineNumber();
			//获取头部七天的待办 yyyy-mm-dd hh:mm:ss
			this.getTodoByWeek()
		},
		methods: {
			getTodo(start, end) {
				//获取代办
				let params={
					start_time:start,
					end_time:end
				}
				this.util.getJob(params).then(res => {
						console.log(res);
						this.todoList = res.rows;
						//关于待办的处理，首先筛选出跨天的待办，不跨天的待办
						this.todoList.forEach(item => {
							console.log(item.start_time);
							if(this.util.checkJobTime(item.start_time,item.end_time)) {
								console.error('按小时-------------',item.start_time);
								//不跨天
								this.todoOneDay.push({
									day: item.start_time.split(" ")[0].split("-")[2],
									left: 0,
									info: [{
										info: item.name,
										time: `${this.getHour(item.start_time)}-${this.getHour(item.end_time)}`
									}]
								});
							}
						});
						console.log(this.todoOneDay, "pp");
						this.loadInfo();
					});
			},
			//获取分钟时间段
			getHour(timeStr) {
				return timeStr.substr(11, 5); //====>07:10
			},
			animationfinish(e) {
				console.log('animationfinish------',this.current,e.detail.current);
				if(this.current == e.detail.current) {
					return
				}
				this.current = e.detail.current;
				console.log("开始刷新数据");
				this.getTodoByWeek()
			},
			//获取一周的待办
			getTodoByWeek() {
				this.todoOneDay = []
				this.headDay = this.days.slice(this.current * 7, (this.current + 1) * 7)
				this.getTodo(Format.formatDate0(this.headDay[0].day.getTime(), false), Format.formatDate0(this.headDay[this.dayNum - 1].day.getTime(), true));
			},
			//选择月份方法
			changeMonth(e) {
				console.log(e.detail.value);
				this.selectMonth = e.detail.value
				console.log("changeMonth------");
				this.current = this.getLineNumber();
				this.days = this.initCalendar(this.selectMonth);
				this.getTodoByWeek()
			},
			formatDay(date) {
				return Format.formatDateNoHouer(date);
			},
			//只展示带今天那一行的方法
			getLineNumber() {
				let b;
				this.days.forEach((item, index) => {
					if(this.formatDay(item.day) == this.today) {
						b = Math.floor((index + 1) / 7);
						return;
					}
				});
				console.log(b == undefined);
				return b == undefined ? 1 : b;
			},
			// 返回 类似 2016-01-02 格式的字符串
			formatDate(year, month, day) {
				let y = year;
				let m = month;
				let d = day;
				if(m < 10) m = "0" + m;
				if(d < 10) d = "0" + d;
				return y + "-" + m + "-" + d;
			},
			getMonth(dm) {
				//2012-03-->3
				return +dm.split("-")[1];
			},
			initCalendar(cur) {
				//传年月
				let date;
				if(cur) {
					date = new Date(cur);
				} else {
					date = new Date();
				}
				this.currentYear = date.getFullYear();
				this.currentMonth = date.getMonth() + 1;
				let str = this.formatDate(this.currentYear, this.currentMonth, 1);
				this.currentWeek =
					new Date(str).getDay() == 0 ? 7 : new Date(str).getDay(); //某月1号所在theDay
				let tmpDay = [];
				for(let i = this.currentWeek - 1; i >= 0; i--) {
					let d = new Date(str);
					d.setDate(d.getDate() - i);
					tmpDay.push({
						day: d
					});
				}
				for(let i = 1; i <= 42 - this.currentWeek; i++) {
					let d = new Date(str);
					d.setDate(d.getDate() + i);
					tmpDay.push({
						day: d
					});
				}
				return tmpDay;
			},
			comTime(time1, time2) {
				//09:00
				let s1 = time1.split('-')[0].split(":")[0] * 60 + (+(time1.split('-')[0].split(":")[1]))
				let s2 = time2.split('-')[0].split(":")[0] * 60 + (+(time2.split('-')[0].split(":")[1]))
				return s1 - s2
			},
			loadInfo() {
				//合并同一天的待办
				this.todoOneDay = this.todoOneDay.reduce((acc, item) => {
					if(this.hasItem(acc, item)) {
						acc[
							acc.findIndex(item1 => {
								return(item1.day == item.day);
							})
						].info.push(...item.info);
					} else {
						acc.push(item);
						console.log(acc);
					}
					return acc;
				}, []);
				let tmp = JSON.parse(JSON.stringify(this.todoOneDay))
				console.log(tmp, "哪来的info2");
				//排序同一天的待办
				this.todoOneDay.forEach(item => {
					item.info.sort((item1, item2) => {
						return this.comTime(item1.time, item2.time);
					});
				});
				let tmp1 = JSON.parse(JSON.stringify(this.todoOneDay))
				console.log(tmp1, "看看排序没");
				//加上是否冲突属性
				this.days
					.slice(this.current * 7, (this.current + 1) * 7)
					.forEach((item, index) => {
						this.todoOneDay.forEach((item2, index2) => {
							if(+item2.day == item.day.getDate()) {
								item2.left = index * this.itemWidth;
								item2.info.forEach((item3, index3) => {
									item3.top = this.calMinDif(item3.time, 0) * this.minHeight;
									let allMin = this.calMinDif(item3.time, 1);
									// console.log("allMin----", allMin);
									item3.height = allMin * this.minHeight;
									//判断时间是否有冲突 2,  3
									if(index3 + 2 <= item2.info.length) {
										console.log("item2-------", item2, index3);
										if(
											this.checkTime(
												item2.info[index3].time,
												item2.info[index3 + 1].time
											)
										) {
											item2.info[index3].conflict = true;
											item2.info[index3 + 1].conflict = true;
										}
									}
								});
							}
						});
					});
				// 将冲突的分在info,没有冲突的分在info2
				this.todoOneDay.forEach((item, index) => {
					item.info2 = [];
					item.info.forEach((item2, index2) => {
						if(!item2.conflict) {
							item.info2.push(item2);
							this.$set(item.info, index2, null);
						}
					});
				});
			},
			change(e){
				
			},
			hasItem(acc, item) {
				return(
					acc.findIndex(item1 => {
						return(item1.day == item.day);
					}) != "-1"
				);
			},
			//计算两个时间，分钟差/type:0,计算时间与1：00相差分钟数，type:1,计算两个时间相差分钟数
			calMinDif(time, type) {
				// console.log("calMinDif---------------", time);
				let time1 = 0;
				let time2 = 0;
				if(type == 0) {
					let startTime = time.split("-")[0];
					time1 = 0;
					time2 =
						parseInt(startTime.split(":")[0]) * 60 +
						parseInt(startTime.split(":")[1]);
				} else if(type == 1) {
					let [startTime, endTime] = time.split("-");
					time1 =
						parseInt(+startTime.split(":")[0] * 60) +
						parseInt(+startTime.split(":")[1]);
					time2 =
						parseInt(+endTime.split(":")[0] * 60) +
						parseInt(+endTime.split(":")[1]);
				}
				return time2 - time1;
			},
			//判断两个时间是否有冲突，false:没有冲突，true:有冲突
			checkTime(time1, time2) {
				let [a, b] = time1.split("-");
				let [x, y] = time2.split("-");
				if(a.length == 4) {
					a = "0" + a;
				}
				if(b.length == 4) {
					b = "0" + b;
				}
				if(x.length == 4) {
					x = "0" + x;
				}
				if(y.length == 4) {
					y = "0" + y;
				}
				if(y < a || b < x) {
					return false;
				} else {
					return true;
				}
			},
			tapDay(e) {
				console.log(e);
			}
		}
	};
</script>
<style lang="scss" scoped>
	* {
		padding: 0px;
		margin: 0px;
		box-sizing: border-box;
	}
	
	.head {
		display: flex;
		.headTitle {
			width: 106rpx;
			text-align: center;
			// line-height: ;
		}
	}
	
	.top {
		padding: 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		p {
			font-size: 34rpx;
		}
		.month {
			color: #333;
			font-size: 28rpx;
			font-weight: 600;
		}
	}
	
	.preview {
		background: #fff;
	}
	
	ul li {
		list-style: none;
	}
	
	.timeInfo {
		display: flex;
		justify-content: flex-start;
	}
	
	.time {
		display: flex;
		flex-direction: column;
		width: 106rpx;
		span {
			display: inline-block;
			// border:1px solid #F0F0F0;
			height: 92rpx;
			line-height: 89px;
			text-align: center;
			color: rgba(153, 153, 153, 1);
		}
	}
	
	.info {
		display: flex;
		justify-content: flex-start;
		position: relative;
		div {
			position: absolute;
			left: 0px;
			top: 0px;
			color: #333333;
			padding: 0px 3px;
			display: flex;
			width: 92rpx;
			p {
				background: #eeebf5;
				word-wrap: break-word;
				/*英文的时候需要加上这句，自动换行*/
				word-break: break-all;
				margin-right: 3px;
				flex: 1;
				overflow: hidden;
				font-size: 22rpx;
				text-align: center;
				padding: 2px;
				border-radius: 2px;
				&:last-child {
					margin-right: 0px;
				}
			}
		}
	}
	
	ul {
		position: relative;
	}
	
	.cursor {
		cursor: pointer;
	}
	
	.info li {
		height: 92rpx;
	}
	
	li span {
		width: 92rpx;
		border: 1px solid #f0f0f0;
		display: inline-block;
		height: 92rpx;
	}
	
	.today {
		color: blue;
	}
</style>
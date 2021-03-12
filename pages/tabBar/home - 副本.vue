<template>
	<view class="home-wrap">
		<view class="header">
			<view class="avatar-wrap">
				<image src=""></image>
			</view>
			<view class="name-account">
				<text>{{user.user_data.nick}}</text>
				<text>账号{{user.user_data.mobile}}</text>
			</view>
			<text class="iconfont icon41"></text>
		</view>
		<view class="content">
			<view class="card today-row">
				<view class="today-item" v-for="(item,index) in todayArr" :key="index">
					<text>{{item.value}}</text>
					<text>{{item.label}}</text>
				</view>
			</view>
			<view class="card order-row">
				<view class="order-item" v-for="(item,index) in orderArr" :key="index">
					<text :class="item.icon"></text>
					<text>{{item.value}}</text>
					<text>{{item.label}}</text>
				</view>
			</view>
			<view class="schedule">
				<view class="above-title">
					<text @click="toSchedule">我的日程</text>
					<text>日程管理</text>
				</view>
				<view class="card schedule-content">
					<view class="schedule-top">
						<picker class="picker" mode="date" fields="month" :value="yearMonth" :start="startDate" :end="endDate" @change="changeYearMonth">
							<view class="picker-value">{{yearMonth | dateFormat}}</view>
							<text class="iconfont iconarrow-down"></text>
						</picker>
						<text class="iconfont iconjiahao1"></text>
					</view>
					<view class="calendar">
						<view class="week-row">
							<text v-for="(item,index) in weeks" :key="index">{{item}}</text>
						</view>
						<view class="calendar-box" :class="{unfold:!isFold}">
							<view class="box-row" :class="{'cur-row':curRowIndex==index}" v-for="(item,index) in calendarArr" :key="index">
								<text v-for="(each,j) in item" :key="j" :class="{'other-month-day':!each.isCurMonth,'day-check':each.checked,today:new Date().getFullYear()==yearMonth.split('-')[0]&&new Date().getMonth()+1==yearMonth.split('-')[1]&&new Date().getDate()==each.label,'has-content':each.content.length}"
								 @click="changeDay(each)">{{new Date().getFullYear()==yearMonth.split('-')[0]&&new Date().getMonth()+1==yearMonth.split('-')[1]&&new Date().getDate()==each.label?'今':each.label}}
								</text>
							</view>
						</view>
						<scroll-view class="todo-list" scroll-y="true" show-scrollbar="true">
							<view v-if="todoList.length>0">
								<view class="todo-item" v-for="(item,index) in todoList" :key="index" @click="todoInfo(item)">
									<text class="iconfont iconyueduye-pifuxuanzhongzhuangtai" :class="{checked:item.checked}"></text>
									<text>{{item.name}}</text>
								</view>
							</view>
							<view v-else>
								暂无待办！
							</view>
						</scroll-view>
						<view class="operation">
							<text class="iconfont iconzhankai" :class="{toggle:isFold}" @click="toggleCalendar"></text>
						</view>
					</view>
				</view>
			</view>

			<!-- 其他功能模块 -->
			<!-- <view class="function-row">
        <view class="function-item" v-for="(item,index) in functionArr" :key="index">
          <text :class="item.icon"></text>
          <text>{{item.label}}</text>
        </view>
      </view> -->

			<view class="finance">
				<view class="above-title">
					<text>财务看板</text>
					<text>财务列表</text>
				</view>
				<view class="card finance-content">
					<view class="time-tab">
						<text :class="{'active-time':index==curIndex}" v-for="(item,index) in timeTabs" :key="index" @click="changeTime(item,index)">{{item}}</text>
					</view>
					<Ring :chartData="ringData" Width="750" Height="500" @changeBtn="changeBtn"></Ring>
				</view>
			</view>
			<view class="card activity-order">
				<text>活动订单</text>
				<view>
					<text>截止</text>
					<text>2020.02.02 12:22</text>
					<text>已有</text>
					<text>22</text>
					<text>人报名</text>
				</view>
				<view>
					<text>详情</text>
					<text class="iconfont iconarrow-right"></text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from "vuex";
	import Ring from '@/components/u-charts/ring';
	import { calendar } from "@/common/api/api";
	import { Format } from "@/common/utils/formatDate.js";
	export default {
		data() {
			return {
				todayArr: [{
						label: '今日订单',
						value: '0'
					},
					{
						label: '今日成交',
						value: '0'
					},
					{
						label: '今日代办',
						value: '0'
					},
				],
				orderArr: [{
						icon: 'iconfont iconliebiao',
						label: '待付款',
						value: '0'
					},
					{
						icon: 'iconfont iconliebiao',
						label: '待接单',
						value: '0'
					},
					{
						icon: 'iconfont iconliebiao',
						label: '待评价',
						value: '0'
					},
					{
						icon: 'iconfont iconliebiao',
						label: '待发货',
						value: '0'
					},
				],
				functionArr: [{
					icon: 'iconfont iconliebiao',
					label: '财务管理'
				}, ],
				timeTabs: ['今日', '本周', '本月'],
				curIndex: 0,
				ringData: [],
				yearMonth: '',
				weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
				isFold: false,
				calendarArr: [],
				curRowIndex: 0,
				// todoList: [{
				// 		name: '外景拍摄，地点大亚湾海边',
				// 		checked: false
				// 	},
				// 	{
				// 		name: '婚礼拍摄',
				// 		checked: true
				// 	},
				// ],
				todoList: [],
				today: Format.formatDateNoHouer(new Date()),
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapState(["user"])
		},
		components: {
			Ring
		},
		watch: {
			yearMonth(val) {
				this.calendarArr = this.getCalendarDays(val)
			}
		},
		onLoad() {
			console.log(this.user.user_data, '用户信息');
			console.log('-------------this.today---------',this.today);
			this.yearMonth = new Date().getFullYear() + '-' + ((new Date().getMonth() + 1 + '').length == 1 ? ('0' + (new Date()
				.getMonth() + 1)) : (new Date().getMonth() + 1));
				console.log('-------------yearMonth---------',this.yearMonth);
			//获取数据统计数据
			this.getDayInfo();
			
			//获取今天待办信息
			this.getTodoByDay(this.today);
		},
		filters: {
			dateFormat(val) {
				return `${val.split('-')[0]}年${val.split('-')[1]}月`
			}
		},
		methods: {
			getDayTime(day, flag) {
			  //第一个传时间，第二个传布尔值 true返回00
			  return `${day}${flag ? " 00:00:00" : " 23:59:59"}`;
			},

			//获取某一天待办信息
			getTodoByDay(day) {
			  let start_time = this.getDayTime(Format.formatDateNoHouer(day), true);
			  let end_time = this.getDayTime(Format.formatDateNoHouer(day), false);
			  this.$http.get(calendar.getByDay, { start_time, end_time }).then(res => {
				this.todoList = res.rows;
				console.error('getTodoByDay--------------',res);
			  });
			},

			//获取今天数据统计信息
			getDayInfo() {
				this.util.homeOrderNum().then(res => {
					console.error('homeOrderNum--+++++++++++++++++---', res);
					this.todayArr[0].value = res.order.all;
					this.todayArr[1].value = res.deal.all;
					this.todayArr[2].value = res.job;
					this.orderArr[0].value = res.wait_status.all;
					this.orderArr[1].value = res.receipt_status.all;
					this.orderArr[2].value = res.comment_status.all;
					this.orderArr[3].value = res.goods_status.all;
				})
			},
			//切换日期
			changeTime(item,i) {
				console.error('changeTime---------',item,i);
				this.curIndex = i
			},
			changeBtn(data) {
				console.log(data, '点击收入支出')
				if (data) {
					this.ringData = [];
					this.lineData.series = [];
				} else {
					this.ringData = [];
					this.lineData.series = [];
				}
			},
			changeYearMonth(val) {
				console.log(val, '年月')
				this.yearMonth = val.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				// let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				// day = day > 9 ? day : '0' + day;
				return `${year}年${month}月`;
				// return `${year}-${month}-${day}`;
			},
			toggleCalendar() {
				this.isFold = !this.isFold
			},
			getAllDays(year, month) {
				month = parseInt(month, 10);
				var d = new Date(year, month, 0);
				console.log(d.getDate(), '某月天数')
				return d.getDate();
			},
			getCalendarDays(ym) {
				// 获取当前月份以及上下个月各自的天数
				let curMonthDay, preMonthDay, nextMonthDay;
				let y = ym.split('-')[0]
				let m = ym.split('-')[1]
				curMonthDay = this.getAllDays(y, m)
				preMonthDay = this.getAllDays(y, m - 1)
				nextMonthDay = this.getAllDays(y, m + 1)
				if (m == 1) {
					preMonthDay = this.getAllDays(y - 1, 12)
				}
				if (m == 12) {
					nextMonthDay = this.getAllDays(y + 1, 1)
				}
				console.log(preMonthDay, curMonthDay, nextMonthDay)
				// 根据每个月的具体天数获取对应的日期数组
				let lastMonth = this.createArrByMonthDay(preMonthDay, 0)
				let curMonth = this.createArrByMonthDay(curMonthDay, 1)
				let nextMonth = this.createArrByMonthDay(nextMonthDay, 0)
				console.log(lastMonth, curMonth, nextMonth)
				// 判断当前月份的第一天和最后一天是星期几
				let first = new Date(ym + '-01').getDay() == 0 ? 7 : new Date(ym + '-01').getDay()
				let last = new Date(ym + '-' + curMonthDay).getDay()
				let arr = [...lastMonth.splice(preMonthDay - first + 1), ...curMonth, ...nextMonth.slice(0, 7 - last)]
				// let arr=lastMonth.splice(preMonthDay-first+1).concat(curMonth).concat(nextMonth.slice(0,7-last))
				console.log(arr, 'ddddddd')
				let newArr = []
				// 数组里面再分割成7行
				for (let i = 0; i < Math.ceil(arr.length / 7); i++) {
					newArr.push(arr.slice(7 * i, 7 * i + 7))
				}
				// 判断当前行
				if (new Date().getFullYear() == this.yearMonth.split('-')[0] && new Date().getMonth() + 1 == this.yearMonth.split(
						'-')[1]) {
					// 当月
					newArr.forEach((item, index) => {
						item.forEach((each, j) => {
							if (new Date().getFullYear() == this.yearMonth.split('-')[0] && new Date().getMonth() + 1 == this.yearMonth.split(
									'-')[1] && new Date().getDate() == each.label) {
								this.curRowIndex = index
							}
						})
					})
				} else {
					// 非当月
					this.curRowIndex = 0
				}
				console.log(newArr, '新数组')
				return newArr
			},
			// 根据月份天数创建对应数组
			createArrByMonthDay(num, flag) {
				let arr = []
				let obj = {
					label: '',
					isCurMonth: false,
					checked: false,
					content: []
				}
				obj.isCurMonth = flag == 1
				for (let i = 0; i < num; i++) {
					obj.label = i + 1
					arr.push({ ...obj
					})
				}
				return arr
			},
			//切换日期
			changeDay(item) {
				console.log('changeDay=========',item);
				this.calendarArr.forEach(item => {
					item.forEach(every => {
						every.checked = false
					})
				})
				item.checked = true
			},
			//查看待办
			todoInfo(item) {
				console.log('--------------todoInfo-------',item);
				item.checked = !item.checked
			},
			toSchedule() {
				uni.navigateTo({
					url: '/pages/schedule/newSchedule'
				})
				// this.$Router.push('/pages/schedule/newSchedule')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.above-title {
		display: flex;
		justify-content: space-between;
		margin-bottom: 24rpx;

		text:first-child {
			font-weight: 500;
		}

		text:last-child {
			width: 128rpx;
			height: 36rpx;
			line-height: 36rpx;
			text-align: center;
			background: rgb(120, 66, 235);
			border-radius: 18rpx;
			font-size: 22rpx;
			color: #fff;
		}
	}

	.card {
		background: #fff;
		box-shadow: 0 8rpx 24rpx 0 rgba(0, 0, 0, 0.04);
		border-radius: 16rpx;
	}

	.home-wrap {
		font-size: 28rpx;
		color: #333;
		padding-top: 60rpx;

		.header {
			height: 240rpx;
			background: linear-gradient(138deg, rgba(147, 59, 255, 1) 0%, rgba(120, 66, 235, 1) 100%);
			display: flex;
			justify-content: space-between;
			padding: 70rpx 24rpx 0;
			box-sizing: border-box;

			.avatar-wrap {
				width: 56rpx;
				height: 56rpx;
				background: #fff;
				border-radius: 50%;
			}

			.name-account {
				display: flex;
				flex-direction: column;
				align-items: center;
				color: #FBFBFB;

				text:first-chidl {
					margin-bottom: 4rpx;
				}

				text:last-child {
					font-size: 22rpx;
				}
			}

			&>text {
				color: #fff;
				font-size: 38rpx;
				font-weight: 600;
			}
		}

		.content {
			padding: 0 24rpx 24rpx;

			.today-row {
				height: 172rpx;
				transform: translateY(-58rpx);
				display: flex;
				align-items: center;

				.today-item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					flex: 1;
					height: fit-content;

					text:first-child {
						margin-bottom: 10rpx;
						font-size: 34rpx;
					}

					text:last-child {
						font-size: 24rpx;
						font-weight: 500;
					}
				}

				.today-item+.today-item {
					border-left: 1px solid #F2F2F6;
				}
			}

			.order-row {
				height: 264rpx;
				margin-top: -34rpx;
				margin-bottom: 24rpx;
				display: flex;

				.order-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					text:first-child {
						font-size: 66rpx;
						margin-bottom: 20rpx;
					}

					text:nth-child(2) {
						margin-bottom: 10rpx;
						font-size: 34rpx;
					}

					text:last-child {
						font-size: 24rpx;
						font-weight: 500;
					}
				}
			}

			.schedule {
				margin-bottom: 48rpx;

				.schedule-content {
					min-height: 596rpx;
					padding: 40rpx 0 10rpx;

					.schedule-top {
						display: flex;
						justify-content: space-between;
						padding: 0 40rpx 40rpx;

						.picker {
							font-weight: 500;
							display: flex;
							width: 210rpx;

							.picker-value {
								display: unset;
								margin-right: auto;
							}
						}

						&>text {
							font-size: 42rpx;
							color: #7842EB;
						}
					}

					.calendar {
						.week-row {
							padding: 0 30rpx;
							display: flex;
							justify-content: space-between;
							margin-bottom: 36rpx;

							text {
								width: 68rpx;
								font-size: 22rpx;
								color: #999;
								text-align: center;
							}
						}

						.calendar-box {
							padding: 0 30rpx 30rpx;

							.box-row {
								height: 68rpx;
								opacity: 1;
								transition: all 0.3s;
								display: flex;
								justify-content: space-between;

								text {
									width: 68rpx;
									height: 68rpx;
									border-radius: 50%;
									display: flex;
									justify-content: center;
									align-items: center;
								}

								.other-month-day {
									color: #B3B3B3;
								}

								.today {
									background: #EEEBF5;
									color: #7842EB;
								}

								.has-content {
									position: relative;

									&:after {
										content: '';
										width: 8rpx;
										height: 8rpx;
										border-radius: 50%;
										background: #7842EB;
										position: absolute;
										left: 50%;
										bottom: 8rpx;
										transform: translateX(-50%);
									}
								}

								.day-check {
									background: #7842EB;
									box-shadow: 0 16rpx 24rpx 0 rgba(20, 6, 49, 0.12);
									color: #fff;
								}
							}

							.box-row+.box-row {
								margin-top: 18rpx;
							}
						}

						.unfold {
							// border: 1px solid tomato;
							overflow: hidden;

							.box-row:not(.cur-row) {
								height: 0;
								opacity: 0;
							}

							.box-row+.box-row {
								margin-top: 0;
							}

							.cur-row {
								z-index: 9;

								text {
									z-index: 99;
								}
							}
						}

						.todo-list {
							height: 280rpx;
							border-top: 2rpx solid #F2F2F6;
							padding: 30rpx;
							box-sizing: border-box;
							margin-bottom: 20rpx;

							.todo-item+.todo-item {
								margin-top: 20rpx;
							}

							.todo-item {
								text:first-child {
									color: #fff;
									background: #fff;
									border: 1px solid #D6D6D6;
									border-radius: 50%;
									margin-right: 20rpx;
									font-size: 24rpx;
								}

								text.checked {
									background: #7842EB;
								}

								text:last-child {
									padding-left: 20rpx;
									font-size: 22rpx;
									position: relative;

									&:before {
										content: '';
										width: 4rpx;
										height: 24rpx;
										background: #7842EB;
										border-radius: 4rpx;
										position: absolute;
										top: 50%;
										left: 0;
										transform: translateY(-50%);
									}
								}
							}
						}

						.operation {
							text-align: center;

							text {
								font-size: 60rpx;
								font-weight: bold;
								color: #F2F3F6;
								color: #eee;
								// transform: rotate(0);
								transition: all 0.5s;
							}

							text.iconfont.toggle {
								display: inline-block;
								transform: rotate(180deg);
							}
						}
					}
				}
			}

			.function-row {
				margin-bottom: 60rpx;
				display: flex;

				.function-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					text:first-child {
						font-size: 68rpx;
						margin-bottom: 20rpx;
					}

					text:last-child {
						font-size: 24rpx;
						font-weight: 500;
						color: #666;
					}
				}
			}

			.finance {
				.finance-content {
					padding-top: 40rpx;
					padding-bottom: 6rpx;

					.time-tab {
						display: flex;
						justify-content: space-between;
						padding: 0 132rpx 40rpx;

						text {
							width: 80rpx;
							text-align: center;
							// background: pink;
						}

						.active-time {
							position: relative;
							color: #7842EB;

							&:after {
								content: '';
								width: 80rpx;
								height: 4rpx;
								border-radius: 2rpx;
								background: #7842EB;
								position: absolute;
								bottom: -20rpx;
								left: 0;
							}
						}
					}
				}
			}

			.activity-order {
				height: 128rpx;
				margin-top: 24rpx;
				display: flex;
				align-items: center;
				padding: 0 24rpx;

				&>text {
					font-size: 34rpx;
				}

				view:nth-of-type(1) {
					font-size: 22rpx;
					color: #999;
					margin: 0 auto;
				}

				view:nth-of-type(2) {
					display: flex;
					align-items: center;
					padding-left: 4rpx;

					text:first-child {
						font-size: 22rpx;
					}

					text:last-child {
						font-size: 60rpx;
						font-weight: 500;
						position: relative;
						bottom: -2rpx;
					}
				}
			}
		}
	}
</style>

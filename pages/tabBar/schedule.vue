<template>
	<view class="wrap">
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="header">
			<picker class="picker" mode="date" fields="day" :value="checkDay" :start="startDate" @change="changeYmd">
				<view class="picker-value">{{checkDay | dateFormat}}</view>
				<text class="iconfont iconarrow-down"></text>
			</picker>
			<text>日程</text>
			<text class="iconfont iconliebiao"></text>
		</view>
		<swiper class="swiper" :duration="0" :current-item-id="slideId" @change="changeSlide">
			<swiper-item class="swiper-item" v-for="(item,index) in loopArr" :key="index" :item-id="'slide'+index">
				<!-- 按天部分模块 -->
				<view class="day-part">
					<view class="day-part-left">全天</view>
					<view class="day-part-right">
						<view class="date-item-wrap">
							<view class="date-item" v-for="(each,j) in item.sevenDay" :key="j">
								<text>{{week.charAt(j)}}</text>
								<text @click="selectDay(each)" :class="{'cur-day':each.isToday, 'selected-day':each.isChecked}">{{each.ymd.split('-')[2]|removeZero}}</text>

							</view>
						</view>
						<view class="todo-list">
							<view class="row" v-for="(row,m) in item.todoArr" :key="m">
								<text class="cell" v-for="each in 7" :key="each"></text>
							</view>
							<view class="real-data" v-for="(todo,n) in item.todoArr" :key="n" :style="'top:'+(n*22)+'px'">
								<view @tap="todoDetail(todo2)" class="dataItem" v-for="(todo2,n2) in todo" :key="n2" :style="'left:'+todo2.left+';width:'+todo2.width">
									{{todo2.text}}
								</view>

							</view>
						</view>
					</view>
				</view>

				<!-- 按小时部分模块 -->
				<view class="timeInfo">
					<view class="time">
						<text v-for="(obj,flag) in hourTimeList" :key="flag">{{obj}}</text>
					</view>

					<view class="info">
						<view class="hourList" v-for="(obj,flag) in item.sevenDay" :key="flag" :style="'left:'+(flag*todoItemWidth)+'px'">
							<view class="hourItem" ref="liItem" v-for="(obj2,flag2) in hourTimeList" :key="flag2">
								<text></text>
							</view>

							<view class="itemList" :style="'z-index:'+(obj.hourTodo.length-n)" v-for="(todo,n) in obj.hourTodo" :key="n">
								<view @tap="todoDetail(todo2)" class="hourContent" v-for="(todo2,n2) in todo" :key="n2" :style="todo2.style">
									{{todo2.content}}
								</view>
							</view>

						</view>
					</view>
				</view>

			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				week: '日一二三四五六',
				today: '',
				checkDay: '',
				loopArr: [],
				curTimeStamp: '',
				deviceWidth: 0,
				slideId: 'slide1',
				old: {
					slideId: 'slide1'
				},
				hourTimeList: [],
				todoItemWidth: 0,
				minHeight: 0, //按小时待办每分钟高度
				hourItemHeight: 0, //按小时待办元素高度
				jobDayList: [], //全天工作列表
				jobHourList: [], //按小时工作列表
				firstDay: '', //获取数据第一天
				lastDay: '', //获取数据最后一天
			}
		},
		computed: {
			startDate() {
				return `${this.util.getCurYear()}年${this.util.getCurMonth()}月`;
			}
		},
		filters: {
			dateFormat(val) {
				return `${val.split('-')[0]}-${val.split('-')[1]}-${val.split('-')[2]}`
			},
			removeZero(val) {
				if (val.split('')[0] == 0) {
					return val.split('')[1]
				} else {
					return val
				}
			}
		},
		onLoad() {
			console.error('schedule-----------onLoad--------');
			//加载按小时显示列表
			for (let i = 1; i < 25; i++) {
				this.hourTimeList.push(i + ":00");
			}

			this.today = this.util.getDate();
			// this.checkDay = this.today;
			this.initDate(true);
			this.getDaysList();
			//获取数据,当前月份数据
			this.getJobData().then(res => {
				// 获取date-item元素的宽
				const query = uni.createSelectorQuery().in(this);
				query.select('.date-item').boundingClientRect(data => {
					this.todoItemWidth = data.width

				}).exec();

				query.select('.hourItem').boundingClientRect(data => {
					this.hourItemHeight = data.height;
					this.minHeight = (data.height / 60).toFixed(2);

					this.getLoopArr();
				}).exec();

			})
		},

		onShow() {
			console.error('schedule-----------onShow--------');
		},
		watch: {
			checkDay() {
				this.getLoopArr();
			},
		},
		mounted() {

			// 初始改变轮播下标为1
			this.old.slideId = 'slide0'
			this.slideId = this.old.slideId
			this.$nextTick(function() {
				this.slideId = 'slide1'
			});
		},
		methods: {
			itemListText(item) {
				console.log('itemListText-----', item);
			},
			//进入待办详情
			todoDetail(item) {
				console.error('todoDetail---------', item);
				this.$Router.push({
					path: "/pages/todo/index",
					query: {
						type: 1,
						id: item.id
					}
				})
			},

			//获取5月份数据
			getJobData() {
				let params = {
					page: 1,
					page_size: 100000,
					start_time: `${this.firstDay} 00:00:01`,
					end_time: `${this.lastDay} 23:59:59`,
				}
				return new Promise((resolve, reject) => {
					this.jobDayList = [];
					this.jobHourList = [];
					this.util.getJob(params).then(res => {
						res.rows.forEach((item, index) => {
							if (!this.util.checkJobTime(item.start_time, item.end_time)) {
								item.start_time = item.start_time.split(' ')[0];
								item.end_time = item.end_time.split(' ')[0];
								//计算两个时间的天数
								item.dayCount = this.util.dayCount(item.start_time, item.end_time);
								item.dayList = this.util.getdiffdate(item.start_time, item.end_time)
								this.jobDayList.push(item);
							} else {
								item.day = item.start_time.split(' ')[0];
								//按小时工作
								//计算两个时间的分钟数
								item.minCount = this.util.calMinDif(item.start_time, item.end_time);
								this.jobHourList.push(item);
							}
						})
						//排序数组
						this.util.sortByProp(this.jobDayList, 'start_time', 'dayCount');
						this.util.sortByProp(this.jobHourList, 'start_time', 'minCount');
						resolve(true);
					})
				})

			},

			// 年月日转时间戳
			ymdToTimestamp(ymd) {
				return new Date(ymd).getTime()
			},

			// 根据年月日获取当天是星期几，结果为0-6，分别对应周日一二三四五六
			getWeek(dateString) {
				let dateArray = dateString.split("-");
				let date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
				return date.getDay()
			},

			//根据年月日获取当天是星期几，结果为0-6
			getWeekNum(date) {
				var weekArray = [0, 1, 2, 3, 4, 5, 6];
				var week = weekArray[new Date(date).getDay()]; //注意此处必须是先new一个Date
				return week;
			},

			initDate(type) {
				if (type) {
					this.checkDay = this.today;
				}
				console.log(this.checkDay, '当前选中的某一天')
				let weekDay = this.getWeek(this.checkDay) //当前选中的某一天是周几
				this.curTimeStamp = this.ymdToTimestamp(this.checkDay) //当前选中的某一天时间戳
				let msInOneDay = 24 * 60 * 60 * 1000 //一天所拥有的毫秒数
				let firstTimeStamp = this.curTimeStamp - msInOneDay * (weekDay + 7) //获取最终数组中第一个数组中第一个日期的毫秒数

				let newArr = []
				let obj = {
					ymd: '',
					timestamp: firstTimeStamp,
					isToday: false,
					isChecked: false,
					content: []
				}
				console.log('firstTimeStamp----------------', obj.timestamp);
				for (let i = 0; i < 21; i++) {
					obj.timestamp = firstTimeStamp + i * msInOneDay
					obj.ymd = this.util.time2Date(obj.timestamp)
					obj.isToday = obj.ymd == this.today
					obj.isChecked = obj.ymd == this.checkDay
					obj.hourTodo = [];
					newArr.push({ ...obj
					})
				}
				console.log(newArr, '未分割数组')

				let result = []
				let slide = {
					todoArr: [],
					sevenDay: []
				}
				for (let i = 0; i < 3; i++) {
					slide.todoArr = []
					newArr.slice(i * 7, i * 7 + 7).forEach((item, index) => {
						slide.sevenDay = newArr.slice(i * 7, i * 7 + 7)
					})
					result.push({ ...slide
					})
				}

				if (type) {
					this.loopArr = result;
					return;
				}

				return result;
			},

			// 获取需要循环的日期数组，是一个二维数组，外层数组里面包含3个随着日历左右滑动动态改变的内部数组，每个内部数组里面包含周日到周一七天
			getLoopArr() {
				let result = this.initDate();

				this.jobDayList.forEach((item, index) => {
					result.forEach((item2, index2) => {
						for (let index3 = 0; index3 < item2.sevenDay.length; index3++) {
							let item3 = item2.sevenDay[index3];
							let flag = item.dayList.findIndex(o => o == item3.ymd);
							if (flag >= 0) {
								let dayList = item.dayList.slice(flag);
								let count = dayList.length;
								let todoLength = item2.todoArr.length;
								let o = {
									id: item.id,
									width: (count * this.todoItemWidth - 4) + 'px',
									left: (this.getWeekNum(dayList[0]) * this.todoItemWidth + 2) + 'px',
									top: todoLength * 22 + 'px',
									no: 0,
									text: item.name,
									dayList: dayList
								}
								if (todoLength > 0) {
									let flag = false;
									for (let index4 = 0; index4 < item2.todoArr.length; index4++) {
										let item5 = item2.todoArr[index4];
										let item5Len = item5.length;
										if (!this.util.getArrSame(dayList, item5[item5Len - 1].dayList)) {
											item5.push(o);
											flag = true;
											break;
										}
									}
									if (!flag) {
										o.no = todoLength;
										let list = [];
										list.push(o);
										item2.todoArr.push(list);
									}
								} else {
									let list = [];
									list.push(o);
									item2.todoArr.push(list);
								}
								break;
							}
						}
					})
				})


				//将按小时的待办添加到sevenDay数组中
				this.jobHourList.forEach((item, index) => {
					result.forEach((item2, index2) => {
						for (let index3 = 0; index3 < item2.sevenDay.length; index3++) {
							if (item2.sevenDay[index3].ymd == item.day) {
								let top = this.util.calMinDif(item.start_time) * this.minHeight + 'px';
								let height = this.util.calMinDif(item.start_time, item.end_time) * this.minHeight + 'px';
								let timeList = [item.start_time, item.end_time];
								let o = {
									id: item.id,
									content: item.name,
									top: top,
									height: height,
									style: `margin-top:${top};height:${height}`,
									timeList: timeList
								}

								let todo = item2.sevenDay[index3].hourTodo;
								let todoLength = todo.length;
								if (todoLength > 0) {
									let flag = false;
									for (let index4 = 0; index4 < todoLength; index4++) {
										let item5 = todo[index4];
										let item5Len = item5.length;
										if (!this.util.checkTime(timeList, item5[item5Len - 1].timeList)) {
											item5.push(o);
											flag = true;
											break;
										}
									}
									if (!flag) {
										o.no = todoLength;
										let list = [];
										list.push(o);
										todo.push(list);
									}
								} else {
									let list = [];
									list.push(o);
									todo.push(list);
								}
								break;

							}
						}
					})
				})


				this.loopArr = result;
				console.log('最终结果-----------', result);
				// return result;
			},

			// 左右滑动切换日期
			changeSlide(e) {
				console.error(e.detail, '切换的轮播')
				switch (e.detail.current) {
					case 0:
						console.log('当前轮播序号为0')
						this.changeSwiperData(e, 0);
						break
					case 1:
						console.log('当前轮播序号为1');
						break
					case 2:
						console.log('当前轮播序号为2')
						this.changeSwiperData(e, 1);

						break
				}
			},

			//切换轮播获取数据,type:0,向左，1、向右
			changeSwiperData(e, type) {
				if (type == 0) {
					this.curTimeStamp -= 24 * 60 * 60 * 1000 * 7
				} else if (type == 1) {
					this.curTimeStamp += 24 * 60 * 60 * 1000 * 7
				}
				console.error('this.curTimeStamp----------', this.curTimeStamp);
				this.checkDay = this.util.time2Date(this.curTimeStamp)
				console.log(this.checkDay, '当前选中的日期要增加7天')
				this.old.slideId = e.detail.currentItemId
				this.slideId = this.old.slideId
				this.getDaysList();
				this.getJobData().then(res => {
					this.getLoopArr();
				});

				this.$nextTick(function() {
					this.slideId = 'slide1'
				})
			},

			//根据当前选中的日，获取前后两周的日期，获取数据
			getDaysList() {
				let weekNum = Number(this.getWeekNum(this.checkDay));
				this.firstDay = this.util.getCountDay(this.checkDay, Number(-7 - weekNum));
				this.lastDay = this.util.getCountDay(this.checkDay, Number(7 + (6 - weekNum)));
			},

			// 点击某一天
			selectDay(item) {
				console.log(item, '选择某天')
				this.checkDay = item.ymd
			},

			// 顶部日期选择器切换日期
			changeYmd(val) {
				console.log(val.target.value, '年月')
				this.checkDay = val.target.value
			}

		}
	}
</script>

<style lang="scss" scoped>
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #f2f3f6;
	}
	
	.top_view {
		height: var(--status-bar-height);
		width: 100%;
		position: fixed;
		background-color: #f2f3f6;
		top: 0;
		z-index: 999;
	}
	.wrap .swiper {
		height: auto;
	}

	/deep/ uni-swiper .uni-swiper-slides {
		position: relative;
	}

	/deep/ uni-swiper .uni-swiper-slide-frame {
		position: relative;
	}

	/deep/ .swiper-item:nth-child(2) {
		position: relative !important;
	}

	.wrap {
		background: #fff;

		// height: 200vh;
		.header {
			display: flex;
			align-items: center;
			height: 94rpx;
			padding: 0 24rpx;
			justify-content: space-between;

			.picker {
				font-weight: 500;
				display: flex;
				width: 210rpx;

				.picker-value {
					display: unset;
					margin-right: auto;
					font-weight: 500;
				}
			}

			&>text {
				&:nth-of-type(1) {
					text-align: center;
					font-size: 34rpx;
				}

				&:nth-of-type(2) {
					text-align: right;
					font-size: 26rpx;
				}
			}
		}

		.swiper {
			height: calc(100% - 47px);
			// background: lightcyan;

			.swiper-item {
				display: flex;
				flex-direction: column;
				// height: 100%;

				.day-part {
					display: flex;
					border: 1px solid #F0F0F0;

					.day-part-left {
						width: 106rpx;
						padding-top: 160rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #999;
						font-size: 22rpx;
					}

					.day-part-right {
						width: calc(100% - 53px);
						min-height: 160rpx;
						// background: pink;

						.date-item-wrap {
							display: flex;

							.date-item {
								min-width: calc(100% / 7);
								max-width: calc(100% / 7);
								display: flex;
								flex-direction: column;
								border-left: 1px solid #F0F0F0;

								&>text:first-child {
									height: 80rpx;
									// background: lightgreen;
									display: flex;
									justify-content: center;
									align-items: center;
								}

								&>text:nth-child(2) {
									align-self: center;
									width: 100%;
									width: 56rpx;
									height: 56rpx;
									margin: 12rpx 0;
									display: flex;
									justify-content: center;
									align-items: center;
								}

								.selected-day {
									background: #7842EB;
									border-radius: 50%;
									color: #fff;
									box-shadow: 0px 12px 12px 0px rgba(20, 6, 49, 0.12);
								}
							}
						}

						.todo-list {
							position: relative;

							.row {
								height: 40rpx;
								display: flex;

								.cell {
									width: calc(100% / 7);
									border-left: 1px solid #F0F0F0;
								}
							}

							.row+.row {
								margin-top: 4rpx;
							}

							.real-data {
								position: absolute;
								top: 0;
								left: 0;
								height: 40rpx;
								line-height: 40rpx;
								// background: #EEEBF5;
								font-size: 22rpx;
								color: #333;
								overflow: hidden;
								white-space: nowrap;
								width: 100%;

								.dataItem {
									position: absolute;
									overflow: hidden;
									background: #EEEBF5;
									border-radius: 4rpx;
								}
							}
						}
					}
				}

				.hour-part {
					flex: 1;

					view {
						background: lightblue;
						// height: 100%;
					}
				}
			}
		}
	}

	.timeInfo {
		display: flex;
		justify-content: flex-start;
		padding-bottom: 80rpx;
	}

	.time {
		display: flex;
		flex-direction: column;
		width: 106rpx;

		text {
			display: inline-block;
			height: 84rpx;
			line-height: 89px;
			text-align: center;
			color: rgba(153, 153, 153, 1);
		}
	}

	.info {
		display: flex;
		justify-content: flex-start;
		position: relative;

		.hourItem {
			width: 92rpx;
			height: 84rpx;

			text {
				width: 100%;
				height: 100%;
				border: 1px solid #f0f0f0;
				display: inline-block;
				box-sizing: border-box;
			}
		}
	}

	.hourList {
		position: absolute;

		/deep/ .itemContent {
			position: absolute;
			left: 5%;
			background: #EEEBF5;
			width: 90%;
		}

		.itemList {
			position: absolute;
			// height:100%;
			width: 86%;
			top: 0rpx;
			left: 7%;
			display: flex;
			z-index: 100000000000000;

			.hourContent {
				// position:absolute;
				background: #EEEBF5;
				flex: 1;
				overflow: hidden;
				margin-right: 6rpx;

				&:last-child {
					margin-right: 0rpx;
				}
			}
		}
	}
</style>

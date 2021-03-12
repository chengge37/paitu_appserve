<template>
	<view class="wrap">
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
				<view class="day-part">
					<view class="day-part-left">全天</view>
					<view class="day-part-right">
						<view class="date-item-wrap">
							<view class="date-item" v-for="(each,j) in item.sevenDay" :key="j">
								<text>{{week.charAt(j)}}</text>
								<text @click="selectDay(each)" :class="{'cur-day':each.isToday,'selected-day':each.isChecked}">{{each.ymd.split('-')[2]|removeZero}}</text>

							</view>
						</view>
						<view class="todo-list">
							<view class="row" v-for="(row,m) in item.todoArr" :key="m">
								<text class="cell" :class="{'active-cell':row.content}" v-for="each in 7" :key="each"></text>
							</view>
							<view class="real-data" v-for="(todo,n) in item.todoArr" :style="'width:'+todo.width+';left:'+todo.left+';top:'+todo.top">{{todo.text}}</view>
						</view>
					</view>
				</view>
				<scroll-view class="hour-part" scroll-y="true">
					<view v-for="item in 30" :key="item">时间部分</view>
				</scroll-view>
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
				todoItemWidth: 0,
				jobDayList:[], //全天工作列表
				firstDay:'',   //获取数据第一天
				lastDay:'', //获取数据最后一天
			}
		},
		computed: {
			startDate() {
				return `${this.util.getCurYear()}年${this.util.getCurMonth()}月`;
			}
		},
		filters: {
			dateFormat(val) {
				return `${val.split('-')[0]}年${val.split('-')[1]}月`
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
			console.log('onLoad-----------');
			const {
				windowWidth
			} = uni.getSystemInfoSync();
			this.deviceWidth = windowWidth

			this.today = this.util.getDate();
			this.checkDay = this.today;
			this.getDaysList();
			//获取数据,当前月份数据
			this.getJobData().then(res=>{
				// 获取date-item元素的宽
				const query = uni.createSelectorQuery().in(this);
				query.select('.date-item').boundingClientRect(data => {
					this.todoItemWidth = data.width
				}).exec();
				this.getLoopArr();
			})
			
			
			
		},
		mounted() {
			// 初始改变轮播下标为1
			this.old.slideId = 'slide0'
			this.slideId = this.old.slideId
			this.$nextTick(function() {
				this.slideId = 'slide1'
			});
		},
		watch: {
			checkDay() {
				this.getLoopArr();
			},
		},
		methods: {
			//获取5月份数据
			getJobData(){
				let params={
					page:1,
					page_size:100000,
					start_time:`${this.firstDay} 00:00:01`,
					end_time:`${this.lastDay} 23:59:59`,
				}
				return new Promise((resolve,reject)=>{
					this.jobDayList=[];
					this.util.getJob(params).then(res=>{
						res.rows.forEach((item,index)=>{
							if(!this.util.checkJobTime(item.start_time,item.end_time)){
								item.start_time=item.start_time.split(' ')[0];
								item.end_time=item.end_time.split(' ')[0];
								//计算两个时间的天数
								item.dayCount=this.util.dayCount(item.start_time,item.end_time);
								item.dayList=this.util.getDateInfo(item.start_time,item.end_time)
								this.jobDayList.push(item);
							}
						})
						//排序数组
						this.util.sortByProp(this.jobDayList,'start_time','dayCount');
						console.log('jobDayList-----',this.jobDayList);
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
			getWeekNum(date){
			  var weekArray = [0,1,2,3,4,5,6];
			  var week = weekArray[new Date(date).getDay()];//注意此处必须是先new一个Date
			  return week;
			},
			// 获取需要循环的日期数组，是一个二维数组，外层数组里面包含3个随着日历左右滑动动态改变的内部数组，每个内部数组里面包含周日到周一七天
			getLoopArr() {
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
				for (let i = 0; i < 21; i++) {
					obj.timestamp = firstTimeStamp + i * msInOneDay
					obj.ymd = this.util.time2Date(obj.timestamp)
					obj.isToday = obj.ymd == this.today
					obj.isChecked = obj.ymd == this.checkDay
					obj.content = []
					newArr.push({ ...obj})
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
						slide.todoArr.push(...item.content)
						slide.sevenDay = newArr.slice(i * 7, i * 7 + 7)
					})
					result.push({ ...slide})
				}
				
				this.jobDayList.forEach((item,index)=>{
					result.forEach((item2,index2)=>{
						for(let index3=0;index3<item2.sevenDay.length;index3++){
							let item3=item2.sevenDay[index3];
							let flag=item.dayList.findIndex(o=>o==item3.ymd);
							if(flag>=0){
								let dayList=item.dayList.slice(flag);
								let count=dayList.length;
								let o={
									width:count*this.todoItemWidth+'px',
									left:this.getWeekNum(dayList[0])*this.todoItemWidth+'px',
									top:item2.todoArr.length*22+'px',
									no:item2.todoArr.length,
									text:item.name
								}
								item2.todoArr.push(o);
								return;
							}
						}
					})
				})
				
				this.loopArr=result;
				console.log('最终结果-----------',result);
				// return result;
			},
			
			// 左右滑动切换日期
			changeSlide(e) {
				console.error(e.detail, '切换的轮播')
				switch (e.detail.current) {
					case 0:
						console.log('当前轮播序号为0')
						this.changeSwiperData(e,0);
						break
					case 1:
						console.log('当前轮播序号为1');
						break
					case 2:
						console.log('当前轮播序号为2')
						this.changeSwiperData(e,1);
						
						break
				}
			},
			
			//切换轮播获取数据,type:0,向左，1、向右
			changeSwiperData(e,type){
				if(type==0){
					this.curTimeStamp -= 24 * 60 * 60 * 1000 * 7
				}else if(type==1){
					this.curTimeStamp += 24 * 60 * 60 * 1000 * 7
				}
				
				this.checkDay = this.util.time2Date(this.curTimeStamp)
				console.log(this.checkDay, '当前选中的日期要增加7天')
				this.old.slideId = e.detail.currentItemId
				this.slideId = this.old.slideId
				this.getDaysList();
				this.getJobData().then(res=>{
					this.getLoopArr();
				});
				
				this.$nextTick(function() {
					this.slideId = 'slide1'
				})
			},
			
			//根据当前选中的日，获取前后两周的日期，获取数据
			getDaysList(){
				let weekNum=Number(this.getWeekNum(this.checkDay));
				this.firstDay=this.util.getCountDay(this.checkDay,Number(-7-weekNum));
				this.lastDay=this.util.getCountDay(this.checkDay,Number(7+(6-weekNum)));
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
	.wrap {
		background: #fff;
		height: 100vh;

		.header {
			display: flex;
			align-items: center;
			height: 94rpx;
			padding: 0 24rpx;

			.picker {
				font-weight: 500;
				display: flex;
				width: 210rpx;
				flex: 1;

				.picker-value {
					display: unset;
					margin-right: auto;
					font-weight: 500;
				}
			}

			&>text {
				flex: 1;

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
			background: lightcyan;

			.swiper-item {
				display: flex;
				flex-direction: column;
				height: 100%;

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
						background: pink;

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
									background: lightgreen;
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
									background: orangered;
									color: #fff;
								}
							}
						}

						.todo-list {
							position: relative;

							.row {
								height: 40rpx;
								background: rgba(113, 155, 135, 0.2);
								display: flex;

								.cell {
									width: calc(100% / 7);
								}

								.cell+.cell {
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
								background: #EEEBF5;
								font-size: 22rpx;
								color: #333;
								overflow: hidden;
								white-space: nowrap;
							}
						}
					}
				}

				.hour-part {
					flex: 1;

					view {
						background: lightblue;
						height: 100%;
					}
				}
			}
		}
	}
</style>

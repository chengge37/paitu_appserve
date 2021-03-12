<template>
	<view class="home-wrap">
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<view class="header">
			<view class="avatar-wrap">
				<image :src="util.picExplode(user_data.avatar,'0')"></image>
			</view>
			<view class="name-account">
				<text>{{user_data.nick}}</text>
				<text>账号{{user_data.mobile}}</text>
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
				<view class="order-item" v-for="(item,index) in orderArr" :key="index" @tap="toOrderList(item.status)">
					<!-- <text :class="item.icon"></text>-->
					<image clsss="img" :src='item.imgUrl'></image>
					<text>{{item.value}}</text>
					<text>{{item.label}}</text>
				</view>
			</view>
			<view class="schedule">
				<view class="above-title">
					<text>我的日程</text>
					<text @tap="toSchedule">日程管理</text>
				</view>
				<view class="card schedule-content">
					<view class="schedule-top">
						<picker class="picker" mode="date" fields="month" :value="yearMonth" :start="startDate" :end="endDate" @change="changeYearMonth">
							<view class="picker-value">{{yearMonth | dateFormat}}</view>
							<text class="iconfont iconarrow-down"></text>
						</picker>
						<text class="iconfont iconjiahao1" @tap="addTodo"></text>
					</view>
					<view class="calendar">
						<view class="week-row">
							<text v-for="(item,index) in weeks" :key="index">{{item}}</text>
						</view>
						<view class="calendar-box" :class="{unfold:!isFold}">
							<view class="box-row" :class="{'cur-row':curRowIndex==index}" v-for="(item,index) in calendarArr" :key="index">
								<text v-for="(each,j) in item" :key="j" :class="{'gray':!each.isCurMonth,'hasTodo':each.todo>0&&each.isCurMonth,'today':each.today, 'day-check':each.checked}"
								 @click="changeDay(each)">{{new Date().getFullYear()==yearMonth.split('-')[0]&&new Date().getMonth()+1==yearMonth.split('-')[1]&&new Date().getDate()==each.label&&each.isCurMonth?'今':each.label}}
								</text>
							</view>
						</view>
						<scroll-view class="todo-list" scroll-y="true" show-scrollbar="true">
							<view v-if="todoList.length>0">
								<view class="todo-item" v-for="(item,index) in todoList" :key="index">
									<text class="iconfont iconyueduye-pifuxuanzhongzhuangtai" @tap="editTodoStatus(item)" :class="{checked:item.checked}"></text>
									<text @tap="todoDetail(item.id)">{{item.name}}</text>
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
			
			<view class="finance">
				<view class="above-title">
					<text>财务看板</text>
					<text @tap="toFinanceList">财务列表</text>
				</view>
				<view class="card finance-content">
					<view class="time-tab">
						<text :class="{'active-time':index==curIndex}" v-for="(item,index) in timeTabs" :key="index" @click="changeTime(index)">{{item}}</text>
					</view>
					<Ring :chartData="ringData" Width="750" Height="500" @changeBtn="changeBtn"></Ring>
				</view>
			</view>
			
			<!-- 活动模块 -->
			<!-- <view class="card activity-order">
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
			</view> -->
			
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import Ring from '@/components/u-charts/ring';
	import {
		calendar,
		users
	} from "@/common/api/api";
	import {
		Format
	} from "@/common/utils/formatDate.js";
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
						imgUrl:'/static/img/daifukuan.png',
						label: '待付款',
						value: '0',
						status:'1',
					},
					{
						imgUrl:'/static/img/daijiedan.png',
						label: '待接单',
						value: '0',
						status:'2',
					},
					{
						imgUrl:'/static/img/daipingjia.png',
						label: '待评价',
						value: '0',
						status:'7',
					},
					{
						imgUrl:'/static/img/daifahuo.png',
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
				todoList: [],
				today: '',
				selectDay:'', //选择的日期
				timeType: '2', //查询财务数据时间类型，1昨天,2今天,3上周,4这周,5上月,6本月,7去年,8今年,9自定义
				is_in: 1, //查询财务数据类型，0/支出,1/收入
				firstLoad:true, //是否第一次加载
			}
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			...mapGetters(['user_data']),
		},
		components: {
			Ring
		},
		watch: {
			yearMonth(val) {
				this.calendarArr = this.getCalendarDays(val);
				console.error('yearMonth--------', val);
				this.getTodoByMonth(val);
			}
		},
		onLoad() {
			console.error('home-------------onLoad---------');
			this.yearMonth = this.util.getCurYear() + '-' + this.util.getCurMonth();
			this.today = this.util.getDate();
			this.selectDay=this.util.getDate();
			this.loadPageData();
		},
		onShow(){
			//如果不是第一次加载，重新加载数据
			if(!this.firstLoad){
				//重新加载数据
				this.loadPageData();
			}else{
				this.firstLoad=false;
			}
			
		},
		
		filters: {
			dateFormat(val) {
				return `${val.split('-')[0]}年${val.split('-')[1]}月`
			}
		},
		onPullDownRefresh() {
			console.log('onPullDownRefresh-------------------refresh');
			//重新加载数据
			this.loadPageData();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//跳转到待办页面
			addTodo() {
				console.log('addTodo---------------');
				let url="/pages/todo/index";
				let params={day:this.selectDay};
				this.$Router.push({
					path:url,
					query:params
				});
			},
			
			//跳转到待办详情
			todoDetail(id){
				console.log('todoDetail--------',id);
				this.$Router.push({
					path:"/pages/todo/index",
					query:{type:1,id:id}
				})
			},
			//跳转到对应状态的订单列表
			toOrderList(status){
				console.log('toOrderList------',status);
				let orderType;
				
				let params={
					// orderType:1,
					status:status
				}
				this.$store.commit('updateTabParams',params)
				uni.switchTab({
					url:'/pages/tabBar/order'
				})
			},
			
			//加载页面数据
			loadPageData(){
				console.log('loadPageData-----------------');
				//获取今日数据统计数据
				this.getDayInfo();
				
				//获取今天待办信息
				this.getTodoByDay(this.selectDay);
				
				//按月获取待办信息
				this.getTodoByMonth(this.yearMonth);
				
				//获取财务数据
				this.financeAll();
				
				//Sokcet初始化
				this.socketInit();
			},
			socketInit(){
				console.log('当前用户数据'+JSON.stringify(this.$store.getters.user_data));
				let _this = this;
				 plus.push.getClientInfoAsync(function(clientInfo){
				   console.error('PUSH TOKEN = '+JSON.stringify(clientInfo))
				   if(_this.$store.getters.is_login_in){
					//如果登录了 检查push token 和获取到的一样的话 就不更新了
						let same = false;
						if(_this.$store.getters.user_data.serve_app_push_token != undefined){
							if(_this.$store.getters.user_data.serve_app_push_token == clientInfo.token){
								same = true;
							}
						}
						if(!same){
							let data = {app_type:2,token:clientInfo.token};
							_this.$http.post(users.uploadUserAppPushToken, data).then(res=>{
								console.error('上传成功'+JSON.stringify(res))
								let userData = _this.$store.getters.user_data;
								userData.serve_app_push_token = res;
								_this.$store.commit('update_user_data',userData)
							}).catch(err=>{
								console.error('上传失败')
							});
						} else {
							console.log('PUSH_TOKEN一样 不用上传');
						}
				   } else {
					   //如果没登录，存起来登录后再传
					   console.error('没有登录 不用上传');
					   this.$store.commit('update_push_token',clientInfo.token)
					   
				   }
				   
				 }, function(e){
				   console.error('异步获取标识失败');
				   console.log(JSON.stringify(e));
				 });
				 if(this.$store.getters.is_login_in){
					if(this.$IM.IM == null){
						console.error('APP有用户数据 登录IM');
						this.$store.dispatch('pimLogin')	
					} else {
						console.error('IM已经有了');
					}
				 } else {
				    console.error('没有用户数据 无法登录IM');
				 }
			},
			//获取财务列表数据
			financeAll() {
				let params = {
					time_type: this.timeType, // 1昨天,2今天,3上周,4这周,5上月,6本月,7去年,8今年,9自定义
					is_in: this.is_in,
					page: 1,
					page_size: 10000000,
				}
				this.util.financeAll(params).then(res => {
					this.ringData = this.changeFinanceData(res.rows);
				})
			},

			//处理财务列表数据
			changeFinanceData(arr) {
				let tempArr = [];
				arr.forEach(item => {
					let index = tempArr.findIndex(item1 => {
						return item1.name == item.type_name;
					});
					if (index == "-1") {
						tempArr.push({
							name: item.type_name,
							data: +item.money
						});
					} else {
						tempArr[index].data = Number(tempArr[index].data) + Number(item.money);
					}
				});
				tempArr.forEach((item, index) => {
					item.data = Number(item.data.toFixed(2));
				})
				return tempArr;
			},


			//跳转到财务列表页面
			toFinanceList() {
				this.$Router.push('/pages/finance/index');
			},

			//转换时间格式
			getDayTime(day, flag) {
				//第一个传时间，第二个传布尔值 true返回00
				return `${day}${flag ? " 00:00:00" : " 23:59:59"}`;
			},

			//获取某一天待办信息
			getTodoByDay(day) {
				console.error('getTodoByDay---',day);
				this.selectDay=day;
				let start_time = this.getDayTime(Format.formatDateNoHouer(day), true);
				let end_time = this.getDayTime(Format.formatDateNoHouer(day), false);
				this.$http.get(calendar.getByDay, {
					start_time,
					end_time
				}).then(res => {
					console.error('getTodoByDay--res--------',res);
					res.rows.forEach((item,index)=>{
						if(item.status==3){
							item.checked=true;
						}
					})
					this.todoList = res.rows;
				});
			},

			//修改待办状态方法
			editTodoStatus(item){
				console.log('editTodoStatus---------',item);
				let tip,status;
				if(item.status==1){
					tip='结办';
					status=3;
				}else if(item.status==3){
					tip="待办";
					status=1;
				}
				let array=[];
				item.employee_array.forEach((item,index)=>{
					array.push(item.id);
				})
				this.util.confirm('确定修改状态为：'+tip+'?').then(res=>{
					if(res){
						let params={
							id:item.id,
							start_time:item.start_time,
							end_time:item.end_time,
							remark:item.remark,
							name:item.name,
							employee_id_array_str:array.join(),
							type:item.type,
							status:status,
							notice_way:item.notice_way
						}
						this.util.updateJob(params).then(res=>{
							console.log("updateJob-----",res);
							this.util.showTip('操作成功！');
							//刷新数据
							this.getTodoByDay(this.selectDay);
						})
					}
				})
				
			},

			//按月获取待办
			getTodoByMonth(yearMonth) {
				this.$http.get(calendar.getByMonth, {
					month: yearMonth
				}).then(res => {
					let tmp = this.handleObj(res.order_count_data);
					this.calendarArr.forEach((item, index) => {
						item.forEach((item2, index2) => {
							for (let i in tmp) {
								if (item2.label == i) {
									// item2.todo = tmp[i];
									this.$set(item2,'todo',tmp[i]);
								}
							}
						})
					});
				});
			},

			handleObj(obj) {
				let eo = {};
				for (let i = 0; i < 35; i++) {
					eo[i] = 0;
				}
				let tmp = {};
				Object.keys(obj).forEach(item => {
					tmp[+item] = obj[item];
				});
				eo = { ...eo,
					...tmp
				};
				return eo;
			},


			//获取今天数据统计信息
			getDayInfo() {
				this.util.homeOrderNum().then(res => {
					this.todayArr[0].value = res.order.all;
					this.todayArr[1].value = res.deal.all;
					this.todayArr[2].value = res.job;
					this.orderArr[0].value = res.wait_status.all;
					this.orderArr[1].value = res.receipt_status.all;
					this.orderArr[2].value = res.comment_status.all;
					this.orderArr[3].value = res.goods_status.all;
				})
			},
			//切换财务时间类型
			changeTime(index) {
				console.log('changeTime-------', index);
				if (this.curIndex == index) return;
				this.curIndex = index;
				let timeType;
				switch (Number(index)) {
					case 0:
						timeType = 2;
						break;
					case 1:
						timeType = 4;
						break;
					case 2:
						timeType = 6;
						break;
				}
				this.timeType = timeType;
				this.financeAll();
			},
			//切换财务收入支出类型,val:,0/收入,1/支出
			changeBtn(val) {
				if (val == 0) {
					this.is_in = 1;
				} else {
					this.is_in = 0;
				}
				this.financeAll();
			},
			changeYearMonth(val) {
				this.yearMonth = val.target.value
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				return `${year}年${month}月`;
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
				// 根据每个月的具体天数获取对应的日期数组
				let lastMonth = this.createArrByMonthDay(preMonthDay, 0)
				let curMonth = this.createArrByMonthDay(curMonthDay, 1)
				let nextMonth = this.createArrByMonthDay(nextMonthDay, 0)
				// console.log(lastMonth, curMonth, nextMonth)
				// 判断当前月份的第一天和最后一天是星期几
				let first = new Date(ym + '-01').getDay() == 0 ? 7 : new Date(ym + '-01').getDay()
				let last = new Date(ym + '-' + curMonthDay).getDay()
				let arr = [...lastMonth.slice(preMonthDay - first + 1), ...curMonth, ...nextMonth.slice(0, 7 - last)]
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
									'-')[1] && new Date().getDate() == each.label && each.isCurMonth) {
								this.curRowIndex = index
							}
						})
					})
				} else {
					// 非当月
					this.curRowIndex = 0
				}
				return newArr
			},
			// 根据月份天数创建对应数组
			createArrByMonthDay(num, flag) {
				let arr = []
				let obj = {
					label: '',
					isCurMonth: false,
					checked: false,
					today: false,
					content: []
				}
				obj.isCurMonth = flag == 1
				for (let i = 1; i <= num; i++) {
					let item = { ...obj
					};
					item.label = i;
					if (this.util.getDate() == this.yearMonth + "-" + this.util.toDouble(i) && item.isCurMonth) {
						item.checked = true;
						item.today = true;
					}
					arr.push(item);
				}
				return arr
			},
			//切换日期
			changeDay(item) {
				console.error('changeDay---------',item);
				if (!item.isCurMonth) return;
				this.calendarArr.forEach(item => {
					item.forEach(every => {
						every.checked = false
					})
				})
				item.checked = true
				//获取相关待办
				let day = this.yearMonth + '-' + this.util.toDouble(item.label);
				this.getTodoByDay(day);
			},
			//跳转到日程列表页面
			toSchedule() {
				uni.switchTab({
					url: '/pages/tabBar/schedule'
				})
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
				image{
					width:100%;
					height:100%;
					border-radius: 50%;
				}
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
					image{
						width:72rpx;
						height:72rpx;
					}
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
									position: relative;
								}

								.gray {
									color: #bbb;
								}

								.hasTodo {
									&::after {
										content: "";
										display: block;
										width: 8rpx;
										height: 8rpx;
										border-radius: 8rpx;
										background: rgba(120, 66, 235, 1);
										position: absolute;
										left: 45%;
										bottom: 10%;
									}
								}

								.other-month-day {
									color: #B3B3B3;
								}

								.today {
									background: #EEEBF5;
									color: #7842EB;
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
				white-space: nowrap;

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

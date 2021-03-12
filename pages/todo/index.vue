<template>
	<div class="wrap">
		<view class="todoContent">
			<view class="top">
				<Top :showComplete="true" :hasComplete="complete" @complete="saveTodo" bgColor="#fff" @back="back"></Top>
			</view>
			<div class="title">
				<textarea @input="inputTitle" :value="form.name" placeholder="请输入标题..." show-confirm-bar="true" placeholder-style="color: rgba(179, 179, 179, 1);"
				 style="font-size: 14px;height:120rpx;color:#333"></textarea>
			</div>
			<div class="line"></div>
			<div class="allDay">
				<div>按天/按小时</div>
				<div>
					<switch @change="changeRentType" :checked="allDay"></switch>
				</div>
			</div>
			<div class="time flexBoth">
				<div>
					<div>开始</div>
					<div>
						<picker mode="time" @change="changeTime($event,0)" :value="form.start_time" v-if="!allDay">
							<text>{{form.start_time}}</text>
						</picker>
						<picker mode="date" fields="day" @change="changeTime($event,0)" :value="form.start_time" v-else>
							<text>{{form.start_time}}</text>
						</picker>
					</div>
				</div>
				
				<div class="selectDay defaultShadow" v-if="!allDay">{{selectDay}}</div>
				
				<div class="endTime">
					<div>结束</div>
					<div>
						<picker mode="time" @change="changeTime($event,1)" :value="form.end_time" v-if="!allDay">
							<text>{{form.end_time}}</text>
						</picker>
						<picker mode="date" fields="day" @change="changeTime($event,1)" :value="form.end_time" v-else>
							<text>{{form.end_time}}</text>
						</picker>
					</div>
				</div>
			</div>
			<div class="line"></div>

			<picker @change="changeTag" :range="tags" range-key="value">
				<div class="type flexBoth">
					<div>优先级</div>
					<div class="flex">
						<view class="uni-input status" :class="{'orange':tagIndex==1,'red':tagIndex==2}">{{tagStr}}</view>
						<span class="iconfont iconarrow-right"></span>
					</div>
				</div>
			</picker>

			<picker @change="changeStatus" :range="statusList" range-key="value">
				<div class="type flexBoth">
					<div>状态</div>
					<div class="flex">
						<view class="uni-input">{{statusStr}}</view>
						<span class="iconfont iconarrow-right"></span>
					</div>
				</div>
			</picker>

			<div class="line"></div>
			<div class="people flexBoth" @tap="show">
				<div>执行人</div>
				<div>
					{{employeeName}}
					<span class="iconfont iconarrow-right"></span>
				</div>
			</div>
			<div class="line"></div>
			<div class="content">
				<textarea @input="inputContent" :value="form.remark" placeholder="输入正文内容...(例如:公司会议)" show-confirm-bar="true"
				 placeholder-style="color: rgba(179, 179, 179, 1);" style="font-size: 14px;color:#333"></textarea>
			</div>
		</view>

		<view class="footBtn">
			<view class="baseButton" :class="{'gray':!complete}" @tap="saveTodo">{{btnTxt}}</view>
			<view class="baseButton" v-if="todoId" @tap="delTodo">删除</view>
		</view>

		<tki-tree ref="tkitree" :range="menberOptions" idKey="value" rangeKey="label" confirmColor="#4e8af7" @confirm="confirm"
		 v-if="flag" />
	</div>
</template>
<script>
	import {
		Format
	} from "@/common/utils/formatDate.js";
	import UniTag from "components/tag/uni-tag.vue";
	import tkiTree from "components/multiSelector/tki-tree.vue";
	import Top from '@/components/top-head/top-head'
	import {
		mapGetters
	} from 'vuex'
	import {
		employee
	} from "common/api/api";
	export default {
		components: {
			UniTag,
			tkiTree,
			Top
		},
		data() {
			return {
				form: {
					start_time: '',
					end_time: '',
					name: "",
					employee_id_array_str: '', //	员工ID数组字符串
					remark: "",
					type: '', //优先级 1一般 2普通 3紧急
					status: '', //状态 0未开始 1待办 2处理 3结办
					notice_way: '3', //通知方式,逗号分隔 1短息，2邮箱，3站内信
				},
				start_time: "",
				end_time: "",
				start_day: "",
				end_day: "",
				now: new Date(),
				tagIndex: 0,
				rangeKey: 1,
				flag: false,
				tags: [{
						key: 1,
						value: "一般",
					},
					{
						key: 2,
						value: "重要",
					},
					{
						key: 3,
						value: "紧急",
					}
				],
				statusList: [{
						key: 0,
						value: "待办"
					},
					{
						key: 1,
						value: "结办"
					}
				],
				statusStr: '待办', //状态显示
				tagStr: '一般', //优先级显示
				menberOptions: [],
				allDay: false,
				selectMonth: "",
				employeeId: "",
				employeeName: '', //选择的员工的名称
				complete: false, //是否可以添加待办
				selectDay: '', //选择的日期，默认是今天
				todoId: '', //要编辑的待办id
				btnTxt: '添加',
			};
		},
		computed: {
			...mapGetters(['user_data']),
		},
		watch: {

		},
		onLoad(options) {
			console.log('todo------onLoad------options-----', options);
			if (!this.util.isEmpty(options)) {
				if(options.id){
					this.todoId = options.id;
					this.todoDetail();
					this.btnTxt = '修改';
				}else{
					if(options.day){
						this.selectDay=options.day;
					}
				}
				
			}
		},
		mounted() {
			this.form.start_time = this.getHourmin();
			this.form.end_time = this.getHourmin(1);

			// if(!this.selectDay){
			// 	this.selectDay = this.util.getDate();
			// }
			console.log('mounted----------');
			this.getMember();
			this.form.type = 1;
			this.form.status = 1;
		},
		methods: {
			//获取待办详情
			todoDetail() {
				this.util.jobDetail(this.todoId).then(res => {
					console.log('todoDetail-----', res);
					//判断待办是按天，还是按小时
					let startTime=res.start_time;
					let endTime=res.end_time;
					if(!this.util.checkJobTime(startTime,endTime)){
						startTime = startTime.split(' ')[0];
						endTime = endTime.split(' ')[0];
						this.allDay = true;
					} else {
						this.selectDay=startTime.split(' ')[0];
						startTime = startTime.split(' ')[1].substr(0, 5);
						endTime = this.util.addTime(endTime, 1).split(' ')[1].substr(0, 5);
					}

					let form = {
						start_time: startTime,
						end_time: endTime,
						remark: res.remark,
						name: res.name,
						employee_id_array_str: res.employee_array,
						staffName: res.employee_name_array,
						type: res.type, //优先级 1一般 2普通 3紧急
						status: res.status, //状态 0未开始 1待办 2处理 3结办
						notice_way: res.notice_way,
					}

					if (res.status == 1) {
						this.statusStr = this.statusList[0].value;
					} else if (res.status == 3) {
						this.statusStr = this.statusList[1].value;
					}
					this.tagIndex = Number(res.type) - 1;
					this.tagStr = this.tags[this.tagIndex].value;
					this.form = form;
					console.log('todoDetail-----', this.form);
					this.complete = true;
				})
			},
			//删除待办
			delTodo() {
				this.util.confirm('确定删除吗？').then(res => {
					if (res) {
						this.util.delJob(this.todoId).then(res => {
							this.util.operateBack('删除成功！',true);
						})
					}
				})
			},
			//获取当前时间时分秒,type,0/为当前时间时分，1为1小时后时分时间
			getHourmin(type = 0) {
				let str;
				if (type == 0) {
					str = Format.formatDateHourMinute(this.now.getTime());
				} else {
					str = Format.formatDateHourMinute(this.now.getTime() + 60 * 60 * 1000);
				}
				return str;
			},

			//检测内容信息是否已经填写完整,showTip,true:提示，false，不提示
			checkInfo(showTip = false) {
				let form = this.form;
				if (showTip) {
					if (!this.form.start_time || !this.form.end_time) {
						this.util.showTip("请选择时间");
					} else if (!form.name) {
						this.util.showTip("请填写标题");
					} else if (!this.employeeId) {
						this.util.showTip("请选择执行人");
					} else if (!form.remark) {
						this.util.showTip("请填写内容");
					}
				}


				if (this.form.start_time && this.form.end_time && this.employeeId && form.name && form.remark) {
					this.complete = true;
					return;
				}

				this.complete = false;
			},


			//保存待办（添加或修改）
			saveTodo() {
				let funs = "addJob";
				this.checkInfo(true);
				if (!this.complete) return;

				let params={...this.form};

				if (this.allDay) {
					params.start_time = params.start_time + " 00:00:00";
					params.end_time = params.end_time + " 23:59:59";
				} else {
					params.start_time = `${this.selectDay} ${params.start_time}:00`;
					params.end_time = `${this.selectDay} ${params.end_time}:00`;
				}

				params.employee_id_array_str = this.employeeId;

				if (this.todoId) {
					params.id = this.todoId;
					funs = "updateJob";
				}

				console.log('saveJob------------', params);
				this.util[funs](params).then(res => {
					this.util.tipAndBack(this.btnTxt + '成功！');
				})
			},

			//输入内容方法
			inputContent(e) {
				this.form.remark = e.detail.value;
				this.checkInfo();
			},

			//选择执行人方法
			confirm(e) {
				let list = [];
				let list2 = [];
				this.employeeId = "";
				e.forEach(item => {
					list.push(item["value"])
				});
				e.forEach(item => {
					list2.push(item["label"])
				});
				this.employeeId = list.join(',');
				this.employeeName = list2.join(',')
			},

			show() {
				this.flag = true;
				this.$nextTick(() => {
					this.$refs["tkitree"]._show();
				});
			},
			//获取员工列表
			//异步函数
			async getMember() {
				this.menberOptions = [];
				let groups = await this.$http.get(employee.getGroup);
				console.log("groups-----------+++++++++++++++-",groups);
				let promiseArr = [];
				for (let i = 0; i < groups.length; i++) {
					let obj = {
						value: groups[i].group_id,
						label: groups[i].group_name,
						children: []
					};
					this.menberOptions.push(obj);
					promiseArr.push(
						this.$http.get(employee.getAll, {
							page: 1,
							page_size: 9999,
							group_id: groups[i].group_id
						})
					);
				}
				Promise.all(promiseArr).then(res => {
					for (let j = 0; j < res.length; j++) {
						res[j].rows.forEach(item => {
							let obj = {
								value: item.id,
								label: item.nick,
								mobile: item.mobile
							};
							this.menberOptions[j].children.push(obj);
						});
					}
					console.log("ifcdhs", this.menberOptions);
					this.menberOptions.forEach((item,index)=>{
						item.count=item.children.length;
					})

					this.fillUser();

				});
			},
			//填充执行人,type:0/填充管理员，1/填充其他人员
			fillUser() {
				let idList;
				if (this.todoId) {
					this.employeeId = this.form.employee_id_array_str;
					this.employeeName = this.form.staffName;
					idList = this.employeeId.split(',');
				}

				this.menberOptions.forEach((item, index) => {
					if (item.children.length > 0) {
						item.children.forEach((item2, index2) => {
							console.log('item2-----------', item2, this.user_data);
							if (this.todoId) {
								for (let i = 0; i < idList.length; i++) {
									if (item2.value == idList[i]) {
										item2.checked = true;
									}
								}
							} else {
								if (item2.mobile == this.user_data.mobile) {
									item2.checked = true;
									this.employeeId = item2.value;
									this.employeeName = item2.label;
								}
							}
						})
					}
				});
			},

			//切换时间方法,type:0/开始时间，1/结束时间
			changeTime(e, type) {
				if (type == 0) {
					this.form.start_time = e.target.value;
				} else if (type == 1) {
					this.form.end_time = e.target.value;
				}

			},

			//切换优先级方法
			changeTag(e) {
				console.log(e);
				this.tagIndex = e.detail.value;
				this.form.type = Number(this.tagIndex) + 1;
				this.tagStr = this.tags[this.tagIndex].value;
			},

			//切换状态方法
			changeStatus(e) {
				console.log('-------------------changeStatus---', e);
				let value = e.target.value;
				this.statusStr = this.statusList[value].value;
				switch (Number(value)) {
					case 0:
						this.form.status = 1;
						break;
					case 1:
						this.form.status = 3;
						break;
				}
				console.log('changeStatus-----', this.form);
			},
			formatDateHourMinute(secs) {
				return formatDateHourMinute(secs);
			},
			inputTitle(e) {
				this.form.name = e.detail.value;
				this.checkInfo();
			},

			//切换租赁方式方法
			changeRentType(e) {
				console.log('changeRentType--------------',e.detail.value);
				this.allDay = e.detail.value;
				//按天选择
				if (this.allDay) {
					this.form.start_time = this.selectDay;
					this.form.end_time = this.selectDay;
				} else {
					this.form.start_time = this.getHourmin();
					this.form.end_time = this.getHourmin(1);
				}
			},

			back() {
				this.util.back();
			}
		},
	};
</script>
<style lang="scss" scoped>
	.todoContent {
		margin: 0rpx;
		background-color: #fff;
		padding: 0 24rpx;
		font-size: 28rpx;
	}

	.title {
		margin-top: 18rpx;
		color: rgba(179, 179, 179, 1);
	}

	.allDay {
		display: flex;
		align-items: center;
		height: 84rpx;

		div {
			flex: 1;
			color: #333;

			&:nth-child(1) {
				text-align: left;
			}

			&:nth-child(2) {
				text-align: right;
			}
		}
	}

	.time {
		height: 120rpx;

		>div {
			div {
				&:nth-child(1) {
					font-size: 22rpx;
					color: rgba(153, 153, 153, 1);
				}

				&:nth-child(2) {
					font-size: 28rpx;
					color: rgba(51, 51, 51, 1);
				}
			}
		}

		text {
			font-size: 28rpx;
			color: #333;
		}

		.endTime {
			display: flex;
			flex-direction: column;
			align-items: flex-end;
		}
	}

	.type {
		height: 84rpx;
	}

	.status {
		background: #19A317;
		padding: 6rpx 16rpx;
		border-radius: 24rpx;
		color: #fff;

		&.orange {
			background: #ffba02;
		}

		&.red {
			background: #ff6a6e;
		}
	}

	.people {
		height: 84rpx;
	}

	.content {
		margin-top: 24rpx;

		textarea {
			width: 100%;
		}
	}
	.selectDay{
		background: #7842EB;
		color:#fff;
		padding:6rpx 18rpx;
		border-radius:30rpx;
	}
</style>

<template>
	<view class="wrap">
		<div class="budget">
			<div class="income">
				<span>收入</span>
				<div class="money">
					<span>￥</span>
					<span>{{allIn}}</span>
				</div>
			</div>
			<div class="pay">
				<span>支出</span>
				<div class="money">
					<span>-￥</span>
					<span>{{allOut}}</span>
				</div>
			</div>
		</div>
		<Ring :chartData="ringData" Width="750" Height="500" @changeBtn="changeBtn"></Ring>
		<LineChart :chartData="lineData"></LineChart>
	</view>
</template>

<script>
	import Ring from '@/components/u-charts/ring';
	import LineChart from '@/components/u-charts/line';
	export default {
		data() {
			return {
				// 图表需要渲染的数据
				ringData: [],
				lineData: {
					categories: ['01月', '02月', '03月', '04月', '05月', '06月', '07月', '08月', '09月', '10月', '11月', '12月'],
					series: []
				},
				allIn: 0, //总收入
				allOut: 0, //总支出
				type: 0, //0：收入，1:支出
				areaColors: ['#19A317', '#ED3B3B'],
				list: [], //收入支出列表数据
				year: '', //当前年份，如2020
			}
		},
		components: {
			Ring,
			LineChart,
		},
		mounted() {
			//获取收入支出列表数据
			this.getData();

			//获取当年财务数据
			this.year = this.util.getCurYear();
			this.getFinancePeriod(this.year);
		},
		methods: {
			//获取指定的年份的财务数据
			getFinancePeriod(year) {
				// year="2019";
				let params = {
					year: year
				};
				let inList = [];
				let outList = [];
				this.util.financePeriod(params).then(res => {
					console.warn('financePeriod-----------', res);
					res.forEach((item, index) => {
						let obj = {};
						obj.month = item.month.split('-')[1];
						obj.money = Number(item.sum_money);
						if (item.is_in == 0) {
							outList.push(obj);
						} else {
							inList.push(obj);
						}
					})
					//把没有数据的月份补上数据
					for (let i = 1; i <= 12; i++) {
						let count = 0;
						for (let j = 0; j < inList.length; j++) {
							if (inList[j].month != this.util.toDouble(i)) {
								count++;
								if (count == inList.length) {
									let obj = {
										month: this.util.toDouble(i) + '',
										money: 0
									}
									inList.push(obj);
									break;
								}
							}
						}
					}
					for (let i = 1; i <= 12; i++) {
						let count = 0;
						for (let j = 0; j < outList.length; j++) {
							if (outList[j].month != this.util.toDouble(i)) {
								count++;
								if (count == outList.length) {
									let obj = {
										month: this.util.toDouble(i) + '',
										money: 0
									}
									outList.push(obj);
									break;
								}
							}
						}
					}
					
					
					inList.sort(function(a,b){
					　　return a.month - b.month;
					})
					outList.sort(function(a,b){
					　　return a.month - b.month;
					})
					
					let inData = {
						name: '收入',
						data: [],
						color: this.areaColors[0]
					};
					let outData = {
						name: '支出',
						data: [],
						color: this.areaColors[1]
					};
					inList.forEach((item, index) => {
						inData.data.push(item.money);
					})
					outList.forEach((item, index) => {
						outData.data.push(item.money);
					})
					this.lineData.series.push(inData, outData);
					console.error('lineData--------', this.lineData);
					console.warn('inList-----', inList);
					console.warn('outList-----', outList);
				})

			},
			//获取收入支出列表数据
			getData() {
				let params = {
					page: 1,
					page_size: 100000
				};

				if (this.type == 0) {
					params.is_in = 1;
				} else {
					params.is_in = 0;
				}

				this.util.financeAll(params).then(res => {
					console.log('getData---------------------', res);
					// this.list = res.rows;
					this.list = this.changeData(res.rows);
					this.allIn = res.all_income;
					this.allOut = res.all_expenditure;
					this.ringData = this.util.deepcopy(this.list);
					console.error('financeAll-------------', this.list);
				})
			},

			//处理数据
			changeData(arr) {
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
				tempArr.forEach((item,index)=>{
					item.data=Number(item.data.toFixed(2));
				})
				return tempArr;
			},

			changeBtn(data) {
				this.type = data;
				this.getData();
			},
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.budget {
			width: 702rpx;
			height: 176rpx;
			background: #fff;
			box-shadow: 0px 12px 12px 0px rgba(0, 0, 0, 0.04);
			border-radius: 8px;
			margin: 24rpx auto;
			display: flex;

			>div {
				flex: 1;
				text-align: center;
				font-weight: 600;
				display: flex;
				flex-direction: column;
				justify-content: center;

				>span {
					color: #666;
					margin-bottom: 10rpx;
				}

				.money {
					font-size: 34rpx;
				}
			}

			.income {
				border-right: 1px solid #F2F2F6;

				.money {
					color: #19A317;
				}
			}

			.pay {
				.money {
					color: #ED3B3B;
				}
			}
		}
	}
</style>

<template>
	<view class="qiun-charts">
		<canvas canvas-id="canvasLineA" id="canvasLineA" class="charts" disable-scroll=true @touchstart="touchLineA"
		 @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	var _self;
	var canvaLineA = null;
	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				// chartData: {
				//   categories: ['01月', '02月', '03月', '04月', '05月', '06月','07月','08月','09月','10月','11月','12月'],
				//   series: [
				//     {
				//       name: '收入',
				//       data: [100, 80, 95, 150, 112, 132,160,170,60,80,100,90],
				//       color:'#19A317'
				//     }
				//   ]
				// }
			}
		},
		props: {
			chartData: {
				type: Object,
				default: {}
			}
		},
		watch: {
			chartData: {
				handler(newValue, oldValue) {
					this.showLineA("canvasLineA", newValue)
				},
				// immediate: true,
				deep: true
			}
		},
		onLoad() {},
		mounted() {
			_self = this;
			this.cWidth = uni.upx2px(726);
			this.cHeight = uni.upx2px(500);
			this.showLineA("canvasLineA", this.chartData)
		},
		methods: {
			showLineA(canvasId, chartData) {
				canvaLineA = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'area',
					fontSize: 11,
					legend: {
						show: false
					},
					dataLabel: true,
					dataPointShape: true,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: false,
					padding: [30, 20, 18, 10],
					enableScroll: true, //开启图表拖拽功能
					xAxis: {
						type: 'grid',
						gridType: 'solid',
						gridColor: '#F2F3F6',
						// boundaryGap:'justify',
						itemCount: 5,
						scrollShow: true,
						scrollAlign: 'left',
						scrollBackgroundColor: '#F7F7FF',
						scrollColor: '#DEE7F7',
					},
					yAxis: {
						gridType: 'solid',
						gridColor: '#F2F3F6',
						splitNumber: 8,
						min: 0,
						// max:25,
						format: (val) => {
							return val ? `${val.toFixed(0)}` : val.toFixed(0)
						}
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					extra: {
						area: {
							type: 'curve',
							// opacity:0.2,
							addLine: true,
							width: 2,
							gradient: true
						}
					},
				});

			},
			touchLineA(e) {
				canvaLineA.scrollStart(e);
			},
			moveLineA(e) {
				canvaLineA.scroll(e);
			},
			touchEndLineA(e) {
				canvaLineA.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
			// touchLineA(e) {
			// 	canvaLineA.showToolTip(e, {
			// 		format: function (item, category) {
			// 			return category + ' ' + item.name + ':' + item.data 
			// 		}
			// 	});
			// }
		}
	}
</script>

<style lang="scss" scoped>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		min-height: 500rpx;
		padding: 24rpx 24rpx 36rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;

		.charts {
			width: 100%;
			padding-top: 42rpx;
			box-sizing: border-box;
			min-height: 500rpx;
			background-color: #FFFFFF;
		}
	}
</style>

<template>
	<scroll-view class="wrap" scroll-x="true" :scroll-into-view="scrollDom" scroll-with-animation="true" @scroll="scroll">
		<div class="header col-style">
			<span id="firstcol">添加日期</span>
			<span>类型</span>
			<span>类别</span>
			<span>金额</span>
			<span>单据</span>
			<span id="lastcol">明细</span>
		</div>
		<div class="list">

			<div class="row col-style" v-for="(item,index) in list" :key="index">
				<span>{{item.create_time|time2Date}}</span>
				<span>{{item.is_in==1?'收入':'支出'}}</span>
				<span>{{item.type_name}}</span>
				<span>￥{{item.money}}</span>
				<span></span>
				<div>
					<span>{{item.content}}</span>
				</div>
			</div>
			<!-- 左右切换的箭头 -->
			<div :class="{'left-arrow':!showNext}" class="iconfont iconjiantou operation-btn" @tap="turn"></div>
			<!-- 加号浮标 -->
			<div class="iconfont iconjiahao operation-btn" @tap="add"></div>
		</div>
	</scroll-view>
</template>

<script>
	export default {
		props:{
			params:{
				type:Object,
				default:null,
			}
		},
		data() {
			return {
				scrollDom: '',
				showNext: true,
				list: [], //收入支出列表数据
				listParams:{
					page:1,
					page_size:20,
					total:0
				},
				loading:true,  //正在加载数据
				addPage: false, //是否是下拉加载
				noMoreData:false,  //列表是否没有数据了（到底了）
			}
		},
		watch:{
			params(to,from){
				console.error('watch-----list.vue,params--------------------',this.params);
				this.financeAll();
			}
		},
		onShow() {
			
		},
		onLoad() {
			
		},
		mounted() {
			//获取商家收入支出列表数据
			this.financeAll();
		},
		onPullDownRefresh() {
			//重新加载数据
			this.financeAll();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			//获取商家收入支出列表数据
			financeAll() {
				let params = {
					page: this.listParams.page,
					page_size: this.listParams.page_size
				};
				if(this.params){
					if(this.params.type>=0){
						params.is_in=this.params.type;
					}
					
					params.type_array=this.params.category;
				}
				console.error('loadfinance--------------',params);
				this.util.financeAll(params).then(res => {
					console.log('financeAll-----', res);
					this.list = res.rows;
					this.listParams.total=res.total_count;
					console.log('this.list----------', this.list);
				})
			},
			scroll(e) {
				// console.log(e,'移动')
				this.showNext = !(e.detail.scrollLeft >= 150)
				this.scrollDom = ''
			},
			turn() {
				this.scrollDom = this.showNext ? 'lastcol' : 'firstcol'
			},
			add() {

			}
		},
		
		//下拉到底部触发事件
		onReachBottom() {
			console.log('onReachBottom--------------------list-----------');
			this.addPage = true;
			if (this.listParams.total > this.listParams.page * this.listParams.page_size) {
				this.listParams.page = ++this.listParams.page;
				this.financeAll();
			}else{
				this.noMoreData=true;
			}
			
		},
		
	}
</script>

<style lang="scss" scoped>
	.wrap {
		margin-top: -36rpx;
		padding: 0 24rpx 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;

		.col-style {
			display: flex;
			align-items: center;

			&>span,
			&>div {
				flex: 1;
				display: flex;
				justify-content: center;
			}

			&>div {
				span {
					width: 200rpx;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}

		.header {
			width: 200%;
			height: 72rpx;
			background: #fff;
			margin-bottom: 10rpx;
			box-shadow: 0px 4px 4px 0px rgba(20, 6, 49, 0.04);
			border-radius: 8rpx;
			// padding: 0 24rpx;
			box-sizing: border-box;
		}

		.list {
			width: 200%;
			background: #fff;
			// padding: 0 24rpx;
			box-sizing: border-box;
			border-radius: 8rpx;

			.row {
				height: 80rpx;
				border-bottom: 1px solid #F2F2F6;
			}

			.operation-btn {
				width: 84rpx;
				height: 84rpx;
				border-radius: 50%;
				background: rgba(0, 0, 0, 0.6);
				display: flex;
				justify-content: center;
				align-items: center;
				position: fixed;
				right: 124rpx;
				bottom: 326rpx;
				color: #fff;
				font-size: 42rpx;
				transform: rotate(0);
				transition: all 0.2s;
			}

			.iconjiahao {
				background: rgba(120, 66, 235, 1);
				box-shadow: 0px 12px 12px 0px rgba(20, 6, 49, 0.12);
				bottom: 180rpx;
				font-size: 38rpx;
			}

			.left-arrow {
				transform: rotate(180deg);
			}

		}
	}
</style>

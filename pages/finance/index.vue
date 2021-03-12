<template>
  <view class="wrap" :class="{'bg-white':showList}">
    <Top @changeTab="changeTab" @back="back" @selectBy="selectBy"></Top>
    <!-- <List v-if="showList" :params="params"></List> -->
	
	
	<!-- 列表数据 -->
	<!-- <scroll-view class="wrap" v-if="showList" scroll-x="true" :scroll-into-view="scrollDom" scroll-with-animation="true" @scroll="scroll"> -->
	<view ref="list" class="dataList" v-if="showList" :class="{'first':!showNext,'last':showNext}">
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
				<span class="type">{{item.is_in==1?'收入':'支出'}}</span>
				<span>{{item.type_name}}</span>
				<span class='money'>￥{{item.money}}</span>
				<view v-if="item.sn_no">
					<image  mode="aspectFit" :src="util.picExplode(item.sn_no)"></image>
				</view>
				<span v-else>-</span>
				<div>
					<span>{{item.content}}</span>
				</div>
			</div>
			<!-- 左右切换的箭头 -->
			<div :class="{'left-arrow':showNext}" class="iconfont iconjiantou operation-btn" @tap="turn"></div>
			<!-- 加号浮标 -->
			<div class="iconfont iconjiahao operation-btn" @tap="add"></div>
		</div>
	</view>
	<!-- </scroll-view> -->
	
	
    <Chart v-else></Chart>
    <!-- <Screen v-if="showScreen" :options="options" @hideScreen="hideScreen" @reset="reset" @confirm="confirm"></Screen> -->
    <Screen v-if="showScreen"  @hideScreen="hideScreen" @reset="reset" @confirm="confirm" :params="params"></Screen>
  </view>
</template>

<script>
import Top from './top'
import List from './list'
import Chart from './chart'
import Screen from '@/components/screen/screen'
  export default {
    data(){
      return{
        showList:true,
        showScreen:false,
        params:null, //获取收入支出列表参数
		
		scrollDom: '',
		showNext: false,
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
    components:{
      Top,
      List,
      Chart,
      Screen
    },
	onPullDownRefresh() {
		//重新加载数据
		this.financeAll();
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	
	onLoad(){
		//获取收入支出类别
		this.financeType();
		
		//获取商家收入支出列表数据
		this.financeAll();
	},
    methods:{
		
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
				if (this.addPage) {
					this.list = this.list.concat(res.rows);
				} else {
					this.list = res.rows;
				}
				// this.list = res.rows;
				this.listParams.total=res.total_count;
				console.log('this.list----------', this.list);
			})
		},
		
		//左右切换
		turn(){
			this.showNext=!this.showNext;
		},
		
		//获取收入支出类别
		financeType(){
			this.util.financeType().then(res=>{
				console.warn('financeType-----',res);
			})
		},
      changeTab(data){
        this.showList=(data==0)
      },
      back(){
		this.util.back();
      },
      selectBy(){
		 console.log('selectBy---------------',this.params);
        // this.showScreen=true
		this.showScreen=false;
		this.$nextTick(()=>{
			this.showScreen=true;
		})
      },
      hideScreen(){
        this.showScreen=false
      },
      reset(){
      },
      confirm(params){
        this.showScreen=false;
		this.params=params;
		this.financeAll();
		console.error('confirm-----index.vue-----',params);
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
.bg-white{
  background: #fff;
}
.dataList{
	position:relative;
	transition: all 0.2s;
	&.first{
		left:0rpx;
	}
	&.last{
		left:-100%;
	}
}
.wrap {
		margin-top: -36rpx;
		padding: 0 12rpx 30rpx;
		box-sizing: border-box;
		font-size: 28rpx;
		.content{
			height:130rpx!important;
		}
		.col-style {
			display: flex;
			align-items: center;
			justify-content: space-around;
			&>span,
			&>div {
				flex: 2;
				display: flex;
				justify-content: center;
			}
			.type{
				flex:1!important;
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
			box-sizing: border-box;
			border-radius: 8rpx;
			image{
				width:90rpx;
				height:90rpx;
			}
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
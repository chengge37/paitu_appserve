<template>
  <view class="income-pay-ring">
    <div class="btn-group" :class="{'change-btn':btns[1].checked}">
      <span :class="{'active-btn':item.checked}" v-for="(item,index) in btns" :key="index" @tap="changeBtn(index)">{{item.label}}</span>
    </div>
    <div class="ring-wrap" >
      <canvas v-if="chartData.length" canvas-id="canvasRing" id="canvasRing" class="ring" @touchstart="touchRing"></canvas>
      <div class="label-value">
        <div class="item-wrap" v-for="(item,index) in chartData" :key="index">
          <div class="item-content">
            <span :style="{backgroundColor:colors[index]}"></span>
            <span>{{item.name}}</span>
            <span>￥{{item.data}}</span>
          </div>
        </div>
      </div>
      <div class="no-data" v-if="!chartData.length">暂无数据</div>
    </div>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js';
  var _self;
  var canvaRing=null;
  export default {
    data(){
      return{
        cWidth:'',
				cHeight:'',
				pixelRatio:1,
        btns:[
          {
            label:'收入',
            checked:true
          },
          {
            label:'支出',
            checked:false
          },
        ],
        colors: ['#d94b65','#d94bb1','#c84bd9','#894bd9','#714bd9','#4b8bd9','#4bd4d9','#4bd981','#acd94b','#d97d4b'],
      }
    },
    props:{
      chartData:{
        type:Array,
        default:[]
      },
      Width:{
        type:String,
        default:'750'
      },
      Height:{
        type:String,
        default:'500'
      }
    },
    watch:{
      chartData(val){
        console.log(val,'数据改变')
        // 数据改变重新渲染chart
        this.showRing("canvasRing",val)
      },
      Width(val){
        this.showRing("canvasRing",val)
      },
      Height(val){
        this.showRing("canvasRing",val)
      }
    },
    mounted(){
			_self = this;
			this.cWidth=uni.upx2px(this.Width-0);
      this.cHeight=uni.upx2px(this.Height-0);
      this.showRing("canvasRing",this.chartData)
    },
    methods:{
      changeBtn(i){
        console.log('点击收入支出')
        this.btns.forEach(item=>{
          item.checked=false
        })
        this.btns[i].checked=true
        this.$emit('changeBtn',i)
      },
			showRing(canvasId,chartData){
				canvaRing=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'ring',
					fontSize:11,
					legend:{
            show:false
          },
					extra: {
						pie: {
						  offsetAngle: -45,
						  ringWidth: 25*_self.pixelRatio,
						  labelWidth:15
            }
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					disablePieStroke: true,
					dataLabel: false,
				});
			},
			touchRing(e){
				canvaRing.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data 
					}
				});
			},
    }
  }
</script>

<style lang="scss" scoped>
.income-pay-ring{
  padding: 40rpx 0rpx 132rpx;
  box-sizing: border-box;
  background: #fff;
  .btn-group{
    margin:0 auto;
    margin-bottom: 40rpx;
    display: flex;
    width: 400rpx;
    position: relative;
    span{
      width:200rpx;
      height:56rpx;
      border-radius:28rpx;
      font-weight: 500;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9;
      color: #4E5055;
      transition: color .5s;
    }
    .active-btn{
      color: #fff;
    }
  }
  .btn-group:before{
    content:'';
    position: absolute;
    left: 0;
    top: 0;
    width:200rpx;
    height:56rpx;
    background:rgba(120,66,235,1);
    box-shadow:0rpx 16rpx 24rpx 0rpx rgba(20,6,49,0.12);
    border-radius:28rpx;
    transition: all 0.3s;
    color: #fff;
  }
  .change-btn:before{
    left: 50%;
  }
  .ring-wrap{
    .ring{
      width: 100%;
      min-height:500rpx;
    }
    .label-value{
      // display: flex;
      flex-wrap: wrap;
      padding: 0 50rpx;
      box-sizing: border-box;
	  // justify-content: center;
      .item-wrap{
        // width: calc((100% - 50rpx)/2);
        margin-bottom: 10rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .item-content{
          min-width: 80%;
          display: flex;
          align-items: center;
		  justify-content:center;
          span:first-child{
            width:76rpx;
            height:8rpx;
            background:#7742EB;
            border-radius:4rpx;
            margin-right: 22rpx;
          }
          span:nth-child(2){
            margin-right: 10rpx;
          }
        }
      }
      .item-wrap:nth-child(odd){
        // margin-right: 50rpx;
      }
    }
    .no-data{
      text-align: center;
      padding-top: 50rpx;
      font-size: 32rpx;
      font-weight: 600;
    }
  }
}
</style>
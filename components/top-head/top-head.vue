<template>
  <view class="head" :style="{backgroundColor:bgColor}" :class="{'head-with-title':showTitle,'head-with-cancel':showCancel}">
    <div class="head-left" @tap="back" v-if="showBack">
      <span class="iconfont iconarrow-lift"></span>
      <span>返回</span>
    </div>
    <div class="head-center">
      <div class="search" v-if="showSearch">
        <span class="iconfont icon41"></span>
        <input class="uni-input" placeholder="输入关键字搜索" />
      </div>
      <span v-if="showTitle" class="page-title">{{topTitle}}</span>
    </div>
    <div class="head-right">
      <span v-if="showComplete" :class="{'has-complete':hasComplete}" @tap="complete">完成</span>
      <span v-if="showCancel" @tap="cancel">取消</span>
	  <!-- <span v-if="showDetail" @tap="detail">详情</span> -->
	  <image class="detail" src='../../static/img/tabbar/order.png' v-if="showDetail" @tap="detail"></image>
    </div>
  </view>
</template>

<script>
  export default {
    // 除了修改背景颜色，其他一般不需要做改动，已经针对各个页面调整好样式
    props:{
      // 显示返回
      showBack:{
        type:Boolean,
        default:true
      },
      // 显示搜索框
      showSearch:{
        type:Boolean,
        default:false
      },
      // 显示页面标题
      showTitle:{
        type:Boolean,
        default:false
      },
      // 显示完成
      showComplete:{
        type:Boolean,
        default:false
      },
      // 显示取消
      showCancel:{
        type:Boolean,
        default:false
      },
	  // 显示右侧详情
	  showDetail:{
	    type:Boolean,
	    default:false
	  },
      // 背景颜色
      bgColor:{
        type:String,
        default:'#F2F3F6'
        // default:'#fff'
      },
      // 传过来这个属性为true代表表单信息已经全部填写完毕，‘完成’字体颜色变黑色
      hasComplete:{
        type:Boolean,
        default:false
      },
      topTitle:{
        type:String,
        default:''
      }
    },
    methods:{
      back(){
        // 点击返回
        this.$emit('back')
      },
      complete(){
        // 点击完成
        this.$emit('complete')
      },
      cancel(){
        // 点击取消
        this.$emit('cancel')
      },
	  detail(){
		  //点击详情
		  this.$emit('detail')
	  },
	  
    }
  }
</script>

<style lang="scss" scoped>
.head{
  height: 88rpx;
  color: #333;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  .head-left{
    display: flex;
    align-items: center;
    // min-width: 100rpx;
    span:first-child{
      font-size: 40rpx;
    }
  }
  .head-center{
    flex: 1;
    display: flex;
    justify-content: center;
    .search{
      width: 476rpx;
      height: 62rpx;
      background: #EFF0F4;
      display: flex;
      align-items: center;
      padding-left: 10rpx;
      box-sizing: border-box;
      border-radius: 8rpx;
      .icon41{
        font-size: 40rpx;
        margin-right: 10rpx;
      }
      .uni-input{
      }
    }
    .page-title{
      text-align: center;
      display: flex;
      justify-content: center;
      font-size: 34rpx;
      color: #333;
    }
  }
  .head-right{
    // min-width: 100rpx;
    text-align: right;
    span{
      color: #B3B3B3;
      font-size: 34rpx;
    }
    .has-complete{
      color: #333;
    }
  }
}
.head-with-title{
  .head-life{
    min-width: 120rpx;
  }
  .head-right{
    min-width: 120rpx;
  }
}
.head-with-cancel{
  .head-center{
    .search{
      width: 100%;
    }
  }
  .head-right{
    margin-left: 38rpx;
  }
}
.detail{
	width:50rpx;
	height:50rpx;
}
</style>
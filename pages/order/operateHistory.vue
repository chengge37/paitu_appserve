<template>
  <view class="wrap">
    <top :showTitle="true" topTitle="操作记录" @back="back"></top>
    <view class="content">
      <view class="header">
        <text>操作记录</text>
        <text>时间</text>
        <text>操作账号</text>
      </view>
      <scroll-view scroll-y class="operate-group">
        <view class="operate-row" v-for="item in 30" :key="item">
          <text>接单</text>
          <text>2020年8月8日 22:00</text>
          <text>Z_ID1008</text>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import top from '../../components/top-head/top-head'
  export default {
    components:{
      top
    },
    methods:{
      back(){
        console.log('返回')
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  height: 100vh;
  .content{
    background: #fff;
    height: calc(100% - 108rpx);
    .header{
      height: 100rpx;
      border-bottom: 1px solid #F2F3F6;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 28rpx;
      // padding: 0 48rpx;
      text{
        flex: 1;
      }
      text:nth-child(2){
        flex:1.5;
        text-align: center;
      }
      text:nth-child(3){
        text-align: right;
        padding-right: 48rpx;
      }
      text:first-child{
        padding-left: 48rpx;
      }
    }
    .operate-group{
      // padding: 0 48rpx 44rpx;
      box-sizing: border-box;
      font-size: 22rpx;
      color: #666;
      height: calc(100% - 144rpx);
      .operate-row{
        padding-top: 24rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        text{
          flex: 1;
        }
        text:nth-child(2){
          flex:1.5;
          text-align: center;
        }
        text:nth-child(3){
          text-align: right;
          padding-right: 48rpx;
        }
        text:first-child{
          position: relative;
          text-indent: 30rpx;
          padding-left: 48rpx;
        }
        text:first-child:before{
          content:'';
          width: 8rpx;
          height: 8rpx;
          border-radius: 4rpx;
          background: #7842EB;
          position: absolute;
          top: 50%;
          transform: translate(-250%,-50%);
        }
      }
    }
  }
  text{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
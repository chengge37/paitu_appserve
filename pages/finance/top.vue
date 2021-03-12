<template>
  <view class="wrap">
    <div class="content">
      <div class="top-left" @tap="back">
        <span class="iconfont iconarrow-lift"></span>
        <span>返回</span>
      </div>
      <div class="top-center">
        <span :class="{active:item.checked}" v-for="(item,index) in tabs" :key="index" @tap="changeTab(index)">{{item.label}}</span>
      </div>
      <div class="top-right">
        <span class="iconfont iconliebiao" @click="selectBy"></span>
        <span class="iconfont icon41"></span>
      </div>
    </div>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        tabs:[
          {
            label:'列表',
            checked:true,
            url:''
          },
          {
            label:'图表',
            checked:false,
            url:''
          },
        ]
      }
    },
    methods:{
      changeTab(i){
        this.tabs.forEach(item=>{
          item.checked=false
        })
        this.tabs[i].checked=true
        this.$emit('changeTab',i)
      },
      back(){
        this.$emit('back')
      },
      selectBy(){
        this.$emit('selectBy')
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  height: 174rpx;
  padding: 24rpx 24rpx 0;
  box-sizing: border-box;
  background:linear-gradient(138deg,rgba(147,59,255,1) 0%,rgba(120,66,235,1) 100%);
  color: #fff;
  font-size: 28rpx;
  .content{
    height: 136rpx;
    display: flex;
    align-items: center;
    .top-left{
      width: 150rpx;
      display: flex;
      align-items: center;
      span:first-child{
        font-size: 80rpx;
      }
      span:last-child{
        position: relative;
        top: -3rpx;
        left: -18rpx;
      }
    }
    .top-center{
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        padding: 0 10rpx 10rpx;
        box-sizing: border-box;
        border-bottom: 4rpx solid transparent;
      }
      span:first-child{
        margin-right: 66rpx;
      }
      .active{
        border-bottom: 4rpx solid #fff;
      }
    }
    .top-right{
      width: 150rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        font-size: 40rpx;
        font-weight: bold;
      }
    }
  }
}
</style>
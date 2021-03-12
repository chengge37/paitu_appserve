<template>
  <view class="wrap">
    <Top :showSearch="true" :showComplete="true" bgColor="#fff"></Top>
    <Tree class="tree"></Tree>
  </view>
</template>

<script>
import Top from '@/components/top-head/top-head'
import Tree from '@/components/tree/tree'
  export default {
    data(){
      return{
        
      }
    },
    components:{
      Top,
      Tree
    },
    
  }
</script>

<style lang="scss">
page{
  height: 100%;
}
.wrap{
  height: 100%;
  padding: 0 34rpx;
  background: #fff;
  color: #D6CCEB;
  .tree{
    margin-top: 86rpx;
  }
}
</style>
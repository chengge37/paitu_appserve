<template>
  <div class="mainContainer">
    <div class="topBar">
      <div>
        <input
          @input="input"
          :value='searchText'
          type="text"
          placeholder="请输入内容搜索"
          confirm-type="search"
          style="padding-left:12px;background:rgba(239,240,244,1);font-size:14px;height:62rpx;border-radius:4px;"
        />
      </div>
      <div @click="cancel">取消</div>
    </div>
    <div class="line"></div>
    <div style="color:rgba(153,153,153,1);padding:0 24rpx">制定内容搜索</div>
    <div class="line"></div>
    <div class="recommend">
      <div class="main">器材订单</div>
      <div class="divider"></div>
      <div class="main">场地订单</div>
      <div class="divider"></div>
      <div class="main">服务订单</div>
    </div>
    <div style="background:rgba(239,238,243,1);height:12px"></div>
    <div style="color:rgba(153,153,153,1);padding:0 24rpx">搜索历史</div>
    <div class="line"></div>
    <div class="search-history">
      <div class="tab">名称名称</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchText:''
    };
  },
  methods: {
    cancel() {
      uni.navigateBack({
        delta: 1
      });
    },
    input(e){
      this.searchText=e.detail.value
    }
  }
};
</script>
<style lang="scss" scoped>
page {
  background-color: #fff;
}
.mainContainer {
  padding: 88rpx 0 0 0;
  font-size: 14px;
}
.line {
  margin: 16rpx 0;
}
.topBar {
  padding: 0 24rpx;
  display: flex;
  height: 62rpx;
  div {
    flex: 5;
    line-height: 62rpx;
    &:nth-child(2) {
      flex: 1;
      text-align: center;
    }
  }
}
.recommend {
  display: flex;
  text-align: center;
  align-items: center;
  height: 100rpx;
  padding: 0 24rpx;
  .main {
    flex: 5;
    height: 48rpx;
    line-height: 48rpx;
    font-size: 34rpx;
    color:rgba(120,66,235,1);
  }
  .divider {
    height: 48rpx;
    width: 2rpx;
    background: rgba(214, 214, 214, 1);
  }
}
.search-history {
  padding: 0 24rpx;
  .tab {
    color: rgba(78, 80, 85, 1);
    font-size: 28rpx;
    height: 56rpx;
    background: rgba(239, 238, 243, 1);
    border-radius: 28rpx;
    width: 162rpx;
    text-align: center;
    line-height: 56rpx;
  }
}
</style>
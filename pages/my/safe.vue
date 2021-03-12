<!--  -->
<template>
  <view>
    <view class="card list">
      <view class="item">
        <view class="per-item">注销用户</view>
        <view class="arrow">
          <span class="iconfont iconarrow-right"></span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data: () => ({}),

  components: {},

  onLoad() {},

  methods: {}
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.list {
  margin-top: 24px;
  .item {
    height: 104rpx;
    display: flex;
    align-items: center;
    padding: 0 48rpx;
    .per-item {
      flex: 1.5;
      text-align-last: left;
    }
    .arrow {
      flex: 3;
      text-align: right;
    }
  }
}
</style>
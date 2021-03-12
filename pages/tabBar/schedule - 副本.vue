<template>
  <view class="content">
    <!-- #ifdef APP-PLUS -->
    <view class="status_bar">
      <view class="top_view"></view>
    </view>
    <!-- #endif -->
    <div class="head">
      <div>
        <picker mode="date" fields="day" @change="change" :value="selectMonth">
          <div style="font-weight:500;color:#333;">{{selectMonth}}</div>
        </picker>
      </div>
      <div>日程</div>
      <div>显示</div>
    </div>
    <div class="todoList">
      <div class="card" v-for="item in list" :key="item.value">
        <div class="select">
          <checkbox style="transform:scale(0.7)" :value="item.value" :checked="item.checked" />
        </div>
        <div class="todoItem">
          <div class="title">
            <div>{{item.title}}</div>
            <div class="nronmal"></div>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="time">
            <div>
              2020年12月12日 24:00
              <div>开始</div>
            </div>
            <div>
              2020年12月12日 24:00
              <div>结束</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
import { Format } from "../../common/utils/formatDate.js";
export default {
  data() {
    return {
      selectMonth: "",
      list: [
        {
          title: "去拍婚纱",
          content:
            "主体：主题是一段可能很长也可能很短的文字，具体是怎样，看用户怎么来，咱也不知道sdfgs第三方公司的肌肤决定是否囧",
          checked: false,
          value: "1"
        }
      ]
    };
  },
  mounted() {
    this.selectMonth = Format.formatDateNoHouer(new Date());
  },
  onLoad() {
    this.getSystemStatusBarHeight();
  },
  methods: {
    //获取系统状态栏高度
    getSystemStatusBarHeight() {
      // #ifdef APP-PLUS
      let height = plus.navigator.getStatusbarHeight();
      this.barHeight = height;
      // #endif
      // #ifdef H5
      this.barHeight = 0;
      // #endif
    },
    change(e) {
      console.log(e);
      this.selectMonth = e.detail.value;
    }
  }
};
</script>

<style lang='scss' scoped>
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #fff;
}
.top_view {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #fff;
  top: 0;
  z-index: 999;
}
.card {
  margin: 24rpx 24rpx;
  padding: 24rpx 24rpx;
}
.head {
  display: flex;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #fff;
  div {
    flex: 1;
    text-align: center;
  }
}
.todoList {
  > div {
    display: flex;
    div {
      text-align: center;
    }
    .select {
      flex: 1;
    }
    .todoItem {
      flex: 8;
      text-align-last: left;
      .title {
        display: flex;
        div {
          &:nth-child(1) {
            flex: 4;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            height: 40rpx;
            line-height: 40rpx;
          }
          &:nth-child(2) {
            flex: 1;
          }
        }
      }
      .content {
        font-size: 24rpx;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
      }
      .time {
        display: flex;
        > div {
          flex: 1;
          margin: 10rpx 0;
          font-weight: 600;
          font-size: 24rpx;
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
</style>
<!--  -->
<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="custom-header">
			<uni-nav-bar left-icon="back" right-text="确定" background-color="#F2F3F6" @clickRight="confirm" @clickLeft="back">
				<view>意见与反馈</view>
			</uni-nav-bar>
		</view>
		<view class="custom-content">
			<view class="type-box bbg">
				<view class="type-title">反馈类型</view>
				<view class="line"></view>
				<view class="button-box">
					<view class="button" :class="{'active-btu':item.value == actice}" v-for="item in questionList" :key="item.value"
					 @tap="activebtu(item)">{{item.name}}</view>
				</view>
			</view>
			<view class="content-box bbg">
				<view class="type-title">反馈内容</view>
				<view class="line"></view>
				<view class="text-box">
					<textarea v-model="feedbackData.content" placeholder-style="color:#999;background:rgba(239,240,244,1);border-radius:4px;"
					 placeholder="请输入内容" />
					</view>
      </view>
      <view class="img-box bbg">
        <view class="type-title">上传图片</view>
        <view class="line"></view>
        <view class="image-box" @tap="upload">
          <view class="add-box" v-if="!feedbackData.pic">
            <span>+</span>
          </view>
          <image mode="aspectFit" v-else :src="qiniu+feedbackData.pic" />
        </view>
      </view>
      <view class="email-box bbg">
        <view class="type-title">您的邮箱</view>
        <view class="line"></view>
        <view class="text-box">
          <input v-model="feedbackData.email" type="text" placeholder="请输入内容" />
        </view>
      </view>
	  
	  <view class="footBtn">
		  <view class="baseButton" @tap="confirm">提交</view>
	  </view>
	  
    </view>
  </view>
</template>

<script>
import { feedback } from "@/common/api/api";
import { uploadImg } from "@/common/utils/uploadImg.js";
import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";

export default {
  data() {
  	return {
	qiniu:this.$qiniu,
    actice: "1",
    questionList: [
      {
        value: "1",
        name: "提问咨询"
      },
      {
        value: "2",
        name: "产品建议"
      },
      {
        value: "3",
        name: "页面错误"
      },
      {
        value: "4",
        name: "其他建议"
      },
      {
        value: "5",
        name: "产品购买"
      }
    ],
    feedbackData: {
      type: "提问咨询",
      content: "",
      pic: "",
      email: ""
    }
  }
  },

  components: { uniNavBar },

  onLoad() {},

  methods: {
    back() {
      this.util.back();
    },
    activebtu(data) {
      this.actice = data.value;
      this.feedbackData.type = data.name;
    },
    upload() {
      uploadImg().then(res => {
        console.log("addClient---uploadImg--res---------------", res);
        this.feedbackData.pic = res;
      });
    },
    confirm() {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
          this.feedbackData.email
        )
      ) {
        this.$http
          .post(feedback.addFeedback, this.feedbackData)
          .then(res => {
            console.log(res);
            if (res) {
			  this.util.showTip('您的建议已经接收!');
			  setTimeout(()=>{
				  this.back();
			  },1000);
            }
          })
          .catch(err => {});
      }else{
        uni.showToast({ title: "邮箱错误！", icon: "none" });
      }
    }
  }
};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
.custom-content {
  padding: 24rpx;
  padding-top: 96rpx;
}
.content /deep/ .uni-navbar__header-container {
  justify-content: center;
}
.status_bar {
  height: var(--status-bar-height);
  width: 100%;
  background-color: #f2f3f6;
}

.top_view {
  height: var(--status-bar-height);
  width: 100%;
  position: fixed;
  background-color: #f2f3f6;
  top: 0;
  z-index: 999;
}
.bbg {
  background: #ffffff;
  padding: 48rpx 0;
  margin-bottom: 24rpx;
}

.type-title {
  margin-left: 24rpx;
  padding-left: 24rpx;
  border-left: 8rpx solid #7842eb;
  margin-bottom: 24rpx;
  color: #333;
  font-size: 28rpx;
}

.button-box {
  display: grid;
  padding: 0 48rpx;
  padding-top: 48rpx;
  grid-template-columns: repeat(auto-fill, 186rpx);
  grid-row-gap: 24rpx;
  grid-column-gap: 24rpx;
  .button {
    background: rgba(255, 255, 255, 1);
    border-radius: 8rpx;
    border: 1px solid rgba(241, 236, 252, 1);
    color: #333;
    text-align: center;
    padding: 8rpx 36rpx;
  }
  .active-btu {
    background: rgba(120, 66, 235, 1);
    color: #fff;
  }
}
.text-box {
  padding: 18rpx 24rpx;
  /deep/ uni-textarea {
    width: 98%;
    padding: 8rpx;
    background: rgb(239, 240, 244);
  }
  /deep/ uni-input {
    padding: 18rpx 12rpx;
    background: rgb(239, 240, 244);
  }
}
.image-box {
  padding: 18rpx 24rpx;
}
.add-box {
  width: 88rpx;
  background: rgba(239, 240, 244, 1);
  border-radius: 4px;
  border: 1px solid rgba(214, 214, 214, 1);
  text-align: center;
  line-height: 88rpx;
}
</style>

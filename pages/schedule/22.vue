<template>
  <view>
    <view class="uni-padding-wrap">
      <view class="page-section swiper">
        <view class="page-section-spacing">
          <swiper class="swiper" :current="current" @change="change" @animationfinish='animationfinish'>
            <swiper-item v-for="(item,index) in data" :key="index">
              <view class="swiper-item" @tap="tap">{{item}}</view>
            </swiper-item>
          </swiper>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      data: ["a", "b", "c"],
      current:1
    };
  },
  methods: {
    change(e) {
      // console.log("kk", e);
      // this.current=1
      // this.data=['b','c','d']
    },
    animationfinish(e){
      // this.current=1
      console.log(e.detail.current);
      if(e.detail.current+1==this.data.length)
      this.data.push('d')
    },
    tap() {
      console.log("kjjk");
    }
  }
};
</script>
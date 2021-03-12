<template>
  <view class="s-tabs" :class="customClass">
    <view class="s-tabs-nav-wrap" :style="'height:'+height+'rpx'">
      <scroll-view
        class="scroll-wrap"
        :show-scrollbar="false"
        scroll-with-animation
        scroll-x
        :scroll-left="scrollLeft"
      >
        <view class="scroll-view">
          <view class="s-tab-nav-view">
            <template>
              <view
                v-for="(item,index) of navInfoList"
                :class="['s-tab-nav',{'is-disabled':item.disabled},{'is-active':active==index}]"
                :style="navWidth+'color:'+(active==index?activeColor:color)"
                :key="index"
                @click="navClick(index,item)"
              >
                <text>{{item.title}}</text>
                <!-- <text class="num" v-if="redNum>0">{{redNum}}</text> -->
                <text class="num" v-if="item.count>0">{{item.count}}</text>
              </view>
            </template>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "o-tabs",
  props: {
    // red-num
    redNum: {
      type: Number,
      default: 0
    },
    // class
    customClass: {
      type: String,
      default: ""
    },
    // v-model双向绑定
    value: {
      type: Number,
      default: 0
    },
    itemList: {
      type: Array,
      default: []
    },
    // 导航颜色
    color: {
      type: String,
      default: "#333"
    },
    // 导航选中颜色
    activeColor: {
      type: String,
      default: "#FFFFFF"
    },
    // 导航高度 rpx
    height: {
      type: Number,
      default: 80
    },
    // 导航自适应宽度还是百分比等分
    navPerView: {
      type: [Number, String],
      default: "auto"
    },
    // 内容部分是否动画切换
    effect: {
      type: Boolean,
      default: false
    },
    // 内容部分动画切换时间
    duration: {
      type: Number,
      default: 0.3
    },
    // 内容部分是否开启延迟渲染（首次切换到标签时才触发内容渲染）
    lazyRender: {
      type: Boolean,
      default: true
    },
    // 是否显示底部条
    line: {
      type: Boolean,
      default: true
    },
    // 底部条颜色
    lineColor: {
      type: String,
      default: "#7842EB"
    },
    // 底部条高度 rpx
    lineHeight: {
      type: Number,
      default: 4
    },
    // 底部条宽度相对于标签宽度比例
    lineScale: {
      type: Number,
      default: 0.6
    }
  },
  data() {
    this.navContextList = [];
    return {
      active: 0,
      diffLeft: 0,
      scrollLeft: 0,
      lineWidth: 0,
      lineLeft: 0,
      navInfoList: this.itemList
    };
  },
  computed: {
    navWidth() {
      const perView = parseInt(this.navPerView);
      return isNaN(perView) ? "" : "width:" + 100 / perView + "%;";
    },
    transform() {
      return `transform: translate3d(${-100 * this.active}%, 0, 0);`;
    }
  },
  watch: {
    value(index) {
      this.active = this.value;
      this.renderContent();
      this.refreshNavScroll();
    },
    itemList(value) {
      this.navInfoList = value;
    }
  },
  created() {
	  console.log('o-tabs--------------created---',this.active,this.value);
    this.active = this.value;
  },
  mounted() {
    this.renderContent();
    this.refreshNavScroll(true);
  },
  methods: {
    navClick(index, item) {
	  console.log('navClick-----------',index,item);
      if (index != this.active && !item.disabled) {
        this.active = index;
        this.$emit("input", index);
        this.$emit("change", item.value);
        this.renderContent();
        this.refreshNavScroll();
      }
    },
    renderContent() {
      this.$nextTick(() => {
        const item = this.navContextList[this.active];
        if (item && !item.info.isRender) {
          item.info.isRender = true;
          this.$emit("render", this.active);
        }
      });
    },
    refreshNavScroll(isInit) {
      this.$nextTick(() => {
        const query = () => uni.createSelectorQuery().in(this);
        query()
          .select(".s-tabs-nav-wrap")
          .boundingClientRect()
          .exec(([wrap]) => {
            query()
              .select(".s-tab-nav-view")
              .boundingClientRect()
              .exec(([view]) => {
                if (isInit) {
                  this.diffLeft = view.left - wrap.left;
                }
                const setNavScroll = item => {
                  if (item) {
                    const centerLeft = (wrap.width - item.width) / 2;

                    this.scrollLeft =
                      Math.abs(view.left - wrap.left - this.diffLeft) +
                      (item.left - centerLeft - wrap.left);

                    this.lineWidth = item.width * this.lineScale;
                    this.lineLeft =
                      this.scrollLeft +
                      centerLeft +
                      (item.width - this.lineWidth) / 2;
                  }
                };
                if (this.slotTitle) {
                  uni
                    .createSelectorQuery()
                    .in(this.navContextList[this.active])
                    .select(".s-tab-nav")
                    .boundingClientRect()
                    .exec(([item]) => {
                      setNavScroll(item);
                    });
                } else {
                  query()
                    .selectAll(".s-tab-nav")
                    .boundingClientRect()
                    .exec(([list]) => {
                      setNavScroll(list[this.active]);
                    });
                }
              });
          });
      });
    }
  },
  
};
</script>

<style lang="scss" scoped>
.s-tabs {
  width: 100%;
  margin-top: 25rpx;
  margin-left: 24rpx;
  position: relative;
  overflow-x: hidden;
  &-nav-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    white-space: nowrap;
    .scroll-wrap {
      height: 100%;
      ::-webkit-scrollbar {
        display: none;
      }
      // #ifdef H5
      /deep/ {
        & .uni-scroll-view > view {
          height: 100%;
        }
      }
      // #endif
    }
    .scroll-view {
      height: 100%;
      position: relative;
    }
    .s-tab-nav-view {
      height: 100%;
    }
  }
  .s-tab-nav {
    background-color: #fff;
    margin-right: 24rpx;
    border-radius: 60rpx;
    display: inline-flex;
    height: 50rpx;
    font-size: 24rpx;
    padding: 0 30rpx;
    justify-content: center;
    align-items: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    cursor: pointer;
    &.is-disabled {
      color: #c8c9cc !important;
      cursor: not-allowed;
    }
    &.is-active {
      background-color: #7842eb;
      box-shadow: 0px 14rpx 10rpx 0px rgba(20, 6, 49, 0.14);
    }
    .num {
      width: 32rpx;
      height:32rpx;
      border-radius: 50%;
      background-color: #ed3b3b;
      color: #fff;
      font-size: 24rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 12rpx;
    }
  }
}
</style>

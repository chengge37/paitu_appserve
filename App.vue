<script>
export default {
  onLaunch: function() {
    console.error("App Launch");
	// #ifdef APP-PLUS
			        const _self = this;  
			        const _handleClick = function(message) {  
			            // TODO  
						 console.error('收到消息1'+JSON.stringify(message))
						uni.showModal({
							title: '提示1',
							content: JSON.stringify(message),
							showCancel:false,
						});
			        };  
					const _handleReceive = function(message) {
					    // TODO  
						 console.error('收到消息2'+JSON.stringify(message))
						uni.showModal({
							title: '提示2',
							content: JSON.stringify(message),
							showCancel:false,
						});
					};  
			        plus.push.addEventListener('click', _handleClick);  
			        plus.push.addEventListener('receive', _handleReceive);  
			        // #endif 
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
</script>

<style lang="scss">
@import url('./static/font/iconfont.css');
@import './static/css/common.scss';
/*每个页面公共css */
page {
  background-color: #f2f3f6;
  font-size: 24rpx;
	box-sizing: border-box;
	letter-spacing: 0.4rpx;
}
view,div,text{
  box-sizing: border-box;
}
.line {
  height: 2rpx;
  background-color: rgba(242, 242, 246, 1);
  width: 100%;
}
.card {
  background-color: #fff;
}
.nronmal::after {
  content: "一般";
  background-color: #19a317;
  color: #fff;
  border-radius: 12px;
  font-size: 18rpx;
  width: 66rpx;
  height: 28rpx;
  display: block;
  line-height: 28rpx;
  text-align: center;
  padding-left: 12rpx;
}

</style>

<template>
	<view class="wrap">
		<image  class="ball" :style="'left:'+(moveX == 10 & x>10? x+'%':moveX+'px')+';top:'+(moveY == 10 & y>10? y+'%':moveY+'px')"	 
			@tap="openScan"	@touchstart="dragStart" @touchmove.stop.prevent="dragMove" :src="image"  mode="aspectFit">
		</image>
		<!-- <view  class="ball" :style="'left:'+(moveX == 10 & x>10? x+'%':moveX+'px')+';top:'+(moveY == 10 & y>10? y+'%':moveY+'px')"	 
			@tap="openScan"	@touchstart="dragStart" @touchmove.stop.prevent="dragMove">
			<text class="iconfont iconsaoma"></text>
			<text>出入库</text>
		</view> -->
	</view>
</template>
<script>
import uniPopup from "@/components/uni-popup/uni-popup.vue"
	export default {
		props: {
			x: {
				type: Number,
				default:0
			},
			y: {
				type: Number,
				default:0
			},
			image:{
				type:String,
				default: 'https://pic.paitume.com/3/1587871750119.png'
			}
		},
		data() {
			return {
				start:[0,0],
				moveY:10,
				moveX:10,
				windowWidth:'',
				windowHeight:'',
			}
		},
		mounted() {
			const { windowWidth, windowHeight } = uni.getSystemInfoSync();	
			this.windowWidth = windowWidth
			this.windowHeight = windowHeight
			this.moveX=windowWidth-52
			this.moveY=(windowHeight-52)/2
		},
		components:{
			uniPopup
		},
		methods: {
			dragStart(event){
				this.start[0]= event.touches[0].clientX-event.target.offsetLeft;
				this.start[1]= event.touches[0].clientY-event.target.offsetTop;
			},
			dragMove(event){
					let	 tag 	 = event.touches;
					// console.log(tag[0].clientX,this.windowWidth,tag[0].clientY,this.windowHeight,this.start[0],this.start[1],'移动')
					if(tag[0].clientX < 0 ){
						tag[0].clientX = 0
					}
					if(tag[0].clientY < 0 ){
						tag[0].clientY = 0
					}
					if(tag[0].clientX > this.windowWidth){
						tag[0].clientX = this.windowWidth
					}
					if(tag[0].clientY > this.windowHeight){
						tag[0].clientY = this.windowHeight
					}
					//以下这部分代码不要简写成if-else if-else的形式，this.moveX需要先赋值，如果先判断再赋值会造成疯狂抖动
					this.moveX	 = tag[0].clientX-this.start[0];
					if(this.moveX<10){
						this.moveX=10
					}
					if(this.moveX>this.windowWidth-52){
						this.moveX=this.windowWidth-52
					}
					this.moveY	 = tag[0].clientY-this.start[1];
					if(this.moveY<10){
						this.moveY=10
					}
					if(this.moveY>this.windowHeight-52){
						this.moveY=this.windowHeight-52
					}
					// console.log(this.moveX,this.moveY,'iiiiiiiiiiiii')
			},
			openScan(){
				console.log('调用扫码')
				uni.scanCode({
					onlyFromCamera: true,
					scanType:['qrCode','barCode'],
					success: (res)=> {
							console.log(res,'扫码结果')
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							if(res.scanType!='QR_CODE'&&res.scanType!='CODE_128'){
								uni.showToast({ title: "识别有误，请重新扫码", icon: "none" })
								return
							}
							this.$emit('openPop',res.result)
					},
					fail:function(err){
						console.error(err)
					}
				})
			},
		}}
</script>
 
<style lang="scss" scoped>
	.wrap{
		width: 100%;
		height: 100%;
	}
	.ball{
		width: 84rpx;
		height: 84rpx;
		background:linear-gradient(to bottom, #F8F8FF,#87CEFA);
		border-radius: 50%;
		// box-shadow: 0 0 15rpx #87CEFA;
		box-shadow:0px 12px 12px 0px rgba(20,6,49,0.12);
		color: #fff;
		font-size: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: fixed !important;
		z-index: 998;
		// color: #fff;
		// background: #7842EB;
		// text:first-child{
		// 	font-size: 30rpx;
		// }
		// text:last-child{
		// 	font-size: 18rpx;
		// }
	}
</style>

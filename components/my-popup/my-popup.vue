<template>
	<view v-if="showPopup" class="uni-popup">
		<view :class="[ani, animation ? 'ani' : '', !custom ? 'uni-custom' : '']" class="uni-popup__mask" @click="close(true)" />
		<view :class="[type, ani, animation ? 'ani' : '', !custom ? 'uni-custom' : '']" class="uni-popup__wrapper" @click="close(true)">
			<view :class="lucency?'':'uni-popup__wrapper-box'" :style="radius?'border-radius:10px':''" @click.stop="clear">
				
				<div class="pop-center" v-if="showCenter">
					<text class="title">{{title}}</text>
					<input :type="inputType" class="nick-input" v-model="inputValue" :placeholder="'请输入'+title" placeholder-style="color:#999999" />
					<div class="comfirm-btn" @click="update">确认</div>
				</div>
				
				<slot />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'MyPopup',
		props: {
			//输入框类型，默认为text，可以选password
			inputType:{
				type:String,
				default:'text',
			},
			//是否显示默认中间输入框和确定按钮
			showCenter:{
				type:Boolean,
				default:true,
			},
			//显示的标题
			title:{
				type:String,
				default:'',
			},
			//文本框的值
			value:{
				type:String,
				default:'',
			},
			// 开启动画
			animation: {
				type: Boolean,
				default: true
			},
			// 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
			type: {
				type: String,
				default: 'center'
			},
			// 是否开启自定义
			custom: {
				type: Boolean,
				default: false
			},
			// maskClick
			maskClick: {
				type: Boolean,
				default: true
			},
			show: {
				type: Boolean,
				default: true
			},
			lucency: {
				type: Boolean,
				default: false
			},
			radius: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				ani: '',
				showPopup: false,
				inputValue:this.value,
			}
		},
		watch: {
			show(newValue) {
				if (newValue) {
					this.open()
				} else {
					this.close()
				}
			},
			value(to,from){
				this.inputValue=to;
			}
		},
		created() {},
		methods: {
			clear() {},
			open() {
				this.$emit('change', {
					show: true
				})
				this.showPopup = true
				this.$nextTick(() => {
					setTimeout(() => {
						this.ani = 'uni-' + this.type
					}, 30)
				})
			},
			close(type) {
				if (!this.maskClick && type) return
				this.$emit('change', {
					show: false
				})
				this.ani = ''
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPopup = false
					}, 300)
				})
			},
			//确认修改方法
			update(){
				this.$emit('update',this.inputValue)
			}
		}
	}
</script>
<style lang="scss">
	.uni-popup {
		position: fixed;
		/*  #ifdef  H5  */
		top: 0px;
		// top: 50px;
		/*  #endif  */
		/*  #ifndef  H5  */
		top: 0px;
		/*  #endif  */
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 50;
		overflow: hidden;

		&__mask {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 998;
			background: rgba(0, 0, 0, 0.7);
			opacity: 0;

			&.ani {
				transition: all 0.3s;
			}

			&.uni-top,
			&.uni-bottom,
			&.uni-center {
				opacity: 1;
			}
		}

		&__wrapper {
			position: absolute;
			z-index: 999;
			box-sizing: border-box;

			&.ani {
				transition: all 0.3s;
			}

			&.top {
				top: 0;
				left: 0;
				width: 100%;
				transform: translateY(-100%);
			}

			&.bottom {
				bottom: 0;
				left: 0;
				width: 100%;
				transform: translateY(100%);
			}

			&.center {
				width: 100%;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				transform: scale(1.2);
				opacity: 0;
			}

			&-box {
				position: relative;
				box-sizing: border-box;
			}

			&.uni-custom {
				& .uni-popup__wrapper-box {
					padding: 0;
					background: #fff;
				}

				&.center {
					& .uni-popup__wrapper-box {
						position: relative;
						max-width: 80%;
						max-height: 80%;
						overflow-y: scroll;
					}
				}

				&.top,
				&.bottom {
					& .uni-popup__wrapper-box {
						width: 100%;
						max-height: 500px;
						overflow-y: scroll;
					}
				}
			}

			&.uni-top,
			&.uni-bottom {
				transform: translateY(0);
			}

			&.uni-center {
				transform: scale(1);
				opacity: 1;
			}
		}
	}
	.pop-center {
		padding: 30rpx;
	
		.title {
			font-size: 32rpx;
			color: #333333;
		}
	
		.nick-input {
			width: 350rpx;
			margin: 20rpx 0;
			background-color: #ffffff;
			font-size: 28rpx;
			padding: 20rpx 0;
			border-bottom: 1px solid #999999;
		}
	
		.gender {
			font-size: 28rpx;
			margin: 40rpx 0;
			width: 350rpx;
		}
	
		.radio {
			margin-right: 40rpx;
		}
	
		.comfirm-btn {
			padding: 15rpx;
			background-color: #651fff;
			color: #ffffff;
			text-align: center;
		}
	}
</style>

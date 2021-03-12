<!--  -->
<template>
	<view class="card-box">
		<view class="card-header">
			<view class="header-order-box">
				<view class="order-status">{{cardData.status | getOrderStatus}}</view>
				<!-- <view>图</view> -->
			</view>
			<view class="order-number-box">
				<view class="order-type">{{cardData.orderType}}</view>
				<view class="Vline"></view>
				<view class="order-number">单号：{{cardData.orderId}}</view>
				<view @click="copynum(cardData.orderId)" class="copy">复制</view>
			</view>
		</view>
		
		<view @tap="toDetail(cardData)">
			<view class="card-studio" v-if="orderType === 1">
				<view class="studio-img">
					<image mode="aspectFit" :src="util.picExplode(cardData.studioImg)" />
				</view>
				<view class="studio-name">
					<view>{{cardData.studioName}}</view>
					<!-- <view>￥{{cardData.studioPrice}}</view> -->
				</view>
				<view class="studio-device" v-if="cardData.device.length>0">
					<text class="tu">图</text>
					<text>附带器材</text>
				</view>
			</view>
			<view class="card-studio" v-if="orderType === 3">
				<view class="studio-img">
					<image mode="aspectFit"  :src="util.picExplode(cardData.studioImg)" />
				</view>
				<view class="studio-name">
					<view>{{cardData.studioName}}</view>
					<view>￥{{cardData.studioPrice}}</view>
				</view>
			</view>
			
			<!-- 附带器材模块 -->
			<view v-if="orderType === 1 || orderType === 2">
				<view class="card-content" v-for="(item,index) in cardData.device" :key="index">
					<view class="img">
						<image :class="{'Mask-box':item.IsOut}" :src="util.picExplode(item.url)" mode="aspectFit" />
						<view class="mask" v-if="item.snStatus!=0 && orderType == 2">
							{{item.snStatus==1?'已出库':'已入库'}}
						</view>
					</view>
					<view class="content-info">
						<view class="info-name">{{item.name}}</view>
						<view class="info-status" style="margin-bottom:18rpx;">SN:{{item.sn}}</view>
						<view class="info-status">{{item.status}}</view>
					</view>
					<view></view>
					<!-- <view>￥{{item.price}}</view> -->
				</view>
			</view>

			<view class="card-foot">
				<view class="foot-price">
					<view class="price-left">总价</view>
					<view>￥{{cardData.orderPrice}}</view>
				</view>
				<view class="foot-receive" v-if="orderType !== 3">
					<view class="receive">
						<view>客户信息：{{cardData.ReceiveInfo.name}}</view>
						<view>{{cardData.ReceiveInfo.Mobile}}</view>
					</view>
					<!-- <view class="receive">
						<view>收货地址：{{cardData.ReceiveInfo.address}}</view>
						<view @click="copynum(cardData.ReceiveInfo,true)">复制</view>
					</view> -->
				</view>
				<view class="foot-receive" v-else>
					<view class="receive">
						<view>开始结束事件：{{cardData.ReceiveInfo.start_time}}</view>
						<view>{{cardData.ReceiveInfo.end_time}}</view>
					</view>
					<view class="receive">
						<view>活动地址：{{cardData.ReceiveInfo.address}}</view>
						<view @click="copynum(cardData.ReceiveInfo,true)">复制</view>
					</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		props: {
			cardData: {
				type: Object,
				default: {}
			},
			orderType: {
				type: Number,
				default: 1
			}
		},
		data: () => ({}),

		components: {},
		
		mounted(){
			// console.log('cardData------------',this.cardData);
		},
		methods: {
			toDetail(item) {
				console.log("跳转订单详情-----------", item);
				let url = "pages/order/orderDetail";
				this.$Router.push({
					path: url,
					query: {
						id: item.id
					},
				});
			},
			copynum(str) {
				this.util.copyContent(str);
			}
		},
		
	};
</script>
<style rel='stylesheet/scss' lang='scss' scoped>
	.card-box {
		display: flex;
		flex-direction: column;
		padding: 34rpx 24rpx 8rpx;
		background-color: #ffffff;
		margin: 24rpx;
		border-radius: 4rpx;

		.card-header {
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #f2f3f6;
			padding-bottom: 30rpx;
			align-items:center;
			.header-order-box {
				font-size: 24rpx;
				display: flex;
				color: #333;

				.order-status {
					margin-right: 14rpx;
				}
			}

			.order-number-box {
				display: flex;
				align-items: center;
				color: #999999;
				font-size: 20rpx;

				.Vline {
					height: 20rpx;
					width: 1rpx;
					background-color: #999999;
					margin: 0 10rpx;
				}

				.copy {
					margin-left: 20rpx;
				}
			}
		}

		.card-studio {
			.studio-img {
				width: 100%;
				height: 368rpx;
				border: 2rpx solid #ccc;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					width:calc(100% - 4rpx);
					height:calc(100% - 4rpx);
				}
			}

			.studio-name {
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #f2f3f6;
				padding: 10rpx;
			}

			.studio-device {
				color: #d6cceb;
				font-size: 28rpx;
				margin: 10rpx 0;

				.tu {
					margin-right: 20rpx;
				}
			}
		}

		.card-content {
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #f2f3f6;
			padding: 6rpx 0rpx;
			.img{
				position: relative;
				width: 128rpx;
				height: 128rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-right: 20rpx;
				.mask{
					position: absolute;
					top: 0rpx;
					left: 0rpx;
					background: rgba(0, 0, 0, 0.5);
					color: #fff;
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 24rpx;
				}
			}
			.content-info {
				flex: 2;

				.info-name {
					margin-bottom: 10rpx;
				}

				.info-status {
					color: #999999;
					font-size: 20rpx;
				}
			}

			.Mask-box::before {
				display: block;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 128rpx;
				height: 128rpx;
				content: "\5df2\51fa\5e93";
				background-color: rgba(0, 0, 0, 1);
				color: #fff;
				opacity: 0.66;
			}

			image {
				width:calc(100% - 4rpx);
				height:calc(100% - 4rpx);
				will-change: transform;
			}
		}

		.card-foot {
			.foot-price {
				display: flex;
				justify-content: space-between;
				border-bottom: 1rpx solid #f2f3f6;
				padding: 20rpx 0rpx;

				.price-left {
					color: #999999;
				}
			}

			.foot-receive {
				color: #999999;
				font-size: 20rpx;

				.receive {
					display: flex;
					justify-content: space-between;
					margin: 20rpx 0;
				}
			}
		}
	}

	.margin-top12 {
		margin-top: 24rpx;
	}
	
</style>

<template>
	<view class="wrap">
		<Top :showTitle="true" topTitle="更多" @back="back"></Top>
		<view class="content">
			<view class="row-wrap">

				<!-- 订单状态模块 -->
				<view class="row" @tap="toUpdatePrice">
					<text class="iconfont iconyueduye-pifuxuanzhongzhuangtai"></text>
					<text>订单状态：</text>
					<text>{{orderInfo.pay_status | getOrderStatus}}</text>
					<view v-if="orderInfo.pay_status==1">
						<text>修改价格</text>
						<text class="iconfont iconarrow-right"></text>
					</view>
				</view>

				<!-- 核验单模块 -->
				<view class="row" @tap="operateCheck" v-if="orderInfo.pay_status>=3">
					<text class="iconfont iconyueduye-pifuxuanzhongzhuangtai"></text>
					<text>核验单状态：</text>
					<text>{{orderInfo.checkTitle}}</text>
					<view>
						<text>{{orderInfo.checkOperate}}</text>
						<text class="iconfont iconarrow-right"></text>
					</view>
				</view>
				
				<!-- 退款模块 -->
				<view class="row" @tap="toRefund" v-if="orderInfo.pay_status==4">
					<text class="iconfont iconyueduye-pifuxuanzhongzhuangtai"></text>
					<text>退款状态：</text>
					<text>{{refundStatus | refundStatusStr}}</text>
					<view v-if="refundStatus==1">
						<text>审核退款</text>
						<text class="iconfont iconarrow-right"></text>
					</view>
					<view v-else>
						<text>查看状态</text>
						<text class="iconfont iconarrow-right"></text>
					</view>
				</view>
				
				<!-- 订单修改删除模块 -->
				<view class="footBtn" v-if="orderInfo.is_manual==1">
					<!-- <view class="baseButton" @tap="updateOrder">修改订单</view> -->
					<view class="baseButton" @tap="delOrder">删除订单</view>
				</view>

			</view>
		</view>
		
		<!-- 修改价格弹窗 -->
		<my-popup ref="updatePrice" title="正整数价格" type="center" value="" @update="updatePrice">
		</my-popup>
		
		<!-- 审核退款弹窗 -->
		<uni-popup ref="refund" type="center" class="refund">
		  <view class="content">
		    <view class="title">{{refundStatus==1?'审核退款':'退款信息'}}</view>
			<view class="info">
				<text>退款时间：{{refundInfo.edit_time | time2FullDate}}</text>
				<text>退款金额：{{refundInfo.refund_price}}</text>
				<text>退款原因：{{refundInfo.refund_reason}}</text>
				<text>退款状态：{{refundInfo.status|refundStatusStr}}</text>
				<text>退款回复：{{refundInfo.refund_answer||'暂无回复'}}</text>
			</view>
		    <view class="status" v-if="refundStatus==1">
		      <radio-group @change="radioChange">
		        <label class="radio" v-for="(item,index) in refundList" :key="index">
		          <radio :value="item.value" :checked="item.checked" color="#651FFF" />
		          {{item.label}}
		        </label>
		      </radio-group>
			  <textarea :placeholder="placeholder" v-model="vertifyMsg"></textarea>
		    </view>
		
		    <view class="baseButton" @click="refundOrder"  v-if="refundStatus==1">确认</view>
		  </view>
		</uni-popup>
		
	</view>
</template>

<script>
	import Top from '@/components/top-head/top-head'
	import myPopup from "@/components/my-popup/my-popup.vue";
	import uniPopup from "@/components/uni-popup/uni-popup.vue";
	export default {
		components: {
			Top,myPopup,uniPopup
		},
		data() {
			return {
				orderId: '', //订单id
				orderInfo: {}, //订单信息
				checkStatusList:[
					{title:'待上传 ',operate:'上传核验单'},
					{title:'已上传，待用户确认 ',operate:'修改核验单'},
					{title:'已上传，用户确认',operate:'查看核验单'},
					{title:'已上传，用户拒绝 ',operate:'修改核验单'},
				],
				refundList: [
				  { label: "同意", value: "1", checked: true },
				  { label: "拒绝", value: "2", checked: false }
				],
				refundInfo:{},  //订单退款信息
				refundStatus:'1',  //用户退款状态，1.审核中 ，11.拒绝退款，12.运营审核，14.运营处理完毕，21.打款中，22.退款成功
				refundOp:'1',  //用户选择,1/同意，2/拒绝
				vertifyMsg:'', //审核信息
				placeholder:'默认为：同意',   //同意的默认为同意
			}
		},
		filters:{
			refundStatusStr(status) {
			      const refundStatusList = {
			        1: "用户申请退款，待审核",
			        11: "拒绝退款",
			        12: "运营审核 ",
			        14: "运营处理完毕",
			        21: "退款审核成功，打款中",
			        22: "退款成功 "
			      };
			      return refundStatusList[status];
			    }
		},
		onShow(){
			if(this.util.prevPageUpdate()){
				this.getOrderDetail();
			}
		},
		onLoad(options) {
			if (!this.util.isEmpty(options)) {
				this.orderId = options.id;
				this.getOrderDetail();
			}
		},
		methods: {
			//获取订单退款信息
			orderRefundInfo(){
				let params={
					order_id:this.orderId,
					order_type:1,
				}
				this.util.ajaxUserRefundOrderDetail(params).then(res=>{
					console.log('ajaxUserRefundOrderDetail---------',res);
					this.refundInfo=res;
					this.refundStatus=res.status;
				})
			},
			//显示退款窗口
			toRefund(){
				this.$refs.refund.open();
			},
			//审核退款订单方法
			refundOrder(){
				if(!this.vertifyMsg && this.refundStatus==1){
					this.vertifyMsg='同意';
				}
				let params={
				   order_id:this.orderId,
				   order_type:1, //1.影棚设备，3.模特
				   refund_answer:this.vertifyMsg,
				   opt:this.refundOp,  //1.同意，2.拒绝
				}
				this.util.serveRefundAnswer(params).then(res=>{
					this.util.showTip('操作成功');
					//重新获取数据
					this.getOrderDetail();
					this.$refs.refund.close();
				})
				
			},
			//退款选择
			radioChange(e) {
			  console.log('radioChange-----------',e);
			  let value=e.target.value;
			  this.vertifyMsg='';
			  this.refundOp=value;
			  if(value==1){
				  this.placeholder='默认为:同意';
			  }else{
				  this.placeholder='请输入拒绝原因：如（设备完好，不同意退款）';
			  }
			},
			//修改订单方法
			updateOrder(){
				console.log('updateOrder-------');
				//跳转到修改线下订单页面
				let url="/pages/order/addOrder";
				this.$Router.push({
					path:url,
					query:{id:this.orderId}
				})
			},
			//删除订单
			delOrder(){
				console.log('delOrder------');
				this.util.confirm('确定要删除订单吗').then(res=>{
					if(res){
						this.util.delOrder(this.orderId).then(res=>{
							this.util.showTip('删除订单成功！');
							uni.switchTab({
								url: '/pages/tabBar/order'
							})
						})
					}
				})
			},
			//操作核验单方法
			operateCheck(){
				let url='/pages/order/checkList';
				let type;
				switch(Number(this.orderInfo.checkStatus)){
					case 0:
						type=0
						//上传核验单
						break;
					case 1:
						type=1;
						break;
					case 2:
						type=2;
						//查看核验单
						break;
					case 3:
						type=1;
						//修改核验单
						break;
				}
				this.$Router.push({
					path: url,
					query: {id:this.orderInfo.id,type:type} 
				});
			},
			//跳转到添加核验单方法
			toCheckList(){
				let url='/pages/order/checkList';
				this.$Router.push({
					path: url,
					query: {id:this.orderId}
				});
			},
			
			//去修改价格方法
			toUpdatePrice(){
				if(this.orderInfo.pay_status==1){
					this.$refs['updatePrice'].open();
				}
			},
			//修改价格方法
			updatePrice(val){
				let params={
					id:this.orderInfo.id,
					price:val
				}
				this.util.updateOrderPrice(params).then(res=>{
					this.util.showTip('修改价格成功');
					this.$refs['updatePrice'].close();
				})
			},
			
			//返回
			back() {
				// this.util.back();
				var prevPage = this.util.prevPage(); //上一个页面
				prevPage.setData({update:true});
				this.util.back();
			},
			//获取订单信息
			getOrderDetail() {
				let params = {
					order_id: this.orderId,
					is_server: 2
				};
				this.util.getDSOrder(params).then(res => {
					
					//给订单一个核验单状态
					//checkStatus,/0 未上传核验单,1.商家上传，待用户确认 （能修改核验单）2.商家上传，用户确认（不能修改） 3。 商家上传，用户拒绝 （能修改）
					let flag;
					let checkStr='';
					if(res.check){
						flag=1;
						console.log('res.check-----1----',res.check);
						if(res.check.status==1){
							if(res.check.reject_msg){
								console.log('res.check----3-----');
								flag=3
							}else{
								console.log('res.check----2-----');
								flag=2;
							}
						}
					}else{
						flag=0;
					}
					console.log('falg---------',flag);
					res.checkStatus=flag;
					res.checkTitle=this.checkStatusList[flag].title;
					res.checkOperate=this.checkStatusList[flag].operate;
					
					//如果订单为退款状态，获取退款信息
					if(res.pay_status==4){
						this.orderRefundInfo();
					}
					this.orderInfo = res;
					console.log('this.orderInfo-----------', this.orderInfo);
				})
			},

			toItemPage() {

			}
		}
	}
</script>

<style lang="scss" scoped>
	.iconfont {
		font-size: 50rpx;
	}

	.wrap {
		font-size: 28rpx;
		color: #333;

		.content {
			padding: 0 24rpx;

			.row {
				height: 100rpx;
				background: #fff;
				display: flex;
				align-items: center;
				padding: 0 24rpx;

				text:last-child {
					margin-left: 16rpx;
				}

				.iconyueduye-pifuxuanzhongzhuangtai {
					color: #19A317;
				}
			}

			.row+.row {
				margin-top: 8rpx;
			}

			.row-one {
				margin-bottom: 24rpx;

				text:first-child {
					margin-right: auto;
				}
			}

			.row-wrap {
				.row {
					&>text:first-child {
						margin-right: 24rpx;
					}

					&>text:nth-child(2),
					&>text:nth-child(3) {
						font-size: 22rpx;
						color: #999;
					}

					text+view {
						margin-left: auto;
						display: flex;
						align-items: center;
					}
				}
			}
		}
	}
	.refund{
		.content{
			padding:24rpx;
			width:600rpx;
			.title{
				font-size: 36rpx;
				display: flex;
				justify-content: center;
				padding-bottom: 30rpx;
			}
			.radio{
				margin-right:20rpx;
			}
			textarea{
				width: 100%;
				background: #EFF0F4;
				box-sizing: border-box;
				padding: 20rpx;
				margin:24rpx 0rpx;
			}
			.info{
				display: flex;
				flex-direction: column;
				margin-bottom: 20rpx;
				text{
					margin-bottom:10rpx;
				}
			}
		}
	}
</style>

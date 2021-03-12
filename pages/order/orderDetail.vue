<template>
	<view class="wrap">
		<!-- 头部模块 -->
		<view class="top">
			<Top :showDetail="true" :showTitle="true" topTitle="订单详情" @detail="toOrderMore" @back="back"></Top>
		</view>
		<!-- 执行人 -->
		<div class="header">
			<span class="title-with-line">执行人</span>
			<div class="header-right">
				<view>
					<text class="user" v-for="(item,index) in employeeList" :key="index">
						{{item.nick}}
					</text>
				</view>
				<i class="iconfont iconarrow-right"></i>
			</div>
		</div>
		<!-- 基本信息 -->
		<div class="basic-info">
			<div class="basic-title">
				<span class="title-with-line">基本信息</span>
			</div>
			<div class="basic-row-wrap">
				<div class="basic-row">
					<span>下单时间</span>
					<span>{{orderInfo.create_time | time2FullDate}}</span>
				</div>
				<div class="basic-row">
					<span>订单状态</span>
					<span>{{orderInfo.pay_status | getOrderStatus}}</span>
				</div>
				<div class="basic-row">
					<span>线上/线下</span>
					<span>{{orderInfo.is_manual==0?'线上订单':'线下订单'}}</span>
				</div>
				<div class="basic-row">
					<span>订单类型</span>
					<span>{{orderInfo.orderTypeStr}}</span>
				</div>
				<div class="basic-row">
					<span>租赁方式</span>
					<span>{{orderInfo.rent_type==1?"按小时":"按天"}}</span>
				</div>
				<div class="basic-row">
					<span>订单编号</span>
					<span>{{orderInfo.show_id}}</span>
					<span @tap="copyContent(orderInfo.show_id)">复制</span>
				</div>
				<div class="basic-row">
					<span>订单价格</span>
					<span>￥{{orderInfo.price}}</span>
				</div>
				
				<div class="basic-row">
					<span>备注</span>
					<span>{{orderInfo.remark?orderInfo.remark:'无'}}</span>
				</div>
				
				<!-- <div class="basic-row">
					<span>配送地址</span>
					<span>广东省珠海市香洲区清华科技园A612</span>
					<span>复制</span>
				</div> -->
				
				<div class="basic-row">
					<div>
						<span>开始</span>
						<span>{{orderInfo.start_time}}</span>
					</div>
					<div>
						<span>结束</span>
						<span>{{orderInfo.end_time}}</span>
					</div>
				</div>
				
				
				
			</div>
		</div>
		<!-- 客户信息 -->
		<div class="client-info">
			<div class="client-title">
				<span class="title-with-line">客户信息</span>
				<span>联系客户</span>
			</div>
			<div class="info">
				<div class="avatar">
					<image v-if="customer.avatar" :src="util.picExplode(customer.avatar)" mode="aspectFit"></image>
					<image v-else :src="defaultAvatar" mode="aspectFit"></image>
				</div>
				<div class="name-phone">
					<div class="name">
						<span>姓名：</span>
						<span>{{customer.name}}</span>
					</div>
					<div class="phone">
						<span>联系方式：</span>
						<span>{{customer.mobile}}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 订单明细 -->
		<div class="order-detail">
			<div class="order-title">
				<span class="title-with-line">订单明细</span>
			</div>
			<div class="order-row-wrap">
				<div class="order-row" v-for="(item,index) in productList" :key="index">
					<div class="img-wrap">
						<image  :src="util.picExplode(item.pic)" mode="aspectFit"></image>
						<!-- <view class="mask" v-if="item.type==2">{{item.isOut?"仓库外":"仓库内"}}</view> -->
						<view class="mask" v-if="item.type==2 && item.isOut!=null && orderInfo.orderType==1">
							{{item.isOut==true?'已出库':'已入库'}}
						</view>
					</div>
					<div class="other-info">
						<div class="name-price">
							<span>{{item.name}}</span>
							<!-- <span>¥128.00</span> -->
						</div>
						<div class="in-out snNum" v-if="item.type==2">sn:{{item.sn}}</div>
						<div class="in-out">{{item.isOut?"仓库外":"仓库内"}}</div>
						
					</div>
				</div>
			</div>
		</div>
		
		<!-- 运单号 -->
		<!-- <div class="tracking-number">
			<div class="tracking-title">
				<span class="title-with-line">运单号
				</span>
			</div>
			<div class="tracking-content">
				<span>运单号</span>
				<input v-model="traceNum" class="uni-input" placeholder="请输入运单号" />
				<span @tap="copy">复制</span>
			</div>
		</div> -->
		
		<!-- 底部按钮 -->
		<view class="footBtn">
			<!-- 未付款状态的订单才能修改价格.pay_status:1 -->
			<view class='baseButton' v-if="orderInfo.pay_status==1" @tap="toUpdatePrice">未付款，修改价格</view>
			<view class='baseButton' v-if="orderInfo.pay_status==2" @tap="acceptOrder">接单</view>
			<view class='baseButton' v-if="orderInfo.pay_status==2" @tap="toReject">拒单</view>
			<view class='baseButton' v-if="orderInfo.pay_status==3 && !orderInfo.check" @tap="toCheckList()">已接单，上传核验单</view>
		</view>
		
		<my-popup ref="updatePrice" title="修改价格" type="center" value="" @update="updatePrice">
		</my-popup>
		
		<my-popup ref="refuse" title="拒单原因" type="center" :value="refuseContent" @update="confirmReject">
		</my-popup>
		
		<!-- 悬浮小球，扫码出入库 -->
		<ScanBall @openPop="openPop" v-if="orderInfo.orderType==1"></ScanBall>
		<!-- 弹出框，控制出入库 -->
		<uni-popup ref="popup" type="bottom" class="pop-wrap">
			<view class="pop-content">
				<!-- <view>请选择出库还是入库</view> -->
				<view>
					<button :disabled="!canOut" @click="scanInOut(1)">出库</button>
					<button :disabled="!canIn" @click="scanInOut(2)">入库</button>
					<!-- <text @click="scanInOut(1)">出库</text> -->
					<!-- <text @click="scanInOut(2)">入库</text> -->
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import ScanBall from '@/components/scan-ball/scan-ball'
import {equip} from '@/common/api/api'
import Top from '@/components/top-head/top-head'
import myPopup from "@/components/my-popup/my-popup.vue";
	export default {
		data() {
			return {
				scanSn:'',
				traceNum:'',
				canOut:true,
				canIn:false,
				orderId:'',  //选择查看的订单id
				orderInfo:{}, //订单信息
				customer:{}, //客户信息
				defaultAvatar:'',  //默认客户头像
				productList:[],  //产品列表（包括影棚设备）
				orderPrice:'', //用户修改的价格
				refuseContent:'',  //拒单原因
				employeeList:[],   //执行人列表
			}
		},
		components:{
			ScanBall,Top,myPopup
		},
		onShow(){
			let currentPage = this.util.currentPage();
			if (currentPage.data) {
				let update = currentPage.data.update;
				if (update) {
					//重新刷新页面
					console.log('orderDetail----------------onShow---------',this.orderId);
					this.getOrderDetail();
				}
			}
		},
		onLoad(options){
			this.defaultAvatar=this.$qiniu+this.config.defaultAvatar;
			console.error('onLoad-----orderDetail-------',options);
			if(!this.util.isEmpty(options)){
				this.orderId=options.id;
				this.getOrderDetail();
			}
		},
		mounted() {
		},
		methods: {
			//获取sn出入库状态
			getSnStatus(sn){
				console.log("getSnStatus-----------",sn);
				let params={
					order_id:this.orderId,
					sn
				}
				return new Promise((resolve,reject)=>{
					this.util.snStatus(params).then(res=>{
						resolve(res);
					})
				})
				
			},
			//去修改价格方法
			toUpdatePrice(){
				if(this.orderInfo.pay_status==1){
					this.$refs['updatePrice'].open();
				}
			},
			//修改价格方法
			updatePrice(val){
				console.log('updatePrice----',val,this.$refs);
				let params={
					id:this.orderInfo.id,
					price:val
				}
				this.util.updateOrderPrice(params).then(res=>{
					this.util.showTip('修改价格成功');
					this.$refs['updatePrice'].close();
					this.getOrderDetail(this.orderId);
				})
			},
			//跳转到添加核验单方法
			toCheckList(){
				console.log('toCheckList--------------',this.orderInfo.id);
				let url='/pages/order/checkList';
				this.$Router.push({
					path: url,
					query: {id:this.orderInfo.id,type:0} 
				});
			},
			//返回方法
			back(){
				this.util.back();
			},
			//显示拒单弹窗
			toReject(){
				this.$refs['refuse'].open();
			},
			//确定拒单方法
			confirmReject(val){
				this.refuseContent=val;
				console.log('confirmRefuse-----',this.refuseContent);
				this.$refs['refuse'].close();
			},
			//接单方法
			acceptOrder(){
				console.log('acceptOrder-------');
				let tip;
				if(this.orderInfo.has_equipment==1){
					tip="设备sn码被随机分配,确定接单吗?";
				}else{
					tip="确定接单吗?";
				}
				this.util.confirm(tip).then(res=>{
					if(res){
						let id=this.orderInfo.id;
						this.util.acceptOrder(id).then(res=>{
							this.util.operateBack('接单成功',true);
						})
					}
				})
			},
			
			//拒单方法
			refuseOrder(){
				console.log('refuseOrder-----');
			},
			
			//跳转到更多操作页面
			toOrderMore(){
				console.log('跳转到操作页面------toDetail----');
				let url='/pages/order/orderMore';
				this.$Router.push({
					path: url,
					query: {id:this.orderInfo.id}
				});
			},
			
			//获取影棚设备订单详情（租赁订单）
			getOrderDetail(){
				this.productList=[];
				let params={order_id:this.orderId,is_server:2};
				this.util.getDSOrder(params).then(res=>{
					console.log('getOrderDetail-------------',res);
					this.employeeList=res.employee;
					this.changeData(res);
				})
			},
			//处理数据
			changeData(res){
				//给订单添加一个订单类型字段
				res.orderType=0;  //订单类型，0/影棚订单，1/设备订单,2/影棚设备订单
				res.orderTypeStr='影棚订单';
				if(res.rent_type==2){
					res.start_time=res.start_time.split(' ')[0];
					res.end_time=res.end_time.split(' ')[0];
				}
				if(res.has_studio==1){
						if(res.has_equipment==1){
							res.orderType=2;
							res.orderTypeStr='影棚设备订单';
						}
				}else{
					res.orderType=1;
					res.orderTypeStr='设备订单';
				}
				
				if(res.is_manual==0){
					let user=res.user;
					let obj={
						name:user.nick,
						mobile:user.mobile,
						avatar:user.avatar
					}
					this.customer=obj;
				}else{
					this.customer=res.customer
				}
				this.orderInfo=res;
				
				let studioInfo=null;
				let equipInfo=null;
				switch(Number(res.orderType)){
					case 0:
						//影棚订单
						studioInfo=res.studio_order.studio_detail;
						break;
					case 1:
						//设备订单
						equipInfo=[];
						res.equip_order.forEach((item,index)=>{
							for(let i=0;i<item.order_count;i++){
								let obj={...item.equip};
								obj.sn=obj.sn_array[i].sn;
								equipInfo.push(obj);
							}
						})
						break;
					case 2:
						//影棚设备订单
						studioInfo=res.studio_order.studio_detail;
						equipInfo=res.studio_order.equip_order_array;
						equipInfo=[];
						res.studio_order.equip_order_array.forEach((item,index)=>{
							for(let i=0;i<item.order_count;i++){
								let obj={...item.equip};
								obj.sn=obj.sn_array[i].sn;
								equipInfo.push(obj);
							}
						})
						break;
				}
				
				if(studioInfo){
					let obj={
						id:studioInfo.id,
						name:studioInfo.name,
						pic:studioInfo.pic,
						type:1,  //1:影棚，2/设备
					}
					this.productList.push(obj);
				}
				console.error('equipInfo---------',equipInfo);
				if(equipInfo){
					equipInfo.forEach(async (item,index)=>{
						let snList=await this.getSnStatus(item.sn);
						let length=snList.length;
						let isOut=null;
						switch(Number(length)){
							case 1:
								isOut=true;
								break;
							case 2:
								isOut=false;
								break;
						}
						let obj={
							id:item.id,
							name:item.custom_desc || item.static.name,
							pic:item.pic,
							isOut:isOut, 
							type:2,  //1:影棚，2/设备
							sn:item.sn
						}
						this.productList.push(obj);
						
					})
				}
				
				console.log('orderInfo------------',res);
				console.log('productList----------------',this.productList);
			},
			// 点击复制，调用
			copy(){
				uni.setClipboardData({
						data: this.traceNum,
						success: function () {
								console.log('success');
						}
				});
			},
			// 扫码成功，打开弹窗选择出库还是入库
			openPop(sn){
				this.$http.get(equip.inOutStatus,{
					order_id:this.orderId,
					sn,
				}).then(res=>{
					console.log(res,'出入库状态')
					// 初始为空数组
					if(res[res.length-1].type==1){
						this.canOut=false
						this.canIn=true
					}else if(res[res.length-1].type==2){
						this.canOut=false
						this.canIn=false
					}
				}).catch(err=>{
					console.error(err)
				})
				this.$refs.popup.open()
				this.scanSn=sn
			},
			// 调用出入库请求
			scanInOut(type){
				this.$http.post(equip.scanInOut,{
					order_id:this.orderId,
					type,
					sn:this.scanSn
				}).then(res=>{
					console.log(res,'出入库结果')
					this.$refs.popup.close()
					uni.showToast({ title: "操作成功", icon: "none" })
					//重新获取数据
					this.getOrderDetail();
				}).catch(err=>{
					console.error(err)
					this.$refs.popup.close()
				})
			},
			
			//复制单号方法
			copyContent(str){
				this.util.copyContent(str);
			}
			
		}
	}
</script>
 
<style lang="scss" scoped>
	.wrap{
		padding: 24rpx 24rpx 40rpx;
		box-sizing: border-box;
		color: #333;
		font-size: 28rpx;
		// 执行人
		.header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 24rpx;
			box-sizing: border-box;
			height: 84rpx;
			background: #fff;
			margin-bottom: 24rpx;
			.header-right{
				display: flex;
				align-items: center;
				.user{
					display:block;
					width:56rpx;
					height:56rpx;
					line-height: 56rpx;
					text-align:center;
					background:#7842EB;
					border-radius: 40rpx;
					color:#fff;
					overflow: hidden;
				}
				.iconnext{
					font-size: 32rpx;
					margin-left: 10rpx;
				}
			}
		}
		// 基本信息
		.basic-info{
			background: #fff;
			margin-bottom: 24rpx;
			.basic-title{
				padding: 40rpx 24rpx 20rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F2F3F6;
				line-height: 40rpx;
			}
			.basic-row-wrap{
				padding:0 24rpx;
				box-sizing: border-box;
				.basic-row:not(:last-child){
					height: 84rpx;
					border-bottom: 2rpx solid #F2F3F6;
					display: flex;
					align-items: center;
					span{
						font-size: 26rpx;
						color: #666;
					}
					span:first-child{
						margin-right: auto;
					}
					span:nth-child(3){
						margin-left: 8rpx;
					}
				}
				.basic-row:last-child{
					display: flex;
					justify-content: space-between;
					div{
						display: flex;
						flex-direction: column;
						padding: 24rpx 0;
						span:first-child{
							margin-bottom: 6rpx;
							font-size: 22rpx;
							color: #666;
						}
					}
					div:last-child{
						text-align: right;
					}
				}
				.basic-row:nth-child(2){
					span:last-child{
						color: #333333;
					}
				}
			}
		}
		// 客户信息
		.client-info{
			background: #fff;
			margin-bottom: 24rpx;
			.client-title{
				display: flex;
				justify-content: space-between;
				padding: 30rpx 24rpx 14rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F2F3F6;
				span:first-child{
					position: relative;
					top: 14rpx;
				}
				span:last-child{
					width: 126rpx;
					height: 56rpx;
					border: 2rpx solid #D6D6D6;
					border-radius: 14px;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 22rpx;
				}
			}
			.info{
				height: 194rpx;
				padding: 24rpx 40rpx 40rpx 24rpx;
				box-sizing: border-box;
				display: flex;
				.avatar{
					width: 128rpx;
					height: 128rpx;
					margin-right: 16rpx;
					// background: tomato;
					image{
						width:100%;
						height:100%;
					}
				}
				.name-phone{
					flex: 1;
					font-size: 26rpx;
					color: #666;
					div{
						display: flex;
						justify-content: space-between;
					}
					.name{
						margin-bottom: 8rpx;
					}
				}
			}
		}
		// 订单明细
		.order-detail{
			background: #fff;
			margin-bottom: 24rpx;
			.order-title{
				padding: 40rpx 0 20rpx;
				text-indent: 24rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F2F3F6;
			}
			.order-row-wrap{
				padding: 24rpx;
				box-sizing: border-box;
				.order-row{
					margin-bottom: 24rpx;
					display: flex;
					.img-wrap{
						width: 128rpx;
						height: 128rpx;
						margin-right: 24rpx;
						position:relative;
						image{
							width:100%;
							height:100%;
						}
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
					.other-info{
						flex: 1;
						.name-price{
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 10rpx;
							span:last-child{
								font-size: 22rpx;
							}
						}
						.snNum{
							margin-bottom:20rpx;
						}
						.in-out{
							font-size: 22rpx;
							color: #999;
						}
					}
				}
				.order-row:last-child{
					margin-bottom: 0;
				}
			}
		}
		// 运单号
		.tracking-number{
			background: #fff;
			margin-bottom: 24rpx;
			.tracking-title{
				padding: 40rpx 0 20rpx;
				box-sizing: border-box;
				border-bottom: 2rpx solid #F2F3F6;
				text-indent: 24rpx;
			}
			.tracking-content{
				height: 100rpx;
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 24rpx;
				box-sizing: border-box;
				color: #666;
				.uni-input{
					width: 480rpx;
					height: 62rpx;
					background: #EFF0F4;
					text-indent: 12rpx;
					border-radius: 8rpx;
				}
			}
		}
		
		// 弹出框控制出入库
		.pop-wrap{
			z-index: 999;
			.pop-content{
				height: 500rpx;
				background: #fff;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				view:first-child{
					margin-bottom: 100rpx;
					font-size: 36rpx;
					font-weight: 500;
				}
				view:last-child{
					display: flex;
					justify-content: center;
					button{
						width:188rpx;
						height:76rpx;
						background:linear-gradient(180deg,rgba(176,119,247,1) 0%,rgba(120,66,235,1) 100%);
						box-shadow:0 16rpx 24rpx 0 rgba(20,6,49,0.12);
						// border-radius:28rpx;
						color: #fff;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					button+button{
						margin-left: 90rpx;
					}
					button[disabled]{
						background: #eee;
						color: #aaa;
					}
				}
			}
		}
	}
</style>

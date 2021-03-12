<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar">
			<view class="top_view"></view>
		</view>
		<!-- #endif -->
		<view class="custom-header">
			<uni-nav-bar  right-icon="search" background-color="#F2F3F6">
				<view slot="default">
					<s-tabs :item-list="Tabsitem" effect @change="changeOrderType"></s-tabs>
				</view>
			</uni-nav-bar>
		</view>

		<view class="custom-content">
			<o-tabs :item-list="statusList" effect @change="changeStatus" v-if="orderType!=3" :value="payStatus"></o-tabs>
			<view v-if="orderList.length>0">
				<view v-for="(item,index) in orderList" :key="index">
					<!-- <device-card :order-type="orderType" :card-data="item" @tap="toDetail(item)"></device-card> -->
					<device-card :order-type="orderType" :card-data="item"></device-card>
				</view>
			</view>
			<view v-else>
				<no-data v-if="!loading"></no-data>
			</view>
			<div class="reachBottom" v-if="!loading && noMoreData && orderList.length>0">已经到底啦~</div>
			<view class="add-box" @tap="addorder">
				<text>+</text>
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	import sTabs from "@/components/s-tabs";
	import oTabs from "@/components/o-tabs";
	import DeviceCard from "@/pages/order/tabBarCard/DeviceCard";
	import {
		order
	} from "@/common/api/api";
	import {mapGetters} from 'vuex'
	export default {
		components: {
			uniNavBar,
			sTabs,
			oTabs,
			DeviceCard
		},
		data() {
			return {
				loading: true, //是否正在加载数据
				orderType: 1, //1:影棚订单，2:设备订单，3:活动订单
				orderList: [],
				Tabsitem: [{
						disabled: false,
						title: "场地"
					},
					{
						disabled: false,
						title: "器材"
					},
					// { disabled: false, title: "服务" },
					{
						disabled: false,
						title: "活动"
					}
					// { disabled: false, title: "助理" },
					// { disabled: false, title: "拼拍" }
				],
				barHeight: 25,
				DSOrder: [],
				AOrder: [],
				statusList:[
					{title: "不限",value: 0,count:0},
					{title: "待付款",value: 1,count:0},
					{title: "待接单",value: 2,count:3},
					{title: "已确认",value: 3,count:0},
					{title: "退款中",value: 4,count:0},
					{title: "退款完毕",value: 5,count:0},
					{title: "进行中",value: 6,count:0},
					{title: "待评论",value: 7,count:0},
					{title: "已完成",value: 8,count:0},
				],
				
				orderParams: {
					is_server: 2,
					page: 1
				},
				AorderParams: {
					page: 1
				},
				DSOption: {},
				payStatus:0,
				DStotal_count: null,
				Atotal_count: null,
				addPage: false, //是否是下拉加载
				noMoreData:false,  //列表是否没有数据了（到底了）
				firstLoad:true, //是否第一次加载
			};
		},
		computed: {
			...mapGetters(['tabParams']),
		},
		onLoad() {
			console.error('onLoad---------------');
			this.getSystemStatusBarHeight();
			this.dataAndCount();
		},
		onShow() {
			console.error('onShow---------------');
			let params=this.tabParams;
			if(!this.util.isEmpty(params)){
				if(params.status){
					this.changeStatus(params.status);
					this.payStatus=params.status;
				}
			}
			//如果不是第一次加载，重新加载数据
			if(!this.firstLoad){
				//重新加载数据
				this.dataAndCount();
			}else{
				this.firstLoad=false;
			}
		},
		onPullDownRefresh() {
			//重新加载数据
			this.dataAndCount();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		methods: {
			dataAndCount(){
				this.getOrderD();
				//获取各个状态订单数量
				this.getOrderDCount();
			},
			addorder() {
				this.$Router.push("/pages/order/addOrder");
			},
			toDetail(item) {
				let url = "pages/order/orderDetail";
				this.$Router.push({
					path: url,
					query: {
						id: item.id
					},
				});
			},
			//切换订单类型方法
			changeOrderType(value) {
				console.log('changeOrderType------------------',value);
				this.orderType = value;
				this.DSOrder=[];
				this.AOrder=[];
				switch (value) {
					case 1:
					case 2:
						this.orderParams.page=1;
						this.dataAndCount();
						break;
					case 3:
						this.AorderParams.page=1;
						this.getOrderD();
						break;

					default:
						break;
				}
			},
			//切换订单状态方法
			changeStatus(value) {
				console.log("changeStatus=====================", value);
				this.payStatus=value;
				this.DSOrder=[];
				this.AOrder=[];
				this.orderParams = {
					page:1,
					is_server: 2
				};
				this.getOrderD();
			},
			//获取系统状态栏高度
			getSystemStatusBarHeight() {
				console.log('getSystemStatusBarHeight+++++++++++++++++++++++++');
				// #ifdef APP-PLUS
				let height = plus.navigator.getStatusbarHeight();
				this.barHeight = height;
				// #endif
				// #ifdef H5
				this.barHeight = 0;
				// #endif
			},
			
			//获取sn出入库状态
			getSnStatus(orderid,sn){
				console.log("getSnStatus-----------",sn);
				let params={
					order_id:orderid,
					sn
				}
				return new Promise((resolve,reject)=>{
					this.util.snStatus(params).then(res=>{
						resolve(res);
					})
				})
				
			},
			
			//获取各个状态订单数量
			getOrderDCount(){
				this.statusList.forEach((item,index)=>{
					if(item.value>0){
						let params={
							is_server:2,
							pay_status:item.value, //订单状态
						}
						if (this.orderType == 1) {
							params.has_studio = 1;
						} else if (this.orderType == 2) {
							params.has_equipment = 1;
							params.has_studio=0;
						}
						this.$http.get(order.getDSOrder, params).then(res => {
							console.log('getOrderDCount------------------',res);
							item.count=res.total_count;
						});
					}
				})
				
			},
			
			//获取订单信息，type,1/影棚订单，2/设备订单，3/活动订单
			getOrderD() {
				this.util.showLoading();
				this.loading = true;
				let params={...this.orderParams};
				if(this.payStatus>0){
					params.pay_status=this.payStatus;
				}
				if (this.orderType == 1) {
					params.has_studio = 1;
				} else if (this.orderType == 2) {
					params.has_equipment = 1;
					params.has_studio = 0;
				}
				console.log('getOrderD---------',params);
				if(this.orderType!=3){
					this.$http.get(order.getDSOrder, params).then(res => {
						console.error('getOrder------------------------',res);
						if (this.addPage) {
							this.DSOrder = this.DSOrder.concat(res.rows);
						} else {
							this.DSOrder = res.rows;
						}
						this.DStotal_count = res.total_count;
						this.ClearData(this.DSOrder);
						this.loading = false;
						this.util.hideLoading();
					});
				}
				
				if (this.orderType == 3) {
					this.$http.get(order.getAOrder, this.AorderParams).then(res => {
						if (this.addPage) {
							this.AOrder = this.AOrder.concat(res.rows);
						} else {
							this.AOrder = res.rows;
						}
						this.Atotal_count = res.total_count;
						this.ClearData(this.AOrder);
						this.loading = false;
						this.util.hideLoading();
					});
				}
			},
			ClearData(data) {
				// console.log('ClearData---------------------', data);
				if (this.orderType == 2) {
					let list=[];
					data.forEach((item,index)=>{
							let userInfo=this.getUserInfo(item);
							let obj={
								id: item.id,
								status: item.pay_status,
								orderType: item.is_manual == 0 ? "线上订单" : "线下订单",
								orderId: item.show_id,
								ReceiveInfo: {
									name:userInfo[0]||'无',
									Mobile:userInfo[1]||'无',
									address: userInfo[2]||'无',
								},
								orderPrice: item.price,
								device:[]
							}
							item.equip_order.forEach(async (item2,index2)=>{
								let equip=item2.equip;
								for(let i=0;i<item2.order_count;i++){
									let snStatus=0;
									if(equip.sn_array[i]){
										snStatus=await this.getSnStatus(item.id,equip.sn_array[i].sn);
										console.error('snStatus-------',snStatus.length);
									}
									let o={
										name: equip.custom_desc || equip.static.name,
										status: snStatus.length==1?"仓库外":"仓库内",
										snStatus:snStatus.length,  //sn码状态情况，0/无状态,1/已出库，2/已入库
										sn:equip.sn_array[i]?equip.sn_array[i].sn:'',
										url: equip.pic || equip.static.pic,
										price: item2.price
									};
									obj.device.push(o);
								}
							})
							
							list.push(obj);
						
					})
					this.orderList=list;
				
				} else if (this.orderType == 1) {
					let list=[];
					data.forEach((item,index)=>{
							let userInfo=this.getUserInfo(item);
							let obj={
								id: item.id,
								status: item.pay_status,
								orderType: item.is_manual == 0 ? "线上订单" : "线下订单",
								orderId: item.show_id,
								ReceiveInfo: {
									name:userInfo[0]||'无',
									Mobile:userInfo[1]||'无',
									address: userInfo[2]||'无',
								},
								studioName: item.studio_order.studio_detail.name,
								studioImg: item.studio_order.studio_detail.pic,
								orderPrice: item.price,
								device:[]
							}
							item.studio_order.equip_order_array.forEach(async (item2,index2)=>{
								let equip=item2.equip;
								for(let i=0;i<item2.order_count;i++){
									let snStatus=0;
									if(equip.sn_array[i]){
										snStatus=await this.getSnStatus(item.id,equip.sn_array[i].sn);
										console.error('snStatus-------',snStatus.length);
									}
									let o={
										name: equip.custom_desc || equip.static.name,
										status: snStatus.length==1?"仓库外":"仓库内",
										snStatus:snStatus.length,  //sn码状态情况，0/无状态,1/已出库，2/已入库
										sn:equip.sn_array[i]?equip.sn_array[i].sn:'',
										url: equip.pic || equip.static.pic,
										price: item2.price
									};
									obj.device.push(o);
								}
							})
							
							list.push(obj);
						
					})
					this.orderList=list;
				
				} else if (this.orderType == 3) {
					this.orderList = data
						.map(item => {
							return {
								id: item.id,
								status: item.pay_status,
								is_manual: item.is_manual,
								orderType: "线上订单",
								orderId: item.show_id,
								studioName: item.name,
								studioPrice: item.fee,
								studioImg: item.pic,
								ReceiveInfo: {
									start_time: item.start_time,
									end_time: item.end_time,
									address: item.address
								}
							};
						})
						.filter(item => item);
				} else {
					this.orderList = [];
				}


				console.error('this.orderList----------------after', this.orderList);
			},
			
			
			//获取用户信息,数组，name,mobile,address
			getUserInfo(item){
				let list=[];
				let name,mobile,address;
				if(item.is_manual==0){
					name=item.user.nick;
					mobile=item.user.mobile;
					address=item.user.address
				}else{
					name=item.customer.name;
					mobile=item.customer.mobile;
					address=item.customer.address
				}
				list.push(name,mobile,address);
				return list;
			},
			
		},
		
		
		
		//下拉到底部触发事件
		onReachBottom() {
			this.addPage = true;
			console.log('onReachBottom----------', this.DStotal_count, this.orderParams.page);
			if (this.DStotal_count > this.orderParams.page * 10) {
				this.orderParams.page = ++this.orderParams.page;
				this.getOrderD();
			}else{
				this.noMoreData=true;
			}
			if (this.Atotal_count > this.AorderParams * 10) {
				this.AorderParams.page = ++this.AorderParams.page;
				this.getOrderD();
			}else{
				this.noMoreData=true;
			}
			
		},
		
	};
</script>

<style scoped lang="scss">
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

	.add-box {
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 80%;
		right: 10%;
		position: fixed;
		width: 64rpx;
		height: 64rpx;
		background: rgba(120, 66, 235, 1);
		box-shadow: 0px 12px 12px 0px rgba(20, 6, 49, 0.12);
		border-radius: 50%;
	}
</style>

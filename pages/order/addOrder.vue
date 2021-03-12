<template>
	<view class="wrap">
		<view class="top">
			<Top :showComplete="true" :hasComplete="complete" @complete="saveOrder" @back="back"></Top>
		</view>
		<view class="content">
			<picker @change="changeType" :value="type" :range="typeList">
				<view class="item itemLine">
					<text class="mustOption">订单类型</text>
					<view class="haveIcon">
						<text>{{typeList[type]}}</text>
						<i class="iconfont iconarrow-right"></i>
					</view>
				</view>
			</picker>

			<view class="item">
				<text class="mustOption">按小时/按天</text>
				<view class="uni-list-cell uni-list-cell-pd">
					<switch @change="changeRentType" :checked="rent_type==2"/>
				</view>
			</view>

			<view class="item itemLine" v-if="rent_type==1">
				<picker mode="time" :value="startTime" @change="changeTime($event,0)">
					<view class="column  time left">
						<text>开始</text>
						<text>{{startTime||'选择开始时间'}}</text>
					</view>
				</picker>
				<view class='timeCenter defaultShadow'>
					{{totalTime}}小时
				</view>
				<picker mode="time" :value="startTime" @change="changeTime($event,1)">
					<view class="column time right">
						<text>结束</text>
						<text>{{endTime||'选择结束时间'}}</text>
					</view>
				</picker>
			</view>

			<view class="item itemLine" v-if="rent_type==2">
				<picker mode="date" :value="startTime" @change="changeTime($event,0)">
					<view class="column  time left">
						<text>开始</text>
						<text>{{startTime||'选择开始时间'}}</text>
					</view>
				</picker>
				<view class='timeCenter defaultShadow'>
					{{totalTime}}天
				</view>
				<picker mode="date" :value="startTime" @change="changeTime($event,1)">
					<view class="column time right">
						<text>结束</text>
						<text>{{endTime||'选择结束时间'}}</text>
					</view>
				</picker>
			</view>

			<picker @change="changeStudio" :value="studioId" :range="studioList" range-key="name">
				<view class="item itemLine" v-if="type==0">
					<text class="mustOption">使用的影棚</text>
					
						<view class="haveIcon">
							<text>{{studioTitle}}</text>
							<i class="iconfont iconarrow-right"></i>
						</view>
				</view>
			</picker>
			
			<view class="item itemLine" @tap="toEditPrice">
				<text class="mustOption">订单价格</text>
				<view class="haveIcon">
					<text v-if="!showPrice">请输入正整数价格</text>
					<text v-if="showPrice">￥{{showPrice}}元</text>
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
		</view>

		<view class="content topWrap">
			<view class="item itemLine" @tap="selectUser(0)">
				<text class="mustOption">客户</text>
				<view class="haveIcon">
					<view>
						<text class="grayFont" v-if="customerInfo">{{customerInfo.group_name}}·{{customerInfo.name}}</text>
						<text class="grayFont" v-else>请选择客户</text>
						<text class="user" v-if="customerInfo" style="margin-left:10rpx;">
							<!-- {{customerInfo.name.substr(0,1)}} -->
							{{customerInfo.name}}
						</text>
					</view>
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="item itemLine"  @tap="selectUser(1)">
				<text class="mustOption">执行人</text>
				<view class="haveIcon">
					<view>
						<text class="user" v-for="(item,index) in selectEmployee" :key="index">
							{{item.name}}
						</text>
					</view>
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
		</view>

		<view class="content topWrap equip">
			<view class='item' @tap="toAddEquip">
				<text :class="{'mustOption':type==1}">附带器材</text>
				<view  class="addIcon defaultShadow">+</view>
			</view>
			<view class="equipList">
				<view class="equipItem" v-if="selectEquip.length>0" v-for="(item,index) in selectEquip" :key="index">
					<view>
						<text class="title">{{item.name}}</text>
						<text class="num">{{item.count}}</text>
					</view>
				</view>
				<view class="noData" v-if="selectEquip.length==0">
					<text>暂无选择器材！</text>
				</view>
			</view>
		</view>


		<!-- 选择添加器材弹窗 -->
		<my-popup ref="popup" type="bottom" :showCenter="false">
			<div class="equipPopup">
				<div class="title">
					<p>器材列表</p>
					<!-- <p class="iconfont iconguanbi" @click="sureClick"></p> -->
				</div>
				<div class="list-content" v-if="equipList.length>0">
					<div class="equip-list">
						<div class="equip-item" :class="item.value>0?'active':''" v-for="(item,index) in equipList" :key="index">
							<span class="selected-sign"></span>
							<div class="left">
								<p class="equip-name">{{item.custom_desc||item.name}}</p>
								<p class="equip-store">库存：{{item.count}}</p>
							</div>
							<div class="right">
								<p class="price">￥{{item.price}}</p>
								<uni-number-box :min="0"  :max="item.count" class="count" :value="item.selectNum" @change="changeCount($event,item)"></uni-number-box>
							</div>

						</div>
					</div>

					<!-- <div class="equip-footer">
						<div class="uni-pagina">
							<uni-pagination :show-icon="true" :total="equipParams.total" :current="equipParams.page" @change="pageChange"
							 pageSize="10"></uni-pagination>
						</div>
					</div> -->
				</div>
				<div class="equip-list-nodata" v-else>
					---暂无数据---
				</div>
			</div>

		</my-popup>

		<view class="content topWrap remark">
			<view>
				<textarea placeholder="请输入备注内容" v-model="remark" />
				</view>
		</view>
		
		<view class="baseButton" :class="{'gray':!complete}" @tap="saveOrder">{{btnTxt}}</view>

		<my-popup ref="popupPrice" type="center" @change="changePrice" :showCenter="false">
			<div class="pop-center">
				<text class="title">订单价格</text>
				<input type="text" class="nick-input" v-model="inputPrice" placeholder="请输入订单价格" placeholder-style="color:#999999" />
				<div class="comfirm-btn" @click="updatePrice">确认</div>
			</div>
		</my-popup>

	</view>
</template>

<script>
	import Top from '@/components/top-head/top-head'
	import uniNumberBox from "@/components/uni-number-box/uni-number-box.vue";
	import uniPagination from "@/components/uni-pagination/uni-pagination.vue";
	import myPopup from "@/components/my-popup/my-popup.vue";
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				type: 0, //0/影棚订单,1/设备订单
				typeList: ['影棚订单', '设备订单'],
				showChangeType: false,
				rent_type: 1, //1小时 2天  //
				startTime:null,  //开始时间
				endTime:null,  //结束时间
				complete: false,  //是否可以添加
				studioList: [],
				studioId: '', //选择影棚的id
				studioTitle: '请选择影棚', //显示的影棚名称
				showPrice: '',  //显示的价格
				inputPrice:'',  //输入的价格
				remark:'',  //备注内容
				totalTime:0,  //总时间
				equipParams:{
					page:1,
					page_size:1000,
					total:0
				},
				equipList:[], //设备列表
				selectEquip:[], //选择的设备
				selectEmployee:[], //选择的员工
				customerInfo:null, //选择的客户信息
				orderId:'', //修改的订单id
				orderInfo:'',  //订单信息
				btnTxt:'添加', //按钮文案
			}
		},
		components: {
			Top,
			myPopup,
			uniNumberBox,
			uniPagination
		},
		computed: {
			...mapGetters(['user_data']),
		},
		watch: {
			// startTime(to){
			// 	this.checkInfo();
			// },
			// endTime(to){
			// 	this.checkInfo();
			// },
			studioId(to){
				this.checkInfo();
			},
			showPrice(to){
				this.checkInfo();
			},
			selectEquip(to){
				this.checkInfo();
			},
			selectEmployee(to){
				this.checkInfo();
			},
			customerInfo(to){
				this.checkInfo();
			}
		},
		onShow(){
			let currentPage = this.util.currentPage();
			if (currentPage.data) {
				let customerInfo = currentPage.data.customerInfo;
				let staffList=currentPage.data.staffList;
				//获取选择客户信息
				if (customerInfo) {
					this.customerInfo=customerInfo;
					console.log('customerInfo---------',customerInfo);
				}
				//获取选择员工信息
				if(staffList){
					this.selectEmployee=staffList;
				}
			}
		},
		async onLoad(options) {
			//获取影棚列表
			await this.getStudioList();
			//获取设备列表
			await this.getEquipList();
			
			if(!this.util.isEmpty(options)){
				console.error('addOrder-------------',options);
				this.orderId=options.id;
				this.btnTxt='修改';
				//获取订单详情
				this.getOrderDetail();
			}else{
				//设置默认员工
				this.setEmployee();
			}
		},
		methods: {
			//获取影棚设备订单详情（租赁订单）
			getOrderDetail(){
				let params={order_id:this.orderId,is_server:2};
				this.util.getDSOrder(params).then(res=>{
					console.log('getOrderDetail-------------',res);
					this.orderInfo=res;
					this.type=0;
					if(res.has_studio==0){
						this.type=1;
					}
					this.rent_type=res.rent_type;
					if(this.rent_type==2){
						this.startTime=res.start_time.split(' ')[0];
						this.endTime=res.end_time.split(' ')[0];
						this.totalTime=this.util.dayCount(this.startTime,this.endTime);
					}else{
						this.startTime = res.start_time.split(' ')[1].substr(0, 5);
						this.endTime = this.util.addTime(res.end_time, 1).split(' ')[1].substr(0, 5);
						this.totalTime=this.util.hoursCount(this.startTime,this.endTime);
					}
					let equipList;
					//如果是影棚订单
					if(this.type==0){
						let studioDetail=res.studio_order.studio_detail;
						this.studioId=studioDetail.id;
						this.studioTitle=studioDetail.name;
						equipList=res.studio_order.equip_order_array;
					}else{
						equipList=res.equip_order;
					}
					equipList.forEach((item,index)=>{
						let obj={
							name:item.equip.custom_desc || item.equip.static.name,
							id:item.equip_id,
							count:item.order_count
						}
						this.selectEquip.push(obj);
					})
					this.selectEquip.forEach((item,index)=>{
						let flag = this.equipList.findIndex(e=>e.id==item.id);
						this.equipList[flag].selectNum=item.count;
					})
					res.employee.forEach((item,index)=>{
						let obj={
							id:item.id,
							name:item.nick,
							group_name:item.group_name,
							group_id:item.group_id
						}
						this.selectEmployee.push(obj);
					})
					this.showPrice=parseInt(res.price);
					this.remark=res.remark;
					this.customerInfo=res.customer;
					this.getCustomer(res.customer.id);
					console.error('this.selectEquip------',this.selectEquip);
				})
			},
			
			//获取客户分组信息
			getCustomer(userId){
				let params={
					customer_id:userId
				}
				this.util.getCustomer(params).then(res=>{
					console.error('getCustomer-----',res);
					// this.customerInfo.group_name=res.group_name;
					this.$set(this.customerInfo,'group_name',res.group_name);
				})
			},
			//检测内容信息是否已经填写完整
			checkInfo() {
				console.log('checkInfo-----',this.startTime,this.endTime,this.showPrice,this.selectEmployee,this.customerInfo);
				let info;
				let flag=false;
				if(this.startTime && this.endTime && this.showPrice && this.selectEmployee.length>0 && this.customerInfo){
					flag=true;
				}
				console.log('flag-----------',flag);
				//如果是影棚订单
				if(this.type==0){
					if(flag && this.studioId){
						this.complete=true;
						return;
					}
				}
				//设备订单
				else if(this.type==1){
					if(flag && this.selectEquip.length>0){
						this.complete=true;
						return;
					}
				}
				this.complete=false;
			},
			
			//,type,0/选择客户，1/选择员工
			selectUser(type){
				console.error('selectUser--------------',type);
				let url='/pages/order/clientList';
				let params={
					type:type,
				}
				if(this.orderId){
					if(type==0){
						params.param=JSON.stringify(this.customerInfo);
					}else if(type==1){
						params.param=JSON.stringify(this.selectEmployee);
					}
				}
				this.$Router.push({
					path: url,
					query: params
				});
			},
			//设置默认员工
			setEmployee(){
				//判断登录账号是否为主账号
				let user=this.user_data;
				let isAdmin=user.is_role==1?true:false;
				let obj={};
				if(isAdmin){
					obj.id=user.cid;
					obj.name=user.nick;
				}else{
					obj.id=user.cid;
					obj.name=user.cname;
				}
				this.selectEmployee.push(obj);
			},
			//选择器材方法
			changeCount(val,item){
				console.log('val-----',val,item);
				let index = this.equipList.findIndex(e=>e.id==item.id);
				let flag = this.selectEquip.findIndex(e => e.id==item.id);
				
				//如果数量>0
				if(val>0){
					let num=val;
					if(val==1 && flag==-1){
						let obj={name:item.custom_desc||itemm.name,id:item.id,count:num};
						this.selectEquip.push(obj);
					}else{
						this.selectEquip[flag].count=num;
					}
					
				}else{
					this.selectEquip.splice(flag,1);
					this.equipList[index].selectNum=0;
				}
				// this.checkNum();
				console.log('selectEquip-----',this.selectEquip);
			},
			
			//获取器材列表
			getEquipList(){
				console.log('getEquipList-----------');
				let params={
					page:this.equipParams.page,
					page_size:this.equipParams.page_size,
					uid:this.user_data.id
				}
				return new Promise((resolve,reject)=>{
					this.util.equipList(params).then(res=>{
						console.log('equipList---------',res);
						//根据选择的设备，为列表添加一个选择数量字段，selectNum
						res.rows.forEach((item,index)=>{
							item.selectNum=0;
						})
						// this.checkNum();
						this.equipList=res.rows;
						this.equipParams.total=res.total_count;
						resolve(true);
					})
				});
			},
			
			//addNum
			checkNum(){
				this.selectEquip.forEach((item,index)=>{
					this.equipList.forEach((item2,index2)=>{
						if(item.id==item2.id){
							item2.selectNum=item.num;
						}
					})
				})
			},
			
			//显示选择器材框
			toAddEquip(){
				console.log('toAddEquip------');
				this.$refs.popup.open();
			},
			//切换租赁时间模式方法
			changeRentType(e){
				let flag=e.target.value;
				console.log('changeRentType----',flag);
				this.rent_type=flag?2:1;
				console.log('rent_type',this.rent_type);
				//如果是按小时租赁，清空开始结束时间
				if(!flag){
					this.startTime=null;
					this.endTime=null;
					this.totalTime=0;
				}else{
					//如果选择是按天租赁,初始值为当天
					this.startTime=this.util.getDate();
					this.endTime=this.util.getDate();
					//计算天数
					this.totalTime=this.util.dayCount(this.startTime,this.endTime);
				}
				this.checkInfo();
			},
			//切换时间方法,type:0/开始时间，1/结束时间
			changeTime(e,type){
				let temp;
				if(type==0){
					this.startTime=e.target.value;
				}else if(type==1){
					this.endTime=e.target.value;
				}
				
				if(this.startTime && this.endTime && this.util.compareTime(this.startTime,this.endTime)){
					temp=this.startTime;
					this.startTime=this.endTime;
					this.endTime=temp;
				}
				
				console.log('-----------changeTime---------Time-------------',this.startTime,this.endTime);
				
				//计算总时间
				if(this.startTime && this.endTime){
					if(this.rent_type==2){
						this.totalTime=this.util.dayCount(this.startTime,this.endTime);
					}else{
						this.totalTime=this.util.hoursCount(this.startTime,this.endTime);
					}
				}
				console.error('totalTime-------------',this.totalTime);
				this.checkInfo();
				
			},
			//切换价格方法
			changePrice(e){
				this.inputPrice=this.showPrice;
			},
			
			//显示修改价格弹窗
			toEditPrice() {
				console.log('toEditPrice----');
				this.$refs.popupPrice.open();
			},
			//修改价格方法
			updatePrice() {
				this.showPrice=this.inputPrice;
				this.$refs.popupPrice.close();
			},
			//选择影棚方法
			changeStudio(e) {
				let info = this.studioList[e.target.value];
				this.studioId = info.id;
				this.studioTitle = info.name;
				console.log('this.studioId----', this.studioId);
			},
			//获取影棚列表方法
			getStudioList() {
				let params = {
					page: 1,
					page_size: 1000000,
					studio_uid: this.user_data.id, //店家id
				}
				return new Promise((resolve,reject)=>{
					this.util.studioList(params).then(res => {
						console.log('studioList------', res);
						this.studioList = res.rows;
						resolve(true);
					})
				})
				
			},
			//返回上一步
			back() {
				console.log('back----');
				this.util.back();
			},
			//修改订单类型
			changeType(e) {
				this.type = e.target.value;
				console.log('changeType------', this.type);
			},
			//编辑线下订单方法
			saveOrder() {
				if(!this.complete){
					let tip;
					let flag=true;
					if(!this.startTime || !this.endTime){
						tip="请选择时间";
						flag=false;
					}else if(!this.showPrice){
						tip="请输入价格";
						flag=false;
					}else if(this.selectEmployee.length==0){
						tip="请选择员工";
						flag=false;
					}else if(!customerInfo){
						tip="请选择客户";
						flag=false;
					}
					if(flag){
						if(this.type==0){
							if(!this.studioId){
								tip="请选择影棚"
							}
						}else if(this.type==1){
							if(this.selectEquip.length==0){
								tip="请选择器材";
							}
						}
					}
					
					this.util.showTip(tip);
					return;
				}
				let employee_array=[];
				this.selectEmployee.forEach((item,index)=>{
					employee_array.push(item.id);
				})
				let startTime,endTime;
				if(this.rent_type==1){
					startTime=`${this.util.getDate()} ${this.startTime}:00`;
					endTime=`${this.util.getDate()} ${this.endTime}:00`;
				}else{
					startTime=this.startTime;
					endTime=this.endTime;
				}
				let params = {
					type: Number(this.type)+1,
					rent_type: this.rent_type,
					start_time: startTime,
					end_time: endTime,
					price: this.showPrice,
					customer_id: this.customerInfo.id,
					employee_array: employee_array, //示例：[1,2,3] 员工ID数组
					studio_id: this.studioId, //影棚id，
					equip_array: this.selectEquip, //[{id:1,count:2},{id:1,count:2}]  设备数组 每一项必须有id和count
					remark:this.remark
				}
				let tip='添加';
				let funs="addOrder";
				if(this.orderId){
					tip="修改";
					funs="updaetOrder";
				}
				console.error('saveOrder----------------',params);
				this.util[funs](params).then(res=>{
					console.log('addOrder------',res);
					// this.util.operateBack(tip+'订单成功',true);
					this.uitl.tipAndBack(tip+'订单成功');
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.top {
			padding: 0px 20rpx;
		}

		.content {
			background:#fff;
			padding: 0px 48rpx;
			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding-top: 30rpx;
				.grayFont{
					color:#B3B3B3;
				}
				view{
					display:flex;
					align-items:center;
				}
				image{
					border-radius:44rpx;
				}
				&.itemLine {
					padding-bottom: 30rpx;
					border-bottom: 2rpx solid #F2F2F6;
					.column{
						display:flex;
						flex-direction: column;
						align-items:flex-start;
						&.right{
							align-items:flex-end;
						}
					}
					.time{
						&>text:first-child{
							font-size:22rpx;
							color:#999999;
						}
					}
					.timeCenter{
						padding:16rpx;
						background:#7842EB;
						color:#fff;
						border-radius:40rpx;
					}
					.user{
						width:56rpx;
						height:56rpx;
						line-height: 56rpx;
						text-align:center;
						background:#7842EB;
						border-radius: 40rpx;
						color:#fff;
					}
				}
			}

			.haveIcon {
				display: flex;
				align-items: center;

				.iconfont {
					margin-left: 16rpx;
				}
			}
		}
		
		.equip{
			padding:0px;
			&>view:first-child{
				padding:30rpx 48rpx 20rpx;
			}
			.equipList{
				display:block;
				padding:10rpx 10rpx 20rpx;
				.equipItem{
					display:inline-block;
					border:2rpx solid #D6D6D6;
					border-radius:40rpx;
					padding:12rpx;
					margin-right:10rpx;
					margin-bottom:16rpx;
					.title{
						padding-right:10rpx;
						border-right:2rpx solid #D6D6D6;
						margin-right:10rpx;
					}
				}
				.noData{
					display:flex;
					justify-content: center;
				}
			}
		}
		
		.remark{
			margin-bottom:30rpx;
			padding:24rpx;
		}
		
		textarea{
			width:100%;
		}
		
		.topWrap{
			margin-top:24rpx;
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
	}
	
	,.equipPopup{
		.title{
	        height: 100rpx;
	        line-height: 100rpx;
	        background-color: #f8f8f8;
	        color: #333333;
	        display: flex;
	        justify-content: space-between;
	        position: fixed;
	        top: 0;
	        width: 100%;
	        z-index: 10;
	        p{
	            padding: 0 25rpx;
	            display: inline-block;
	        }
	    }
	}
	
	.popup{
			padding: 20rpx 40rpx 0;
			// position: relative;
		}
		.equi-title{
			font-size: 32rpx;
			color: #333333;
			padding: 20rpx 0;
			width: 100%;
			text-align: center;
			background-color: #f8f8f8;
			
		}
		.equip-list-nodata{
			width: 100%;
			font-size: 28rpx;
			text-align: center;
			margin: 150rpx 0;
			color: #999999;
		}
		.equip-list{
			margin-top: 120rpx;
			margin-bottom: 250rpx;
		}
		.equip-item{
			display: flex;
			justify-content: space-between;
			align-content: space-between;
			padding: 20rpx;
			margin: 20rpx;
			box-shadow:0 0 20rpx #E4E4E4;
			height: 140rpx;
			
			.left,.right{
				display: flex;
				// flex-direction: column;
				flex-wrap: wrap;
				align-content: space-between;
				height: 100%;
			}
			.left{
				flex: 3;
				.equip-name{
					width: 90%;
					font-size: 32rpx;
					color: #333333;
					line-height: 40rpx;
					overflow:hidden; 
					text-overflow:ellipsis;
					display:-webkit-box; 
					-webkit-box-orient:vertical;
					-webkit-line-clamp:2; 
				}
				.equip-store{
					font-size: 24rpx;
					color: #999999;
				}
			}
			.right{
				flex:1;
				.price{
					color: #DB1522;
					font-size: 28rpx;
					width: 100%;
					text-align: center;
				} 
				.count {
					/deep/ .uni-numbox__minus,/deep/  .uni-numbox__plus{
						width: 50rpx;
						font-size: 36rpx;
					}
					/deep/ .uni-numbox{
						height:50rpx;
					}
					/deep/ .uni-numbox__value{
						width: 60rpx;
						font-size: 28rpx;
					}
				}
			}
		}
		
		.active{
			position: relative;
			background-color: #ffffff;
			.selected-sign {
				width: 0;
				height: 0;
				border: 20rpx solid;
				border-color: #651FFF transparent transparent #651FFF ;
				position: absolute;
				top:0;
				left: 0;
				content: '';
			}
		}
		.equip-footer{
			position: fixed;
			width: 100%;
			bottom: 10rpx;
			z-index: 5;
			border-top: 1rpx solid #f8f8f8;
			.uni-pagina{
				background-color: #fff;
				padding: 20rpx 0;
			}
		}
		.addIcon{
			width: 28px;
			height: 28px;
			line-height: 28px;
			text-align: center;
			background: #7842EB;
			border-radius: 20px;
			color: #fff;
			justify-content: center;
		}
</style>

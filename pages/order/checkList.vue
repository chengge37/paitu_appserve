<template>
	<view class="wrap">
		<top :showTitle="true" @back="back" :topTitle="topTxt+'核验单'"></top>
		
		<view class="agree" v-if="canEdit">
			<view class="top">
				<text class="title">
					<text class="titleLine"></text>
					租赁协议
				</text>
				<text class="plus defaultShadow" @tap="operateAgree(0)">+</text>
			</view>
			<view class="agreeList">
				<radio-group @change="changeAgree" :disabled="canEdit">
					<label class="agreeItem" v-for="(item, index) in agreeList" :key="index">
						<view>
							<radio :value="item.id" :checked="index === agreeIndex" />
							<text>《{{item.title}}》</text>
						</view>
						<text class="updateAgree iconfont iconarrow-right" @click.stop="operateAgree(1,item.id)"></text>
					</label>
				</radio-group>

			</view>
		</view>

		<view class="agree">
			<view class="top">
				<text class="title">
					<text class="titleLine"></text>
					协议内容
				</text>
			</view>
			<view class="agreeList">
				<textarea placeholder="可选择协议模板或手动输入协议内容.." :disabled="!canEdit" v-model="agreeContent"></textarea>
			</view>
		</view>

		<!-- 核验单图片内容信息 -->
		<view class="productList" v-for="(item,index) in checkList" :key="index">
			<view class="top">
				<text class="title">
					<text class="titleLine"></text>
					<text>{{item.name}}</text>
					<text v-if="item.check_sn" class="sn">(sn:{{item.check_sn}})</text>
				</text>
				<text class="plus defaultShadow" @tap="addItem(index)" v-if="canEdit">+</text>
			</view>
			<view class="itemList">

				<view class="item" v-for="(item2,index2) in item.imgInfo" :key="index2">
					<view class="img" @tap="changeImg(index,index2)" :class="{disabled:!canEdit}">
						<image v-if="item2.pic" :src="util.picExplode(item2.pic)" mode="aspectFit"></image>
						<i v-else class="iconfont iconjiahao1"></i>
					</view>
					<view class="content">
						<textarea placeholder="请输入影棚或器材情况" :disabled="!canEdit" v-model="item2.content"></textarea>
						<view class="operate">
							<!-- <text>修改</text> -->
							<text @tap="delItem(index,index2)" :class="{disabled:!canEdit}">删除</text>
						</view>
					</view>
				</view>

			</view>
		</view>

		<!-- 备注内容模块 -->
		<view class="agree">
			<view class="top">
				<text class="title">
					<text class="titleLine"></text>
					备注
				</text>
			</view>
			<view class="remark">
				<textarea v-model="remark" placeholder="请输入备注内容"></textarea>
			</view>
		</view>

		<view class="tip">
			<icon type="warn" size="14"></icon>
			<text>保存即发送给客户，确认后不可修改，没确认可修改</text>
		</view>

		<view class="operate">
			<view class="baseButton" @tap="save" :class="{gray:!canEdit}">{{btnTxt}}</view>
		</view>


	</view>
</template>

<script>
	import Top from '@/components/top-head/top-head'
	import {
		uploadImg
	} from "@/common/utils/uploadImg.js"
	export default {
		data() {
			return {
				agreeList: [], //协议模板列表
				agreeIndex: 0,
				remark: '', //备注内容
				imageUrl: 'https://pic.paitume.com/3-1574149405220.jpg',
				checkList: [], //核验单列表信息
				hasStudio: false, //是否有影棚
				hasEquipment: false, //是否有设备
				agreeContent: '', //协议模板内容
				orderId: '', //订单id
				checkId:'', //核验单id，修改时要用
				type:0,   //添加，1/修改,2/查看详情
				canEdit:true, //是否能修改（填写或者修改）
				btnTxt:'上传', //按钮文案
				topTxt:'上传', //头部文案
			}
		},
		computed: {

		},
		components: {
			Top
		},
		onShow() {
			if(this.util.prevPageUpdate()){
				//重新加载数据
				this.getAgreeList();
			}
		},
		
		onLoad(options) {
			console.log('checkList----------options----',options);
			if(!this.util.isEmpty(options)){
				this.orderId=options.id;
				//type:0,添加，1/修改,2/查看详情
				this.type=options.type;
				if(this.type!=0){
					this.btnTxt='修改';
					this.topTxt='修改';
					//获取核验单信息
					this.getCheck();
					if(this.type==2){
						this.topTxt='查看';
						console.log('onLoad-----------不能修改--');
						this.canEdit=false;
					}
				}
				
			}
			
			//获取协议模板列表
			this.getAgreeList();
			
			//获取订单详情
			this.getOrderDetail();
			
		},
		methods: {
			//获取核验单信息
			getCheck(){
				this.util.getCheck(this.orderId).then(res=>{
					console.log('serveGetCheck-------------',res);
					this.remark=res.remark;
					this.checkId=res.id;
					// this.checkList = this.util.changeArr(res.detail_array);
					let studioList=res.detail_array.filter(item=>item.type==1);
					console.log('studioList-----------------',studioList);
					if(studioList.length>0){
						let obj={
							id: studioList[0].relation_id,
							check_sn:studioList[0].check_sn,
							name: studioList[0].name,
							type: studioList[0].type,
							imgInfo:[]
						}
						studioList.forEach((item,index)=>{
							obj.imgInfo.push({pic:item.pic,content:item.content});
						})
						this.checkList.push(obj);
					}
					
					let equipList=res.detail_array.filter(item=>item.type==2);
					if(equipList.length>0){
						let tempList=[];
						equipList.forEach((item,index)=>{
							let flag = tempList.findIndex(item1 => {
								return item1.check_sn == item.check_sn;
							});
							if (flag == "-1") {
								let obj={
									id: item.relation_id,
									check_sn:item.check_sn,
									name: item.name,
									type: item.type,
									imgInfo:[{pic:item.pic,content:item.content}]
								}
								tempList.push(obj);
							} else {
								tempList[flag].imgInfo.push({pic:item.pic,content:item.content});
							}
						})
						console.error('tempList--------------',tempList);
						this.checkList=this.checkList.concat(tempList);
					}
					
					
					
					console.log("checkList+++++++++++++",this.checkList);
				})
			},
			//返回方法
			back(){
				this.util.back();
			},
			//添加或修改核验单
			save() {
				if(!this.canEdit) return;
				let params = {
					order_id: this.orderId, //订单id
					content: this.agreeContent, //协议模板内容
					remark: this.remark, //备注内容
				}
				//如果有影棚
				if (this.hasStudio) {
					params.studio_check = {
						studio_id: this.checkList[0].id,
						detail_array: this.checkList[0].imgInfo
					}
				}
				console.log('this.checkList--------',this.checkList);
				if(this.hasEquipment){
					let list=this.util.deepcopy(this.checkList);
					if(this.hasStudio){
						list=this.util.deepcopy(list.splice(1));
					}else{
						list =this.util.deepcopy(list);
					}
					params.equip_check_array = [];
					list.forEach((item, index) => {
						item.imgInfo.forEach((subItem, index2) => {
							let obj = {
								equip_id: item.id,
								check_sn:item.check_sn,
								pic: subItem.pic,
								content: subItem.content
							}
							params.equip_check_array.push(obj);
						})

					})
				}
				
				let tip='添加';
				let funs='addCheck';
				if(this.type==1){
					tip="修改";
					funs='editCheck';
					params.order_check_id=this.checkId;
				}
				
				console.log('addCheck----------params-----------', params);
				this.util[funs](params).then(res => {
					this.util.operateBack(tip+'成功！',true);
				})

				
			},
			//添加子项方法
			addItem(index) {
				let obj = {
					pic: '',
					content: ''
				}
				this.checkList[index].imgInfo.push(obj);
			},
			//删除选项
			delItem(index, index2) {
				if (this.checkList[index].imgInfo.length <= 1) {
					this.util.showTip('每个影棚或设备至少需要1个描述，不能删除!');
					return;
				}
				this.util.confirm().then(res => {
					if (res) {
						this.checkList[index].imgInfo.splice(index2, 1);
					}
				}).catch(err => {});

			},
			//获取订单信息
			getOrderDetail() {
				let params={order_id:this.orderId,is_server:2};
				this.util.getDSOrder(params).then(res => {
					console.log('getOrderDetail-----', res);
					let equipList=[];
					//判断订单类型
					if (res.has_studio == 1) {
						this.hasStudio = true;
						if(res.has_equipment){
							this.hasEquipment=true;
						}
						equipList = res.studio_order.equip_order_array;
						if(!res.check){
							let studioInfo = res.studio_order.studio_detail;
							let obj = {
								id: studioInfo.id,
								name: studioInfo.name,
								imgInfo: [{
									pic: '',
									content: ''
								}]
							}
							this.checkList.push(obj);
						}
						
					}else{
						this.hasEquipment = true;
						equipList = res.equip_order;
					}
					
					
					console.log('equipList---------',equipList);
					
					if(!res.check){
						equipList.forEach((item, index) => {
							for(let i=0;i<item.order_count;i++){
								let obj = {
									id: item.equip.id,
									name: item.equip.custom_desc,
									check_sn:item.equip.sn_array[i]?item.equip.sn_array[i].sn:'',
									imgInfo: [{
										pic: '',
										content: '',
									}]
								}
								this.checkList.push(obj);
							}
						})
					}

					console.log('checkList------', this.checkList);

				})
			},
			//上传图片
			changeImg(index, index2) {
				uploadImg().then(res => {
					console.log('checkList----changeImg----------',res);
					this.checkList[index].imgInfo[index2].pic = res;
				})
			},
			//跳转到添加修改协议页面,type,0/新增，1/想修改
			operateAgree(type = 0, id) {
				let url = '/pages/order/operateAgree';
				let params = {
					type: type,
				}
				if (type == 1) {
					params.id = id;
				}
				this.$Router.push({
					path: url,
					query: params
				});
			},
			//获取协议模板列表
			getAgreeList() {
				this.util.getAgreeList().then(res => {
					console.log("getAgreeList-----", res);
					this.agreeList = res.rows;
					//默认选择第一个的协议内容
					if(!this.util.isEmpty(res.rows)){
						this.agreeContent=res.rows[0].content;
					}
					
				})
			},
			//选择协议方法
			changeAgree(e) {
				console.log('changeAgree------', e);
				this.agreeId = e.target.value;
				let index = this.agreeList.findIndex(res => res.id == e.target.value);
				this.agreeContent = this.agreeList[index].content;
				console.log('agreeContent--------------', this.agreeContent);
			},
		},

	}
</script>

<style lang="scss">
	.wrap {
		padding: 24rpx;

		//协议样式
		.agree,
		.productList {
			background: #fff;
			padding: 40rpx 0rpx;

			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0rpx 24rpx 20rpx;
				border-bottom: 2rpx solid #F2F3F6;
				margin-bottom: 24rpx;

				.title {
					font-size: 28rpx;
					display: flex;
					align-items: center;
					font-weight: 600;

					.titleLine {
						display: inline-block;
						width: 4rpx;
						height: 24rpx;
						background: #7842EB;
						border-radius: 4rpx;
						margin-right: 8rpx;
					}
					.sn{
						font-size:24rpx;
						color:#999;
						margin-left:20rpx;
					}
				}

				.plus {
					color: #7842EB;
					font-weight: 600;
					border: 4rpx solid #7842EB;
					border-radius: 32rpx;
					font-size: 36rpx;
					width: 42rpx;
					height: 42rpx;
					text-align: center;
					line-height: 30rpx;
				}
			}
		}

		.agreeList {
			padding: 0px 24rpx;

			.agreeItem {
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #666666;
				padding-bottom: 24rpx;
				margin-bottom: 24rpx;
				border-bottom: 2rpx solid #F2F3F6;
				// justify-content: space-between;
				.updateAgree{
					flex:1;
					text-align:right;
				}
				view {
					display: flex;
					align-items: center;
				}
			}
		}

		.productList {
			margin: 24rpx 0rpx;

			.itemList {
				display: flex;
				flex-direction: column;
				padding: 0px 24rpx;

				.item {
					width: 100%;
					display: flex;
					margin-bottom: 24rpx;

					&:last-child {
						margin-bottom: auto;
					}
				}

				.img {
					width: 130rpx;
					height: 130rpx;
					border: 2rpx solid #F2F2F6;
					margin-right: 24rpx;
					text-align: center;
					line-height: 130rpx;

					image {
						width: 126rpx;
						height: 126rpx;
					}
				}

				textarea {
					border: 1px solid #F2F2F6;
					margin-bottom: 8rpx;
				}

				.content {
					display: flex;
					flex: 1;
					flex-direction: column;
					align-items: flex-end;

					.operate {
						text {
							font-size: 22rpx;
							color: #999;
							margin-left: 20rpx;
						}
					}
				}
			}
		}
	}

	textarea {
		width: 100%;
		background: #EFF0F4;
		box-sizing: border-box;
		padding: 20rpx;
	}

	.remark {
		padding: 0rpx 24rpx;
	}

	.tip {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 24rpx 0rpx;
		color: #999999;
		
		text {
			margin-left: 10rpx;
		}
	}
</style>

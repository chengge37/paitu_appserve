<template>
  <view class="wrap">
    <!-- <Top bgColor="#fff"></Top> -->
	<view class="head">
	<view class="head-left" @tap="back">
	  <text class="iconfont iconarrow-lift"></text>
	  <text>返回</text>
	</view>
	</view>
	
	<!-- 添加客户，添加客户分组模块 -->
	<view class="customer" @tap="toUserGroup" v-if="type && type==0">
		<text class="btn" @click.stop="toAddCustomer">添加客户</text>
		<text class="btn">添加分组</text>
	</view>
	
	<!-- 添加员工，添加员工分组模块 -->
	<view class="customer" @tap="toEmployeeGroup" v-if="type && type==1">
		<text class="btn" @click.stop="toAddEmployee">添加员工</text>
		<text class="btn">添加员工分组</text>
	</view>
	
	
	<!-- 添加/修改客户分组弹窗-->
	<my-popup ref="userGroup" title="客户分组名称" type="center" :value="userGroupName" @update="editUserGroup">
	</my-popup>
	
	<!-- 添加/修改员工分组弹窗-->
	<my-popup ref="employeeGroup" title="员工分组名称" type="center" :value="employeeGroupName" @update="editEmployeeGroup">
	</my-popup>
	
    <Tree class="tree" @select="select" v-if="type && type==0" type="0" :params="param"></Tree>
	<Tree class="tree" @select="selectStaff" v-if="type && type==1" type="1" :params="param"></Tree>
  </view>
</template>

<script>
import Top from '@/components/top-head/top-head'
import Tree from '@/components/tree/tree'
import myPopup from "@/components/my-popup/my-popup.vue";
  export default {
    data(){
      return{
		 selectInfo:null,  //选择的用户信息
		 userGroupName:'',  //客户分组名称
		 employeeGroupName:'',  //员工分组名称
		 staffList:null, //选择的员工列表信息
		 type:null,  //0:选择客户 1/选择员工
		 param:null,
      }
    },
    components:{
      Top,
      Tree,myPopup
    },
	onShow(){
		if(this.util.prevPageUpdate()){
			this.loadData();
		}
	},
	onLoad(options){
		console.log('clienList---------',options);
		this.type=options.type; 
		if(options.param){
			this.param=JSON.parse(options.param);
		}
		console.error('onLoad-----',this.param);
		
	},
    methods:{
		loadData(){
			let type=this.type;
			this.type=null;
			this.$nextTick(()=>{
				this.type=type;
			})
		},
		//跳转到添加客户页面
		toAddCustomer(){
			this.$Router.push('/pages/client/addClient');
		},
		//跳转到添加员工页面
		toAddEmployee(){
			this.$Router.push('/pages/employee/index');
		},
		//返回方法
		back(){
			var prevPage = this.util.prevPage(); //上一个页面
			let params={};
			if(this.type==0){
				params.customerInfo=this.selectInfo;
			}else if(this.type==1){
				params.staffList=this.staffList;
			}
			prevPage.setData(params);
			
			this.util.back();
		},
		//弹窗客户分组
		toUserGroup(){
			this.$refs.userGroup.open();
		},
		//弹窗员工分组
		toEmployeeGroup(){
			this.$refs.employeeGroup.open();
		},
		//编辑客户分组信息
		editUserGroup(val){
			console.log('editUserGroup-------------',val);
			this.userGroupName=val;
			let params={
				group_array:[{group_name:this.userGroupName}]
			}
			this.util.editCustomerGroup(params).then(res=>{
				this.util.showTip('添加分组成功！');
				this.$refs.userGroup.close();
				//重新加载数据
				this.loadData();
			})
		},
		
		//添加或修改员工分组名称方法
		editEmployeeGroup(val){
			this.employeeGroupName=val;
			let params={
				group_name:this.employeeGroupName
			}
			this.util.addEmployeeGroup(params).then(res=>{
				this.util.showTip('添加员工分组成功！');
				this.$refs.employeeGroup.close();
				//重新加载数据
				this.loadData();
			})
		},
		
		//选择完客户方法
		select(val){
			this.selectInfo=val;
			console.log('selectCustomer------',val);
		},
		//选择完员工方法
		selectStaff(list){
			this.staffList=list;
			console.log('selectStaff-------',list);
		}
		
	}
  }
</script>

<style lang="scss">
page{
  height: 100%;
}
.wrap{
  height: 100%;
  padding: 0 34rpx;
  background: #fff;
  color: #D6CCEB;
  .tree{
    margin-top: 86rpx;
  }
}


.head{
  height: 88rpx;
  color: #333;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  margin-bottom: 20rpx;
  .head-left{
    display: flex;
    align-items: center;
    span:first-child{
      font-size: 40rpx;
    }
  }
}

.customer{
	display:flex;
	justify-content: center;
	.btn{
		padding:10rpx 20rpx;
		background:#7842EB;
		color:#fff;
		margin-right:20rpx;
	}
}
.uni-popup{
	color:#333;
}
</style>
<template>
	<view class="wrap">
		<!-- 选择客户 -->
		<view v-if="loadComplete && type==0">
			<view class="tree" v-for="(item,index) in customerList" :key="index">
				<view class="first-category">
					<view @click="toggleGroup(item)">
						<text class="iconfont iconjiantou" v-show="item.children.length>0" :class="{'arrow-rotate':item.checked}"></text>
						<text>{{item.group_name}}</text>
					</view>
					<view class="item-right" v-if="item.checked">
					  <text @tap="toUserGroup(item)">修改</text>
					  <text @tap="delUserGroup(item)">删除</text>
					</view>
				</view>
				<view class="second-group" :class="{'toggle-group':item.checked}">
					<view class="second-row-wrap" v-for="(item2,index2) in item.children" :key="index2">
						<view class="null-dom"></view>
						<view class="row-content">
							<text class="iconfont iconjiantou"></text>
							<text :class="{active:item2.checked}" @click="selectUser(item2)">{{item2.name}}</text>
							
							<view class="item-right" v-if="item2.checked">
							  <text @tap="updateUser(item2)">修改</text>
							  <text @tap="delUser(item2)">删除</text>
							</view>
							
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 修改客户分组弹窗-->
		<my-popup ref="userGroup" title="客户分组名称" type="center" :value="userGroupName" @update="editUserGroup">
		</my-popup>
		
		<!-- 修改员工分组弹窗-->
		<my-popup ref="employeeGroup" title="员工分组名称" type="center" :value="employeeGroupName" @update="editEmployeeGroup">
		</my-popup>

		<!-- 选择员工 -->
		<view v-if="loadComplete && type==1">
			<view class="tree" v-for="(item,index) in staffList" :key="index">
				<view class="first-category" @click="toggleGroup(item)">
					<view>
						<text class="iconfont iconjiantou" v-show="item.children.length>0" :class="{'arrow-rotate':item.checked}"></text>
						<text>{{item.group_name}}</text>
					</view>
					<view class="item-right" v-if="item.checked">
					  <text @tap="toEmployeeGroup(item)">修改</text>
					  <text @tap="delEmployeeGroup(item)">删除</text>
					</view>
				</view>
				<view class="second-group" :class="{'toggle-group':item.checked}">
					<view class="second-row-wrap" v-for="(item2,index2) in item.children" :key="index2">
						<view class="null-dom"></view>
						<view class="row-content">
							<text class="iconfont iconjiantou"></text>
							<text :class="{active:item2.checked}" @click="selectStaff(item2)">{{item2.nick}}</text>
							
							<view class="item-right" v-if="item2.checked">
							  <text @tap="updateEmployee(item2)">修改</text>
							  <text @tap="delEmployee(item2)">删除</text>
							</view>
							
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {mapGetters} from 'vuex'
	import myPopup from "@/components/my-popup/my-popup.vue";
	export default {
		props: {
			//type,0/选择客户（一般只能选择一个）,1/选择员工（执行人）,可多选
			type:{
				type:String,
				default:'0',
			},
			//传参，如果是是客户，就是对象，如果是员工，就是数组
			params:{
				type:[Object,Array],
				default:null,
			},
		},
		data() {
			return {
				groupList: [], //客户分组列表
				userGroupName:'',  //客户分组名称
				userGroupId:'', //选中的客户分组id
				employeeGroupName:'',  //员工分组名称
				employeeGroupId:'', //选中的员工分组id
				customerList: [], //客户列表信息
				staffGroupList: [], //员工分组列表
				staffList: [], //员工列表信息
				loadComplete: false, //数据是否加载完
			}
		},
		computed:{
			...mapGetters(['user_data']),
		},
		mounted() {
			console.error('tree---------------',this.params);
			this.loadData();
		},
		
		methods: {
			//弹窗客户分组
			toUserGroup(item){
				this.userGroupId=item.group_id;
				this.userGroupName=item.group_name;
				this.$refs.userGroup.open();
			},
			//弹窗员工分组
			toEmployeeGroup(item){
				this.employeeGroupId=item.group_id;
				this.employeeGroupName=item.group_name;
				this.$refs.employeeGroup.open();
			},
			//修改客户分组方法 
			editUserGroup(val){
				console.log('editUserGroup-------------',val);
				this.userGroupName=val;
				let obj={group_id:this.userGroupId,group_name:this.userGroupName};
				let params={
					group_array:[obj]
				}
				this.util.editCustomerGroup(params).then(res=>{
					this.util.showTip('修改分组成功！');
					this.$refs.userGroup.close();
					//重新加载数据
					this.reloadData();
				})
			},
			
			//修改员工分组方法
			editEmployeeGroup(val){
				console.log('editEmployeeGroup-------------',val);
				this.employeeGroupName=val;
				let obj={group_id:this.employeeGroupId,group_name:this.employeeGroupName};
				let params={
					group_array:[obj]
				}
				console.log('params-------------------',params);
				this.util.updateEmployeeGroup(params).then(res=>{
					this.util.showTip('修改分组成功！');
					this.$refs.employeeGroup.close();
					//重新加载数据
					this.reloadData();
				})
			},
			
			//删除客户分组方法
			delUserGroup(item){
				console.log('delUserGroup---------',item);
				this.util.confirm().then(res=>{
					if(res){
						this.util.delCustomerGroup(item.group_id).then(res=>{
							this.util.showTip('删除分组成功！');
							//重新加载数据
							this.reloadData();
						})
					}
				})
			},
			
			//删除员工分组方法
			delEmployeeGroup(item){
				console.log('delEmployeeGroup---------',item);
				this.util.confirm().then(res=>{
					if(res){
						this.util.delEmployeeGroup(item.group_id).then(res=>{
							this.util.showTip('删除分组成功！');
							//重新加载数据
							this.reloadData();
						})
					}
				})
			},
			
			loadData(){
				if (this.type == 0) {
					//获取客户所有分组和所有客户
					this.getCustomerGroup();
				} else {
					//获取员工所有分组和所有员工
					this.getStaffGroup();
				}
			},
			//重新加载数据
			reloadData(){
				this.loadData();
				setTimeout(()=>{
					this.reloadView();
				},1000);
			},
			//修改客户
			updateUser(item){
				console.log('updateUser----------',item);
				let url="/pages/client/addClient";
				this.$Router.push({
					path: url,
					query: {id:item.id}
				});
			},
			
			//删除用户
			delUser(item){
				console.log('delUser--------',item);
				this.util.confirm().then(res=>{
					if(res){
						this.util.delCustomer(item.id).then(res=>{
							this.util.showTip('删除用户成功！');
							//重新加载数据
							this.reloadData();
						})
					}
				})
			},
			
			//修改员工
			updateEmployee(item){
				console.log('updateEmployee----------',item);
				let url="/pages/employee/index";
				this.$Router.push({
					path: url,
					query: {id:item.id}
				});
			},
			
			//删除用户
			delEmployee(item){
				console.log('delEmployee--------',item);
				this.util.confirm().then(res=>{
					if(res){
						this.util.delEmployee(item.id).then(res=>{
							this.util.showTip('删除员工成功！');
							//重新加载数据
							this.reloadData();
						})
					}
				})
			},
			
			//获取员工所有分组
			getStaffGroup() {
				this.util.employeeGroup().then(res => {
					console.log('getStaffGroup', res);
					this.staffGroupList = res;
					res.forEach((item, index) => {
						item.checked = true;
						item.children = [];
					})
					this.staffList = res;
					this.getStaffList();
				})
			},
			
			//获取所有员工信息
			getStaffList() {
				let promiseList = [];
				this.staffList.forEach((item, index) => {
					promiseList.push(this.util.employeeList(item.group_id));
				})
				Promise.all(promiseList).then(res => {
					console.log('Promise---all---------加载完', res);
					let tempList = [];
					res.forEach((item, index) => {
						if (item.rows.length > 0) {
							item.rows.forEach((item2, index2) => {
								tempList.push(item2);
							})
						}
					})
					console.error('getStaffList------------',tempList,this.staffList);
					console.error('params------------',this.params);
					tempList.forEach((item, index) => {
						this.staffList.forEach((item2, index2) => {
							if (item.group_id == item2.group_id) {
								//默认添加当前选中当前用户,如果是管理员,如果是新增，默认添加一个本账号的的选项
								if(this.params){
									this.params.forEach((obj,index3)=>{
										if(obj.id==item.id){
											item.checked=true;
										}
									})
								}else{
									if(this.user_data.is_role==1){
										if(item.is_role==1){
											item.checked=true;
										}
									}else{
										if(this.user_data.id==item.id){
											item.checked=true;
										}
									}
								}
								
								item2.children.push(item);
							}
						})
					})
					
					
					this.loadComplete = true;
					console.log('staffList', this.staffList);
				})
			},
			
			//获取客户所有分组
			getCustomerGroup() {
				this.util.getCustomerGroup().then(res => {
					console.log('getCustomerGroup-----', res);
					this.groupList = res;
					res.forEach((item, index) => {
						item.checked = true;
						item.children = [];
					})
					this.customerList = res;
					this.getCustomerList();
				})
			},
			
			//获取所有客户信息
			getCustomerList() {
				let promiseList = [];
				this.customerList.forEach((item, index) => {
					promiseList.push(this.util.getCustomerSimple(item.group_id));
				})
				Promise.all(promiseList).then(res => {
					console.log('Promise---all---------加载完', res);
					let tempList = [];
					res.forEach((item, index) => {
						if (item.length > 0) {
							item.forEach((item2, index2) => {
								tempList.push(item2);
							})
						}
					})
					tempList.forEach((item, index) => {
						this.customerList.forEach((item2, index2) => {
							if (item.group_id == item2.group_id) {
								if(this.params){
									console.log('getCustomerList--------',this.params);
									if(this.params.id==item.id){
										item.checked=true;
									}
								}
								let obj = { ...item,
									group_name: item2.group_name
								};
								item2.children.push(obj);
							}
						})
					})
					this.loadComplete = true;
					console.log('customerList', this.customerList);
				})
			},

			//选择客户
			selectUser(item2) {
				this.customerList.forEach((item, index) => {
					if (item.children.length > 0) {
						item.children.forEach((obj, index2) => {
							obj.checked = false;
						})
					}
				})
				item2.checked = true
				this.reloadView();
				this.$emit('select', item2);
				console.log('this.customerList---', this.customerList);
			},

			//选择员工方法
			selectStaff(item2) {
				console.log('selectStaff-------', item2);
				item2.checked = !item2.checked;
				let list=[];
				this.staffList.forEach((item, index) => {
					if (item.children.length > 0) {
						item.children.forEach((obj, index2) => {
							if(obj.checked){
								let o={
									id:obj.id,
									group_id:obj.group_id,
									group_name:obj.group_name,
									name:obj.nick,
									pic:obj.pic
								}
								list.push(o);
							}
						})
					}
				})
				this.reloadView();
				this.$emit('select', list);
				console.log('list---------------------', list);
			},

			//显示下拉菜单方法
			toggleGroup(item) {
				item.checked = !item.checked;
				this.reloadView();
			},
			
			//重新更新视图
			reloadView() {
				this.loadComplete = false;
				this.$nextTick(() => {
					this.loadComplete = true;
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		.tree {
			padding: 0 26rpx;

			.first-category {
				display: flex;
				align-items: center;
				justify-content: space-between;
				text:first-child {
					margin-right: 12rpx;
					transform: rotate(90deg);
				}

				text:nth-child(2) {
					margin-right: 10rpx;
				}

				.arrow-rotate {
					transform: rotate(-90deg) !important;
				}
			}

			.second-group {
				display: none;
				margin-left: 58rpx;
				// background: pink;
				border-left: 2px dashed #D6CCEB;

				.second-row-wrap {
					height: 70rpx;
					display: flex;
					align-items: center;

					.null-dom {
						width: 114rpx;
						height: 100%;
						border-bottom: 2px dashed #D6CCEB;
					}

					.row-content {
						flex: 1;
						height: 100%;
						display: flex;
						align-items: center;
						padding-left: 8rpx;
						transform: translateY(50%);

						&>text:first-child {
							margin-right: 10rpx;
						}

						.active {
							color: #7842EB;
						}

						.item-right {
							margin-left: auto;
							display: flex;

							text {
								color: #7842EB;
							}

							text:nth-child(2) {
								margin: 0 10rpx;
							}
						}
					}
				}
			}

			.toggle-group {
				display: block;
			}
		}

		.tree+.tree {
			margin-top: 50rpx;
		}
	}
</style>

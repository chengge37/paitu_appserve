<template>
	<view class="wrap">
		<topHead :showComplete="true" :hasComplete="complete" @complete="save" @back="back"></topHead>
		
		<div class="grey-title">员工信息</div>
		<div class="card card-one">
			<div class="row mustOption" @tap="toEdit('mobile')">
				<span>手机号码</span>
				<span :class="{blackfont:true}">{{form.mobile||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" :class="{mustOption:!editId}" @tap="toEdit('pwd')">
				<span>员工密码</span>
				<!-- <span :class="{blackfont:true}">{{form.pwd||inputTip}}</span> -->
				<input  type="password" :placeholder="editId?pwdTip:inputTip" disabled v-model="form.pwd">
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row mustOption" @tap="toEdit('nick')">
				<span>员工昵称</span>
				<span :class="{blackfont:true}">{{form.nick||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<picker mode="date" :value="form.birthday" @change="changeTime">
				<div class="row">
					<span>出生日期</span>
					<span :class="{blackfont:true}">{{form.birthday||selectTip}}</span>
					<span class="iconfont iconarrow-right"></span>
				</div>
			</picker>
			<div class="row mustOption" @tap="toEdit('email')">
				<span>员工邮箱</span>
				<span :class="{blackfont:true}">{{form.email||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<picker @change="changeGroup" :value="form.group_id" :range="groupList" range-key="group_name">
				<div class="row mustOption">
					<span>所在部门</span>
					<span :class="{blackfont:true}">{{groupTitle||selectTip}}</span>
					<span class="iconfont iconarrow-right"></span>
				</div>
			</picker>
			<div class="row" @tap="toEdit('position')">
				<span>所在职位</span>
				<span :class="{blackfont:true}">{{form.position||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" @tap="toEdit('native_place')">
				<span>户籍地</span>
				<span :class="{blackfont:true}">{{form.native_place||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" @tap="toEdit('address')">
				<span>现在住址</span>
				<span :class="{blackfont:true}">{{form.address||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row avatar" @tap="changeImg">
				<span>员工头像</span>
				 <image v-if="form.avatar" :src="util.picExplode(form.avatar)" mode="aspectFit"></image>
				 <image v-else :src="defaultAvatar" mode="aspectFit"></image>
				<span class="iconfont iconarrow-right"></span>
			</div>
		</div>
		
		
		<view class="baseButton" :class="{'gray':!complete}" @tap="save">{{btnTitle}}</view>
		
		<my-popup ref="mobile" title="联系电话" type="center" :value="form.mobile" @update="updateMobile">
		</my-popup>
		
		<my-popup ref="pwd" title="员工密码" inputType="password" type="center" :value="form.pwd" @update="updatePwd">
		</my-popup>
		
		<my-popup ref="nick" title="员工昵称" type="center" :value="form.nick" @update="updateNick">
		</my-popup>
		
		<my-popup ref="email" title="员工邮箱" type="center" :value="form.email" @update="updateEmail">
		</my-popup>
		
		<my-popup ref="age" title="员工年龄" type="center" :value="form.age" @update="updateAge">
		</my-popup>
		
		<my-popup ref="position" title="所在职位" type="center" :value="form.position" @update="updatePosition">
		</my-popup>
		
		<my-popup ref="native_place" title="户籍地" type="center" :value="form.native_place" @update="updateNativePlace">
		</my-popup>
		
		<my-popup ref="address" title="现在住址" type="center" :value="form.address" @update="updateAddress">
		</my-popup>
		
		
	</view>
</template>

<script>
	import topHead from '../../components/top-head/top-head'
	import myPopup from "@/components/my-popup/my-popup.vue";
	import {uploadImg} from "@/common/utils/uploadImg.js"
	export default {
		data() {
			return {
				count: 0,
				form: {
					mobile:'',
					pwd:'',
					nick:'',
					birthday:'',
					email:'',
					age:'',
					group_id:'',
					position:'',
					native_place:'',
					address:'',
					avatar:'',
				},
				complete:false,
				inputTip:'请输入',
				pwdTip:'不填即不修改',
				selectTip:'请选择',
				groupTitle:'', //客户分组显示标题
				groupList:[], //分组列表
				defaultAvatar:'',
				editId:'', //需要编辑的客户id,或者删除
				btnTitle:'添加',
			}
		},
		watch:{
			"form.mobile":function(to){
				this.checkInfo();
			},
			"form.pwd":function(to){
				this.checkInfo();
			},
			"form.nick":function(to){
				this.checkInfo();
			},
			"form.email":function(to){
				this.checkInfo();
			},
			"form.group_id":function(to){
				this.checkInfo();
			}
		},
		components: {
			topHead,
			myPopup
		},
		onShow(){
			
		},
		onLoad(options){
			console.error('options------',options);
			this.defaultAvatar=this.$qiniu+this.config.defaultAvatar;
			//获取员工分组列表
			this.employeeGroup().then(res=>{
				if(res){
					if(!this.util.isEmpty(options)){
						this.editId=options.id; 
						this.getEmployee(this.editId);
						this.btnTitle='修改';
					}
				}
			})
		},
		methods: {
			//切换时间方法,type:0/开始时间，1/结束时间
			changeTime(e){
				this.form.birthday=e.target.value;
			},
			//根据id获取员工
			getEmployee(id){
				let params={id:id};
				this.util.allEmployee(params).then(res=>{
					console.log('getEmployee-------------',res);
					this.form=res;
					this.form.pwd=null;
					this.complete=true;
					if(this.util.isEmptyDate(res.birthday)){
						this.form.birthday='';
					}
					this.groupList.forEach((item,index)=>{
						if(res.group_id==item.group_id){
							this.groupTitle=item.group_name;
						}
					})
				})
			},
			
			//检测是否能添加员工
			checkInfo(){
				if(this.form.mobile && this.form.nick && this.form.email && this.form.group_id){
					this.complete=true;
					if(!this.editId && !this.form.pwd){
						this.complete=false;
					}
				}else{
					this.complete=false;
				}
			},
			//上传图片
			changeImg() {
				uploadImg().then(res => {
					this.form.avatar = res;
				})
			},
			//切换员工分组方法
			changeGroup(e){
				let info=this.groupList[e.target.value];
				this.form.group_id=info.group_id;
				this.groupTitle=info.group_name;
				console.log('group_id',this.form.group_id);
			},
			//获取员工分组列表
			employeeGroup(){
				return new Promise((resolve,reject)=>{
					this.util.employeeGroup().then(res=>{
						this.groupList=res;
						resolve(true);
					})
				})
				
			},
			//修改手机号码
			updateMobile(val){
				console.log('updateMobile-----------',val);
				this.operate('mobile',val);
			},
			updatePwd(val){
				this.operate('pwd',val);
			},
			updateNick(val){
				this.operate('nick',val);
			},
			updateEmail(val){
				this.operate('email',val);
			},
			updateAge(val){
				this.operate('age',val);
			},
			updatePosition(val){
				this.operate('position',val);
			},
			updateNativePlace(val){
				this.operate('native_place',val);
			},
			updateAddress(val){
				this.operate('address',val);
			},
			
			operate(str,val){
				this.form[str]=val;
				this.$refs[str].close();
			},
			//弹窗
			toEdit(str){
				console.log('toEdit----',str,this.$refs);
				this.$refs[str].open();
			},
			back() {
				this.util.back();
			},
			
			//添加/修改员工
			save(){
				if(!this.complete) return;
				let fun='addEmployee';
				if(this.editId){
					fun='updateEmployee';
				}
				if(this.util.isEmptyDate(this.form.birthday)){
					this.form.birthday='';
				}
				console.log('employee------------',this.form);
				this.util[fun](this.form).then(res=>{
					this.util.operateBack(this.btnTitle+'员工成功！',true);
				})
			},
			
			
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		padding: 0 24rpx 200rpx;
		box-sizing: border-box;
		font-size: 28rpx;

		// 这是每一个卡片区块的公用样式
		.card {
			background: #fff;
			padding: 0 24rpx;
			box-sizing: border-box;
			color: #999;
			margin-bottom: 24rpx;

			// 这是每一行的公用样式
			.row {
				display: flex;
				align-items: center;
				height: 84rpx;

				span:first-child {
					margin-right: auto;
				}

				.blackfont {
					color: #333;
				}

				.iconarrow-right {
					margin-left: 10rpx;
					font-size: 40rpx;
				}
				input{
					text-align:right;
				}
			}

			.row+.row {
				border-top: 2rpx solid #F2F2F6;
			}
		}

		.grey-title {
			color: #666;
			margin-bottom: 10rpx;
		}

		.card-one {
			margin-bottom: 16rpx;

			.name {
				span:nth-child(2) {
					color: #333;
				}
			}

			.avatar {
				height: 172rpx;

				.img-wrap {
					width: 128rpx;
					height: 128rpx;
					background: tomato;
				}
			}
		}

		.card-two {
			margin-bottom: 32rpx;

			.row {
				.count-wrap {
					width: 280rpx;
					display: flex;
					align-items: center;

					span:not(:nth-child(2)) {
						width: 42rpx;
						height: 42rpx;
						border: 3rpx solid #999;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #999;
						font-size: 36rpx;
						font-weight: bold;
					}

					span:nth-child(2) {
						flex: 1;
						text-align: center;
						color: #333;
					}
				}
			}
		}
	}
	.avatar{
		image{
			width:128rpx;
			height:128rpx;
		}
	}
</style>

<template>
	<view class="wrap">
		<topHead :showComplete="true" :hasComplete="complete" @complete="addClient" @back="back"></topHead>
		
		<div class="grey-title">客户信息</div>
		<div class="card card-one">
			<div class="row name mustOption" @tap="toEdit('name')">
				<span>客户名称</span>
				<span :class="{blackfont:true}">{{form.name||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row avatar" @tap="changeImg">
				<span>客户头像</span>
				 <image v-if="form.avatar" :src="util.picExplode(form.avatar)" mode="aspectFit"></image>
				 <image v-else :src="defaultAvatar" mode="aspectFit"></image>
				<span class="iconfont iconarrow-right"></span>
			</div>
		</div>
		<div class="card card-two">
			<div class="row mustOption" @tap="toEdit('mobile')">
				<span>联系电话</span>
				<span :class="{blackfont:true}">{{form.mobile||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" @tap="toEdit('email')">
				<span>电子邮箱</span>
				<span :class="{blackfont:true}">{{form.email||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row">
				<span>服务次数</span>
				<div class="count-wrap">
					<span @tap="changeCount('-')">-</span>
					<span>{{count}}</span>
					<span @tap="changeCount('+')">+</span>
				</div>
			</div>
			
			<picker @change="changeGroup" :value="form.group_id" :range="groupList" range-key="group_name">
				<div class="row mustOption">
					<span>客户分组</span>
					<span :class="{blackfont:true}">{{groupTitle||selectTip}}</span>
					<span class="iconfont iconarrow-right"></span>
				</div>
			</picker>
			
			<div class="row" @tap="toEdit('address')">
				<span>家庭住址</span>
				<span :class="{blackfont:true}">{{form.address||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
		</div>
		<div class="grey-title">公司信息</div>
		<div class="card card-three">
			<div class="row" @tap="toEdit('company')">
				<span>公司名称</span>
				<span :class="{blackfont:true}">{{form.company||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" @tap="toEdit('company_address')">
				<span>公司地址</span>
				<span :class="{blackfont:true}">{{form.company_address||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
		</div>
		<div class="grey-title">店铺信息</div>
		<div class="card card-three">
			<div class="row" @tap="toEdit('receipt_title')">
				<span>发票抬头</span>
				<span :class="{blackfont:true}">{{form.receipt_title||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" @tap="toEdit('bank')">
				<span>开户行</span>
				<span :class="{blackfont:true}">{{form.bank||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
			<div class="row" @tap="toEdit('bank_no')">
				<span>银行账号</span>
				<span :class="{blackfont:true}">{{form.bank_no||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
		</div>
		<div class="grey-title">备注</div>
		<div class="card card-three">
			<div class="row" @tap="toEdit('remark')">
				<span>备注</span>
				<span :class="{blackfont:true}">{{form.remark||inputTip}}</span>
				<span class="iconfont iconarrow-right"></span>
			</div>
		</div>
		
		<view class="baseButton" @tap="saveUser">{{btnTitle}}</view>
		
		
		<my-popup ref="name" title="客户名称" type="center" :value="form.name" @update="updateName">
		</my-popup>
		
		<my-popup ref="mobile" title="联系电话" type="center" :value="form.mobile" @update="updateMobile">
		</my-popup>
		
		<my-popup ref="email" title="电子邮箱" type="center" :value="form.email" @update="updateEmail">
		</my-popup>
		
		<my-popup ref="address" title="家庭住址" type="center" :value="form.address" @update="updateAddress">
		</my-popup>
		
		<my-popup ref="company" title="公司名称" type="center" :value="form.company" @update="updateCompany">
		</my-popup>
		
		<my-popup ref="company_address" title="公司地址" type="center" :value="form.company_address" @update="updateCompanyAddress">
		</my-popup>
		
		<my-popup ref="receipt_title" title="发票抬头" type="center" :value="form.receipt_title" @update="updateTitle">
		</my-popup>
		
		<my-popup ref="bank" title="开户行" type="center" :value="form.bank" @update="updateBank">
		</my-popup>
		
		<my-popup ref="bank_no" title="银行账号" type="center" :value="form.bank_no" @update="updateBankNo">
		</my-popup>
		
		<my-popup ref="remark" title="备注" type="center" :value="form.remark" @update="updateRemark">
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
					name: "",   //姓名
					avatar:"", //用户头像
					mobile: "",   //联系电话
					served_times: "",   //服务次数
					birthday: "",   //生日
					email: "",   //邮箱
					group_id: "",  //客户分组id
					address: "",   //家庭地址
					company: "",   //公司名称
					company_address: "", //公司地址
					remark: "",  //备注
					receipt_title: "",  //发票抬头
					tax_no: "",  //税号
					bank: "", //开户行
					bank_no: "" //开户行账号
				},
				complete:false,
				inputTip:'请输入',
				selectTip:'请选择',
				groupTitle:'', //客户分组显示标题
				groupList:[], //分组列表
				defaultAvatar:'',
				editId:'', //需要编辑的客户id,或者删除
				btnTitle:'添加',
			}
		},
		watch:{
			"form.name":function(to){
				this.checkInfo();
			},
			"form.mobile":function(to){
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
			//获取用户分组列表
			this.getCustomerGroup().then(res=>{
				if(res){
					if(!this.util.isEmpty(options)){
						this.editId=options.id; 
						this.getCustomer(this.editId);
						this.btnTitle='修改';
					}
				}
			})
		},
		methods: {
			//获取id获取客户
			getCustomer(id){
				let params={customer_id:id};
				this.util.getCustomer(params).then(res=>{
					this.form=res;
					this.groupList.forEach((item,index)=>{
						if(res.group_id==item.group_id){
							this.groupTitle=item.group_name;
						}
					})
				})
			},
			
			//检测是否能添加客户
			checkInfo(){
				if(this.form.name && this.form.mobile && this.form.group_id){
					this.complete=true;
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
			//切换客户分组方法
			changeGroup(e){
				let info=this.groupList[e.target.value];
				this.form.group_id=info.group_id;
				this.groupTitle=info.group_name;
				console.log('group_id',this.form.group_id);
			},
			//获取用户分组列表
			getCustomerGroup(){
				return new Promise((resolve,reject)=>{
					this.util.getCustomerGroup().then(res=>{
						this.groupList=res;
						resolve(true);
					})
				})
				
			},
			//修改名称
			updateName(val){
				console.log('updateName-----------',val);
				this.operate('name',val);
			},
			updateMobile(val){
				this.operate('mobile',val);
			},
			updateEmail(val){
				this.operate('email',val);
			},
			updateAddress(val){
				this.operate('address',val);
			},
			updateCompany(val){
				this.operate('company',val);
			},
			updateCompanyAddress(val){
				this.operate('company_address',val);
			},
			updateTitle(val){
				this.operate('receipt_title',val);
			},
			updateBank(val){
				this.operate('bank',val);
			},
			updateBankNo(val){
				this.operate('bank_no',val);
			},
			updateRemark(val){
				this.operate('remark',val);
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
			
			changeCount(type) {
				if (type == "-") {
					if (this.count == 0) {
						return
					}
					this.count--
				} else {
					this.count++
				}
			},
			//添加客户
			saveUser(){
				if(!this.complete) return;
				let fun='addCustomer';
				if(this.editId){
					fun='editCustomer';
				}
				if(this.util.isEmptyDate(this.form.birthday)){
					this.form.birthday='';
				}
				console.log('addClient------',this.form);
				this.util[fun](this.form).then(res=>{
					this.util.operateBack(this.btnTitle+'客户成功！',true);
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

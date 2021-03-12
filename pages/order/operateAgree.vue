<template>
	<view class="wrap">
		<top :showTitle="true" :topTitle="topTitle" @back="back"></top>
		<view>
			<view class="title">
				<text class="left">协议标题</text>
				<view class="right"  @tap="toEditTitle">
					<input class="textRight" v-model="title" placeholder="请输入标题" disabled>
					<i class="iconfont iconarrow-right"></i>
				</view>
			</view>
			<view class="content">
				<text class='top'>协议内容</text>
				<textarea placeholder="请输入协议内容" v-model="content"></textarea>
			</view>
			<view class='baseButton' @tap="saveAgree">{{btnTxt}}</view>
			<view class='baseButton' @tap="delAgree" v-if="type==1">删除</view>
		</view>
		
		<my-popup ref="popupTitle" title="协议标题" type="center" :value="title" @update="updateTitle">
		</my-popup>
		
	</view>
</template>

<script>
	import Top from '@/components/top-head/top-head'
	import myPopup from "@/components/my-popup/my-popup.vue";
	export default {
		data() {
			return {
				topTitle:'添加协议',
				type:0, ///0/新增，1/修改
				selectId:'',  //修改的id
				title:'',  //显示的标题
				inputTitle:'', //用户输入的标题
				content:'', //协议内容
				btnTxt:'保存', 
			}
		},
		computed: {

		},
		components: {
			Top,myPopup
		},
		onShow(){
			
		},
		onLoad(options) {
			console.log('operateAgress-----',options);
			this.type=options.type;  
			if(this.type==1){
				this.selectId=options.id;
				this.getAgreeDetail(this.selectId);
				this.topTitle="修改协议";
				this.btnTxt='修改';
			}
		},
		methods: {
			//获取协议详情内容
			getAgreeDetail(id){
				this.util.getAgreeDetail(id).then(res=>{
					console.log('getAgreeDetail-----',res);
					this.title=res.title;
					this.content=res.content;
				})
			},
			//显示标题弹窗
			toEditTitle() {
				console.log('popupTitle');
				this.$refs.popupTitle.open();
			},
			
			//修改标题方法
			updateTitle(val) {
				console.error('updateTitle---------',val);
				this.title=val;
				this.$refs.popupTitle.close();
			},
			//点击返回
			back(){
				this.util.back();
			},
			//保存协议
			saveAgree(){
				let params={
					title:this.title,
					content:this.content
				}
				let tip='添加成功！';
				let fun='addAgree';
				if(this.type==1){
					tip="修改成功";
					params.tpl_id=this.selectId;
					fun='editAgree';
				}
				console.log('params-----------',params);
				this.util[fun](params).then(res=>{
					this.util.operateBack(tip,true);
				})
				
				
			},
			
			//删除协议
			delAgree(){
				this.util.confirm('确定删除吗？').then(res=>{
					if(res){
						this.util.delAgree(this.selectId).then(res=>{
							this.util.operateBack("删除成功",true);
						})
					}
				})
			}
			
			
		},

	}
</script>

<style lang="scss">
.wrap{
	font-size:28rpx;
	padding:0rpx 24rpx;
}
.title{
	background:#fff;
	display:flex;
	align-items:center;
	justify-content:space-between;
	padding:24rpx;
	.left{
		color:#999999;
	}
	.right{
		display:flex;
		align-items:center;
	}
}
.content{
	padding:28rpx 0rpx;
	
	.top{
		display:inline-block;
		font-size:28rpx;
		color:#666666;
		margin-bottom:10rpx;
	}
	textarea{
		background:#fff;
		width:100%;
		border: 1px solid #F2F2F6;
		box-sizing: border-box;
		padding: 20rpx;
		height:600rpx;
	}
}

</style>

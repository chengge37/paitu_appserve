<template>
	<view class="content">
		<view class="list" v-if="messageList.length>0">
			<uni-swipe-action v-for="(item,index) in messageList" :key="index">
			    <uni-swipe-action-item :options="item.operate" @click="onClick($event,item.id)">
					<view class="item">
						<text class="title">{{item.remark}}</text>
						<view class="foot">
							<text class="time">{{item.create_time | time2FullDate}}</text>
							<text class="tag" v-if="item.is_read==0">未读</text>
						</view>
					</view>
			    </uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<view v-else>
			<no-data v-if="!loading"></no-data>
		</view>
		<div class="reachBottom" v-if="!loading && noMoreData && messageList.length>0">已经到底啦~</div>
	</view>
</template>

<script>
	import swipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import swipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	export default {
		data() {
			return {
				messageList:[],
				loading:true,  //正在加载数据
				options:[
					{
						text: '标记为已读',
						type:1,
						style: {
							backgroundColor: '#007aff'
						}
					}, {
						text: '删除',
						type:0,
						style: {
							backgroundColor: '#dd524d'
						}
					}
				  ],
				  listParams:{
					  page:1,
					  page_size:10,
					  total:0
				  },
				  addPage: false, //是否是下拉加载
				  noMoreData:false,  //列表是否没有数据了（到底了）
				  firstLoad:true, //是否第一次加载
			}
		},
		components:{
			swipeAction,
			swipeActionItem
		},
		onPullDownRefresh() {
			//重新加载数据
			this.getMessageList();
			setTimeout(function () {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		onLoad() {
			//获取消息列表
			this.getMessageList();
		},
		onShow(){
			//如果不是第一次加载，重新加载数据
			if(!this.firstLoad){
				//重新加载数据
				this.getMessageList();
			}else{
				this.firstLoad=false;
			}
			
		},
		methods:{
			onClick(e,id){
			 //type:,0/删除，1/标记为已读
			  let type=e.content.type;
			  if(type==0){
				  this.delMsg(id);
			  }else if(type==1){
				  this.hasRead(id);
			  }
			},
			//获取消息列表
			getMessageList(){
				this.loading=true;
				let params={
					page:this.listParams.page,
					page_size:this.listParams.page_size
				}
				this.util.getMsgList(params).then(res=>{
					res.rows.forEach((item,index)=>{
						if(item.is_read==1){
							item.operate=[this.options[1]];
						}else{
							item.operate=this.options;
						}
					})
					if (this.addPage) {
						this.messageList = this.messageList.concat(res.rows);
					} else {
						this.messageList = res.rows;
					}
					this.loading=false;
					this.listParams.total=res.total_count;
				})
			},
			
			//标记信息为已读方法
			hasRead(id){
				this.util.hasRead(id).then(res=>{
					this.messageList.forEach((item,index)=>{
						if(item.id==id){
							item.is_read=1;
						}
					})
				})
			},
			
			//删除消息方法
			delMsg(id){
				this.util.delMsg(id).then(res=>{
					let index=this.messageList.findIndex(item=>item.id==id);
					this.messageList.splice(index,1);
				})
				
			},
			
		},
		
		//下拉到底部触发事件
		onReachBottom() {
			this.addPage = true;
			if (this.listParams.total > this.listParams.page * this.listParams.page_size) {
				this.listParams.page = ++this.listParams.page;
				this.getMessageList();
			}else{
				this.noMoreData=true;
			}
			
		},
		
	}
</script>

<style lang="scss" scoped>
.list{
	padding:50rpx 0rpx;
	font-size:28rpx;
	.item{
		width:100%;
		padding:30rpx;
		.title{
			display:inline-block;
			margin-bottom:24rpx;
		}
		.foot{
			display:flex;
			justify-content: space-between;
			.tag{
				color:red;
			}
		}
	}
}
/deep/ .uni-swipe{
	margin-bottom:20rpx;
}
</style>

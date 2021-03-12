<template>
	<view>
		<!-- #ifdef H5 -->
		<!-- <uni-nav-bar left-icon="back" :fixed="true" left-text="返回" :status-bar="true" title="聊天列表" @clickLeft="toSetting"></uni-nav-bar> -->
		<!-- #endif -->
		<!-- 消息列表页面，沟通过的对象都在列表里面 -->
		<view class="list">
			<view class="list-menbers">
				<view class="menbers-item" v-for="(item, index) in convList" :key="index" @tap="chatTo(index)">
					<view class="item-avatar"><img :src="dealAvatar(item)" alt="" /></view>
					<view class="item-info">
						<view class="name-time">
							<span class="info-name">{{ dealName(item) }}</span>
							<span class="last-msg-time">{{ dealLastTime(item) }}</span>
						</view>
						<view class="info-msg-count">
							<span class="last-msg" v-if="item.lastMsg !== false">{{ dealLastMsg(item) }}</span>
							<span class="new-count" v-if="dealMsgCount(item) > 0">{{ dealMsgCount(item) }}</span>
						</view>
					</view>
				</view>
			</view>
			<view class="no-data" v-if="convList.length == 0">暂无对话</view>
		</view>
		<!-- 聊天对话框 -->
		<view class="chat-box"></view>
	</view>
</template>

<script>
// #ifdef H5
import uniNavBar from '@/components/uni-ui/uni-nav-bar/uni-nav-bar';
 
// #endif

import { mapState } from 'vuex';


export default {
	data() {
		return {
			pH: 0, //窗口高度
			convList: [], //聊天成员列表
			showNoData: false
		};
	},
	components: {
		// #ifdef H5
		uniNavBar
		// #endif
	},
	onReady() {
		//console.warn(this.$store.getters.user_data.id, '6666666666666')
		//console.warn('onReady', this.$IM.IM)
	},
	onLoad() {
		console.log('IM = ' + JSON.stringify(this.$IM.IM));
	},
	onShow() {
		// 获取所有得对话
		if (!this.$store.getters.is_login_in) {
			console.error('不登录应该进不来myChat页')
		} else {
			this.getConversations();
		}
	},
	mounted() {
		// #ifdef H5
		document.getElementsByTagName('uni-page-head')[0].style.display = 'none';
		// #endif
	},
	computed: {
		...mapState(['user'])
	},
	watch: {
		'user.conv_list': {
			handler(newVal, oldVal) {
				console.log('聊天列表变化', JSON.stringify(newVal));
				this.convList = newVal;
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		onPullDownRefresh() {
			console.log('下拉刷新');
			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 1000);
		},

		// 点击列表中的某一项，开启聊天
		chatTo(index) {
			let conv = this.convList[index];
			console.log('进入聊天界面', conv);
			let chatToObj = this.user.user_data.id == conv.creatorObj.id ? conv.creatorObj : conv.chatToObj;
			let navData = encodeURIComponent(JSON.stringify(chatToObj)); // 这里转换成 字符串
			console.log('navData = '+JSON.stringify(navData))
			uni.navigateTo({
				url: '/pages/my/chatBox?chatObj=' + navData
			});
			// this.$Router.push({path:'/pages/my/myList/chatBox',query:{chatId:3,chatName:'派图租赁',chatAvatar:'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1516892464,2353738503&fm=26&gp=0.jpg'}})
		},
		// 获取所有包含自己的聊天对话
		getConversations() {
			//store.dispatch('refreshChatList');
			if(this.$IM.IM == null){
				 
				
			} else {
				console.log('getConversations -- this.$Socket = ' + JSON.stringify(this.$IM.IM.$Socket.isconnect));
				
				this.$IM.IM.getConversation()
					.then(res => {
						console.log('res' + JSON.stringify(res));
						this.$store.commit('update_conv_list', res);
					})
					.catch(err => {
						console.log('err' + JSON.stringify(err));
					});
			}
			
		},
		dealMsgCount(item) {
			console.log('处理未读消息 当前用户uid = ' + this.$store.getters.user_data.id + ' 会话创建者ID = ' + item.creatorObj.id);
			if (this.$store.getters.user_data.id == item.creatorObj.id) {
				return item.unreadCountCreator;
			} else {
				return item.unreadCountChatTo;
			}
		},
		// 处理头像相关
		dealAvatar(item) {
			if (this.$store.getters.user_data.id == item.creatorObj.id) {
				return item.chatToObj.avatar.indexOf('http') == -1 ? this.$qiniuHost + item.chatToObj.avatar : item.chatToObj.avatar;
			} else {
				return item.creatorObj.avatar.indexOf('http') == -1 ? this.$qiniuHost + item.creatorObj.avatar : item.creatorObj.avatar;
			}
		},
		// 处理名字相关
		dealName(item) {
			if (this.$store.getters.user_data.id == item.creatorObj.id) {
				return item.chatToObj.nick;
			} else {
				return item.creatorObj.nick;
			}
		},
		// 时间格式处理
		dealLastTime(item) {
			console.log('处理lastTime' + JSON.stringify(item));
			if (item.lastMsg != null) {
				return this.util.time2Date(item.lastMsg.createTime, 'yyyy-MM-dd HH:mm:ss');
			}
			return '最近没有消息';
		},
		dealLastMsg(item) {
			console.log('最后一条显示消息');
			if (item.lastMsg != false) {
				return item.lastMsg.content;
			}
			return '';
		},
		// 跳转到我的
		toSetting() {
			uni.switchTab({
				url: '/pages/tabBar/my'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	padding: 10px 0;

	.list-menbers {
		overflow-y: auto;

		.menbers-item {
			padding: 0 15px;
			// height: 55px;
			display: flex;
			align-items: center;

			.item-avatar {
				width: 40px;
				height: 40px;
				margin-right: 16px;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.item-info {
				padding: 10px 0;
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: center;
				border-bottom: 1px solid #f0f0f0;

				.name-time {
					margin-bottom: 5px;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.info-name {
						font-size: 16px;
					}

					.last-msg-time {
						font-size: 14px;
						color: #aaa;
					}
				}

				.info-msg-count {
					display: flex;
					color: #666;
					font-size: 14px;

					.last-msg {
						margin-right: auto;
					}

					.new-count {
						width: 20px;
						height: 20px;
						background: red;
						color: #fff;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 50%;
					}
				}
			}
		}
	}

	.no-data {
		text-align: center;
		margin-top: 30px;
		color: #999;
	}
}
</style>

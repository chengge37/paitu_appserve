<template>
	<view class="content">
		<button @click="gotoLogin" v-if="!user_data">去登陆》</button>
		<div class="isLogin" v-if="user_data">
			<div class="card head" @click="userInfo">
				<!-- <div class="avatar"><image style="width: 88rpx;height: 88rpx;" :src="$qiniu+user_data.avatar" /></div> -->
				<div class="avatar">
					<image style="width: 88rpx;height: 88rpx;" :src="util.picExplode(user_data.avatar,'0')" />
				</div>
				<div class="userInfo">
					<div class="userInfo-nick">{{user_data.nick}}</div>
					<div class="userInfo-mobile">{{user_data.mobile}}</div>
				</div>
				<div class="arrow">
					<span class="iconfont iconarrow-right"></span>
				</div>
			</div>
			<div class="card list">
				<div class="item" v-for="(item,index) in menuList" :key="index" @tap='operate(item.to)'>
					<image class="img" :src='item.imgUrl'></image>
					<div class="content">
						<div class="per-item">{{item.title}}</div>
						<div class="arrow" v-if="item.to">
							<span class="iconfont iconarrow-right"></span>
						</div>
					</div>
				</div>

			</div>
			<div class="card foot" @tap="toShar">
				<image class="img" :src='shareImgUrl'></image>
				<div class="per-item">分享店铺</div>
				<div class="arrow" v-if="false">
					<span class="iconfont iconarrow-right"></span>
				</div>
			</div>
			<div class="card bottom" @tap="logout">退出登录</div>
		</div>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
				title: "Hello",
				menuList: [{
						title: '账号与安全',
						'imgUrl': '/static/img/countSafe.png',
						to: 'safe'
					},
					{
						title: '消息通知设置',
						'imgUrl': '/static/img/message.png',
						to: null
					},
					{
						title: '在线客服',
						'imgUrl': '/static/img/contact.png',
						to: 'conversation'
					},
					{
						title: '故障反馈与产品建议',
						'imgUrl': '/static/img/agree.png',
						to: 'feedback'
					},
				],
				shareImgUrl: '/static/img/share.png',
			};
		},
		computed: {
			...mapGetters(["user_data"])
		},
		mounted() {
			console.log(this.user_data, "00000");
		},
		methods: {
			gotoLogin() {
				uni.navigateTo({
					url: "/pages/login/index"
				});
			},
			userInfo() {
				uni.navigateTo({
					url: "/pages/my/index"
				});
			},
			//菜单操作方法
			operate(to) {
				if (!to) {
					this.util.showTip('功能建设中！'+to);
					return;
				}
				let url;
				switch (to) {
					case 'safe':
						url = "/pages/my/safe";
						this.$Router.push(url);
						break;
					case 'feedback':
						url = "/pages/my/feedback";
						this.$Router.push(url);
						break;
					case 'conversation':
						{
							if(this.$IM.IM == null){
								this.$store.dispatch('pimLogin').then(res=>{
									console.log('登录成功 in promise then');
									uni.navigateTo({
										url: "/pages/my/conversation"
									});
								}).catch(err=>{
									console.error('登录失败 in promise catch');
									uni.showModal({
										title: '提示',
										content: '登录IM服务器失败，请稍后再试',
										showCancel: false,
										success: function(res) {
											},
										complete: function() {}
									});
								})
							} else {
								uni.navigateTo({
									url: "/pages/my/conversation"
								});
							}
							
						}
				}
			},

			//分享店铺方法
			toShar() {
				this.util.showTip('功能建设中！');
			},

			//退出登录方法
			logout() {
				this.util.confirm("确定退出账号吗").then(async res => {
					if (res) {
						await this.$store.dispatch("logOut");
						this.$store.commit('clear_conv');
						this.$Router.push("/pages/login/index");
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.card {
		color: rgba(51, 51, 51, 1);
		font-weight: bold;
	}

	.line {
		margin-left: 15%;
	}

	.head {
		display: flex;
		height: 146rpx;
		align-items: center;
		justify-content: space-around;
		padding: 0 48rpx;

		.avatar {
			width: 88rpx;
			height: 88rpx;
			margin-right: 26rpx;
		}

		.userInfo {
			flex: 4;

			.userInfo-nick {
				margin-bottom: 4rpx;
				color: rgba(102, 102, 102, 1);
				font-size: 28rpx;
			}

			.userInfo-mobile {
				color: rgba(102, 102, 102, 1);
				font-size: 22rpx;
			}
		}

		.arrow {
			flex: 1;
			text-align: right;
		}
	}

	.list {
		margin-top: 24px;

		.item {
			height: 104rpx;
			display: flex;
			align-items: center;
			margin: 0 48rpx;
			border-bottom: 2rpx solid #F2F2F6;

			.content {
				display: flex;
				align-items: center;
				justify-content: space-between;
				flex: 1;
			}

			.img {
				width: 72rpx;
				height: 72rpx;
				margin-right: 10rpx;
			}

			.dot {
				flex: 1;
			}

			.per-item {
				flex: 10;
			}

			.arrow {
				flex: 1;
				text-align: right;
			}
		}
	}

	.foot {
		margin-top: 24px;
		height: 104rpx;
		display: flex;
		align-items: center;
		padding: 0 48rpx;

		.img {
			width: 72rpx;
			height: 72rpx;
		}

		.per-item {
			flex: 10;
		}

		.arrow {
			flex: 1;
			text-align: right;
		}
	}

	.bottom {
		width: 100%;
		height: 104rpx;
		line-height: 104rpx;
		text-align: center;
		position: absolute;
		bottom: 24rpx;
	}
</style>>
 
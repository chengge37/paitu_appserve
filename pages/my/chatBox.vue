<template>
	<view class="wrap">
		<!-- #ifdef H5 -->
		<uni-nav-bar left-icon="back" :fixed="true" left-text="返回" right-text="聊天列表" :status-bar="true" :title="chatToObj.name"
		 @clickLeft="back" @clickRight="toList"></uni-nav-bar>
		<!-- #endif -->
		<scroll-view id="scrollview" :scroll-top="scrollTop" scroll-y="true" class="scrollview" @scrolltoupper="upper"
		 @scrolltolower="lower" @scroll="scroll">
			<view class="box-content" id="msglistview">
<!-- 				<div class="more-msg">更多消息请查看历史记录</div>
 -->				<div class="msg-item" v-for="(item, index) in msgList" :key="index">
					<div class="time" v-if="showTime(item.createTime,index)">{{ dealTime(item.createTime) }}</div>
					<div class="msg-row" :class="{ 'my-msg': item.creatorId == myUid }">
						<div class="avatar-wrap"><img :src="dealAvatar(item)" alt="" /></div>
						<div class="info">
							<span class="name">{{ dealName(item) }}</span>
							<div class="msg-content">
								<!-- 文字类型消息 -->
								<span class="text-msg">{{ item.content }}</span>
								<!-- 图片类型消息 -->
								<!-- 	<div v-if="item.type==-2" class="img-msg-wrap">
									<img @tap="openUrl(item._lcfile.url)" :src="item._lcfile.url" alt="">
								</div> -->
								<!-- 视频类型消息 -->
								<!-- 							<div class="video-msg-wrap">
											<video class="video-msg" controls v-if="item.type==-4" :src="item._lcfile.url" objectFit="fill" :poster="item._lcfile.url"></video>
										</div> -->
								<!-- 音频类型消息 -->
								<audio class="audio-msg" controls v-if="item.type == -3" :src="item._lcfile.url" :name="item._lcfile.metaData.name"
								 :author="item._lcfile.metaData.owner"></audio>
								<!-- word，excel，ppt，txt等文件 -->
								<!-- <i v-if="item.type==-6" class="el-icon-document"></i> -->
								<!-- <a v-if="item.type==-6" target="_blank" :href="item._lcfile.url">{{item._file.attributes.name}}</a> -->
								<!-- <div v-if="item.type==-6" class="other-file-type" @tap="openOtherFile(item._lcfile.url)">
											<span>[文件]</span>
											<span>{{item._file.attributes.name}}</span>
										</div> -->
								<!-- <web-view :src="item._lcfile.url">item._lcfile.metaData.name</web-view> -->
							</div>
							<span class="arrow" v-if="item.type == -1"></span>
						</div>
					</div>
				</div>
			</view>
		</scroll-view>
		<!-- </scroll-view> -->

		<view class="bottom" style="height: 1px;"></view>
		<view class="box-foot">
			<view class="foot-operation">
				<!-- <span @tap="openEmoji">表情</span> -->
				<div ref="inputImg" class="img-input-wrap"><i class="iconfont icontupian"></i></div>
				<!-- <span @tap="toHistory">历史记录</span> -->
				<!-- <div ref="inputImg" class="file-input-wrap">
			  <span>文件</span>
			</div> -->
				<!-- <span @click="openFile">文件</span> -->
			</view>
			<view class="foot-input">
				<input v-model="inputContent" class="input" focus placeholder="请输入" />
				<span class="send-btn" @tap="sendMsg">发送</span>
			</view>
			<!-- 表情盒子 -->
			<view class="emoji-box" v-if="showEmoji">
				<div class="emoji-group" v-for="(item, index) in emojiArr" :key="index">
					<p class="emoji-class">{{ item.name }}</p>
					<div class="emoji-list">
						<span class="emoji-item" v-for="(each, j) in item.emojis" :key="j" @tap="selectEmoji(each)">{{ each }}</span>
					</div>
				</div>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import store from '@/store';
	import Emoji from '@/common/utils/emojiData';
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";

	export default {
		data() {
			return {
				scrollTop: 100,
				old: {
					scrollTop: 0
				},
				pH: 0, //窗口高度
				boxHeight: 0, //元素的所需高度
				inputContent: '', //输入框输入的文字消息
				msgList: [], //对话的所有消息
				msgListCopy: [], //用于迭代消息的工具数组
				creatorObj: {
					id: '',
					name: '',
					avatar: ''
				},
				chatToObj: {
					id: '',
					name: '',
					avatar: ''
				},
				showEmoji: false,
				emojiArr: [],
				myUid: -1
				// timer:null
			};
		},
		components: {
			//#ifdef H5 || APP-PLUS
			uniNavBar
			//#endif
		},
		watch: {
			'user.conv_list': {
				handler(newVal, oldVal) {
					console.log('观测到变化1');
				},
				immediate: true,
				deep: true
			},
			'user.msg_of_con_map': {
				handler(newVal, oldVal) {
					console.log('观测到变化msg_of_con_map 当前会话 ', this.conversationObj, newVal);
					console.log('现在的消息列表' + JSON.stringify(this.msgList));
					if (this.conversationObj != null) {
						if (newVal.hasOwnProperty(this.conversationObj.id)) {
							//调用到这里就证明已读了
							let newMsgList = newVal[this.conversationObj.id];
							console.log('this.msgList = ' + JSON.stringify(this.msgList));
							this.markConversationRead();
							if (this.msgList.length == 0) {
								let copyMsgList = newMsgList.concat([]);
								this.msgList = copyMsgList;
								setTimeout(()=>{
									this.scrollToBottom();
								},500);
							} else {
								let copyMsgList = newMsgList.concat([]);
								let lastMsg = copyMsgList[copyMsgList.length - 1];
								let exist = false;
								for (let i = 0, n = this.msgList.length; i < n; i++) {
									if (lastMsg.id == this.msgList[i].id) {
										exist = true;
									}
								}
								if (!exist) {
									this.msgList.push(lastMsg);
									setTimeout(()=>{
										this.scrollToBottom();
									},500);
								}
							}
						}
					}
				},
				immediate: true,
				deep: true
			}
		},
		computed: {
			...mapState(['user'])
		},
		onLoad(options) {
			this.myUid = this.user.user_data.id;
			console.log('我的uid:' + this.myUid);
			console.warn(options, '刷新页面后的options');
			// 根据传递过来的参数保存聊天另一个成员的信息
			console.warn(options.chatObj, '传递过来的参数');
			let chatObj = JSON.parse(decodeURIComponent(options.chatObj));
			this.chatToObj = { ...chatObj
			};
			// 检查user的对话列表
			if (this.user.conv_list.length == 0) {
				this.getConversationList();
			}
		},
		onReady() {
			// 导入表情包数组
			this.emojiArr = Emoji;
			// 创建input标签
			this.createInput(this.$refs.inputImg);
			// 进入列表页面监听新消息
			// 计算box-content高度以作超出scroll滚动
			let that = this;
			// uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
			// 	success(res) { //成功回调函数
			// 		that.pH = res.windowHeight //windoHeight为窗口高度，主要使用的是这个
			// 		let titleH = uni.createSelectorQuery().select(".box-content"); //想要获取高度的元素名（class/id）
			// 		titleH.boundingClientRect(data => {
			// 			let pH = that.pH;
			// 			that.boxHeight = pH - data.top - 80 //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
			// 		}).exec()
			// 	}
			// })
			console.warn(this.user, '登录用户的user');
			// 根据传过来的id，开启和该id的聊天
			console.error('ready 设置标题' + that.chatToObj.nick);
			uni.setNavigationBarTitle({
				title: that.chatToObj.nick,
				success: function() {
					console.log('设置成功');
				},
				fail: function(e) {
					console.log('设置失败' + JSON.stringify(e));
				}
			});
		},
		onShow() {
			let _this = this;
			setTimeout(function() {
				console.error('设置title' + _this.chatToObj.nick)
				uni.setNavigationBarTitle({
					title: _this.chatToObj.nick
				});
			}, 500);
			// 保存对话创建者的个人信息，包括id，名称以及头像
			if (this.$IM.IM) {
				console.log('初始化回话 with ' + this.chatToObj.id);
				//先查conv列表里有没有
				let existIndex = -1;
				for (let i = 0, n = this.user.conv_list.length; i < n; i++) {
					let existConv = this.user.conv_list[i];
					if (this.chatToObj.id == existConv.chatToObj.id || this.chatToObj.id == existConv.creatorObj.id) {
						existIndex = i;
						break;
					}
				}
				if (existIndex == -1) {
					console.log('会话列表没有 创建新会话');
				} else {
					this.conversationObj = this.user.conv_list[existIndex];
					console.log('已经有了', this.conversationObj);
					//标记已读
					this.markConversationRead();
					this.getMessageList();
				}
			} else {
				this.$store.dispatch('pimLogin').then(res => {
					this.getMessageList();
				})
			}
		},
		mounted() {
			//document.getElementsByTagName('uni-page-head')[0].style.display = 'none'
		},
		methods: {
			showTime(time, index) {
				if (index == 0) {
					return true;
				}
				let lastMsg = this.msgList[index - 1];
				let thisMsg = this.msgList[index];
				return thisMsg.createTime - lastMsg.createTime > 60;
			},
			markConversationRead() {
				console.log('触发标记已读');
				let conversationId = this.conversationObj.id;
				this.$IM.IM.markConversationRead(conversationId)
					.then(res => {
						console.log('标记已读 res' + JSON.stringify(res));
						store.commit('update_conv_read', conversationId)
					})
					.catch(err => {
						console.error('err' + JSON.stringify(err));
					});
			},
			getMessageList() {
				let conversationId = this.conversationObj.id;
				this.$IM.IM.getMessageList(conversationId)
					.then(res => {
						console.log('获取信息列表' + JSON.stringify(res));
						store.commit('update_msg_of_con_map', {
							conv_id: this.conversationObj.id,
							messages: res.list
						});
						this.scrollToBottom();
					})
					.catch(err => {
						console.error('err' + JSON.stringify(err));
					});
			},
			getConversationList() {
				this.$IM.IM.getConversation()
					.then(res => {
						console.log('res' + JSON.stringify(res));
						store.commit('update_conv_list', res);
					})
					.catch(err => {
						console.error('err' + JSON.stringify(err));
					});
			},
			upper: function(e) {
				console.log(e);
			},
			lower: function(e) {
				console.log(e);
			},
			scroll: function(e) {
				//				console.log(e)
				this.old.scrollTop = e.detail.scrollTop;
			},
			// 刷新本页面后重新登录IM
			loginIM(id, userInfo) {},
			// 返回聊天列表
			toList() {
				this.$Router.push('/pages/my/myList/myChat');
			},
			// 发送消息
			sendMsg() {
				if (!this.inputContent) {
					return;
				}
				if (this.conversationObj) {
					let pim = this.$IM.IM;
					pim.sendMsg(this.conversationObj.id, {
							msg_type: 1,
							msg_content: this.inputContent
						})
						.then(res => {
							console.warn('消息已发送 ' + JSON.stringify(res));
							store.commit('update_one_conv_list', {
								conv: this.conversationObj,
								msg: res
							});
							// 清空输入框
							this.inputContent = '';
						})
						.catch(err => {
							console.error(err, '消息发送失败');
						});
				}
			},

			initMsg() {},
			// 获取对话的所有消息
			refreshMsgs() {
				// 这里获取50条就好，所有消息让用户查看聊天记录
				// if (!this.user.msg_of_con_map.hasOwnProperty(this.conversationObj.id)) {
				// 	console.log('没有消息 去刷新');
				// 	store.dispatch('refresh_con_msg_list', this.conversationObj);
				// } else {
				// 	console.log('有了不用');
				// 	this.msgList = this.user.msg_of_con_map[this.conversationObj.id];
				// 	this.$nextTick(function() {
				// 		this.scrollToBottom();
				// 	})
				// }
				// 创建一个迭代器，每次获取 1000 条历史消息,迭代获取所有消息
				// var messageIterator = this.conversationObj.createMessagesIterator({ limit: 1000 });
				// this.msgListCopy=[]
				// 调用递归方法
				// this.chatIterator(messageIterator,this.conversationObj)
			},
			// 递归遍历对话的所有消息
			chatIterator(iterator, con) {
				iterator
					.next()
					.then(result => {
						console.warn(result, '888');
						this.msgListCopy.unshift(...result.value);
						if (!result.done) {
							// 如果还有消息没遍历完继续递归
							this.chatIterator(iterator, con);
						} else {
							// 消息全部迭代完成后
							this.msgList = [...this.msgListCopy];
							this.$nextTick(() => {
								this.scrollToBottom();
							});
							console.warn(this.msgList, '对话的所有消息');
						}
					})
					.catch(console.error.bind(console));
			},
			// 头像的相关处理
			dealAvatar(msgItem) {
				return this.conversationObj.creatorObj.id == msgItem.creatorId ?
					this.conversationObj.creatorObj.avatar.indexOf('http') == -1 ?
					this.$qiniuHost + this.conversationObj.creatorObj.avatar :
					this.conversationObj.creatorObj.avatar :
					this.conversationObj.chatToObj.avatar.indexOf('http') == -1 ?
					this.$qiniuHost + this.conversationObj.chatToObj.avatar :
					this.conversationObj.chatToObj.avatar;
			},
			// 消息作者名字处理
			dealName(msgItem) {
				return this.conversationObj.creatorObj.id == msgItem.creatorId ? this.conversationObj.creatorObj.name : this.conversationObj
					.chatToObj.name;
			},
			// 时间格式处理
			dealTime(val) {
				return this.util.time2Date(val, 'yyyy-MM-dd HH:mm:ss');
			},
			// 消息框滚动到底部
			scrollToBottom() {
				// document.querySelectorAll('.box-content')[0].scrollTop = document.querySelectorAll('.box-content')[0].scrollHeight
				console.log('scrollToBottom');
				let that = this;
				let query = uni.createSelectorQuery();
				query.select('#scrollview').boundingClientRect();
				query.select('#msglistview').boundingClientRect();
				query.exec(res => {
					if (res[1].height > res[0].height) {
						that.scrollTop = res[1].height - res[0].height + 79;
					}
				});
			},
			// 监听收到新消息或者已发消息的回执
			listenNewMsg(obj) {
				// 当前用户收到了新消息或者回执。
				// obj.on(Event.MESSAGE, (message, conversation) => {
				// 	console.warn(message, conversation, 'hhhhhhhhhhhhhhhhhhhhh')
				// })
			},
			// 标记所有消息为已读
			markRead(obj) {
				obj.read()
					.then(res => {
						console.warn(res, '接收消息标为已读');
					})
					.catch(err => {
						console.error(err);
					});
			},
			// 打开表情包
			openEmoji() {
				this.showEmoji = !this.showEmoji;
			},
			// 打开手机图库
			openImage() {
				return;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					success: function(res) {
						console.warn(res, '调用图片');
						// 预览图片
						uni.previewImage({
							urls: res.tempFilePaths
						});
						// 获取图片信息
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: function(image) {
								console.warn('图片路径:' + image.path);
								console.warn(image, '图片信息');
							}
						});
						// 发送图片
						let fileName = res.tempFiles[0].name || new Date().valueOf() + '.jpg';
						console.warn(fileName, '文件名');
						let file = new AV.File(fileName, res.tempFiles[0]);
						console.warn(file, 'AV初始化文件');
						file.save()
							.then(function() {
								let message = new ImageMessage(file);
								return that.conversationObj.send(message);
							})
							.then(res => {
								console.warn(res, '图片发送成功');
							})
							.catch(err => {
								console.warn(err, '图片发送失败');
							});
					}
				});
			},
			// 打开手机文件夹
			openFile() {
				let that = this;
				let file = new AV.File(this.fileObj.name, this.fileObj);
				let message = null;
				console.warn(file, 'AV初始化文件');
				file.save()
					.then(function() {
						if (that.fileObj.type.indexOf('image') != -1) {
							// 发送图片
							message = new ImageMessage(file);
						} else if (that.fileObj.type.indexOf('video') != -1) {
							// 发送视频
							message = new VideoMessage(file);
						} else if (that.fileObj.type.indexOf('audio') != -1) {
							// 发送音频
							message = new AudioMessage(file);
						} else {
							// 发送其他文件类型
							message = new FileMessage(file);
						}
						return that.conversationObj.send(message);
					})
					.then(res => {
						console.warn(res, '文件发送成功');
						setTimeout(() => {
							that.getMsgs();
						}, 200);
					})
					.catch(err => {
						console.warn(err, '文件发送失败');
					});
			},
			// h5里面直接使用input type=file标签不生效，只会渲染出一个普通的文本输入框
			createInput(dom) {
				// var input = document.createElement('input')
				// input.type = 'file'
				// input.className = "img-input"
				// input.style.opacity = 0
				// input.style.height = '30px'
				// console.warn(input, 'ooooooooooooooooooooo')
				// input.onchange = (event, file) => {
				// 	console.log(event.target.files[0], input.value, '上传的图片文件')
				// 	this.fileObj = event.target.files[0]
				// 	console.warn(this.fileObj, 'jjjjjjjjjjj')
				// 	this.openFile()
				// }
				// console.warn(dom, '获取到整个dom')
				// dom.appendChild(input)
			},
			// 点击文件类型消息，打开或下载相应图片
			// 点击文件消息主体在另外窗口打开文件
			openUrl(url) {
				// 预览图片
				uni.previewImage({
					urls: [url],
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.warn('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.error(err, '预览图片失败');
						},
						complete: function() {
							console.warn('调用结束');
						}
					}
				});
			},
			// 打开其他类型的文件
			openOtherFile(url) {
				// 浏览器可以打开，但微信内部浏览器打开失败
				// #ifdef H5
				window.location.href = url;
				// #endif
			},
			// 选择表情
			selectEmoji(item) {
				this.inputContent += item;
			},
			// 跳转到历史聊天记录
			toHistory() {
				// this.$Router.push({
				//   path:'/pages/my/myList/chatHistory',
				// })
				var navData = encodeURIComponent(
					JSON.stringify({
						creatorObj: this.creatorObj,
						chatToObj: this.chatToObj
					})
				);
				uni.navigateTo({
					url: '/pages/my/myList/chatHistory?menber=' + navData
				});
			},
			back() {
				this.$Router.back();
			}
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 14px;
		height: 100%;

		// .box-head{
		//   position: fixed;
		//   top: 0;
		//   left: 0;
		//   width: 100%;
		//   height: 50px;
		//   background: rgb(54,55,60);
		//   display: flex;
		//   justify-content: space-between;
		//   align-items: center;
		//   color: #fff;
		//   font-size: 16px;
		//   padding: 0 15px;
		//   box-sizing: border-box;
		//   z-index: 2;
		// }
		.scrollview {
			position: fixed;
			bottom: 80px;
			top: 0;
			left: 0;
			right: 0;

			.box-content {
				// position: fixed;
				// /* #ifdef H5*/
				// top: 44px;
				// /* #endif */
				// top: 0;
				// bottom: 80px;
				// left: 0;
				// right: 0;
				// overflow-y: auto;
				// padding-top: 10px;

				.more-msg {
					text-align: center;
					margin-bottom: 10px;
					color: rgb(4, 190, 2);
				}

				// height: clac(100% -130px);
				// margin-top: 54px;
				// margin-bottom: 90px;
				// background: tomato;
				// padding-top: 54px;
				// padding-bottom: 90px;
				.msg-item {
					padding-left: 10px;
					padding-right: 10px;
					display: flex;
					flex-direction: column;
					align-items: center;

					.time {
						background: rgb(221, 221, 221);
						color: #fff;
						padding: 5px 10px;
						border-radius: 3px;
						margin-bottom: 8px;
					}

					.msg-row {
						width: 100%;
						display: flex;
						margin-bottom: 10px;

						.avatar-wrap {
							width: 45px;
							height: 45px;

							img {
								width: 100%;
								height: 100%;
							}
						}

						.info {
							width: calc(100% - 70px);
							display: flex;
							flex-direction: column;
							position: relative;

							.name {
								color: #999;
								margin-bottom: 8px;
							}

							.msg-content {
								// word-wrap:break-word;
								white-space: normal;
								word-break: break-all;
								overflow: hidden;

								.text-msg {
									display: inline-block;
									border-radius: 3px;
									padding: 5px 10px;
									background: #fff;
								}

								.img-msg-wrap {
									// display: flex;
									width: 100%;
									height: 120px;
									padding-left: 50px;
									box-sizing: border-box;

									img {
										max-width: 100%;
										max-height: 100%;
										width: auto;
										height: auto;
										// margin-left: auto;
									}
								}

								.audio-msg {
									/deep/ {
										.uni-audio-default {
											min-width: 240px !important;
										}
									}
								}

								.video-msg-wrap {
									z-index: 1;

									.video-msg {
										width: 240px;
										height: 150px;
										z-index: 1;

										/deep/ {
											.uni-video-container {
												z-index: 1;
											}

											.uni-video-video {
												z-index: 1;
											}
										}
									}
								}

								.other-file-type {
									width: fit-content;
									background: #fff;
									padding: 10px;
									box-sizing: border-box;
									display: flex;
									flex-direction: column;
								}
							}

							.arrow {
								border-top: 8px solid #fff;
								border-left: 8px solid transparent;
								border-right: 8px solid transparent;
								position: absolute;
								left: -8px;
								top: 35px;
							}
						}

						.avatar-wrap+.info,
						.info+.avatar-wrap {
							margin-left: 15px;
						}
					}

					.my-msg {
						flex-direction: row-reverse;

						.info {
							.name {
								text-align: right;
							}

							.msg-content {
								text-align: right;

								.text-msg {
									background: rgb(95, 184, 120);
									color: #fff;
								}
							}

							.arrow {
								left: unset;
								right: -8px;
								border-top-color: rgb(95, 184, 120);
							}
						}

						.avatar-wrap {
							margin-left: 15px;
						}
					}
				}
			}
		}

		.show-emoji {
			bottom: 230px;
		}

		.box-foot {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			padding-bottom: 10px;
			border-top: 1px solid #fff;
			z-index: 999;

			// background: #eee;
			.foot-operation {
				// height: 50%;
				height: 30px;
				padding: 0 10px;
				font-size: 14px;
				display: flex;
				align-items: center;

				.img-input-wrap {
					margin: 0 20px;
					width: 30px;
					height: 30px;
					position: relative;
					overflow: hidden;

					i {
						width: 30px;
						height: 30px;
						line-height: 30px;
						text-align: center;
						// display: flex;
						// align-items: center;
						// padding: 0 5px;
						// width: 50px;
						// width: fit-content;
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
						// border: 1px solid #aaa;
						// color: #999;
					}
				}
			}

			.foot-input {
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 10px;

				.input {
					background: #fff;
					flex: 7.5;
					margin-right: 20px;
					height: 40px;
					font-size: 16px;
					text-indent: 10px;
					border-radius: 6px;
				}

				.send-btn {
					border-radius: 6px;
					flex: 2.5;
					background: rgb(95, 184, 120);
					color: #fff;
					height: 40px;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 14px;
				}
			}

			.emoji-box {
				padding: 0 10px;
				box-sizing: border-box;
				height: 150px;
				overflow-y: auto;
				margin-top: 10px;
			}
		}
	}
</style>

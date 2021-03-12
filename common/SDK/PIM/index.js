import store from '../../../store'
import {
	http
} from '../../utils/lush/index.js';

import {
	isJSON
} from '../../utils/util.js'
const shortid = require('shortid');
import socket from "./socket.js";
//console.log('Socket = ' + JSON.stringify(socket));

import $Vm from '../../../main.js'

export default class PIM {

	constructor() {
		// promise池
		this.promisePool = {};
	}

	static createPIMClient() {
		console.error('createPIMClient 被调用');
		if ($Vm.$IM.IM !== null) {
			console.error('已经有了IM');
			resolve($Vm.$IM.IM)
			return;
		}

		this.instance = new PIM();
		let _this = this.instance;
		return new Promise((resolve, reject) => {
			if ($Vm.$IM.IM !== null && $Vm.$IM.IM instanceof PIM && $Vm.$IM.IM.$Socket.isconnect) {
				console.error('$Vm 已经有了 PIM ' + JSON.stringify($Vm.$IM.IM.$Socket));
				resolve($Vm.$IM.IM);
			} else {
				console.log('VM IM 空 createPIMClient');
				if (!store.getters.is_login_in) {
					$Vm.$IM.setIM(null)
					reject('没登录派图无法登录IM服务器');
					return;
				}
				let createSocketIng = uni.getStorageSync('socket_ing');
				if (createSocketIng == true) {
					reject('正在创建中...');
				} else {
					uni.setStorageSync('socket_ing', true);
					const _socket = new socket({
						url: 'wss://socket.paitume.com',
						maxInterValCount: 20,
						interValTime: 3000,
						onOpen(res) {
							console.error('连接成功')
							$Vm.$IM.setIM(_this)
							uni.setStorageSync('socket_ing', false);
							resolve(_this);
						},
						onClose(err) {
							$Vm.$IM.setIM(null)
							uni.setStorageSync('socket_ing', false);
							console.log('关闭了连接')
						},
						onReload(res) {
							console.log('重载：' + res)
						},
						onMsg(msgObj) {
							console.log(msgObj)
							let msg = msgObj.data;
							if (isJSON(msg)) {
								console.log('JSON是有效字符串');
								let returnObj = JSON.parse(msg);
								if (returnObj.is_notice == 1) {
									//这个是通知
									let msg = false;
									switch (returnObj.json.type) {
										case 22:
											msg = '商家已接收您的订单~'
											break;
										case 23:
											msg = '您有订单已上传核验单~'
											break;
										case 24:
											msg = '您有订单已开始~'
											break;
										case 25:
											msg = '您有订单待评价~'
											break;
										case 71:
											msg = '您的活动已开始~'
											break;
										default:
											break;
									}
									if (msg) {
										uni.showToast({
											title: msg,
											icon: 'none',
											duration: 2000
										})
									}
								} else {
									let uuid = returnObj.uuid;
									if (uuid === undefined || uuid === null) {
										console.log('没有UUID就是IM新消息');
										console.log('returnObj = ' + msg);
										if (returnObj.type !== undefined) {
											//IM消息
											if (returnObj.type == 'MESSAGE_DETAIL') {
												store.commit('update_one_conv_list', {
													conv: returnObj.data.conversation,
													msg: returnObj.data
												});
											}
										} else {
											//其他逻辑消息
										}


									} else {
										console.log('返回UUID ' + uuid);
										console.log('msg = ' + msg);
										console.log('现在的实例' + JSON.stringify(_this))
										console.log('现在的连接池:' + JSON.stringify(_this.promisePool));
										const req = _this.promisePool[uuid]
										if (req !== undefined) {
											if (returnObj.type == 'ERROR') {
												req.reject(returnObj.data.msg);
											} else {
												req.resolve(returnObj.data);
											}
											delete _this.promisePool[uuid];
										} else {
											console.error('promisePool为空' + JSON.stringify(_this.promisePool));
										}
									}
								}
							} else {
								console.error('返回不是JSON字符串');
							}
						},
						onError(err) {
							$Vm.$IM.setIM(null)
							uni.setStorageSync('socket_ing', false);
							console.log('错误');
							reject('登录IM失败');
						},
						protocols: [store.getters.user_data.token]
					})
					console.log('_socket 生成')
					_this.$Socket = _socket;
				}
			}
		});
	}

	getConversation() {
		//回话不分页
		let uuid = shortid.generate();
		console.log('getConversation 生成UUID ' + uuid);
		let queryData = {
			uuid: uuid,
			'class': 'Conversation',
			action: 'get',
		}
		return new Promise((resolve, reject) => {
			this.promisePool[uuid] = {
				resolve,
				reject,
				queryData
			};
			this.$Socket.nsend(JSON.stringify(queryData));
		});
	}

	createConversation(chatToUid) {
		let uuid = shortid.generate();
		console.log('createConversation 生成UUID ' + uuid);
		let queryData = {
			uuid: uuid,
			'class': 'Conversation',
			action: 'create',
			content: {
				to_uid: chatToUid
			}
		}
		console.log('创建会话 参数' + JSON.stringify(queryData));
		return new Promise((resolve, reject) => {
			this.promisePool[uuid] = {
				resolve,
				reject,
				queryData
			};
			this.$Socket.nsend(JSON.stringify(queryData));
		});
	}

	sendMsg(conversationId, msgObj) {
		let uuid = shortid.generate();
		console.log('createConversation 生成UUID ' + uuid);
		let queryData = {
			uuid: uuid,
			'class': 'Message',
			action: 'send',
			content: {
				msg_type: msgObj.msg_type,
				msg_content: msgObj.msg_content,
				conversation_id: conversationId
			}
		}
		return new Promise((resolve, reject) => {
			this.promisePool[uuid] = {
				resolve,
				reject,
				queryData
			};
			this.$Socket.nsend(JSON.stringify(queryData));
		});
	}

	getMessageList(conversationId) {
		let uuid = shortid.generate();
		console.log('createConversation 生成UUID ' + uuid);
		let queryData = {
			uuid: uuid,
			'class': 'Message',
			action: 'get',
			content: {
				conversation_id: conversationId
			}
		}
		return new Promise((resolve, reject) => {
			this.promisePool[uuid] = {
				resolve,
				reject,
				queryData
			};
			this.$Socket.nsend(JSON.stringify(queryData));
		});
	}

	markConversationRead(conversationId) {
		let uuid = shortid.generate();
		console.log('markConversationRead 生成UUID ' + uuid);
		let queryData = {
			uuid: uuid,
			'class': 'Conversation',
			action: 'read',
			content: {
				conversation_id: conversationId
			}
		}
		return new Promise((resolve, reject) => {
			this.promisePool[uuid] = {
				resolve,
				reject,
				queryData
			};
			this.$Socket.nsend(JSON.stringify(queryData));
		});
	}

	close() {
		console.log('手动触发close')
		if (this.$Socket) {
			this.$Socket.nclose();
		}
	}
}

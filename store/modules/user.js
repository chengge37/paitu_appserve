import {
	users
} from '@/common/api/api';
import {
	http
} from '@/common/utils/lush';
import {
	listenMsg
} from "@/common/utils/util.js"
import Vue from 'vue'
import $Vm from '@/main.js'
import PIM from '@/common/SDK/PIM/index.js'
import _ from 'lodash/core'
const user = {
	state: {
		user_data: uni.getStorageSync('user') ? JSON.parse(uni.getStorageSync('user')) : false,
		showLogin: false,
		push_token: uni.getStorageSync('push_token') ? uni.getStorageSync('push_token') : false,
		conv_list: [],
		msg_of_con_map: {},
	},
	getters: {
		push_token: state => {
			return state.push_token
		}
	},
	mutations: {
		clear_conv(state, data) {
			state.conv_list = [];
			state.msg_of_con_map = {};
		},
		add_new_conv(state, data) {
			console.log('vuex 添加回话信息')
			let insertIndex = -1;
			for (let i = 0, n = state.conv_list.length; i < n; i++) {
				let exsitConv = state.conv_list[i];
				if (exsitConv.createTime < data.createTime) {
					//在这个位置插入
					insertIndex = i;
				}
			}
			console.log('vuex 添加回话信息 插入位置 ' + insertIndex)
			if (insertIndex > -1) {
				state.conv_list.splice(insertIndex, 0, data);
			} else {
				state.conv_list.push(data);
			}
		},

		update_conv_read(state, conv_id) {
			for (let i = 0, n = state.conv_list.length; i < n; i++) {
				let convItem = state.conv_list[i];
				if (convItem.id == conv_id) {
					//更新未读数
					console.log('找到要更新的会话' + JSON.stringify(convItem));
					if (state.user_data.id == convItem.creatorObj.id) {
						convItem.unreadCountCreator = 0;
					} else {
						convItem.unreadCountChatTo = 0;
					}
					break;
				}
			}
		},

		update_conv_list(state, data) {
			data.sort((a, b) => {
				return b.createTime - a.createTime
			})
			state.conv_list = data;
		},
		update_one_conv_list(state, data) {
			console.log('更新一条会话的一条消息', data);
			let conv = data.conv;
			let msg = data.msg;
			let updateIndex = -1;
			for (let i = 0, n = state.conv_list.length; i < n; i++) {
				let chatItem = state.conv_list[i];
				if (chatItem.id == conv.id) {
					updateIndex = i;
					break;
				}
			}
			console.log('updateIndex = ' + updateIndex);
			if (updateIndex >= 0) {
				console.log('更新聊天列表的第' + updateIndex + '项');
				let newConv = conv;
				$Vm.$set(state.conv_list, updateIndex, newConv);
			} else {
				state.conv_list.push(conv);
			}

			state.conv_list.sort((a, b) => {
				return b.createTime - a.createTime
			})
			console.log('state.msg_of_con_map = ', state.msg_of_con_map);
			if (!state.msg_of_con_map.hasOwnProperty(conv.id)) {
				Vue.set(state.msg_of_con_map, conv.id, [msg]);
			} else {
				if (state.msg_of_con_map[conv.id] == undefined) {
					state.msg_of_con_map[conv.id] = [msg];
				} else {
					state.msg_of_con_map[conv.id].push(msg);
				}
			}
			console.log('更新结束');
		},
		update_msg_of_con_map(state, data) {
			console.log('update_msg_of_con_map');
			if (state.msg_of_con_map.hasOwnProperty(data.conv_id)) {
				//组合
				let oldMsgList = state.msg_of_con_map[data.conv_id];
				let newMsgList = data.messages;
				const idSet = oldMsgList.reduce((acc, v) => {
					acc[v.id] = true;
					return acc;
				}, {});
				// 遍历新消息list，去掉在idSet中存在的id
				const result = newMsgList.filter(v => !idSet[v.id]);
				console.log('new msg', result);

				let temp = oldMsgList.concat(result);
				let tempAfterSort = _.sortBy(temp, function(o) {
					return o.createTime;
				});
				state.msg_of_con_map[data.conv_id] = tempAfterSort;
			} else {
				console.log('Vue set', data.conv_id, data.messages);
				let tempAfterSort = _.sortBy(data.messages, function(o) {
					return o.createTime;
				});
				Vue.set(state.msg_of_con_map, data.conv_id, tempAfterSort);
			}
		},
		update_push_token(state, data) {
			try {
				uni.setStorageSync('push_token', data);
			} catch (e) {
				console.error('保存PUSH TOKEN 错误', e);
			}
		},
		update_show_login(state, data) {
			state.showLogin = data;
		},
		update_user_data(state, data) {
			try {
				uni.setStorageSync('user', JSON.stringify(data));
			} catch (e) {
				console.error('保存用户信息错误', e);
			}
			let oldToken = state.user_data.token;
			state.user_data = data;

			//重新连接socket，如果token发生变化，从新连接socket
			if (oldToken != data.token) {
				//关闭socket
				uni.closeSocket();
				//连接socket
				listenMsg();
			}
		},
		remove_user_data(state) {
			uni.removeStorage({
				key: 'user',
			});
			state.user_data = false
			//关闭socket
			uni.closeSocket();
		},

	},
	actions: {
		login({
			dispatch,
			commit
		}, form) {
			return new Promise((resolve, reject) => {
				http.post(users.login, form).then(res => {
					console.log('登录结果', res);
					if (res) {
						commit('update_user_data', res);
						resolve(true)
					}
				}).catch(err => {
					console.error('login错误', err);
					// commit('remove_user_data')
					reject(false)
				})
			})

		},

		logOut({
			commit,
			dispatch
		}) {
			return new Promise((resolve, reject) => {
				$Vm.$http.post('/user/ajaxLogout').then(() => {
					commit('remove_user_data', null)
					resolve()
				}).catch(err => reject(err))
			})
		},
		pimLogin({
			commit,
			state
		}) {
			console.error('pimLogin被调用 ');
			return new Promise((resolve, reject) => {
				if ($Vm.$IM.IM == null) {
					PIM.createPIMClient().then(pim => {
						console.log('createPIMClient succ');
						resolve(pim)
					}).catch(err => {
						console.error('createPIMClient err' + JSON.stringify(err));
						reject(err)
					});
				} else {
					console.error('IM已经存在')
					resolve($Vm.$IM.IM)
				}
			})
		},
	}
}
export default user;

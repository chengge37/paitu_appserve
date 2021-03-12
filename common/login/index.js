import store from '../../store'
import {
	router
} from '../router/router'


export const promptLogin = () => {
	uni.showModal({
		title: '提示',
		content: '您尚未登录账号，去登录？',
		showCancel: false,
		success: function(res) {
			if (res.confirm) {
				console.log('登录');
				uni.navigateTo({
					url: "/pages/login/index"
				});
			} else if (res.cancel) {

			}
		},
		complete: function() {}
	});
}

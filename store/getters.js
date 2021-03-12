
function isValidUser(userData) {
	// console.log('判断用户数据合法 用户数据:',userData);
	let arr = Object.keys(userData);
	if (arr.length == 0) {
		return false;
	}
	if (userData.token !== undefined ) {
		return true;
	}
	return false;
}
const getters = {
	user_data: state => state.user.user_data,
	is_login_in: state => isValidUser(state.user.user_data),
	showLogin:state=>state.user.showLogin,
	refresh:state=>state.refresh.refresh,
	tabParams:state=>state.tabbar.tabParams,
}
export default getters

import { router } from './router'
//全局导航钩子
router.beforeEach((to, from, next) => {
	// #ifdef H5 || APP-PLUS

	// #endif
	next()
})
// router.afterEach((to, from) => {
// 	console.log(2);
// })
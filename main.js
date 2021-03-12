import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import store from './store'
import Router,{ RouterMount } from 'uni-simple-router'
import { http } from './common/utils/lush';
Vue.prototype.$http = http;
Vue.prototype.$store = store;

Vue.use(Vuex)
Vue.config.productionTip = false

// import './static/font/iconfont.css'
// import './common/css/public.scss'//引入一些公用的样式
import './common/router/routerFilter'
Vue.use(Router)

App.mpType = 'app'

//导入过滤器
import filters from './filter'
//过滤器统一处理加载
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//挂载七牛地址
Vue.prototype.$qiniu='https://pic.paitume.com/'

//引入工具方法
import * as util from './common/utils/util.js';
Vue.prototype.util = util;

import IM from './common/utils/im'
Vue.prototype.$IM = IM;

//util.listenMsg();

//导入全局config变量
import * as config from './common/utils/config.js'
Vue.prototype.config = config;
Vue.prototype.$qiniuHost = config.qiniuHost;
//导入全局组件，空白页面
import emptyShow from './components/empty-show/noData.vue';
Vue.component('noData', emptyShow);

const app = new Vue({
    store,
    ...App
})
// #ifdef H5
RouterMount(app, '#app');
// #endif
// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif


// #ifdef APP-PLUS

import * as updateApp from './common/utils/updateApp.js'
updateApp.androidCheckUpdate()
// #endif

export default app

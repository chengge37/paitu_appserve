import Vue from 'vue'
import Router from 'uni-simple-router'
export const router = new Router({
    encodeURI: false,
    routes: [{
            path: "/pages/tabBar/home",
            name: "home"
        },
        {
            path: "/pages/tabBar/order",
            name: "order"
        },
        {
            path: "/pages/tabBar/schedule",
            name: "schedule"
        },
        {
            path: "/pages/tabBar/message",
            name: "message"
        },
        {
            path: "/pages/tabBar/me",
            name: "me"
        },
        {
            path: "/pages/login/index",
            name: "login"
        },
        {
            path: '/pages/my/index',
            name: 'my'
        },
        {
            path: "/pages/my/safe",
            name: 'safe'
        },
        {
            path: "/pages/my/feedback",
            name: "feedback"
        },
        {
            path: '/pages/order/orderDetail',
            name: 'orderDetail'
        },
        {
            path: '/pages/order/orderMore',
            name: 'orderMore'
        },
        {
            path: '/pages/order/operateHistory',
            name: 'operateHistory'
        },
        {
            path: '/pages/order/selectEquip',
            name: 'selectEquip'
        },
        {
            path: '/pages/order/clientList',
            name: 'clientList'
        },
        {
            path: '/pages/finance/index',
            name: 'finance'
        },
        {
            path: '/pages/search/index',
            name: 'search'
        },
        {
            path: "/pages/todo/index",
            name: 'addTodo'
        },
        {
            path: "/pages/schedule/preview",
            name: 'schedulePreview'
        },
        {
            path: "/pages/order/addOrder",
            name: 'addOrder'
        },
        {
            path: "/pages/order/checkList",
            name: 'checkList'
        },
        {
            path: "/pages/order/operateAgree",
            name: 'operateAgree',
        },
        {
            path: "/pages/schedule/newSchedule",
            name: 'schedule'
        },
        {
            path: "/pages/client/addClient",
            name: 'addClient'
        },
		{
		    path: "/pages/employee/index",
		    name: 'addEmployee'
		}
    ]
})
Vue.prototype.$Router = Router
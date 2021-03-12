//登陆
export const users = {
  login: '/user/ajaxAccountLoginByMobile', //登录
  reg: '/users/register', //注册
  UpdateUserData: '/user/editUserMsgBase',
  uploadUserAppPushToken:'/user/uploadUserAppPushToken',//上传PUSH TOKEN
}

//首页日历相关的代办
export const calendar = {
  getByMonth: '/job/serveGetCountByMonth',
  getByDay: '/job/serveGet'
}

// 员工管理模块
export const employee = {
  getGroup: '/employee/serveGetGroup', // 获取员工分组
  addGroup: '/employee/serveAddGroup', // 添加员工分组
  updateGroup: '/employee/serveEditGroup', // 更新员工分组
  delGroup: '/employee/serveDelGroup', // 删除员工分组
  getAll: '/employee/serveGet', // 获取员工
  add: '/employee/empAdd', // 添加员工
  update: '/employee/empEdit', // 更新员工
  del: '/employee/empDel' // 删除员工
}

//客户/分组模块
export const customer = {
  eidtGroup: '/customer/serveAddAndEditGroup', //添加或修改客户分组
  getGroup: '/customer/serveGetGroup', //商家获取客户分组
  delGroup: '/customer/serveDelGroup', //商家删除客户分组
  addCustomer: '/customer/serveAdd', //商家添加客户
  editCustomer: '/customer/serveEdit', //商家修改客户
  delCustomer: '/customer/serveDel', //商家删除用户
  getCustomer: '/customer/serveGet', //商家获取客户列表
  getCustomerSimple: '/customer/serveGetAllSimple', //根据分组获取相关客户数据(简单数据)
}

// 订单模块
export const order = {
  getDSOrder: '/order/orderGet', // 获取设备影棚订单列表(租赁订单)
  getAOrder: '/activity/serveGet', // 获取活动订单
  getOrder: '/order/serveGet', // 获取订单列表
  acceptOrder: '/order/serveAccept', //商家接单
  rejectOrder: '/order/serveReject', //商家拒单
  updatePrice: '/order/serveUpdatePrice', //商家修改订单价格
  updateOrder:'/order/serveEdit', //商家修改线下订单
  delOrder: '/order/serveDel', //商家删除线下订单
}

// 退款接口
export const refund = {
  ajaxUserRefundOrderDetail: '/orderRefund/ajaxUserRefundOrderDetail', // 退款查询(用户/商家)
  userRefundAppeal: '/orderRefund/userRefundAppeal', // 退款申诉(用户)
  serveRefundAnswer: '/orderRefund/serveRefundAnswer' // 退款审核(商家)
}

// 设备
export const equip = {
  scanInOut: '/equip/serveInOut', // 扫码出入库
  inOutStatus: '/equip/serveGetInOut', //获取出入库状态
  getOrder: '/order/orderGet', // 获取订单列表
  addOrder: '/order/serveAdd', //添加线下订单
  getOrderDetail: '/order/userGetDetail', //获取订单详情
  equipList: '/equip/ajaxGetEquipList', //商家获取影棚列表

}

//影棚模块
export const studio = {
  studioList: '/studio/ajaxGetStudioList', //商家获取影棚列表
}


//协议模块
export const agree = {
  getAgreeList: '/order/serveGetCheckTplList', //获取协议模板列表
  getAgreeDetail: '/order/serveGetCheckTpl', //获取协议模板详情
  addAgree: '/order/serveAddCheckTpl', //添加协议模板
  editAgree: '/order/serveEditCheckTpl', //修改协议模板
  delAgree: '/order/serveDelCheckTpl', //删除协议模板
}

//核验单模块
export const check = {
  addCheck: '/order/serveAddCheck', //添加核验单
  getCheck: '/order/serveGetCheck', //商家获取核验单
  editCheck: '/order/serveEditCheck', //商家修改核验单
}

//财务模块
export const finance = {
  financeAll: '/finance/serveGetFinance', //获取商家支出列表
  financeType: '/finance/serveTypeGet', //获取收入/支出类别
  financePeriod: '/finance/serveGetSummaryGroupByMonthOfYear', //获取指定年份收入支出数据
}

//订单统计数据信息
export const orderNum = {
  orderInfo: '/analysis/ajaxGetServerHome', //获取首页统计数据
}

//---------------------工作模块-------------
export const job={
	add:'/job/serveAdd',   //商家添加工作
	jobDetail:'/job/serveGetJobDetail',  //商家获取工作详情
	updateJob:'/job/serveEdit',  //商家修改工作
	delJob:'/job/serveDel',   //商家删除工作
}

// 个人中心通知消息接口
export const message = {
  getMsgList: '/notice/userGetList',
  getReadMsg: '/notice/userGetDetail',
  delMsg: '/notice/userDelnotic',
  hasRead: '/notice/userEditnoticRead'
}

//------用户意见反馈模块----------
export const feedback = {
  addFeedback: '/feedback/ajaxAddFeedback', //用户反馈问题
}

// 获取app版本
export const appVersion = {
	get:'/user/ajaxGetServeAndroidAppVersion'
}
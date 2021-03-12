var timestamp = Date.parse(new Date())/3600;
export const qiniuHost = "https://pic.paitume.com/";
export const defaultEquipPic = 'images/miniapp/defaultEquipPic.png?v='+timestamp;
export const defaultStorePic="images/storeLogo.png?v="+timestamp;
export const errorPic="images/miniapp/errorPic.png?v="+timestamp;
export const defaultAvatar="images/male.png?v="+timestamp;
export const camera="images/miniapp/camera.png?v="+timestamp;
export const studio="images/miniapp/studio.png?v="+timestamp;
export const coupon="images/miniapp/coupon.png?v="+timestamp;
export const shop_coupon="images/miniapp/blue_coupon.png?v="+timestamp;
export const discountbg="images/miniapp/discount-bg.png?v="+timestamp;
export const recmShop="images/miniapp/recm_shop.png?v="+timestamp;
export const shopIcon="images/miniapp/shop_icon.png?v="+timestamp;
export const noData="暂无数据";
export const contract="images/miniapp/contract.jpg?v="+timestamp;
export const HRentFlow="images/miniapp/h_rent_flow.png?v="+timestamp;
export const HPickFlow="images/miniapp/h_pick_flow.png?v="+timestamp;
export const HRentQus="images/miniapp/h_rent_qus.png?v="+timestamp;
export const RentFlow="images/miniapp/rent_flow.png?v="+timestamp;
export const AlipayRentFlow="images/miniapp/alipayFlow.png?v="+timestamp;
export const PickFlow="images/miniapp/pick_flow.png?v="+timestamp;
export const bannerHome="images/miniapp/banner_home.png?v="+timestamp;
export const myAdvertise="images/miniapp/myAdvertise.png?v="+timestamp;
export const myOfficial="images/miniapp/myOfficial.png?v="+timestamp;
export const OfficialCode="images/miniapp/official_code.png?v="+timestamp;
export const bannerHome5="images/miniapp/workBooster.png?v="+timestamp;
export const PageBanner5="images/miniapp/p_home_banner5.png?v="+timestamp;
export const bannerHome3="images/miniapp/yiqingBanner2.png?v="+timestamp;
export const PageBanner3="images/miniapp/p_home_banner3.png?v="+timestamp;
export const feiyan="images/feiyan.png?v="+timestamp;
export const bannerHome0="images/miniapp/vone_min.png?v="+timestamp;
export const bannerHome6="images/miniapp/feisiBanner_min.png?v="+timestamp;

export const baseUrl = 'http://192.168.0.2/api';
export const socketUrl = 'ws://192.168.0.2:9502/';

// export const baseUrl = 'https://www.paitume.com/api';
// export const socketUrl = 'wss://paitume.com/wss';


export const OrderStatus = {
	OrderStatusCancel: 0,
    OrderStatusWaitPay: 1,
    OrderStatusPaid: 2,
    OrderStatusConfirm: 3,
    OrderStatusRejecting: 4,
    OrderStatusRejected: 5,
    OrderStatusIng: 6,
    OrderStatusWaitComment: 7,
    OrderStatusDone: 8
}
export const getOrderStatusText = function (OrderStatusCode) {
    let OrderStatusCodeInt = parseInt(OrderStatusCode);
    switch (OrderStatusCodeInt) {
		case OrderStatus.OrderStatusCancel:
		    return '已取消';
        case OrderStatus.OrderStatusWaitPay:
            return '待支付';
        case OrderStatus.OrderStatusPaid:
            return '已支付';
        case OrderStatus.OrderStatusConfirm:
            return '已确认';
        case OrderStatus.OrderStatusRejecting:
            return '退款中';
        case OrderStatus.OrderStatusRejected:
            return '已拒绝完毕';
        case OrderStatus.OrderStatusIng:
            return '进行中';
        case OrderStatus.OrderStatusWaitComment:
            return '等待评论';
        case OrderStatus.OrderStatusDone:
            return '已完成';
    }
}

export const conditionArray = [{
	"id": 1,
	"name": "化妆间",
	"icon": "iconfont icon-huazhuangpin"
}, {
	"id": 2,
	"name": "空调",
	"icon": "iconfont icon-kongtiao"
}, {
	"id": 3,
	"name": "WIFI",
	"icon": "iconfont icon-wuxianwang"
}, {
	"id": 4,
	"name": "休息室",
	"icon": "iconfont icon-xiuxi"
}, {
	"id": 5,
	"name": "灯光",
	"icon": "iconfont icon-dengpao"
}, {
	"id": 6,
	"name": "音响",
	"icon": "iconfont icon-yinxiang"
}, {
	"id": 7,
	"name": "停车场",
	"icon": "iconfont icon-tingchechang"
}, {
	"id": 8,
	"name": "投影设备",
	"icon": "iconfont icon-projector"
}, {
	"id": 9,
	"name": "餐饮",
	"icon": "iconfont icon-canting"
}, {
	"id": 10,
	"name": "咖啡厅",
	"icon": "iconfont icon-canting"
}, {
	"id": 11,
	"name": "仓库",
	"icon": "iconfont icon-canting"
}, {
	"id": 12,
	"name": "洗浴间",
	"icon": "iconfont icon-canting"
}];

export const pricesRange = [{
		name: '不限',
		active: true,
		type: 0
	}, {
		name: '￥100以下',
		active: false,
		type: 1
	},
	{
		name: '￥100-￥200',
		active: false,
		type: 2
	},
	{
		name: '￥200-￥300',
		active: false,
		type: 3
	},
	{
		name: '￥300以上',
		active: false,
		type: 4
	},
];

export const defaultCity={
					"id": "1212",
					"city": "全国",
					"code": "0",
					"province": "不限",
					"province_code": "441212"
				};
export const amapKey="54415fdc36fc265203ed1dc5d456438d";

//-----------------模特--------------------
//模特类型
export const modelTypeList = [
	{id:1,name:'时装模特'},
	{id:2,name:'商用模特'},
	{id:3,name:'内衣模特'},
	{id:4,name:'试衣模特'},
	{id:5,name:'部件模特'},
	{id:6,name:'特型模特'},
	{id:7,name:'T台模特'},
	{id:8,name:'人体模特'},
	{id:9,name:'彩绘模特'},
	{id:10,name:'车模'},
	{id:11,name:'房模'},
	{id:12,name:'表演模特'},
	{id:13,name:'站位模特'},
	{id:14,name:'肢体模特'},
	{id:15,name:'童模'},
	{id:16,name:'外模'},
	{id:17,name:'中老年模特'},
	{id:18,name:'平面模特'},
	{id:19,name:'影视模特'}
 ];
 
 //拍摄风格
 export const shootingTypeList=[
	 {id:1,name:'运动'},
	 {id:2,name:'OL'},
	 {id:3,name:'日韩'},
	 {id:4,name:'街头'},
	 {id:5,name:'甜美'},
	 {id:6,name:'英伦'},
	 {id:7,name:'中国风'},
	 {id:8,name:'孕妇装'},
	 {id:9,name:'复古'}
 ];
 
 //拍摄行业
 export const shootIndustryList=[
	 {id:0,name:'家装家饰'},
	 {id:1,name:'3C数码'},
	 {id:2,name:'内衣泳装'},
	 {id:3,name:'鞋帽箱包'},
	 {id:4,name:'其他'},
	 {id:5,name:'服饰配件'},
	 {id:6,name:'美容美发'},
	 {id:7,name:'食品保健'},
	 {id:8,name:'母婴玩具'},
	 {id:9,name:'珠宝首饰'},
 ];
 
 //拍摄方式
 export const shootMethodList=[
	 {id:0,name:'实景棚拍'},
	 {id:1,name:'纯色背景棚拍'},
	 {id:2,name:'外景拍摄'},
	 {id:3,name:'平铺/挂拍'},
	 {id:4,name:'其他'},
	 {id:5,name:'景物拍摄'}
 ];
 
 
 //摄影师技能
 export const photoerSkillList=[
	 {id:0,name:'拍照'},
	 {id:1,name:'视频'},
	 {id:2,name:'后期'},
 ];
 
 //export const modelType = [
 // '时装模特','商用模特','内衣模特','试衣模特','部件模特','特型模特','T台模特','人体模特','彩绘模特','车模','房模',
 //	'表演模特','站位模特','肢体模特','童模','外模','中老年模特','平面模特','影视模特'
 //];
 
 //export const shootingType=[
 //	'运动','OL','日韩','街头','甜美','英伦','中国风','孕妇装','复古'
 //];
 
 
 //语言类型
 export const languageType=[
	 '普通话','粤语','英语','其他'
 ];
 
 //国籍
 export const nationType=[
	 {id:1,name:'中国'},
	 {id:2,name:'乌克兰'},
	 {id:5,name:'美国'},
	 {id:6,name:'俄罗斯'},
 ]
 
 //皮肤肤色类型
 export const skinType=[
	 {id:1,name:'白色'},
	 {id:2,name:'黄色'},
	 {id:3,name:'黑色'},
 ]
 
 //脸型类型
 export const faceType=[
	 {id:1,name:'圆脸'},
	 {id:2,name:'长脸'},
	 {id:3,name:'瓜子脸'},
 ]
 
 //发型类型
 export const hairType=[
	 {id:1,name:'直长发'},
	 {id:2,name:'短发'}
 ]
 
 //眼睛类型
 export const eyeType=[
	 {id:1,name:'单眼皮'},
	 {id:2,name:'双眼皮'},
 ]
 
 
 //--------------短视频-------------
 //短视频服务行业
 export const sVideoServiceList=[
	 {id:0,name:'内衣泳装'},
	 {id:1,name:'汽车'},
	 {id:2,name:'美妆洗护'},
	 {id:3,name:'其他'},
	 {id:4,name:'旅游'},
	 {id:5,name:'女装'},
	 {id:6,name:'男装'},
	 {id:7,name:'图书'},
	 {id:8,name:'童装'},
	 {id:9,name:'日用百货'},
	 {id:10,name:'鞋子箱包'},
	 {id:11,name:'家装家纺'},
	 {id:12,name:'运动户外'},
	 {id:13,name:'食品保健'},
	 {id:14,name:'数码家电'},
	 {id:15,name:'母婴玩具'},
	 {id:16,name:'珠宝首饰'},
 ];
 
 
 //---------------------红人服务模块------------
 //红人类别
 export const redMTypeList=[
	 {id:0,name:'微博博主'},
	 {id:1,name:'明星名人'},
	 {id:2,name:'直播网红'},
	 {id:3,name:'网络红人'},
 ];
 
 //粉丝数量
 export const fansCountList=[
	 {id:0,name:'1万以下'},
	 {id:1,name:'1-5万'},
	 {id:2,name:'5-10万'},
	 {id:3,name:'10-20万'},
	 {id:4,name:'20-50万'},
	 {id:5,name:'50-100万'},
	 {id:6,name:'100万以上'},
 ];
 
 
 //价格
 export const fansPriceList=[
	 {id:0,name:'2000以下'},
	 {id:1,name:'2000-5000'},
	 {id:2,name:'5000-1万'},
	 {id:3,name:'1万-5万'},
	 {id:4,name:'5万-10万'},
	 {id:5,name:'10万-20万'},
	 {id:6,name:'20万以上'},
 ];

 //拼拍拍摄类型
export const pinpaiType=[
    {id:1,name:'服装服饰'},
	{id:2,name:'内衣泳装'},
	{id:3,name:'鞋帽箱包'},
	{id:4,name:'食品保健'},
	{id:5,name:'珠宝服饰'},
	{id:6,name:'家居家装'},
	{id:7,name:'美妆洗护'},
	{id:8,name:'3C数码'},
]
//拼拍拍摄风格
export const pinpaiWay=[
    {id:1,name:'运动'},
	{id:2,name:'OL'},
	{id:3,name:'日韩'},
	{id:4,name:'街头'},
	{id:5,name:'英伦'},
	{id:6,name:'中国风'},
	{id:7,name:'孕妇装'},
	{id:8,name:'复古'},
	{id:9,name:'其他'},
]
//拼拍拍摄分类
export const pinpaiClassify=[
    {id:1,name:'室内纯色背景'},
	{id:2,name:'室内实景'},
	{id:3,name:'外拍实景'},
	{id:4,name:'其他'},
]
//拼拍拍摄对象
export const pinpaiObj=[
    {id:1,name:'无需模特'},
	{id:2,name:'自带模特'},
	{id:3,name:'提供模特'},
]
//拼拍服务标签
export const pinpaiLabel=[
    {id:1,name:'延迟退款'},
	{id:2,name:'不满意重拍'},
]


 
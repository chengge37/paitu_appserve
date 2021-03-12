// 必须独立出来，否则SDK会重复声明，鬼知道为什么
// #ifndef MP-ALIPAY
export var AV = require("leancloud-storage");
var APP_ID = "FopplxMIbowedHTR8yseJjGs-gzGzoHsz";
var APP_KEY = "0MWelPMmKtpDIiEJAP871OP1";
AV.init({
    appId: APP_ID,
    appKey: APP_KEY,
    serverURLs: "https://leancloud.paitume.com"
});
// #endif
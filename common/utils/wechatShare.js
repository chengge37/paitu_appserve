import {http} from './lush'; //笔者自己封装的网络请求类，也可以直接使用uni.request  
var jweixin = require('jweixin-module');  

export default {  
        //判断是否在微信中  
    isWechat:function(){  
        var ua = window.navigator.userAgent.toLowerCase();  
        if(ua.match(/micromessenger/i) == 'micromessenger'){  
            return true;  
        }else{  
            return false;  
        }  
    },  
        //初始化sdk配置  
    initJssdk:function(callback ,url){  
        //服务端进行签名  
        http.post('/wx/ajaxGetJsApiTicket',{url:url}).then(res => {
            if(res){
				let nowUrl = window.location.href;
				let wechaturl = window.location.href.split('#')[0];
				if(callback){ 
					callback(res);  
				} 
            }
        }).catch(err => {
            // alert('获取微信JS签名失败'+JSON.stringify(err));
        }); 
    },  
    //在需要自定义分享的页面中调用  
    share(data ,url){  
        url =url ? url :window.location.href;  
        if(!this.isWechat()){
            // alert('不是微信')  
            return ;  
        }  
        //每次都需要重新初始化配置，才可以进行分享  
        this.initJssdk(function(signData){
			let configParameter = {
			    debug: false,  
			    appId: signData.appId,  
			    timestamp:signData.timestamp,  
			    nonceStr: signData.nonceStr,  
			    signature:signData.signature,  
			    jsApiList: [  
			        'checkJsApi',  
					'updateAppMessageShareData',
			        'updateTimelineShareData',
				]};
			jweixin.config(configParameter);
            jweixin.ready(function() {  
				jweixin.checkJsApi({
				  jsApiList: ['updateTimelineShareData','startRecord'],
				  success: function(checkRes) {
				      //alert('checkRes = ' +JSON.stringify(checkRes))
					  //这里判断一下 如果不支持alert吧 就不用老接口了
				  }
				});
                var shareData = {  
                     title: data&&data.title ? data.title: 'signData.site_name',  
                     desc: data&&data.desc ? data.desc: 'signData.site_description',  
                     link: url,  
                     imgUrl: data&&data.img ?data.img :'signData.site_logo',  
                     success: function (res) {  
                        console.log('---jweixin.ready-success----')    
                        // alert('分享初始化成功' + JSON.stringify(res))
                     }, 
                     fail:function(err){
                        console.log('---jweixin.ready-fail----')    
                        // alert('分享初始化失败'+JSON.stringify(err))
                     }, 
                     cancel: function (res) {  
                     }  
                 };  
                 //分享给朋友接口  
                 jweixin.updateAppMessageShareData(shareData);  
                 //分享到朋友圈接口  
                 jweixin.updateTimelineShareData(shareData);  
            }); 
            
        } ,url);  
    }  
}
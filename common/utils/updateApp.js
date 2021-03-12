import { http } from './lush'
import { appVersion }  from '../api/api'

export const androidCheckUpdate = ()=>{
    let current_version = plus.runtime.version;
    http.get(appVersion.get).then(res => {
        console.log('androidCheckUpdate----',res)
        console.log('androidCheckUpdate--url--',res.android_app_url)
        var url = res.android_app_url;
        let server_version = res.android_app_version
        if(current_version!=server_version){
            checkVersionToLoadUpdate(url)
        }
    })
}

function checkVersionToLoadUpdate(url){
    uni.showModal({
        title: "版本更新", 
        content: '有新的版本发布，是否立即进行新版本下载？',
        confirmText:'立即更新',
        cancelText:'稍后进行',
        success: function (res) {
            if (res.confirm) {
                plus.nativeUI.showWaiting("下载更新文件..."); 
                var dtask = plus.downloader.createDownload( url, {}, function ( d, status ) {  
                        // 下载完成  
                        if ( status == 200 ) {   
                            console.log("d.filename--",d.filename);
                            plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename),{},{},
                            function(error){  
                                uni.showToast({  
                                    title: '安装失败', 
                                    duration: 1500  
                                });  
                            })
                        } else {  
                             uni.showToast({  
                                title: '更新失败',
                                duration: 1500  
                             });  
                        }
                        plus.nativeUI.closeWaiting();      
                    });  
                dtask.start();
            } else if (res.cancel) {
                console.log('稍后更新');
            }
        }
    });
}
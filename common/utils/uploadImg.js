import {
	http
} from './lush'
import store from "@/store/index.js"

//#ifdef H5
import * as qiniu from 'qiniu-js'
//#endif
//#ifdef APP-PLUS
//#endif
function uploadImg() {
	return new Promise((resolve, reject) => {
		
		uni.chooseImage({
			count: 1, 
			sizeType: ['compressed'],
			success: chooseImageRes => {
				let url = chooseImageRes.tempFilePaths[0];
				console.log('ChooseURL ', url)
				let timestamp = new Date().valueOf();
				let pickey = '';
				if (url.indexOf('blob:') == -1) {
					//非浏览器
					let ret = url.lastIndexOf(".");
					pickey = timestamp + url.slice(ret, url.length);
				} else {
					pickey = timestamp + '.jpg'
				}

				http
					.get("/qiniu/userGetQiniuUpToken?key=" + pickey)
					.then(res => {
						resolve(saveInQiniu(res, url));
					}).catch(err => {
						reject(err)
					});
			}
		});
	})

}
function uploadBase64Img(url) {
	return new Promise((resolve, reject) => {
		
		let timestamp = new Date().valueOf();
		let pickey = timestamp + '.jpg'
		http
		.get("/qiniu/userGetQiniuUpToken?key=" + pickey)
		.then(res => {
			resolve(saveInQiniu(res, url));
		}).catch(err => {
			reject(err)
		});
		
	})

}
function saveInQiniu(data, url) {
	//#ifdef MP-WEIXIN || MP-ALIPAY
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: "https://upload-z2.qiniup.com",
			name: "file",
			filePath: url,
			header: {
				"Content-Type": "multipart/form-data"
			},
			formData: {
				token: data.token,
				key: data.key
			},
			success: function(res) {
				let data = JSON.parse(res.data);
				let info = {
					key: data.key,
					url: url
				}
				console.log('上传七牛成功 返回----', info);
				resolve(info.key);
			},
			fail: function(res) {
				console.log('上传七牛成功 错误', res);
				reject(res);
			}
		});
	})
	//#endif
	
	//#ifdef APP-PLUS || H5 
	console.log('保存到七牛 APP' + url + JSON.stringify(data));

	return new Promise((resolve, reject) => {
		let updateData = {
			url: 'https://up-z2.qiniup.com/',
			name: 'file',
			filePath: url,
			formData:{
				key:data.key,
				token:data.token
			},
			header: {
			},
			success: (uploadFileRes) => {
				console.log('uploadFileRes.data.key = ',uploadFileRes.data.key)
				if(uploadFileRes.statusCode == 200){
					console.log('qiniu 200',uploadFileRes)
					let qiniuJSON = uploadFileRes.data;
					let obj = JSON.parse(qiniuJSON);
					resolve(obj.key);
				} else {
					reject(new Error('上传失败'));
				}
			},
			fail: (err) => {
				console.log('失败' + JSON.stringify(err));
				reject(new Error('上传失败'));
			}
		}
		uni.uploadFile(updateData);
	})
	//#endif
}


export {uploadImg,uploadBase64Img}
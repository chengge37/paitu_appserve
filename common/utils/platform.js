import { weixin } from '../login/login'
function getMyPlatform(){
	switch(uni.getSystemInfoSync().platform){    
		case 'android':
	 	break;
		case 'ios':
		console.log('运行iOS上')     
		break;    
		default:
		console.log('运行在开发者工具上')    
		break;
	}
	
}

export default getMyPlatform();
import { collectOrFollow }  from '../api/api'
import {http} from './lush'



//----------------------收藏，关注模块----------------------------

//方法：  收藏影棚,设备，活动（取消）
//to_uid：商家id，对应y_user表中的id字段
//type：0表示店铺本身，1表示影棚，2表示设备，3表示活动 4模特 5拼拍
//obj:	1表示收藏，2表示关注 
//relation_id:当type为0时表示关注的是店铺，本字段为0；如果关注的是影棚则本字段为影棚id；如果关注的是设备，则本字段表示设备id ；如果关注的是活动，则本字段表示活动id
//return promise 1/收藏影棚（设备）成功 2/取消影棚（设备）成功
export const collectOther=(to_uid,type,obj,relation_id)=>{
	return new Promise((resolve,reject)=>{
		// 判断  relation_id=0为店铺
		let obj_id = relation_id?relation_id:to_uid;

		console.log('obj_id',obj_id)
		//判断是否已经收藏
		getUserLsObj(obj_id,type,obj).then(res=>{
			let url,params,message;
			if(res){
				url=collectOrFollow.userUnCollectOrFollow;
				params={
					type:type,
					obj:obj,
					relation_id:obj_id,
				}
				if(type==1){
					message='取消收藏影棚成功！';
				}else if(type==2){
					message='取消收藏设备成功！';
				}else if(type==0){
					message='取消收藏商店成功！';
				}
				else if(type==3){
					message='取消收藏活动成功！';
				}
				
			}else{
				url=collectOrFollow.userCollectOrFollow;
				params={
					to_uid:to_uid,
					type:type,
					obj:obj,
					relation_id:obj_id,
				}
				if(type==1){
					message='收藏影棚成功！';
				}else if(type==2){
					message='收藏设备成功！';
				}else if(type==0){
					message='收藏商店成功！';
				}else if(type==3){
					message='收藏活动成功！';
				}

			}
			
			console.log('params----',params);
			http.post(url,params).then(res => {
				uni.showToast({title: message,icon: 'success'});
				if(res){
					resolve(1);
				}else{
					resolve(0);
				}
			}).catch(err => {
				reject(false);
			})
			
		}).catch(err=>{})
		
	})
}


//获取是否收藏，关注
export const getUserLsObj=(relation_id,type,obj)=>{
	let params={
		relation_id:relation_id,  //对象id
		type:type,  //0表示店铺本身，1表示影棚，2表示设备，3表示活动
		obj:obj,   //1表示收藏，2表示关注
	};
	return new Promise((resolve,reject)=>{
        http.get(collectOrFollow.isCollectOrFollow,params).then(res =>{
            console.log('getLsObjById---------',res);
			resolve(res)
        }).catch(err => {
            reject(false);
            console.log('errrr',err)
	    });
	})
}



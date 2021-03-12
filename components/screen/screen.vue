<template>
  <view class="wrap" @touchMove.stop.prevent="stopScroll">
    <div class="content" :class="{'to-right':showSide}">
      <div class="group-wrap" @touchMove.stop.prevent="stopScroll">
        <div class="group" v-for="(item,index) in initOptions" :key="index">
          <div class="title">
            <span>{{item.groupName}}</span>
            <span>{{item.checkMore?'（多选）':'（单选）'}}</span>
          </div>
          <div class="item-wrap">
            <span class="item" :class="{'item-checked':item2.checked}" v-for="(item2,index2) in item.itemArr" :key="index2" @tap="select(item2,index2,item)">{{item2.label}}</span>
          </div>
        </div>
      </div>
      <!-- <span @tap="hideScreen">关闭</span> -->
      <div class="bottom-btn">
        <span @tap="reset">重置</span>
        <span @tap="confirm">确定</span>
      </div>
    </div>
	<div class="close" @tap="confirm">
		X
	</div>
  </view>
</template>

<script>
  export default {
	  props:{
	  	params:{
	  		type:Object,
	  		default:null,
	  	}
	  },
    data(){
      return{
        showSide:false,
        initOptions:[
        	{
        	  groupName:'类型',
        	  checkMore: false,
			  index:'0',
        	  itemArr:[
				  {
				    label:'全部',
				    value:-1,
				    checked:true
				  },
        	    {
        	      label:'收入',
        	      value:1,
        	      checked:false
        	    },
        	    {
        	      label:'支出',
        	      value:0,
        	      checked:false
        	    },
        	   
        	  ]
        	},
          {
            groupName:'类别',
            checkMore: true,
			index:'1',
            itemArr:[],
          },
         
        ],
		options:null, //选择的参数
		type:-1,  //-1/全部，0/收入，1/支出
		categoryList:[],  //类别列表数据
      }
    },
	watch:{
		
	},
    created(){
		//获取收入支出类别
		this.financeType();
		if(this.params){
			this.loadOption();
		}
    },
    mounted(){
      setTimeout(()=>{
        this.showSide=true
      },80)
    },
    methods:{
		//加载选项
		loadOption(){
			// this.loadType();
			if(!this.params) return;
			
			this.type=this.params.type;
			this.initOptions[0].itemArr.forEach((item,index)=>{
				if(item.value==this.type){
					item.checked=true;
				}else{
					item.checked=false;
				}
			})
			
			//如果有传参过来参数
			if(this.params.category.length>0){
				this.params.category.forEach((item,index)=>{
					this.initOptions[1].itemArr.forEach((item2,index2)=>{
						if(item2.value==item){
							item2.checked=true;
						}
					})
				})
			}
		},
		
		//获取收入支出类别
		financeType(){
			this.util.financeType().then(res=>{
				this.categoryList=res;
				this.loadType();
				this.loadOption();
				
			})
		},
		
		//加载对应类别
		loadType(){
			console.error('loadType------=',this.type);
			this.initOptions[1].itemArr=[];
			this.categoryList.forEach((item,index)=>{
				let obj={
					label:item.name,
					value:item.id,
					checked:false
				}
				if(this.type==-1){
					this.initOptions[1].itemArr.push(obj);
				}else if(item.is_in==this.type){
					this.initOptions[1].itemArr.push(obj);
				}
			})
		},
		
      stopScroll(){
        return
      },
	  
      hideScreen(){
        this.$emit('hideScreen')
      },
	  
	  //选择选项方法
      select(item2,index2,item){
		// let type;
		//点击分类选择
		if(item.index==0){
			//如果是点击当前选项，跳出
			if(item2.checked){
				return;
			}else{
				// 单选
				for(let i in item.itemArr){
				  item.itemArr[i].checked=false
				}
				item2.checked=true;
			}
			item.itemArr.forEach((item,index)=>{
				if(item.checked){
					this.type=item.value;
				}
			})
			this.loadType();
		}
		
		
        if(item.checkMore){
          // 多选
          item2.checked=!item2.checked
        }
		
      },
	  
	  //获取选中的类型和类别
	  getParams(){
		this.options={
			type:-1,
			category:[],
		}
		this.initOptions[0].itemArr.forEach((item,index)=>{
			if(item.checked){
				this.options.type=item.value;
			}
		})
		this.initOptions[1].itemArr.forEach((item,index)=>{
			if(item.checked){
				this.options.category.push(item.value);
			}
		})
		console.error('options----------------',this.options);
	  },
	  
	  //重置参数方法
      reset(){
		this.initOptions[0].itemArr.forEach((item,index)=>{
			if(item.value==-1){
				item.checked=true;
			}else{
				item.checked=false;
			}
		})
		this.initOptions[1].itemArr.forEach((item,index)=>{
			item.checked=false;
		})
		this.type=-1;
		this.loadType();
      },
	  
	  //点击确定返回参数方法
      confirm(){
		 this.getParams();
        this.$emit('confirm',this.options);
      },
      
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
  font-size: 28rpx;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0,0,0,.5);
  z-index: 9999999999;
  .content{
    position: absolute;
    right: 0;
    width: 632rpx;
    height: 100%;
    background: #fff;
    transform: translateX(100%);
    transition: all linear 0.2s;
    .group-wrap{
      height: calc(100% - 100rpx);
      overflow-y: auto;
      padding-bottom: 80rpx;
      box-sizing: border-box;
      .group{
        padding: 26rpx 24rpx 0;
        box-sizing: border-box;
        margin-bottom: 14rpx;
        .title{
          span:first-child{
            font-size: 30rp;
            color: #333;
          }
          span+span{
            font-size: 26rpx;
            color: #999;
          }
        }
        .item-wrap{
          display: flex;
          flex-wrap: wrap;
          padding-top: 14rpx;
          box-sizing: border-box;
          .item{
            width: calc((100% - 36rpx)/3);
            height: 60rpx;
			line-height:60rpx;
            margin-right: 18rpx;
            margin-bottom: 14rpx;
            border-radius: 8rpx;
            border: 1px solid #F2F2F6;
            box-sizing: border-box;
            // display: flex;
            justify-content: center;
            align-items: center;
			white-space: nowrap;
			text-overflow:ellipsis;
			overflow: hidden;
			text-align: center;
			padding:0rpx 6rpx;
          }
          .item:nth-child(3n){
            margin-right: 0;
			padding:0rpx 6rpx;
			white-space: nowrap;
			text-overflow:ellipsis;
			overflow: hidden;
			text-align: center;
          }
          .item:nth-last-child(-n+3){
            margin-bottom: 0;
          }
          .item-checked{
            background: #F6F1FF;
            color: #7842EB;
            border:1px solid rgb(120,66,235);
          }
        }
      }
    }
    .bottom-btn{
      width: 100%;
      height: 100rpx;
      position: fixed;
      bottom: 0;
      display: flex;
      span{
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
        color: #999;
      }
      span:last-child{
        background: #7842EB;
        color: #fff;
      }
    }
  }
  .to-right{
    transform: translateX(0);
  }

}
.close{
	position: absolute;
	right: 650rpx;
	color: #fff;
	border: 1px solid #fff;
	border-radius: 50%;
	font-size: 32rpx;
	width:60rpx;
	height:60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	top:50%;
	padding: 10rpx 24rpx;
	transform: translate(0%,-50%);
}
</style>
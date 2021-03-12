// 把IMclient对象挂载到全局
export default {
  IM:null,
  setIM(data){
      // this.IM = Object.assign({},this.IM,data) 
      this.IM = data
  },
}
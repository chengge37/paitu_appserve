<template>
	<view class="content">
        <div>
            <input type="text" v-model="login_form.mobile" placeholder="请输入用户名">
            <input type="text" v-model="login_form.pwd" placeholder="请输入密码">
            <input type="text" v-model="reinput_pwd" placeholder="请重复输入密码" v-if="!type">
        </div>
        <div v-text="type==1?'未有账号，去注册':'已有账号，去登陆'" @click="switchType"></div>
		<button @click="comfirm">确认</button>
	</view>
</template>

<script>
import { users } from '@/common/api/api'
import { mapState } from "vuex";
	export default {
		data() {
			return {
                type:1,//1登录,2注册
                login_form:{
                    mobile:'',
                    pwd:''
                },
                reinput_pwd:''
			}
        },
        computed: {
            ...mapState(["user"])
        },
		onLoad() {
			// this.addUser()
			// this.register()
            // this.get()
            console.log('user----',this.user)
		},
		methods: {
            switchType(){
                this.type = !this.type
            },
            comfirm(){
                if(this.type==1){
                    if(!this.login_form.mobile){
                        uni.showToast({ title: "请填写用户名", icon: "none" });
                    }else if(!this.login_form.pwd){
                        uni.showToast({ title: "请填写用户密码", icon: "none" });
                    }else{
                        this.$store.dispatch('login',this.login_form)
                    }   
                }else{
                   this.register()
                }
            },
            register(){
                if(!this.login_form.mobile){
                    uni.showToast({ title: "请填写用户名", icon: "none" });
                }else if(!this.login_form.pwd){
                    uni.showToast({ title: "请填写用户密码", icon: "none" });
                }else if(!this.reinput_pwd){
                    uni.showToast({ title: "请重新确认密码", icon: "none" });
                }else if(this.reinput_pwd != this.login_form.pwd){
                    uni.showToast({ title: "密码前后填写不一致", icon: "none"});
                }else{
                    this.$http.post(users.reg,this.login_form).then(res => {
                        this.$store.commit('update_user_data',res)
                        uni.showToast({ title: "注册成功！", icon: "success",duration:1000});
                        setTimeout(() => {
                            uni.navigateBack()
                        },1000)
                    })
                }
                
            }
		}
	}
</script>

<style>

</style>

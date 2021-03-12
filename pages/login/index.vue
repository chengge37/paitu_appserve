<template>
  <div>
    <div class="head">后台登录</div>
    <view class="content">
      <div class="mobile">
        <input
          style="height:100%;fontSize:14px"
          type="text"
          v-model="login_form.mobile"
          placeholder="输入账号"
        />
      </div>
      <div class="pwd">
        <input
          style="height:100%;fontSize:14px"
          type="text"
          v-model="login_form.pwd"
          placeholder="输入密码"
        />
      </div>
      <div class="login" @click="comfirm">登陆</div>
    </view>
  </div>
</template>
<script>
import { users } from "@/common/api/api";
import { mapState } from "vuex";
export default {
  data() {
    return {
      login_form: {
        mobile: "",
        pwd: ""
      }
    };
  },
  computed: {
    ...mapState(["user"])
  },
  onLoad() {},
  methods: {
    comfirm() {
      if (!this.login_form.mobile) {
        uni.showToast({ title: "请填写用户名", icon: "none" });
      } else if (!this.login_form.pwd) {
        uni.showToast({ title: "请填写用户密码", icon: "none" });
      } else {
        this.$store.dispatch("login", this.login_form).then(
          res => {
			if(this.$store.push_token){
				this.$http.post(users.uploadUserAppPushToken, data).then(res=>{
					console.error('上传成功'+JSON.stringify(res))
					let userData = this.$store.getters.user_data;
					userData.serve_app_push_token = res;
					this.$store.commit('update_user_data',userData)
				}).catch(err=>{
					console.error('上传失败')
				});
			}
            this.$store.commit('update_refresh',true)
			this.$store.dispatch('pimLogin').then(res=>{
				console.error('登录页Sokcet连接上'+JSON.stringify(this.$IM.IM));
			}).catch(err=>{
				console.error('登录页Socket失败'+JSON.stringify(err));
			});
            uni.switchTab({
              url: "/pages/tabBar/home"
            });
          },
          err => {
            
          }
        );
      }
    }
  }
};
</script>
<style lang="scss" scoped>
page {
  background-color: #fff;
}
.head {
  color: rgba(51, 51, 51, 1);
  line-height: 48rpx;
  height: 48rpx;
  font-size: 34rpx;
  text-align: center;
  margin: 110rpx auto 50rpx auto;
}
.content {
  > div {
    height: 100rpx;
    margin: 0 56rpx;
    padding: 0 58rpx;
    border-radius: 25px;
    border: 1px solid rgba(179, 179, 179, 1);
    margin-bottom: 36rpx;
  }
}
.login {
  height: 100rpx;
  background: rgba(120, 66, 235, 1);
  border-radius: 50rpx;
  font-size: 28rpx;
  line-height: 100rpx;
  color: rgba(255, 255, 255, 1);
  text-align: center;
}
</style>
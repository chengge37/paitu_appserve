<template>
  <div>
    <div class="card head" @click="chageImg">
      <div class="title">头像</div>
	  <div class="avatar">
		  <div class="userInfo">
			<image :src="util.picExplode(user_data.avatar,'0')"/>
		  </div>
		  <div class="arrow">
			<span class="iconfont iconarrow-right"></span>
		  </div>
	  </div>
    </div>
    <div class="card list">
      <div class="item">
        <div class="per-item">账号</div>
        <div class="arrow">{{user_data.mobile}}</div>
      </div>
      <div class="line"></div>
      <div class="item">
        <div class="per-item">账号类型</div>
        <div class="arrow">派图{{showType}}</div>
      </div>
      <div class="line"></div>
      <div class="item">
        <div class="per-item">账号类型</div>
        <div class="arrow">{{user_data.is_role == 1?"主账号":"子账号"}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { uploadImg } from "@/common/utils/uploadImg.js";
import { users } from "@/common/api/api.js";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user_data"]),
    showType() {
      switch (Number(this.user_data.role)) {
        case 0:
          return "用户";

          break;
        case 2:
          return "租赁商";
          break;
        case 8:
          return "摄影公司";

          break;
        case 16:
          return "模特经纪人";

          break;
        case 32:
          return "MCN公司";

          break;
        case 128:
          return "模特";

          break;

        default:
          break;
      }
    }
  },
  methods: {
    chageImg() {
      const updatedata = this.user_data;
      uploadImg().then(res => {
		  console.log('chageImg--------',res);
        updatedata.avatar = res;
        this.$http.post(users.UpdateUserData, updatedata).then(res => {
          this.$store.commit("update_user_data", updatedata);
        });
      });
    }
  }
};
</script>
<style lang="scss">
.head {
  display: flex;
  height: 146rpx;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx;
  .avatar{
	  display:flex;
	  align-items: center;
  }
  .userInfo {
	width:88rpx;
	height:88rpx;
	margin-right:10rpx;
	image{
		width:100%;
		height:100%;
		border-radius:50%;
	}
  }
  .arrow {
    flex: 1;
    text-align: right;
  }
}
.list {
  margin-top: 24px;
  .item {
    height: 104rpx;
    display: flex;
    align-items: center;
    padding: 0 48rpx;
    .per-item {
      flex: 1.5;
      text-align-last: left;
    }
    .arrow {
      flex: 3;
      text-align: right;
    }
  }
}
</style>
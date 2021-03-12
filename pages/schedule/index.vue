<template>
  <div>
    <div class="topBar flex">
      <div @click="back">《返回</div>
      <div @click="complete">完成</div>
    </div>
    <div class="title">
      <textarea
        @input="inputTitle"
        :value="form.name"
        placeholder="请输入标题..."
        show-confirm-bar="true"
        placeholder-style="color: rgba(179, 179, 179, 1);"
        style="font-size: 14px;height:120rpx;color:#333"
      ></textarea>
    </div>
    <div class="line"></div>
    <div class="allDay">
      <div>全天</div>
      <div>
        <switch @change="handleSwitch"></switch>
      </div>
    </div>
    <div class="time flex">
      <div>
        <div>开始</div>
        <div>
          <picker mode="time" @change="pickStart" :value="start_time" v-if="!allDay">
            <div>{{start_time}}</div>
          </picker>
          <picker mode="date" fields="day" @change="pickStartDay" :value="selectMonth" v-else>
            <div>{{start_day}}</div>
          </picker>
        </div>
      </div>
      <div>
        <div>结束</div>
        <div>
          <picker mode="time" @change="pickEnd" :value="end_time" v-if="!allDay">
            <div>{{end_time}}</div>
          </picker>
          <picker mode="date" fields="day" @change="pickEndDay" :value="selectMonth" v-else>
            <div>{{end_day}}</div>
          </picker>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="type flex">
      <div>优先级</div>
      <div>
        <picker @change="changeTag" :range="tags" range-key="value">
          <view class="uni-input">{{tags[tagIndex].value}}</view>
        </picker>
      </div>
    </div>
    <div class="type flex">
      <div>状态</div>
      <div>
        <picker @change="changeStatus" :range="status" range-key="value">
          <view class="uni-input">{{status[statusIndex].value}}</view>
        </picker>
      </div>
    </div>
    <div class="line"></div>
    <div class="people flex">
      <div>执行人</div>
      <div @click="show">
        {{employee_id_array_str}}
        <span class="iconfont iconarrow-right"></span>
      </div>
    </div>
    <div class="line"></div>
    <div class="content">
      <textarea
        @input="inputContent"
        :value="form.remark"
        placeholder="输入正文内容..."
        show-confirm-bar="true"
        placeholder-style="color: rgba(179, 179, 179, 1);"
        style="font-size: 14px;color:#333"
      ></textarea>
    </div>
    <tki-tree
      ref="tkitree"
      :range="menberOptions"
      idKey="value"
      rangeKey="label"
      confirmColor="#4e8af7"
      @confirm="confirm"
      v-if="flag"
    />
    <div v-if="false" style="width:300px;height:300px;backgroundColor:red" @touchstart="start" @touchend="end">11</div>
  </div>
</template>
<script>
import { Format } from "../../common/utils/formatDate.js";
import UniTag from "components/tag/uni-tag.vue";
import tkiTree from "components/multiSelector/tki-tree.vue";
import { employee } from "common/api/api";
export default {
  components: {
    UniTag,
    tkiTree
  },
  data() {
    return {
      form: {
        name: "",
        remark: ""
      },
      start_time: "",
      end_time: "",
      start_day: "",
      end_day: "",
      now: new Date(),
      tagIndex: 0,
      statusIndex: 1,
      rangeKey: 1,
      flag: false,
      tags: [
        {
          key: 1,
          value: "一般"
        },
        {
          key: 2,
          value: "重要"
        },
        {
          key: 3,
          value: "紧急"
        }
      ],
      status: [
        {
          key: 1,
          value: "结办"
        },
        // {
        //   key: 2,
        //   value: "重要"
        // },
        {
          key: 3,
          value: "待办"
        }
      ],
      menberOptions: [],
      allDay: false,
      selectMonth: "",
      employee_id_array_str: "",
      startData: {}
    };
  },
  mounted() {
    this.selectMonth = this.$route.query.date;
    this.start_day = this.end_day = this.selectMonth;
    console.log(this.end_day, "丢");
    this.start_time = Format.formatDateHourMinute(this.now.getTime());
    this.end_time = Format.formatDateHourMinute(
      this.now.getTime() + 60 * 60 * 1000
    );
    this.getMember();
    this.form.type=1;
    this.form.status=1;
  },
  methods: {
    //判断滑动
    start(e) {
      this.startData.clientX = e.changedTouches[0].clientX;
      this.startData.clientY = e.changedTouches[0].clientY;
    },
    end(e) {
      // console.log(e)
      const subX = e.changedTouches[0].clientX - this.startData.clientX;
      const subY = e.changedTouches[0].clientY - this.startData.clientY;
      if (subY > 50 || subY < -50) {
        console.log("上下滑");
      } else {
        if (subX > 100) {
          console.log("右滑");
        } else if (subX < -100) {
          console.log("左滑");
        } else {
          console.log("无效");
        }
      }
    },
    complete() {
      if (this.allDay) {
        this.form.start_time = this.start_day + " 00:00:00";
        this.form.end_time = this.end_day + " 23:59:59";
      } else {
        this.form.start_time = this.selectMonth + " " + this.start_time + ":00";
        this.form.end_time = this.selectMonth + " " + this.end_time + ":00";
      }
      this.form.employee_id_array_str = this.employee_id_array_str;
      this.$http.post("/job/serveAdd", this.form).then(res => {
        console.log(res);
      });
    },
    inputContent(e) {
      this.form.remark = e.detail.value;
    },
    confirm(e) {
      console.log(e, "confirm");
      let list=[]
      this.employee_id_array_str = "";
      e.forEach(item => {
        list.push(item["value"])
      });
      this.employee_id_array_str = list.join(',')
    },
    show() {
      this.flag = true;
      this.$nextTick(() => {
        this.$refs["tkitree"]._show();
      });
    },
    //获取员工列表
    //异步函数
    async getMember() {
      this.menberOptions = [];
      let groups = await this.$http.get(employee.getGroup);
      console.log(groups, "groups");
      let promiseArr = [];
      for (let i = 0; i < groups.length; i++) {
        let obj = {
          value: groups[i].group_id,
          label: groups[i].group_name,
          children: []
        };
        this.menberOptions.push(obj);
        promiseArr.push(
          this.$http.get(employee.getAll, {
            page: 1,
            page_size: 9999,
            group_id: groups[i].group_id
          })
        );
      }
      Promise.all(promiseArr).then(res => {
        for (let j = 0; j < res.length; j++) {
          res[j].rows.forEach(item => {
            let obj = {
              value: item.id,
              label: item.nick,
              mobile: item.mobile
            };
            this.menberOptions[j].children.push(obj);
          });
        }
        console.log("ifcdhs", this.menberOptions);
        this.menberOptions.forEach((item, index, arr) => {
          if (!item.children) {
            arr.splice(index, 1);
          } else {
            if (item.children.length == 0) {
              arr.splice(index, 1);
            }
          }
        });
        // this.fillSelf();
      });
    },
    //填充管理员
    fillSelf() {
      //之后填充管理员进去
      console.log("之后填充管理员进去", this.menberOptions[7]);
      this.menberOptions.forEach((item, index) => {
        if (item.children[0]) {
          // console.log(item.children[0],typeof item.children);
          console.log(item);
          if (item.children[0].mobile == this.user_data.mobile) {
            console.log(2);
            this.checkArr.push([item.value, item.children[0].value]);
            console.log(this.checkArr, "[]kkkk");
            this.confirmSelect(1);
          }
        }
      });
      console.log("哈哈哈");
    },
    changeTag(e) {
      console.log(e);
      this.tagIndex = e.detail.value;
      this.form.type = e.detail.value + 1;
    },
    changeStatus(e){
      console.log(e);
      switch(e.detail.value){
        case 0:
          this.statusIndex = e.detail.value;
          this.form.status = 1;
          break;
        case 1:
          this.statusIndex = e.detail.value;
          this.form.status = 3;
          break;
      }
    },
    formatDateHourMinute(secs) {
      return formatDateHourMinute(secs);
    },
    inputTitle(e) {
      this.form.name = e.detail.value;
    },
    handleSwitch(e) {
      console.log(e.detail.value);
      this.allDay = e.detail.value;
    },
    pickStart(e) {
      console.log(1);
      console.log(e);
      this.start_time = e.detail.value;
    },
    pickEnd(e) {
      console.log(e);
      this.end_time = e.detail.value;
    },
    pickStartDay(e) {
      this.start_day = e.detail.value;
    },
    pickEndDay(e) {
      this.end_day = e.detail.value;
    },
    back() {
      uni.navigateBack({
        delta: 1
      });
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
page {
  background-color: #fff;
  padding: 0 24rpx;
  font-size: 28rpx;
}
.topBar {
  margin-top: 88rpx;
  display: flex;
  align-items: center;
  div {
    &:nth-child(1) {
      height: 40rpx;
      color: #333;
      line-height: 40rpx;
    }
    &:nth-child(2) {
      height: 48rpx;
      line-height: 48rpx;
      color: rgba(179, 179, 179, 1);
      font-size: 34rpx;
    }
  }
}
.title {
  margin-top: 18rpx;
  color: rgba(179, 179, 179, 1);
}
.allDay {
  display: flex;
  align-items: center;
  height: 84rpx;
  div {
    flex: 1;
    color: #333;
    &:nth-child(1) {
      text-align: left;
    }
    &:nth-child(2) {
      text-align: right;
    }
  }
}
.time {
  height: 120rpx;
  > div {
    div {
      &:nth-child(1) {
        font-size: 22rpx;
        color: rgba(153, 153, 153, 1);
      }
      &:nth-child(2) {
        font-size: 28rpx;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
.type {
  height: 84rpx;
}
.people {
  height: 84rpx;
}
.content {
  margin-top: 24rpx;
}
</style>
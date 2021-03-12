<template>
  <view class="wrap">
    <view class="tree" v-for="(item,index) in categorys" :key="index">
      <view class="first-category">
        <text class="iconfont iconjiantou" :class="{'arrow-rotate':item.checked}" @click="toggleGroup(item)"></text>
        <text class="iconfont iconjiantou"></text>
        <text>{{item.name}}</text>
      </view>
      <view class="second-group" :class="{'toggle-group':item.checked}">
        <view class="second-row-wrap" v-for="(each,j) in item.children" :key="j">
          <view class="null-dom"></view>
          <view class="row-content">
            <text class="iconfont iconjiantou"></text>
            <text :class="{active:each.checked}" @click="selectSecond(item,each)">{{each.name}}</text>
            <view class="item-right" v-if="each.checked">
              <text class="iconfont iconjiahao1" @click="handleNum('-',index,j)"></text>
              <text>{{each.num}}</text>
              <text class="iconfont iconjiahao1" @click="handleNum('+',index,j)"></text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        categorys:[
          {
            name:'Equipment A',
            checked:false,
            children:[
              {
                name:'A1',
                num:0,
                checked:false
              },
              {
                name:'A2',
                num:0,
                checked:false
              },
              {
                name:'A3',
                num:0,
                checked:false
              },
              {
                name:'A4',
                num:0,
                checked:false
              },
            ]
          },
          {
            name:'Equipment B',
            checked:false,
            children:[
              {
                name:'B1',
                num:0,
                checked:false
              },
              {
                name:'B2',
                num:0,
                checked:false
              },
              {
                name:'B3',
                num:0,
                checked:false
              },
              {
                name:'B4',
                num:0,
                checked:false
              },
            ]
          },
        ]
      }
    },
    methods:{
      selectSecond(item,each){
        item.children.forEach(every=>{
          every.checked=false
        })
        each.checked=true
      },
      toggleGroup(item){
        item.checked=!item.checked
      },
      handleNum(op,i,j){
        if(op==='-'){
          if(this.categorys[i].children[j].num==0){
            return
          }
          this.categorys[i].children[j].num--
        }else{
          this.categorys[i].children[j].num++
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
.wrap{
    .tree{
    padding: 0 26rpx;
    .first-category{
      display: flex;
      align-items: center;
      text:first-child{
        margin-right: 12rpx;
        transform: rotate(90deg);
      }
      text:nth-child(2){
        margin-right: 10rpx;
      }
      .arrow-rotate{
        transform: rotate(-90deg)!important;
      }
    }
    .second-group{
      display: none;
      margin-left: 58rpx;
      // background: pink;
      border-left: 2px dashed #D6CCEB;
      .second-row-wrap{
        height: 70rpx;
        display: flex;
        align-items: center;
        .null-dom{
          width: 114rpx;
          height: 100%;
          border-bottom: 2px dashed #D6CCEB;
        }
        .row-content{
          flex:1;
          height: 100%;
          display: flex;
          align-items: center;
          padding-left: 8rpx;
          transform: translateY(50%);
          & > text:first-child{
            margin-right: 10rpx;
          }
          .active{
            color: #7842EB;
          }
          .item-right{
            margin-left: auto;
            display: flex;
            text{
              color: #7842EB;
            }
            text:nth-child(2){
              margin: 0 16rpx;
            }
          }
        }
      }
    }
    .toggle-group{
      display: block;
    }
  }
  .tree+.tree{
    margin-top: 50rpx;
  }
}
</style>
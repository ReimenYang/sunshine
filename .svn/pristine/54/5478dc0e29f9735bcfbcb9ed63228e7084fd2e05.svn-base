<template>
  <view class="wrap">
    <view class="item">
      <view class="itemTitle">
        方案名称
      </view>
      <view class="name">
        {{ schemeDetail.name }}
      </view>
      <view class="itemBorder" />
      <view class="itemTitle">
        训练程序
      </view>
      <view class="name">
        {{ workoutDetail.name }}
      </view>
    </view>
    <view class="item">
      <view class="itemTitle">
        设备序列号
      </view>
      <view class="name">
        {{ userInfo.sn }}
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    userInfo: {
      type: Object,
      default () { return {} }
    },
    schemeDetail: {
      type: Object,
      default () { return {} }
    },
    workoutDetail: {
      type: Object,
      default () { return {} }
    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  padding: 0 20rpx;
  .item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: var(--border-radius);
    background: #fff;
    font-size: var(--font-h35);
    line-height: 3;
    .itemTitle {
      font-size: var(--font-h4);
      line-height: 1.5;
      color: var(--theme-color);
    }
    .itemBorder {
      margin: 20rpx 0;
      border-bottom: var(--border-normal);
    }
  }
}
</style>

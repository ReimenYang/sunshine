<template>
  <view class="head">
    <xnw-header
      @onBack="onBack"
      :title="title"
      :backIcon="backIcon"
    />
  </view>
</template>
<script>
// import XnwHeader from '@/libs/components/uniapp/box/header/header'
export default {
  props: {
    backIcon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  // components: { XnwHeader },
  methods: {
    onBack () {
      uni.navigateBack()
    }
  }
}
</script>
<style lang="scss" scoped>
.head /deep/ .header {
  width: 100%;
  height: 150rpx;
  padding-top: calc(30rpx + var(--status-bar-height));
  flex: 1;
  .backIcon {
    width: 80rpx;
    line-height: 80rpx;
    margin-right: -80rpx;
    position: relative;
    font-size: var(--font-h3);
    color: #fff;
  }
  .title {
    text-align: center;
    color: #fff;
  }
}
</style>

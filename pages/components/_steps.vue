<template>
  <view class="steps">
    <uni-steps
      :options="steps"
      activeColor="#fff"
      :active="active"
      class="steps"
    />
  </view>
</template>
<script>
export default {
  props: {
    active: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      steps: [{ title: '贴电极片' }, { title: '训练时长' }, { title: '测试电流' }]
    }
  }
}
</script>
<style lang="scss" scoped>
.steps {
  /deep/ {
    .uni-steps {
      margin-bottom: 60rpx;
      .uni-steps__row-title {
        padding: 30rpx 0;
        font-size: var(--font-h4);
      }
      .uni-icons {
        font-size: var(--font-h3) !important;
      }
    }
  }
}
</style>
